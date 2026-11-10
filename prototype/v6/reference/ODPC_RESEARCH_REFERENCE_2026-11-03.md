# PrivacyGuard Kenya
## Regulatory research, complaint operating model and development blueprint
**Research reviewed:** 3 November 2026  
**Status:** Product design and compliance research, subject to independent Kenyan legal and privacy review prior to launch.

## Executive decision
Build **individual-first, company-first by default but not as a prerequisite, with direct ODPC escalation when appropriate**. The product should help a person stop unwanted marketing, understand how their information was used, and pursue unresolved privacy concerns. It must not market guaranteed compensation, impersonate the ODPC, or treat a generated report as an official filed complaint.

MVP components: consumer evidence intake; identity and delegated authority; company/sender registry and research queue; requests for access, marketing objection, and erasure; tracked outbound/inbound communications; response classification and resolution confirmation; ODPC-compatible complaint pack; human-assisted official submission; regulator correspondence and verified milestones; operational queue and audit logging. Defer group claims and native apps.

## 1. Official ODPC resources verified

| Resource | Link | Product implication |
|---|---|---|
| CIE complaint portal | https://cie.odpc.go.ke/Complaint | Submit directly or via authorised representative; capture portal-compatible fields; portal email verification may require consumer participation. |
| ODPC CIE Directorate | https://www.odpc.go.ke/c-i-e/ | Official forms DPC 1 (complaint), DPC 2 (withdrawal), DPC 5 (ADR settlement), DPC 6 (review of enforcement notice), ADR application. |
| Complaint determinations | https://www.odpc.go.ke/determinations/ | Publicly indexed published decisions by year, 2023–2026. Not a register of all pending or closed cases. |
| 2026 decisions | https://www.odpc.go.ke/2026-determinations/ | Published decisions, some cases commenced in 2025. |
| 2025 decisions | https://www.odpc.go.ke/2025-determinations/ | Published decision corpus. |
| Complaints Management Manual | https://www.odpc.go.ke/wp-content/uploads/2024/02/ODPC-Complaints-Management-Manual-1.pdf | Official internal procedure, acknowledgement, screening, respondent correspondence, case numbering, early resolution, withdrawal, lapse and conclusions. |
| Service charter | https://www.odpc.go.ke/wp-content/uploads/2025/05/ODPC-Service-Charter-English-2025.pdf | Published service standards, including acknowledgement and outcome communication. |
| Register of data handlers | https://www.odpc.go.ke/registered-data-handlers/ | Research legal entities and controller/processor registration; not an assumed contact directory. |
| ODPC contact | https://www.odpc.go.ke/contact-us/ | info@odpc.go.ke; 0207801800; 0796954269 / 0752896867. Confirm a formally accepted specialist submissions email directly with CIE. |

CIE portal requests details such as complainant identity, email verification, respondent, alleged misconduct, supporting evidence, requested remedy, previous attempts to resolve and, if filing on another person's behalf, written authority. Collect full ID material only when required for filing or verification, not during casual initial browsing.

**Crucial distinctions:**
- The ODPC 'Report a Data Breach' route is for data breaches and statutory breach reporting, not necessarily an individual complaint about spam marketing.
- `customer.feedback@odpc.go.ke` is associated with complaints about service quality or internal customer feedback; it is not interchangeable with the CIE privacy-rights complaint portal.
- A historical reference to `complaints@odpc.go.ke` has not been re-confirmed as the current official intake channel. Obtain current written instructions first.
- No publicly verified official API for filing/tracking a consumer complaint was identified. Do not build scraping, CAPTCHA circumvention or invisible portal submissions. Keep user-assisted/manual filing until formally agreed otherwise.

## 2. What ODPC complaint statistics and cases establish

On **18 March 2025**, ODPC stated it had received **7,128 complaints**, issued **215 determinations**, imposed penalties on **10 entities**, made **103 compensation awards**, and resolved **39 cases through ADR**. This is a dated snapshot, not today's active caseload. Source: https://www.odpc.go.ke/odpc-urges-public-to-report-personal-data-misuse-cases-to-protect-their-rights/ .

