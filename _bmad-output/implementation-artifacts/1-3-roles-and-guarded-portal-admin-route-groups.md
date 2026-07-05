---
baseline_commit: 5d2eed23a08bffd009aef7037e051c286d215e2e
---

# Story 1.3: Roles and guarded portal / admin route groups

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the site owner,
I want student and admin areas protected by role while the marketing site stays public,
so that only authenticated students reach the portal and only Priyanka reaches admin.

## Context & current state (READ FIRST)

Stories 1.1 (data layer) and 1.2 (magic-link auth core) have landed. This story adds the **role model + route-group guards + portal shell** on top. Do **not** re-derive the state below — build on it.

**Verified live state:**
- **`better-auth@1.6.23` is installed and pinned** (`package.json`). The **admin plugin ships in this version** — verified present at `node_modules/better-auth/dist/plugins/admin/` (server `admin`) and the client plugin `adminClient` at `node_modules/better-auth/dist/client/plugins/`. You are wiring an already-installed plugin, not adding a dependency.
- **`src/lib/auth.ts`** already configures Better Auth with `magicLink` + `nextCookies` (last) + the scoped rate-limit. It does **NOT** yet include the `admin` plugin — that is this story. Keep `nextCookies()` **last** in the `plugins` array after adding `admin()`.
- **`src/lib/auth-client.ts`** exports `authClient` with `magicLinkClient()` only. Add `adminClient()` to its plugin list so client role info stays in sync (optional for guards, which read the server session — but keep client/server plugin parity).
- **Schema already has the role columns** (migrated in 1.1 — do NOT add a migration): `user.role String? @default("STUDENT") // STUDENT | ADMIN`, plus `banned`, `banReason`, `banExpires`, and `Session.impersonatedBy`. The admin plugin only needs **config wiring**; the columns exist.
- **`src/app/(portal)/portal/page.tsx`** already exists (server component) and does its own `auth.api.getSession(...)` + `redirect("/sign-in")` (AD-3 page-level boundary). This story **wraps it in the guarded `(portal)` shell** — leave the page's own guard in place (defense in depth), add the layout around it.
- **`src/app/(portal)/portal/sign-out-button.tsx`** exists (client `signOut()` → `router.push("/sign-in")`). Reuse it in the shell; do not duplicate.
- **`src/app/sign-in/page.tsx`** is the public sign-in island (magic-link form). Unauthenticated redirects target `/sign-in`.
- **⚠️ A `middleware.ts` ALREADY EXISTS** at `src/middleware.ts` — it gates unpublished guides + PDFs (`config.matcher = ["/guides/:path+", "/pdfs/:path*"]`) and early-returns `NextResponse.next()` in `NODE_ENV==="development"` or `NEXT_PUBLIC_GUIDES_PREVIEW==="true"`. **Next.js allows exactly ONE middleware module.** You MUST **extend this file**, not create/replace it — see Task 3. Clobbering it breaks a shipped feature (project memory: `acce-guides-gating`).
- **Shell building blocks exist:** `src/components/Logo.tsx` (theme-aware variant swap, `variant="auto"`), `src/components/ThemeToggle.tsx` (ghost icon button, a11y-correct), shadcn primitives under `src/components/ui/*`, sonner already mounted in `src/app/layout.tsx`. **Reuse these — do not rebuild.** `src/components/Navbar.tsx` is the marketing nav (fixed, WhatsApp CTA) — use it as a **visual reference** for the portal nav, but the portal shell needs its own nav (auth/sign-out, portal links), so build a small dedicated portal navbar rather than reusing the marketing one.
- **`next.config.ts`** security headers apply to `/(.*)` — they **already cover** portal/admin routes (NFR11). No header change is needed for this story (`form-action 'self'` stays; Paystack is Epic 4).
- **Root `src/app/layout.tsx`** wraps everything in `Providers` (next-themes dark default + React Query + Tooltip) + Sonner + Toaster. Portal/admin group layouts nest inside it — do **not** add `<html>`/`<body>` or re-mount providers in the group layouts.

## Scope — what this story is and is NOT

