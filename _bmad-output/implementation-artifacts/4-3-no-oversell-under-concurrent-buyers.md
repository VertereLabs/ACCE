---
baseline_commit: 7ff9f33f581ca5e191934dba961b4af7613a982d
---

# Story 4.3: No-oversell under concurrent buyers

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As Priyanka,
I want a full class to be impossible to oversell even when several students buy the last seat at once,
so that I never have more enrolled students than seats.

## Context & current state (READ FIRST)

Epic 4 is the plan's explicit **risk boundary** (payments + concurrency). Stories **4.1 (`done`)** and
**4.2 (`done`)** built the Paystack init + 15-min PENDING hold and the verified idempotent confirm webhook.
This story — **the last correctness story of the epic** — proves the **no-oversell invariant** (FR10, NFR1)
that the whole reservation design was built to guarantee.

**The invariant is ALREADY implemented and reviewed `done` — this story does NOT re-implement it.**
`reserveSeat()` (Story 3.4 + 4.1) and `confirmPaidSeat()` (Story 4.2) already run in a single interactive
`Serializable` transaction that: locks the `GroupSession` row `SELECT … FOR UPDATE`, counts
`PENDING`+`CONFIRMED` occupancy under the lock via `occupiedEnrollmentWhere(now)`, rejects when
`occupied >= capacity`, and retries on Prisma `P2034` / raw pg `40001` with bounded backoff. The
no-oversell **guarantee comes from Serializable SSI** (Postgres snapshot-isolation conflict detection) —
the `FOR UPDATE` row lock is belt-and-braces. **[Source: acce-nextjs/src/lib/enrollment.ts:189-461 (reserveSeat), 573-793 (confirmPaidSeat); ARCHITECTURE-SPINE.md#AD-4]**

**So what does 4.3 actually deliver?** The **test that PROVES it under real concurrency** — the
AD-4-mandated **real-Postgres integration test** that every prior story deferred to "CI ephemeral-Postgres":

> *AD-4: "Verification **must** include a real-Postgres concurrency integration test (unit mocks can't
> exercise `40001`)."* **[Source: ARCHITECTURE-SPINE.md#AD-4]**

This story authors that test. Unit mocks are **structurally incapable** of reproducing SSI serialization
aborts / `40001` — the invariant can only be exercised against a live Postgres firing genuinely-concurrent
transactions. The test fires **N+1** simultaneous `reserveSeat` calls at an **N-seat** class and asserts
**exactly N** win and the rest get `class_full`, across **both** the balance path and the Paystack/PENDING
hold path (AC1's "across both the balance and Paystack paths").

**Sandbox reality (same wall as 1.1/1.5/2.x/3.4/4.1/4.2):** the dev sandbox has **no reachable Postgres**
and prod DB creds are blocked. The integration test is therefore **skip-gated on `DATABASE_URL`** (exactly
like `tests/e2e/global-setup.ts`) — it **skips cleanly in-sandbox** and runs **live-green in the CI
ephemeral-Postgres job**. The in-sandbox acceptance bar is: the test compiles (tsc/build clean), the
existing unit suite stays green, and the integration harness is authored + correctly gated. The live green
run is **deferred to CI** and recorded in `deferred-work.md`; the two-browser staging check is inherently
**manual** and recorded as a verification checklist item.

**This story builds:**
1. **`tests/integration/no-oversell.integration.test.ts` (NEW)** — the AD-4 concurrency proof: N+1
   concurrent `reserveSeat` on an N-seat class → exactly N succeed, rest `class_full`, for BOTH the balance
   path and the Paystack/PENDING path. Plus supporting no-oversell assertions (see AC2/AC3).
2. **`acce-nextjs/vitest.integration.config.ts` (NEW)** — a **node-environment** Vitest project scoped to
   `tests/integration/**` (the default `vitest.config.ts` is jsdom + `tests/unit/**` only), so the
   integration suite is opt-in and never runs in the sandbox unit pass.
3. **A dependency-free integration harness** (a small `tests/integration/helpers.ts` or inline setup) that
   reads `DATABASE_URL`, imports the existing `@/lib/db` singleton (AD-2) **after** the skip guard, seeds a
   throwaway subject/class/students with deterministic test-scoped ids, funds wallets via `wallet.mutate`
   for the balance path, and tears everything down. **No new dependency** (no testcontainers) — the CI job
   provides the ephemeral Postgres via `DATABASE_URL` (service container), matching the whole codebase's
   established posture.
4. **`package.json` `test:integration` script** + a one-line note wiring it into the CI/deferred plan.

**CRITICAL SCOPE BOUNDARIES:**
- **NO production code change.** `reserveSeat` / `confirmPaidSeat` / the actions / the islands / the pages
  are all `done`. This is a **verification-only** story. If — and only if — the concurrency test surfaces a
  genuine oversell defect, the fix lands in `enrollment.ts` (the single reservation seam, AD-4); the story's
  deliverable is the **test**, not new behaviour.
- **NO new runtime/dev dependency.** No `testcontainers`, no Docker orchestration in-repo, no axios. Use the
  existing `@prisma/adapter-pg` + `pg.Pool` singleton and native tooling only (AD-13, lessons-learned).
- **NO full CI-pipeline build-out.** Authoring a `.github/workflows/*` ephemeral-Postgres pipeline is a
  cross-cutting concern spanning *every* story's deferred live items (a separate testarch/CI task), not
  4.3's remit. 4.3 delivers the **no-oversell test + its runner config + script**, and records the CI wiring
  need in `deferred-work.md`. (If you scaffold a minimal CI job, keep it strictly additive and optional —
  see Dev Notes "CI scope".)
- **NO schema/migration/enum/env/CSP change.** The invariant, the models, and `DATABASE_URL` all exist.
- **NO change to the default `vitest.config.ts` unit run** — it must stay jsdom + `tests/unit/**` so
  `npm test` stays green in the sandbox with no DB. The integration project is a **separate** config.

## Acceptance Criteria

**AC1 — Real-Postgres N+1 concurrency test proves exactly-N-win across BOTH paths (FR10, NFR1, AD-4).**
Given a real Postgres (via `DATABASE_URL`) and a `GroupSession` with **capacity N** (use a small N, e.g. 2
or 3, for a fast deterministic race),
When **N+1** `reserveSeat(studentId, classId)` calls are fired **simultaneously** (`Promise.all` over N+1
distinct students) — run once for the **balance path** (all N+1 students funded with balance ≥ price) and
once for the **Paystack/PENDING path** (all N+1 students at R0 balance),
Then **exactly N** calls return `{ ok: true }` (balance path → `outcome: "confirmed"`; PENDING path →
`outcome: "pending_payment"`) and **the remaining 1** returns `{ ok: false, reason: "class_full" }`; and a
direct DB re-count of `occupiedEnrollmentWhere(now)` for the class equals **N** (never N+1). The balance
run additionally asserts **exactly N** `BOOKING_CHARGE` `LedgerEntry` rows for the class's enrollments (one
per confirmed seat, AD-8) — never N+1. The test **skips** (does not fail) when `DATABASE_URL` is unset.

