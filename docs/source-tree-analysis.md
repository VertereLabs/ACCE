# ACCE Tutors — Source Tree Analysis

> Annotated tree of the deployed website (`acce-nextjs/`). Generated 2026-07-04.

Only the `acce-nextjs/` app is the website. Repo-root siblings (`contentfiles/`, `zdocs/`,
`zSEO/`, `zdeploy/`, `design-artifacts/`, `docs/`) are supporting/working material.

```
acce-nextjs/
├── next.config.ts             # Standalone output, React Compiler, security headers (CSP/HSTS),
│                              #   unoptimized images, PDF canonical-link headers
├── tailwind.config.ts         # Design tokens → Tailwind colors, fonts (Playfair/DM Sans), container
├── tsconfig.json              # TS strict; @/* → ./src/*
├── postcss.config.mjs         # Tailwind + Autoprefixer
├── eslint.config.mjs          # eslint-config-next (flat config)
├── deploy.ps1                 # LEGACY manual standalone-assembly script (prefer Coolify/Nixpacks)
├── deploy/                    # Output folder produced by deploy.ps1 (assembled standalone bundle)
├── out/                       # Stale static export output (not the standalone target)
├── README.md                  # ⚠ untouched create-next-app template — not project-accurate
│
├── public/
│   ├── images/priyanka.png    # Founder photo — the only real content image
│   ├── pdfs/                  # Downloadable guide PDFs (ifrs-16, ifrs-15, groups)
│   ├── .well-known/security.txt
│   ├── humans.txt
│   └── *.svg                  # Default next/vercel/file/globe/window icons (mostly unused)
│
└── src/
    ├── app/                            # App Router — routes, layouts, metadata, SEO handlers
    │   ├── layout.tsx                  # Root layout: fonts, Umami script, JSON-LD, <Providers>, toasters
    │   ├── providers.tsx  (client)     # react-query + next-themes(dark) + Radix Tooltip providers
    │   ├── page.tsx                    # "/" homepage — composes the 11 section components
    │   ├── not-found.tsx               # 404 page
    │   ├── globals.css                 # Design tokens (HSL vars), gradients, base + utility layers
    │   ├── sitemap.ts                  # 23-route sitemap with depth-based priority
    │   ├── robots.ts                   # robots.txt (allow all) + sitemap/host
    │   ├── manifest.ts                 # PWA web manifest (name, colors, standalone display)
    │   ├── icon.tsx / apple-icon.tsx   # Generated favicons/app icons
    │   ├── opengraph-image.tsx         # Dynamic OG image for "/"
    │   ├── twitter-image.tsx           # Dynamic Twitter card for "/"
    │   ├── favicon.ico / book_*.png    # Static icon assets
    │   │
    │   ├── api/                        # EMPTY — no API routes exist
    │   │
    │   └── guides/
    │       ├── layout.tsx              # Thin <div class="guides-shell"> wrapper
    │       ├── page.tsx                # "/guides" index — cards, stats, reads isGuidePublished()
    │       ├── opengraph-image.tsx / twitter-image.tsx
    │       ├── ifrs-16/
    │       │   ├── page.tsx            # Series overview (5 parts listed)
    │       │   ├── opengraph-image.tsx / twitter-image.tsx
    │       │   └── part-1..part-5/page.tsx   # Hand-authored JSX articles (~200-224 LOC each)
    │       ├── ifrs-15/
    │       │   ├── page.tsx            # Series overview (5 parts)
    │       │   ├── opengraph-image.tsx / twitter-image.tsx
    │       │   └── part-1..part-5/page.tsx   # (~199-307 LOC each)
    │       └── groups/
    │           ├── page.tsx            # Series overview (7 parts)
    │           ├── opengraph-image.tsx / twitter-image.tsx
    │           └── part-1..part-7/page.tsx   # (~282-480 LOC each)
    │
    ├── components/                     # Homepage section components (11)
    │   ├── Navbar.tsx  (client)        # Fixed nav, mobile menu, WhatsApp CTA
    │   ├── Hero.tsx    (client)        # Headline + founder card + floating badges
    │   ├── Services.tsx                # 4 core subjects (Fin Acc, Tax, Man Acc, Auditing)
    │   ├── About.tsx                   # Founder story + 4 milestones
    │   ├── HowItWorks.tsx              # 4-step process
    │   ├── WhyChoose.tsx               # 6 value props
    │   ├── Pricing.tsx                 # 3 plans (prices = "TBD")
    │   ├── Resources.tsx               # 3 guide cards → /guides/*  (badges hard-coded "Available")
    │   ├── Blog.tsx                    # 3 placeholder posts ("Coming Soon")
    │   ├── CTA.tsx                     # id="contact" — WhatsApp/email conversion block
    │   ├── Footer.tsx                  # Contact details, link columns, LinkedIn
    │   └── ui/                         # 49 shadcn/ui primitives (Radix + CVA) — subset actually used
    │
    ├── config/
    │   └── guides.ts                   # GUIDE_PUBLISH_STATUS flags + isGuidePublished()/isDev
    │
    ├── hooks/
    │   ├── use-mobile.tsx              # Viewport breakpoint hook
    │   └── use-toast.ts                # Toast state hook (shadcn)
    │
    └── lib/
        └── utils.ts                    # cn() — clsx + tailwind-merge
```

## Entry points

- **App entry / global shell:** `src/app/layout.tsx` → `src/app/providers.tsx`
- **Homepage:** `src/app/page.tsx`
- **Guide library:** `src/app/guides/page.tsx`
- **Build/serve entry (standalone):** `.next/standalone/server.js` (from `npm run build`)

## Critical folders at a glance

| Folder | Purpose |
|--------|---------|
| `src/app/` | Routing, layouts, per-route metadata, SEO/PWA handlers |
| `src/app/guides/**` | The static study-guide content (17 article pages + 3 overviews) |
| `src/components/` | The 11 homepage sections (site copy lives here as inline data) |
| `src/components/ui/` | shadcn/ui design-system primitives |
| `src/config/` | Guide publish gating |
| `public/pdfs/` | Downloadable guide PDFs |
