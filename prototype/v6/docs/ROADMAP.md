# Proposed phased delivery roadmap — approval gates

**Policy: Astra first; owner approves; Codex implements ONLY the selected phase.** Dates and budgets are intentionally not invented.

| Phase | Deliverables | Exit/acceptance gate | Design alignment |
|---|---|---|---|
| A0 — Astra audit | Review product/legal/flow/design, enumerate changes, risks, verify sources, sign-off options | Owner explicitly approves v6 revisions, architecture and locked MVP | All screens/matrix |
| P0 — Compliance/design foundations | Legal authority and pricing boundaries, DPIA/registration plan, final copy, token/component spec, process templates and real data policy | Written owner + Kenyan counsel approval for live case activity | Landing, privacy, ODPC explanations |
| P1 — Accounts/evidence | Responsive PWA, verified account, upload wizard, private evidence, permissions, audit and case progress | Low-bandwidth mobile usability; RLS, safe uploads, no ID collection | Landing, Upload, Consumer dashboard |
| P2 — Company-first automation | Company directory, manual lookup, verified contacts, template preview/authority, queue & outbound/inbound emails, deadlines | No notices to unverified addresses; send-time permissions; no duplicate mail; bounce and reply states correct | Consent, My cases, Operations directory/inbox |
| P3 — Consumer decision and ODPC handoff | Response review, closure/clarification/escalation, pack assembly, consumer review, manual ODPC handoff, reference verification and regulator inbox | Cannot claim filed without evidence; all approvals and documents traceable; user ID direct to ODPC | ODPC decision/handoff, operations ODPC |
| P4 — Pilot and readiness | Pilot support, monitoring, backup/restore, fraud testing, fee transparency, usability, legal verification and runbook | Operator can manage real cases safely; errors handled without user-data leakage | Entire experience |
| P5 — Later enhancements | Optional billing, curated precedent, limited AI assistance, regulator integration **only if approved**, possible separate group-claims discovery | Separate feasibility/legal/privacy approvals | New design proposal required |

## KPIs (track, no invented targets)
Evidence upload completion; % requiring manual company research; time to verified company match; notice bounce rate; duplicate notice rate (must be zero); customer-authorisation conversion; first response time; ODPC pack quality; external submission confirmation; overdue ODPC queries; customer support contacts/case; accepted consumer resolution; compensation ordered vs received; data deletion request resolution; security incident count; usability completion on inexpensive Android devices.

## Per-phase codex checklist
Before coding: approve design IDs, schema/events, auth/RLS, API contracts, failure states, tests and rollback. After coding: show functioning route/screen, backend evidence, integration/sandbox tests, screenshots at mobile/desktop, accessibility report, security test results, unresolved issues, and mapping to `DESIGN_TO_FEATURE_MATRIX.csv`. Don't proceed without approval.
