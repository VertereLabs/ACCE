---
baseline_commit: cd713a3db009c3525ac9aa508a65ba81ac7df560
---

# Story 6.3: Seat-confirmation email on confirmation

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a student,
I want an email confirming my seat with the joining details,
so that I have the class time and Meet link (online) or location (in-person) and the price saved.

## Context & current state (READ FIRST)

This is the **THIRD story of Epic 6**. Epics 1–5 are `done`; 6.1 (admin roster) and 6.2 (mark attended/no-show)
are `done`. This story is the **first email beyond magic-link** and the **first `src/lib/meeting.ts`**. It closes
**FR18** and wires the notification + `MeetingProvider` layer into the now-stable confirm points (all seat/payment
correctness landed in Epics 3–4).

**What "an enrollment becomes CONFIRMED" means (verified in code).** `Enrollment.status` is written only in
`src/lib/enrollment.ts` (AD-14 sole status writer). There are **exactly two** places a seat becomes `CONFIRMED`:
1. **Balance path (Epic 3.4)** — `reserveSeat()` returns `{ ok:true, outcome:"confirmed", enrollmentId }` when the wallet
   balance covers the price. Reached via **two** server actions: `reserveSeatAction` and `payWithPaystackAction`
   (the latter's "balance became sufficient since page render" confirmed branch). [Source: enrollment.ts:311-369; (portal)/portal/classes/[id]/actions.ts:68-74, 148-154]
2. **Webhook path (Epic 4.2)** — `confirmPaidSeat()` flips `PENDING → CONFIRMED` + writes `BOOKING_CHARGE` when the
   HMAC-verified `charge.success` webhook decides `"confirm"`. Reached via the thin webhook route. [Source: enrollment.ts:696-729; api/webhooks/paystack/route.ts:76-99]

**The one hard rule (AD-13).** The confirmation email is sent **OUTSIDE** the reservation/confirm transaction, **after it
commits**. A failed email must **never** roll back a confirmed seat — **log and continue**. So the send is a post-commit
side-effect triggered at the **entry layer** (the two server actions + the webhook route), next to the existing
`revalidatePath` calls — **not** inside `reserveSeat`/`confirmPaidSeat` (which own the Serializable tx). See Dev Notes
"Where the trigger lives (decision)".

**AD-13 also mandates the module shape.** `email.ts` sends via Resend using **native `fetch`** (already true — do NOT add
a Resend SDK or axios), and `meeting.ts` exposes a **`MeetingProvider`** with a **`ManualProvider`** (new). For 1a the
`ManualProvider` just surfaces the **manually-entered** `meetingUrl`/`location`; a `GoogleMeetProvider` slots in later with
**no call-site change**.

**AD-10 (join details gated by CONFIRMED) — this story is the legitimate reveal.** The recipient is the CONFIRMED student
themselves, so including `meetingUrl` (ONLINE) / `location` (IN_PERSON) in *their own* confirmation email is exactly what
AD-10 permits. Mirror the **mode-gated reveal** the 3.3 detail page already uses (ONLINE → `meetingUrl`, IN_PERSON →
`location`) and add a **defensive status guard** so a mis-call can never email join details for a non-confirmed enrollment.

What already exists and MUST be reused (do NOT recreate):

- **`src/lib/email.ts`** — the send adapter. `sendEmail({to,subject,html})` (native `fetch` to Resend; **dev fallback**:
  if `RESEND_API_KEY` is unset it logs and returns `{ ok:true }`), `SendResult = {ok:true}|{ok:false;error}`, and the
  branded navy+gold magic-link HTML with `escapeHtml`/`escapeHtmlAttr`. **ADD** `sendSeatConfirmationEmail(enrollmentId)`
  + a pure `buildSeatConfirmationHtml(...)` here; **reuse** `sendEmail`, `escapeHtml`, `escapeHtmlAttr`, and the header/
  footer HTML skeleton. Do NOT change `sendEmail`/`sendMagicLinkEmail`. [Source: acce-nextjs/src/lib/email.ts]
- **`src/lib/enrollment.ts`** — the sole status writer. It already returns `enrollmentId` on the balance-path confirmed
  result; you only **widen `ConfirmResult`** so its `confirmed` variant also carries `enrollmentId` (additive), and set it
  from `enr.id` in `confirmPaidSeat`'s confirm branch. **Do NOT** move email I/O into this module or touch its Serializable/
  `FOR UPDATE`/retry core. [Source: acce-nextjs/src/lib/enrollment.ts:488-490, 696-729]
- **`formatZar`** in `src/lib/class-display.ts` — the single `priceCents → "R290.00"` formatter (AD-9). Reuse it in the
  email; do NOT reinvent Rand formatting. [Source: acce-nextjs/src/lib/class-display.ts]
- **`db` singleton** from `@/lib/db` (AD-2) — the only DB access point. `sendSeatConfirmationEmail` does one read through it.
  Never `new PrismaClient()`. [Source: acce-nextjs/src/lib/db.ts]
- **Server actions** `reserveSeatAction` / `payWithPaystackAction` in `(portal)/portal/classes/[id]/actions.ts` — ADD the
  email trigger in each `confirmed` branch (after `revalidatePath`). [Source: (portal)/portal/classes/[id]/actions.ts:68-74, 148-154]
- **Webhook route** `api/webhooks/paystack/route.ts` — ADD the email trigger after `confirmPaidSeat` returns
  `ok:true, outcome:"confirmed"` (using the new `enrollmentId`). The route stays a thin shell — the email is a read+send,
  **no** `Enrollment.status`/ledger write, **no** `db.$transaction`. [Source: api/webhooks/paystack/route.ts:76-101]
- **Mode-gated reveal precedent** — the 3.3 detail page reveals `meetingUrl` only for `mode === "ONLINE"` and `location`
  only for `IN_PERSON`. Mirror this in `ManualProvider.getJoinDetail`. [Source: (portal)/portal/classes/[id]/page.tsx]
- **shadcn/tokens** — n/a here (email is standalone HTML). Reuse the magic-link email's inline navy `#1a2744` + gold
  `#d4a91e` palette (email clients don't read CSS tokens — inline hex is correct **in email HTML only**; this is NOT a
  DESIGN.md token violation, which governs the app UI). [Source: acce-nextjs/src/lib/email.ts:78-146]

**This story = a new `src/lib/meeting.ts` (`MeetingProvider` + `ManualProvider` + `meetingProvider` singleton), a new
`email.sendSeatConfirmationEmail(enrollmentId)` + pure `buildSeatConfirmationHtml(...)` in `email.ts`, an additive
`enrollmentId` on `ConfirmResult`'s confirmed variant, and three one-line post-commit triggers (two server actions + the
webhook route). NO schema/migration/enum change, NO new dependency, NO new env (`RESEND_API_KEY`/`EMAIL_FROM`/`APP_URL`
already in `.env.example`), NO portal polish (6.4).**

