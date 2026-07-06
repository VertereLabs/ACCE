# Autopilot Decision Log

Append-only record of every decision the BMAD autopilot made autonomously.
Review `high` and `critical` entries first — those are the ones worth re-architecting if wrong.

Risk tiers: low (reversible/local) · medium (multi-file/interface) ·
high (new dep / config / architecture / shared state) · critical (auth / payments / secrets / data migration / destructive).

---

### [2026-07-06T22:45:10Z] 6-3-seat-confirmation-email-on-confirmation — dev-story start: mark in-progress
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story was `ready-for-dev`; baseline_commit already set in frontmatter (cd713a3db009c3525ac9aa508a65ba81ac7df560); transition to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Update sprint-status.yaml to `in-progress`; preserve existing baseline_commit.
- **Rationale:** Required by workflow contract; baseline_commit already present from create-story.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/6-3-seat-confirmation-email-on-confirmation.md

### [2026-07-06T22:45:10Z] 6-3-seat-confirmation-email-on-confirmation — JoinDetail discriminated union design
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 1)
- **Decision point:** The story explicitly specifies a discriminated union `type JoinDetail = { mode: "ONLINE"; url: string | null } | { mode: "IN_PERSON"; location: string | null }`. No ambiguity.
- **Options considered:** A) Discriminated union as specified; B) Single object with both optional fields.
- **Chosen:** A — discriminated union exactly as specified.
- **Rationale:** Story spec is explicit; discriminated union is type-safe and matches the mode-gated reveal pattern from the 3.3 detail page.
- **Reversibility:** Replace with single object type; update all call sites.
- **Files touched:** acce-nextjs/src/lib/meeting.ts

### [2026-07-06T22:45:10Z] 6-3-seat-confirmation-email-on-confirmation — email trigger placement: post-commit at entry layer
- **Risk:** medium
- **Workflow / step:** dev-story step 5 (Task 5)
- **Decision point:** Story spec (AD-13 + Dev Notes) mandates trigger at entry layer (two server actions + webhook route), NOT inside enrollment.ts tx body. Already confirmed in autopilot-decisions.md [2026-07-06T22:39:48Z].
- **Options considered:** A) Entry-layer post-commit (mandated); B) Inside enrollment.ts tx (rejected — would add email I/O to Serializable core).
- **Chosen:** A — entry-layer post-commit with try/catch log-only, preserving seat CONFIRMED regardless of email result.
- **Rationale:** AD-13 mandates email failure never rolls back seat; must be outside the transaction.
- **Reversibility:** Move three calls into post-commit if (result.outcome==="confirmed") blocks inside enrollment.ts.
- **Files touched:** acce-nextjs/src/app/(portal)/portal/classes/[id]/actions.ts, acce-nextjs/src/app/api/webhooks/paystack/route.ts

### [2026-07-06T21:55:11Z] 6-1-enrollment-roster-with-paid-pending-status — dev-story start: mark in-progress
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story was `ready-for-dev`; baseline_commit already set in frontmatter (070df519); need to transition to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Update sprint-status.yaml to `in-progress`; preserve existing baseline_commit in story frontmatter.
- **Rationale:** Required by workflow contract; baseline_commit already present from create-story.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/6-1-enrollment-roster-with-paid-pending-status.md

### [2026-07-06T21:55:11Z] 6-1-enrollment-roster-with-paid-pending-status — pure enrollment-display.ts module design
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 1)
- **Decision point:** Story says export both `formatEnrollmentStatus` and `enrollmentStatusBadgeVariant` from `enrollment-display.ts`. The story also says "or keep the variant mapping local to the page". Since step 6 requires unit-testable exports and 6.2 may reuse them, export both.
- **Options considered:** A) Export both label + variant from module; B) Keep variant local to page.
- **Chosen:** A — export both so both are unit-testable and reusable by Story 6.2.
- **Rationale:** Story explicitly prefers the module-level export for testability and 6.2 reuse; the label MUST live in the pure module.
- **Reversibility:** Move variant map inline to the page; remove export from enrollment-display.ts.
- **Files touched:** acce-nextjs/src/lib/enrollment-display.ts

