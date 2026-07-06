---
baseline_commit: 2a404e71e033aefde55966590ef4478c9a193429
---

# Story 3.1: View wallet balance and ledger

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a student,
I want to see my wallet balance and a chronological history of ledger entries,
so that I understand what I can spend and where my credit came from.

## Context & current state (READ FIRST)

Epic 1 (`done`) and Epic 2 (`done`) shipped the foundation: DB + Prisma, magic-link auth, guarded
`(portal)`/`(admin)` route groups, seed data, deploy shell, and full admin class CRUD. **This is the
first story of Epic 3** (Browse & Enroll with Wallet Balance) and the **first time the wallet domain is
touched.** `src/lib/wallet.ts` does not exist yet — you create it.

This story builds **two things**: (1) the `wallet.ts` domain module — `getBalance` + the single serialized
`mutate` helper that every future balance change (reserve-charge in 3.4, admin credit in 3.5, refunds in
Epic 5) must go through; and (2) the read-only student **wallet page** at `(portal)/portal/wallet` showing
the current balance and a chronological ledger list, plus small wiring (portal nav link + e2e manifest).

**3.1 writes NO ledger rows itself** — there is no caller yet (reserve = Story 3.4, admin credit = Story
3.5). You build the `mutate` seam so those stories wire into it; you do not invoke it in 3.1.

What already exists and MUST be reused (do NOT recreate):

- **`LedgerEntry` model, fully migrated** — `id cuid`, `studentId String` + `student → User` FK (NFR5
  referential integrity, RESTRICT on delete), `type LedgerType`, `amountCents Int` (**signed**),
  `balanceAfterCents Int`, `enrollmentId String?`, `paymentRef String?`, `createdAt`. Indexes
  `@@index([studentId])` and `@@index([studentId, createdAt])` back the balance sum and the chronological
  ledger query. **No schema or migration change is in scope.** [Source: acce-nextjs/prisma/schema.prisma:170-189]
