---
review: architecture-spine versions & reality-check
target: ARCHITECTURE-SPINE.md (ACCE Phase 1a — Group Classes MVP)
lens: were committed technical decisions web-researched / reality-checked, or asserted from training data?
reviewer: version-reviewer
date: 2026-07-05
verdict: PASS with fixes — stack is well-researched and internally consistent; correctness-critical decisions verified sound; main gap is version currency (stale exact pins) and a Prisma 6.7 pre-GA nuance.
---

# Review — Stack versions & reality-check

## Method

- Read the spine and cross-checked every entry in the **Stack** table against the live `acce-nextjs/package.json`.
- Web-searched (July 2026) each named library/version, and reality-checked the three correctness-critical claims called out in the brief: Prisma `@prisma/adapter-pg` + `SELECT … FOR UPDATE` under `Serializable`; raw-body webhook HMAC in the Next 16 App Router; `better-auth` floor vs latest.
- Confirmed version existence against GitHub release tags where npm/deps.dev were unavailable.

## Stack table vs package.json — full cross-check

Every version named in the spine matches `package.json` exactly. No drift between the two documents.

| Name (spine) | Spine | package.json | Match |
| --- | --- | --- | --- |
| next | 16.1.1 | 16.1.1 | ✓ |
| react / react-dom | 19.2.3 | 19.2.3 | ✓ |
| typescript | ^5 | ^5 | ✓ |
| tailwindcss | ^3.4.17 | ^3.4.17 | ✓ |
| prisma / @prisma/client / @prisma/adapter-pg | ^6.7.0 | ^6.7.0 | ✓ |
| pg | ^8.13.1 | ^8.13.1 | ✓ |
| better-auth | ^1.2.8 | ^1.2.8 | ✓ |
| zod | ^4.3.4 | ^4.3.4 | ✓ |
| @tanstack/react-query | ^5.90.16 | ^5.90.16 | ✓ |
| react-hook-form / @hookform/resolvers | ^7.69.0 / ^5.2.2 | ^7.69.0 / ^5.2.2 | ✓ |
| next-themes | ^0.4.6 | ^0.4.6 | ✓ |
| sonner | ^2.0.7 | ^2.0.7 | ✓ |
| vitest / @playwright/test | ^3.2.6 / ^1.61.1 | ^3.2.6 / ^1.61.1 | ✓ |

The spine's Stack table is a faithful projection of the actual manifest, not an invented/asserted list. Good.

## Reality-check of the correctness-critical decisions

### AD-4 — Prisma Serializable + `SELECT … FOR UPDATE` via `@prisma/adapter-pg` — VERIFIED SOUND

