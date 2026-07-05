---
id: SPEC-acce-phase-1a
companions:
  - ../../planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md
  - ../../planning-artifacts/ux-designs/ux-ACCE-2026-07-05/DESIGN.md
sources:
  - ../../../docs/PHASE-1A-PLAN.md
  - ../../../docs/STRATEGY.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.
>
> The architecture spine is an **adopted companion**: capability constraints reference its decisions by stable ID (`AD-n`). Downstream stories should cite those AD IDs directly.

# ACCE Phase 1a — Group Classes MVP

## Why

An **opportunity to capture, now.** ACCE Tutors is a one-tutor CA(SA)/CTA exam-prep business (Priyanka Govender) running today as a marketing site where every conversion happens by hand over WhatsApp. Group revision classes are its highest-value, simplest-to-build product: **one tutor, 4–6 paid seats in the same fixed 2-hour slot at R290/seat** — roughly R1,500 for a block versus R290 for a 1-on-1, with no slot-fragmentation logic, just seats against a capacity. The "Test 3 Prep" batch is **live demand right now** (6 classes). This spec turns that manual funnel into an online product where a student can find a class, pay for a seat, and get the joining details — while a scarce class can **never** be oversold. It ships before any 1-on-1, content, or membership work.

## Capabilities

- **CAP-1 — Passwordless authentication**
  - **intent:** A student signs up and logs in via emailed magic link, with no password stored.
  - **success:** Submitting an email sends a magic link; clicking a valid, unexpired link creates a session and lands in the portal; an expired or already-used link is refused with a clear message and no session.

- **CAP-2 — Role-gated areas**
  - **intent:** The system separates `STUDENT` and `ADMIN` access so students reach the portal, only Priyanka reaches admin, and marketing stays public.
  - **success:** An unauthenticated visitor to a portal route is redirected to sign-in; a non-admin hitting any admin route or action is refused with no admin data leaked; enforcement is server-side at every data/mutation entry (`AD-3`), not layout-only.

- **CAP-3 — Browse classes with live seats-left**
  - **intent:** A student browses upcoming scheduled classes, each showing subject, date/time, price, and how many seats remain.
  - **success:** Seats-left = capacity − (PENDING + CONFIRMED, expired holds excluded); a class at/over capacity shows a "Class full" state instead of an active Book action; an empty list shows an empty state; the count is derived, never a stored counter (`AD-5`).

- **CAP-4 — Seat checkout (wallet balance or Paystack)**
  - **intent:** A student reserves a seat and pays either from wallet balance (instant) or via a Paystack one-off charge.
  - **success:** balance ≥ price → a `CONFIRMED` enrollment with exactly one `BOOKING_CHARGE` and no Paystack round-trip; otherwise a `PENDING` hold (`pendingExpiresAt = now + 15min`) plus a Paystack init URL; all acquisition flows through the single `reserveSeat()` (`AD-4`).

- **CAP-5 — No-oversell under concurrency**
  - **intent:** A full class cannot be oversold, even when several students buy the last seat simultaneously.
  - **success:** N+1 concurrent reservations at an N-seat class → exactly N succeed and the rest get "class full"; guaranteed by Serializable SSI + bounded retry on `P2034`/`40001` and proven by a real-Postgres concurrency test (`AD-4`).

- **CAP-6 — Reliable, idempotent payment confirmation**
  - **intent:** A completed Paystack payment confirms the student's seat exactly once.
  - **success:** The webhook rejects a bad HMAC-SHA512 signature (verified against the raw body); a repeated or concurrent `reference` confirms once (Payment-insert is the idempotency gate) and writes exactly one `BOOKING_CHARGE`; the browser callback never confirms a seat (`AD-7`, `AD-8`).

- **CAP-7 — Wallet ledger and view**
  - **intent:** A student sees their balance and a read-only history, backed by an append-only signed ledger.
  - **success:** The wallet page shows current balance and chronological entries; a zero balance shows an empty state; every mutation appends an immutable row via the single per-student-locked `wallet.mutate` and can never drive the balance negative (`AD-6`).

- **CAP-8 — Join-details gating**
  - **intent:** The Meet link (online) or location (in-person) is available only to a student holding a confirmed seat.
  - **success:** A non-confirmed viewer never receives `meetingUrl`/`location` in the payload (omitted server-side, not merely hidden); a confirmed student sees it on the class detail page and in the confirmation email (`AD-10`).

- **CAP-9 — Cancellation with tiered refund to wallet**
  - **intent:** A student cancels a seat and is refunded to wallet balance by a time-based tier, freeing the seat.
  - **success:** Refund % is computed server-side (`h ≥ 48 → 100%`, `24 ≤ h < 48 → 70%` with a 30% fee, `h < 24`/no-show → `0%`); a `CANCELLATION_REFUND` (+ `CANCELLATION_FEE` when kept) is written, the enrollment becomes `CANCELLED`, and the seat returns to the pool; the fee is a single decomposition (`fee = price − refund`) (`AD-11`).

- **CAP-10 — Admin class management**
  - **intent:** Priyanka creates, edits, and lists group classes with all their details.
  - **success:** Valid input persists a `SCHEDULED` GroupSession with price in cents; invalid input is rejected with field-level errors; capacity cannot drop below occupied seats (checked under the seat lock); concurrent admin edits are guarded by optimistic `updatedAt` (`AD-16`).

- **CAP-11 — Roster and attendance**
  - **intent:** Priyanka sees who is enrolled per class (paid vs pending) and marks attendance.
  - **success:** The roster lists each enrolled student with status in a token-styled table; an empty class shows an empty state; `ATTENDED`/`NO_SHOW` transitions go through `enrollment.ts`, the sole status writer (`AD-14`).