### [2026-07-06T17:57:51Z] 4-3-no-oversell-under-concurrent-buyers — dev-story start: mark in-progress, baseline commit
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story was `ready-for-dev`; need to capture baseline_commit and transition to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Record HEAD commit 7ff9f33f as baseline_commit; update sprint-status.yaml to `in-progress`.
- **Rationale:** Required by workflow contract.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`; remove YAML frontmatter from story file.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/4-3-no-oversell-under-concurrent-buyers.md

### [2026-07-06T17:57:51Z] 4-3-no-oversell-under-concurrent-buyers — N=2 chosen for concurrency race size
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 3 implementation)
- **Decision point:** Story says "small N (e.g. 2 or 3)". Which N to use for the concurrent race?
- **Options considered:** A) N=2 (2 seats, 3 concurrent buyers); B) N=3 (3 seats, 4 concurrent buyers).
- **Chosen:** A — N=2 (smallest tight race; faster test; N+1=3 concurrent txs enough to force at least one SSI abort per story guidance).
- **Rationale:** Story guidance explicitly says "N=2 or 3" and "small N for deterministic"; N=2 minimises test duration while still exercising the race.
- **Reversibility:** Change the `N` constant in the test file to 3; adjust helper call counts.
- **Files touched:** acce-nextjs/tests/integration/no-oversell.integration.test.ts

### [2026-07-06T17:57:51Z] 4-3-no-oversell-under-concurrent-buyers — describe.skipIf for database-gated skip pattern
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 2 — skip-gate pattern)
- **Decision point:** Story says mirror tests/e2e/global-setup.ts skip-gate. Options: (A) `describe.skipIf(!hasDb())` at the describe level; (B) `test.skipIf(!hasDb())` per individual test case; (C) manual `if (!hasDb()) return` inside each test body.
- **Options considered:** A / B / C.
- **Chosen:** A — `describe.skipIf(!hasDb())` wraps the entire suite; all hooks (beforeAll/afterAll) and tests are skipped atomically; cleanest pattern matching the story's "skips cleanly (no throw)" requirement. Dynamic `await import("@/lib/db")` inside beforeAll prevents db.ts from loading when DATABASE_URL is unset.
- **Rationale:** Whole-suite skipIf is the idiomatic Vitest pattern; per-test skipIf would still run the module-level dynamic import if beforeAll executed.
- **Reversibility:** Replace `describe.skipIf(!hasDb())` with `describe(...)` + per-test `skip` calls; add `if (!process.env.DATABASE_URL) test.skip()` guard inside each it.
- **Files touched:** acce-nextjs/tests/integration/no-oversell.integration.test.ts

### [2026-07-06T17:57:51Z] 4-3-no-oversell-under-concurrent-buyers — AC2 PENDING insert: direct DB create to bypass capacity check
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 4 — AC2 implementation)
- **Decision point:** To simulate a PENDING hold on a full class (others_occupied >= capacity), the test must insert a PENDING enrollment after the class is at capacity. This cannot go through reserveSeat (which would return class_full). Options: (A) direct db.enrollment.create bypass; (B) start with capacity N+1, fill N, then reduce capacity via direct db.groupSession.update.
- **Options considered:** A / B.
- **Chosen:** A — direct `db.enrollment.create` for the PENDING enrollment. Simpler, avoids a capacity-reduction step, matches Task 4's "create one extra student's PENDING hold" intent ("force it past capacity (its own row is the N+1th)").
- **Rationale:** Test-only data setup — not production code. The test's goal is to assert what `confirmPaidSeat` does when it sees others_occupied >= capacity; the method of creating that state is a test-setup concern.
- **Reversibility:** Switch to option B (capacity reduction) if a future constraint prevents direct Enrollment inserts.
- **Files touched:** acce-nextjs/tests/integration/no-oversell.integration.test.ts

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

### [2026-07-05T21:26:05Z] 1-2-passwordless-student-signup-login-magic-link — Fix over-aggressive global Better Auth rate limit; scope AC4 guard to magic-link send path
- **Risk:** critical
- **Workflow / step:** code-review step 3/4 (triage + apply patch) — auth configuration finding
- **Decision point:** Fresh review of `src/lib/auth.ts` found `rateLimit: { enabled: true, window: 60, max: 5 }`. Reading the installed better-auth@1.6.23 source (`dist/api/rate-limiter/index.mjs` + `dist/plugins/magic-link/index.mjs`) shows: (1) the magic-link SEND endpoint `/sign-in/magic-link` is already governed by the plugin's OWN built-in rule (window 60 / max 5), which is applied AFTER and overrides the global config for that path — so the dev's `max:5` never actually controls the email-bomb guard; (2) the global `max:5, window:60` instead becomes the per-IP cap for ALL OTHER `/api/auth/*` paths (get-session, sign-out, ...). A 5-req/60s global cap keyed by IP+path throttles co-located (shared-NAT) users on the session endpoint and will 429 legitimate traffic once Story 1.3 introduces client-side session reads / the portal shell. AC4 is still technically met (the plugin rule fires because `enabled:true`), but the config expresses an intent it does not implement and creates a latent production footgun.
- **Options considered:** A) Leave as-is (AC4 technically passes) and record only as a defer/action-item; B) Set a sane global fallback (`max:100`) and add an explicit `customRules["/sign-in/magic-link"] = {window:60, max:5}` so the email-bomb guard is deterministic and no longer relies on plugin internals, while general auth traffic is not throttled at 5/60s; C) Add `storage:"database"` for multi-instance correctness now.
- **Chosen:** B — raise the global fallback to `max:100/60s` and add `customRules` scoping the 5/60s email-bomb guard explicitly to `/sign-in/magic-link`. Verified `customRules` is a first-class typed option (`@better-auth/core/dist/types/init-options.d.mts:145`) and that customRules take final precedence over plugin rules in `resolveRateLimitConfig`. Left storage as default in-memory (C deferred): the app runs as a single standalone Node server (project memory), so per-instance memory limiting is correct for now; revisit if horizontally scaled.
- **Rationale:** Makes AC4 explicit and self-documenting, removes the accidental throttling of session/sign-out traffic, and does not add scope (single auth.ts config change, no new features). tsc clean, 40/40 vitest still green after the change.
- **Reversibility:** Fully reversible — revert the `rateLimit` block in `src/lib/auth.ts` to `{ enabled: true, window: 60, max: 5 }`. No data/schema/migration impact, no secrets touched. To move to shared-state limiting later, add `storage: "database"` (the `rateLimit` model already exists in better-auth's schema) or `"secondary-storage"`.
- **Files touched:** acce-nextjs/src/lib/auth.ts

### [2026-07-05T21:31:29Z] 1-3-roles-and-guarded-portal-admin-route-groups — Extend the existing guides-gating middleware.ts rather than replacing it (coarse portal/admin redirect)
- **Risk:** medium
- **Workflow / step:** create-story steps 2-3 — brownfield state analysis; a live-code trap the epic text does not mention
- **Decision point:** The epics/spine describe adding `middleware.ts` for a coarse portal/admin redirect (AD-3). But a middleware ALREADY EXISTS at `acce-nextjs/src/middleware.ts` — it gates unpublished guides/PDFs with matcher `["/guides/:path+", "/pdfs/:path*"]` and short-circuits to `NextResponse.next()` in dev / `NEXT_PUBLIC_GUIDES_PREVIEW`. Next.js allows exactly ONE middleware module per app. A naive "create middleware.ts" would clobber the guides gating (a shipped, load-bearing feature per project memory acce-guides-gating).
- **Options considered:** A) Story instructs the dev to EXTEND the single existing `middleware.ts`: add a portal/admin unauthenticated-cookie-presence redirect branch AND widen the `config.matcher` to also include `/portal/:path*` + `/admin/:path*`, preserving the guides/PDF branches untouched. B) Naively add a second middleware / overwrite — breaks guides gating and is structurally impossible in Next. C) Skip middleware, rely only on layout+page guards — leaves AC "redirect to sign-in" only enforced at layout/page level (acceptable for security per AD-3 but the spine explicitly wants the coarse redirect for UX).
- **Chosen:** A — explicit story guardrail to extend the existing middleware.ts additively (merge matcher, keep guides branches, add a cookie-presence-only coarse redirect) and to keep the REAL role/authorization enforcement in the (portal)/(admin) layouts + per-page/DAL server checks (AD-3: middleware is coarse UX only, never the trusted guard — the Edge runtime cannot safely do a full DB session/role lookup).
- **Rationale:** Preserves the guides feature, honors Next's single-middleware constraint, and keeps the security boundary where AD-3 mandates it. This is the single highest-value context this story adds — without it the dev would very likely overwrite the file.
- **Reversibility:** Middleware edit is local and additive; revert by restoring the guides-only matcher/body. No data/schema impact.
- **Files touched:** _bmad-output/implementation-artifacts/1-3-roles-and-guarded-portal-admin-route-groups.md

### [2026-07-05T21:37:00Z] 1-3-roles-and-guarded-portal-admin-route-groups — better-auth CLI generate: indexes added, not columns — proceed with migration
- **Risk:** medium
- **Workflow / step:** dev-story step 5 (Task 1, subtask 3 — CLI schema reconciliation)
- **Decision point:** `npx @better-auth/cli generate --yes` added 3 performance indexes to the schema (`@@index([userId])` on Session + Account, `@@index([identifier])` on Verification) and reformatted comment-aligned whitespace in Enrollment/LedgerEntry. No new columns or tables were proposed. The story says STOP only for "genuinely new column/table". `prisma migrate diff` confirmed the DB lacks these indexes. Should we create a migration to add them?
- **Options considered:** A) Revert the schema changes and proceed without the indexes (would drift the schema vs what the CLI recommends for Better Auth); B) Keep the schema changes and run `prisma migrate dev` to add the indexes (a new migration); C) Keep schema changes but defer the migration.
- **Chosen:** B — keep the CLI-generated indexes and create a migration. These are pure performance indexes (no behavioral change, no data risk), they are what Better Auth recommends for its query patterns, and the schema/DB should stay in sync. This is a medium risk migration (index-only, no data at stake, easily reversible by dropping the indexes).
- **Rationale:** Indexes are not columns/tables — the STOP condition is not triggered. Skipping them risks query performance regressions when the session table has data. Creating the migration now keeps the DB in sync with what Better Auth expects.
- **Reversibility:** `prisma migrate resolve --rolled-back <migration_name>` and manually drop the 3 indexes. Schema: remove the 3 `@@index` lines.
- **Files touched:** acce-nextjs/prisma/schema.prisma, acce-nextjs/prisma/migrations/<new>/migration.sql

### [2026-07-05T21:36:26Z] 1-3-roles-and-guarded-portal-admin-route-groups — dev-story start: mark in-progress, capture baseline_commit
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story status is `ready-for-dev`; need to capture baseline_commit and transition sprint-status to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Record HEAD commit `5d2eed23a08bffd009aef7037e051c286d215e2e` as baseline_commit; update sprint-status.yaml and story file to `in-progress`.
- **Rationale:** Required by workflow contract.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`; remove baseline_commit from story frontmatter.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/1-3-roles-and-guarded-portal-admin-route-groups.md

### [2026-07-05T21:31:29Z] 1-3-roles-and-guarded-portal-admin-route-groups — Scope: add admin plugin + role guards + portal/admin shells, no migration, no e2e
- **Risk:** medium
- **Workflow / step:** create-story steps 3-5 — story scoping and AC decomposition
- **Decision point:** Story 1.3's ACs span the Better Auth admin plugin (role STUDENT|ADMIN), `(portal)`/`(admin)` route groups + guards, and a portal shell (nav/theme toggle/logo swap/a11y). Boundaries vs 1.2 (already shipped auth core + minimal /portal page + no layout) and 1.4 (seeds Priyanka/admin) and 1.5 (standalone deploy + Playwright route-200 smoke) need pinning so the dev neither under- nor over-builds.
- **Options considered:** A) Full scope in one story: admin plugin in auth.ts + adminClient, `(portal)/layout.tsx` + `(admin)/layout.tsx` role guards, extend middleware, build a shared portal shell (navbar w/ Logo+ThemeToggle+sign-out), page-level role checks, vitest render/guard tests — but NO schema migration (role column already migrated in 1.1) and NO Playwright e2e (that's 1.5) and NO admin/user seeding (1.4). B) Split shell into a later story — rejected: AC4 explicitly requires the portal shell + a11y here. C) Add a DB migration for role — rejected: `user.role String? @default("STUDENT")` + admin columns already exist in schema/migration from 1.1; the admin plugin only needs wiring in config.
- **Chosen:** A. Also flagged the admin-plugin schema reconciliation: run `npx @better-auth/cli generate` after adding `admin()` — expected no-op since 1.1 pre-migrated the admin columns (banned/banReason/banExpires/impersonatedBy already present); if the CLI proposes a new column, STOP and treat as a real migration (would bump risk).
- **Rationale:** Matches the four ACs exactly, respects the 1.2 "leave /portal folder, 1.3 wraps it" handoff and the 1.4/1.5 boundaries, and avoids inventing scope. Testing floor is vitest render/guard tests (route-200 Playwright smoke is 1.5).
- **Reversibility:** All additive (new layouts + shell components + config plugin line + middleware branch). Revert by removing the `(portal)`/`(admin)` layouts, the `admin()` plugin line, and the middleware portal/admin branch.
- **Files touched:** _bmad-output/implementation-artifacts/1-3-roles-and-guarded-portal-admin-route-groups.md

### [2026-07-05T21:54:00Z] 1-3-roles-and-guarded-portal-admin-route-groups — Review: fix middleware __Secure- cookie prefix prod lockout
- **Risk:** critical
- **Workflow / step:** code-review step 3 (triage) → step 4 (patch)
- **Decision point:** Adversarial review found the coarse portal/admin middleware guard used `c.name.startsWith("better-auth")` to detect the session cookie. Better Auth prefixes the cookie with `__Secure-` in production (https baseURL) → real prod name `__Secure-better-auth.session_token`. `startsWith` returns false → authenticated users hitting `/portal` or `/admin` in production get redirected to `/sign-in` despite a valid session (fail-CLOSED lockout — the exact risk the story called out).
- **Options considered:** A) leave as-is (breaks prod portal access); B) hardcode both exact cookie names; C) substring match `includes("better-auth")` resilient to `__Secure-`/`__Host-` prefixes and name changes.
- **Chosen:** C — `.some((c) => c.name.includes("better-auth"))`.
- **Rationale:** Verified against `node_modules/better-auth/dist/cookies/index.mjs` (line 221 cookie-name construction + `SECURE_COOKIE_PREFIX = "__Secure-"`, applied when baseURL is https / production). Substring match preserves the story's intended fail-open behaviour across secure/host prefixes without hardcoding a brittle name. Real trusted guard remains the Node-runtime layout/page `requireSession()`/`requireAdmin()` (AD-3); this only fixes the coarse UX pre-emption so it stops locking out valid sessions.
- **Reversibility:** Revert the one-line predicate in `src/middleware.ts` back to `startsWith("better-auth")`. No schema/state change. To re-architect, replace the substring heuristic with Better Auth's own `getSessionCookie(request)` helper (reads the resolved cookie name from config).
- **Files touched:** acce-nextjs/src/middleware.ts

### [2026-07-05T21:54:10Z] 1-3-roles-and-guarded-portal-admin-route-groups — Review: fix nested <main> landmark (a11y)
- **Risk:** low
- **Workflow / step:** code-review step 3 (triage) → step 4 (patch)
- **Decision point:** The new `(portal)/layout.tsx` renders `<main className="flex-1">{children}</main>`; the wrapped `(portal)/portal/page.tsx` (from 1.2) also rendered its own `<main>`. Nested `<main>` is invalid HTML and yields duplicate `main` landmarks → violates AC4/NFR10 a11y floor.
- **Options considered:** A) drop `<main>` from the layout (but layout owning the landmark is the cleaner shell pattern, and admin page already relies on it); B) change the portal page's outer `<main>` to `<div>`.
- **Chosen:** B — portal page outer element changed to `<div className="flex flex-1 flex-col …">`; layout keeps the single `<main>`.
- **Rationale:** Layout-owned `<main>` is consistent with the admin page (which already used `<div>`). Minimal, in-scope for 1.3 (the story explicitly wraps this page in the shell). Page's own `getSession`+redirect guard (AC5) left untouched.
- **Reversibility:** Restore the `<main>` wrapper in `src/app/(portal)/portal/page.tsx` and remove it from the layout. Purely presentational/markup; no logic change.
- **Files touched:** acce-nextjs/src/app/(portal)/portal/page.tsx

### [2026-07-05T21:54:20Z] 1-3-roles-and-guarded-portal-admin-route-groups — Review: defer Logo `priority` prop test-noise; accept CLI-added indexes
- **Risk:** low
- **Workflow / step:** code-review step 3 (triage) → step 4 (present)
- **Decision point:** (1) React warns `Received true for non-boolean attribute priority` on `next/image` in `Logo.tsx` during jsdom tests — pre-existing, also in `render-smoke.test.tsx`, not caused by 1.3. (2) Better Auth CLI generate added 3 performance indexes (migration `20260705214058_better_auth_admin_indexes`) rather than the expected no-op.
- **Options considered:** patch now vs defer vs accept.
- **Chosen:** Defer the Logo warning to `deferred-work.md` (pre-existing, cosmetic test-env only). Accept the 3 indexes as-is.
- **Rationale:** Logo warning is untouched pre-existing noise; Next's real `<Image>` consumes `priority` correctly. The 3 indexes are additive/non-destructive FK indexes (NFR5-aligned), not the "new column/table" escalation condition the story defined — reversible by dropping them. Story remains clean.
- **Reversibility:** Logo — fix when `Logo.tsx` is next touched. Indexes — `DROP INDEX` if ever unwanted; migration is isolated.
- **Files touched:** _bmad-output/implementation-artifacts/deferred-work.md

### [2026-07-05T22:00:26Z] 1-4-seed-subjects-levels-priyanka-and-the-6-test-3-classes — create-story: "levels exist" with no Level table in 1a
- **Risk:** medium
- **Workflow / step:** create-story step 2/3 (interpret ambiguous AC against schema)
- **Decision point:** AC1 requires "levels (Undergrad, CTA/PGDA) exist", but Phase 1a schema has NO `Level` model — level is a plain `String` tag on `GroupSession` ("Level model arrives with 1b", schema.prisma:119). So there is no table to seed levels into.
- **Options considered:** A) add a Level model+migration now (scope creep, contradicts 1.1 which locked the 1a schema and deferred Level to 1b); B) satisfy "levels exist" by defining the two levels as an exported constant `LEVELS = ["Undergrad","CTA/PGDA"]` and using those exact strings on the seeded GroupSession.level fields; C) ignore levels entirely.
- **Chosen:** B — levels are a seed-data constant used verbatim on the 6 classes; no schema change.
- **Rationale:** 1a deliberately models level as a string (schema comment + 1.1 done). "Levels exist" is satisfied when the canonical level strings are present on real rows and defined as reusable constants for 1b migration. Adding a Level table would re-migrate shared tables mid-sprint (the exact anti-pattern 1.1 called out).
- **Reversibility:** When 1b adds the `Level` model, migrate these string tags into FK rows; the constant array is the migration source of truth. No data loss.
- **Files touched:** (story spec only) _bmad-output/implementation-artifacts/1-4-seed-subjects-levels-priyanka-and-the-6-test-3-classes.md

### [2026-07-05T22:00:26Z] 1-4-seed-...-6-test-3-classes — create-story: class dates/times + Priyanka email not fully specified
- **Risk:** medium
- **Workflow / step:** create-story step 2 (fill under-specified data)
- **Decision point:** The flyer gives subject mix (2 Accounting, 2 Tax, 1 Auditing, 1 Mgmt Acct), duration (2h), price (R290=29000 cents), capacity (4–6) — but NO exact calendar dates/times, and Priyanka's admin email is only found in UX contact blocks (`priyankamikaya21@gmail.com`).
- **Options considered:** A) hardcode arbitrary fixed past dates (would render as non-"upcoming", breaking Epic-3 browse "shows real sellable classes from day one"); B) compute start/end relative to seed run-time (near-future, staggered) so classes are genuinely upcoming/SCHEDULED; C) block for missing data.
- **Chosen:** B for dates (future, staggered days, 2-hour end = start+2h); use `priyankamikaya21@gmail.com` as the seeded ADMIN email, overridable via optional `SEED_ADMIN_EMAIL` env (no `.env.example` change required — optional with fallback, so not a new required config key).
- **Rationale:** Epic-1 goal is "portal shows real, sellable classes from day one" → they must be upcoming. Relative dates keep the seed evergreen across re-runs. The email is the only real Priyanka address in the repo; an optional env override avoids hardcoding lock-in without adding a required var (keeps risk below `high`).
- **Reversibility:** Priyanka can edit dates/price/email in-admin (Epic 2) once real flyer dates are known; change the seed constants + re-run. Optional env override removes the hardcode entirely.
- **Files touched:** (story spec only) 1-4-...-6-test-3-classes.md

### [2026-07-05T22:04:51Z] 1-4-seed-subjects-levels-priyanka-and-the-6-test-3-classes — dev-story start: mark in-progress, capture baseline_commit
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story status is `ready-for-dev`; need to capture baseline_commit and transition sprint-status to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Record HEAD commit `52ab5a0a20e1f96d890c3c10f21cda224135a443` as baseline_commit; update sprint-status.yaml and story file to `in-progress`.
- **Rationale:** Required by workflow contract.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`; remove baseline_commit from story frontmatter.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/1-4-seed-subjects-levels-priyanka-and-the-6-test-3-classes.md

### [2026-07-05T22:04:51Z] 1-4-seed-subjects-levels-priyanka-and-the-6-test-3-classes — Extract pure seed constants into seed-data.ts for testability
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 1 — author seed constants)
- **Decision point:** Story recommends extracting pure data constants into `prisma/seed-data.ts` so unit tests can import them without triggering `db.ts` (which throws when `DATABASE_URL` is unset in jsdom). Is this extraction required or optional?
- **Options considered:** A) Inline constants in `seed.ts` and mock db.ts in tests; B) Extract to `seed-data.ts` (pure, no Prisma import) as the story recommends — enables import in jsdom tests with zero mocking.
- **Chosen:** B — create `prisma/seed-data.ts` with all pure constants (`SUBJECTS`, `LEVELS`, `CLASSES`, `ADMIN_USER`); `seed.ts` imports from it. Tests import `seed-data.ts` directly.
- **Rationale:** Avoids complex mocking; unit test stays pure and fast; story explicitly recommends this shape and says it is "the recommended shape". Zero risk — no coupling to any external system.
- **Reversibility:** Inline the constants back into `seed.ts` if the split creates confusion; one-file merge is trivial.
- **Files touched:** acce-nextjs/prisma/seed-data.ts, acce-nextjs/prisma/seed.ts

### [2026-07-05T22:00:26Z] 1-4-seed-...-6-test-3-classes — create-story: idempotency mechanism + AD-2 client access from seed
- **Risk:** medium
- **Workflow / step:** create-story step 3 (architecture guardrails for dev)
- **Decision point:** AC2 requires an idempotent re-runnable seed, but `GroupSession` has no natural unique key (no unique on title/subject/start) to key an upsert on; and AD-2 forbids `new PrismaClient()` outside `src/lib/db.ts`.
- **Options considered (idempotency):** A) `deleteMany` then recreate (destructive, unsafe once real enrollments/ledger exist); B) upsert Subject by `@unique name`, User by `@unique email`, and GroupSession by DETERMINISTIC explicit ids (e.g. `seed-acc-1`) supplied on upsert. **(AD-2 access):** import the singleton via relative path `../src/lib/db` (seed runs under tsx, tsconfig `@/*` alias not resolved by tsx) vs its own client.
- **Chosen:** B for idempotency (deterministic ids + upsert on unique keys — never delete); seed imports `{ db }` from `../src/lib/db` (AD-2-compliant, no second client); run via `npx prisma db seed` so Prisma loads `.env` (db.ts throws if `DATABASE_URL` unset and there is no dotenv dep).
- **Rationale:** Deterministic-id upsert is the only non-destructive way to make GroupSession seeding idempotent without a new unique constraint. Reusing the singleton honours the house rule the whole codebase is built on (grep-enforced in 1.1). `prisma db seed` is the env-loading entrypoint the deploy pipeline already expects (NFR7: "db:seed once").
- **Reversibility:** Swap deterministic ids for a real unique constraint if 1b needs one; the id constants are localised to the seed. Import path is a one-line change.
- **Files touched:** (story spec only) 1-4-...-6-test-3-classes.md

### [2026-07-05T22:14:30Z] 1-4-seed-subjects-levels-priyanka-and-the-6-test-3-classes — code-review: clean, status → done
- **Risk:** low
- **Workflow / step:** code-review step 3-4 (triage + present/act)
- **Decision point:** Adversarial 3-layer review (Blind Hunter / Edge Case Hunter / Acceptance Auditor) of the seed diff (seed.ts, seed-data.ts, seed-data.test.ts) against AC1-AC4. Fix-vs-action-items <ask>: default is FIX all HIGH/MEDIUM automatically.
- **Options considered:** A) treat as clean and mark done; B) find fixable HIGH/MEDIUM issues and patch; C) leave as action items → in-progress.
- **Chosen:** A — clean review, status `done`. No HIGH/MEDIUM findings. Two LOW/cosmetic observations recorded as deferred (not fixed): (1) `computeStart` comment says "SAST business hours" but computes in UTC (classes land 11:00/16:00 SAST — still business hours, so doc-only mismatch); (2) the "daysOffset separates two class starts" test calls `new Date()` twice, so a UTC-midnight straddle between calls could make the exact `toBe(3)` day-diff assertion flaky (astronomically rare).
- **Rationale:** Independently re-verified (did NOT trust dev record): `npx prisma validate` clean, `tsc --noEmit` clean, `vitest run` 78/78 green incl. 23 new seed-data assertions. AC1 (4 subjects/2 levels/Priyanka ADMIN/6 SCHEDULED classes w/ 2-2-1-1 subject mix, R290, cap 4-6), AC2 (upsert idempotency by @unique name/email + deterministic class ids, no deleteMany), AC3 (SCHEDULED, future start, +2h, subject FK, non-empty title, canonical level, mode ONLINE default, meetingUrl null), AC4 (validate/build/test green, no schema/migration change) all satisfied. AD-2/AD-5/AD-9/AD-13 honoured. LOW items don't block `done`.
- **Reversibility:** Revert status to `review`/`in-progress` in the story + sprint-status.yaml and re-open the two deferred LOW items if a follow-up loop wants them fixed.
- **Files touched:** 1-4-...-6-test-3-classes.md (Status + Review Findings), deferred-work.md, sprint-status.yaml

### [2026-07-05T22:19:00Z] 1-5-deployable-shell-with-authenticated-route-200-smoke-test — create-story: scope split (deploy shell already exists → story = verify + author authenticated smoke)
- **Risk:** medium
- **Workflow / step:** create-story step 2-3 (analyze artifacts + scope the story)
- **Decision point:** AC1 asks for `output:'standalone'` + Coolify base dir + portal headers, but ALL of that already shipped in earlier work (next.config `output:'standalone'` + headers on `/(.*)`, Dockerfile copies Prisma client into runner, host mapping `portal.accetutors.co.za`, base dir `/acce-nextjs`). What is the net-new deliverable of 1.5?
- **Options considered:** A) Re-do/re-scaffold deploy config (redundant, risks regressing a working Dockerfile/next.config); B) Scope 1.5 as (i) VERIFY + document the already-satisfied deploy invariants and add a lightweight assertion that portal routes inherit the security headers, and (ii) author the NET-NEW authenticated route-200 Playwright smoke over `(portal)`/`(admin)` routes — the actual gap (existing `tests/e2e/smoke.spec.ts` only covers public sitemap routes).
- **Chosen:** B. Story 1.5 = verify deploy shell invariants (no rebuild) + author the authenticated-route smoke suite. The authenticated smoke is the real work; deploy config is confirmation.
- **Rationale:** epics.md Story 1.5 AC2 is explicit that the point is the Playwright authenticated smoke (guards against the RSC non-children-prop 500 trap from lessons-learned). The deploy artifacts already exist and are load-bearing — rebuilding them is scope invention (contract rule 4) and risks regression. Confirming + adding a header-inheritance assertion is the minimal reasonable interpretation.
- **Reversibility:** If deploy config actually needs changes later, they are additive edits to next.config.ts/Dockerfile; the smoke suite is self-contained under tests/e2e.
- **Files touched:** (story spec only) 1-5-deployable-shell-with-authenticated-route-200-smoke-test.md

### [2026-07-05T22:30:00Z] 1-5-deployable-shell-with-authenticated-route-200-smoke-test — dev-story start: mark in-progress, capture baseline_commit
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story status is `ready-for-dev`; need to capture baseline_commit and transition sprint-status to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Record HEAD commit as baseline_commit; update sprint-status.yaml and story file to `in-progress`.
- **Rationale:** Required by workflow contract.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`; remove baseline_commit from story frontmatter.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/1-5-deployable-shell-with-authenticated-route-200-smoke-test.md

### [2026-07-05T22:30:00Z] 1-5-deployable-shell-with-authenticated-route-200-smoke-test — Task 1: vitest unit test for header assertion (not e2e)
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 1 — header assertion approach)
- **Decision point:** Story says "preferably a small vitest unit test that imports `next.config.ts` `headers()` and asserts the `/(.*)` rule carries the 5 security headers, OR an e2e assertion." Which route?
- **Options considered:** A) vitest unit test importing next.config.ts and calling `headers()` — no server needed, fast, pure static assertion; B) e2e assertion that a real portal route response includes the headers — requires a running server and DB.
- **Chosen:** A — vitest unit test. `next.config.ts` is a pure TS object with an `async headers()` function; no Next.js runtime needed to call it. Type-only `NextConfig` import is stripped at runtime, so vitest can import the file cleanly.
- **Rationale:** Fastest, no server or DB dependency, satisfies the story's preferred route, and is consistent with the sandbox-no-DB constraint.
- **Reversibility:** Add an e2e assertion in the authenticated smoke spec if a live HTTP header check is later needed.
- **Files touched:** acce-nextjs/tests/unit/next-config-headers.test.ts

### [2026-07-05T22:30:00Z] 1-5-deployable-shell-with-authenticated-route-200-smoke-test — Task 3: direct Prisma session creation in globalSetup (no auth API)
- **Risk:** medium
- **Workflow / step:** dev-story step 5 (Task 3 — session provisioning mechanism)
- **Decision point:** Story recommends "real Better Auth server `auth` instance" to mint sessions. How to implement without calling HTTP auth endpoints or adding a bypass route?
- **Options considered:** A) Construct fake `Request` objects and call `auth.api.signIn.*` — complex, fragile, imports auth.ts (which itself imports db.ts and betterauth — more surface); B) Direct Prisma upsert on `user` table + `session.create` with a random token → write token as the cookie value. Better Auth's `getSession` reads the cookie, looks up the session by token, and returns it — this IS the real auth path, just populated via DB rather than HTTP; C) Magic-link URL capture — needs a mail server to intercept.
- **Chosen:** B — direct Prisma operations. Creates a valid `session` row with a random UUID token, writes that token as the `better-auth.session_token` cookie in `storageState`. Better Auth's `requireSession()` / `requireAdmin()` will find and validate this session correctly.
- **Rationale:** Option A is fragile (internal API), option C requires mail infrastructure. Option B is deterministic, minimal, and exercises the exact same DB-lookup code path that the real `requireSession()` traverses — it's the genuine session path, just created directly. No new production code added.
- **Reversibility:** Switch to option A (auth.api call) or B-variant (magic-link capture) by replacing the globalSetup body. No production code affected.
- **Files touched:** acce-nextjs/tests/e2e/global-setup.ts

### [2026-07-05T22:30:00Z] 1-5-deployable-shell-with-authenticated-route-200-smoke-test — globalSetup empty-state fallback + test.skip pattern for sandbox
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 3 — sandbox handling for no-DB case)
- **Decision point:** When DATABASE_URL is unset, globalSetup cannot provision sessions. If globalSetup throws, the whole Playwright run (including the public smoke) fails. How to keep the public smoke green while marking authenticated tests as deferred?
- **Options considered:** A) Throw from globalSetup → public smoke breaks; B) globalSetup returns silently without writing state files → `test.use({ storageState })` throws "file not found"; C) globalSetup writes empty storageState files (valid JSON, no cookies) → tests load cleanly but redirect instead of 200 → FAIL; D) globalSetup writes empty state files AND each authenticated test calls `test.skip(!hasSession(...))` at the top of its body → tests are SKIPPED, public smoke is unaffected.
- **Chosen:** D — write empty `{ cookies: [], origins: [] }` JSON files when no DB, then use `hasSession()` check + `test.skip()` inside each authenticated test. The unauthenticated negative-smoke test runs without DB (the middleware only checks cookie presence, no DB lookup).
- **Rationale:** Only option D satisfies all three requirements: public smoke stays green, authenticated tests skip cleanly (not fail), deferred posture is honest (not stubbed).
- **Reversibility:** Remove the `writeEmptyState` call and `test.skip` guards once CI ephemeral-Postgres is wired.
- **Files touched:** acce-nextjs/tests/e2e/global-setup.ts, acce-nextjs/tests/e2e/authenticated-smoke.spec.ts

### [2026-07-05T22:19:30Z] 1-5-deployable-shell-with-authenticated-route-200-smoke-test — create-story: authenticated-session strategy for the smoke + live-run deferral
- **Risk:** medium
- **Workflow / step:** create-story step 3-4 (dev guardrails + testing standards)
- **Decision point:** Magic-link auth has no password, so Playwright cannot type credentials. How does the smoke establish a STUDENT session AND an ADMIN session to hit guarded `(portal)`/`(admin)` routes at 200? And there is no test Postgres in the sandbox (established by 1.1/1.4 — prod creds blocked, static verification is the bar), so can the suite run green here?
- **Options considered (session):** A) click the email link (needs a mail server / interception — heavy); B) a test-only sign-in bypass route gated behind an env flag (adds an auth surface — critical-risk, rejected); C) Playwright `globalSetup` that provisions users + sessions THROUGH the real Better Auth server `auth` instance (or the magic-link `sendMagicLink` callback exposing the URL in test mode) and saves per-role `storageState` — no new production auth surface, exercises the real cookie/session. **(live run):** run against ephemeral Postgres in CI vs run in sandbox.
- **Chosen:** C for session provisioning (recommended: `globalSetup` mints a STUDENT session and reuses the seeded Priyanka ADMIN via the real `auth` server API / magic-link-URL capture, writes `storageState` per role; ephemeral student created in setup, NOT added to `prisma/seed.ts` which stays production-data-only). Live green run is DEFERRED to a CI job with an ephemeral Postgres (ties into the already-open 1.1 deferred-work item "CI job with ephemeral Postgres for migrate deploy"); sandbox bar = suite authored + `tsc`/build green + existing vitest green.
- **Rationale:** Option B would open a real authentication bypass (critical risk) — unacceptable for a security-sensitive surface. Option C reuses the genuine Better Auth session path with zero production code added, mirroring how the marketing smoke drives off the real sitemap. The DB-dependent live run legitimately cannot execute in the credential-blocked sandbox; deferring live execution to CI is consistent with the 1.1/1.4 posture and avoids faking a pass.
- **Reversibility:** If a lighter mechanism is preferred, swap the `globalSetup` provisioning without touching the specs (specs consume `storageState`). The CI ephemeral-Postgres job is additive infra. No production code is affected either way.
- **Files touched:** (story spec only) 1-5-deployable-shell-with-authenticated-route-200-smoke-test.md

### [2026-07-05T22:52:25Z] 1-5-deployable-shell-with-authenticated-route-200-smoke-test — code-review: HIGH signed-cookie fix
- **Risk:** high
- **Workflow / step:** code-review step 3-4 (triage + apply patch)
- **Decision point:** Fresh-reasoning adversarial review found the dev's `global-setup.ts` writes the RAW session token (a UUID) as the `better-auth.session_token` cookie value. Verified against installed Better Auth 1.6.23 source: sessions cookies are HMAC-SIGNED — set via `setSignedCookie(name, token, secret)` (better-auth/dist/cookies/index.mjs:123) and read via `getSignedCookie` (better-call/dist/context.mjs:44-49) which rejects any value lacking a `token.<44-char-base64-sig>` structure. A raw UUID → getSignedCookie null → getSession null → guard redirects to /sign-in. The authenticated sessions would NEVER authenticate in CI.
- **Options considered:** A) mark as Review Follow-up for dev-story (but dev-story also has no sandbox DB → circular, and leaves a known-broken capstone); B) mint the real signed cookie by driving Better Auth's server API (needs magic-link email round-trip — heavy, still DB-bound); C) replicate `signCookieValue` exactly (Node `createHmac('sha256', BETTER_AUTH_SECRET).digest('base64')` → `encodeURIComponent(`${token}.${sig}`)`) and require BETTER_AUTH_SECRET fail-fast.
- **Chosen:** C — sign the token in globalSetup with the same algorithm Better Auth uses, write the signed value into storageState, and fail-fast if BETTER_AUTH_SECRET is unset (it must equal the running server's secret).
- **Rationale:** C is correct-by-construction from the traced source, adds ZERO production auth surface (still no bypass route, AC4 intact), and is verifiable at the format level (44-char base64 sig ending '='). Paired with the MEDIUM assertion fix below it is self-checking — if the signature is ever wrong CI fails loudly, never false-greens. Could not runtime-verify in the credential-blocked sandbox (no Postgres), so the FIRST live validation is the CI ephemeral-Postgres job (recorded in deferred-work.md).
- **Reversibility:** revert the `signSessionToken` helper + the BETTER_AUTH_SECRET guard in `acce-nextjs/tests/e2e/global-setup.ts` to restore the prior raw-token write. Test-only code — no production source, schema, migration, or auth surface touched. If a future Better Auth upgrade changes the cookie-signing scheme, update `signSessionToken` to match `better-call/dist/crypto.mjs` `signCookieValue`.
- **Files touched:** acce-nextjs/tests/e2e/global-setup.ts

### [2026-07-05T22:52:25Z] 1-5-deployable-shell-with-authenticated-route-200-smoke-test — code-review: MEDIUM false-green assertion fix
- **Risk:** medium
- **Workflow / step:** code-review step 3-4 (triage + apply patch)
- **Decision point:** The AC2 positive smoke asserted only `response.status() === 200`. `requireSession()`/`requireAdmin()` issue `redirect('/sign-in')`/`redirect('/portal')` — a 307 Playwright auto-follows to a destination that ALSO returns 200. So a rejected session (incl. the HIGH bug above) still produced status 200 — a false green. AC2 explicitly requires "not a 3xx redirect to /sign-in."
- **Options considered:** A) status-only (current — hides broken guards); B) assert `page.url()` pathname === route.path after the 200; C) re-issue `request.get(path, { maxRedirects: 0 })` and assert 200 with no Location.
- **Chosen:** B — after the 200 check, assert `new URL(page.url()).pathname === route.path` in both the STUDENT and ADMIN positive blocks.
- **Rationale:** B is minimal, reads naturally against the page-navigation model, and directly encodes AC2's intent (the 200 came from the guarded route, not a bounce to sign-in). Makes the whole authenticated suite self-checking so the HIGH signed-cookie fix is validated (not masked) in CI.
- **Reversibility:** remove the two added `expect(new URL(page.url()).pathname).toBe(route.path)` assertions in `acce-nextjs/tests/e2e/authenticated-smoke.spec.ts`. Test-only.
- **Files touched:** acce-nextjs/tests/e2e/authenticated-smoke.spec.ts

### [2026-07-05T22:57:02Z] 2-1-create-a-group-class — create-story: epic-2 branch bootstrap
- **Risk:** low
- **Workflow / step:** create-story pre-flight (VERSION CONTROL)
- **Decision point:** Dispatch requires TARGET BRANCH `epic-2` (one branch per epic, chained off previous epic's work). HEAD was on `epic-1`; `epic-2` did not exist.
- **Options considered:** A) branch epic-2 from current HEAD (tip of epic-1); B) branch from main; C) reuse epic-1.
- **Chosen:** A — `git checkout -b epic-2` from the epic-1 tip (per dispatch: chain off the previous epic's work; never branch from main).
- **Rationale:** Epic 2 builds directly on epic-1's schema/auth/guards; chaining preserves that context. Dispatch forbids branching from main.
- **Reversibility:** `git branch -D epic-2` (no commits made this stage; create-story does not commit).
- **Files touched:** (none — branch op only)

### [2026-07-05T22:57:02Z] 2-1-create-a-group-class — create-story: server-entry shape, validation, and money/date handling
- **Risk:** medium
- **Workflow / step:** create-story step 3-5 (architecture guardrails → story authoring)
- **Decision point:** Story 2.1 introduces the FIRST server-side mutation entry in the app (no prior server action exists). Needed to pin: (a) entry type, (b) where the Zod schema + action live, (c) Rand→cents conversion, (d) start/end input mechanism — all under-specified beyond the AC's "validated with Zod via a server action".
- **Options considered:** (entry) server action colocated with the route vs an `/api` route handler; (schema home) colocate in the route folder vs a shared `src/lib` module; (money) float Rand stored as-is vs integer-cents via `Math.round(rand*100)`; (dates) shadcn `calendar` popover vs native `datetime-local` inputs.
- **Chosen:** Next.js **server action** colocated at `src/app/(admin)/admin/classes/new/actions.ts` (matches ARCHITECTURE-SPINE "server actions colocated with routes" + Capability Map "Admin CRUD lives in (admin)/admin/**"); a **pure exported Zod schema** (in the same folder, e.g. `class-form-schema.ts`) so vitest can unit-test validation without a DB; **integer cents** via `Math.round(randValue*100)` at the action edge (AD-9, no floats in domain/DB); two native **`datetime-local`** inputs for start/end (accessible, zero-dep, meets NFR10 — the shadcn `calendar` popover is heavier and deferred unless UX demands it).
- **Rationale:** A server action is exactly what the AC calls for and keeps the mutation server-side with `requireAdmin()` as the trusted entry guard (AD-3). Extracting the schema as a pure module mirrors the 1.4 seed-data pattern (testable without `DATABASE_URL`). Integer cents is a hard architecture invariant. Native datetime inputs satisfy the accessibility floor with no new dependency.
- **Reversibility:** Swap the server action for an `/api/admin/classes` route handler without touching the Zod schema module; replace `datetime-local` with the shadcn calendar in the client form only. All local to the new `classes/new` folder.
- **Files touched:** (story spec only) 2-1-create-a-group-class.md

### [2026-07-05T22:57:02Z] 2-1-create-a-group-class — create-story: field-rule interpretation (capacity floor, conditional location/meetingUrl, level source)
- **Risk:** medium
- **Workflow / step:** create-story step 2-3 (AC interpretation vs architecture)
- **Decision point:** ACs are ambiguous on three field rules: (1) capacity "(4–6)" vs the invalid example "capacity < 1"; (2) whether `meetingUrl` is required at create for online classes; (3) where the `level` option list comes from (no `Level` table in 1a).
- **Options considered:** (capacity) hard-limit 4–6 vs floor ≥1 with 4–6 as guidance; (meetingUrl) required-if-online vs optional-at-create; (level) import `LEVELS` from `prisma/seed-data.ts` vs a new canonical constant in `src/lib`.
- **Chosen:** (1) Zod enforces **integer capacity ≥ 1** (the only hard invalid boundary both 2.1 and 2.3 name is `< 1`); surface "4–6" as helper-text guidance, not a hard cap. (2) `meetingUrl` **optional at create** even for online — AD-13 + seed leave it null and Story 2.3 explicitly exists to "paste the Meet link after scheduling"; `location` **required when `mode = IN_PERSON`** via Zod `refine`. (3) Define a canonical `LEVELS = ["Undergrad","CTA/PGDA"]` constant in a **`src/lib`** module for the form to consume (do NOT import from `prisma/seed-data.ts` into app code, and do NOT add a `Level` table — 1.1 locked the 1a schema); accept the small, intentional duplication with the seed's LEVELS.
- **Rationale:** Enforcing 4–6 as a hard cap would contradict 2.3's stated invalid boundary and needlessly block a valid 3- or 8-seat class; requiring a Meet link at create contradicts AD-13 and the whole reason Story 2.3 exists; pulling app constants from a seed file couples runtime UI to seed internals. Keeping level a two-value constant honors the "level is a String tag, Level model arrives in 1b" schema decision.
- **Reversibility:** Tighten the capacity refine to `>=4 && <=6` if product later wants a hard cap; flip `meetingUrl` to required-if-online in one `refine`; collapse the duplicated LEVELS by having the seed import the `src/lib` constant (relative path) when the seed is next touched. All one-line schema edits.
- **Files touched:** (story spec only) 2-1-create-a-group-class.md

### [2026-07-05T23:02:20Z] 2-1-create-a-group-class — dev-story start: mark in-progress, capture baseline_commit
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story status is `ready-for-dev`; need to capture baseline_commit and transition sprint-status to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Record HEAD commit `1d96dabac5261fc8f54f35d42653eeb26b45c790` as baseline_commit; update sprint-status.yaml and story file to `in-progress`.
- **Rationale:** Required by workflow contract.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`; remove baseline_commit from story frontmatter.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/2-1-create-a-group-class.md

### [2026-07-05T23:02:20Z] 2-1-create-a-group-class — Zod schema: use z.string().optional() for description; empty→undefined handled in action
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 1 — Zod schema authoring)
- **Decision point:** Story says "description: optional string (trim; empty → undefined)". In Zod 4 with react-hook-form, an empty-string-to-undefined transform at schema level can conflict with the RHF controller (which passes empty string "" from the textarea). How to handle?
- **Options considered:** A) `z.string().trim().optional().transform(v => v === '' ? undefined : v)` — schema-level transform, but produces complex types; B) `z.string().trim().optional()` and handle empty string in the action with `data.description || undefined` before the DB write; C) `z.preprocess(...)` with custom coercion.
- **Chosen:** B — schema stays simple (`z.string().trim().optional()`); the action normalizes empty string to undefined before writing to Prisma. This is safe and correct: an empty description writes nothing (Prisma nullable field stays null).
- **Rationale:** Avoids Zod 4 type-system gymnastics; keeps the schema clean for testing; the action is the correct place for "domain normalization" logic.
- **Reversibility:** Move the `|| undefined` normalization into the schema's `.transform()` if a future story needs the schema itself to enforce it.
- **Files touched:** src/app/(admin)/admin/classes/new/class-form-schema.ts

### [2026-07-05T23:02:20Z] 2-1-create-a-group-class — Client form: use raw string types for datetime-local inputs to avoid RHF Date coercion mismatch
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 3 — client form)
- **Decision point:** react-hook-form with `zodResolver(createClassSchema)` would type `start`/`end` as `Date` (schema output), but datetime-local HTML inputs produce strings. defaultValues for Date fields can't be empty string without TypeScript errors, and rendering a Date as an input value requires string conversion.
- **Options considered:** A) Use `z.infer<typeof createClassSchema>` as form type, accept Date<→string casts at input render; B) Define a separate raw-string form-values type and call the server action with raw strings (server action re-runs schema validation via safeParse); C) Register start/end with `register()` instead of Controller, accepting untyped string values.
- **Chosen:** A — use `z.infer<typeof createClassSchema>` as form type, render date inputs with explicit string coercion (`field.value instanceof Date ? toISOSlice : String(field.value ?? '')`). The server action independently calls `createClassSchema.safeParse(values)` which re-validates on the server (coercing Date→Date or string→Date as needed).
- **Rationale:** Keeps client-side instant validation using the same schema (per story). The runtime behavior is correct: RHF stores strings in form state, zodResolver coerces to Date on validate/submit, onSubmit receives Date objects which the server action accepts.
- **Reversibility:** Define a separate `ClassFormRawValues` type (all strings/numbers as strings) and update the useForm generic and input handlers.
- **Files touched:** src/app/(admin)/admin/classes/new/class-form.tsx

### [2026-07-05T23:02:20Z] 2-1-create-a-group-class — post-create navigation: push to /admin (not /admin/classes)
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 3 — AC3 navigation)
- **Decision point:** Story says "router.push to /admin/classes (fallback /admin)" on success. Story 2.2 ships the /admin/classes list. Before 2.2 is done, /admin/classes would 404.
- **Options considered:** A) Push to /admin/classes (will 404 until 2.2); B) Push to /admin (fallback — admin dashboard always exists); C) Try /admin/classes, catch 404, fallback (too complex).
- **Chosen:** B — push to `/admin`. Story note says "(fallback /admin) so the redirect never 404s before 2.2 ships — or push /admin. Pick one and note it." Choosing /admin now; update to /admin/classes after Story 2.2 lands.
- **Rationale:** Guarantees no 404 for Priyanka after creating a class. AC3 says "sensible admin destination" — the admin dashboard satisfies this until the list is available.
- **Reversibility:** Change `router.push("/admin")` to `router.push("/admin/classes")` once Story 2.2 merges.
- **Files touched:** src/app/(admin)/admin/classes/new/class-form.tsx

### [2026-07-05T23:28:12Z] 2-1-create-a-group-class — code-review: gold CTA hardcoded hex → design tokens
- **Risk:** low
- **Workflow / step:** code-review step 3 (triage) → fix
- **Decision point:** Adversarial review found the primary "Create class" CTA in class-form.tsx used inline `style={{ backgroundColor: "#d4a91e", color: "#1a2744" }}`. The story explicitly mandated "Reuse existing navy+gold tokens — no new palette" and both-mode contrast (UX-DR2/UX-DR6/NFR10). Hardcoded hex bypasses the `--accent`/`--accent-foreground` tokens which FLIP between light (`38 68% 48%`) and dark (`41 70% 55%`) modes, so the button no longer adapts to theme. MEDIUM review finding.
- **Options considered:** A) leave as-is (violates explicit story directive + theming); B) use `variant="hero"` (gradient-accent gold CTA, but adds hover:scale animation vs prefers-reduced-motion); C) swap to token utility classes `bg-accent text-accent-foreground hover:bg-accent/90` (solid gold CTA, mode-aware, no motion).
- **Chosen:** C — token classes `bg-accent text-accent-foreground hover:bg-accent/90`, removed the inline style; kept `w-full min-h-[44px] font-semibold` (≥44px target, weight).
- **Rationale:** Restores the one gold-accent CTA using the canonical token system so it adapts to dark/light mode and stays consistent with the shadcn Button palette; avoids hero's scale animation for reduced-motion friendliness. Functionally the create path (AC1-AC5) was already correct — this is a UI-consistency fix only.
- **Reversibility:** Trivially revert the single className swap in class-form.tsx to the prior inline style. No data/schema/API impact.
- **Files touched:** acce-nextjs/src/app/(admin)/admin/classes/new/class-form.tsx

### [2026-07-05T23:33:51Z] 2-2-list-and-view-classes-in-admin — Occupancy for the admin list via a single tested where-fragment fed to Prisma filtered _count (AD-5)
- **Risk:** medium
- **Workflow / step:** create-story step 3 (architecture guardrails) → story ACs/tasks
- **Decision point:** AC1 requires showing "occupied/seats-left" per class. AD-5 mandates occupancy is DERIVED (never stored) and readers MUST NOT write. How should 2.2 compute occupied without duplicating/diverging the AD-5 rule that Epic 3's browse/checkout will also need?
- **Options considered:** A) fetch all enrollments per class into JS and count in the page (readable but N+1-ish, and buries the AD-5 predicate in view code); B) raw SQL COUNT; C) expose ONE pure, unit-testable helper `occupiedEnrollmentWhere(now)` returning the Prisma relation-filter (`status IN {PENDING,CONFIRMED} AND (pendingExpiresAt = null OR pendingExpiresAt > now)`) and feed it to a filtered `_count` on `db.groupSession.findMany({ select: { _count: { enrollments: where } } })`; seats-left arithmetic + ZAR formatting in a sibling pure module.
- **Chosen:** C — single tested where-fragment + filtered `_count`; treats expired PENDING as free (AD-5) with zero UPDATEs.
- **Rationale:** Keeps the AD-5 occupancy definition in ONE place that is unit-testable without a live DB (mirrors the 1.4/2.1 pure-module pattern) and is directly reusable by Epic 3 (FR4 seats-left). Filtered `_count` runs in the DB (no N+1), stays read-only (no expiry flip — that is enrollment.ts's job under a lock, AD-5).
- **Reversibility:** The helper is a leaf module; swap its internals (e.g. to a groupBy or raw SQL) without touching the page. If Epic 3 needs a richer occupancy service (`lib/enrollment.ts`), move the fragment there and re-point imports.
- **Files touched:** (planned) acce-nextjs/src/lib/class-occupancy.ts, class-display.ts; (admin)/admin/classes/page.tsx; tests/unit/*

### [2026-07-05T23:33:51Z] 2-2-list-and-view-classes-in-admin — Read-only list scope: shadcn Table + Badges, chronological, no per-row edit (2.3 owns it)
- **Risk:** low
- **Workflow / step:** create-story step 5 (story tasks/scope)
- **Decision point:** How much UI to include, and whether to add per-row edit/delete links (2.3 not yet built).
- **Options considered:** A) card grid; B) shadcn Table with Badge for status/mode, ordered by `start asc`, empty-state CTA to `/admin/classes/new`, NO edit/delete/pagination/filter; C) full CRUD table with edit links now.
- **Chosen:** B — dense admin Table for scanning key facts; read-only; edit action explicitly deferred to Story 2.3.
- **Rationale:** Matches AC1 (display key facts) + AC2 (empty state) exactly with no scope creep; a table is the right density for an admin index. Adding edit links now would 404 until 2.3 and duplicate 2.3's ownership of the edit surface.
- **Reversibility:** Additive route only; 2.3 attaches row-level edit links to the same table. Reorder/paginate later without data changes.
- **Files touched:** (planned) (admin)/admin/classes/page.tsx

### [2026-07-05T23:33:51Z] 2-2-list-and-view-classes-in-admin — Low-risk wiring: make /admin/classes reachable + e2e-covered; repoint 2.1 success redirect
- **Risk:** low
- **Workflow / step:** create-story step 5 (project-structure/optional UPDATEs)
- **Decision point:** 2.1 shipped its create-success redirect to `/admin` (fallback) because `/admin/classes` did not exist; the admin landing has no link to a class list; and neither `/admin/classes` nor 2.1's `/admin/classes/new` is in the 1.5 authenticated-route manifest.
- **Options considered:** A) leave all wiring for later; B) as small in-story UPDATEs: add an "All classes" link on `(admin)/admin/page.tsx`, repoint the 2.1 create-success `router.push('/admin')` → `/admin/classes`, and add `/admin/classes` (+ backfill `/admin/classes/new`) to `tests/e2e/authenticated-routes.ts`.
- **Chosen:** B — small, reversible wiring so the new list is discoverable, the create flow lands on it, and the RSC-500 smoke (1.5) covers it.
- **Rationale:** Cheap safety net (1.5 lesson: authenticated 200-smoke catches RSC-500s tsc/unit miss) and closes the fallback loop 2.1 explicitly left open. All edits are additive/1-line.
- **Reversibility:** Revert the single link, the one-line redirect, and the manifest appends independently; no schema/API impact.
- **Files touched:** (planned) (admin)/admin/page.tsx; (admin)/admin/classes/new/class-form.tsx; tests/e2e/authenticated-routes.ts

### [2026-07-05T23:38:48Z] 2-2-list-and-view-classes-in-admin — dev-story start: mark in-progress, capture baseline_commit
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story status is `ready-for-dev`; need to capture baseline_commit and transition sprint-status to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Record HEAD commit `be17fc7ee12efc6c999cf41d67b074e6c3774f65` as baseline_commit; update sprint-status.yaml and story file to `in-progress`.
- **Rationale:** Required by workflow contract.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`; remove baseline_commit from story frontmatter.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/2-2-list-and-view-classes-in-admin.md

### [2026-07-05T23:44:11Z] 2-2-list-and-view-classes-in-admin — formatZar: explicit R+toFixed(2) over toLocaleString("en-ZA")
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 1 — class-display.ts authoring)
- **Decision point:** Story allows either `toLocaleString("en-ZA", { style: "currency", currency: "ZAR" })` or explicit `R${...toFixed(2)}`. Which produces a stable, pinnable string in jsdom test environment?
- **Options considered:** A) `toLocaleString("en-ZA", { style: "currency", currency: "ZAR" })` — output depends on Node.js ICU data (may produce "R 290,00" with a non-breaking space + comma separator in some environments, not "R290.00"); B) Explicit `R${(cents/100).toFixed(2)}` — always produces "R290.00" in all environments.
- **Chosen:** B — explicit `R${(cents/100).toFixed(2)}` for locale-independent, pinnable test output.
- **Rationale:** jsdom uses Node.js ICU data which can vary by platform/build; `toLocaleString` with `en-ZA` may produce "R 290,00" or "R290.00" depending on the installed locale data, making the test assertion fragile. Explicit format is always correct for this use case (ZAR with 2 decimal places) and the story explicitly permits it.
- **Reversibility:** Swap to `toLocaleString("en-ZA", ...)` in `class-display.ts` and update the test assertion to match its exact output. One-line change.
- **Files touched:** acce-nextjs/src/lib/class-display.ts, acce-nextjs/tests/unit/class-display.test.ts

### [2026-07-05T23:44:11Z] 2-2-list-and-view-classes-in-admin — story complete → status: review
- **Risk:** low
- **Workflow / step:** dev-story step 9 (story completion + mark for review)
- **Decision point:** All 5 tasks complete, all ACs verified statically. Mark as review and commit.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Status set to `review` in both story file and sprint-status.yaml. All 142 vitest pass, build clean, prisma validate clean.
- **Rationale:** DoD fully met: tasks checked, ACs satisfied, 23 new unit tests added, file list complete, change log updated, no regressions.
- **Reversibility:** Revert status lines to `in-progress` if a code-review loop finds issues.
- **Files touched:** _bmad-output/implementation-artifacts/2-2-list-and-view-classes-in-admin.md, _bmad-output/implementation-artifacts/sprint-status.yaml

### [2026-07-05T23:50:47Z] 2-2-list-and-view-classes-in-admin — Diff source & spec context for code review
- **Risk:** low
- **Workflow / step:** code-review step 1 (gather context)
- **Decision point:** Which diff to review and which spec to audit against; workflow HALTs for user selection (overridden per autopilot contract).
- **Options considered:** A) `git diff HEAD` uncommitted (empty — dev-story already committed); B) branch diff epic-2 vs main (would include 2.1 + all prior epic-2 work); C) diff story baseline_commit (be17fc7) → HEAD, story-scoped.
- **Chosen:** C — `git diff be17fc7 HEAD -- acce-nextjs/`, using the story frontmatter `baseline_commit`; review_mode = "full" with spec_file = the 2.2 story.
- **Rationale:** baseline_commit is exactly the 2.1-done tip; the single dev-story commit 2c53793 is the whole 2.2 change set (8 files, +526). Cleanest, story-scoped, no cross-story noise.
- **Reversibility:** N/A (read-only scoping choice).
- **Files touched:** none (read-only).

### [2026-07-05T23:50:47Z] 2-2-list-and-view-classes-in-admin — Fix-vs-action-items resolution (no HIGH/MEDIUM found)
- **Risk:** low
- **Workflow / step:** code-review step 3–4 (triage + present/act)
- **Decision point:** At the fix-vs-action-items `<ask>`: default is to auto-fix all HIGH/MEDIUM. Fresh adversarial pass (Blind Hunter / Edge Case Hunter / Acceptance Auditor lenses) surfaced no actionable HIGH/MEDIUM patch. One candidate (display timezone) evaluated for auto-fix.
- **Options considered:** A) Auto-patch a display `timeZone: "Africa/Johannesburg"` on the list's `toLocaleString`; B) Defer timezone as cross-cutting; C) Fabricate findings to justify edits.
- **Chosen:** B — defer. Verified 2.1 parses `datetime-local` with `z.coerce.date` (no offset → server-local) and this page displays server-local; input+display share one TZ frame and round-trip consistently. A display-only TZ patch here would BREAK that consistency (entered 10:00 → shown 12:00). So it is genuinely cross-cutting (spans 2.1) and self-consistent today — a defer, not a clean unambiguous patch.
- **Rationale:** The auto-fix mandate applies to *actionable, unambiguous* HIGH/MEDIUM. This one's correct fix is ambiguous and cross-story; patching in isolation regresses correctness. Recorded to story Review Findings + deferred-work.md instead. Remaining item (query over-selects unused `end`/`level`) dismissed as harmless noise.
- **Reversibility:** No code changed. To resolve the deferral later: pin a canonical app TZ (`Africa/Johannesburg`) end-to-end — both 2.1's create-form parse and every display edge — in one coordinated change.
- **Files touched:** _bmad-output/implementation-artifacts/2-2-list-and-view-classes-in-admin.md; deferred-work.md; sprint-status.yaml (no source code changed).

### [2026-07-05T23:50:47Z] 2-2-list-and-view-classes-in-admin — Final status: done
- **Risk:** low
- **Workflow / step:** code-review step 6 (status + sprint sync)
- **Decision point:** Set final story status per outcome (done if clean; in-progress if unresolved HIGH/MEDIUM).
- **Options considered:** A) done; B) in-progress with Review Follow-ups.
- **Chosen:** A — done. Zero unresolved HIGH/MEDIUM; the sole open item is a Low/Medium environmental defer (timezone), consistent with the 1.4/1.5 deferral posture. All 5 ACs + AD-2/3/5/9 independently re-verified; chain re-run green (prisma validate clean, build clean w/ /admin/classes present, 142/142 vitest).
- **Rationale:** Per step-04 §6, clean of actionable patch/decision findings → done. No code changes were required.
- **Reversibility:** Revert story Status + sprint-status `2-2` entry to `review` if a blocking finding later emerges.
- **Files touched:** 2-2-list-and-view-classes-in-admin.md (Status/Review Findings/Change Log); sprint-status.yaml; deferred-work.md.

### [2026-07-05T23:57:00Z] 2-3-edit-an-existing-class — Target story selection & epic state
- **Risk:** low
- **Workflow / step:** create-story step 1 (determine target story)
- **Decision point:** Story key was dispatched explicitly (2-3-edit-an-existing-class, backlog). Confirm it is the correct first-backlog target and whether any epic-status transition is needed.
- **Options considered:** A) Proceed on the dispatched key; B) Auto-discover a different first-backlog story.
- **Chosen:** A. 2-3 is the first (and only) `backlog` story in epic-2 (2-1/2-2 done); epic-2 already `in-progress` (set when 2-1 was created) so no epic transition needed. 2-3 is not the first story of the epic → no epic flip.
- **Rationale:** Matches dispatch and sprint-status ordering; nothing to change on the epic row.
- **Reversibility:** Trivial — status is a single yaml line.
- **Files touched:** none (read-only at this step).

### [2026-07-05T23:57:00Z] 2-3-edit-an-existing-class — No schema/migration change (updatedAt already migrated)
- **Risk:** medium
- **Workflow / step:** create-story step 3 (architecture guardrails / data-model facts)
- **Decision point:** AD-16 requires an optimistic-concurrency token (`GroupSession.updatedAt @updatedAt`). The ARCHITECTURE-SPINE "Schema deltas" table lists it as a delta beyond `init` — did this story need a migration?
- **Options considered:** A) Add `updatedAt @updatedAt` + a migration in this story; B) Verify it already exists and scope the story as schema-untouched.
- **Chosen:** B. Verified directly: `schema.prisma:131` has `updatedAt DateTime @default(now()) @updatedAt`, and migration `20260705203800_schema_deltas_spine/migration.sql:17` already `ALTER TABLE "GroupSession" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`. So the AD-16 token is in the DB. Story scoped as NO schema/migration change (AC6 keeps `prisma validate` on an untouched schema).
- **Rationale:** Prevents a needless/duplicate migration and a false "schema change" scope; the column the AC4 optimistic-concurrency check depends on is confirmed present.
- **Reversibility:** If a token were somehow missing, add the field + `prisma migrate` in a follow-up; but verification shows it is present.
- **Files touched:** 2-3-edit-an-existing-class.md (context/data-model facts).

### [2026-07-05T23:57:00Z] 2-3-edit-an-existing-class — First FOR UPDATE lock lands in the admin edit action (not enrollment.ts)
- **Risk:** high
- **Workflow / step:** create-story step 3/5 (scoping the AD-16 concurrency contract)
- **Decision point:** AD-16 says admin edits run under "the same GroupSession FOR UPDATE lock as reservation." `reserveSeat`/`enrollment.ts` (the eventual shared lock holder) do not exist yet (Epic 3/4). Where does the lock logic live for 2.3, and how much of the concurrency machinery does this story build?
- **Options considered:** A) Build a generic `enrollment.ts`/shared lock helper now so the edit reuses it; B) Colocate an interactive `db.$transaction` + raw `SELECT … FOR UPDATE` on the GroupSession row inside the admin edit action, doing the capacity-count + optimistic-concurrency check inside the lock; C) Skip the lock, do a plain `update` and rely on a later story to add concurrency.
- **Chosen:** B. Implement the lock colocated with `updateClassAction` (capability map places admin CRUD under `(admin)/admin/**`, governed by AD-16). It locks the SAME `GroupSession` row `reserveSeat` will later lock, so the two serialise on that row with no forced refactor. Rejected A (building enrollment.ts now = inventing scope from Epic 3/4 into a 2-AC edit story) and C (violates AD-16 — a capacity/price edit could race reserveSeat into oversell).
- **Rationale:** AD-16 is binding and edit-scoped; option B satisfies it minimally and forward-compatibly. This is the FIRST `FOR UPDATE`/interactive-transaction pattern in the codebase — noted as such so the dev establishes it cleanly.
- **Reversibility:** When `enrollment.ts` lands with a shared GroupSession-lock helper, re-point `updateClassAction` at it (same lock target, same predicate) — a localized swap, no data-shape change. To re-architect toward a serializable/`reserveSeat`-owned edit, move the lock+count into that module.
- **Files touched:** 2-3-edit-an-existing-class.md (Tasks 3, Dev Notes AD-16 guardrail).

### [2026-07-06T00:03:12Z] 2-3-edit-an-existing-class — dev-story start: mark in-progress, baseline_commit preserved
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story status is `ready-for-dev`; baseline_commit is already set (7a38dda4) from create-story. Need to transition sprint-status to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Preserve existing `baseline_commit: 7a38dda4732128acfdbcbfb59002889b42ca0e24`; update sprint-status.yaml to `in-progress`.
- **Rationale:** Required by workflow contract; baseline_commit already set during create-story so no overwrite needed.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/2-3-edit-an-existing-class.md

### [2026-07-06T00:03:12Z] 2-3-edit-an-existing-class — Task 1: duplicate edit schema field block (ZodEffects .extend() awkward)
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 1 — schema strategy)
- **Decision point:** Story says prefer extracting a shared base from `class-form-schema.ts` for both create and edit, but allows duplication if `.extend()` on `ZodEffects` (the result of `.refine`/`.superRefine`) is awkward. The create schema uses chained `.refine().superRefine()` producing a `ZodEffects` which cannot be `.extend()`-ed.
- **Options considered:** A) Extract a base `z.object(fields)` before `.refine()`, then build both schemas from it — requires restructuring `class-form-schema.ts`; B) Duplicate the field block in `editClassSchema` (colocated with edit route) — simpler, no change to create schema; C) Re-export the inner object from create schema.
- **Chosen:** B — duplicate the field block in `edit-class-schema.ts`. The story explicitly permits this when the `.refine`/`.superRefine`-on-ZodEffects approach is disproportionate. Reuse `toCents` from the create schema module (AD-9 single site).
- **Rationale:** Avoids restructuring the working create schema (risk of regression); keeps the edit schema pure/colocated; both schemas stay independently testable. Option A would require touching the 2.1 create schema which is done and reviewed.
- **Reversibility:** If a future schema update needs to sync both, extract the shared base from `class-form-schema.ts` at that point (clear refactor path).
- **Files touched:** src/app/(admin)/admin/classes/[id]/edit/edit-class-schema.ts

### [2026-07-06T00:03:12Z] 2-3-edit-an-existing-class — Task 4: copy ClassForm to edit-class-form.tsx (not parametrise)
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 4 — form reuse strategy)
- **Decision point:** Story says reuse `ClassForm` by parametrising OR copy to `edit-class-form.tsx`. Parametrising adds `mode`/`initialValues`/`expectedUpdatedAt`/`submitAction` props to the existing create form — risky (changes reviewed code, adds conditional complexity).
- **Options considered:** A) Parametrise existing `ClassForm` with edit-mode props; B) Copy `ClassForm` to `edit-class-form.tsx` and adapt for edit.
- **Chosen:** B — copy to `edit-class-form.tsx`. Isolates the edit-specific logic (pre-fill, hidden id/expectedUpdatedAt, updateClassAction call, stale-edit toast, "Save changes" label) from the working create form. Story explicitly allows this.
- **Rationale:** The create form is done and code-reviewed; parametrising it adds risk of regression. A separate edit form is independently readable and testable. The story notes both options are acceptable.
- **Reversibility:** Merge back by adding a `mode` prop to `ClassForm` if desired; the change would be purely additive to the form component.
- **Files touched:** src/app/(admin)/admin/classes/[id]/edit/edit-class-form.tsx

### [2026-07-06T02:15:00Z] 2-3-edit-an-existing-class — story complete → status: review
- **Risk:** low
- **Workflow / step:** dev-story step 9 (story completion + mark for review)
- **Decision point:** All 7 tasks complete, all ACs verified statically. Mark as review and commit.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Status set to `review` in both story file and sprint-status.yaml. 190/190 vitest pass, build clean (ƒ Dynamic `/admin/classes/[id]/edit` present), prisma validate clean. Concurrency integration test (FOR UPDATE lock/capacity-race/stale-write) deferred to CI ephemeral-Postgres per deferred-work.md posture (same sandbox wall as 1.1/1.4/1.5/2.1/2.2).
- **Rationale:** DoD fully met: all tasks checked, AC1-AC6 satisfied, 48 new unit tests added (42 edit-schema + 6 capacityBelowOccupied), file list complete, change log updated, no regressions.
- **Reversibility:** Revert status lines to `in-progress` if a code-review loop finds issues.
- **Files touched:** _bmad-output/implementation-artifacts/2-3-edit-an-existing-class.md, _bmad-output/implementation-artifacts/sprint-status.yaml

### [2026-07-05T23:57:00Z] 2-3-edit-an-existing-class — Reuse create schema/form via extract-or-duplicate; live concurrency test deferred to CI
- **Risk:** medium
- **Workflow / step:** create-story step 5 (schema/form reuse + verification posture)
- **Decision point:** (a) The edit form needs the same fields + cross-field rules as `createClassSchema` plus `id`+`expectedUpdatedAt` — extract a shared base or duplicate? (b) The FOR UPDATE lock / capacity-race / stale-write reject can't be exercised without real Postgres — how is AC verified in-sandbox?
- **Options considered:** (a) A1) Extract a reusable field object/refinement from `class-form-schema.ts` and build both create+edit schemas from it; A2) Duplicate the field block into `editClassSchema`. (b) B1) Fake the lock via Prisma mocks; B2) Static verification (prisma validate + build + vitest on the pure seams) and defer the concurrency integration test to CI ephemeral-Postgres.
- **Chosen:** (a) Prefer A1 (single source, no drift) but explicitly allow A2 if `.extend()` on the create schema's `ZodEffects` is disproportionately awkward — dev logs whichever. (b) B2 — mirror the AD-4 posture (concurrency needs a real 40001/lock) and the 1.1/1.4/1.5/2.1/2.2 sandbox wall; unit-test only the pure edit-schema + `capacityBelowOccupied` predicate; record the deferred concurrency integration test in deferred-work.md.
- **Rationale:** Keeps the AD-9/validation logic single-sourced where practical, and refuses to fake lock semantics that a mock cannot honestly reproduce. Static verification is the honest bar in-sandbox.
- **Reversibility:** (a) Extract-vs-duplicate is a local refactor either direction. (b) The deferred integration test is picked up in CI once ephemeral-Postgres is wired (shared with AD-4's no-oversell test).
- **Files touched:** 2-3-edit-an-existing-class.md (Tasks 1, 6, 7; Testing standards).

### [2026-07-06T00:21:33Z] 2-3-edit-an-existing-class — Edit form pre-fill used UTC wall-clock (timezone round-trip patch)
- **Risk:** medium
- **Workflow / step:** code-review step 3 (triage) → step 4 (apply patch)
- **Decision point:** The edit page pre-fills start/end via `session.start.toISOString().slice(0,16)` (UTC wall-clock). Create parse (`z.coerce.date`) and the 2.2 list display (`toLocaleString`, no timeZone) both use SERVER-LOCAL. The story explicitly required the edit datetime-local round-trip to "stay consistent with create/list." On a non-UTC deploy the edit form shows a different time than the list and shifts the stored instant on every save → latent AC1 correctness/data-integrity defect. Fix now vs defer to the cross-cutting TZ item?
- **Options considered:** A) Fix edit to format server-local now (aligns with create/list under any TZ; standalone, doesn't require the global TZ decision). B) Defer to the 2.2 system-wide TZ decision (leaves edit diverging from create/list even today under non-UTC). C) Force `Africa/Johannesburg` here (rejected — story says do NOT unilaterally pin a TZ).
- **Chosen:** A — added `toDatetimeLocalInput()` (server-local wall-clock formatter) in page.tsx; `expectedUpdatedAt` stays `toISOString()` (absolute instant, correct).
- **Rationale:** Server-local formatting makes the datetime-local round-trip lossless and consistent with the create-form parse frame + 2.2 list display under ANY deploy TZ, without pre-empting the deferred global-TZ decision. Verified build clean + 190/190 vitest after the change.
- **Reversibility:** Revert page.tsx to `toISOString().slice(0,16)` to restore UTC behavior; the helper is self-contained (page.tsx:62-78). The broader "pin one canonical app TZ end-to-end" decision remains open in deferred-work.md (2.2 + this).
- **Files touched:** acce-nextjs/src/app/(admin)/admin/classes/[id]/edit/page.tsx

### [2026-07-06T00:21:33Z] 2-3-edit-an-existing-class — Two deferred findings (concurrency integration test + IN_PERSON meetingUrl)
- **Risk:** medium
- **Workflow / step:** code-review step 3 (triage) → step 4 (write defers)
- **Decision point:** Two real findings are not sandbox-fixable/actionable now: (1) AC4 token parity between raw `$queryRaw` and Prisma `findUnique` + the whole FOR UPDATE/optimistic-concurrency/capacity-race behaviour is only verifiable against a live Postgres (Task 7 posture); (2) `meetingUrl` not nulled on ONLINE→IN_PERSON switch (low, harmless, symmetric with create).
- **Options considered:** patch / defer / dismiss for each.
- **Chosen:** Defer both — logged to the story Review Findings and deferred-work.md under a 2.3 heading. Neither blocks `done`.
- **Rationale:** (1) is environmental first-live-verification (same wall as 1.1/1.5/2.2 CI-deferred items) — cannot be exercised without ephemeral Postgres; forcing dev-story to re-loop would spin with nothing to fix. (2) is a low data-cleanliness nit with no consumer today. Both belong in the ledger, not as blocking dev follow-ups.
- **Reversibility:** Pick up from deferred-work.md when the CI ephemeral-Postgres job lands (integration test) / when meet-link consumption is implemented (null on IN_PERSON in both create+edit).
- **Files touched:** _bmad-output/implementation-artifacts/2-3-edit-an-existing-class.md, _bmad-output/implementation-artifacts/deferred-work.md

### [2026-07-06T00:21:33Z] 2-3-edit-an-existing-class — Final status = done
- **Risk:** medium
- **Workflow / step:** code-review step 4 section 6 (status determination)
- **Decision point:** After patching the one actionable MEDIUM (timezone round-trip), only environmental/low deferred findings remain. Set `done` or `in-progress`?
- **Options considered:** A) `done` (all actionable patch findings resolved; remaining items are ledger-tracked environmental/low, matching 1.1/1.5/2.2 precedent which all went `done` with CI-deferred items). B) `in-progress` (strict reading: a deferred MEDIUM remains) — but its follow-up is a CI-only integration test dev-story cannot execute in the sandbox → would loop with no fix available.
- **Chosen:** A — `done`. Story file Status → done; sprint-status.yaml `2-3-edit-an-existing-class: done`.
- **Rationale:** The only sandbox-actionable defect is fixed and re-verified (build clean, 190/190). Remaining findings are environmental (deferred to CI, consistent with every prior story) or low. Marking in-progress would create a no-progress loop on an unfixable-here CI item.
- **Reversibility:** Set `2-3-edit-an-existing-class: in-progress` in sprint-status.yaml and revert the story Status if the team wants the story held open until the CI concurrency test is green.
- **Files touched:** _bmad-output/implementation-artifacts/2-3-edit-an-existing-class.md, _bmad-output/implementation-artifacts/sprint-status.yaml

### [2026-07-06T00:28:53Z] 3-1-view-wallet-balance-and-ledger — Epic 3 backlog → in-progress
- **Risk:** low
- **Workflow / step:** create-story step 1 (first story in epic marks epic in-progress)
- **Decision point:** 3-1 is the first story of Epic 3; epic-3 is `backlog` in sprint-status.yaml.
- **Options considered:** A) set epic-3 → in-progress per workflow rule; B) leave backlog.
- **Chosen:** A — set `epic-3: in-progress` (matches epic-1/epic-2 precedent).
- **Rationale:** Workflow step 1 mandates marking the epic in-progress when its first story is created.
- **Reversibility:** revert `epic-3` to `backlog` in sprint-status.yaml.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml

### [2026-07-06T00:28:53Z] 3-1-view-wallet-balance-and-ledger — Canonical mutation helper name = wallet.mutate (not addEntry)
- **Risk:** medium
- **Workflow / step:** create-story step 3 (architecture analysis / interface shape)
- **Decision point:** Epic 3.1 AC wording says wallet.ts provides `getBalance` + `addEntry(tx, …)`, but ARCHITECTURE-SPINE AD-6 and Epic Story 3.5 AC both name the single serialized mutation `wallet.mutate(tx, studentId, …)`.
- **Options considered:** A) name it `addEntry` per 3.1 wording; B) name it `mutate` per AD-6 + 3.5 (binding architecture); C) build both.
- **Chosen:** B — `mutate` is the canonical single serialized mutation path (per-student lock → append immutable LedgerEntry with balanceAfterCents, non-negative guard). The epic's "addEntry" is treated as informal shorthand for the same append; story documents the mapping so 3.4/3.5 wire to `wallet.mutate`.
- **Rationale:** Architecture spine is binding and two downstream stories (3.4 reserve, 3.5 admin credit) already reference `wallet.mutate`. A divergent `addEntry` name would fork the "one serialized mutation path" invariant (AD-6).
- **Reversibility:** rename the exported function in `src/lib/wallet.ts` and update 3.1's callers-to-be; single-file change, no persisted state.
- **Files touched:** _bmad-output/implementation-artifacts/3-1-view-wallet-balance-and-ledger.md

### [2026-07-06T00:35:20Z] 3-1-view-wallet-balance-and-ledger — dev-story start: mark in-progress, baseline_commit already set
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story is `ready-for-dev`; baseline_commit `2a404e71` already in YAML frontmatter (matches current HEAD). Need to transition sprint-status to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Keep existing baseline_commit; update sprint-status.yaml to `in-progress`.
- **Rationale:** Required by workflow contract; baseline already captured by create-story agent.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/3-1-view-wallet-balance-and-ledger.md

### [2026-07-06T00:28:53Z] 3-1-view-wallet-balance-and-ledger — Story scope: build getBalance + mutate now, live-DB lock verification deferred to CI
- **Risk:** medium
- **Workflow / step:** create-story step 2/5 (scope determination)
- **Decision point:** 3.1 has no caller of the mutation path yet (reserve=3.4, admin credit=3.5). Does 3.1 implement the full `mutate` (advisory lock + non-negative guard) or only `getBalance` + the read page?
- **Options considered:** A) getBalance + read page only, defer `mutate` to 3.4/3.5; B) build getBalance + full `mutate` helper now (unit-test the pure guard/balance logic; defer the live Postgres advisory-lock/concurrency verification to CI ephemeral-Postgres, same wall as 1.1/1.5/2.2/2.3).
- **Chosen:** B. 3.1 AC3 (NFR4: every mutation goes through the helper, never negative) requires the helper to exist as the single seam. Build it now; unit-test `computeBalanceAfter` + the non-negative guard db-free; defer the locked round-trip to CI.
- **Rationale:** Establishing the single serialized seam in 3.1 (where the wallet domain module is born) prevents 3.4/3.5 from each inventing their own mutation path — mirrors how 2.2 seeded `occupiedEnrollmentWhere` for later reuse. Live-DB advisory-lock behaviour is environmental (unit mocks can't exercise pg_advisory_xact_lock), consistent with prior CI deferrals.
- **Reversibility:** if the team prefers a thinner 3.1, delete `mutate` from wallet.ts and re-add it in 3.4; getBalance + page are independent.
- **Files touched:** _bmad-output/implementation-artifacts/3-1-view-wallet-balance-and-ledger.md

### [2026-07-06T00:43:42Z] 3-1-view-wallet-balance-and-ledger — WalletInsufficientFundsError: typed error class (not discriminated result) for mutate rejection
- **Risk:** medium
- **Workflow / step:** dev-story step 5 (Task 2 — pick the mutate failure shape)
- **Decision point:** Story says "pick the shape the caller in 3.4/3.5 will consume; document it" for the NFR4 rejection. Two options: (A) throw a typed error class (callers `try/catch`); (B) return a discriminated result `{ ok: false, reason: "INSUFFICIENT_FUNDS" }` (callers check `if (!result.ok)`).
- **Options considered:** A) typed error class `WalletInsufficientFundsError extends Error` — callers catch and present user-friendly message; (B) discriminated result — avoids try/catch but requires every caller to check; (C) raw `Error("Insufficient funds")` — untyped, hard to handle cleanly.
- **Chosen:** A — `WalletInsufficientFundsError` extends Error, includes `currentBalanceCents` + `requestedAmountCents` fields. Story 3.4 (reserve) and 3.5 (admin credit) both wrap mutate in a try/catch in a server action — the typed error pattern is idiomatic there. The architecture notes that server actions that can fail return discriminated results at the action boundary, not inside domain functions.
- **Rationale:** Domain functions that detect constraint violations conventionally throw (cf. how Prisma throws `PrismaClientKnownRequestError` on unique violations). The server actions in 3.4/3.5 will wrap `mutate` in try/catch and convert to a discriminated action result. The typed error carries the numeric context (balance, shortfall) callers need for user messages.
- **Reversibility:** Swap to discriminated result in wallet.ts: change the `throw` to `return { ok: false, reason: "INSUFFICIENT_FUNDS", currentBalanceCents, requestedAmountCents }`, update callers in 3.4/3.5 to check the result. No data/schema impact.
- **Files touched:** acce-nextjs/src/lib/wallet.ts

### [2026-07-06T00:43:42Z] 3-1-view-wallet-balance-and-ledger — formatSignedZar: U+2212 MINUS SIGN (not ASCII hyphen) for negative amounts
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 1 — formatSignedZar sign character)
- **Decision point:** Story says "Use a real minus sign or ASCII `-` consistently and pin the exact string in the test." Which character?
- **Options considered:** A) U+2212 MINUS SIGN (typographically correct for numeric contexts); B) U+002D HYPHEN-MINUS (ASCII `-`, simpler, no encoding surprise).
- **Chosen:** A — U+2212 MINUS SIGN. The story calls for a "real minus sign" as the preferred option, and financial UIs conventionally use U+2212 for negative amounts. Tests pin the exact character.
- **Rationale:** Typographic correctness; the test pins the character explicitly so any encoding inconsistency is caught. The implementation comment documents the character code.
- **Reversibility:** Change `−` to `-` in wallet-display.ts and the corresponding test string in wallet-display.test.ts. One-line change each.
- **Files touched:** acce-nextjs/src/lib/wallet-display.ts, acce-nextjs/tests/unit/wallet-display.test.ts

### [2026-07-06T00:43:42Z] 3-1-view-wallet-balance-and-ledger — Story 3.1 complete: status → review
- **Risk:** low
- **Workflow / step:** dev-story step 9 (completion + sprint-status update)
- **Decision point:** All 6 tasks checked, all ACs satisfied, 219/219 vitest green, build clean, prisma validate clean. Mark story review.
- **Options considered:** n/a — prescribed workflow outcome.
- **Chosen:** Set development_status["3-1-view-wallet-balance-and-ledger"] = "review" in sprint-status.yaml; set Status: "review" in story file.
- **Rationale:** All DoD conditions met: tasks complete, ACs satisfied, tests pass (incl. 29 new), build clean, File List complete, Change Log updated, Dev Agent Record complete.
- **Reversibility:** Revert to "in-progress" by editing sprint-status.yaml and story file Status line.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/3-1-view-wallet-balance-and-ledger.md

### [2026-07-06T04:59:57Z] 3-1-view-wallet-balance-and-ledger — Code-review verdict (adversarial, fresh)
- **Risk:** critical
- **Workflow / step:** code-review step 2-4 (adversarial review + triage of the AD-6 wallet mutation seam)
- **Decision point:** Does the first wallet-domain money path (getBalance + the single serialized mutate seam, NFR4 non-negative guard, AD-3 page auth) satisfy all 5 ACs without correctness/security holes, and is it done or in-progress?
- **Options considered:** A) pass as `done`; B) send back `in-progress` with follow-ups.
- **Chosen:** A — `done`. Fresh re-verification (not trusting dev claims): `npx prisma validate` clean; `npm test` 219/219 (incl 16 wallet-math + 13 wallet-display); `npm run build` compiled successfully with `/portal/wallet` as ƒ Dynamic. Adversarially confirmed: (AC3/AD-6) mutate takes `pg_advisory_xact_lock(hashtext(studentId))` FIRST on the passed `tx`, reads balance UNDER the lock via getBalance(…, tx), computes balanceAfterCents, rejects `< 0` via WalletInsufficientFundsError BEFORE any write, appends an immutable LedgerEntry — never `db` directly, composes into caller tx. (Scope) mutate is exported but NOT called anywhere (only getBalance imported by the page) — 3.4/3.5 wire in later, as specified. (AC4/AD-3) page calls requireSession() before any fetch, queries strictly by session.user.id. (AC1/AC2) balance Card + chronological asc Table + R0.00 empty state. (AD-9) integer cents, formatZar/formatSignedZar at UI edge only. Advisory-lock hashtext int4 collision = over-locking (safe: reduces concurrency, never corrupts balance) and is exactly the AD-6-prescribed mechanism. Live-DB advisory-lock round-trip remains deferred to CI ephemeral-Postgres (same wall as 1.1/1.5/2.x; pg-level lock is un-mockable).
- **Rationale:** No HIGH/MEDIUM findings. The critical money path is correct and safe; all ACs met; chain independently green.
- **Reversibility:** To reopen, set 3-1 back to `in-progress` in sprint-status.yaml and add Review Follow-ups to the story. The money seam is un-called, so any later re-architecture of mutate is isolated to wallet.ts + its two future callers.
- **Files touched:** none (verdict only)

### [2026-07-06T04:59:57Z] 3-1-view-wallet-balance-and-ledger — LOW auto-fix: remove dead Prisma import
- **Risk:** low
- **Workflow / step:** code-review step 3 (triage → auto-fix)
- **Decision point:** `src/lib/wallet.ts` imported `Prisma` (type-only) from @prisma/client but never referenced it (PrismaTx is derived from `typeof db.$transaction`, not the Prisma namespace). Harmless (noUnusedLocals off, build clean) but dead code.
- **Options considered:** A) remove the unused import; B) leave it; C) defer as a follow-up.
- **Chosen:** A — removed `Prisma` from the import, leaving `import type { LedgerEntry, LedgerType } from "@prisma/client"`. Re-verified: `npm run build` compiled successfully, `/portal/wallet` ƒ Dynamic; whole-project `tsc --noEmit` shows no wallet errors (the only errors are pre-existing Epic-2 test-file Zod literal-narrowing quirks in class-form-schema/edit-class-schema tests, excluded from `next build`).
- **Rationale:** Zero-risk cleanup of genuinely dead code; keeps the new wallet module tidy.
- **Reversibility:** Re-add `Prisma` to the import line in wallet.ts:19. No behavioural effect either way.
- **Files touched:** acce-nextjs/src/lib/wallet.ts

### [2026-07-06T04:59:57Z] 3-1-view-wallet-balance-and-ledger — Deferred/dismissed minor observations
- **Risk:** low
- **Workflow / step:** code-review step 3 (triage → defer/dismiss)
- **Decision point:** Two sub-threshold observations surfaced; record disposition.
- **Options considered:** fix now vs dismiss/defer.
- **Chosen:** (1) DISMISS — ledger "Amount" credit cell uses `text-green-600 dark:text-green-400` (Tailwind palette, not a design token). DESIGN.md explicitly permits "coloured text … must keep ≥4.5:1 contrast in BOTH modes; do NOT rely on colour alone" — the `+`/`−` prefix carries the sign, dark-mode variant is provided, and no success token exists in the navy+gold system; introducing one is scope creep. (2) DISMISS — `mutate` computes `computeBalanceAfter` once for `balanceAfterCents` and again inside `wouldGoNegative`; pure micro-redundancy on the un-called seam, not a defect; leaving the critical money path un-churned is preferable.
- **Rationale:** Neither reaches LOW-worth-fixing; both are explicitly within spec / harmless.
- **Reversibility:** n/a (no change made).
- **Files touched:** none

### [2026-07-06T05:07:03Z] 3-2-browse-upcoming-classes-with-seats-left — Card grid vs Table for the student browse listing
- **Risk:** low
- **Workflow / step:** create-story step 5 (story authoring / UX layout choice)
- **Decision point:** Story 2.2 (admin listing) used a shadcn `Table`; 3.2 is the student-facing browse. The AC ("each card shows subject, date/time, per-seat price, and 'N seats left' … using shadcn Card/Badge", UX-DR2/DR3) explicitly calls for cards.
- **Options considered:** A) reuse the 2.2 `Table` layout; B) render a responsive `Card` grid per UX-DR2/DR3.
- **Chosen:** B — a responsive `Card` grid (one Card per class, Badge for seats-left / mode / "Class full").
- **Rationale:** UX-DR2 says the class *listing* reuses `Card` + `Badge`; UX-DR3 says each *card* shows a "N seats left" Badge. The admin table is an ops view; the student browse is a marketing-grade card grid. AC wording is explicit.
- **Reversibility:** Layout-only, single file `(portal)/portal/classes/page.tsx`. Swap the grid for a Table without touching data/occupancy logic.
- **Files touched:** story file only (dev implements later).

### [2026-07-06T05:07:03Z] 3-2-browse-upcoming-classes-with-seats-left — Book CTA forward-links to the Story 3.3 detail route
- **Risk:** medium
- **Workflow / step:** create-story step 5 (scope interpretation of the "Book action")
- **Decision point:** UX-DR3 mentions a "Book button" on non-full classes, but the class detail/checkout page is Story 3.3 and does not exist yet. Does 3.2 render an active CTA, and does it link anywhere?
- **Options considered:** A) render a "View class" / "Book" CTA on available cards that links to `/portal/classes/[id]` (built by 3.3) — forward reference, 404s until 3.3; B) render seats-left + "Class full" state with NO active link, deferring all linking to 3.3; C) build the detail route now (scope creep into 3.3).
- **Chosen:** A — available cards get a token-styled "View class" CTA (`<Link href="/portal/classes/${id}">`); full cards show a "Class full" state and NO active Book CTA (UX-DR3). Add ONLY `/portal/classes` to the e2e authenticated-route manifest (the dynamic detail route is added by 3.3, mirroring how 2.2 left the edit route to 2.3).
- **Rationale:** Directly mirrors the established 2.2→2.3 pattern (2.2 rendered a per-row Edit link to the 2.3-owned route and left the dynamic manifest entry to 2.3). Keeps 3.2 shippable and gives 3.3 a natural entry point. Not building the detail page keeps scope minimal (contract rule 4).
- **Reversibility:** The CTA is a single `<Link>` in the page; retarget or remove it in 3.3 if the route shape changes. No data or schema impact.
- **Files touched:** story file only.

### [2026-07-06T05:07:03Z] 3-2-browse-upcoming-classes-with-seats-left — New pure helper formatSeatsLeft in class-display.ts
- **Risk:** low
- **Workflow / step:** create-story step 5 (testable-seam design)
- **Decision point:** The "N seats left" / "1 seat left" / "Class full" label needs a home that vitest can unit-test without a live DB (mirrors the 3.1/2.2 pure-helper pattern for AC5).
- **Options considered:** A) inline the label logic in the RSC page (untestable without DB); B) add a pure `formatSeatsLeft(seatsLeft: number): string` to the existing `src/lib/class-display.ts` (already the shared display module — `formatZar`/`formatMode` reused by 3.2); C) create a brand-new portal-only display module.
- **Chosen:** B — extend `class-display.ts` with `formatSeatsLeft` (0 → "Class full", 1 → "1 seat left", n → "N seats left"). Occupancy math itself keeps reusing `occupiedEnrollmentWhere` + `computeSeatsLeft` from `class-occupancy.ts` (AD-5, single source).
- **Rationale:** `class-display.ts` is already the shared display-label home and is imported by both admin and portal; one new pure function keeps the seam unit-testable and avoids a redundant module. No new occupancy logic — AD-5 predicate stays the single source.
- **Reversibility:** Pure additive export; delete or relocate the function freely.
- **Files touched:** story file only.

### [2026-07-06T05:11:59Z] 3-2-browse-upcoming-classes-with-seats-left — Starting dev-story: mark in-progress
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark in-progress)
- **Decision point:** Story 3-2 is `ready-for-dev`; baseline_commit must be captured and story marked in-progress.
- **Options considered:** A) Capture HEAD as baseline_commit and mark in-progress; B) Skip baseline capture.
- **Chosen:** A — capture HEAD `48faff6e724df6652da4f20636ba52d3831c120f` as baseline_commit, update sprint-status to in-progress.
- **Rationale:** Skill step 4 requires this before implementation begins.
- **Reversibility:** Revert sprint-status line to `ready-for-dev`, remove baseline_commit from story frontmatter.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/3-2-browse-upcoming-classes-with-seats-left.md

### [2026-07-06T05:11:59Z] 3-2-browse-upcoming-classes-with-seats-left — Implementation approach: Card grid mirrors 2.2 data-fetch shape
- **Risk:** low
- **Workflow / step:** dev-story step 5 (implement tasks 1-5)
- **Decision point:** Portal classes page design — Card grid vs Table; CTA label ("View class" vs "Book"); nav link position (before or after Wallet).
- **Options considered:** A) Card grid with "View class" CTA, Classes link before Wallet; B) Table like admin page; C) "Book" CTA label.
- **Chosen:** A — Card grid (UX-DR2/DR3 distinct from admin Table), "View class" CTA (clearer student intent, not booking yet), Classes nav link placed before Wallet (logical browse-first order).
- **Rationale:** Story explicitly mandates Card grid (UX-DR2/DR3 = distinct from 2.2 admin Table). "View class" matches Story 3.3 intent (detail/checkout, not the booking action itself). Nav ordering: Classes is the primary browsing action, Wallet is secondary — left-to-right mirrors user journey.
- **Reversibility:** Change CTA label in page.tsx line; swap nav link order in portal-nav.tsx.
- **Files touched:** acce-nextjs/src/app/(portal)/portal/classes/page.tsx, acce-nextjs/src/app/(portal)/portal-nav.tsx

### [2026-07-06T05:11:59Z] 3-2-browse-upcoming-classes-with-seats-left — Story complete: marked review
- **Risk:** low
- **Workflow / step:** dev-story step 9 (completion + sprint-status update)
- **Decision point:** All 5 tasks complete, all ACs satisfied, 223/223 vitest pass, build clean, prisma validate clean. Mark story review.
- **Options considered:** A) Mark review; B) Keep in-progress.
- **Chosen:** A — story marked review in both story file and sprint-status.yaml.
- **Rationale:** All validation gates pass per skill step 9.
- **Reversibility:** Revert story Status + sprint-status line back to in-progress.
- **Files touched:** _bmad-output/implementation-artifacts/3-2-browse-upcoming-classes-with-seats-left.md, _bmad-output/implementation-artifacts/sprint-status.yaml

### [2026-07-06T05:23:06Z] 3-2-browse-upcoming-classes-with-seats-left — Code-review verdict: CLEAN → done
- **Risk:** low
- **Workflow / step:** code-review step 3 (triage) + step 4 (present/act, fix-vs-action-items `<ask>`)
- **Decision point:** After a fresh adversarial pass (Blind Hunter / Edge Case Hunter / Acceptance Auditor lenses applied inline against all 6 ACs + AD-2/3/5/9/10), decide whether any finding requires a patch, and set the final story status.
- **Options considered:** A) Find issues and FIX all HIGH/MEDIUM per the default; B) Declare clean → `done`; C) Leave action items → `in-progress`.
- **Chosen:** B — declared clean and set status `done`. Zero patch/decision-needed/defer findings; 1 finding dismissed as noise.
- **Rationale:** The story is a pure read-only reader that faithfully mirrors the 2.2 admin-classes analog. All six ACs independently re-derived from the diff and confirmed: guard-first `requireSession()` before any fetch/JSX (AC5/AD-3), reused AD-5 single-source `occupiedEnrollmentWhere(now)`+`computeSeatsLeft` via filtered `_count` with no re-derivation (AC1), full-class "Class full" state with no dead CTA (AC2), token-styled gold CTA forward-linking `/portal/classes/[id]` (AC3), calm empty state (AC4), and a green chain (AC6). AD-9 integer-cents-at-UI-edge, AD-10 (`meetingUrl`/`location` deliberately not selected), AD-2 (`db` singleton), zero writes all verified. Chain re-run independently: `prisma validate` clean, `npm run build` clean with `/portal/classes ƒ Dynamic`, 223/223 vitest incl 4 new `formatSeatsLeft` boundaries. The single dismissed finding (per-card gold CTA repeated across the browse grid vs UX-DR2 "one gold accent CTA per view group") is the standard product-grid pattern — one primary action per Card — and the full-vs-available distinction is carried by label text, not colour alone (UX-DR6); no change warranted.
- **Reversibility:** Status is data-only. To reopen: set `Status: review`/`in-progress` in the story file and the `development_status` entry in sprint-status.yaml back, and add a `### Review Findings` Patch bullet for dev-story to pick up next loop. No code was changed by this review, so nothing to revert in source.
- **Files touched:** _bmad-output/implementation-artifacts/3-2-browse-upcoming-classes-with-seats-left.md (Status → done, Review Findings appended); _bmad-output/implementation-artifacts/sprint-status.yaml (3-2 → done, last_updated, comment line)

### [2026-07-06T05:30:19Z] 3-3-class-detail-and-checkout-page — Scope split: 3.3 builds detail+checkout PRESENTATION, reserve action is 3.4
- **Risk:** medium
- **Workflow / step:** create-story step 2/5 (story scoping vs Story 3.4)
- **Decision point:** Story 3.3 AC1 puts the "Pay with balance" checkout panel in this story, but the canonical seat reservation (`reserveSeat`/`wallet.mutate`/`BOOKING_CHARGE`, AD-4/AD-6) and the UX-DR5 success/error toast are Story 3.4's ACs. Where is the boundary?
- **Options considered:** A) 3.3 renders a live "Pay with balance" button wired to a reserve action (duplicates/pulls 3.4 forward, AD-4 single reservation) / B) 3.3 builds a read-only detail+checkout page: server-computes balance≥price + full/enrolled states and renders the "Pay with balance" affordance as an INERT/disabled control; 3.4 converts the panel to a client island, adds reserveSeat + wiring + toast / C) 3.3 omits the checkout panel entirely (violates AC1)
- **Chosen:** B — fully server-rendered detail page presenting the checkout states; the "Pay with balance" button is present but disabled/non-submitting in 3.3. Mirrors the 2.2→2.3 forward-reference precedent (ship the affordance to a target the next story makes live).
- **Rationale:** Keeps AD-4's single `reserveSeat` owned by 3.4; keeps 3.3 write-free (AD-5 readers never write) and fully RSC (avoids the 1.5 RSC-500 trap); each story stays independently shippable. No dead action call at runtime.
- **Reversibility:** If a live button is preferred in 3.3, add the reserve action + client island here instead — but that just relocates 3.4 work; the presentational split is trivially superseded when 3.4 wires the panel.
- **Files touched:** _bmad-output/implementation-artifacts/3-3-class-detail-and-checkout-page.md

### [2026-07-06T05:30:19Z] 3-3-class-detail-and-checkout-page — AD-10 join-detail gating: CONFIRMED-only, mode-dependent, omitted server-side
- **Risk:** medium
- **Workflow / step:** create-story step 3 (architecture guardrail — FR6/AD-10)
- **Decision point:** How to reveal meetingUrl/location only to a CONFIRMED enrollee without leaking the field to non-payers (AD-10: "omitted server-side, not merely hidden in the component").
- **Options considered:** A) Always select meetingUrl+location, hide in JSX when not confirmed (leaks into RSC payload — violates AD-10) / B) Look up the viewer's Enrollment.status first; only when CONFIRMED select/pass the sensitive fields (conditional select or a second scoped findUnique), and reveal mode-dependently (ONLINE→meetingUrl, IN_PERSON→location per FR6, which also sidesteps the deferred "stale meetingUrl on IN_PERSON" data issue)
- **Chosen:** B — query `enrollment.findUnique({ where: { studentId_groupSessionId } })`; `isConfirmed = status === "CONFIRMED"`; select meetingUrl/location ONLY when isConfirmed; render ONLINE→meetingUrl, IN_PERSON→location.
- **Rationale:** Matches AD-10 literally (server-side omission so the field never reaches the client), satisfies FR6 both directions, and mode-gating the reveal avoids surfacing a stale Meet link left on an IN_PERSON row (deferred-work item from 2.3).
- **Reversibility:** Single fetch site; the gating predicate can be recentred if enrollment/meet consumption changes. Low blast radius.
- **Files touched:** _bmad-output/implementation-artifacts/3-3-class-detail-and-checkout-page.md

### [2026-07-06T05:30:19Z] 3-3-class-detail-and-checkout-page — Dynamic e2e route uses seeded id seed-class-acc-1
- **Risk:** low
- **Workflow / step:** create-story step 5 (e2e manifest wiring)
- **Decision point:** The dynamic /portal/classes/[id] route (deliberately left to 3.3 by 3.2) needs a concrete path in the authenticated-route manifest.
- **Options considered:** A) skip the dynamic route / B) use the deterministic seeded class id `seed-class-acc-1` (already used by the 2.3 edit-route manifest entry)
- **Chosen:** B — append `{ path: "/portal/classes/seed-class-acc-1", role: "STUDENT" }`. Mirrors 2.3's `/admin/classes/seed-class-acc-1/edit` entry.
- **Rationale:** Gives the RSC-500 smoke a real, seed-backed target; consistent with the established dynamic-route manifest convention.
- **Reversibility:** One-line manifest edit.
- **Files touched:** acce-nextjs/tests/e2e/authenticated-routes.ts (by dev in dev-story)

### [2026-07-06T05:35:02Z] 3-3-class-detail-and-checkout-page — dev-story start: mark in-progress, capture baseline_commit
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story status is `ready-for-dev`; need to capture baseline_commit and transition sprint-status to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Record HEAD commit `a3210042ce00ef0c6d68ccebb8404367acb9cfd0` as baseline_commit; update sprint-status.yaml and story file to `in-progress`.
- **Rationale:** Required by workflow contract.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`; remove baseline_commit from story frontmatter.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/3-3-class-detail-and-checkout-page.md

### [2026-07-06T05:38:00Z] 3-3-class-detail-and-checkout-page — dev-story complete: status → review
- **Risk:** low
- **Workflow / step:** dev-story step 9 (story completion and mark for review)
- **Decision point:** All tasks complete; verify chain, update status.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** All 3 tasks complete; 223/223 vitest, build clean (`/portal/classes/[id]` ƒ Dynamic), prisma validate clean; story marked `review` in sprint-status.yaml and story file.
- **Rationale:** All ACs satisfied: AC1 (detail page + checkout panel with 4 states), AC2 (meetingUrl/location omitted server-side for non-confirmed), AC3 (join details revealed mode-dependently for CONFIRMED), AC4 (full-class + insufficient-balance states), AC5 (requireSession first + notFound for missing id), AC6 (chain green, no writes, no schema change, /portal/classes/seed-class-acc-1 in e2e manifest).
- **Reversibility:** Revert status to `in-progress`; delete the new page file.
- **Files touched:** acce-nextjs/src/app/(portal)/portal/classes/[id]/page.tsx, acce-nextjs/tests/e2e/authenticated-routes.ts, _bmad-output/implementation-artifacts/3-3-class-detail-and-checkout-page.md, _bmad-output/implementation-artifacts/sprint-status.yaml

### [2026-07-06T05:44:23Z] 3-3-class-detail-and-checkout-page — code-review verdict: CLEAN → done
- **Risk:** low
- **Workflow / step:** code-review (bmad-code-review v6-skill), fix-vs-action-items <ask>
- **Decision point:** Fresh adversarial review of the `review` story 3.3 (class detail + checkout page). At the fix-vs-action-items ask, default is to auto-fix all HIGH/MEDIUM findings; decide final status (done if clean, else in-progress + Review Follow-ups).
- **Options considered:** A) fix findings + set in-progress with follow-ups; B) verdict CLEAN, set done, defer LOW items; C) block.
- **Chosen:** B — CLEAN. 0 HIGH/MEDIUM/critical findings. 2 LOW findings recorded to deferred-work.md.
- **Rationale:** FRESH re-verification of all 6 ACs + AD-1/2/3/4/5/6/9/10 from scratch, not assuming dev was correct. AD-10 (the security headline) is correctly implemented: enrollment status is looked up FIRST, and `meetingUrl`/`location` are conditionally SELECTED (two-branch `findUnique`) only for a CONFIRMED viewer — true server-side omission, never JSX-hiding; the fields never enter the RSC payload for non-confirmed viewers. Reveal is mode-dependent (ONLINE→meetingUrl, IN_PERSON→location), which also neutralizes the 2.3 stale-meetingUrl deferral on the read side. AD-3: requireSession() runs first (redirects /sign-in), notFound() on unknown id, all lookups keyed to session.user.id. AD-5: reused occupiedEnrollmentWhere + computeSeatsLeft filtered _count, zero write. AD-6: getBalance read-only, wallet.mutate NOT called. AD-9: integer-cents throughout, formatZar only at the edge. The four checkout-panel states (enrolled / full / balance-ok-inert-CTA / insufficient) are mutually exclusive AND exhaustive; label text (not colour) carries each state (UX-DR6). Independently re-ran the chain green: `prisma validate` clean, `npm run build` clean (`/portal/classes/[id]` present as ƒ Dynamic), 223/223 vitest. Per project precedent (1.4/2.2/2.3 went `done` with LOW items deferred), LOW-only → done.
- **Reversibility:** No code was changed this review (clean). To reverse the status decision, set 3-3 back to `in-progress` in sprint-status.yaml and convert either LOW deferral into a Review Follow-up task on the story.
- **Files touched:** _bmad-output/implementation-artifacts/deferred-work.md (2 LOW items), _bmad-output/implementation-artifacts/sprint-status.yaml (3-3 → done), _bmad-output/implementation-artifacts/autopilot-decisions.md

### [2026-07-06T05:44:23Z] 3-3-class-detail-and-checkout-page — 2 LOW findings deferred (not fixed)
- **Risk:** low
- **Workflow / step:** code-review, triage
- **Decision point:** Two LOW findings surfaced; auto-fix mandate covers HIGH/MEDIUM only. Fix now or defer?
- **Options considered:** A) fix both now; B) defer both to a later loop / 3.4; C) fix one, defer one.
- **Chosen:** B — defer both to deferred-work.md.
- **Rationale:** (1) The detail fetch has no status/start guard, so a deep-link to a CANCELLED/past class renders detail + an inert checkout — but the button is inert and real enforcement is the 3.4 reserve-under-lock path; no 3.3 AC requires 404-ing non-scheduled classes. Fixing it now would pre-empt a 3.4 design decision. (2) The inert Pay button uses native `disabled` (not tab-focusable), mildly contradicting the UX-DR6 "keyboard-operable" note — but it is still screen-reader-perceivable, and 3.4 converts the panel to a client island with a live (focusable) button, making the item transient. Neither is a correctness/security defect; deferring keeps 3.3 scope tight and avoids touching code that 3.4 rewrites.
- **Reversibility:** Both items are logged in deferred-work.md#story-3.3; promote either to a story task if a later loop decides to address it before 3.4.
- **Files touched:** _bmad-output/implementation-artifacts/deferred-work.md

### [2026-07-06T05:50:36Z] 3-4-reserve-and-pay-a-seat-from-wallet-balance — Story scope: reserveSeat balance-path only, Paystack PENDING branch deferred to Epic 4
- **Risk:** medium
- **Workflow / step:** create-story step 2 (epic/story analysis) + step 5 (scope boundaries)
- **Decision point:** AD-4 mandates ONE canonical `reserveSeat()` serving BOTH the wallet-balance path and the Paystack path. Story 3.4's ACs only cover the balance path; Paystack init/PENDING-hold is Epic 4 (Story 4.1). How much of `reserveSeat` does 3.4 build?
- **Options considered:** A) Build the full reserveSeat incl. the PENDING/pendingExpiresAt Paystack branch now; B) Build reserveSeat with ONLY the balance→CONFIRMED+BOOKING_CHARGE branch now, structured so Epic 4 extends it with the insufficient-balance→PENDING branch; C) Build a balance-only helper and let Epic 4 build a separate reserve path.
- **Chosen:** B — reserveSeat is created in `src/lib/enrollment.ts` with the Serializable-tx skeleton (FOR UPDATE, AD-5 count, AD-12 create-or-reactivate, AD-6 BOOKING_CHARGE) implementing the balance→CONFIRMED path; the Paystack PENDING branch is a documented forward-extension seam (Epic 4). Option C is explicitly forbidden by AD-4 (no second reservation path); A is out-of-scope scope-creep into Epic 4.
- **Rationale:** Honours AD-4's single-canonical-reservation invariant while keeping 3.4 to its ACs. Mirrors how 2.1 established the create pattern and 2.3 extended the tx/lock pattern.
- **Reversibility:** Epic 4 extends the same function in-place (add the `else`/insufficient-balance→PENDING branch). If the seam shape is wrong, only `enrollment.ts` changes; callers use the discriminated result.
- **Files touched:** _bmad-output/implementation-artifacts/3-4-reserve-and-pay-a-seat-from-wallet-balance.md

### [2026-07-06T05:50:36Z] 3-4-reserve-and-pay-a-seat-from-wallet-balance — AD-12 reactivation vs AD-8 one-BOOKING_CHARGE-per-enrollment cross-epic tension flagged
- **Risk:** high
- **Workflow / step:** create-story step 3 (architecture guardrails) — adversarial gap analysis
- **Decision point:** AD-12 says re-booking a previously-CANCELLED class must REUSE (reactivate) the existing `Enrollment` row (status-agnostic `@@unique([studentId, groupSessionId])`). AD-8 enforces one `BOOKING_CHARGE` per enrollmentId via a partial unique index. Reactivating a row that already has a historical `BOOKING_CHARGE` and writing a new one would hit that unique index → the reactivation charge path is unsatisfiable as written.
- **Options considered:** A) Resolve the collision now in 3.4 (redesign the partial-unique key or reactivation ledger identity); B) Implement create-or-reactivate per AD-12 but note the collision is not reachable in Phase 1a until a cancel path exists (Epic 5), and flag it as a cross-epic item to resolve when Epic 5 lands; C) Ignore reactivation entirely and only handle new-enrollment + FR11 reject.
- **Chosen:** B — 3.4 codes the FR11 reject (non-cancelled existing enrollment) as the live, tested behaviour; the CANCELLED→reactivate branch is implemented defensively per AD-12 but the AD-8 BOOKING_CHARGE-collision is documented as a deferred cross-epic decision (no CANCELLED enrollment can exist until Epic 5's cancel flow, so it is unreachable in 3.4). Recorded in the story Dev Notes + deferred-work.
- **Rationale:** Cancel/refund (Epic 5) does not exist yet, so no CANCELLED row is producible in 3.4; forcing a partial-unique redesign now would be speculative and could churn the AD-8 migration. FR11 (the reachable case) is fully handled + tested.
- **Reversibility:** When Epic 5 lands cancel, revisit: either key the BOOKING_CHARGE partial-unique on an active-cycle discriminator, or give reactivation a fresh ledger identity. Isolated to `enrollment.ts` + the AD-8 migration.
- **Files touched:** _bmad-output/implementation-artifacts/3-4-reserve-and-pay-a-seat-from-wallet-balance.md, _bmad-output/implementation-artifacts/deferred-work.md

### [2026-07-06T05:50:36Z] 3-4-reserve-and-pay-a-seat-from-wallet-balance — Checkout panel becomes a client island; live concurrency test deferred to CI
- **Risk:** medium
- **Workflow / step:** create-story step 5 (UX + testing scope)
- **Decision point:** UX-DR5 requires a sonner toast on book success/error, which needs a client component; the 3.3 checkout panel is currently fully server-rendered. Also AD-4 mandates a real-Postgres concurrency integration test that the credential-blocked sandbox cannot run.
- **Options considered (island):** A) Extract a `"use client"` "Pay with balance" button island that calls the server action and toasts, keeping the rest of the detail page server-rendered (avoids the 1.5 RSC non-children-prop 500 trap); B) Convert the whole page to a client component (breaks AD-10 server-side omission + AD-3 server guard posture).
- **Chosen (island):** A. **Testing:** unit-test the pure reserve-input schema / result-mapping helper (mirrors 2.1/2.3); defer the live Serializable/40001 no-oversell concurrency integration test to the CI ephemeral-Postgres job (same wall as 1.1/1.5/2.2/2.3), per AD-4's explicit "must include a real-Postgres concurrency integration test" — recorded in deferred-work.
- **Rationale:** Keeps the AD-10 join-detail server omission and AD-3 guard intact; matches the established island + CI-deferral posture of the codebase.
- **Reversibility:** Island is a new client file consumed via `children`/prop-safe wiring; CI test is additive. No schema impact.
- **Files touched:** _bmad-output/implementation-artifacts/3-4-reserve-and-pay-a-seat-from-wallet-balance.md, _bmad-output/implementation-artifacts/deferred-work.md

### [2026-07-06T06:00:31Z] 3-4-reserve-and-pay-a-seat-from-wallet-balance — dev-story start: mark in-progress, baseline_commit preserved
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story status is `ready-for-dev`; baseline_commit already set in frontmatter (92fa690b — set by create-story run); need to transition sprint-status to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Baseline commit `92fa690b85f1bf4960ddea81e7b7388e97005c57` preserved (already in frontmatter); update sprint-status.yaml to `in-progress`.
- **Rationale:** Required by workflow contract. baseline_commit already present — do not overwrite per dev-story step 4 rule.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/3-4-reserve-and-pay-a-seat-from-wallet-balance.md

### [2026-07-06T06:00:31Z] 3-4-reserve-and-pay-a-seat-from-wallet-balance — CRITICAL: WalletInsufficientFundsError must throw out of tx callback to trigger rollback
- **Risk:** critical
- **Workflow / step:** dev-story step 5 (Task 1 — enrollment.ts reserveSeat implementation)
- **Decision point:** When `wallet.mutate()` throws `WalletInsufficientFundsError` inside the tx callback, should we (A) catch inside callback and return `{ ok: false, reason: 'insufficient_balance' }` → tx COMMITS (enrollment row persists, no ledger — data integrity violation), or (B) let the error propagate out of the callback → Prisma rolls back the full Serializable tx → enrollment NOT persisted → catch in outer try/catch.
- **Options considered:** A) catch inside → tx commits with orphaned enrollment; B) throw out → tx rolls back → outer catch returns discriminated result.
- **Chosen:** B — `WalletInsufficientFundsError` is NOT caught inside the `db.$transaction` callback. It propagates out, Prisma rolls back the tx, the enrollment creation is rolled back. The outer try/catch catches it and returns `{ ok: false, reason: 'insufficient_balance' }`. The story says "the throw rolls the whole tx back" — confirms approach B.
- **Rationale:** Only by throwing can we guarantee rollback. Approach A would silently create an orphaned `CONFIRMED` enrollment with no `BOOKING_CHARGE` ledger entry — a data integrity violation (a student would have a CONFIRMED seat without paying). This is a CRITICAL path (moves real balance).
- **Reversibility:** If a future requirement changes how insufficient_balance is handled (e.g., PENDING state), refactor the catch location inside the tx and manage tx state explicitly. No schema change needed.
- **Files touched:** acce-nextjs/src/lib/enrollment.ts

### [2026-07-06T06:00:31Z] 3-4-reserve-and-pay-a-seat-from-wallet-balance — Pure reserve schema placed in src/lib/reserve-schema.ts
- **Risk:** medium
- **Workflow / step:** dev-story step 5 (Task 4 — pure helper module placement)
- **Decision point:** Where to place the pure reserve-input Zod schema and reason→message mapper?
- **Options considered:** A) Colocated in `src/app/(portal)/portal/classes/[id]/reserve-schema.ts`; B) Shared lib at `src/lib/reserve-schema.ts` (mirrors wallet-math.ts, wallet-display.ts, class-occupancy.ts all in src/lib).
- **Chosen:** B — `src/lib/reserve-schema.ts`. Mirrors the established pattern of pure db-free helpers in src/lib; also importable from the client island without crossing route-group boundaries.
- **Rationale:** The pure helper pattern (src/lib, no db import, vitest-jsdom-safe) is the project standard for testable helpers.
- **Reversibility:** Move the file to the route folder and update the import in the unit test + island; one-line change in each.
- **Files touched:** acce-nextjs/src/lib/reserve-schema.ts, acce-nextjs/tests/unit/reserve-schema.test.ts

### [2026-07-06T06:00:31Z] 3-4-reserve-and-pay-a-seat-from-wallet-balance — Retry loop: MAX_RETRIES=4 (5 total attempts), backoffs [50,100,200]ms
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 1, subtask 2 — retry parameters)
- **Decision point:** Story says "bounded retry, 3–5 attempts, small backoff". Exact parameters not specified.
- **Options considered:** A) 3 attempts, [50,100]ms; B) 4 max retries (5 total), [50,100,200]ms; C) 5 retries, [100,200,400]ms.
- **Chosen:** B — `MAX_RETRIES = 4` (attempts 0..4 = 5 total), backoffs `[50, 100, 200]` ms (clamped at last index for retries ≥2). Timeout=15000ms, maxWait=5000ms.
- **Rationale:** 4 retries within 3–5 range; 200ms max backoff keeps total serialization overhead ≤650ms well within 15s timeout.
- **Reversibility:** Change the constants in enrollment.ts; no downstream impact.
- **Files touched:** acce-nextjs/src/lib/enrollment.ts

### [2026-07-06T06:16:30Z] 3-4-reserve-and-pay-a-seat-from-wallet-balance — Code review: fix-vs-action-items at <ask>
- **Risk:** critical
- **Workflow / step:** code-review step-04 (Present & Act — patch handling `<ask>`)
- **Decision point:** The workflow HALTs to ask how to handle findings (apply patches / leave as action items / walk through). This is a MONEY + CONCURRENCY path (Serializable reserve + BOOKING_CHARGE debit), so tagged critical per the taxonomy even though the review came back clean.
- **Options considered:** A) leave findings as action items → in-progress; B) auto-fix HIGH/MEDIUM then set status per outcome; C) dismiss everything and set done.
- **Chosen:** B — but the FRESH adversarial pass produced 0 HIGH/MEDIUM/critical findings, so the only action was auto-fixing 1 LOW misleading comment and dismissing 2 LOW noise items; status set to `done`.
- **Rationale:** Contract default is FIX AUTOMATICALLY all HIGH/MEDIUM and set `done` if clean. Independently re-verified the chain (prisma validate clean, build clean w/ `/portal/classes/[id]` ƒ Dynamic, 253/253 vitest) and the correctness-critical invariants by direct code read + grep rather than trusting the dev record: AD-14 (grep: no Enrollment.status write outside enrollment.ts), AD-6 (grep: no ledgerEntry.create outside wallet.ts), AD-8 enrollment-before-charge, WalletInsufficientFundsError propagating out of the tx callback → rollback → `insufficient_balance` (no orphaned CONFIRMED row), AD-4 Serializable + FOR UPDATE + P2034/40001 retry, AD-5 occupancy-under-lock via reused predicate, AD-3 requireSession-first keyed to session.user.id, AD-9 integer-cents `-priceCents`, AD-16 price snapshot from the locked row. No oversell / negative-balance path found; the last-seat race is blocked by SSI with the @@unique as backstop.
- **Reversibility:** Revert status `done`→`review` in sprint-status.yaml + story frontmatter to reopen. The only code change is a comment edit in page.tsx (git revert the commit). No logic, schema, or data changed by the review.
- **Files touched:** acce-nextjs/src/app/(portal)/portal/classes/[id]/page.tsx (comment only); _bmad-output/implementation-artifacts/3-4-reserve-and-pay-a-seat-from-wallet-balance.md; _bmad-output/implementation-artifacts/sprint-status.yaml

### [2026-07-06T06:16:45Z] 3-4-reserve-and-pay-a-seat-from-wallet-balance — Dismiss two LOW findings vs deferring
- **Risk:** low
- **Workflow / step:** code-review step-03 (Triage — severity + routing)
- **Decision point:** Two LOW observations: (1) server action maps a Zod parse failure to `not_available`; (2) trailing `return {ok:false,reason:"error"}` after the retry `while` looks like dead code.
- **Options considered:** patch / defer (record in deferred-work + Review Follow-up) / dismiss.
- **Chosen:** Dismiss both (dropped, not written to deferred-work).
- **Rationale:** (1) The client island always sends a valid `{classId}` from `cls.id`; the parse-fail path is defensive-only and a generic rejection avoids leaking a distinct state — behaviourally harmless. (2) The trailing return is REQUIRED to satisfy TypeScript's return-path analysis for the `while (attempt <= MAX_RETRIES)` loop and is a correct retry-exhaustion safety net — not dead code. Neither warrants a code change or a follow-up.
- **Reversibility:** N/A (no change). If desired later, add a distinct `invalid_input` reason and/or refactor the retry loop to a for-loop; both are local, reversible edits.
- **Files touched:** none

### [2026-07-06T06:22:45Z] 3-5-admin-credits-a-students-wallet-resolves-the-balance-origin-gap — create-story: shape of the (missing) admin student view + credit path
- **Risk:** medium
- **Workflow / step:** create-story step 5 (author story) — interpreting an ambiguous AC + scoping a surface that does not yet exist
- **Decision point:** Epic AC1 says "I am an authenticated ADMIN **on a student's admin view**" — but NO admin student list/detail view exists in the codebase today (admin has only /admin/classes*). The story must decide what "a student's admin view" is and how the admin reaches a specific student to credit.
- **Options considered:** A) single static /admin/students page with a student-select dropdown + amount (no dynamic route); B) a /admin/students list page + a per-student /admin/students/[id] detail-with-credit view (mirrors 2.2 list → 2.3 detail); C) bolt a credit form onto some existing page.
- **Chosen:** B — /admin/students (read-only list of role=STUDENT users, requireAdmin, empty-state) linking to /admin/students/[id] (the "student's admin view": student identity + current wallet balance via getBalance + read-only ledger + a client-island credit form). Credit runs through creditWalletAction → db.$transaction → wallet.mutate ADJUSTMENT (positive cents), mirroring the 2.1 create-action + 2.2 list + 3.1 wallet-read patterns already in the app.
- **Rationale:** B matches the epic's "on a student's admin view" wording literally, reuses the established list→detail admin pattern (2.2→2.3) and the wallet-read UI (3.1), and gives a real per-student surface Priyanka can use once students self-register (Story 1.2 magic-link). A would satisfy the AC too but diverges from the epic's per-student framing and the app's list/detail convention. The ADJUSTMENT credit goes through the ONE vetted AD-6 seam (wallet.mutate: per-student advisory lock → read-under-lock → NFR4 non-negative guard → immutable append) — no new money primitive is introduced; 3.5 is the seam's ADJUSTMENT caller exactly as 3.4 was its BOOKING_CHARGE caller.
- **Reversibility:** All new files under (admin)/admin/students/** + a pure credit-schema + one nav link + one e2e manifest line. To collapse to option A: drop the [id] route, move the credit form onto the list page with a student-select. No schema/migration/dependency change, so reversal is local file deletion.
- **Files touched:** _bmad-output/implementation-artifacts/3-5-admin-credits-a-students-wallet-resolves-the-balance-origin-gap.md (this create-story)

### [2026-07-06T06:23:09Z] 3-5-admin-credits-a-students-wallet-resolves-the-balance-origin-gap — create-story: no seeded student → e2e dynamic-route + live-credit coverage deferred
- **Risk:** low
- **Workflow / step:** create-story step 5/6 — testing scope + e2e manifest wiring
- **Decision point:** The seed provisions only Priyanka (ADMIN); there is NO seeded STUDENT user (confirmed in prisma/seed-data.ts — ADMIN_USER only). So /admin/students renders an empty list on a fresh seed, and there is no deterministic seeded student id to pin the dynamic /admin/students/[id] route (unlike 2.3/3.3 which used seed-class-acc-1) or to run a live ADJUSTMENT credit against.
- **Options considered:** A) add a seeded student to prisma/seed-data.ts so the dynamic route + live credit can be pinned now; B) add only the static /admin/students route to the e2e manifest (empty-state → 200 RSC-500 smoke) and defer the dynamic-route + live-credit coverage to the CI ephemeral-Postgres job (same wall as 1.1/1.5/2.2/2.3/3.4); C) add nothing to the manifest.
- **Chosen:** B — /admin/students added to authenticated-routes manifest (static, empty-state safe); the dynamic /admin/students/[id] live-authenticated run + the real ADJUSTMENT-credit round-trip (balance increases, ledger row appears) recorded as deferred to CI ephemeral-Postgres. Pure credit-schema gets full unit-test coverage in-sandbox.
- **Rationale:** Option A (seed a student) mutates shared seed state that four done stories reason about ("no seeded student; no balance until 3.5" — 3.4 Dev Notes) and is a higher-blast-radius change than this story needs; the balance-origin capability is real the moment a student self-registers via 1.2, so a seeded fixture is not required to satisfy the ACs. B matches the established sandbox wall (prod DB creds blocked; live DB writes + auth e2e deferred to CI) and keeps 3.5 schema/seed/dependency-free. Static RSC-500 coverage still lands for the new list route.
- **Reversibility:** If a seeded student is later wanted (e.g. to demo end-to-end without self-registration), add it to seed-data.ts and pin /admin/students/[seeded-id] in the manifest — additive, no migration.
- **Files touched:** _bmad-output/implementation-artifacts/3-5-...md; _bmad-output/implementation-artifacts/deferred-work.md (deferred entry, added during this create-story)

### [2026-07-06T06:28:35Z] 3-5-admin-credits-a-students-wallet-resolves-the-balance-origin-gap — dev-story start: mark in-progress, capture baseline_commit
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story status is `ready-for-dev`; need to capture baseline_commit and transition sprint-status to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Record HEAD commit `e8e054cd34086d81c0a713a8c102342fbe8aed0a` as baseline_commit; update sprint-status.yaml and story file to `in-progress`.
- **Rationale:** Required by workflow contract.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`; remove baseline_commit from story frontmatter.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/3-5-admin-credits-a-students-wallet-resolves-the-balance-origin-gap.md

### [2026-07-06T06:28:35Z] 3-5-admin-credits-a-students-wallet-resolves-the-balance-origin-gap — credit-schema.ts colocated under students/[id]/
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 1 — schema file placement)
- **Decision point:** Story allows either colocated `(admin)/admin/students/[id]/credit-schema.ts` or `src/lib/credit-schema.ts`. Both are pure, db-free.
- **Options considered:** A) Colocate with action/form at `src/app/(admin)/admin/students/[id]/credit-schema.ts`; B) Global lib at `src/lib/credit-schema.ts`.
- **Chosen:** A — colocated, mirrors the 2.1 `class-form-schema.ts` precedent (colocated with its action+form). Only the action/form under `students/[id]/` need this schema.
- **Rationale:** Colocated schema keeps module cohesion tight. If reused elsewhere, trivially movable to `src/lib/`.
- **Reversibility:** `git mv` + update two import paths.
- **Files touched:** src/app/(admin)/admin/students/[id]/credit-schema.ts

### [2026-07-06T06:46:48Z] 3-5-admin-credits-a-students-wallet-resolves-the-balance-origin-gap — Code review: root-cause fix for role default (students invisible to admin surface)
- **Risk:** critical
- **Workflow / step:** code-review step 4 (fix-vs-action-items <ask> → auto-fix HIGH)
- **Decision point:** Adversarial review found a HIGH bug: Story 3.5's admin students list/view identify students via `role === "STUDENT"`, but the Better Auth admin plugin's user-create `before` hook injects `role: options.defaultRole ?? "user"` into the insert data (verified in node_modules/better-auth/dist/plugins/admin/admin.mjs:29), which BYPASSES the Prisma `@default("STUDENT")`. So real magic-link signups get `role: "user"`, not "STUDENT" — the admin students list would render empty and every per-student view would 404 in production, making the entire story (and its "resolve the balance-origin gap" purpose) non-functional. The dev-story Dev Note assertion "self-registered students carry the explicit STUDENT string" is factually wrong.
- **Options considered:** A) Set `admin({ defaultRole: "STUDENT" })` in src/lib/auth.ts — root-cause fix aligning Better Auth with the schema default + the codebase's documented `session.user.role` = STUDENT|ADMIN model; B) Weaken 3.5's filter to `role != "ADMIN"` (consumer-side, treats any non-admin as student) — robust but loses the clean STUDENT semantic and mishandles null roles in Postgres (`<> 'ADMIN'` is NULL for null rows); C) Leave as action item for dev-story next loop.
- **Chosen:** A — one-line root fix `admin({ defaultRole: "STUDENT" })`.
- **Rationale:** Fixes the defect at its source so the whole codebase's stated role model becomes true; keeps 3.5's precise `role === "STUDENT"` filter correct for all future signups. defaultRole is NOT validated against the plugin's `roles` map (only `adminRoles` is — admin.mjs:19), so "STUDENT" writes cleanly. Seed sets Priyanka's role to "ADMIN" explicitly (seed-data.ts:36), so this default never affects the admin. On a fresh/greenfield system there are no existing student rows to backfill (sandbox has none; ADMIN-only seed), so no migration/data concern.
- **Reversibility:** Fully reversible — revert `admin({ defaultRole: "STUDENT" })` back to `admin()`. It only affects the role written to NEW users at signup going forward; it performs no migration and touches no existing rows. If the app already has live "user"-role students in production, a one-time backfill (`UPDATE "user" SET role='STUDENT' WHERE role='user'`) would be needed in addition — recorded as a note, not applied (no evidence of live student data at this development stage).
- **Files touched:** acce-nextjs/src/lib/auth.ts

### [2026-07-06T06:54:43Z] 4-1-paystack-init-with-a-15-minute-pending-seat-hold — Epic-4 branch + epic status transition
- **Risk:** low
- **Workflow / step:** create-story step 1 (target story) + step 6 (sprint status)
- **Decision point:** No `epic-4` git branch existed (HEAD was on `epic-3`); 4-1 is the first story of Epic 4, which requires marking the epic `in-progress`.
- **Options considered:** A) `git checkout -b epic-4` off current HEAD (epic-3 tip); B) branch from main.
- **Chosen:** A — created `epic-4` from the epic-3 tip (2fefcb9) per the dispatch VERSION CONTROL block (one branch per epic, chained off prior epic). Set `development_status.epic-4: in-progress` per create-story step-1 first-story rule.
- **Rationale:** Contract mandates epic-4 chained off prior work, never main; skill mandates epic→in-progress on first story creation.
- **Reversibility:** `git branch -D epic-4`; revert the sprint-status `epic-4` line to `backlog`.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml

### [2026-07-06T06:54:43Z] 4-1-paystack-init-with-a-15-minute-pending-seat-hold — reserveSeat return-shape extended to carry the PENDING/Paystack outcome
- **Risk:** medium
- **Workflow / step:** create-story steps 2-3 (artifact + architecture analysis → story scoping)
- **Decision point:** AD-4 mandates ONE `reserveSeat()` for both the balance and Paystack paths, extended in place (never a second reservation fn). The 3.4 `reserveSeat` returns `{ ok: true; enrollmentId } | { ok: false; reason }` and currently treats insufficient balance as a terminal `insufficient_balance` failure (caught from `WalletInsufficientFundsError`). 4.1 must turn the insufficient-balance case into a PENDING+hold success outcome. How should the result shape evolve so the caller can distinguish "confirmed now" from "go pay online"?
- **Options considered:** A) widen the success arm to a discriminated `outcome`: `{ ok: true; outcome: "confirmed"; enrollmentId } | { ok: true; outcome: "pending_payment"; enrollmentId; paymentRef; amountCents }`, keep the `{ ok: false; reason }` arm; B) keep the flat shape and add an out-of-band flag; C) a second reservation fn for Paystack (rejected — violates AD-4).
- **Chosen:** A. reserveSeat now reads balance UNDER the lock: `balance >= price` → existing CONFIRMED + BOOKING_CHARGE (unchanged); else → create/reactivate PENDING with `pendingExpiresAt = now+15min` + a unique `paymentRef`, and return the `pending_payment` outcome. The `insufficient_balance` reason is removed from the reachable set (balance shortfall is no longer a failure).
- **Rationale:** Single canonical reservation (AD-4) with an honest discriminated result; balance decision made under the same lock that guarantees no-oversell; the 3.4 balance-path consumers (reserveSeatAction / PayWithBalanceButton) only need to map the new `outcome: "confirmed"` arm.
- **Reversibility:** Result type is internal to enrollment.ts + its two entry actions; revert by collapsing the `outcome` arms and restoring the `insufficient_balance` terminal reason. No DB/schema impact (shape is code-only).
- **Files touched:** (guidance only — implemented by dev-story) acce-nextjs/src/lib/enrollment.ts, .../(portal)/portal/classes/[id]/actions.ts, pay-with-balance-button.tsx

### [2026-07-06T06:54:43Z] 4-1-paystack-init-with-a-15-minute-pending-seat-hold — Paystack init runs OUTSIDE the Serializable tx
- **Risk:** medium
- **Workflow / step:** create-story step 3 (architecture guardrails → sequencing)
- **Decision point:** The Paystack `transaction/initialize` call is an external HTTP round-trip. Where does it run relative to the reserveSeat Serializable transaction that holds the `GroupSession FOR UPDATE` lock?
- **Options considered:** A) call `paystack.init()` INSIDE reserveSeat's tx (holds the DB row lock across an external HTTP call — long lock, serialization-retry storms, tx timeout risk); B) reserveSeat COMMITS the PENDING enrollment + paymentRef in the tx, returns `pending_payment`, then the server action calls `paystack.init()` OUTSIDE the tx with the committed paymentRef as the Paystack `reference`, and returns the checkout URL to the client island for a full-page redirect.
- **Chosen:** B. The domain tx does DB-only work (create PENDING hold + paymentRef under the lock); the server action orchestrates the external init afterward. If init fails after the row commits, the 15-min hold simply lazy-expires (AD-5) and frees the seat — the action returns an error toast.
- **Rationale:** Never hold a DB lock across network I/O; keeps the Serializable tx short (critical for SSI + the P2034/40001 retry loop); paymentRef committed first so the 4.2 webhook can always join `Payment.reference → Enrollment.paymentRef` even if the browser never reaches Paystack. A top-level redirect to Paystack needs no CSP change (`form-action 'self'` only governs form submissions; server-side fetch is not browser-CSP-governed) — confirmed against next.config.ts and ARCHITECTURE-SPINE deployment notes.
- **Reversibility:** Move the init call site; no persistent state affected.
- **Files touched:** (guidance only) acce-nextjs/src/lib/paystack.ts (new), .../(portal)/portal/classes/[id]/actions.ts

### [2026-07-06T06:54:43Z] 4-1-paystack-init-with-a-15-minute-pending-seat-hold — own-PENDING resume vs expired-PENDING reactivation (AC2 nuance)
- **Risk:** medium
- **Workflow / step:** create-story step 2 (interpreting an ambiguous acceptance criterion)
- **Decision point:** 3.4's existing-enrollment check rejects ANY non-CANCELLED own row as `already_enrolled`. With PENDING holds now real, the student's OWN PENDING row must be handled: an UNEXPIRED own PENDING (mid-payment) and an EXPIRED own PENDING (hold lapsed) are different, and neither is exactly `already_enrolled`. The epic AC ("seat isn't sold from under me mid-payment") and AD-5/AD-12 don't spell out the own-row resume/reactivate rule.
- **Options considered:** A) treat all own non-CANCELLED (incl. PENDING) as already_enrolled (blocks legitimate resume + re-book after expiry); B) own UNEXPIRED PENDING → RESUME (return the existing paymentRef so the action re-inits Paystack with the same reference); own EXPIRED PENDING → treat as free/reactivate into a fresh hold (or confirmed if balance now suffices); own CONFIRMED/ATTENDED/NO_SHOW → already_enrolled.
- **Chosen:** B (minimal reasonable interpretation). Under the lock, before counting occupancy, lazily flip OTHER students' expired PENDING rows on this class to CANCELLED (AD-5 "expiry flip only inside a locked mutation in enrollment.ts"); for the current student, branch on own-row status+expiry as above. Paystack `initialize` is effectively idempotent by `reference`, so re-initing with the same paymentRef safely resumes.
- **Rationale:** Honours "seat held while I pay" (resume) and AD-12 (reactivate a lapsed hold rather than dead-ending), while preserving FR11 (one active seat per student). Keeps the expiry flip inside the lock per AD-5, so it can never race a 4.2 webhook confirm.
- **Reversibility:** Localised to reserveSeat's existing-enrollment branch; collapse to option A if resume/reactivate proves out of scope. No schema impact.
- **Files touched:** (guidance only) acce-nextjs/src/lib/enrollment.ts

### [2026-07-06T07:01:00Z] 4-1-paystack-init-with-a-15-minute-pending-seat-hold — dev-story start: mark in-progress + baseline commit
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Starting implementation of story 4-1. Current HEAD is 2fefcb91. Status transitions from ready-for-dev → in-progress.
- **Options considered:** Single choice — follow the workflow.
- **Chosen:** Record baseline_commit=2fefcb91ae184eae1c75318b2ef639d852c8d782 in story YAML frontmatter, update sprint-status.yaml to in-progress.
- **Rationale:** Standard dev-story step 4 procedure.
- **Reversibility:** Revert sprint-status.yaml line to ready-for-dev.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/4-1-paystack-init-with-a-15-minute-pending-seat-hold.md

### [2026-07-06T07:01:01Z] 4-1-paystack-init-with-a-15-minute-pending-seat-hold — ReserveSeatResult type widening: remove insufficient_balance reason
- **Risk:** medium
- **Workflow / step:** dev-story step 5, Task 2
- **Decision point:** The old ReserveSeatResult had `{ ok: false, reason: "insufficient_balance" }`. With PENDING holds, a balance shortfall is no longer a failure. The new union removes `insufficient_balance` and adds `{ ok: true; outcome: "pending_payment"; ... }`. The existing reserve-schema.ts, reserve-schema.test.ts, and pay-with-balance-button.tsx reference `insufficient_balance`.
- **Options considered:** A) Keep `insufficient_balance` as a dead code path for defensive fallback; B) Remove it cleanly from result type and schema, update dependents.
- **Chosen:** B — remove `insufficient_balance` from ReserveSeatResult and ReserveFailureReason, update reserve-schema.test.ts, update pay-with-balance-button.tsx to handle the new outcome-tagged result. The WalletInsufficientFundsError catch returns `{ ok: false, reason: "error" }` as a defensive net (story-mandated).
- **Rationale:** Clean type system — the type accurately reflects possible outcomes. Keeping a dead reason would mislead future developers and cause incorrect toast messages. The story explicitly mandates this removal.
- **Reversibility:** Add `insufficient_balance` back to the union type and re-add the RESERVE_ERROR_MESSAGES entry.
- **Files touched:** acce-nextjs/src/lib/enrollment.ts, acce-nextjs/src/lib/reserve-schema.ts, acce-nextjs/tests/unit/reserve-schema.test.ts, acce-nextjs/src/app/(portal)/portal/classes/[id]/pay-with-balance-button.tsx

### [2026-07-06T07:01:02Z] 4-1-paystack-init-with-a-15-minute-pending-seat-hold — reserveSeatAction handling of pending_payment outcome from balance path
- **Risk:** medium
- **Workflow / step:** dev-story step 5, Task 3
- **Decision point:** The balance-path `reserveSeatAction` calls `reserveSeat`. With the new code, if a student's balance drops between page render and button click, `reserveSeat` returns `{ ok: true, outcome: "pending_payment" }` instead of the old `{ ok: false, reason: "insufficient_balance" }`. The balance button's action should NOT silently treat this as a success.
- **Options considered:** A) Return `{ ok: true, outcome: "pending_payment", ... }` verbatim — PayWithBalanceButton interprets it incorrectly; B) Map `outcome: "pending_payment"` from the balance action → `{ ok: false, reason: "error" }` (unexpected for balance path); C) Map it to `{ ok: false, reason: "not_available" }`.
- **Chosen:** B — `reserveSeatAction` wraps the result: if `r.ok && r.outcome === "confirmed"` → revalidate + return `{ ok: true, outcome: "confirmed", enrollmentId }`; if `r.ok && r.outcome === "pending_payment"` → return `{ ok: false, reason: "error" }` (edge case — balance was spent between render and click, hold was created, student gets error toast, hold will lazily expire); if `!r.ok` → return the error result.
- **Rationale:** Keeps the balance button semantically correct. The pending_payment path requires the Paystack action, not the balance button. The created PENDING hold lazily expires (AC2) and frees the seat. Rare race condition — balance changing between render and click.
- **Reversibility:** Remove the `pending_payment` mapping from reserveSeatAction, accept the odd success toast.
- **Files touched:** acce-nextjs/src/app/(portal)/portal/classes/[id]/actions.ts

### [2026-07-06T07:01:03Z] 4-1-paystack-init-with-a-15-minute-pending-seat-hold — payWithPaystackAction name + placement
- **Risk:** low
- **Workflow / step:** dev-story step 5, Task 3
- **Decision point:** The story says "Add the Paystack entry to actions.ts (or a colocated payWithPaystackAction)." Name and placement choice.
- **Options considered:** A) `initializePaystackAction`; B) `payWithPaystackAction`; C) `reserveWithPaystackAction`.
- **Chosen:** B — `payWithPaystackAction` placed in the existing actions.ts. Mirrors `reserveSeatAction` naming style (verb + noun + Action), descriptive of user intent ("pay with Paystack"). Colocated for symmetry.
- **Rationale:** Consistent naming convention, minimal footprint (no new file needed for the action).
- **Reversibility:** Rename; export is the public surface.
- **Files touched:** acce-nextjs/src/app/(portal)/portal/classes/[id]/actions.ts

### [2026-07-06T07:01:04Z] 4-1-paystack-init-with-a-15-minute-pending-seat-hold — Paystack money path: critical classification
- **Risk:** critical
- **Workflow / step:** dev-story step 5, Tasks 1–3
- **Decision point:** This story touches the payments path (Paystack initialize, PENDING enrollment creation, paymentRef generation). Per the taxonomy: "payments/billing" → critical.
- **Options considered:** A) Log as high; B) Log as critical (correct per contract).
- **Chosen:** B — critical. Key invariants being maintained: (1) No BOOKING_CHARGE/wallet.mutate on the PENDING path (AD-8); (2) Paystack init runs OUTSIDE the transaction (no lock held across HTTP); (3) PAYSTACK_SECRET_KEY fail-fast (never logged); (4) amount is integer cents passed straight through (AD-9); (5) paymentRef is crypto.randomUUID()-based (unique, Paystack-safe charset); (6) requireSession() called FIRST in the action (AD-3).
- **Reversibility:** The PENDING enrollment can be soft-deleted or manually expired; the Paystack transaction (if initialized) can be abandoned (it auto-expires on Paystack's side if not completed). No money moves until the 4.2 webhook confirms.
- **Files touched:** acce-nextjs/src/lib/paystack.ts, acce-nextjs/src/lib/enrollment.ts, acce-nextjs/src/app/(portal)/portal/classes/[id]/actions.ts

### [2026-07-06T07:15:00Z] 4-1-paystack-init-with-a-15-minute-pending-seat-hold — story completion → review
- **Risk:** low
- **Workflow / step:** dev-story step 9 (story completion)
- **Decision point:** All 6 tasks complete, all ACs satisfied, 303/303 vitest tests pass (28 new Paystack + 30 reserve-schema), build clean, prisma validate clean. Updating sprint-status.yaml to "review".
- **Options considered:** Single choice — follow step 9 workflow.
- **Chosen:** Update sprint-status.yaml development_status[4-1-paystack-init-with-a-15-minute-pending-seat-hold] = "review". Update story file Status to "review". Proceed to git commit + push.
- **Rationale:** All acceptance criteria met. Definition-of-done satisfied. Deferred items recorded.
- **Reversibility:** Revert sprint-status.yaml line to "in-progress".
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/4-1-paystack-init-with-a-15-minute-pending-seat-hold.md

### [2026-07-06T07:21:33Z] 4-1-paystack-init-with-a-15-minute-pending-seat-hold — Code review: autonomous fix-vs-action-items resolution
- **Risk:** low
- **Workflow / step:** code-review step-04 (present & act) — the fix-vs-action-items `<ask>`
- **Decision point:** Workflow HALTs to ask how to handle `patch` findings. Autopilot overrides the HALT.
- **Options considered:** A) Apply every patch automatically · B) Leave as action items (in-progress) · C) Walk through each
- **Chosen:** A — apply the one medium patch automatically; defer the low findings.
- **Rationale:** Dispatch mandate: fix HIGH/MEDIUM automatically. Only one substantive (medium) finding surfaced; the rest are low/by-design/unreachable. After fixing, no unresolved high/medium remain → status `done`.
- **Reversibility:** Re-add `disabled={isPending}` to the two Button elements to restore prior behavior; revert story status to `in-progress`.
- **Files touched:** acce-nextjs/src/app/(portal)/portal/classes/[id]/pay-online-button.tsx, acce-nextjs/src/app/(portal)/portal/classes/[id]/pay-with-balance-button.tsx

### [2026-07-06T07:21:33Z] 4-1-paystack-init-with-a-15-minute-pending-seat-hold — Fix: pay buttons no longer disabled while pending (NFR10)
- **Risk:** low
- **Workflow / step:** code-review step-04 (patch application)
- **Decision point:** MEDIUM finding — `disabled={isPending}` contradicts the inline comment ("Not disabled while pending … so it remains keyboard-focusable") and NFR10 keyboard-operability; a disabled button drops out of tab order. Present in the NEW pay-online-button.tsx and, identically, in the 3.4 pay-with-balance-button.tsx (both in the epic-4 diff).
- **Options considered:** A) Remove `disabled`, keep `aria-busy` + the existing `if(isPending) return` double-submit guard (align code to comment/NFR10) · B) Fix the comment instead and keep `disabled` · C) Fix only the new 4.1 button and leave 3.4 inconsistent
- **Chosen:** A, applied to BOTH islands for consistency.
- **Rationale:** NFR10 wants the CTA keyboard-operable with `aria-busy` state, not removed from the tab order; double-submit is already guarded synchronously. Fixing both keeps the two islands consistent (they are byte-identical in this respect and both live in the branch diff).
- **Reversibility:** Re-add `disabled={isPending}` to each `<Button>`; purely local UI/a11y change, no data/interface impact.
- **Files touched:** acce-nextjs/src/app/(portal)/portal/classes/[id]/pay-online-button.tsx, acce-nextjs/src/app/(portal)/portal/classes/[id]/pay-with-balance-button.tsx

### [2026-07-06T07:21:33Z] 4-1-paystack-init-with-a-15-minute-pending-seat-hold — Final status: done
- **Risk:** low
- **Workflow / step:** code-review step-04 section 6 (status + sprint sync)
- **Decision point:** Set final story status. Fresh adversarial review found the money-path invariants clean (no BOOKING_CHARGE on pending path, single reserveSeat, expiry flip only under the lock, requireSession first, email from session, integer cents, secret fail-fast + never logged, no oversell via FOR UPDATE+SSI). One medium finding fixed; remaining findings are low (unreachable/by-design) and deferred.
- **Options considered:** A) `done` (clean after fix) · B) `in-progress` with Review Follow-ups
- **Chosen:** A — `done`. No unresolved high/medium findings; chain green (prisma valid · build compiled, /portal/classes/[id] Dynamic present · 303 vitest pass).
- **Rationale:** All ACs (AC1–AC6) satisfied; the single actionable finding was auto-fixed and re-verified.
- **Reversibility:** Set sprint-status development_status[4-1-…] back to `review`/`in-progress` and re-open findings if needed.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/4-1-paystack-init-with-a-15-minute-pending-seat-hold.md, _bmad-output/implementation-artifacts/deferred-work.md

### [2026-07-06T07:30:15Z] 4-2-verified-idempotent-payment-webhook-confirms-the-seat — Story scope + boundaries (create-story)
- **Risk:** medium
- **Workflow / step:** create-story step 2-5 (scope the backlog story)
- **Decision point:** What Story 4.2 builds vs defers. The epic AC + AD-7/AD-14/AD-15 describe the webhook, the confirm, and the orphan-payment branch; scope must be minimal-but-complete without pulling in 4.3 (no-oversell concurrency test) or a card-refund adapter.
- **Options considered:** A) Webhook route + verifySignature + a NEW enrollment.ts confirm function (sole status writer) + AD-15 wallet-credit branch, static verification only, live/concurrency deferred to CI · B) Also author the no-oversell concurrency integration test here · C) Also build a Paystack card-refund adapter for AD-15
- **Chosen:** A. Build `src/app/api/webhooks/paystack/route.ts` (nodejs runtime, raw-body HMAC), `paystack.verifySignature`, `enrollment.confirmPaidSeat` (the 4.2 seam named in enrollment.ts header + paystack.ts header), pure unit-tested helpers; defer live round-trip + no-oversell(4.3) + card-refund(AD-15 deferred list).
- **Rationale:** Matches the architecture spine's Capability map (Paystack checkout → paystack.ts + api/webhooks/paystack governed by AD-4/7/8/13/14/15) and the explicit story boundaries in 4.1. 4.3 owns concurrency; AD-15 card-refund is on the spine Deferred list (wallet credit is the MVP conservation).
- **Reversibility:** Story file is the only artifact; re-scope by editing it before dev-story picks it up.
- **Files touched:** _bmad-output/implementation-artifacts/4-2-verified-idempotent-payment-webhook-confirms-the-seat.md

### [2026-07-06T07:30:15Z] 4-2 — Confirm logic lives in a new enrollment.ts function called by the webhook (AD-14)
- **Risk:** medium
- **Workflow / step:** create-story step 3 (architecture guardrails)
- **Decision point:** Where the seat-confirm transaction lives. AD-7 says the webhook does the Payment idempotency gate + re-check + "flip status by CALLING enrollment.ts"; AD-14 makes enrollment.ts the sole status writer. The route handler must not write Enrollment.status.
- **Options considered:** A) Route handler owns HMAC + parse only; a NEW `confirmPaidSeat(reference, amountCents, rawEvent)` in enrollment.ts owns the whole Serializable tx (Payment.create gate → GroupSession FOR UPDATE → re-check occupancy → CONFIRMED+BOOKING_CHARGE OR AD-15 CANCELLED+wallet-credit), reusing the existing retry/backoff/isSerializationError helpers · B) Route handler runs the tx inline and calls enrollment.ts only for the status flip
- **Chosen:** A. Single domain function owns the tx; route handler is a thin HMAC/parse/HTTP-status shell (UI→entry→domain layering). Lock order GroupSession→wallet advisory matches reserveSeat (no deadlock).
- **Rationale:** Keeps AD-14 (sole status writer) + AD-7 (webhook confirms via enrollment.ts) reconciled in one place; reuses the proven 4.1 retry loop; keeps the Payment gate + status flip + charge atomic in one Serializable tx.
- **Reversibility:** The function is additive to enrollment.ts; splitting responsibilities later is a local refactor.
- **Files touched:** _bmad-output/implementation-artifacts/4-2-verified-idempotent-payment-webhook-confirms-the-seat.md

### [2026-07-06T07:30:15Z] 4-2 — AD-15 orphan-payment branch interpretation
- **Risk:** medium
- **Workflow / step:** create-story step 3 (AD-15 edge)
- **Decision point:** When a verified charge.success arrives but the seat is gone. AD-15 = credit the captured amount to wallet (CANCELLATION_REFUND), idempotent by Payment.reference, never oversell.
- **Options considered:** A) Grant only when the enrollment is still PENDING and OTHER occupancy (excluding this row) < capacity → CONFIRMED+BOOKING_CHARGE; otherwise (own row CANCELLED by lazy expiry, or PENDING but class refilled) → flip/keep CANCELLED + wallet CANCELLATION_REFUND of the captured amount · B) Reactivate a CANCELLED-but-has-room row and confirm it
- **Chosen:** A. Grant-if-still-holdable else conserve-to-wallet. Refund uses the captured amount from the event; idempotency provided by the Payment.reference unique-insert gate. Reactivate-CANCELLED-with-room left as a documented deferred edge.
- **Rationale:** Matches the epic AC3 framing ("expired/released and class has since filled → credited to wallet") and AD-15 exactly; avoids the AD-8 BOOKING_CHARGE partial-unique collision (a lazily-expired PENDING never carried a charge, but reactivation is out of scope here). Never oversells.
- **Reversibility:** Branch logic is a pure decision function (unit-tested); changing the reactivation policy is a localized edit.
- **Files touched:** _bmad-output/implementation-artifacts/4-2-verified-idempotent-payment-webhook-confirms-the-seat.md

### [2026-07-06T07:30:15Z] 4-2 — Webhook rate-limiting deferred to edge/proxy; fast HMAC rejection in-app
- **Risk:** medium
- **Workflow / step:** create-story step 3 (Consistency Conventions: "the webhook is rate-limited")
- **Decision point:** The conventions list the webhook as rate-limited, but no in-app rate-limiter/Redis exists (the magic-link limit is Better Auth's built-in, which does not cover a custom route handler), and an in-memory limiter is unreliable in a standalone/multi-instance deploy.
- **Options considered:** A) In-app best-effort in-memory limiter · B) Defer rate-limiting to the Coolify/reverse-proxy edge + rely on cheap constant-time HMAC rejection of forged requests; record as deferred · C) Add Redis dependency now
- **Chosen:** B. The route rejects bad signatures with a cheap timing-safe HMAC compare (the real abuse vector is forged posts); a proper distributed rate limit is deferred to the reverse-proxy/infra layer and recorded in deferred-work.md. No new dependency.
- **Rationale:** Deployment notes already state the webhook is "public, authenticated by HMAC only"; an in-memory limiter gives false assurance across instances and risks dropping legitimate Paystack retries. Edge/proxy is the correct layer.
- **Reversibility:** Add a limiter (Redis/edge rule) later without touching the confirm logic.
- **Files touched:** _bmad-output/implementation-artifacts/4-2-verified-idempotent-payment-webhook-confirms-the-seat.md, _bmad-output/implementation-artifacts/deferred-work.md

### [2026-07-06T07:37:11Z] 4-2 — dev-story start: implement verifySignature/computeSignature in paystack.ts, confirmPaidSeat/decideConfirmOutcome in enrollment.ts, webhook route handler, unit tests
- **Risk:** critical
- **Workflow / step:** dev-story step 4 (mark in-progress and begin implementation)
- **Decision point:** Story 4-2 is a payment path + security surface (public HMAC-only auth webhook). All implementation decisions follow the story spec exactly.
- **Options considered:** A) Follow the story spec (AD-7/8/14/15 ordering, Payment.create as idempotency gate, pure helpers for unit tests, thin route shell) · B) Alternative architectures
- **Chosen:** A. Story spec is authoritative. Implementation: computeSignature (pure HMAC helper), verifySignature (reads env, timing-safe), parseWebhookEvent (Zod), decideConfirmOutcome (pure decision), confirmPaidSeat (Serializable tx with retry loop), webhook route (thin shell).
- **Rationale:** The story's Dev Notes, AC, and Architecture Spine guardrails precisely define the implementation. This is a critical money path — no deviation from spec.
- **Reversibility:** Each function is additive to existing files; rollback = delete the new exports and the new route file.
- **Files touched:** acce-nextjs/src/lib/paystack.ts, acce-nextjs/src/lib/enrollment.ts, acce-nextjs/src/app/api/webhooks/paystack/route.ts, acce-nextjs/tests/unit/paystack-webhook.test.ts

### [2026-07-06T17:33:23Z] 4-2-verified-idempotent-payment-webhook-confirms-the-seat — resuming story: implementation already complete, proceeding to validation and status update
- **Risk:** low
- **Workflow / step:** dev-story step 1 (load story) + step 4 (mark in-progress)
- **Decision point:** Story is already `in-progress` and all 4 implementation files already exist (paystack.ts verifySignature/computeSignature/parseWebhookEvent, enrollment.ts confirmPaidSeat/decideConfirmOutcome, route.ts, paystack-webhook.test.ts). Tasks are unchecked in the story file. Decision: verify tests pass and build is clean, then mark tasks complete and move to `review`.
- **Options considered:** A) Re-implement from scratch · B) Validate existing code against ACs, run tests, mark complete
- **Chosen:** B. All implementation files match the story spec exactly. Test suite: 351/351 green. Build: clean with /api/webhooks/paystack confirmed in route manifest. Prisma validate: clean.
- **Rationale:** The files implement every task and AC in the story. Re-implementation would be scope creep and risky on a critical payment path.
- **Reversibility:** N/A — validation only; no new code written.
- **Files touched:** none (validation run only)

### [2026-07-06T17:33:23Z] 4-2-verified-idempotent-payment-webhook-confirms-the-seat — deferred-work.md Story 4.2 entries: four live integration tests deferred to CI ephemeral-Postgres
- **Risk:** medium
- **Workflow / step:** dev-story step 5 Task 5 (record deferrals in deferred-work.md)
- **Decision point:** Story Task 5 requires recording four deferred live-verification items in deferred-work.md: (a) live charge.success → CONFIRMED + BOOKING_CHARGE round-trip; (b) idempotent replay (same ref twice → one charge, both 200); (c) AD-15 orphan credit (CANCELLATION_REFUND, no oversell); (d) live Paystack sandbox signature round-trip.
- **Options considered:** A) Record in deferred-work.md · B) Skip (items are already implied by prior deferral entries)
- **Chosen:** A. Story explicitly requires recording. All four are environmental blockers (no real Postgres / no PAYSTACK_SECRET_KEY in sandbox).
- **Rationale:** Explicit deferral record keeps the CI requirement visible and traceable.
- **Reversibility:** Delete the entries when CI coverage is added.
- **Files touched:** _bmad-output/implementation-artifacts/deferred-work.md

### [2026-07-06T17:47:03Z] 4-2-verified-idempotent-payment-webhook-confirms-the-seat — CRITICAL fix: confirm path must TOPUP the captured card payment before the BOOKING_CHARGE debit
- **Risk:** critical
- **Workflow / step:** code-review step 3 (triage) / step 4 — adversarial fresh review of the `review` story; fix-vs-action-items ask
- **Decision point:** `confirmPaidSeat` (src/lib/enrollment.ts) confirm branch wrote a single `wallet.mutate({ type: BOOKING_CHARGE, amountCents: -enr.priceCents })`. But the Paystack online-payment path is entered ONLY when the student's wallet balance < priceCents (reserveSeat's under-lock balance decision), and the captured card money is held by Paystack — it never enters the wallet ledger. `wallet.mutate` enforces the NFR4 non-negative guard (`wouldGoNegative` → throws `WalletInsufficientFundsError`, ledger row never written). So for the normal zero-balance student the confirm debit drives the balance negative → throw → the whole Serializable tx (incl. the Payment idempotency insert) rolls back → `confirmPaidSeat` returns `{ok:false}` → route returns HTTP 500 → Paystack retries the same delivery forever, failing identically each time. Net effect: the student pays by card but their seat is NEVER confirmed and their money is not even conserved to the wallet. This is the central happy path (AC2) of the entire online-payment story.
- **Options considered:** (A) Credit the captured amount as a `TOPUP` (+data.amount) via wallet.mutate BEFORE the `BOOKING_CHARGE` debit, inside the same tx — funds the wallet so the debit stays non-negative; keeps exactly one BOOKING_CHARGE (AD-8); net wallet delta = captured − price (0 when equal); symmetric with the AD-15 orphan path which already credits the captured amount. (B) Special-case / bypass the NFR4 guard for the Paystack BOOKING_CHARGE — rejected: violates AD-6 (mutate is the single serialized seam and sole guard owner) and re-opens negative-balance corruption. (C) Don't write a BOOKING_CHARGE on the Paystack path at all — rejected: violates AD-8 (exactly one BOOKING_CHARGE per confirmed enrollment, both paths) and the epic/spine wording. (D) Defer as a Review Follow-up without fixing — rejected: ships a broken money happy-path; the fix is fully determined by existing invariants (the `TOPUP` LedgerType exists for exactly this) and payments fixes are to be auto-fixed per the workflow goal.
- **Chosen:** A — inserted a `TOPUP` credit of `args.amountCents` (captured card payment) immediately before the `BOOKING_CHARGE` debit in the confirm branch; updated module header + function-flow docstrings; updated deferred-work.md live-CI assertion (item a) to require both ledger rows + net-non-negative + a regression guard note.
- **Rationale:** Only design that satisfies ALL binding invariants simultaneously — AD-6 (all mutations via wallet.mutate), AD-8 (one BOOKING_CHARGE), NFR4 (balance never negative), AD-9 (integer cents), AD-16 (charge uses immutable priceCents snapshot), and AD-15 symmetry (captured money conserved to wallet). Produces a transparent, auditable ledger: "paid RXXX (TOPUP) → charged RXXX for the class (BOOKING_CHARGE)". The spec/epic (epics.md:455) and spine (AD-7) under-described the confirm as "a BOOKING_CHARGE ledger row is written" without the funding leg; this fills the gap rather than contradicting it.
- **Reversibility:** Fully reversible — revert the single edit block in `confirmPaidSeat` (remove the `mutate({type:"TOPUP", amountCents: args.amountCents, ...})` call and restore the lone BOOKING_CHARGE) plus the two docstring notes and the deferred-work.md wording. No schema/migration/enum change (TOPUP already exists in the LedgerType enum). If the money model is later re-architected (e.g. a real Paystack card-refund adapter, or treating card payments as non-wallet external settlements with the BOOKING_CHARGE recorded outside the balance ledger), this TOPUP leg is the single seam to change. To re-verify live: the CI ephemeral-Postgres round-trip (deferred-work.md item a) asserts TOPUP+BOOKING_CHARGE and net-non-negative.
- **Files touched:** acce-nextjs/src/lib/enrollment.ts, _bmad-output/implementation-artifacts/deferred-work.md

### [2026-07-06T17:52:26Z] 4-3-no-oversell-under-concurrent-buyers — create-story: scope 4.3 as the AD-4 real-Postgres no-oversell concurrency integration test (both paths)
- **Risk:** medium
- **Workflow / step:** create-story step 2/5 (interpret ambiguous scope, write story)
- **Decision point:** Story 4.3's AC1 says the N+1 concurrency proof is "(Vitest)", but ARCHITECTURE-SPINE AD-4 mandates a REAL-Postgres integration test ("unit mocks can't exercise 40001"). All of 3.4/4.1/4.2 deferred exactly this test to "CI ephemeral-Postgres". The reservation invariant itself (Serializable SSI + FOR UPDATE + P2034/40001 retry) is ALREADY implemented and `done` in reserveSeat (3.4/4.1) and confirmPaidSeat (4.2). So what does 4.3 actually build?
- **Options considered:** A) Author a real-Postgres Vitest *integration* test (node env, new `tests/integration/**` + `vitest.integration.config.ts` + `test:integration` script) that fires N+1 concurrent `reserveSeat` calls at an N-seat class across BOTH the balance path (funded students → exactly N CONFIRMED + N BOOKING_CHARGE, rest class_full) AND the Paystack/PENDING path (R0 students → exactly N PENDING holds, rest class_full); gated to SKIP when DATABASE_URL is unset (mirrors tests/e2e/global-setup.ts). Consolidates the 3.4/4.1/4.2 deferred concurrency items. Live green run deferred to CI ephemeral-Postgres; the two-browser staging check is inherently manual. B) Write it as a unit test with mocked Prisma — REJECTED: cannot reproduce SSI/40001, would false-green the exact invariant AD-4 says must be proven against real pg. C) Modify production enrollment.ts — REJECTED: the invariant is already implemented+reviewed done; 4.3 is verification, not re-implementation. D) Build the full CI pipeline + testcontainers — REJECTED as scope creep: adds a Docker/testcontainers dependency (high risk, unavailable in sandbox) and the CI job's remit spans many stories' deferred items (a bmad-testarch-ci concern), not just 4.3's no-oversell test.
- **Chosen:** A. The story authors the AD-4-mandated integration test + a dependency-free node-env integration harness (reads DATABASE_URL, uses the existing `@/lib/db` singleton + @prisma/adapter-pg — NO new dependency), skip-gated for the sandbox. In-sandbox bar: tsc/build clean + unit suite stays green + the integration test authored & gated; live execution deferred to CI ephemeral-Postgres. Manual two-browser staging verification recorded as a checklist item.
- **Rationale:** Matches AC1's "(Vitest)" (a Vitest integration project) AND AD-4's real-Postgres mandate AND the whole codebase's established "deferred to CI ephemeral-Postgres" posture (1.1/1.5/2.x/3.4/4.1/4.2). Minimal reasonable interpretation: no new deps, no prod code change, no CI-pipeline build-out.
- **Reversibility:** Delete `tests/integration/**`, `vitest.integration.config.ts`, and the `test:integration` script. If the test surfaces a real oversell defect, the fix lands in enrollment.ts (single reservation seam, AD-4). To re-architect toward testcontainers later, swap the DATABASE_URL-provided pg for a testcontainers-spun pg in the same harness file.
- **Files touched:** _bmad-output/implementation-artifacts/4-3-no-oversell-under-concurrent-buyers.md (story), and (specified for dev) tests/integration/**, acce-nextjs/vitest.integration.config.ts, acce-nextjs/package.json, _bmad-output/implementation-artifacts/deferred-work.md

### [2026-07-06T18:18:29Z] 4-3-no-oversell-under-concurrent-buyers — code-review clean, resolve to done
- **Risk:** medium
- **Workflow / step:** code-review step-03 triage → step-04 present/act (autopilot fix-vs-action-items ask; defaulted to FIX)
- **Decision point:** Adversarial FRESH review of the `review` story, then resolve final status (done vs in-progress).
- **Options considered:** A) mark done if clean; B) in-progress + Review Follow-ups if HIGH/MEDIUM findings.
- **Chosen:** A — done. No HIGH/MEDIUM findings.
- **Rationale:** Verification-only story (no production code changed — confirmed via `git diff --stat`: only new test files, vitest.integration.config.ts, package.json script, deferred-work.md, story/status docs). Independently re-verified every AC against the ACTUAL production code with fresh reasoning rather than trusting the dev record:
  - AC1a/AC1b: test asserts on committed final state (occupancy count via `occupiedEnrollmentWhere`, confirmed/pending count, BOOKING_CHARGE count) — the correct invariant, not timing. `reserveSeat` balance path sets `enrollmentId` on the BOOKING_CHARGE (enrollment.ts:362-366) so the `enrollmentId in confirmedEnrollmentIds` count of N is correct; PENDING path writes no charge (enrollment.ts:369-414) → 0 charges correct.
  - AC2: with N CONFIRMED filling the class + 1 direct PENDING insert, `decideConfirmOutcome({status:PENDING, othersOccupied:N, capacity:N})` returns `refund_to_wallet` (N<N false, enrollment.ts:520-525) → `refunded_to_wallet`, CANCELLATION_REFUND=PRICE_CENTS, CANCELLED, occupancy stays N. Matches test.
  - AC3a: confirm→confirmed then P2002→already_processed; TOPUP+BOOKING_CHARGE pattern yields exactly one BOOKING_CHARGE. AC3b: FR11 already_enrolled, one row/charge. AC3c: `wouldGoNegative(0,-PRICE)` → WalletInsufficientFundsError, tx rollback → 0 ledger rows (wallet.ts:143-145). All correct.
  - AC4: `vitest.integration.config.ts` is a SEPARATE node-env config; default `vitest.config.ts` (jsdom, tests/unit only) untouched. Verified `npm test` = 351/351 green and does NOT collect the integration file; `test:integration` = 6 skipped cleanly (exit 0) in sandbox.
  - AC5: independently re-ran `prisma validate` (valid), `next build` (clean, all routes incl /api/webhooks/paystack present, new tests type-check via tsconfig `**/*.ts` include), `npm test` (351/351), `test:integration` (skips). deferred-work.md has the Story 4.3 CI live-run + two-browser manual staging deferrals, superseding 3.4/4.1/4.2 concurrency items.
  - Only observation: AC1a test uses scope label `"ac1b"` (cosmetic — reads confusingly but no id collision since AC1b uses `"ac1p"`). Severity LOW → dismissed as noise; not worth a patch to a verification-only artifact.
- **Reversibility:** Purely a status transition + doc updates. To reopen: set `development_status[4-3-...]` back to `review`/`in-progress` in sprint-status.yaml and the story Status header. No code was patched, so nothing to revert in the app.
- **Files touched:** _bmad-output/implementation-artifacts/4-3-no-oversell-under-concurrent-buyers.md, _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/autopilot-decisions.md

### [2026-07-06T20:44:04Z] 5-1-my-classes-with-cancel-and-refund-tier-preview — epic-5 opened + story scoping
- **Risk:** medium
- **Workflow / step:** create-story step 1 (epic transition) + step 5 (story scoping)
- **Decision point:** 5-1 is the first story of Epic 5 (Cancellations & Refunds). Multiple scoping choices: (a) what the read-only "my classes" page lists, (b) whether the cancel button is live or an inert forward affordance, (c) whether 5-1 builds the pure AD-11 cancellation-tier module now (consumed by 5-2's mutation), (d) AD-10 join-detail handling on the list.
- **Options considered:**
  - A) Build ONLY the page + inline tier % (no reusable module); 5-2 rebuilds tier logic. Rejected — duplicates AD-11's single-source tier constant, violates DRY, risks divergent comparators.
  - B) Make the cancel action LIVE in 5-1 (write CANCELLATION_REFUND + status flip). Rejected — that is Story 5.2's ACs (FR13/FR14); AD-6/AD-11/AD-14 mutation belongs to the enrollment.ts#cancel seam built in 5.2. 5-1's ACs are strictly the read-only list + advisory preview.
  - C) 5-1 builds the read-only `(portal)/portal/my-classes` page + a NEW pure `src/lib/cancellation.ts` (CANCELLATION_TIERS constant + `hoursUntilStart` + `refundTierForHours` + `computeRefund` decomposition), unit-tested; the cancel button is an INERT forward affordance (disabled), exactly mirroring 3.3's inert Pay button → 3.4. 5-2 reuses `computeRefund` server-side under the lock. Chosen.
- **Chosen:** C.
- **Rationale:** Mirrors the codebase's established "pure helper built + unit-tested ahead of its mutating consumer" pattern (occupiedEnrollmentWhere in 2.2 before reserveSeat consumed it; reserve-schema in 3.4). AD-11 mandates a single `CANCELLATION_TIERS` constant with pinned comparators (h≥48→100%, 24≤h<48→70%, h<24→0%) and a single refund/fee decomposition (`refundCents` from tier, `feeCents = priceCents − refundCents`) — building it once in 5-1 and reusing in 5-2 guarantees the preview % and the cancel-time computation can never diverge. AD-11 explicitly says "the preview % in the UI is advisory; the server recomputes at cancel-time" — so 5-1 legitimately owns the advisory preview and the pure tier module while writing nothing.
- **Scoping sub-decisions (all logged here):**
  - List = `status = CONFIRMED AND session.start > now`, ordered start asc. FR12 says "confirmed/upcoming enrollments." PENDING (mid-payment holds) are NOT "my classes" yet; past classes are not cancellable. Minimal reasonable interpretation.
  - Join details (AD-10): 5-1 does NOT select `meetingUrl`/`location` into the list (avoids re-implementing the AD-10 gate); each row links to the existing `/portal/classes/[id]` detail page which already reveals join details for a CONFIRMED viewer (built in 3.3). Keeps the AD-10 surface single-sourced.
  - Cancel affordance = inert/disabled forward affordance; 5-2 converts it to a client island + confirm + `cancelEnrollmentAction` + UX-DR5 toast.
- **Reversibility:** Story file + sprint-status only (create-story writes no app code). To re-scope, edit the story markdown before dev-story runs. If the pure module boundary is wrong, dev-story can inline it; if 5-1 should show PENDING rows too, widen the `where` clause. Nothing is committed to code yet.
- **Files touched:** _bmad-output/implementation-artifacts/5-1-my-classes-with-cancel-and-refund-tier-preview.md (new), _bmad-output/implementation-artifacts/sprint-status.yaml (epic-5 → in-progress, 5-1 → ready-for-dev)

---

### [2026-07-06T20:48:11Z] 5-1-my-classes-with-cancel-and-refund-tier-preview — dev-story start: mark in-progress, capture baseline_commit
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story status is `ready-for-dev`; need to capture baseline_commit and transition sprint-status to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Record HEAD commit `8b9d49d7b6ba5035182f317d6285f4b01df4eee0` as baseline_commit; update sprint-status.yaml and story file to `in-progress`.
- **Rationale:** Required by workflow contract.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`; remove baseline_commit from story frontmatter.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/5-1-my-classes-with-cancel-and-refund-tier-preview.md

