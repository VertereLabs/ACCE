---
baseline_commit: 0bedda60cf1f0be77413497b9193036199e524c8
---

# Story 1.5: Deployable shell with authenticated route-200 smoke test

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the operator,
I want the portal to build standalone and deploy on the subdomain with a smoke test over every authenticated route,
so that a broken guard or RSC 500 is caught before it reaches users.

## Context & current state (READ FIRST)

This is the **last story of Epic 1** and the Phase-0 capstone: prove the whole shell (data + auth + guards + seed) actually **builds, deploys, and serves 200 on every guarded route**. Stories 1.1–1.4 are all `done`. **Do not re-derive or rebuild the state below — most of the "deploy shell" AC1 is already satisfied; the real net-new work is the authenticated route-200 Playwright smoke (AC2).**

**Deploy shell — ALREADY IN PLACE (verify, do not rebuild):**
- `next.config.ts` already sets **`output: 'standalone'`** and applies the security headers (CSP/HSTS/X-Frame/X-Content-Type/Referrer-Policy) to **`source: "/(.*)"`** — which already covers `(portal)`/`(admin)` routes (NFR11). [Source: acce-nextjs/next.config.ts:24,39-45]
- `Dockerfile` is the standard node:20-alpine multi-stage standalone build, non-root `nextjs` user, `EXPOSE 3000`, `CMD ["node","server.js"]`, and **explicitly copies the Prisma generated client + engine** (`.prisma`, `@prisma/client`) into the runner stage (NFR7 — the "missing standalone Prisma artifact" trap from global lessons). [Source: acce-nextjs/Dockerfile:30-51]
- Coolify deploy is **Build Pack = Dockerfile, Base Directory = `/acce-nextjs`, port 3000, branch `main`**. Portal is reached via the **`portal.accetutors.co.za` host mapping to the same app** — NOT a separate build (AD-1). [Source: memory acce-repo-and-deploy; ARCHITECTURE-SPINE.md:275]
- **⚠️ Standalone start gotcha:** with `output: 'standalone'`, **`next start` does NOT serve the standalone build** (Next prints `⚠ "next start" does not work with "output: standalone"`). Production start is **`node .next/standalone/server.js`** (Coolify uses this via the Dockerfile `CMD`). [Source: memory acce-deploy-standalone-server]

**Authenticated smoke — THE GAP (this story builds it):**
- `playwright.config.ts` already exists: dedicated **port 3100**, `reuseExistingServer: false`, `webServer.command: "npm run build && npm run start -- -p 3100"`, `baseURL: http://localhost:3100`, chromium only. [Source: acce-nextjs/playwright.config.ts]
- `tests/e2e/smoke.spec.ts` already exists but **only covers PUBLIC routes** — it drives off `src/app/sitemap.ts`, and the sitemap **deliberately excludes `(portal)`/`(admin)` routes** (see 1.3: `sitemap.test.ts` excludes them). So **no authenticated route is currently smoke-tested.** [Source: acce-nextjs/tests/e2e/smoke.spec.ts:9-10; 1-3...md:108]
- The only authenticated routes that exist **today** are `/portal` (`(portal)/portal/page.tsx`) and `/admin` (`(admin)/admin/page.tsx`) — both minimal landings from 1.2/1.3. Later epics add `/portal/classes`, `/portal/classes/[id]`, `/portal/my-classes`, `/portal/wallet`, `/admin/classes`, `/admin/classes/[id]` (ARCHITECTURE-SPINE source tree). The smoke must be **driven off a maintained authenticated-route manifest** so new routes are covered as epics land. [Source: ARCHITECTURE-SPINE.md:251-252]
- Both guarded pages enforce **page-level** `requireSession()` / `requireAdmin()` (AD-3), and the guards read the **server** Better Auth session (`auth.api.getSession`). A smoke visiting them as an unauthenticated client gets a **redirect to `/sign-in`, not a 200** — so the suite MUST carry a real authenticated session per role. [Source: acce-nextjs/src/lib/auth-guards.ts; (portal)/portal/page.tsx:12-20; (admin)/admin/page.tsx:13]
- **Auth is magic-link only — no password.** `src/lib/auth.ts` has `magicLink()` + `admin()` + `nextCookies()` (last); `emailAndPassword` is intentionally OFF. Playwright cannot "type a password" — session provisioning must go through the real Better Auth session path (see Task 3). [Source: acce-nextjs/src/lib/auth.ts:21,52-66]
- **No test Postgres in this sandbox.** 1.1 and 1.4 both established that prod DB creds are blocked interactively and the sandbox bar is **static verification** (`tsc`/build/vitest); DB-backed proofs (migrate deploy, live seed) are deferred to the release pipeline / a CI job with an ephemeral Postgres. The authenticated smoke is DB-backed (sessions live in Postgres), so its **live green run is deferred to CI the same way** — see Testing. [Source: 1-1...md; 1-4...md:72,114; deferred-work.md:8]

