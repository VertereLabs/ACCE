---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments:
  - docs/PHASE-1A-PLAN.md
  - docs/architecture.md
  - docs/STRATEGY.md
  - _bmad-output/planning-artifacts/ux-designs/ux-ACCE-2026-07-05/DESIGN.md
---

# ACCE — Phase 1a (Group Classes MVP) — Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for **ACCE Phase 1a — Group Classes MVP**, decomposing the requirements from the Phase 1a plan (PRD + technical design combined), the current-state architecture, the strategy model, and the reused visual design system into implementable stories.

**Scope reminder (definition of done):** A student can log in (magic link), browse upcoming classes showing **spaces left**, pay for a seat (Paystack or wallet balance), and receive a confirmation with the class's Meet link/location. A **full class cannot oversell** under concurrent buyers. Priyanka can create/edit classes and see who's enrolled per class in an admin area. Cancellations refund to wallet per the policy tiers. Everything is net-new — the existing app has no auth, DB, or payments yet.

**Out of scope (later phases):** 1-on-1 booking wizard, availability windows, rate matrix, R2 uploads (1b); package/top-up purchase UI (balance still exists, fed by refunds); auto Google-Meet generation (MVP uses a manual link field); reminder emails via cron; content/forum/membership (Phases 2–4).

> **UX note:** The bmad-ux `EXPERIENCE.md` spine covers the **Stage 1 marketing redesign only** — the portal (auth/booking/payments) is Stage 2 and gets its own future EXPERIENCE pass. So Phase 1a has no dedicated portal interaction contract yet; the **DESIGN.md visual system** (navy+gold tokens, shadcn components, dark/light modes) is reused, and the UX Design Requirements below are derived from that visual reuse plus the plan's UI mentions (§4, §8).

## Requirements Inventory

### Functional Requirements

**Auth & access**
FR1: A student can sign up and log in passwordlessly via magic link (email); no password is stored.
FR2: The system supports two roles — `STUDENT` and `ADMIN`; Priyanka is seeded as `ADMIN`.
FR3: Portal routes are guarded to authenticated students; admin routes are guarded to `ADMIN` only, redirecting others. Existing flat marketing routes remain publicly accessible and untouched.

**Class discovery**
FR4: A student can browse a listing of upcoming `SCHEDULED` classes; each card shows subject, date/time, price, and **"N seats left"** (capacity − occupied) with a Book action.
FR5: A student can open a class detail page showing full class info and a checkout panel.
FR6: The class's Meet link (online) or location (in-person) is revealed **only** to students with a `CONFIRMED` enrollment for that class.

**Checkout & payment**
FR7: If the student's wallet balance ≥ price, they can pay from balance — the enrollment is created `CONFIRMED` immediately with a `BOOKING_CHARGE` ledger row, no Paystack round-trip.
FR8: If balance is insufficient, the student pays the seat price via a Paystack one-off charge; a `PENDING` enrollment holds the seat, and the webhook confirms it.
FR9: A seat is held (`PENDING` with `pendingExpiresAt = now + 15min`) during the Paystack round-trip; an expired pending seat is treated as free and lazily flipped to `CANCELLED`.
FR10: A full class **cannot oversell**, including under concurrent buyers of the same class (last-seat race → exactly one winner, others get "class full").
FR11: A student can hold at most one non-cancelled enrollment per class (one seat per student per class).

**My classes, wallet & cancellation**
FR12: A student can view "my classes" — their confirmed/upcoming enrollments — with a cancel action that shows the refund % for the current cancellation tier.
FR13: A student can cancel an enrollment; the refund is credited to **wallet balance** per the tier table, the seat returns to the pool, and the enrollment becomes `CANCELLED`.
FR14: Cancellation refund tiers are server-enforced by hours-to-start: ≥48h → 100%; 24–48h → 70% (30% `CANCELLATION_FEE`); <24h or no-show → 0%. Tiers are held in a constant (group variant swappable later).
FR15: A student can view a wallet page showing current balance and read-only ledger history.

