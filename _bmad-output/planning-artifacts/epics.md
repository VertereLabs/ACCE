---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/specs/spec-seo-page-architecture/SPEC.md
  - _bmad-output/specs/spec-seo-page-architecture/page-catalog.md
  - docs/architecture.md
  - _bmad-output/planning-artifacts/ux-designs/ux-ACCE-2026-07-05/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-ACCE-2026-07-05/EXPERIENCE.md
  - D:/Projects/ClaudeSEO/sites/accetutors/audits/2026-07-11_page-architecture-brief.md
---

# ACCE - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for ACCE, decomposing the requirements from the SEO Page Architecture SPEC (acting as the PRD for this scoped marketing work), the UX design spine (design-system constraints), and the current site Architecture into implementable stories.

Scope: a **single-shot release** of a hub-and-spoke SEO page architecture (7 new pages), a decoupled guide-page release (PDFs held), a navigation + internal-link matrix, per-page SEO metadata/JSON-LD/sitemap coverage, GSC measurement wiring, and a site-wide em-dash cleanup. Marketing-only, on `feat/seo-page-architecture` (cut from `main`), independent of the portal branch.

## Requirements Inventory

### Functional Requirements

FR1: `/subjects` hub page — one indexable page that introduces the four subjects and two qualifications; unique title, single `<h1>`, BreadcrumbList JSON-LD, links to all four subject spokes plus `/cta-tutor` and `/pgda-tutor`. (CAP-1)

FR2: `/accounting-tutor` subject spoke (Phase-1, biggest volume) — dedicated page with unique title/H1, 700–900 words of differentiated accounting-tutoring content, Service + FAQPage JSON-LD, and the assigned cross-links. (CAP-2)

FR3: `/financial-management-tutor` (MAF) subject spoke — targets both "financial management tutor" and "management accounting tutor" namings; unique title/H1, 700–900 words, Service + FAQPage JSON-LD, cross-links. (CAP-3)

FR4: `/tax-tutor` subject spoke — dedicated taxation page; unique title/H1, 700–900 words, Service + FAQPage JSON-LD, cross-links. (CAP-4)

FR5: `/auditing-tutor` subject spoke — dedicated auditing page; unique title/H1, 700–900 words, Service + FAQPage JSON-LD, cross-links. (CAP-5)

FR6: `/cta-tutor` qualification hub (FLAGSHIP, already position 3) — unique title/H1, 700–900 words, Course + FAQPage JSON-LD, links to all four subject spokes plus `/pgda-tutor`; defends/holds the "cta tutors" rank at ≤3. (CAP-6)

FR7: `/pgda-tutor` qualification hub — covers the PGDA → CTA → CA(SA) pathway; unique title/H1, 700–900 words, Course + FAQPage JSON-LD, links to all four subject spokes plus `/cta-tutor`. (CAP-7)

