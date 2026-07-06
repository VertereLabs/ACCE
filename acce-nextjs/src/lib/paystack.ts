// paystack.ts — Story 4.1 (AC1, AC6, AD-13) + Story 4.2 (AC1, AC6, AD-13, NFR2).
//
// AD-13 — NATIVE FETCH, THIN ADAPTER:
//   This module wraps Paystack's API using native fetch (Node ≥ 18 global).
//   No axios (supply-chain risk — lessons-learned), no @paystack/* SDK.
//   The adapter is kept thin: only the server-side data-fetch + response parse.
//
// AD-7 — WEBHOOK CONFIRMS (NOT HERE — see 4.2 route):
//   The seat is confirmed ONLY by the 4.2 webhook (HMAC-verified `charge.success`
//   handler at src/app/api/webhooks/paystack/route.ts). Never confirm a seat from
//   a browser callback/redirect.
//
// EPIC-4 SEAM FILLED (Story 4.2):
//   `verifySignature(rawBody: string, signature: string | null): boolean` is now
//   implemented here — the HMAC-SHA512 check on the raw webhook body (NFR2).
//   `computeSignature(rawBody: string, secret: string): string` — pure, testable.
//   `parseWebhookEvent(json: unknown)` — Zod envelope validation.
//
// NFR2 — WEBHOOK AUTHENTICITY:
//   HMAC-SHA512 of the raw body; constant-time compare (timingSafeEqual).
//   The secret is read server-side, NEVER logged. Guard unequal lengths before
//   timingSafeEqual (it throws on length mismatch).
//
// MONEY: amount is integer cents (ZAR). Paystack's `amount` field IS the lowest
//   currency unit for ZAR — pass amountCents straight through (AD-9). No floats.
//
// SECRETS:
//   PAYSTACK_SECRET_KEY is read server-side from process.env.
//   It is NEVER logged. The module fails fast if it is missing/empty.
//
// AD-2: import { db } from "@/lib/db" — not needed here; this module has no db calls.
// AD-9: integer cents throughout.

import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Pure helpers (unit-testable without fetch or db)
// ---------------------------------------------------------------------------

/**
 * Generates a unique payment reference for a Paystack transaction.
 *
 * Format: `acce_${crypto.randomUUID()}` — UUID v4, globally unique.
 * Paystack allows alphanumerics, `-`, `.`, `=` in references; the UUID hyphen
 * and `acce_` prefix are within the safe charset.
 *
 * The reference is stored as `Enrollment.paymentRef` (unique) and serves as
 * the join key between the webhook's `Payment.reference` and the enrollment
 * row (AD-7 / 4.2 seam).
 */
export function generatePaymentRef(): string {
  return `acce_${crypto.randomUUID()}`;
}

/**
 * Builds the POST body for Paystack's `transaction/initialize` endpoint.
 *
 * @param email       - student's email from the session (never client-supplied)
 * @param amountCents - price in integer cents (ZAR) — passed straight through (AD-9)
 * @param reference   - unique paymentRef (from generatePaymentRef / existing PENDING row)
 * @param callbackUrl - where Paystack redirects the browser after payment (display-only, AD-7)
 * @returns           - the JSON-serialisable request body
 */
export function buildInitBody(args: {
  email: string;
  amountCents: number;
  reference: string;
  callbackUrl: string;
}): {
  email: string;
  amount: number;
  reference: string;
  callback_url: string;
} {
  return {
    email: args.email,
    amount: args.amountCents, // Paystack `amount` = lowest currency unit = cents for ZAR (AD-9)
    reference: args.reference,
    callback_url: args.callbackUrl,
  };
}

/**
 * Parses the Paystack `transaction/initialize` response JSON.
 *
 * Success: `{ status: true, data: { authorization_url, ... } }`
 * Failure: `{ status: false, message: "..." }` or non-2xx (caller validates HTTP status first)
 *
 * @param json - parsed JSON response from Paystack
 * @returns    - `{ ok: true; authorizationUrl }` or `{ ok: false; error }`
 */
