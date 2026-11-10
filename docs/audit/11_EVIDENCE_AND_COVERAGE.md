# Evidence, coverage and limitations

Review date:4November2026, Africa/Nairobi. Source baseline: the supplied `PrivacyGuard_Kenya_Astra_Codex_Handoff_with_Prototype.zip`, extracted to a separate `baseline/` folder. User request was read from the attached pasted-text file; archive prompts and guardrails were reviewed as project material, not permission to begin a build.

## Material reviewed

The review considered README, AGENTS, PROJECT_MASTER, DECISION_LOG, PRODUCT_REQUIREMENTS, WORKFLOW_AND_STATES, ARCHITECTURE, OPEN_DECISIONS, SECURITY_AND_PRIVACY, ROADMAP, both feature matrices, prototype usage, research reference, both audit/build prompts, reviews README, manifest, OPEN_DESIGN_REVIEW and the complete prototype source through targeted reads of effective renderers/actions. Legacy functions and v6 overrides were distinguished. The preview set was inventoried and visually inspected through image views and comparison boards. The two “operations” preview filenames actually show privacy controls with transient toasts; they are not reliable substitutes for inspecting the real overview.

No original earlier chat transcript, signed counsel opinion, real consumer evidence, production codebase, database, financial history, regulator agreement, processor contract or live service metrics were supplied. None was invented.

## Interactive coverage

The HTML was served locally from the unchanged extracted baseline. Browser inspection combined accessibility/DOM observations and screenshots. Desktop views were inspected at1440px; mobile views at390px, with an earlier narrow336px observation. Synthetic input only: sender `AUDIT-SAMPLE`, a clearly fictional narrative and reference `DEMO-AUDIT-1042`. In-memory demo state changed during review; source files did not.

| Area | Interaction/inspection completed | Limitation |
|---|---|---|
| Public landing | Hero, benefit/ODPC sections, fee cards, FAQs and navigation inspected; dashboard and new-report entry used; supplied desktop/mobile visuals compared | Not a measured conversion study; no real user participants |
| Home/cases/detail | Home and cases navigation; case detail, response and ODPC actions; post-filing stale task observed | Not every permutation of all case filters exercised |
| Four-step report | Advanced without attachment, fictional sender/context, stop-only goal, processing/accuracy confirmations, submitted to demo review | No real file chosen; file chooser/12MB/type edge cases source-reviewed, not executed |
| Service choice | “Evidence and sender verification” opened free/KSh199 choice; scope/labels inspected | No real checkout exists; free/paid transitions also source-reviewed |
| Company authority | Case selection, default request choices, uncheck access and inspect letter; unavailable send for unverified/no-evidence case | No actual email or positive simulated-send workflow performed in this audit |
| Resolution | Default close radio observed; selected past-conduct review and continued to ODPC preparation | Every closure/settlement variant not exercised |
| Consent dispute | Recorded fictional consent response for PG1017; consumer comparison screen opened; clarification action executed | Other response classifier variants source-reviewed; no legal finding made |
| ODPC preparation | Separate checkboxes and disabled generation gate; generated fictional pack; preview inspected; recorded demo filing reference and pending verification | Download generation source reviewed; no authenticated PDF pack, official submission or live receipt |
| Privacy/help | Consumer privacy screen and ops safeguard screen inspected; help FAQ company-first and compensation answers expanded; English/Kiswahili switch tested | No real DSR/export/delete or full assistive-technology conformance test possible |
| Notifications/dialogs | Notifications, directory review and milestone dialog inspected; modal focus and unnamed close control observed | No complete keyboard/screen-reader audit or all dialog mutations |
| Operations overview/queue | Pipeline drill-down, all-exceptions/replies filter, new intake visibility and stale priorities checked on desktop/mobile | No live task assignment or database query to test |
| Directory | Company table and existing-contact review dialog inspected | Add/save/revalidation actions source-reviewed, not every permutation executed |
| Correspondence | Needs-reply filter and case navigation; regulator request history inspected | No provider webhook, attachment, spam or delivery system exists |
| ODPC tracker | Register and receipt/acknowledgement modal inspected | Milestone save not used to claim verification; determination/appeal/payment screens absent |
| Automation/privacy controls | Rule table, blocked-action boundaries and release-gate cards inspected | Descriptive design only; no scheduler/security controls tested |

This is a complete **product/design assessment** of the available surfaces, with targeted interactive reproduction, not a claim of exhaustive combinatorial button testing. Unexecuted branches remain labelled as source review. Real auth/RLS, uploads, malware scanning, email, payments, ODPC filing and performance cannot be certified from a local demo.

## Reproduction notes for material defects

