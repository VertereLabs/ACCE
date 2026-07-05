# ACCE Portal — Strategy & Model

_Last updated: 2026-07-04_

## 1. Context

**ACCE Tutors** is a South African accounting exam-prep tutoring business (CA(SA) / CTA / PGDA / undergraduate), with **Priyanka as the sole tutor**. Today it runs off a Next.js 16 marketing site (`accetutors.co.za`, standalone output on Coolify, Tailwind + shadcn/Radix, React 19), with free IFRS PDF guides as SEO lead magnets and all conversion happening manually over WhatsApp (+27 71 325 5295).

The portal turns that manual funnel into a product with **two distinct revenue engines**: paid bookings (now) and a freemium membership (later).

## 2. The monetization model

Three revenue engines — deliberately not conflated:

### 2a. Transactional — paid group classes (near-term, HIGHEST priority)
_Added 2026-07-04 after the "Test 3 Prep" push (see flyer + PG conversation)._ Priyanka's own students asked for these ("they like to feel they're not alone"), and the maths is the strongest of any engine: **one tutor, many paying seats in the same slot**. The current Test 3 batch is **6 classes** (2 Accounting, 2 Tax, 1 Auditing, 1 Management Accounting), each a **fixed 2-hour event**, **R290/seat**, **capacity 4–6**. At 6 seats that's ~R1,500 for a 2-hour block vs R290 for a 1.5-hour 1-on-1 — this is where the money is, and it's **simpler to build** than 1-on-1 (fixed price, fixed time, no slot-fragmentation logic — just seats against a capacity).

- **Full payment upfront** to claim a seat (scarcity is real — "SPACES ARE LIMITED", 4–6 cap).
- Priyanka schedules a **fixed set of classes** (date, time, subject, capacity, price); students buy a **seat**.
- One shared Meet link (online) or one location (in-person) per class; one lesson plan + notes for the room.
- Same wallet/payment/cancellation machinery as 1-on-1 (§4, §6) — a seat purchase is just a `BOOKING_CHARGE` against a `GroupSession` instead of a private slot.
- **Pricing note (open):** landed at **R290/2hr/seat** on the flyer; conversation floated R250–R260 as a "group discount". Held at R290 for now — Priyanka edits per-class price in-admin, so this isn't hard-coded.
- **Ties into Phase 2:** Luke flagged recording these classes → feeds the future video-walkthrough library.

### 2b. Transactional — paid 1-on-1 bookings (near-term, proven)
The original reason the portal exists: **take payment upfront to eliminate no-shows** and automate scheduling. Priyanka already charges per session (R290/1.5hr); the portal just formalises it. Group classes take priority to build, but 1-on-1 stays — some students will do both, and the variable-price wallet logic is shared.

- **Full payment upfront** at booking time.
- **Prepaid packages** are the discount lever: buy R-value of credit, receive a bonus (e.g. pay R1,800 → R2,000 balance). See wallet model (§4).

### 2c. Subscription — freemium membership (longer-term, recurring)
**Do not sell "videos."** Content is copyable and we've chosen not to fight sharing — free guides/practice questions stay as top-of-funnel lead magnets. The recurring value that justifies a subscription is **ongoing support**:

- **Free tier:** guides + sample practice questions + *read* the forum.
- **Premium tier (~R99–R199/mo, model still being finalised):** full video-walkthrough library + full question bank + *post & get answered* in the forum + **a discounted session rate**.

The discounted-session perk is what makes the sub pay for itself — it drives bookings (engine 2a). Add a discounted annual option later (GoStudent-style).

## 3. Tech stack

Fits the existing app and Luke's Coolify/Prisma house style.

| Concern | Choice | Notes |
|---|---|---|
| App | **Same Next.js 16 codebase**, `(portal)` route group / `portal.accetutors.co.za` | Shares design system; marketing pages stay fast/SEO under their own layout. App is already `output: 'standalone'` (real Node server), so dynamic routes + API are fine. |
| DB | **PostgreSQL + Prisma** (Coolify) | Prisma singleton pattern. |
| Auth | **Better Auth** (not NextAuth) | As of Sep 2025 the Auth.js team joined Better Auth; Auth.js is security-patch-only and its maintainers direct new projects to Better Auth. TS-first, owns its Prisma schema, ships **magic-link** (passwordless student signup) + **admin/RBAC plugin** (STUDENT/ADMIN) out of the box. |
| Payments | **Paystack** | Best SA option for our needs: clean API, native one-off charges (bookings) **and** Subscriptions/Plans (membership) in one integration, same-day payouts, ~2.9% + R1.50. Yoco has no recurring API. PayFast (cheaper instant-EFT ~2%) can be added later as a secondary EFT option. |
| File storage | **Cloudflare R2** (S3-compatible) | Student work uploads (and video later). Zero egress fees. Signed upload URLs, files scoped per-student. |
| Meetings | **Google Meet via Calendar API** behind a `MeetingProvider` interface | Free, clean; auto-generates a Meet link on confirmation and drops it on Priyanka's calendar. Swappable to **Teams** (Microsoft Graph) if needed — she is not on Zoom. In-person bookings carry a location instead. |

