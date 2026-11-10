# Phase 1 candidate build brief

**Draft for the roadmap checkpoint.** The first slice proves private intake, assigned review and recovery of the consumer's records. A second slice completes the remaining Phase 1 privacy and operations controls before acceptance. Use synthetic fixtures in the development environment.

| Slice | Matrix IDs | Screen and source |
|---|---|---|
| 1A Entry, verification and intake | PG03, PG05, PG07, A01, A07 | B01 entry and B03 intake. Add verification, expired-code, draft-resume, upload failure and scan-pending states. |
| 1A Case home and review | PG09, PG15, PG20, PG21, PG23 | B02 case home, B09 queue and B10 case detail adapted to intake. Show the reported goal, evidence sufficiency, task and audit history. |
| 1B Privacy and service controls | PG08, PG13, PG14, PG23, A02, A03, A06, A07 | B08 export/deletion/hold status, B09 task routing, account recovery and accessible help. Limit Phase 1 permission records to actions available in Phase 1. |

Use the [mockup boards](../audit/mockups/index.html) and the [feature alignment matrix](../audit/06_FEATURE_ALIGNMENT.csv) as references. Case home shows the next task or confirmed save. Status must distinguish draft, received, awaiting scan and reviewer action. Description, sender, received date or unknown date, channel and goal survive resume and submit. Use a short privacy notice before evidence is sent to the service. Allow help and a safe exit for users outside the approved pilot audience.

## Proposed service contract

| Operation | Data and transaction | Access boundary |
|---|---|---|
| Create or resume draft | Persist case owner, version, typed description, claimed sender, nullable local received date, channel and goal. A lost save response can be retried with the same idempotency key. Concurrent edits use a version check and surface a conflict. | Require a verified account before server persistence. Resolve ownership from the session. Return the same unavailable response for absent and inaccessible case records. |
| Add evidence | Reserve a unique object ID under the case. Use private quarantine, verify received size/type and checksum, and enqueue a scan after confirming the object exists. Save the scan result against that immutable version. Record provenance for redacted copies. Route failed scans and privacy restrictions to a specific task with a clear replacement or description-only option. | Case owner may initiate an upload. A narrowly scoped worker may process it. Ordinary review access requires the correct version to be clean and unrestricted. Use a separate privacy review path for restricted content. |
| Submit for review | In one transaction, move the draft to triage, store a receipt bound to the submitted revision, and create an intake task and event. Replay the same receipt for a repeat of that revision. Later corrections use a separate workflow. | Owner of the draft. Require the expected revision for the initial submit. The receipt confirms saved intake. Evidence has a separate readiness status. |
| Claim and review | A task claim is atomic. Record the reviewer, decision reason and referenced evidence version. A missing-evidence decision creates a consumer action. Reassignment removes prior reviewer access. | Staff session with MFA and assignment for case detail. Unassigned queue shows minimal routing metadata. Supervisor exceptions require reason and audit evidence. |
| Export or delete | Store verified request, scope, decisions and job receipts. Create expiring export access and invalidate affected exports when approved deletion or scope changes. Reconcile primary objects, temporary exports, held records and deletion records. Show completion only after reconciliation. | Consumer requests own data. Privacy role handles the assigned request. Treat contact change and export as sensitive actions with renewed verification. |

Use case-scoped authorization both at the service and database boundaries. For asynchronous work, commit the requested transition and work record together. Workers use bounded retries and route unresolved items to a named queue. Audit case reads, exports, task assignments and privacy decisions without storing message bodies, signed URLs or codes in logs. Treat the provider choice and RPO/RTO as provisional until D05/D07 are resolved. See the [architecture and privacy audit](../audit/07_ARCHITECTURE_PRIVACY_SECURITY.md).

Check the active session, case scope and current assignment or export scope on each new protected read, including file retrieval. Document the handling of copies already received by an authorised person. Before reopening a restored environment, verify that the team can recover and apply relevant deletion decisions after the backup snapshot through the chosen recovery cutoff. If that history cannot be recovered, keep the affected data inaccessible pending reconciliation. See the [workflow tabletop](05_WORKFLOW_TABLETOP.md).

## Acceptance evidence

1. Two fictional accounts create cases. Each account sees only its own records and evidence. Staff can view only authorised detail, and revoking access removes it on the next request.
2. Submit a description-only report. Retry after a lost response. Confirm a single receipt, one queue task and matching filters and counts. Date and goal match the saved draft.
3. Exercise interrupted upload, rejected file, retry and delayed scan. A replacement receives its own scan and remains blocked while pending. Restrict a clean fixture after a privacy concern is identified and verify the ordinary reviewer and export views respect that change.
4. Verify recovery and offboarding with synthetic identities. Expired and revoked sessions fail. Support replies avoid sensitive details on unauthenticated channels.
5. Verify the export contains only the intended subject and permitted records. Complete deletion with and without a scoped hold and verify that affected earlier exports become unavailable. Restore database and object inventory from before a deletion and reconcile decisions after the snapshot before access resumes. Capture measured recovery time and data loss.
6. Walk the intake, recovery and privacy actions on a 360px screen and with keyboard-only navigation. Review all selected locale strings, validation errors and status announcements.

Start implementation in a separate application workspace. Keep each slice independently reversible. If the synthetic environment must be reset, disable intake and workers, revoke active sessions and clear test data using the documented reset procedure. For a later pilot, pause writes and workers first, preserve the required audit and hold records, and reconcile queued jobs and object inventory before reopening.

Company contact, official tracking, payments and automated legal decisions sit outside this Phase 1 brief. Before build approval, attach named owners, the cleared data flow, copy and design versions, applicable privacy evidence, budget and recovery targets. The Phase 0 [clearance brief](01_CLEARANCE_BRIEF.md) lists the evidence owners should return.