**AC2 — The confirm/webhook path also cannot oversell a refilled class (AD-4, AD-5, AD-15).**
Given a class filled to capacity by CONFIRMED enrollments **plus** one separate student holding an expired
`PENDING` seat whose reference then "pays",
When `confirmPaidSeat({ reference, amountCents, … })` is processed for that expired/orphaned hold against
the now-full class,
Then **no seat is confirmed and the class is not oversold** — the captured amount is conserved to the
student's wallet as a `CANCELLATION_REFUND` (AD-15), the enrollment ends `CANCELLED`, and a DB re-count
stays at capacity. (Exercises the confirm-path re-check-under-lock that 4.2 authored but could not prove
live.) Skip-gated on `DATABASE_URL`.

**AC3 — Idempotency + rollback invariants hold live (NFR3, NFR4, FR11) — folded in from 3.4/4.1/4.2 defers.**
Given the same integration harness, the suite also asserts, against real Postgres: **(a)** idempotent replay
— `confirmPaidSeat` with the **same `reference` twice** (sequential and concurrent) yields exactly one
`Payment` row, exactly one `BOOKING_CHARGE`, the enrollment `CONFIRMED` once, both calls `ok:true`; **(b)**
FR11 — a second `reserveSeat` while the student already holds a non-cancelled enrollment returns
`already_enrolled` with **no** duplicate row/charge; **(c)** NFR4 — a balance-path reserve with balance <
price now takes the **PENDING** branch (creates a hold, writes **no** `BOOKING_CHARGE`), and a forced
`wallet.mutate` debit beyond balance throws `WalletInsufficientFundsError` and writes **no** ledger row.
These consolidate the deferred concurrency/rollback items from 3.4, 4.1, and 4.2 into one authored suite.
Skip-gated on `DATABASE_URL`.

**AC4 — The integration suite is isolated, self-cleaning, and never pollutes the sandbox unit run.**
Given `tests/integration/**` is run by a **separate** `vitest.integration.config.ts` (node environment, no
jsdom/`tests/setup.ts` React mocks) invoked via a new `test:integration` npm script,
When `npm test` (the default unit run) executes in the sandbox with no `DATABASE_URL`,
Then it is **unchanged** — still jsdom, still `tests/unit/**` only, still green — and the integration test
is **not** collected by it. When `npm run test:integration` runs with no `DATABASE_URL` it **skips** all
cases cleanly (no throw, no false-green). Each integration test creates its own data under deterministic
test-scoped ids (e.g. `it43-*`) and **tears it down** in `afterEach`/`afterAll` (delete LedgerEntry →
Enrollment → GroupSession → User → Subject, respecting FK order) so repeated CI runs stay deterministic.