## Acceptance Criteria

**AC1 — A seat-confirmation email is sent on every CONFIRMED transition, on both paths (FR18).**
Given `src/lib/email.ts` sends via Resend using native `fetch` and `src/lib/meeting.ts` exposes a `MeetingProvider` with a
`ManualProvider`,
When an enrollment becomes `CONFIRMED` — via the **balance-pay** path (`reserveSeat` → `outcome:"confirmed"`, reached from
`reserveSeatAction` **and** `payWithPaystackAction`'s confirmed branch) **or** the **webhook** path (`confirmPaidSeat` →
confirm) —
Then `email.sendSeatConfirmationEmail(enrollmentId)` is invoked exactly once for that confirmation and sends an email
containing the **class** (title + subject), the **date/time**, the **Meet link** (ONLINE) **or** the **location**
(IN_PERSON), and the **price** (formatted via `formatZar`, AD-9).

**AC2 — Email failure never rolls back the seat; the failure is logged (AD-13).**
Given the enrollment has already been confirmed (the reservation/confirm transaction has committed),
When the email send fails (Resend non-2xx or a network error),
Then the enrollment stays `CONFIRMED` (the send runs **outside** the tx, so it cannot roll anything back), the failure is
logged via `console.error`, and `sendSeatConfirmationEmail` returns `{ ok:false, error }` (it **never throws**). On the
webhook path a failed email does **not** change the route's HTTP status (Paystack still gets `200` — the seat is confirmed;
the email is not a webhook-retry trigger). On the action path a failed email does **not** turn the user's success result
into a failure (the seat is theirs).

**AC3 — `email.ts` uses native `fetch` (no SDK); `meeting.ts` exposes `MeetingProvider` + `ManualProvider` (AD-13).**
Given the domain modules,
When they are inspected,
Then `email.ts` sends only via native `fetch` (no `resend`/axios import — unchanged from 1.2), and `meeting.ts` exports a
`MeetingProvider` interface whose `ManualProvider` implementation returns the **manually-entered** join detail —
`{ mode:"ONLINE", url: session.meetingUrl }` for ONLINE and `{ mode:"IN_PERSON", location: session.location }` for
IN_PERSON — with **no** link generation (that is the deferred `GoogleMeetProvider`, which must slot in behind the same
interface with no call-site change).

**AC4 — Join details are correct per mode and never leaked to a non-confirmed enrollment (AD-10).**
Given a confirmed enrollment,
When the email is built,
Then an **ONLINE** class shows the **Meet link** (from `meetingUrl`) and an **IN_PERSON** class shows the **location**
(from `location`) — the wrong-mode field is never shown (mirrors the 3.3 detail-page reveal). `sendSeatConfirmationEmail`
loads the enrollment by id and **defensively guards** that its status is confirmed-family (`CONFIRMED`/`ATTENDED`/`NO_SHOW`)
before sending — a call for a `PENDING`/`CANCELLED` enrollment is a logged no-op that returns `{ ok:false }`, so join
details are never emailed to a seat that isn't held. All user-provided fields (class title, location, `meetingUrl`, student
name) are HTML-escaped in the email (`escapeHtml`/`escapeHtmlAttr`) to prevent email HTML injection. A missing `meetingUrl`
on an ONLINE class renders a graceful fallback line (e.g. "The joining link will be shared before the class"), never a
broken/empty link.

