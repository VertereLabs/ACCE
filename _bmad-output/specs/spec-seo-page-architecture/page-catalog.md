# Page Catalog — ACCE SEO Pages

Companion to `SPEC.md`. Holds the per-page build contract (keywords, metadata, structure, schema, links), the internal-link matrix, and the phasing. One row of the kernel's capabilities maps to one page here. All routes are Next.js App Router server components under `acce-nextjs/src/app/`, exporting `metadata` and rendering `<Navbar/>` → content → `<Footer/>`, mirroring the existing guide pages.

Word count target per page: **700–900 words of differentiated content** (see SPEC anti-doorway constraint). Title ≤ ~60 chars, meta ≤ ~155 chars, exactly one `<h1>`.

---

## Subject spokes

### CAP-2 · `/accounting-tutor` — Accounting *(Phase 1)*
- **Primary kw:** accounting tutor (27 impr, p34)
- **Secondary:** financial accounting tutor, accounting tutors, accounting tutoring, tutor for accounting, unisa/cta accounting tutor
- **Title:** `Accounting Tutor for CA(SA), PGDA & CTA | ACCE Tutors`
- **Meta:** `One-on-one & group Accounting tutoring for undergrad, PGDA and CTA. Financial accounting, consolidations and IFRS — pass with ACCE Tutors.`
- **H1:** Accounting Tutoring for CA(SA) Students
- **H2s:** What we cover (financial accounting, group statements/consolidations, IFRS) · Who it's for (undergrad → PGDA → CTA) · How sessions work (1:1, group, online across SA) · Why ACCE (CA(SA) tutors, results) · Pricing snapshot + CTA · FAQ
- **Schema:** Service + FAQPage
- **Links in:** homepage Services card (Financial Accounting), `/subjects`
- **Links out:** `/cta-tutor`, `/pgda-tutor`, relevant IFRS guides

### CAP-3 · `/financial-management-tutor` — Management Accounting & Finance (MAF)
> Naming nuance: the site's subject is "Management Accounting"; GSC demand is "financial management tutor". In CTA this is one subject (MAF). Target both.
- **Primary kw:** financial management tutor (~20 impr, p27)
- **Secondary:** management accounting tutor, finance tutor, MAF tutor
- **Title:** `Financial Management & Management Accounting Tutor | ACCE`
- **Meta:** `Management Accounting & Financial Management (MAF) tutoring for PGDA and CTA — costing, budgeting, decision-making and finance. Book with ACCE Tutors.`
- **H1:** Management Accounting & Finance Tutoring
- **H2s:** What MAF covers (costing, budgeting, financial management, decision-making) · Who it's for · How it works · Why ACCE · CTA · FAQ
- **Schema:** Service + FAQPage
- **Links out:** `/cta-tutor`, `/pgda-tutor`, `/subjects`

### CAP-4 · `/tax-tutor` — Taxation
- **Primary kw:** tax tutor
- **Secondary:** taxation tutor, tax tutor south africa, income tax act tutor
- **Title:** `Tax Tutor — Taxation for PGDA & CTA | ACCE Tutors`
- **Meta:** `Taxation tutoring for CA(SA) students — Income Tax Act, corporate tax, VAT, CGT and estate duty. Exam-focused revision with ACCE Tutors.`
- **H1:** Taxation Tutoring for PGDA & CTA
- **H2s:** What we cover (Income Tax Act, corporate tax, VAT, estate duty, CGT) · Who it's for · How it works · Why ACCE · CTA · FAQ
- **Schema:** Service + FAQPage
- **Links out:** `/cta-tutor`, `/pgda-tutor`, `/subjects`

### CAP-5 · `/auditing-tutor` — Auditing
- **Primary kw:** auditing tutor / audit tutor
- **Secondary:** auditing tutor south africa, isa tutor
- **Title:** `Auditing Tutor for CA(SA) Students | ACCE Tutors`
- **Meta:** `Auditing tutoring for undergrad, PGDA and CTA — ISA standards, the audit process, assertions and exam technique. Build confidence with ACCE Tutors.`
- **H1:** Auditing Tutoring
- **H2s:** What we cover (ISAs, audit process, assertions, reporting) · Who it's for · How it works · Why ACCE · CTA · FAQ
- **Schema:** Service + FAQPage
- **Links out:** `/cta-tutor`, `/pgda-tutor`, `/subjects`

