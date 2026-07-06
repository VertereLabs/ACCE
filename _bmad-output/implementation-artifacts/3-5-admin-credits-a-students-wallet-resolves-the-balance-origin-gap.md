---
baseline_commit: e8e054cd34086d81c0a713a8c102342fbe8aed0a
---

# Story 3.5: Admin credits a student's wallet (resolves the balance-origin gap)

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Priyanka (ADMIN),
I want to credit a student's wallet with a chosen amount,
so that a student actually has balance to pay a seat from (goodwill credit, manual comp, offline top-up) — and the balance-pay path is a real, demonstrable capability, not just a test fixture.

## Context & current state (READ FIRST)

Epic 1 and Epic 2 are `done`. Epic 3 is in-progress: **3.1 (`done`)** built the wallet domain
(`src/lib/wallet.ts` — `getBalance` + the AD-6 serialized `mutate` seam) and the read-only student
wallet page; **3.2/3.3/3.4 (`done`)** built browse → detail/checkout → the live balance-pay reserve.
**3.4 was the FIRST caller of `wallet.mutate` (a `BOOKING_CHARGE` debit). THIS story is its SECOND
caller — the `ADJUSTMENT` credit — and it is the LAST story in Epic 3.**

**Why this story exists (the balance-origin gap / readiness M1):** Phase 1a has no self-service top-up
UI and refunds only exist after a Paystack purchase + cancel (Epic 4/5, not built). So on a fresh
system **no real student has any balance**, and the balance-pay path shipped in 3.4 has no funding
source. This story gives Priyanka an admin action to **credit** a student's wallet, so the balance-pay
capability is real and demonstrable. [Source: epics.md#Story 3.5; ARCHITECTURE-SPINE.md#Deferred "Wallet balance origin"]

**What DOES NOT exist yet and this story creates — the admin student surface.** The admin app today has
ONLY `/admin/classes*` (list/new/edit). There is **no admin students list or per-student view**. The
epic AC says "an authenticated ADMIN **on a student's admin view**" — so this story builds that view:

1. **`(admin)/admin/students/page.tsx`** — a **read-only** server RSC listing all `role = "STUDENT"`
   users (name, email, join date), `requireAdmin`-first, with an empty-state. Each row links to the
   per-student view. **Mirrors the 2.2 admin classes list pattern** (server RSC, requireAdmin, shadcn
   Table, per-row link, empty-state).
2. **`(admin)/admin/students/[id]/page.tsx`** — the **student's admin view**: a dynamic server RSC
   (`params` awaited, `requireAdmin`-first, `findUnique` + `notFound()` — mirrors 2.3's edit page) showing
   the student's identity, their **current wallet balance** (`getBalance(studentId)`, read-only), a
   **read-only ledger table** (reuses the 3.1 wallet-page rendering), and a **credit form** (client island).
3. **`(admin)/admin/students/[id]/actions.ts`** — `creditWalletAction` (`"use server"`): `requireAdmin`
   first → Zod-validate `{ studentId, amountRand }` → verify the target user exists and is a STUDENT →
   `db.$transaction(tx => wallet.mutate(tx, studentId, { type: "ADJUSTMENT", amountCents: +cents }))` →
   `revalidatePath` → discriminated result. **This is the SECOND `wallet.mutate` caller (ADJUSTMENT).**
4. **`(admin)/admin/students/[id]/credit-wallet-form.tsx`** — `"use client"` island: react-hook-form +
   zodResolver + gold-token CTA + **sonner toast** (UX-DR5). **Mirrors the 2.1 `ClassForm` island pattern.**
5. **A pure, unit-tested schema module** (`credit-schema.ts`: `creditWalletSchema` + a Rand→cents helper)
   — mirrors 2.1 `class-form-schema.ts` / 3.4 `reserve-schema.ts`.
6. Wiring: a **"Manage students"** link on the admin landing (`/admin` page) + `/admin/students` added to
   the e2e authenticated-route manifest.

**This is a MONEY path** (it writes a positive balance mutation), but it introduces **no new money
primitive** — it routes through the ONE vetted AD-6 seam (`wallet.mutate`), which already takes the
per-student advisory lock, reads under the lock, guards non-negative (NFR4), and appends an immutable
row. Reuse it; do NOT reimplement any of that. **Positive credit only** (goodwill/top-up); debit
adjustments are out of scope.

What already exists and MUST be reused (do NOT recreate):

- **`wallet.mutate(tx, studentId, { type, amountCents, … })`** in `src/lib/wallet.ts` — the AD-6 single
  serialized balance-mutation seam. Call it with a **positive** `amountCents` and `type: "ADJUSTMENT"`
  **inside a `db.$transaction`**. It takes the per-student advisory lock, reads balance under the lock,
  and appends the immutable `LedgerEntry`. Never `tx.ledgerEntry.create` directly (AD-6). A positive
  credit can never trip the NFR4 non-negative guard. [Source: acce-nextjs/src/lib/wallet.ts:126]
- **`getBalance(studentId)`** in `src/lib/wallet.ts` — the read used on the student's admin view to show
  the current balance (`Σ LedgerEntry.amountCents`). Read-only. [Source: acce-nextjs/src/lib/wallet.ts:83]
- **`ADJUSTMENT`** is already a `LedgerType` enum value **and** `formatLedgerType("ADJUSTMENT") → "Adjustment"`
  already exists in `src/lib/wallet-display.ts` — no schema/enum/display change needed. [Source: acce-nextjs/prisma/schema.prisma#LedgerType; src/lib/wallet-display.ts:76]
- **`requireAdmin()`** in `src/lib/auth-guards.ts` — the TRUSTED entry guard (AD-3). Call it FIRST in the
  action AND first in each admin page. Non-admins are redirected to `/portal`. [Source: acce-nextjs/src/lib/auth-guards.ts:49]
- **`db` singleton** from `@/lib/db` — the ONLY `PrismaClient` (AD-2). Supports `db.$transaction(fn)`.
  Never `new PrismaClient()`. [Source: acce-nextjs/src/lib/db.ts]
- **`toCents(priceRand)`** in `(admin)/admin/classes/new/class-form-schema.ts` — the AD-9 `Math.round(rand*100)`
  Rand→cents converter. **Reuse the identical logic** (import it, or define an equivalent in `credit-schema.ts`
  — one canonical rounding rule). [Source: acce-nextjs/src/app/(admin)/admin/classes/new/class-form-schema.ts:106]
- **`createClassAction` (2.1)** — the server-action skeleton (`requireAdmin` → `safeParse` →
  target-existence re-check → discriminated result). **Copy its structure** for `creditWalletAction`.
  [Source: acce-nextjs/src/app/(admin)/admin/classes/new/actions.ts]
- **`ClassForm` (2.1)** — the `"use client"` + react-hook-form + zodResolver + `toast` from
  `@/components/ui/sonner` + `bg-accent text-accent-foreground` gold CTA pattern. **Copy it** (much
  simpler here: one amount field). The sonner `Toaster` is already mounted app-wide. [Source: acce-nextjs/src/app/(admin)/admin/classes/new/class-form.tsx]
- **The 3.1 wallet page** — `(portal)/portal/wallet/page.tsx` — the balance Card + read-only ledger
  Table + `formatZar`/`formatSignedZar`/`formatLedgerType` rendering. **Reuse this rendering** for the
  ledger block on the student's admin view (the admin is reading the SAME ledger, keyed to the target
  studentId instead of `session.user.id`). [Source: acce-nextjs/src/app/(portal)/portal/wallet/page.tsx]
- **The 2.2 admin classes list** — `(admin)/admin/classes/page.tsx` — the server-RSC list shell
  (requireAdmin, shadcn Table, per-row link, empty-state Card). **Copy it** for the students list. [Source: acce-nextjs/src/app/(admin)/admin/classes/page.tsx]
- **The 2.3 edit page** — `(admin)/admin/classes/[id]/edit/page.tsx` — the dynamic `params`-await +
  `findUnique` + `notFound()` + serialisable-props-to-island pattern. **Mirror it** for the student view. [Source: acce-nextjs/src/app/(admin)/admin/classes/[id]/edit/page.tsx]
- **shadcn `Table`, `Card`, `Badge`, `Button`, `Input`, `Form`, `sonner`** in `src/components/ui/` —
  reuse. No new dependency, no new palette.

**This story = an admin students list + a per-student admin view (balance + ledger + credit form) +
`creditWalletAction` (the ADJUSTMENT `wallet.mutate` caller) + a client-island credit form + a pure
credit-schema with unit tests + nav link + e2e manifest. NO schema/migration/enum/dependency change,
NO debit/negative adjustment, NO ledger write outside `wallet.mutate`, NO Paystack/enrollment/cancel.**

## Acceptance Criteria

**AC1 — Crediting a student writes a positive ADJUSTMENT via `wallet.mutate` and the balance increases (FR15, AD-6, AD-9).**
Given I am an authenticated **ADMIN** on a student's admin view (`/admin/students/[id]`),
When I enter a credit amount in **Rand** (e.g. `500`) and submit,
Then a **positive `ADJUSTMENT`** `LedgerEntry` (`amountCents = +Math.round(rand*100)`, AD-9) is written for
that student **via the single per-student-locked `wallet.mutate`** (AD-6 — never a direct `ledgerEntry.create`),
the student's balance (`getBalance` = Σ `amountCents`) **increases by exactly that amount**, and the entry
appears in their wallet ledger with `balanceAfterCents` set. The write runs inside a `db.$transaction` so the
advisory lock is held for the mutation. All money is integer cents (AD-9); Rand→cents conversion happens once.

**AC2 — An invalid amount is rejected with a clear message and no ledger row is written (validation).**
Given an **invalid amount** — zero, negative, non-numeric, or empty,
When I submit,
Then the credit is **rejected** with a clear, specific validation error surfaced inline and/or as an error
toast, and **NO `LedgerEntry` is written** (the Zod guard at the server entry rejects before any DB write).
The client form also validates (zodResolver) for instant feedback, but the **server action re-validates**
(never trust the client — AD-3 posture). The discriminated result is `{ ok: false, … }` — the action never
throws across the UI boundary for an expected validation failure.

**AC3 — After a credit, the new balance is reflected and the balance-pay path is available (FR15, ties 3.4).**
Given a credit is applied,
When the student (or the admin re-viewing) opens the wallet / the student's admin view / a class checkout,
Then the **new balance is reflected** (the admin view `revalidatePath`s so the balance Card + ledger update
immediately; the student's `/portal/wallet` and `/portal/classes/[id]` read the same `getBalance` sum) and the
**"Pay with balance" path (Story 3.4) is available when balance ≥ price** — with no further change to 3.4's
reserve logic (it already reads `getBalance`). A success toast confirms the credit (UX-DR5).

**AC4 — Authorization at the entry; the credit only targets a real student (AD-3, NFR5).**
The `creditWalletAction` calls **`requireAdmin()` first** (AD-3) — before any parse or write — and each new
admin page calls `requireAdmin()` first. The action **re-verifies the target `studentId` exists and is a
`STUDENT`** (mirrors 2.1's subject re-check) before crediting, so a stale/forged id or an attempt to credit a
non-student is rejected (`{ ok: false }`) rather than hitting an FK error mid-transaction (NFR5 — `LedgerEntry.studentId`
is an FK to `User`). The `studentId` used is the route/verified id, and the amount is Zod-validated.

**AC5 — `wallet.mutate` remains the sole ledger writer; chain stays green; scope respected.**
`wallet.mutate` is the **only** function that writes `LedgerEntry` (grep: no `ledgerEntry.create` outside
`src/lib/wallet.ts`) — `creditWalletAction` calls it, never writes the row itself (AD-6). `ADJUSTMENT` uses the
**existing** enum value (no schema/enum change). `npx prisma validate` passes (schema untouched), `npm run build`
succeeds (tsc clean, `/admin/students` + `/admin/students/[id]` in the route table), and `npm test` (vitest)
stays green **with new unit tests for the pure credit-schema** (valid/invalid amounts, Rand→cents). **No
schema/migration/enum/dependency change; no debit/negative adjustment; no Paystack/enrollment/cancel.** The
live-authenticated dynamic-route run + the real ADJUSTMENT-credit round-trip (against a real student) are
**deferred to the CI ephemeral-Postgres job** (same wall as 1.1/1.5/2.2/2.3/3.4 — no seeded student, prod DB
creds blocked in sandbox) and recorded in `deferred-work.md`.

## Tasks / Subtasks

- [x] **Task 1 — Pure `credit-schema.ts` + unit tests (AC1, AC2, AC5).**
  - [x] Create a pure, db-free schema module (colocated at `src/app/(admin)/admin/students/[id]/credit-schema.ts`
    or `src/lib/credit-schema.ts` — no `db`/Prisma import so vitest/jsdom loads it without `DATABASE_URL`).
    Export `creditWalletSchema` (Zod): `studentId` non-empty string; `amountRand` a **positive** number
    (`z.coerce.number(...).positive("Amount must be greater than 0")` — so `""`/`0`/negative/non-numeric all
    fail, mirroring 2.1's `priceRand`). Export a Rand→cents helper (reuse `toCents` from
    `class-form-schema.ts` **or** define an identical `Math.round(rand*100)` here — one canonical rule, AD-9).
  - [x] Add `tests/unit/credit-schema.test.ts`: cover valid amount → parses; `0`, negative, `""`, non-numeric
    → rejected; Rand→cents rounding (`500 → 50000`, `10.5 → 1050`, `10.555 → 1056`). Mirror `reserve-schema.test.ts`.
    Do NOT unit-test the action/page (they import `db` + need Postgres).
- [x] **Task 2 — `creditWalletAction` server action (AC1, AC2, AC4, AD-3/6/9).**
  - [x] Create `src/app/(admin)/admin/students/[id]/actions.ts` (`"use server"`). Export
    `creditWalletAction(input: unknown): Promise<{ ok: true; balanceAfterCents: number } | { ok: false; fieldErrors?; message? }>`.
  - [x] Order (copy 2.1 `createClassAction`): (1) `await requireAdmin()` FIRST; (2) `creditWalletSchema.safeParse`
    → on fail return `{ ok: false, fieldErrors }`; (3) **verify target user**: `db.user.findUnique({ where: { id: studentId } })`
    — if missing OR `role !== "STUDENT"` return `{ ok: false, message: "Student not found" }` (AC4, NFR5);
    (4) `const amountCents = toCents(amountRand)` (AD-9); (5)
    `const entry = await db.$transaction(tx => mutate(tx, studentId, { type: "ADJUSTMENT", amountCents }))`
    (import `mutate` from `@/lib/wallet`; a **positive** amount → NFR4 guard never trips; default isolation is
    fine — no oversell/Serializable concern, the per-student advisory lock inside `mutate` serializes credits);
    (6) `revalidatePath("/admin/students/" + studentId)` and `revalidatePath("/portal/wallet")` so both views
    reflect immediately (AC3); (7) return `{ ok: true, balanceAfterCents: entry.balanceAfterCents }`.
  - [x] Wrap the tx in a try/catch → unexpected failure returns `{ ok: false, message: "Failed to credit wallet. Please try again." }`
    (never throw across the boundary; log the error server-side — money-path observability convention).
- [x] **Task 3 — Client-island credit form (AC1, AC2, AC3, UX-DR5, UX-DR6, NFR10).**
  - [x] Create `src/app/(admin)/admin/students/[id]/credit-wallet-form.tsx` (`"use client"`) taking a plain
    `{ studentId: string }` prop (serialisable — RSC-500 safe, 1.5 lesson). react-hook-form + `zodResolver(creditWalletSchema)`
    (copy the 2.1 `typedResolver` cast note), one **amount (R)** `Input` (`type="number"`, `inputMode="decimal"`,
    `step="0.01"`, `min={0}`, `min-h-[44px]`), a gold-token submit CTA (`bg-accent text-accent-foreground
    hover:bg-accent/90`, `≥44px`, `aria-busy` while pending).
  - [x] On submit call `creditWalletAction({ studentId, amountRand })`; on `ok:false` map `fieldErrors` back onto
    the form (2.1 pattern) + `toast.error(message ?? "Please fix the errors above.")`; on `ok:true`
    `toast.success("Wallet credited")`, reset the amount field, and `router.refresh()` so the balance Card +
    ledger re-render with the new entry (AC3). Label text carries state (UX-DR6/NFR10).
- [x] **Task 4 — Admin students list page (AC4, mirrors 2.2).**
  - [x] Create `src/app/(admin)/admin/students/page.tsx` (server RSC). `await requireAdmin()` FIRST. Fetch
    `db.user.findMany({ where: { role: "STUDENT" }, orderBy: { createdAt: "asc" }, select: { id, name, email, createdAt } })`.
    Render a shadcn `Table` (Name, Email, Joined) with a per-row **"View / credit"** ghost `Link` to
    `/admin/students/${u.id}`. Empty-state Card ("No students yet. Students appear here once they sign up.")
    when the list is empty (fresh-seed reality — no seeded student). Plain `<div>` wrapper (the (admin) layout
    owns the single `<main>` — 1.3 a11y).
- [x] **Task 5 — Per-student admin view: balance + ledger + credit form (AC1, AC3, AC4).**
  - [x] Create `src/app/(admin)/admin/students/[id]/page.tsx` (dynamic server RSC). `await requireAdmin()` FIRST.
    Await `params` (Next 16), then `const student = await db.user.findUnique({ where: { id }, select: { id, name, email, role } })`
    — if `!student || student.role !== "STUDENT"` → `notFound()` (mirror 2.3). Fetch `getBalance(id)` +
    `db.ledgerEntry.findMany({ where: { studentId: id }, orderBy: { createdAt: "asc" }, select: { id, type, amountCents, balanceAfterCents, createdAt } })`
    in parallel. Render: student identity header, a **balance Card** (`formatZar(balance)`), the **credit form
    island** (`<CreditWalletForm studentId={student.id} />` — plain string prop), and the **read-only ledger
    Table** (reuse the 3.1 wallet-page rendering: `formatSignedZar` + `formatLedgerType` + `formatZar`, empty-state
    when no entries). Plain `<div>` wrapper.
- [x] **Task 6 — Wiring + e2e manifest (AC4, AC5).**
  - [x] Add a **"Manage students"** `Button asChild`/`Link href="/admin/students"` to `(admin)/admin/page.tsx`
    (alongside the existing "Manage classes" / "New class" links).
  - [x] Append `{ path: "/admin/students", role: "ADMIN" }` to `tests/e2e/authenticated-routes.ts` (static route,
    empty-state → 200 RSC-500 smoke, 1.5 pattern). Do NOT add the dynamic `/admin/students/[id]` — no seeded
    student id exists; its live-authenticated coverage is deferred to CI (see deferred-work).
- [x] **Task 7 — Verify the chain (AC5).**
  - [x] `npx prisma validate` (schema untouched → valid). `npm run build` (tsc clean; confirm `/admin/students`
    and `/admin/students/[id]` in the route table). `npm test` (vitest green, incl. new credit-schema tests).
  - [x] Confirm the deferred live-credit + dynamic-route entry is recorded in `deferred-work.md` (added during
    create-story). Grep-confirm no `ledgerEntry.create` outside `wallet.ts` (AD-6 invariant preserved).

## Dev Notes

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-6 — Wallet is append-only; ONE serialized mutation path:** the `ADJUSTMENT` credit MUST go through
  `wallet.mutate(tx, studentId, …)` — it takes the per-student advisory lock (`pg_advisory_xact_lock(hashtext(studentId))`),
  reads balance under the lock, guards non-negative (NFR4), and appends the **immutable** `LedgerEntry` with
  `balanceAfterCents`. Pass the caller's `tx` so it composes into the `db.$transaction`. **Never
  `tx.ledgerEntry.create` directly.** Ledger rows are never updated/deleted. [Source: ARCHITECTURE-SPINE.md#AD-6; wallet.ts:126]
- **AD-9 — Money is integer cents (ZAR):** the admin enters Rand; convert **once** via `Math.round(rand*100)`
  (reuse `toCents`) at the server entry; store/return integer cents; format to Rand only at the UI edge
  (`formatZar`/`formatSignedZar`). No floats in the action or domain. [Source: ARCHITECTURE-SPINE.md#AD-9]
- **AD-3 — Authorization at the entry layer, not the layout:** `requireAdmin()` runs FIRST in the action
  (before parse/write) and first in every admin page (the layout is defense-in-depth, not the trusted guard —
  a direct RSC request can bypass it). `(admin)` requires `role === "ADMIN"`. [Source: ARCHITECTURE-SPINE.md#AD-3; auth-guards.ts]
- **AD-2 — Single data gateway:** import `{ db }` from `@/lib/db`; `db.$transaction(fn)`; never `new PrismaClient()`. [Source: ARCHITECTURE-SPINE.md#AD-2]
- **AD-1 — Additive isolation:** all new code lives under `(admin)/admin/students/**` + a pure schema + one
  landing-link edit + one manifest line; marketing routes/headers untouched. [Source: ARCHITECTURE-SPINE.md#AD-1]
- **NFR5 — Ledger referential integrity:** `LedgerEntry.studentId` is an FK to `User` (RESTRICT on delete). The
  action re-verifies the target user exists and is a STUDENT before crediting, so a bad id fails with a clean
  discriminated result, not a mid-tx FK violation. [Source: ARCHITECTURE-SPINE.md#AD-6 NFR5; schema.prisma#LedgerEntry]
- **Consistency conventions:** server-action result is a **discriminated union** (`{ ok: true, … }` |
  `{ ok: false, … }`) — never throw across the UI boundary for expected validation failures; **Zod at the
  server entry** (re-validate, don't trust the client); **sonner toast** at the client island (UX-DR5);
  money-path failures emit a structured log (never swallowed). [Source: ARCHITECTURE-SPINE.md#Consistency Conventions]

### The credit control flow (correctness-critical)
```
requireAdmin()                                   -- AD-3, before any parse/write
creditWalletSchema.safeParse({ studentId, amountRand })
  fail → { ok:false, fieldErrors }               -- AC2, no DB write
verify db.user.findUnique(studentId).role==="STUDENT"
  missing/non-student → { ok:false, message }    -- AC4 / NFR5
amountCents = toCents(amountRand)                -- AD-9, once
db.$transaction(tx =>
  wallet.mutate(tx, studentId,                   -- AD-6 seam (advisory lock → read → append)
    { type:"ADJUSTMENT", amountCents:+cents }))  -- positive → NFR4 guard never trips
revalidatePath(/admin/students/[id], /portal/wallet)  -- AC3
→ { ok:true, balanceAfterCents }
```
[Source: ARCHITECTURE-SPINE.md#AD-6/AD-9; wallet.ts; 2-1 createClassAction analog]

### Why this is simpler than 3.4 (do NOT over-engineer)
- **No `Serializable`, no `FOR UPDATE`, no retry loop.** 3.4 needed `Serializable` + SSI + `40001` retry to
  prevent seat **oversell** (a cross-row occupancy invariant). A wallet credit has **no oversell/last-seat
  invariant** — the only concurrency concern is two mutations to the SAME student's balance, and `wallet.mutate`'s
  per-student **advisory lock** already serializes those inside a plain `db.$transaction`. Use the default
  isolation. Adding `Serializable` here would be cargo-culting 3.4. [Source: ARCHITECTURE-SPINE.md#AD-6 vs AD-4]
- **No enrollment, no `enrollment.ts`, no status write.** This story touches only the ledger via `wallet.mutate`;
  it never writes `Enrollment.status` (AD-14 is irrelevant here). [Source: ARCHITECTURE-SPINE.md#AD-14]
- **Positive credit only.** `z.number().positive()` — no debit path, so the NFR4 non-negative guard is never the
  rejecting branch (it stays as the seam's safety net). Debit/claw-back adjustments are out of scope. [Source: epics.md#Story 3.5 AC1/AC2]

### Data model facts this story depends on (verified against schema.prisma)
- `User { id String @id, name String, email String @unique, role String? @default("STUDENT"), createdAt,
  ledgerEntries LedgerEntry[], @@map("user") }`. Students = `role === "STUDENT"` (also matches `null` default,
  but seeded/self-registered students carry the explicit "STUDENT" string — filter `where: { role: "STUDENT" }`).
  [Source: acce-nextjs/prisma/schema.prisma#User]
- `LedgerType` enum includes **`ADJUSTMENT`** already — no enum change. [Source: schema.prisma#LedgerType]
- `LedgerEntry { studentId (FK→User, RESTRICT), type LedgerType, amountCents Int (signed),
  balanceAfterCents Int, enrollmentId String?, paymentRef String?, createdAt, @@index([studentId]),
  @@index([studentId, createdAt]) }`. The ADJUSTMENT credit sets `studentId`, `type`, `amountCents` (positive),
  `balanceAfterCents` (written by `mutate`); `enrollmentId`/`paymentRef` are null. [Source: schema.prisma#LedgerEntry]

### Previous story intelligence (Epic 2 / Epic 3)
- **3.1 built `wallet.mutate` + `getBalance` and the wallet-page rendering.** 3.4 was the first `mutate` caller
  (BOOKING_CHARGE debit); 3.5 is the second (ADJUSTMENT credit). The seam already does the advisory lock +
  non-negative guard — do NOT reimplement. Reuse the 3.1 wallet-page balance Card + ledger Table + display
  helpers (`formatZar`, `formatSignedZar`, `formatLedgerType`) verbatim for the admin view's ledger block; the
  only difference is querying by the target `studentId` instead of `session.user.id`. [Source: 3-1-…md; wallet.ts; wallet-display.ts]
- **2.1 `createClassAction` + `ClassForm` are the closest analogs** — copy the action skeleton (requireAdmin →
  safeParse → target-existence re-check → discriminated result) and the client-island pattern (react-hook-form +
  zodResolver + `toast` from `@/components/ui/sonner` + gold-token CTA + `fieldErrors`-mapback). The credit form
  is a **simpler** version (one amount field). [Source: (admin)/admin/classes/new/actions.ts, class-form.tsx, class-form-schema.ts]
- **2.2 admin classes list is the list-page template**; **2.3 edit page is the dynamic `params`-await +
  `findUnique` + `notFound()` + serialisable-props-to-island template.** Copy their shells for the students
  list + per-student view. [Source: (admin)/admin/classes/page.tsx; (admin)/admin/classes/[id]/edit/page.tsx]
- **CTA token rule (2.1/2.2/3.2/3.3/3.4):** gold CTA uses `bg-accent text-accent-foreground hover:bg-accent/90`
  — **never hardcoded hex** — so gold+navy flip per light/dark mode (UX-DR2/DR6). The 2.1 review auto-fixed a
  hardcoded-hex CTA; do not repeat that. [Source: 2-1-…md Review; DESIGN.md]
- **1.5 RSC-500 trap:** never pass a Client Component element through a non-`children` prop from a Server
  Component. Pass the credit-form island a plain `studentId` string prop (safe). [Source: 1-5-…md; lessons-learned]
- **1.3 a11y:** the (admin) layout owns the single `<main>` landmark — new pages use a plain `<div>` wrapper,
  never a second `<main>` (1.3 review finding; nested-landmark = a11y violation). [Source: 1-3-…md; wallet/page.tsx:86]
- **Seed reality (1.4):** only Priyanka (ADMIN) is seeded — **no student user, no balances**. So `/admin/students`
  renders its empty-state on a fresh seed, and a live ADJUSTMENT credit can only be exercised against a
  self-registered student (Story 1.2) or in CI. Do NOT fake a live query or seed a student in this story.
  [Source: prisma/seed-data.ts (ADMIN_USER only); 3-4-…md Dev Notes]
- **Sandbox reality (1.1/1.5/2.x/3.x):** prod DB creds are blocked; live DB writes + auth e2e are deferred to CI
  ephemeral-Postgres. Static verification (`prisma validate` + `build` + vitest) is the bar in-sandbox. [Source: deferred-work.md]
- **Git:** work lands on branch `epic-3` (chained off the 3.4 tip). New files under `(admin)/admin/students/**`
  + a pure schema + `page.tsx`/manifest edits — nothing conflicts with prior epics. [Source: sprint-status.yaml]

### UX / accessibility (UX-DR5, UX-DR6, NFR10, DESIGN.md)
- **UX-DR5:** credit success/error → **sonner** `toast` (Toaster already mounted). Success ("Wallet credited"),
  validation error (specific message from `fieldErrors`/`message`), unexpected error (generic retry). [Source: epics.md#UX-DR5]
- **UX-DR6 / NFR10:** the credit submit button is keyboard-operable, visible focus ring, ≥44px, both-mode
  contrast, `aria-busy` while submitting; the amount `Input` is ≥44px with a clear label; label text (not colour)
  carries state. One gold-accent CTA per view (UX-DR2) — the credit button is it; keep list/Back links subordinate. [Source: epics.md#UX-DR6; DESIGN.md]

### Testing standards
- Framework: **vitest** (jsdom), `npm test`, specs under `tests/unit/**`. **Add unit tests for the pure
  credit-schema** (valid/invalid amount, Rand→cents rounding) — mirrors `reserve-schema.test.ts` /
  `class-form-schema.test.ts`. Do NOT unit-test `creditWalletAction`/the pages (they import `db` + need
  Postgres); do NOT over-mock Prisma to fake the tx/lock. [Source: acce-nextjs/vitest.config.ts; 3-4-…md]
- **Deferred (recorded in `deferred-work.md`):** the live-authenticated `/admin/students/[id]` dynamic-route run
  + the real ADJUSTMENT-credit round-trip (submit → assert balance increased + ledger row present) — needs a
  real student + real Postgres; CI ephemeral-Postgres, same wall as 1.1/1.5/2.2/2.3/3.4. [Source: deferred-work.md]

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `acce-nextjs/src/*`.
- NEW files:
  - `src/app/(admin)/admin/students/page.tsx` — students list (server RSC, requireAdmin, Table, empty-state).
  - `src/app/(admin)/admin/students/[id]/page.tsx` — student admin view (balance + ledger + credit form island).
  - `src/app/(admin)/admin/students/[id]/actions.ts` — `creditWalletAction` (`"use server"`, ADJUSTMENT via wallet.mutate).
  - `src/app/(admin)/admin/students/[id]/credit-wallet-form.tsx` — `"use client"` island (form + toast).
  - `src/app/(admin)/admin/students/[id]/credit-schema.ts` (or `src/lib/credit-schema.ts`) — pure Zod + Rand→cents.
  - `tests/unit/credit-schema.test.ts` — unit tests.
- UPDATE:
  - `src/app/(admin)/admin/page.tsx` — add "Manage students" link.
  - `tests/e2e/authenticated-routes.ts` — add `{ path: "/admin/students", role: "ADMIN" }`.
  - `_bmad-output/implementation-artifacts/deferred-work.md` — deferred live-credit/dynamic-route entry (added at create-story).
- Aligns with the ARCHITECTURE-SPINE source tree: `(admin)/admin/**` is the guarded admin surface (AD-1/AD-3);
  the credit routes through `src/lib/wallet.ts#mutate` (AD-6). No variance. [Source: ARCHITECTURE-SPINE.md#Structural Seed / Capability→Architecture Map]

### Latest tech notes
- **Next 16 App Router:** dynamic page `params` is a Promise — `const { id } = await params`. Server action in
  `actions.ts` (`"use server"`); `revalidatePath()` from `next/cache` after the credit; the client island uses
  `useRouter().refresh()`. Pass the island a plain string prop (1.5 RSC-500 safety). [Source: 2-3-…md; 1-5-…md]
- **Prisma 6.19.x `$transaction`:** `db.$transaction(async (tx) => …)` with default isolation is correct here —
  the per-student advisory lock in `wallet.mutate` provides the serialization; no `Serializable`/`FOR UPDATE`/retry
  needed (that is 3.4's oversell concern, not a credit concern). [Source: wallet.ts; ARCHITECTURE-SPINE.md#AD-6]
- **No date library** — ledger/join dates render via native `Intl` `toLocaleString("en-ZA")` (reuse the 3.1/2.2
  formatter; no `timeZone` pinned, consistent with the 2.2 timezone deferral). [Source: 3-1-…md; deferred-work.md#story-2.2]

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3 / Story 3.5 / FR15 / NFR4 / UX-DR5 / UX-DR6 / readiness M1]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-1, AD-2, AD-3, AD-6, AD-9, NFR4, NFR5, "Deferred: Wallet balance origin", "Consistency Conventions", "Capability → Architecture Map"]
- [Source: acce-nextjs/prisma/schema.prisma#User / LedgerType / LedgerEntry]
- [Source: acce-nextjs/src/lib/wallet.ts (mutate — the AD-6 ADJUSTMENT seam; getBalance)]
- [Source: acce-nextjs/src/lib/wallet-display.ts (formatSignedZar, formatLedgerType incl. ADJUSTMENT)]
- [Source: acce-nextjs/src/lib/auth-guards.ts (requireAdmin); acce-nextjs/src/lib/db.ts ($transaction)]
- [Source: acce-nextjs/src/app/(admin)/admin/classes/new/actions.ts + class-form.tsx + class-form-schema.ts (2.1 action + island + toCents)]
- [Source: acce-nextjs/src/app/(admin)/admin/classes/page.tsx (2.2 list shell); (admin)/admin/classes/[id]/edit/page.tsx (2.3 dynamic params + notFound)]
- [Source: acce-nextjs/src/app/(portal)/portal/wallet/page.tsx (3.1 balance Card + ledger Table rendering to reuse)]
- [Source: acce-nextjs/src/app/(admin)/admin/page.tsx (admin landing — add Manage students link); tests/e2e/authenticated-routes.ts (manifest)]
- [Source: _bmad-output/implementation-artifacts/3-1-…md; 3-4-…md; 2-1-…md; 2-2-…md; 2-3-…md; deferred-work.md]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6 (autopilot subagent, 2026-07-06)

### Debug Log References

No debug issues encountered. Clean implementation following established patterns.

### Completion Notes List

- ✅ Task 1: `credit-schema.ts` (colocated under `students/[id]/`) + `credit-schema.test.ts` (22 unit tests): creditWalletSchema (studentId non-empty + amountRand positive via z.coerce) + toCents helper (Math.round * 100). All invalid cases (0, negative, empty, non-numeric, null, undefined) correctly rejected. 
- ✅ Task 2: `actions.ts` — `creditWalletAction` server action: requireAdmin-first → safeParse → target-user STUDENT re-check → toCents → db.$transaction(wallet.mutate ADJUSTMENT) → revalidatePath both admin+portal views → discriminated result. Default isolation (no Serializable/FOR UPDATE/retry — per-student advisory lock in wallet.mutate suffices).
- ✅ Task 3: `credit-wallet-form.tsx` — "use client" island: react-hook-form + zodResolver (typedResolver cast) + amount (R) Input (number/decimal/min-h-44px) + gold-token CTA (bg-accent/text-accent-foreground tokens — NOT hardcoded hex, 2.1 review lesson) + aria-busy + fieldErrors mapback + toast.success("Wallet credited") + router.refresh() on success.
- ✅ Task 4: `(admin)/admin/students/page.tsx` — server RSC, requireAdmin-first, findMany STUDENT orderBy createdAt asc, shadcn Table (Name/Email/Joined), per-row ghost "View / credit" link, empty-state Card, plain div wrapper (1.3 a11y).
- ✅ Task 5: `(admin)/admin/students/[id]/page.tsx` — dynamic server RSC, requireAdmin-first, await params, findUnique+notFound (non-STUDENT), parallel getBalance+ledgerEntry.findMany, identity header + balance Card + CreditWalletForm island (plain string prop, RSC-500 safe) + read-only ledger Table (mirrors 3.1 wallet page rendering with formatSignedZar/formatLedgerType/formatZar).
- ✅ Task 6: Admin landing "Manage students" link added; `/admin/students` appended to e2e authenticated-routes manifest (static route, ADMIN role).
- ✅ Task 7: prisma validate clean (schema untouched), build clean (tsc + /admin/students + /admin/students/[id] ƒ Dynamic in route table), 275/275 vitest (22 new credit-schema), grep confirmed ledgerEntry.create ONLY in wallet.ts (AD-6 invariant). Deferred live-credit round-trip confirmed recorded in deferred-work.md (create-story entry, 2026-07-06).

### File List

acce-nextjs/src/app/(admin)/admin/students/page.tsx (NEW)
acce-nextjs/src/app/(admin)/admin/students/[id]/page.tsx (NEW)
acce-nextjs/src/app/(admin)/admin/students/[id]/actions.ts (NEW)
acce-nextjs/src/app/(admin)/admin/students/[id]/credit-wallet-form.tsx (NEW)
acce-nextjs/src/app/(admin)/admin/students/[id]/credit-schema.ts (NEW)
acce-nextjs/tests/unit/credit-schema.test.ts (NEW)
acce-nextjs/src/app/(admin)/admin/page.tsx (UPDATED — Manage students link)
acce-nextjs/tests/e2e/authenticated-routes.ts (UPDATED — /admin/students manifest entry)
_bmad-output/implementation-artifacts/3-5-admin-credits-a-students-wallet-resolves-the-balance-origin-gap.md (UPDATED — status, tasks, dev record)
_bmad-output/implementation-artifacts/sprint-status.yaml (UPDATED — in-progress → review)

### Change Log

- 2026-07-06: Story 3.5 implemented. Built admin student surface (list + per-student view with balance/ledger/credit form), creditWalletAction (ADJUSTMENT via wallet.mutate — the SECOND mutate caller), pure credit-schema + 22 unit tests, wiring to admin landing + e2e manifest. 275/275 vitest, build clean, prisma validate clean. Last story in Epic 3.
