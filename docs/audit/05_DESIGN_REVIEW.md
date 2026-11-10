# v6 versus the proposed refined design

The supplied v6 is a credible visual concept with consistent navy/teal colours, rounded cards and useful safeguards. It is **not yet a complete consumer service design**. Too much repeated education competes with the next action, and several plausible-looking states are not grounded in durable evidence. This review separates demo defects from missing production requirements.

Open [the standalone comparison boards](mockups/index.html). They include baseline screenshots, proposed consumer/operations screens and annotations. They are design illustrations, not a new application or replacement for v6.

## Keep, simplify and add

| Screen / baseline feature | What should stay | Observed/source issue | Proposed refinement / benefit | Feature and board |
|---|---|---|---|---|
| Landing / PG01–03 | One entrance, independence, free filing, qualified remedies | Compensation and ODPC repeated across hero, benefits, explainer, journey, FAQ and final CTA; duplicate stopped-message FAQs | Lead with control of marketing; one remedies explanation; clear self-service/paid scope. Less cognitive load without hiding compensation | PG01–04; B01 |
| Home / PG09 | Private cases, next-step idea | Large acquisition hero precedes returning-user work; stale PG1042 action after filing;390px viewport has447px document width | Case-first home, one action card; new-report button secondary for returning users | PG09; B02 |
| Intake / PG05 | Four understandable steps; no ID field; description-only possibility | “Upload” framing excludes calls/no screenshot; no durable-save/recovery; date collected but not carried into new-case record in source | Evidence or description; inline privacy notice, safe preview, save/resume and explicit incomplete status | PG05/07/A01; B03 |
| Goal choice | Stop/understand/both options | Both preselected; selected stop-only goal still initializes both request checkboxes | No assumed broader goal; carry choice into exact letter and allow revision | PG05/08/17; B03/B04 |
| Company request / PG08/17 | Exact destination preview and separate authority | Unchecking access leaves “requesting information” and access subject text; global demo authority booleans; no version-bound record | A review-and-approve screen with recipient, request, attachment list and unselected mandate; changed content requires reapproval | PG08/17; B04 |
| Service choice / PG04/24 | Free path visually distinct; no payment in demo | KSh199 bundles vague work. “Evidence and sender verification” button opens a service-price choice | Button says “View assistance options”; show scope, total, exclusions and refund terms before commitment | PG04/24; B07 |
| Case detail / PG09 | Chronology and company/ODPC distinction | Many duplicate ODPC buttons and5-of5 company milestones dominate; predicates infer events from states | One next action + factual event list; collapsed evidence/permissions; no apparent total completion | PG09; B02 |
| Company response / PG10 | Consumer decides; stopping does not erase past-conduct question | Close/satisfied option preselected; alternative legal-review choice overemphasises compensation | Neutral choices, attributed response, actual excerpt/source, no default waiver; closure explains scope | PG10; B05 |
| Consent comparison / PG10 | Claims separated from demonstrated record; human review | UI and source show static unresolved assessment; clarification changes to awaiting-company although its event says no email sent | Evidence-linked comparison of purpose/time/channel, ambiguity, current objection and next request | PG10/18; B05 |
| Pack / PG11 | Preparation distinct from filing; accurate/no-award disclaimers | Preview reuses live event history; after reference entry pack changes. Accuracy checked before completed artifact, “FINAL STAGE” misleading | Versioned pack, change log, final review and download; clearly separate preparation from submission | PG11/12; B06 |
| ODPC handoff / PG06/12 | Consumer uses official site for ID/OTP; unverified-reference warning | Public portal field visibility overgeneralised into absolute ID boundary; no accessible alternate/failed portal route | Exact official destination, offline copy guide, ID warning, “I filed” intake plus pending verification and support | PG06/12; B06 |
| Privacy / PG14 | Minimisation explanation and separate authorities | Informational cards only; selected-case/global demo state confusing; no revoke/export/delete journey | Case-scoped permission ledger, withdrawal consequences, data request/retention/hold status, support | PG14/A03; B08 |
| Rights/help / PG02 | Plain FAQ correctly says company-first not universal | Help-only branch means the actionable journey still looks linear; no user support service | Contextual help and early official route; concise FAQ, owned support and accessible alternatives | PG02/A02; B01/B06 |
| Notifications / PG13 | No claim of live mail; concise updates | Static notifications, consumer modal includes operations example; unlabelled close icon; focus remains on opener | Role/case-scoped deep links, read state, channel preferences; accessible dialog focus handling | PG13/23/A02; B09 |
| Ops overview / PG20 | Exceptions-first intent and distribution, no percentage | Static priorities, queue badge4, all pipeline buttons go to generic queue; intake not consistently surfaced | Derived task metrics and exact drill-down filters, owner/due/source/age, no decorative throughput chart | PG20/A04; B09 |
| Review queue / PG15/20 | Human review for uncertainty | All-exceptions view did not surface newly created no-evidence report; replies empty filter shows no explanatory state | Intake tasks, assigned queues and helpful empty/error/loading states; explicit blocker | PG15/20/A04; B09 |
| Ops case / PG21 | Evidence checklist and actual correspondence history | Screening can be approved from filename presence in simulation; recording a consent response on PG1017 changed the acknowledged regulator status to Staff review | Source viewer, sufficient-evidence reason, assignments, protected transitions, drafts and approvals | PG15/21; B10 |
| Directory / PG16 | Never guess address; new record unverified | Three editable strings stand in for verification; no evidence/expiry/change review | Source-backed identity and channel verification, reviewer, expiry and reapproval of changed recipient | PG16; B10 |
| Email trail / PG18 | Received/company/ODPC/needs-reply filters; view opens case | No message-level triage, spoofing, unmatched, bounce or ambiguous-send journey | Case-matched correspondence inspector with safe attachments, provenance and delivery evidence | PG18/A04; B10 |
| ODPC tracker / PG22 | Submitted versus acknowledged | Modal only supports receipt/acknowledgement, generic note; no artifact upload, determination/appeal/paid controls | Evidence-backed milestone dialog and complete official-event register | PG22/A05; B11 |
| Ops privacy / PG23 | Honest “not certification” disclaimer | Safeguard descriptions, not governance work | DSR/holds/incidents/access-review task queues with proof and deadlines | PG23/A03/A06; B08/B09 |
| Automation rules / PG19 | Explicit blocked autonomous decisions | Incomplete clocks; settings descriptive; no version/test/review history | Readable rules registry with counsel version, effective date, simulations and affected-case impact | PG19/A06; architecture document |

