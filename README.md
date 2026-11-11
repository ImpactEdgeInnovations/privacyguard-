# PrivacyGuard Kenya

Phase 1 development sandbox for private, description-only intake and assigned staff screening. It implements the first part of the approved [candidate build brief](docs/phase-0/03_PHASE_1_BUILD_BRIEF.md) in a separate application workspace.

The [v6 UI prototype](prototype/v6/prototype/index.html) is the visual reference. The shield, navy and teal palette, card layout and mobile navigation come from v6. The [approved boards](docs/audit/mockups/index.html) specify the simpler case-first home and case-scoped Privacy screen. The same references are recorded in [AGENTS.md](AGENTS.md).

The [reviewer handoff record](docs/REVIEWER_HANDOFF.md) describes returning a task, the access boundary and the verified screens.

Start with the [current roadmap](docs/ROADMAP.md) and [milestones](docs/MILESTONES.md). The [audit](docs/audit/README.md), [Phase 0 materials](docs/phase-0/README.md) and [original handoff](prototype/v6/README.md) sit alongside the implementation.

## Run locally

Use Node.js 22.16 or newer.

```sh
npm ci
npm run dev
```

Open [http://127.0.0.1:8767](http://127.0.0.1:8767). Choose **Consumer A**, save a fictional report, then submit it. Switch to **Reviewer A**, claim the task and ask for a detail or complete screening. Switch back to the consumer to see the request. Consumer B and Reviewer B are separate fixture identities for access checks.

The sandbox binds to loopback and uses selectable fictional accounts. Keep real reports and personal details out of this environment. It stores fixture records in an embedded PostgreSQL database under `.local-data/postgres`. Restart the server after changing the SQL schema. To start an isolated data set, set `PRIVACYGUARD_DB_PATH` to a new local directory before starting the server. Move aside the old data directory while the server is stopped if you need to keep a copy.

The separate [identity preview](docs/IDENTITY_PREVIEW.md) starts with `npm run identity:dev` and verifies sessions against the configured Supabase project. It includes first authenticator setup for enabled staff and privacy reviewers. See the [setup evidence and assisted recovery specification](docs/ACCOUNT_RECOVERY.md). It ends at the access check. The fictional case workspace uses its own database and fixture sessions.

## Implemented

- **PG03 / PG05:** Save, revise and submit description-only reports. Sender and date are optional. The submitted revision has one receipt and one staff task.
- **PG09:** Private case list, next action, recorded status and activity.
- **PG14 / A03 (sandbox privacy):** Choose a report in Privacy and request a copy or deletion review. Switch to **Privacy Reviewer** to take the request and make a decision. A copy approval opens a 24-hour download window. The sandbox checks the current session and case on each download. A hold records a consumer-visible reason and review date. Removing a fictional case invalidates its copy link and removes its case body, activity and screening task while retaining the request receipt and deletion record.
- **PG15 / PG20 / PG21:** Routing-only unassigned queue, atomic claim, assigned review, request and reply, screening completion.
- **PG23 (local subset):** Server-side role checks, PostgreSQL row-level policies, opaque revocable fixture sessions and separate consumer/staff scopes.
- **A07 (local subset):** Responsive English screens, labelled forms and keyboard focus styles. Complete language review is pending.

The case and task writes are transactional. The local app uses [PGlite](https://pglite.dev/docs/filesystems) as an embedded PostgreSQL adapter because Docker and the Supabase CLI are unavailable on this computer. The private schema and runtime role are in [db/intake.sql](db/intake.sql). The schema is currently a sandbox bootstrap. The target Supabase migration, Auth, staff MFA and private object storage need integration and tests in a dedicated environment.

## Verification

```sh
npm test
npm run build
python3 docs/audit/data/validate_audit.py
```

Integration checks exercise report isolation, concurrent submissions and claims, case activity, lossless follow-up at the description limit, invalid dates and session revocation. Privacy tests cover case scope, role separation, release and retrieval, holds, removal and invalidated links. Browser layout checks cover 360px and desktop.

## Next Phase 1 work

1. Integrate verified consumer sign-in, staff MFA, account recovery and role offboarding against the selected environment.
2. Add quarantine, private object retrieval, scanner and evidence restrictions, with tests for version-specific release.
3. Validate privacy request handling with verified identities, approved retention and a restore drill that replays deletion records from after the backup snapshot. The embedded database records removal but does not establish recovery from an older backup.

Real-data pilot and deployment remain separate release decisions under the roadmap. Legal and privacy evidence should be attached at that checkpoint.
