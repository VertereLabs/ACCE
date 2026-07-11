---
id: SPEC-seo-page-architecture
companions:
  - page-catalog.md
  - ../../planning-artifacts/ux-designs/ux-ACCE-2026-07-05/DESIGN.md
sources:
  - D:/Projects/ClaudeSEO/sites/accetutors/audits/2026-07-11_page-architecture-brief.md
---

> **Canonical contract.** This SPEC and the files in `companions:` are the complete, preservation-validated contract for what to build, test, and validate. Source documents listed in frontmatter are for traceability only — consult them only if you need narrative rationale or prose color this contract intentionally omits.

# ACCE SEO Page Architecture — Hub-and-Spoke Ranking Pages + Guide Release

## Why

**An opportunity to capture, blocked by a self-inflicted pain.** Every ACCE subject and qualification currently lives on a single URL — the homepage, with `#services`, `#group-classes`, `#about` anchors. Anchors are not separate pages, so Google has exactly **one** page to rank for Accounting, Tax, Auditing, Management Accounting & Finance, CTA *and* PGDA simultaneously. The result is confirmed in Search Console (first capture 2026-07-11): the homepage floats around position 20 for "accounting tutor", nothing else ranks, and only **2 URLs** (`/` and `/guides`) earn any impressions at all. Meanwhile the demand is real and already partly won — "cta tutors" sits at **position 3** with zero dedicated page behind it. Giving each query cluster its own dedicated, substantive, cross-linked page is the standard hub-and-spoke fix and the fastest available growth lever for the business. It matters now because the site is otherwise thin, the GSC baseline exists to measure against, and the work is marketing-only — it ships independently of the (never-run-live) student portal.

## Capabilities

- **CAP-1** — `/subjects` hub
  - **intent:** A visitor or crawler can reach one indexable page that introduces the four subjects and two qualifications and routes to each.
  - **success:** Page is live with a unique title and single H1, carries BreadcrumbList schema, and links to all four subject spokes plus `/cta-tutor` and `/pgda-tutor`.

- **CAP-2** — `/accounting-tutor` subject spoke *(Phase 1 — biggest volume)*
  - **intent:** A student searching "accounting tutor" (and variants) lands on a dedicated page about accounting tutoring rather than the generic homepage.
  - **success:** Page live with unique title/H1 and 700–900 words of differentiated content, Service + FAQPage JSON-LD, and cross-links; GSC eventually reports it as a distinct ranking URL for the accounting cluster.

- **CAP-3** — `/financial-management-tutor` subject spoke (MAF)
  - **intent:** A student searching "financial management tutor" / "management accounting tutor" reaches a dedicated MAF page targeting both namings.
  - **success:** Page live with unique title/H1, 700–900 words, Service + FAQPage JSON-LD, and cross-links.

- **CAP-4** — `/tax-tutor` subject spoke
  - **intent:** A student searching "tax tutor" / "taxation tutor" reaches a dedicated taxation page.
  - **success:** Page live with unique title/H1, 700–900 words, Service + FAQPage JSON-LD, and cross-links.

- **CAP-5** — `/auditing-tutor` subject spoke
  - **intent:** A student searching "auditing tutor" / "audit tutor" reaches a dedicated auditing page.
  - **success:** Page live with unique title/H1, 700–900 words, Service + FAQPage JSON-LD, and cross-links.

- **CAP-6** — `/cta-tutor` qualification hub *(Phase 1 — FLAGSHIP, already position 3)*
  - **intent:** A student searching "cta tutors" reaches a dedicated CTA hub that defends the existing rank and routes to the four subjects.
  - **success:** Page live with unique title/H1, 700–900 words, Course + FAQPage JSON-LD, and links to all four subject spokes plus `/pgda-tutor`; the "cta tutors" position holds at ≤3 or improves.

- **CAP-7** — `/pgda-tutor` qualification hub
  - **intent:** A student searching "pgda tutor" reaches a dedicated PGDA hub covering the PGDA → CTA → CA(SA) pathway and routing to the four subjects.
  - **success:** Page live with unique title/H1, 700–900 words, Course + FAQPage JSON-LD, and links to all four subject spokes plus `/cta-tutor`.

