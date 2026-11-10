# PrivacyGuard Kenya — v6 clickable HTML prototype

**Prototype scope:** public landing, consumer dashboard, evidence-first reporting, explicit case-data permission, evidence and company verification, case-specific company-contact approval, simulated company response, consumer resolution decision, ODPC evidence-pack creation, ID-free filing handoff, return with a fictional ODPC reference, operations command centre, correspondence register and privacy controls.

## Open

Double-click `PrivacyGuard_Kenya_Prototype_v6_Privacy_ODPC_Handoff.html` in Chrome, Edge, Safari or Firefox. It is a self-contained HTML file; no server or installation is required. Recommended viewing: approximately 390 px wide (mobile) or full desktop width.

## Try the primary demo

1. From the **Public website**, choose **My dashboard**. In the consumer area, inspect **Home** and **My cases**.
2. Open fictional case `PG-1042` (Jirani Credit). It has a sample company response so you can test the consumer's ODPC decision.
3. Select **ODPC filing steps** or **See ODPC options**, and go to the ODPC pathway.
4. Check **case-specific pack authorisation** and **accuracy confirmation**. Choose **Generate my ODPC evidence pack**.
5. **Download demo pack** to test the local text-file export. It is clearly marked as fictional and excludes IDs.
6. Click **Open official ODPC portal** if you want to inspect the public regulator page (external link; this prototype does not submit anything).
7. Back in the prototype, enter a fictional value such as `DEMO-ODPC-1042` in **Come back after filing**. This records *consumer-reported, unverified* submission, not ODPC acknowledgement.
8. Switch to **Operations**. Inspect **Overview**, **Review queue**, **Email trail**, **ODPC tracking**, and **Privacy controls**.

## Test a newly reported case

1. On the public website choose **Upload a message**.
2. Select an example screenshot or PDF. This demo reads **only the file name**; actual file bytes are not uploaded or stored.
3. Enter a fictional sender and brand. For the built-in verified fictional company, use sender `DEMO-SVC` and brand `Sample Services`.
4. On the report's final screen, accept the **case-data processing explanation** and separately confirm the report is accurate.
5. In Operations, open the submitted case and select **Approve screening**.
6. In the consumer area, choose **Ask about your data**, review the notice and specifically authorise company contact.
7. In Operations, simulate the company's response. In the consumer area, review and choose whether to close, clarify or explore ODPC.
8. Use the ODPC path described above.

## The permissions are separate

- **Case data and evidence:** asked for during reporting; it is not consent for marketing.
- **Company contact:** requested only after screening and company verification, for a particular notice.
- **ODPC pack preparation:** requested when the consumer wants to proceed; distinct from company contact.
- **ODPC identification:** entered directly on the official ODPC complaints portal, *not* into PrivacyGuard.

The prototype does **not** claim a checkbox alone satisfies every regulatory representative-authorisation requirement. Real submissions must use the ODPC's accepted procedure.

## Progress states

The consumer's company-stage milestones and the ODPC milestones are shown separately. Operations has an overall pipeline and per-case correspondence trail. The platform must not equate **sent** with **delivered/read**, **consumer-reported filing** with **ODPC acknowledged**, **compensation ordered** with **compensation received**, or **company says stopped** with **consumer satisfied**.

## Security, legal and technical limitations

This is a **front-end demonstration only**: no real accounts, SMS OTP, evidence persistence, server, email sending, consent proof, company identity verification, M-Pesa, National ID processing, ODPC filing or live regulatory status lookup. Company names and sample ODPC reference numbers are fictional. It does not confirm legal liability or promise compensation. In a production release, implement security controls, an appropriate privacy notice and lawful processing bases, an ODPC registration assessment, staff access rules, an evidence-retention policy, protected file storage, independent company-contact verification, audit logs and human review gates. An official ODPC complaint is free to file.

## Proposed implementation stack

Next.js + TypeScript + Tailwind/shadcn UI; Supabase Postgres/RLS/Auth/Queues; private evidence store; transactional email and inbound parsing; SMS OTP; optional M-Pesa. Hosting/overseas transfers and any third-party processing require documented Kenyan compliance review. The prototype is not production code.
