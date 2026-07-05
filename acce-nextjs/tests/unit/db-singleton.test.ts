/**
 * Story 1.1 AC1 — Single Prisma gateway.
 *
 * Verifies that:
 *   1. `src/lib/db.ts` exports a usable `db` object (PrismaClient-shaped).
 *   2. Multiple imports return the SAME instance (singleton / no extra clients).
 *   3. The module throws a helpful error when DATABASE_URL is missing.
 *
 * Heavy DB integration tests (real-Postgres, concurrency) belong to Epic 3/4.
 * This suite is intentionally light — schema + config story only.
 */

import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";

// ─── Mock the native dependencies so no real connection is opened ─────────────

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    _brand: "MockPrismaClient",
    $connect: vi.fn(),
    $disconnect: vi.fn(),
  })),
}));

vi.mock("@prisma/adapter-pg", () => ({
  PrismaPg: vi.fn().mockImplementation(() => ({ _brand: "MockPrismaPg" })),
}));

vi.mock("pg", () => ({
  Pool: vi.fn().mockImplementation(() => ({ _brand: "MockPool", end: vi.fn() })),
}));

// ─── Ensure DATABASE_URL is defined for singleton tests ───────────────────────

beforeAll(() => {
  // Use the real env var if present (CI / local dev with .env); fall back to a
  // dummy URL for plain unit runs where DATABASE_URL may not be loaded.
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
  }
});

// ─────────────────────────────────────────────────────────────────────────────

describe("db singleton — AC1 (Story 1.1)", () => {
  afterEach(() => {
    // Reset module registry so each test can re-import a fresh module instance.
    vi.resetModules();
  });

  it("exports a defined db object", async () => {
    const { db } = await import("@/lib/db");
    expect(db).toBeDefined();
  });

  it("returns the same PrismaClient instance on repeated imports", async () => {
    // Both imports within this test hit the same module cache → same object ref.
    const { db: first } = await import("@/lib/db");
    const { db: second } = await import("@/lib/db");
    expect(first).toBe(second);
  });

  it("throws a descriptive error when DATABASE_URL is not set", async () => {
    const saved = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    try {
      // vi.resetModules() was already called in afterEach of the previous test;
      // the beforeAll of THIS test also reset it, so we get a fresh module load.
      await expect(import("@/lib/db")).rejects.toThrow("DATABASE_URL is not set");
    } finally {
      // Always restore so subsequent tests are unaffected.
      process.env.DATABASE_URL = saved;
    }
  });
});
