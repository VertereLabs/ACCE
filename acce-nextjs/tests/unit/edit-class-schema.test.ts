/**
 * Story 2.3 AC3, AC6 — Unit tests for the edit-class Zod schema and toCents helper.
 *
 * Mirrors the 2.1 class-form-schema.test.ts suite against editClassSchema,
 * adding coverage for the edit-specific fields (id, expectedUpdatedAt) and
 * the first-class meetingUrl set/clear behaviour (AD-13).
 *
 * Imports ONLY src/app/(admin)/admin/classes/[id]/edit/edit-class-schema.ts
 * (a pure module — no db/Prisma/DATABASE_URL dependency) so this suite runs
 * safely in jsdom without any live DB.
 */

import { describe, expect, it } from "vitest";
import {
  editClassSchema,
  toCents,
} from "../../src/app/(admin)/admin/classes/[id]/edit/edit-class-schema";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VALID_BASE = {
  id: "class-abc-123",
  expectedUpdatedAt: "2026-07-06T00:00:00.000Z",
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
  return editClassSchema.safeParse({ ...VALID_BASE, ...overrides });
}

function fieldErrors(result: ReturnType<typeof parse>) {
  if (result.success) return {};
  return result.error.flatten().fieldErrors;
}

// ---------------------------------------------------------------------------
// Happy path
// ---------------------------------------------------------------------------