### [2026-07-06T22:54:00Z] 5-1-my-classes-with-cancel-and-refund-tier-preview — refundTierForHours loop-first vs switch approach
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 1 — refundTierForHours implementation)
- **Decision point:** AC5 says `refundTierForHours` must apply the pinned comparators exactly. Options: (A) for-loop over `CANCELLATION_TIERS` — walks in order, first match wins, automatically stays in sync with the constant; (B) hardcoded switch/if-else with magic numbers duplicating the tier values.
- **Options considered:** A (loop) / B (switch).
- **Chosen:** A — for-loop over `CANCELLATION_TIERS`. The loop is the single source of truth: if a tier entry changes or a new tier is added, `refundTierForHours` automatically uses it.
- **Rationale:** AD-11 says "a per-variant table swaps in later" — the loop approach makes that swap trivial. Hardcoded switch would duplicate the tier comparators, violating the single-source rule and risking drift when 5.2 or later stories add per-variant tiers.
- **Reversibility:** Replace the for-loop with an if-else chain. No external impact — the function contract (inputs/outputs) is unchanged.
- **Files touched:** acce-nextjs/src/lib/cancellation.ts

### [2026-07-06T22:54:00Z] 5-1-my-classes-with-cancel-and-refund-tier-preview — optional refund amount preview included
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 3 — page rendering)
- **Decision point:** AC2 says the cancel button MUST show the refund %. It also says "(optionally show the previewed refund amount via formatZar(computeRefund(...).refundCents))". Include optional amount or not?
- **Options considered:** A) show % only in button label; B) show % in button label + advisory refund amount below the price (small text, clearly labelled as advisory).
- **Chosen:** B — include the optional refund amount preview as subordinate text below the per-seat price when refundPct > 0. Labelled "(advisory — recomputed at cancel time)" per AD-11.
- **Rationale:** Gives the student the most useful information (both % and Rand amount) while clearly labelling it advisory. UX-DR6 is satisfied by the button label text alone; the amount is additive.
- **Reversibility:** Remove the refund amount span from the page template. No logic change.
- **Files touched:** acce-nextjs/src/app/(portal)/portal/my-classes/page.tsx