**AC5 — The chain stays green with new unit tests; no schema/env/dep change.**
`npx prisma validate` passes (schema untouched). `npm run build` succeeds (tsc clean; `/portal/classes/[id]` still ƒ
Dynamic and `/api/webhooks/paystack` still present). `npm test` (vitest) stays green **including new unit tests** on the
**pure** seams: `ManualProvider.getJoinDetail` (ONLINE→url, IN_PERSON→location, null handling) and
`buildSeatConfirmationHtml(...)` (class/date/price present; ONLINE shows the link, IN_PERSON shows the location and no link;
missing-`meetingUrl` fallback; fields are escaped). `sendSeatConfirmationEmail` itself imports `db` → it is **not**
unit-tested (needs `DATABASE_URL`, same wall as `markAttendance`); the live send round-trip (a real Resend call on a real
CONFIRMED enrollment) is deferred to CI ephemeral-Postgres — do NOT fake a live send, and do NOT set `RESEND_API_KEY` in
the sandbox (the dev fallback logs and returns ok, which is the intended local behaviour).

## Tasks / Subtasks

- [x] **Task 1 — `src/lib/meeting.ts`: `MeetingProvider` + `ManualProvider` (AC3, AC4, AD-13).**
  - [x] Create `src/lib/meeting.ts` (pure, `db`-free). Export `type SessionMode = "ONLINE" | "IN_PERSON"`; a discriminated
        `type JoinDetail = { mode: "ONLINE"; url: string | null } | { mode: "IN_PERSON"; location: string | null }`; and
        `interface MeetingProvider { getJoinDetail(session: { mode: SessionMode; meetingUrl: string | null; location: string | null }): JoinDetail }`.
  - [x] Implement `class ManualProvider implements MeetingProvider`: `mode === "ONLINE"` → `{ mode:"ONLINE", url: session.meetingUrl }`; else `{ mode:"IN_PERSON", location: session.location }`. **No link generation** — 1a surfaces the manual field as-is (AC3).
  - [x] Export a `meetingProvider: MeetingProvider = new ManualProvider()` singleton (the single call-site handle; a future `GoogleMeetProvider` swaps here with no call-site change — AD-13).
  - [x] Header comment: AD-13 `MeetingProvider`; `ManualProvider` for 1a; `GoogleMeetProvider` deferred behind this interface (see ARCHITECTURE-SPINE Deferred "Auto Meet generation").
- [x] **Task 2 — `email.ts`: pure `buildSeatConfirmationHtml(...)` (AC1, AC4, AC5).**
  - [x] Add an exported **pure** `buildSeatConfirmationHtml(data)` to `src/lib/email.ts`. `data` shape (plain, no Prisma types): `{ studentName: string; classTitle: string; subjectName: string; startsAt: Date; join: JoinDetail; priceCents: number }`. Return branded HTML mirroring the magic-link email skeleton (navy `#1a2744` header + gold `#d4a91e` accent + footer).
  - [x] Body must contain: greeting with `studentName`; the **class** (`classTitle` + `subjectName`); the **date/time** (format with a local `toLocaleString("en-ZA", { weekday, year, month, day, hour:"2-digit", minute:"2-digit" })` — **no explicit `timeZone` pin**, consistent with the 2.2/2.3/3.1/3.2/3.3 timezone-deferral convention); the **join detail** — for `join.mode==="ONLINE"` a clickable Meet link when `join.url` is non-empty else the fallback line "The joining link will be shared before the class"; for `join.mode==="IN_PERSON"` the `location` text (fallback "Location to be confirmed" if null); and the **price** via `formatZar(priceCents)`.
  - [x] **Escape every user-provided field**: `studentName`, `classTitle`, `subjectName`, `location` via `escapeHtml`; the Meet `url` in the `href` via `escapeHtmlAttr` (and in the visible link text via `escapeHtml`). Reuse the existing helpers — do NOT duplicate them (AC4).
  - [x] Keep this function **pure and `db`-free** so it unit-tests under jsdom with no `DATABASE_URL`.
- [x] **Task 3 — `email.ts`: `sendSeatConfirmationEmail(enrollmentId)` (AC1, AC2, AC4).**
  - [x] Add `export async function sendSeatConfirmationEmail(enrollmentId: string): Promise<SendResult>`. Import `{ db }` from `@/lib/db`, `{ formatZar }` from `@/lib/class-display`, and `{ meetingProvider }` from `@/lib/meeting` at the top of `email.ts` (email.ts currently has no `db` import — adding one is fine; `db.ts` does not import `email.ts`, so no cycle).
  - [x] Load once: `db.enrollment.findUnique({ where:{ id: enrollmentId }, select:{ status:true, priceCents:true, student:{ select:{ email:true, name:true } }, session:{ select:{ title:true, start:true, mode:true, meetingUrl:true, location:true, subject:{ select:{ name:true } } } } } })`.
  - [x] If not found → `console.error` + return `{ ok:false, error:"enrollment not found" }`.
  - [x] **Defensive AD-10 guard:** if `enrollment.status` is not in `{ "CONFIRMED", "ATTENDED", "NO_SHOW" }` → `console.error` (mis-call) + return `{ ok:false, error:"enrollment not confirmed" }` — do NOT send join details for a `PENDING`/`CANCELLED` seat (AC4).
  - [x] Build `join = meetingProvider.getJoinDetail(enrollment.session)`; build `html = buildSeatConfirmationHtml({...})`; subject e.g. `` `Your seat is confirmed: ${enrollment.session.title}` `` (plain string — the transport, not HTML; Resend handles it).
  - [x] `return await sendEmail({ to: enrollment.student.email, subject, html })` — inherits the dev fallback (no key → logs, returns ok) and the try/catch (network error → `{ ok:false, error }`). **Never throw** (mirror `sendEmail`); wrap the `db` read in the same try/catch so a query error also returns `{ ok:false, error }` and is logged.
