# Draft privacy impact assessment for private intake

**Scope:** First private intake and assigned review workflow, including the export and deletion controls needed for the Phase 1 milestone.  
**Assessment owner and entity:** To be assigned.  
**Decision:** Draft for privacy lead and Kenyan advocate review. Treat the workflow as potentially high risk until they assess the actual processing. A screenshot can reveal information about people who never signed up, including unrelated private or sensitive information. The [ODPC DPIA guidance](https://www.odpc.go.ke/wp-content/uploads/2024/02/ODPC-Guidance-Note-on-Data-Protection-Impact-Assessment-1.pdf) and [Data Protection Act, section 31](https://kdic.go.ke/sites/default/files/2021-07/TheDataProtectionAct__No24of2019.pdf) inform this assessment.

## Processing and necessity

Use a description-first-capable intake so a person can ask for help without supplying a screenshot. Keep the description, date or unknown date, channel, optional sender and desired outcome. The reviewer assesses whether these facts are sufficient for the requested help. Request one additional item only when its absence prevents review. Preserve “reported sender” as a claim and retain a record of corrections. The service can use these facts without collecting government ID, address books or a complete conversation history.

| Flow | Minimum information and proposed access | Decision needed |
|---|---|---|
| Verify and recover an account | One consumer-selected contact channel, verification state and security events. Verification provider receives only the destination and delivery data needed for the code. | Confirm provider, regions and anti-takeover procedure, including shared email or a recycled number. |
| Save a report | Browser holds the unsaved draft for the current session. Save to the verified account after an intake notice. Reviewer receives case content only after assignment. | Confirm the service entity, purpose and lawful basis. Consider necessity for delivery of the service and assess third-party data separately. |
| Attach an optional screenshot | Preview locally with a crop/redact instruction. Transfer the selected file to quarantine, with restricted scan processing. Release the cleared review version to the assigned reviewer only after scan and checks. | Confirm permitted file types, size, safe rendering, the exceptional original-access process and removal of incidental ID or sensitive content. |
| Route, review and notify | Route on task type, age and assignment. Assigned reviewers record fact corrections or a specific evidence request. Consumer updates contain a generic alert and an authenticated link. | Document staff permissions, audit use, support access, notification providers and any legitimate-interest assessment for security. |
| Export, delete and restore | Reverify the requester when proportionate. Deliver a scoped export. Reconcile stored records and objects on deletion. Replay deletion records before restored data becomes available. | Verify rights workflows and deadlines, export exclusions, retention triggers, hold authority, backup locations and deletion lag. |

The intake dataset, research recruitment contacts and moderator observations are separate flows. Research scenarios use fictional case details. For live moderation, document who may view scheduling contacts, where session notes are stored, the handling of participant consent to research activities and the deletion schedule before recruitment. Prefer coded notes over recording and avoid asking participants to show their own inboxes. Confirm the lawful basis and notice separately.

## Risk and evidence register

Ratings describe the concern before controls. Residual risk stays **unassessed** until the privacy lead has the final design, implementation evidence and actual provider arrangements.

| Risk | Exposure | Proposed safeguard | Evidence required |
|---|---|---|---|
| R01 Incidental third-party, ID or sensitive data | High | Optional attachments, preview and minimisation, scoped quarantine and a removal path with minimal action records. A clean malware scan does not establish that the content is appropriate for review. | Walk through an incidental ID fixture, confirm restricted access and reconcile removal across objects, logs and backups. |
| R02 Disclosure between cases or through staff access | High | Session-derived case ownership, assigned staff access, MFA, minimal unassigned queue details, documented exceptional access. | Role/assignment checks for case and object reads, session revocation and audited exceptional access. |
| R03 Recovery takeover or disclosure on a shared device | High | Neutral recovery messages, rate limits, renewed verification for sensitive actions and explicit review when contact ownership is uncertain. | Simulated lost contact, reassigned contact and shared-device exit scenarios. |
| R04 Transfers or vendor support access without a documented basis | High | Map hosting, subprocessors, logs, support, scanners and backups. Select locations and controls after review of actual contracts and access paths. | Named vendors and regions, processor terms, retention evidence, transfer assessment and approved alternative. |
| R05 Deletion fails or restored data returns | High | Track deletion for each object and record, scope holds, expire export access and replay deletion tombstones after restore. | Reconciled deletion and restore drill with held and released records, measured recovery targets. |
| R06 Unfair rejection or misleading status | Significant | Keep reported facts and reviewer decisions separate. Explain missing evidence and offer correction or help. Publish only recorded intake and review states. | Description-only and unknown-sender scenarios, correction path and consumer comprehension test. |
| R07 Abuse or unsafe file handling | High | Private quarantine, content limits and isolated scanning. Route failures and unexpected objects to an owned task. | Safe test fixtures covering interrupted uploads, failed scans and blocked review access. |

## Completion record

| Input or decision | Owner to assign | Evidence to attach |
|---|---|---|
| Controller details, volume and audience | Project owner | Legal entity, staff roles, proposed participant and pilot caps, expected files per report, forecast and exclusions. |
| Bases, rights and transparency | Privacy lead and advocate | Basis by purpose, assessment for third-party/sensitive data, approved notices, supported rights and escalation route. |
| Retention and vendors | Privacy and technical leads | Approved schedule, vendor and transfer register, contracts and deletion/restore evidence. |
| Consultation and risk acceptance | Privacy lead and accountable owner | Stakeholder input, residual ratings, approval record and any submission or consultation evidence required under section 31. Record the permitted date for processing after review. |

Reassess when evidence categories, participants, vendor locations, scale or service scope change. Record consumer and reviewer feedback from Phase 0 after moderation. The [clearance brief](01_CLEARANCE_BRIEF.md) tracks the remaining legal decisions, and the [build brief](03_PHASE_1_BUILD_BRIEF.md) specifies the acceptance tests.
