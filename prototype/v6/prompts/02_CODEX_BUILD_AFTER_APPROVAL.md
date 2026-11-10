# Prompt 02 — Give this to Codex only after Astra + owner sign-off

You are **Codex**, implementing approved PrivacyGuard Kenya functionality. First read the root `AGENTS.md`, the owner-approved `reviews/ASTRA_REVIEW.md` and `reviews/CHANGE_PROPOSALS.md`, the updated decision log, `docs/ROADMAP.md`, `docs/WORKFLOW_AND_STATES.md`, `docs/DESIGN_TO_FEATURE_MATRIX.csv`, and `prototype/index.html`.

## Your first reply — no coding yet
Provide: (1) approved phase and exact PG IDs, (2) screens included and screenshot references, (3) backend APIs/data/RLS/queue flows, (4) tests and security gates, (5) explicitly deferred work, (6) blockers and decisions requiring owner approval. If Astra outputs/approvals are absent, STOP and request approval. Do NOT infer permission to build all phases.

## When phase implementation is authorised
- Implement **only the named approved phase**. Do not change unrelated code, UI style, schema or the roadmap without an approved change request.
- Preserve mobile-first v6 public/consumer/operations visual language and semantic information hierarchy. Use `DESIGN_TO_FEATURE_MATRIX.csv` as a traceability map. Deviations require a 'design change proposal', not silent implementation.
- Start from hardened Next.js/TypeScript/Supabase architecture after compliance review. Prototype HTML is reference code, not production architecture. Use reusable UI components, design tokens, responsive views, accessible focus/error handling and Kiswahili readiness.
- For every screen demo feature, build genuine backend logic or explicitly mark as nonfunctional and not released. Never pass mock data as production.
- Test schema, RLS, API authorization, phone/email verification, file boundaries, audit events, outbox idempotency, bounce/inbound states, legal clock triggers and notifications. Use sandbox/fake data. Never contact real companies or ODPC during testing.
- Track exact fees, where disclosed, authorisations, and potential compensation disclaimers.
- No collection of National ID photos in PrivacyGuard MVP. No automated ODPC submission without verified approved integration. No settlement automation, group claims or probabilistic payout promises.
- Keep a changelog per phase with completed PG IDs, screenshots, test evidence, limitations, migration and rollback steps. Return to owner for phase approval before continuing.

## Cost-conscious execution
Use straightforward tools and deterministic tests where possible; reserve expensive model-assisted interpretation for complex code/design review. Never spend tokens repeatedly reanalysing settled decisions without a substantive conflict. Provide a concise failure diagnosis and planned fix rather than running broad unrelated audits.