**Admin**
FR16: An admin can create, edit, and list group classes (`GroupSession` CRUD): subject, level, title/description, date/time, capacity, per-seat price, mode (online/in-person), location, and manual `meetingUrl`.
FR17: An admin can view the enrollment roster for a class — who is enrolled, paid vs pending — and mark enrollments `ATTENDED` or `NO_SHOW`.

**Notifications**
FR18: On a seat becoming `CONFIRMED`, the system sends a seat-confirmation email containing class, date/time, Meet link/location, and price.

**Seed data**
FR19: The database is seeded with the 4 subjects (Accounting, Management Accounting & Finance, Auditing, Tax), levels (Undergrad, CTA/PGDA), Priyanka as `ADMIN`, and the **6 Test-3 classes** from the flyer (2 Accounting, 2 Tax, 1 Auditing, 1 Management Accounting; 2-hour, R290/seat, capacity 4–6).

### NonFunctional Requirements

NFR1: **No-oversell correctness** — seat reservation runs in a single interactive `Serializable` transaction that locks the session row (`SELECT … FOR UPDATE`) before counting `PENDING`+`CONFIRMED` enrollments against capacity, so concurrent last-seat buyers cannot oversell.
NFR2: **Webhook authenticity** — the Paystack webhook verifies `x-paystack-signature` (HMAC-SHA512 of the raw body with the secret) and rejects bad signatures; the route reads the **raw body** (no body-parsing middleware).
NFR3: **Webhook idempotency** — payment events are keyed by `reference` (upsert `Payment`); re-delivery of the same reference results in exactly one charge/confirmation.
NFR4: **Balance integrity** — wallet balance can never go negative; all balance mutations go through the wallet helper inside the caller's transaction, appending an immutable ledger row with `balanceAfterCents`.
NFR5: **Auditability** — ledger rows are immutable; balance is the running sum, retained for disputes and future cash-out (CPA: unused balance must remain redeemable — design the ledger so a balance can be paid back out even if a "withdraw" button ships later).
NFR6: **DB access** — PostgreSQL via Prisma using a single `src/lib/db.ts` singleton with `@prisma/adapter-pg` + `pg.Pool`; never instantiate `PrismaClient` elsewhere (global lessons-learned rule).
NFR7: **Deployment** — Next.js `output: 'standalone'` build deployable on Coolify Docker (base dir `/acce-nextjs`); Prisma generated client copied into the runner stage.
NFR8: **Additive isolation** — portal/admin route groups are additive; marketing routes and their SEO/headers remain unchanged. Portal served under `portal.accetutors.co.za`.
NFR9: **No new HTTP client** — use native `fetch()` for Paystack and Resend; no axios/SDK bloat (supply-chain lesson).
NFR10: **Accessibility floor (portal screens)** — body text ≥ 4.5:1 / large display ≥ 3:1 contrast in both modes; every interactive control keyboard-operable with a visible focus ring; ≥44px touch targets on mobile; honor `prefers-reduced-motion`.
NFR11: **Security headers** — existing global CSP/HSTS/X-Frame-Options etc. continue to apply to portal routes.

### Additional Requirements

