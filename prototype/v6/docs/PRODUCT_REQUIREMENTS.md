# Product requirements — MVP

Status labels: **MVP** = phase-approved candidate pending Astra audit; **DEFER** = not approved for first release. IDs connect to `DESIGN_TO_FEATURE_MATRIX.csv`.

## Public site
- PG-01 Responsive landing page with ODPC prominently explained; truthful potential-compensation message and official ODPC independence disclaimer.
- PG-02 Public 'How it works', 'What happens if company stops?', FAQs, privacy commitments, official ODPC free-filing link.
- PG-03 One primary evidence-first CTA; no fragmented 'Stop messages' versus 'Seek compensation' entry paths.
- PG-04 Visible 'free to start / optional paid assistance' hint; actual service price/inclusions before transaction.

## Consumer
- PG-05 Report wizard: message channel, attachment(s), sender, suspected brand, date, opt-out history, accuracy statement.
- PG-06 No ID/passport upload or request in MVP; user routes to ODPC directly for identity.
- PG-07 Account with minimum contact verification and recovery; no unverified sensitive case linkage.
- PG-08 Explicit case-data notice and lawful basis per purpose, contact-company authorisation, later ODPC pack/filing confirmation separately.
- PG-09 Private dashboard and case list, next action, two parallel milestone tracks (company stage + optional ODPC stage).
- PG-10 Consumer sees actual company reply or concise plain-language explanation; can indicate satisfied, needs clarification or ODPC escalation.
- PG-11 Evidence pack auto-assembled from actual records with provenance, disclosure checks and user confirmation.
- PG-12 ODPC handoff: download pack, open official portal, user files and supplies ID there, return with reference; recorded as consumer-reported/unverified.
- PG-13 Updates for real incoming correspondence and overdue needs-action, with clear source and uncertainty.
- PG-14 Privacy controls: view permissions and withdraw future uses as applicable; data access/deletion request, retention explanations.

## Admin/operations
- PG-15 Case triage: evidence completeness, duplicate and abuse indicators, manual exceptions.
- PG-16 Company directory: brand→legal entity→sender aliases→verified contact; source, reviewer, verified-on timestamp and expiration.
- PG-17 Notice engine: approved template, case-specific authority, contact verification, queued send, outbox idempotency and event history.
- PG-18 Inbound correspondence: per-case aliases, attachment security, verified sender checks, reply classification, officer follow-up.
- PG-19 Deadline engine: law-versioned rules, correct trigger event, reminders, workday/calendar definitions, exception escalation.
- PG-20 Aggregate operations pipeline with actionable queues: reviews, unknown company, failed mail, overdue replies, ODPC request needing response.
- PG-21 Individual operations case: complete immutable trail of evidence, permissions, correspondence, responses, ODPC events and handoffs.
- PG-22 ODPC: preparation vs consumer-reported submission vs official acknowledgement vs investigation vs determination vs appeal vs actual payment.
- PG-23 Audit and permission protections (least privilege, protected evidence, no company-to-company or consumer-to-consumer leakage).
- PG-24 Billing if enabled: optional products and fee reveal only after free check, explicit purchase authorisation, receipt, refund rules, no charge to file with ODPC.

## Deferred
- PG-25 Group complaints/class actions or shared complaint discovery.
- PG-26 Automatic ODPC submission/status API (until regulator approves documented integration).
- PG-27 Automated legal decision engine, compensation probability, AI-generated verdicts.
- PG-28 Dedicated Android/iOS apps, SMS inbox permissions or automatic WhatsApp harvesting.

## Regulatory / claims language
'Possible compensation where legally justified' is permitted marketing positioning subject to legal review. Never claim that ODPC has already determined a case; never confuse an ODPC fine and personal compensation, ordered and paid, or filed and acknowledged. Explain remedies and possibility of dismissal or closure without award.

## Accessible UX states required
Slow/failed upload; offline/low connectivity; incomplete evidence; unverified sender; duplicate indicator; bounced company email; company reply disputes consent; company stops messages but user elects further review; legal reply deadline elapsed; customer withdraws authorisation; ODPC portal unavailable; user loses reference; unexpected respondent document; suspected fraudulent evidence; opt-out successful/no compensation; disputed award on appeal.
