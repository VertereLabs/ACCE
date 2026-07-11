# SEO Measurement Runbook: ACCE

**Purpose:** This runbook drives two processes. First, a one-time URL submission to Google Search Console (GSC) for every new page published in the SEO architecture sprint. Second, a monthly measurement cycle tracking each page's primary query position against the 2026-07-11 baseline, using the ClaudeSEO GSC snapshot as the data source. A person with GSC access for the property `accetutors.co.za` can run the full monthly cycle from this document alone.

---

## One-time: submit new URLs for indexing (on release)

### How to submit

For each URL below, open Google Search Console, go to **URL Inspection**, paste the URL, and click **Request Indexing**. Do this once per URL, ideally on the day of release or shortly after.

### URL submission checklist

Seven marketing pages (Epic 1 and Epic 2):

- [ ] `https://accetutors.co.za/subjects`
- [ ] `https://accetutors.co.za/accounting-tutor`
- [ ] `https://accetutors.co.za/financial-management-tutor`
- [ ] `https://accetutors.co.za/tax-tutor`
- [ ] `https://accetutors.co.za/auditing-tutor`
- [ ] `https://accetutors.co.za/cta-tutor`
- [ ] `https://accetutors.co.za/pgda-tutor`

Three released guide index pages (Epic 3, pages live, PDFs held):

- [ ] `https://accetutors.co.za/guides/groups`
- [ ] `https://accetutors.co.za/guides/ifrs-15`
- [ ] `https://accetutors.co.za/guides/ifrs-16`

**Total: 10 URLs.**

### NOT submitted (intentionally excluded)

- **Guide PDF files** (`/pdfs/*.pdf`): PDFs are held this sprint. The middleware returns 302 for all `/pdfs/*` paths. Do not submit them until PDFs are released.
- **Guide part pages** (`/guides/*/part-1`, `/guides/*/part-2`, etc.): These are not individually critical to submit. They are included in the sitemap and are crawl-reachable via internal links on each guide index page. Googlebot will discover them organically.

### Canonical URL note

Page metadata uses a trailing slash (e.g. `https://accetutors.co.za/cta-tutor/`). The sitemap entries and the checklist above use no trailing slash (e.g. `https://accetutors.co.za/cta-tutor`). Either form resolves to the same page in GSC URL Inspection; both are accepted. Use the no-trailing-slash form when pasting into URL Inspection to match the sitemap.

---

## Confirm each URL is indexed

After submission (allow 1-14 days for indexing), verify each URL is live and serving its unique content. Two methods:

1. **GSC URL Inspection:** Paste the URL into URL Inspection and look for "URL is on Google." This is the authoritative source.
2. **Quick site: check:** In a browser (or Google search), run `site:accetutors.co.za/subjects` (replace the path for each page). The first result should match the expected title below.

### Per-page expected title, H1, and structured data

Use this table to confirm each submitted URL is serving its unique content (not a generic page, not a redirect, not a 404):

| URL | Expected title | Expected H1 | Structured data |
|-----|----------------|-------------|-----------------|
| `/subjects` | Subjects We Tutor: Accounting, Tax, Audit & FM \| ACCE | Subjects We Tutor | BreadcrumbList |
| `/accounting-tutor` | Accounting Tutor for CA(SA), PGDA & CTA \| ACCE Tutors | Accounting Tutoring for CA(SA) Students | Service + FAQPage |
| `/financial-management-tutor` | Financial Management & Management Accounting Tutor \| ACCE | Management Accounting & Finance Tutoring | Service + FAQPage |
| `/tax-tutor` | Tax Tutor: Taxation for PGDA & CTA \| ACCE Tutors | Taxation Tutoring for PGDA & CTA | Service + FAQPage |
| `/auditing-tutor` | Auditing Tutor for CA(SA) Students \| ACCE Tutors | Auditing Tutoring | Service + FAQPage |
| `/cta-tutor` | CTA Tutor: Certificate in Theory of Accounting \| ACCE | CTA Tutoring (Certificate in Theory of Accounting) | Course + FAQPage |
| `/pgda-tutor` | PGDA Tutor: Postgraduate Diploma in Accounting \| ACCE | PGDA Tutoring (Postgraduate Diploma in Accounting) | Course + FAQPage |
| `/guides/groups` | Groups & Business Combinations \| ACCE Tutors Study Guides | Groups & Business Combinations | none (guide index page) |
| `/guides/ifrs-15` | IFRS 15 Revenue Guide \| ACCE Tutors | IFRS 15: Revenue from Contracts with Customers | none (guide index page) |
| `/guides/ifrs-16` | IFRS 16: Leases \| ACCE Tutors Study Guides | IFRS 16: Leases | none (guide index page) |

