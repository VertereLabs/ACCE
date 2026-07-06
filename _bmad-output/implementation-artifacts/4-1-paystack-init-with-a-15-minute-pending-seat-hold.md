---
baseline_commit: 2fefcb91ae184eae1c75318b2ef639d852c8d782
---

# Story 4.1: Paystack init with a 15-minute pending seat hold

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a student without enough balance,
I want to pay the seat price online and have my seat held while I pay,
so that the seat isn't sold from under me mid-payment.

## Context & current state (READ FIRST)

Epics 1, 2 and 3 are **`done`**. Epic 4 is the plan's explicit **risk boundary** (payments + concurrency).
This is the **FIRST Epic-4 story** and the **first online-payment path** in the app.

**What already exists and is the substrate for this story (do NOT recreate):**

- **`src/lib/enrollment.ts` — `reserveSeat(studentId, classId)` (Story 3.4, `done`).** The **single canonical
  seat reservation** (AD-4): one interactive **`Serializable`** transaction with a `SELECT … FOR UPDATE` lock on
  the `GroupSession` row, a `status='SCHEDULED' AND start>now` guard, an existing-enrollment/FR11 check, an
  AD-5 occupancy count under the lock, and — on the **balance ≥ price** path — a `CONFIRMED` enrollment + a
  `BOOKING_CHARGE` via `wallet.mutate`. It already has the **P2034/40001 retry loop**, a defensive AD-12
  reactivation branch, and a documented **"EPIC-4 SEAM"** header comment saying *extend `reserveSeat` in place —
  do NOT create a second reservation function*. **THIS story fills that seam.** [Source: acce-nextjs/src/lib/enrollment.ts]
- **`src/lib/wallet.ts` — `getBalance(studentId, tx?)` + `mutate(...)` (Story 3.1, `done`).** `getBalance`
  accepts an optional `tx` so you can read the balance **under the reserve lock** to decide the path.
  [Source: acce-nextjs/src/lib/wallet.ts:83]
- **`src/lib/class-occupancy.ts` — `occupiedEnrollmentWhere(now)` + `computeSeatsLeft` (Story 2.2, `done`).**
  The AD-5 occupancy predicate **already excludes expired PENDING** (`pendingExpiresAt IS NULL OR > now`), so
  reads/listings already treat an expired hold as free. Reuse — do NOT re-derive. [Source: acce-nextjs/src/lib/class-occupancy.ts:30]
- **The 3.3/3.4 class detail + checkout page** — `(portal)/portal/classes/[id]/page.tsx` — already computes
  `isFull`, `balanceCents`, `canPayFromBalance`, `isConfirmed` and renders four checkout states. Its
  **insufficient-balance branch (lines ~306-319) currently shows a static "Online payment (Paystack) is coming
  soon (Epic 4)" message — THIS story replaces that with a live "Pay online with Paystack" CTA.**
  [Source: acce-nextjs/src/app/(portal)/portal/classes/[id]/page.tsx:306]
- **The 3.4 balance path** — `reserveSeatAction` (`.../[id]/actions.ts`) + `PayWithBalanceButton`
  (`.../[id]/pay-with-balance-button.tsx`) + the pure `src/lib/reserve-schema.ts` (Zod input + reason→toast
  mapper). These are the structural templates for the Paystack entry + island. [Source: 3-4-…md File List]

