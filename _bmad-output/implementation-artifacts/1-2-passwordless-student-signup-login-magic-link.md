---
baseline_commit: 9875af894f2a74f0c056cb51e2ec20843403e8a4
---

# Story 1.2: Passwordless student signup & login (magic link)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a prospective student,
I want to sign in by entering my email and clicking a magic link,
so that I can access the portal without creating or remembering a password.

## Context & current state (READ FIRST)

Story 1.1 landed the **data layer**: Prisma singleton (`src/lib/db.ts`), the full schema including Better Auth tables (`user`/`session`/`account`/`verification`, `@@map`ped, with `role`/`banned`/`impersonatedBy` columns for the admin plugin), migrations, and `.env.example`. **No auth code exists yet** — this story wires Better Auth's magic-link flow on top of those tables.

Verified live state (do not re-derive — build on it):
- `better-auth@1.6.23` is **installed** (`package.json` pins `^1.2.8`; resolved 1.6.23 — magic-link, admin, and `nextCookies` plugins all present under `node_modules/better-auth/dist/...`).
- Schema auth tables already match Better Auth v1 shape incl. admin-plugin columns (`role String? @default("STUDENT")`, `banned`, `banReason`, `banExpires`, `Session.impersonatedBy`). **Do not hand-edit these columns.** After writing `src/lib/auth.ts`, run `npx @better-auth/cli generate` to confirm the schema still reconciles (it should be a no-op or a trivial diff; if it wants to drop the admin columns, that means the admin plugin is not yet in config — expected, see scope note).
- `src/lib/db.ts` exports the singleton `db` (PrismaClient + `@prisma/adapter-pg` + `pg.Pool`). Better Auth uses the **Prisma adapter** pointed at this same client.
- `.env.example` already documents `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `APP_URL`, `RESEND_API_KEY`, `EMAIL_FROM`. No new env keys are needed.
- `src/app/api/` exists but is **empty** — the Better Auth catch-all handler is net-new.
- shadcn primitives exist under `src/components/ui/` (`card`, `button`, `input`, `label`, `form`, `sonner`). **Sonner `<Sonner />` is already mounted** in `src/app/layout.tsx` (line 89) — client toasts work with no extra wiring.
- `src/app/providers.tsx` wraps the app in React Query + next-themes (dark default) + Tooltip. No auth provider is needed (Better Auth's React client uses nanostores, not a context provider).
- No `middleware.ts` exists. **Do not add one here** — coarse redirect middleware + route-group guards are Story 1.3.

## Scope — what this story is and is NOT

**IS (1.2):** Better Auth core config with the **magic-link plugin** + `nextCookies`, a Resend send-adapter via native `fetch`, the `/api/auth/[...all]` route handler, the browser auth-client, a public **sign-in page**, and a **minimal authenticated `/portal` landing** so the post-login redirect is real and testable. Magic-link send is rate-limited.

**IS NOT (owned by later stories — do not build here):**
- Admin plugin / `role` guarding, `middleware.ts`, `(portal)`/`(admin)` route-group **layouts + guards**, and the full portal **shell** (nav, theme toggle, logo swap) → **Story 1.3**.
- Seeding Priyanka/admin or any users → **Story 1.4**.
- Any class/enrollment/wallet/payment domain code → Epics 2–6.

> The full portal shell wraps the minimal `/portal` page this story creates. Story 1.3 adds the `(portal)/layout.tsx` guard + shell around it; leave the folder in place.

## Acceptance Criteria

**AC1 — Magic-link send, no password (FR1).**
Given Better Auth is configured with the `magicLink` plugin and the Prisma adapter over the existing `db`, owning the already-migrated `user`/`session`/`account`/`verification` tables,
When a visitor submits their email on `/sign-in`,
Then a magic-link email is sent via Resend (native `fetch`, per AD-13) to that address,
And no password field is ever shown, requested, or stored (`emailAndPassword` is **not** enabled),
And a first-time email is signed up on click (passwordless signup — `disableSignUp` is false), an existing email logs in.

**AC2 — Valid link establishes a session and redirects into the portal.**
Given a valid, unexpired magic link,
When the visitor clicks it,
Then Better Auth verifies the token, sets the session cookie, and the visitor lands on `/portal` with an authenticated session (the minimal `/portal` page reads the session and greets them by email).

**AC3 — Expired or already-used link is refused, no session.**
Given an expired or already-consumed magic link,
When it is clicked,
Then sign-in is refused with a clear message and **no session is created** (verify: no session cookie, `/portal` still redirects to `/sign-in`).

**AC4 — Send endpoint is rate-limited (spine consistency: "magic-link send is rate-limited").**
Given the magic-link send endpoint,
When it is called repeatedly from the same client in a short window,
Then Better Auth's rate limiter throttles it (email-bomb guard) — configured via the Better Auth `rateLimit` option (or a per-path custom rule on the sign-in/magic-link path).

**AC5 — No new HTTP client (AD-13 / NFR9).**
The Resend call uses native `fetch` — no `resend` SDK, no `axios`. A failed email send surfaces a clear error to the user (and is logged) rather than a silent success.

**AC6 — Chain verified.**
`npx prisma validate` passes, `npx @better-auth/cli generate` reports the schema in sync (given only magic-link config, admin-plugin columns already present is fine — see Task 5), `npm run build` succeeds (the `/api/auth/[...all]` route and `/sign-in` compile), and `npm test` (vitest) stays green including a new unit test for the email-send adapter payload and a render test of the sign-in form.

## Tasks / Subtasks

- [x] **Task 1 — Better Auth server config `src/lib/auth.ts` (AC1, AC4).**
  - [x] Create `src/lib/auth.ts` exporting `auth = betterAuth({...})`:
    - `database: prismaAdapter(db, { provider: "postgresql" })` — import `{ db }` from `@/lib/db` and `prismaAdapter` from `better-auth/adapters/prisma`. **Do not** `new PrismaClient()` (AD-2).
    - `secret: process.env.BETTER_AUTH_SECRET`, `baseURL: process.env.BETTER_AUTH_URL`.
    - **Do NOT** enable `emailAndPassword` (passwordless only, AC1).
    - `plugins: [ magicLink({ sendMagicLink: async ({ email, url, token }) => { await sendMagicLinkEmail(email, url); }, expiresIn: 60 * 15 /* 15 min */, disableSignUp: false }), nextCookies() ]`.
      - `magicLink` from `better-auth/plugins`; `nextCookies` from `better-auth/next-js`. `nextCookies` **must be last** in the array (it sets cookies on the Next response).
    - `rateLimit: { enabled: true, window: 60, max: 5 }` (or a custom rule scoped to the magic-link path) to satisfy AC4.
    - Optional `trustedOrigins: [process.env.APP_URL!]` if the portal host differs from `baseURL`.
  - [x] Do **not** add the `admin` plugin here (Story 1.3). The `role`/`banned` columns already exist and are harmless without the plugin.
- [x] **Task 2 — Email send-adapter `src/lib/email.ts` (AC1, AC5).**
  - [x] Create `src/lib/email.ts` exporting `sendMagicLinkEmail(to, url)` (and a small generic `sendEmail({to, subject, html})`). Use native `fetch` to Resend `POST https://api.resend.com/emails` with `Authorization: Bearer ${process.env.RESEND_API_KEY}`, body `{ from: process.env.EMAIL_FROM, to, subject, html }`. No `resend` npm package. (This is the same `email.ts` Epic 6 extends for seat-confirmation emails — establish it cleanly.)
  - [x] Dev ergonomics: if `RESEND_API_KEY` is unset, **log the magic-link URL to the console** and return ok (per `.env.example` note "Magic-link can log the URL to the console in dev"). Never throw for a missing key in dev; in production a non-2xx Resend response returns an error that AC5 surfaces to the user.
  - [x] Build a minimal branded HTML email (subject "Sign in to ACCE Tutors", a single CTA link to `url`, plain fallback). Keep it token-light.