- **Phase 0 foundation is a prerequisite:** Prisma+Postgres, Better Auth (magic-link + admin plugin owning its own auth tables), route groups + guards, seed, and a deployable shell must exist and be verified (login + admin guard) before feature work. (Plan §1, §9.1)
- **Better Auth** provides the magic-link plugin (passwordless signup) and admin plugin (`role: STUDENT | ADMIN`) — `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/app/api/auth/[...all]/route.ts`.
- **Env** (`.env.example`): `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `APP_URL`, `PAYSTACK_SECRET_KEY`, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`.
- **Paystack client** (`src/lib/paystack.ts`): server-side init (`fetch` → `transaction/initialize`, amount in cents, reference, callback URL) + signature-verify helper; test-mode keys for dev.
- **Email** (`src/lib/email.ts`): Resend via native `fetch`. Reminder emails deferred (need a Coolify cron hitting a protected route — follow-up).
- **MeetingProvider abstraction** (`src/lib/meeting.ts`): `MeetingProvider` interface + `ManualProvider` for 1a (Priyanka pastes one Meet link per class); `GoogleMeetProvider` slots in later with no call-site change.
- **Prisma data model** (plan §2): `Subject`, `GroupSession` (+`Mode`, `GroupSessionStatus` enums), `Enrollment` (+`EnrollmentStatus`, with `PENDING`/`pendingExpiresAt`, `@@unique([studentId, groupSessionId])`, `@@index([groupSessionId, status])`), `LedgerEntry` (+`LedgerType`), `Payment` (unique `reference`, idempotency mirror).
- **Core server modules:** `src/lib/enrollment.ts` (reserve + cancel), `src/lib/wallet.ts` (`getBalance`, `addEntry`), `src/app/api/checkout/enrollment/route.ts`, `src/app/api/webhooks/paystack/route.ts`.
- **Decision defaults (executable now, editable in-admin):** seat price R290/2hr; group cancellation tiers = same as 1-on-1 (held in a constant); delivery = manual Google Meet link per class.

### UX Design Requirements

> Derived from **DESIGN.md** (visual system reused by the portal) plus the plan's UI mentions. A full portal EXPERIENCE spine is deferred to Stage 2; these cover the visual/interaction floor for the new portal + admin screens.

UX-DR1: Portal and admin screens inherit the existing **navy+gold token system** (`globals.css` HSL CSS-variable tokens), including the two-mode theme (dark default "Deep Authority" / light "Warm Scholar") — no new palette; only reuse.
UX-DR2: Class listing and detail reuse shadcn **`Card`** + **`Badge`** primitives and the design-token button variants (primary / accent-gold CTA / ghost); one gold accent CTA per view group.
UX-DR3: Each class card shows a **"N seats left"** indicator (capacity − occupied) as a Badge; a full class shows a clear "Class full" state rather than a dead Book button.
UX-DR4: Portal screens provide **empty states** (no upcoming classes, no enrollments, empty ledger) and **confirmed-seat state** (Meet link/location panel visible only when `CONFIRMED`).
UX-DR5: Client actions (book, pay, cancel) surface success/error feedback via **sonner toasts** (already mounted in the app).
UX-DR6: The **accessibility floor** (NFR10) applies to every new portal/admin control — keyboard operability, visible focus ring, ≥44px targets, contrast in both modes, reduced-motion honored.
UX-DR7: The theme-aware **logo variant swap** (reversed on dark surfaces, standard on light) and navbar **theme toggle** carry into the portal shell.
UX-DR8: The admin **enrollment roster** presents paid vs pending status and attended/no-show controls in a readable table using the same card/token system.

### FR Coverage Map

FR1: Epic 1 — Magic-link passwordless signup/login
FR2: Epic 1 — STUDENT/ADMIN roles; Priyanka seeded ADMIN
FR3: Epic 1 — Portal + admin route guards; marketing untouched
FR4: Epic 3 — Class listing with "N seats left"
FR5: Epic 3 — Class detail + checkout page
FR6: Epic 3 — Meet link/location revealed only to CONFIRMED
FR7: Epic 3 — Pay from wallet balance → instant CONFIRMED
FR8: Epic 4 — Paystack one-off charge for insufficient balance
FR9: Epic 4 — 15-min pending seat hold + expiry release
FR10: Epic 4 — No-oversell under concurrent buyers
FR11: Epic 3 — One seat per student per class
FR12: Epic 5 — My-classes + cancel with tier refund % shown
FR13: Epic 5 — Cancel → refund to wallet, seat returns to pool
FR14: Epic 5 — Server-enforced cancellation tiers (group variant)
FR15: Epic 3 — Wallet page: balance + read-only ledger
FR16: Epic 2 — Admin GroupSession CRUD
FR17: Epic 6 — Admin enrollment roster + attended/no-show
FR18: Epic 6 — Seat-confirmation email on CONFIRMED
FR19: Epic 1 — Seed subjects, levels, Priyanka ADMIN, 6 Test-3 classes