- [x] **Task 4 — Widen `ConfirmResult` so the webhook can address the confirmed enrollment (AC1).**
  - [x] In `src/lib/enrollment.ts`, change `ConfirmResult`'s confirmed variant to carry the id — split the union so the `confirmed` outcome is `{ ok:true; outcome:"confirmed"; enrollmentId:string }` while `refunded_to_wallet | already_processed | noop` stay as `{ ok:true; outcome: ... }` (additive/back-compat — existing consumers only read `.ok`/`.outcome`).
  - [x] In `confirmPaidSeat`'s confirm branch, return `{ ok:true, outcome:"confirmed", enrollmentId: enr.id }` (the id is already in scope). **Do NOT** change the tx body, the lock order, the retry loop, or add any email I/O inside this module.
- [x] **Task 5 — Trigger the email post-commit at the three entry points (AC1, AC2).**
  - [x] `(portal)/portal/classes/[id]/actions.ts` → `reserveSeatAction`, confirmed branch (after the two `revalidatePath`): `await sendSeatConfirmationEmail(result.enrollmentId)` wrapped in `try/catch` that only `console.error`s — the result stays `{ ok:true, outcome:"confirmed", enrollmentId }` regardless (AC2). Import `sendSeatConfirmationEmail` from `@/lib/email`.
  - [x] Same file → `payWithPaystackAction`, confirmed branch (line ~148-154, after `revalidatePath`): same `try/catch` post-commit send; the result stays `{ ok:true, confirmed:true, enrollmentId }`.
  - [x] `api/webhooks/paystack/route.ts` → after `confirmResult.ok` and `confirmResult.outcome === "confirmed"`, `await sendSeatConfirmationEmail(confirmResult.enrollmentId)` in a `try/catch` that only logs; then return `200` unchanged (email outcome never changes the HTTP status — AC2). The route still writes no DB status/ledger and opens no tx (thin shell preserved).
  - [x] Because `sendSeatConfirmationEmail` already returns `SendResult` and never throws, the `try/catch` is belt-and-braces; still include it so any unexpected throw is logged and swallowed (AD-13 "log and continue").
- [x] **Task 6 — Unit-test the pure seams (AC5).**
  - [x] `tests/unit/meeting.test.ts`: `ManualProvider.getJoinDetail` returns `{mode:"ONLINE",url}` for ONLINE (incl. `url:null`), `{mode:"IN_PERSON",location}` for IN_PERSON (incl. `location:null`); the exported `meetingProvider` is a `ManualProvider`.
  - [x] `tests/unit/seat-confirmation-email.test.ts`: `buildSeatConfirmationHtml(...)` output contains the class title, subject, price string (`formatZar`), and a formatted date; ONLINE with a url renders an `href` to that url and no location; ONLINE with `url:null` renders the fallback line and no `href`; IN_PERSON renders the location and no Meet link; a title/location containing `<script>`/`"`/`&` is escaped (assert the raw injection substring is absent / entities present).
  - [x] Do NOT unit-test `sendSeatConfirmationEmail` (imports `db`) or the actions/route (server-only) — the tested seams are the two pure functions. Do NOT over-mock Prisma.
- [x] **Task 7 — Verify the chain (AC5).**
  - [x] `npx prisma validate` → passes (schema untouched — no model/enum/migration change).
  - [x] `npm run build` → succeeds (tsc clean; `/portal/classes/[id]` ƒ Dynamic; `/api/webhooks/paystack` present; the widened `ConfirmResult` type-checks at the route).
  - [x] `npm test` → vitest green including the new `meeting` + `seat-confirmation-email` tests (499 tests, all pass).
  - [x] Live send round-trip (real Resend call on a real CONFIRMED enrollment) deferred to CI ephemeral-Postgres — same sandbox wall as every prior story (no `RESEND_API_KEY` locally → the `sendEmail` dev fallback logs the send and returns ok; the seed provisions ADMIN only with no enrollments, so there is no local CONFIRMED enrollment to email). Deferral recorded in `deferred-work.md`.

## Dev Notes

### Where the trigger lives (decision — binding)
- The email fires at the **entry layer** — the two server actions (`reserveSeatAction`, `payWithPaystackAction`) and the
  Paystack webhook route — **after** the reservation/confirm transaction has committed, alongside the existing
  `revalidatePath` side-effects. It is **NOT** placed inside `reserveSeat`/`confirmPaidSeat`, which own the Serializable +
  `FOR UPDATE` + retry core exercised by the 4.3 no-oversell concurrency test. This keeps `enrollment.ts` a pure
  state-transition/ledger module and satisfies AD-13 (send outside the tx; a failed email cannot roll back the seat).
  The only change to `enrollment.ts` is the **additive** `enrollmentId` on `ConfirmResult`'s confirmed variant so the
  webhook can address the confirmed enrollment. (Alternative considered: post-commit dispatch inside the two domain
  functions — rejected; would push email I/O + a DB read into the concurrency core and alter the 4.3 test path. To switch
  later, move the three calls into post-commit `if (result.outcome==="confirmed")` blocks in `enrollment.ts`.)
  [Source: autopilot-decisions.md 2026-07-06T22:39:48Z]