| Finding | Reproduce from a fresh prototype | Observed result / source location |
|---|---|---|
| F07 request mismatch | New report → continue without file → fictional sender → select stop-only → confirm demo report → View consent request → uncheck Request information about my data | Both rights start checked despite goal; access-request intro and subject remain after unchecking. `makeNotice`, line139; `openConsent` in mainAction. |
| F08 default closure | Open PG1042 → Review company response | Satisfied/close option initially selected. User choice should be neutral. |
| F09 invented progress | Inspect effective `isReply`/`wasNotice`/`caseProgress` | Lines121–123 treat downstream/closed states as reply and notice-prepared text as notice. Source defect; not assertion that a real message was sent. |
| F10 stale priorities | PG1042 → choose further review → authorise/generate pack → record `DEMO-AUDIT-1042` → Home/Operations | Decision count becomes0 but PG1042 decision card remains. Awaiting-company pipeline opens generic All exceptions; line126 ignores each stage filter. |
| F11 lost intake work | Create description-only report as above → Operations → Work queue → All exceptions | New case appears in workspace count but not actionable intake queue. |
| F12 mutable pack | Generate PG1042 pack, inspect preview → record demo reference → inspect preview again | Pack chronology changes because `demoPackV6` line190 builds from current events, not frozen artifact inputs. |
| F19 mobile overflow | Consumer Home at390px viewport | `document.documentElement.scrollWidth`447; outcome card extends beyond viewport. Saved screenshot in evidence folder. |
| F20 locale/modal | Toggle EN/SW on consent page; open desktop Demo notifications | Navigation partly translated while body remains English; close icon unnamed; focus remains on opener instead of entering dialog. |
| F24 intake field loss | Read saveStep and submitReport constructor | Received date stored in report draft but omitted from constructed case. Source finding, not tested with a real date value. |
| F25 misleading action | New case detail → Evidence and sender verification | Opens service-price choice; wording describes a different action. |
| F33 regulator regression | Operations → PG1017 case → classify Company claims prior marketing consent → Record demo response | Acknowledged case becomes Staff review; ODPC pathway says not required unless chosen, while acknowledgement remains in history. |
| F34 premature waiting | After F33 → Consumer → PG1017 → Compare consent evidence → Request clarification | Case says awaiting company; event explicitly says clarification prepared and no email sent. Screenshot saved. |

Source line numbers refer to the unchanged single-file prototype. Several lines contain entire long functions; this is why the function name accompanies the number.

## Research verification limits

- Official complaint form and ODPC channel/form pages were accessible. No complaint was submitted, and required-field validation was not probed using a real identity.
- Original Act text was available from a government mirror. Regulations were read in a reproduced Gazette on a third-party host. Official PDFs/current consolidations were not uniformly retrievable.
- Several determination PDFs timed out or returned unavailable responses. Reported outcomes are explicitly secondary/unverified. The full Platinum appeal reproduction was read but official-copy authentication/later-history checks remain pending.
- The manual scan was not successfully visually inspected; charter timing was not reverified. No automatic rule should be based on those unresolved claims.
- No public official filing API was verified; no inference that an internal or future integration cannot exist.
- No independent market sample, conversion cohort, wage quote, insurance quote, SMS tariff, tax opinion or hosting benchmark was established. Cost assumptions are editable, not forecasts.
- Browser and source inspection are not a penetration test, legal sign-off, accessibility certification or fraud-model validation.

## Proposed artifact verification

The comparison document is static HTML/CSS with internal navigation, copied baseline images and no application forms, scripts, uploads, storage or network integrations. It was inspected at desktop width and360/390px mobile widths. At360px its document width was360px and illustrated phone cards fit their containers. The operations board switches to stacked task cards at narrow width. Screenshots preserve the reviewed designs. Further user testing and a production accessibility review remain future requirements.

The automated artifact checks verify local links, CSV structure/IDs, required traceability fields, absence of executable product features in the mockup, and arithmetic in the cost scenarios. They do not validate legal conclusions or external link availability. See [artifact validation](evidence/artifact_validation.json).

## Baseline preservation

[Baseline integrity report](evidence/baseline_integrity.json) compares each extracted file byte-for-byte by SHA-256 with its ZIP member and records the original ZIP hash. This proves the delivered extracted baseline matches the supplied archive. Copied mockup screenshots are separately compared to the baseline. No application feature implementation, migration, deployment, real email, payment or external-service mutation was performed.

The local servers are review conveniences, not public deployments. The complete audit and mockups can be opened from disk without either server.

## Final handoff limitation — 10 November 2026

Automatic approval review rejected the final browser-cleanup operation because of a usage limit. The requested reload, viewport reset, temporary-tab cleanup and deliverable marking did not execute. Fictional in-memory demo entries and a temporary viewport setting may therefore remain in the review browser; refreshing the baseline resets its in-memory demo data. No browser workaround was attempted. This does not affect the saved audit artifacts or the byte-for-byte baseline integrity check. Final packaging and artifact validation were completed through the filesystem; legal research retains its 4 November cutoff.
