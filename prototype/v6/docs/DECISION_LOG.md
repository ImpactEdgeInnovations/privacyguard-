# Decision log — as agreed in conversation (not formal legal sign-off)

| ID | Status | Decision | Rationale / scope |
|---|---|---|---|
| D-001 | Current direction | Individual-first; no group claims in MVP | Privacy and simpler operational launch |
| D-002 | Current direction | Public landing, consumer area, operations area | Visitors understand value before registration |
| D-003 | Current direction | One main **Upload a message** entry point | Avoid confusing multiple start cards |
| D-004 | Current direction | Evidence review then verified company contact | Reduce scams, wrong-company allegations, manual effort |
| D-005 | Current direction | Company-first default but not mandatory | Some cases need direct regulator escalation |
| D-006 | Current direction | Distinct action-specific authorisation gates | No broad consent for letters, filing or settlement |
| D-007 | Current direction | Company says 'stopped' does NOT close case | Consumer decides whether past issues remain |
| D-008 | Current direction | Consumer chooses ODPC escalation after company reply/nonresponse | Avoid automatic or unwanted filing |
| D-009 | Current direction | Auto-prepare ODPC pack; consumer files official portal initially | No verified public ODPC auto-filing API |
| D-010 | Current direction | No ID images collected in PrivacyGuard MVP | Minimise sensitive identity-document risk |
| D-011 | Current direction | ODPC + potential compensation visible in copy | Key consumer benefit, no guarantee |
| D-012 | Current direction | Clear optional fee only after free report/check, before paid work | Trust and Kenyan consumer protections |
| D-013 | Current direction | Distinct consumer/operations progress stages + email register | Accurate work and communications visibility |
| D-014 | Current direction | Next.js + TypeScript + Supabase Postgres, async job queue; private storage provider subject to review | Small maintainable platform |
| D-015 | Design baseline | v6 clickable HTML prototype | Screen/interaction reference, not production implementation |
| D-016 | Pending legal validation | Fees, formal regulatory deadlines, registration/DPIA, standard representation authority | Counsel/ODPC confirmation |
| D-017 | Pending operational validation | Preferred ODPC complaint intake, email integration, status evidence | Liaise with ODPC CIE |

## How approvals are recorded
Astra records **proposals**, never silently changes a direction. For each approved change, append `D-NNN` with date, approver, affected design matrix IDs, documents updated and legal sign-off flag. Do not rewrite history.