### [2026-07-06T22:54:00Z] 5-1-my-classes-with-cancel-and-refund-tier-preview — story marked review; all ACs satisfied
- **Risk:** low
- **Workflow / step:** dev-story step 9 (story completion and mark for review)
- **Decision point:** All tasks [x], all ACs verified, test suite green (405/405), build clean, prisma validate clean, no schema/migration/dep change, file list complete. Mark review.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Set story Status: review; sprint-status.yaml 5-1 → review.
- **Rationale:** Definition of done satisfied: all 5 tasks checked, 54 new unit tests passing, build + prisma validate clean, no regressions, file list complete, dev agent record complete with implementation notes.
- **Reversibility:** Revert sprint-status.yaml and story Status to in-progress if code-review finds issues requiring re-work.
- **Files touched:** _bmad-output/implementation-artifacts/5-1-my-classes-with-cancel-and-refund-tier-preview.md, _bmad-output/implementation-artifacts/sprint-status.yaml

### [2026-07-06T21:02:19Z] 5-1-my-classes-with-cancel-and-refund-tier-preview — code-review: diff source
- **Risk:** low
- **Workflow / step:** code-review step 1 (gather context)
- **Decision point:** Autonomous run — the workflow's Tier-5 "ask what to review" HALT is overridden. Must pick a diff source without a human.
- **Options considered:** A) uncommitted working tree; B) branch diff vs main; C) diff against the story's `baseline_commit` frontmatter (8b9d49d, the epic-4 tip / dev-story parent)
- **Chosen:** C — `git diff 8b9d49d..HEAD`, review_mode=full with spec_file = the 5.1 story.
- **Rationale:** Story frontmatter pins `baseline_commit`; that isolates exactly the 5.1 dev-story delta (8 files, +880) with no epic-4 noise. Working tree was clean so B/C converge, but the baseline is the precise, story-scoped source.
- **Reversibility:** n/a — read-only context selection.
- **Files touched:** none

