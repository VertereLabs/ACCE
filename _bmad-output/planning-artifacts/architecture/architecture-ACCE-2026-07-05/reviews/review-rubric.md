---
review: rubric
target: ARCHITECTURE-SPINE.md (ACCE Phase 1a — Group Classes MVP)
reviewer: rubric reviewer
date: 2026-07-05
verdict: SOUND-WITH-FIXES
---

# Rubric Review — ACCE Phase 1a Architecture Spine

Judged against the good-spine checklist. Overall this is a strong, well-scoped spine: the
correctness-critical divergences (no-oversell, idempotent webhook, integer-cents money,
append-only ledger, derived capacity, re-enrollment reuse, join-detail gating) are each pinned
by a specific AD, and every FR1–19 / NFR1–11 maps to a governing rule. The findings below are
where it falls short.

---

## 1. Does it fix the real divergence points and miss none?

**Mostly yes, three gaps.**

Well covered: AD-4 (single `reserveSeat`), AD-5 (derived capacity), AD-6 (append-only ledger),
AD-7 (idempotent HMAC webhook), AD-8 (one BOOKING_CHARGE), AD-9 (integer cents), AD-10 (gated
join details), AD-11 (server-computed tiers), AD-12 (row-reuse re-enrollment). These are the
genuine two-implementers-could-diverge points and they're each fixed by one canonical rule.

Missed / under-specified:

- **[MEDIUM] Auto-refund-on-full path is ungoverned.** Epics Story 4.2 requires: "the enrollment
  already expired/was released and the class has since filled → the payment is auto-refunded via
  Paystack and the student is notified." No AD covers this. `paystack.ts` is scoped in AD-13 and
  the source tree to "init + verifySignature" only — there is **no Paystack refund adapter**, and
  no ledger type maps to an outbound cash refund (the `LedgerType` enum has no external-refund
  concept; `CANCELLATION_REFUND` is a wallet credit, not a card refund). This capability is not
  even listed under Deferred — it is silently absent. Two implementers will each invent their own
  refund + notify + ledger handling.
- **[LOW] Payment→Enrollment linkage key is unspecified.** AD-7 flips "the matching `PENDING`
  enrollment," but the lookup key is never stated. Presumably `Enrollment.paymentRef == Payment.reference`,
  but `Enrollment.paymentRef` is neither `@unique` nor indexed in `schema.prisma`. The join key
  and its uniqueness guarantee are a divergence point left open.
- See also finding 4 (AD-6 concurrency mechanism) — a load-bearing point stated but not resolved.

## 2. Is every AD's Rule enforceable and does it prevent its stated Prevents?

**One rule does not; two are under-specified.**

- **[HIGH] AD-3 (guards in the route-group layout) is not a security boundary and does not prevent
  its stated divergence.** AD-3 says authorization is "enforced once, server-side, in each group's
  `layout.tsx`" and "Individual pages assume the guard already passed and never re-implement it."
  Per official Next.js guidance and vercel/next.js discussion #76045, **pages render independently
  of layouts** — a direct request to a protected page with an `RSC=1` header returns page content
  without the layout ever running. Layout auth is a convenience layer, explicitly *not* a security
  solution; the recommended pattern is auth checks in a Data Access Layer (closest to data) plus
  middleware and per-page/server-action checks. As written, AD-3's Prevents ("a page shipped without
  its guard; the RSC-500 leak trap") is *not* achieved — worse, it institutionalises the insecure
  pattern the lessons-learned file already warns about. This is the most important fix: promote the
  guard to a DAL `requireStudent()/requireAdmin()` invoked by every page/data-fetch (AD-10 already
  does this for join details — generalise it), with the layout guard as optimistic UX only.
- **[MEDIUM] AD-1 contradicts the Deployment section (also a brownfield-fidelity issue).** AD-1's
  Rule: the "global `next.config.ts` security headers are not modified." Deployment section: "`connect-src`/`form-action`
  must permit the Paystack checkout host." The live `next.config.ts` ships `form-action 'self'`
  (and `connect-src 'self' https:`, which already permits all https). Permitting Paystack for
  `form-action` requires editing `next.config.ts`, directly violating AD-1's "not modified." One of
  the two must give — either AD-1 should say "headers are extended additively, never regressed," or
  the Paystack-host requirement is wrong (a top-level redirect to Paystack's authorization_url is
  navigation, not `form-action`, so `form-action` may not need changing at all — resolve which).
