---
name: ACCE Tutors
status: final
updated: 2026-07-05
sources:
  - {project-root}/docs/BRAND-DIRECTIONS.md
  - {project-root}/docs/index.md
  - {project-root}/docs/STRATEGY.md
---

# ACCE Tutors — Experience Spine

> Stage 1 covers the **marketing site** redesign only (the "fresh look"). Behavior is mostly
> the existing site plus one new capability: a dark/light **mode toggle**. Portal experience
> (auth, class booking, payments) is **Stage 2** and gets its own EXPERIENCE pass, reusing this
> visual system. Visual identity: [DESIGN.md](./DESIGN.md) — referenced by `{token}` name.

## Foundation

Single-surface **responsive web**. Next.js 16 App Router, statically rendered, **no backend**
(Stage 1). UI system: **shadcn/ui** (Radix + CVA) on Tailwind 3. DESIGN.md is the visual identity;
this spine specifies only the behavioral delta. The site is a **marketing landing page** (11
stacked homepage sections) + a **static IFRS study-guide library** — it converts visitors to
WhatsApp/email enquiries. No forms, accounts, or dynamic data in this stage.

New in this stage: the site ships a **two-mode theme** (dark default, light alternate) via
`next-themes` with `defaultTheme="dark"`. Everything else is a visual re-skin of existing routes.

## Information Architecture

| Surface | Reached from | Purpose |
|---|---|---|
| Homepage `/` | logo / direct | 11 sections: Navbar · Hero · Services · About · HowItWorks · WhyChoose · Pricing · Resources · Blog · CTA · Footer |
| Guides index `/guides` | Navbar "Guides", Resources CTA | Library landing → 3 series |
| Guide series/parts | Guides index, Resources cards | IFRS 16 (5) · IFRS 15 (5) · Groups & Business Combinations (7) — static JSX, gated by `src/config/guides.ts` |
| Contact (anchor/CTA) | Navbar "Contact", CTA, Footer | WhatsApp (`wa.me/27713255295`) + email (`priyankamikaya21@gmail.com`) — no form |

Navbar is sticky, translucent (`--background/.82` + blur), collapses to a menu under `md`. Anchor
nav scrolls smoothly to homepage sections. No new routes are added in Stage 1.

→ Composition reference: [`mockups/mock-final-dark-default.html`](./mockups/mock-final-dark-default.html)
(default) and [`mockups/mock-final-light-mode.html`](./mockups/mock-final-light-mode.html) (light).
This spine wins on conflict.

## Voice and Tone

Microcopy. Brand voice/aesthetic posture lives in DESIGN.md (Brand & Style). The dual identity —
**exam authority + human mentorship** — is carried in copy by pairing a confident claim with a
first-person, been-there aside.

| Do | Don't |
|---|---|
| First person, Priyanka's voice ("I improved 25% by going back to basics") | Corporate "we" or faceless institution tone |
| Concrete, results-first ("38% → 63%", "four passes") | Vague hype ("world-class", "guaranteed success") |
| Warm and direct ("I've been there, and I can help") | Salesy pressure or exam-fear-mongering |
| Plain accounting terms students use (PGDA, CTA, CA(SA), IFRS 16) | Over-explaining the qualification to its own audience |

Existing copy already fits — the redesign preserves it verbatim; only presentation changes.

## Component Patterns (behavioral)

Visual specs in DESIGN.md.Components. Behavior only here:

- **Eyebrow badge** opens every section — a static label, not interactive.
- **Cards** (services, values, steps, resources, blog) are presentational; where a card represents
  a destination (Resources → guide, Blog → post) the whole card is the click target with a visible
  "View Guide →" affordance. Blog cards are **disabled/"Coming Soon"** (no routes yet) — non-clickable,
  clearly labelled, not dead links.
- **Pricing** shows **"TBD"** amounts by design in Stage 1 (real rates pending); every tier CTA is
  "Get Quote" → contact. The middle tier is visually emphasised ("Most Popular") but not preselected.
- **Primary conversion CTA is the gold accent button** (Get Started / WhatsApp Me) — exactly one per
  view group so the eye is never split between two golds.

## State Patterns