## Significant design alternatives

**Entrance A, recommended:** “Check a message” → screenshot or description → minimal context. Keeps a single simple entrance without suggesting an upload is compulsory. **Entrance B:** “What do you want to do?” before evidence. May improve motivation but adds a choice before users understand the service. Test both with12–15 users; do not assume a conversion win. B03 illustrates both.

**Home A, recommended:** one next action and recent events, with cases below. **Home B:** case list first with inline action labels. Prefer A for a typical user with one active matter; use B when users actually maintain several. Do not copy an operations dashboard into the consumer portal. B02 illustrates the recommended hierarchy.

**Operations A, recommended:** task inbox with split-view case evidence. **Operations B:** kanban lifecycle board. A supports simultaneous deadlines and exceptions; B is useful for management but risks hiding concurrent work. Keep lifecycle distribution as a secondary report. B09/B10 illustrate A.

## Missing screens and states

| Priority | Consumer | Operations |
|---|---|---|
| P0/P1 before real pilot | OTP failure/expiry, recovery/shared-device sign-out; evidence scan/rejection/retry/redaction; source-specific authority and revocation; save/resume; privacy notice and support | Staff MFA/recovery/offboarding; scoped access; intake/evidence quarantine; source verification; immutable approvals; incident and privacy-request workflow |
| P1 before paid/company-contact service | Exact offer/order/receipt; pending/failed/duplicate payment and refund; delivery failure; correction of facts; withdrawal/closure; unknown respondent; multiple respondent scope | Dispatch reconciliation, bounce/unmatched mail/spoofing; owner assignment and aging; refund/reconciliation; authority revoked mid-send; suppressed/paused work |
| P1 before ODPC-assisted service | Pack correction/version approval; filing failure/alternate channel; information-request response; ADR/withdrawal; determination/appeal; award versus paid | Artifact verification; official deadlines; adverse evidence/rebuttal; order/appeal/stay/version tracking; partial-payment evidence and referral |
| P2 after safe pilot | Preferences, complete Kiswahili, accessible guidance and service history; printable low-bandwidth guide | Search/saved filters, audited bulk actions, operational profitability reports, contact revalidation campaigns |

Support, privacy rights and understandable language are not optional future polish. “Complete Kiswahili” must move into the relevant pilot gate if Kiswahili-speaking users are served or bilingual support advertised. No silent beta label cures inaccessible consent.

## Accessibility and mobile requirements

Observed: home overflow at390px, dense long-card layouts, partial language toggle, several unlabelled modal close buttons, opener retains focus when modal appears, and mobile navigation does not expose all desktop operations destinations directly. Source review found no complete focus-trap/return mechanism in generic modal rendering. These are actionable findings, not a complete WCAG conformance test.

Target WCAG2.2AA as a product requirement, with semantic headings/forms, visible keyboard focus, named controls, logical modal focus/escape/return, inline errors connected to fields, status announcements, text rather than colour-only status, sufficient contrast and zoom/reflow. Aim for44px primary touch targets as a usability choice, and test320/360/390px plus200% text zoom and keyboard/screen-reader journeys. Avoid fixed bottom navigation covering form actions. Use native language review for Kiswahili; do not mark an entire partly English page `lang=sw`.

Low-bandwidth design: no remote fonts/hero video required; compressed previews while retaining necessary originals safely; cancellable/resumable uploads, clear retry state, no false success on connectivity loss. Clearly state whether a draft is saved locally or securely on the service; shared-device users need logout and privacy-preserving notifications.

## Prototype caveats

The role switch is a demo aid, not evidence of an implemented authentication vulnerability. Filename-only uploads, simulated sends and fictional timestamps are expected demo behavior. They become product gaps only if someone treats them as completed features. Real payment, email, OTP, malware scanning, RLS, performance and legal-service correctness were not tested because none exists in this prototype. Exact test coverage and unexercised actions are recorded in [11_EVIDENCE_AND_COVERAGE.md](11_EVIDENCE_AND_COVERAGE.md).
