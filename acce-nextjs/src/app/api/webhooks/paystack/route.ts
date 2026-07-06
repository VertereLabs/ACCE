// route.ts — Story 4.2 (AC1, AC2, AC3, AC4, AC5, AD-7).
//
// Public Paystack webhook endpoint: POST /api/webhooks/paystack
//
// This route is a THIN SHELL:
//   - Reads the raw body (before any JSON parse — HMAC must hash the exact bytes).
//   - Verifies the x-paystack-signature header with HMAC-SHA512 (AC1, NFR2).
//   - Parses + validates the event envelope via Zod (AC5).
//   - Dispatches charge.success to confirmPaidSeat() (AC2, AC3, AC4).
//   - Returns the correct HTTP status for Paystack's retry semantics (AC5).
//
// This route performs NO direct Enrollment.status writes, NO ledgerEntry.create,
// and NO db.$transaction — ALL of that lives in enrollment.confirmPaidSeat (AD-14,
// AD-6). Never throw across the route boundary for expected outcomes.
//
// The route is PUBLIC (Paystack has no session). It is NOT in middleware.ts's
// matcher (["/guides/:path+", "/pdfs/:path*", "/portal/:path*", "/admin/:path*"]),
// so it bypasses the coarse redirect — no middleware change needed. It is a route
// handler (not a server action) so Next server-action CSRF does not apply; Better
// Auth only wraps /api/auth, not /api/webhooks/*.
//
// Pin runtime='nodejs' — the Edge runtime lacks Node `crypto` (HMAC-SHA512) and
// the raw-body handling this route requires (ARCHITECTURE-SPINE "Runtime").

export const runtime = "nodejs";

import { verifySignature, parseWebhookEvent } from "@/lib/paystack";
import { confirmPaidSeat } from "@/lib/enrollment";

export async function POST(request: Request): Promise<Response> {
  // ── Step 1: Read the raw body BEFORE any JSON parse ────────────────────────
  // HMAC must hash the exact raw bytes received; parsing then re-stringifying
  // JSON changes the byte representation and breaks the signature check (NFR2).
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    // Body read failure — return 400 so Paystack re-sends.
    return new Response("Body read error", { status: 400 });
  }

  // ── Step 2: Verify HMAC-SHA512 signature (AC1, NFR2) ───────────────────────
  // Missing header, wrong-length digest, or mismatch → 401, no DB write.
  const sig = request.headers.get("x-paystack-signature");
  if (!verifySignature(raw, sig)) {
    return new Response("Invalid signature", { status: 401 });
  }

  // ── Step 3: Parse JSON ──────────────────────────────────────────────────────
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch {
    // Malformed JSON body → 400 (AC5).
    return new Response("Malformed JSON body", { status: 400 });
  }

  // ── Step 4: Zod-validate the event envelope (AC5) ──────────────────────────
  // Validates envelope shape only; does not check event.event === "charge.success".
  const parsed = parseWebhookEvent(parsedJson);
  if (!parsed.ok) {
    return new Response("Invalid event shape", { status: 400 });
  }

  const event = parsed.event;

  // ── Step 5: Route by event type ────────────────────────────────────────────
  // Only act on charge.success (AC5: ack everything else with 200, no side-effect).
  if (event.event !== "charge.success") {
    return new Response(null, { status: 200 });
  }

  // ── Step 6: Confirm the seat (AC2, AC3, AC4) ───────────────────────────────
  // All DB writes (Payment insert, enrollment status flip, wallet ledger) live
  // inside confirmPaidSeat — this route is a thin shell (AD-14, AD-6).
  let confirmResult: Awaited<ReturnType<typeof confirmPaidSeat>>;
  try {
    confirmResult = await confirmPaidSeat({
      reference: event.data.reference,
      amountCents: event.data.amount,
      status: event.data.status,
      type: event.event,
      raw: event,
    });
  } catch (unexpectedErr) {
    // Defensive: confirmPaidSeat should never throw (it returns { ok: false } on error),
    // but if it does, return 500 so Paystack retries rather than swallowing it (AC5).
    console.error("[webhooks/paystack] unexpected throw from confirmPaidSeat:", {
      reference: event.data.reference,
      error: unexpectedErr,
    });
    return new Response("Internal error", { status: 500 });
  }

  // ok:true (confirmed / already_processed / noop / refunded_to_wallet) → 200
  // ok:false (error / transient failure) → 500 so Paystack retries (AC5, NFR3)
  if (confirmResult.ok) {
    return new Response(null, { status: 200 });
  }

  return new Response("Internal error", { status: 500 });
}