Public determination lists include breaches found, no breach found, resolved/closed, withdrawal/ADR-related outcomes and penalties/compensation; appeals can reverse or vary decisions. Cases worth incorporating into human-curated precedent research:
- Kenya School of Law, ODPC complaint 0608/2023: corrective action promptly taken, compensation declined in published determination.
- Kenploy Manufacturers, ODPC complaint 1585/2023: deletion and corrective action, closed as resolved.
- Legend Hotel, ODPC complaint 0466/2025: direct-marketing opt-out dispute, KSh 250,000 award in original ODPC determination; always check appeal status.
- Platinum Credit, ODPC complaint 0732/2025: reported dismissal; no assumption that all marketing complaints succeed.
- Platinum Credit v Data Protection Commissioner & another, High Court Civil Appeal E282 of 2025, judgment **25 May 2026**: appealed KSh 400,000 ODPC award set aside, including procedural-fairness concerns. Judgment: https://sheriahub.com/cases/ke/caselaw/platinum-credit-limited-v-data-protection-commissioner-another-2026-kehc-7257-klr .

An independent index, https://dataprotection.co.ke/determinations , can speed searching but is not the regulator and may have publication or selection bias. Do not derive universal win probabilities or predicted compensation from published decisions. The platform cannot know individual pending/unpublished case status without authorised correspondence from ODPC. The legal precedent dataset must store `decision_date`, `publication_date`, `primary_source`, `issue`, `odpc_finding`, `odpc_remedy`, `appeal_status`, `court_result`, and `verified_on`.

## 3. Legal architecture and correctly separated clocks

Primary legislation and implementing rules:
- Data Protection Act 2019: https://new.kenyalaw.org/akn/ke/act/2019/24/eng@2019-11-25 ; sections 25–32 on data-processing principles, lawful grounds and consent; data subjects' rights; s56 complaints; s65 compensation. Link latest consolidated version from Kenya Law before final deployment.
- Data Protection (General) Regulations, 2021: https://new.kenyalaw.org/akn/ke/act/ln/2021/263/eng@2022-01-14/source (check later amendments and current consolidated text). Reg 4 consent, reg 5 non-consent lawful bases, reg 8 objections, reg 9 data access, reg 12 erasure, regs 14–18 direct marketing, regs 39–48 international transfers, regs 49–53 DPIA.
- Data Protection (Complaints Handling Procedure and Enforcement) Regulations, 2021: https://new.kenyalaw.org/akn/ke/act/ln/2021/264/eng@2022-12-31/source ; regs 4 onwards filing, admissibility, notice, determination, withdrawal and ADR.
- Companies Act 2015: https://new.kenyalaw.org/akn/ke/act/2015/17/eng@2023-09-15/source ; registered company identity and registered office (s46).
- Advocates Act: https://new.kenyalaw.org/akn/ke/act/1989/16/eng@2022-12-31/source ; reserved legal practice and document work, notably ss31 and 34. Lawyer to vet fee/service scope before launch.
- ODPC registration/processing compliance: https://www.odpc.go.ke/ ; evaluate controller vs processor, registration exemptions, DPIA, contracts, cross-border transfers, records, retention, breach response.

Time rules should be immutable per request event, configurable when statutes change:

| Event | Clock | Source and meaning |
|---|---|---|
| Consumer sends access request | 7 days | General Regulations reg 9(4), clock starts when request received by company. |
| Consumer objects to direct marketing | 14 days | General Regulations reg 8(3), direct marketing objection absolute under reg 8(4). |
| Consumer requests erasure | Response within 14 days | General Regulations reg 12(3); erasure rights may have exceptions. |
| Restriction of third-party direct marketing disclosure | 7 days | General Regulations reg 18. |
| Complaint filed with ODPC | 7 days acknowledgement under complaint regulation | ODPC's manual/service charter refers to 7 **working** days. Track both and do not promise a fixed decision date. |
| ODPC initial respondent response | 21 days under Complaints Handling Regulation 11 | ODPC internal Manual also states 14 days, then 7 and 7 reminders; treat legal text as controlling and follow ODPC's notice in each case. |
| ODPC investigation | 90 days under Act s56(5) | Statutory deadline, not automatic decision or entitlement on expiry. |
| Determination notification | Regulation and charter set time after determination | Record actual communication. Charter references 7 working days; verify against regulations. |
| No response to ODPC inquiries | Manual describes potential lapse after 3 months | Warn consumer and operator on unanswered ODPC communication immediately. |