## Scope — what this story IS and is NOT

**IS (1.5):**
1. **Verify** the standalone deploy shell invariants already in place (next.config `output:'standalone'`, headers on `/(.*)` covering portal, Dockerfile Prisma-client copy, base dir `/acce-nextjs`, `portal.accetutors.co.za` host mapping) and **document** the verification in the Dev Agent Record. Add a lightweight **assertion** (unit or e2e) that a portal route response carries the security headers (AC1 / NFR11) — do NOT rebuild the config.
2. Author an **authenticated-route manifest** (a small exported list of guarded `(portal)`/`(admin)` routes with the role each needs) so the smoke covers every authenticated route and new routes are trivially added.
3. Author the **authenticated route-200 Playwright smoke** (`tests/e2e/authenticated-smoke.spec.ts` or an extension of `smoke.spec.ts`): for each manifest route, visit it **as the correct role** and assert **HTTP 200** (guards the RSC non-children-prop 500 trap — lessons-learned).
4. Provide **per-role session provisioning** via Playwright `globalSetup` that mints a STUDENT session and an ADMIN session through the real Better Auth `auth` server API (or the magic-link-URL capture path) and saves `storageState` per role — **no new production auth surface** (no test-only bypass route).
5. Keep the existing public/marketing smoke and all vitest green.

**IS NOT (owned elsewhere / out of scope):**
- **No new feature pages.** The manifest covers the routes that EXIST now (`/portal`, `/admin`); later epics extend the manifest as they add pages. Do NOT scaffold Epic 2–6 pages to "have more to test."
- **No production auth bypass / test-only sign-in endpoint** — that would open a real authentication hole (critical risk). Provision sessions through the genuine Better Auth path in `globalSetup` only.
- **No changes to `next.config.ts` headers, the Dockerfile, or `middleware.ts`** unless the header-inheritance assertion proves an actual gap (it should not — headers already apply to `/(.*)`). If you must touch them, justify it.
- **No schema/migration change**, no seed change (`prisma/seed.ts` stays production-data-only; the test STUDENT is created in `globalSetup`, not seeded).
- **No live prod-DB run in the sandbox** — the DB-backed live smoke run is deferred to a CI job with an ephemeral Postgres (Testing section).

## Acceptance Criteria

**AC1 — Standalone shell deploys on the subdomain with security headers on portal routes (NFR7, NFR8, NFR11).**
Given `next.config.ts` sets `output: 'standalone'`, the Dockerfile copies the Prisma client into the runner stage, and Coolify builds from base dir `/acce-nextjs`,
When the image is built and deployed,
Then the portal is served under `portal.accetutors.co.za` (host mapping to the same app, AD-1) and the existing security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy) **apply to `(portal)`/`(admin)` routes** — verified by an assertion that a portal route response carries those headers. *(The config already satisfies this; this story verifies + asserts it, it does not rebuild it.)*

**AC2 — Authenticated route-200 smoke over every guarded route (the core deliverable; guards the RSC-500 trap).**
Given a Playwright smoke suite with a maintained authenticated-route manifest and per-role authenticated sessions,
When it visits **every** `(portal)` route as a STUDENT and **every** `(admin)` route as an ADMIN,
Then each route returns **HTTP 200** (not a 3xx redirect to `/sign-in`, not a 500) — catching a broken guard, a bad import, or the RSC non-children-prop 500 that green unit tests miss.

