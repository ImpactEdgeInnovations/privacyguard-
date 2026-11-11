import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { PGlite, type Transaction } from '@electric-sql/pglite';

export const personas = {
  a: { id: 'consumer-a', role: 'consumer', name: 'Consumer A' },
  b: { id: 'consumer-b', role: 'consumer', name: 'Consumer B' },
  reviewer: { id: 'reviewer-a', role: 'staff', name: 'Reviewer A' },
  backup: { id: 'reviewer-b', role: 'staff', name: 'Reviewer B' },
  privacy: { id: 'privacy-a', role: 'privacy', name: 'Privacy Reviewer' },
} as const;

export type Actor = (typeof personas)[keyof typeof personas];

export const channels = { sms: 'Text message', call: 'Phone call', email: 'Email', other: 'Other' } as const;
export const goals = { stop: 'Stop the marketing', understand: 'Understand how my details were obtained', unsure: 'I’m still deciding' } as const;
export const returnReasons = {
  availability: 'Availability changed', capacity: 'Capacity or workload',
  expertise: 'Needs another reviewer’s expertise', other: 'Other operational reason',
} as const;
export type ReturnReason = keyof typeof returnReasons;

type Draft = {
  channel: keyof typeof channels;
  sender: string;
  received_on: string | null;
  goal: keyof typeof goals;
  description: string;
};

export type Case = Draft & {
  id: string;
  revision: number;
  state: 'draft' | 'received' | 'in_review' | 'needs_detail' | 'reviewed';
  receipt_at: Date | null;
  submitted_revision: number | null;
  detail_prompt: string | null;
  followups: { question: string; reply: string }[];
  updated_at: Date;
};

export type QueueTask = {
  case_id: string;
  state: 'unassigned' | 'assigned' | 'done';
  case_state: Case['state'] | null;
  created_at: Date;
  returned_at: Date | null;
};

export type CaseEvent = {
  kind: 'saved' | 'submitted' | 'claimed' | 'asked_detail' | 'detail_added' | 'reviewed' | 'returned';
  happened_at: Date;
  return_reason: ReturnReason | null;
};

export const privacyKinds = { copy: 'Copy of records', deletion: 'Deletion request' } as const;
export type PrivacyKind = keyof typeof privacyKinds;
export type PrivacyAction = 'release_copy' | 'hold' | 'release_hold' | 'remove';
type PrivacyOutcome = 'copy_ready' | 'copy_unavailable' | 'held' | 'reviewing' | 'removed';
export type PrivacyRequest = {
  id: string;
  case_id: string;
  kind: PrivacyKind;
  requested_at: Date;
  claimed_at: Date | null;
  outcome: PrivacyOutcome | null;
  note: string | null;
  review_on: string | null;
  available_until: Date | null;
  can_download: boolean;
};

const caseFields = 'id, revision, channel, sender, received_on::text as received_on, goal, description, state, receipt_at, submitted_revision, detail_prompt, followups, updated_at';

export class WorkflowError extends Error {}

export function readDraft(form: FormData): Draft {
  const channel = String(form.get('channel') ?? '');
  const goal = String(form.get('goal') ?? '');
  const sender = String(form.get('sender') ?? '').trim();
  const description = String(form.get('description') ?? '').trim();
  const received = String(form.get('received_on') ?? '');
  if (!Object.hasOwn(channels, channel) || !Object.hasOwn(goals, goal)) {
    throw new WorkflowError('Choose the channel and your goal.');
  }
  if (sender.length > 120 || description.length < 10 || description.length > 2000) {
    throw new WorkflowError('Enter 10–2,000 characters for the description and up to 120 for the sender.');
  }
  if (received) {
    const date = new Date(received + 'T00:00:00.000Z');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(received) || !Number.isFinite(date.getTime())
        || date.toISOString().slice(0, 10) !== received) {
      throw new WorkflowError('Enter a valid date or leave it blank.');
    }
  }
  return { channel: channel as Draft['channel'], goal: goal as Draft['goal'], sender, description, received_on: received || null };
}

export function readId(value: unknown) {
  if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    throw new WorkflowError('That report is unavailable.');
  }
  return value;
}

export function readRevision(value: unknown) {
  const revision = Number(value);
  if (!Number.isSafeInteger(revision) || revision < 1 || revision > 2_147_483_647) {
    throw new WorkflowError('Refresh the report and try again.');
  }
  return revision;
}