Some legal regimes allow the company to use a lawful basis other than consent for particular processing. A prior customer relationship does not automatically validate marketing. Never mark 'No consent recorded = definite offence'. Demand a legal basis and review facts. An opt-out right may still be decisive even if previous consent was valid.

ODPC complaints are free to lodge. The platform may charge separately for clear additional administrative/product services if lawful; it must not suggest its fee is an ODPC filing charge. Compensation for damage is distinct from regulatory fines, and an ODPC award is different from money actually received.

## 4. Company lookup and contact directory

The sender name displayed on a promotional SMS can be an alias and may belong to a service provider, agency, short code or registered business. Entity attribution needs source-backed verification.

Company research sequence:
1. Extract the SMS sender ID, domain/phone, URL (without opening unsafe links), message text and supplied brand.
2. Search previously validated `sender_alias` mappings. Produce candidates with `confidence`, never assert unknown attribution.
3. Check official brand website, privacy notice, terms, app-store owner, published DPO/complaints email and privacy contact. Preserve source links/snapshots.
4. Correlate with ODPC's registered-data-handlers registry where available.
5. For ambiguous legal identity or formal registered-office addresses, use Kenya Business Registration Service via eCitizen. Official company search/CR12 is listed at KSh 650 on the fee schedule, which also includes an apparently older conflicting figure; verify current payable amount before each search. https://brs.go.ke/fee-schedule-companies-registry/ . The CR12 alone will not guarantee a DPO email.
6. Verify that the candidate domain belongs to the legal entity; if uncertain, a trained operator confirms using independently sourced phone/contact channels. Do not invent `dpo@company.com` addresses or send identifying evidence to an unverified mailbox.
7. Store `entity_legal_name`, `trade_names`, `BRS_reference`, `registered_office`, `ODPC_registration_if_known`, `company_domains`, `verified_privacy_contact`, `source_url`, `reviewer_id`, `verified_at`, `expires_at`, `sender_aliases`.
8. If no validated contact is found, route to `COMPANY_RESEARCH` queue with deadlines; support direct ODPC submission where appropriate and user-authorised, not indefinite blocking.

Directory governance: two-person approval for high-impact mappings, periodic reverification, immutable provenance, self-service challenges by companies, no public accusations based on algorithmic matches. Build 'no verified email' as normal case state.

## 5. Recommended complete consumer journey

### A. Intake (self-service; 2–4 screens, not a long form)
1. Consumer sees choices: **Stop unwanted messages** / **Find out how my data was used** / **Both**. Clear independent service and ODPC free-filing notice.
2. Upload/share message screenshot or email; optionally type sender and date, verify phone control with OTP. Avoid requesting permission to read entire SMS inbox.
3. Consumer is asked what they know about prior registration, data consent, marketing opt-out and harms; 'I don't know' valid. Choose language English/Kiswahili and communication preference.
4. Provide confirmation with provisional PrivacyGuard case ID, expected next step and applicable consent/representation authority options.

### B. Evidence and attribution
5. Store original in private evidence storage; compute hash, process file safely, append audit events. AI extracts suggested fields but original is source of truth. Extracted text has `unverified` flag until confirmed.
6. Match company alias; if medium/low confidence queue operator. Never send sensitive ID or screenshots to unknown party.

### C. Company-first default (not prerequisite for ODPC)
7. Generate legally reviewed data-access and/or direct-marketing objection notice depending on consumer's chosen goal. Don't bundle erasure if user only wants marketing to stop or if preservation may be needed.
8. Show the company name, destination email, requested action and what identifying data will be disclosed. Get consumer approval, recorded timestamp and versioned authority.
9. Deliver via controlled email with unique case reply address and sender domain reputation protection; record accepted/bounced delivery and message ID. SMTP acceptance proves transfer to receiving infrastructure, not that a human read it.
10. Start **separate** legal clocks for access (7 calendar days), marketing objection (14 calendar days), erasure (14 response days), etc. An ambiguous acknowledged letter is not necessarily a complete response.