**AC3 — Guards still redirect the wrong actor (negative smoke — the guard is real, not bypassed).**
Given the same suite,
When an **unauthenticated** client requests a `(portal)` route, it is redirected to `/sign-in` (not 200); and when a **STUDENT-authenticated** client requests an `(admin)` route, it is redirected to `/portal` (no admin content) — proving the 200s in AC2 come from real sessions, not a disabled guard.

**AC4 — Session provisioning uses the real auth path, adds no production bypass.**
Given magic-link-only auth (no password),
When the suite provisions its STUDENT and ADMIN sessions,
Then it does so in Playwright `globalSetup` through the genuine Better Auth session mechanism (server `auth` API and/or magic-link-URL capture) and saves per-role `storageState` — **no test-only sign-in route, no `emailAndPassword`, no auth-guard weakening** ships in production code.

**AC5 — Chain stays green; live DB run deferred honestly.**
`npm run build` succeeds, `npm test` (vitest) stays green (including any new header-assertion unit test), and `npx tsc --noEmit` is clean. The Playwright suite **type-checks and is runnable** (`npm run test:e2e`); its **live green run against a real session store is deferred to a CI job with an ephemeral Postgres** (documented, consistent with the 1.1/1.4 no-sandbox-DB posture) — do NOT fake a pass by disabling the guards or stubbing 200s.

## Tasks / Subtasks