const hash = (token: string) => createHash('sha256').update(token).digest('hex');

export async function openStore(path: string) {
  const database = new PGlite(path);
  try {
    const schema = await readFile(resolve('db/intake.sql'), 'utf8');
    await database.transaction(tx => tx.exec(schema));
    return new IntakeStore(database);
  } catch (error) {
    await database.close();
    throw error;
  }
}

export class IntakeStore {
  private database: PGlite;

  constructor(database: PGlite) {
    this.database = database;
  }

  close() { return this.database.close(); }

  async issueSession(actor: Actor) {
    const token = randomBytes(32).toString('base64url');
    await this.database.transaction(async tx => {
      await tx.query('delete from pg_intake.sessions where expires_at <= now()');
      await tx.query(
        "insert into pg_intake.sessions values ($1, $2, now() + interval '8 hours')",
        [hash(token), actor.id],
      );
    });
    return token;
  }

  async session(token: string | undefined) {
    if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) return undefined;
    const result = await this.database.query<{ actor_id: string }>(
      'select actor_id from pg_intake.sessions where token_hash = $1 and expires_at > now()', [hash(token)],
    );
    return Object.values(personas).find(actor => actor.id === result.rows[0]?.actor_id);
  }

  async revokeSession(token: string | undefined) {
    if (token) await this.database.query('delete from pg_intake.sessions where token_hash = $1', [hash(token)]);
  }

  private scoped<T>(actor: Actor, run: (tx: Transaction) => Promise<T>) {
    return this.database.transaction(async tx => {
      await tx.exec('set local role privacyguard_runtime');
      await tx.query("select set_config('privacyguard.actor_id', $1, true), set_config('privacyguard.actor_role', $2, true)", [actor.id, actor.role]);
      return run(tx);
    });
  }

  private async event(tx: Transaction, actor: Actor, id: string, kind: CaseEvent['kind']) {
    await tx.query('insert into pg_intake.events (case_id, actor_id, kind) values ($1, $2, $3)', [id, actor.id, kind]);
  }

  private requireRole(actor: Actor, role: Actor['role']) {
    if (actor.role !== role) throw new WorkflowError('This action is unavailable in your workspace.');
  }

  listCases(actor: Actor) {
    this.requireRole(actor, 'consumer');
    return this.scoped(actor, async tx => (await tx.query<Case>(
      `select ${caseFields} from pg_intake.cases where owner_id = $1 order by updated_at desc, id`, [actor.id],
    )).rows);
  }

  privacyRequests(actor: Actor) {
    if (actor.role === 'staff') throw new WorkflowError('Privacy requests require a separate role.');
    return this.scoped(actor, async tx => (await tx.query<PrivacyRequest>(
      `select r.id, r.case_id, r.kind, r.requested_at, r.claimed_at,
         d.outcome, d.note, d.review_on::text,
         case when d.outcome = 'copy_ready' then d.decided_at + interval '24 hours' end as available_until,
         coalesce(d.outcome = 'copy_ready' and d.decided_at + interval '24 hours' > now(), false) as can_download
       from pg_intake.privacy_requests r
       left join lateral (
         select outcome, note, review_on, decided_at from pg_intake.privacy_decisions
         where request_id = r.id order by id desc limit 1
       ) d on true order by r.requested_at desc, r.id`,
    )).rows);
  }

  requestPrivacy(actor: Actor, caseId: string, kind: PrivacyKind) {
    this.requireRole(actor, 'consumer');
    if (!Object.hasOwn(privacyKinds, kind)) throw new WorkflowError('Choose an available request.');
    return this.scoped(actor, async tx => {
      const { rows } = await tx.query<{ id: string }>(
        `insert into pg_intake.privacy_requests (id, case_id, owner_id, kind)
         select $1, c.id, c.owner_id, $2 from pg_intake.cases c
         where c.id = $3 and c.owner_id = $4
         on conflict (case_id, kind) do nothing returning id`,
        [randomUUID(), kind, caseId, actor.id],
      );
      if (rows[0]) return rows[0].id;
      const existing = await tx.query<{ id: string }>(
        'select id from pg_intake.privacy_requests where case_id = $1 and kind = $2', [caseId, kind],
      );
      if (!existing.rows[0]) throw new WorkflowError('That report is unavailable.');
      return existing.rows[0].id;
    });
  }

  claimPrivacy(actor: Actor, requestId: string) {
    this.requireRole(actor, 'privacy');
    return this.scoped(actor, async tx => {
      const { rows } = await tx.query(
        `update pg_intake.privacy_requests set assignee_id = $2, claimed_at = now()
         where id = $1 and assignee_id is null returning id`, [requestId, actor.id],
      );
      if (!rows.length) throw new WorkflowError('That request is already assigned or unavailable.');
    });
  }

  decidePrivacy(actor: Actor, requestId: string, action: PrivacyAction, note = '', reviewOn = '') {
    this.requireRole(actor, 'privacy');
    if (action === 'hold') {
      const date = new Date(reviewOn + 'T00:00:00Z');
      if (note.length < 10 || note.length > 240 || !/^[1-9]\d{3}-\d{2}-\d{2}$/.test(reviewOn)
        || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== reviewOn) {
        throw new WorkflowError('Provide a reason of 10–240 characters and a valid review date.');
      }
    }
    // Trusted sandbox transaction for decisions spanning the request and case.
    // The privacy reviewer does not gain read access to the report body.
    return this.database.transaction(async tx => {
      const assigned = await tx.query<{ case_id: string; owner_id: string; kind: PrivacyKind }>(
        'select case_id, owner_id, kind from pg_intake.privacy_requests where id = $1 and assignee_id = $2',
        [requestId, actor.id],
      );
      const request = assigned.rows[0];
      if (!request) throw new WorkflowError('Take the request before recording a decision.');
      const locked = await tx.query(
        'select id from pg_intake.cases where id = $1 and owner_id = $2 for update', [request.case_id, request.owner_id],
      );
      if (!locked.rows.length) throw new WorkflowError('This case is no longer available.');
      const latest = await tx.query<{ outcome: PrivacyOutcome; expired: boolean }>(
        `select outcome, decided_at + interval '24 hours' <= now() as expired
         from pg_intake.privacy_decisions where request_id = $1 order by id desc limit 1`, [requestId],
      );
      const current = latest.rows[0];
      const record = (outcome: PrivacyOutcome, reason: string | null = null, date: string | null = null) => tx.query(
        'insert into pg_intake.privacy_decisions (request_id, decided_by, outcome, note, review_on) values ($1, $2, $3, $4, $5)',
        [requestId, actor.id, outcome, reason, date],
      );

      if (request.kind === 'copy' && action === 'release_copy') {
        if (!current || (current.outcome === 'copy_ready' && current.expired)) await record('copy_ready');
        return;
      }
      if (request.kind !== 'deletion') throw new WorkflowError('Choose a decision for this request type.');
      if (action === 'release_hold' && current?.outcome === 'held') {
        await record('reviewing');
        return;
      }
      if (current && current.outcome !== 'reviewing') throw new WorkflowError('Resolve the hold before making another decision.');
      if (action === 'hold') {
        const today = await tx.query<{ valid: boolean }>(
          "select $1::date >= (now() at time zone 'Africa/Nairobi')::date as valid", [reviewOn],
        );
        if (!today.rows[0]?.valid) throw new WorkflowError('Choose a review date on or after today.');
        await record('held', note, reviewOn);
        return;
      }
      if (action !== 'remove') throw new WorkflowError('Choose a decision for this request type.');
      await tx.query(
        'insert into pg_intake.erased_cases (case_id, deletion_request_id) values ($1, $2)', [request.case_id, requestId],
      );
      await tx.query(
        `insert into pg_intake.privacy_decisions (request_id, decided_by, outcome)
         select id, $2, 'copy_unavailable' from pg_intake.privacy_requests where case_id = $1 and kind = 'copy'`,
        [request.case_id, actor.id],
      );
      await tx.query('delete from pg_intake.events where case_id = $1', [request.case_id]);
      await tx.query('delete from pg_intake.tasks where case_id = $1', [request.case_id]);
      await tx.query('delete from pg_intake.cases where id = $1 and owner_id = $2', [request.case_id, request.owner_id]);
      await record('removed');
    });
  }

  caseCopy(actor: Actor, requestId: string) {
    this.requireRole(actor, 'consumer');
    return this.scoped(actor, async tx => {
      // Resolve permission, expiry and current case contents in one snapshot.
      const { rows } = await tx.query<{ id: string; data: unknown }>(
        `select c.id, jsonb_build_object(
          'caseId', c.id, 'channel', c.channel, 'reportedSender', c.sender, 'receivedOn', c.received_on,
          'goal', c.goal, 'description', c.description, 'status', c.state, 'submittedAt', c.receipt_at,
          'currentQuestion', c.detail_prompt, 'followups', c.followups,
          'activity', coalesce((select jsonb_agg(jsonb_build_object('kind', e.kind, 'at', e.happened_at, 'returnReason', e.return_reason) order by e.id)
             from pg_intake.events e where e.case_id = c.id), '[]'::jsonb)
        ) as data
        from pg_intake.privacy_requests r
        join pg_intake.cases c on c.id = r.case_id and c.owner_id = $2
        join lateral (
          select outcome, decided_at from pg_intake.privacy_decisions where request_id = r.id order by id desc limit 1
        ) d on true
        where r.id = $1 and r.kind = 'copy' and d.outcome = 'copy_ready'
          and d.decided_at + interval '24 hours' > now()`,
        [requestId, actor.id],
      );
      return rows[0] ?? null;
    });
  }

  getCase(actor: Actor, id: string) {
    return this.scoped(actor, async tx => {
      const { rows } = await tx.query<Case>(`select ${caseFields} from pg_intake.cases where id = $1`, [id]);
      if (!rows[0]) return null;
      const timeline = await tx.query<CaseEvent>(
        'select kind, happened_at, return_reason from pg_intake.events where case_id = $1 order by id', [id],
      );
      return { report: rows[0], timeline: timeline.rows };
    });
  }

  saveDraft(actor: Actor, id: string, revision: number | null, draft: Draft) {
    this.requireRole(actor, 'consumer');
    const fields = [draft.channel, draft.sender, draft.received_on, draft.goal, draft.description];
    return this.scoped(actor, async tx => {
      if (revision === null) {
        const erased = await tx.query('select case_id from pg_intake.erased_cases where case_id = $1', [id]);
        if (erased.rows.length) throw new WorkflowError('That report is unavailable.');
        // The generated report ID identifies retries of the initial save.
        const { rows } = await tx.query<{ id: string }>(
          `insert into pg_intake.cases (id, owner_id, channel, sender, received_on, goal, description)
           values ($1, $2, $3, $4, $5, $6, $7) on conflict (id) do nothing returning id`,
          [id, actor.id, ...fields],
        );
        if (rows[0]) await this.event(tx, actor, id, 'saved');
        else if (!(await tx.query('select id from pg_intake.cases where id = $1 and owner_id = $2', [id, actor.id])).rows.length) {
          throw new WorkflowError('That report is unavailable.');
        }
        return id;
      }
      const result = await tx.query<{ id: string }>(
        `update pg_intake.cases set channel = $1, sender = $2, received_on = $3, goal = $4,
          description = $5, revision = revision + 1, updated_at = now()
          where id = $6 and owner_id = $7 and state = 'draft' and revision = $8 returning id`,
        [...fields, id, actor.id, revision],
      );
      if (!result.rows.length) throw new WorkflowError('The draft is unavailable or has changed. Refresh before editing.');
      await this.event(tx, actor, id, 'saved');
      return id;
    });
  }

  submit(actor: Actor, id: string, revision: number) {
    this.requireRole(actor, 'consumer');
    return this.scoped(actor, async tx => {
      const result = await tx.query<{ receipt_at: Date }>(
        `update pg_intake.cases set state = 'received', receipt_at = now(), submitted_revision = revision, updated_at = now()
         where id = $1 and owner_id = $2 and state = 'draft' and revision = $3 returning receipt_at`,
        [id, actor.id, revision],
      );
      if (result.rows[0]) {
        await tx.query('insert into pg_intake.tasks (case_id) values ($1)', [id]);
        await this.event(tx, actor, id, 'submitted');
        return result.rows[0].receipt_at;
      }
      const existing = await tx.query<{ receipt_at: Date }>(
        'select receipt_at from pg_intake.cases where id = $1 and owner_id = $2 and submitted_revision = $3',
        [id, actor.id, revision],
      );
      if (!existing.rows[0]) throw new WorkflowError('The report is unavailable or has changed. Refresh before submitting.');
      return existing.rows[0].receipt_at;
    });
  }

  queue(actor: Actor) {
    this.requireRole(actor, 'staff');
    return this.scoped(actor, async tx => (await tx.query<QueueTask>(
      `select t.case_id, t.state, c.state as case_state, t.created_at, t.returned_at
       from pg_intake.tasks t left join pg_intake.cases c on c.id = t.case_id
       where t.state <> 'done' order by t.created_at, t.case_id`,
    )).rows);
  }

  claim(actor: Actor, id: string) {
    this.requireRole(actor, 'staff');
    return this.scoped(actor, async tx => {
      const result = await tx.query<{ case_id: string }>(
        `update pg_intake.tasks set state = 'assigned', assignee_id = $2
         where case_id = $1 and state = 'unassigned' returning case_id`, [id, actor.id],
      );
      if (!result.rows.length) throw new WorkflowError('That task is unavailable or already assigned.');
      const changed = await tx.query(
        `update pg_intake.cases set state = case when state = 'received' then 'in_review' else state end,
           updated_at = now() where id = $1 and state in ('received', 'in_review', 'needs_detail') returning id`, [id],
      );
      if (!changed.rows.length) throw new WorkflowError('The report is unavailable for review.');
      await this.event(tx, actor, id, 'claimed');
    });
  }

  returnTask(actor: Actor, id: string, revision: number, reason: ReturnReason) {
    this.requireRole(actor, 'staff');
    if (!Object.hasOwn(returnReasons, reason)) throw new WorkflowError('Choose why this task needs another reviewer.');
    return this.scoped(actor, async tx => {
      const changed = await tx.query(
        `update pg_intake.cases set revision = revision + 1, updated_at = now()
         where id = $1 and revision = $2 and state in ('in_review', 'needs_detail')
           and exists (select 1 from pg_intake.tasks t where t.case_id = $1 and t.state = 'assigned' and t.assignee_id = $3)
         returning id`, [id, revision, actor.id],
      );
      if (!changed.rows.length) throw new WorkflowError('The task is unavailable or has changed. Refresh the work queue.');
      // Append while this reviewer still has case scope. The transaction then removes that scope.
      await tx.query(
        "insert into pg_intake.events (case_id, actor_id, kind, return_reason) values ($1, $2, 'returned', $3)",
        [id, actor.id, reason],
      );
      const returned = await tx.query(
        `update pg_intake.tasks set state = 'unassigned', assignee_id = null, returned_at = now()
         where case_id = $1 and state = 'assigned' and assignee_id = $2 returning case_id`, [id, actor.id],
      );
      if (!returned.rows.length) throw new WorkflowError('The task is unavailable or has changed. Refresh the work queue.');
    });
  }

  review(actor: Actor, id: string, revision: number, decision: 'detail' | 'reviewed', prompt: string) {
    this.requireRole(actor, 'staff');
    if (decision === 'detail' && (prompt.length < 10 || prompt.length > 500)) {
      throw new WorkflowError('Enter one specific question using 10–500 characters.');
    }
    return this.scoped(actor, async tx => {
      const result = await tx.query(
        `update pg_intake.cases set state = $1, detail_prompt = $2, revision = revision + 1, updated_at = now()
         where id = $3 and state = 'in_review' and revision = $4 returning id`,
        [decision === 'detail' ? 'needs_detail' : 'reviewed', decision === 'detail' ? prompt : null, id, revision],
      );
      if (!result.rows.length) throw new WorkflowError('The report is unavailable or has changed. Refresh the case.');
      if (decision === 'reviewed') {
        await tx.query("update pg_intake.tasks set state = 'done' where case_id = $1 and assignee_id = $2", [id, actor.id]);
      }
      await this.event(tx, actor, id, decision === 'detail' ? 'asked_detail' : 'reviewed');
    });
  }

  addDetail(actor: Actor, id: string, revision: number, detail: string) {
    this.requireRole(actor, 'consumer');
    if (detail.length < 10 || detail.length > 500) throw new WorkflowError('Enter 10–500 characters of additional detail.');
    return this.scoped(actor, async tx => {
      const result = await tx.query(
        `update pg_intake.cases set
         followups = followups || jsonb_build_array(jsonb_build_object('question', detail_prompt, 'reply', $1::text)),
         state = 'in_review', detail_prompt = null,
         revision = revision + 1, updated_at = now() where id = $2 and owner_id = $3 and state = 'needs_detail'
         and revision = $4 returning id`,
        [detail, id, actor.id, revision],
      );
      if (!result.rows.length) throw new WorkflowError('The report is unavailable or has changed. Refresh before replying.');
      await this.event(tx, actor, id, 'detail_added');
    });
  }
}

export function newReportId() { return randomUUID(); }