### D. Company reply and consumer resolution
11. Inbound email provider invokes webhook; validate integrity/signatures as supported, quarantine attachments, ingest original MIME, map to case alias and immutable event.
12. Classify reply: no response, bounce, acknowledgement, valid consent evidence claimed, refusal, opted out, unknown entity, correction, settlement offer, legal threat, hostile/ambiguous, or evidence requested.
13. Human reviewer assesses substantive consent/legal basis disputes, settlement terms and complex requests. AI may propose but not decide.
14. If company stopped marketing: record `REMEDY_REPORTED`, ask consumer if satisfied, and optionally review past illegality. Do not auto-close; no automatic compensation promise.
15. If consumer wants to close: confirm choice explicitly, record closure reason, preserve only legally necessary records within retention schedule, and show reopen/new case route.

### E. ODPC escalation
16. Permit direct escalation where urgency, harm, unlawful disclosure or company contact failure warrants it. Prior company contact is not universally required.
17. Produce ODPC-ready package: verified identities where necessary, respondent identity, complaint chronology, evidence inventory/hash, previous contact, requested remedy, material harm, missing information, signed authorised representation, cover letter and file index.
18. Human reviews completeness, potentially advocate for reserved legal issues. Consumer confirms ODPC filing/representation. Do not file without valid current authority.
19. **MVP submission manual/user-assisted** through official ODPC portal; collect the official email OTP from user as required. Admin records submission receipt separately from acknowledgement, then actual ODPC reference and admissibility status upon verifiable notice.
20. Track official evidence requests/response due dates; notify consumer and reviewer, preserve all ODPC communications. Reflect only actually known stages.
21. On determination, record type, remedy, any amount **ordered**, appeal or stay, actual verified receipt/payment. Do not close just because ODPC issued a decision if action remains pending.

### F. Grouping
Do not expose group-claim controls or auto-enrol in MVP. Internally deduplicate spam campaigns at aggregate level without making individuals' cases public. Later opt-in only if independently legal-reviewed.

## 6. State machine and event model

Proposed `cases.lifecycle_state`:
- `DRAFT`, `EVIDENCE_RECEIVED`, `ATTRIBUTION_PENDING`, `CONTACT_VERIFIED`, `AUTHORIZATION_PENDING`
- `COMPANY_REQUEST_QUEUED`, `COMPANY_REQUEST_SENT`, `COMPANY_DELIVERY_FAILED`, `COMPANY_RESPONSE_PENDING`, `COMPANY_RESPONSE_REVIEW`, `CONSUMER_RESOLUTION_REVIEW`
- `COMPANY_RESOLVED`, `UNRESOLVED`, `ESCALATION_REVIEW`, `ODPC_PACK_PREPARED`, `ODPC_SUBMISSION_AUTHORIZED`, `ODPC_SUBMITTED_UNACKNOWLEDGED`, `ODPC_ACKNOWLEDGED`, `ODPC_ADMISSIBILITY_PENDING`, `ODPC_UNDER_REVIEW`, `ODPC_ADR`, `ODPC_DETERMINED`, `ODPC_APPEALED`, `CLOSED`, `REOPENED`.

Model deadlines as standalone `obligations` records with `obligation_type`, `source_of_law`, `start_event_at`, `calendar_policy`, `due_at`, `evidence_of_receipt`, `status`, `waiver_or_exception`, `time_rule_version`. Do not change deadlines by arbitrary UI edits.

Separate source-of-truth event stream `case_events` with actor, action, case, timestamp, old/new status, document refs and permission/audit metadata. Never replace original incoming correspondence.

## 7. Detailed system modules and core data structures

**Frontend:** Next.js App Router, React, TypeScript, Tailwind and shadcn/ui, PWA; accessible WCAG 2.2 AA target; bilingual English/Kiswahili, clear swappable translations; design for low-bandwidth phones. Separate user/operations/legal workspaces in one repository, separate permission contexts.

