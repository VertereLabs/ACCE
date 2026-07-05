# Phase 1a — Group Classes MVP — Implementation Plan

_Last updated: 2026-07-04 · Scope: STRATEGY.md §7 Phase 1a_

## Context

Group revision classes are ACCE Tutors' highest-value, simplest-to-build product (one tutor, 4–6 paid seats per fixed slot — see the Test 3 flyer). This plan ships a thin, correct slice that lets Priyanka publish classes and students pay for a seat online, **before** any 1-on-1 or membership work. Base is the existing marketing app `D:\Projects\ACCE - Copy\acce-nextjs` (Next.js 16.1.1, React 19, Tailwind 3.4, shadcn/Radix, Zod 4, RHF, TanStack Query, `output: 'standalone'`). Everything below is net-new — the app has no auth, DB, or payments yet.

## Goal (definition of done)

A student can log in, browse upcoming classes showing **spaces left**, pay for a seat (Paystack or wallet balance), and receive a confirmation with the class's Meet link/location. A **full class cannot oversell** under concurrent buyers. Priyanka can create/edit classes and see who's enrolled per class in an admin area. Cancellations refund to wallet per the policy tiers.

### In scope
Auth (magic link) · Prisma/Postgres · GroupSession + Enrollment + wallet ledger · class listing/detail/checkout · "my classes" · admin class CRUD + enrollment roster · Paystack one-off + webhook + no-oversell transaction · pending-hold on seat during payment · cancellation tiers → balance refund · confirmation email · seed the 6 Test-3 classes.

### Out of scope (later phases)
1-on-1 booking wizard, availability windows, rate matrix, R2 file uploads (1b) · package/top-up purchase UI (balance still exists, fed by refunds) · auto Google-Meet generation (MVP uses a manual link field) · reminder emails via cron · content/forum/membership (Phases 2–4).

---

## 1. Prerequisites — Phase 0 foundation (minimum to ship 1a)

| Item | File(s) | Notes |
|---|---|---|
| Prisma + Postgres | `prisma/schema.prisma`, `src/lib/db.ts` | Coolify Postgres. **Prisma singleton** (`src/lib/db.ts`) — never `new PrismaClient()` elsewhere (global lessons-learned rule). Use `@prisma/adapter-pg` + `pg.Pool` (house style). |
| Better Auth | `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/app/api/auth/[...all]/route.ts` | Magic-link plugin (passwordless student signup) + admin plugin for `role: STUDENT \| ADMIN`. Owns its own auth tables in the same schema. |
| Route groups + guards | `src/app/(portal)/layout.tsx`, `src/app/(admin)/layout.tsx` | Additive — flat marketing routes untouched. Portal layout = student guard; admin layout = ADMIN-only guard (redirect otherwise). Served under `portal.accetutors.co.za`. |
| Env | `.env.example` | See §7. |
| Seed | `prisma/seed.ts` | 4 subjects, levels (Undergrad, CTA/PGDA), Priyanka as ADMIN, and the **6 Test-3 classes** from the flyer. |

---

## 2. Data model (Prisma)

