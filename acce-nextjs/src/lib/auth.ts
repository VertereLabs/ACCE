// Better Auth server configuration — Story 1.2.
// Exports `auth` used by the catch-all route handler and server-side session reads.
// AD-2: uses the existing `db` singleton — never a new PrismaClient.
// AD-13: email delivery via src/lib/email.ts (native fetch, no SDK).

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/lib/db";
import { sendMagicLinkEmail } from "@/lib/email";

export const auth = betterAuth({
  // ── Data gateway (AD-2) ──────────────────────────────────────────────────────
  database: prismaAdapter(db, { provider: "postgresql" }),

  // ── Identity ─────────────────────────────────────────────────────────────────
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  // emailAndPassword is intentionally NOT enabled — passwordless only (AC1).

  // ── Trusted origins ──────────────────────────────────────────────────────────
  // Covers portal.accetutors.co.za → BETTER_AUTH_URL; marketing host is separate.
  trustedOrigins: [
    process.env.APP_URL ?? "",
    process.env.BETTER_AUTH_URL ?? "",
  ].filter(Boolean),

  // ── Rate limiting (AC4) ──────────────────────────────────────────────────────
  // `enabled: true` forces the limiter on in every environment (Better Auth defaults
  // it OFF in development, on in production). The email-bomb guard AC4 asks for lives
  // in `customRules` scoped to the magic-link SEND path so the intent is explicit and
  // does not accidentally throttle unrelated endpoints. The global window/max is a
  // sane per-IP fallback for general auth traffic (get-session, sign-out, ...) — a
  // low global `max` here would 429 co-located (shared-NAT) users on the session
  // endpoint once client-side session reads land in Story 1.3.
  rateLimit: {
    enabled: true,
    window: 60,   // seconds — general per-IP window for /api/auth/*
    max: 100,     // generous fallback for non-sensitive auth traffic
    customRules: {
      // AC4 email-bomb guard: 5 magic-link sends per 60s per IP.
      "/sign-in/magic-link": { window: 60, max: 5 },
    },
  },

  // ── Plugins ──────────────────────────────────────────────────────────────────
  // IMPORTANT: nextCookies() MUST be last — it sets Set-Cookie on the Next response
  // after all other plugins have run. Forgetting this means the session cookie is
  // never attached and login silently fails in the browser.
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendMagicLinkEmail(email, url);
      },
      expiresIn: 60 * 15, // 15 minutes (AC3)
      disableSignUp: false, // first-time = signup, existing = login (AC1)
    }),
    nextCookies(), // MUST be last
  ],
});