**Backend:** Next.js server endpoints + Supabase Postgres with RLS; private Cloudflare R2 for evidence only after cross-border-transfer/DPIA assessment; Supabase Queues / pgmq + cron + Edge Functions for durable jobs; email vendor with incoming email webhook/aliases and outgoing domain; phone OTP via vetted Kenya-capable SMS provider; Daraja for optional paid administrative services. Store minimal PII. AI optional and disabled by default for raw sensitive uploads.

Core tables / modules:
- `users`, `profiles`, `user_auth_factors`, `consents_and_authorizations`
- `companies`, `company_brands`, `sender_aliases`, `company_contacts`, `source_verifications`, `company_research_tasks`
- `cases`, `case_participants`, `case_events`, `evidence_files`, `evidence_extractions`, `evidence_integrity_checks`
- `rights_requests`, `request_versions`, `obligations`, `outbound_messages`, `inbound_messages`, `email_delivery_events`
- `consent_claims`, `consent_artifacts`, `review_decisions`, `consumer_resolution_decisions`, `settlement_offers`
- `odpc_filings`, `odpc_correspondence`, `odpc_reference_numbers`, `odpc_decisions`, `appeals`, `compensation_receipts`
- `queue_jobs`, `job_exceptions`, `notifications`, `notification_preferences`
- `billing_orders`, `payment_events`, `refunds`, `audit_events`, `retention_actions`, `security_incidents`
- `precedent_index` (public decision metadata and source links, curated)

RBAC: consumer sees own cases only; verifier can see minimal brand/marketing evidence; case officer assigned cases only; legal reviewer limited assigned matters; supervisor manages exceptions; admin cannot casually decrypt all evidence; security auditor gets purpose-scoped event access. Enable RLS and server-side object authorization; no Supabase service-role key in browser.

## 8. Automation vs human checkpoints

| Process | Automation | Human approval/checkpoint |
|---|---|---|
| Create case, OTP, collect screenshot | Yes | Handle exceptional verification issues |
| Hash/store original | Yes | Security incidents, forensic dispute |
| Extract sender/date/message | Assisted OCR/AI | User confirmation for critical fields |
| Match company identity | High-confidence suggested matching | New/ambiguous links require verification |
| Find official company email | Search assist + verified directory reuse | First-time contact validation |
| Compose notice | Legally reviewed template auto-fill | Consumer approval and exceptional review |
| Send notice | Queued, after validated permissions | Hold on unverified recipient, legal/harassment exceptions |
| Ingest company reply | Webhook, MIME storage, attachment scanning | Reconciliation for unmatched messages |
| Classify response | Suggested category and summarisation | Consent proof, remedies, settlements |
| Send deadline alerts | Yes | Officer decides whether formal escalation warranted |
| Prepare ODPC pack | Yes | Consumer authority, completeness and legal review |
| Lodge ODPC complaint | No direct API assumed | Consumer or authorised human manually files in MVP |
| Register official ODPC ref | Can extract from inbox | Validate against genuine official acknowledgement |
| Interpret determination and appeal | Document extraction assistance | Legal/operator review; ensure correct finality |
| Close case | UI initiated, rule-assisted | Consumer acceptance for settlement or voluntary closure |

**Human work must be prioritised** by deadline proximity, verified harm severity, missing representation authorization, unverified sender attribution and ODPC request urgency. Operator dashboard should not be a giant spreadsheet: show new evidence, unknown companies, failed delivery, company reply awaiting analysis, ODPC deadlines, settlements and security exceptions.

## 9. Compliance, threat model and quality safeguards