Add to `prisma/schema.prisma` (alongside Better Auth's tables). Group-class-only slice of STRATEGY §5:

```prisma
model Subject {   // seeded: Accounting, Management Accounting & Finance, Auditing, Tax
  id       String @id @default(cuid())
  name     String @unique
  sessions GroupSession[]
}

enum Mode { ONLINE IN_PERSON }
enum GroupSessionStatus { SCHEDULED CANCELLED COMPLETED }

model GroupSession {
  id          String   @id @default(cuid())
  subjectId   String
  subject     Subject  @relation(fields: [subjectId], references: [id])
  level       String   // "CTA/PGDA" etc. (string tag in 1a; Level model arrives with 1b)
  title       String
  description String?
  start       DateTime
  end         DateTime
  capacity    Int                       // 4–6
  priceCents  Int                       // R290 = 29000
  mode        Mode     @default(ONLINE)
  location    String?
  meetingUrl  String?                   // MANUAL in 1a; auto-gen deferred behind MeetingProvider
  status      GroupSessionStatus @default(SCHEDULED)
  enrollments Enrollment[]
  createdAt   DateTime @default(now())
}

enum EnrollmentStatus { PENDING CONFIRMED CANCELLED ATTENDED NO_SHOW }

model Enrollment {
  id             String   @id @default(cuid())
  studentId      String
  student        User     @relation(fields: [studentId], references: [id])
  groupSessionId String
  session        GroupSession @relation(fields: [groupSessionId], references: [id])
  priceCents     Int
  status         EnrollmentStatus @default(PENDING)
  pendingExpiresAt DateTime?               // hold during Paystack round-trip
  paymentRef     String?
  createdAt      DateTime @default(now())

  @@unique([studentId, groupSessionId])    // one seat per student per class
  @@index([groupSessionId, status])        // fast capacity count
}

enum LedgerType { PACKAGE_PURCHASE TOPUP BOOKING_CHARGE CANCELLATION_REFUND CANCELLATION_FEE WITHDRAWAL ADJUSTMENT }

model LedgerEntry {
  id               String   @id @default(cuid())
  studentId        String
  type             LedgerType
  amountCents      Int                  // signed
  balanceAfterCents Int
  enrollmentId     String?
  paymentRef       String?
  createdAt        DateTime @default(now())
  @@index([studentId, createdAt])
}

model Payment {                          // Paystack mirror, written by webhook (idempotency)
  id          String   @id @default(cuid())
  reference   String   @unique
  amountCents Int
  status      String
  type        String
  raw         Json
  createdAt   DateTime @default(now())
}
```

**Refinement vs STRATEGY §5:** `Enrollment.status` gains **`PENDING`** + `pendingExpiresAt` so a seat is held during the Paystack payment round-trip and can't be oversold or double-sold. Capacity = count of `PENDING`+`CONFIRMED`.

---

## 3. Core server logic (the correctness-critical part)

### 3.1 No-oversell seat reservation — `src/lib/enrollment.ts`
Single interactive transaction (`db.$transaction`, `Serializable`):
1. **Lock the session row:** raw `SELECT id FROM "GroupSession" WHERE id = $1 FOR UPDATE` — serialises concurrent buyers of the same class (a plain count can't lock the "gap").
2. Guard: session `SCHEDULED` and `start` in the future.
3. `count` enrollments where status ∈ (`PENDING`,`CONFIRMED`) — reject if `>= capacity` (**class full**).
4. Reject if this student already has a non-cancelled enrollment (also enforced by `@@unique`).
5. **Pay path:**
   - **balance ≥ price:** create `CONFIRMED` enrollment + `BOOKING_CHARGE` ledger row (balance deducted) — done, no Paystack.
   - **else:** create `PENDING` enrollment with `pendingExpiresAt = now + 15min`; return a Paystack init URL. Webhook confirms.
6. Expiry sweep: a `PENDING` past `pendingExpiresAt` is treated as free by the count and lazily flipped to `CANCELLED` (belt-and-braces cron later; lazy check is enough for MVP).

### 3.2 Payment confirm — `src/app/api/webhooks/paystack/route.ts`
- Verify `x-paystack-signature` (HMAC-SHA512 of raw body with secret). Reject bad sigs.
- **Idempotent:** upsert `Payment` by `reference`; if already processed, 200 and return.
- On `charge.success`: in a transaction, flip the matching `PENDING` enrollment → `CONFIRMED`, write `BOOKING_CHARGE` ledger, fire confirmation email. If the enrollment already expired/was released and the class since filled → auto-refund via Paystack and notify (edge case).

### 3.3 Wallet helper — `src/lib/wallet.ts`
`getBalance(studentId)` = sum of ledger amounts. `addEntry(tx, {...})` appends an immutable row and writes `balanceAfterCents`. All balance mutations go through this inside the caller's transaction.

### 3.4 Cancellation — `src/lib/enrollment.ts#cancel`
Server-enforced by hours-to-start (STRATEGY §6): ≥48h → 100%, 24–48h → 70% (`CANCELLATION_FEE` 30%), <24h/no-show → 0%. Refund goes to **wallet balance** (`CANCELLATION_REFUND`). Set enrollment `CANCELLED` → seat returns to pool. **Open:** group may warrant stricter tiers (see §8) — read tier config from a constant now, move to admin-config later.

### 3.5 Meetings — `src/lib/meeting.ts`
`MeetingProvider` interface with a `ManualProvider` for 1a (Priyanka pastes one Meet link per class into `meetingUrl`). Link revealed only to `CONFIRMED` students on the class detail + confirmation email. `GoogleMeetProvider` (Calendar API) slots in later with no call-site change.

---

## 4. Routes & pages

**Student — `src/app/(portal)/portal/`** (server components + server actions; TanStack Query for any client refetch)
- `classes/page.tsx` — upcoming `SCHEDULED` classes; each card: subject, date/time, price, **"N seats left"** (capacity − occupied), Book button. Reuses existing shadcn `Card`/`Badge` + design tokens.
- `classes/[id]/page.tsx` — detail + checkout: "Pay with balance" (if sufficient) or "Pay R290" → Paystack. Meet link/location shown once confirmed.
- `my-classes/page.tsx` — student's confirmed/upcoming enrollments + cancel button (shows refund % for the current tier).
- `wallet/page.tsx` — balance + ledger history (read-only in 1a).

**Admin — `src/app/(admin)/admin/`**
- `classes/page.tsx` + `classes/new` + `classes/[id]/edit` — GroupSession CRUD (subject, level, date/time, capacity, per-seat price, mode/location, meetingUrl) via server actions + Zod.
- `classes/[id]/page.tsx` — enrollment roster; mark `ATTENDED`/`NO_SHOW`; see paid/pending.

**API**
- `src/app/api/auth/[...all]/route.ts` — Better Auth handler.
- `src/app/api/checkout/enrollment/route.ts` — calls §3.1, returns Paystack init URL (or confirms via balance).
- `src/app/api/webhooks/paystack/route.ts` — §3.2. **Must read raw body** for signature verification (route segment config, no body parsing middleware).

---

## 5. Notifications — `src/lib/email.ts`
Resend (native `fetch`, no SDK bloat). **Seat-confirmation email** on `CONFIRMED` (class, date/time, Meet link/location, price). Reminder emails deferred (need a Coolify cron hitting a protected route — note for follow-up).

## 6. Payments client
`src/lib/paystack.ts` — server-side init (`fetch` to `https://api.paystack.co/transaction/initialize`, amount in kobo/cents, `reference`, callback URL) + signature verify helper. Test mode keys for dev.

## 7. Env (`.env.example`)
```
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=https://portal.accetutors.co.za
APP_URL=https://portal.accetutors.co.za
PAYSTACK_SECRET_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
RESEND_API_KEY=
EMAIL_FROM=ACCE Tutors <no-reply@accetutors.co.za>
```

---

## 8. Decisions needed before build (defaults chosen so it's executable now)
- **Seat price:** default **R290/2hr** (flyer). PG floated R250–R260 — editable in-admin regardless.
- **Group cancellation tiers:** default = same as 1-on-1. PG may want stricter (limited seats). Held in a constant; trivially swappable.
- **Delivery tool:** default **manual Google Meet link** per class in 1a.

## 9. Build order
1. Phase 0 foundation (§1): Prisma+Postgres, Better Auth magic-link+admin, route groups+guards, seed (incl. 6 Test-3 classes), deploy shell. **Verify login + admin guard before proceeding.**
2. Data model §2 + wallet §3.3 + migration.
3. Admin class CRUD (§4) — so real classes exist to test against.
4. Student listing + detail + **balance-pay path** end-to-end (no Paystack yet).
5. Paystack init + webhook + pending-hold + **no-oversell transaction** (§3.1–3.2) — the risky core.
6. Cancellation tiers + refund-to-balance (§3.4).
7. Confirmation email (§5). Roster attendance marking.
8. Polish: seats-left UI, empty states, error toasts (sonner already present).

## 10. Verification
- **Unit (Vitest):** no-oversell under concurrency (fire N+1 simultaneous reservations at an N-seat class → exactly N succeed); cancellation refund maths at each tier boundary (48h/24h); webhook idempotency (same reference twice → one charge); balance never goes negative.
- **Integration:** Paystack **test mode** — init → simulated `charge.success` webhook → enrollment `CONFIRMED`, ledger `BOOKING_CHARGE`, seats-left decrements, full class blocks further seats.
- **E2E smoke (Playwright):** every authenticated portal + admin route returns 200 (guards against the RSC 500 trap from lessons-learned); happy path book→pay→confirmed→see Meet link; admin creates a class and sees the enrollment.
- **Manual:** on staging, book the last seat from two browsers at once → one wins, one gets "class full".