export function parseInitResponse(json: unknown): {
  ok: true;
  authorizationUrl: string;
} | {
  ok: false;
  error: string;
} {
  if (
    json !== null &&
    typeof json === "object" &&
    "status" in json &&
    (json as { status: unknown }).status === true &&
    "data" in json &&
    (json as { data: unknown }).data !== null &&
    typeof (json as { data: unknown }).data === "object" &&
    "authorization_url" in (json as { data: object }).data &&
    typeof (json as { data: { authorization_url: unknown } }).data
      .authorization_url === "string"
  ) {
    return {
      ok: true,
      authorizationUrl: (
        json as { data: { authorization_url: string } }
      ).data.authorization_url,
    };
  }

  // Extract error message from Paystack response if available
  let error = "Paystack initialization failed";
  if (
    json !== null &&
    typeof json === "object" &&
    "message" in json &&
    typeof (json as { message: unknown }).message === "string"
  ) {
    error = (json as { message: string }).message;
  }

  return { ok: false, error };
}

// ---------------------------------------------------------------------------
// Story 4.2 — verifySignature + computeSignature (AC1, AC6, NFR2, AD-13)
// ---------------------------------------------------------------------------

/**
 * Computes the expected HMAC-SHA512 hex digest for a given raw body + secret.
 *
 * PURE FUNCTION — no env read, no I/O. Accepts the secret as an argument so it
 * can be unit-tested against a known vector (a fixed body+secret → fixed hex).
 *
 * This is the inner computation extracted so it is independently testable.
 * The actual webhook verification uses `verifySignature()` which reads the
 * secret from `process.env.PAYSTACK_SECRET_KEY`.
 *
 * @param rawBody - the exact raw bytes received from Paystack (as a UTF-8 string)
 * @param secret  - the PAYSTACK_SECRET_KEY (must NOT be logged)
 * @returns       - lowercase hex digest string
 */
export function computeSignature(rawBody: string, secret: string): string {
  return createHmac("sha512", secret).update(rawBody, "utf8").digest("hex");
}

/**
 * Verifies that the given `x-paystack-signature` header matches the expected
 * HMAC-SHA512 digest of the raw body using `PAYSTACK_SECRET_KEY`.
 *
 * Security requirements (AC1, NFR2):
 *   - Reads `PAYSTACK_SECRET_KEY` from `process.env` server-side; never logs it.
 *   - If the key is missing/empty: logs a non-sensitive error, returns `false`
 *     (fail-closed — reject the request).
 *   - If `signature` is null/empty: returns `false`.
 *   - Guards unequal buffer lengths before `timingSafeEqual` (which throws on
 *     length mismatch) — returns `false` for wrong-length digests.
 *   - Uses `crypto.timingSafeEqual` for the final comparison (constant-time,
 *     prevents timing-oracle attacks).
 *
 * The route must read the raw body BEFORE calling this function (no JSON parse
 * before verification — parsing then re-stringifying would change the byte
 * representation and break the hash).
 *
 * @param rawBody   - the exact raw request body (`await request.text()`)
 * @param signature - the `x-paystack-signature` header value (or null if absent)
 * @returns         - `true` iff the signature is valid, `false` otherwise
 */
export function verifySignature(rawBody: string, signature: string | null): boolean {
  // ── Fail fast: require PAYSTACK_SECRET_KEY ─────────────────────────────────
  // NEVER log the key value. Only log the error itself.
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || secret.trim() === "") {
    console.error("[paystack.verifySignature] PAYSTACK_SECRET_KEY is missing or empty");
    return false;
  }

  // ── Reject missing/empty signature ─────────────────────────────────────────
  if (!signature || signature.trim() === "") {
    return false;
  }

  // ── Compute expected digest ─────────────────────────────────────────────────
  const expected = computeSignature(rawBody, secret);

  // ── Guard length before timingSafeEqual (it throws on length mismatch) ──────
  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(signature, "hex");

  if (expectedBuf.length !== actualBuf.length) {
    // Wrong-length digest → cannot be valid.
    return false;
  }

  // ── Constant-time comparison (NFR2 — prevent timing oracle attacks) ─────────
  return timingSafeEqual(expectedBuf, actualBuf);
}

// ---------------------------------------------------------------------------
// Story 4.2 — parseWebhookEvent (AC5, AC6)
// ---------------------------------------------------------------------------