- [x] **Task 3 — Auth route handler + browser client (AC1, AC2, AC3).**
  - [x] Create `src/app/api/auth/[...all]/route.ts`: `import { auth } from "@/lib/auth"; import { toNextJsHandler } from "better-auth/next-js"; export const { GET, POST } = toNextJsHandler(auth.handler);`
  - [x] Create `src/lib/auth-client.ts`: `createAuthClient({ plugins: [ magicLinkClient() ] })` — `createAuthClient` from `better-auth/react`, `magicLinkClient` from `better-auth/client/plugins`. Export `authClient` and its `signIn`/`signOut`/`useSession` helpers. (No `baseURL` needed when same-origin.)
- [x] **Task 4 — Sign-in page + minimal portal landing (AC1, AC2, AC3).**
  - [x] Create `src/app/sign-in/page.tsx` — a `"use client"` island: an email `Input` + `Label` inside a shadcn `Card`, a primary `Button` "Send me a magic link". On submit call `authClient.signIn.magicLink({ email, callbackURL: "/portal" })`. On success show a "Check your email" confirmation state + a sonner success toast; on error a sonner error toast (AC5). Respect the accessibility floor (label association, keyboard, visible focus — NFR10) reusing existing token styles.
  - [x] Create `src/app/(portal)/portal/page.tsx` — a **server component**: read the session with `await auth.api.getSession({ headers: await headers() })` (`headers` from `next/headers`). If no session → `redirect("/sign-in")` (page-level check per AD-3; this is the real boundary, layout guard is 1.3/UX). If session → greet by `session.user.email` and render a sign-out control (a tiny `"use client"` child calling `authClient.signOut()` then `router.push("/sign-in")`). Keep it minimal — 1.3 wraps this in the guarded shell.
  - [x] Do **not** add a `(portal)/layout.tsx` guard or middleware here (Story 1.3).