- **CAP-12 — Seat-confirmation email**
  - **intent:** On a seat becoming confirmed, the student is emailed the joining details.
  - **success:** A Resend email (native `fetch`) containing class, date/time, Meet link/location, and price is sent on confirmation via either the balance or webhook path; a send failure does not roll back the confirmed seat and is logged (`AD-13`).

- **CAP-13 — Seeded real data**
  - **intent:** The database ships with the real subjects, levels, Priyanka's admin account, and the six Test-3 classes.
  - **success:** After seeding, the portal shows the 6 real classes (2 Accounting, 2 Tax, 1 Auditing, 1 Management Accounting; 2-hour, R290, capacity 4–6); re-running the seed creates no duplicates.

- **CAP-14 — Late/orphan payment conserves money**
  - **intent:** A verified payment that arrives after the seat is already lost never oversells and never silently keeps the money.
  - **success:** A `charge.success` arriving after hold-expiry when the class is full credits the captured amount to the student's wallet balance (idempotent by `reference`), with no oversell and no loss (`AD-15`; epics Story 4.2 updated to match).

- **CAP-15 — Admin wallet credit**
  - **intent:** An admin credits a student's wallet with a chosen amount, so real balance exists to pay a seat from (goodwill credit, manual comp, offline top-up).
  - **success:** A positive `ADJUSTMENT` ledger row written via the single per-student-locked `wallet.mutate` (`AD-6`) increases the student's balance and appears in their ledger; an invalid amount is rejected; the balance-pay path (CAP-4) then works when balance ≥ price. *(Resolves the wallet-balance-origin gap; epics Story 3.5.)*

## Constraints

- **No-oversell is absolute.** All seat acquisition runs through one `reserveSeat()` in a single `Serializable` transaction (SSI is the guarantee; `GroupSession … FOR UPDATE` serialises writers) with bounded retry on `P2034`/`40001`; `enrollment.ts` is the **sole** writer of every enrollment status transition (`AD-4`, `AD-14`).
- **Money integrity.** All amounts are integer cents (no floats). The wallet is an append-only immutable ledger, balance = running sum, never negative, every mutation under a per-student lock via one `wallet.mutate`; exactly one `BOOKING_CHARGE` per confirmed enrollment, enforced by a partial unique index (`AD-6`, `AD-8`, `AD-9`).
- **Payment trust boundary.** The Paystack webhook verifies HMAC-SHA512 of the **raw** body, is idempotent by `Payment.reference` (insert-as-gate), runs `runtime = 'nodejs'`, and is the sole confirmer; the browser callback never confirms. External I/O uses native `fetch` — no axios/vendor SDK (`AD-7`, `AD-13`).
- **Additive isolation.** Portal and admin are route groups in the **same** Next app (`output: 'standalone'`, Coolify, base dir `/acce-nextjs`); marketing routes, SEO, and headers are untouched (headers only extended additively). All DB access goes through the `src/lib/db.ts` Prisma singleton (`AD-1`, `AD-2`).
- **CPA-compliant wallet.** Unused balance must remain redeemable — the ledger is designed so a balance can be paid back out even before a withdraw button ships; a late-cancellation fee is modelled as a distinct `CANCELLATION_FEE` service-fee event, not kept unspent money.
- **Accessibility floor on every new control.** Body text ≥ 4.5:1 / large ≥ 3:1 in both modes, keyboard-operable with a visible focus ring, ≥ 44px touch targets, honor `prefers-reduced-motion`; reuse the existing navy+gold tokens + shadcn primitives, no new palette (see `DESIGN.md`).
- **Operational floor.** Rate-limit the magic-link send and the webhook; emit structured logs + alerts on the money paths; keep Paystack test/live keys env-split; ensure DB backups for ledger auditability.

## Non-goals

- 1-on-1 booking, availability windows, the rate matrix, and R2 file uploads (Phase 1b).
- Package / top-up purchase UI (the wallet exists, fed by refunds; buying credit is later).
- Automatic Google-Meet generation — 1a uses a manual link field per class.
- Reminder emails and any expiry cron (lazy hold-expiry only in 1a).
- Content/video library, Q&A forum, and membership/recurring revenue (Phases 2–4).
- A Paystack **card-refund** adapter — `AD-15` conserves late/orphan payments to wallet balance instead.
- Cash-out / withdrawal UI (the ledger supports it; the button ships later).

## Success signal

On staging, a student books and pays for a seat in a real Test-3 class — from wallet balance or via Paystack — receives the confirmation email with the Meet link, and two browsers racing the last seat produce exactly one winner and one "class full"; Priyanka creates a class and sees the enrolled roster. The first real online paid seat, provably impossible to oversell.

## Assumptions

- The portal is one deployment with the marketing site (route groups + a subdomain host mapping), not a separate service.
- Lazy `PENDING`-hold expiry (no cron) is sufficient for the MVP; a belt-and-braces cron is deferred.
- Defaults are chosen and in-admin-editable: seat price R290/2hr; group cancellation tiers = the same as 1-on-1; delivery = a manual Google Meet link.

## Open Questions

- **Product decisions:** confirm the final per-seat price (R290 vs a R250–260 group discount) and whether group cancellation should be stricter than 1-on-1 given scarce seats. Defaults chosen; editable in-admin.

_Resolved since first draft: wallet-balance origin (readiness M1) → admin wallet-credit (CAP-15 / epics Story 3.5); late/orphan payment handling (`AD-15`) → epics Story 4.2 updated to credit wallet._
