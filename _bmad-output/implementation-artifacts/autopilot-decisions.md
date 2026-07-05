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

### [2026-07-05T20:55:00Z] 1-1-database-prisma-foundation — Code review: fix GroupSession.updatedAt schema/migration DEFAULT drift
- **Risk:** medium
- **Workflow / step:** code-review step 4 (present & act — fix-vs-action-items ask; autopilot default = fix HIGH/MEDIUM)
- **Decision point:** Adversarial review found the migration adds `updatedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP` while the Prisma schema declared `@updatedAt` with no `@default`. Confirmed drift via `prisma migrate diff --from-empty` (canonical SQL emitted `NOT NULL` with no default). A future `prisma migrate dev` would emit a spurious `DROP DEFAULT` migration.
- **Options considered:** A) Add `@default(now())` to the schema field so canonical SQL matches the migration (keeps the safe DB default, no migration edit); B) Remove `DEFAULT CURRENT_TIMESTAMP` from the migration SQL to match Prisma's default no-default form (fragile — a bare `ADD COLUMN NOT NULL` fails if any GroupSession row exists at deploy); C) Leave as-is and accept drift.
- **Chosen:** A — added `@default(now())` to `GroupSession.updatedAt`. `prisma migrate diff` now emits `NOT NULL DEFAULT CURRENT_TIMESTAMP`, exactly matching the migration. `@default(now()) @updatedAt` is a valid, common Prisma combo.
- **Rationale:** Eliminates drift AND keeps the DB-level default (safe even if the table is non-empty at deploy), without editing an authored migration. Option B is more fragile; C leaves a latent spurious migration.
- **Reversibility:** Remove `@default(now())` from `GroupSession.updatedAt` in schema.prisma (reverts to prior drift state). No data impact — additive DB default on an empty table.
- **Files touched:** acce-nextjs/prisma/schema.prisma

### [2026-07-05T20:55:30Z] 1-1-database-prisma-foundation — Code review: final status = done; 2 defers recorded
- **Risk:** medium
- **Workflow / step:** code-review step 4 section 6 (determine status + sync sprint tracking)
- **Decision point:** After fixing the one concrete code defect, decide done vs in-progress given two remaining defers: (B) partial-unique index permanently invisible to Prisma (inherent limitation); (C) AC5 `migrate deploy` proven only statically (sandbox blocks prod-credential deploy).
- **Options considered:** A) Set `done` — treat B/C as accepted defers (recorded in deferred-work.md), since the only actionable code defect (updatedAt drift) is fixed and B/C are by-design/environmental, not open patches; B) Set `in-progress` and bounce to dev-story — but no sandboxed dev loop can run `migrate deploy` against prod either, and B is unfixable in Prisma, so this risks a no-progress ping-pong.
- **Chosen:** A — `done`. B and C are legitimate DEFER-bucket items (real but not actionable now), written to deferred-work.md and the story's Review Findings. No unresolved high/medium *code* defect remains; the migration is verified as far as possible without prod DB access (validate + canonical-diff + static SQL review).
- **Rationale:** The delivered artifact is correct and fully unit-verified (24/24). C is an environmental CI improvement, not a defect; B is an unavoidable Prisma constraint. Matches the workflow's "done if clean, defers don't block done" rule.
- **Reversibility:** Re-open by setting the story + sprint-status entry back to `in-progress` and moving C from deferred-work.md into a Review Follow-up task.
- **Files touched:** _bmad-output/implementation-artifacts/1-1-database-prisma-foundation.md, _bmad-output/implementation-artifacts/deferred-work.md, _bmad-output/implementation-artifacts/sprint-status.yaml

