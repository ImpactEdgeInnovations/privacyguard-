# AGENTS.md — PrivacyGuard Kenya execution guardrails

## Roles and permission to proceed
- **Astra = reviewer and planner first. Do not modify application code or implement features during the audit.**
- **Codex = implementer only after explicit owner approval of Astra's reviewed roadmap and a selected phase.**
- A prototype interaction is a **visual demonstration**, not proof of an actual API/backend, official regulator filing, evidence storage, payment or security guarantee.

## Source-of-truth precedence
1. Signed-off legal requirements and ODPC-confirmed processes (to be supplied when verified).
2. Owner-approved decision log and change record.
3. Approved product requirements, workflow state machine, security/privacy requirements.
4. `docs/DESIGN_TO_FEATURE_MATRIX.csv` and `prototype/index.html` for feature/design alignment.
5. Research notes, legacy proposals and speculative backlog (not self-authorising).

## Scope lock
- Build individual cases only. No group claims, class action, native mobile apps, predictive compensation scores or payouts in MVP.
- Never collect/stash national ID photos in PrivacyGuard for MVP: consumer enters ID directly into official ODPC portal.
- No unauthorised ODPC portal automation or invented ODPC APIs. Consumer-led/manual filing until an approved channel is validated.
- Do not auto-close because company promises to stop; ask consumer. Do not auto-accept settlements or compensation offers.
- Do not send notices before evidence screening, verified recipient and specific consumer authority. Do not auto-enrol users in other campaigns.
- Do not imply official ODPC affiliation, automatic compensation, or that regulator penalties go to complainants.

## UX lock
- Mobile-first; low-bandwidth, English/Kiswahili planned; simple **single 'Upload a message'** entrance.
- ODPC and potential compensation visible with qualifications; official complaint is free.
- Fee shown after free message check and **before** any paid work; free self-service path remains clear.
- Separate user-facing company review and optional ODPC milestones; reflect verified events, not artificial percent-complete claims.
- Every new implementation must match approved prototype information hierarchy, reusable components, breakpoints and copy intent, or propose an explicit design change first.

## Security and correctness
- Supabase RLS + server authorization; no service role key in browser, PII in logs or public buckets.
- Evidence original, hashes, provenance, scan, audit, storage and retention boundaries; a hash does not authenticate sender.
- Queue/outbox idempotency; signed inbound webhooks; no false sent/delivered/acknowledged statuses.
- Separate action-specific authorisations, versioned notices, attribution and consent withdrawal path.
- Human review for disputed company identity/consent, legal merit, settlement, ODPC submission and appeal.
- Kenyan counsel must verify legal time rules, professional-service boundaries, ODPC portal steps and data flows before live pilot.

## Phase implementation discipline
- On each task: state chosen phase, exact IDs from design matrix, changed files, schema/API/security implications, test plan, rollback and unresolved issues.
- Do not implement future phases or refactor unrelated modules without explicit request.
- Write migrations/RLS tests and end-to-end tests alongside features. Never mark cosmetic screens as functional.
- Do not invent SaaS accounts, company addresses, regulator emails or integration credentials. Use fixtures/sandbox only.
- Report limitations honestly and stop at approval gates.