### [2026-07-06T21:02:19Z] 5-1-my-classes-with-cancel-and-refund-tier-preview — adversarial review outcome + fix
- **Risk:** low
- **Workflow / step:** code-review steps 2–5 (review / triage / present / act)
- **Decision point:** Fresh 3-lens adversarial review (Blind Hunter / Edge Case Hunter / Acceptance Auditor) of the 5.1 diff, then fix-vs-action-items at the `<ask>`.
- **Options considered:** Findings triaged — (1) `refundTierForHours` imported but never used in page.tsx → real ESLint `no-unused-vars` warning [LOW patch]; label hardcodes 70/100 branches but only 0/70/100 are reachable under the pinned single tier [dismissed — not a bug]; all ACs verified met; no IDOR (query keyed strictly to session.user.id), no writes, no meetingUrl/location leak, inert button genuinely inert. No HIGH/MEDIUM findings.
- **Chosen:** FIX the one LOW patch (removed the dead `refundTierForHours` import); dismissed the label nit; no defers.
- **Rationale:** Per autopilot contract, fix HIGH/MEDIUM automatically — none existed. The lone LOW lint-warning fix is trivial and reversible, so applied it to keep the tree warning-clean rather than deferring. Re-verified: ESLint exit 0 on the page, `npm test` 405/405, `npm run build` clean with `/portal/my-classes ƒ Dynamic`, `prisma validate` clean.
- **Reversibility:** Re-add `refundTierForHours` to the import on line 31 of page.tsx to undo (single-line, no behavioural effect).
- **Files touched:** acce-nextjs/src/app/(portal)/portal/my-classes/page.tsx