## Epic List

### Epic 1: Foundation, Auth & Seeded Data
A student can sign up / log in via magic link and land in the portal; Priyanka can reach an ADMIN-only admin area; the app runs on Postgres/Coolify with the full data model migrated and seeded (4 subjects, levels, Priyanka as ADMIN, the 6 Test-3 classes). Delivers real login + guards + real data to build against.
**FRs covered:** FR1, FR2, FR3, FR19
_(Phase 0: Prisma singleton + adapter-pg, Better Auth magic-link+admin, `(portal)`/`(admin)` route groups + guards, env, full §2 schema in one migration, seed, deploy shell, E2E route-200 smoke.)_

### Epic 2: Admin Class Management
Priyanka can create, edit, and list group classes (subject, level, date/time, capacity, per-seat price, mode/location, manual Meet link) — so real, sellable classes exist.
**FRs covered:** FR16

### Epic 3: Browse & Enroll with Wallet Balance
A student browses upcoming classes with "N seats left", opens a detail/checkout page, and pays for a seat from wallet balance — confirmed instantly, Meet link/location revealed, ledger updated. Deliberate risk checkpoint: the full enroll flow end-to-end before Paystack.
**FRs covered:** FR4, FR5, FR6, FR7, FR11, FR15

### Epic 4: Online Payment & Guaranteed Seats
A student without enough balance pays the seat price via Paystack; the seat is held during payment and confirmed by a verified, idempotent webhook; a full class cannot oversell under concurrent buyers. Isolated as the plan's explicit risk boundary (§9.5).
**FRs covered:** FR8, FR9, FR10 _(NFR1 no-oversell, NFR2 signature verify, NFR3 idempotency)_

### Epic 5: Cancellations & Refunds to Wallet
A student cancels an enrolled seat, sees the refund % for the current tier, gets the tiered refund credited to wallet balance, and the seat returns to the pool.
**FRs covered:** FR12, FR13, FR14

### Epic 6: Class-Day Operations (Roster, Attendance & Confirmation Email)
Priyanka sees who's enrolled per class (paid vs pending) and marks attended/no-show; students receive a seat-confirmation email (class, time, Meet link/location, price) on confirmation. Folds in final polish (seats-left UI, empty states, error toasts) and wires the notification + MeetingProvider layer into the now-stable confirm points.
**FRs covered:** FR17, FR18

---

## Epic 1: Foundation, Auth & Seeded Data

A student can sign up / log in via magic link and land in the portal; Priyanka can reach an ADMIN-only admin area; the app runs on Postgres/Coolify with the full data model migrated and seeded. Delivers real login + guards + real data to build every later epic against. Covers FR1, FR2, FR3, FR19 and the Phase 0 additional requirements (Prisma singleton, Better Auth, route groups, env, deploy shell) plus NFR6, NFR7, NFR8, NFR11.

### Story 1.1: Database & Prisma foundation

As a developer,
I want the portal wired to Postgres through a single Prisma client with the full Phase 1a schema migrated,
So that every later story has a correct, shared data layer to build on.

**Acceptance Criteria:**

**Given** the app has no database today
**When** the foundation is set up
**Then** `src/lib/db.ts` exports a single Prisma client instance built with `@prisma/adapter-pg` + `pg.Pool`
**And** no other module instantiates `new PrismaClient()` (house singleton rule)
**And** `DATABASE_URL` is read from env and documented in `.env.example`.

**Given** the Prisma schema defines `Subject`, `GroupSession` (+`Mode`, `GroupSessionStatus`), `Enrollment` (+`EnrollmentStatus`, `pendingExpiresAt`, `@@unique([studentId, groupSessionId])`, `@@index([groupSessionId, status])`), `LedgerEntry` (+`LedgerType`), and `Payment` (unique `reference`) per plan §2
**When** the initial migration is run against the Coolify Postgres instance
**Then** all tables, enums, unique constraints, and indexes are created successfully
**And** `prisma generate` produces the client and it is copied into the Docker runner stage.

### Story 1.2: Passwordless student signup & login (magic link)

