# Deferred Work

Items surfaced during reviews that are real but not actionable in the current story.

## Deferred from: code review of 1-1-cta-qualification-hub-page-cta-tutor-flagship (2026-07-11)

- **Sitemap registration for `/cta-tutor`** — `tests/unit/sitemap.test.ts` reports `/cta-tutor` (and the pre-existing guide routes) as missing from `sitemap.ts`. By design: Story 1.1 AC7 and Dev Notes explicitly instruct NOT to edit `sitemap.ts`; route registration and the e2e route-200 coverage land in **Story 1.8**. The two guide-route sitemap failures are pre-existing on the `seo/epic-1` branch and unrelated to this story. No action in Story 1.1.