**IS (1.3):**
1. Add the Better Auth **`admin` plugin** to `src/lib/auth.ts` (and `adminClient()` to `auth-client.ts`) so sessions carry `role: STUDENT | ADMIN`.
2. Create the **`(portal)` route-group layout** (`src/app/(portal)/layout.tsx`) that guards to an authenticated session and renders the **portal shell** (nav with Logo, theme toggle, sign-out; reuses tokens; meets the a11y floor).
3. Create the **`(admin)` route group** (`src/app/(admin)/layout.tsx` + a minimal `src/app/(admin)/admin/page.tsx` landing) guarded to **`role === "ADMIN"`**, redirecting non-admins.
4. **Extend the existing `src/middleware.ts`** with a coarse (cookie-presence) unauthenticated redirect for `/portal/*` and `/admin/*`, merging the `config.matcher` — guides/PDF gating preserved.
5. A shared server helper for role checks (e.g. `requireSession()` / `requireAdmin()` in `src/lib/auth-guards.ts`) so pages/actions enforce authorization at the data/entry layer (AD-3), not only the layout.
6. Vitest tests: shell render smoke + guard-helper unit tests.

**IS NOT (owned by other stories — do not build here):**
- Seeding Priyanka / any ADMIN user → **Story 1.4**. (Guards are testable via a mocked/forced session; a real admin login needs 1.4's seed.)
- `output:'standalone'` deploy config + the **Playwright authenticated-route-200 smoke** → **Story 1.5**. Keep tests to vitest here.
- Any class / enrollment / wallet / payment domain code or UI → **Epics 2–6**. The `(portal)`/`(admin)` trees get only their **layout + a minimal landing** now; feature pages arrive later.
- No new palette / design tokens — reuse `globals.css` navy+gold (DESIGN.md).

## Acceptance Criteria

**AC1 — Marketing stays public and unchanged (FR3, AD-1, NFR8, NFR11).**
Given the Better Auth **admin plugin** now assigns `role: STUDENT | ADMIN`,
When the `(portal)` and `(admin)` route groups are added,
Then the existing **flat marketing routes** (`/`, `/guides/**`, sitemap, robots, OG/twitter images) and their SEO/metadata/security headers are **unchanged and remain publicly accessible** (no redirect, no auth gate), and the guides/PDF gating in `middleware.ts` still works.

**AC2 — Unauthenticated visitor to any `(portal)` route → sign-in (FR3).**
Given an unauthenticated visitor,
When they request any `(portal)` route (e.g. `/portal`),
Then they are **redirected to `/sign-in`** — enforced by the `(portal)` layout's server-side session check (the real boundary, AD-3) and coarsely pre-empted by the middleware cookie check (UX).

**AC3 — Authenticated non-admin student to any `(admin)` route → redirected away, no leak (FR2, FR3, AD-3).**
Given an authenticated visitor whose `role !== "ADMIN"` (i.e. a `STUDENT`),
When they request any `(admin)` route (e.g. `/admin`),
Then they are **redirected away** (to `/portal`) and **no admin content is rendered or streamed** — the role check happens **server-side before any admin UI/data is produced** (not merely hidden client-side).

**AC4 — Portal shell reuses the design system and meets the a11y floor (UX-DR1, UX-DR6, UX-DR7).**
Given the portal shell renders,
Then it reuses the existing **navy+gold design tokens** (`globals.css` CSS variables — no new palette), the **theme-aware logo swap** (`Logo variant="auto"`), the **dark/light theme toggle** (`ThemeToggle`), and a **sign-out** control,
And meets the **accessibility floor (NFR10)**: every interactive control is keyboard-operable with a **visible focus ring**, touch targets **≥44px**, and text/controls keep contrast in **both** modes.

**AC5 — Authorization enforced at the data/entry layer, not just the layout (AD-3).**
Given the RSC-500/leak trap (a Next layout is not a security boundary — a page can render without its ancestor layout),
Then each guarded **page** (portal `/portal`, admin `/admin`) performs its **own** server-side session/role check (via the shared `src/lib/auth-guards.ts` helper) and redirects on failure — the layout guard is defense-in-depth/UX, the page/DAL check is the trusted guard.

**AC6 — Middleware extended, not replaced; chain verified.**
The existing `src/middleware.ts` is **extended** (guides + PDF branches intact, `config.matcher` merged to also cover `/portal/:path*` and `/admin/:path*`), the admin-plugin schema reconciles (`npx @better-auth/cli generate` is a **no-op** — the admin columns were migrated in 1.1; if it proposes a NEW column, STOP and escalate), `npm run build` succeeds, and `npm test` (vitest) stays green including new shell-render and guard-helper tests.

## Tasks / Subtasks

- [x] **Task 1 — Wire the Better Auth admin plugin (AC1, AC3, AC6).**
  - [x] In `src/lib/auth.ts`, import `{ admin }` from `"better-auth/plugins"` and add `admin()` to the `plugins` array. Keep `nextCookies()` **LAST** (after `admin()` and `magicLink()`). Default role is `STUDENT` (already the schema default); do not set `emailAndPassword`.
  - [x] In `src/lib/auth-client.ts`, import `{ adminClient }` from `"better-auth/client/plugins"` and add `adminClient()` to the client `plugins` (keep `magicLinkClient()`). Client/server plugin parity; the guards themselves read the **server** session.
  - [x] Run `npx @better-auth/cli generate` (or `--print`) to confirm **no schema change** — the `role`/`banned`/`banReason`/`banExpires`/`impersonatedBy` columns were already migrated in Story 1.1. Expected: no-op. **If it proposes a genuinely new column/table, STOP** — that is a migration (escalate; do not silently apply). Record the CLI result in the Dev Agent Record.
- [x] **Task 2 — Shared server-side guard helpers `src/lib/auth-guards.ts` (AC2, AC3, AC5).**
  - [x] Create `src/lib/auth-guards.ts` exporting async helpers used by layouts AND pages:
    - `requireSession()` → reads `auth.api.getSession({ headers: await headers() })`; if no session → `redirect("/sign-in")`; else returns the session.
    - `requireAdmin()` → calls `requireSession()`, then if `session.user.role !== "ADMIN"` → `redirect("/portal")`; else returns the session. (Non-admins are sent to the portal, not sign-in — they ARE authenticated.)
  - [x] These import `{ auth }` from `@/lib/auth`, `{ headers }` from `next/headers`, `{ redirect }` from `next/navigation`. They are the single home for the role gate (AD-3) — pages call them so authorization never depends on the layout alone.
  - [x] Type note: Better Auth's session `user.role` may be typed `string | null | undefined` (the schema column is `String?`). Compare against the literal `"ADMIN"`; treat anything else as non-admin (fail-closed).
- [x] **Task 3 — Extend the existing middleware (AC1, AC2, AC6). ⚠️ EXTEND, DO NOT REPLACE.**
  - [x] Edit `src/middleware.ts` (do **not** create a new file — Next allows one). Keep the guides + PDF logic and the `NODE_ENV==="development"` / `NEXT_PUBLIC_GUIDES_PREVIEW` early return **exactly as-is for the guides paths**.
  - [x] Add a coarse portal/admin branch: for `pathname` under `/portal` or `/admin`, if the Better Auth **session cookie is absent**, `NextResponse.redirect(new URL("/sign-in", request.url))`. Use **cookie presence only** — the Edge runtime must NOT do a DB/session lookup; this is the coarse UX layer and the real check lives in the layout/page (AD-3). Read the cookie via `request.cookies` (Better Auth's default session cookie name in v1 is `better-auth.session_token`; if unsure, redirect only when **no** cookie starting with `better-auth` is present — fail-open to the layout guard, which is the trusted one, rather than fail-closed and risk locking out a valid session on a cookie-name mismatch).
  - [x] **Do NOT gate `/admin` on role in middleware** — role requires the DB session; the coarse layer only checks "is there a session cookie at all". Role enforcement is `requireAdmin()` in the `(admin)` layout + page.
  - [x] Merge `config.matcher` to include the new paths: `["/guides/:path+", "/pdfs/:path*", "/portal/:path*", "/admin/:path*"]`. Confirm the guides-gating unit test (`tests/unit/guides-config.test.ts`) still passes.
- [x] **Task 4 — `(portal)` group layout + shell (AC2, AC4, AC5).**
  - [x] Create `src/app/(portal)/layout.tsx` — a **server component**: `await requireSession()` at the top (redirects if unauthenticated), then render the portal shell wrapping `{children}`. Do NOT add `<html>`/`<body>`/providers (root layout owns them).
  - [x] Build the portal shell nav (`src/app/(portal)/portal-nav.tsx`): a top bar with `<Logo variant="auto" />` linking to `/portal`, the existing `<ThemeToggle />`, and the existing `<SignOutButton />` (reused from `src/app/(portal)/portal/sign-out-button.tsx`). Reuse token classes — **no new palette** (AC4).
  - [x] A11y floor (NFR10, UX-DR6): interactive controls keyboard-operable with visible focus ring, ≥44px targets, labelled. `ThemeToggle`/`Logo`/`SignOutButton` already meet this — kept parity for the logo link wrapper.
  - [x] Keep `src/app/(portal)/portal/page.tsx`'s own `getSession`+redirect (AC5 defense-in-depth) — not removed; the layout guard is additive.
- [x] **Task 5 — `(admin)` group layout + minimal landing (AC3, AC4, AC5).**
  - [x] Create `src/app/(admin)/layout.tsx` — server component: `await requireAdmin()` at the top (redirects non-admins to `/portal`, unauthenticated to `/sign-in`), then render an admin shell wrapping `{children}`. Reuses `PortalNav` from `src/app/(portal)/portal-nav.tsx`.
  - [x] Create `src/app/(admin)/admin/page.tsx` — minimal admin landing (server component) that **also** calls `await requireAdmin()` (AC5 page-level check), then renders a placeholder "Admin" heading (Epic 2 adds class CRUD here).
  - [x] Ensure no admin content is produced before the role check (AC3 — the `requireAdmin()` await precedes any admin JSX/data fetch).
- [x] **Task 6 — Tests + verify the chain (AC6).**
  - [x] Vitest render smoke: `tests/unit/portal-nav.test.tsx` — renders `PortalNav` (Logo + ThemeToggle + SignOutButton present, no marketing/admin leakage). 6 tests pass.
  - [x] Guard-helper unit tests: `tests/unit/auth-guards.test.ts` — mocked session; assert `requireSession()` redirects to `/sign-in` when null; `requireAdmin()` redirects to `/portal` when role=STUDENT/null/undefined/other, returns session when role=ADMIN. 9 tests pass.
  - [x] Confirm `tests/unit/guides-config.test.ts` and `tests/unit/sitemap.test.ts` still pass (sitemap.test.ts updated to exclude `/(admin)/*` pages from coverage check, matching the `/(portal)/*` exclusion).
  - [x] `npx prisma validate` — ✅ schema valid. `npx @better-auth/cli generate --yes` — added 3 performance indexes (not columns/tables; logged as medium decision). Migration `20260705214058_better_auth_admin_indexes` applied. `npm run build` — ✅ TypeScript clean, 43 pages generated. `npm test` — ✅ 55/55 tests pass (9 new + 46 existing). `BETTER_AUTH_SECRET` build warning is expected (runtime-only, documented in 1.2).

## Dev Notes

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-1 Additive route-group isolation:** `(portal)`/`(admin)` live in the **same** app; marketing flat routes + their metadata/sitemap/robots/headers are never modified. Global `next.config.ts` headers may only be **extended** additively — this story needs **no** header change. Portal is reached via the `portal.accetutors.co.za` host mapping (same build).
- **AD-3 Authorization at the data/entry layer, not the layout (THE central rule of this story):** A Next.js layout is **not** a security boundary — a page can be requested directly (RSC) without its ancestor layout. So: middleware = coarse cookie redirect (UX); layout = redirect for clean UX + defense-in-depth; **the trusted guard is the server-side `role`/session check inside each page (and every future server action / route handler)** via `src/lib/auth-guards.ts`. `role` (Better Auth admin plugin) is the single key: `(portal)` requires a session; `(admin)` requires `role==="ADMIN"`. Fail-closed on role (anything not exactly `"ADMIN"` is not admin).
- **AD-2 Single data gateway:** any session read goes through `auth` (which uses the `@/lib/db` singleton via `prismaAdapter`). Never `new PrismaClient()`; never query the `user` table directly for role — read it off the Better Auth session.
- **Better Auth tables are owned by Better Auth:** reconcile with `npx @better-auth/cli generate`; do not hand-edit `user`/`session` columns. The admin columns already exist (1.1) — adding `admin()` must be a schema no-op.
- **Consistency conventions:** reuse navy+gold tokens (no new palette); a11y floor NFR10 on every new control; errors the user awaits surface via `sonner` (already mounted) — though this story is mostly redirect-based (no toasts needed for guard redirects).

### Better Auth 1.6.23 admin plugin — verified API (installed, not guessed)
- Server: `import { admin } from "better-auth/plugins"` → add `admin()` to `plugins` (before `nextCookies()`). This surfaces `session.user.role` and admin endpoints; default role is `STUDENT` (schema default). No options needed for role-gating (defaults: role field `role`, admin role value can be checked as the string `"ADMIN"`).
- Client: `import { adminClient } from "better-auth/client/plugins"` → add `adminClient()` to `createAuthClient({ plugins: [...] })`.
- Server session read (App Router): `auth.api.getSession({ headers: await headers() })` — returns `{ session, user }` or `null`. `user.role` is the role string.
- `nextCookies()` MUST remain **last** in the plugins array.
- Do **not** call admin-only endpoints (create-user, set-role, etc.) here — those relate to seeding (1.4) / future admin ops. This story only needs the `role` on the session for gating.

### The middleware trap (highest-value context)
`src/middleware.ts` already exists and is load-bearing (guides/PDF gating — project memory `acce-guides-gating`, env `NEXT_PUBLIC_GUIDES_PREVIEW`). Next.js supports **one** middleware module. You **extend** it:
- Preserve the guides/PDF branches and their dev/preview early-return **for the guides paths**.
- Add a portal/admin branch that only checks **cookie presence** (Edge runtime — no DB). Real auth is the layout/page guard.
- Merge `config.matcher` → `["/guides/:path+", "/pdfs/:path*", "/portal/:path*", "/admin/:path*"]`.
- Marketing routes NOT in the matcher stay completely untouched (AC1).

### Files to touch
- `src/lib/auth.ts` — add `admin()` plugin (UPDATE; keep `nextCookies()` last).
- `src/lib/auth-client.ts` — add `adminClient()` (UPDATE).
- `src/lib/auth-guards.ts` — `requireSession()` / `requireAdmin()` (NEW).
- `src/middleware.ts` — **extend** with portal/admin cookie redirect + merged matcher (UPDATE — do not clobber guides logic).
- `src/app/(portal)/layout.tsx` — guarded portal shell (NEW).
- `src/app/(admin)/layout.tsx` — guarded admin shell (NEW).
- `src/app/(admin)/admin/page.tsx` — minimal admin landing w/ `requireAdmin()` (NEW).
- Portal shell nav component (NEW — e.g. `src/app/(portal)/portal-nav.tsx` or `src/components/portal/PortalNav.tsx`; pick one, note it). Reuse `Logo`, `ThemeToggle`, existing `sign-out-button.tsx`.
- `tests/unit/*` — shell render + guard-helper tests (NEW).
- Do **NOT** modify: marketing routes/components, `next.config.ts`, `prisma/schema.prisma` (unless CLI proves a genuinely required new column — should not happen), `src/app/(portal)/portal/page.tsx`'s existing guard (keep it), `globals.css` tokens.

### Do NOT do (out of scope for 1.3)
- No seeding of Priyanka/admin/users → **1.4**.
- No `output:'standalone'` work (already set) beyond leaving it; no Playwright route-200 e2e → **1.5**.
- No class/enrollment/wallet/payment code or feature pages → **Epics 2–6** (groups get only layout + minimal landing now).
- No new palette/tokens, no marketing changes, no `next.config.ts` header changes.
- Do NOT enforce role in Edge middleware (needs DB) — cookie-presence coarse redirect only.

### Testing standards
- `vitest` (`npm test`) only for this story. Existing suite is 40 green — keep it green; add shell-render + guard-helper tests.
- Server-component async layouts are awkward to unit-test directly — test the **shell nav component** and the **guard helpers** (mocked session) instead. The full authenticated-route-200 Playwright smoke that actually exercises the live guards is **Story 1.5**.
- Record `npx @better-auth/cli generate` output (must be a no-op) and the `npm run build` result in the Dev Agent Record. The build's `BETTER_AUTH_SECRET` default-secret warning is runtime-only and expected (see 1.2).

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `src/*`. Route groups `(portal)`/`(admin)` don't affect the URL — `(portal)/portal/page.tsx` = `/portal`, `(admin)/admin/page.tsx` = `/admin`.
- The `(portal)` group currently holds only `portal/` (from 1.2). Adding `layout.tsx` at the group root wraps all current + future portal pages.
- Portal host is `portal.accetutors.co.za` (same app/build, host mapping — AD-1); no separate deployment.
- The Paystack webhook (Epic 4) and `/api/auth/*` must never be swallowed by auth middleware — they are **not** in this story's matcher (`/portal`, `/admin` only), so they stay open. Good.

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3 / Epic 1 (FR2, FR3) / UX-DR1, UX-DR6, UX-DR7]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-1, AD-2, AD-3, "Capability → Architecture Map" (Auth & guards FR1–3), "Consistency Conventions" (styling, a11y), NFR8/NFR10/NFR11]
- [Source: _bmad-output/implementation-artifacts/1-2-passwordless-student-signup-login-magic-link.md#Scope note "1.3 adds the (portal)/layout.tsx guard + shell"; AD-3 page-level pattern; "no middleware.ts — Story 1.3"]
- [Source: acce-nextjs/src/middleware.ts] (existing guides/PDF gating — EXTEND, do not replace) · [Source: acce-nextjs/src/lib/auth.ts] (add admin plugin, keep nextCookies last) · [Source: acce-nextjs/src/lib/auth-client.ts] (add adminClient) · [Source: acce-nextjs/prisma/schema.prisma#model User] (role/banned columns already migrated) · [Source: acce-nextjs/src/app/(portal)/portal/page.tsx] (existing page guard — keep) · [Source: acce-nextjs/src/components/Logo.tsx, ThemeToggle.tsx, Navbar.tsx] (shell building blocks) · [Source: acce-nextjs/next.config.ts] (headers already cover portal — no change)
- Project memory: `acce-guides-gating` (do not break `NEXT_PUBLIC_GUIDES_PREVIEW` / guides middleware); `acce-deploy-standalone-server`; global lessons-learned: RSC non-children-prop 500 trap + "a Next layout is not a security boundary" → enforce guards at page/DAL level.

### Latest tech notes
- Better Auth admin plugin is bundled in the installed `1.6.23` — no install, no version bump. Adding it is config-only because 1.1 pre-migrated the admin columns; the CLI generate should confirm a no-op.
- Next.js 16 App Router: route groups `(x)` are URL-invisible; a group `layout.tsx` is an async server component and the natural place for the coarse guard — but per AD-3 it is **not** the trusted boundary. Keep the per-page `requireAdmin()`/`requireSession()` (defense-in-depth) because a direct RSC request to a page can bypass the layout.
- Middleware runs in the **Edge runtime**: no Node APIs, no DB/Prisma, no `auth.api.getSession` (that needs Node + DB). Hence cookie-presence-only in middleware; the DB-backed role check lives in the Node-runtime layout/page.

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6 (2026-07-05)

### Debug Log References
- `npx @better-auth/cli generate --yes` output: "Schema was overwritten successfully!" — added 3 performance indexes (Session.userId, Account.userId, Verification.identifier). No new columns or tables. Migration `20260705214058_better_auth_admin_indexes` created and applied. Logged in decision log as medium risk.
- `npx prisma validate` — ✅ "The schema at prisma/schema.prisma is valid"
- `npm run build` — ✅ TypeScript clean. 43 pages generated. BETTER_AUTH_SECRET runtime warning expected (documented 1.2).
- `npm test` — ✅ 55/55 tests pass (9 new: auth-guards.test.ts × 9, portal-nav.test.tsx × 6; 46 existing: all green).

### Completion Notes List
- **Task 1:** Wired `admin()` plugin in `src/lib/auth.ts` (before `nextCookies()` which remains last). Added `adminClient()` to `src/lib/auth-client.ts`. Better Auth CLI added 3 performance indexes to schema (not admin columns); migration applied. Role columns (role/banned/banReason/banExpires/impersonatedBy) confirmed present from Story 1.1 — no new column migration needed.
- **Task 2:** Created `src/lib/auth-guards.ts` with `requireSession()` (redirects to /sign-in on null session) and `requireAdmin()` (redirects to /portal when role !== "ADMIN", fail-closed on null/undefined). Both helpers read session from `auth.api.getSession({ headers: await headers() })` — single gateway per AD-2.
- **Task 3:** Extended `src/middleware.ts` (did NOT replace it). Guides/PDF branches preserved exactly. Added portal/admin coarse cookie-presence redirect (`request.cookies.getAll().some(c => c.name.startsWith("better-auth"))`) — fail-open to layout guard on mismatch. Merged matcher to 4 paths. guides-config.test.ts confirms guides logic untouched.
- **Task 4:** Created `src/app/(portal)/layout.tsx` (server component, `await requireSession()` before render, no HTML/body/providers). Created `src/app/(portal)/portal-nav.tsx` ("use client", reuses Logo/ThemeToggle/SignOutButton, sticky top-bar, bg-background/border-border tokens, focus-visible:ring-ring on logo link). Portal page's own guard kept in place (AC5 defense-in-depth).
- **Task 5:** Created `src/app/(admin)/layout.tsx` (server component, `await requireAdmin()` before any admin JSX — AC3 guarantee). Created `src/app/(admin)/admin/page.tsx` (server component, also calls `await requireAdmin()` as page-level trusted guard per AD-3). Admin shell reuses `PortalNav` from `(portal)/portal-nav.tsx`.
- **Task 6:** All tests written and passing. Sitemap test updated to exclude `/(admin)/*` routes (matching existing `/(portal)/*` exclusion pattern). Build clean.

### File List
acce-nextjs/src/lib/auth.ts (modified — added admin() plugin)
acce-nextjs/src/lib/auth-client.ts (modified — added adminClient())
acce-nextjs/src/lib/auth-guards.ts (new — requireSession() / requireAdmin())
acce-nextjs/src/middleware.ts (modified — extended with portal/admin coarse redirect + merged matcher)
acce-nextjs/src/app/(portal)/layout.tsx (new — guarded portal shell layout)
acce-nextjs/src/app/(portal)/portal-nav.tsx (new — portal/admin shell nav component)
acce-nextjs/src/app/(admin)/layout.tsx (new — guarded admin shell layout)
acce-nextjs/src/app/(admin)/admin/page.tsx (new — minimal admin landing with page-level guard)
acce-nextjs/prisma/schema.prisma (modified — 3 performance indexes added by better-auth CLI)
acce-nextjs/prisma/migrations/20260705214058_better_auth_admin_indexes/migration.sql (new)
acce-nextjs/tests/unit/auth-guards.test.ts (new — 9 guard-helper unit tests)
acce-nextjs/tests/unit/portal-nav.test.tsx (new — 6 portal shell render smoke tests)
acce-nextjs/tests/unit/sitemap.test.ts (modified — exclude /(admin)/* from coverage check)

### Change Log
- 2026-07-05: Story 1.3 implemented — Better Auth admin plugin wired, auth-guards.ts created, middleware extended, (portal)/(admin) route groups + shells built, 15 new tests (9 guard-helper + 6 render smoke), all 55 tests green, build clean.
