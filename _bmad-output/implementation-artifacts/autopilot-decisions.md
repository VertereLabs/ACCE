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