- **[MEDIUM] AD-6 leaves its load-bearing serialization mechanism as an unresolved either/or.** The
  Rule: concurrent same-student balance mutations "must be serialized — either under the reservation's
  row lock or an explicit per-student lock." But (a) no per-student lock exists in the model, and
  (b) the reservation locks the `GroupSession` row, which does **not** serialise two operations on
  the *same student* across *different* classes (e.g. a balance-book on class A concurrent with a
  cancel on class B, or two concurrent cancels). Under that race the non-negative-balance guard can
  be bypassed (both reads see sufficient balance) — exactly the Prevents ("negative balances",
  "stale balanceAfterCents"). The derived `Σ` balance stays arithmetically correct, but the guard
  and the `balanceAfterCents` snapshot do not. The spine must *pick* the mechanism, not offer two.

Enforceable and sound: AD-2, AD-4 (Serializable + `FOR UPDATE` + 40001 retry), AD-5, AD-7, AD-8,
AD-9, AD-10, AD-11, AD-12, AD-13.

## 3. Could anything Deferred let two units diverge?

**Largely safe, one adjacent concern.**

- Expiry cron deferred → covered by AD-5 lazy expiry; correctness preserved. OK.
- Auto Meet, 1-on-1, membership, cash-out UI, reminder emails → genuinely additive, no divergence. OK.
- Wallet-balance origin deferred → they flag it doesn't block architecture; correct, but note it
  leaves Epic 3 (the "deliberate risk checkpoint" balance-pay happy path) with no real funding source
  in 1a. Product gap, not an architecture divergence — acceptable as flagged.
- The real issue is the *opposite*: the auto-refund path (finding 1) and the AD-6 lock mechanism
  (finding 4) are load-bearing but were **not** placed under Deferred either — they're simply
  under-decided, which is the failure mode this criterion guards against.

## 4. Is named tech verified-current?

**Yes, with the one stale dep correctly self-flagged.**

- `better-auth ^1.2.8` — spine flags floor stale, latest "1.6.22," says bump & pin. Verified: latest
  stable is **1.6.23** (published ~2026-06-30), with 1.7.0-rc.1 in pre-release. The spine's note is
  accurate (off by one patch) and the "auth is a supply-chain target → pin" call is right. Good.
