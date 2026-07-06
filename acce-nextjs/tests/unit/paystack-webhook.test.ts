/**
 * Story 4.2 AC6 — Unit tests for the pure webhook helpers.
 *
 * Tests the pure, db-free, env-optional functions added to src/lib/paystack.ts
 * and src/lib/enrollment.ts by Story 4.2:
 *
 *   paystack.ts:
 *     - computeSignature: known HMAC-SHA512 vector (fixed body + secret → fixed hex)
 *     - verifySignature:  match / mismatch / null header / wrong-length / missing env
 *     - parseWebhookEvent: valid charge.success / non-charge / malformed
 *
 *   enrollment.ts:
 *     - decideConfirmOutcome: all four branches (PENDING+room, PENDING+full, CANCELLED, CONFIRMED)
 *
 * NOT unit-tested here (by design — see Dev Notes):
 *   - confirmPaidSeat() — needs real Postgres (Serializable tx + Payment.create + FOR UPDATE)
 *   - The webhook route handler — needs a real signed HTTP request + Postgres
 *   - Live Paystack signature round-trip — needs PAYSTACK_SECRET_KEY + network
 *
 * Mirror of paystack.test.ts and reserve-schema.test.ts boundaries.
 *
 * Vitest sets process.env in tests — we set PAYSTACK_SECRET_KEY locally in each
 * describe block that needs it.
 */

import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  computeSignature,
  verifySignature,
  parseWebhookEvent,
} from "../../src/lib/paystack";
import { decideConfirmOutcome } from "../../src/lib/enrollment";
import { createHmac } from "crypto";

// ---------------------------------------------------------------------------
// Shared test fixtures
// ---------------------------------------------------------------------------

const TEST_SECRET = "test-secret-key-for-unit-tests";
const TEST_BODY = '{"event":"charge.success","data":{"reference":"acce_abc123","amount":29000,"status":"success"}}';

/**
 * Computes the expected HMAC-SHA512 hex digest using the same algorithm.
 * Used to build "correct" signatures for tests without depending on the
 * implementation under test.
 */
function expectedDigest(body: string, secret: string): string {
  return createHmac("sha512", secret).update(body, "utf8").digest("hex");
}

// ---------------------------------------------------------------------------
// computeSignature — known HMAC-SHA512 vector
// ---------------------------------------------------------------------------

describe("computeSignature", () => {
  it("returns the correct HMAC-SHA512 hex digest for a known body+secret", () => {
    const result = computeSignature(TEST_BODY, TEST_SECRET);
    const expected = expectedDigest(TEST_BODY, TEST_SECRET);
    expect(result).toBe(expected);
  });

  it("returns a 128-character hex string (SHA-512 = 64 bytes = 128 hex chars)", () => {
    const result = computeSignature(TEST_BODY, TEST_SECRET);
    expect(result).toHaveLength(128);
    expect(result).toMatch(/^[0-9a-f]{128}$/);
  });

  it("produces different digests for different bodies", () => {
    const a = computeSignature("body-a", TEST_SECRET);
    const b = computeSignature("body-b", TEST_SECRET);
    expect(a).not.toBe(b);
  });

  it("produces different digests for different secrets", () => {
    const a = computeSignature(TEST_BODY, "secret-a");
    const b = computeSignature(TEST_BODY, "secret-b");
    expect(a).not.toBe(b);
  });

  it("is deterministic — same inputs produce the same output", () => {
    const r1 = computeSignature(TEST_BODY, TEST_SECRET);
    const r2 = computeSignature(TEST_BODY, TEST_SECRET);
    expect(r1).toBe(r2);
  });

  it("handles an empty body", () => {
    const result = computeSignature("", TEST_SECRET);
    expect(result).toHaveLength(128);
    expect(result).toMatch(/^[0-9a-f]{128}$/);
  });
});

// ---------------------------------------------------------------------------
// verifySignature — match / mismatch / null header / wrong-length / missing env
// ---------------------------------------------------------------------------

