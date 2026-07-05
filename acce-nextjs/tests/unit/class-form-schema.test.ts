/**
 * Story 2.1 AC5 — Unit tests for the class-form Zod schema and toCents helper.
 *
 * Imports ONLY src/app/(admin)/admin/classes/new/class-form-schema.ts
 * (a pure module — no db/Prisma/DATABASE_URL dependency) so this suite runs
 * safely in the jsdom environment without any live DB.
 *
 * Coverage mirrors the 1.4 seed-data.test.ts pattern:
 *   - Happy path: valid input parses with correct types and values
 *   - AC2 invalid cases:
 *     - end ≤ start
 *     - capacity < 1 (0, negative)
 *     - missing required fields (subjectId, level, title, start, end, capacity, price)
 *     - price ≤ 0 / non-numeric price
 *     - mode = IN_PERSON with no location
 *     - mode = ONLINE with no meetingUrl → PASSES (AD-13)
 *   - toCents conversion: 290 → 29000, 290.5 → 29050
 */

import { describe, expect, it } from "vitest";
import { createClassSchema, toCents } from "../../src/app/(admin)/admin/classes/new/class-form-schema";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_BASE = {
  subjectId: "subject-abc",
  level: "Undergrad" as const,
  title: "CTA Audit Bootcamp",
  description: "A great class",
  start: "2027-03-01T10:00",
  end: "2027-03-01T12:00",
  capacity: "5",
  priceRand: "290",
  mode: "ONLINE" as const,
  location: "",
  meetingUrl: "",
};

function parse(overrides: Partial<typeof VALID_BASE> & Record<string, unknown> = {}) {
  return createClassSchema.safeParse({ ...VALID_BASE, ...overrides });
}

function fieldErrors(result: ReturnType<typeof parse>) {
  if (result.success) return {};
  return result.error.flatten().fieldErrors;
}

// ---------------------------------------------------------------------------
// Happy path
// ---------------------------------------------------------------------------

describe("createClassSchema — happy path", () => {
  it("parses a valid ONLINE class with all required fields", () => {
    const r = parse();
    expect(r.success).toBe(true);
    if (!r.success) return;

    expect(r.data.subjectId).toBe("subject-abc");
    expect(r.data.level).toBe("Undergrad");
    expect(r.data.title).toBe("CTA Audit Bootcamp");
    expect(r.data.capacity).toBe(5);
    expect(r.data.priceRand).toBe(290);
    expect(r.data.mode).toBe("ONLINE");
    expect(r.data.start).toBeInstanceOf(Date);
    expect(r.data.end).toBeInstanceOf(Date);
  });

  it("parses CTA/PGDA as a valid level", () => {
    const r = parse({ level: "CTA/PGDA" });
    expect(r.success).toBe(true);
    expect((r as { success: true; data: { level: string } }).data.level).toBe("CTA/PGDA");
  });

  it("accepts an optional meetingUrl when mode is ONLINE", () => {
    const r = parse({ meetingUrl: "https://meet.google.com/abc" });
    expect(r.success).toBe(true);
  });

  it("passes when mode is ONLINE and meetingUrl is omitted (AD-13)", () => {
    const r = parse({ meetingUrl: "" });
    expect(r.success).toBe(true);
  });

  it("passes when mode is IN_PERSON and location is provided", () => {
    const r = parse({ mode: "IN_PERSON", location: "Room 101" });
    expect(r.success).toBe(true);
  });

  it("treats an empty description as optional / allowed", () => {
    const r = parse({ description: "" });
    expect(r.success).toBe(true);
  });

  it("trims the title", () => {
    const r = parse({ title: "  Trimmed Title  " });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.title).toBe("Trimmed Title");
  });
});

// ---------------------------------------------------------------------------
// AC2: end ≤ start
// ---------------------------------------------------------------------------