FR8: Decouple guide page-gating from PDF-gating — split the single `GUIDE_PUBLISH_STATUS` into two independent states (page-published and PDF-published) so a guide page can be public while its PDF stays blocked; implemented in both `src/config/guides.ts` (add `GUIDE_PDF_PUBLISH_STATUS` + `isGuidePdfPublished(id)`) and `src/middleware.ts` (mirrored maps, Edge runtime can't import config). (CAP-8)

FR9: Release reviewed guide **pages** — set page state → published for each guide Luke has reviewed (`groups`, `ifrs-15`, `ifrs-16`) so each page is reachable in a public (non-preview) build and appears in the sitemap; the guide **PDFs** stay blocked (middleware still redirects `/pdfs/<file>.pdf`). Release is gated on Luke completing the content-accuracy review. (CAP-8)

FR10: Conditional "Download PDF" CTA — a guide page's Download-PDF button renders only when `isGuidePdfPublished(id)` is true; while the PDF is held it is hidden/disabled (optionally a "PDF coming soon" note). (CAP-8)

FR11: Navbar repoint — change `Subjects → /#services` to `Subjects → /subjects` and add a Qualifications entry reaching `/cta-tutor` and `/pgda-tutor`, so the navbar reaches every new page. (CAP-9)

FR12: Homepage Services cards gain a "Learn more →" link to their subject spoke; add a short Qualifications mention linking `/cta-tutor` and `/pgda-tutor`. (CAP-9)

FR13: Wire the full internal-link matrix — every new page carries 2–4 internal links in and out per the directed matrix in `page-catalog.md`; `/accounting-tutor` additionally links to relevant IFRS guides. (CAP-9)

FR14: Per-page SEO metadata — each new page exports unique `title`, `description`, `alternates.canonical`, OpenGraph and Twitter metadata, mirroring the homepage `metadata` shape. (CAP-10)

FR15: Per-page JSON-LD — each new page injects valid page-appropriate structured data (Service / Course / FAQPage / BreadcrumbList as assigned per page in `page-catalog.md`). (CAP-10)

FR16: Sitemap coverage — all seven new routes are added to `src/app/sitemap.ts`. (CAP-10)

FR17: GSC measurement — on publish, each new URL is submitted for indexing (URL Inspection → Request Indexing); each page's primary query is tracked monthly via the ClaudeSEO GSC snapshot against the 2026-07-11 baselines (accounting tutor 34, financial management tutor 27, cta tutors 3). (CAP-11)

FR18: Site-wide em-dash cleanup — remove every em-dash character from rendered marketing copy and metadata (homepage components, guide pages and their part pages, all page metadata), preserving meaning and tone; scope is em dashes only (en dashes in numeric ranges such as "24–48h" are left alone). (CAP-12)

### NonFunctional Requirements

NFR1: Anti-doorway (load-bearing) — every new page carries 700–900 words of genuinely differentiated content (real syllabus detail + exam technique). Templated near-duplicate pages are forbidden (scaled-content-abuse risk).

NFR2: Per-page SEO floor — exactly one `<h1>` per page; title ≤ ~60 characters; meta description ≤ ~155 characters; page-appropriate JSON-LD present and valid.

NFR3: E-E-A-T depth — weave South African context (CA(SA), SAICA, ITC/APC board exams, universities UNISA/UCT/Wits/UJ/UP/Stellenbosch) into page content for authority.

NFR4: Additive-only, no regressions — existing flat marketing routes and their SEO/security headers remain unchanged; homepage sections are not removed or restructured (new pages rank, homepage sections convert).

NFR5: Reuse the existing design system — navy+gold `globals.css` tokens, shadcn primitives, existing `Navbar`/`Footer`, and the `Button` `hero`/accent variants. No new palette or components. Follow the existing guide-page structure (`<Navbar/>` → content → `<Footer/>`).

NFR6: No em dashes site-wide (editorial voice) — em dashes read as AI-generated and undercut the human, expert E-E-A-T voice; use commas, colons, parentheses, or two sentences. Applies to all rendered copy and metadata across the whole site.

NFR7: Single release, not phased — all pages, the full internal-link matrix, and the guide-page releases ship together. Build order may start with flagship pages, but nothing ships partially: no internal link may point at an unbuilt page at release time.

NFR8: Accessibility floor (from the UX spine) — one `<h1>` and correct heading hierarchy per page; body-text contrast ≥ 4.5:1 and large display ≥ 3:1 in both dark and light modes; visible focus ring on all interactive elements; ≥44px touch targets; decorative icons `aria-hidden` with text labels carrying meaning.

### Additional Requirements

- **Framework/pattern:** New routes are Next.js 16 App Router server components under `acce-nextjs/src/app/{subjects,accounting-tutor,financial-management-tutor,tax-tutor,auditing-tutor,cta-tutor,pgda-tutor}/page.tsx`, each exporting `metadata` and rendering `<Navbar/> → content → <Footer/>` (mirroring existing guide pages). Consider a shared marketing `layout.tsx` so Navbar/Footer aren't repeated.
- **No content/code separation:** Content is hand-authored JSX + inline constant arrays (no CMS/MDX/markdown). Editing copy = editing TSX.
- **Content reuse:** Where a new page's core content mirrors a homepage section (e.g. Auditing), extract the inner content into a shared component used by both, to avoid divergence.
- **Gating files stay in sync:** The decoupled page/PDF gating maps must be mirrored in both `src/config/guides.ts` and `src/middleware.ts` (the Edge-runtime middleware cannot import the config). The sitemap already filters guide URLs on `isGuidePublished`, so no sitemap edit is needed once page flags flip; PDFs are not in the sitemap.
- **JSON-LD injection:** Inject via `<script type="application/ld+json">` in each server component; reuse the FAQ blocks authored per page.
- **Metadata pattern:** Copy the homepage `metadata` shape (`src/app/page.tsx`) for `title`/`description`/`alternates.canonical`/OpenGraph/Twitter.
- **Security headers unchanged:** `next.config.ts` global headers (CSP, HSTS, X-Frame-Options, etc.) and `output: 'standalone'` are untouched; work is additive.
- **Branching/deploy:** Built on `feat/seo-page-architecture` cut from `main`; the guide-release gating changes must be applied to `main`'s `middleware.ts` copy (only `middleware.ts` differs from the `epic-6` portal branch). Standalone build deploys via Coolify.

### UX Design Requirements

> Note: The UX spine (`DESIGN.md` / `EXPERIENCE.md`) describes the Stage-1 "fresh look" redesign. For this SEO work it acts as a **design-system constraint** on the new pages, not a source of net-new redesign stories. The items below are the actionable constraints each new page must satisfy.

UX-DR1: Palette & tokens — new pages consume only the two-mode navy+gold token system from `DESIGN.md` (`hsl(var(--token))`). No new hue or third accent. Gold is accent-only; use `accent-ink` for any gold text/icon (gold-on-base as small text is prohibited); `--accent` only for fills/buttons/borders.

UX-DR2: Typography — new pages inherit the unified type system: Playfair Display (display/headings) + Inter (body); no font changes and no per-mode type restyling.

UX-DR3: Component reuse — build pages from existing brand-layer components: eyebrow badge (section opener), card, icon-badge, tag, and the Button variants (primary / accent / ghost). Exactly one gold accent (conversion) CTA per view group.

UX-DR4: Dual-mode correctness — each new page renders correctly in both dark (default) and light modes; the footer stays dark navy in both modes and does not invert.

UX-DR5: Responsive reflow — content max-width 1160px, 24px gutters, ~88px section rhythm; all multi-column grids collapse to a single column under `md` (≤860px).

UX-DR6: Voice & tone microcopy — page copy uses first-person, Priyanka's voice (results-first, been-there mentorship), plain accounting terms (PGDA, CTA, CA(SA), IFRS); no corporate "we", hype, or exam-fear-mongering. This governs the 700–900 words authored per page.

UX-DR7: Accessibility interactions — keyboard-operable links/buttons/card-links with visible focus rings; honor `prefers-reduced-motion`; ≥44px touch targets on mobile (reinforces NFR8).

### FR Coverage Map

FR1: Epic 1 - `/subjects` hub page
FR2: Epic 1 - `/accounting-tutor` subject spoke
FR3: Epic 1 - `/financial-management-tutor` (MAF) subject spoke
FR4: Epic 1 - `/tax-tutor` subject spoke
FR5: Epic 1 - `/auditing-tutor` subject spoke
FR6: Epic 1 - `/cta-tutor` qualification hub (flagship)
FR7: Epic 1 - `/pgda-tutor` qualification hub
FR14: Epic 1 - per-page SEO metadata (authored with each page)
FR15: Epic 1 - per-page JSON-LD (authored with each page)
FR16: Epic 1 - sitemap coverage for the 7 new routes
FR11: Epic 2 - navbar repoint (Subjects → /subjects, add Qualifications)
FR12: Epic 2 - homepage Services "Learn more" links + Qualifications mention
FR13: Epic 2 - full hub↔spoke internal-link matrix
FR8: Epic 3 - decouple guide page-gating from PDF-gating
FR9: Epic 3 - release reviewed guide pages (gated on content review; PDFs held)
FR10: Epic 3 - conditional Download-PDF CTA
FR17: Epic 4 - GSC indexing submission + monthly measurement
FR18: Epic 4 - site-wide em-dash cleanup

## Epic List

### Epic 1: Hub-and-Spoke Ranking Pages
Every target query cluster gets its own dedicated, indexable page, so a searcher lands on a real subject or qualification page instead of the generic homepage. Delivers the 7 new pages — each with 700–900 words of differentiated content, a unique title/single H1, per-page metadata, page-appropriate JSON-LD, and sitemap registration.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR14, FR15, FR16

### Epic 2: Navigation & Internal-Link Matrix
Users and ranking authority flow to the new pages. The navbar repoints Subjects → `/subjects` and adds Qualifications (CTA/PGDA); the homepage Services cards gain "Learn more →" links plus a Qualifications mention; and the full hub↔spoke cross-link matrix is wired across all new pages. Depends on Epic 1 (pages must exist to link to). One matrix edge (`/accounting-tutor` → IFRS guides) also depends on **Epic 3** releasing those guide pages; Story 2.3 records it as a pending edge and wires it on guide release.
**FRs covered:** FR11, FR12, FR13

### Epic 3: Guide Release (pages live, PDFs held)
Reviewed study-guide pages become public and indexable, feeding authoritative internal links to the subject pages, while PDFs stay gated pending review. Decouples page-gating from PDF-gating (config + middleware), adds the conditional Download-PDF CTA, and flips the three reviewed guide pages live. Structurally independent of Epics 1–2, with **one directed coupling**: the `/accounting-tutor` → IFRS-guides links (part of the Epic 2 matrix) can only be wired once this epic releases those guide pages. Handled as a pending edge in Story 2.3; the single-shot release (NFR7) ships both together.
**FRs covered:** FR8, FR9, FR10

### Epic 4: SEO Hygiene & Measurement
The whole site reads in a human, expert voice and the team can measure ranking movement. Site-wide em-dash cleanup of existing copy and metadata, plus GSC indexing submission and the monthly measurement runbook against the 2026-07-11 baselines. Independent.
**FRs covered:** FR17, FR18

> **Release note (NFR7):** Epics organize the build only. This is a single-shot release — nothing ships partially and no internal link points at an unbuilt page at release time.

## Epic 1: Hub-and-Spoke Ranking Pages

Every target query cluster gets its own dedicated, indexable page, so a searcher lands on a real subject or qualification page instead of the generic homepage. Each page ships 700–900 words of differentiated content (real syllabus + exam technique), a unique title/single H1, per-page metadata, page-appropriate JSON-LD, and its outbound internal links to sibling new pages. Sitemap registration lands as the final story.

**Applies to every page story in this epic (NFR/UX build constraints):** NFR1 (700–900 words, genuinely differentiated, no doorway templating), NFR2 (one `<h1>`, title ≤ ~60 chars, meta ≤ ~155 chars), NFR3 (weave CA(SA)/SAICA/ITC-APC/university E-E-A-T context), NFR5 (reuse navy+gold tokens, shadcn primitives, existing `Navbar`/`Footer`, no new palette/components), NFR6/UX-DR6 (no em dashes; first-person Priyanka voice), NFR8/UX-DR4/UX-DR5/UX-DR7 (renders correctly in dark + light, one H1, visible focus rings, responsive reflow under `md`). FR14 (metadata) and FR15 (JSON-LD) are satisfied within each page story.

> **Cross-link authoring note (story independence):** Each page story authors its own outbound links to sibling pages in place (per the `page-catalog.md` matrix), even though some targets are built in other Epic 1 stories. A page story is **not** considered blocked by a sibling that does not yet exist — Next.js authors a `<Link>` to a not-yet-built route without a build error, and the link resolves once the sibling lands. Whole-matrix completeness (every in/out edge present, no dead-ends) is verified once in **Story 2.3**, consistent with the single-shot release (NFR7). Build order may start with the flagship pages (`/cta-tutor`, `/accounting-tutor`).

### Story 1.1: CTA qualification hub page (`/cta-tutor`) — flagship

As a student searching "cta tutors",
I want a dedicated CTA page that explains the qualification and routes me to each subject,
So that I land on a focused, credible page instead of the generic homepage, and ACCE defends its existing rank.

**Acceptance Criteria:**

**Given** a production (non-preview) build
**When** I visit `/cta-tutor`
**Then** the page renders as a server component with `<Navbar/>` → content → `<Footer/>`, with exactly one `<h1>` reading "CTA Tutoring (Certificate in Theory of Accounting)"
**And** it exports `metadata` with title `CTA Tutor — Certificate in Theory of Accounting | ACCE` (≤ ~60 chars), the catalog meta description (≤ ~155 chars), `alternates.canonical`, and OpenGraph/Twitter mirroring the homepage `metadata` shape.

**Given** the page content
**When** I read it
**Then** it contains 700–900 words of differentiated content across the H2s: what CTA is and why it's hard · the four subjects (each linking to its subject page) · ITC/board-exam prep · how it works (1:1, group, online) · results/testimonials (E-E-A-T) · FAQ
**And** it weaves SA context (CA(SA), SAICA, ITC/APC) and contains zero em-dash characters.

**Given** structured data and links
**When** the page is crawled
**Then** valid `Course` + `FAQPage` JSON-LD is injected via `<script type="application/ld+json">`
**And** the page links out to all four subject spokes (`/accounting-tutor`, `/financial-management-tutor`, `/tax-tutor`, `/auditing-tutor`) and `/pgda-tutor`.

**Given** dark (default) and light modes
**When** I toggle the theme
**Then** the page reuses the existing design tokens/components in both modes with no new palette, gold used as accent-only (`accent-ink` for gold text), and a visible focus ring on every interactive element.

### Story 1.2: Accounting subject spoke (`/accounting-tutor`)

As a student searching "accounting tutor",
I want a dedicated accounting-tutoring page,
So that I find a focused page about accounting help rather than the generic homepage.

**Acceptance Criteria:**

**Given** a production build
**When** I visit `/accounting-tutor`
**Then** the page renders with one `<h1>` "Accounting Tutoring for CA(SA) Students" and exports `metadata` with title `Accounting Tutor for CA(SA), PGDA & CTA | ACCE Tutors`, the catalog meta description, canonical, and OpenGraph/Twitter.

**Given** the content
**When** I read it
**Then** it contains 700–900 words across the H2s: what we cover (financial accounting, group statements/consolidations, IFRS) · who it's for (undergrad → PGDA → CTA) · how sessions work (1:1, group, online across SA) · why ACCE · pricing snapshot + CTA · FAQ
**And** it targets the secondary keywords (financial accounting tutor, accounting tutors, accounting tutoring, unisa/cta accounting tutor) naturally, with zero em dashes.

**Given** structured data and links
**When** the page is crawled
**Then** valid `Service` + `FAQPage` JSON-LD is present
**And** the page links out to `/cta-tutor`, `/pgda-tutor`, `/subjects` (the IFRS-guide links are wired once Epic 3 releases those pages).

### Story 1.3: Financial Management / MAF subject spoke (`/financial-management-tutor`)

As a student searching "financial management tutor" or "management accounting tutor",
I want one page that covers both namings of MAF,
So that either search term reaches the right dedicated page.

**Acceptance Criteria:**

**Given** a production build
**When** I visit `/financial-management-tutor`
**Then** the page renders with one `<h1>` "Management Accounting & Finance Tutoring" and exports `metadata` with title `Financial Management & Management Accounting Tutor | ACCE`, the catalog meta description, canonical, OpenGraph/Twitter.

**Given** the content
**When** I read it
**Then** it contains 700–900 words across the H2s: what MAF covers (costing, budgeting, financial management, decision-making) · who it's for · how it works · why ACCE · CTA · FAQ
**And** it explicitly targets both "financial management" and "management accounting" namings (the site subject is "Management Accounting"; GSC demand is "financial management tutor"), with zero em dashes.

**Given** structured data and links
**When** the page is crawled
**Then** valid `Service` + `FAQPage` JSON-LD is present
**And** the page links out to `/cta-tutor`, `/pgda-tutor`, `/subjects`.

### Story 1.4: Tax subject spoke (`/tax-tutor`)

As a student searching "tax tutor" or "taxation tutor",
I want a dedicated taxation page,
So that I reach focused tax-tutoring content.

**Acceptance Criteria:**

**Given** a production build
**When** I visit `/tax-tutor`
**Then** the page renders with one `<h1>` "Taxation Tutoring for PGDA & CTA" and exports `metadata` with title `Tax Tutor — Taxation for PGDA & CTA | ACCE Tutors`, the catalog meta description, canonical, OpenGraph/Twitter.

**Given** the content
**When** I read it
**Then** it contains 700–900 words across the H2s: what we cover (Income Tax Act, corporate tax, VAT, estate duty, CGT) · who it's for · how it works · why ACCE · CTA · FAQ
**And** it targets the secondary keywords (taxation tutor, tax tutor south africa, income tax act tutor), with zero em dashes.

**Given** structured data and links
**When** the page is crawled
**Then** valid `Service` + `FAQPage` JSON-LD is present
**And** the page links out to `/cta-tutor`, `/pgda-tutor`, `/subjects`.

### Story 1.5: Auditing subject spoke (`/auditing-tutor`)

As a student searching "auditing tutor" or "audit tutor",
I want a dedicated auditing page,
So that I reach focused auditing-tutoring content.

**Acceptance Criteria:**

**Given** a production build
**When** I visit `/auditing-tutor`
**Then** the page renders with one `<h1>` "Auditing Tutoring" and exports `metadata` with title `Auditing Tutor for CA(SA) Students | ACCE Tutors`, the catalog meta description, canonical, OpenGraph/Twitter.

**Given** the content
**When** I read it
**Then** it contains 700–900 words across the H2s: what we cover (ISAs, audit process, assertions, reporting) · who it's for · how it works · why ACCE · CTA · FAQ
**And** where content mirrors the homepage Auditing section, the shared inner content is extracted into a component used by both the homepage section and this page (to avoid divergence), with zero em dashes.

**Given** structured data and links
**When** the page is crawled
**Then** valid `Service` + `FAQPage` JSON-LD is present
**And** the page links out to `/cta-tutor`, `/pgda-tutor`, `/subjects`.

### Story 1.6: PGDA qualification hub (`/pgda-tutor`)

As a student searching "pgda tutor",
I want a dedicated PGDA page covering the pathway to CA(SA),
So that I understand how ACCE supports the diploma and where it leads.

**Acceptance Criteria:**

**Given** a production build
**When** I visit `/pgda-tutor`
**Then** the page renders with one `<h1>` "PGDA Tutoring (Postgraduate Diploma in Accounting)" and exports `metadata` with title `PGDA Tutor — Postgraduate Diploma in Accounting | ACCE`, the catalog meta description, canonical, OpenGraph/Twitter.

**Given** the content
**When** I read it
**Then** it contains 700–900 words across the H2s: what PGDA is · subjects we cover (link to 4 spokes) · PGDA → CTA → CA(SA) pathway · how it works · why ACCE · FAQ
**And** it targets the secondary keywords (postgraduate diploma in accounting tutor, pgda accounting tutor, unisa pgda tutor), with zero em dashes.

**Given** structured data and links
**When** the page is crawled
**Then** valid `Course` + `FAQPage` JSON-LD is present
**And** the page links out to all four subject spokes and `/cta-tutor`.

### Story 1.7: Subjects hub (`/subjects`)

As a visitor or crawler,
I want one indexable hub that introduces the subjects and qualifications and routes to each,
So that there is a single entry point that distributes visitors and authority.

**Acceptance Criteria:**

**Given** a production build
**When** I visit `/subjects`
**Then** the page renders with one `<h1>` "Subjects We Tutor" and exports `metadata` with title `Subjects We Tutor — Accounting, Tax, Audit & FM | ACCE`, the catalog meta description, canonical, OpenGraph/Twitter.

**Given** the content
**When** I read it
**Then** it follows the outline: intro (who we help: undergrad → PGDA → CTA) → four subject cards linking out → group vs 1:1 → CTA (WhatsApp/book)
**And** total copy reads as substantive (not a thin index), with zero em dashes.

**Given** structured data and links
**When** the page is crawled
**Then** valid `BreadcrumbList` JSON-LD is present
**And** the page links out to all four subject spokes, `/cta-tutor`, and `/pgda-tutor`.

### Story 1.8: Register new routes in sitemap

As the site owner,
I want all seven new routes in the sitemap,
So that crawlers can discover every new page.

**Acceptance Criteria:**

**Given** `src/app/sitemap.ts`
**When** the sitemap is generated
**Then** it includes `/subjects`, `/accounting-tutor`, `/financial-management-tutor`, `/tax-tutor`, `/auditing-tutor`, `/cta-tutor`, and `/pgda-tutor` with appropriate canonical URLs
**And** existing routes and the guide-URL filtering remain unchanged (additive only, NFR4).

## Epic 2: Navigation & Internal-Link Matrix

Users and ranking authority flow from the existing site into the new pages, and the hub↔spoke link graph is complete. Depends on Epic 1 (all seven pages exist). Page-to-page outbound links were authored with each page in Epic 1; this epic adds the existing-site entry points and verifies the whole matrix.

**Applies to this epic:** NFR4 (additive only, no regressions to existing routes/headers/homepage sections), NFR5 (reuse existing nav/link components), NFR6 (no em dashes in any added copy).

### Story 2.1: Repoint the navbar to the new pages

As a visitor using the site navigation,
I want the navbar to reach the new subject and qualification pages,
So that I can browse to a dedicated page instead of only scrolling homepage anchors.

**Acceptance Criteria:**

**Given** `src/components/Navbar.tsx`
**When** the navbar renders (desktop and mobile menu)
**Then** the "Subjects" link points to `/subjects` (replacing `/#services`)
**And** a "Qualifications" affordance reaches `/cta-tutor` and `/pgda-tutor` (dropdown or grouped links), so the navbar can reach every new page directly or one hop away.

**Given** the remaining nav items
**When** I use About / How It Works / Pricing / Contact
**Then** they still resolve to their existing homepage anchors (unchanged), and the mobile menu remains keyboard-operable with visible focus and ≥44px targets.

**Given** dark and light modes
**When** the navbar renders
**Then** it uses the existing navbar styling/tokens with no new palette, and contains zero em dashes.

### Story 2.2: Add homepage links into the new pages

As a homepage visitor,
I want each Services card and a Qualifications mention to link to the matching dedicated page,
So that I can go deeper from the homepage and authority flows to the spokes.

**Acceptance Criteria:**

**Given** the homepage `Services.tsx` section
**When** it renders
**Then** each subject card gains a visible "Learn more →" link to its subject spoke (Financial Accounting → `/accounting-tutor`, Management Accounting → `/financial-management-tutor`, Tax → `/tax-tutor`, Auditing → `/auditing-tutor`).

**Given** the homepage
**When** it renders
**Then** a short "Qualifications" mention links to `/cta-tutor` and `/pgda-tutor`.

**Given** the existing homepage sections
**When** the changes ship
**Then** no homepage section is removed or restructured (NFR4), the additions reuse existing card/link components with no new palette, and contain zero em dashes.

### Story 2.3: Complete and verify the internal-link matrix

As the site owner,
I want every new page to satisfy its in/out link edges from the matrix,
So that ranking authority is routed correctly and no internal link dead-ends at release.

**Acceptance Criteria:**

**Given** the directed link matrix in `page-catalog.md`
**When** I audit each new page and the homepage
**Then** every new page carries 2–4 internal links in and out per the matrix: each subject spoke links to both qualification hubs and back to `/subjects`; each qualification hub links to all four spokes and the sibling hub; `/subjects` links to all four spokes and both hubs; the homepage edges from Story 2.2 are present.

**Given** the release state (NFR7)
**When** the audit runs
**Then** no internal link points at an unbuilt page (all seven exist from Epic 1), and any edge still missing after Epic 1 is added here
**And** `/accounting-tutor` links to the relevant IFRS guides once those guide pages are released (Epic 3); if Epic 3 has not yet released them at audit time, this edge is recorded as pending and wired on guide release.

## Epic 3: Guide Release (pages live, PDFs held)

Reviewed study-guide pages become public and indexable, feeding authoritative internal links to the subject pages, while the PDFs stay gated pending a separate content and structural review. This requires splitting today's single gate (which drives both the page and its PDF) into two independent states. Independent of Epics 1–2.

**Applies to this epic:** NFR4 (additive only; existing routes/headers unchanged), NFR5 (reuse existing guide-page structure/components), the guides-config-and-middleware-stay-in-sync rule (Edge runtime can't import the config).

### Story 3.1: Decouple guide page-gating from PDF-gating

As a maintainer,
I want independent page-published and PDF-published states per guide,
So that a guide page can go public while its PDF stays blocked.

**Acceptance Criteria:**

**Given** `src/config/guides.ts`
**When** the gating config is defined
**Then** the existing page state (`GUIDE_PUBLISH_STATUS` / `isGuidePublished`) is preserved, and an independent PDF state is added (`GUIDE_PDF_PUBLISH_STATUS` + an `isGuidePdfPublished(id)` helper)
**And** the two states are fully independent (a guide may be page-published while PDF-unpublished).

**Given** `src/middleware.ts` (Edge runtime, cannot import the config)
**When** a request is evaluated
**Then** both maps are mirrored in the middleware: the `/guides/<id>` page check reads the page state, and the `/pdfs/<file>.pdf` check reads the PDF state (via `PDF_TO_GUIDE`)
**And** the mirrored middleware maps match the config values (kept in sync).

**Given** the current published states are unchanged in this story
**When** the app builds
**Then** existing behavior is preserved (no guide flips live yet), and existing tests still pass (additive only).

### Story 3.2: Conditional Download-PDF CTA on guide pages

As a visitor on a guide page whose PDF is still held,
I want the Download-PDF button to be absent rather than dead-ending,
So that the page never offers a blocked download.

**Acceptance Criteria:**

**Given** a guide page component (`src/app/guides/<id>/page.tsx`)
**When** `isGuidePdfPublished(id)` is false
**Then** the "Download PDF" CTA does not render (optionally a subtle "PDF coming soon" note is shown instead).

**Given** a guide page whose PDF is published
**When** `isGuidePdfPublished(id)` is true
**Then** the "Download PDF" CTA renders and links to the (middleware-gated) `/pdfs/<file>.pdf`.

**Given** dark and light modes
**When** the CTA (or its absence) renders
**Then** it reuses existing guide-page styling with no new palette and contains zero em dashes.

### Story 3.3: Release the three reviewed guide pages (PDFs held)

As the site owner,
I want the reviewed guide pages public and indexed while their PDFs stay blocked,
So that real expert content becomes an E-E-A-T and internal-link asset without exposing PDFs still under review.

**Acceptance Criteria:**

**Given** Luke has confirmed the content accuracy of `groups`, `ifrs-15`, and `ifrs-16`
**When** the page state is set to published for those three guides (config + mirrored middleware)
**Then** in a public (non-preview) build each guide page is reachable, no longer redirects to the "Coming Soon" gate, and appears in `src/app/sitemap.ts` (which already filters guide URLs on `isGuidePublished` — no sitemap edit needed).

**Given** the PDF state remains unpublished for all guides
**When** I request `/pdfs/<file>.pdf` for any released guide
**Then** the middleware still redirects/blocks it, and the page's Download-PDF CTA stays hidden (per Story 3.2). PDFs are not in the sitemap.

**Given** the release gate
**When** any guide has not yet passed Luke's content review
**Then** its page state stays unpublished (only reviewed guides flip live).

## Epic 4: SEO Hygiene & Measurement

The whole site reads in a human, expert voice, and the team can measure whether the new architecture moves rankings. Independent of the other epics (though best run after Epics 1–3 so new pages and released guides are also scrubbed).

### Story 4.1: Site-wide em-dash cleanup

As a reader,
I want the site's copy to read in a natural human voice with no em dashes,
So that the content does not read as AI-generated and the E-E-A-T voice holds.

**Acceptance Criteria:**

**Given** all rendered marketing copy and metadata (homepage components, guide pages and their part pages, all page `metadata`, and the new Epic 1–2 pages)
**When** I scan the rendered output and source strings
**Then** zero em-dash (`—`) characters remain, with meaning and tone preserved (replaced by commas, colons, parentheses, or two sentences).

**Given** en dashes in numeric ranges (for example "24–48h", "700–900 words")
**When** the cleanup runs
**Then** those en dashes are left unchanged (scope is em dashes only).

**Given** the cleanup is copy-only
**When** the changes ship
**Then** no layout, component, or functional behavior changes (additive/editorial only).

### Story 4.2: Submit new URLs for indexing and set up monthly measurement

As the site owner,
I want each new URL submitted for indexing and its primary query tracked monthly,
So that I can tell whether the new architecture is moving rankings against the baseline.

**Acceptance Criteria:**

**Given** the release is live
**When** each new URL (`/subjects`, the four spokes, `/cta-tutor`, `/pgda-tutor`, and each released guide page) is published
**Then** each URL is submitted via GSC URL Inspection → Request Indexing, and a crawl/indexing check confirms each is indexed with its unique title/H1/schema.

**Given** the ClaudeSEO GSC snapshot pipeline
**When** the monthly snapshot runs
**Then** each page's primary query is tracked against the 2026-07-11 baselines (accounting tutor 34 · financial management tutor 27 · cta tutors 3), and the "Top Pages by Search" table is checked for growth from today's 2 URLs toward the full new-page set.

**Given** the flagship query "cta tutors"
**When** monthly positions are reviewed
**Then** the position is monitored to confirm it holds at ≤3 or improves (defend-and-expand goal).

**Definition of Done (scopes the one-time deliverable vs. the ongoing runbook):**
- **Done when** (discrete, completable): every new URL (`/subjects`, the four spokes, `/cta-tutor`, `/pgda-tutor`, and each released guide page) has been submitted via GSC URL Inspection → Request Indexing; an indexing check confirms each is indexed with its unique title/H1/schema; and the monthly measurement runbook is documented (queries, baselines, snapshot source) with the **first** snapshot recorded against the 2026-07-11 baselines.
- **Out of this story's closure** (recurring operations): the subsequent month-over-month tracking and the "cta tutors ≤3" watch are an ongoing runbook, not a gate on closing this story. They continue after the release lands.