---

## Qualification hubs

### CAP-6 · `/cta-tutor` — CTA hub ⭐ *(Phase 1 — FLAGSHIP, already p3)*
- **Primary kw:** cta tutors (p3)
- **Secondary:** cta tutor, cta accountants, certificate in theory of accounting tutor, cta board exam tutor, ITC tutor
- **Title:** `CTA Tutor — Certificate in Theory of Accounting | ACCE`
- **Meta:** `CTA tutoring across Accounting, Tax, MAF and Auditing. Structured support for the Certificate in Theory of Accounting and the road to CA(SA). Book with ACCE.`
- **H1:** CTA Tutoring (Certificate in Theory of Accounting)
- **H2s:** What CTA is & why it's hard · The four subjects we cover (link each to its subject page) · ITC / board-exam prep · How it works (1:1, group, online) · Results & testimonials (E-E-A-T) · FAQ
- **Schema:** Course + FAQPage
- **Links out:** all 4 subject spokes, `/pgda-tutor`
- **Note:** strongest existing signal — treat as the flagship hub.

### CAP-7 · `/pgda-tutor` — PGDA hub
- **Primary kw:** pgda tutor
- **Secondary:** postgraduate diploma in accounting tutor, pgda accounting tutor, unisa pgda tutor
- **Title:** `PGDA Tutor — Postgraduate Diploma in Accounting | ACCE`
- **Meta:** `PGDA tutoring for the Postgraduate Diploma in Accounting — Accounting, Tax, MAF and Auditing support to help you convert to CTA and CA(SA). ACCE Tutors.`
- **H1:** PGDA Tutoring (Postgraduate Diploma in Accounting)
- **H2s:** What PGDA is · Subjects we cover (link to 4 spokes) · PGDA → CTA → CA(SA) pathway · How it works · Why ACCE · FAQ
- **Schema:** Course + FAQPage
- **Links out:** all 4 subject spokes, `/cta-tutor`

---

## Subjects hub

### CAP-1 · `/subjects` — Subjects hub
- **Primary kw:** accounting subjects tutoring
- **Secondary:** ca(sa) tutor, pgda subjects
- **Title:** `Subjects We Tutor — Accounting, Tax, Audit & FM | ACCE`
- **Meta:** `Expert CA(SA) tutoring in Financial Accounting, Taxation, Management Accounting & Finance, and Auditing — for undergrad, PGDA and CTA students.`
- **H1:** Subjects We Tutor
- **Outline:** intro (who we help: undergrad → PGDA → CTA) → 4 subject cards linking out → group vs 1:1 → CTA (WhatsApp/book)
- **Schema:** BreadcrumbList
- **Links out:** all 4 subject spokes, `/cta-tutor`, `/pgda-tutor`

---

## Internal-link matrix (CAP-9)

The rule: every new page has 2–4 internal links in and out. Directed edges:

| From ↓ / To → | /subjects | /accounting | /fm | /tax | /auditing | /cta | /pgda | homepage | guides |
|---|---|---|---|---|---|---|---|---|---|
| **homepage** (Services cards) | — | ✔ Learn more | ✔ Learn more | ✔ Learn more | ✔ Learn more | ✔ mention | ✔ mention | — | — |
| **/subjects** | — | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ | — | — |
| **/accounting** | ✔ | — | | | | ✔ | ✔ | | ✔ IFRS |
| **/fm** | ✔ | | — | | | ✔ | ✔ | | |
| **/tax** | ✔ | | | — | | ✔ | ✔ | | |
| **/auditing** | ✔ | | | | — | ✔ | ✔ | | |
| **/cta** | | ✔ | ✔ | ✔ | ✔ | — | ✔ | | |
| **/pgda** | | ✔ | ✔ | ✔ | ✔ | ✔ | — | | |

