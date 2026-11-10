# Open decisions / verification agenda for Astra

1. **Legal and service boundaries:** Which documents can a non-advocate paid admin platform prepare? Does any case stage require an advocate? What wording/consent/terms are needed?
2. **ODPC official details:** Reconfirm portal-required ID front/back uploads, representative authority, email verification and whether direct e-filing API/batch process exists (do not assume).
3. **Legal timelines:** Reconciling actual access/objection clocks, 21-day respondent period in regulations vs manual 14+7+7 stages, working-day ODPC service standards, and trigger event evidence.
4. **ODPC filing completion UX:** Customer needs to re-enter form fields and upload attachments—can the pack be preformatted to minimize that burden without unauthorized automation? Can official confirmation be verified reliably?
5. **Payment/pricing:** Do all tiers and suggested price points cover actual operations costs? Require explicit fee preview before paid services. Consider how to handle after-hours/incomplete cases/refunds.
6. **Marketing:** ODPC and compensation prominent while avoiding an implied likelihood of cash awards, legal guarantee, regulator affiliation or ambulance chasing.
7. **Identity and privacy:** Decide secure phone/email verification balance, account recovery and legitimate evidence retention, and whether to avoid collecting a user ID number altogether.
8. **Storage geography:** Validate Kenyan law for chosen Supabase and R2 region, and whether alternate hosting is preferable; actual DPIA and ODPC registration.
9. **Company contact research:** Prove source/verification process and maintenance ownership; track sender aliases vs legal entities, opt-outs and privacy emails.
10. **Risk/abuse:** Detect synthetic screenshots, spoofed sender IDs, duplicate cases, coerced filing and multi-account abuse without penalising genuine users.
11. **Operations staffing and SLA:** Who monitors ODPC correspondence and urgent requests? Escalation for unanswered company requests; audit chain.
12. **UI/feature alignment:** Validate all screens from `prototype/index.html`, including incomplete Kiswahili translation and accessibility on low-end devices.
13. **Case statuses:** Ensure 'approved screening' is not legal evidence authentication; external email statuses differ from verified regulator milestones.
14. **Research freshness:** Source dates and public ODPC decision corpus may change; Astra must cite official updated publications, not assume archived summary is current.

Each item must receive **Decision / Owner / Evidence / Date / Blocker severity** in the review report. Unknowns stay unknown; do not fill by guess.
