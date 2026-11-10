# Phase 1 identity preview

The preview isolates Supabase Auth from the fictional case workspace. It verifies a consumer, staff or privacy reviewer session and shows the result on the v6-aligned sign-in screen. The next milestone is to verify invited test users and connect a separately reviewed case authorization layer.

## Run on loopback

Add the selected development project's API URL and **publishable** key to the ignored `.env.local` file. Keep service keys and SMTP credentials outside the repository.

```dotenv
PRIVACYGUARD_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
PRIVACYGUARD_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Run `npm run identity:dev` and open [http://127.0.0.1:8768/identity](http://127.0.0.1:8768/identity). The preview requires this exact origin. The regular `npm run dev` still runs the separate fictional workspace.

## Provider settings

1. Use invite-only signup with email confirmation enabled. Enable authenticator-app TOTP for staff and privacy reviewers.
2. Allow the exact redirect `http://127.0.0.1:8768/identity/callback`. Open the sign-in link in the browser that requested it so the stored PKCE verifier can be used. The default magic-link template works with this callback. If the chosen template sends an email code, use the code entry form instead. [Supabase PKCE flow](https://supabase.com/docs/guides/auth/sessions/pkce-flow)
3. For custom email delivery, choose the verified sender and domain-scoped sending credential in Resend. Use `smtp.resend.com`, port `465`, and username `resend`. Enter the credential as the SMTP password in the approved project's dashboard. The project owner completes and saves that field directly. [Resend SMTP settings](https://resend.com/changelog/smtp-service)
4. Provision only agreed tester identities. A trusted administrator sets `app_metadata.privacyguard_enabled` to `true` and `app_metadata.privacyguard_role` to `consumer`, `staff` or `privacy`. Staff and privacy testers require a verified TOTP factor enrolled through a trusted setup process. Recovery and enrollment need their own verification.

## Evidence and acceptance

The browser session is scoped to the identity route. The server verifies claims and fetches the current user record to check eligibility and role. Staff and privacy roles require AAL2, a TOTP authentication claim and a still-enrolled verified factor. User-editable metadata cannot assign a role.

For live staging verification, use an owner-approved address. Check magic-link receipt and same-browser exchange, a denied invalid callback, and sign-out. For staff, record the AAL1 prompt, TOTP verification and denial after eligibility is withdrawn. Record delivery and access results without codes, keys, addresses or session tokens. Keep all case data fictional during this verification.

On 10 November 2026 the approved Supabase project had zero Auth users and no application tables in the checked schemas. Invite-only signup and the exact loopback redirect were saved, email confirmation and TOTP were already enabled, and the Auth health check returned HTTP 200. Resend's scoped sender was verified and the SMTP form was prepared. SMTP credential entry, email delivery and a real tester's MFA run remain pending.