**AC5 — The chain stays green and the deferral is recorded (static bar for the sandbox).**
Given the sandbox cannot run the live test,
When the story is delivered,
Then `npx prisma validate` passes (schema untouched), `npm run build` succeeds (tsc clean — the new test
files are type-checked or excluded consistently with the existing `tests/**` tsconfig treatment), and
`npm test` (vitest unit) stays green (no regression, integration suite excluded). The **live green run** of
the no-oversell integration suite is **deferred to the CI ephemeral-Postgres job** and recorded in
`deferred-work.md` (consolidating/closing the 3.4 item (a), 4.1, and 4.2 concurrency defers by pointing them
at this authored test). The **two-browser manual staging check** (last seat, two browsers → one wins, other
"class full") is recorded as a manual verification checklist item (epics Story 4.3 AC2 "manual verification").

## Tasks / Subtasks

- [x] **Task 1 — Node-env integration Vitest project (AC4).**
  - [x] Create `acce-nextjs/vitest.integration.config.ts`: `defineConfig({ test: { environment: "node",
    include: ["tests/integration/**/*.{test,spec}.ts"], globals: true, hookTimeout: 30000, testTimeout:
    30000 }, resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } } })`. **No**
    `setupFiles: ./tests/setup.ts` (that file mocks `next/link`/`next/image` for jsdom — irrelevant and
    wrong for node integration). Longer timeouts because real tx + retry/backoff take longer than unit tests.
  - [x] Do **NOT** modify `vitest.config.ts` — it must stay `environment: "jsdom"`, `include:
    ["tests/unit/**/*.{test,spec}.{ts,tsx}"]` so `npm test` in the sandbox is unaffected. [Source: acce-nextjs/vitest.config.ts]
  - [x] Add `"test:integration": "vitest run --config vitest.integration.config.ts"` to `package.json`
    scripts. (Leave `test` = `vitest run` untouched.)
