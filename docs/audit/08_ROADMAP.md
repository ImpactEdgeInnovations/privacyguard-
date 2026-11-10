# Revised development roadmap — approval required

No phase is authorised by this document. Phase0 is validation/preparation, not application implementation. Dates and budgets should follow the legal/privacy dependencies and measured pilot results; an invented fixed delivery date would conceal the sixty-day DPIA submission issue and unknown service model.

Each later approval should name the phase, features, approved design/copy versions, budget, owner and acceptance gates. P0 failures cannot be waived by approving a colour scheme. A future developer should use the feature matrix and tests below, not port the prototype's global state into production.

## Phase0 — legal, service and design validation

| Requirement | Plan |
|---|---|
| Objective | Determine whether the proposed service can be offered lawfully and profitably before application investment. |
| Included features | PG01–04/06/08 concepts; A07 comprehension; scoped offer, legal-source register, lawful bases/DPIA/transfers, authority templates and final selected design. |
| Excluded | Production code, real uploads, payments, sending notices, filing, provider-account changes. |
| Dependencies | Owner choices D01–05/07–11; Kenyan counsel and privacy lead engaged through separately authorised action. |
| Database/backend | Data dictionary, state invariants, retention classes and threat model as documents only. |
| UI | Test B01–B11 static boards; entrance alternatives, permissions, response choice, paid scope and ODPC handoff. |
| Integrations | Read-only documentation/process confirmation; no account provisioning. |
| Security | DPIA and transfer decisions; incident/retention/backup requirements; processor due diligence. |
| Testing |12–15 moderated synthetic scenarios, Kiswahili-first users and low-literacy/mobile users; exact notice/closure/fee comprehension; price-choice interviews. |
| Deliverables | Signed service-boundary opinion, resolved source questions, approved offer/templates, selected designs, revised model using evidence, phase1 specification. |
| Acceptance | No unresolved phase1 legal/privacy prerequisite; users can identify next step and know ODPC is free; evidence sufficient to justify a bounded service experiment; owner accepts remaining commercial uncertainty explicitly. |
| Risks | Unsupported paid-service model; DPIA timing delays; false-positive interest in hypothetical purchases. |
| Approval checkpoint | Owner authorises **phase1 only**, with budget; legal/privacy sign-off is separate evidence. |

## Phase1 — secure private intake and an operable review desk

| Requirement | Plan |
|---|---|
| Objective | Prove one complete private intake/review/recovery/deletion path. |
| Included features | PG03/05/07/08/09/13–15/20/21/23; A01–03/06/07. Minimal public content and support. |
| Excluded | Company sends, payments, formal pack service, AI decisions, group work. |
| Dependencies | Phase0 clearance for actual processing; selected processor/contracts, registration determination, applicable DPIA submission/consultation completed. |
| Database/backend | Auth/contacts/cases/evidence/scans/grants/tasks/audit/privacy requests/holds; migrations and RLS; private storage; queue and minimal outbox. |
| UI | Intake, save/resume, OTP/recovery, upload errors, case-first home, review task, privacy requests and staff access. |
| Integrations | Auth email/SMS as selected; storage/scanner; monitoring; backups. Sandbox before real data. |
| Security | MFA/least privilege, RLS+server checks, quarantined uploads, secure logs, secret management and object recovery. |
| Testing | Cross-user/role IDOR, revoked session, scan bypass, interrupted upload, persistence of date/goal, recovery abuse, DSR export scope, deletion+restore, keyboard/mobile/locale. |
| Deliverables | Reviewed vertical slice, data-flow inventory, runbooks and restore evidence; synthetic end-to-end demo. |
| Acceptance | Every saved receipt maps to real stored object/state; no unscanned file share; all intake tasks visible/assigned; no unresolved critical security issue; agreed recovery target measured. |
| Risks | Account takeover, accidental sensitive evidence, incomplete retention implementation, unsupported staffing promises. |
| Approval checkpoint | Owner approves narrow real-data pilot and/or phase2 separately; deployment requires explicit release approval. |

## Phase2 — reliable company request and response workflow

| Requirement | Plan |
|---|---|
| Objective | Deliver one expressly authorised request and a truthful response/deadline trail. |
| Included features | PG08–10/16–21; A04/08/09. Versioned company directory, notices, inbound mail, tasks and customer resolution. |
| Excluded | Automated merits/settlement, regulator filing, broad bulk notices and paid sales before phase4. |
| Dependencies | Phase1 accepted; counsel-approved templates, scope, authorities and rule versions; verified provider contracts. |
| Database/backend | Entities/contacts/sources, request versions, grants, dispatch/outbox, messages, match decisions, obligations, assignments and closure decisions. |
| UI | B04 exact-authority review; B05 response choice; B09 task queue; B10 directory/message evidence; empty/error/bounce/unknown-result states. |
| Integrations | Email provider outbound/inbound webhooks; source research through approved channels. No guessed company contacts. |
| Security | Webhook authentication/replay controls, safe HTML and attachments, scoped case aliases, recipient-change reapproval. |
| Testing | Goal-template consistency; duplicate click; worker crash after send; authority withdrawal race; bounced mail; spoofed/unmatched mail; independent clocks; no automatic closure. |
| Deliverables | End-to-end synthetic request/reply/retry exercise, contact verification SOP, versioned legal rules and operator handbook. |
| Acceptance | No send without valid current authority; unknown outcomes reconciled; each failure owned; displayed statuses match evidence; all counts drill to correct queue. |
| Risks | Wrong-recipient disclosure, duplicate notices, hidden free-support labour and misinterpreted deadlines. |
| Approval checkpoint | Owner approves bounded live communication pilot with explicit consumer mandates; phase3 remains separate. |

## Phase3 — versioned pack and consumer-controlled ODPC tracking

