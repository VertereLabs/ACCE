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
 *   singleton — AD-2) and writes a SIGNED session cookie into Playwright storageState.
 *   Better Auth's `requireSession()` / `requireAdmin()` guards read this cookie via
 *   `getSignedCookie`, VERIFY its HMAC signature against BETTER_AUTH_SECRET, strip the
 *   signature to recover the token, look up the session row by that token, and
 *   authorise the request — this IS the genuine Better Auth session path, populated
 *   via DB rather than via a magic-link HTTP flow. Zero production auth surface added.
 *
 * CRITICAL — the cookie value MUST be signed, not the raw token:
 *   Better Auth sets the session cookie with `setSignedCookie(name, token, secret)`
 *   (better-auth/dist/cookies/index.mjs) and reads it with `getSignedCookie`
 *   (better-call/dist/context.mjs), which REJECTS any value that is not
 *   `encodeURIComponent(`${token}.${base64(HMAC_SHA256(token, secret))}`)` — the
 *   signature must be 44 base64 chars ending in `=`. Writing the bare UUID token as
 *   the cookie value makes `getSignedCookie` return null → `getSession` returns null →
 *   the guard redirects to /sign-in and the "authenticated" 200 never happens.
 *   We therefore replicate `signCookieValue` here (Node HMAC-SHA256, base64, then
 *   encodeURIComponent) using the SAME BETTER_AUTH_SECRET the running server uses.
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

/**
 * Produces the SIGNED cookie value Better Auth expects for a given raw session token.
 *
 * Mirrors better-call's `signCookieValue` exactly:
 *   makeSignature(value, secret) = base64( HMAC-SHA256(value, secret) )
 *   signCookieValue(value)       = encodeURIComponent(`${value}.${signature}`)
 *
 * Node's `createHmac('sha256', secret).digest('base64')` yields the same standard
 * base64 (44 chars incl. `=` padding) as better-call's `btoa(String.fromCharCode(...))`.
 * The secret MUST match the running server's BETTER_AUTH_SECRET or verification fails.
 *
 * Source: better-call/dist/crypto.mjs (makeSignature/signCookieValue),
 *         better-call/dist/context.mjs (getSignedCookie verification).
 */
function signSessionToken(rawToken: string, secret: string): string {
  const signature = crypto
    .createHmac("sha256", secret)
    .update(rawToken)
    .digest("base64");
  return encodeURIComponent(`${rawToken}.${signature}`);
}

/**
 * Writes a Playwright storageState JSON with a single SIGNED session cookie.
 * `rawToken` is the value stored in the `session.token` DB column; the cookie carries
 * its Better-Auth-signed form (see signSessionToken).
 */
function writeStorageState(
  filePath: string,
  rawToken: string,
  secret: string,
): void {
  const state = {
    cookies: [
      {
        name: SESSION_COOKIE_NAME,
        value: signSessionToken(rawToken, secret),
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

  // The session cookie is HMAC-signed with BETTER_AUTH_SECRET; without the EXACT
  // secret the running server uses, getSignedCookie fails verification, getSession
  // returns null, and every "authenticated" 200 silently degrades to a /sign-in
  // redirect. Fail fast (like the DATABASE_URL guard) rather than mint dead cookies.
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    throw new Error(
      "[globalSetup] BETTER_AUTH_SECRET is unset but DATABASE_URL is set.\n" +
        "  The authenticated e2e session cookie is HMAC-signed with BETTER_AUTH_SECRET —\n" +
        "  it MUST equal the secret the port-3100 server runs with, or Better Auth's\n" +
        "  getSignedCookie rejects the cookie and getSession returns null.\n" +
        "  Set BETTER_AUTH_SECRET (same value for globalSetup and the webServer) in CI.",
    );
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

    writeStorageState(STUDENT_STATE_PATH, studentToken, secret);
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

    writeStorageState(ADMIN_STATE_PATH, adminToken, secret);
    console.log("✅ [globalSetup] ADMIN session  → tests/e2e/.auth/admin.json");
  } finally {
    // Cleanly close the Prisma connection so globalSetup doesn't leave the process
    // hanging on an open pg Pool.
    await db.$disconnect();
  }
}

export default globalSetup;