## 4. The wallet (core structural decision)

Variable pricing (level × length) **+** percentage refunds (100/70/0%) mean whole-session "credit tokens" don't work — you can't refund 70% of a token. So money is a **ZAR balance ledger**:

- **Package purchase / top-up** → credit added.
- **Booking** → that session's computed price deducted (`BOOKING_CHARGE`).
- **Cancellation** → a percentage refunded (`CANCELLATION_REFUND`) and the kept portion recorded separately (`CANCELLATION_FEE`).
- Every entry is an **immutable ledger row**; balance = running sum. Auditable for disputes and future cash-outs.

### Legal note — cash-out (SA Consumer Protection Act)
Prepaid value generally **cannot be silently forfeited**; unused credit typically must remain redeemable (voucher validity ~3 years). **Not legal advice — verify with someone who knows the CPA before launch.** Design for compliance:

- **Unused balance never spent → refundable.** Build the ledger so a balance _can_ be paid back out (Paystack refunds/transfers), even if the "withdraw" button ships later.
- **Late-cancellation fee kept → legitimate service fee** (a reserved slot was consumed), modelled as a distinct `CANCELLATION_FEE` event. This is _not_ "keeping unspent money," which keeps us on solid ground.

## 5. Data model (Prisma sketch)

**Identity & config**
- `User` — id, email, name, `role: STUDENT | ADMIN`, defaultLevel. (Better Auth owns auth tables; role via admin plugin.)
- `Subject` — the 4, seeded: Accounting, Management Accounting & Finance, Auditing, Tax. **Price-neutral tag** on a booking.
- `Level` — Undergrad, CTA/PGDA (extensible).
- `Rate` — (level, durationMinutes, priceCents). The **matrix Priyanka edits in-admin** (no deploy). Price = `f(level, duration)`; subject does not affect price.
- `Package` — (name, priceCents, creditCents) — the bonus-credit lever.

**Money**
- `LedgerEntry` — (studentId, `type`, amountCents _signed_, balanceAfterCents, bookingId?, paymentRef?, createdAt).
  Types: `PACKAGE_PURCHASE`, `TOPUP`, `BOOKING_CHARGE`, `CANCELLATION_REFUND`, `CANCELLATION_FEE`, `WITHDRAWAL`, `ADJUSTMENT`.
- `Payment` — Paystack mirror: (reference, amountCents, status, type, raw). Written by webhook.

**Group classes (fixed events, many seats)**
- `GroupSession` — (subjectId, level, title, description, start, end, capacity, priceCents, `mode: ONLINE | IN_PERSON`, location?, meetingUrl?, `status: SCHEDULED | CANCELLED | COMPLETED`). A **fixed event** Priyanka creates (e.g. the 6 Test-3 classes). One shared Meet link / location for the room. `priceCents` is per-seat and editable in-admin.
- `Enrollment` — (studentId, groupSessionId, priceCents, `status: CONFIRMED | CANCELLED | ATTENDED | NO_SHOW`, paymentRef, createdAt). One seat = one row. **Unique (studentId, groupSessionId)** (no double-booking a seat). Booking is gated on `COUNT(confirmed enrollments) < capacity` — enforced in a transaction so the last seat can't oversell. A seat purchase writes a `BOOKING_CHARGE` ledger row exactly like a 1-on-1 booking.

**1-on-1 booking**
- `AvailabilityWindow` — (start, end, `mode: ONLINE | IN_PERSON`, location?, notes?). A **container** Priyanka opens — not pre-cut slots (session lengths vary).
- `Booking` — (studentId, windowId, subjectId, level, durationMinutes, start, end, priceCents, mode, location?, meetingUrl?, problemText, `status: PENDING | CONFIRMED | CANCELLED | COMPLETED | NO_SHOW`, pendingExpiresAt, paymentRef). Start/end sit inside the window and must not overlap another booking in that window.
- `BookingAttachment` — (bookingId, r2Key, filename, mime, size). Uploaded via signed R2 URL, per-student scope.

## 6. Booking & cancellation logic

**Group class flow (simplest — build first):** browse upcoming classes → each shows subject, date/time, price, and **spaces left** (capacity − confirmed) → pick a class → **pay** (balance deduct or Paystack one-off) → seat `CONFIRMED`, shared Meet link/location revealed. Seat count is checked inside the payment transaction so a full class can't oversell. No slot/duration/overlap logic — a class is a fixed event. This mirrors the flyer ("SPACES ARE LIMITED", 4–6 max).

**1-on-1 flow:** level → subject → duration → **price computes from `Rate`** → pick a start time inside an available window → problem text + optional file upload → **pay**:
- balance ≥ price → deduct instantly (`BOOKING_CHARGE`), booking `CONFIRMED`, Meet link generated.
- else → Paystack one-off (or top-up first). Booking `PENDING` with `pendingExpiresAt` (~15-min hold on the time); webhook confirms, or it auto-releases.

