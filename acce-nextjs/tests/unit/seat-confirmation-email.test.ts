import { describe, expect, it } from "vitest";
import { buildSeatConfirmationHtml, type SeatConfirmationData } from "@/lib/email";
import { formatZar } from "@/lib/class-display";

/**
 * Unit tests for buildSeatConfirmationHtml (AC1, AC4, AC5).
 *
 * The function is pure and db-free — no DATABASE_URL needed.
 * Tests:
 *   - Class title, subject, and price are present in the output.
 *   - Date is formatted (non-empty string containing the year).
 *   - ONLINE with url → clickable href to the url; no location text.
 *   - ONLINE with url:null → graceful fallback line; no href.
 *   - IN_PERSON with location → location text; no Meet link href.
 *   - HTML injection safety (escapeHtml / escapeHtmlAttr).
 */

const BASE_DATE = new Date("2026-09-15T10:00:00.000Z");

function buildData(overrides: Partial<SeatConfirmationData> = {}): SeatConfirmationData {
  return {
    studentName: "Jane Doe",
    classTitle: "FAC 301 Revision",
    subjectName: "Financial Accounting",
    startsAt: BASE_DATE,
    join: { mode: "ONLINE", url: "https://meet.google.com/abc-defg-hij" },
    priceCents: 29000,
    ...overrides,
  };
}

describe("buildSeatConfirmationHtml — content", () => {
  it("contains the class title", () => {
    const html = buildSeatConfirmationHtml(buildData());
    expect(html).toContain("FAC 301 Revision");
  });

  it("contains the subject name", () => {
    const html = buildSeatConfirmationHtml(buildData());
    expect(html).toContain("Financial Accounting");
  });

  it("contains the formatted price (formatZar)", () => {
    const html = buildSeatConfirmationHtml(buildData({ priceCents: 29000 }));
    expect(html).toContain(formatZar(29000)); // "R290.00"
  });

  it("contains a formatted date string with the year", () => {
    const html = buildSeatConfirmationHtml(buildData());
    // The date should contain the year "2026" at minimum.
    expect(html).toContain("2026");
  });

  it("contains the student name in the greeting", () => {
    const html = buildSeatConfirmationHtml(buildData({ studentName: "Alice Smith" }));
    expect(html).toContain("Alice Smith");
  });

  it("is valid HTML with a doctype", () => {
    const html = buildSeatConfirmationHtml(buildData());
    expect(html).toMatch(/^<!DOCTYPE html>/i);
  });
});

describe("buildSeatConfirmationHtml — ONLINE mode with url", () => {
  it("renders an href to the Meet url", () => {
    const url = "https://meet.google.com/abc-defg-hij";
    const html = buildSeatConfirmationHtml(
      buildData({ join: { mode: "ONLINE", url } }),
    );
    expect(html).toContain(`href="${url}"`);
  });

  it("renders the url as link text", () => {
    const url = "https://meet.google.com/abc-defg-hij";
    const html = buildSeatConfirmationHtml(
      buildData({ join: { mode: "ONLINE", url } }),
    );
    expect(html).toContain(url);
  });

  it("does not render a location section for ONLINE mode", () => {
    const html = buildSeatConfirmationHtml(
      buildData({ join: { mode: "ONLINE", url: "https://meet.google.com/xyz" } }),
    );
    // No in-person location heading should appear.
    expect(html).not.toContain("In-person class");
    expect(html).not.toContain("Location:");
  });
});

describe("buildSeatConfirmationHtml — ONLINE mode with null url (fallback)", () => {
  it("renders the fallback line when url is null", () => {
    const html = buildSeatConfirmationHtml(
      buildData({ join: { mode: "ONLINE", url: null } }),
    );
    expect(html).toContain("The joining link will be shared before the class");
  });

  it("does NOT render an href when url is null (no broken link)", () => {
    const html = buildSeatConfirmationHtml(
      buildData({ join: { mode: "ONLINE", url: null } }),
    );
    expect(html).not.toContain('href="');
  });
});

describe("buildSeatConfirmationHtml — IN_PERSON mode", () => {
  it("renders the location text for IN_PERSON mode", () => {
    const html = buildSeatConfirmationHtml(
      buildData({ join: { mode: "IN_PERSON", location: "42 Long Street, Cape Town" } }),
    );
    expect(html).toContain("42 Long Street, Cape Town");
  });

  it("does NOT render a Meet link href for IN_PERSON mode", () => {
    const html = buildSeatConfirmationHtml(
      buildData({ join: { mode: "IN_PERSON", location: "Joburg Campus" } }),
    );
    expect(html).not.toContain("meet.google.com");
    expect(html).not.toContain("href=");
  });

  it("renders graceful fallback when IN_PERSON location is null", () => {
    const html = buildSeatConfirmationHtml(
      buildData({ join: { mode: "IN_PERSON", location: null } }),
    );
    expect(html).toContain("Location to be confirmed");
  });
});

describe("buildSeatConfirmationHtml — HTML injection safety (AC4)", () => {
  it("escapes < and > in class title", () => {
    const html = buildSeatConfirmationHtml(
      buildData({ classTitle: "<script>alert(1)</script>" }),
    );
    // The raw injection string must not appear.
    expect(html).not.toContain("<script>");
    // Escaped entities must appear instead.
    expect(html).toContain("&lt;script&gt;");
  });

  it("escapes & in subject name", () => {
    const html = buildSeatConfirmationHtml(
      buildData({ subjectName: "Audit & Assurance" }),
    );
    expect(html).toContain("Audit &amp; Assurance");
  });

  it("escapes \" in student name", () => {
    const html = buildSeatConfirmationHtml(
      buildData({ studentName: 'Jane "The Best" Doe' }),
    );
    expect(html).not.toContain('"The Best"');
    expect(html).toContain("Jane");
  });

  it("escapes the Meet url in href attribute (escapeHtmlAttr)", () => {
    // A url with a double-quote would break the href attribute.
    const maliciousUrl = 'https://meet.google.com/a"onclick="alert(1)';
    const html = buildSeatConfirmationHtml(
      buildData({ join: { mode: "ONLINE", url: maliciousUrl } }),
    );
    // The raw quote should not appear unescaped inside the href.
    expect(html).not.toContain(`href="${maliciousUrl}"`);
    // The entity form should be used.
    expect(html).toContain("&quot;");
  });

  it("escapes IN_PERSON location containing <script>", () => {
    const html = buildSeatConfirmationHtml(
      buildData({
        join: { mode: "IN_PERSON", location: "<script>alert('xss')</script>" },
      }),
    );
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
