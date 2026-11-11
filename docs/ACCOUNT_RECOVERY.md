# Account recovery and authenticator setup

**11 November 2026 · Development specification.** First authenticator enrollment is implemented in the isolated identity preview. Administrative recovery, device replacement and the operational record described here remain pending. No real account was reset during development.

## What the preview supports

An administrator must first enable the invited, email-confirmed account and assign its role in server-owned app metadata. Staff and privacy reviewers with no verified factor can then start TOTP setup after email sign-in. The setup screen presents a QR image and a manual key. A valid six-digit code completes provider verification. Access is checked again on the next page using signed claims and the current user record.

The setup key is returned only to the enrolling browser, held in the current component state and displayed on demand. It is absent from URLs, application cookies, repository data and application logs. The identity routes send private, no-store and no-referrer headers. Real setup screens must not be captured in telemetry or screenshots. The committed UI evidence uses a synthetic key and an image marked TEST.

Failed verification retains the current setup screen so the user can enter another code. Cancel removes only the current user's unverified factor created by this preview. Restart removes only abandoned, unverified factors bearing this preview's label. A reload loses the displayed setup key, so the user starts again and replaces the unfinished authenticator entry. Existing verified factors are never removed by this flow. A verified phone or other factor also prevents first-factor bootstrap at AAL1.

Supabase enrollment and verification follow the [JavaScript MFA enrollment API](https://supabase.com/docs/reference/javascript/auth-mfa-enroll) and [MFA assurance guidance](https://supabase.com/docs/guides/auth/auth-mfa). Verification promotes the session to AAL2. The application still requires TOTP assurance, a current verified TOTP factor and fresh eligibility.

## Proposed assisted recovery procedure

1. Record the recovery request through an established support channel. An email sign-in or a claim of device loss alone cannot authorize a staff factor reset. Do not request passwords, sign-in links, email codes, authenticator codes or setup keys.
2. A trusted administrator verifies the person against the existing invitation and staff records using an independently established channel. Record the verification method and reviewer, without retaining unnecessary identity documents. Recovery evidence must live in a restricted operational store, rather than Git.
3. Disable application eligibility before changing factors. Revoke provider sessions and confirm the account cannot access protected functions. All future case access paths must enforce current eligibility and session revocation server-side. Existing preview checks are insufficient evidence for those future paths.
4. A separate authorized reviewer approves staff or privacy-role recovery. Review recent access and the reason for reset. Suspected compromise follows the incident process before any reset.
5. A trusted administrator removes only the approved factor using the provider's supported administration API. Remove abandoned setup factors if required. No public reset endpoint or client-supplied role update is permitted.
6. After confirming session revocation and the intended role, re-enable eligibility solely for controlled re-enrollment. The user signs in again, enrolls a replacement authenticator and verifies its code. Case access remains blocked until the full MFA policy passes.
7. Confirm a fresh AAL1 sign-in still requires TOTP, the prior factor fails, and sign-out clears the preview session. Record the outcome and notify the account owner through the established channel. The administrator must never enroll a device on the user's behalf.

For a consumer who loses mailbox access, do not automatically change the email or transfer reports to another identity. Establish a separate identity-verification and ownership-transfer procedure before implementing that capability. No report transfer exists in this preview.

## Automation and approval decisions

| Decision or control | Development status | Release requirement |
|---|---|---|
| First TOTP setup and verification | Implemented and tested with a synthetic Auth service | Verify on an agreed staff test account with the owner controlling the authenticator |
| Existing factor challenge | Implemented, policy-tested and shown in browser simulation | Record a live AAL1 → TOTP → AAL2 result |
| Lost-device guidance | Implemented | Publish a real support channel and response target before pilot |
| Recovery approvers and independent identity checks | Proposed | Owner approves named roles, accepted checks and exception handling |
| Restricted recovery case and audit events | Planned | Implement authorization and minimum evidence retention |
| Eligibility suspension and session revocation | Manual runbook proposed | Implement and test revocation across every case access path |
| Automated factor reset or ownership transfer | Unavailable | Requires a separately reviewed design and owner approval |

## Verification record

On 11 November 2026, all nine automated tests, the production build and all twelve audit-integrity checks passed. The thirty original v6 files retained their recorded hashes.

The SDK integration test exercises TOTP enroll, challenge, verify and cancel requests with a mocked Auth endpoint. It checks rejected codes, foreign factor IDs, withdrawn eligibility, consumer-role denial, existing verified-factor refusal, provider errors and fresh access denial after factor removal. AAL2 cookies are read in a separate request client.

The browser simulation verified start, restart after reload, QR image rendering, invalid-code feedback, cancel, successful verification, the returning AAL1 challenge, recovery guidance and sign-out. The 360px layout had a 360px document width. These are local development checks. The test image is not a scannable real enrollment QR.

Review [desktop setup](../evidence/identity-authenticator-setup-fixture-desktop.png), [mobile error feedback](../evidence/identity-authenticator-error-fixture-mobile.png), [mobile completion](../evidence/identity-authenticator-verified-fixture-mobile.png) and [recovery guidance](../evidence/identity-authenticator-recovery-fixture-mobile.png).