As a prospective student,
I want to sign in by entering my email and clicking a magic link,
So that I can access the portal without creating or remembering a password.

**Acceptance Criteria:**

**Given** Better Auth is configured with the magic-link plugin and owns its auth tables in the same schema
**When** a visitor submits their email on the sign-in page
**Then** a magic-link email is sent (via Resend) and no password is ever requested or stored.

**Given** a valid, unexpired magic link
**When** the visitor clicks it
**Then** a session is established and they are redirected into the portal.

**Given** an expired or already-used magic link
**When** it is clicked
**Then** sign-in is refused with a clear message and no session is created.

### Story 1.3: Roles and guarded portal / admin route groups

As the site owner,
I want student and admin areas protected by role while the marketing site stays public,
So that only authenticated students reach the portal and only Priyanka reaches admin.

**Acceptance Criteria:**

**Given** the Better Auth admin plugin assigns `role: STUDENT | ADMIN`
**When** the `(portal)` and `(admin)` route groups are added
**Then** the existing flat marketing routes and their SEO/headers are unchanged and remain publicly accessible.

**Given** an unauthenticated visitor
**When** they request any `(portal)` route
**Then** they are redirected to sign-in.

**Given** an authenticated non-admin student
**When** they request any `(admin)` route
**Then** they are redirected away (no admin content leaks).

**Given** the portal shell renders
**Then** it reuses the existing navy+gold design tokens, the theme-aware logo swap, the dark/light theme toggle, and meets the accessibility floor (keyboard-operable controls, visible focus ring, ≥44px targets, both-mode contrast). _(UX-DR1, UX-DR6, UX-DR7)_

### Story 1.4: Seed subjects, levels, Priyanka and the 6 Test-3 classes

As Priyanka,
I want the database seeded with the real subjects, levels, my admin account, and the 6 Test-3 classes,
So that the portal shows real, sellable classes from day one.

**Acceptance Criteria:**

**Given** an empty database after migration
**When** `prisma/seed.ts` runs
**Then** the 4 subjects (Accounting, Management Accounting & Finance, Auditing, Tax) and levels (Undergrad, CTA/PGDA) exist
**And** Priyanka exists as an `ADMIN` user
**And** the 6 Test-3 classes (2 Accounting, 2 Tax, 1 Auditing, 1 Management Accounting; 2-hour, R290/seat, capacity 4–6) exist as `SCHEDULED` `GroupSession` rows.

**Given** the seed is run a second time
**When** it completes
**Then** it does not create duplicate subjects, levels, admin, or classes (idempotent seed).

### Story 1.5: Deployable shell with authenticated route-200 smoke test

As the operator,
I want the portal to build standalone and deploy on the subdomain with a smoke test over every authenticated route,
So that a broken guard or RSC 500 is caught before it reaches users.

**Acceptance Criteria:**

**Given** `output: 'standalone'` and the Coolify base dir `/acce-nextjs`
**When** the image is built and deployed
**Then** the portal is served under `portal.accetutors.co.za` and the existing security headers (CSP/HSTS/etc.) apply to portal routes.

**Given** a Playwright smoke suite
**When** it visits every authenticated portal and admin route as the appropriate role
**Then** each route returns HTTP 200 (guarding against the RSC non-children-prop 500 trap from lessons-learned).

---

## Epic 2: Admin Class Management

Priyanka can create, edit, and list group classes so real, sellable classes exist. Covers FR16.

### Story 2.1: Create a group class

As Priyanka,
I want to create a class with all its details,
So that students have a real seat to buy.

**Acceptance Criteria:**

**Given** I am an authenticated ADMIN on the admin "new class" form
**When** I enter subject, level, title, description, start/end, capacity (4–6), per-seat price, mode (online/in-person), location (if in-person), and a manual Meet link (if online) and submit
**Then** the input is validated with Zod via a server action and a `SCHEDULED` `GroupSession` is persisted with `priceCents` stored in cents.

**Given** invalid input (e.g. end before start, capacity < 1, missing required field)
**When** I submit
**Then** the class is not created and field-level validation errors are shown.