- **CAP-8** — Guide **web-page** release *(pending Luke's content review)*
  - **intent:** The finished study-guide **web pages** (`/guides/groups`, `/guides/ifrs-15`, `/guides/ifrs-16`) become publicly reachable so real expert content is indexable and can feed internal links to the subject pages. **PDFs are held back** — they are undergoing full content + structural review and stay gated.
  - **success:** Each reviewed guide's **page** is reachable in a public (non-preview) build, listed in the sitemap, and no longer redirects to the "Coming Soon" gate; its **PDF remains blocked** (middleware still redirects `/pdfs/<file>.pdf`) and the page's "Download PDF" CTA is hidden while the PDF is held. Release is gated on Luke completing the content-accuracy review.

- **CAP-9** — Navigation + internal-link matrix
  - **intent:** The site's navigation and internal links route users and authority to the new pages.
  - **success:** The navbar reaches every new page (Subjects → `/subjects`; Qualifications → `/cta-tutor`, `/pgda-tutor`); homepage Services cards gain "Learn more" links to their spokes; and every new page carries 2–4 internal links in/out per the link matrix in `page-catalog.md`.

- **CAP-10** — Per-page SEO metadata, JSON-LD & sitemap coverage
  - **intent:** Each new page is fully self-describing to crawlers and discoverable.
  - **success:** Every new page exports unique `title`/`description`/canonical/OpenGraph/Twitter (mirroring the homepage `metadata` pattern), injects valid page-appropriate JSON-LD, and is added to `src/app/sitemap.ts`.

- **CAP-11** — Measurement via the GSC pipeline
  - **intent:** The team can tell whether the new architecture is moving rankings.
  - **success:** On publish each new URL is submitted for indexing; each page's primary query is tracked monthly via the ClaudeSEO GSC snapshot against the 2026-07-11 baselines (accounting tutor 34 · financial management tutor 27 · cta tutors 3), and new URLs begin appearing in the GSC "Top Pages by Search" table.

- **CAP-12** — Site-wide em-dash cleanup
  - **intent:** Existing site copy is scrubbed of em dashes so the whole site (not just the new pages) reads in a human, non-AI voice.
  - **success:** Zero em-dash characters remain across rendered marketing copy and metadata (homepage components, guide pages and their part pages, and all page metadata), with meaning and tone preserved. Scope is em dashes only; en dashes in numeric ranges (for example "24–48h") are left alone.

## Constraints

- **Anti-doorway (load-bearing).** Every page carries 700–900 words of genuinely differentiated content — real syllabus detail plus exam technique. Templated near-duplicate pages are forbidden: they risk Google's scaled-content-abuse action and would undercut the entire effort.
- **Per-page SEO floor.** Exactly one `<h1>` per page; title ≤ ~60 characters; meta description ≤ ~155 characters; page-appropriate JSON-LD present (Service / Course / FAQPage / BreadcrumbList as assigned per page in `page-catalog.md`).
- **Drop ACCA.** Ignore ACCA queries (noise, not our market). Target the CA(SA) pipeline only: Accounting, MAF, Tax, Auditing, CTA, PGDA, plus undergraduate.
- **Keep the homepage sections.** New pages *rank*; homepage sections *convert*. Do not remove or restructure homepage sections when the spokes go live.
- **Additive only.** Existing flat marketing routes and their SEO/security headers remain unchanged — no regressions to current pages.
- **Mandatory hub↔spoke cross-linking.** Every new page carries 2–4 internal links in and out per the matrix; this is the mechanism that routes ranking authority to the spokes.
- **Reuse the existing design system.** Navy+gold `globals.css` tokens, shadcn primitives, existing `Navbar`/`Footer`, and the `Button` `hero` variant. No new palette or components. Follow the existing guide-page structure (`<Navbar/>` → content → `<Footer/>`).
- **Weave SA E-E-A-T context.** CA(SA), SAICA, ITC/APC board exams, and universities (UNISA, UCT, Wits, UJ, UP, Stellenbosch) for depth and authority.
- **No em dashes, site-wide (editorial).** Em dashes read as AI-generated and undercut the human, expert voice that E-E-A-T depends on. Use commas, colons, parentheses, or two sentences instead. Applies to all rendered copy and metadata across the whole site (existing pages, homepage components, guide pages and parts, and the new pages), not just the new pages. En dashes in numeric ranges are fine.
- **Guide page/PDF gating is decoupled.** Today one `GUIDE_PUBLISH_STATUS` flag drives *both* the `/guides/<id>` page and its `/pdfs/<file>.pdf`, in both `src/config/guides.ts` and `src/middleware.ts`. This must be split into two independent states — page-published and PDF-published — so a guide page can be public while its PDF stays blocked. Both files stay in sync (the Edge-runtime middleware can't import the config).
- **Conditional PDF download CTA.** A guide page's "Download PDF" button must be conditional on the PDF-published state — hidden/disabled while the PDF is held, otherwise it links to a middleware-redirected (gated) PDF and dead-ends at `/guides`.
- **Single release, not phased.** All pages, the full internal-link matrix, and the guide-page releases ship together. Build order may start with the flagship pages, but nothing ships partially: no internal link may point at an unbuilt page at release time.
- **Branch off `main`.** This is marketing-only work, built on `feat/seo-page-architecture` cut from `main`, independent of the `epic-6` portal branch. (Only `middleware.ts` differs between the two, and the guide-release changes must be applied to `main`'s copy.)

## Non-goals

- **Phase 3 promotions** — turning About / How It Works / Pricing / Contact into standalone pages, geo/university long-tail pages, and adding testimonials/results content. Later phase, out of scope here.
- **The student portal** — auth, booking, payments, and the feedback loop are a separate track and are not touched by this work.
- **ACCA content** of any kind.
- **Any new palette, design system, or component library.** Reuse only.
- **Removing or restructuring existing homepage sections.**

## Success signal

Target queries visibly climb toward page 1 on the monthly ClaudeSEO GSC snapshot — "cta tutors" defended at position ≤3, "accounting tutor" moving off 34 toward page 1, "financial management tutor" moving off 27 — while the GSC "Top Pages by Search" table grows from today's 2 URLs to the full set of new pages, each earning its own impressions. Concretely demonstrable: a crawl/indexing check shows each new URL indexed with unique title/H1/schema after publish-and-request-indexing.

## Assumptions

- The 7 new pages and the reviewed guide pages all ship in one release; the internal-link matrix is fully wired at release time (no link points at an unbuilt page).

## Open Questions

- _None remaining._ Both original questions resolved (recorded in `.memlog.md`): guide release is gated on Luke's content review and PDFs are held separately pending full content + structural review; and because everything ships in one release, `/subjects` exists at launch so the navbar repoints to `/subjects` + adds Qualifications with no interim state.
