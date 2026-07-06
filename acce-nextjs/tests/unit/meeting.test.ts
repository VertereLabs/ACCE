import { describe, expect, it } from "vitest";
import { ManualProvider, meetingProvider } from "@/lib/meeting";

/**
 * Unit tests for ManualProvider.getJoinDetail (AC3, AC4, AC5).
 *
 * ManualProvider is pure and db-free — no DATABASE_URL needed.
 * Tests the mode-gated reveal: ONLINE → url, IN_PERSON → location.
 */
describe("ManualProvider.getJoinDetail", () => {
  const provider = new ManualProvider();

  // ── ONLINE mode ─────────────────────────────────────────────────────────────

  it("returns ONLINE detail with url when mode is ONLINE and url is set", () => {
    const result = provider.getJoinDetail({
      mode: "ONLINE",
      meetingUrl: "https://meet.google.com/abc-defg-hij",
      location: null,
    });
    expect(result).toEqual({
      mode: "ONLINE",
      url: "https://meet.google.com/abc-defg-hij",
    });
  });

  it("returns ONLINE detail with url:null when mode is ONLINE and meetingUrl is null", () => {
    const result = provider.getJoinDetail({
      mode: "ONLINE",
      meetingUrl: null,
      location: null,
    });
    expect(result).toEqual({ mode: "ONLINE", url: null });
  });

  it("does not expose location for ONLINE mode even if location is set", () => {
    const result = provider.getJoinDetail({
      mode: "ONLINE",
      meetingUrl: "https://meet.google.com/test",
      location: "Cape Town Campus",
    });
    expect(result.mode).toBe("ONLINE");
    // Discriminated union — location field is not present on ONLINE variant.
    expect("location" in result).toBe(false);
  });

  // ── IN_PERSON mode ───────────────────────────────────────────────────────────

  it("returns IN_PERSON detail with location when mode is IN_PERSON and location is set", () => {
    const result = provider.getJoinDetail({
      mode: "IN_PERSON",
      meetingUrl: null,
      location: "42 Long Street, Cape Town",
    });
    expect(result).toEqual({
      mode: "IN_PERSON",
      location: "42 Long Street, Cape Town",
    });
  });

  it("returns IN_PERSON detail with location:null when mode is IN_PERSON and location is null", () => {
    const result = provider.getJoinDetail({
      mode: "IN_PERSON",
      meetingUrl: null,
      location: null,
    });
    expect(result).toEqual({ mode: "IN_PERSON", location: null });
  });

  it("does not expose meetingUrl for IN_PERSON mode even if meetingUrl is set", () => {
    const result = provider.getJoinDetail({
      mode: "IN_PERSON",
      meetingUrl: "https://meet.google.com/orphan",
      location: "Johannesburg Hub",
    });
    expect(result.mode).toBe("IN_PERSON");
    // Discriminated union — url field is not present on IN_PERSON variant.
    expect("url" in result).toBe(false);
  });
});

// ── Singleton ──────────────────────────────────────────────────────────────────

describe("meetingProvider singleton", () => {
  it("is an instance of ManualProvider (AC3 — ManualProvider for 1a)", () => {
    expect(meetingProvider).toBeInstanceOf(ManualProvider);
  });

  it("delegates getJoinDetail correctly (integration of singleton with ManualProvider)", () => {
    const result = meetingProvider.getJoinDetail({
      mode: "ONLINE",
      meetingUrl: "https://meet.google.com/singleton-test",
      location: null,
    });
    expect(result).toEqual({
      mode: "ONLINE",
      url: "https://meet.google.com/singleton-test",
    });
  });
});
