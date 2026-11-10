# Independent executive assessment

PrivacyGuard addresses a credible consumer problem. **Proceed to bounded validation; do not yet commit to full development or a public paid service.** The proposed technology is manageable. The difficult parts are lawful service scope, trustworthy case handling, consumer willingness to pay, and the minutes of human work consumed by each case.

The strongest version is a private **evidence and rights-request assistant**, with a free route to act independently and a separately purchased, tightly scoped administrative service if Kenyan counsel approves it. An ODPC complaint is an available branch, including early referral where appropriate. It should not be a compulsory final stage, a compensation funnel, or a substitute for legal representation.

## What is sound and should remain

- Individual cases, private evidence, no automatic group enrolment, settlements or liability decisions.
- Separate processing notice, company-contact authority, pack-preparation instruction and any representative filing authority. Exact purposes must still be mapped to lawful bases.
- Consumer-led ODPC identity entry; no routine ID-image collection by PrivacyGuard. The portal is a separate service.
- Free official filing, visible optional fees, no guaranteed award, and separation of reported filing, verified acknowledgement, determination, award and money received.
- A reusable verified company directory, reliable correspondence history, source-backed clocks and a modular PostgreSQL architecture.
- Familiar navy/teal visual language, a single primary entrance and short explanations near consequential choices.

## The critical issues

| Priority | Finding | Consequence and required decision |
|---|---|---|
| P0 | Paid drafting, representation, advice and referrals are not legally cleared | Obtain a written Kenyan advocate opinion on the exact deliverables, templates, fee model and authority forms. Calling a fee “administrative” does not settle the issue. |
| P0 | DPIA, processing-purpose map, transfers and retention remain proposals | Complete these before real evidence. Include Supabase, email, SMS, monitoring, support and backups, not only R2. Review the statutory DPIA submission timing. |
| P0 | Consent and verified-status claims need enforceable records | Require case/document/recipient-bound approvals and documentary proof of official milestones. The offline demo does not implement these controls. |
| P1 | KSh199 cannot plausibly buy an open-ended manually supported case | At the explicit audit assumptions, even a narrowly scoped service is fragile once free screening and acquisition are included. Validate a fixed deliverable and price before building a broad operations platform. |
| P1 | UI choices and derived statuses diverge | The stop-only journey still prepares access wording; closure is preselected; event predicates infer replies from downstream states; priorities remain stale after escalation. Replace inference with evidence-linked states. |
| P1 | Missing recovery and exception journeys | Privacy requests, recovery, refunds, bounced mail, disputed attribution, official information requests, appeal and award-payment tracking need defined screens and ownership. |
| P1 | Mobile/language accessibility is incomplete | At 390px the home document extends to 447px; language switching translates navigation but leaves substantial English content. Do not advertise a complete bilingual service yet. |

P0 denotes a blocker **if this concept is taken live**, not a claim that the deliberately offline prototype leaked data or sent unlawful notices.

## Significant departures from the blueprint

| Current approach | Proposed approach | Why / evidence | Cost and usability impact | Dependency |
|---|---|---|---|---|
| “Upload a message” required mental model | “Check a message”, with screenshot or short description | Phone-call reports and consumers without screenshots need a valid start; v6 already accepts no attachment but says upload | Small design change; less abandonment; evidence sufficiency remains a later gate | Owner D01; usability trial |
| Long education repeated inside dashboard | Returning users see current case and one next action first | Reproduced mobile hero consumes most first screen | Less content and support; keep optional explanation | D01 |
| Company-first as apparent linear path | Default company contact with an explicit early ODPC/help branch | Complaint routes are broader than a compulsory company exchange | Some triage complexity; avoids delaying urgent or unsafe matters | Legal rules D02/D03 |
| Broad free “check” followed by tentative KSh199 | Free automated guidance; bounded paid service price tests | Human-work sensitivity dominates infrastructure | Higher visible prices may reduce conversion; clearer scope protects trust | D04 and counsel |
| Supabase plus R2 from first release | One private storage system initially, provisionally Supabase Storage | Fewer independent authorization/deletion/restore surfaces | Faster secure implementation; revisit R2 only for measured cost/transfer needs | D05, processor review |
| General status enum and milestone completion | Separate request, delivery, customer-decision and regulator records | Source predicates can mark a reply without a reply event | Modest schema work; much more honest progress | D06 |
| Paid billing deferred far into roadmap | Test willingness to pay first; add real billing only to a legally cleared limited pilot | Commercial model must survive before scaling | Smaller earlier commercial experiment; no payment collection in this audit | D04/D10 |
| Many repeated ODPC/compensation calls to action | One remedies section plus context-specific next action | Excess emphasis adds clutter and can bias expectations despite disclaimers | Cleaner trust-building experience | D01/D02 |

## What research does and does not establish

The public official complaint form was inspected. It exposes identity-document and email-verification fields and an on-behalf route. That does **not** establish ID photographs as a universal condition for every lawful complaint channel. No official public machine-to-machine filing API was verified. Alternate channels and accepted representative authorisation require confirmation. See the [legal matrix](03_LEGAL_AND_REGULATORY.md).

The original Data Protection Act text and a reproduced Gazette containing the regulations were read. Current official consolidations, several ODPC PDF determinations and the manual/charter could not all be retrieved. These limitations are recorded by source, not hidden behind a blanket “verified” claim. The appeal example is particularly instructive: the reproduced full judgment sets aside an award on procedural grounds, while a search summary contradicted it. No published case sample establishes a consumer success rate, typical award or collection probability.

## Commercial decision

Do not market “get compensated for spam.” Test “Stop unwanted marketing. Keep a clear record. Choose your next step.” Retain a plainly qualified explanation of compensation for consumers who ask. Offer no percentage of awards, financing of claims, custody of awards, or claim resale in the initial service.

Proposed validation: 12–15 moderated users including Kiswahili-first/low-literacy participants, 30–50 consented service-design cases only after privacy clearance, and 20–30 price-choice interviews before collecting any payments. These are learning targets, not statistically representative market estimates. Measure completion, comprehension, minutes of staff work and actual willingness to buy a defined deliverable.

The [decision register](10_OWNER_DECISIONS.md) contains the exact approvals needed. **No development has been authorised or started.**
