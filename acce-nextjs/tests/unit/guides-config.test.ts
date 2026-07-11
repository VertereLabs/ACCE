import { afterEach, describe, expect, it, vi } from "vitest";
import {
  GUIDE_PUBLISH_STATUS,
  GUIDE_PDF_PUBLISH_STATUS,
  isGuidePublished,
  isGuidePdfPublished,
} from "@/config/guides";

/**
 * The publish gate is the only real business logic on the site: it decides whether a
 * guide is live in production. These tests lock in both branches (dev = everything open,
 * prod = flag-driven) because getting this wrong either leaks unfinished content or hides
 * finished content.
 *
 * NODE_ENV during Vitest is "test" (not "development"), so the top-level import below
 * exercises the production branch. The dev branch is covered via a re-import with a
 * stubbed env.
 */
describe("isGuidePublished — production behavior (NODE_ENV != development)", () => {
  afterEach(() => {
    // Restore any flags mutated within a test.
    GUIDE_PUBLISH_STATUS.groups = false;
    GUIDE_PUBLISH_STATUS["ifrs-15"] = false;
    GUIDE_PUBLISH_STATUS["ifrs-16"] = false;
  });

  it("knows about exactly the three guide series", () => {
    expect(Object.keys(GUIDE_PUBLISH_STATUS).sort()).toEqual([
      "groups",
      "ifrs-15",
      "ifrs-16",
    ]);
  });

  it("publishes the three reviewed guides (released state)", () => {
    GUIDE_PUBLISH_STATUS.groups = true;
    GUIDE_PUBLISH_STATUS["ifrs-15"] = true;
    GUIDE_PUBLISH_STATUS["ifrs-16"] = true;
    expect(isGuidePublished("groups")).toBe(true);
    expect(isGuidePublished("ifrs-15")).toBe(true);
    expect(isGuidePublished("ifrs-16")).toBe(true);
  });

  it("shows a guide once its flag is flipped to true", () => {
    GUIDE_PUBLISH_STATUS["ifrs-16"] = true;
    expect(isGuidePublished("ifrs-16")).toBe(true);
    // Flipping one guide must not leak into the others.
    expect(isGuidePublished("groups")).toBe(false);
  });

  it("treats unknown guide ids as unpublished (safe default)", () => {
    expect(isGuidePublished("does-not-exist")).toBe(false);
    expect(isGuidePublished("")).toBe(false);
  });
});

describe("isGuidePublished — development behavior (NODE_ENV = development)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("treats every guide (even unknown ones) as published in dev", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.resetModules();
    const devModule = await import("@/config/guides");

    expect(devModule.isDev).toBe(true);
    expect(devModule.isGuidePublished("groups")).toBe(true);
    expect(devModule.isGuidePublished("ifrs-15")).toBe(true);
    expect(devModule.isGuidePublished("anything-at-all")).toBe(true);
  });
});

describe("isGuidePdfPublished: production behavior (NODE_ENV != development)", () => {
  afterEach(() => {
    // Restore any PDF flags mutated within a test.
    GUIDE_PDF_PUBLISH_STATUS.groups = false;
    GUIDE_PDF_PUBLISH_STATUS["ifrs-15"] = false;
    GUIDE_PDF_PUBLISH_STATUS["ifrs-16"] = false;
  });

  it("covers exactly the three guide series in the PDF map", () => {
    expect(Object.keys(GUIDE_PDF_PUBLISH_STATUS).sort()).toEqual([
      "groups",
      "ifrs-15",
      "ifrs-16",
    ]);
  });

  it("blocks all three PDFs in the current shipped/production state", () => {
    expect(isGuidePdfPublished("groups")).toBe(false);
    expect(isGuidePdfPublished("ifrs-15")).toBe(false);
    expect(isGuidePdfPublished("ifrs-16")).toBe(false);
  });

  it("treats unknown and empty guide ids as unpublished (safe default)", () => {
    expect(isGuidePdfPublished("does-not-exist")).toBe(false);
    expect(isGuidePdfPublished("")).toBe(false);
  });

  it("releases only the flipped PDF without leaking to others", () => {
    GUIDE_PDF_PUBLISH_STATUS["ifrs-16"] = true;
    expect(isGuidePdfPublished("ifrs-16")).toBe(true);
    expect(isGuidePdfPublished("groups")).toBe(false);
    expect(isGuidePdfPublished("ifrs-15")).toBe(false);
  });

  it("AC1 independence: page-published while PDF-unpublished (core guarantee)", () => {
    // Flip the page flag to true; leave the PDF flag false.
    GUIDE_PUBLISH_STATUS["ifrs-16"] = true;
    GUIDE_PDF_PUBLISH_STATUS["ifrs-16"] = false;

    expect(isGuidePublished("ifrs-16")).toBe(true);
    expect(isGuidePdfPublished("ifrs-16")).toBe(false);

    // Restore the page flag (PDF flag reset happens in afterEach above).
    GUIDE_PUBLISH_STATUS["ifrs-16"] = false;
  });
});

describe("isGuidePdfPublished: development behavior (NODE_ENV = development)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("treats every PDF (even unknown ones) as published in dev", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.resetModules();
    const devModule = await import("@/config/guides");

    expect(devModule.isDev).toBe(true);
    expect(devModule.isGuidePdfPublished("groups")).toBe(true);
    expect(devModule.isGuidePdfPublished("ifrs-15")).toBe(true);
    expect(devModule.isGuidePdfPublished("anything-at-all")).toBe(true);
  });
});
