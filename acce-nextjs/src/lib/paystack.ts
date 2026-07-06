// paystack.ts — Story 4.1 (AC1, AC6, AD-13).
//
// AD-13 — NATIVE FETCH, THIN ADAPTER:
//   This module wraps Paystack's API using native fetch (Node ≥ 18 global).
//   No axios (supply-chain risk — lessons-learned), no @paystack/* SDK.
//   The adapter is kept thin: only the server-side data-fetch + response parse.
//
// AD-7 — WEBHOOK CONFIRMS (NOT HERE):
//   This file handles `initializeTransaction` only. The seat is confirmed ONLY
//   by the 4.2 webhook (HMAC-verified `charge.success` handler). Never confirm
//   a seat from a browser callback/redirect.
//
// EPIC-4 SEAM for 4.2:
//   `verifySignature(payload: Buffer, signature: string): boolean` lives here
//   next — the HMAC-SHA512 check on the raw webhook body. Add it when 4.2 lands.
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