- **`LedgerType` enum** — `PACKAGE_PURCHASE | TOPUP | BOOKING_CHARGE | CANCELLATION_REFUND | CANCELLATION_FEE | WITHDRAWAL | ADJUSTMENT`. 3.1 renders labels for whatever exists; it writes none. [Source: schema.prisma:160-168]
- **`User` model** — has `ledgerEntries LedgerEntry[]` back-relation and `role String? @default("STUDENT")`. The wallet is keyed by `studentId = session.user.id`. [Source: schema.prisma:23-42]
- **`requireSession()`** in `src/lib/auth-guards.ts` — the TRUSTED page-level guard (AD-3). Call it at the top of the wallet page **before any data fetch or JSX**; it returns the session (`session.user.id`, `session.user.role`). Any authenticated session (STUDENT+) may view their own wallet. [Source: acce-nextjs/src/lib/auth-guards.ts:25-35]
- **`db` singleton** from `@/lib/db` — the ONLY `PrismaClient` (AD-2). Never `new PrismaClient()`. [Source: acce-nextjs/src/lib/db.ts]
- **`formatZar(cents)`** already exists in `src/lib/class-display.ts` — the AD-9 cents→Rand UI-edge formatter (`29000 → "R290.00"`). **Reuse it** for the balance; for signed ledger amounts add a thin signed wrapper (below), do NOT duplicate the R/toFixed logic. [Source: acce-nextjs/src/lib/class-display.ts:22-24]
- **Portal shell** — `(portal)/layout.tsx` guards with `requireSession()` and renders `PortalNav` + the single `<main>`. `portal-nav.tsx` currently has only the logo + theme + sign-out; **add a "Wallet" nav link** here. Do NOT add a second `<main>` in the page (nested-landmark a11y trap — Story 1.3 fix). [Source: acce-nextjs/src/app/(portal)/layout.tsx; (portal)/portal-nav.tsx]
- **shadcn primitives present**: `card`, `table`, `badge`, `button`, `separator` in `src/components/ui/`. Use `card` (balance) + `table` (ledger) — no new dependency. [Source: acce-nextjs/src/components/ui/*]
- **1.5 e2e manifest** — `tests/e2e/authenticated-routes.ts`; its header literally lists `{ path: '/portal/wallet', role: 'STUDENT' }` as a route to add. Append it. [Source: acce-nextjs/tests/e2e/authenticated-routes.ts:21]
- **2.2 patterns to mirror**: pure, `db`-free helper modules that vitest tests without a live DB (`class-occupancy.ts`, `class-display.ts`); a server RSC page that calls the guard first, then reads via `db`, no client island. [Source: 2-2-list-and-view-classes-in-admin.md]

**This story = `src/lib/wallet.ts` (getBalance + the single serialized `mutate` seam) + a read-only student wallet page at `(portal)/portal/wallet/page.tsx` + a signed-Rand/ledger-label display helper + portal-nav link + e2e manifest entry. NO enrollment/reserve/checkout code, NO Paystack, NO admin credit UI, NO schema change, NO writing any ledger row.**

## Acceptance Criteria

**AC1 — Wallet page shows balance + chronological read-only ledger (FR15).**
Given `src/lib/wallet.ts` provides `getBalance(studentId)` (= Σ `LedgerEntry.amountCents` for that student) and I have one or more ledger entries,
When I open `/portal/wallet`,
Then I see my **current balance** (formatted in Rand at the UI edge, AD-9) and a **read-only, chronological** ledger list where each row shows the entry date, a human-readable type label, the **signed** amount (e.g. `−R290.00` for a charge, `+R500.00` for a credit), and the running `balanceAfterCents`. The list is read-only — no edit/delete controls.

**AC2 — Empty state when no ledger entries.**
Given I have no `LedgerEntry` rows,
When I open `/portal/wallet`,
Then my balance shows **R0.00** and a clear empty-state message is displayed (e.g. "No wallet activity yet") instead of an empty table. The gold-accent styling (if any CTA) uses the existing token system (UX-DR2), not a new palette.

**AC3 — Single serialized mutation seam; balance can never go negative (AD-6, NFR4).**
Given `src/lib/wallet.ts` also exports the single `mutate(tx, studentId, …)` helper,
When it is called (by a future caller — reserve in 3.4, admin credit in 3.5),
Then it **first takes a per-student lock** (`pg_advisory_xact_lock(hash(studentId))` — or `SELECT … FOR UPDATE` on the `user` row) inside the caller's transaction, reads the current balance **under that lock**, computes `balanceAfterCents = currentBalance + amountCents`, **rejects the mutation if `balanceAfterCents < 0`** (never drives balance negative), and appends an **immutable** `LedgerEntry` with `balanceAfterCents`. Ledger rows are never updated or deleted. `mutate` never takes its own `db` connection — it operates on the passed `tx` so it composes into the caller's transaction (AD-6). *3.1 defines and unit-tests this seam but does not call it.*

**AC4 — Authorization enforced at the page entry (AD-3); a student sees only their own wallet.**
Given an unauthenticated actor,
When they request `/portal/wallet` directly (bypassing the layout via a direct RSC request),
Then `requireSession()` at the top of the page redirects them to `/sign-in` before any wallet data is fetched. The balance and ledger are queried strictly by `session.user.id` — never a client-supplied id — so a student can never read another student's ledger.

**AC5 — Chain stays green (no regressions), with new unit tests on the wallet arithmetic.**
`npx prisma validate` passes (schema untouched), `npm run build` succeeds (tsc clean, `/portal/wallet` appears in the route table), and `npm test` (vitest) stays green **including new unit tests** that pin: the balance-sum definition, `computeBalanceAfter`, the non-negative guard (a deduction that would go below zero is rejected), and the signed-Rand / ledger-type-label display helpers. No schema/migration files are modified. `/portal/wallet` is added to the 1.5 authenticated-route manifest so the 200-smoke covers it.

## Tasks / Subtasks

- [x] **Task 1 — Pure, testable wallet arithmetic + ledger display helpers (`db`-free) (AC1, AC3, AC5).**
  - [x] Create `src/lib/wallet-math.ts` (pure, `db`-free — mirrors `class-occupancy.ts`) exporting:
    - `sumLedgerAmounts(entries: { amountCents: number }[]): number` = Σ amountCents (the AD-6 balance definition, usable for tests/fallback).
    - `computeBalanceAfter(currentBalanceCents: number, amountCents: number): number` = `currentBalanceCents + amountCents`.
    - `wouldGoNegative(currentBalanceCents: number, amountCents: number): boolean` = `computeBalanceAfter(...) < 0` (the NFR4 guard predicate — evaluated under the lock inside `mutate`).
    - Do NOT import `db`/Prisma runtime here — plain number arithmetic so vitest loads it without `DATABASE_URL`. Type-only Prisma import is fine if needed.
  - [x] Create `src/lib/wallet-display.ts` (pure, `db`-free) exporting:
    - `formatSignedZar(cents: number): string` — signed Rand for ledger amounts: `−R290.00` for negative, `+R500.00` for positive, `R0.00` for zero. **Reuse `formatZar` from `class-display.ts`** on the absolute value and prepend the sign — do NOT re-implement the R/`toFixed(2)` logic. Use a real minus sign or ASCII `-` consistently and pin the exact string in the test.
    - `formatLedgerType(type: LedgerType): string` — human labels for the enum: `BOOKING_CHARGE → "Class booking"`, `CANCELLATION_REFUND → "Refund"`, `CANCELLATION_FEE → "Cancellation fee"`, `ADJUSTMENT → "Adjustment"`, `TOPUP → "Top-up"`, `PACKAGE_PURCHASE → "Package purchase"`, `WITHDRAWAL → "Withdrawal"`. Import `LedgerType` as a **type-only** import (`import type { LedgerType } from "@prisma/client"`) so the helper stays db-free. Handle every enum value (exhaustive `switch`, like `formatStatus`).
- [x] **Task 2 — `wallet.ts` domain module: `getBalance` + the single serialized `mutate` seam (AC1, AC3).**
  - [x] Create `src/lib/wallet.ts`. Import `{ db }` from `@/lib/db` (AD-2). Export:
    - `getBalance(studentId: string): Promise<number>` — return `Σ amountCents` for the student via `db.ledgerEntry.aggregate({ where: { studentId }, _sum: { amountCents } })`, coalescing `_sum.amountCents ?? 0` (no rows → 0). This is the canonical balance (AD-6: `balance = Σ LedgerEntry.amountCents`); `balanceAfterCents` on rows is a display/audit snapshot, NOT the source of truth. Accept an optional `tx` param typed to the Prisma transaction client so a caller can read the balance inside its own transaction (used by `mutate`).
    - `mutate(tx, studentId, input: { type: LedgerType; amountCents: number; enrollmentId?: string; paymentRef?: string }): Promise<LedgerEntry>` — the **single serialized mutation path** (AD-6). Steps, in order, **on the passed `tx`** (never `db` directly):
      1. Take the per-student lock: `await tx.$executeRaw\`SELECT pg_advisory_xact_lock(hashtext(${studentId}))\`` (advisory xact lock, released at tx end) — this is what serialises a student's operations across different classes (the GroupSession row lock does NOT, per AD-6).
      2. Read current balance **under the lock** via `getBalance(studentId, tx)`.
      3. `const balanceAfterCents = computeBalanceAfter(current, input.amountCents)`.
      4. If `balanceAfterCents < 0` → **reject** (throw `WalletInsufficientFundsError` — typed error callers in 3.4/3.5 catch for user-facing messages). Never write a negative-driving row (NFR4).
      5. Append the immutable row: `tx.ledgerEntry.create({ data: { studentId, type, amountCents, balanceAfterCents, enrollmentId, paymentRef } })`. Never update/delete ledger rows.
    - Add a file header comment stating: this is the AD-6 single serialized mutation seam; every balance change (reserve 3.4, admin credit 3.5, refund Epic 5) MUST route through `mutate`; readers use `getBalance`.
  - [x] **Do not call `mutate` anywhere in 3.1** — it is the seam future stories wire into. The wallet page only calls `getBalance` + a read query (Task 3).
  - [x] Note the naming: the epic's informal "`addEntry`" wording maps to this `mutate` (canonical per AD-6 + Story 3.5). Use `mutate`.
- [x] **Task 3 — Student wallet page (server component, read-only) (AC1, AC2, AC4).**
  - [x] Create `src/app/(portal)/portal/wallet/page.tsx` as a **server component**: call `await requireSession()` FIRST (trusted page guard, AD-3), take `studentId = session.user.id`, then fetch in parallel: `getBalance(studentId)` and `db.ledgerEntry.findMany({ where: { studentId }, orderBy: { createdAt: "asc" }, select: { id, type, amountCents, balanceAfterCents, createdAt } })`. **Read-only — no writes anywhere.** Query strictly by `session.user.id` (AC4 — never a route/query param).
  - [x] Render: a **balance Card** at top showing `formatZar(balance)` prominently ("Wallet balance"). Then, if `entries.length === 0` → the AC2 **empty state** (message "No wallet activity yet" — no table); else a shadcn **`Table`** with columns: Date (native `toLocaleString`, no date library), Description (`formatLedgerType(type)`), Amount (`formatSignedZar(amountCents)`), Balance (`formatZar(balanceAfterCents)`). Chronological (`createdAt: asc` = oldest first, running balance reads naturally top-to-bottom).
  - [x] Page is fully server-rendered — **no client island**, no non-`children` prop trap (1.5 RSC-500 guard). Use a plain `<div>` wrapper, not a second `<main>` (the `(portal)` layout owns the single `<main>`).
  - [x] Date formatting uses native `Intl`/`toLocaleString` — no date library added.
- [x] **Task 4 — Wiring: nav link + e2e manifest (AC1, AC5).**
  - [x] `src/app/(portal)/portal-nav.tsx`: add a keyboard-operable "Wallet" `<Link href="/portal/wallet">` in the nav (reuse existing focus-ring + token styling; ≥44px touch target). Keep the nav a11y-correct (NFR10).
  - [x] `tests/e2e/authenticated-routes.ts`: append `{ path: "/portal/wallet", role: "STUDENT" }` (already shown as the next entry in the manifest header). Manifest shape unchanged.
- [x] **Task 5 — Unit tests for the pure wallet math + display helpers (AC3, AC5).**
  - [x] `tests/unit/wallet-math.test.ts`: `sumLedgerAmounts([])===0`; sum of mixed signed rows; `computeBalanceAfter(50000, -29000)===21000`; `computeBalanceAfter(0, 50000)===50000`; `wouldGoNegative(29000, -29000)===false` (exact-zero allowed); `wouldGoNegative(28900, -29000)===true` (insufficient → rejected, NFR4); `wouldGoNegative(0, 50000)===false` (credit).
  - [x] `tests/unit/wallet-display.test.ts`: `formatSignedZar(-29000)==="−R290.00"` (pin exact sign char), `formatSignedZar(50000)==="+R500.00"`, `formatSignedZar(0)==="R0.00"`; `formatLedgerType` for every `LedgerType` value (exhaustive).
  - [x] Do NOT unit-test `wallet.ts` (it imports `db` + needs `DATABASE_URL`); do NOT over-mock Prisma to fake the advisory lock. The locked round-trip is a CI/pipeline concern (Task 6).
- [x] **Task 6 — Verify the chain (AC5).**
  - [x] `npx prisma validate` → passes (schema untouched).
  - [x] `npm run build` → succeeds (tsc clean; `/portal/wallet` present in the route table as ƒ Dynamic).
  - [x] `npm test` → vitest 219/219 green including 16 new wallet-math + 13 new wallet-display tests (29 new total).
  - [x] Live-DB read of the wallet page **and** the `mutate` advisory-lock / non-negative round-trip → **deferred to CI ephemeral-Postgres** (same wall as 1.1/1.5/2.2/2.3; unit mocks cannot exercise `pg_advisory_xact_lock`). Do NOT fake a live query. Static verification (`prisma validate` + `build` + vitest) is the bar here.

## Dev Notes

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-6 — Wallet is an append-only ledger; ONE serialized mutation path:** `balance(studentId) = Σ LedgerEntry.amountCents`. **Every** balance mutation goes through a single `wallet.mutate(tx, studentId, …)` that **first takes a per-student lock** (`pg_advisory_xact_lock(hash(studentId))` or `SELECT … FOR UPDATE` on the `user` row) in the same transaction, then appends an **immutable** `LedgerEntry` with `balanceAfterCents`. The GroupSession row lock is NOT a balance-serialization mechanism. Balance may never go negative (checked after the lock, before deducting). Ledger rows are never updated or deleted (auditability; future cash-out). [Source: ARCHITECTURE-SPINE.md#AD-6]
- **AD-9 — Money is integer cents (ZAR):** every monetary value is an integer `*Cents` field; no floats in domain or DB; format to Rand ONLY at the UI edge (`formatZar` / `formatSignedZar`). [Source: ARCHITECTURE-SPINE.md#AD-9; schema.prisma:171-179]
- **AD-3 — Authorization at the entry layer, not the layout:** `requireSession()` at the top of the wallet page is the trusted guard; the `(portal)` layout is defense-in-depth. A layout is NOT a security boundary (direct RSC request skips it). Query strictly by `session.user.id`. [Source: ARCHITECTURE-SPINE.md#AD-3; auth-guards.ts]
- **AD-2 — Single data gateway:** import `{ db }` from `@/lib/db`; never `new PrismaClient()`. [Source: ARCHITECTURE-SPINE.md#AD-2]
- **AD-1 — Additive isolation:** the new route lives only under `(portal)/portal/wallet`; marketing routes, SEO, sitemap, headers untouched. [Source: ARCHITECTURE-SPINE.md#AD-1]
- **Consistency conventions:** domain module = pure functions in `src/lib/*.ts` taking `(tx, args)` where they mutate; **no `db` import inside a `tx`-scoped fn** (`mutate` uses the passed `tx`, not `db`). Money formats to `R` at the UI edge only. Server results that can fail expected-ly use a discriminated `{ ok }` result, not a throw across the UI boundary — relevant when 3.4/3.5 call `mutate`; for 3.1 pick the `mutate` failure shape (typed error vs discriminated result) and document it for the callers. [Source: ARCHITECTURE-SPINE.md#Consistency Conventions]
- **Capability map:** "Balance checkout (FR7,11,15)" lives in `lib/enrollment.ts` + `lib/wallet.ts`, governed by AD-4/AD-6/AD-8/AD-12/AD-14. The `wallet.ts` you write here is the reusable seam Stories 3.4 (reserve → `BOOKING_CHARGE`) and 3.5 (admin credit → `ADJUSTMENT`) and Epic 5 (refunds) all import. Put the mutation logic in `src/lib/wallet.ts`, not in the page. [Source: ARCHITECTURE-SPINE.md#Capability → Architecture Map]

### Data model facts this story depends on (from schema.prisma — verified)
- `LedgerEntry { id cuid, studentId String, student User @relation (FK, NFR5), type LedgerType, amountCents Int (signed), balanceAfterCents Int, enrollmentId String?, paymentRef String?, createdAt }`; indexes `@@index([studentId])` + `@@index([studentId, createdAt])`. [Source: schema.prisma:170-189]
- `LedgerType` enum: `PACKAGE_PURCHASE, TOPUP, BOOKING_CHARGE, CANCELLATION_REFUND, CANCELLATION_FEE, WITHDRAWAL, ADJUSTMENT`. Render a label for each. [Source: schema.prisma:160-168]
- `User.ledgerEntries LedgerEntry[]`, `User.id` is the `studentId`, `role String? @default("STUDENT")`. [Source: schema.prisma:23-42]
- **Prisma aggregate**: `db.ledgerEntry.aggregate({ where: { studentId }, _sum: { amountCents } })` returns `{ _sum: { amountCents: number | null } }` — coalesce `?? 0`. Supported in installed Prisma 6.19.3. [Source: schema.prisma generator; ARCHITECTURE-SPINE.md#Stack]
- **Advisory lock via raw SQL**: `tx.$executeRaw\`SELECT pg_advisory_xact_lock(hashtext(${studentId}))\`` — `hashtext` maps the cuid string to the `int4` the advisory-lock fn wants; `pg_advisory_xact_lock` auto-releases at transaction end (no manual unlock). Use `$executeRaw` (tagged template → parameterised, no SQL injection), not `$executeRawUnsafe`. [Source: ARCHITECTURE-SPINE.md#AD-6]

### Scope boundary (do NOT do — belongs to other stories)
- **No enrollment/reserve/checkout/`reserveSeat` code, no `BOOKING_CHARGE` writing** — that is Story 3.4 (it will *call* `wallet.mutate`).
- **No admin wallet-credit UI / `ADJUSTMENT` writing** — that is Story 3.5 (it also calls `wallet.mutate`).
- **No Paystack / webhook / email code.** No cancellation/refund logic (Epic 5).
- **Do NOT call `mutate` in 3.1** — build + unit-test the seam only. The page is read-only.
- **No portal class list / browse** — that is Story 3.2.
- No schema/migration/enum change; no new dependency; no date library; no pagination (dataset tiny in 1a).

### Previous story intelligence (Epic 2 / Epic 1)
- **2.2 (done) is the closest analog** — a read-only server RSC page (guard-first, `db` read, no client island) plus pure `db`-free helper modules (`class-occupancy.ts`, `class-display.ts`) that vitest tests without a live DB. Mirror that: pure `wallet-math.ts`/`wallet-display.ts` + a server `wallet/page.tsx`. [Source: 2-2-list-and-view-classes-in-admin.md]
- **2.1/2.2 code-review note:** any gold CTA must use token classes (`bg-accent text-accent-foreground hover:bg-accent/90`), NOT hardcoded hex, so gold+navy flip per light/dark mode (UX-DR2/DR6). [Source: 2-1…md; 2-2…md Review]
- **2.2/2.3 timezone deferral:** class start/time is displayed via `toLocaleString("en-ZA")` with no explicit `timeZone`; timezone hardening is a system-wide deferred decision. For the wallet ledger's `createdAt` date column, follow the same convention (native `toLocaleString`, no pinned tz) so it stays consistent — do NOT unilaterally pin a timezone here. [Source: 2-2…md Review Findings; deferred-work.md]
- **1.5 RSC-500 trap + smoke net:** never pass a Client Component element through a non-`children` prop from a Server Component (silent HTTP 500, invisible to tsc/unit). The wallet page is fully server-rendered with no client island, so it is safe; adding `/portal/wallet` to the authenticated-route manifest gives the 200-smoke a regression net. [Source: 1-5…md; lessons-learned]
- **1.3 nested-`<main>` a11y fix:** the `(portal)` layout owns the single `<main>` landmark — the page must use a `<div>` wrapper, not a second `<main>`. [Source: (portal)/portal/page.tsx:25-27]
- **Sandbox reality (1.1/1.4/1.5/2.1/2.2/2.3):** prod DB creds are blocked interactively; live DB reads/writes are deferred to CI ephemeral-Postgres. Static verification (`prisma validate` + `build` + vitest) is the bar. Do NOT fake a live query. The `mutate` advisory-lock behaviour specifically cannot be unit-mocked (pg-level `pg_advisory_xact_lock`) — its first live verification is a CI concern. [Source: deferred-work.md; 2-3…md Task 7]
- **No seeded student / ledger rows:** `prisma/seed-data.ts` seeds only the ADMIN (Priyanka) + subjects + 6 classes — no student user and no `LedgerEntry` rows. So on a fresh seed the wallet page renders the **empty state** (AC2). Do NOT add seed ledger rows in 3.1 (Story 3.5 admin-credit is what creates real balance). [Source: acce-nextjs/prisma/seed-data.ts]
- **Git:** work lands on branch `epic-3` (chained off epic-2 tip `2a404e71`). Net-new `wallet.ts` + `wallet/page.tsx` + two pure helpers + two small UPDATE edits (nav, manifest) — nothing conflicts with prior epics. [Source: sprint-status.yaml]

### UX / accessibility (UX-DR2, UX-DR6, NFR10)
- Reuse the existing navy+gold token system and shadcn primitives (`card`, `table`, `badge`, `button`) — NO new palette. Balance is the hero element (Card, large type). Signed amounts read clearly (deductions muted/negative, credits positive) — a `Badge` or coloured text is fine but must keep ≥4.5:1 contrast in BOTH modes; do NOT rely on colour alone to convey sign (the `+`/`−` prefix carries it). [Source: DESIGN.md]
- Every interactive control (the new nav link) keyboard-operable with a visible focus ring, ≥44px touch target, honour `prefers-reduced-motion`. Follow the existing `portal-nav.tsx` link pattern (focus-visible ring, aria-label where needed). [Source: portal-nav.tsx; ARCHITECTURE-SPINE.md#Consistency Conventions]
- Table horizontally scrollable on narrow screens (wrap in an overflow container), as 2.2 did. Empty state is a calm, clear message — no error styling. [Source: 2-2…md]

### Testing standards
- Framework: **vitest** (jsdom), `npm test`, specs under `tests/unit/**`. Playwright e2e is separate (`tests/e2e`, DB-bound) — add the route to `authenticated-routes.ts` but do not run it here. [Source: 2-2…md; acce-nextjs/vitest.config.ts]
- Unit-test the **pure** seam only: `sumLedgerAmounts`, `computeBalanceAfter`, `wouldGoNegative` (incl. exact-zero-allowed and insufficient-rejected NFR4 cases), `formatSignedZar` (pin exact strings incl. sign char), `formatLedgerType` (exhaustive over the enum). Do NOT unit-test `wallet.ts`/the page (they import `db` and need `DATABASE_URL`); do NOT over-mock Prisma to fake `_sum` or the advisory lock — the live aggregate + lock are CI concerns. [Source: 2-2…md Testing standards]

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `acce-nextjs/src/*`.
- New files (all NEW):
  - `src/lib/wallet-math.ts` — pure balance arithmetic (`sumLedgerAmounts`, `computeBalanceAfter`, `wouldGoNegative`).
  - `src/lib/wallet-display.ts` — pure `formatSignedZar` (reuses `formatZar`) + `formatLedgerType`.
  - `src/lib/wallet.ts` — domain module: `getBalance` + the single serialized `mutate` seam (AD-6).
  - `src/app/(portal)/portal/wallet/page.tsx` — server component (guard + read-only balance/ledger query + render).
  - `tests/unit/wallet-math.test.ts`, `tests/unit/wallet-display.test.ts` — pure-helper assertions.
- UPDATE (small, additive):
  - `src/app/(portal)/portal-nav.tsx` — add a "Wallet" nav link.
  - `tests/e2e/authenticated-routes.ts` — append `{ path: "/portal/wallet", role: "STUDENT" }`.

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1 / Epic 3 / FR15 / NFR4]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-1, AD-2, AD-3, AD-6, AD-9, "Consistency Conventions", "Capability → Architecture Map"]
- [Source: acce-nextjs/prisma/schema.prisma:23-42, 160-189] · [Source: acce-nextjs/src/lib/auth-guards.ts] · [Source: acce-nextjs/src/lib/db.ts] · [Source: acce-nextjs/src/lib/class-display.ts (formatZar reuse)]
- [Source: acce-nextjs/src/app/(portal)/layout.tsx; (portal)/portal-nav.tsx; (portal)/portal/page.tsx (single-<main> pattern)]
- [Source: acce-nextjs/tests/e2e/authenticated-routes.ts (manifest + /portal/wallet shown as next entry)]
- [Source: _bmad-output/implementation-artifacts/2-2-list-and-view-classes-in-admin.md (read-only RSC + pure-helper pattern, CTA-token + timezone notes)]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md (CI ephemeral-Postgres for live DB ops)]

### Latest tech notes
- **Prisma 6.19.3**: `aggregate({ _sum: { amountCents } })` for the balance sum; `$executeRaw` tagged template for the advisory lock (parameterised — never `$executeRawUnsafe`). Filtered aggregates run in the DB (no N+1). [Source: schema.prisma generator; ARCHITECTURE-SPINE.md#Stack]
- **Next 16 App Router**: `wallet/page.tsx` is a server component by default — `await requireSession()` then `await getBalance(...)` / `await db.ledgerEntry.findMany(...)` inline; no route handler or client island needed for a read-only view. Keep it server-rendered to avoid the 1.5 RSC non-children-prop 500 trap. [Source: 2-2…md Latest tech notes]
- **`Intl`/`toLocaleString`**: format the ledger `createdAt` with native `Date.toLocaleString("en-ZA", …)` (no `timeZone` pin — consistent with 2.2/2.3, timezone hardening deferred). No `date-fns`/`dayjs`. [Source: 2-2…md Review Findings]

### Project Structure Notes (alignment)
- Aligns with the ARCHITECTURE-SPINE source tree: `src/lib/wallet.ts` (getBalance + mutate per AD-6/AD-15) and `(portal)/portal/wallet` are both named in the spine's structural seed. No variance. [Source: ARCHITECTURE-SPINE.md#Structural Seed]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (claude-code autopilot, 2026-07-06)

### Debug Log References

No debug issues. All tasks implemented and verified clean on first pass.

### Completion Notes List

- Task 1: Created `src/lib/wallet-math.ts` (3 exports: sumLedgerAmounts, computeBalanceAfter, wouldGoNegative) and `src/lib/wallet-display.ts` (2 exports: formatSignedZar reusing formatZar, formatLedgerType exhaustive switch). Both pure/db-free, vitest-loadable without DATABASE_URL.
- Task 2: Created `src/lib/wallet.ts` with getBalance (optional tx param for lock-read composability) and mutate (per-student pg_advisory_xact_lock → read-under-lock → computeBalanceAfter → WalletInsufficientFundsError guard → immutable LedgerEntry.create). mutate is NOT called in 3.1 — the seam is built and unit-tested, ready for 3.4/3.5.
- Task 3: Created `src/app/(portal)/portal/wallet/page.tsx` as a pure server component — requireSession() first (AD-3), parallel getBalance + findMany by session.user.id only (AC4), balance Card + chronological Table (oldest-first = running balance reads top-to-bottom) or empty-state "No wallet activity yet". Plain div wrapper (no second main, 1.3 a11y fix). No client island.
- Task 4: Added Wallet nav link to portal-nav.tsx (focus-visible ring, h-11 ≥44px touch target, token styling). Appended { path: "/portal/wallet", role: "STUDENT" } to authenticated-routes.ts.
- Task 5: 16 wallet-math tests + 13 wallet-display tests (29 total). All pinned exact values including U+2212 minus sign for negative amounts. Exhaustive formatLedgerType coverage of all 7 enum values.
- Task 6: prisma validate clean, build clean (/portal/wallet ƒ Dynamic in route table, tsc clean), npm test 219/219 green. Live-DB advisory-lock round-trip deferred to CI ephemeral-Postgres per established sandbox pattern.

### File List

- acce-nextjs/src/lib/wallet-math.ts (NEW)
- acce-nextjs/src/lib/wallet-display.ts (NEW)
- acce-nextjs/src/lib/wallet.ts (NEW)
- acce-nextjs/src/app/(portal)/portal/wallet/page.tsx (NEW)
- acce-nextjs/tests/unit/wallet-math.test.ts (NEW)
- acce-nextjs/tests/unit/wallet-display.test.ts (NEW)
- acce-nextjs/src/app/(portal)/portal-nav.tsx (UPDATED — Wallet nav link)
- acce-nextjs/tests/e2e/authenticated-routes.ts (UPDATED — /portal/wallet STUDENT entry)

## Change Log

- 2026-07-06: Story 3.1 implemented by dev agent. Created wallet domain module (wallet.ts: getBalance + mutate seam AD-6), pure helper modules (wallet-math.ts, wallet-display.ts), read-only student wallet page ((portal)/portal/wallet/page.tsx), portal nav Wallet link, e2e manifest entry. 29 new unit tests. 219/219 vitest green, build clean, prisma validate clean. Status → review.
