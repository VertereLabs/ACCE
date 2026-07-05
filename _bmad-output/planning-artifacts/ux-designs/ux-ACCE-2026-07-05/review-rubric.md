# Spine Pair Review — ACCE

## Overall verdict

A tight, well-disciplined shadcn brand-layer delta. Section order is canonical, both color modes are fully paired, the two-mode system is coherent, and scope (marketing-only, portal = Stage 2) is stated cleanly. The one systemic weakness is `accent-ink` (and the footer surface tokens): they are load-bearing across text/icons/eyebrows/nav-hover yet live only in YAML **comments**, not as real frontmatter tokens — so the `{accent-ink}` refs in both spines resolve to nothing a downstream generator can mirror. Secondary gaps: the new theme-toggle control has no visual spec, the guides library has no flow, and the mockups folder is neither linked per-section nor cleaned of superseded candidate mocks.

## 1. Flow coverage — adequate

Checked EXPERIENCE.md Key Flows against IA surfaces and the one new capability (mode toggle). Sources (BRAND-DIRECTIONS.md, index.md, STRATEGY.md) all resolve on disk. Flow 1 (Thandi) is exemplary: named protagonist, numbered steps 1–4, an explicit **Climax** beat (About "38%" moment), and a real conversion endpoint (WhatsApp). Flow 2 (mode preference) and the guides library are where it thins out.

### Findings
- **medium** Flow 2 "Mode preference" — the single *new* capability in Stage 1 — is a one-paragraph micro-flow: protagonist is a generic "returning visitor" (unnamed), no numbered steps, no marked climax, no failure path (JS-disabled → SSR default dark; localStorage blocked/private mode) (EXPERIENCE.md Key Flows, 2nd para). *Fix:* promote to a proper numbered flow with a named persona and a first-paint/no-flash failure branch, or fold it into Flow 1 as a step.
- **medium** No flow walks the **static IFRS guides library**, yet Foundation frames the product as "landing page **+ static study-guide library**" and the gating logic (`config/guides.ts` → "Coming Soon", never 404) is load-bearing (EXPERIENCE.md IA + State Patterns). *Fix:* add a short flow: student navigates `/guides` → opens an available IFRS 16 part, then hits a "Coming Soon" gated part (the climax of the coming-soon guarantee).
- **low** Flow 1 has no failure path. Defensible (static site, `wa.me` deep link), but a no-WhatsApp / email-fallback aside would close it. *Fix:* one sentence — if WhatsApp unavailable, the email anchor is the fallback.

## 2. Token completeness — thin

Extracted every frontmatter token and every `{path}` / bare-string ref. Both `colors.light` and `colors.dark` define the full shadcn set (background…destructive) with **complete light/dark pairs** — no missing color values, which is the critical bar. Contrast floor is stated (body ≥4.5:1, large ≥3:1, both modes). The problem is the semantic helpers that everything actually renders gold with.

### Findings
- **high** `accent-ink` is load-bearing (eyebrow text, icon-badge foreground, all gold text/icons, nav-link hover, stat captions) but is **not a frontmatter token** — its values live in a YAML **comment** (`light: 36 76% 33% / dark: 41 78% 63%`), and `components.badge-eyebrow.foreground` / `icon-badge.foreground` reference it as the bare string `'accent-ink'`, not a `{ref}`. A generator that mirrors `colors.*` will silently drop it (DESIGN.md frontmatter lines 49–54, 91, 96; prose line 137). *Fix:* promote `accent-ink` to real `colors.light`/`colors.dark` tokens and change the two component refs to `{colors.accent-ink}`.
- **high** Footer surface colors (`footer-bg`/`footer-fg`, both modes) are also comment-only (DESIGN.md lines 52–54) while the Colors prose and Components/Logo rows treat "dark navy footer in both modes" as a hard rule. *Fix:* tokenize `footer-bg`/`footer-fg` per mode so the reversed-logo footer is reproducible.
- **medium** `Tag` component has a spec in the Components table (`primary/.10` navy pill) but **no `components.tag` frontmatter entry** — unlike button/card/eyebrow/icon-badge which all have both (DESIGN.md line 186 vs frontmatter `components`). *Fix:* add a `tag` component token block, or drop the specific `.10` value if Tag is meant to inherit.
- **low** DESIGN says contrast is "**verified** for both modes" (line 140) but EXPERIENCE says the same pairs (`muted-foreground` on base) are to be "**verify[ied] at build**" (Accessibility Floor). One asserts done, the other defers. *Fix:* align wording — either verified now (cite the ratios) or both say "verify at build."
- **low** The Colors anchor table lists Navy `#002251` = `215 100% 16%` as "`--primary` in light mode," but the actual light `primary` token is `223 47% 26%` (different hue and much lower saturation, tuned for surface). Harmless but the table overstates identity. *Fix:* note the token is a surface-tuned derivative of the anchor, not the anchor itself.

## 3. Component coverage — adequate

Cross-walked every named component across both spines. Button (3 variants), Card, Eyebrow badge, Icon badge, Pricing Most-Popular each have a DESIGN Components row **and** a frontmatter block (except Tag, above) **and** behavioral coverage in EXPERIENCE. Gaps cluster on the interactive chrome.