**Data model is ALREADY migrated for this story — NO schema/migration/enum change:**
- `Enrollment.pendingExpiresAt DateTime?` — the hold timestamp — **already exists**.
- `Enrollment.paymentRef String? @unique` — pins the webhook→enrollment join — **already exists**.
- `Payment { reference @unique, amountCents, status, type, raw Json }` — the webhook idempotency mirror —
  **already exists** (written by 4.2's webhook, NOT this story).
  [Source: acce-nextjs/prisma/schema.prisma#Enrollment / Payment]

**Env is ALREADY documented — NO new env var:** `PAYSTACK_SECRET_KEY` and `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
are already in `.env.example` ("Only needed for Epic 4"). This story reads `PAYSTACK_SECRET_KEY` (server-side)
and `APP_URL` (already used by auth.ts) for the callback URL. The redirect flow does **not** use the public key.
[Source: acce-nextjs/.env.example:13]

**This story builds:**
1. **`src/lib/paystack.ts` (NEW)** — a thin native-`fetch` adapter (AD-13). For 4.1: **`initializeTransaction`**
   only (POST `transaction/initialize`). Signature verification (`verifySignature`) is **Story 4.2** — do NOT
   build it here (leave the module cleanly extendable).
2. **Extend `reserveSeat` IN PLACE** (AD-4) — add the **insufficient-balance → PENDING hold** branch:
   create/reactivate a `PENDING` enrollment with `pendingExpiresAt = now+15min` + a unique `paymentRef`, and
   return a discriminated **`pending_payment`** outcome. Also add the AD-5 **lazy PENDING→CANCELLED expiry flip
   under the lock**.
3. **A server action** (Paystack path) that: guards (`requireSession` first) → calls `reserveSeat` → on
   `pending_payment` calls `paystack.initializeTransaction()` **outside the tx** → returns the checkout URL.
4. **A client island** ("Pay online") that calls the action and does a **full-page redirect** to Paystack.
5. **Wire the page's insufficient-balance branch** to render the live "Pay online" island.
6. **Pure, unit-tested helpers** (Paystack request builder / reference generator / response parser + a
   redirect-outcome message mapper), mirroring 3.4's `reserve-schema.ts`.

**This is a MONEY path.** Follow the ARCHITECTURE-SPINE invariants to the letter.

**CRITICAL SCOPE BOUNDARIES:**
- **Paystack INIT + PENDING HOLD ONLY.** The **webhook** that verifies the signature and confirms the seat
  (`charge.success` → `CONFIRMED` + `BOOKING_CHARGE`, idempotent by `Payment.reference`) is **Story 4.2** — do
  NOT build the webhook, `verifySignature`, or any `Payment` write here. The **no-oversell concurrency
  integration test** is **Story 4.3**.
- **Extend the ONE `reserveSeat` (AD-4)** — never a second reservation function. `enrollment.ts` stays the
  **sole writer of every `Enrollment.status` transition (AD-14)** — the PENDING create + the expiry flip both
  live inside `reserveSeat` under the lock.
- **NO card refund, NO cancel/refund, NO admin credit, NO roster/attendance/email.**
- **NO schema/migration/enum/dependency change** (all fields already migrated; native `fetch` only — AD-13,
  no Paystack SDK, no axios).
- **NO CSP change** — a full-page redirect to Paystack is a top-level navigation, not a form submission, so
  `form-action 'self'` does not block it; the init call is server-side `fetch` (not browser-CSP-governed).
  Confirmed against `next.config.ts` + ARCHITECTURE-SPINE deployment notes.

## Acceptance Criteria

**AC1 — Insufficient balance creates a PENDING hold and returns a Paystack checkout URL (FR8, FR9, NFR9, AD-4, AD-13).**
Given my wallet balance (`getBalance`) `< priceCents` at the moment of the lock,
When I check out a `SCHEDULED`, future, non-full class I don't already hold a seat in,
Then — inside the **same one `reserveSeat` Serializable transaction** that locks the `GroupSession` row and
counts AD-5 occupancy `< capacity` — a **`PENDING`** `Enrollment` is created (or a lapsed own row reactivated)
with `priceCents` snapshotted from the locked class, **`pendingExpiresAt = now + 15 minutes`**, and a **unique
`paymentRef`**; **and** `src/lib/paystack.ts#initializeTransaction` (called **after** the tx commits, via native
`fetch`) returns a Paystack **authorization/checkout URL** built with `amount` = the price **in cents**,
`reference` = that `paymentRef`, and a `callback_url` back to the class detail page. **No `BOOKING_CHARGE` /
no wallet mutation happens on this path** (confirmation is the 4.2 webhook's job). The seat is now HELD.

**AC2 — An expired hold is treated as free and lazily flipped to CANCELLED inside a locked mutation (FR9, AD-5, AD-14).**
Given a `PENDING` enrollment whose `pendingExpiresAt` has passed,
When seats-left is computed (read paths) or the seat is next touched by a reservation,
Then it is **not counted** as occupying a seat (already true via `occupiedEnrollmentWhere` on all read paths),
**and** the actual `PENDING → CANCELLED` flip is performed **only inside `reserveSeat` under the `GroupSession`
lock** (never by a reader — AD-5/AD-14), so it can never race the 4.2 webhook confirming that same seat. The
current student's own **expired** PENDING row is treated as reactivatable (fresh hold, or `CONFIRMED` if the
balance now suffices), not as `already_enrolled`.

**AC3 — A live hold on the last seat makes the class show full until it confirms or expires.**
Given a PENDING hold (unexpired) consumes the last seat,
When another student views or lists the class,
Then it shows as **full** (seats-left = 0, no Pay affordance) until that hold either confirms (4.2) or expires
(AC2) — because `occupiedEnrollmentWhere(now)` counts unexpired `PENDING` as occupied (already implemented;
this AC is satisfied by CREATING the row as `PENDING` with a future `pendingExpiresAt`).

**AC4 — Own in-flight hold resumes; one active seat per student is preserved (FR11, AD-12).**
Given I already hold an **unexpired** `PENDING` enrollment for the class (mid-payment),
When I check out again,
Then the reservation **resumes** — it returns the **existing** `paymentRef` so the action re-inits Paystack
with the **same reference** (Paystack `initialize` is idempotent by reference) rather than creating a second
row. Given I already hold a `CONFIRMED`/`ATTENDED`/`NO_SHOW` enrollment, checkout is rejected `already_enrolled`
(FR11) with no new row/charge. The `@@unique([studentId, groupSessionId])` is the DB backstop.

**AC5 — Live "Pay online" CTA redirects to Paystack; success/error surface correctly (UX-DR5, UX-DR6, NFR10, AD-3).**
Given the class detail page's insufficient-balance branch,
When it renders,
Then it shows a live **"Pay online with Paystack"** CTA (gold-accent token, ≥44px, keyboard-operable, visible
focus ring, `aria-busy` while pending, label text carries state — UX-DR6/NFR10) that calls the Paystack server
action; on `redirect` it performs a **full-page navigation** (`window.location.href = checkoutUrl`) to Paystack;
on an expected failure (`class_full`, `already_enrolled`, `not_available`, `error`) it shows a **sonner** toast
(UX-DR5). The server action calls **`requireSession()` FIRST** (AD-3), keys every lookup to `session.user.id`,
passes `session.user.email` to Paystack, and Zod-validates `{ classId }` — never a client-supplied student id.

**AC6 — `paystack.ts` is a thin native-fetch adapter; the chain stays green (AD-13, NFR9).**
`src/lib/paystack.ts` uses **native `fetch`** (no axios / no Paystack SDK — AD-13), reads `PAYSTACK_SECRET_KEY`
server-side and **fails fast** if it is missing, sends money as **integer cents** (AD-9), and never logs the
secret. `npx prisma validate` passes (schema untouched), `npm run build` succeeds (tsc clean, the Paystack
action route present), and `npm test` (vitest) stays green **with new unit tests for the pure Paystack
helper(s)** (request-body builder / reference format / response parse / redirect-message mapper). **No
schema/migration/dependency change.** The real-Postgres PENDING-hold + expiry-flip round-trip and the live
Paystack sandbox init are **deferred to the CI ephemeral-Postgres job** (same wall as 3.4) and recorded in
`deferred-work.md`. The signature-verified webhook confirm is **Story 4.2**; the no-oversell concurrency test is
**Story 4.3**.

## Tasks / Subtasks

- [x] **Task 1 — `src/lib/paystack.ts`: `initializeTransaction` native-fetch adapter (AC1, AC6, AD-13).**
  - [x] Create `src/lib/paystack.ts`. Export `async function initializeTransaction(args: { email: string;
    amountCents: number; reference: string; callbackUrl: string }): Promise<{ ok: true; authorizationUrl: string }
    | { ok: false; error: string }>`. POST to `https://api.paystack.co/transaction/initialize` with headers
    `Authorization: Bearer ${PAYSTACK_SECRET_KEY}` + `Content-Type: application/json`, body
    `{ email, amount: amountCents, reference, callback_url: callbackUrl }` (Paystack `amount` is the lowest
    currency unit = cents for ZAR — pass `amountCents` straight through, AD-9). Parse `json.data.authorization_url`.
  - [x] Read `PAYSTACK_SECRET_KEY` from `process.env` and **fail fast** (throw or return `{ ok: false }`) if
    missing/empty. Never log the secret. Native `fetch` only — no axios, no `@paystack/*` SDK (AD-13).
  - [x] Factor the **pure** parts into unit-testable functions (e.g. `buildInitBody(args)`,
    `generatePaymentRef()` using `crypto.randomUUID()` prefixed like `acce_…`, `parseInitResponse(json)`) so the
    fetch wrapper stays a thin shell. Optional: a small test-vs-live key sanity guard (e.g. warn/guard when
    `NODE_ENV==='production'` but the key looks like `sk_test_…`) — keep minimal.
  - [x] Header comment: AD-7 (webhook confirms — NOT here), AD-13 (native fetch), the 4.2 seam for
    `verifySignature`, and "amount is integer cents".
- [x] **Task 2 — Extend `reserveSeat` IN PLACE with the PENDING/Paystack branch (AC1, AC2, AC3, AC4, AD-4/5/12/14).**
  - [x] In `src/lib/enrollment.ts`, **do NOT create a second function.** Widen the success result to a
    discriminated `outcome`: `{ ok: true; outcome: "confirmed"; enrollmentId } | { ok: true; outcome:
    "pending_payment"; enrollmentId; paymentRef; amountCents } | { ok: false; reason: "class_full" |
    "already_enrolled" | "not_available" | "error" }`. (The old `insufficient_balance` reason is **removed** — a
    balance shortfall is no longer a failure; it becomes the pending path.)
  - [x] **Inside the existing Serializable tx, under the `FOR UPDATE` lock, BEFORE the occupancy count:** lazily
    flip **other** students' expired PENDING rows on this class to `CANCELLED`
    (`tx.enrollment.updateMany({ where: { groupSessionId: classId, status: "PENDING", pendingExpiresAt:
    { lte: now } }, data: { status: "CANCELLED", pendingExpiresAt: null } })`). This is the AD-5/AD-14 locked
    expiry flip. (Read paths already exclude expired PENDING; this makes the write authoritative.)
  - [x] **Existing-enrollment branch (AC4, AD-12):** own row and `status !== 'CANCELLED'`:
    (a) `CONFIRMED`/`ATTENDED`/`NO_SHOW` → `already_enrolled`;
    (b) `PENDING` and **unexpired** → **resume**: return `{ ok: true, outcome: "pending_payment", enrollmentId,
        paymentRef: <existing>, amountCents: priceCents }` (do NOT create a second row);
    (c) `PENDING` and **expired** → treat as reactivatable (fall through to the reactivate/create logic below).
    Own `CANCELLED` row → reactivate (existing AD-12 branch).
  - [x] **Decide the path by balance UNDER the lock:** `const balance = await getBalance(studentId, tx)`. If
    `balance >= cls.priceCents` → the **existing** CONFIRMED + `wallet.mutate` BOOKING_CHARGE path (unchanged;
    return `outcome: "confirmed"`). Else → **PENDING hold**: create/reactivate the row as `status: "PENDING"`,
    `priceCents` snapshot, `pendingExpiresAt: new Date(now.getTime() + 15*60*1000)`,
    `paymentRef: generatePaymentRef()`; **no `wallet.mutate`**; return `outcome: "pending_payment"` with the
    `paymentRef` + `amountCents = cls.priceCents`.
  - [x] Keep the existing `FOR UPDATE` lock, `SCHEDULED`+future guard, AD-5 occupancy `< capacity` check, and
    P2034/40001 retry loop exactly as they are. Update the header comment: the EPIC-4 seam is now FILLED;
    document the two outcomes + the expiry flip.
  - [x] **Note:** the balance-shortfall path no longer relies on `WalletInsufficientFundsError` (the explicit
    `getBalance` check replaces it). Keep the `WalletInsufficientFundsError` catch as a defensive safety net.
- [x] **Task 3 — Server action: Paystack checkout (AC1, AC5, AD-3, AD-13).**
  - [x] Add the Paystack entry to `src/app/(portal)/portal/classes/[id]/actions.ts` (or a colocated
    `payWithPaystackAction`). Order: (1) `await requireSession()` FIRST → `studentId = session.user.id`,
    `email = session.user.email`; (2) Zod-validate `{ classId }` (reuse `reserveInputSchema`); (3)
    `const r = await reserveSeat(studentId, classId)`; (4) on `r.ok && r.outcome === "pending_payment"` →
    `paystack.initializeTransaction({ email, amountCents: r.amountCents, reference: r.paymentRef, callbackUrl:
    \`${process.env.APP_URL}/portal/classes/${classId}\` })` **outside** any tx → return
    `{ ok: true, redirect: authorizationUrl }`; (5) on `r.ok && r.outcome === "confirmed"` (balance changed to
    sufficient between page render and click) → `revalidatePath` + return a `confirmed` result; (6) on `!r.ok`
    or init failure → return `{ ok: false, reason }`. Discriminated union, never throw for expected failures.
    Update the balance `reserveSeatAction` to map the new `outcome: "confirmed"` arm (behaviour unchanged).
- [x] **Task 4 — Client island: "Pay online with Paystack" (AC5, UX-DR5, UX-DR6, NFR10).**
  - [x] Create `src/app/(portal)/portal/classes/[id]/pay-online-button.tsx` `"use client"` taking a plain
    `{ classId }` string prop (RSC-500 safe — 1.5 lesson). Gold-token CTA (`bg-accent text-accent-foreground
    hover:bg-accent/90`, `min-h-[44px]`, `aria-busy` while pending, focus-visible ring). On click: call the
    Paystack action; on `{ ok: true, redirect }` → `window.location.href = redirect` (full-page nav to
    Paystack); on `{ ok: true, confirmed }` → success toast + `router.refresh()`; on `{ ok: false, reason }` →
    specific sonner toast (reuse/extend the `reserve-schema.ts` reason→message mapper).
  - [x] In `page.tsx`, replace the static "Online payment (Paystack) is coming soon (Epic 4)…" copy in the
    insufficient-balance branch (lines ~306-319) with the balance/price line + `<PayOnlineButton classId={cls.id} />`.
    Keep the enrolled / full / balance-sufficient branches untouched. (Balance-sufficient users still get the
    3.4 `PayWithBalanceButton`; insufficient-balance users now get this new island — one gold CTA per view,
    UX-DR2.)
- [x] **Task 5 — Pure helper + unit tests (AC6).**
  - [x] Unit-test the pure Paystack helpers (`buildInitBody` → correct `{ email, amount, reference,
    callback_url }` with `amount` = cents; `generatePaymentRef` → unique, Paystack-safe charset; `parseInitResponse`
    → extracts `authorization_url`, handles a malformed/`status:false` response). Extend `reserve-schema.ts` (or
    a colocated pure module) with the redirect/error message(s) + tests. Do **NOT** unit-test `reserveSeat`,
    the action, or `paystack.ts`'s live `fetch` (they need Postgres / the network) — mirror 3.4's boundary; do
    not over-mock Prisma. Mocking `global.fetch` for the `parseInitResponse` path is acceptable.
- [x] **Task 6 — Verify the chain + record deferrals (AC6).**
  - [x] `npx prisma validate` (schema untouched) · `npm run build` (tsc clean; Paystack action present) ·
    `npm test` (vitest green, new Paystack/message tests). `/portal/classes/seed-class-acc-1` is already in the
    e2e manifest (3.3) — no new route added (the button lives on the existing detail page); no manifest change
    needed. Callback returns to the class detail page (no new page).
  - [x] Record in `deferred-work.md`: (a) the live real-Postgres PENDING-hold create + `pendingExpiresAt`
    expiry-flip round-trip (needs a real DB + a funded/unfunded student); (b) the live Paystack **sandbox**
    `initialize` round-trip (needs `PAYSTACK_SECRET_KEY` test key + network — blocked in sandbox); both to the CI
    ephemeral-Postgres job, same wall as 1.1/1.5/2.x/3.4.

## Dev Notes

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-4 — One canonical seat reservation; extend in place:** every seat acquisition (balance AND Paystack)
  goes through the **one** `reserveSeat()` in one `Serializable` tx. 4.1 fills the documented EPIC-4 seam — the
  insufficient-balance → PENDING branch — **inside the existing function**. Do NOT create a second reservation
  path. Keep the `FOR UPDATE` lock + Serializable SSI + P2034/40001 retry (no-oversell is proven by 4.3's
  concurrency test). [Source: ARCHITECTURE-SPINE.md#AD-4; enrollment.ts header "EPIC-4 SEAM"]
- **AD-5 — Capacity derived; expiry flip only inside a locked mutation:** `occupied = count(Enrollment where
  status ∈ {PENDING, CONFIRMED} AND (pendingExpiresAt IS NULL OR > now))`. Read paths already exclude expired
  PENDING (`occupiedEnrollmentWhere`). The **actual `PENDING → CANCELLED` flip happens ONLY inside `reserveSeat`
  under the `GroupSession` lock** — never in a reader — so it cannot race a 4.2 webhook confirm. Creating the
  hold as `PENDING` with a future `pendingExpiresAt` is what makes AC3 (last seat shows full) true for free.
  [Source: ARCHITECTURE-SPINE.md#AD-5; class-occupancy.ts]
- **AD-7 — Payments confirm out-of-band via idempotent webhook (NOT this story):** the Paystack browser
  callback/redirect is **display-only and never confirms a seat**. Confirmation is Story 4.2's HMAC-verified
  webhook. This story only creates the hold + the checkout URL. [Source: ARCHITECTURE-SPINE.md#AD-7]
- **AD-8 — Exactly one BOOKING_CHARGE per confirmed enrollment:** the Paystack path writes **NO** BOOKING_CHARGE
  at hold-time (the webhook writes it at confirm-time, 4.2). Do not call `wallet.mutate` on the pending path.
  [Source: ARCHITECTURE-SPINE.md#AD-8]
- **AD-13 — External I/O via native fetch behind thin adapters:** `paystack.ts` uses native `fetch`, no
  axios/SDK. Keep it thin (init + — later — verifySignature). [Source: ARCHITECTURE-SPINE.md#AD-13; lessons-learned "native fetch not axios"]
- **AD-14 — `enrollment.ts` is the sole writer of every status transition:** the PENDING create, the CONFIRMED
  create (balance), and the expiry `→ CANCELLED` flip all live in `reserveSeat`. No page/action/reader writes
  `Enrollment.status`. [Source: ARCHITECTURE-SPINE.md#AD-14]
- **AD-12 — Re-enrollment reuses the row:** `@@unique([studentId, groupSessionId])` is status-agnostic. An own
  `CANCELLED` or **expired PENDING** row is reactivated (reset status/priceCents/pendingExpiresAt/paymentRef);
  an own unexpired PENDING resumes with its existing `paymentRef`; never `INSERT` a duplicate. **⚠ Cross-epic
  (deferred, unreachable in 4.1):** reactivating a row that already carries a historical `BOOKING_CHARGE`
  collides with AD-8's partial-unique index — this only becomes reachable once Epic 5's cancel flow can produce
  such a row. [Source: ARCHITECTURE-SPINE.md#AD-12; deferred-work.md#AD-12]
- **AD-3 — Authorization at the entry:** `requireSession()` first in the action; `(portal)` requires a STUDENT+
  session; all lookups keyed to `session.user.id`; `email` for Paystack comes from the session, not the client.
  [Source: ARCHITECTURE-SPINE.md#AD-3; auth-guards.ts]
- **AD-9 — Money is integer cents (ZAR):** `priceCents`/`amountCents` are integers; Paystack `amount` is the
  cents value passed straight through; no floats; format to Rand only at the UI edge. [Source: ARCHITECTURE-SPINE.md#AD-9]
- **AD-2 / AD-1:** import `{ db }` from `@/lib/db` (never `new PrismaClient()`); all new code lives under
  `(portal)/portal/classes/[id]` + `src/lib/{enrollment,paystack}.ts`; marketing routes/headers untouched.
  [Source: ARCHITECTURE-SPINE.md#AD-1, AD-2]
- **Consistency conventions:** discriminated result (`{ ok: true, … } | { ok: false, reason }`) — never throw
  across the UI boundary for expected failures; Zod at the server entry; sonner toast at the island; money-path
  emits structured logs on failure (never swallow). Env secrets via `.env`; the Paystack init route is a
  server action (not the webhook — that public route is 4.2). [Source: ARCHITECTURE-SPINE.md#Consistency Conventions]

### The reservation control flow after 4.1 (correctness-critical)
```
requireSession() → studentId, email
reserveSeat(studentId, classId)  [ONE Serializable tx, retry P2034/40001]:
  SELECT … FOR UPDATE GroupSession(classId)                 -- AD-4 belt-and-braces
  guard status=SCHEDULED AND start>now                      -- else not_available
  updateMany OTHER expired PENDING → CANCELLED (this class) -- AD-5/AD-14 locked expiry flip (NEW)
  findUnique own Enrollment(studentId, classId):
    CONFIRMED/ATTENDED/NO_SHOW → already_enrolled            -- FR11 / AC4
    PENDING unexpired          → RESUME (return existing paymentRef, outcome=pending_payment)  -- AC4
    PENDING expired | CANCELLED| none → reactivate/create below
  count occupied (occupiedEnrollmentWhere) < capacity       -- AD-5 under lock; else class_full
  balance = getBalance(studentId, tx)                        -- read UNDER lock (NEW branch point)
    balance >= priceCents → CONFIRMED + wallet.mutate BOOKING_CHARGE   -- 3.4 path, outcome=confirmed
    balance <  priceCents → PENDING, pendingExpiresAt=now+15m,
                            paymentRef=generatePaymentRef(), NO charge  -- outcome=pending_payment (NEW)
  commit
── outside the tx (server action) ──
  outcome=pending_payment → paystack.initializeTransaction({email, amountCents, reference=paymentRef,
                                                             callbackUrl}) → checkout URL → client redirect
  outcome=confirmed       → revalidatePath + success toast
```
[Source: ARCHITECTURE-SPINE.md#Structural Seed "Seat-purchase control flow" (the `else insufficient balance`
arm); #AD-4/5/7; enrollment.ts]

### Why Paystack init runs OUTSIDE the transaction
Holding the `GroupSession FOR UPDATE` lock across an external HTTP round-trip would lengthen the lock, risk tx
timeouts, and amplify serialization-retry storms. So `reserveSeat` **commits the PENDING hold + paymentRef**,
and the **server action** calls `paystack.initializeTransaction()` afterward using the committed `paymentRef` as
the Paystack `reference`. If init fails after commit, the 15-minute hold simply lazy-expires (AC2) and frees the
seat; the action returns an error toast. Because the `paymentRef` is committed first, the 4.2 webhook can always
join `Payment.reference → Enrollment.paymentRef` even if the browser never reaches Paystack. [Source: autopilot
decision 2026-07-06 "Paystack init runs OUTSIDE the Serializable tx"]

### Scope boundary (do NOT do — belongs to other stories)
- **No webhook / no `verifySignature` / no `Payment` write / no `charge.success` handling** — Story 4.2.
- **No no-oversell concurrency integration test authored here** — Story 4.3 (record the deferral only).
- **No card refund / no AD-15 late-orphan-payment-to-wallet** — that lives with the webhook (4.2/AD-15).
- **No cancel/refund (Epic 5), no admin credit (3.5 `done`), no roster/attendance/email (Epic 6).**
- **No schema/migration/enum/dependency change; no new env var; no CSP change; no new palette.**
- **No status write outside `enrollment.ts` (AD-14); no `ledgerEntry.create` outside `wallet.ts` (AD-6).**

### Data model facts this story depends on (from schema.prisma — verified, all already migrated)
- `Enrollment { …, status EnrollmentStatus @default(PENDING), pendingExpiresAt DateTime?, paymentRef String?
  @unique, @@unique([studentId, groupSessionId]), @@index([groupSessionId, status]) }`. Compound-unique
  accessor: `studentId_groupSessionId`. Create the hold with explicit `status: "PENDING"`, a future
  `pendingExpiresAt`, and a unique `paymentRef`. [Source: acce-nextjs/prisma/schema.prisma#Enrollment]
- `EnrollmentStatus ∈ {PENDING, CONFIRMED, CANCELLED, ATTENDED, NO_SHOW}`. [Source: schema.prisma#EnrollmentStatus]
- `Payment { reference @unique, amountCents, status, type, raw Json }` — **written by the 4.2 webhook, NOT this
  story.** The `paymentRef` you set on the Enrollment is what the webhook will match `Payment.reference` against.
  [Source: schema.prisma#Payment; ARCHITECTURE-SPINE.md#AD-7]
- `GroupSession { status @default(SCHEDULED), start, capacity, priceCents, … }` — reserve only for `SCHEDULED`
  future classes; snapshot `priceCents` from the locked row (AD-16). [Source: schema.prisma#GroupSession]

### Previous story intelligence (Epic 3)
- **3.4 `reserveSeat` is the exact function you extend** — its header comment already names this story ("When
  Epic 4 (Story 4.1) lands, extend reserveSeat() in place: add an `else` branch after the balance check … to
  create a PENDING enrollment + Paystack hold. Do NOT create a second reservation function."). Its retry loop,
  lock, guard, and AD-5 count are reused as-is; you add the balance-decision branch point + the PENDING create +
  the expiry flip. [Source: acce-nextjs/src/lib/enrollment.ts:39-42]
- **3.4's `insufficient_balance` result is superseded** — with online payment, a balance shortfall is no longer
  a terminal failure. The `WalletInsufficientFundsError`-based signalling is replaced by an explicit
  `getBalance(studentId, tx)` read under the lock (cleaner branch point); keep the error catch as a defensive
  net. Update the balance action/button to the new `outcome`-tagged result. [Source: enrollment.ts:270-276; reserve-schema.ts]
- **3.3/3.4 checkout page + islands** — the insufficient-balance branch you replace is at
  `page.tsx:306-319`; the `PayWithBalanceButton` (3.4) is the client-island template (plain string prop,
  gold-token CTA, sonner toast, `aria-busy`); `reserve-schema.ts` is the pure reason→message template. Mirror
  them for the Paystack island/messages. [Source: acce-nextjs/src/app/(portal)/portal/classes/[id]/*; reserve-schema.ts]
- **3.1 `getBalance(studentId, tx?)`** already accepts an optional tx for reading under the lock — use it; do
  NOT re-query the ledger by hand. [Source: acce-nextjs/src/lib/wallet.ts:83]
- **1.5 RSC-500 trap:** never pass a Client Component element through a non-`children` prop; the island gets a
  plain `classId` string. The `/portal/classes/seed-class-acc-1` e2e entry (3.3) is the RSC-500 regression net.
  [Source: 1-5-…md; lessons-learned]
- **Seed reality (1.4):** the 6 seeded classes have no enrollments and **no seeded STUDENT user**; a live
  insufficient-balance→Paystack round-trip needs a real student + Postgres + a Paystack test key → CI only. Do
  NOT fake a live query. [Source: prisma/seed-data.ts; 3-4-…md]
- **Sandbox reality (1.1/1.5/2.x/3.x):** prod DB creds + external network are blocked; live DB writes, the
  expiry-flip round-trip, and the live Paystack init are deferred to CI ephemeral-Postgres. Static verification
  (`prisma validate` + `build` + vitest) is the bar. [Source: deferred-work.md]
- **Git:** work lands on branch `epic-4` (chained off the epic-3 tip 2fefcb9). New `src/lib/paystack.ts` +
  Paystack action + island + `reserveSeat` extension + one page edit + unit tests. [Source: sprint-status.yaml]

### External context — Paystack initialize (native fetch, AD-13)
- **Endpoint:** `POST https://api.paystack.co/transaction/initialize`. Headers:
  `Authorization: Bearer <PAYSTACK_SECRET_KEY>`, `Content-Type: application/json`. Body:
  `{ email, amount, reference, callback_url }` where **`amount` is in the lowest denomination = cents** for ZAR
  (pass `amountCents` directly — AD-9). Response: `{ status: true, data: { authorization_url, access_code,
  reference } }`. Redirect the browser to `data.authorization_url`. On `status: false` or a non-2xx, treat as an
  init failure. [Source: Paystack API "Initialize Transaction"; ARCHITECTURE-SPINE.md#AD-13, #Stack "Paystack: native fetch, no SDK"]
- **Reference:** must be unique per transaction and matches `Enrollment.paymentRef`; Paystack allows
  `-`, `.`, `=` and alphanumerics. `acce_${crypto.randomUUID()}` is safe. Re-initing with the **same** reference
  resumes the same transaction (AC4 resume). [Source: Paystack refs guidance]
- **Callback vs webhook:** `callback_url` is where Paystack redirects the browser after payment — **display
  only**; the seat is confirmed exclusively by the 4.2 webhook (AD-7). Use `${APP_URL}/portal/classes/${classId}`
  (APP_URL already consumed by auth.ts). [Source: ARCHITECTURE-SPINE.md#AD-7; acce-nextjs/src/lib/auth.ts:26]
- **No CSP change:** a top-level redirect to Paystack is navigation (not a form post — `form-action 'self'`
  doesn't apply); the init `fetch` is server-side. If a later story adopts an inline/popup flow it would need
  `connect-src`/`form-action` to gain the Paystack host — not now. [Source: acce-nextjs/next.config.ts; ARCHITECTURE-SPINE.md#Deployment]

### UX / accessibility (UX-DR5, UX-DR6, NFR10, UX-DR2)
- **UX-DR5:** action success/failure → **sonner** toast (Toaster mounted app-wide). On `redirect` the toast is
  optional (the page navigates away); on failure show the specific reason message. [Source: epics.md#UX-DR5]
- **UX-DR6 / NFR10:** "Pay online" is keyboard-operable, visible focus ring, ≥44px, both-mode contrast,
  `aria-busy` while pending; label text carries state (e.g. "Redirecting…"). [Source: epics.md#UX-DR6]
- **UX-DR2:** one gold-accent CTA per view — for an insufficient-balance viewer, the "Pay online" button is it
  (the balance-sufficient viewer sees `PayWithBalanceButton` instead; the two branches are mutually exclusive).
  Use `bg-accent text-accent-foreground hover:bg-accent/90` tokens (never hardcoded hex). [Source: epics.md#UX-DR2; 3-4-…md]

### Testing standards
- Framework: **vitest** (jsdom), `npm test`, specs under `tests/unit/**`. **Add unit tests for the pure Paystack
  helpers** (`buildInitBody`, `generatePaymentRef`, `parseInitResponse`) + any new redirect/error message
  mapping — mirrors `reserve-schema.test.ts`. Do NOT unit-test `reserveSeat` / the action / the live `fetch`
  wrapper (need Postgres / network); mocking `global.fetch` for the response-parse path is fine. [Source:
  acce-nextjs/vitest.config.ts; 3-4-…md]
- **Deferred (record in `deferred-work.md`):** (a) live real-Postgres PENDING-hold create + `pendingExpiresAt`
  expiry-flip-under-lock round-trip (real DB + funded/unfunded student); (b) live Paystack **sandbox**
  `initialize` round-trip (test secret key + network) → assert a valid `authorization_url` and that the hold
  counts toward AD-5 occupancy until expiry. CI ephemeral-Postgres, same wall as 1.1/1.5/2.2/2.3/3.4. The
  webhook confirm is 4.2; the no-oversell concurrency test is 4.3. [Source: ARCHITECTURE-SPINE.md#AD-4, #AD-7; deferred-work.md]

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `acce-nextjs/src/*`.
- NEW files:
  - `src/lib/paystack.ts` — native-fetch adapter: `initializeTransaction` + pure helpers (AD-13). (`verifySignature` is 4.2.)
  - `src/app/(portal)/portal/classes/[id]/pay-online-button.tsx` — `"use client"` island (Paystack action + full-page redirect).
  - `tests/unit/paystack*.test.ts` (+ any message-mapper test).
- UPDATE:
  - `src/lib/enrollment.ts` — extend `reserveSeat` in place: PENDING/Paystack branch + locked expiry flip + `outcome`-tagged result (AD-4/5/12/14).
  - `src/app/(portal)/portal/classes/[id]/actions.ts` — add the Paystack checkout action; map the balance action to the new `outcome`.
  - `src/app/(portal)/portal/classes/[id]/page.tsx` — insufficient-balance branch → live `<PayOnlineButton>`.
  - `src/lib/reserve-schema.ts` (or a colocated pure module) — redirect/error message(s) if reused by the island.
  - `_bmad-output/implementation-artifacts/deferred-work.md` — record the two deferred live-verification items.
- Aligns with the ARCHITECTURE-SPINE source tree: `src/lib/paystack.ts` ("init + verifySignature, native fetch,
  AD-7,13") and `src/lib/enrollment.ts` (sole status writer). No variance. [Source: ARCHITECTURE-SPINE.md#Structural Seed]

### Latest tech notes
- **Next 16 App Router:** server action in `actions.ts` (`"use server"`); the island uses
  `window.location.href` for the external redirect (do NOT use `next/navigation` redirect for an off-site URL);
  `revalidatePath` + `router.refresh()` only on the `confirmed` fallback. Pass the island a plain string prop
  (1.5 RSC-500 safety). [Source: 3-4-…md; 1-5-…md]
- **Prisma 6.19.3:** `getBalance(studentId, tx)` and `tx.enrollment.updateMany/create` compose inside the
  existing `db.$transaction(fn, { isolationLevel: Serializable, maxWait, timeout })`. Keep the tx short — the
  external init is outside it. [Source: ARCHITECTURE-SPINE.md#AD-4; wallet.ts]
- **`crypto.randomUUID()`** (Node ≥ 18 global) for the paymentRef — no new dependency. Native `fetch` (Node ≥
  18) for Paystack — no axios/SDK (AD-13; lessons-learned axios supply-chain). [Source: lessons-learned; ARCHITECTURE-SPINE.md#AD-13]

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 4 / Story 4.1 / FR8 / FR9 / NFR9]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-1, AD-2, AD-3, AD-4, AD-5, AD-7, AD-8, AD-9, AD-12, AD-13, AD-14, AD-16, "Structural Seed", "Consistency Conventions", "Deployment & Environment", "Capability → Architecture Map"]
- [Source: acce-nextjs/prisma/schema.prisma#GroupSession / Enrollment / EnrollmentStatus / Payment]
- [Source: acce-nextjs/src/lib/enrollment.ts (reserveSeat — the EPIC-4 seam to extend; retry loop; lock; AD-5 count)]
- [Source: acce-nextjs/src/lib/wallet.ts (getBalance(studentId, tx) — read balance under the lock; mutate — 3.4 balance path)]
- [Source: acce-nextjs/src/lib/class-occupancy.ts (occupiedEnrollmentWhere — already excludes expired PENDING)]
- [Source: acce-nextjs/src/app/(portal)/portal/classes/[id]/page.tsx (insufficient-balance branch to replace); actions.ts; pay-with-balance-button.tsx; reserve-schema.ts (island/message templates)]
- [Source: acce-nextjs/.env.example (PAYSTACK_SECRET_KEY already present); acce-nextjs/src/lib/auth.ts (APP_URL); acce-nextjs/next.config.ts (CSP — no change needed)]
- [Source: _bmad-output/implementation-artifacts/3-4-reserve-and-pay-a-seat-from-wallet-balance.md; deferred-work.md]

## Dev Agent Record

### Agent Model Used
claude-sonnet-4-6 (autopilot subagent, 2026-07-06)

### Debug Log References
No debug issues encountered. All 303 vitest tests pass. Build clean. Prisma schema unchanged.

### Completion Notes List
- Created `src/lib/paystack.ts`: thin native-fetch adapter with `initializeTransaction`, `buildInitBody`, `generatePaymentRef`, `parseInitResponse`. All pure helpers are unit-tested (28 new tests). PAYSTACK_SECRET_KEY fail-fast, never logged. Amount is integer cents (AD-9). Seam documented for 4.2 `verifySignature`.
- Extended `reserveSeat` in `src/lib/enrollment.ts` IN PLACE (AD-4). New `ReserveSeatResult` type has `outcome: "confirmed" | "pending_payment"` discriminated union; removed `insufficient_balance` from failure reasons. Added Step 3: lazy expiry flip of OTHER students' expired PENDING rows under the GroupSession lock (AD-5/AD-14). Added Step 4: own-row resume (unexpired PENDING → return existing paymentRef, AC4). Added balance decision under the lock (Step 6): `getBalance(studentId, tx)` → if sufficient → CONFIRMED + BOOKING_CHARGE (existing path); else → PENDING + pendingExpiresAt=now+15min + generatePaymentRef() + NO wallet.mutate (AD-7/AD-8). `WalletInsufficientFundsError` kept as defensive net → maps to "error".
- Updated `src/app/(portal)/portal/classes/[id]/actions.ts`: Added `payWithPaystackAction` (requireSession FIRST → Zod validate → reserveSeat → on pending_payment → initializeTransaction OUTSIDE tx → return { ok: true, redirect }). Updated `reserveSeatAction` to map `outcome: "confirmed"` → success + revalidate; `outcome: "pending_payment"` → error (edge case). Exported discriminated result types.
- Updated `src/lib/reserve-schema.ts`: Removed `insufficient_balance` from `ReserveFailureReason` and `RESERVE_ERROR_MESSAGES`. Added `PAYSTACK_REDIRECT_MESSAGE`.
- Created `src/app/(portal)/portal/classes/[id]/pay-online-button.tsx`: `"use client"` island, plain `classId` prop (RSC-500 safe), gold-accent CTA, `aria-busy`, `window.location.href` for Paystack redirect (full-page nav), sonner toast for failures.
- Updated `src/app/(portal)/portal/classes/[id]/page.tsx`: Replaced static "coming soon" insufficient-balance copy with `<PayOnlineButton classId={cls.id} />`. Added `canPayOnline` flag (mutually exclusive with `canPayFromBalance`, UX-DR2). Imported `PayOnlineButton`.
- Updated `tests/unit/reserve-schema.test.ts`: Removed `insufficient_balance` tests, added `PAYSTACK_REDIRECT_MESSAGE` tests, updated reason count 5→4.
- Created `tests/unit/paystack.test.ts`: 28 new unit tests covering `generatePaymentRef` (prefix, UUID format, uniqueness, charset), `buildInitBody` (field mapping, amount=cents, no conversion), `parseInitResponse` (success, failure paths, malformed input).
- Updated `_bmad-output/implementation-artifacts/deferred-work.md`: Recorded two deferred live-verification items (PENDING-hold+expiry-flip round-trip; live Paystack sandbox init) to CI ephemeral-Postgres.
- Verification: `npx prisma validate` ✅ · `npm run build` ✅ (tsc clean, `/portal/classes/[id]` ƒ Dynamic present) · `npm test` ✅ (303/303 tests, 28 new Paystack + 30 reserve-schema).

### File List
- acce-nextjs/src/lib/paystack.ts (NEW)
- acce-nextjs/src/app/(portal)/portal/classes/[id]/pay-online-button.tsx (NEW)
- acce-nextjs/tests/unit/paystack.test.ts (NEW)
- acce-nextjs/src/lib/enrollment.ts (UPDATED — extend reserveSeat: outcome-tagged result, expiry flip, balance decision, PENDING path)
- acce-nextjs/src/lib/reserve-schema.ts (UPDATED — remove insufficient_balance, add PAYSTACK_REDIRECT_MESSAGE)
- acce-nextjs/src/app/(portal)/portal/classes/[id]/actions.ts (UPDATED — payWithPaystackAction, reserveSeatAction mapped to new outcome type)
- acce-nextjs/src/app/(portal)/portal/classes/[id]/pay-with-balance-button.tsx (UPDATED — comment noting new outcome type)
- acce-nextjs/src/app/(portal)/portal/classes/[id]/page.tsx (UPDATED — PayOnlineButton replaces static copy, canPayOnline flag)
- acce-nextjs/tests/unit/reserve-schema.test.ts (UPDATED — remove insufficient_balance, add PAYSTACK_REDIRECT_MESSAGE tests)
- _bmad-output/implementation-artifacts/deferred-work.md (UPDATED — deferred items for 4.1)
- _bmad-output/implementation-artifacts/sprint-status.yaml (UPDATED — 4-1 → review)
- _bmad-output/implementation-artifacts/4-1-paystack-init-with-a-15-minute-pending-seat-hold.md (UPDATED — status, tasks, agent record)

## Review Findings

Adversarial code review (2026-07-06, autopilot code-review, fresh reasoning). Money-path invariants verified clean: no BOOKING_CHARGE on the pending path (AD-7/AD-8), single `reserveSeat` extended in place (AD-4), PENDING→CANCELLED expiry flip only inside the lock and excluding the own row (AD-5/AD-14), `requireSession()` first with email from the session (AD-3), integer-cents passed straight to Paystack (AD-9), `PAYSTACK_SECRET_KEY` fail-fast + never logged, no oversell (FOR UPDATE + Serializable SSI serializes the last-seat race). No client bundle imports `paystack.ts` (build-verified). `prisma validate` ✅ · `npm run build` ✅ (`/portal/classes/[id]` ƒ Dynamic) · 303/303 vitest ✅.

- [x] [Review][Patch] Pay CTAs were `disabled={isPending}`, contradicting their own comment and NFR10 keyboard-operability (a disabled button leaves the tab order; double-submit is already guarded by `if (isPending) return`) — removed `disabled`, kept `aria-busy`. Applied to both islands for consistency. [pay-online-button.tsx:91, pay-with-balance-button.tsx:79] — FIXED
- [x] [Review][Defer] `email ?? ""` would send an empty email to Paystack if `session.user.email` were null [actions.ts:126] — deferred: unreachable under passwordless email auth (email always present); Paystack returns a graceful init error if ever empty. Low.
- [x] [Review][Defer] `existing.paymentRef!` non-null assertion in the resume path [enrollment.ts:262] — deferred: unreachable in 4.1 (every PENDING row is created with a `paymentRef`); defensive-only. Low.
- [x] [Review][Defer] Balance-button click after the balance dropped since render creates an orphan PENDING seat hold while showing a generic "error" toast [actions.ts:76] — deferred: by-design (the one `reserveSeat` decides path under the lock); self-heals via the 15-min lazy expiry; documented in the action. Low.
- [x] [Review][Defer] `APP_URL` undefined would yield a malformed `callback_url` [actions.ts:124] — deferred: `APP_URL` is a required env already consumed by `auth.ts`; the callback is display-only (AD-7). Low.
