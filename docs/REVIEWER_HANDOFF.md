# Reviewer task handoff

**11 November 2026 · Verified in the local fictional workspace.** This implements the voluntary task-return portion of feature-matrix entries PG20, PG21 and PG23, with the mobile check from A07. The screens use the existing v6 navy and teal palette, case cards, work queue and activity timeline. No live Supabase application schema or real case data was changed.

## Behaviour

An assigned reviewer can open an active case and expand **Return this task to the work queue**. They select availability, capacity/workload, another reviewer's expertise or another operational reason. The server requires the staff role, current assignment, an active review state and the expected case revision.

One transaction increments the case revision, appends a return event with actor, reason and time, and returns the task to the unassigned queue. The previous assignee loses access to the case and its activity on the next request. Unassigned routing shows the case reference and **Returned for review**, without the description or unanswered question. The original task creation time is retained for future aging controls.

The next reviewer claims through the existing atomic claim operation. The claim preserves the case's current review state. An unanswered consumer question remains open, and the consumer can reply while the task awaits a new reviewer. The next assignee receives that reply through the persisted case history. Returning a task preserves the original description, submitted revision and receipt.

A stale form cannot return a newly claimed or changed task. Repeated returns append one successful return event. Completed tasks cannot be returned. The same unassigned task can have only one winning claim. A consumer's case copy includes the recorded return event and its reason category.

A former assignee may claim an unassigned task again through the normal queue. Administrative offboarding, conflicts requiring reviewer exclusion and forced reassignment require separately reviewed controls. This voluntary return flow does not suspend an identity. Case access in this workspace still uses fictional sessions, independently of the Supabase identity preview.

## Verification

All twelve automated tests, the production build and twelve audit-integrity checks passed. The original thirty v6 files match their recorded hashes.

The [handoff tests](../tests/handoff.test.ts) cover wrong roles, invalid reasons, wrong assignees, stale revisions, duplicate returns, competing claims, current scope, preserved follow-up, consumer replies while unassigned, completed-task denial, copy contents and persistence after reopening the database.

The browser check used a separate temporary database containing a fictional report. Reviewer A returned a task awaiting a consumer reply. Their old case URL then showed **Report unavailable**. Reviewer B claimed the task and saw the same question and the recorded return reason. The 360px view had a 360px document width. No invitation, real account, provider role or authenticator was changed during this check.

Review these screens in order.

1. [Desktop task-return control](../evidence/task-return-desktop.png)
2. [Mobile task-return control](../evidence/task-return-mobile.png)
3. [Returned queue and count](../evidence/task-returned-queue-mobile.png)
4. [Former reviewer access denied](../evidence/task-return-access-denied-mobile.png)
5. [Next reviewer with preserved history](../evidence/task-handoff-next-reviewer-desktop.png)

## Remaining acceptance work

Live invited sign-in and staff MFA remain pending. The approved test invitation is still unconfirmed, with no recorded sign-in, as checked read-only in Supabase on 11 November 2026. Protected case integration, supervised offboarding and reassignment, assisted account recovery, attachment quarantine and restore reconciliation remain Phase 1 release gates. Continue using fictional reports during development.
