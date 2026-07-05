/**
 * Playwright globalSetup — Story 1.5 (AC4).
 *
 * Provisions per-role Playwright storageState files so the authenticated smoke
 * (authenticated-smoke.spec.ts) can visit guarded (portal)/(admin) routes as a
 * real authenticated user without any test-only bypass route being added to
 * production code.
 *
 * Session strategy (AC4 — no production bypass):
 *   Creates valid Better Auth sessions directly in Postgres (via the shared `db`
 *   singleton — AD-2) and writes the session token as the `better-auth.session_token`
 *   cookie in Playwright storageState. Better Auth's `requireSession()` /
 *   `requireAdmin()` guards read this cookie, look up the session row by token, and
 *   authorise the request — this IS the genuine Better Auth session path, populated
 *   via DB rather than via a magic-link HTTP flow. Zero production auth surface added.
 *
 * Cookie name: `better-auth.session_token` (http:// on port 3100 — no `__Secure-`
 *   prefix). Production uses `__Secure-better-auth.session_token` (https). This
 *   distinction was the 1.3 code-review HIGH fix.
 *
 * Sandbox / no-DB handling (AC5 deferred posture):
 *   If DATABASE_URL is unset (sandbox), we write EMPTY storageState files so
 *   Playwright can load them without throwing "file not found", and print a clear
 *   message. The authenticated tests call `test.skip(!hasSession(...))` to skip
 *   gracefully. The public smoke (smoke.spec.ts) is unaffected.
 *   The live authenticated green run is deferred to a CI job with an ephemeral
 *   Postgres (same CI job that runs `prisma migrate deploy` — deferred-work.md:8).
 *
 * Roles provisioned:
 *   STUDENT — test-only user (test-student@e2e.local) created in setup, NOT seeded.
 *   ADMIN   — reuses the seeded Priyanka user (Story 1.4) via SEED_ADMIN_EMAIL env.
 */

import type { FullConfig } from "@playwright/test";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";

/** Directory that holds per-role storageState JSON files. Gitignored (session secrets). */
const AUTH_DIR = path.join(__dirname, ".auth");

/** Absolute paths consumed by test.use({ storageState }) in the spec. */
export const STUDENT_STATE_PATH = path.join(AUTH_DIR, "student.json");
export const ADMIN_STATE_PATH = path.join(AUTH_DIR, "admin.json");

/**
 * Cookie name for an http:// origin (port 3100 dev server).
 * Better Auth applies the `__Secure-` prefix only on https origins (production).
 * Source: Story 1.3 code-review HIGH fix — middleware __Secure- cookie prefix lockout.
 */
const SESSION_COOKIE_NAME = "better-auth.session_token";

/** Writes a Playwright storageState JSON with a single session cookie. */
function writeStorageState(filePath: string, sessionToken: string): void {
  const state = {
    cookies: [
      {
        name: SESSION_COOKIE_NAME,
        value: sessionToken,
        domain: "localhost",
        path: "/",
        expires: -1, // session cookie — valid for the duration of the Playwright context
        httpOnly: true,
        secure: false, // http:// on port 3100
        sameSite: "Lax" as const,
      },
    ],
    origins: [],
  };
  fs.writeFileSync(filePath, JSON.stringify(state, null, 2));
}

/**
 * Writes an empty (no-cookie) storageState so Playwright's `test.use({ storageState })`
 * doesn't throw "file not found" in the sandbox. Tests check `hasSession()` and skip.
 */
function writeEmptyState(filePath: string): void {
  fs.writeFileSync(
    filePath,
    JSON.stringify({ cookies: [], origins: [] }, null, 2),
  );
}

async function globalSetup(_config: FullConfig): Promise<void> {
  // Always create the .auth/ directory so storageState file paths are loadable.
  fs.mkdirSync(AUTH_DIR, { recursive: true });

  if (!process.env.DATABASE_URL) {
    // Sandbox: no Postgres. Write empty state files so Playwright doesn't throw
    // on `test.use({ storageState })`. The authenticated specs skip via `hasSession()`.
    console.warn(
      "\n⚠️  [globalSetup] DATABASE_URL is unset.\n" +
        "   Writing empty auth state files — authenticated specs will be SKIPPED.\n" +
        "   To run the authenticated smoke, set DATABASE_URL and run with an\n" +
        "   ephemeral Postgres (deferred to CI — see deferred-work.md:8).\n",
    );
    writeEmptyState(STUDENT_STATE_PATH);
    writeEmptyState(ADMIN_STATE_PATH);
    return;
  }

  // DATABASE_URL is set — provision real sessions.
  // Dynamic import AFTER the guard so db.ts (which throws on missing DATABASE_URL)
  // is never loaded in the sandbox.
  // AD-2: use the singleton from src/lib/db — never `new PrismaClient()` directly.
  const { db } = await import("@/lib/db");

  const now = new Date();
  // Sessions expire in 30 days — long enough for CI runs; shorter than prod (90 days).
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  try {
    // ── STUDENT session ────────────────────────────────────────────────────────
    // Create (or idempotently update) the e2e-only test STUDENT user.
    // This user is NOT added to prisma/seed.ts — it is a setup-only artifact.
    const studentEmail = "test-student@e2e.local";
    const studentId = "e2e-test-student";

    await db.user.upsert({
      where: { email: studentEmail },
      create: {
        id: studentId,
        name: "E2E Test Student",
        email: studentEmail,
        emailVerified: true,
        role: "STUDENT",
      },
      update: {
        // Re-run safety: ensure role stays STUDENT (not accidentally promoted).
        role: "STUDENT",
      },
    });

    const studentToken = crypto.randomUUID();
    await db.session.create({
      data: {
        id: crypto.randomUUID(),
        token: studentToken,
        userId: studentId,
        expiresAt,
      },
    });

    writeStorageState(STUDENT_STATE_PATH, studentToken);
    console.log("✅ [globalSetup] STUDENT session → tests/e2e/.auth/student.json");

    // ── ADMIN session ──────────────────────────────────────────────────────────
    // Reuse the seeded Priyanka ADMIN user (Story 1.4 — prisma/seed.ts).
    // Do NOT create an admin in setup; seeding is the canonical source of admin users.
    const adminEmail =
      process.env.SEED_ADMIN_EMAIL ?? "priyankamikaya21@gmail.com";
    const adminUser = await db.user.findUnique({ where: { email: adminEmail } });

    if (!adminUser) {
      throw new Error(
        `[globalSetup] ADMIN user not found (${adminEmail}).\n` +
          "  Run `npm run db:seed` before the authenticated e2e suite.\n" +
          "  Story 1.4 seeds Priyanka as the ADMIN user.",
      );
    }

    if (adminUser.role !== "ADMIN") {
      throw new Error(
        `[globalSetup] User ${adminEmail} exists but role="${adminUser.role}" (expected "ADMIN").\n` +
          "  Ensure `npm run db:seed` ran successfully (Story 1.4).",
      );
    }

    const adminToken = crypto.randomUUID();
    await db.session.create({
      data: {
        id: crypto.randomUUID(),
        token: adminToken,
        userId: adminUser.id,
        expiresAt,
      },
    });

    writeStorageState(ADMIN_STATE_PATH, adminToken);
    console.log("✅ [globalSetup] ADMIN session  → tests/e2e/.auth/admin.json");
  } finally {
    // Cleanly close the Prisma connection so globalSetup doesn't leave the process
    // hanging on an open pg Pool.
    await db.$disconnect();
  }
}

export default globalSetup;