- [x] **Task 2 — Skip-gated integration harness, dependency-free (AC1-AC4, AD-2).**
  - [x] Create `tests/integration/helpers.ts` (or inline in the spec) exporting a `hasDb()` guard =
    `!!process.env.DATABASE_URL`. **Mirror `tests/e2e/global-setup.ts`:** import `@/lib/db` **dynamically,
    AFTER** the guard, because `db.ts` throws on a missing `DATABASE_URL` — a top-level `import { db }` would
    crash collection in the sandbox. Use `describe.skipIf(!hasDb())` (or `test.skip(!hasDb())`) so cases skip
    cleanly. [Source: tests/e2e/global-setup.ts:130-163 (the DATABASE_URL guard + dynamic db import pattern)]
  - [x] Seed helpers (deterministic ids, prefix `it43-`): `createSubject()`, `createClass({ capacity,
    priceCents, start=future, status:"SCHEDULED" })`, `createStudent(i)`, `fundWallet(studentId, cents)` =
    `db.$transaction(tx => wallet.mutate(tx, studentId, { type: "TOPUP", amountCents: cents }))` (TOPUP or
    ADJUSTMENT — positive credit; funds the balance path). **NO new dependency** — use the `@/lib/db`
    singleton (AD-2), `@/lib/wallet` `mutate`, and `@/lib/enrollment` `reserveSeat`/`confirmPaidSeat`
    directly. [Source: src/lib/wallet.ts:31-40 (WalletMutateInput), 126-160 (mutate); prisma/schema.prisma:160-167 (LedgerType: TOPUP/ADJUSTMENT exist)]
  - [x] Teardown in `afterEach`/`afterAll`: delete in FK-safe order — `LedgerEntry` (by studentId or
    enrollmentId) → `Enrollment` (by groupSessionId) → `Payment` (by reference) → `GroupSession` → `User`
    (the test students) → `Subject`. Then `await db.$disconnect()` in a final `afterAll` (mirror
    global-setup's `finally { await db.$disconnect() }`). [Source: tests/e2e/global-setup.ts:238-242]
- [x] **Task 3 — The N+1 no-oversell concurrency proof, both paths (AC1).**
  - [x] `tests/integration/no-oversell.integration.test.ts`. For a class of **capacity N** (e.g. N=2 or 3):
    create N+1 distinct students. **Balance run:** `fundWallet` each with `priceCents` (or more), then
    `const results = await Promise.all(students.map(s => reserveSeat(s.id, classId)))`. Assert: count of
    `r.ok && r.outcome === "confirmed"` === **N**; count of `!r.ok && r.reason === "class_full"` === **1**;
    `db.enrollment.count({ where: { groupSessionId: classId, ...occupiedEnrollmentWhere(new Date()) } })`
    === **N**; `db.ledgerEntry.count({ where: { type: "BOOKING_CHARGE", enrollment: { groupSessionId } } })`
    (or count via the enrollments' ids) === **N**. [Source: src/lib/enrollment.ts:106-118 (ReserveSeatResult shape); src/lib/class-occupancy.ts (occupiedEnrollmentWhere)]
  - [x] **PENDING/Paystack run:** fresh class (capacity N) + N+1 students at **R0 balance** (no funding),
    `Promise.all(reserveSeat)`. Assert: exactly **N** return `outcome: "pending_payment"` (each with a
    `paymentRef`), exactly **1** returns `class_full`, occupancy re-count === **N**, and **zero**
    `BOOKING_CHARGE` rows (the PENDING path writes no charge — AD-7/AD-8). This is AC1's "across both the
    balance and Paystack paths". [Source: enrollment.ts:369-414 (PENDING branch, no wallet.mutate)]
  - [x] Because the losers may hit a `40001`/`P2034` serialization abort and retry, assert on the **final
    committed state** (the counts above), not on timing. A single loser resolving to `class_full` after its
    retry finds the seat gone is the correct, expected outcome. [Source: enrollment.ts:440-444 (retry loop), ARCHITECTURE-SPINE.md#AD-4]
- [x] **Task 4 — Confirm-path + idempotency + rollback assertions (AC2, AC3).**
  - [x] **AC2 (confirm cannot oversell a refilled class, AD-15):** fill a capacity-N class with N CONFIRMED
    enrollments (via funded `reserveSeat`); create one extra student's PENDING hold on the same class, then
    force it past capacity (its own row is the (N+1)th) — call `confirmPaidSeat({ reference:
    thatPaymentRef, amountCents: priceCents, status:"success", type:"charge.success", raw:{} })`. Assert:
    outcome `refunded_to_wallet`; that student's balance increased by `priceCents` (CANCELLATION_REFUND);
    enrollment `CANCELLED`; occupancy re-count still === **N** (no oversell). [Source: enrollment.ts:508-535 (decideConfirmOutcome), 731-749 (refund branch)]
  - [x] **AC3(a) idempotent replay (NFR3):** create a PENDING hold, then call `confirmPaidSeat` twice with
    the **same reference** (once sequentially; optionally once via `Promise.all` of two identical calls).
    Assert exactly one `Payment` row, exactly one `BOOKING_CHARGE`, enrollment `CONFIRMED` once, both calls
    `ok:true` (second → `already_processed`). [Source: enrollment.ts:589-615 (Payment idempotency gate → P2002 → already_processed)]
  - [x] **AC3(b) FR11:** funded student reserves (confirmed), then reserves the same class again → assert
    `already_enrolled`, no second Enrollment row, no second charge. [Source: enrollment.ts:258-264]
  - [x] **AC3(c) NFR4 rollback:** R0-balance student `reserveSeat` on a class with a seat → asserts the
    **PENDING** outcome (no `BOOKING_CHARGE` written); and a direct `db.$transaction(tx => mutate(tx,
    studentId, { type:"BOOKING_CHARGE", amountCents: -priceCents, enrollmentId }))` on an unfunded wallet
    **rejects** with `WalletInsufficientFundsError` and leaves **zero** ledger rows. [Source: src/lib/wallet.ts (WalletInsufficientFundsError, NFR4 non-negative guard)]
- [x] **Task 5 — Verify the chain, record deferrals + manual check (AC5).**
  - [x] `npx prisma validate` (schema untouched) · `npm run build` (tsc clean; confirm the new
    `tests/integration/**` files don't break the build — match the existing `tests/**` tsconfig treatment;
    if `tsconfig.json` excludes `tests`, they're fine, else ensure they type-check) · `npm test` (vitest
    unit — unchanged, still green, integration suite NOT collected) · `npm run test:integration` in the
    sandbox → confirm it **skips** cleanly (prints a skip, exit 0), does NOT error on the missing DB.
  - [x] The integration suite is Vitest node-env (not a GET route) → **NO** e2e `authenticated-routes.ts`
    manifest change, **NO** Playwright change.
  - [x] Update `deferred-work.md`: add a "Story 4.3" section recording that the **live green run** of
    `no-oversell.integration.test.ts` is deferred to the CI ephemeral-Postgres job (set `DATABASE_URL` to
    the service-container pg, run `prisma migrate deploy` + `npm run test:integration`); and note that this
    authored test **closes/supersedes** the deferred concurrency items from 3.4 (item a), 4.1, and 4.2 — the
    test now EXISTS, only its execution is environmental. Record the **two-browser manual staging check** as
    a manual verification item (last seat, two browsers → one wins, other "class full"; epics 4.3 AC2).
  - [x] Append an autopilot-decisions.md entry if any non-trivial implementation choice arises (e.g. test-id
    scheme, chosen N, whether `tsconfig` needs a `tests/integration` include).

## Dev Notes

### The invariant is already built — you are proving it, not building it
`reserveSeat` (3.4 + 4.1) and `confirmPaidSeat` (4.2) are `done` and code-reviewed. Do **not** touch them.
Read them so your test calls them correctly:
- `reserveSeat(studentId: string, classId: string): Promise<ReserveSeatResult>` — the discriminated result:
  `{ ok:true, outcome:"confirmed", enrollmentId }` | `{ ok:true, outcome:"pending_payment", enrollmentId,
  paymentRef, amountCents }` | `{ ok:false, reason:"class_full"|"already_enrolled"|"not_available"|"error" }`.
  [Source: acce-nextjs/src/lib/enrollment.ts:106-118, 189-461]
- `confirmPaidSeat(args: { reference; amountCents; status; type; raw }): Promise<ConfirmResult>` —
  `{ ok:true, outcome:"confirmed"|"refunded_to_wallet"|"already_processed"|"noop" }` | `{ ok:false,
  reason:"error" }`. [Source: enrollment.ts:487-489, 573-793]
- `getBalance(studentId, tx?)` and `mutate(tx, studentId, { type, amountCents, enrollmentId?, paymentRef? })`
  from `@/lib/wallet`. Fund the balance path via a positive `TOPUP`/`ADJUSTMENT` mutate. [Source: src/lib/wallet.ts:83, 126]
- `occupiedEnrollmentWhere(now)` from `@/lib/class-occupancy` — the exact AD-5 predicate to re-count
  occupancy in assertions. [Source: src/lib/class-occupancy.ts]

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-4 — One canonical seat reservation; oversell prevented by SSI (THE HEART OF THIS STORY):** every
  seat acquisition (balance + Paystack) goes through the single `reserveSeat()` in one interactive
  `Serializable` transaction; the no-oversell guarantee comes from **SSI**, with `FOR UPDATE` on the
  `GroupSession` as belt-and-braces; retries on `P2034`/`40001`. **"Verification MUST include a real-Postgres
  concurrency integration test (unit mocks can't exercise 40001)."** That test is THIS story. [Source: ARCHITECTURE-SPINE.md#AD-4]
- **AD-5 — Capacity is derived, never stored:** `occupied = count(Enrollment where status ∈
  {PENDING,CONFIRMED} and (pendingExpiresAt is null or > now))`; `seatsLeft = capacity − occupied`. Assert
  occupancy with `occupiedEnrollmentWhere(now)`, never a stored counter (there isn't one). [Source: ARCHITECTURE-SPINE.md#AD-5]
- **AD-8 — Exactly one BOOKING_CHARGE per confirmed enrollment:** the balance path charges at reserve-time;
  the Paystack path at webhook confirm-time; mutually exclusive; enforced by the partial-unique index. Your
  balance-run assertion "N BOOKING_CHARGE rows" and your PENDING-run assertion "0 BOOKING_CHARGE rows" both
  exercise this. [Source: ARCHITECTURE-SPINE.md#AD-8]
- **AD-15 — Late/orphan payment conserves money to the wallet:** the AC2 confirm-path test exercises the
  "seat gone → CANCELLATION_REFUND, never oversold" branch. [Source: ARCHITECTURE-SPINE.md#AD-15]
- **AD-2 — Single data gateway:** the harness uses the `@/lib/db` singleton (`PrismaClient` +
  `@prisma/adapter-pg` + `pg.Pool`). **Never `new PrismaClient()`.** Import it **after** the `DATABASE_URL`
  skip guard (db.ts throws on a missing URL). [Source: ARCHITECTURE-SPINE.md#AD-2; tests/e2e/global-setup.ts:159-163]
- **AD-13 — no new SDK/dependency:** no testcontainers, no axios. The CI job supplies the ephemeral Postgres
  via `DATABASE_URL`. [Source: ARCHITECTURE-SPINE.md#AD-13; lessons-learned "native fetch, minimal deps"]
- **Consistency Conventions — discriminated results / integer cents:** assert on the `{ ok, outcome |
  reason }` union and integer `*Cents`; no floats. [Source: ARCHITECTURE-SPINE.md#Consistency Conventions]

### Why this MUST be a real-Postgres test (not a unit mock)
The oversell race is won or lost by **Postgres SSI**: two concurrent Serializable transactions both read the
same occupancy snapshot, both try to commit the (N+1)th seat, and Postgres aborts one with `40001` — which
`reserveSeat` catches and retries, on retry finding the seat taken → `class_full`. A mocked Prisma client
cannot reproduce snapshot conflicts or `40001`; a unit test asserting "exactly N win" against mocks would
**false-green** the single most important safety property in the app. This is precisely why AD-4 mandates a
real-Postgres integration test and why 3.4/4.1/4.2 each deferred it here. [Source: ARCHITECTURE-SPINE.md#AD-4; enrollment.ts:141-154 (isSerializationError), 195-421 (the Serializable tx)]

### The skip-gate pattern to copy (tests/e2e/global-setup.ts)
`tests/e2e/global-setup.ts` is the reference: `if (!process.env.DATABASE_URL) { …skip… }` then
`const { db } = await import("@/lib/db")` **after** the guard, and `finally { await db.$disconnect() }` to
avoid a hanging pg Pool. Replicate that shape so the integration suite skips in the sandbox and closes its
connection in CI. [Source: tests/e2e/global-setup.ts:126-142, 159-163, 238-242]

### Choosing N and structuring the race
- Use a **small N** (2 or 3) so the race is tight and the test is fast/deterministic; N+1 concurrent
  transactions is enough to force at least one SSI abort on the last seat.
- Fire with `Promise.all(students.map(s => reserveSeat(s.id, classId)))` — genuine concurrency on the pg
  Pool (ensure the pool `max` ≥ N+1; the app default pool should suffice for N=2/3, but if the losers
  serialize on connection acquisition rather than SSI the assertion still holds — assert final state).
- Assert on **committed final state** (occupancy count, confirmed count, BOOKING_CHARGE count), not on which
  specific promise won. Winners/losers are non-deterministic; the counts are the invariant.

### CI scope (what to build vs record)
4.3 delivers the **test + `vitest.integration.config.ts` + `test:integration` script**. Building the full
`.github/workflows` ephemeral-Postgres pipeline is **out of scope** — it must also run the deferred live
items from 1.1 (`migrate deploy`), 1.5 (authenticated smoke), 4.1/4.2 (webhook round-trips), etc., which is
a dedicated testarch/CI story, not this one. Record the wiring need in `deferred-work.md`. If you choose to
add a **minimal, additive** CI job, keep it optional and non-breaking (a `postgres` service container + `set
DATABASE_URL` + `prisma migrate deploy` + `npm run test:integration`) and log it as a `medium` decision — but
prefer to defer.

### tsconfig / build treatment of tests
Check `acce-nextjs/tsconfig.json` for how `tests/**` is handled (the existing `tests/unit/**` and
`tests/e2e/**` already compile/lint without breaking `npm run build`). Place `tests/integration/**` so it
receives the **same** treatment (included in the test tsconfig scope, excluded from the Next build if `tests`
is excluded there). Do not introduce a new build error — `npm run build` must stay clean (AC5). [Source: existing tests/unit + tests/e2e coexist with a clean build across 1.5-4.2]

### Previous story intelligence
- **3.4 deferred item (a)** (`deferred-work.md`, create-story of story-3.4): "AD-4-mandated real-Postgres
  no-oversell concurrency integration test — deferred to CI ephemeral-Postgres … two concurrent reserveSeat
  racing for the last seat → exactly ONE CONFIRMED + ONE BOOKING_CHARGE, the other class_full; balance <
  price → full rollback; FR11 already_enrolled." **This story authors exactly that test.** Point AC1/AC3 at it. [Source: deferred-work.md#story-3.4]
- **4.1 defers** the PENDING-hold live round-trip + expiry flip; **4.2 defers** the webhook confirm /
  idempotent replay / AD-15 orphan live round-trips. AC2/AC3 of this story author the no-oversell-relevant
  subset (confirm cannot oversell a refilled class; idempotent replay). The remaining 4.1/4.2 live items
  (Paystack sandbox signature, PENDING expiry timing) stay their own deferrals — do NOT try to build a live
  Paystack network call here (no network/secret in sandbox). [Source: deferred-work.md#story-4.1, #story-4.2]
- **1.5 pattern:** the `DATABASE_URL`/`hasSession()` skip-gate + dynamic `@/lib/db` import + empty-state
  fallback is the proven sandbox-vs-CI seam. Reuse its shape. [Source: tests/e2e/global-setup.ts; deferred-work.md#story-1.5]
- **Git:** work lands on branch `epic-4` (chained; 4.2 baseline). New `tests/integration/**` +
  `vitest.integration.config.ts` + a `package.json` script + `deferred-work.md` update. No prod code change
  expected. [Source: sprint-status.yaml]

### Manual staging verification (epics 4.3 AC2 — record, do not automate)
The "two browsers buy the last seat, one wins, the other sees class full" check is an **intentionally manual**
staging acceptance step. Record it in `deferred-work.md` as a manual verification item for the staging deploy
(pin a seeded near-full class, e.g. `seed-class-*` at capacity−1, open two authenticated browser sessions,
click Pay simultaneously). Do not build a Playwright multi-context automation for it in this story. [Source: epics.md Story 4.3 AC2]

### Testing standards
- Framework: **vitest**. Unit tests stay under `tests/unit/**` (jsdom, `vitest.config.ts`, `npm test`).
  Integration tests are **new** under `tests/integration/**` (node env, `vitest.integration.config.ts`,
  `npm run test:integration`), skip-gated on `DATABASE_URL`. [Source: acce-nextjs/vitest.config.ts; tests/e2e/global-setup.ts]
- **Deferred (record in `deferred-work.md`):** the **live green run** of the no-oversell integration suite
  (needs the CI ephemeral Postgres) and the two-browser manual staging check. In-sandbox bar = `prisma
  validate` + `build` + unit `npm test` green + `test:integration` skips cleanly. [Source: ARCHITECTURE-SPINE.md#AD-4; deferred-work.md]

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `acce-nextjs/src/*`.
- NEW files:
  - `acce-nextjs/tests/integration/no-oversell.integration.test.ts` — the AD-4 concurrency proof (AC1-AC3).
  - `acce-nextjs/tests/integration/helpers.ts` (optional) — skip guard + seed/teardown helpers.
  - `acce-nextjs/vitest.integration.config.ts` — node-env project scoped to `tests/integration/**`.
- UPDATE:
  - `acce-nextjs/package.json` — add `test:integration` script (do NOT change `test`).
  - `_bmad-output/implementation-artifacts/deferred-work.md` — Story 4.3 section (CI live-run + manual
    staging check; supersede the 3.4/4.1/4.2 concurrency defers by pointing them at the authored test).
- Aligns with the ARCHITECTURE-SPINE source tree: `tests/ integration/ # real-Postgres no-oversell
  concurrency (40001) — AD-4`. This story fills that named directory. No variance. [Source: ARCHITECTURE-SPINE.md#Structural Seed]

### Latest tech notes
- **Vitest projects:** running two configs (jsdom-unit + node-integration) via separate `--config` files is
  the standard Vitest pattern; no `workspace` file needed for two isolated runs. Node environment (not
  jsdom) for DB tests avoids loading the React/`next` mocks in `tests/setup.ts`. [Source: Vitest config docs; vitest.config.ts]
- **Prisma 6 + @prisma/adapter-pg concurrency:** the interactive `db.$transaction(fn, { isolationLevel:
  Serializable })` is already wired through the adapter (previewFeatures/driverAdapters per the spine). The
  test just calls `reserveSeat` — the tx/adapter plumbing is inside it. Ensure the pg Pool `max` can hold
  N+1 concurrent tx for a tight race (small N keeps this trivial). [Source: enrollment.ts:200-421; ARCHITECTURE-SPINE.md#Schema deltas (driverAdapters)]
- **No new dependency:** everything needed (`@/lib/db`, `@/lib/wallet`, `@/lib/enrollment`, `pg`, `vitest`)
  already exists in `package.json`. [Source: acce-nextjs/package.json]

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 4 / Story 4.3 / FR10 / NFR1]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-2, AD-4, AD-5, AD-6, AD-7, AD-8, AD-15, "Structural Seed", "Consistency Conventions"]
- [Source: acce-nextjs/src/lib/enrollment.ts (reserveSeat + confirmPaidSeat — the invariant under test; the retry/lock/SSI pattern)]
- [Source: acce-nextjs/src/lib/wallet.ts (mutate/getBalance — fund the balance path; NFR4 guard); acce-nextjs/src/lib/class-occupancy.ts (occupiedEnrollmentWhere — occupancy assertions)]
- [Source: acce-nextjs/tests/e2e/global-setup.ts (the DATABASE_URL skip-gate + dynamic db import + $disconnect pattern to mirror)]
- [Source: acce-nextjs/vitest.config.ts (default jsdom unit run — must stay unchanged); acce-nextjs/package.json (scripts)]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md#story-3.4 (item a), #story-4.1, #story-4.2 (the deferred concurrency items this story authors)]
- [Source: _bmad-output/implementation-artifacts/4-1-…md; 4-2-…md (Epic 4 prior-story context)]

### Review Findings

**Code review (2026-07-06) — CLEAN. 0 decision-needed, 0 patch, 0 defer, 1 dismissed.**

FRESH adversarial review (Blind Hunter + Edge Case Hunter + Acceptance Auditor lenses) over all 5 ACs, re-verifying the test suite against the ACTUAL production code (`reserveSeat`, `confirmPaidSeat`, `decideConfirmOutcome`, `wallet.mutate`, `occupiedEnrollmentWhere`) rather than trusting the dev record. No production code changed (`git diff --stat` = new test files + integration config + `test:integration` script + docs only). Independently re-ran the full sandbox bar: `prisma validate` valid, `next build` clean (all routes incl `/api/webhooks/paystack`; new `tests/integration/**` type-check via tsconfig `**/*.ts`), `npm test` 351/351 green with the integration file NOT collected, `npm run test:integration` 6 skipped cleanly (exit 0). AC1a's `BOOKING_CHARGE`-by-`enrollmentId` count and AC2's `refund_to_wallet` decision (`othersOccupied N < capacity N` false) both confirmed correct against the source. deferred-work.md records the CI live-run + two-browser manual staging deferrals (superseding 3.4/4.1/4.2 concurrency items).

- [x] [Review][Dismiss] AC1a test uses scope label `"ac1b"` for the balance path (AC1b PENDING uses `"ac1p"`) — cosmetic mislabel, no id collision, no functional impact. LOW → dismissed (not worth a patch to a verification-only artifact).

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6 (autopilot subagent, 2026-07-06)

### Debug Log References
None. Verification-only story — no production code changes. All decisions logged in autopilot-decisions.md.

### Completion Notes List
- **Task 1 complete:** `vitest.integration.config.ts` created (node-env, includes `tests/integration/**`, longer timeouts, no setupFiles, `@` alias). `package.json` `test:integration` script added. `vitest.config.ts` unchanged.
- **Task 2 complete:** `tests/integration/helpers.ts` with `hasDb()` guard. `no-oversell.integration.test.ts` uses `describe.skipIf(!hasDb())` — all module-level code is skip-safe (no top-level db import). Dynamic imports of db, reserveSeat, confirmPaidSeat, mutate, WalletInsufficientFundsError all inside `beforeAll`. Seed helpers: `mkStudent`, `mkClass`, `fund`. Teardown: comprehensive `afterAll` in FK-safe order (LedgerEntry → Payment → Enrollment → GroupSession → User → Subject), `db.$disconnect()` at end.
- **Task 3 complete:** AC1a (balance path: N=2, N+1=3 concurrent, Promise.all, assert N confirmed + 1 class_full + N BOOKING_CHARGEs + occupancy=N). AC1b (PENDING path: N=2, N+1=3 concurrent at R0, assert N pending_payment + 1 class_full + 0 BOOKING_CHARGEs + occupancy=N). Both assert on final committed state, not timing.
- **Task 4 complete:** AC2 (fill class with N CONFIRMED via funded reserveSeat, direct PENDING insert for extra student, confirmPaidSeat → refunded_to_wallet + CANCELLATION_REFUND + CANCELLED + occupancy=N). AC3a (reserveSeat→PENDING, confirmPaidSeat×2 same ref → confirmed then already_processed, 1 Payment, 1 BOOKING_CHARGE, CONFIRMED). AC3b (funded→CONFIRMED, reserveSeat again → already_enrolled, 1 Enrollment, 1 BOOKING_CHARGE). AC3c (R0→PENDING no charge, direct mutate debit rejects WalletInsufficientFundsError, 0 ledger rows).
- **Task 5 complete:** `npx prisma validate` → schema valid. `npm run build` → tsc clean, all routes present (incl. /api/webhooks/paystack). `npm test` → 351/351 unit tests pass, integration suite NOT collected. `npm run test:integration` → 6 tests skipped cleanly (exit 0), no error on missing DATABASE_URL. `deferred-work.md` updated with Story 4.3 section (live CI run + manual staging check; supersedes 3.4/4.1/4.2 concurrency defers). 4 autopilot-decisions logged.
- **No production code changed.** This is a verification-only story (AC scope: test + runner config + script + deferral record). reserveSeat, confirmPaidSeat, enrollment.ts, wallet.ts, all pages/actions untouched.

### File List
- acce-nextjs/vitest.integration.config.ts (NEW)
- acce-nextjs/tests/integration/helpers.ts (NEW)
- acce-nextjs/tests/integration/no-oversell.integration.test.ts (NEW)
- acce-nextjs/package.json (MODIFIED — added test:integration script)
- _bmad-output/implementation-artifacts/4-3-no-oversell-under-concurrent-buyers.md (MODIFIED — this file)
- _bmad-output/implementation-artifacts/sprint-status.yaml (MODIFIED — status transitions)
- _bmad-output/implementation-artifacts/deferred-work.md (MODIFIED — Story 4.3 section added)
- _bmad-output/implementation-artifacts/autopilot-decisions.md (MODIFIED — 4 decisions logged)

## Change Log
- 2026-07-06: Story 4.3 implemented — node-env integration Vitest harness, skip-gated no-oversell test (AC1a balance path, AC1b PENDING path, AC2 confirm-path refund, AC3a idempotent replay, AC3b FR11, AC3c NFR4 rollback). Sandbox bar met: prisma validate clean, build clean, 351/351 unit tests green, test:integration skips cleanly. Live green run deferred to CI ephemeral-Postgres. Supersedes 3.4/4.1/4.2 concurrency defers.
