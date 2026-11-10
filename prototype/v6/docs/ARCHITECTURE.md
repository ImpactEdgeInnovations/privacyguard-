# Proposed system architecture (pending Astra review)

## Stack proposal
- **Public + consumer + operations UI:** Next.js App Router, React, TypeScript, Tailwind CSS and accessible component library (shadcn/ui-style); responsive PWA.
- **Application API:** Next.js server handlers / server-side services with explicit authorization and validation.
- **Identity + relational data:** Supabase Auth/PostgreSQL; Row Level Security plus server checks; Postgres migrations and generated types.
- **Async work:** Persistent PostgreSQL-backed queue (Supabase Queues/pgmq) plus scheduler and server workers/Edge Functions; transactional outbox.
- **Evidence:** Private object storage (R2 considered but **pending cross-border transfer/DPIA/legal approval**; ability to replace provider required). No public evidence URLs.
- **Communications:** Vetted email service with domain authentication, outbound event webhooks and inbound per-case aliases; Kenya-capable OTP provider. No invented company email addresses.
- **Payments:** Optional M-Pesa Daraja once pricing/legal scope approved. No payment gate for free ODPC self-filing.
- **Observability:** structured tracing, tamper-evident audit events, aggregate metrics, security monitoring, backup and restore procedures.

## Boundary diagram
Browser/PWA → application server → Postgres (RLS + permissions) + private object store; background outbox → mail provider; signed inbound webhooks → quarantined/sanitised correspondence → case reviewer; consumer-led ODPC portal handoff. No direct ODPC API until approved.

## Services / modules
1. Account/identity/recovery service
2. Evidence and provenance service
3. Company identity/contact directory
4. Authorisation/versioned declaration registry
5. Rights-request templates and legal deadline rules
6. Transactional outbox and inbound correspondence gateway
7. Case state engine and audit event journal
8. Consumer notification service
9. ODPC pack builder + ID-free handoff + reference verification
10. Operations triage/queues + role-based workspace
11. Data lifecycle and security audit
12. Payments/receipts as separate future milestone

## Integration contracts before implementation
- Identity provider challenge/rate limits and recovery
- Provider email send success, accepted, bounced, inbound authenticity and false-positive handling
- Object storage location, encryption, signed URL TTL and deletion propagation
- SMS OTP outbound deliverability on Kenyan networks
- ODPC portal/manual process and evidence pack compatibility verified separately
- M-Pesa sandbox callback authenticity, duplicate control and reconciliation

## Engineering standards
- API contracts and schema-first migrations; strict tenant/row isolation.
- Idempotency keys for letter dispatch, reminders, payment callbacks, email ingestion.
- Retry rules and dead-letter queue; hold messages when authorisation invalidates.
- Never include raw evidence, ID numbers or full phone/email details in logs, exception telemetry or AI prompts without approved need and safeguards.
- Audit logs for document access; evidence file hashes alongside immutable original, not as proof sender authenticated.
- Integration tests for RLS, outbox delivery, inbound spoofing, state guards and legal deadline clock.
- Prototype HTML is *reference*, not framework code to paste wholesale into production.