### Findings
- **high** **Theme toggle** — the control for the one new capability — has a behavioral spec (EXPERIENCE Interaction Primitives: sun/moon lucide, `aria-label`, color cross-fade) but **no DESIGN.md Components row / visual spec** (size, placement, icon treatment, which button variant it borrows) (DESIGN.md Components table). *Fix:* add a "Theme toggle" row (likely a ghost icon-button in the navbar) so its visual is pinned, not implied.
- **low** **Navbar** translucency (`--background/.82` + blur) and sticky behavior are specified in EXPERIENCE.md (IA) — a *visual* value living in the behavioral spine. *Fix:* move the translucency/blur token to DESIGN (Components or Layout); keep only "sticky, collapses under md" in EXPERIENCE.
- **low** Icon badge and Tag have no EXPERIENCE Component Patterns entry — defensible (both are static/decorative), but note them as "presentational, non-interactive" for completeness. *Fix:* one line each, or explicitly bundle under "Eyebrow/Icon badges are static."

## 4. State coverage — strong

Walked each IA surface (Homepage, Guides index, Guide parts, Contact) against empty / cold-load / focus / error / coming-soon / mode-persistence. Coming-soon is handled well (single source `config/guides.ts`; homepage Resources + Guides index both render "Coming Soon", never 404; Blog cards disabled-and-labelled, not dead links). Mode-persistence is explicit (localStorage, no-flash first paint). Focus rings on all interactive elements. Empty/loading/error correctly declared out of scope with a defensible reason (static, no data fetches). Minor: no explicit no-JS theme fallback and no `wa.me`/email failure state, both low-impact for a static marketing site.

## 5. Visual reference coverage — thin

mockups/ contains: `mock-final-dark-default.html`, `mock-final-light-mode.html`, `shot-final-dark-default.png`, `shot-final-light-mode.png` (the winners), plus `mock-A-light-authority.html`, `mock-B-deep-authority.html`, `mock-C-warm-scholar.html` (superseded candidate directions), and `logo-standard.png` / `logo-reversed.png` / `logo-standard-lg.png`. Spines-win-on-conflict **is** stated once (DESIGN.md blockquote: "This spine wins on conflict with any mock"). But the reference example pattern (per-file, named-for-what-it-shows, at the relevant section) is not followed.

### Findings
- **medium** DESIGN.md links the folder generically ("Visual reference mocks: `mockups/`") rather than the two **final** files inline at the relevant sections, and EXPERIENCE.md links **no** mockups at all (contrast the shadcn example's "→ Composition reference: mockups/today.html…"). *Fix:* cite `mockups/mock-final-dark-default.html` and `mock-final-light-mode.html` by name where they illustrate (Brand & Style / Colors), and add a composition-reference line to EXPERIENCE IA.
- **medium** Three superseded candidate mocks (`mock-A-*`, `mock-B-*`, `mock-C-*`) are orphans and are actively misleading — B/C were folded into dark-default/light, A was rejected; an implementer could port the wrong tokens. `logo-standard-lg.png` and both `shot-final-*.png` are also unreferenced. *Fix:* move the A/B/C candidates to an `_archive/` subfolder (or delete), and either link or drop the screenshots.

## Mechanical notes

- **Phantom token refs:** `{accent-ink}` in EXPERIENCE.md (Accessibility Floor, State Patterns nav-hover) does not resolve to any DESIGN.md frontmatter token — it maps to a comment. Same for footer surfaces. This is the single most important fix; see 2.
- **Frontmatter completeness (DESIGN):** color pairs complete both modes ✓; `rounded.base`, `typography.display/body`, and all `{path}` refs in the `components` block resolve ✓; missing: `components.tag`, and no `theme-toggle` component. No `sources` field on DESIGN.md (acceptable per spec/shape).
- **Frontmatter completeness (EXPERIENCE):** three `sources` all exist on disk ✓. Path drift: EXPERIENCE cites `config/guides.ts`; actual file is `acce-nextjs/src/config/guides.ts` (the `src/` prefix is dropped) — resolvable but imprecise. Logo assets: DESIGN cites `design-artifacts/logo/` — confirmed present (reversed + sized variants).
- **Name consistency:** kebab (`icon-badge`, `badge-eyebrow`) vs Title Case ("Icon badge", "Eyebrow badge") across frontmatter/prose is conventional and resolvable. "Button — accent" (DESIGN) vs "gold accent button" (EXPERIENCE) is descriptive, not verbatim, but unambiguous.
- **Shape fit:** DESIGN.md section order is exactly canonical (Brand & Style → … → Do's & Don'ts) ✓. EXPERIENCE drops two example defaults — **Responsive & Platform** (folded thinly into IA/Interaction; the newly-specified grids Services 2×2 / Pricing 3-up have no stated breakpoint collapse) and **Inspiration & Anti-patterns** (defensible for a re-skin). Neither drop is explicitly justified; the Responsive drop is the weaker one given DESIGN introduces new grid specs. *Fix:* a 3-line responsive note on how the grids reflow under `md`.
- **Bloat:** low. DESIGN prose carries editorial voice appropriately; EXPERIENCE stays behavioral. Minor duplication: the "11 stacked sections" list appears in both Foundation and IA. Layout prose gives raw `1160px / 24px / 88px` values while `spacing` frontmatter says "no custom spacing tokens" — mildly contradictory (they are custom values, just un-tokenized), acceptable but worth a token or a note.
