/**
 * Per-guide publish control.
 *
 * Two deploy paths from one codebase:
 *  - PUBLIC (default): `npm run build` / normal deploy. Each guide has two
 *    independent gates: a page gate and a PDF gate. Only guides with `true`
 *    below are live; the rest show as "Coming Soon" and their pages or PDFs
 *    are blocked accordingly.
 *  - REVIEW: set `NEXT_PUBLIC_GUIDES_PREVIEW=true` (dev or a private preview
 *    deploy). ALL guides and PDFs are unlocked so content can be reviewed for
 *    accuracy before release, without exposing them on the public site.
 *
 * Page gate and PDF gate are independent: a guide page can be public while its
 * PDF remains held. When a guide is ready to go live, flip its value to `true`
 * in the relevant map (update the matching copy in `middleware.ts` too, it
 * cannot import this in the Edge runtime).
 */
export const GUIDE_PUBLISH_STATUS: Record<string, boolean> = {
    groups: true,
    "ifrs-15": true,
    "ifrs-16": true,
};

export const GUIDE_PDF_PUBLISH_STATUS: Record<string, boolean> = {
    groups: false,
    "ifrs-15": false,
    "ifrs-16": false,
};

export const isDev = process.env.NODE_ENV === "development";

/** REVIEW path: unlocks every guide without publishing them publicly. */
export const isGuidesPreview = process.env.NEXT_PUBLIC_GUIDES_PREVIEW === "true";

/** Returns true if the guide should be accessible to users */
export function isGuidePublished(guideId: string): boolean {
    if (isDev || isGuidesPreview) return true;
    return GUIDE_PUBLISH_STATUS[guideId] ?? false;
}

/** Returns true if the guide's downloadable PDF should be accessible to users. */
export function isGuidePdfPublished(guideId: string): boolean {
    if (isDev || isGuidesPreview) return true;
    return GUIDE_PDF_PUBLISH_STATUS[guideId] ?? false;
}

/** True when at least one guide is live to the public. */
export function anyGuidePublished(): boolean {
    return Object.keys(GUIDE_PUBLISH_STATUS).some(isGuidePublished);
}

/**
 * Guide catalog — single source of truth for guide metadata and the
 * guide↔subject taxonomy. Kept free of React/icon imports so the Edge
 * middleware and sitemap can consume it safely; the guides page maps each
 * `id` to its lucide icon locally.
 *
 * `subject` ties a guide to a subject spoke page. As new guides land (Tax,
 * MAF, Auditing), add them here with the right subject and they light up
 * automatically on the matching subject page and the guides index.
 */
export type GuideSubject = "accounting" | "tax" | "maf" | "auditing";

export interface GuideMeta {
    id: string;
    title: string;
    description: string;
    subject: GuideSubject;
    topics: string[];
    parts: number;
    difficulty: "Intermediate" | "Advanced";
    href: string;
}

export const GUIDES: GuideMeta[] = [
    {
        id: "groups",
        title: "Groups & Business Combinations",
        description:
            "Master consolidated financial statements with our comprehensive guide covering IFRS 3, IFRS 10, IAS 28, and more.",
        subject: "accounting",
        topics: ["Analysis of Equity", "Goodwill & NCI", "Consolidation Mechanics", "Fair Value Adjustments"],
        parts: 7,
        difficulty: "Advanced",
        href: "/guides/groups",
    },
    {
        id: "ifrs-15",
        title: "IFRS 15: Revenue",
        description:
            "Understand revenue recognition through the five-step model. From contract identification to complex scenarios.",
        subject: "accounting",
        topics: ["Five-Step Model", "Variable Consideration", "Principal vs Agent", "Performance Obligations"],
        parts: 5,
        difficulty: "Intermediate",
        href: "/guides/ifrs-15",
    },
    {
        id: "ifrs-16",
        title: "IFRS 16: Leases",
        description:
            "Navigate lessee and lessor accounting under IFRS 16. ROU assets, lease liabilities, and exemptions explained.",
        subject: "accounting",
        topics: ["Lessee Accounting", "Lessor Classification", "Sale and Leaseback", "Practical Expedients"],
        parts: 5,
        difficulty: "Intermediate",
        href: "/guides/ifrs-16",
    },
];

/**
 * Published guides for a subject, in catalog order. Empty when a subject has
 * no live guides yet (Tax, MAF, Auditing today) — callers show a pointer to
 * the main guides index in that case.
 */
export function getGuidesForSubject(subject: GuideSubject): GuideMeta[] {
    return GUIDES.filter((g) => g.subject === subject && isGuidePublished(g.id));
}
