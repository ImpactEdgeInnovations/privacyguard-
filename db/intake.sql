-- Local PostgreSQL schema. Runtime queries run as a constrained NOLOGIN role.
create schema if not exists pg_intake;
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'privacyguard_runtime') then
    create role privacyguard_runtime nologin nobypassrls;
  end if;
end $$;

create table if not exists pg_intake.sessions (
  token_hash text primary key,
  actor_id text not null,
  expires_at timestamptz not null
);

create table if not exists pg_intake.cases (
  id uuid primary key,
  owner_id text not null,
  revision integer not null default 1 check (revision > 0),
  channel text not null check (channel in ('sms', 'call', 'email', 'other')),
  sender text not null check (char_length(sender) <= 120),
  received_on date,
  goal text not null check (goal in ('stop', 'understand', 'unsure')),
  description text not null check (char_length(description) between 10 and 2000),
  state text not null default 'draft' check (state in ('draft', 'received', 'in_review', 'needs_detail', 'reviewed')),
  receipt_at timestamptz,
  submitted_revision integer,
  detail_prompt text check (char_length(detail_prompt) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((state = 'draft') = (receipt_at is null)),
  check ((receipt_at is null) = (submitted_revision is null)),
  check ((state = 'needs_detail') = (detail_prompt is not null))
);

alter table pg_intake.cases add column if not exists followups jsonb not null default '[]'::jsonb;

-- Unassigned staff see this routing record without access to case contents.
create table if not exists pg_intake.tasks (
  case_id uuid primary key references pg_intake.cases(id),
  assignee_id text,
  state text not null default 'unassigned' check (state in ('unassigned', 'assigned', 'done')),
  created_at timestamptz not null default now(),
  check ((assignee_id is null) = (state = 'unassigned'))
);

create table if not exists pg_intake.events (
  id bigint generated always as identity primary key,
  case_id uuid not null references pg_intake.cases(id),
  actor_id text not null,
  kind text not null check (kind in ('saved', 'submitted', 'claimed', 'asked_detail', 'detail_added', 'reviewed')),
  happened_at timestamptz not null default now()
);

alter table pg_intake.tasks add column if not exists returned_at timestamptz;
alter table pg_intake.events add column if not exists return_reason text;
alter table pg_intake.events drop constraint if exists events_kind_check;
alter table pg_intake.events add constraint events_kind_check
  check (kind in ('saved', 'submitted', 'claimed', 'asked_detail', 'detail_added', 'reviewed', 'returned'));
alter table pg_intake.events drop constraint if exists events_return_reason_check;
alter table pg_intake.events add constraint events_return_reason_check
  check ((kind = 'returned') = (return_reason is not null)
    and (return_reason is null or return_reason in ('availability', 'capacity', 'expertise', 'other')));

create index if not exists cases_owner_updated on pg_intake.cases (owner_id, updated_at desc);
create index if not exists tasks_state_created on pg_intake.tasks (state, created_at);
create index if not exists tasks_assignee_state on pg_intake.tasks (assignee_id, state, created_at);
create index if not exists events_case_order on pg_intake.events (case_id, id);
create index if not exists sessions_expiry on pg_intake.sessions (expires_at);

alter table pg_intake.sessions enable row level security;
alter table pg_intake.cases enable row level security;
alter table pg_intake.tasks enable row level security;
alter table pg_intake.events enable row level security;

revoke all on schema pg_intake from public;
revoke all on all tables in schema pg_intake from public;
grant usage on schema pg_intake to privacyguard_runtime;
grant select, insert, update on pg_intake.cases, pg_intake.tasks to privacyguard_runtime;
grant select, insert on pg_intake.events to privacyguard_runtime;

drop policy if exists task_routing on pg_intake.tasks;
create policy task_routing on pg_intake.tasks for select to privacyguard_runtime
  using (current_setting('privacyguard.actor_role', true) = 'staff'
    and (assignee_id is null or assignee_id = current_setting('privacyguard.actor_id', true)));

drop policy if exists case_read on pg_intake.cases;
create policy case_read on pg_intake.cases for select to privacyguard_runtime
  using (owner_id = current_setting('privacyguard.actor_id', true)
    or (current_setting('privacyguard.actor_role', true) = 'staff' and exists (
      select 1 from pg_intake.tasks t
      where t.case_id = cases.id and t.assignee_id = current_setting('privacyguard.actor_id', true)
    )));

drop policy if exists case_create on pg_intake.cases;
create policy case_create on pg_intake.cases for insert to privacyguard_runtime
  with check (current_setting('privacyguard.actor_role', true) = 'consumer'
    and owner_id = current_setting('privacyguard.actor_id', true) and state = 'draft');

drop policy if exists case_consumer_write on pg_intake.cases;
create policy case_consumer_write on pg_intake.cases for update to privacyguard_runtime
  using (current_setting('privacyguard.actor_role', true) = 'consumer'
    and owner_id = current_setting('privacyguard.actor_id', true) and state in ('draft', 'needs_detail'))
  with check (owner_id = current_setting('privacyguard.actor_id', true)
    and state in ('draft', 'received', 'in_review'));

drop policy if exists case_staff_write on pg_intake.cases;
create policy case_staff_write on pg_intake.cases for update to privacyguard_runtime
  using (current_setting('privacyguard.actor_role', true) = 'staff'
    and exists (select 1 from pg_intake.tasks t where t.case_id = cases.id
      and t.assignee_id = current_setting('privacyguard.actor_id', true)))
  with check (exists (select 1 from pg_intake.tasks t where t.case_id = cases.id
    and t.assignee_id = current_setting('privacyguard.actor_id', true)));

drop policy if exists task_submit on pg_intake.tasks;
create policy task_submit on pg_intake.tasks for insert to privacyguard_runtime
  with check (current_setting('privacyguard.actor_role', true) = 'consumer'
    and state = 'unassigned' and assignee_id is null
    and exists (select 1 from pg_intake.cases c where c.id = case_id
      and c.owner_id = current_setting('privacyguard.actor_id', true) and c.state = 'received'));

drop policy if exists task_staff_write on pg_intake.tasks;
create policy task_staff_write on pg_intake.tasks for update to privacyguard_runtime
  using (current_setting('privacyguard.actor_role', true) = 'staff'
    and (assignee_id is null or assignee_id = current_setting('privacyguard.actor_id', true)))
  with check (assignee_id = current_setting('privacyguard.actor_id', true)
    or (assignee_id is null and state = 'unassigned' and returned_at is not null));

drop policy if exists event_read on pg_intake.events;
create policy event_read on pg_intake.events for select to privacyguard_runtime
  using (exists (select 1 from pg_intake.cases c where c.id = case_id));

drop policy if exists event_append on pg_intake.events;
create policy event_append on pg_intake.events for insert to privacyguard_runtime
  with check (actor_id = current_setting('privacyguard.actor_id', true)
    and exists (select 1 from pg_intake.cases c where c.id = case_id));

-- Privacy reviewers see request routing metadata. The case policy stays separate.
create table if not exists pg_intake.privacy_requests (
  id uuid primary key,
  case_id uuid not null references pg_intake.cases(id),
  owner_id text not null,
  kind text not null check (kind in ('copy', 'deletion')),
  requested_at timestamptz not null default now(),
  assignee_id text,
  claimed_at timestamptz,
  unique (case_id, kind),
  check ((assignee_id is null) = (claimed_at is null))
);

create index if not exists privacy_requests_owner on pg_intake.privacy_requests (owner_id, requested_at desc);
create index if not exists privacy_requests_assignee on pg_intake.privacy_requests (assignee_id, requested_at desc);
alter table pg_intake.privacy_requests enable row level security;
revoke all on pg_intake.privacy_requests from public;
revoke all on pg_intake.privacy_requests from privacyguard_runtime;
grant select (id, case_id, kind, requested_at, claimed_at, assignee_id) on pg_intake.privacy_requests to privacyguard_runtime;
grant insert (id, case_id, owner_id, kind) on pg_intake.privacy_requests to privacyguard_runtime;
grant update (assignee_id, claimed_at) on pg_intake.privacy_requests to privacyguard_runtime;

drop policy if exists privacy_read on pg_intake.privacy_requests;
create policy privacy_read on pg_intake.privacy_requests for select to privacyguard_runtime
  using ((current_setting('privacyguard.actor_role', true) = 'consumer'
    and owner_id = current_setting('privacyguard.actor_id', true))
    or (current_setting('privacyguard.actor_role', true) = 'privacy'
      and (assignee_id is null or assignee_id = current_setting('privacyguard.actor_id', true))));

drop policy if exists privacy_create on pg_intake.privacy_requests;
create policy privacy_create on pg_intake.privacy_requests for insert to privacyguard_runtime
  with check (current_setting('privacyguard.actor_role', true) = 'consumer'
    and owner_id = current_setting('privacyguard.actor_id', true) and assignee_id is null
    and exists (select 1 from pg_intake.cases c where c.id = case_id and c.owner_id = privacy_requests.owner_id));

drop policy if exists privacy_claim on pg_intake.privacy_requests;
create policy privacy_claim on pg_intake.privacy_requests for update to privacyguard_runtime
  using (current_setting('privacyguard.actor_role', true) = 'privacy' and assignee_id is null)
  with check (current_setting('privacyguard.actor_role', true) = 'privacy'
    and assignee_id = current_setting('privacyguard.actor_id', true) and claimed_at is not null);

-- Keep request receipts and decisions after removing the associated sandbox case.
alter table pg_intake.privacy_requests drop constraint if exists privacy_requests_case_id_fkey;

create table if not exists pg_intake.privacy_decisions (
  id bigint generated always as identity primary key,
  request_id uuid not null references pg_intake.privacy_requests(id),
  decided_by text not null,
  outcome text not null check (outcome in ('copy_ready', 'copy_unavailable', 'held', 'reviewing', 'removed')),
  note text check (char_length(note) <= 240),
  review_on date,
  decided_at timestamptz not null default now(),
  check ((outcome = 'held') = (note is not null and review_on is not null))
);
create index if not exists privacy_decisions_request on pg_intake.privacy_decisions (request_id, id desc);
alter table pg_intake.privacy_decisions enable row level security;
revoke all on pg_intake.privacy_decisions from public;
grant select (id, request_id, outcome, note, review_on, decided_at) on pg_intake.privacy_decisions to privacyguard_runtime;

drop policy if exists privacy_decision_read on pg_intake.privacy_decisions;
create policy privacy_decision_read on pg_intake.privacy_decisions for select to privacyguard_runtime
  using (exists (select 1 from pg_intake.privacy_requests r where r.id = request_id));

create table if not exists pg_intake.erased_cases (
  case_id uuid primary key,
  deletion_request_id uuid not null unique references pg_intake.privacy_requests(id),
  erased_at timestamptz not null default now()
);
alter table pg_intake.erased_cases enable row level security;
revoke all on pg_intake.erased_cases from public;
grant select (case_id) on pg_intake.erased_cases to privacyguard_runtime;
drop policy if exists erased_case_guard on pg_intake.erased_cases;
create policy erased_case_guard on pg_intake.erased_cases for select to privacyguard_runtime using (true);

drop policy if exists case_create on pg_intake.cases;
create policy case_create on pg_intake.cases for insert to privacyguard_runtime
  with check (current_setting('privacyguard.actor_role', true) = 'consumer'
    and owner_id = current_setting('privacyguard.actor_id', true) and state = 'draft'
    and not exists (select 1 from pg_intake.erased_cases e where e.case_id = cases.id));