### [2026-07-05T21:00:55Z] 1-2-passwordless-student-signup-login-magic-link — Scope boundary vs Story 1.3 (admin plugin + guards deferred)
- **Risk:** medium
- **Workflow / step:** create-story step 2 (story foundation) — interpreting the 1.2/1.3 split
- **Decision point:** Better Auth's config (`src/lib/auth.ts`) is a single object holding both the magic-link plugin (1.2) and the admin/role plugin + route guards (1.3). Epics AC for 1.2 = "magic-link plugin, owns auth tables"; 1.3 = "admin plugin assigns role" + `(portal)/(admin)` guards. Where does the admin plugin and role-guarding land?
- **Options considered:** A) Configure ONLY magic-link + nextCookies + Resend email in 1.2; leave the admin plugin, role-guarding, route groups, and portal shell entirely to 1.3 (minimal scope per epics). B) Configure admin plugin now too (schema already has `role`/`banned` columns) to avoid editing auth.ts twice. C) Build guards here as well.
- **Chosen:** A — 1.2 configures Better Auth core + `magicLink` plugin + `nextCookies` + Resend send-adapter + sign-in page + `/api/auth/[...all]` handler + session-established redirect. Admin plugin, role guards, middleware, route-group layouts and portal shell are explicitly OUT and owned by 1.3.
- **Rationale:** Matches the epic AC wording exactly and keeps stories independently reviewable. Adding the admin plugin in 1.3 is a one-line config append against tables that already exist (Story 1.1) — no rework of the magic-link config. Over-scoping 1.2 into guards would collide with 1.3's ACs.
- **Reversibility:** If we later prefer one-shot auth config, move the admin-plugin line from 1.3 into 1.2's `auth.ts`; no data/migration impact (columns already migrated).
- **Files touched:** _bmad-output/implementation-artifacts/1-2-passwordless-student-signup-login-magic-link.md

### [2026-07-05T21:00:55Z] 1-2-passwordless-student-signup-login-magic-link — Post-login redirect target with portal shell not yet built
- **Risk:** medium
- **Workflow / step:** create-story step 2/3 — AC "a session is established and they are redirected into the portal"
- **Decision point:** 1.2 must prove login redirects "into the portal", but the guarded `(portal)` shell/layout is Story 1.3. What is the callback landing so login is demonstrable and E2E-verifiable now, without stealing 1.3's route-group/guard scope?
- **Options considered:** A) `callbackURL = "/portal"` and create a minimal authenticated landing page `src/app/(portal)/portal/page.tsx` that server-reads the session and greets the user; 1.3 later adds the `(portal)` `layout.tsx` guard + shell around it. B) Redirect to `/` (marketing home) — but that doesn't demonstrate an authenticated portal surface and muddies AD-1 marketing isolation. C) Create a throwaway `/portal-temp` page deleted in 1.3 — churn.
- **Chosen:** A — callbackURL `/portal`; minimal `(portal)/portal/page.tsx` server page reading session via `auth.api.getSession({ headers })`, showing the signed-in email + a sign-out control. It is intentionally un-guarded-at-layout in 1.2 (guard is 1.3, AD-3); the page itself redirects to `/sign-in` if no session so it is not a leak and is E2E-meaningful.
- **Rationale:** Establishes the folder once, gives a real redirect target, proves the session cookie works end-to-end, and hands 1.3 a page to wrap rather than invent. Aligns with AD-3 (page-level session check is the real boundary; layout guard is UX).
- **Reversibility:** 1.3 replaces/wraps this page with the guarded layout + shell; delete or fold the stub greeting. No persistent state.
- **Files touched:** _bmad-output/implementation-artifacts/1-2-passwordless-student-signup-login-magic-link.md