**Availability:** Priyanka opens **windows** tagged online/in-person (in-person carries a location). Student picks start + duration within a window; system blocks overlaps. Online → auto Meet link on confirm; in-person → show location.

**Slot granularity & gap rules (OPEN — see §8).** The DB is the source of truth; the student picks a start time from a pre-computed list of valid options, not a freeform time. Three admin-configurable settings control how those options are generated:
- `slotGranularity` (default 30 min) — start times are snapped to a clean grid (`13:00`, `13:30`, …), so no `13:07` starts.
- `minSessionMinutes` (e.g. 60) — **anti-fragmentation**: a start time is only offered if booking it would _not_ strand a leftover slice shorter than this on either side, so every remaining gap is still big enough to sell. (Recommended: "minimum-remainder" rule — friendly + efficient. Stricter alternative is "left-packing": only ever offer the window start or the end of an existing booking, so sessions butt tightly with zero gaps but students get less choice.)
- `bufferMinutes` (optional) — breathing room auto-added after each booking.

Tradeoff to note: any anti-fragmentation rule occasionally hides a student's ideal start because it would leave a dead gap. Minimum-remainder keeps that friction low; left-packing maximises efficiency at the cost of choice. Left as an open question for now.

**Cancellation / reschedule (server-enforced, by hours-to-start):**

| Notice before start | Refund to balance | Fee kept |
|---|---|---|
| ≥ 48h | 100% | 0% |
| 24–48h | 70% | 30% |
| < 24h or no-show | 0% | 100% |

Cancelling a 1-on-1 releases the window time back to availability. **Group classes** use the same tiers by default, but cancelling frees the **seat** back to the class (spaces-left goes up) rather than a time window. (Open: Priyanka may want stricter group rules given limited seats — e.g. no <24h refund because the seat is hard to re-sell last-minute. Configurable.)

## 7. Build sequence

### Phase 0 — Foundation
Prisma + Coolify Postgres · Better Auth (magic-link + admin plugin) · `(portal)` route group + route protection (student guard + admin guard) · seed 4 subjects, levels, **stub rate card with placeholders** (Priyanka enters real prices in admin) · Priyanka as ADMIN · deploy shell.

### Phase 1a — Group classes MVP (the fastest money) — _ship first_
The Test-3 batch is live demand **right now**, and group classes are the simplest booking shape (fixed event + seats, no slot maths). Build this before 1-on-1.
- **Admin:** GroupSession CRUD (create the 6 classes — subject, date/time, capacity, per-seat price, online/in-person), enrollment list per class, mark attended/no-show.
- **Student:** class listing with **spaces-left**, seat checkout, "my classes" view, wallet balance.
- **Payments:** Paystack init + signed webhook; **capacity check inside the confirming transaction** (no oversell).
- **Meetings:** one shared Google Meet link (or location) per class, revealed on confirmed seat.
- **Rules:** cancellation tiers (group variant) server-side; seat returns to pool on cancel.
- **Notifications:** seat-confirmation + reminder emails.

### Phase 1b — 1-on-1 booking MVP
The original variable-price flow, reusing the same wallet/payment/cancellation/Meet plumbing from 1a.
- **Admin:** availability window CRUD (weekly-recurring generator + one-offs), rate-table editor, package editor, bookings list, mark completed/no-show.
- **Student:** booking wizard + R2 upload + wallet balance view.
- **Payments:** Paystack pending-hold/expiry on the time slot.
- **Meetings:** per-session Google Meet link on confirm.
- **Rules:** cancellation tiers enforced server-side.
- **Notifications:** confirmation + reminder emails (WhatsApp later).

### Phase 2 — Content
Free practice-question + guide download area (existing PDFs) · video-walkthrough library (ungated for now) · content model that the paywall will later use.

### Phase 3 — Community
Public Q&A forum: anyone reads, students post, Priyanka answers. Creates the recurring _support_ value.

### Phase 4 — Recurring revenue
Paystack Plans membership · gate premium videos + forum posting · free/premium split + annual option · member discounted session rate wired into the booking price.

## 8. Open items
- **Group class pricing:** flyer says R290/2hr/seat; PG floated R250–R260 as a group discount. Confirm final per-seat price (editable in-admin either way).
- **Group cancellation rules:** same tiers as 1-on-1, or stricter given limited seats (see §6)?
- Priyanka's actual **level × duration prices** for 1-on-1 (otherwise stubbed; she edits in-admin).
- Confirm online delivery tool (assume **Google Meet**; Teams is the swap-in if not).
- **Slot granularity & gap rules** (§6): default values for `slotGranularity`, `minSessionMinutes`, `bufferMinutes`, and whether to use the minimum-remainder rule (recommended) or left-packing.
- **CPA / cash-out** legal check before launch.
- Membership model specifics (tier boundaries, exact price, annual discount).