- Review whether PrivacyGuard must register with ODPC as a data controller; do not assume an SME size exemption applies. Determine which processor agreements and subprocessor notices are necessary.
- Complete DPIA and cross-border data-transfer assessment; R2 and outside-Kenya infrastructure may require legal safeguards and/or alternative Kenyan/regionally appropriate storage. Consider storing proof-of-ID with higher protection/shorter retention.
- Clearly distinguish privacy rights notice, separate consent to service processing, delegated authority to contact company, delegated authority to file ODPC, and express settlement approval. No default checkboxes bundling them.
- Content minimisation: no SMS inbox permissions, no bulk reading of WhatsApp, no copy of user's entire phonebook. Never publish complainant names, phone numbers or company allegations in public dashboards.
- Security: 2FA for operators, encryption, private buckets, presigned limited URLs, file type and malware scans, append-only audit, monitoring, backup and restore tests, security incident response, RLS regression tests, abuse/rate limiting and phone/email verification.
- Chain of custody: originals, hash, time received, source identity, parsing/version history; do not claim the hash alone authenticates sender.
- Avoid pro forma compensation claims. A regulatory penalty is not the user's compensation; award not equal payment. Document appeal/stay status.
- Draft legal correspondence and fee structure should be reviewed by a Kenyan practising advocate; unauthorised practice and use of claimant evidence are real business risks even when ODPC permits self-representation.
- Independent brand, no official ODPC affiliation implied. Consumer-facing disclosure: 'ODPC filing is free; PrivacyGuard optional assistance costs are separate.'
- All deadlines are based on the exact law/policy version, triggering receipt and timezone/calendar choice; distinguish seven calendar days vs seven working days service standard.

## 10. Product rollout plan, with deliverables and acceptance gates

### P0 — Legal and operations foundation
Deliver: independent advocate-reviewed scope, privacy & security assessment, ODPC registration assessment, verified statutory clock catalogue, ODPC CIE liaison questions, complaint templates v1, retention schedule, incident plan, company-contact verification standard. Gate: signed off by legal/compliance before live consumer evidence.

### P1 — Mobile individual reporting
Deliver: PWA, English/Kiswahili, phone OTP, simple goal selection, screenshot upload, consent/authority capture, secure evidence vault, user case status. Gate: nontechnical testers can file draft in a few minutes, low-bandwidth testing, identity scopes and original evidence integrity tests.

### P2 — Company registry, response and reminder engine
Deliver: branded sender aliases and verified legal entity mapping; manual research queue; independent company contact repository; notice generator; outbound email with unique case alias; inbound replies, bounce processing, separate rights deadlines and notifications; queue/outbox reliability. Gate: never sends to unverified email, duplicates never trigger second letters, replies are matched correctly, deadline engine passes date-boundary tests.

### P3 — Review, closure and ODPC pack
Deliver: reviewer work queues, consent assessment, company resolution-confirmation workflow, company response viewer, PDF complaint package matching portal inputs, explicit ODPC filing authority, manual official filing & acknowledgement capture, ODPC inbound correspondence, outcome taxonomy and appeals field. Gate: no false 'official filing' claim before proof; no closure solely because company stops; unauthorized submission blocked; complicated matters route to human.

### P4 — Pilot and operational readiness
Deliver: invitation-only pilot, help scripts, KPIs, dispute/error monitoring, backup recovery test, privacy review, messaging deliverability review, KPI dashboard, failover and rollback. Gate: demonstrate end-to-end operations and regulator updates in a representative number of real consented cases, legal review of all templates and terms, publish support and complaint channels.

### P5 — Growth and optimisation (post-MVP)
Deliver: curated precedent database, optional AI extraction with redaction, improved company discovery, service fee billing/M-Pesa, advocate escalation and eventually permitted ODPC integration if agreed. Group claims remain parked.

**Critical priorities:** fix identity and secure evidence, company verification, safe outbound/inbound email, explicit authorisations, accurate clocks, official filing statuses **before** predictive AI, group litigation or automation of official portal submissions.

## 11. Required regression scenarios
1. Consumer reports marketing from a brand, no known legal entity → research queue, no outbound notice.
2. One sender ID maps to two registered companies → ambiguous case held, admin sees provenance.
3. Valid prior marketing consent, but consumer opts out → objection enforced even if earlier permission existed.
4. Company says stop but customer seeks review of historical conduct → case does not auto-close.
5. Company claims stop but another promotional message arrives → store new original evidence and reassess.
6. Company email bounces → not marked delivered; contact research/fallback.
7. Inbound fake email purporting to be company DPO → quarantine and source/authentication checks.
8. Multiple jobs retry on one case → exactly one letter, idempotent notifications.
9. User withdraws company-contact authorisation before sending → queued message cancelled.
10. Company offers payment and waiver → human legal review; never auto-accept.
11. ODPC complaint submitted but no reference → 'Submitted / awaiting acknowledgement' only.
12. ODPC requests documents but consumer is unresponsive → urgent reminders and officer escalation.
13. ODPC grants award, High Court later sets aside → update appeal and enforceability, never show guaranteed receipt.
14. User asks deletion → assess record retention and lawful exceptions; clear explanation.
15. Two users complain against same company → case data isolated, no group enrolment.
16. Consumer's phone lost/OTP hijack → recovery and manual anti-fraud process.
17. Low-memory Android, unstable 3G, English/Kiswahili → progressive save, no data loss.