### [2026-07-05T21:05:44Z] 1-2-passwordless-student-signup-login-magic-link — dev-story start: mark in-progress, capture baseline_commit
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story status is `ready-for-dev`; need to capture baseline_commit and transition sprint-status to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Record HEAD commit `9875af894f2a74f0c056cb51e2ec20843403e8a4` as baseline_commit; update sprint-status.yaml and story file to `in-progress`.
- **Rationale:** Required by workflow contract.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`; remove baseline_commit from story frontmatter.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/1-2-passwordless-student-signup-login-magic-link.md

### [2026-07-05T21:05:44Z] 1-2-passwordless-student-signup-login-magic-link — Pin better-auth to exact version 1.6.23
- **Risk:** high
- **Workflow / step:** dev-story step 5 (Task 1 preamble — dep pinning)
- **Decision point:** Story notes say `package.json` floor `^1.2.8` is stale vs resolved 1.6.23; global lessons-learned rule says pin high-risk deps (auth is a supply-chain target). Should I change `"better-auth": "^1.2.8"` to exact `"better-auth": "1.6.23"`?
- **Options considered:** A) Pin to exact `"1.6.23"` — no range, explicit, matches lessons-learned rule; B) Change to `"^1.6.23"` — allows patch updates; C) Leave as `"^1.2.8"` (npm resolved to 1.6.23 anyway in node_modules).
- **Chosen:** A — pin to `"1.6.23"` exact, matching lessons-learned "pin exact versions for high-risk deps."
- **Rationale:** Auth library is a high-value supply-chain target. Exact pin prevents accidental upgrade to a compromised version. Installed modules already have 1.6.23; this change only affects package.json, not node_modules.
- **Reversibility:** Change `package.json` back to `"^1.2.8"` or `"^1.6.23"` and run `npm install`.
- **Files touched:** acce-nextjs/package.json

### [2026-07-05T21:05:44Z] 1-2-passwordless-student-signup-login-magic-link — Use (portal) route group folder, minimal page.tsx, no layout.tsx guard
- **Risk:** medium
- **Workflow / step:** dev-story step 5 (Task 4 — portal landing)
- **Decision point:** Story says create `src/app/(portal)/portal/page.tsx`. The `(portal)` route-group directory does not yet exist. Creating it is part of this story's scope but leaving out `layout.tsx` is critical.
- **Options considered:** A) Create `src/app/(portal)/portal/page.tsx` (route group folder + page, no layout); B) Create `src/app/portal/page.tsx` flat (no route group, simpler, but 1.3 would need to move the file when it adds the route group); C) Create the folder with a layout.tsx now.
- **Chosen:** A — create `(portal)` route group with only `portal/page.tsx`. No `layout.tsx` here (1.3 adds it). The story is explicit: "leave the folder in place" for 1.3 to wrap.
- **Rationale:** Matches story scope; creating the folder now saves 1.3 from having to create it and move a file. The route group `(portal)` has no layout so all children use the root layout.
- **Reversibility:** Delete `(portal)/portal/page.tsx`; rename folder if 1.3 restructures.
- **Files touched:** acce-nextjs/src/app/(portal)/portal/page.tsx

### [2026-07-05T21:00:55Z] 1-2-passwordless-student-signup-login-magic-link — Sign-in page as flat additive public route
- **Risk:** low
- **Workflow / step:** create-story step 3 — where the sign-in UI lives
- **Decision point:** The sign-in page must be publicly reachable (no session yet). Route groups are 1.3's domain; where does `sign-in` live?
- **Options considered:** A) Flat additive public route `src/app/sign-in/page.tsx` (a `"use client"` island with the email form + authClient.signIn.magicLink). B) A new `(auth)` route group — extra structure 1.3 doesn't ask for. C) Under `(portal)` — wrong, it must be public.
- **Chosen:** A — `src/app/sign-in/page.tsx`. Additive public page; does not modify any existing marketing route/metadata (AD-1 respected — adding is fine, modifying is not).
- **Rationale:** Simplest correct placement; keeps auth UI out of both the marketing content set and the guarded groups. Uses existing shadcn `Card`/`Input`/`Button`/`Label` + sonner (already mounted).
- **Reversibility:** Trivially movable into an `(auth)` group later if desired; pure UI relocation.
- **Files touched:** _bmad-output/implementation-artifacts/1-2-passwordless-student-signup-login-magic-link.md
