# ACCE Tutors — Deployment Guide

> Generated 2026-07-04. Reflects config in `acce-nextjs/next.config.ts` and `deploy.ps1`.

Production domain: **https://accetutors.co.za**

## Build model

The app builds to a **self-contained Node server** via Next.js
`output: 'standalone'` (`next.config.ts`). The build emits `.next/standalone/server.js`,
which serves the app on port 3000 by default.

```bash
npm run build                     # produces .next/standalone/
node .next/standalone/server.js   # runs the standalone server
```

`images.unoptimized: true` means no separate image-optimization service is needed. There
are no environment variables, secrets, or database connections to configure.

## Preferred path — Coolify / VPS (Nixpacks)

Per the header comment in `deploy.ps1`, the intended production deploy is a self-hosted
VPS via **Coolify using Nixpacks**:

- **Build command:** `npm run build`
- **Start command:** `node .next/standalone/server.js`
- **Port:** 3000

This matches the Vertere Labs house standard (Next.js standalone → Coolify).

## Legacy path — `deploy.ps1` (manual bundle)

`acce-nextjs/deploy.ps1` is a **legacy** PowerShell script for manual uploads. It:

1. Runs `npm run build`.
2. Cleans and recreates the `deploy/` folder.
3. Assembles a runnable bundle by copying:
   - `.next/standalone/server.js` → `deploy/server.js`
   - `.next/` root manifests (`BUILD_ID`, `*-manifest.json`, `required-server-files.*`, …)
   - `.next/server/` (app logic) and `.next/static/` (client assets)
   - `public/` (static assets incl. images + PDFs)
   - `package.json` + `package-lock.json`

The resulting `deploy/` folder can be uploaded and started with `node server.js`. Prefer
the Coolify/Nixpacks path above for real deployments; use this only for manual hosting.

> Note: `next.config.ts` `output` is **`standalone`**, so the committed `out/` directory
> (a static-export artifact) is **not** the deploy target and may be stale.

## Security headers (applied at the app layer)

Set globally in `next.config.ts` `headers()` for every route:

- `Content-Security-Policy` — `default-src 'self' https: data: blob:`; scripts limited to
  self + `https://stats.verterelabs.co.za` (Umami); inline styles allowed; frames self-only.
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

Each guide PDF (`/pdfs/ifrs-16-leases.pdf`, `/pdfs/ifrs-15-revenue.pdf`,
`/pdfs/groups-business-combinations.pdf`) also gets a canonical `Link` header pointing at
its `accetutors.co.za` URL.

If deploying behind a reverse proxy/CDN, ensure these headers are preserved (or moved to
the proxy) and that the CSP script host stays in sync with the analytics endpoint.

## Analytics

Self-hosted **Umami** loaded in `src/app/layout.tsx`:
`https://stats.verterelabs.co.za/script.js`, website id `6c7e46f6-fba8-40d3-80fa-79a00cedad07`.
No cookie banner is present (Umami is cookieless).

## Pre-deploy checklist

- [ ] `npm run build` succeeds (no type/ESLint errors).
- [ ] Guide publish flags in `src/config/guides.ts` set as intended for production.
- [ ] Founder image + guide PDFs present in `public/`.
- [ ] Canonical URLs / `sitemap.ts` reflect any new routes.
- [ ] CSP script-src still matches the live Umami host.
