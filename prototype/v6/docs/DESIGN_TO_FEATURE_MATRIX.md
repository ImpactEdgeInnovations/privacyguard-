# Design to functional-engine mapping

**Rules:** Each visible screen needs a real matching service, policy and test; treat demo buttons as not implemented. Source table: `DESIGN_TO_FEATURE_MATRIX.csv`.

| ID | Screen / component | Required real capability | Acceptance |
|---|---|---|---|
| PG-01 | Landing / hero | Marketing content, none | Mobile hero readability; accessible CTA |
| PG-02 | How it works / ODPC education | Curated content and source versions | No affiliation or compensation guarantee |
| PG-03 | Primary action | App routing | Single unambiguous starting action |
| PG-04 | Service choice after check | Products/receipts in later phase | Price, scope, total and optionality visible |
| PG-05 | New report wizard | Case service + private evidence store | Errors, offline, duplicates, redaction |
| PG-06 | ODPC identity handoff | Pack builder + external deep link | No ID fields in PrivacyGuard |
| PG-07 | Login / verification | Supabase Auth + vetted OTP | Rate limit and anti-takeover |
| PG-08 | Privacy controls / permissions | Versioned authorisation registry | Withdrawals auditable |
| PG-09 | My dashboard / cases | Event stream + case read API | No misleading percent bar |
| PG-10 | Company response / resolution | Inbound email + reviewer summary | Company compliance ≠ case closure |
| PG-11 | ODPC pack preparation | Pack generator, source manifest | Pack generated ≠ filed |
| PG-12 | ODPC handoff / reference | Manual case admin + verification | Official ack separate |
| PG-13 | Notifications / case activity | Email/SMS queue + event audit | No fabricated updates |
| PG-14 | Privacy centre | Privacy request / retention engine | Explain limits and lawful retention |
| PG-15 | New evidence review | Evidence scanner, abuse heuristics | Fraud flag not legal finding |
| PG-16 | Company directory | Source-backed directory + review history | No guessed company emails |
| PG-17 | Notice editor and send gate | Outbox, email provider, auth registry | Idempotent and cancel-on-withdrawal |
| PG-18 | Email trail / correspondence | Inbound/outbound message records + MIME storage | Sender authentication, PII minimisation |
| PG-19 | Deadline alerts | Rules engine, scheduler, event journal | Versioned and trigger-based clocks |
| PG-20 | Overview / pipelines | Aggregated case/event queries | Aggregate ≠ fake completion % |
| PG-21 | Individual case workspace | Role-limited case API + audit logs | Staff access logged |
| PG-22 | ODPC tracker | ODPC tracking records, human verification | Award and receipt distinct |
| PG-23 | Security and role controls | RLS, MFA, encryption, logging | Red-team role isolation |
| PG-24 | Optional payment choice | Daraja later, billing ledger | No ODPC filing fee |
| PG-25 | Group claims | N/A | Requires separate approval |
| PG-26 | Automatic ODPC API | N/A | Requires ODPC authorisation |
| PG-27 | AI legal verdict | N/A | No automatic liability |
| PG-28 | Native apps/inbox scanning | N/A | PWA only |