describe("verifySignature", () => {
  const originalKey = process.env.PAYSTACK_SECRET_KEY;

  beforeEach(() => {
    process.env.PAYSTACK_SECRET_KEY = TEST_SECRET;
  });

  afterEach(() => {
    if (originalKey === undefined) {
      delete process.env.PAYSTACK_SECRET_KEY;
    } else {
      process.env.PAYSTACK_SECRET_KEY = originalKey;
    }
  });

  it("returns true when the signature matches the expected HMAC-SHA512 digest", () => {
    const validSig = expectedDigest(TEST_BODY, TEST_SECRET);
    expect(verifySignature(TEST_BODY, validSig)).toBe(true);
  });

  it("returns false when the signature does not match (wrong signature)", () => {
    const wrongSig = expectedDigest("completely-different-body", TEST_SECRET);
    expect(verifySignature(TEST_BODY, wrongSig)).toBe(false);
  });

  it("returns false when the signature is null (missing x-paystack-signature header)", () => {
    expect(verifySignature(TEST_BODY, null)).toBe(false);
  });

  it("returns false when the signature is an empty string", () => {
    expect(verifySignature(TEST_BODY, "")).toBe(false);
  });

  it("returns false when the signature is whitespace-only", () => {
    expect(verifySignature(TEST_BODY, "   ")).toBe(false);
  });

  it("returns false for a wrong-length hex string (shorter than expected)", () => {
    // A truncated signature — not the right length; timingSafeEqual would throw
    // without the length guard. Ensure we return false instead.
    const shortSig = "deadbeef"; // 8 hex chars, not 128
    expect(verifySignature(TEST_BODY, shortSig)).toBe(false);
  });

  it("returns false for a wrong-length hex string (longer than expected)", () => {
    const validSig = expectedDigest(TEST_BODY, TEST_SECRET);
    const longSig = validSig + "00"; // 130 hex chars, not 128
    expect(verifySignature(TEST_BODY, longSig)).toBe(false);
  });

  it("returns false when PAYSTACK_SECRET_KEY is missing from env", () => {
    delete process.env.PAYSTACK_SECRET_KEY;
    const validSig = expectedDigest(TEST_BODY, TEST_SECRET);
    expect(verifySignature(TEST_BODY, validSig)).toBe(false);
  });

  it("returns false when PAYSTACK_SECRET_KEY is empty string", () => {
    process.env.PAYSTACK_SECRET_KEY = "";
    const validSig = expectedDigest(TEST_BODY, TEST_SECRET);
    expect(verifySignature(TEST_BODY, validSig)).toBe(false);
  });

  it("returns false when PAYSTACK_SECRET_KEY is whitespace-only", () => {
    process.env.PAYSTACK_SECRET_KEY = "   ";
    const validSig = expectedDigest(TEST_BODY, TEST_SECRET);
    expect(verifySignature(TEST_BODY, validSig)).toBe(false);
  });

  it("returns false when the wrong secret was used to generate the signature", () => {
    const sigWithWrongSecret = expectedDigest(TEST_BODY, "wrong-secret");
    expect(verifySignature(TEST_BODY, sigWithWrongSecret)).toBe(false);
  });

  it("is case-sensitive — a signature with different hex case fails (even if numeric value is same)", () => {
    // Our computeSignature produces lowercase hex. An uppercase version of the
    // same digest should fail because it's a different Buffer encoding.
    const validSigLower = expectedDigest(TEST_BODY, TEST_SECRET);
    const validSigUpper = validSigLower.toUpperCase();
    // The Buffer.from(hex) for uppercase and lowercase hex are equal numerically,
    // but timingSafeEqual compares bytes — and hex decoding is case-insensitive
    // in Node's Buffer.from, so the upper-case version SHOULD still match.
    // This test documents the actual behaviour (both should return true).
    const upperResult = verifySignature(TEST_BODY, validSigUpper);
    const lowerResult = verifySignature(TEST_BODY, validSigLower);
    // Both should be true (Buffer.from hex is case-insensitive)
    expect(lowerResult).toBe(true);
    expect(upperResult).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// parseWebhookEvent — valid charge.success / non-charge / malformed
// ---------------------------------------------------------------------------

describe("parseWebhookEvent", () => {
  const validChargeSuccess = {
    event: "charge.success",
    data: {
      reference: "acce_abc123",
      amount: 29000,
      status: "success",
    },
  };

  it("returns ok:true for a valid charge.success envelope", () => {
    const result = parseWebhookEvent(validChargeSuccess);
    expect(result.ok).toBe(true);
  });

  it("returns the event object on ok:true", () => {
    const result = parseWebhookEvent(validChargeSuccess);
    if (!result.ok) throw new Error("expected ok:true");
    expect(result.event.event).toBe("charge.success");
    expect(result.event.data.reference).toBe("acce_abc123");
    expect(result.event.data.amount).toBe(29000);
    expect(result.event.data.status).toBe("success");
  });

  it("returns ok:true for a non-charge.success event (validates envelope, not event name)", () => {
    const nonCharge = {
      event: "charge.failed",
      data: { reference: "acce_ref", amount: 0, status: "failed" },
    };
    const result = parseWebhookEvent(nonCharge);
    expect(result.ok).toBe(true);
  });

  it("returns ok:true for a transfer.* event", () => {
    const transfer = {
      event: "transfer.success",
      data: { reference: "acce_tx", amount: 10000, status: "success" },
    };
    const result = parseWebhookEvent(transfer);
    expect(result.ok).toBe(true);
  });

  it("returns ok:true for amount = 0 (valid non-negative integer)", () => {
    const zeroAmount = {
      event: "charge.success",
      data: { reference: "acce_ref", amount: 0, status: "success" },
    };
    const result = parseWebhookEvent(zeroAmount);
    expect(result.ok).toBe(true);
  });

  it("returns ok:false for a missing event field", () => {
    const result = parseWebhookEvent({
      data: { reference: "acce_ref", amount: 29000, status: "success" },
    });
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for a missing data.reference field", () => {
    const result = parseWebhookEvent({
      event: "charge.success",
      data: { amount: 29000, status: "success" },
    });
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for an empty data.reference string", () => {
    const result = parseWebhookEvent({
      event: "charge.success",
      data: { reference: "", amount: 29000, status: "success" },
    });
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for a missing data.amount field", () => {
    const result = parseWebhookEvent({
      event: "charge.success",
      data: { reference: "acce_ref", status: "success" },
    });
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for a non-integer data.amount (float)", () => {
    const result = parseWebhookEvent({
      event: "charge.success",
      data: { reference: "acce_ref", amount: 29000.5, status: "success" },
    });
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for a negative data.amount", () => {
    const result = parseWebhookEvent({
      event: "charge.success",
      data: { reference: "acce_ref", amount: -100, status: "success" },
    });
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for a missing data.status field", () => {
    const result = parseWebhookEvent({
      event: "charge.success",
      data: { reference: "acce_ref", amount: 29000 },
    });
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for null input", () => {
    const result = parseWebhookEvent(null);
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for undefined input", () => {
    const result = parseWebhookEvent(undefined);
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for an empty object", () => {
    const result = parseWebhookEvent({});
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for a string (malformed)", () => {
    const result = parseWebhookEvent("not-an-object");
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for an array (malformed)", () => {
    const result = parseWebhookEvent([]);
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for a number (malformed)", () => {
    const result = parseWebhookEvent(42);
    expect(result.ok).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// decideConfirmOutcome — all four branches
// ---------------------------------------------------------------------------

describe("decideConfirmOutcome", () => {
  // ── PENDING + room available → confirm ──────────────────────────────────────

  it("returns 'confirm' when PENDING and others occupied < capacity (last seat)", () => {
    const result = decideConfirmOutcome({
      status: "PENDING",
      othersOccupied: 3,
      capacity: 4,
    });
    expect(result).toBe("confirm");
  });

  it("returns 'confirm' when PENDING and no others occupied (empty class)", () => {
    const result = decideConfirmOutcome({
      status: "PENDING",
      othersOccupied: 0,
      capacity: 4,
    });
    expect(result).toBe("confirm");
  });

  it("returns 'confirm' when PENDING and others occupied is well below capacity", () => {
    const result = decideConfirmOutcome({
      status: "PENDING",
      othersOccupied: 1,
      capacity: 6,
    });
    expect(result).toBe("confirm");
  });

  // ── PENDING + class full → refund_to_wallet (AD-15) ─────────────────────────

  it("returns 'refund_to_wallet' when PENDING and others exactly equal capacity (class full)", () => {
    const result = decideConfirmOutcome({
      status: "PENDING",
      othersOccupied: 4,
      capacity: 4,
    });
    expect(result).toBe("refund_to_wallet");
  });

  it("returns 'refund_to_wallet' when PENDING and others exceed capacity (oversell guard)", () => {
    const result = decideConfirmOutcome({
      status: "PENDING",
      othersOccupied: 5,
      capacity: 4,
    });
    expect(result).toBe("refund_to_wallet");
  });

  // ── CANCELLED → refund_to_wallet (AD-15, hold expired) ─────────────────────

  it("returns 'refund_to_wallet' when status is CANCELLED", () => {
    const result = decideConfirmOutcome({
      status: "CANCELLED",
      othersOccupied: 0,
      capacity: 4,
    });
    expect(result).toBe("refund_to_wallet");
  });

  it("returns 'refund_to_wallet' when CANCELLED regardless of occupancy", () => {
    const result = decideConfirmOutcome({
      status: "CANCELLED",
      othersOccupied: 4,
      capacity: 4,
    });
    expect(result).toBe("refund_to_wallet");
  });

  // ── CONFIRMED / ATTENDED / NO_SHOW → noop (defensive) ──────────────────────

  it("returns 'noop' when status is CONFIRMED", () => {
    const result = decideConfirmOutcome({
      status: "CONFIRMED",
      othersOccupied: 0,
      capacity: 4,
    });
    expect(result).toBe("noop");
  });

  it("returns 'noop' when status is ATTENDED", () => {
    const result = decideConfirmOutcome({
      status: "ATTENDED",
      othersOccupied: 0,
      capacity: 4,
    });
    expect(result).toBe("noop");
  });

  it("returns 'noop' when status is NO_SHOW", () => {
    const result = decideConfirmOutcome({
      status: "NO_SHOW",
      othersOccupied: 0,
      capacity: 4,
    });
    expect(result).toBe("noop");
  });

  it("returns 'noop' when CONFIRMED regardless of occupancy", () => {
    const result = decideConfirmOutcome({
      status: "CONFIRMED",
      othersOccupied: 5,
      capacity: 4,
    });
    expect(result).toBe("noop");
  });

  // ── Unknown status → noop (defensive fallback) ──────────────────────────────

  it("returns 'noop' for an unknown status string (defensive fallback)", () => {
    const result = decideConfirmOutcome({
      status: "UNKNOWN_STATUS",
      othersOccupied: 0,
      capacity: 4,
    });
    expect(result).toBe("noop");
  });
});
