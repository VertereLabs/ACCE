import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Per-guide page publish status: must stay in sync with src/config/guides.ts
 * (GUIDE_PUBLISH_STATUS). Duplicated here because middleware runs in the Edge
 * runtime and has restricted import capabilities in some Next.js versions.
 */
const GUIDE_PUBLISH_STATUS: Record<string, boolean> = {
    groups: false,
    "ifrs-15": false,
    "ifrs-16": false,
};

/**
 * Per-guide PDF publish status: must stay in sync with src/config/guides.ts
 * (GUIDE_PDF_PUBLISH_STATUS). Independent of the page gate: a page can be
 * public while its PDF remains held.
 */
const GUIDE_PDF_PUBLISH_STATUS: Record<string, boolean> = {
    groups: false,
    "ifrs-15": false,
    "ifrs-16": false,
};

/** Maps a downloadable PDF filename to its guide id (kept private until live). */
const PDF_TO_GUIDE: Record<string, string> = {
    "groups-business-combinations.pdf": "groups",
    "ifrs-15-revenue.pdf": "ifrs-15",
    "ifrs-16-leases.pdf": "ifrs-16",
};

/**
 * Blocks direct access to unpublished guide pages AND their PDFs in the public
 * deploy. The REVIEW path (NEXT_PUBLIC_GUIDES_PREVIEW=true) and development
 * leave everything open.
 */
export function middleware(request: NextRequest) {
    if (
        process.env.NODE_ENV === "development" ||
        process.env.NEXT_PUBLIC_GUIDES_PREVIEW === "true"
    ) {
        return NextResponse.next();
    }

    const pathname = request.nextUrl.pathname;

    // Guide pages: /guides/<id>/...
    const guideMatch = pathname.match(/^\/guides\/([^/]+)/);
    if (guideMatch) {
        const guideId = guideMatch[1];
        if (guideId in GUIDE_PUBLISH_STATUS && !GUIDE_PUBLISH_STATUS[guideId]) {
            return NextResponse.redirect(new URL("/guides", request.url));
        }
        return NextResponse.next();
    }

    // Guide PDFs: /pdfs/<file>.pdf
    const pdfMatch = pathname.match(/^\/pdfs\/([^/]+\.pdf)$/i);
    if (pdfMatch) {
        const guideId = PDF_TO_GUIDE[pdfMatch[1].toLowerCase()];
        if (guideId && !GUIDE_PDF_PUBLISH_STATUS[guideId]) {
            return NextResponse.redirect(new URL("/guides", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/guides/:path+", "/pdfs/:path*"],
};