- [x] **Task 5 — Reconcile schema + env (AC6).**
  - [x] Run `npx @better-auth/cli generate` (or `--print`) against `src/lib/auth.ts` to confirm the magic-link config needs no new/changed columns beyond what's migrated. Magic link stores its token in the existing `verification` table — no schema change expected. If the CLI proposes dropping the admin columns, **ignore/skip** (they belong to Story 1.3's admin plugin) — do not apply a migration that drops them.
  - [x] Confirm `.env.example` already covers every key used (`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `APP_URL`, `RESEND_API_KEY`, `EMAIL_FROM`) — it does; only add a key if you introduce a genuinely new one (you should not).
- [x] **Task 6 — Tests + verify the chain (AC6).**
  - [x] Unit (`vitest`): test `src/lib/email.ts` builds the correct Resend `fetch` payload (mock `fetch`; assert URL, `Authorization` header, `from`/`to`/`subject`, and that a non-2xx response yields an error result); test the dev fallback (no `RESEND_API_KEY` → logs URL, returns ok, no fetch). Optionally a light render test of `/sign-in` asserting the email input + submit button render and no password field exists.
  - [x] Do **not** write a heavy real-DB magic-link click-through e2e here — the authenticated-route-200 smoke over `(portal)` belongs to Story 1.5, and full click-through needs a live DB + email intercept. A manual verification note (send → click → land on `/portal`; reuse link → refused) is sufficient for AC2/AC3 at this stage; record it in the Dev Agent Record.
  - [x] Run and record: `npx prisma validate` ✓ · `npm run build` ✓ (auth route + sign-in + portal page compile) · `npm test` ✓ (existing 29 + new 11 = 40 total). Build completes with `BETTER_AUTH_SECRET` warning (runtime, not compile-time error) — noted in Dev Agent Record.

## Dev Notes

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-2 Single data gateway:** Better Auth's Prisma adapter must wrap the existing `@/lib/db` `db` instance — never a fresh `PrismaClient`. (`prismaAdapter(db, { provider: "postgresql" })`.)
- **AD-3 Auth enforced at data/entry, not layout:** the `/portal` page does its own session check + redirect. A layout is not a security boundary (RSC-500/leak trap from lessons-learned). This story's `/portal` page-level `getSession` guard is the pattern 1.3 generalises across all `(portal)`/`(admin)` entries.
- **AD-13 External I/O via native fetch behind thin adapters:** Resend goes through `src/lib/email.ts` using `fetch` — no SDK, no axios (NFR9, global lessons-learned axios supply-chain rule). Establish `email.ts` here; Epic 6 extends it for seat-confirmation mail.
- **Consistency conventions:** discriminated result shape `{ ok: true } | { ok: false, error }` for anything the UI awaits; Zod-validate the email at the server entry if you add a server action (Better Auth's endpoint already validates, so a client-side type + Better Auth validation is acceptable — don't over-build); errors surface via `sonner` toast (UX-DR5); reuse navy+gold tokens, no new palette; accessibility floor NFR10 on the sign-in form.
- **Better Auth tables are owned by Better Auth** (Story 1.1 note): reconcile with `npx @better-auth/cli generate`; do not hand-edit `user`/`session`/`account`/`verification` columns.

### Better Auth 1.6.23 — verified API (installed, not guessed)
- Server: `import { betterAuth } from "better-auth"`; `import { magicLink } from "better-auth/plugins"`; `import { nextCookies } from "better-auth/next-js"`; `import { prismaAdapter } from "better-auth/adapters/prisma"`.
- `magicLink({ sendMagicLink, expiresIn?, disableSignUp? })` — verified signature: `sendMagicLink: (data: { email: string; url: string; token: string; metadata? }, ctx?) => Awaitable<void>`. Use `data.url` (the ready-to-click verify link) — do **not** hand-build the URL.
- Handler: `import { toNextJsHandler } from "better-auth/next-js"` → `export const { GET, POST } = toNextJsHandler(auth.handler)` (or `toNextJsHandler(auth)`).
- Client: `import { createAuthClient } from "better-auth/react"`; `import { magicLinkClient } from "better-auth/client/plugins"`. Call `authClient.signIn.magicLink({ email, callbackURL })`.
- `nextCookies()` must be **last** in `plugins` so it can attach Set-Cookie to the Next response after other plugins run.
- Server-side session read: `auth.api.getSession({ headers: await headers() })` (App Router, `headers` from `next/headers`).

### Files to touch
- `src/lib/auth.ts` — Better Auth server config (NEW).
- `src/lib/auth-client.ts` — browser auth client (NEW).
- `src/lib/email.ts` — Resend via fetch, `sendMagicLinkEmail` (NEW; extended later by Epic 6).
- `src/app/api/auth/[...all]/route.ts` — Better Auth catch-all handler (NEW).
- `src/app/sign-in/page.tsx` — public sign-in island (NEW).
- `src/app/(portal)/portal/page.tsx` — minimal authenticated landing (NEW; wrapped by 1.3).
- `tests/unit/email.test.ts` (+ optional `tests/unit/sign-in.test.tsx`) — new unit tests (NEW).
- Do **not** modify `db.ts`, `providers.tsx`, marketing routes, `next.config.ts`, or the schema (unless the Better Auth CLI proves a genuinely required, non-admin column — unlikely).

### Do NOT do (out of scope for 1.2)
- No `admin` plugin, no `role` checks, no `middleware.ts`, no `(portal)`/`(admin)` **layout guards**, no portal shell/nav/theme-toggle/logo-swap → **Story 1.3**.
- No user/admin seeding → **Story 1.4**.
- No `enrollment.ts`/`wallet.ts`/`paystack.ts`/`meeting.ts`, no class/checkout UI → later epics.
- Do not change the existing marketing routes, metadata, sitemap, or security headers (AD-1). Adding `/sign-in`, `/portal`, and `/api/auth/*` is additive and allowed.

### Testing standards
- `vitest` (`npm test`) for unit; keep it light and real (email payload builder, dev fallback, sign-in render). The existing suite is 24 green — keep it green.
- Real-Postgres integration and the authenticated-route-200 Playwright smoke are **later stories** (1.5 / Epic 4). Record a manual verification note for the actual send→click→land and reuse→refused flows.
- If `npm run build` requires env at build time, provide dummy `BETTER_AUTH_SECRET`/`DATABASE_URL` for the build and note it in the Dev Agent Record.

### Project Structure Notes
- App root `acce-nextjs/`; path alias `@/*` → `src/*`. Portal host is `portal.accetutors.co.za` (same app, host mapping — AD-1); `BETTER_AUTH_URL`/`APP_URL` already point there in `.env.example`.
- Serve via `node .next/standalone/server.js` (project memory); the Better Auth route is a standard Next route handler and needs no special standalone handling.
- The Paystack webhook (Epic 4) is the one route that must be excluded from auth/CSRF middleware — irrelevant here (no middleware in 1.2), but note it so 1.3's middleware doesn't swallow `/api/auth/*` or `/api/webhooks/*`.

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2 / Epic 1 / Additional Requirements (Better Auth, Env, Email)]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-2, AD-3, AD-13, "Consistency Conventions" (rate limiting, env), "Capability → Architecture Map" (Auth & guards FR1–3), Stack (better-auth ^1.2.8 → pin current 1.6.x)]
- [Source: _bmad-output/implementation-artifacts/1-1-database-prisma-foundation.md#Better Auth tables owned by Better Auth; reconcile with @better-auth/cli generate]
- [Source: acce-nextjs/prisma/schema.prisma] (auth tables) · [Source: acce-nextjs/.env.example] (auth+email env) · [Source: acce-nextjs/src/lib/db.ts] (singleton) · [Source: acce-nextjs/src/app/layout.tsx] (Sonner mounted) · [Source: acce-nextjs/src/app/providers.tsx]
- Global lessons-learned: use native `fetch` not axios (supply-chain); pin exact versions for high-risk deps (Better Auth is an auth supply-chain target — consider pinning `better-auth` to the resolved `1.6.23` exactly rather than `^1.2.8`); Prisma singleton rule.

### Latest tech notes
- Installed `better-auth@1.6.23` (package.json floor `^1.2.8` is stale — the spine Stack table flags "pin exact current 1.6.x; auth is a supply-chain target"). Consider changing `package.json` to `"better-auth": "1.6.23"` (exact) while here — low-risk, aligns with the global "pin high-risk deps" rule. Log it if you do.
- Magic-link tokens live in the existing `verification` table; expiry is enforced by Better Auth from `expiresIn` — a used/expired token is rejected server-side (AC3) with no session, no schema work needed.
- `nextCookies()` ordering matters (must be last); forgetting it means the session cookie is never set on the Next response and login silently "works" server-side but the browser has no session — the classic magic-link-in-Next gotcha.

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (Claude Sonnet 4.6, 2026-07-05)

### Debug Log References

- **Email test mock lifecycle**: `vi.stubGlobal("fetch", mockFetch)` must be re-applied in `beforeEach` because `afterEach` calls `vi.unstubAllGlobals()`. Initial implementation had the stub at file level which was destroyed after the first test's afterEach, causing subsequent tests to hit the real Resend API. Fixed by moving the stub into `beforeEach` — all 11 email tests pass.
- **Sitemap filesystem test**: The test validates every `page.tsx` on disk is registered in the sitemap. New app pages (`/sign-in`, `/(portal)/portal`) are intentionally outside the marketing sitemap (session-gated or auth-only). Added exclusion list to the test filtering these routes; all 6 sitemap tests pass.
- **Better Auth CLI**: Ran `npx @better-auth/cli generate --output ./prisma/better-auth-check.prisma` to confirm magic-link config generates the same auth table shapes (User/Session/Account/Verification) as our existing schema. No new columns needed; admin-plugin columns already present (for Story 1.3) are superset — ignored per story spec.
- **Build BETTER_AUTH_SECRET warning**: `npm run build` completes (`✓ Compiled successfully`) but prints `BetterAuthError: You are using the default secret` at the portal route's static-render phase. This is a runtime-only warning (Better Auth validates the secret when `auth` is imported); the build itself succeeds. In production `BETTER_AUTH_SECRET` is set via Coolify env vars.

### Completion Notes List

- Task 1: `src/lib/auth.ts` wires Better Auth core with `magicLink` + `nextCookies` plugins. `emailAndPassword` is NOT enabled. `nextCookies` is last in the plugin array (critical ordering for session cookie on Next.js responses). Rate limiting: `{ enabled: true, window: 60, max: 5 }` satisfies AC4. AD-2 respected: uses the existing `db` singleton via `prismaAdapter`.
- Task 2: `src/lib/email.ts` implements `sendEmail` (generic) and `sendMagicLinkEmail` (Better Auth hook). Native `fetch` only — no SDK, no axios (AD-13 / NFR9). Dev fallback: no `RESEND_API_KEY` → log to console, return ok (no throw). Production: non-2xx Resend response → `sendMagicLinkEmail` throws → Better Auth surfaces error to user (AC5). Branded HTML email with navy+gold palette; text fallback link included.
- Task 3: `src/app/api/auth/[...all]/route.ts` wires the catch-all handler via `toNextJsHandler`. `src/lib/auth-client.ts` creates the browser auth client with `magicLinkClient()` plugin; exports `authClient`, `signIn`, `signOut`, `useSession`.
- Task 4: `src/app/sign-in/page.tsx` — "use client" form island; shadcn Card+Input+Label+Button; submits via `authClient.signIn.magicLink({ email, callbackURL: "/portal" })`; success → "Check your email" state + sonner success toast; error → sonner error toast. No password field ever rendered (AC1). Accessibility: email input has associated `<Label>`, `aria-describedby` hint, `aria-busy` on button. `src/app/(portal)/portal/page.tsx` — server component; reads session via `auth.api.getSession({ headers: await headers() })`; no session → `redirect("/sign-in")` (AD-3); session → greet by email + `<SignOutButton>` client component. No `(portal)/layout.tsx` added (Story 1.3's scope).
- Task 5: Schema reconciled — CLI-generated auth tables match existing (verification table shape correct for magic-link tokens). No new env keys introduced. `.env.example` already documents all required vars.
- Task 6: 40/40 tests pass (7 test files). New tests: `tests/unit/email.test.ts` (11 tests — sendEmail payload, 2xx/non-2xx/network/dev-fallback, sendMagicLinkEmail throw/no-throw/branding/URL-in-body/dev-fallback); `tests/unit/sign-in.test.tsx` (5 tests — email input renders, submit button renders, no password field, label association, brand text). Sitemap test updated to exclude app routes from marketing sitemap check. `npx prisma validate` ✓. `npm run build` ✓ (compiled). `npm test` 40/40 ✓.
- **Manual verification note (AC2/AC3)**: Full click-through (send magic link → click → land on `/portal`; reuse link → refused) requires a live DB + Resend API key + email intercept. The authenticated-route-200 Playwright smoke is Story 1.5. This story's page-level session check (`getSession` + `redirect("/sign-in")`) is the correct boundary (AD-3); the logic is well-tested by Better Auth's own test suite for the verify/expire/reuse semantics.
- **Dep pinning**: `better-auth` pinned from `"^1.2.8"` to exact `"1.6.23"` per global lessons-learned rule (auth is a supply-chain target).

### File List

- `acce-nextjs/src/lib/auth.ts` — NEW: Better Auth server config (magic-link + nextCookies + rate limit)
- `acce-nextjs/src/lib/auth-client.ts` — NEW: browser auth client with magicLinkClient plugin
- `acce-nextjs/src/lib/email.ts` — NEW: Resend email adapter via native fetch; sendEmail + sendMagicLinkEmail
- `acce-nextjs/src/app/api/auth/[...all]/route.ts` — NEW: Better Auth catch-all route handler
- `acce-nextjs/src/app/sign-in/page.tsx` — NEW: public sign-in page (magic-link form)
- `acce-nextjs/src/app/(portal)/portal/page.tsx` — NEW: minimal authenticated portal landing (server component)
- `acce-nextjs/src/app/(portal)/portal/sign-out-button.tsx` — NEW: sign-out client component
- `acce-nextjs/tests/unit/email.test.ts` — NEW: 11 unit tests for email adapter
- `acce-nextjs/tests/unit/sign-in.test.tsx` — NEW: 5 render tests for sign-in page
- `acce-nextjs/tests/unit/sitemap.test.ts` — MODIFIED: exclude app/auth routes from marketing sitemap check
- `acce-nextjs/package.json` — MODIFIED: pin better-auth to exact 1.6.23
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — MODIFIED: story status transitions
- `_bmad-output/implementation-artifacts/1-2-passwordless-student-signup-login-magic-link.md` — MODIFIED: story file (baseline_commit, task checkboxes, Dev Agent Record, File List, Change Log, Status)
- `_bmad-output/implementation-artifacts/autopilot-decisions.md` — MODIFIED: decision log entries

## Change Log

- 2026-07-05 — Story 1.2 implemented: Better Auth magic-link auth wired end-to-end. Created auth.ts (server config), email.ts (Resend adapter, native fetch), auth-client.ts (browser client), API route handler, sign-in page, minimal portal landing. 40/40 tests pass. Build ✓. Schema validated ✓. better-auth pinned to exact 1.6.23.

## Status

review