### Story 2.2: List and view classes in admin

As Priyanka,
I want a list of all my classes with their key facts,
So that I can see what's scheduled and pick one to manage.

**Acceptance Criteria:**

**Given** classes exist
**When** I open the admin classes index
**Then** I see each class with subject, date/time, capacity, occupied/seats-left, per-seat price, mode, and status.

**Given** no classes exist yet
**When** I open the index
**Then** I see a clear empty state with a call to create the first class.

### Story 2.3: Edit an existing class

As Priyanka,
I want to edit a class's details,
So that I can fix a time, adjust the price, or paste the Meet link after scheduling.

**Acceptance Criteria:**

**Given** an existing class
**When** I open its edit form, change fields (including per-seat price and `meetingUrl`), and submit
**Then** the changes are validated and saved to the same `GroupSession`.

**Given** I lower capacity below the number of already-occupied seats
**When** I submit
**Then** the change is rejected with a clear message (capacity cannot drop below occupied seats).

---

## Epic 3: Browse & Enroll with Wallet Balance

A student browses upcoming classes with seats-left, opens a detail/checkout page, and pays for a seat from wallet balance — confirmed instantly, Meet link revealed, ledger updated. The full enroll flow end-to-end before Paystack. Covers FR4, FR5, FR6, FR7, FR11, FR15 and NFR4.

### Story 3.1: View wallet balance and ledger

As a student,
I want to see my wallet balance and a history of entries,
So that I understand what I can spend and where my credit came from.

**Acceptance Criteria:**

**Given** `src/lib/wallet.ts` provides `getBalance(studentId)` (sum of ledger amounts) and `addEntry(tx, …)` appending an immutable row with `balanceAfterCents`
**When** I open the wallet page
**Then** I see my current balance and a read-only, chronological ledger list.

**Given** I have no ledger entries
**When** I open the wallet page
**Then** my balance shows R0.00 and an empty-state message is displayed.

**Given** any balance mutation
**When** it is written
**Then** it goes through `addEntry` inside the caller's transaction and can never drive the balance negative. _(NFR4)_

### Story 3.2: Browse upcoming classes with seats-left

As a student,
I want a list of upcoming classes showing how many seats are left,
So that I can pick one before it fills.

**Acceptance Criteria:**

**Given** `SCHEDULED` classes with a future start
**When** I open the portal classes listing
**Then** each card shows subject, date/time, per-seat price, and "N seats left" where N = capacity − (PENDING + CONFIRMED enrollments), using shadcn Card/Badge and the design tokens. _(UX-DR2, UX-DR3)_

**Given** a class where occupied ≥ capacity
**When** it renders
**Then** it shows a "Class full" state instead of an active Book action. _(UX-DR3)_

**Given** no upcoming classes
**When** I open the listing
**Then** I see a clear empty state. _(UX-DR4)_

### Story 3.3: Class detail and checkout page

As a student,
I want a class detail page with a checkout panel,
So that I can review the class and choose how to pay.

**Acceptance Criteria:**

**Given** a class
**When** I open its detail page
**Then** I see full class info and a checkout panel offering "Pay with balance" when my balance is sufficient (the Paystack option arrives in Epic 4).

**Given** I do not have a `CONFIRMED` enrollment for this class
**When** I view the detail page
**Then** the Meet link / location is hidden. _(FR6)_

**Given** I have a `CONFIRMED` enrollment for this class
**When** I view the detail page
**Then** the Meet link (online) or location (in-person) is revealed. _(FR6)_

### Story 3.4: Reserve and pay a seat from wallet balance

As a student with enough balance,
I want to buy a seat instantly from my balance,
So that I'm confirmed without an external payment step.

**Acceptance Criteria:**

**Given** the reservation runs in a transaction that locks the session row (`SELECT … FOR UPDATE`), guards `status = SCHEDULED` and future `start`, and counts PENDING+CONFIRMED < capacity
**When** I book a class where my balance ≥ price
**Then** a `CONFIRMED` enrollment is created with a `BOOKING_CHARGE` ledger row deducting the price, and the class's seats-left decrements by one.

