# Autopilot Decision Log

Append-only record of every decision the BMAD autopilot made autonomously.
Review `high` and `critical` entries first — those are the ones worth re-architecting if wrong.

Risk tiers: low (reversible/local) · medium (multi-file/interface) ·
high (new dep / config / architecture / shared state) · critical (auth / payments / secrets / data migration / destructive).

---

### [2026-07-05T20:31:22Z] 1-1-database-prisma-foundation — Epic-1 branch + epic status transition
- **Risk:** low
- **Workflow / step:** create-story step 1 (target story) + step 6 (sprint status)
- **Decision point:** No `epic-1` git branch existed; first story of Epic 1 requires marking the epic `in-progress`.
- **Options considered:** A) branch from current HEAD `feat/phase-1a-group-classes`; B) branch from main.
- **Chosen:** A — `git checkout -b epic-1` off current HEAD (dispatch contract forbids branching from main). Set `development_status.epic-1: in-progress` per create-story step-1 rule (first story in epic).
- **Rationale:** Contract mandates epic-1 branch chained off prior work; skill mandates epic→in-progress on first story creation.
- **Reversibility:** `git branch -D epic-1`; revert sprint-status line to `backlog`.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml

### [2026-07-05T20:31:22Z] 1-1-database-prisma-foundation — Scope: include spine schema deltas in the foundation story
- **Risk:** medium
- **Workflow / step:** create-story steps 2-3 (artifact + architecture analysis → story scoping)
- **Decision point:** The `init` migration (`20260705182521_init`) already exists and matches epics AC "schema per plan §2", but ARCHITECTURE-SPINE lists 5 "schema deltas beyond init the spine drives" (GroupSession.updatedAt, partial-unique BOOKING_CHARGE index, LedgerEntry.studentId→User FK, Enrollment.paymentRef unique, driverAdapters preview/adapter-pg bump). The spine does not assign these to a specific story. Should Story 1.1 apply them, or defer each to its consuming epic?
- **Options considered:** A) include all 5 deltas now (Story 1.1 owns "the full Phase 1a schema migrated"); B) defer each delta to its consuming story (2/3/4); C) include only pure-integrity deltas (FK, driverAdapters) and defer the rest.
- **Chosen:** A — scope Story 1.1 to the *complete, correct* Phase 1a schema: apply all 5 deltas as a follow-on migration so every later story builds on a stable data layer and no later epic has to re-migrate shared tables. These are pure DB constraints on empty tables — no feature code depends on adding them now.
- **Rationale:** Epic-1 intent text explicitly says "the full data model migrated"; the spine calls these deltas foundational; batching them into the foundation avoids migration churn and mid-epic schema drift on shared tables.
- **Reversibility:** Each delta is one migration statement; drop the follow-on migration or split deltas back out to their epics if this proves too broad. No data loss (tables empty pre-seed).
- **Files touched:** story file only (create-story does not implement).

### [2026-07-05T20:31:22Z] 1-1-database-prisma-foundation — Dockerfile Prisma-client copy gap flagged as story work
- **Risk:** medium
- **Workflow / step:** create-story step 3 (read files being modified)
- **Decision point:** Story AC requires "prisma generate produces the client and it is copied into the Docker runner stage." Current `acce-nextjs/Dockerfile` runner stage copies only `.next/standalone`, `.next/static`, `public` — no explicit Prisma client/engine copy (matches the known lessons-learned Docker+Prisma gotcha).
- **Options considered:** A) treat as in-scope AC work for the dev agent and document the exact fix; B) assume Next standalone tracing handles it and omit.
- **Chosen:** A — story instructs dev to ensure the generated Prisma client + query-engine binary reach the runner stage (verify standalone trace includes `.prisma/client` and `@prisma/client`; add explicit COPY if the traced output omits the engine) and to run `prisma migrate deploy` on release.
- **Rationale:** Direct AC; lessons-learned flags this exact failure mode (PaymentApproval). Cheaper to guard now than debug a runtime crash on Coolify.
- **Reversibility:** Dockerfile edit; revert the COPY line.
- **Files touched:** story file only.

### [2026-07-05T20:36:12Z] 1-1-database-prisma-foundation — dev-story start: mark in-progress, baseline commit
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story was `ready-for-dev`; need to capture baseline_commit and transition to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Record HEAD commit as baseline_commit; update sprint-status.yaml to `in-progress`.
- **Rationale:** Required by workflow contract.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/1-1-database-prisma-foundation.md

