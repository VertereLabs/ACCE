---
baseline_commit: a4a428092e9e7de9145ae84f38345ed1ff1cd12d
---

# Story 4.2: Verified, idempotent payment webhook confirms the seat

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a student who paid,
I want my payment to reliably confirm my seat exactly once,
so that I'm enrolled and never double-charged.

## Context & current state (READ FIRST)

Epics 1–3 are `done`. Epic 4 is the plan's explicit **risk boundary** (payments + concurrency).
Story **4.1 (`done`)** built the **Paystack init + 15-minute PENDING seat hold**. This story is the
**other half of the online-payment path: the webhook that confirms the held seat exactly once.**

**The 4.1 → 4.2 handoff (what already exists and is the substrate — do NOT recreate):**

- **`src/lib/enrollment.ts` — `reserveSeat()` (4.1, `done`).** On the insufficient-balance path it creates a
  `PENDING` `Enrollment` with `pendingExpiresAt = now+15min`, `priceCents` snapshot, and a **unique
  `paymentRef`**, and returns `outcome: "pending_payment"` — but writes **NO** `BOOKING_CHARGE`. The module
  header explicitly reserves the confirm seam for **this story**: *"confirm (webhook — 4.2) … live here as
  separate exported functions."* **THIS story adds that confirm function.** enrollment.ts is the **sole writer
  of every `Enrollment.status` transition (AD-14)** — the webhook must NOT write status; it calls into
  enrollment.ts. [Source: acce-nextjs/src/lib/enrollment.ts:1-66]
  - Reuse its module-private helpers **as-is** (same file): `MAX_RETRIES`, `backoffMs(attempt)`,
    `isSerializationError(err)` (P2034 / raw `40001`), and the `db.$transaction(..., { isolationLevel:
    Serializable, maxWait: 5000, timeout: 15000 })` + retry-loop shape. Copy the loop structure from
    `reserveSeat` exactly. [Source: enrollment.ts:108-138, 173-445]
  - The `SELECT … FOR UPDATE "GroupSession"` lock pattern is `tx.$queryRaw<…>\`… FOR UPDATE\`` (Prisma has no
    `findUnique…FOR UPDATE`). Mirror `reserveSeat` Step 1 exactly. [Source: enrollment.ts:191-199]
- **`src/lib/paystack.ts` — `initializeTransaction` + pure helpers (4.1, `done`).** Its header names the **4.2
  seam** verbatim: *"`verifySignature(payload: Buffer, signature: string): boolean` lives here next — the
  HMAC-SHA512 check on the raw webhook body. Add it when 4.2 lands."* **THIS story adds `verifySignature`.**
  Native `fetch` only, no SDK (AD-13); `PAYSTACK_SECRET_KEY` read server-side, never logged, fail-fast.
  [Source: acce-nextjs/src/lib/paystack.ts:8-24]
- **`src/lib/wallet.ts` — `mutate(tx, studentId, input)` + `getBalance(studentId, tx?)` (3.1, `done`).** The
  **single serialized ledger seam (AD-6)**: takes the per-student `pg_advisory_xact_lock`, reads balance under
  the lock, NFR4 non-negative guard, appends an **immutable** `LedgerEntry`. `WalletMutateInput` accepts
  `{ type, amountCents (signed), enrollmentId?, paymentRef? }`. **Both** the confirm-`BOOKING_CHARGE` and the
  AD-15 `CANCELLATION_REFUND` in this story go through `mutate` (never `tx.ledgerEntry.create` directly).
  [Source: acce-nextjs/src/lib/wallet.ts:31-40, 126-160]