The specific worry (Prisma issue #20408: *Serializable isolation not respected when `queries.length === 1`*) applies **only to the array/batch form** `$transaction([q])`. AD-4 uses an **interactive (callback) `$transaction(async (tx) => …)`** running multiple statements (`SELECT … FOR UPDATE`, occupancy count, insert/upsert). That is exactly the pattern Prisma documents and recommends for `FOR UPDATE`/`SKIP LOCKED` and for honoring `isolationLevel`. So the design is not exposed to #20408, and raw `SELECT … FOR UPDATE` via `tx.$queryRaw` inside an interactive transaction is a supported, documented pattern. This decision was reality-checked, not asserted.

Two nuances worth a one-line note in the spine (both LOW):

- **Pre-GA at 6.7.** Driver adapters + the query compiler were stabilized (GA) in Prisma **v6.16.0**; at **^6.7.0** `@prisma/adapter-pg` is in the **preview** era and requires `previewFeatures = ["driverAdapters"]` in `schema.prisma`. AD-2 says `db.ts` is already adopted and working, so this is functional — but the version predates GA, and a bump toward ≥6.16 (staying on 6.x) removes the preview flag and gets fixes. Consider aligning the spine's `^6.7.0` with a newer 6.x floor.
- **Retry error code.** The spine says retry on Postgres `40001`. Prisma normally surfaces serialization/write conflicts as **P2034**; but because the lock is taken via **raw** `$queryRaw`, the underlying `pg` error (SQLSTATE `40001`) can surface directly. The bounded-backoff retry should catch **both** P2034 and raw `40001` — recommend stating that explicitly so the retry isn't accidentally narrowed to one.

Also note the design is belt-and-suspenders: the explicit `FOR UPDATE` row lock already serializes seat acquisition per session, and `Serializable` adds conflict detection on top. Correct and safe, just redundant — no action needed.

### AD-7 — Raw body + HMAC-SHA512 webhook in the Next 16 App Router — VERIFIED, no incompatibility

There is **no** App Router incompatibility with reading a raw body for HMAC. In a Next 16 route handler you read the raw payload with `await request.text()` (or `request.arrayBuffer()`); the Pages-Router `bodyParser` config that used to block this does not exist / is not needed in the App Router. The spine correctly requires reading the raw body *before* JSON parsing and excluding the route from auth/CSRF middleware. One MISSING guard (LOW): the handler should pin the **Node.js runtime** (`export const runtime = "nodejs"`) so it never lands on Edge, where body-encoding surprises can break signature verification. Recommend adding this to AD-7 / the source-tree note for `api/webhooks/paystack/route.ts`.

Paystack signing is confirmed correct: `x-paystack-signature` is `HMAC_SHA512(rawBody, PAYSTACK_SECRET_KEY)`, hex-compared. The one-off `transaction/initialize` → `charge.success` webhook flow described in the sequence diagram is the standard Paystack pattern. Good fit, correctly specified.

### AD-13 — Resend / Paystack via native `fetch` — VERIFIED

Both expose plain REST APIs usable with native `fetch` (Resend `POST /emails` with a Bearer key; Paystack `POST /transaction/initialize`). No SDK required. Consistent with the global lessons-learned rule to avoid axios/vendor SDKs. Good fit.

## Findings

### HIGH — none blocking; correctness decisions all verified sound.

### MEDIUM — `next` pinned to a stale exact `16.1.1`
`16.1.1` **exists** (confirmed stable release tag), so it is not fabricated and `npm install` will succeed. But it is an **exact** pin (no caret) and is now several patches behind: the 16.1 line is at **16.1.7** and the current stable overall is **16.2.10** (16.2.x line: perf/router/cache/server-action fixes). Next.js is a routine security-advisory target; sitting on an exact old patch means missing fixes. Recommend bumping to the latest **16.1.x** (low-risk) or the **16.2.x** line, and updating both the spine table and `package.json` together (also `eslint-config-next`, currently `16.1.1`).

### MEDIUM — `better-auth` floor `^1.2.8` should be bumped and pinned (spine already flags this)
The spine self-flags this correctly (*"floor stale — latest 1.6.22; bump & pin, auth is a supply-chain target"*), and 1.6.22 as latest is confirmed. Note the caret `^1.2.8` will already **resolve to the latest 1.x** at install time, so the floor isn't functionally frozen — the real risk is drift without a committed lockfile pin. The magic-link plugin (with `expiresIn`, default 300s) and the admin plugin (roles/ban/impersonate, the `role` guard key AD-3 relies on) both exist and are current — good fit. Action: raise the floor and pin an exact version in `package.json`, consistent with the lessons-learned "pin exact versions for high-risk deps" rule. Aligned, just not yet executed.

### LOW/MEDIUM — `react`/`react-dom` pinned to exact `19.2.3`, now behind
`19.2.3` is a good floor: it was the **security patch for CVE-2025-55182 ("React2Shell")** affecting 19.0.0–19.2.2. But it's an **exact** pin and the current line is **19.2.7**, so later patches are not being picked up. Bump to the latest 19.2.x (keep them in lockstep with each other).

### LOW — Prisma `^6.7.0` predates driver-adapter GA (6.16.0)
See AD-4 nuance above. Functional at 6.7 with the preview flag, but consider raising the floor within 6.x to reach GA driver adapters + query compiler.

### LOW — AD-7 should pin the Node runtime; retry should catch both P2034 and raw `40001`
See AD-4 / AD-7 nuances above.

### LOW — Resend / Paystack not version-pinned (by design)
"native fetch, no SDK" means there is no dependency to version — correct and intentional. Just ensure the Paystack API base/version and Resend endpoint are captured as env/config, not hardcoded at call sites (AD-13 already implies thin adapters).

## Bottom line

The spine's stack was clearly reality-checked against the live manifest rather than asserted — every version matches `package.json`, and the three highest-risk decisions (interactive-transaction `FOR UPDATE` under `Serializable`, App-Router raw-body HMAC-SHA512, native-fetch integrations) hold up under research. The outstanding work is currency hygiene: bump/pin `next`, `react`/`react-dom`, and `better-auth`; consider a newer Prisma 6.x floor; and add the two small AD-7/AD-4 hardening notes. None of these are architecture-invalidating.