**Given** I already hold a non-cancelled enrollment for the class
**When** I try to book it again
**Then** the second attempt is rejected (enforced by the reservation check and the `@@unique([studentId, groupSessionId])` constraint). _(FR11)_

**Given** the class is already full
**When** I try to book from balance
**Then** the reservation is rejected with a "class full" result and no ledger row is written.

**Given** a booking succeeds or fails
**When** the action returns
**Then** a success or error toast is shown. _(UX-DR5)_

---

## Epic 4: Online Payment & Guaranteed Seats

A student without enough balance pays via Paystack; the seat is held during payment and confirmed by a verified, idempotent webhook; a full class cannot oversell under concurrent buyers. The plan's explicit risk boundary. Covers FR8, FR9, FR10 and NFR1, NFR2, NFR3, NFR9.

### Story 4.1: Paystack init with a 15-minute pending seat hold

As a student without enough balance,
I want to pay the seat price online and have my seat held while I pay,
So that the seat isn't sold from under me mid-payment.

**Acceptance Criteria:**

**Given** my balance < price
**When** I check out
**Then** a `PENDING` enrollment is created with `pendingExpiresAt = now + 15min` and a unique `paymentRef`, and `src/lib/paystack.ts` returns a Paystack initialize URL (amount in cents, reference, callback URL) using native `fetch`. _(FR8, FR9, NFR9)_

**Given** a `PENDING` enrollment whose `pendingExpiresAt` has passed
**When** seats-left is computed or the seat is next touched
**Then** it is treated as free (not counted) and lazily flipped to `CANCELLED`. _(FR9)_

**Given** the pending-hold consumes the last seat
**When** another student views the class
**Then** it shows as full until the hold confirms or expires.

### Story 4.2: Verified, idempotent payment webhook confirms the seat

As a student who paid,
I want my payment to reliably confirm my seat exactly once,
So that I'm enrolled and never double-charged.

**Acceptance Criteria:**

**Given** the webhook route reads the raw request body
**When** a Paystack event arrives
**Then** its `x-paystack-signature` is verified as HMAC-SHA512 of the raw body with the secret, and an invalid signature is rejected. _(NFR2)_

**Given** a `charge.success` event
**When** it is processed
**Then** `Payment` is upserted by `reference`; if that reference was already processed the handler returns 200 without a second charge (idempotent); otherwise, in a transaction, the matching `PENDING` enrollment flips to `CONFIRMED` and a `BOOKING_CHARGE` ledger row is written. _(FR8, NFR3)_

**Given** the enrollment already expired/was released and the class has since filled
**When** the successful charge arrives
**Then** the payment is auto-refunded via Paystack and the student is notified (edge case).

### Story 4.3: No-oversell under concurrent buyers

As Priyanka,
I want a full class to be impossible to oversell even when several students buy the last seat at once,
So that I never have more enrolled students than seats.

**Acceptance Criteria:**

**Given** the reservation transaction is `Serializable` and locks the session row with `SELECT … FOR UPDATE` before counting PENDING+CONFIRMED against capacity, across both the balance and Paystack paths
**When** N+1 reservations are fired simultaneously at an N-seat class (Vitest)
**Then** exactly N succeed and the rest receive "class full". _(FR10, NFR1)_

**Given** the last seat of a class
**When** two browsers attempt to buy it at the same time on staging
**Then** one wins and the other gets "class full" (manual verification).

---

## Epic 5: Cancellations & Refunds to Wallet

A student cancels an enrolled seat, sees the refund % for the current tier, gets the tiered refund credited to wallet balance, and the seat returns to the pool. Covers FR12, FR13, FR14.

### Story 5.1: My classes with cancel and refund-tier preview

As a student,
I want to see my upcoming classes and what I'd get back if I cancel now,
So that I can make an informed cancellation decision.

**Acceptance Criteria:**

**Given** I have confirmed/upcoming enrollments
**When** I open "my classes"
**Then** I see each with its class details and a cancel action.

