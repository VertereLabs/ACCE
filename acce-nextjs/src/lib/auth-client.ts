// Better Auth browser client — Story 1.2.
// No baseURL needed when the auth API is same-origin (/api/auth/[...all]).
// magicLinkClient augments authClient with authClient.signIn.magicLink().

import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [magicLinkClient()],
});

// Re-export the helpers used most widely across the portal UI.
export const { signIn, signOut, useSession } = authClient;
