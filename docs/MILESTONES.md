# PrivacyGuard Kenya milestones

| Milestone | Status | Evidence |
|---|---|---|
| v6 handoff captured | Baseline preserved | [Original interactive prototype](../prototype/v6/prototype/index.html), [original review launcher](../prototype/v6/OPEN_DESIGN_REVIEW.html) and [archive hash record](audit/evidence/baseline_integrity.json). All 30 original files match their recorded hashes. |
| Independent audit and refined design | Approved for development | [Audit](audit/README.md), [design comparison](audit/mockups/index.html), [feature matrix](audit/06_FEATURE_ALIGNMENT.csv) and [original decision register](audit/10_OWNER_DECISIONS.md). |
| Phase 0 research | Complete per owner | [Phase 0 artifacts](phase-0/README.md), including English and Kiswahili rehearsal cards, clearance brief, draft DPIA and workflow tabletop. Participant data and professional sign-off records are outside this repository. |
| Phase 1 description intake and staff screening | Verified in local sandbox | Save and resume, one receipt per submitted revision, one reviewer claim, follow-up and activity history. PostgreSQL tests cover two consumer and two staff identities. [Test code](../tests/intake.test.ts) |
| Phase 1 prototype alignment | Verified in local sandbox | v6 navy and teal, shield and navigation adapted to the case-first layout. [Mobile dashboard](../evidence/mobile-case-home-v6-aligned.png) and [desktop privacy view](../evidence/privacy-desktop-v6-aligned.png). |
| Phase 1 privacy requests and decisions | Verified in local sandbox | Case-scoped copy and deletion intake, role-separated assignment, 24-hour copy availability, reviewable holds, sandbox removal and copy invalidation. The browser download contained only the selected fictional report. See [copy-ready screen](../evidence/case-copy-ready.png), [tests](../tests/intake.test.ts) and [run instructions](../README.md). |
| Phase 1 identity preview | Provider configured and local checks passed | Invite-only signup, exact loopback callback and reachable Supabase Auth endpoint. The preview verifies signed claims and fresh eligibility. Automated checks cover staff TOTP policy and the SDK code exchange against a mocked Auth service. [Identity preview](IDENTITY_PREVIEW.md) |
| Phase 1 Auth email delivery | Verified with one test invitation | Owner saved custom SMTP. Supabase created the invited identity and Resend marked the invitation Delivered. Acceptance, live sign-in, staff TOTP and case access integration remain pending. [Identity verification sequence](IDENTITY_PREVIEW.md) |
| Phase 1 release gates | Pending | Verified identities and staff MFA, provider and private storage integration, real-data approvals, retention, recovery and a restore drill that reapplies deletion decisions after the backup snapshot. |

Update this file when evidence changes. Use **verified in local sandbox** for results with fictional data. Use **accepted** for a phase only after its documented checkpoint is met.