## 12. Operating metrics
Measure evidence completion rate; percentage of sender mappings verified; median time to verify new company; notices delivered/bounced; company substantive reply rate; deadline breaches; resolution acceptance rate; ODPC packs submitted/acknowledged; regulator additional-document requests responded to; time per manually reviewed case; appeal reversals; actual compensation received vs ordered; customer satisfaction; cost per case. NEVER use published decision win rates as probability forecasts.

## 13. Questions to send to ODPC CIE
1. Is the official complaint portal the preferred channel for authorised representatives? Which email address is currently valid for submission and for post-filing updates?
2. Which identity, signed authority and case-identifying material must an authorised representative attach? What electronic signature formats are acceptable?
3. Is there a safe supported machine/API integration or approved structured intake for representative-assisted complaints?
4. How are acknowledgment, admission, respondent replies, ADR and determinations communicated, and is any status lookup permitted to a representative?
5. How are timeframes interpreted where statutory and internal manual periods differ (e.g., respondent 21 days under the regulations versus manual 14+7+7)?
6. What is the recommended process when a complaint involves an unknown controller or a marketing aggregator?
7. How should cases with a confirmed opt-out but unresolved historical misuse be framed?
8. Do you publish aggregate open/closed/withdrawn/ADR performance data and any controlled access to redacted decisions?

## 14. Proposed first Codex implementation prompt
```
Read this entire PrivacyGuard regulatory/development blueprint and the existing UI/UX specification before touching code. Do not implement group claims, compensation prediction, native apps, scraping/auto-submitting the ODPC portal or advanced AI. Start with Phase P0: produce an auditable gap analysis, database schema, RLS policies, state machine, event-driven obligations table, notification architecture, data flow, threat model and test plan. Identify current frontend/backend repositories and reusable components. Return an ordered plan and files to change; do not start coding until scope is approved. All human/official validations must be real, not cosmetic UI states. Next phase must be expressly authorised by the owner. Keep every case isolated per consumer and every legal deadline traceable to a triggering event and source of law.
```

---
### Source directory / further verification
- ODPC official portal: https://cie.odpc.go.ke/Complaint
- CIE forms: https://www.odpc.go.ke/c-i-e/
- Complaints management manual: https://www.odpc.go.ke/wp-content/uploads/2024/02/ODPC-Complaints-Management-Manual-1.pdf
- Service charter: https://www.odpc.go.ke/wp-content/uploads/2025/05/ODPC-Service-Charter-English-2025.pdf
- ODPC determinations: https://www.odpc.go.ke/determinations/
- ODPC 18 March 2025 public caseload statement: https://www.odpc.go.ke/odpc-urges-public-to-report-personal-data-misuse-cases-to-protect-their-rights/
- General Regulations: https://new.kenyalaw.org/akn/ke/act/ln/2021/263/eng@2022-01-14/source
- Complaints Handling Regulations: https://new.kenyalaw.org/akn/ke/act/ln/2021/264/eng@2022-12-31/source
- BRS official search fees: https://brs.go.ke/fee-schedule-companies-registry/
- Court judgment example: https://sheriahub.com/cases/ke/caselaw/platinum-credit-limited-v-data-protection-commissioner-another-2026-kehc-7257-klr

**Research caveats:** The search covers the official reporting mechanisms and representative published determinations/operational rules, not every private or pending complaint. References to dates, form availability, contact details, thresholds and legal versions require refresh at launch. This document is not a substitute for Kenyan legal advice.