- All other pinned versions (`next 16.1.1`, `react 19.2.3`, `prisma ^6.7.0`, `zod ^4.3.4`,
  `@tanstack/react-query ^5.90.16`, `tailwindcss ^3.4.17`, `vitest ^3.2.6`, `@playwright/test ^1.61.1`)
  **exactly match the installed `acce-nextjs/package.json`** — correct behaviour for a brownfield
  spine (ratify what's installed). Not independently re-verified as "latest," but currency is a
  non-issue since they mirror the live lockfile and only auth was flagged for bump.

## 5. Does it ratify rather than contradict the brownfield codebase?

**Yes, with the AD-1 header contradiction (see finding 2).**

Verified against live code:
- `db.ts` singleton + `@prisma/adapter-pg` + `pg.Pool` → AD-2 [ADOPTED] accurate.
- `schema.prisma` — all models/enums/`@@unique([studentId, groupSessionId])`/`@@index([groupSessionId, status])`
  match AD-4/5/6/8/12 and the ERD. `User.role String? @default("STUDENT")` matches AD-3's "role is
  the single guard key." Migration `20260705182521_init` claim is consistent.
- `next.config.ts` — `output: 'standalone'`, `reactCompiler: true`, global CSP/HSTS/X-Frame headers
  on `/(.*)` → matches AD-1/NFR7/NFR11.
- Stack table mirrors `package.json` dependency-for-dependency.

The **only** contradiction with live code is the AD-1 vs Deployment `form-action` conflict (finding 2):
the spine both asserts the headers are untouched and requires touching them.

## 6. FR1–19 / NFR1–11 coverage.

**Complete — every requirement has a governing AD/convention/map row.**

- FR1–19: all present in the Capability→Architecture Map (FR1-3→AD-1/3; FR4,5→AD-5/10; FR6→AD-10;
  FR7,11,15→AD-4/6/8/12; FR8,9,10→AD-4/7/8/13; FR12,13,14→AD-6/11; FR16,17→AD-1/3; FR18→AD-13;
  FR19→AD-2).
- NFR1→AD-4; NFR2/3→AD-7; NFR4/5→AD-6; NFR6→AD-2; NFR7→Deployment; NFR8/11→AD-1; NFR9→AD-13;
  NFR10→Consistency Conventions ("accessibility floor NFR10 on every new control").
- No FR/NFR is left without a governing rule.
- Caveat: the *epics-level capability* behind FR8's edge case (auto-refund, Story 4.2) is the
  uncovered slice — see finding 1. The headline FRs themselves are all governed.

## 7. Structural dimensions decided/deferred/open — especially the operational envelope.

**Deployment core is covered; several operational dimensions are silent.**

Covered in Deployment & Environment: single standalone container, Coolify Docker + base dir,
Prisma client into runner stage (NFR7), Postgres on Coolify, `migrate deploy` + one-time seed,
public HMAC-only webhook excluded from auth/CSRF middleware + raw body, CSP applicability.

Silent / unflagged dimensions (flag as open questions or decide):

- **[LOW-MEDIUM] Rate limiting / abuse controls** — the magic-link sign-in endpoint (email-send)
  and the public webhook have no rate-limit or abuse decision. Magic-link email-bombing is a real
  risk for a passwordless-only auth. Nothing in the spine governs it.
- **[LOW-MEDIUM] Observability / error monitoring** — no logging or alerting strategy for the
  money-critical paths (webhook failures, serialization-retry exhaustion, refund failures). AD-13
  says "log and continue" for email only. For a payments system this envelope should be explicit.
- **[LOW] DB backup / retention** — NFR5 mandates an auditable, immutable ledger "retained for
  disputes and future cash-out," but no backup/PITR policy is stated for the Postgres holding it.
- **[LOW] Environments split** — the spine's Env convention lists secrets but never distinguishes
  staging vs prod or Paystack **test vs live** keys (epics/plan mention test mode; the spine does
  not). Minor, but the operational envelope should name it.
- **[LOW] Dockerfile artifact** — NFR7's "Prisma client copied into runner stage" is stated as a
  requirement but no Dockerfile is referenced in the source tree; this is exactly the bug
  lessons-learned flags in PaymentApproval, so worth making concrete.

Dimensions correctly owned: data model, layering/dependency direction, auth model, payment flow,
concurrency model (partially — see finding 4), styling/tokens, testing (unit + e2e route-200 smoke).

---

## Finding summary (by severity)

| # | Sev | Finding | Criterion |
|---|-----|---------|-----------|
| 1 | HIGH | AD-3 layout-only guard is not a Next.js security boundary (pages render without layouts via RSC bypass); does not prevent its stated "page without a guard" divergence. Move to DAL + middleware + per-page/action checks. | 2 |
| 2 | MED | AD-1 ("`next.config.ts` headers not modified") contradicts Deployment ("`form-action` must permit Paystack"); also a live-code conflict. Reconcile (extend-only, or drop the form-action need). | 2, 5 |
| 3 | MED | Auto-refund-on-full path (epics Story 4.2) has no AD, no refund adapter in `paystack.ts`, no ledger type, and isn't even Deferred. | 1, 6 |
| 4 | MED | AD-6 leaves same-student serialization as an unresolved "row-lock OR per-student-lock"; no per-student lock exists and cross-class ops aren't serialized → non-negative guard bypassable. Pick the mechanism. | 2, 3 |
| 5 | LOW | Payment→Enrollment webhook match key unspecified; `Enrollment.paymentRef` not unique/indexed. | 1 |
| 6 | LOW | Operational envelope silent on rate-limiting (magic-link/webhook), observability, DB backups, and test-vs-live env split. | 7 |

**Verdict: SOUND-WITH-FIXES.** Coverage (FR/NFR) is complete and the correctness core is well-pinned;
fix finding 1 before build (security), and resolve findings 2–4 (contradiction, ungoverned refund,
concurrency mechanism) so epics/stories don't diverge.