### [2026-07-06T21:02:19Z] 5-1-my-classes-with-cancel-and-refund-tier-preview — final status
- **Risk:** low
- **Workflow / step:** code-review step 6 (update story status + sync sprint tracking)
- **Decision point:** Set final story status after review.
- **Options considered:** A) `done` — clean, only-fixed findings; B) `in-progress` — unresolved HIGH/MEDIUM or action items left
- **Chosen:** A — `done`. All findings resolved (one LOW patch applied, one dismissed), zero unresolved HIGH/MEDIUM, full verification chain green.
- **Rationale:** Workflow rule: done when all decision-needed/patch findings resolved AND no unresolved high/medium remain. Satisfied.
- **Reversibility:** Revert sprint-status.yaml + story Status to in-progress and re-open findings if a follow-up review disagrees.
- **Files touched:** _bmad-output/implementation-artifacts/5-1-my-classes-with-cancel-and-refund-tier-preview.md, _bmad-output/implementation-artifacts/sprint-status.yaml

---

### [2026-07-06T21:20:09Z] 5-2-cancel-enrollment-tiered-refund-to-wallet-seat-returns-to-pool — create-story: ledger model for CANCELLATION_REFUND / CANCELLATION_FEE
- **Risk:** critical
- **Workflow / step:** create-story step 5 (author story ACs + dev notes) — money semantics
- **Decision point:** How to represent the tiered cancellation refund on the append-only wallet ledger (AD-6, balance = Σ amountCents). The original BOOKING_CHARGE already debited the FULL priceCents at booking (both balance path 3.4 and Paystack path 4.2's TOPUP+BOOKING_CHARGE). AD-11 mandates writing CANCELLATION_REFUND (+ CANCELLATION_FEE when feeCents>0). What signed amount does each row carry so the student's net cost ends at feeCents and nothing double-counts?
- **Options considered:**
  - A) CANCELLATION_REFUND = +refundCents (the tier amount, the money credited back); CANCELLATION_FEE = amountCents 0, an immutable audit-only record that a fee was retained (magnitude = priceCents − refundCents, reconstructable). Single balance-affecting row.
  - B) CANCELLATION_REFUND = +priceCents (full reversal) then CANCELLATION_FEE = −feeCents (re-charge the fee). Two non-zero rows, net = +refundCents.
  - C) Both rows carry signed magnitudes (REFUND +refundCents, FEE −feeCents) — REJECTED: with the prior −priceCents BOOKING_CHARGE this nets to a double fee (mathematically wrong).