**Given** an enrollment I might cancel
**When** I view its cancel action
**Then** it shows the refund % for the current tier based on hours-to-start (≥48h → 100%, 24–48h → 70%, <24h → 0%). _(FR12)_

**Given** I have no enrollments
**When** I open "my classes"
**Then** I see a clear empty state. _(UX-DR4)_

### Story 5.2: Cancel enrollment → tiered refund to wallet, seat returns to pool

As a student,
I want cancelling to refund the correct amount to my wallet and free my seat,
So that I'm treated fairly and someone else can take the spot.

**Acceptance Criteria:**

**Given** the group cancellation tiers are held in a constant (≥48h → 100%; 24–48h → 70% with a 30% `CANCELLATION_FEE`; <24h/no-show → 0%)
**When** I cancel an enrollment
**Then** the refund percentage is computed server-side from hours-to-start, a `CANCELLATION_REFUND` ledger row credits my balance (and a `CANCELLATION_FEE` row records any kept portion), and the enrollment is set to `CANCELLED`. _(FR13, FR14)_

**Given** my seat is cancelled
**When** the class's seats-left is next computed
**Then** the freed seat returns to the pool (spaces-left goes up by one). _(FR13)_

**Given** a refund is credited
**When** I open my wallet
**Then** the ledger shows the `CANCELLATION_REFUND` (and any `CANCELLATION_FEE`) entry and the updated balance.

---

## Epic 6: Class-Day Operations (Roster, Attendance & Confirmation Email)

Priyanka sees who's enrolled per class and marks attendance; students get a confirmation email on enrollment. Final portal polish. Covers FR17, FR18 and NFR10, plus UX-DR3/4/5/8.

### Story 6.1: Enrollment roster with paid / pending status

As Priyanka,
I want to see who's enrolled in a class and whether they've paid,
So that I know who to expect and who's still mid-payment.

**Acceptance Criteria:**

**Given** a class with enrollments
**When** I open its admin detail/roster page
**Then** I see each enrolled student with their status — paid (`CONFIRMED`) vs pending — in a readable table using the design tokens. _(FR17, UX-DR8)_

**Given** a class with no enrollments
**When** I open the roster
**Then** I see a clear empty state.

### Story 6.2: Mark attended / no-show

As Priyanka,
I want to mark each student attended or no-show after a class,
So that attendance is recorded (and no-show ties into cancellation policy).

**Acceptance Criteria:**

**Given** a `CONFIRMED` enrollment on the roster
**When** I mark it `ATTENDED` or `NO_SHOW`
**Then** the enrollment status is updated and reflected on the roster.

### Story 6.3: Seat-confirmation email on confirmation

As a student,
I want an email confirming my seat with the joining details,
So that I have the class time and Meet link/location saved.

**Acceptance Criteria:**

**Given** `src/lib/email.ts` sends via Resend using native `fetch` and `src/lib/meeting.ts` exposes a `MeetingProvider` with a `ManualProvider`
**When** an enrollment becomes `CONFIRMED` (via balance-pay in Epic 3 or the webhook in Epic 4)
**Then** a seat-confirmation email is sent containing the class, date/time, Meet link (online) or location (in-person), and price. _(FR18)_

**Given** the email fails to send
**When** confirmation has already happened
**Then** the enrollment stays `CONFIRMED` (email failure does not roll back the seat) and the failure is logged.

### Story 6.4: Portal polish — seats-left states, empty states, error toasts

As a student,
I want the portal to communicate state clearly,
So that full classes, empty lists, and errors never look broken.

**Acceptance Criteria:**

**Given** the portal screens
**When** a class is full, a list is empty, or an action errors
**Then** a "Class full" state, an empty state, and a sonner error toast (respectively) are shown consistently. _(UX-DR3, UX-DR4, UX-DR5)_

**Given** any new portal/admin control
**When** it is used
**Then** it meets the accessibility floor — keyboard-operable, visible focus ring, ≥44px touch target, and both-mode contrast. _(NFR10, UX-DR6)_