- **Guide availability** derives from `src/config/guides.ts` (single source): unavailable guides render
  as "Coming Soon" on both the homepage Resources section and the Guides index — never a 404.
- **Mode (dark/light)** persists across visits (localStorage via `next-themes`); first paint respects
  the stored choice with no flash (`suppressHydrationWarning` + inline theme script).
- **Hover/focus:** buttons brighten (`filter`), ghost buttons fill `--muted`, nav links shift to
  `accent-ink`. All interactive elements show a visible focus ring (`--ring`).
- No loading/empty/error states in Stage 1 (static site, no data fetches).

## Interaction Primitives

- **Theme toggle:** a single control in the Navbar (sun/moon lucide icon), toggles `dark` ⇄ `light`,
  animates nothing structural — only colors cross-fade. Keyboard-operable, `aria-label` reflects target mode.
- **Smooth-scroll** anchor nav (`scroll-behavior:smooth`) with a scroll-margin offset for the sticky navbar.
- **Mobile menu:** hamburger opens a sheet/overlay of the six nav links + CTA.
- Motion is decorative only (blurred hero orbs, hover transitions) — see Accessibility Floor.

## Accessibility Floor

- **Contrast:** body text ≥ 4.5:1, large display ≥ 3:1, in **both** modes. Gold-on-base as small text
  is prohibited — use `{accent-ink}` (mode-specific readable gold). Verify the dark-mode
  `muted-foreground` (`40 14% 70%`) and light-mode (`223 12% 44%`) against their bases at build.
- **Keyboard:** every link, button, card-link, the theme toggle, and the mobile menu are reachable and
  operable; visible focus ring on all; logical tab order top-to-bottom.
- **Reduced motion:** honor `prefers-reduced-motion` — disable the hero orb drift/transitions and any
  scroll animation; smooth-scroll falls back to instant.
- **Semantics:** one `<h1>` (Hero), sections use heading hierarchy; icons are decorative
  (`aria-hidden`) with text labels carrying meaning; logo `<img>` has alt "ACCE Tutors".
- **Targets:** interactive controls ≥ 44px touch target on mobile.

## Key Flows

**Thandi, final-year CTA student, 11pm, phone in bed, dreading Financial Accounting.**
She's failed a module and found ACCE via a WhatsApp forward. 1) Lands on `/` — dark, premium; the
hero "Your Path to **CA(SA) Success**" and Priyanka's 38%→63% card tell her *this person actually
did it*. 2) Scrolls Services → sees Financial Accounting called out with "I improved my score by
25% by going back to basics." **Climax:** the About section's "When I failed Financial Accounting
with 38%, something shifted" — she feels *seen*, not sold to. 3) Why-Choose confirms flexibility
for working students; Pricing says "TBD / Get Quote" so there's no cost wall. 4) Taps the gold
**WhatsApp Me** in the CTA → `wa.me` opens with ACCE. Conversion = one message sent.

**Sipho, night-shift study, prefers light screens.** He finds ACCE at his desk and the dark default
feels heavy for long reading. 1) He taps the **sun/moon toggle** in the navbar. 2) The palette
cross-fades to Warm Scholar (ivory + navy + warm gold) — **climax:** same type, same layout, same
logo intent; only color moved, so it's unmistakably still ACCE. 3) He reads two IFRS guides in light.
4) He returns next week — the site opens **light with no flash** (stored choice honored at first paint).
*Failure paths:* JS disabled or hydration not yet run → SSR serves the **dark default** (never a wrong
flash); `localStorage` blocked (private mode) → toggle still works for the session but preference
won't persist — acceptable, no error surfaced.

**Nomsa, revising IFRS 16 the night before a test.** 1) From the homepage Resources section she taps
"Groups & Business Combinations" → lands on `/guides`. 2) She opens an **available** IFRS 16 part and
reads. 3) She taps a later part that isn't published yet — **climax:** it shows a clear **"Coming
Soon"** state (from `src/config/guides.ts`), *not* a 404 or a dead link, so the library never feels
broken. 4) She falls back to the available parts. The single gating source keeps the homepage
Resources cards and the Guides index perfectly in sync — an unavailable guide is "Coming Soon"
everywhere or nowhere.