- Each **subject spoke** links out to both qualification hubs (`/cta-tutor`, `/pgda-tutor`) and back to `/subjects`.
- Each **qualification hub** links out to all four subject spokes (and to the sibling hub).
- **`/subjects`** links to all four spokes and both hubs.
- **Homepage** Services cards each gain a "Learn more →" link to their subject page; add a short "Qualifications" mention linking to `/cta-tutor` and `/pgda-tutor`.
- `/accounting-tutor` additionally links to relevant IFRS guides (once CAP-8 releases them).

---

## Guide release (CAP-8) — web pages only, PDFs held

**Decouple page gating from PDF gating.** Today one `GUIDE_PUBLISH_STATUS` map drives both the page and the PDF, in two synced files. Split it so a guide **page** can be public while its **PDF** stays blocked:
- `acce-nextjs/src/config/guides.ts` — add an independent PDF-publish state (e.g. `GUIDE_PDF_PUBLISH_STATUS` + an `isGuidePdfPublished(id)` helper) alongside the existing page `GUIDE_PUBLISH_STATUS` / `isGuidePublished`.
- `acce-nextjs/src/middleware.ts` — mirror both maps (Edge runtime can't import the config). The `/guides/<id>` page check reads the **page** state; the `/pdfs/<file>.pdf` check reads the **PDF** state (via `PDF_TO_GUIDE`).
- Guide page component (`src/app/guides/<id>/page.tsx`) — the "Download PDF" CTA renders **only** when `isGuidePdfPublished(id)` is true; otherwise hide it (optionally show a "PDF coming soon" note).

At this release: set **page** state → `true` for each guide Luke has reviewed (`groups`, `ifrs-15`, `ifrs-16`); leave **PDF** state → `false` for all (PDFs under full content + structural review). The sitemap (`src/app/sitemap.ts`) already filters guide URLs on `isGuidePublished` — no sitemap edit needed once page flags flip. PDFs are not in the sitemap.

> **Gate:** flip a guide page live only after Luke confirms its content. PDFs stay blocked regardless until their separate review completes.

---

## Release model — single shot (not phased)

Everything ships in one release. Build order may start with the flagship pages (`/cta-tutor`, `/accounting-tutor`) for early review, but nothing ships partially — at release the full page set exists and the entire internal-link matrix is wired, so no internal link points at an unbuilt page.

- **In this release:** all of CAP-1…CAP-11 — the 4 subject spokes, 2 qualification hubs, `/subjects` hub, navbar repoint (`Subjects → /subjects` + Qualifications: CTA/PGDA), homepage "Learn more" links, full cross-link matrix, per-page metadata/JSON-LD, sitemap coverage, reviewed guide **pages** live (PDFs held).
- **Out of scope (non-goal):** promoting About / How It Works / Pricing / Contact to real pages; university/geo long-tail pages; adding testimonials/results content; publishing more guides or the held PDFs.

---

## Next.js implementation notes

- Routes: add `src/app/{subjects,accounting-tutor,financial-management-tutor,tax-tutor,auditing-tutor,cta-tutor,pgda-tutor}/page.tsx`. Each is a server component exporting `metadata` (mirror `src/app/page.tsx`) and rendering `<Navbar/> … <Footer/>` — or add a shared marketing `layout.tsx` to avoid repeating Navbar/Footer.
- Reuse: where a page's core content mirrors a homepage section (e.g. Auditing), extract the inner content into a shared component used by both, to avoid divergence.
- Metadata: set `title`, `description`, `alternates.canonical`, OpenGraph/Twitter per page (homepage already does this — copy the shape).
- Schema: inject JSON-LD via `<script type="application/ld+json">` (Service / Course / FAQPage / BreadcrumbList). Reuse the FAQ blocks per page.
- Sitemap: add all new routes to `src/app/sitemap.ts`.
- Do **not** remove homepage sections — dedicated pages rank; homepage sections convert.