| Requirement | Plan |
|---|---|
| Objective | Help consumers organise and track a complaint without impersonating official submission. |
| Included features | PG06/08/11/12/19/22; A05/08; early handoff branch and accessible guidance. |
| Excluded | Portal automation/API without written validation, ODPC credential/OTP collection, award custody, court enforcement services. |
| Dependencies | Phase1/2 foundations; confirmed official channel requirements and representative limits; authenticated sources; final pack content cleared. |
| Database/backend | Immutable packs/items/versions/approvals; filing reports, official artifacts/milestones/requests/decisions/appeals/award receipts. |
| UI | B06 pack corrections/final approval/handoff; B11 official evidence, requests, determination/appeal/paid tracking; alternate-channel support. |
| Integrations | Document-render worker and private downloads; direct official links; manually reviewed official correspondence. |
| Security | Pack/attachment scope checks, link expiry, incidental-ID handling, precise verifier privileges. |
| Testing | New evidence creates new pack; old download stable; click never files; invented reference remains unverified; information request assigned; appeal preserves original; partial payment does not mark full payment. |
| Deliverables | Approved sample pack, consumer filing guide, verification checklist, official milestone and appeal/referral runbook. |
| Acceptance | Final artifact is reviewable and reproducible; every verified regulator status has supporting evidence; no legal outcome inferred by model or browser handoff. |
| Risks | Portal changes, unsupported alternate channels, stale official source, mistaken reference and premature award claims. |
| Approval checkpoint | Owner approves limited pack/tracking service only after counsel/process clearance. |

## Phase4 — paid pilot with measurable service economics

| Requirement | Plan |
|---|---|
| Objective | Validate a profitable, understandable fixed deliverable using real paid behaviour. |
| Included features | PG04/24; A10; exact offers, order/receipts, payment reconciliation/refunds and cohort labour metrics. |
| Excluded | Subscriptions, unlimited support, compensation percentages, financed claims, award custody and aggressive acquisition scale. |
| Dependencies | Legal/tax/consumer terms approval; positive operational readiness. For company-only offer, phase2 sufficient; pack offer additionally requires phase3. |
| Database/backend | Offers/versions, orders, payment attempts/provider events, refund ledger, work metrics and reconciliation. |
| UI | B07 offer/checkout/pending/failure/refund, service scope/history and support. |
| Integrations | Selected M-Pesa product after merchant/sandbox approval; no invented signature protocol. |
| Security | Server-side amount/merchant/order validation, replay protection, finance segregation and credential handling. |
| Testing | Wrong amount/order; duplicate/late callback; timeout; abandoned payment; refund failure; receipt; cancellation; terms comprehension. |
| Deliverables | Small capped paid pilot, measured conversion/CAC/minutes, reconciled cash/refunds, revised offer and unit economics. |
| Acceptance | Positive contribution after realistic labour/acquisition in two cohorts; no critical permission/privacy defect;≥90% sampled users understand free ODPC filing/no promised award;≥95% accepted orders meet published service promise. |
| Risks | Hypothetical price interest fails to convert; refunds/CAC erode margin; support tail exceeds scope. |
| Approval checkpoint | Owner reviews actual results and approves expansion, repricing, redesign or stop. No automatic growth release. |

## Phase5 — evidence-led scale and selective automation

| Requirement | Plan |
|---|---|
| Objective | Increase capacity only after service and economics work. |
| Included features | Measured query/queue/storage optimisation, verified directory reuse, reporting, stronger recovery, limited human-reviewed extraction if justified. |
| Excluded | Native apps, group claims, automated legal verdicts and unsupported regulator integration unless separately approved. |
| Dependencies | Phase4 cohorts and staffing plan; source/processor/retention review; bottleneck evidence. |
| Database/backend | Index/query tuning, worker separation and rate limits; partition/replica only when measured; optional R2 migration plan if selected. |
| UI | Saved operator filters, workload management, source review, management economics and accessibility refinement. |
| Integrations | Reassessed provider limits/prices; any AI through separate DPIA/transfer/evaluation decision. |
| Security | Load/abuse isolation, access reviews, independent assessment, recovery targets funded and measured. |
| Testing |100/1k/10k/100k monthly arrival scenarios plus burst/backlog, worker failure, provider outage, consistent object/DB restore and deletion replay. |
| Deliverables | Capacity model, staffing coverage, cost budget, recovery evidence and controlled rollout/rollback plan. |
| Acceptance | Queue age/deadline targets under tested bursts; forecast costs within approved budget; safety/error rates stable; no expansion based solely on MAU allowance. |
| Risks | Human queue bottleneck, contact/provider rate limits, insufficient review quality, automation bias and growing data footprint. |
| Approval checkpoint | Owner approves capacity increment and exact new capabilities; deferred features require independent business/legal case. |

## Test strategy and stop conditions

Use static usability trials and synthetic fixtures early; reserve scarce engineering effort for meaningful cross-user authorisation, state invariants, delivery ambiguity, legal-clock calculation, payment reconciliation, privacy deletion and recovery tests. Do not substitute screenshot tests for workflow correctness. Test negative cases and concurrency, not only happy paths.

Release checklist per approved phase: migration/RLS review; rollback/backup plan; documented external side effects; scenario acceptance evidence; unresolved finding IDs; legal/privacy clearance where relevant; operator training; owner approval. Rollback cannot unsend an email or reverse an official submission—pause queues and reconcile those effects explicitly.

Stop a pilot on unauthorised disclosure/send, unexplained ledger mismatch, unowned critical official deadline, failed recovery beyond accepted risk, or evidence that the service is operating outside its cleared legal scope. Resume only after root cause, remediation and responsible approval. These are proposed operational release conditions, not permission to start a pilot now.
