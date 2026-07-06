/**
 * Story 4.1 AC6 — Unit tests for the pure Paystack helpers.
 *
 * Tests the pure, db-free, fetch-free functions in src/lib/paystack.ts:
 *   - generatePaymentRef: unique, correct prefix, Paystack-safe charset
 *   - buildInitBody: correct field mapping, amount is integer cents (AD-9)
 *   - parseInitResponse: extracts authorization_url on success, handles failures
 *
 * NOT unit-tested here (by design — see Dev Notes):
 *   - initializeTransaction() — calls global fetch + reads process.env;
 *     needs Paystack sandbox credentials + network → deferred to CI.
 *   - reserveSeat() / payWithPaystackAction() — need real Postgres.
 *
 * Mirror of reserve-schema.test.ts pattern.
 */

import { describe, expect, it } from "vitest";
import {
  generatePaymentRef,
  buildInitBody,
  parseInitResponse,
} from "../../src/lib/paystack";

// ---------------------------------------------------------------------------
// generatePaymentRef
// ---------------------------------------------------------------------------

describe("generatePaymentRef", () => {
  it("returns a string with the acce_ prefix", () => {
    const ref = generatePaymentRef();
    expect(ref.startsWith("acce_")).toBe(true);
  });

  it("returns a string with total length > 5 (prefix + UUID)", () => {
    const ref = generatePaymentRef();
    // "acce_" (5) + UUID v4 (36) = 41
    expect(ref.length).toBeGreaterThan(5);
  });

  it("returns exactly acce_ + a UUID v4 (36 chars)", () => {
    const ref = generatePaymentRef();
    // UUID v4 pattern: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    const uuid = ref.slice(5);
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it("produces different references on successive calls (uniqueness)", () => {
    const refs = new Set(Array.from({ length: 10 }, () => generatePaymentRef()));
    expect(refs.size).toBe(10);
  });

  it("uses only Paystack-safe characters (alphanumerics, -, _)", () => {
    // Paystack reference safe charset: alphanumerics + - . =
    // Our format uses alphanumerics + - + _
    const ref = generatePaymentRef();
    expect(ref).toMatch(/^[a-zA-Z0-9_-]+$/);
  });

  it("does not contain characters unsafe for a URL query parameter without encoding", () => {
    const ref = generatePaymentRef();
    // No spaces, ?, &, #, etc.
    expect(ref).not.toMatch(/[\s?&#]/);
  });
});

// ---------------------------------------------------------------------------
// buildInitBody
// ---------------------------------------------------------------------------

describe("buildInitBody", () => {
  const base = {
    email: "student@example.com",
    amountCents: 29000,
    reference: "acce_abc123",
    callbackUrl: "https://example.com/portal/classes/seed-class-acc-1",
  };

  it("maps email correctly", () => {
    const body = buildInitBody(base);
    expect(body.email).toBe("student@example.com");
  });

  it("maps amountCents to the `amount` field (AD-9: integer cents = Paystack lowest unit)", () => {
    const body = buildInitBody(base);
    expect(body.amount).toBe(29000);
  });

  it("does not perform any currency conversion (passes cents straight through)", () => {
    // R290.00 = 29000 cents. The value must not be divided by 100.
    const body = buildInitBody({ ...base, amountCents: 29000 });
    expect(body.amount).toBe(29000);
  });

  it("maps reference correctly", () => {
    const body = buildInitBody(base);
    expect(body.reference).toBe("acce_abc123");
  });

  it("maps callbackUrl to `callback_url` (snake_case, AD-13 Paystack API field name)", () => {
    const body = buildInitBody(base);
    expect(body.callback_url).toBe(
      "https://example.com/portal/classes/seed-class-acc-1",
    );
  });

  it("does not include any extra fields beyond the four required", () => {
    const body = buildInitBody(base);
    expect(Object.keys(body).sort()).toEqual(
      ["amount", "callback_url", "email", "reference"].sort(),
    );
  });

  it("handles a zero-cent price (edge case — field present)", () => {
    const body = buildInitBody({ ...base, amountCents: 0 });
    expect(body.amount).toBe(0);
  });

  it("handles a large amount (integer cents, no float rounding)", () => {
    const body = buildInitBody({ ...base, amountCents: 100000 }); // R1000.00
    expect(body.amount).toBe(100000);
    expect(Number.isInteger(body.amount)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// parseInitResponse — success path
// ---------------------------------------------------------------------------

describe("parseInitResponse — success", () => {
  const validResponse = {
    status: true,
    message: "Authorization URL created",
    data: {
      authorization_url: "https://checkout.paystack.com/abc123",
      access_code: "abc123",
      reference: "acce_some-ref",
    },
  };

  it("returns ok:true when status is true and authorization_url is present", () => {
    const result = parseInitResponse(validResponse);
    expect(result.ok).toBe(true);
  });

  it("extracts the authorization_url from data.authorization_url", () => {
    const result = parseInitResponse(validResponse);
    if (!result.ok) throw new Error("expected ok:true");
    expect(result.authorizationUrl).toBe("https://checkout.paystack.com/abc123");
  });

  it("extracts a different authorization_url correctly", () => {
    const r = parseInitResponse({
      status: true,
      data: {
        authorization_url: "https://checkout.paystack.com/different-token",
        access_code: "xyz",
        reference: "acce_ref",
      },
    });
    if (!r.ok) throw new Error("expected ok:true");
    expect(r.authorizationUrl).toBe(
      "https://checkout.paystack.com/different-token",
    );
  });
});

// ---------------------------------------------------------------------------
// parseInitResponse — failure paths
// ---------------------------------------------------------------------------

describe("parseInitResponse — failure", () => {
  it("returns ok:false when status is false", () => {
    const result = parseInitResponse({
      status: false,
      message: "Invalid key",
      data: null,
    });
    expect(result.ok).toBe(false);
  });

  it("extracts the error message from `message` when status is false", () => {
    const result = parseInitResponse({
      status: false,
      message: "Invalid key",
      data: null,
    });
    if (result.ok) throw new Error("expected ok:false");
    expect(result.error).toBe("Invalid key");
  });

  it("returns ok:false when data is missing", () => {
    const result = parseInitResponse({ status: true });
    expect(result.ok).toBe(false);
  });

  it("returns ok:false when data.authorization_url is missing", () => {
    const result = parseInitResponse({
      status: true,
      data: { access_code: "abc", reference: "ref" },
    });
    expect(result.ok).toBe(false);
  });

  it("returns ok:false when data.authorization_url is not a string", () => {
    const result = parseInitResponse({
      status: true,
      data: { authorization_url: 12345 },
    });
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for null input", () => {
    const result = parseInitResponse(null);
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for undefined input", () => {
    const result = parseInitResponse(undefined);
    expect(result.ok).toBe(false);
  });

  it("returns ok:false for an empty object", () => {
    const result = parseInitResponse({});
    expect(result.ok).toBe(false);
  });

  it("returns a fallback error string when no message field is present", () => {
    const result = parseInitResponse({ status: false });
    if (result.ok) throw new Error("expected ok:false");
    expect(typeof result.error).toBe("string");
    expect(result.error.length).toBeGreaterThan(0);
  });

  it("returns ok:false when the response is a string (malformed)", () => {
    const result = parseInitResponse("error string");
    expect(result.ok).toBe(false);
  });

  it("returns ok:false when the response is an array (malformed)", () => {
    const result = parseInitResponse([]);
    expect(result.ok).toBe(false);
  });
});