describe("createClassSchema — end ≤ start", () => {
  it("rejects when end is before start", () => {
    const r = parse({ start: "2027-03-01T12:00", end: "2027-03-01T10:00" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({ end: expect.arrayContaining(["End must be after start"]) });
  });

  it("rejects when end equals start", () => {
    const r = parse({ start: "2027-03-01T10:00", end: "2027-03-01T10:00" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({ end: expect.arrayContaining(["End must be after start"]) });
  });
});

// ---------------------------------------------------------------------------
// AC2: capacity < 1
// ---------------------------------------------------------------------------

describe("createClassSchema — capacity < 1", () => {
  it("rejects capacity = 0", () => {
    const r = parse({ capacity: "0" });
    expect(r.success).toBe(false);
    const errs = fieldErrors(r);
    expect(errs.capacity?.length).toBeGreaterThan(0);
  });

  it("rejects negative capacity", () => {
    const r = parse({ capacity: "-3" });
    expect(r.success).toBe(false);
    const errs = fieldErrors(r);
    expect(errs.capacity?.length).toBeGreaterThan(0);
  });

  it("rejects non-integer capacity (e.g. 2.5)", () => {
    const r = parse({ capacity: "2.5" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({
      capacity: expect.arrayContaining(["Capacity must be a whole number"]),
    });
  });

  it("accepts capacity = 1 (minimum allowed)", () => {
    const r = parse({ capacity: "1" });
    expect(r.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// AC2: missing required fields
// ---------------------------------------------------------------------------

describe("createClassSchema — missing required fields", () => {
  it("rejects missing subjectId", () => {
    const r = parse({ subjectId: "" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({ subjectId: expect.arrayContaining(["Subject is required"]) });
  });

  it("rejects missing level", () => {
    const r = createClassSchema.safeParse({ ...VALID_BASE, level: undefined });
    expect(r.success).toBe(false);
  });

  it("rejects missing title", () => {
    const r = parse({ title: "" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({ title: expect.arrayContaining(["Title is required"]) });
  });

  it("rejects missing start", () => {
    const r = createClassSchema.safeParse({ ...VALID_BASE, start: undefined });
    expect(r.success).toBe(false);
  });

  it("rejects missing end", () => {
    const r = createClassSchema.safeParse({ ...VALID_BASE, end: undefined });
    expect(r.success).toBe(false);
  });

  it("rejects when capacity is absent", () => {
    const r = createClassSchema.safeParse({ ...VALID_BASE, capacity: undefined });
    expect(r.success).toBe(false);
  });

  it("rejects when price is absent", () => {
    const r = createClassSchema.safeParse({ ...VALID_BASE, priceRand: undefined });
    expect(r.success).toBe(false);
  });

  it("rejects a title over 200 characters", () => {
    const r = parse({ title: "A".repeat(201) });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({
      title: expect.arrayContaining(["Title must be 200 characters or fewer"]),
    });
  });
});

// ---------------------------------------------------------------------------
// AC2: price ≤ 0 or non-numeric
// ---------------------------------------------------------------------------

describe("createClassSchema — invalid price", () => {
  it("rejects price = 0", () => {
    const r = parse({ priceRand: "0" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({
      priceRand: expect.arrayContaining(["Price must be greater than 0"]),
    });
  });

  it("rejects negative price", () => {
    const r = parse({ priceRand: "-100" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({
      priceRand: expect.arrayContaining(["Price must be greater than 0"]),
    });
  });

  it("rejects non-numeric price", () => {
    const r = parse({ priceRand: "abc" });
    expect(r.success).toBe(false);
    const errs = fieldErrors(r);
    expect(errs.priceRand?.length).toBeGreaterThan(0);
  });

  it("accepts a decimal price (e.g. 290.50)", () => {
    const r = parse({ priceRand: "290.50" });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.priceRand).toBeCloseTo(290.5);
  });
});

// ---------------------------------------------------------------------------
// AC2: mode = IN_PERSON with no location
// ---------------------------------------------------------------------------

describe("createClassSchema — IN_PERSON without location", () => {
  it("rejects IN_PERSON with no location (empty string)", () => {
    const r = parse({ mode: "IN_PERSON", location: "" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({
      location: expect.arrayContaining(["Location is required for in-person classes"]),
    });
  });

  it("rejects IN_PERSON with undefined location", () => {
    const r = createClassSchema.safeParse({ ...VALID_BASE, mode: "IN_PERSON", location: undefined });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({
      location: expect.arrayContaining(["Location is required for in-person classes"]),
    });
  });
});

// ---------------------------------------------------------------------------
// AD-13: mode = ONLINE with no meetingUrl → should PASS
// ---------------------------------------------------------------------------

describe("createClassSchema — ONLINE without meetingUrl", () => {
  it("passes when mode is ONLINE and meetingUrl is not provided (AD-13)", () => {
    const r = createClassSchema.safeParse({ ...VALID_BASE, mode: "ONLINE", meetingUrl: undefined });
    expect(r.success).toBe(true);
  });

  it("rejects an invalid meetingUrl (not a URL)", () => {
    const r = parse({ meetingUrl: "not-a-url" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({
      meetingUrl: expect.arrayContaining(["Meeting URL must be a valid URL (https://…)"]),
    });
  });
});

// ---------------------------------------------------------------------------
// toCents helper — Rand → cents conversion (AD-9)
// ---------------------------------------------------------------------------

describe("toCents — Rand to integer cents conversion (AD-9)", () => {
  it("converts 290 Rand to 29000 cents", () => {
    expect(toCents(290)).toBe(29000);
  });

  it("converts 290.5 Rand to 29050 cents", () => {
    expect(toCents(290.5)).toBe(29050);
  });

  it("converts 0.01 Rand to 1 cent (minimum unit)", () => {
    expect(toCents(0.01)).toBe(1);
  });

  it("rounds 1.005 Rand to 101 cents (Math.round half-up)", () => {
    expect(toCents(1.005)).toBe(Math.round(1.005 * 100));
  });

  it("converts 100 Rand to 10000 cents", () => {
    expect(toCents(100)).toBe(10000);
  });

  it("converts 290.55 Rand to 29055 cents", () => {
    expect(toCents(290.55)).toBe(29055);
  });

  it("always returns an integer", () => {
    const result = toCents(291.337);
    expect(Number.isInteger(result)).toBe(true);
  });
});
