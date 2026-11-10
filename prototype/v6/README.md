# PrivacyGuard Kenya — Astra → Codex handoff

**Package status:** Pre-build review. **Date:** 3 November 2026. **Design baseline:** Clickable HTML prototype v6. **System status:** Research and prototype only; not a running service.

## Purpose

Give **Astra** one coherent source of project decisions, legal/operations research, functional requirements and screen designs to challenge and refine **before Codex builds anything**. Keep an executable-looking *visual reference* (`prototype/index.html`) paired with an explicit design-to-feature contract. This is **not** permission to start production development.

## Review first (Astra)

1. Read `docs/PROJECT_MASTER.md`, `docs/DECISION_LOG.md`, and `docs/WORKFLOW_AND_STATES.md`.
2. Open `OPEN_DESIGN_REVIEW.html` or `prototype/index.html` locally to test public, consumer, and operations flows. `docs/DESIGN_TO_FEATURE_MATRIX.csv` maps screens to real systems.
3. Read `docs/PRODUCT_REQUIREMENTS.md`, `docs/SECURITY_AND_PRIVACY.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, and `docs/OPEN_DECISIONS.md`.
4. Audit the external legal source notes in `reference/ODPC_RESEARCH_REFERENCE_2026-11-03.md` critically; re-verify all laws, forms, portal details, timelines and fee rules before launch.
5. Run the exact brief in `prompts/01_ASTRA_AUDIT_NO_CODING.md`. Place review result in `reviews/ASTRA_REVIEW.md`, and proposed changes in `reviews/CHANGE_PROPOSALS.md`.
6. Owner reviews Astra's proposals and records approvals in `docs/DECISION_LOG.md`. **Only then** use `prompts/02_CODEX_BUILD_AFTER_APPROVAL.md`.

## Important distinction: prototype vs production

- `prototype/index.html` is **the current visual/interaction reference** for layout, copy, relative hierarchy, workflow labels, and navigation. It uses fictional case data and only simulated actions.
- `docs/PRODUCT_REQUIREMENTS.md` and `docs/WORKFLOW_AND_STATES.md` describe what must function in production.
- `docs/DESIGN_TO_FEATURE_MATRIX.csv` is the bridge: **no visually present feature may be treated as done without a backend implementation and acceptance test**.
- `reference/ODPC_RESEARCH_REFERENCE_2026-11-03.md` is research, **not signed-off legal advice**. Where it conflicts with binding law, the law wins, after Kenyan counsel's review.
- The original v1 screen list from earlier ideation contained group claims. It is superseded by v6 individual-first decisions and intentionally excluded from the active reference set.

## Included

- Self-contained prototype HTML plus selected mobile/desktop image snapshots
- Product goals, personas, MVP scope, UX rules and exact case-state process
- Technical stack, modules, privacy/security and operational safeguards
- Design-to-feature traceability matrix and reviewer checklist
- Phased roadmap, acceptance gates, risks and decisions pending sign-off
- One Astra audit prompt and one Codex execution prompt
- ODPC legal/regulatory source material with verification caveats

## Start here

Open `OPEN_DESIGN_REVIEW.html` (browser) for a guided visual tour, then read `prompts/01_ASTRA_AUDIT_NO_CODING.md`.
