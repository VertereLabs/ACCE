# ACCE Tutors — Component Inventory

> Generated 2026-07-04 (deep scan). Covers `acce-nextjs/src`.

## A. Homepage section components (`src/components/`)

Rendered in this order by `src/app/page.tsx` (between `<Navbar/>` and `<Footer/>`).
Each owns its content as inline constant arrays.

| # | Component | Client? | Section id | Content it renders | Primary CTA |
|---|-----------|---------|-----------|--------------------|-------------|
| — | `Navbar` | ✅ | — (fixed) | Nav links (Subjects/About/How It Works/Pricing/Guides/Contact), logo, mobile menu | WhatsApp "Get Started" |
| 1 | `Hero` | ✅ | — | Headline "Your Path to CA(SA) Success", founder card (Priyanka), floating badges | WhatsApp + `#services` |
| 2 | `Services` | — | `services` | 4 core subjects: Financial Accounting, Taxation, Management Accounting, Auditing | — |
| 3 | `About` | — | `about` | Founder story + 4 milestones (BCom, Bridging, Overcoming, 25% improvement) | — |
| 4 | `HowItWorks` | — | `how-it-works` | 4 steps: Reach Out → Free Consultation → Personalized Plan → Achieve Success | — |
| 5 | `WhyChoose` | — | `why-choose` | 6 value props (mentorship framing) | — |
| 6 | `Pricing` | — | `pricing` | 3 plans (Single / Monthly*popular / Semester); all prices **"TBD"** | WhatsApp "Get Quote" |
| 7 | `Resources` | — | `resources` | 3 guide cards → `/guides/*`; badges hard-coded **"Available"** | "View All Guides" |
| 8 | `Blog` | — | `blog` | 3 placeholder posts, all "Coming Soon" | LinkedIn follow |
| 9 | `CTA` | — | `contact` | Conversion block; phone + email; benefits list | WhatsApp + `mailto:` |
| — | `Footer` | — | — | Contact info, Subjects/Explore/Contact link columns, LinkedIn, © 2026 | — |

**Recurring visual pattern:** frosted-glass card —
`bg-white/10 backdrop-blur-md rounded-2xl border border-white/20` with lucide icons,
`font-display` headings and hover lift/scale transitions.

## B. Guide pages (`src/app/guides/`)

Not reusable components — each is a route `page.tsx`. Content is hand-authored JSX.

| Series | Overview page | Parts | Difficulty (per index) | PDF |
|--------|--------------|-------|------------------------|-----|
| Groups & Business Combinations | `groups/page.tsx` | 7 (`part-1..7`) | Advanced | `groups-business-combinations.pdf` |
| IFRS 15: Revenue | `ifrs-15/page.tsx` | 5 (`part-1..5`) | Intermediate | `ifrs-15-revenue.pdf` |
| IFRS 16: Leases | `ifrs-16/page.tsx` | 5 (`part-1..5`) | Intermediate | `ifrs-16-leases.pdf` |

Shared conventions across guide pages: `Navbar` + `Footer`, "back to…" `Link`, a PDF
download link, per-route `metadata` with canonical URL, and `prose prose-invert` article body.

## C. shadcn/ui primitives (`src/components/ui/`) — 49 files

Standard shadcn/ui set (Radix + `class-variance-authority`, styled with the local tokens):

`accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button,
calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog,
drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar,
navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area,
select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs,
textarea, toast, toaster, toggle, toggle-group, tooltip` (+ `use-toast.ts`).

**Actually used today:** `button` (heavily, incl. custom **`hero`** variant),
`toaster` + `sonner` + `tooltip` (mounted globally). The rest are installed library
surface not yet referenced by any page — safe to treat as available building blocks.

### `button` variants (`ui/button.tsx`)
`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, and the custom
**`hero`** (`gradient-accent text-accent-foreground hover:shadow-glow hover:scale-105`) —
`hero` is the site's signature CTA style.

## D. Hooks & utilities

| File | Export | Purpose |
|------|--------|---------|
| `hooks/use-mobile.tsx` | `useIsMobile` | Matches mobile breakpoint |
| `hooks/use-toast.ts` | `useToast` / `toast` | shadcn toast state |
| `lib/utils.ts` | `cn(...)` | `clsx` + `tailwind-merge` class combiner |
| `config/guides.ts` | `isGuidePublished`, `isDev`, `GUIDE_PUBLISH_STATUS` | Guide publish gating |

## E. Providers (`app/providers.tsx`, client)

Wraps the whole app: `QueryClientProvider` (react-query) → `ThemeProvider`
(next-themes, `defaultTheme="dark"`, `enableSystem`) → Radix `TooltipProvider`.
