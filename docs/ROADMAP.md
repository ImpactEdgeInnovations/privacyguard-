# PrivacyGuard Kenya roadmap

**Current stage on 11 November 2026: Phase 1 development, local sandbox.** The owner reported research complete and authorised development. The release evidence for live personal data is a separate checkpoint. See the [milestone record](MILESTONES.md) for the exact scope verified so far.

| Phase | Status | Scope and checkpoint |
|---|---|---|
| 0 · Research and design validation | Research complete per owner | Audit, prototype comparison, validation materials and draft intake DPIA recorded. Attach formal legal and privacy decisions before processing real case data. [Phase 0 record](phase-0/README.md) |
| 1 · Secure private intake and review | In progress | Description intake, staff screening and privacy decisions work locally. The [identity preview](IDENTITY_PREVIEW.md) has an approved Supabase project, a local callback and a delivered Resend test invitation. First authenticator setup and lost-device guidance are implemented and tested with a synthetic Auth service. Next, verify invited sign-in and staff MFA on the approved project, then implement the [assisted recovery controls](ACCOUNT_RECOVERY.md). Then integrate protected case access, attachment quarantine, scan evidence and restore reconciliation before pilot approval. |
| 2 · Company communication | Planned | Review an exact request, destination and evidence before authorising dispatch. Reconcile delivery and replies before advancing statuses. Requires Phase 1 acceptance and cleared templates. |
| 3 · ODPC handoff and tracking | Planned | Versioned case pack and consumer-led filing, with official milestones tied to supporting evidence. Requires confirmed process rules and approved scope. |
| 4 · Paid pilot | Planned | Cleared service offer, payments, reconciliation and measured workload and conversion. Evaluate economics before wider availability. |
| 5 · Measured expansion | Planned | Improve capacity and automation against measured performance, staffing and safety gates. |

The [audit roadmap](audit/08_ROADMAP.md) holds the detailed phase gates. The [Phase 1 build brief](phase-0/03_PHASE_1_BUILD_BRIEF.md) gives the service contract. Continue development in this repository. On each milestone, record the scope, checks and remaining gates in [MILESTONES.md](MILESTONES.md) and update this roadmap if the phase status changes.