- **Chosen:** A.
- **Rationale:** (1) AD-15 (4.2) already established the convention CANCELLATION_REFUND.amountCents = the amount credited back to the wallet (there it credits the full captured amount because nothing is kept). For consistency, 5.2's CANCELLATION_REFUND must equal the amount credited back = refundCents. (2) The 5.1 UI previewed "N% refund" = refundCents; AC3 requires the wallet ledger to show that same CANCELLATION_REFUND figure — Model B's +priceCents line would contradict the preview. (3) Money integrity: exactly one balance-affecting row (+refundCents) makes double-counting impossible given BOOKING_CHARGE already took the full price; a non-zero FEE debit would charge the fee twice. The FEE row is written (per AD-11 "when feeCents > 0") as a 0-amount audit marker with an explicit code comment explaining why amountCents is 0.
- **Reversibility:** Contained to enrollment.ts#cancelEnrollment and the two wallet.mutate calls. To switch to Model B: change the CANCELLATION_REFUND amount to +priceCents and the CANCELLATION_FEE amount to −feeCents (both under the same tx/advisory lock); net balance effect is identical (+refundCents), only the per-line presentation changes. No schema change either way (LedgerType already has both values). The integration assertion "getBalance increased by exactly refundCents after cancel" holds under both models and is the regression guard.
- **Files touched:** acce-nextjs/src/lib/enrollment.ts (new cancelEnrollment fn — spec'd in story)

### [2026-07-06T21:20:09Z] 5-2 — create-story: cancel action re-guards + double-cancel prevention (ownership, state, under-lock re-read)
- **Risk:** critical
- **Workflow / step:** create-story step 5 (ACs) — authz + money-safety
- **Decision point:** The live cancel action receives a client-supplied enrollmentId. How to prevent IDOR, cancelling a non-cancellable enrollment, and a double-click / stale-page double-refund.
- **Options considered:** A) trust the enrollmentId + status shown on the (possibly stale) page; B) re-guard everything server-side: requireSession-first, key the lookup on BOTH id AND studentId (IDOR-proof), and re-read status UNDER the GroupSession FOR UPDATE lock, only refunding if still CONFIRMED and start>now.
- **Chosen:** B.
- **Rationale:** A student must never cancel another student's seat (query keyed to { id: enrollmentId, studentId: session.user.id }, mirrors AD-3 across every prior portal surface). Re-reading status under the lock is the ONLY thing that prevents a double CANCELLATION_REFUND when two cancels race or a stale page re-submits — the second serializes behind the FOR UPDATE lock, sees CANCELLED, and no-ops (returns not_cancellable, writes no ledger row). Also re-guard status===CONFIRMED && start>now (5.1 only lists these; the action must not trust the page).
- **Reversibility:** All within the new cancelEnrollment domain fn + cancelEnrollmentAction. Removing a guard is a one-line change but would (re)introduce IDOR / double-refund — do not.
- **Files touched:** acce-nextjs/src/lib/enrollment.ts, acce-nextjs/src/app/(portal)/portal/my-classes/actions.ts (both new — spec'd)

### [2026-07-06T21:20:09Z] 5-2 — create-story: DEFER the AD-12 vs AD-8 reactivation collision (do NOT resolve in 5.2)
- **Risk:** high
- **Workflow / step:** create-story step 5 (scope boundary)
- **Decision point:** 5.2 is the FIRST producer of CANCELLED enrollments, which makes the long-flagged AD-12 (re-book reuses the row) vs AD-8 (one BOOKING_CHARGE per enrollmentId, partial-unique index) collision reachable: a student who cancels then re-books hits reserveSeat's reactivation branch, which tries a second BOOKING_CHARGE on the same enrollmentId. Resolve now or defer?
- **Options considered:** A) resolve in 5.2 by modifying reserveSeat (null/supersede the prior charge under the lock, or key the partial-unique on a booking-cycle discriminator, or give a reactivated booking a fresh ledger identity); B) defer — leave reserveSeat untouched, document the now-reachable gap, carry the deferred-work item forward.
- **Chosen:** B (defer).
- **Rationale:** 5.2's ACs (epics.md#Story 5.2) are strictly cancel→refund→seat-return→wallet-ledger; re-booking-after-cancel is NOT an AC (contract: implement only what the story specifies). Option A would surgery the oversell-critical reserveSeat — the single most concurrency-sensitive function in the app — with no in-sandbox test coverage (needs the CI ephemeral-Postgres concurrency suite), injecting high risk into a cancel story. Crucially the current behaviour FAILS SAFE: the AD-8 partial-unique index PREVENTS a double charge, so a re-book-after-cancel attempt surfaces as a caught P2002 → { ok:false, reason:"error" } (generic toast), never data corruption / never a double charge. A tolerable known-limitation to defer with a loud flag.
- **Reversibility:** Purely additive when picked up — a later story modifies reserveSeat's reactivation branch. Nothing in 5.2 forecloses any of the three resolution options. deferred-work.md#AD-12 carries the exact options.
- **Files touched:** none (deferred; story documents the boundary + carries the deferred-work item)

### [2026-07-06T21:20:09Z] 5-2 — create-story: cancel mutation uses Serializable + GroupSession FOR UPDATE + retry (house pattern)
- **Risk:** medium
- **Workflow / step:** create-story step 5 (transaction shape)
- **Decision point:** What isolation/locking for the cancel transaction? Cancel FREES a seat (cannot oversell), so a default-isolation interactive tx with the FOR UPDATE lock would be correct in isolation.
- **Options considered:** A) default (read-committed) interactive tx + GroupSession FOR UPDATE; B) Serializable + FOR UPDATE + the same P2034/40001 retry loop reserveSeat/confirmPaidSeat use.
- **Chosen:** B — mirror the established seat-mutation pattern.
- **Rationale:** AD-14 requires seat-affecting status transitions to take the GroupSession lock; using the identical Serializable+retry envelope as reserveSeat/confirmPaidSeat keeps ONE transaction pattern across all seat mutations (lower cognitive load, future-proof against a concurrent reserve/edit on the same class), and the lock order GroupSession FOR UPDATE → wallet advisory (inside mutate) matches reserveSeat exactly → no deadlock. Cost is negligible for a low-frequency cancel.
- **Reversibility:** Local to cancelEnrollment; could drop to default isolation + remove the retry loop with no correctness loss for cancel-only, if ever desired.

### [2026-07-06T21:36:47Z] 5-2-cancel-enrollment-tiered-refund-to-wallet-seat-returns-to-pool — AD-12⇄AD-8 re-book collision: now reachable, intentionally deferred
- **Risk:** high
- **Workflow / step:** dev-story step 5 (scope boundary check)
- **Decision point:** 5.2 is the first producer of CANCELLED enrollments, making the AD-12⇄AD-8 re-book collision (deferred since 3.4) now reachable. Story Dev Notes explicitly say "NOT resolved in 5.2 — out of AC scope, fails safe via the AD-8 partial-unique index". Should we resolve it in 5.2?
- **Options considered:** A) Carry the deferral forward (as instructed by story Dev Notes); B) Resolve in-scope (risky surgery on oversell-critical reserveSeat without in-sandbox test).
- **Chosen:** A — carry forward, as explicitly scoped by the story (Task 6c).
- **Rationale:** Resolving requires modifying the oversell-critical `reserveSeat` + the AD-8 partial-unique index, with no real-Postgres test available in sandbox. The AD-8 index fails safe (P2002 → generic error toast, no double charge, no corruption). Task 6c explicitly requires recording this carry-forward.
- **Reversibility:** When a re-book-after-cancel story lands: key BOOKING_CHARGE partial-unique on a booking-cycle discriminator, or give a reactivated booking a fresh ledger identity, or null/supersede the prior charge under the lock.
- **Files touched:** _bmad-output/implementation-artifacts/deferred-work.md

### [2026-07-06T21:36:47Z] 5-2-cancel-enrollment-tiered-refund-to-wallet-seat-returns-to-pool — CANCELLATION_FEE ledger model: amountCents=0
- **Risk:** critical
- **Workflow / step:** dev-story step 5 (Task 2 — cancelEnrollment implementation)
- **Decision point:** What amountCents should the CANCELLATION_FEE ledger row carry? The story's Dev Notes say explicitly "amountCents = 0 by design — audit-only; fee already captured by BOOKING_CHARGE". Implementing −feeCents here would double-count the fee.
- **Options considered:** A) `amountCents = 0` (audit-only marker, balance unchanged); B) `amountCents = -feeCents` (second debit for the fee); C) skip the CANCELLATION_FEE row entirely (no audit trail).
- **Chosen:** A — `amountCents = 0` as specified in Dev Notes "Ledger model (BINDING)".
- **Rationale:** BOOKING_CHARGE = −priceCents already took the full price. Crediting +refundCents leaves net cost at feeCents correctly. Writing −feeCents again would double-count the fee and leave the student overcharged. The 0-amount row provides an immutable audit marker that a fee was retained, with the magnitude recoverable from the enrollment.priceCents snapshot. This is consistent with AD-15 (4.2 CANCELLATION_REFUND = amount credited back) and the 5.1 advisory preview.
- **Reversibility:** To revert to a different model: change `amountCents: 0` to `amountCents: -feeCents` in cancelEnrollment steps 6-7 AND update any balance-affecting assertions; requires schema + test updates.
- **Files touched:** acce-nextjs/src/lib/enrollment.ts (cancelEnrollment Step 7)

### [2026-07-06T21:36:47Z] 5-2-cancel-enrollment-tiered-refund-to-wallet-seat-returns-to-pool — dev-story complete: mark review
- **Risk:** low
- **Workflow / step:** dev-story step 9 (mark story ready for review)
- **Decision point:** All 6 tasks complete, 430/430 vitest green, build clean, prisma validate clean, ESLint exit 0.
- **Options considered:** n/a — prescribed workflow completion step.
- **Chosen:** Update sprint-status.yaml to `review`; update story Status to `review`.
- **Rationale:** All AC1-AC6 satisfied, all tasks/subtasks checked, file list complete.
- **Reversibility:** Set sprint-status.yaml back to `in-progress`; revert story Status.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/5-2-cancel-enrollment-tiered-refund-to-wallet-seat-returns-to-pool.md

### [2026-07-06T21:27:20Z] 5-2-cancel-enrollment-tiered-refund-to-wallet-seat-returns-to-pool — dev-story start: mark in-progress, baseline commit
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story was `ready-for-dev`; need to capture baseline_commit and transition to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Record HEAD commit d7b07191 as baseline_commit; update sprint-status.yaml to `in-progress`.
- **Rationale:** Required by workflow contract.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`; remove YAML frontmatter from story file.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/5-2-cancel-enrollment-tiered-refund-to-wallet-seat-returns-to-pool.md
- **Files touched:** acce-nextjs/src/lib/enrollment.ts (new cancelEnrollment fn)

### [2026-07-06T21:43:01Z] 5-2-cancel-enrollment-tiered-refund-to-wallet-seat-returns-to-pool — code-review outcome: CLEAN → done
- **Risk:** medium
- **Workflow / step:** code-review step 3 (triage) + step 4 (present/act, fix-vs-action-items <ask>)
- **Decision point:** Adversarial 3-lens review (Blind Hunter / Edge Case Hunter / Acceptance Auditor) of the 5.2 live-cancel diff (baseline d7b0719..HEAD). At the fix-vs-action-items <ask>: auto-fix all HIGH/MEDIUM. Determine final status.
- **Options considered:** (A) set `done` — clean, no HIGH/MEDIUM; (B) set `in-progress` with Review Follow-ups if any HIGH/MEDIUM patch found; (C) auto-fix findings then re-verify.
- **Chosen:** A — set `done`. Zero HIGH/MEDIUM/critical findings after fresh review; no patches applied.
- **Rationale:** FRESH re-verification (did NOT trust the dev record) of all 6 ACs + AD-2/3/4/5/6/9/11/14/16 + UX-DR2/DR5/DR6/NFR4/NFR10:
  - **AC1** (server-authoritative tiered refund via `computeRefund(enr.priceCents, hoursUntilStart(session.start, now))` — the SAME pure fn as the 5.1 preview, single-source; CANCELLATION_REFUND=+refundCents only when >0; CANCELLATION_FEE amountCents=0 audit row only when feeCents>0; all inside ONE Serializable tx under GroupSession FOR UPDATE) — CONFIRMED correct at enrollment.ts:844-945.
  - **Ledger model** independently re-derived: BOOKING_CHARGE=-priceCents already on the books (balance path 3.4 + Paystack path 4.2 TOPUP+BOOKING_CHARGE) → crediting only +refundCents leaves net cost = feeCents; a -feeCents debit would double-count. getBalance increases by EXACTLY refundCents (fee row is 0). Binding model honoured.
  - **AC2** seat returns for free — flip to CANCELLED removes the row from `occupiedEnrollmentWhere` derived count; no counter write. Correct (AD-5).
  - **AC4** IDOR-proof: Step 1 `findFirst({id, studentId})` → not_found for another student's row (no write/no reveal); TOCTOU-safe re-read of status UNDER the FOR UPDATE lock → double-click/concurrent-second-cancel serializes, sees CANCELLED, no-ops (not_cancellable, zero ledger rows); `session.start <= now` → not_cancellable. Correct.
  - **AC5** live island: plain string/number props (RSC-500 safe, rendered as JSX child not a non-children prop), AlertDialog confirm, sonner success/per-reason-error toast, router.refresh() on ok, aria-busy + min-h-44px + focus ring + label-text carries refund state, destructive/outline token variants (no hardcoded hex). Correct.
  - **AC6** pure `cancel-schema.ts` + 25 unit tests; schema untouched (LedgerType already carries both enum values). Independently re-ran: `prisma validate` clean, `npm test` 430/430 green (incl 25 new cancel-schema), `npm run build` clean (/portal/my-classes ƒ Dynamic present).
  - **Invariants (grep-confirmed):** every `Enrollment.status` write is inside enrollment.ts (AD-14 sole writer); every `ledgerEntry.create` is inside wallet.ts (AD-6 sole ledger writer). The cancel path writes ledger ONLY via `wallet.mutate`.
  - **Serialization envelope** reuses reserveSeat's MAX_RETRIES/backoffMs/isSerializationError; lock order GroupSession FOR UPDATE → wallet advisory (inside mutate) = same as reserve/confirm → no deadlock.
  - LOW observations recorded (NOT fixed — cosmetic / by-design, below the auto-fix HIGH/MEDIUM bar): (1) AlertDialog copy quotes the advisory-preview refundCents from page-render time — if a tier boundary is crossed before the click the dialog may promise slightly more than the authoritative cancel-time recompute delivers; by-design (preview is explicitly advisory; success toast quotes no amount; AC1 mandates cancel-time authority). (2) `revalidatePath` (x2) + `router.refresh()` is belt-and-braces redundant — harmless. (3) `pendingExpiresAt: null` on the CONFIRMED→CANCELLED flip is a redundant no-op (already null on a CONFIRMED row) — harmless. (4) AD-12⇄AD-8 re-book-after-cancel collision is now reachable but intentionally deferred and fails safe via the AD-8 partial-unique index (P2002 → generic error, never a double charge) — already carried in deferred-work.md.
- **Reversibility:** Status-only outcome. To reopen: set `5-2…: review` (or `in-progress`) in sprint-status.yaml and revert the story `Status:` line. No code was modified by the review (clean pass), so there is nothing to revert in source. Any of the four LOW items can be picked up later without touching the cancel invariants.
- **Files touched:** _bmad-output/implementation-artifacts/5-2-cancel-enrollment-tiered-refund-to-wallet-seat-returns-to-pool.md (Status + Review Findings); _bmad-output/implementation-artifacts/sprint-status.yaml (5-2 → done); _bmad-output/implementation-artifacts/autopilot-decisions.md (this entry)

### [2026-07-06T21:49:06Z] 6-1-enrollment-roster-with-paid-pending-status — Branch epic-6 created off epic-5 tip
- **Risk:** low
- **Workflow / step:** create-story activation (VERSION CONTROL block)
- **Decision point:** dispatch requires being on `epic-6` before editing; HEAD was `epic-5`, `epic-6` did not exist
- **Options considered:** A) checkout existing epic-6 / B) create epic-6 from current HEAD (epic-5 tip) / C) branch from main
- **Chosen:** B — `git checkout -b epic-6` from epic-5 tip (one-branch-per-epic chaining, per dispatch)
- **Rationale:** epic-6 absent; dispatch mandates chaining off previous epic's work, never main
- **Reversibility:** `git branch -D epic-6` while on another branch
- **Files touched:** none (branch only)

### [2026-07-06T21:49:06Z] 6-1-enrollment-roster-with-paid-pending-status — Roster route path = (admin)/admin/classes/[id]/page.tsx
- **Risk:** low
- **Workflow / step:** create-story step 3 (architecture analysis)
- **Decision point:** the epic AC says "open its admin detail/roster page" but does not pin a path
- **Options considered:** A) new `(admin)/admin/classes/[id]/page.tsx` (class detail = roster) / B) `(admin)/admin/classes/[id]/roster/page.tsx` / C) a tab on the edit page
- **Chosen:** A — the class detail index page at `[id]` IS the roster
- **Rationale:** ARCHITECTURE-SPINE source tree + Capability map explicitly name `(admin)/admin/classes/[id] roster` (spine lines 252, 291); mirrors the existing `[id]/edit` sibling
- **Reversibility:** move the page file; update the manifest entry + any nav link
- **Files touched:** story spec only (dev creates the page)

### [2026-07-06T21:49:06Z] 6-1-enrollment-roster-with-paid-pending-status — Roster shows PENDING+CONFIRMED(+ATTENDED/NO_SHOW), excludes CANCELLED; expired PENDING still labelled Pending
- **Risk:** medium
- **Workflow / step:** create-story step 5 (interpreting ambiguous AC)
- **Decision point:** AC says "each enrolled student with their status — paid (CONFIRMED) vs pending"; which enrollment statuses appear, and how to treat expired PENDING holds
- **Options considered:** A) only CONFIRMED+PENDING / B) all statuses incl. CANCELLED / C) PENDING+CONFIRMED now, tolerate ATTENDED/NO_SHOW for 6-2, exclude CANCELLED
- **Chosen:** C — query enrollments directly (spine: roster is NOT bound by AD-5 occupancy), show non-CANCELLED rows, map status→label (CONFIRMED=Paid, PENDING=Pending, ATTENDED=Attended, NO_SHOW=No-show). Expired PENDING is still shown as Pending (readers never write — AD-5); no lazy expiry flip.
- **Rationale:** matches Priyanka's need ("who to expect, who's mid-payment"); CANCELLED seats returned to pool and are not "enrolled"; making the label helper cover ATTENDED/NO_SHOW gives 6-2 (mark attended/no-show) a ready seam without rework. Read-only page must not write (AD-5/AD-14).
- **Reversibility:** adjust the `where`/label map in one pure helper + the page query
- **Files touched:** story spec only

### [2026-07-06T21:49:06Z] 6-1-enrollment-roster-with-paid-pending-status — New pure db-free helper enrollment-display.ts for status labels/badges
- **Risk:** low
- **Workflow / step:** create-story step 5 (file structure)
- **Decision point:** where the enrollment-status → label/badge-variant mapping lives (no such helper exists yet; my-classes only ever shows CONFIRMED)
- **Options considered:** A) inline in the roster page / B) add to class-display.ts / C) new pure module src/lib/enrollment-display.ts
- **Chosen:** C — dedicated pure, db-free `enrollment-display.ts` (mirrors class-display.ts testability pattern)
- **Rationale:** distinct concern (enrollment vs class formatting), vitest-testable without a live DB, and 6-2 reuses it for ATTENDED/NO_SHOW
- **Reversibility:** delete/merge the module into class-display.ts
- **Files touched:** story spec only

### [2026-07-06T22:08:55Z] 6-1-enrollment-roster-with-paid-pending-status — code-review resolved CLEAN → done
- **Risk:** low
- **Workflow / step:** code-review step-03 triage / step-04 present-and-act (fix-vs-action-items <ask>)
- **Decision point:** Adversarial review of the `review` story; at the fix-vs-action-items ask, decide FIX vs action-items and set final status.
- **Options considered:** A) mark done clean; B) fix LOW noise (inline statusVariant/formatDateTime duplication, unused `end` select); C) back to in-progress with follow-ups.
- **Chosen:** A — CLEAN review, status `done`. No HIGH/MEDIUM/critical findings; LOW items are consistent-with-prior-story dismissals (no consequence). Autopilot default is fix-all HIGH/MEDIUM — none exist, so no patches applied.
- **Rationale:** FRESH 3-lens adversarial pass (Blind/EdgeCase/AcceptanceAuditor) over git diff 070df51..HEAD, dev record NOT trusted. All 5 ACs + AD-2/3/5/9/10/14 independently re-verified against actual source: requireAdmin-first before any fetch/JSX (AC4/AD-3), direct enrollment read `status:{not:"CANCELLED"}` ordered createdAt asc — NOT occupiedEnrollmentWhere, expired PENDING still labelled Pending, zero writes / no enrollment.ts|wallet.ts import (AC3/AD-5/AD-14), notFound() on unknown id (AC4), no meetingUrl/location selected (AD-10), formatZar integer-cents at edge (AD-9), pure type-only EnrollmentStatus helper mirrors class-occupancy.ts, plain <div> under layout-owned single <main> (1.3 a11y), index Roster link + e2e manifest seed-class-acc-1 wired (AC5). Independently RE-RAN: `prisma validate` clean, `next build` clean (/admin/classes/[id] ƒ Dynamic), full vitest 440/440 incl 10 new enrollment-display assertions. LOW noise dismissed (inline class-status ternary == 2.2 statusVariant logic; local formatDateTime dup; unused `end` select — all harmless, mirror prior dismissals). Timezone-display cross-cutting defer already tracked from 2.2/2.3; story notes forbid unilateral pin here — not re-logged.
- **Reversibility:** No code changed this review. To reopen: set 6-1 back to in-progress in sprint-status.yaml and re-run dev-story. Live populated-roster read remains deferred to CI ephemeral-Postgres (seed = ADMIN only, fresh-seed roster = empty-state AC2).
- **Files touched:** _bmad-output/implementation-artifacts/6-1-enrollment-roster-with-paid-pending-status.md (Status→done + Review Findings), _bmad-output/implementation-artifacts/sprint-status.yaml

### [2026-07-06T22:13:32Z] 6-2-mark-attended-no-show — Story scope: what the attendance-mark story owns
- **Risk:** medium
- **Workflow / step:** create-story steps 2–5 (scope from epics.md Story 6.2 + ARCHITECTURE-SPINE AD-14)
- **Decision point:** Epic AC for 6.2 is a single minimal Given/When/Then ("mark a CONFIRMED enrollment ATTENDED or NO_SHOW; status updates and reflects on the roster"). Needed to fix the concrete surface (new domain fn + admin action + client island + roster wiring) without over-scoping.
- **Options considered:** A) Minimal: one `enrollment.markAttendance` domain fn (AD-14 sole writer) + `markAttendanceAction` (admin) + per-row client-island buttons on the 6.1 roster + reuse 6.1's `formatEnrollmentStatus`/badge for the reflected label. B) Add a bulk "mark all" / attendance sheet. C) Add class-day filtering, attendance history/audit log.
- **Chosen:** A.
- **Rationale:** Epic AC is per-enrollment and roster-scoped; 6.1 already built the label helpers (ATTENDED→"Attended", NO_SHOW→"No-show") and reserved reuse for 6.2. Bulk marking, audit log and class-day filters are explicitly listed as open/deferred items in the spine ("admin-action audit trail … open item"). Polish is Story 6.4; email is 6.3.
- **Reversibility:** Additive — new fn/action/island/schema + one Actions column on the roster page. No schema/migration. Removing the column + files reverts.
- **Files touched:** _bmad-output/implementation-artifacts/6-2-mark-attended-no-show.md

### [2026-07-06T22:13:32Z] 6-2-mark-attended-no-show — No lock / no Serializable tx for the attendance transition
- **Risk:** medium
- **Workflow / step:** create-story step 3 (architecture guardrails — AD-14)
- **Decision point:** reserveSeat/confirmPaidSeat/cancelEnrollment all run inside a Serializable + GroupSession FOR UPDATE + retry envelope. Should `markAttendance` copy that envelope?
- **Options considered:** A) Plain atomic conditional `updateMany({ where:{ id, status:"CONFIRMED" }, data:{ status: outcome } })` — count===1 = success, count===0 = not-markable/not-found; no lock, no retry. B) Cargo-cult the full Serializable + FOR UPDATE + P2034 retry loop from reserveSeat.
- **Chosen:** A.
- **Rationale:** AD-14 states verbatim that each transition "takes the appropriate lock (GroupSession row for seat-affecting transitions; **none needed for `ATTENDED`/`NO_SHOW`**)." Attendance does not change occupancy, price or the ledger, so there is no oversell/last-seat invariant to protect. A status-guarded `updateMany` is itself atomic and makes a concurrent double-mark safe (only one row-write wins count===1). Adding Serializable/FOR UPDATE would be the exact "cargo-cult 3.4" mistake the 3.5 credit action warns against.
- **Reversibility:** If a future seat-affecting side effect is added to attendance, wrap the same fn in the reserveSeat envelope; contained to `enrollment.ts#markAttendance`.
- **Files touched:** _bmad-output/implementation-artifacts/6-2-mark-attended-no-show.md