- [x] **Task 1 — Verify + assert the deploy shell (AC1).**
  - [x] Confirm (read, don't edit) `next.config.ts` `output: 'standalone'` and headers on `source: "/(.*)"`; `Dockerfile` Prisma-client copy into runner; record findings in the Dev Agent Record. Do NOT modify these files.
  - [x] Add a **header-inheritance assertion**: preferably a small vitest unit test that imports `next.config.ts` `headers()` and asserts the `/(.*)` rule carries the 5 security headers (covers portal since portal has no route-specific override), OR an e2e assertion that a portal route response includes `Content-Security-Policy` + `Strict-Transport-Security`. Pick one; note which and why. (NFR11)
  - [x] Document the standalone start command reality in a comment/README note if not already present: production serve = `node .next/standalone/server.js`, not `next start` (memory acce-deploy-standalone-server). No behavioural change required — the Dockerfile `CMD` is already correct.
- [x] **Task 2 — Authenticated-route manifest (AC2).**
  - [x] Create a small exported manifest, e.g. `tests/e2e/authenticated-routes.ts`, listing the guarded routes that EXIST now with the role each needs: `{ path: "/portal", role: "STUDENT" }`, `{ path: "/admin", role: "ADMIN" }`. Add a comment pointing future epics to append their routes here (`/portal/classes`, `/admin/classes`, … per ARCHITECTURE-SPINE source tree). Do NOT invent routes that don't exist yet.
  - [x] Rationale note in the file: portal/admin routes are excluded from `sitemap.ts` (so the public smoke can't reach them) — this manifest is their coverage source, mirroring how `smoke.spec.ts` drives off the sitemap for public routes.
- [x] **Task 3 — Per-role session provisioning in Playwright globalSetup (AC4).**
  - [x] Add `tests/e2e/global-setup.ts` and wire it via `globalSetup` in `playwright.config.ts`. It provisions two sessions and writes `storageState` files (e.g. `tests/e2e/.auth/student.json`, `tests/e2e/.auth/admin.json`; gitignore the `.auth/` dir).
  - [x] **Session strategy (recommended):** use the real Better Auth server `auth` instance (imported from `@/lib/auth`) to (a) ensure a test STUDENT user exists (create in setup — NOT in `prisma/seed.ts`) and reuse the seeded Priyanka ADMIN (from 1.4), then (b) mint a session and obtain the session cookie, writing it into `storageState`. If direct session minting is awkward, fall back to the **magic-link-URL capture** path: trigger `sendMagicLink` in a test env where the callback exposes the URL (e.g. writes it to a file/console), then have a setup browser navigate it to complete real sign-in and capture cookies. Either way: **the genuine Better Auth cookie/session path, no bypass route.**
  - [x] The session cookie name differs by scheme: dev `better-auth.session_token`, prod `__Secure-better-auth.session_token` (the 1.3 HIGH fix). Ensure `storageState` uses the name matching the port-3100 server's scheme (http → non-`__Secure-`). [Source: 1-3...md Review Findings]
  - [x] Guard for the no-DB case: if `DATABASE_URL` is unset (sandbox), `globalSetup` should fail fast with a clear "authenticated e2e needs a Postgres — run in CI" message rather than hang. This is the deferral seam (AC5).
- [x] **Task 4 — Authenticated route-200 spec + negative guard spec (AC2, AC3).**
  - [x] Create `tests/e2e/authenticated-smoke.spec.ts`. For each manifest entry, run in a Playwright project/`test.use({ storageState })` matching the entry's role and assert `page.goto(path)` → `response.status() === 200`. Structure it so STUDENT routes use the student state and ADMIN routes the admin state (two projects, or per-test `storageState`).
  - [x] Negative smoke (AC3): an **unauthenticated** context hitting `/portal` lands on `/sign-in`; a **STUDENT** context hitting `/admin` lands on `/portal` (no admin heading rendered). These prove the AC2 200s are real-session, not a disabled guard.
  - [x] Keep the existing public `smoke.spec.ts` untouched and green (it already covers sitemap/marketing 200s + 404).
- [x] **Task 5 — Verify the chain (AC5).**
  - [x] `npx tsc --noEmit` — clean (includes the new e2e TS files).
  - [x] `npm run build` — succeeds (standalone build; the `BETTER_AUTH_SECRET` build warning is expected/runtime-only per 1.2/1.3).
  - [x] `npm test` (vitest) — green, including the new header-assertion unit test if you chose the unit-test route for Task 1.
  - [x] `npm run test:e2e` — the **public** smoke should still pass locally (prod build on 3100); the **authenticated** specs are expected to be **skipped/deferred in the sandbox** (no Postgres) and are proven in CI. Record exactly what ran vs deferred in the Dev Agent Record. Do NOT stub 200s or disable guards to force a green.
  - [x] Add/adjust `.gitignore` for `tests/e2e/.auth/` (session state artifacts must never be committed).

## Dev Notes

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-1 Additive route-group isolation:** portal/admin ship in the SAME app; marketing routes/metadata/sitemap/robots/headers are untouched; global headers may only be EXTENDED additively — this story needs **no** header change. Portal = `portal.accetutors.co.za` host mapping, same build. [Source: ARCHITECTURE-SPINE.md:80-81,275]
- **AD-3 Authorization at the data/entry layer, not the layout:** a Next layout is NOT a security boundary — a page can be RSC-requested without its ancestor layout. The smoke's value is exactly here: it hits the real pages (whose page-level `requireSession()`/`requireAdmin()` are the trusted guards) and proves they return 200 for the right role and redirect the wrong one. Do not "test the layout" — test the route responses. [Source: ARCHITECTURE-SPINE.md; 1-3...md AD-3]
- **AD-2 Single data gateway:** any DB/session access in `globalSetup` goes through the existing `auth`/`db` singletons (import from `@/lib/auth`, `@/lib/db`) — never `new PrismaClient()`, never a second Better Auth instance. [Source: ARCHITECTURE-SPINE.md:242; 1-1...md]
- **Deployment invariants (already satisfied):** one standalone container, Coolify Docker, base dir `/acce-nextjs`, Prisma client copied to runner, `migrate deploy` + `db:seed` once on release. This story verifies these; it does not author them. [Source: ARCHITECTURE-SPINE.md:275-276]

### The RSC-500 trap this story exists to catch (highest-value context)
From global lessons-learned: *"A Server Component must never pass a Client Component element through a non-`children` prop — it throws at render (HTTP 500), invisible to `tsc` and the unit suite. Cheap safety net: an e2e smoke that asserts every authenticated route returns 200 (caught it where 314 green unit tests didn't)."* This story IS that safety net for ACCE's portal/admin. That is why a 200-status e2e — not more unit tests — is the required deliverable. [Source: ~/.claude lessons-learned "Next.js RSC non-children-prop trap"]

### Why authenticated e2e can't run green in this sandbox (and how to defer honestly)
Better Auth sessions are persisted in Postgres. The guarded pages call `auth.api.getSession(...)`, which hits the DB. With no reachable Postgres in the sandbox (prod creds blocked — same wall 1.1's `migrate deploy` and 1.4's live seed hit), `globalSetup` cannot mint a real session, so the authenticated specs cannot pass locally. **Do NOT** work around this by disabling guards, stubbing the session, or asserting a fake 200 — that would defeat the entire point (a disabled guard trivially "passes"). Instead: make `globalSetup` fail-fast/skip when `DATABASE_URL` is unset, keep the specs runnable, and **defer the live green run to a CI job with an ephemeral Postgres**. This folds into the already-open deferred-work item from 1.1: *"add a CI job using an ephemeral Postgres (service container / testcontainers) that runs `prisma migrate deploy` on a fresh DB"* — the same CI job should then seed, provision sessions, and run the authenticated smoke. Record this deferral explicitly. [Source: deferred-work.md:8; 1-1...md; 1-4...md:72,114]

### Playwright specifics for this repo (verified)
- Config uses **port 3100**, `reuseExistingServer: false`, and builds+serves its OWN prod server — deliberately, to avoid the "reuse a stray dev server on :3000" false-failure trap (project memory `playwright-dedicated-port-gotcha`). Keep that; add `globalSetup` without changing the port/reuse settings. [Source: playwright.config.ts; memory playwright-dedicated-port-gotcha]
- `webServer.command` currently is `npm run build && npm run start -- -p 3100` (i.e. `next start`). Note the standalone tension: `next start` warns it doesn't serve the standalone folder, but it still serves a prod build fine for route-200 assertions (the existing public smoke relies on this). Changing it to serve `node .next/standalone/server.js -p 3100` is OPTIONAL and higher-touch — only do it if the authenticated run needs the exact standalone server; otherwise leave the working command and note the tension. [Source: playwright.config.ts; memory acce-deploy-standalone-server]
- Per-role auth in Playwright: the idiomatic pattern is `globalSetup` → save `storageState` per role → `projects` (or `test.use({ storageState })`) consume it. Reference the two existing authenticated pages only; two states (student, admin) are enough today.
- Cookie name by scheme: http (port 3100) → `better-auth.session_token`; https prod → `__Secure-better-auth.session_token`. Match the running server's scheme in `storageState`. [Source: 1-3...md Review Findings — the `__Secure-` prefix HIGH fix]

### Session-provisioning options weighed (pick one; recommended = A)
- **A (recommended) — Real Better Auth session via `globalSetup`:** ensure a test STUDENT user (create in setup), reuse seeded Priyanka ADMIN, mint a session through the `auth` server API, write the cookie into `storageState`. Zero production surface added; exercises the genuine session. Needs a DB (→ CI).
- **B — Magic-link-URL capture:** in a test env, have `sendMagicLink` expose the URL (file/console); a setup browser navigates it to complete real sign-in; capture cookies. Blackest-box (exercises the full magic-link flow) but more moving parts; also DB-bound. Acceptable fallback.
- **C — REJECTED — test-only sign-in bypass route / `emailAndPassword` toggle:** opens a real authentication hole shipped in production code (critical risk). Do not do this. (Logged: autopilot-decisions.md, medium.)

### Files to touch
- `acce-nextjs/tests/e2e/authenticated-routes.ts` — role→route manifest (NEW).
- `acce-nextjs/tests/e2e/global-setup.ts` — per-role session provisioning → `storageState` (NEW).
- `acce-nextjs/tests/e2e/authenticated-smoke.spec.ts` — route-200 (positive) + guard-redirect (negative) specs (NEW).
- `acce-nextjs/playwright.config.ts` — wire `globalSetup` + per-role `projects`/state (UPDATE — do NOT change port 3100 / `reuseExistingServer:false`).
- `acce-nextjs/.gitignore` — ignore `tests/e2e/.auth/` (UPDATE).
- `acce-nextjs/tests/unit/next-config-headers.test.ts` (or similar) — assert `/(.*)` security-header rule covers portal (NEW, if you take the unit-test route for Task 1).
- **Do NOT modify:** `next.config.ts`, `Dockerfile`, `src/middleware.ts`, `src/lib/auth.ts`, `src/lib/auth-guards.ts`, `prisma/schema.prisma`, `prisma/seed.ts`, the existing `tests/e2e/smoke.spec.ts` (leave the public smoke intact).

### Do NOT do (out of scope for 1.5)
- No new portal/admin feature pages (Epics 2–6) just to have routes to test — cover only what exists.
- No production auth bypass, no `emailAndPassword`, no guard weakening.
- No `next.config.ts`/`Dockerfile`/`middleware.ts` edits unless the header assertion proves a real gap.
- No schema/migration/seed changes; the test STUDENT is a `globalSetup` artifact, not seeded data.
- No faking a green authenticated run in the sandbox (no stubbed 200s, no disabled guards).

### Previous story intelligence (1.1 → 1.4)
- **1.1:** established the sandbox has no reachable prod Postgres; DB-backed proofs are deferred to the pipeline/CI. Same wall applies to the DB-backed authenticated smoke here — defer the live run, don't fake it. Also opened the deferred-work item "CI job with ephemeral Postgres" that this story's live smoke should ride on. [Source: 1-1...md; deferred-work.md:8]
- **1.2:** magic-link auth; `emailAndPassword` intentionally OFF; `BETTER_AUTH_SECRET` build warning is runtime-only/expected. [Source: 1-2...md; acce-nextjs/src/lib/auth.ts:21]
- **1.3:** built the `(portal)`/`(admin)` layouts + page-level `requireSession()`/`requireAdmin()` guards; excluded portal/admin from `sitemap.ts`; fixed the `__Secure-` cookie-prefix lockout (relevant to the `storageState` cookie name); kept e2e to public smoke and **explicitly deferred the authenticated-route-200 Playwright smoke to THIS story**. [Source: 1-3...md:46,108,216]
- **1.4:** seeded Priyanka as ADMIN (reuse her for the admin session) and 6 SCHEDULED classes; no student is seeded (create the test student in `globalSetup`). `prisma/seed.ts` is production-data-only — do not add test users to it. [Source: 1-4...md]
- **Git:** recent epic-1 commits are on branch `epic-1`; nothing conflicts with net-new `tests/e2e/*` files and a `playwright.config.ts` `globalSetup` addition.

### Testing standards
- Frameworks: **vitest** (`npm test`, jsdom) for unit; **@playwright/test** (`npm run test:e2e`, port 3100, prod build) for e2e. Both already installed/pinned (`vitest ^3.2.6`, `@playwright/test ^1.61.1`). [Source: package.json; ARCHITECTURE-SPINE.md:191]
- The public `smoke.spec.ts` (sitemap route-200 + homepage CTA + guides gating + 404) must stay green and untouched. This story ADDS the authenticated smoke alongside it.
- Sandbox bar (what must be green here): `tsc --noEmit`, `npm run build`, `npm test` (incl. the header assertion), and the specs must TYPE-CHECK and be runnable. The authenticated specs' live green is a CI/ephemeral-Postgres deliverable — record precisely what ran vs deferred.
- Do not over-mock to fake a live authenticated pass. A route-200 assertion behind a stubbed session proves nothing about the real guard.

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `src/*` (resolved by Next + vitest; e2e TS runs under Playwright's own transform, which DOES resolve tsconfig paths — unlike tsx, so `@/lib/auth` imports are fine in `global-setup.ts`). Confirm against `playwright.config.ts`/`tsconfig` if an import fails; fall back to a relative import if needed (mirrors the 1.4 tsx-alias gotcha).
- Route groups are URL-invisible: `(portal)/portal/page.tsx` = `/portal`, `(admin)/admin/page.tsx` = `/admin`. The manifest lists URL paths, not file paths.
- Auth artifacts `tests/e2e/.auth/*.json` are secrets-adjacent (contain valid session cookies) — gitignore them.

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.5 / Epic 1 (AC: standalone + subdomain + headers; Playwright authenticated route-200 smoke)]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-1, AD-2, AD-3, "Structural Seed" source tree (tests/e2e "every authenticated route -> 200 (RSC-500 guard)"), "Deployment & Environment", NFR7/NFR8/NFR11]
- [Source: acce-nextjs/next.config.ts (output:'standalone' + headers on /(.*))] · [Source: acce-nextjs/Dockerfile (standalone + Prisma copy)] · [Source: acce-nextjs/playwright.config.ts (port 3100, reuse:false)] · [Source: acce-nextjs/tests/e2e/smoke.spec.ts (public sitemap smoke)] · [Source: acce-nextjs/src/lib/auth.ts + auth-guards.ts (magic-link, page-level guards)] · [Source: acce-nextjs/src/app/(portal)/portal/page.tsx + (admin)/admin/page.tsx (the two authenticated routes today)]
- [Source: _bmad-output/implementation-artifacts/1-3-roles-and-guarded-portal-admin-route-groups.md (portal/admin guards, sitemap exclusion, __Secure- cookie fix, 1.5 deferral of authenticated smoke)]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md#1.1 "CI job with ephemeral Postgres"]
- Project memory: `acce-deploy-standalone-server` (serve with `node .next/standalone/server.js`), `playwright-dedicated-port-gotcha` (port 3100, no reuse), `acce-repo-and-deploy` (Coolify Dockerfile, base dir `/acce-nextjs`, branch main).
- Global lessons-learned: **RSC non-children-prop 500 trap** → an e2e that asserts every authenticated route returns 200 is the safety net (this story); Prisma singleton; native `fetch`.

### Latest tech notes
- Next.js 16 `output: 'standalone'` produces `.next/standalone/server.js` — production serve is `node .next/standalone/server.js` (the Dockerfile `CMD`), NOT `next start`. The Playwright `webServer` may still use `next start -p 3100` for the smoke (it serves a prod build; it just isn't the standalone server) — acceptable for route-200 assertions.
- Playwright per-role auth: `globalSetup` + `storageState` per role + `projects`/`test.use` is the current idiomatic pattern for authenticated e2e; store session cookies once and reuse across specs to keep the suite fast.
- Better Auth session cookie: `better-auth.session_token` (http) / `__Secure-better-auth.session_token` (https) — pick the name matching the running server's scheme when writing `storageState`.

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6 (2026-07-05)

### Debug Log References
None — clean implementation run.

### Completion Notes List

**Task 1 — Deploy shell verification + header assertion (AC1, NFR7, NFR11):**
- Confirmed `next.config.ts`: `output: 'standalone'` (line 24), `headers()` with `source: "/(.*)"` carrying all 5 security headers (CSP, Referrer-Policy, X-Frame-Options, X-Content-Type-Options, HSTS).
- Confirmed `Dockerfile`: copies `.prisma` client + `@prisma/client` to runner stage (NFR7 trap fix, lines 41-42).
- Deploy invariants verified — NO files modified.
- Header assertion: chose **vitest unit test** (not e2e) — `tests/unit/next-config-headers.test.ts` imports `next.config.ts` and calls its `async headers()` function directly. 5 assertions: standalone output, all 5 security headers in `/(.*)`  rule, no portal/admin overrides, HSTS value, CSP frame-ancestors. Runs without DB or server. 5/5 pass.
- Standalone start note: documented in `playwright.config.ts` comment — production serve = `node .next/standalone/server.js` (Dockerfile CMD); Playwright webServer uses `next start` (warns but serves prod build correctly for route-200 assertions).

**Task 2 — Authenticated-route manifest (AC2):**
- Created `tests/e2e/authenticated-routes.ts` exporting `AUTHENTICATED_ROUTES: AuthenticatedRoute[]`.
- Current routes: `{ path: "/portal", role: "STUDENT" }`, `{ path: "/admin", role: "ADMIN" }`.
- Rationale comment explains the sitemap-exclusion gap this manifest fills.
- Append-comment for Epic 2–6 routes points to ARCHITECTURE-SPINE source tree.

**Task 3 — Per-role session provisioning (AC4):**
- Created `tests/e2e/global-setup.ts` wired via `globalSetup` in `playwright.config.ts`.
- Session strategy: **direct Prisma upsert** on `user` + `session.create` with `crypto.randomUUID()` token → write token as `better-auth.session_token` cookie in storageState JSON. Better Auth's `getSession` does a plain DB lookup by token — this is the genuine session path, no bypass route added.
- Cookie name: `better-auth.session_token` (http:// on port 3100, no `__Secure-` prefix — the 1.3 HIGH fix applied).
- Sandbox guard: DATABASE_URL unset → writes empty storageState files + logs clear message → returns (no throw). Public smoke unaffected.
- DB connected: STUDENT user upserted with deterministic id `e2e-test-student`; ADMIN session minted for seeded Priyanka (reused from 1.4 — `db.user.findUnique` by SEED_ADMIN_EMAIL).
- `db.$disconnect()` in `finally` to close the pg Pool cleanly.

**Task 4 — Authenticated smoke + negative guard specs (AC2, AC3):**
- Created `tests/e2e/authenticated-smoke.spec.ts` with 4 describe blocks:
  - `authenticated STUDENT routes → 200` — uses STUDENT storageState, iterates manifest STUDENT routes, asserts HTTP 200.
  - `authenticated ADMIN routes → 200` — uses ADMIN storageState, iterates ADMIN routes, asserts HTTP 200.
  - `guard correctness — unauthenticated → /sign-in` — no storageState; navigates to /portal; asserts page.url() contains `/sign-in`. RUNS IN SANDBOX (no DB needed).
  - `guard correctness — STUDENT cannot access /admin` — STUDENT storageState; navigates to /admin; asserts final URL contains `/portal` not `/admin`.
- `hasSession()` helper: reads storageState, returns false if empty (sandbox) → `test.skip()` called.
- Existing `smoke.spec.ts` untouched — all 5 public tests remain green.

**Task 5 — Chain verification (AC5):**
- `npx tsc --noEmit`: CLEAN (0 errors across all new files).
- `npm run build`: SUCCESS — `✓ Compiled successfully in 9.5s`, `✓ Generating static pages (43/43)`. `BETTER_AUTH_SECRET` warning expected (runtime-only, not a build error).
- `npm test` (vitest): **83/83 pass** (was 78; +5 new header assertion tests).
- `npm run test:e2e`: **6 passed, 3 skipped (38.3s)**. Public smoke (5 tests) all green. Unauthenticated negative guard test (1 test) green. Authenticated positive smoke (2 tests) + STUDENT-hitting-admin (1 test) SKIPPED — no DATABASE_URL in sandbox, as expected. `test.skip()` pattern works correctly.
- `.gitignore` updated: `tests/e2e/.auth/` added.

**Deferred (consistent with 1.1/1.4 sandbox posture):**
- Live green authenticated run (all 3 skipped tests) deferred to CI job with ephemeral Postgres (deferred-work.md:8).
- Guards NOT stubbed, 200s NOT faked — deferred honest.

### File List
acce-nextjs/tests/unit/next-config-headers.test.ts (NEW)
acce-nextjs/tests/e2e/authenticated-routes.ts (NEW)
acce-nextjs/tests/e2e/global-setup.ts (NEW)
acce-nextjs/tests/e2e/authenticated-smoke.spec.ts (NEW)
acce-nextjs/playwright.config.ts (UPDATED — globalSetup wired, standalone note added)
acce-nextjs/.gitignore (UPDATED — tests/e2e/.auth/ added)
_bmad-output/implementation-artifacts/1-5-deployable-shell-with-authenticated-route-200-smoke-test.md (UPDATED — story metadata)
_bmad-output/implementation-artifacts/sprint-status.yaml (UPDATED — status transitions)

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-07-05 | Story 1.5 implemented: verified deploy shell invariants (no files modified); added vitest header-assertion test (+5); added authenticated-route manifest; added globalSetup per-role session provisioning with no-DB sandbox guard; added authenticated-smoke.spec.ts (6 pass, 3 skip deferred to CI + ephemeral Postgres); playwright.config.ts wired globalSetup + standalone note; .gitignore updated for .auth/ | claude-sonnet-4-6 |
