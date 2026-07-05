// Better Auth browser client — Stories 1.2 (magic-link) + 1.3 (adminClient for role parity).
// No baseURL needed when the auth API is same-origin (/api/auth/[...all]).
// magicLinkClient augments authClient with authClient.signIn.magicLink().
// adminClient surfaces role/ban metadata on the client session (plugin parity with server).

import { createAuthClient } from "better-auth/react";
import { adminClient, magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    magicLinkClient(),
    adminClient(), // Story 1.3: client/server plugin parity; guards read the server session
  ],
});

// Re-export the helpers used most widely across the portal UI.
export const { signIn, signOut, useSession } = authClient;
