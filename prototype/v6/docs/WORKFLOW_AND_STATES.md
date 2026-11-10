# Workflow and state machine — source of truth for case lifecycle

## Roles
Consumer; verifier; case officer; supervisor; legal reviewer (as required); automated background worker; external company; ODPC (external—not a PrivacyGuard staff role).

## Stage A — Intake and evidence
`DRAFT → READY_FOR_SCREENING → NEEDS_MORE_EVIDENCE | SCREENING_IN_PROGRESS → SCREENED | REJECTED_WITH_REASON`.
- Save user declaration and processing transparency record; internal screening is not a finding of authenticity.
- Hash and preserve original evidence, provenance, timestamp and secure chain of access. File scanning before any staff download.
- `REJECTED_WITH_REASON` requires an explained process for user correction/appeal; do not equate an ML risk signal with fraud.

## Stage B — Company-first request (default, optional bypass)
`SCREENED → COMPANY_UNVERIFIED | COMPANY_VERIFIED → AWAITING_COMPANY_CONTACT_AUTH → NOTICE_READY → NOTICE_QUEUED → SENT_TO_PROVIDER → ACCEPTED_BY_MAIL_SERVER | BOUNCED | DELIVERY_UNKNOWN → AWAITING_COMPANY_REPLY → RESPONSE_RECEIVED | RESPONSE_PERIOD_ELAPSED`.
- This company-first sequence is **not a universal precondition** to ODPC filing; severe/urgent or uncontactable entities may have reviewed bypass.
- `SENT_TO_PROVIDER` is not 'read'; `ACCEPTED_BY_MAIL_SERVER` is not confirmation of actual person reading. A bounce cannot be 'delivered'.
- Before notice dispatch: screening approval, legal company/contact verified, template approved, exact authorisation in force, no duplicate dispatch key.
- Each rights request can have a separate legally sourced deadline clock; no one-size-fits-all 14-day countdown.

## Stage C — Resolution decision
`RESPONSE_RECEIVED | RESPONSE_PERIOD_ELAPSED → RESPONSE_REVIEW → AWAITING_CONSUMER_DECISION → CLOSED_BY_CONSUMER | CLARIFICATION_REQUESTED | ESCALATION_REQUESTED`.
- If the company stops marketing, record **COMPANY_SAYS_STOPPED**, not 'resolved'. Consumer makes closure decision.
- Consent evidence, loss/distress, claimed violation, company remedy and willingness to close are separate facts.
- Settlement, rights waiver and any payment require specific consumer approval and legal review.

## Stage D — ODPC preparation and handoff
`ESCALATION_REQUESTED → ODPC_PACK_DRAFT → PACK_HUMAN_REVIEW | PACK_READY → AWAITING_FINAL_CONSUMER_APPROVAL → APPROVED_FOR_SELF_FILING → AWAITING_CONSUMER_SUBMISSION → CONSUMER_REPORTS_SUBMISSION_UNVERIFIED → OFFICIAL_ACKNOWLEDGEMENT_VERIFIED → ODPC_INVESTIGATION → ODPC_OUTCOME_RECORDED → [APPEALED / CLOSED / COMPENSATION_RECEIPT_VERIFIED]`.
- A case pack generated is not filed. A consumer-entered reference is unverified until supported by official evidence.
- Customer submits official ID directly to ODPC under MVP; no ID image field or logging in PrivacyGuard.
- No undocumented API, unattended regulator form posting or fabricated portal statuses.
- `COMPENSATION_ORDERED` and `COMPENSATION_RECEIVED` are distinct, as are regulatory penalty and customer award.

## Cross-cutting workflow events
`AuthorizationGranted`, `AuthorizationWithdrawn`, `EvidenceUploaded`, `EvidenceReviewed`, `CompanyContactVerified`, `NoticeQueued`, `NoticeSent`, `EmailAccepted`, `EmailBounced`, `CompanyReplyReceived`, `DeadlineElapsed`, `ConsumerDecisionRecorded`, `ODPCPackGenerated`, `ConsumerReportedFiling`, `ODPCAcknowledgementVerified`, `ODPCRequestReceived`, `ODPCReplySubmitted`, `ODPCDeterminationVerified`, `AppealRecorded`, `PaymentReceiptVerified`, `RetentionAction`, `SecurityIncident`.

## Case data model invariants
- Case belongs to one consumer by default; each case has own authorisation grants and withdrawals.
- Any external send requires the **specific** live authorisation and verified recipient at send-time, not merely when queued.
- State updates are based on audited events with actor, timestamp, source, provenance and prior state.
- Pending job must be cancellable before dispatch if authorisation withdrawn.
- A regulator inquiry must create an actionable deadline; no silent lapse.
- A UI timeline must not infer an external event from elapsed time alone.

## Company vs ODPC progress UI
Company progress = evidence reviewed → company verified/authorised → notice sent → response reviewed or time elapsed → consumer decision.
ODPC progress = pack approved → user files officially → official acknowledgement verified → investigation/requests → official outcome (optional appeal/receipt follow-up).
Do not portray fixed percentage of an unpredictable external legal process as guaranteed time-to-completion.