/**
 * Zod schema for the Paystack webhook event envelope.
 *
 * Validates the outer envelope only — `event` (string) + `data` (reference,
 * amount, status). The event name is NOT constrained here; the route decides
 * whether to act on it. Non-`charge.success` events still parse OK.
 *
 * `data.amount` is an integer (Paystack lowest currency unit = cents for ZAR;
 * AD-9 — no floats, no division). `data.reference` is a non-empty string.
 */
const webhookEventSchema = z.object({
  event: z.string(),
  data: z.object({
    reference: z.string().min(1),
    amount: z.number().int().nonnegative(),
    status: z.string(),
  }),
});

/**
 * The validated Paystack charge event shape returned by `parseWebhookEvent`.
 * The event name is preserved verbatim; the route checks for "charge.success".
 */
export type PaystackChargeEvent = z.infer<typeof webhookEventSchema>;

/**
 * Validates and parses a raw JSON value as a Paystack webhook event envelope.
 *
 * Returns `{ ok: true; event }` on success, or `{ ok: false }` on validation
 * failure (malformed body, missing fields, wrong types). This is the Zod entry
 * point — call it AFTER `JSON.parse(raw)`.
 *
 * Does NOT check `event.event === "charge.success"` — non-charge events parse
 * OK; the route decides to ignore them. This keeps parsing separate from routing.
 *
 * @param json - the result of `JSON.parse(rawBody)` (or any `unknown` value)
 * @returns    - discriminated result: ok/not-ok
 */
export function parseWebhookEvent(
  json: unknown,
): { ok: true; event: PaystackChargeEvent } | { ok: false } {
  const result = webhookEventSchema.safeParse(json);
  if (result.success) {
    return { ok: true, event: result.data };
  }
  return { ok: false };
}

// ---------------------------------------------------------------------------
// initializeTransaction — thin fetch wrapper (AD-13)
// ---------------------------------------------------------------------------

const PAYSTACK_BASE_URL = "https://api.paystack.co";

/**
 * Initialises a Paystack payment transaction.
 *
 * Must be called OUTSIDE any database transaction (no lock held across HTTP — see
 * Architecture note in Dev Notes: "Why Paystack init runs OUTSIDE the transaction").
 *
 * The `reference` argument must be the `Enrollment.paymentRef` already committed
 * to the DB (the 4.2 webhook joins on it). Re-initialising with the same reference
 * is safe — Paystack is idempotent by reference (AC4 resume flow).
 *
 * Fails fast if `PAYSTACK_SECRET_KEY` is missing or empty (never log the secret).
 *
 * @param args.email        - student's email (from session, not client-supplied; AD-3)
 * @param args.amountCents  - price in integer cents (AD-9; passed straight to Paystack)
 * @param args.reference    - committed paymentRef (Enrollment.paymentRef)
 * @param args.callbackUrl  - display-only redirect after payment (AD-7; no seat confirm here)
 * @returns                 - `{ ok: true; authorizationUrl }` or `{ ok: false; error }`
 */
export async function initializeTransaction(args: {
  email: string;
  amountCents: number;
  reference: string;
  callbackUrl: string;
}): Promise<{ ok: true; authorizationUrl: string } | { ok: false; error: string }> {
  // ── Fail fast: require PAYSTACK_SECRET_KEY ────────────────────────────────
  // Read server-side from process.env. NEVER log the value.
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || secret.trim() === "") {
    console.error("[paystack.initializeTransaction] PAYSTACK_SECRET_KEY is missing or empty");
    return { ok: false, error: "Payment configuration error" };
  }

  const body = buildInitBody(args);

  let response: Response;
  try {
    response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("[paystack.initializeTransaction] fetch error:", {
      reference: args.reference,
      error: err,
    });
    return { ok: false, error: "Network error reaching Paystack" };
  }

  let json: unknown;
  try {
    json = await response.json();
  } catch {
    console.error("[paystack.initializeTransaction] JSON parse error:", {
      reference: args.reference,
      status: response.status,
    });
    return { ok: false, error: "Invalid response from Paystack" };
  }

  if (!response.ok) {
    const parsed = parseInitResponse(json);
    const errorMsg = parsed.ok ? "Unexpected success body on non-2xx" : parsed.error;
    console.error("[paystack.initializeTransaction] non-2xx response:", {
      reference: args.reference,
      status: response.status,
      error: errorMsg,
    });
    return { ok: false, error: errorMsg };
  }

  return parseInitResponse(json);
}