describe("editClassSchema — happy path", () => {
  it("parses a valid ONLINE class with all required fields including id + expectedUpdatedAt", () => {
    const r = parse();
    expect(r.success).toBe(true);
    if (!r.success) return;

    expect(r.data.id).toBe("class-abc-123");
    expect(r.data.expectedUpdatedAt).toBe("2026-07-06T00:00:00.000Z");
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

  it("Rand→cents: priceRand 290 yields 29000 after toCents(data.priceRand)", () => {
    const r = parse({ priceRand: "290" });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(toCents(r.data.priceRand)).toBe(29000);
  });

  it("Rand→cents: priceRand 290.5 yields 29050 after toCents", () => {
    const r = parse({ priceRand: "290.5" });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(toCents(r.data.priceRand)).toBe(29050);
  });
});

// ---------------------------------------------------------------------------
// id + expectedUpdatedAt — required identity/concurrency fields
// ---------------------------------------------------------------------------

describe("editClassSchema — id and expectedUpdatedAt required", () => {
  it("rejects missing id (empty string)", () => {
    const r = parse({ id: "" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({
      id: expect.arrayContaining(["Class id is required"]),
    });
  });

  it("rejects missing id (undefined)", () => {
    const r = editClassSchema.safeParse({ ...VALID_BASE, id: undefined });
    expect(r.success).toBe(false);
  });

  it("rejects missing expectedUpdatedAt (empty string)", () => {
    const r = parse({ expectedUpdatedAt: "" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({
      expectedUpdatedAt: expect.arrayContaining(["Concurrency token is required"]),
    });
  });

  it("rejects missing expectedUpdatedAt (undefined)", () => {
    const r = editClassSchema.safeParse({ ...VALID_BASE, expectedUpdatedAt: undefined });
    expect(r.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// meetingUrl — set, replace, and CLEAR (AD-13 first-class editable)
// ---------------------------------------------------------------------------

describe("editClassSchema — meetingUrl set and clear (AD-13)", () => {
  it("parses a valid meetingUrl when provided", () => {
    const r = parse({ meetingUrl: "https://meet.google.com/abc-xyz" });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.meetingUrl).toBe("https://meet.google.com/abc-xyz");
  });

  it("parses an empty meetingUrl (clearing — stored as null)", () => {
    const r = parse({ meetingUrl: "" });
    expect(r.success).toBe(true);
    // The action maps empty string → null before the DB write; schema just passes it.
  });

  it("parses undefined meetingUrl (omitted)", () => {
    const r = editClassSchema.safeParse({ ...VALID_BASE, meetingUrl: undefined });
    expect(r.success).toBe(true);
  });

  it("rejects an invalid meetingUrl (not a URL)", () => {
    const r = parse({ meetingUrl: "not-a-url" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({
      meetingUrl: expect.arrayContaining([
        "Meeting URL must be a valid URL (https://…)",
      ]),
    });
  });

  it("rejects a meetingUrl without a scheme", () => {
    const r = parse({ meetingUrl: "meet.google.com/abc" });
    expect(r.success).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// AC3: end ≤ start
// ---------------------------------------------------------------------------

describe("editClassSchema — end ≤ start", () => {
  it("rejects when end is before start", () => {
    const r = parse({ start: "2027-03-01T12:00", end: "2027-03-01T10:00" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({
      end: expect.arrayContaining(["End must be after start"]),
    });
  });

  it("rejects when end equals start", () => {
    const r = parse({ start: "2027-03-01T10:00", end: "2027-03-01T10:00" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({
      end: expect.arrayContaining(["End must be after start"]),
    });
  });
});

// ---------------------------------------------------------------------------
// AC3: capacity < 1
// ---------------------------------------------------------------------------

describe("editClassSchema — capacity < 1", () => {
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
// AC3: missing required fields
// ---------------------------------------------------------------------------

describe("editClassSchema — missing required fields", () => {
  it("rejects missing subjectId", () => {
    const r = parse({ subjectId: "" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({
      subjectId: expect.arrayContaining(["Subject is required"]),
    });
  });

  it("rejects missing level", () => {
    const r = editClassSchema.safeParse({ ...VALID_BASE, level: undefined });
    expect(r.success).toBe(false);
  });

  it("rejects missing title", () => {
    const r = parse({ title: "" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({
      title: expect.arrayContaining(["Title is required"]),
    });
  });

  it("rejects missing start", () => {
    const r = editClassSchema.safeParse({ ...VALID_BASE, start: undefined });
    expect(r.success).toBe(false);
  });

  it("rejects missing end", () => {
    const r = editClassSchema.safeParse({ ...VALID_BASE, end: undefined });
    expect(r.success).toBe(false);
  });

  it("rejects when capacity is absent", () => {
    const r = editClassSchema.safeParse({ ...VALID_BASE, capacity: undefined });
    expect(r.success).toBe(false);
  });

  it("rejects when price is absent", () => {
    const r = editClassSchema.safeParse({ ...VALID_BASE, priceRand: undefined });
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
// AC3: price ≤ 0 or non-numeric
// ---------------------------------------------------------------------------

describe("editClassSchema — invalid price", () => {
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
// AC3: mode = IN_PERSON with no location
// ---------------------------------------------------------------------------

describe("editClassSchema — IN_PERSON without location", () => {
  it("rejects IN_PERSON with no location (empty string)", () => {
    const r = parse({ mode: "IN_PERSON", location: "" });
    expect(r.success).toBe(false);
    expect(fieldErrors(r)).toMatchObject({
      location: expect.arrayContaining([
        "Location is required for in-person classes",
      ]),
    });
  });

  it("rejects IN_PERSON with undefined location", () => {
    const r = editClassSchema.safeParse({
      ...VALID_BASE,
      mode: "IN_PERSON",
      location: undefined,
    });
    expect(r.success).toBe(false);
    expect(
      (r as { success: false; error: { flatten: () => { fieldErrors: Record<string, string[]> } } })
        .error.flatten().fieldErrors
    ).toMatchObject({
      location: expect.arrayContaining([
        "Location is required for in-person classes",
      ]),
    });
  });
});

// ---------------------------------------------------------------------------
// AD-13: mode = ONLINE with no meetingUrl → should PASS
// ---------------------------------------------------------------------------

describe("editClassSchema — ONLINE without meetingUrl", () => {
  it("passes when mode is ONLINE and meetingUrl is not provided (AD-13)", () => {
    const r = editClassSchema.safeParse({
      ...VALID_BASE,
      mode: "ONLINE",
      meetingUrl: undefined,
    });
    expect(r.success).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// toCents helper re-exported from create schema — AD-9 single site
// ---------------------------------------------------------------------------

describe("toCents — Rand to integer cents conversion (AD-9, re-exported)", () => {
  it("converts 290 Rand to 29000 cents", () => {
    expect(toCents(290)).toBe(29000);
  });

  it("converts 290.5 Rand to 29050 cents", () => {
    expect(toCents(290.5)).toBe(29050);
  });

  it("always returns an integer", () => {
    const result = toCents(291.337);
    expect(Number.isInteger(result)).toBe(true);
  });
});