- **Exactly-once per confirmation:** the balance path confirms once (in `reserveSeat`); whichever action observed the
  `confirmed` outcome sends once. The webhook path confirms once (`confirmPaidSeat`), and the idempotency gate
  (`Payment.reference` unique, AD-7) guarantees a duplicate delivery returns `already_processed` (not `confirmed`) — so a
  replayed webhook does **not** re-send the email. No de-dup table needed.

### Architecture guardrails (from ARCHITECTURE-SPINE — binding)
- **AD-13 — External I/O via native fetch behind thin adapters; email failure must not roll back a seat:** *"Paystack …
  and Resend (`src/lib/email.ts`) use native `fetch`, no axios/vendor SDK. Meetings go through a `MeetingProvider`
  interface (`src/lib/meeting.ts`) with `ManualProvider` for 1a; `GoogleMeetProvider` slots in later with no call-site
  change. A failed confirmation email must not roll back a confirmed seat — log and continue."* [Source: ARCHITECTURE-SPINE.md#AD-13]
- **AD-10 — Join details gated by CONFIRMED:** `meetingUrl`/`location` are returned only to a viewer holding a CONFIRMED
  enrollment. Here the recipient IS that student, so revealing their own join detail is the intended behaviour; the
  defensive status guard in `sendSeatConfirmationEmail` prevents a mis-call from emailing a non-confirmed seat. [Source: ARCHITECTURE-SPINE.md#AD-10]
- **AD-14 — `enrollment.ts` is the sole status writer:** unchanged — this story writes **no** status. The webhook route
  remains a thin shell (no `Enrollment.status`/ledger write, no tx). [Source: ARCHITECTURE-SPINE.md#AD-14]
- **AD-9 — Money is integer cents; format to Rand at the UI edge:** the email is a UI edge — use `formatZar(priceCents)`;
  never a float. Use the enrollment's `priceCents` **snapshot** (AD-16), not the class price. [Source: ARCHITECTURE-SPINE.md#AD-9, #AD-16]
- **AD-2 — Single data gateway:** `sendSeatConfirmationEmail` reads through the `db` singleton (one `findUnique`). No
  `new PrismaClient()`. [Source: ARCHITECTURE-SPINE.md#AD-2]
- **AD-1 — Additive isolation:** all new surface is `src/lib/meeting.ts` + additions to `src/lib/email.ts` + three
  post-commit lines. Marketing routes, SEO, sitemap, headers untouched; no CSP change (Resend/Meet are outbound only).
  [Source: ARCHITECTURE-SPINE.md#AD-1]
- **Capability map:** *"Confirmation email (FR18) → `lib/email.ts`, `lib/meeting.ts` → AD-13."* This story is that row.
  [Source: ARCHITECTURE-SPINE.md#Capability → Architecture Map]
- **Observability convention:** *"money paths (reserve, webhook, cancel) emit structured logs … failures never
  swallowed."* The email failure is logged via `console.error` (and returned as `{ ok:false }`) — it is "logged, not
  swallowed" even though it is intentionally non-fatal to the seat (AD-13). [Source: ARCHITECTURE-SPINE.md#Consistency Conventions]

### Why the send is out-of-tx and non-fatal (AD-13 mechanics)
- `reserveSeat`/`confirmPaidSeat` return **after** `await db.$transaction(...)` resolves — i.e. after the tx has
  **committed**. The seat row is durable at that point. Triggering the email from the caller (which only runs once the
  domain function has returned) is therefore guaranteed post-commit. Even if the email throws, the seat is already on the
  books — nothing to roll back. This is the whole point of AD-13's "log and continue". [Source: enrollment.ts:201-424 (reserveSeat tx), 586-763 (confirmPaidSeat tx)]
- On the **webhook** path specifically: the route must return `200` once `confirmPaidSeat` reports `ok` — a `500` would make
  Paystack **retry** the webhook, which (thanks to the `Payment.reference` idempotency gate) would `already_processed` and
  **not** re-confirm, but would be noise. So a failed email must **not** flip the route to `500`. Send, log, return `200`.
  [Source: api/webhooks/paystack/route.ts:95-101; AD-7]

### Email content & security
- **Content (FR18):** class (title + subject), date/time, Meet link (ONLINE) or location (IN_PERSON), price. That is the
  full required set — do not add reminders/calendar attachments (reminder emails are a spine Deferred item). [Source: epics.md FR18; ARCHITECTURE-SPINE.md#Deferred "Reminder emails"]
- **Mode-gated reveal:** ONLINE → `meetingUrl`, IN_PERSON → `location`. This mirrors the 3.3 detail page and sidesteps the
  deferred write-side item where an ONLINE→IN_PERSON edit can leave a stale `meetingUrl` on the row — because the email,
  like the 3.3 read, only surfaces `meetingUrl` for `mode==="ONLINE"`, a stale link on an IN_PERSON row is never emailed.
  [Source: deferred-work.md "meetingUrl retained when a class is switched to IN_PERSON"; (portal)/portal/classes/[id]/page.tsx]
- **Injection safety:** class title, subject, location, student name, and the Meet URL are user/admin-authored. Escape them
  with the existing `escapeHtml` (text) / `escapeHtmlAttr` (the `href`). The magic-link template already models this — copy
  the discipline. [Source: email.ts:113, 125-127, 148-159]
- **Null `meetingUrl` on an ONLINE class:** admins may create an ONLINE class without a link (2.1 made `meetingUrl`
  optional). Render a graceful fallback line, never an empty/broken `href`. [Source: schema.prisma GroupSession.meetingUrl String?; 2.1 create form]
- **Email palette:** inline hex (`#1a2744` navy, `#d4a91e` gold) is correct **in email HTML** — mail clients don't resolve
  the app's CSS custom properties, so the magic-link email already inlines hex. This is **not** a DESIGN.md/UX-DR2 token
  violation (that rule governs the in-app UI, not transactional email). Do not try to import app tokens into the email.
  [Source: email.ts:78-146; DESIGN.md]

### Scope boundary (do NOT do — belongs to other stories or is deferred)
- **No `GoogleMeetProvider` / auto Meet-link generation** — `ManualProvider` only; the interface exists so the generator
  slots in later with no call-site change (spine Deferred "Auto Meet generation"). [Source: ARCHITECTURE-SPINE.md#Deferred]
- **No reminder emails, no expiry cron, no calendar (.ics) attachment** — spine Deferred. [Source: ARCHITECTURE-SPINE.md#Deferred "Reminder emails / expiry cron"]
- **No change to `sendEmail`/`sendMagicLinkEmail`** — reuse `sendEmail` as the transport; the magic-link path is untouched.
- **No `Enrollment.status`/ledger write, no new tx** — this story sends a notification only; the webhook route stays a thin
  shell. Do NOT move email into `enrollment.ts`'s tx.
- **No portal polish (seats-left/empty-state/toast sweep)** — Story 6.4.
- **No schema/migration/enum change; no new dependency; no new env** — `RESEND_API_KEY`, `EMAIL_FROM`, `APP_URL` already
  in `.env.example`. No date library (native `Intl`, as every prior page).
- **No CSP/header change** — Resend and Meet are outbound `fetch`/link only; nothing new the browser connects to.

### Previous story intelligence (Epics 1–6)
- **1.2 (email.ts, done)** built `sendEmail` (native `fetch` + dev fallback) and the branded magic-link HTML with
  `escapeHtml`/`escapeHtmlAttr`. Reuse all of it. The dev fallback (no `RESEND_API_KEY` → log + `{ ok:true }`) is why the
  sandbox can't send real mail and why the live send is CI-deferred — identical to every prior "live DB op" deferral. [Source: email.ts; 1-2-...md]
- **3.4 (reserveSeat, done) / 4.1–4.2 (Paystack PENDING + webhook confirm, done)** established the two confirm points and
  the `outcome`-tagged results. `reserveSeat`'s confirmed already carries `enrollmentId`; `confirmPaidSeat` needs the
  additive `enrollmentId` (Task 4). [Source: enrollment.ts; (portal)/portal/classes/[id]/actions.ts; api/webhooks/paystack/route.ts]
- **3.3 (detail page, done)** is the mode-gated-reveal precedent (ONLINE→meetingUrl, IN_PERSON→location, server-side
  omission). Mirror it in `ManualProvider`. [Source: (portal)/portal/classes/[id]/page.tsx]
- **6.2 (done)** is the closest structural template for "pure helper + unit test + a thin wiring edit" and for the
  CI-deferral / sandbox-reality discipline. Mirror the file shapes and the "don't fake a live round-trip" note. [Source: 6-2-mark-attended-no-show.md]
- **Sandbox reality (every prior story):** prod creds (DB, Resend, Paystack) are blocked interactively; live round-trips
  are deferred to CI ephemeral-Postgres. Static verification (`prisma validate` + `build` + vitest on the pure seams) is
  the bar. [Source: deferred-work.md]
- **Git:** continue on branch `epic-6` (6.1/6.2 landed here). New files: `src/lib/meeting.ts`,
  `tests/unit/meeting.test.ts`, `tests/unit/seat-confirmation-email.test.ts`; edits: `src/lib/email.ts`
  (+`buildSeatConfirmationHtml`, +`sendSeatConfirmationEmail`), `src/lib/enrollment.ts` (widen `ConfirmResult`),
  `(portal)/portal/classes/[id]/actions.ts` (2 triggers), `api/webhooks/paystack/route.ts` (1 trigger). [Source: sprint-status.yaml]

### Data model facts this story depends on (from schema.prisma — verified)
- `GroupSession { title, start DateTime, mode Mode @default(ONLINE), location String?, meetingUrl String?, priceCents Int, subject → Subject }`; `Mode` enum = `ONLINE | IN_PERSON`. [Source: schema.prisma GroupSession + enum Mode]
- `Enrollment { id, status EnrollmentStatus, priceCents Int (snapshot, AD-16), student → User, session → GroupSession }`; `EnrollmentStatus` = `PENDING | CONFIRMED | CANCELLED | ATTENDED | NO_SHOW`. Confirmed-family for the guard = `CONFIRMED | ATTENDED | NO_SHOW`. [Source: schema.prisma Enrollment + enum EnrollmentStatus]
- `User { email String @unique, name String }` — both present, non-null (magic-link sets `name`). [Source: schema.prisma model User]
- `Subject { name }` — the class subject label. [Source: schema.prisma Subject]

### Testing standards
- Framework: **vitest** (jsdom), `npm test`, specs under `tests/unit/**`. Unit-test only the **pure** seams
  (`ManualProvider.getJoinDetail`, `buildSeatConfirmationHtml`) — both `db`-free so they load with no `DATABASE_URL`. Do
  NOT unit-test `sendSeatConfirmationEmail` (imports `db`) or the server-only actions/route. Do NOT over-mock Prisma to
  simulate the read. [Source: vitest.config.ts; 6-2 Task 6 pattern]
- The e2e authenticated-route smoke set is unchanged: `/portal/classes/[id]` and the webhook are already covered/handled;
  the email is a POST-side/side-effect, not a new GET route. No `authenticated-routes.ts` change. [Source: tests/e2e/authenticated-routes.ts]

### Project Structure Notes
- App root `acce-nextjs/`; alias `@/*` → `acce-nextjs/src/*`.
- New files:
  - `src/lib/meeting.ts` — `MeetingProvider` + `ManualProvider` + `meetingProvider` singleton (pure, db-free).
  - `tests/unit/meeting.test.ts` — `ManualProvider.getJoinDetail` assertions.
  - `tests/unit/seat-confirmation-email.test.ts` — `buildSeatConfirmationHtml` assertions (content + mode + escaping + fallback).
- UPDATE (additive):
  - `src/lib/email.ts` — add pure `buildSeatConfirmationHtml(...)` + `sendSeatConfirmationEmail(enrollmentId)` (+ imports of `db`, `formatZar`, `meetingProvider`). Do NOT alter `sendEmail`/`sendMagicLinkEmail`.
  - `src/lib/enrollment.ts` — widen `ConfirmResult` confirmed variant with `enrollmentId`; set it in `confirmPaidSeat`'s confirm branch. No tx/lock/retry change.
  - `src/app/(portal)/portal/classes/[id]/actions.ts` — post-commit email trigger in both confirmed branches (try/catch, log-only).
  - `src/app/api/webhooks/paystack/route.ts` — post-commit email trigger on confirmed outcome (try/catch, log-only; HTTP status unchanged).
- NOT modified: `prisma/schema.prisma`, `.env.example` (keys already present), `tests/e2e/authenticated-routes.ts`, `class-display.ts` (reuse `formatZar` as-is), the reservation/confirm tx bodies.

### References
- [Source: _bmad-output/planning-artifacts/epics.md#Story 6.3 / Epic 6 / FR18]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-ACCE-2026-07-05/ARCHITECTURE-SPINE.md#AD-13 (native fetch email; MeetingProvider/ManualProvider; "failed confirmation email must not roll back a confirmed seat — log and continue"), #AD-10, #AD-14, #AD-9/16, #AD-2, #AD-1, #AD-7, "Capability → Architecture Map" (FR18 → email.ts/meeting.ts), Deferred (Auto Meet generation; Reminder emails)]
- [Source: acce-nextjs/prisma/schema.prisma (GroupSession + Mode; Enrollment + EnrollmentStatus; User; Subject)]
- [Source: acce-nextjs/src/lib/email.ts (sendEmail native fetch + dev fallback; escapeHtml/escapeHtmlAttr; branded HTML skeleton — reuse; add buildSeatConfirmationHtml + sendSeatConfirmationEmail)]
- [Source: acce-nextjs/src/lib/enrollment.ts:488-490, 574-763 (ConfirmResult; confirmPaidSeat confirm branch — widen with enrollmentId; do NOT touch tx core)]
- [Source: acce-nextjs/src/lib/class-display.ts (formatZar — AD-9 single Rand formatter, reuse)]
- [Source: acce-nextjs/src/app/(portal)/portal/classes/[id]/actions.ts:68-74, 148-154 (reserveSeatAction + payWithPaystackAction confirmed branches — add trigger)]
- [Source: acce-nextjs/src/app/api/webhooks/paystack/route.ts:76-101 (thin-shell route — add trigger on confirmed, status unchanged)]
- [Source: acce-nextjs/src/app/(portal)/portal/classes/[id]/page.tsx (3.3 mode-gated reveal precedent)]
- [Source: _bmad-output/implementation-artifacts/6-2-mark-attended-no-show.md (pure-helper + unit-test + CI-deferral template)]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md (meetingUrl-on-IN_PERSON write-side item; live-op CI deferral pattern)]
- [Source: _bmad-output/implementation-artifacts/autopilot-decisions.md (2026-07-06T22:39:48Z — trigger placement + meeting.ts/email module decisions)]

### Latest tech notes
- **Resend REST API** (native `fetch`, no SDK — AD-13/NFR9): `POST https://api.resend.com/emails`, `Authorization: Bearer
  ${RESEND_API_KEY}`, JSON `{ from, to, subject, html }`, 2xx = sent. Already implemented in `sendEmail`; reuse it — do NOT
  add the `resend` npm package. [Source: email.ts:31-54; ARCHITECTURE-SPINE.md#AD-13]
- **Next 16 App Router**: server actions and the `nodejs`-runtime webhook route can `await` a domain `fetch` (Resend) as a
  post-response side-effect; there is no `after()`/queue in scope for 1a — a direct `await sendSeatConfirmationEmail(...)`
  in the action/route (wrapped in try/catch, log-only) is the MVP pattern. (A future move to `unstable_after`/a job queue
  is a later optimisation, not this story.) [Source: api/webhooks/paystack/route.ts runtime='nodejs'; ARCHITECTURE-SPINE.md#Runtime]
- **Prisma `findUnique` with nested `select`** loads the enrollment + student + session + subject in one round-trip — the
  single read `sendSeatConfirmationEmail` needs; no `include` over-fetch. [Source: schema.prisma relations]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

No debug issues encountered. All tasks completed in a single pass.

### Completion Notes List

- Task 1: Created `acce-nextjs/src/lib/meeting.ts` — pure, db-free. Exports `SessionMode`, `JoinDetail` discriminated union, `MeetingProvider` interface, `ManualProvider` class (ONLINE→url, IN_PERSON→location, no link generation), and `meetingProvider` singleton. Matches AC3 and the AD-13 MeetingProvider mandate.
- Task 2: Added pure `buildSeatConfirmationHtml(data: SeatConfirmationData)` to `email.ts`. Reuses navy/gold HTML skeleton from magic-link template. Mode-gated join detail: ONLINE→href or graceful fallback, IN_PERSON→location text or "Location to be confirmed". All user fields escaped via `escapeHtml`/`escapeHtmlAttr`. Date formatted with `toLocaleString("en-ZA")` (no TZ pin — timezone-deferral convention). Price via `formatZar(priceCents)` (AD-9).
- Task 3: Added `sendSeatConfirmationEmail(enrollmentId)` to `email.ts`. Single `db.enrollment.findUnique` with nested `select` for student/session/subject. AD-10 defensive guard: PENDING/CANCELLED status → `console.error` + `{ ok:false }`. Wraps entire function in try/catch — never throws. Delegates to `sendEmail` which inherits the dev fallback and retry semantics.
- Task 4: Widened `ConfirmResult` in `enrollment.ts` — `confirmed` variant now carries `enrollmentId: string`. Updated `confirmPaidSeat`'s confirm branch to return `enrollmentId: enr.id`. Additive change — other consumers only read `.ok`/`.outcome`.
- Task 5: Added `sendSeatConfirmationEmail` import and post-commit trigger to `reserveSeatAction` and `payWithPaystackAction` confirmed branches (both in `actions.ts`); and to the webhook route (`route.ts`) on `confirmResult.outcome === "confirmed"`. All three wrapped in try/catch (log-only); seat result and HTTP status unaffected by email outcome (AD-13/AC2).
- Task 6: Created `tests/unit/meeting.test.ts` (8 tests: ONLINE with/without url, IN_PERSON with/without location, discriminated union isolation, singleton type check) and `tests/unit/seat-confirmation-email.test.ts` (19 tests: content, ONLINE mode, ONLINE null-url fallback, IN_PERSON mode, HTML injection safety). No `db` imported in either test file.
- Task 7: `prisma validate` clean, `npm run build` clean (tsc, all routes present), `npm test` 499/499 green (472 prior + 27 new). Live Resend round-trip deferred to CI ephemeral-Postgres per `deferred-work.md`.

### File List

- acce-nextjs/src/lib/meeting.ts (NEW)
- acce-nextjs/src/lib/email.ts (MODIFIED — added buildSeatConfirmationHtml, sendSeatConfirmationEmail, SeatConfirmationData type, imports for db/formatZar/meetingProvider)
- acce-nextjs/src/lib/enrollment.ts (MODIFIED — widened ConfirmResult confirmed variant with enrollmentId; confirmPaidSeat confirm branch returns enrollmentId)
- acce-nextjs/src/app/(portal)/portal/classes/[id]/actions.ts (MODIFIED — import sendSeatConfirmationEmail; post-commit trigger in reserveSeatAction + payWithPaystackAction confirmed branches)
- acce-nextjs/src/app/api/webhooks/paystack/route.ts (MODIFIED — import sendSeatConfirmationEmail; post-commit trigger on confirmResult.outcome === "confirmed")
- acce-nextjs/tests/unit/meeting.test.ts (NEW)
- acce-nextjs/tests/unit/seat-confirmation-email.test.ts (NEW)
- _bmad-output/implementation-artifacts/deferred-work.md (MODIFIED — added 6.3 live-send deferral)

### Change Log

- 2026-07-06: Story 6.3 implemented — new `src/lib/meeting.ts` (MeetingProvider/ManualProvider), `buildSeatConfirmationHtml` + `sendSeatConfirmationEmail` added to `email.ts`, `ConfirmResult` widened with `enrollmentId`, post-commit email triggers at 3 entry points (2 server actions + webhook route), 27 new unit tests (8 meeting + 19 seat-confirmation-email). 499/499 vitest green, build clean, prisma validate clean.
