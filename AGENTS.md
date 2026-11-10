<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## PrivacyGuard design reference

Use the [built v6 prototype](prototype/v6/prototype/index.html) and its previews to match the product's navy and teal palette, shield identity, mobile navigation and card hierarchy. Follow the [approved comparison boards](docs/audit/mockups/index.html) for the refinements, especially the case-first home, description intake and scoped privacy controls. Check the [feature matrix](docs/audit/06_FEATURE_ALIGNMENT.csv) before adding a screen. Use real local state for visible workflow actions. Keep v6 as a reference in its own directory.

This checkout tracks `ImpactEdgeInnovations/privacyguard-`. Update [the roadmap](docs/ROADMAP.md) and [the milestone record](docs/MILESTONES.md) as phases and verification evidence change. Keep local databases, real case material and credentials out of Git.