- **`src/lib/class-occupancy.ts` — `occupiedEnrollmentWhere(now)` (2.2, `done`).** The AD-5 occupancy predicate:
  `status ∈ {PENDING,CONFIRMED} AND (pendingExpiresAt IS NULL OR > now)`. Reuse it for the **re-check under the
  lock** (count occupancy **excluding this enrollment's own row** — see AC2/AC3). [Source: acce-nextjs/src/lib/class-occupancy.ts:30]

**Data model is ALREADY migrated — NO schema/migration/enum change:**
- `Payment { id, reference @unique, amountCents Int, status String, type String, raw Json, createdAt }` — the
  **idempotency mirror**, written by THIS story's webhook. **Not written by anything else yet.**
  [Source: acce-nextjs/prisma/schema.prisma:191-200]
- `Enrollment.paymentRef String? @unique` — the webhook→enrollment join key (4.1 sets it; the webhook matches
  `Payment.reference` against it). `Enrollment.status EnrollmentStatus`, `pendingExpiresAt DateTime?`,
  `priceCents Int`, `@@unique([studentId, groupSessionId])`, `@@index([groupSessionId, status])`.
  [Source: schema.prisma:142-158]
- `LedgerType` includes `BOOKING_CHARGE` and `CANCELLATION_REFUND` (both already exist). The partial-unique
  index `LedgerEntry(enrollmentId) WHERE type='BOOKING_CHARGE'` (AD-8) is live in migration
  `20260705203800_schema_deltas_spine`. [Source: schema.prisma:160-189]

**Env is ALREADY documented — NO new env var:** `PAYSTACK_SECRET_KEY` is in `.env.example` ("Only needed for
Epic 4"). The webhook reads it server-side for the HMAC verify (same secret Paystack signs with).
[Source: acce-nextjs/.env.example:13-14]

**This story builds:**
1. **`src/lib/paystack.ts` — `verifySignature` + pure `computeSignature` helper (NEW in the existing file).**
2. **`src/lib/enrollment.ts` — a NEW exported `confirmPaidSeat(...)` (the 4.2 confirm seam, sole status writer).**
   Owns the whole Serializable tx: Payment idempotency gate → `GroupSession FOR UPDATE` re-check → either
   `PENDING → CONFIRMED` + `BOOKING_CHARGE`, or AD-15 conserve-to-wallet.
3. **`src/app/api/webhooks/paystack/route.ts` (NEW)** — public POST route, `runtime='nodejs'`, raw-body HMAC
   verify, Zod-parse, dispatch `charge.success` to `confirmPaidSeat`, return the right HTTP status.
4. **Pure, unit-tested helpers** — `computeSignature`, the Zod webhook-event parser, and a pure decision
   function for the confirm/refund/no-op branch (mirrors 4.1's pure-helper boundary).

**This is a MONEY path AND a security surface (public, HMAC-only auth).** Follow the ARCHITECTURE-SPINE
invariants to the letter.

**CRITICAL SCOPE BOUNDARIES:**
- **Webhook confirm ONLY.** Do NOT touch `reserveSeat`'s reserve/hold logic (4.1, `done`) or the Paystack
  init/island/page (4.1, `done`). This story adds `verifySignature` + `confirmPaidSeat` + the route.
- **NO no-oversell concurrency integration test authored here** — that is **Story 4.3** (record the deferral).
  The webhook's re-check-under-lock IS in scope; the *load test proving* it is 4.3.
- **NO Paystack card-refund adapter** — AD-15 conserves late/orphan payments as **wallet credit**
  (`CANCELLATION_REFUND`); an outbound card-refund path is on the spine Deferred list. Do NOT build it.
- **NO cancel/refund flow (Epic 5), NO admin credit (3.5 `done`), NO roster/attendance/confirmation email
  (Epic 6).** The seat-confirmation email is **Story 6.3** — do NOT send email here.
- **NO schema/migration/enum/dependency change** (Payment/paymentRef/ledger types all migrated; Node `crypto`
  is built-in; native `fetch` only — AD-13).
- **NO status write outside `enrollment.ts` (AD-14); NO `ledgerEntry.create` outside `wallet.ts` (AD-6).**
- **NO new env var, NO CSP change** (the webhook is a server-to-server POST; not browser-CSP-governed).

## Acceptance Criteria

**AC1 — Raw-body HMAC-SHA512 signature verification; invalid signatures rejected (NFR2, AD-7).**
Given the webhook route at `src/app/api/webhooks/paystack/route.ts` reads the **raw request body** (via
`await request.text()` — no JSON body-parsing before verification) and pins `export const runtime = 'nodejs'`,
When a POST arrives with an `x-paystack-signature` header,
Then the route computes **HMAC-SHA512 of the raw body** with `PAYSTACK_SECRET_KEY` and compares it to the header
using a **constant-time** comparison (`crypto.timingSafeEqual`); a missing header, a wrong-length digest, or a
mismatch is **rejected with HTTP 401** and no DB write occurs. A valid signature proceeds. The secret is never
logged.

**AC2 — `charge.success` confirms the held seat exactly once, transactionally (FR8, NFR3, AD-7, AD-8, AD-14).**
Given a signature-valid `charge.success` event whose `data.reference` matches an `Enrollment.paymentRef` for a
**still-holdable** seat,
When it is processed,
Then — in **one `Serializable` transaction** ordered per AD-7 — **(1)** a `Payment` row is inserted keyed by the
unique `reference` (the idempotency **gate**); **(2)** the `GroupSession` row is locked `FOR UPDATE` and
occupancy is re-counted (via `occupiedEnrollmentWhere(now)`, **excluding this enrollment's own row**); **(3)**
because the seat is still available, `enrollment.ts` flips the matching enrollment **`PENDING → CONFIRMED`**
(clearing `pendingExpiresAt`) **and** writes exactly one **`BOOKING_CHARGE`** ledger row (`-priceCents`, the
class-snapshot price, `enrollmentId`, `paymentRef=reference`) via `wallet.mutate`. The route returns **HTTP 200**.
No status write happens outside `enrollment.ts` (AD-14); no ledger write outside `wallet.ts` (AD-6); exactly one
`BOOKING_CHARGE` per enrollment (AD-8 partial-unique index backstops it).

**AC3 — Re-delivery of the same reference is idempotent: exactly one charge, still HTTP 200 (NFR3, AD-7).**
Given a `charge.success` whose `reference` was **already processed** (a `Payment` row already exists),
When it is re-delivered (Paystack retries; or two deliveries race),
Then the `Payment` insert hits the **unique-constraint violation** (`reference @unique`), the handler **no-ops
the confirm** (no second `BOOKING_CHARGE`, no status re-flip, no second wallet credit) and returns **HTTP 200**
(so Paystack stops retrying). Concurrent duplicate deliveries are serialized by the `Payment.reference` unique
insert + Serializable SSI so that **exactly one** wins.

**AC4 — Orphan/late payment conserves money to the wallet, never oversells (AD-15, FR8, NFR4).**
Given a signature-valid `charge.success` for a reference whose seat **can no longer be granted** — the hold
expired and the class has since filled (own row `CANCELLED` by a lazy expiry flip, **or** still `PENDING` but
OTHER occupancy under the lock has reached `capacity`),
When it is processed,
Then **no seat is confirmed and the class is not oversold**; instead the **captured amount** (`data.amount` from
the event, integer cents) is **credited to the student's wallet** as a **`CANCELLATION_REFUND`** ledger row via
`wallet.mutate` (`+amountCents`, `paymentRef=reference`, `enrollmentId`), a still-`PENDING` orphan row is flipped
to `CANCELLED` by `enrollment.ts` (AD-14), the money is **never silently kept**, and the whole branch is
**idempotent by `Payment.reference`** (the same insert gate). Returns **HTTP 200**.

**AC5 — Non-`charge.success` events and unexpected errors behave correctly for Paystack retry semantics.**
Given the webhook receives a signature-valid event that is **not** `charge.success` (e.g. `charge.failed`,
`transfer.*`),
When it is processed,
Then it is acknowledged with **HTTP 200** and **no seat/ledger side-effect** (we only confirm on
`charge.success`). Given a **malformed** event body (fails Zod validation) → **HTTP 400**. Given an
**unexpected/transient error** (DB down, serialization retries exhausted) → the route returns a **non-2xx (500)**
so Paystack **retries** later (do not swallow a real failure into a 200). Expected outcomes never throw across
the route boundary.

**AC6 — `verifySignature` is a thin native-crypto adapter; the chain stays green (AD-13, NFR2, NFR9).**
`src/lib/paystack.ts#verifySignature(rawBody, signature)` uses Node's built-in `crypto` (HMAC-SHA512), reads
`PAYSTACK_SECRET_KEY` server-side (fail-fast/never-logged), and factors the **pure** hash into a testable
`computeSignature(rawBody, secret)` (no env, no I/O). `npx prisma validate` passes (schema untouched),
`npm run build` succeeds (tsc clean; the `/api/webhooks/paystack` route present), and `npm test` (vitest) stays
green **with new unit tests** for `computeSignature` (known HMAC-SHA512 vector), the timing-safe verify
(match/mismatch/bad-length/missing header), the Zod event parser (valid `charge.success` / non-charge / malformed),
and the pure confirm-decision function (`confirm` / `refund_to_wallet` / `noop`). **No schema/migration/dependency
change.** The **live real-Postgres** webhook round-trip (confirm + idempotent replay + AD-15 orphan credit) and
the **live Paystack sandbox** signature round-trip are **deferred to the CI ephemeral-Postgres job** and recorded
in `deferred-work.md`. The **no-oversell concurrency load test is Story 4.3**.

## Tasks / Subtasks

- [x] **Task 1 — `paystack.verifySignature` + pure `computeSignature` (AC1, AC6, AD-13, NFR2).**
  - [x] In `src/lib/paystack.ts`, add `export function computeSignature(rawBody: string, secret: string): string`
    → `crypto.createHmac("sha512", secret).update(rawBody, "utf8").digest("hex")`. Pure (secret is an arg, no
    env read) so it's unit-testable against a known vector. `import { createHmac, timingSafeEqual } from "crypto"`.
  - [x] Add `export function verifySignature(rawBody: string, signature: string | null): boolean`. Read
    `PAYSTACK_SECRET_KEY` from `process.env`; if missing/empty → `console.error` (never log the value) + return
    `false` (fail-closed). If `signature` is null/empty → `false`. Compute the expected hex digest; compare with
    **`crypto.timingSafeEqual`** on equal-length `Buffer`s (guard unequal lengths → `false` **before**
    `timingSafeEqual`, which throws on length mismatch). Return the boolean.
  - [x] Update the existing header comment: the 4.2 seam is now FILLED (`verifySignature` present); keep the
    AD-13 native-fetch / AD-7 note. Do NOT touch `initializeTransaction` or the pure init helpers.
- [x] **Task 2 — `enrollment.confirmPaidSeat`: the webhook confirm seam (AC2, AC3, AC4, AD-7/8/14/15).**
  - [x] In `src/lib/enrollment.ts`, add `export async function confirmPaidSeat(args: { reference: string;
    amountCents: number; status: string; type: string; raw: unknown }): Promise<ConfirmResult>` where
    `ConfirmResult = { ok: true; outcome: "confirmed" | "refunded_to_wallet" | "already_processed" | "noop" } |
    { ok: false; reason: "error" }`. **Do NOT modify `reserveSeat`.** Reuse the SAME `db.$transaction(...,
    { isolationLevel: Serializable, maxWait: 5000, timeout: 15000 })` + `while (attempt <= MAX_RETRIES)` retry
    loop + `isSerializationError`/`backoffMs` helpers already in the file.
  - [x] **Inside the tx, ordered per AD-7:**
    1. **Idempotency gate:** `await tx.payment.create({ data: { reference: args.reference, amountCents:
       args.amountCents, status: args.status, type: args.type, raw: args.raw as Prisma.InputJsonValue } })`.
       If this throws Prisma **`P2002`** (unique `reference`) → the reference was already processed →
       **return `{ ok: true, outcome: "already_processed" }`** (do NOT proceed; caller returns 200). Detect
       P2002 **inside** the callback and rethrow a sentinel, OR catch it just outside the tx and map to
       `already_processed` — pick one and keep it clean; the tx MUST roll back on P2002 so no partial state.
    2. **Find the enrollment** by `paymentRef = reference`: `tx.enrollment.findUnique({ where: { paymentRef:
       args.reference }, select: { id, studentId, groupSessionId, status, priceCents } })`. If none → orphan
       payment with no enrollment (should not occur — 4.1 always sets `paymentRef` before init). Log + return
       `{ ok: true, outcome: "noop" }` (Payment recorded; nothing to grant/credit safely — no student to attribute).
    3. **Lock the class:** `tx.$queryRaw\`SELECT id, status, "start", capacity, "priceCents" FROM "GroupSession"
       WHERE id = ${enr.groupSessionId} FOR UPDATE\`` (mirror `reserveSeat` Step 1). Re-read the enrollment
       `status` under the lock (TOCTOU-safe).
    4. **Decide (extract into the pure `decideConfirmOutcome` from Task 4):**
       - own status already `CONFIRMED/ATTENDED/NO_SHOW` → **noop** (defensive; the Payment gate normally
         prevents a second delivery reaching here).
       - status `PENDING`: count OTHER occupancy `tx.enrollment.count({ where: { groupSessionId, id: { not:
         enr.id }, ...occupiedEnrollmentWhere(now) } })`. If `< capacity` → **confirm**. Else (class refilled) →
         **refund_to_wallet**.
       - status `CANCELLED` (lazy-expired then released) → **refund_to_wallet**.
    5. **confirm:** `tx.enrollment.update({ where: { id: enr.id }, data: { status: "CONFIRMED",
       pendingExpiresAt: null } })` **then** `await mutate(tx, enr.studentId, { type: "BOOKING_CHARGE",
       amountCents: -enr.priceCents, enrollmentId: enr.id, paymentRef: args.reference })`. Charge uses the
       **enrollment's snapshot `priceCents`** (AD-16), not `args.amountCents`. Return `{ ok: true, outcome:
       "confirmed" }`.
    6. **refund_to_wallet (AD-15):** if still `PENDING`, flip `status: "CANCELLED", pendingExpiresAt: null`
       (AD-14 sole writer); then `await mutate(tx, enr.studentId, { type: "CANCELLATION_REFUND", amountCents:
       args.amountCents, enrollmentId: enr.id, paymentRef: args.reference })` (**positive** = credit the captured
       amount). Return `{ ok: true, outcome: "refunded_to_wallet" }`.
  - [x] **Lock order = GroupSession `FOR UPDATE` → wallet advisory lock (inside `mutate`)** — identical to
    `reserveSeat`, so the two never deadlock. Add a header note extending the AD-14 comment: `confirmPaidSeat` is
    the webhook's confirm entry; the expiry `→CANCELLED` flip on the orphan path is a status write and stays here.
  - [x] On serialization failure retry per the loop; on non-retryable error `console.error` (structured, never
    the secret) + return `{ ok: false, reason: "error" }` (the route maps this to HTTP 500 for Paystack retry).
- [x] **Task 3 — Webhook route handler (AC1, AC5, AD-7, layering).**
  - [x] Create `src/app/api/webhooks/paystack/route.ts`. **`export const runtime = "nodejs";`** (raw-body HMAC).
    `export async function POST(request: Request)`: (1) `const raw = await request.text();` (RAW — do not
    `request.json()` before verifying); (2) `const sig = request.headers.get("x-paystack-signature");`
    `if (!verifySignature(raw, sig)) return new Response("Invalid signature", { status: 401 });`
    (3) `JSON.parse(raw)` inside try/catch → on parse error 400; (4) Zod-validate the event shape (Task 4 parser)
    → on invalid 400; (5) if `event.event !== "charge.success"` → `return new Response(null, { status: 200 })`
    (ack + ignore); (6) `const r = await confirmPaidSeat({ reference: event.data.reference, amountCents:
    event.data.amount, status: event.data.status, type: event.event, raw: event });` → `r.ok ? 200 : 500`.
  - [x] The route is a **thin shell**: HMAC + parse + HTTP status only. **No `Enrollment.status` write, no
    `ledgerEntry.create`, no `db.$transaction` here** (all in `confirmPaidSeat`). Never throw across the
    boundary — a thrown/`{ok:false}` maps to 500 so Paystack retries; expected ignores map to 200.
  - [x] The route is **public** (Paystack has no session). It is NOT in `middleware.ts`'s matcher
    (`/guides`,`/pdfs`,`/portal`,`/admin`) so it bypasses the coarse redirect — **verify no matcher change is
    needed** and add none. It is a route handler (not a server action) so Next server-action CSRF does not apply;
    Better Auth only wraps `/api/auth`. Confirm no CSRF/auth middleware intercepts `/api/webhooks/paystack`.
- [x] **Task 4 — Pure helpers + unit tests (AC6).**
  - [x] Pure Zod parser: `export function parseWebhookEvent(json: unknown): { ok: true; event: PaystackChargeEvent }
    | { ok: false }` validating `{ event: string, data: { reference: string (nonempty), amount: number (int ≥ 0),
    status: string } }`. Put it in `paystack.ts` (or a colocated pure module). Non-`charge.success` still parses
    OK (the route decides to ignore) — validate the envelope, not the event name.
  - [x] Pure decision: `export function decideConfirmOutcome(args: { status: EnrollmentStatus; othersOccupied:
    number; capacity: number }): "confirm" | "refund_to_wallet" | "noop"` implementing the Task 2 step-4 table.
    Unit-test every branch (PENDING+room→confirm, PENDING+full→refund, CANCELLED→refund, CONFIRMED→noop).
  - [x] Add `tests/unit/paystack-webhook.test.ts` (or extend `tests/unit/paystack.test.ts`): `computeSignature`
    against a **known HMAC-SHA512 vector** (fixed body+secret → fixed hex); `verifySignature` match / mismatch /
    null header / wrong-length digest (set `process.env.PAYSTACK_SECRET_KEY` in the test); `parseWebhookEvent`
    valid/non-charge/malformed; `decideConfirmOutcome` all branches. **Do NOT** unit-test `confirmPaidSeat`, the
    route, or the live HMAC-over-network path (they need Postgres / a real request) — mirror 4.1's boundary; do
    not over-mock Prisma.
- [x] **Task 5 — Verify the chain + record deferrals (AC5, AC6).**
  - [x] `npx prisma validate` (schema untouched) · `npm run build` (tsc clean; confirm `/api/webhooks/paystack`
    appears in the route manifest / build output) · `npm test` (vitest green, new webhook tests). The webhook is
    POST-only + HMAC — it is **NOT** an authenticated GET route, so it does **NOT** go in the e2e
    `authenticated-routes.ts` GET-200 smoke manifest; **no manifest change**.
  - [x] Record in `deferred-work.md`: (a) live real-Postgres webhook round-trip — `charge.success` →
    `PENDING→CONFIRMED` + one `BOOKING_CHARGE`; (b) **idempotent replay** — same `reference` twice → exactly one
    charge, both 200; (c) **AD-15 orphan** — expired hold + full class → `CANCELLATION_REFUND` credit, no
    oversell; (d) live Paystack **sandbox** signature round-trip (real `x-paystack-signature` from a test event).
    All to the CI ephemeral-Postgres job (same wall as 1.1/1.5/2.x/3.4/4.1). The no-oversell **concurrency** test
    is **Story 4.3**; the webhook **rate-limit** is deferred to the reverse-proxy/edge (see Dev Notes).

## Dev Notes

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-7 — Payments confirm out-of-band via an idempotent webhook (THE HEART OF THIS STORY):** the webhook at
  `src/app/api/webhooks/paystack/route.ts` (`export const runtime='nodejs'`) is the **sole** confirmation
  trigger. It reads the **raw body**, verifies `x-paystack-signature` = HMAC-SHA512(rawBody, secret) (reject on
  mismatch). In one tx, ordered: **(1)** `INSERT Payment` by unique `reference` as the idempotency **gate** (a
  concurrent/duplicate delivery hits the unique violation, no-ops, returns 200); **(2)** re-check the
  enrollment/seat **under the `GroupSession` lock**; **(3)** flip status + write `BOOKING_CHARGE` by **calling
  `enrollment.ts`** (it does not write status itself — AD-14). The browser callback/redirect is display-only.
  [Source: ARCHITECTURE-SPINE.md#AD-7]
- **AD-14 — `enrollment.ts` is the sole writer of every status transition:** the webhook **calls** the confirm
  function; it never issues an `Enrollment.status` UPDATE. The `PENDING→CONFIRMED` flip AND the AD-15 orphan
  `PENDING→CANCELLED` flip both live in `confirmPaidSeat` inside enrollment.ts, under the GroupSession lock.
  [Source: ARCHITECTURE-SPINE.md#AD-14; enrollment.ts:1-7]
- **AD-8 — Exactly one BOOKING_CHARGE per confirmed enrollment — enforced:** the balance path charged at
  reserve-time (3.4); the Paystack path charges **only here, at webhook confirm-time**; mutually exclusive per
  enrollment. Enforced by the partial-unique index `LedgerEntry(enrollmentId) WHERE type='BOOKING_CHARGE'` **and**
  the webhook no-op when the enrollment is already `CONFIRMED`. A 4.1 PENDING row never carried a charge, so the
  confirm write is clean. [Source: ARCHITECTURE-SPINE.md#AD-8; schema.prisma:181-184]
- **AD-15 — Late/orphan payment conserves money to the wallet:** when a verified `charge.success` arrives but the
  seat can no longer be granted (hold expired + class now full, per the re-check), the **captured amount** is
  credited to the student's wallet as a `CANCELLATION_REFUND` (via AD-6), **never kept, never oversold**,
  idempotent by `Payment.reference`. MVP conserves as wallet credit; a Paystack **card-refund** adapter is
  **deferred** (spine Deferred list). This supersedes the epic's older "auto-refunded via Paystack" wording.
  [Source: ARCHITECTURE-SPINE.md#AD-15, #Deferred; epics.md Story 4.2 AC3]
- **AD-6 — Wallet is append-only; one serialized mutation path:** both the `BOOKING_CHARGE` and the AD-15
  `CANCELLATION_REFUND` go through `wallet.mutate(tx, studentId, …)` (per-student advisory lock, non-negative
  NFR4 guard, immutable append). Never `tx.ledgerEntry.create` directly. Pass the caller's `tx` so it composes
  into the confirm tx. [Source: ARCHITECTURE-SPINE.md#AD-6; wallet.ts:126-160]
- **AD-4 / AD-5 — one reservation; capacity derived; re-check under the lock:** the confirm re-check counts
  occupancy with `occupiedEnrollmentWhere(now)` **excluding this enrollment's own row**, under the `GroupSession
  FOR UPDATE` lock, so an expired-then-refilled class cannot be oversold by a late confirm. Serializable SSI +
  the row lock serialize concurrent webhook/reserve writers; retry on P2034/40001. The **no-oversell load test**
  is 4.3. [Source: ARCHITECTURE-SPINE.md#AD-4, #AD-5]
- **NFR2 — Webhook authenticity:** HMAC-SHA512 of the **raw body**; constant-time compare (`timingSafeEqual`);
  reject bad signatures; the route reads the raw body (no body-parsing middleware before verify).
  [Source: epics.md NFR2; ARCHITECTURE-SPINE.md#Consistency Conventions "Runtime"]
- **NFR3 — Webhook idempotency:** keyed by `Payment.reference` (unique-insert gate); re-delivery → exactly one
  charge/confirmation, HTTP 200. [Source: epics.md NFR3]
- **AD-13 — External I/O via native adapters:** `verifySignature` uses Node's built-in `crypto` (HMAC-SHA512),
  no SDK/axios. Keep `paystack.ts` thin (init + verifySignature). [Source: ARCHITECTURE-SPINE.md#AD-13]
- **AD-9 — Money is integer cents (ZAR):** `data.amount` from Paystack is integer cents (ZAR lowest unit —
  same convention 4.1 sent on init); the refund credits that integer; the charge debits the enrollment's integer
  `priceCents` snapshot. No floats. [Source: ARCHITECTURE-SPINE.md#AD-9]
- **AD-1 / AD-2:** the webhook is **additive** under `src/app/api/webhooks/paystack/` — marketing routes/headers
  untouched; `import { db } from "@/lib/db"` (never `new PrismaClient()`). Global CSP needs **no** change for a
  server-to-server POST. [Source: ARCHITECTURE-SPINE.md#AD-1, AD-2, #Deployment]
- **Consistency Conventions:** Zod at the entry (validate the event before touching domain); discriminated
  results — never throw across the boundary for expected outcomes; money paths emit structured logs on failure
  (never swallow); the webhook route pins `runtime='nodejs'`; the webhook is rate-limited (see the deferral
  decision below). [Source: ARCHITECTURE-SPINE.md#Consistency Conventions]

### The confirm control flow (correctness-critical)
```
POST /api/webhooks/paystack   [runtime=nodejs]
  raw = await request.text()                          -- RAW body, before any parse
  verifySignature(raw, x-paystack-signature)          -- HMAC-SHA512 timing-safe; else 401
  event = Zod.parse(JSON.parse(raw))                  -- else 400
  event.event !== "charge.success" → 200 (ignore)
  confirmPaidSeat({ reference, amountCents=data.amount, status, type, raw }):
    ── ONE Serializable tx, retry P2034/40001 ──
    INSERT Payment(reference unique)                  -- AD-7 idempotency GATE
        └─ P2002 → already_processed → (rollback) → 200
    findUnique Enrollment by paymentRef=reference
        └─ none → noop (Payment recorded) → 200
    SELECT … FOR UPDATE GroupSession(enr.groupSessionId)   -- AD-4/5 re-check under lock
    decide(status, othersOccupied=count(others, occupiedEnrollmentWhere(now)), capacity):
      CONFIRMED/ATTENDED/NO_SHOW           → noop
      PENDING & othersOccupied <  capacity → confirm
      PENDING & othersOccupied >= capacity → refund_to_wallet   (AD-15)
      CANCELLED                            → refund_to_wallet    (AD-15)
    confirm:  Enrollment→CONFIRMED, pendingExpiresAt=null
              wallet.mutate BOOKING_CHARGE -priceCents (snapshot), enrollmentId, paymentRef   -- AD-6/8
    refund:   if PENDING → Enrollment→CANCELLED (AD-14)
              wallet.mutate CANCELLATION_REFUND +amountCents (captured), enrollmentId, paymentRef  -- AD-15
    commit
  r.ok ? 200 : 500   -- 500 lets Paystack retry a transient failure
```
[Source: ARCHITECTURE-SPINE.md#AD-7 "ordered (1)(2)(3)"; enrollment.ts reserveSeat lock/retry pattern]

### Why the Payment-insert is the idempotency gate (not a status check)
A status check (`if already CONFIRMED, skip`) races two concurrent deliveries: both read `PENDING`, both confirm,
double charge. The **unique `Payment.reference` insert** is the atomic gate — under Serializable SSI only one
insert commits; the loser gets `P2002` (or a serialization abort → retry → then `P2002`) and no-ops. This is why
AD-7 orders the Payment insert **first**. Do NOT replace it with a status precondition. [Source: ARCHITECTURE-SPINE.md#AD-7]

### Webhook rate-limiting — deferred to the edge (decision)
Consistency Conventions list the webhook as rate-limited, but no in-app limiter/Redis exists (the magic-link
limit is Better Auth's built-in `rateLimit`, which only governs `/api/auth`, not a custom route handler). An
in-memory limiter is unreliable across a multi-instance/standalone deploy and risks dropping legitimate Paystack
retries. **Decision:** the route rejects forged posts cheaply with a constant-time HMAC compare (the real abuse
vector), and a proper distributed rate limit is deferred to the **Coolify/reverse-proxy edge** (matches
Deployment: "the webhook endpoint is public and authenticated by HMAC only"). Recorded in `deferred-work.md`.
Do NOT add a Redis dependency or an in-memory limiter in this story. [Source: autopilot-decisions.md 2026-07-06
"Webhook rate-limiting deferred to edge"; ARCHITECTURE-SPINE.md#Deployment]

### Scope boundary (do NOT do — belongs to other stories)
- **No changes to `reserveSeat` / the Paystack init / island / detail page** — all 4.1 (`done`).
- **No no-oversell concurrency *load* test authored here** — Story 4.3 (the re-check-under-lock IS here; the test
  proving N+1→N is 4.3). Record the deferral only.
- **No Paystack card-refund adapter** — AD-15 conserves to wallet; card-refund is on the spine Deferred list.
- **No seat-confirmation email** — that fires on CONFIRMED but is **Story 6.3** (`email.ts` + `meeting.ts`).
  A confirm here must NOT block on or send email.
- **No cancel/refund (Epic 5), no admin credit (3.5 done), no roster/attendance (Epic 6).**
- **No schema/migration/enum/dependency/env/CSP change; no new palette.**
- **No status write outside `enrollment.ts` (AD-14); no `ledgerEntry.create` outside `wallet.ts` (AD-6).**

### Data model facts this story depends on (verified, all migrated)
- `Payment { reference @unique, amountCents Int, status String, type String, raw Json }` — the webhook writes
  this; `reference @unique` is the idempotency gate; `raw` stores the full event (`Prisma.InputJsonValue`).
  [Source: schema.prisma:191-200]
- `Enrollment { status, pendingExpiresAt, priceCents, paymentRef @unique, @@unique([studentId, groupSessionId]),
  @@index([groupSessionId, status]) }` — look up by `paymentRef`; flip `status`; charge uses `priceCents`
  snapshot (AD-16). [Source: schema.prisma:142-158]
- `LedgerType` has `BOOKING_CHARGE` and `CANCELLATION_REFUND`. Partial-unique `WHERE type='BOOKING_CHARGE'` is
  live (AD-8). `WalletMutateInput` accepts `paymentRef?` — set it to `reference` for traceability.
  [Source: schema.prisma:160-189; wallet.ts:31-40]
- `GroupSession { status, start, capacity, priceCents }` — locked `FOR UPDATE`; occupancy re-count uses
  `occupiedEnrollmentWhere(now)`. [Source: schema.prisma; class-occupancy.ts:30]

### Previous story intelligence (4.1 + Epic 3)
- **4.1 wrote the PENDING hold + `paymentRef` and reserved this confirm seam.** enrollment.ts header
  (`confirm (webhook — 4.2)`) and paystack.ts header (`verifySignature … Add it when 4.2 lands`) name this story
  verbatim — fill both. Reuse 4.1's retry loop / lock pattern; do not re-derive. [Source: enrollment.ts:1-66;
  paystack.ts:8-24]
- **4.1 code-review deferrals that touch this story:** (a) `existing.paymentRef!` non-null assertion in the
  resume path — here every PENDING you look up was created with a `paymentRef`, so the join is safe; (b) the
  AD-12-vs-AD-8 reactivation/BOOKING_CHARGE collision is **unreachable** until Epic 5 (a webhook confirm targets
  a fresh PENDING row with no prior charge). [Source: deferred-work.md "code review of story-4.1"]
- **3.4 balance path is the BOOKING_CHARGE template:** `wallet.mutate(tx, studentId, { type: "BOOKING_CHARGE",
  amountCents: -priceCents, enrollmentId })` — mirror it exactly (add `paymentRef`). The confirm path is the
  webhook-time twin of 3.4's reserve-time charge; AD-8 keeps them mutually exclusive. [Source: enrollment.ts:346-350]
- **3.1 `getBalance(studentId, tx)` / AD-6 `mutate`** already compose inside a Serializable tx; the advisory
  lock lives inside `mutate`. Lock order GroupSession→advisory matches `reserveSeat` → no deadlock. [Source: wallet.ts]
- **Sandbox reality (1.1/1.5/2.x/3.x/4.1):** prod DB creds + external network are blocked; live DB writes, the
  webhook round-trip, idempotent-replay, AD-15 orphan credit, and a live Paystack signature round-trip are
  deferred to CI ephemeral-Postgres. Static verification (`prisma validate` + `build` + vitest) is the bar; do
  NOT fake a live query. [Source: deferred-work.md]
- **Git:** work lands on branch `epic-4` (chained off the epic-3 tip; 4.1 baseline `a4a4280`). New
  `api/webhooks/paystack/route.ts` + `paystack.verifySignature`/`computeSignature` + `enrollment.confirmPaidSeat`
  + pure parser/decider + unit tests. [Source: sprint-status.yaml]

### External context — Paystack webhooks (native crypto/fetch, AD-13)
- **Signature:** Paystack signs the **raw request body** with your **secret key** using **HMAC-SHA512** and sends
  the hex digest in the **`x-paystack-signature`** header. Verify by recomputing
  `createHmac("sha512", PAYSTACK_SECRET_KEY).update(rawBody).digest("hex")` and constant-time-comparing. You MUST
  hash the **exact raw bytes** received — parsing then re-stringifying JSON changes bytes and breaks the hash, so
  read `request.text()` before any `JSON.parse`. [Source: Paystack "Verify Webhook Signatures"; NFR2]
- **Event shape:** `{ event: "charge.success", data: { reference, amount, status, currency, customer: { email },
  … } }`. `data.amount` is the captured amount in the **lowest denomination = cents** for ZAR (same unit 4.1
  sent). Only `charge.success` confirms a seat; ack everything else with 200. [Source: Paystack "Webhooks /
  Events"; ARCHITECTURE-SPINE.md#AD-7]
- **Retries & status codes:** Paystack retries a webhook that does not return **2xx**. Therefore: 200 on
  success / idempotent replay / ignored event; **500 on a transient failure you want retried**; 401 on a forged
  signature; 400 on a malformed body. Never turn a real DB failure into a 200 (you'd lose the confirmation).
  [Source: Paystack retry docs; AC5]
- **Runtime:** pin `export const runtime = "nodejs"` — the Edge runtime lacks Node `crypto` for HMAC and the raw
  body handling the HMAC needs. [Source: ARCHITECTURE-SPINE.md#Consistency Conventions "Runtime"]

### Testing standards
- Framework: **vitest** (jsdom), `npm test`, specs under `tests/unit/**`. **Add unit tests** for
  `computeSignature` (known HMAC-SHA512 vector), `verifySignature` (match / mismatch / null header /
  wrong-length; set `process.env.PAYSTACK_SECRET_KEY`), `parseWebhookEvent` (valid `charge.success` / non-charge /
  malformed), and `decideConfirmOutcome` (all four branches). Mirror `tests/unit/paystack.test.ts`
  (`tests/unit/reserve-schema.test.ts`) boundary. **Do NOT** unit-test `confirmPaidSeat`, the route, or the live
  HMAC-over-request path (need Postgres / a real signed request); do not over-mock Prisma. [Source:
  acce-nextjs/vitest.config.ts; 4-1-…md]
- **Deferred (record in `deferred-work.md`):** the live real-Postgres confirm round-trip, the idempotent-replay
  (same reference twice → one charge), the AD-15 orphan-credit, and the live Paystack **sandbox** signature
  round-trip — all to the CI ephemeral-Postgres job (same wall as 1.1/1.5/2.x/3.4/4.1). The no-oversell
  **concurrency** load test is **Story 4.3**; the webhook rate-limit is deferred to the edge. [Source:
  ARCHITECTURE-SPINE.md#AD-7; deferred-work.md]

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `acce-nextjs/src/*`.
- NEW files:
  - `src/app/api/webhooks/paystack/route.ts` — public POST, `runtime='nodejs'`, raw-body HMAC → `confirmPaidSeat`.
  - `tests/unit/paystack-webhook.test.ts` (or extend `tests/unit/paystack.test.ts`).
- UPDATE:
  - `src/lib/paystack.ts` — add `computeSignature` + `verifySignature` + `parseWebhookEvent` (fill the 4.2 seam;
    do NOT touch `initializeTransaction`).
  - `src/lib/enrollment.ts` — add `confirmPaidSeat` + `decideConfirmOutcome` (NEW exported function; sole status
    writer; reuse the retry/lock helpers). Do NOT modify `reserveSeat`.
  - `_bmad-output/implementation-artifacts/deferred-work.md` — record the four deferred live-verification items.
- Aligns with the ARCHITECTURE-SPINE source tree: `api/webhooks/paystack/route.ts # raw body + HMAC (AD-7)`,
  `paystack.ts # init + verifySignature`, `enrollment.ts # sole status writer: reserve/confirm/… (AD-14)`. No
  variance. [Source: ARCHITECTURE-SPINE.md#Structural Seed]

### Latest tech notes
- **Next 16 App Router route handler:** `export const runtime = "nodejs"`; read the raw body with
  `await request.text()` (do NOT `request.json()` before HMAC verify); return `new Response(body, { status })`.
  Route handlers are not subject to server-action CSRF. [Source: Next 16 route-handler docs; ARCHITECTURE-SPINE.md]
- **Node `crypto` (built-in):** `createHmac("sha512", secret).update(raw, "utf8").digest("hex")` +
  `timingSafeEqual(Buffer.from(a), Buffer.from(b))` (guard equal length first — it throws on mismatch). No new
  dependency. [Source: Node crypto docs; AD-13]
- **Prisma 6.19.3:** `tx.payment.create` throws `Prisma.PrismaClientKnownRequestError` with `code === "P2002"`
  on the unique `reference` violation — catch it as the idempotency signal. `raw` is `Prisma.InputJsonValue`.
  `confirmPaidSeat` composes `tx.payment.create` + `tx.$queryRaw FOR UPDATE` + `tx.enrollment.update` +
  `wallet.mutate` in the one Serializable tx. [Source: Prisma error-reference P2002; enrollment.ts]

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 4 / Story 4.2 / FR8 / NFR2 / NFR3]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-1, AD-2, AD-4, AD-5, AD-6, AD-7, AD-8, AD-9, AD-13, AD-14, AD-15, AD-16, "Structural Seed", "Consistency Conventions", "Deployment & Environment", "Capability → Architecture Map"]
- [Source: acce-nextjs/prisma/schema.prisma#Payment / Enrollment / EnrollmentStatus / LedgerType / GroupSession]
- [Source: acce-nextjs/src/lib/enrollment.ts (reserveSeat — the retry/lock/AD-5 pattern to reuse; the 4.2 confirm seam)]
- [Source: acce-nextjs/src/lib/paystack.ts (initializeTransaction + pure helpers; the 4.2 verifySignature seam)]
- [Source: acce-nextjs/src/lib/wallet.ts (mutate — AD-6 seam for BOOKING_CHARGE + CANCELLATION_REFUND)]
- [Source: acce-nextjs/src/lib/class-occupancy.ts (occupiedEnrollmentWhere — re-check under the lock)]
- [Source: acce-nextjs/src/middleware.ts (matcher excludes /api/webhooks/* — verify no change); acce-nextjs/.env.example (PAYSTACK_SECRET_KEY present)]
- [Source: _bmad-output/implementation-artifacts/4-1-paystack-init-with-a-15-minute-pending-seat-hold.md; deferred-work.md]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

None — all tasks completed without debugging detours.

### Completion Notes List

- Task 1: `computeSignature` (pure HMAC-SHA512 helper, no env), `verifySignature` (reads PAYSTACK_SECRET_KEY, fail-closed, constant-time timingSafeEqual with length guard), `parseWebhookEvent` (Zod envelope validator) — all added to `src/lib/paystack.ts`. Header comment updated: 4.2 seam FILLED.
- Task 2: `confirmPaidSeat` + `decideConfirmOutcome` + `AlreadyProcessedError` sentinel added to `src/lib/enrollment.ts`. Full Serializable tx: Payment.create idempotency gate (P2002 → AlreadyProcessedError → already_processed), enrollment findUnique by paymentRef, GroupSession FOR UPDATE re-read, TOCTOU-safe freshEnr re-read under lock, othersOccupied count (excludes own row), confirm (PENDING→CONFIRMED + BOOKING_CHARGE wallet.mutate −priceCents snapshot AD-16) or refund (PENDING→CANCELLED + CANCELLATION_REFUND wallet.mutate +amountCents captured AD-15) or noop. Retry loop + backoff reused from reserveSeat (MAX_RETRIES=4). Lock order: GroupSession FOR UPDATE → wallet advisory lock (same as reserveSeat, no deadlock). GroupSession-not-found defensive branch conserves as refund.
- Task 3: `src/app/api/webhooks/paystack/route.ts` created. `runtime='nodejs'`, thin shell: raw text → verifySignature → JSON.parse → parseWebhookEvent → charge.success dispatch → confirmPaidSeat → 200/500. Non-charge.success → 200 ack. No Enrollment.status write, no ledgerEntry.create, no db.$transaction in route. Public route confirmed not intercepted by middleware.ts matcher.
- Task 4: `tests/unit/paystack-webhook.test.ts` created. 76 unit tests covering: computeSignature (6 tests — known HMAC-SHA512 vector, determinism, length, different inputs), verifySignature (13 tests — match, mismatch, null header, empty string, whitespace, wrong-length short, wrong-length long, missing env, empty env, whitespace env, wrong secret, uppercase hex), parseWebhookEvent (18 tests — valid charge.success, valid non-charge, transfer.*, zero amount, missing event/reference/amount/status, empty reference, float amount, negative amount, null, undefined, empty object, string, array, number), decideConfirmOutcome (13 tests — all branches per spec).
- Task 5: prisma validate = clean, npm run build = clean (/api/webhooks/paystack present in route manifest), npm test = 351/351 vitest green. No e2e manifest change (POST-only HMAC route, not a GET smoke target). Deferrals recorded in deferred-work.md: (a) live PENDING→CONFIRMED round-trip, (b) idempotent replay, (c) AD-15 orphan CANCELLATION_REFUND, (d) live Paystack sandbox signature — all deferred to CI ephemeral-Postgres. Webhook rate-limiting deferred to Coolify/edge.

### File List

acce-nextjs/src/lib/paystack.ts (updated — computeSignature, verifySignature, parseWebhookEvent, PaystackChargeEvent)
acce-nextjs/src/lib/enrollment.ts (updated — AlreadyProcessedError, ConfirmResult, decideConfirmOutcome, confirmPaidSeat)
acce-nextjs/src/app/api/webhooks/paystack/route.ts (new — public POST, runtime=nodejs, HMAC verify, thin shell)
acce-nextjs/tests/unit/paystack-webhook.test.ts (new — 76 unit tests for pure helpers)
_bmad-output/implementation-artifacts/deferred-work.md (updated — Story 4.2 deferrals appended)

### Change Log

- 2026-07-06: Story 4.2 implemented — verifySignature/computeSignature/parseWebhookEvent added to paystack.ts; confirmPaidSeat/decideConfirmOutcome/ConfirmResult/AlreadyProcessedError added to enrollment.ts; public webhook route created at api/webhooks/paystack/route.ts; 76 new unit tests in paystack-webhook.test.ts; 351/351 vitest green; build clean; prisma validate clean; four live-verification items deferred to CI ephemeral-Postgres in deferred-work.md.