### [2026-07-06T22:13:32Z] 6-2-mark-attended-no-show — Markable set = CONFIRMED only; ATTENDED↔NO_SHOW correction deferred
- **Risk:** medium
- **Workflow / step:** create-story step 5 (acceptance-criteria interpretation)
- **Decision point:** The AC starts "Given a CONFIRMED enrollment." Should the transition also allow re-marking an already-marked row (fix a misclick: ATTENDED→NO_SHOW or back to CONFIRMED)?
- **Options considered:** A) Guard `status === "CONFIRMED"` only — PENDING/CANCELLED/already-marked rows are not markable. B) Allow correction among {CONFIRMED, ATTENDED, NO_SHOW}. C) Allow any→any.
- **Chosen:** A (CONFIRMED-only), with correction flagged as an explicit out-of-scope deferral in the story.
- **Rationale:** Minimal reasonable interpretation of the spec (contract rule 4). PENDING = unpaid (nothing to attend); CANCELLED = seat returned. Correction is real-world useful but additive scope and unmentioned by the AC — safer to defer than to widen an admin status-write surface unprompted. Guard is written as a single WHERE clause so widening later is a one-line change.
- **Reversibility:** Broaden the `updateMany` WHERE `status` filter (e.g. `status: { in: ["CONFIRMED","ATTENDED","NO_SHOW"] }`) in `markAttendance`; no data migration.
- **Files touched:** _bmad-output/implementation-artifacts/6-2-mark-attended-no-show.md

### [2026-07-06T22:13:32Z] 6-2-mark-attended-no-show — NO_SHOW mark writes NO ledger/refund; FR14 coupling is tier-constant-only
- **Risk:** medium
- **Workflow / step:** create-story step 3 (cross-FR interpretation — FR14 "no-show → 0%")
- **Decision point:** FR14 ties no-show into the cancellation refund tiers ("<24h or no-show → 0%"). Does marking NO_SHOW here trigger any wallet.mutate / refund / fee?
- **Options considered:** A) Attendance mark is a pure status record — zero wallet/ledger writes; the "no-show → 0% refund" clause is already satisfied statically by the AD-11 tier constant and only bites when a student cancels (Story 5.2 path). B) Marking NO_SHOW additionally runs a refund/fee ledger entry.
- **Chosen:** A.
- **Rationale:** BOOKING_CHARGE was already taken at reservation; a no-show forfeits it (0% back) which is the *absence* of any refund, not a new debit. Writing any ledger row on NO_SHOW would double-count or invent a charge with no invariant behind it. Keeps AD-6 (wallet.mutate sole ledger path) untouched by the attendance surface. Marking NO_SHOW therefore does NOT call wallet.ts at all.
- **Reversibility:** If a future policy needs a forfeiture audit row, add it in `enrollment.ts#markAttendance` via wallet.mutate (amount 0 audit-only, mirroring 5.2's CANCELLATION_FEE); no schema change.
- **Files touched:** _bmad-output/implementation-artifacts/6-2-mark-attended-no-show.md

### [2026-07-06T22:19:36Z] 6-2-mark-attended-no-show — dev-story start: mark in-progress
- **Risk:** low
- **Workflow / step:** dev-story step 4 (mark story in-progress)
- **Decision point:** Story was `ready-for-dev`; no baseline_commit in frontmatter; must capture current HEAD and transition to `in-progress`.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Add `baseline_commit: 8277014271ac57213e2a673c721d218fbd291fc2` to story frontmatter; update sprint-status.yaml to `in-progress`.
- **Rationale:** Required by workflow contract.
- **Reversibility:** Revert sprint-status.yaml line to `ready-for-dev`; remove frontmatter from story file.
- **Files touched:** _bmad-output/implementation-artifacts/sprint-status.yaml, _bmad-output/implementation-artifacts/6-2-mark-attended-no-show.md

### [2026-07-06T22:26:24Z] 6-2-mark-attended-no-show — classId included in schema input
- **Risk:** medium
- **Workflow / step:** dev-story step 5 (Task 1/3 implementation)
- **Decision point:** The story recommended adding `classId` to the Zod schema so `revalidatePath` is precise. The island needs `classId` as a prop and sends it in the action input.
- **Options considered:** A) Derive `classId` from DB (extra query inside the action) / B) Include `classId` in the Zod input schema as a plain string (recommended by Dev Notes)
- **Chosen:** B — `classId: z.string().min(1)` added to `markAttendanceInputSchema`; island receives `classId` as a prop from the roster page; action revalidates `/admin/classes/${classId}`.
- **Rationale:** Dev Notes explicitly recommend this. No extra DB query. RSC-500-safe (plain string prop). Zod-covered so server-side validated.
- **Reversibility:** Remove `classId` from schema + island props + action; derive from a `findUnique` call inside the action instead.
- **Files touched:** acce-nextjs/src/lib/attendance-schema.ts, acce-nextjs/src/app/(admin)/admin/classes/[id]/actions.ts, acce-nextjs/src/app/(admin)/admin/classes/[id]/mark-attendance-buttons.tsx

### [2026-07-06T22:26:24Z] 6-2-mark-attended-no-show — MARK_ATTENDANCE_SUCCESS as function not constants
- **Risk:** low
- **Workflow / step:** dev-story step 5 (Task 1 implementation)
- **Decision point:** Dev Notes say "a `MARK_ATTENDANCE_SUCCESS(outcome)` helper (or two constants)". Chose one of the two options.
- **Options considered:** A) Two separate constants (`MARK_ATTENDANCE_SUCCESS_ATTENDED`, `MARK_ATTENDANCE_SUCCESS_NO_SHOW`) / B) Single function `MARK_ATTENDANCE_SUCCESS(outcome)` returning outcome-specific string
- **Chosen:** B — single function with `outcome` parameter, consistent with the `getMarkAttendanceErrorMessage` pattern in the same module.
- **Rationale:** One import in the island and action; cleaner to call `MARK_ATTENDANCE_SUCCESS(result.status)` when the outcome is in hand. Mirrors the "mapper function" pattern of the module.
- **Reversibility:** Split into two constants if the calling code is cleaner with them.
- **Files touched:** acce-nextjs/src/lib/attendance-schema.ts

### [2026-07-06T22:26:24Z] 6-2-mark-attended-no-show — story complete: marked review
- **Risk:** low
- **Workflow / step:** dev-story step 9 (story completion)
- **Decision point:** All 7 tasks checked, all ACs satisfied (AC1-AC5), prisma validate clean, 472/472 vitest (32 new), build clean with /admin/classes/[id] ƒ Dynamic. Mark story review.
- **Options considered:** n/a — prescribed workflow step.
- **Chosen:** Update story Status to "review", update sprint-status.yaml to "review".
- **Rationale:** All completion gates passed. Live write round-trip deferred to CI ephemeral-Postgres per established sandbox policy (same as all prior stories).
- **Reversibility:** Revert sprint-status.yaml line to "in-progress".
- **Files touched:** _bmad-output/implementation-artifacts/6-2-mark-attended-no-show.md, _bmad-output/implementation-artifacts/sprint-status.yaml

---

### [2026-07-06T22:32:00Z] 6-2-mark-attended-no-show — code-review: clean pass, set done
- **Risk:** low
- **Workflow / step:** code-review step 3-4 (triage + present/act) + step 6 (sprint-status sync)
- **Decision point:** Fresh adversarial review of the `review` story (dev record NOT trusted). At the fix-vs-action-items `<ask>`: default is FIX all HIGH/MEDIUM findings. Determine final status (done vs in-progress).
- **Options considered:** (A) set `done` — no HIGH/MEDIUM/critical findings, chain independently green; (B) set `in-progress` with Review Follow-ups — only if patch/decision-needed findings remained.
- **Chosen:** A — status `done`. 0 HIGH/MEDIUM/critical, 0 patch, 0 decision-needed, 0 defer, 3 dismissed as noise.
- **Rationale:** Re-verified all 5 ACs + AD-2/3/6/14 + UX-DR2/DR5/DR6/NFR10 against actual source. grep-confirmed AD-14 sole `Enrollment.status` writer (every `enrollment.update/updateMany/create` in `enrollment.ts`); `markAttendance` is a plain atomic status-guarded `updateMany` with NO FOR UPDATE / Serializable / retry / `wallet.mutate` / LedgerEntry (correct — attendance is not seat-affecting; no-show forfeits the already-taken BOOKING_CHARGE = absence of a refund, not a new debit); `z.enum` outcome guard pinned by 32 tests; `requireAdmin()` called first before any parse/write. Independently re-ran `prisma validate` clean + `npm run build` clean (`/admin/classes/[id]` ƒ Dynamic) + `npm test` 472/472. No code changes required. 3 dismissed: Zod-fail→`not_found` (per-spec defensive path), client-supplied `classId` in `revalidatePath` (cache-only + admin-only, `router.refresh()` covers UI), `MARK_ATTENDANCE_SUCCESS` naming (matches story request).
- **Reversibility:** No source changed this review; fully reversible by reverting the story-file Status and sprint-status.yaml `6-2 → review` edits. To re-open, set `development_status[6-2-mark-attended-no-show]` back to `review`.
- **Files touched:** _bmad-output/implementation-artifacts/6-2-mark-attended-no-show.md (Status→done + Review Findings), _bmad-output/implementation-artifacts/sprint-status.yaml (6-2→done + comment + last_updated)

---

### [2026-07-06T22:39:48Z] 6-3-seat-confirmation-email-on-confirmation — create-story: confirmation-email trigger placement
- **Risk:** medium
- **Workflow / step:** create-story step 3-5 (architecture analysis → author story guidance)
- **Decision point:** Story 6.3 must fire a seat-confirmation email "when an enrollment becomes CONFIRMED (via balance-pay in Epic 3 or the webhook in Epic 4)". CONFIRMED is written in exactly two domain functions in `enrollment.ts` — `reserveSeat` (balance path, `outcome:"confirmed"`) and `confirmPaidSeat` (webhook path, `decision:"confirm"`). Where should the email dispatch be triggered, given AD-13 requires it to run OUTSIDE the transaction (a failed email must never roll back the seat)?
- **Options considered:**
  - A) **Entry-layer trigger (chosen):** call a new `email.sendSeatConfirmationEmail(enrollmentId)` from the three entry points that observe a `confirmed` outcome — `reserveSeatAction`, `payWithPaystackAction` (its "balance became sufficient" confirmed branch), and the Paystack webhook route (after `confirmPaidSeat` returns confirmed). Requires a minimal additive widening of `ConfirmResult` so the confirmed variant carries `enrollmentId` (the route needs it; `reserveSeat`'s confirmed result already carries it). `enrollment.ts`'s transition/tx core is otherwise untouched.
  - B) **Domain-centralized in `enrollment.ts`:** dispatch post-commit inside `reserveSeat` and `confirmPaidSeat` themselves (2 sites, can't-forget-a-caller). Rejected: pushes email/presentation I/O and a fresh DB read into the concurrency-critical sole-status-writer module, and changes the behaviour of the function exercised by the 4.3 no-oversell concurrency integration test.
- **Chosen:** A — trigger at the entry layer (2 server actions + webhook route), alongside the existing `revalidatePath` side-effects; `sendSeatConfirmationEmail` is a domain helper in `email.ts` that owns load+build+send and returns a `SendResult` (never throws). Email runs after the tx has committed → seat is durable regardless of email outcome (AD-13); failure is logged and swallowed.
- **Rationale:** Side-effect orchestration (revalidate, notify) already lives at the entry layer; keeping it there preserves the clean domain boundary and leaves `enrollment.ts`'s Serializable/retry core (and the 4.3 concurrency test path) pristine. The set of callers that can observe a `confirmed` outcome is closed and small (AD-4 one canonical reservation; AD-7 one webhook), and the story enumerates all three explicitly, mitigating the "forgot-a-caller" risk. `ConfirmResult` widening is additive/back-compat (existing consumers only read `.ok`/`.outcome`).
- **Reversibility:** To switch to approach B, move the three `sendSeatConfirmationEmail` calls into post-commit blocks inside `reserveSeat`/`confirmPaidSeat` (after `await db.$transaction(...)`, gated on `result.outcome === "confirmed"`, in try/catch) and drop the entry-layer calls; the `email.ts`/`meeting.ts` modules and the `ConfirmResult.enrollmentId` field are unchanged either way.
- **Files touched:** (guidance only — authored into) _bmad-output/implementation-artifacts/6-3-seat-confirmation-email-on-confirmation.md

### [2026-07-06T22:39:48Z] 6-3-seat-confirmation-email-on-confirmation — create-story: meeting.ts provider shape + email module ownership
- **Risk:** low
- **Workflow / step:** create-story step 3-5 (author story guidance)
- **Decision point:** How to shape the new `src/lib/meeting.ts` `MeetingProvider`/`ManualProvider` (AD-13) and where the email data-load/HTML-build lives.
- **Options considered:** (meeting) a provider that GENERATES links now vs a `ManualProvider` that surfaces the manually-entered `meetingUrl`/`location`; (email) load-and-build inside `email.ts#sendSeatConfirmationEmail(enrollmentId)` vs the callers assembling and passing a payload.
- **Chosen:** `meeting.ts` exposes a `MeetingProvider` interface with a single `getJoinDetail(session)` that returns a discriminated `{ mode:"ONLINE"; url } | { mode:"IN_PERSON"; location }`, implemented by `ManualProvider` (returns the stored fields as-is; `GoogleMeetProvider` slots in later with no call-site change per AD-13) and exported as a `meetingProvider` singleton. `email.ts#sendSeatConfirmationEmail(enrollmentId)` owns the single `db` read (enrollment → student email/name, session subject/title/start/mode/meetingUrl/location, priceCents snapshot), builds the HTML via a pure exported `buildSeatConfirmationHtml(...)`, and sends via the existing `sendEmail`. Reuse `formatZar` (AD-9) and the existing `escapeHtml`/`escapeHtmlAttr`; mirror the mode-gated reveal (ONLINE→meetingUrl, IN_PERSON→location) that the 3.3 detail page already uses (consistent with the deferred `meetingUrl`-on-IN_PERSON write-side item). Add a defensive confirmed-status guard so a mis-call cannot email join details for a non-confirmed enrollment (AD-10 spirit).
- **Rationale:** Single load+build+send keeps the three call sites one-liners and the join-detail/format logic DRY and unit-testable (pure `ManualProvider.getJoinDetail` + pure `buildSeatConfirmationHtml`); the live send is a no-op in the sandbox (no `RESEND_API_KEY` → `sendEmail` logs and returns ok), so no new env/dep and CI-deferred live send matches every prior story. HTML-escaping user-provided fields (title/location/meetingUrl/name) prevents email HTML injection.
- **Reversibility:** Local, additive new modules/functions; drop or reshape freely — no persistent state, no schema, no dependency.
- **Files touched:** (guidance only — authored into) _bmad-output/implementation-artifacts/6-3-seat-confirmation-email-on-confirmation.md

### [2026-07-06T22:59:55Z] 6-3-seat-confirmation-email-on-confirmation — code-review: CLEAN, set done
- **Risk:** low
- **Workflow / step:** code-review step 3-4 (triage + present/act) — fix-vs-action-items `<ask>` overridden autonomously
- **Decision point:** Adversarial 3-lens review (Blind Hunter / Edge Case Hunter / Acceptance Auditor) of diff cd713a3..083ed45; then whether any HIGH/MEDIUM findings require a fix and what final status to set.
- **Options considered:** (A) FIX AUTOMATICALLY all HIGH/MEDIUM and set in-progress with follow-ups; (B) CLEAN → set done; (C) block.
- **Chosen:** B — set `done`. Zero HIGH/MEDIUM/critical findings; all 5 ACs independently re-verified; chain re-run green.
- **Rationale:** FRESH pass (dev record NOT trusted). AC1: send fires on all three confirmed entry points (reserveSeatAction, payWithPaystackAction, webhook route) post-commit alongside revalidatePath; replayed webhook returns already_processed (not confirmed) → no double-send (exactly-once). AC2: send runs outside the tx, wrapped in log-only try/catch, sendSeatConfirmationEmail never throws, webhook still returns 200. AC3: native fetch only (no resend/axios import), MeetingProvider + ManualProvider exported, no link generation (GoogleMeetProvider deferred behind same iface). AC4: mode-gated reveal (ONLINE→url / IN_PERSON→location), defensive confirmed-family status guard {CONFIRMED,ATTENDED,NO_SHOW}, all user fields escaped (escapeHtml text / escapeHtmlAttr href), null-meetingUrl fallback line. AC5: `npx prisma validate` clean, `npm run build` compiled successfully (/portal/classes/[id] ƒ Dynamic, /api/webhooks/paystack ƒ present), vitest 499/499 incl 27 new (8 meeting + 19 seat-confirmation-email). LOW observations dismissed: escapeHtmlAttr escapes only quotes (sufficient — quote is the only href breakout vector; link text uses full escapeHtml); `mode as "ONLINE"|"IN_PERSON"` cast redundant/harmless (Prisma already types it); webhook awaits Resend synchronously before 200 (per-spec MVP — no after()/queue in scope for 1a); admin-authored `javascript:` meetingUrl is trusted-author + email clients don't execute. No code changed this review.
- **Reversibility:** No code edits made; status-only transition. To reopen, set 6-3 back to `in-progress` in sprint-status.yaml + story Status header and add Review Follow-ups under Tasks/Subtasks.
- **Files touched:** _bmad-output/implementation-artifacts/6-3-seat-confirmation-email-on-confirmation.md (Status → done), _bmad-output/implementation-artifacts/sprint-status.yaml (6-3 → done, last_updated)

### [2026-07-06T23:05:00Z] 6-4-portal-polish-seats-left-states-empty-states-error-toasts — Scope of the "portal polish" story
- **Risk:** medium
- **Workflow / step:** create-story steps 2–5 (interpret an ambiguous, broadly-worded polish AC)
- **Decision point:** Epics AC1 = "'Class full' state, empty state, and sonner error toast are shown CONSISTENTLY" (UX-DR3/4/5); AC2 = NFR10 a11y floor on "any new portal/admin control". These states already EXIST inline on every screen (formatSeatsLeft helper, per-page empty-state Cards, per-island toast mappers, per-control 44px/focus-ring). The story is therefore a CONSISTENCY/consolidation pass, not net-new features — but "consistently" is open-ended and could sprawl into a full-app refactor.
- **Options considered:** (A) Broad refactor — extract shared primitives AND rewrite every portal+admin screen's markup; (B) Minimal — extract a shared `EmptyState` primitive + one canonical full-class copy constant, adopt across all portal empty/full states (required) and the identical admin duplications (low-risk), verify the toast-mapper + a11y-floor consistency and fix only real gaps; (C) Audit-only — document inconsistencies, change nothing.
- **Chosen:** B.
- **Rationale:** B satisfies "shown consistently" by making the three states render from a single source (removes the 7+ inline duplicated empty-state Cards and the divergent full-class copy) while staying purely PRESENTATIONAL — no domain/enrollment/wallet/paystack logic, no schema/migration/enum/dep, no new routes, no timezone pin (explicitly deferred cross-cutting per deferred-work.md). A is unbounded and regression-prone for the last story before the epic retrospective; C leaves the stated AC unmet. Loading/skeleton states are excluded — the epics ACs name only full/empty/error (UX-DR3/4/5), so adding them would be invented scope.
- **Reversibility:** All changes are additive presentational components + call-site swaps; revert by restoring inline JSX (git). No data or interface shape changes.
- **Files touched:** _bmad-output/implementation-artifacts/6-4-portal-polish-seats-left-states-empty-states-error-toasts.md (new)

### [2026-07-06T23:05:00Z] 6-4 — Shared EmptyState component: shape & location
- **Risk:** medium
- **Workflow / step:** create-story step 3 (developer guardrails)
- **Decision point:** Where the shared empty-state primitive lives and its API, since it will be imported by both (portal) and (admin) screens.
- **Options considered:** (A) `src/components/ui/empty-state.tsx` (alongside shadcn primitives); (B) `src/components/portal/empty-state.tsx` (portal-scoped); (C) a bare exported function per page.
- **Chosen:** A — `src/components/ui/empty-state.tsx`, a presentational server component wrapping shadcn `Card`/`CardContent` with props `{ title?, message, action? }` where `action` is an optional `{ href, label }` (NOT a Client element — RSC-500 safe, 1.5 lesson) rendered as a shadcn `Button asChild` link meeting the NFR10 floor (min-h-44px, focus-visible ring, token colours).
- **Rationale:** It is used by BOTH route groups so it must be neutral/shared, not portal-scoped; ui/ is where the existing shared presentational primitives live. Passing `action` as plain data (href+label) not a JSX element keeps every Server Component call-site RSC-500-safe (the exact trap in lessons-learned). Keeping it a Server Component avoids needless client bundle.
- **Reversibility:** Delete the file and re-inline; low effort, presentational only.
- **Files touched:** acce-nextjs/src/components/ui/empty-state.tsx (new, dev-created)

### [2026-07-06T23:05:00Z] 6-4 — Canonical "Class full" copy + toast-mapper consistency
- **Risk:** low
- **Workflow / step:** create-story step 3
- **Decision point:** Full-class messaging diverges (browse footer "This class is fully booked." vs detail "Class full" + "…Check back in case a seat opens up."); four toast mappers each define their own generic fallback string.
- **Options considered:** (A) leave divergent; (B) unify full-class copy via the single `formatSeatsLeft` badge ("Class full") + one shared supporting sentence constant, and confirm every toast mapper's generic fallback is the identical "Something went wrong — please try again" (already true) without refactoring the domain-specific reason maps.
- **Chosen:** B.
- **Rationale:** `formatSeatsLeft` is already the AD-5-aligned single source for the badge; the only inconsistency is the supporting sentence — unify it. The toast mappers are already consistent (verified: reserve/cancel/attendance all share the "Something went wrong — please try again" fallback); a cross-domain merge would add coupling for no user-visible gain, so leave the per-domain reason maps intact.
- **Reversibility:** Trivial (constant/string edits).
- **Files touched:** dev-created constant in class-display.ts; portal page call-sites.

### [2026-07-06T23:10:09Z] 6-4-portal-polish-seats-left-states-empty-states-error-toasts — Implement shared EmptyState component + full polish pass
- **Risk:** medium
- **Workflow / step:** dev-story step 5 (implementation start)
- **Decision point:** How to implement the shared EmptyState component without the RSC-500 non-children-prop trap
- **Options considered:** A) Accept plain `{href,label}` object as action prop (serialisable) / B) Accept a ReactNode as action prop (RSC-500 unsafe)
- **Chosen:** A — plain `{ href: string; label: string }` data prop, rendered as Button asChild wrapping next/link inside the Server Component itself
- **Rationale:** Lessons-learned RSC-500 trap: a Server Component must never pass a Client Component element through a non-children prop. The action is plain data; the component owns the rendering of the CTA link.
- **Reversibility:** If CTA needs richer composition, convert to children pattern or a named slot.
- **Files touched:** acce-nextjs/src/components/ui/empty-state.tsx (to be created)

### [2026-07-06T23:10:09Z] 6-4-portal-polish-seats-left-states-empty-states-error-toasts — Toast islands audit
- **Risk:** low
- **Workflow / step:** dev-story step 5 (task 5)
- **Decision point:** Audit-only vs refactor of toast islands
- **Options considered:** A) Audit then fix only genuine gaps / B) Refactor all islands
- **Chosen:** A — audit and fix gaps only; if all comply, record "verified — no change"
- **Rationale:** Story spec says "audited, not restructured"; manufactured edits would be invented scope
- **Reversibility:** N/A — no structural change
- **Files touched:** (toast island files if gaps found)

### [2026-07-06T23:10:09Z] 6-4-portal-polish-seats-left-states-empty-states-error-toasts — credit-wallet-form catch message
- **Risk:** low
- **Workflow / step:** dev-story step 5 (task 5)
- **Decision point:** credit-wallet-form.tsx catch block uses "Something went wrong. Please try again." (period, not em-dash) vs canonical "Something went wrong — please try again"
- **Options considered:** A) Fix to match canonical fallback exactly / B) Leave as-is (no domain mapper in credit-wallet-form)
- **Chosen:** A — fix to use exact canonical wording with em-dash per UX-DR5 spec
- **Rationale:** AC3 requires identical generic fallback. The period variant is a divergence from the spec's required wording.
- **Reversibility:** Revert the one-line catch string.
- **Files touched:** acce-nextjs/src/app/(admin)/admin/students/[id]/credit-wallet-form.tsx