**Structured data check:** For pages with Service, Course, or FAQPage schema, you can verify with the [Google Rich Results Test](https://search.google.com/test/rich-results) or the Schema Markup Validator. Guide index pages have no JSON-LD; no structured-data check needed for them.

---

## Monthly measurement

### Overview

Run this procedure once per month (suggested: first week of each month). The goal is to track whether the new pages are earning ranking positions and whether the flagship query is holding.

**Snapshot source:** Run the **ClaudeSEO GSC snapshot** for the property `accetutors.co.za`. This pipeline reads GSC position data for the tracked queries and produces a table of primary-query positions. Read the position for each tracked query from that output. (If the exact pipeline invocation is not on hand, ask the site owner for the current run command.)

**GSC "Top Pages by Search" table:** In addition to query-level positions, check the **Performance > Pages** report (or Top Pages by Search) in GSC. As of the 2026-07-11 baseline, only **2 URLs** appear there. Watch this number grow toward the full 10-URL set as each new page earns impressions.

### Tracked queries and baselines

| Page | Primary query | 2026-07-11 baseline position | Notes |
|------|---------------|------------------------------|-------|
| `/accounting-tutor` | accounting tutor | **34** | First baseline with GSC data |
| `/financial-management-tutor` | financial management tutor | **27** | First baseline with GSC data |
| `/cta-tutor` | cta tutors | **3** | Flagship query (see defend-and-expand watch below) |
| `/tax-tutor` | tax tutor | no baseline (new page) | Track once it earns a position |
| `/auditing-tutor` | auditing tutor / audit tutor | no baseline (new page) | Track once it earns a position |
| `/pgda-tutor` | pgda tutor | no baseline (new page) | Track once it earns a position |
| `/subjects` | accounting subjects tutoring | no baseline (new page) | Track once it earns a position |
| `/guides/groups` | groups consolidations guide | no baseline (new page) | Track once it earns a position |
| `/guides/ifrs-15` | ifrs 15 revenue guide | no baseline (new page) | Track once it earns a position |
| `/guides/ifrs-16` | ifrs 16 leases guide | no baseline (new page) | Track once it earns a position |

**What to do with "no baseline" pages:** Once a page first appears in GSC with an average position, add a note to the snapshot log row for that month. From that point forward it becomes a tracked position.

### Flagship defend-and-expand watch: "cta tutors"

The query **"cta tutors"** is the flagship query. At the 2026-07-11 baseline it holds **position 3**.

**Standing goal: hold at position 3 or better (lower number = better). This query must never regress.**

Check it every month in the snapshot log. If position rises above 3 (worse), investigate immediately: check for crawl errors, content issues, or new competition. This is the one query flagged as never-regress.

---

## Snapshot log

### How to add next month's row

1. Run the ClaudeSEO GSC snapshot for `accetutors.co.za`.
2. Copy the bottom row of the table, update the date to the first of the new month (or the snapshot date), and fill in the positions from the snapshot output.
3. Note the Top Pages count (number of URLs in the GSC Top Pages by Search report).
4. Add any observations in the notes column (new page appeared, position drop/gain, etc.).

### Log table

| Date | cta tutors pos | accounting tutor pos | financial management tutor pos | Top Pages count | Notes |
|------|----------------|----------------------|-------------------------------|-----------------|-------|
| 2026-07-11 | 3 | 34 | 27 | 2 | Baseline (pre-release positions). Architecture sprint complete. New pages not yet indexed. |
| _(OWNER: paste current live GSC pull here)_ | | | | | First live snapshot after release. Fill from ClaudeSEO GSC snapshot for `accetutors.co.za`. |

**Reading the table:** Lower position numbers are better (position 1 = top of Google). A blank cell means the page has not yet earned a position for that query in this snapshot period.
