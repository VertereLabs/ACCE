// Better Auth catch-all route handler — Story 1.2.
// Handles all /api/auth/* requests (magic-link send, verify, session, sign-out, etc.).
// toNextJsHandler bridges Better Auth's request/response to Next.js App Router conventions.

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth.handler);