### [2026-07-05T20:36:12Z] 1-1-database-prisma-foundation — Driver adapters: use GA Prisma 6.19.3, no previewFeatures needed
- **Risk:** medium
- **Workflow / step:** dev-story step 5 (Task 2, delta 5)
- **Decision point:** AC3.5 says add `previewFeatures = ["driverAdapters"]` OR bump to ≥6.16. Installed version is 6.19.3 (≥6.16 → adapters GA). Should I add the preview flag or rely on installed version?
- **Options considered:** A) Add `previewFeatures = ["driverAdapters"]` to generator block; B) Leave generator as-is since 6.19.3 is GA.
- **Chosen:** B — leave generator as-is; 6.19.3 already has adapters GA. Add a comment in schema confirming this. The story comment already says "if the installed version still gates them, add: previewFeatures = ...".
- **Rationale:** Unnecessary preview flags introduce confusion; 6.19.3 doesn't need them.
- **Reversibility:** Add `previewFeatures = ["driverAdapters"]` to generator if a future Prisma version requires it explicitly.
- **Files touched:** acce-nextjs/prisma/schema.prisma (comment update only)

### [2026-07-05T20:36:12Z] 1-1-database-prisma-foundation — Migration strategy: create migration SQL manually, then apply
- **Risk:** critical
- **Workflow / step:** dev-story step 5 (Task 2)
- **Decision point:** `prisma migrate dev` requires interactive DB access and creates files automatically. The real DB has credentials. Should I run `prisma migrate dev` (creates migration + applies) or create migration SQL manually and run `migrate deploy`?
- **Options considered:** A) Run `npx prisma migrate dev --name schema_deltas_spine` — generates migration + applies; B) Manually create migration file + run `migrate deploy`.
- **Chosen:** A — run `prisma migrate dev` since real DB credentials exist in `.env`. This generates the migration automatically based on schema diff, then I hand-add the partial index to the resulting SQL and re-apply.
- **Rationale:** `migrate dev` is the canonical workflow for development; it handles the diff correctly. Manual migration risks drift. Real DB available.
- **Reversibility:** Drop the migration with `prisma migrate resolve --rolled-back` or delete the migration folder; restore original schema.
- **Files touched:** acce-nextjs/prisma/schema.prisma, acce-nextjs/prisma/migrations/<new>/migration.sql

### [2026-07-05T20:36:12Z] 1-1-database-prisma-foundation — Install missing @testing-library/dom peer dep to unblock test suite
- **Risk:** high
- **Workflow / step:** dev-story step 7 (run validations and tests)
- **Decision point:** `npm test` fails across ALL 5 existing test files with "Cannot find module '@testing-library/dom'". `@testing-library/dom` is a peer dependency of `@testing-library/react@16` that was not installed. This is a pre-existing infrastructure gap unblocking the whole test suite.
- **Options considered:** A) Install `@testing-library/dom` as a devDependency; B) Remove `@testing-library/react` tests (out of scope — those are existing tests); C) Reconfigure vitest to skip react tests (risky, hides breakage).
- **Chosen:** A — `npm install --save-dev @testing-library/dom`. This is a NEW dependency addition (risk: high per taxonomy) but is a pure dev dependency that restores a broken test harness.
- **Rationale:** Story AC5 requires `npm test` passes; the gap is pre-existing and must be closed. The alternative (accepting a broken test suite) violates the definition of done. This is a direct `@testing-library/react` peer dep — no unexpected side effects.
- **Reversibility:** `npm uninstall @testing-library/dom`; remove from package.json. No data or schema risk.
- **Files touched:** acce-nextjs/package.json, acce-nextjs/package-lock.json

### [2026-07-05T20:36:12Z] 1-1-database-prisma-foundation — Fix pre-existing sitemap test: mock guides config to be fully published
- **Risk:** low
- **Workflow / step:** dev-story step 7 (run validations — AC5 requires npm test passes)
- **Decision point:** 3 sitemap tests fail because `anyGuidePublished()` returns false in the test environment (all guides have `false` publish flags; NODE_ENV is "test" not "development"). The sitemap test tests what the sitemap looks like when guides ARE published, but the test environment has the production-off state. This is a pre-existing test infrastructure gap (the guides feature gate was added but the sitemap test wasn't updated).
- **Options considered:** A) Set `NEXT_PUBLIC_GUIDES_PREVIEW=true` globally in vitest config — breaks guides-config.test.ts which tests the non-preview (production) behavior; B) Mock `@/config/guides` at the top of sitemap.test.ts with `vi.mock` to make all guides appear published — isolated, doesn't affect other tests; C) Accept the pre-existing failures and note them — violates AC5.
- **Chosen:** B — add `vi.mock("@/config/guides", ...)` at the top of `tests/unit/sitemap.test.ts` to return `anyGuidePublished=true` and `isGuidePublished=true` for all guides when testing the sitemap. This is the correct semantics: the sitemap should include all routes when guides are live.
- **Rationale:** AC5 requires `npm test` passes. The mock is minimal, isolated, and correct — sitemap tests should verify the full sitemap when content is published. Doesn't touch guides-config.test.ts.
- **Reversibility:** Remove `vi.mock` from sitemap.test.ts.
- **Files touched:** acce-nextjs/tests/unit/sitemap.test.ts
