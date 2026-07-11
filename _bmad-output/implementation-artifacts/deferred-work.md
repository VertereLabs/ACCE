# Deferred Work

Items surfaced during reviews that are real but not actionable in the current story.

## Deferred from: code review of 1-1-cta-qualification-hub-page-cta-tutor-flagship (2026-07-11)

- **Sitemap registration for `/cta-tutor`** — `tests/unit/sitemap.test.ts` reports `/cta-tutor` (and the pre-existing guide routes) as missing from `sitemap.ts`. By design: Story 1.1 AC7 and Dev Notes explicitly instruct NOT to edit `sitemap.ts`; route registration and the e2e route-200 coverage land in **Story 1.8**. The two guide-route sitemap failures are pre-existing on the `seo/epic-1` branch and unrelated to this story. No action in Story 1.1.

## Deferred from: create-story of 2-3-complete-and-verify-the-internal-link-matrix (2026-07-11)

- **Pending internal link: `/accounting-tutor` -> IFRS guides:** The CAP-9 matrix requires `/accounting-tutor` to link to the relevant IFRS guides (`/guides/ifrs-15`, `/guides/ifrs-16`). Those guide pages are currently `GUIDE_PUBLISH_STATUS: false` in `src/config/guides.ts` (Epic 3 has not yet run). In a public (non-preview) build the middleware redirects an unpublished `/guides/<id>` to the "Coming Soon" gate, so adding a live `<Link>` to those paths now would create a dead-end link at release, which violates NFR7. Per AC2 of Story 2.3, the edge is intentionally NOT wired in this story. **Wired by Story 3.3 (release the reviewed guide pages)** when the guide page flags for `ifrs-15` and `ifrs-16` flip to `true` in `src/config/guides.ts`. When that happens: add `<Link href="/guides/ifrs-15" className="text-accent hover:underline">IFRS 15</Link>` and `<Link href="/guides/ifrs-16" className="text-accent hover:underline">IFRS 16</Link>` to `src/app/accounting-tutor/page.tsx`, and extend `acce-nextjs/tests/unit/internal-link-matrix.test.tsx` by adding `/guides/ifrs-15` and `/guides/ifrs-16` to the `AccountingTutorPage` edges array (and remove or fulfil the `it.todo` marker at the bottom of the file).
