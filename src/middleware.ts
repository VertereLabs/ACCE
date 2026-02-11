import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Per-guide publish status — must stay in sync with src/config/guides.ts.
 * Duplicated here because middleware runs in the Edge runtime and has
 * restricted import capabilities in some Next.js versions.
 */
const GUIDE_PUBLISH_STATUS: Record<string, boolean> = {
    groups: false,
    "ifrs-15": false,
    "ifrs-16": false,
};

/**
 * Blocks direct URL access to unpublished guide pages in production.
 * In development, all guides are accessible.
 */
export function middleware(request: NextRequest) {
    if (process.env.NODE_ENV === "development") {
        return NextResponse.next();
    }

    const pathname = request.nextUrl.pathname;
    const match = pathname.match(/^\/guides\/([^/]+)/);
    if (!match) return NextResponse.next();

    const guideId = match[1];

    if (guideId in GUIDE_PUBLISH_STATUS && !GUIDE_PUBLISH_STATUS[guideId]) {
        return NextResponse.redirect(new URL("/guides", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/guides/:path+",
};
