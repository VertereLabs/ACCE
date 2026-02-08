# ACCE Tutors - Deployment Guide (VPS + Coolify)

This guide covers the GitHub + Coolify workflow for deploying the Next.js app to your VPS using Nixpacks. It replaces the old Hostking workflow.

---

## Overview

We use a single Git repo and let Coolify build and run the app on the VPS:

| System | Location | Purpose |
|--------|----------|---------|
| **GitHub** | `acce-nextjs/` | Source code version control |
| **Coolify** | VPS | Build + deploy + runtime |

```
┌─────────────────────────────────────────────────────────────────────┐
│                        WORKFLOW OVERVIEW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Developer Machine                                                 │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │                                                             │   │
│   │   acce-nextjs/                                               │   │
│   │   ├── src/                     ┐                            │   │
│   │   ├── public/                  │  Source Code               │   │
│   │   ├── package.json             ┘  → Push to GitHub           │   │
│   │                                                             │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│                    │                           │                    │
│                    ▼                           ▼                    │
│              ┌──────────┐              ┌──────────────┐             │
│              │  GitHub  │              │   Coolify    │             │
│              │  (code)  │              │  (build/run) │             │
│              └──────────┘              └──────────────┘             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Part 1: Daily Development Workflow (GitHub)

### 1.1 Before You Start Coding

```bash
cd d:\Projects\ACCE - Copy\acce-nextjs
git pull origin main
```

### 1.2 Making Code Changes

1. Make changes in `src/`, `public/`, etc.
2. Test locally:
   ```bash
   npm run dev
   ```
3. Open http://localhost:3000 to verify changes work

### 1.3 Saving Changes to GitHub

```bash
git status
git add .
git commit -m "feat: Describe the change"
git push origin main
```

### 1.4 Commit Message Guidelines

| Prefix | Use For | Example |
|--------|---------|---------|
| `feat:` | New features | `feat: Add user authentication` |
| `fix:` | Bug fixes | `fix: Correct mobile menu alignment` |
| `docs:` | Documentation | `docs: Update README` |
| `style:` | Formatting/CSS | `style: Improve button hover states` |
| `refactor:` | Code restructuring | `refactor: Split utils into modules` |

---

## Part 2: VPS Deployment with Coolify (Nixpacks)

> Only deploy to production when changes are tested and ready for the live site.

### 2.1 One-Time Coolify App Setup

1. Create a new **Application** in Coolify from the GitHub repo
2. Choose **Nixpacks** as the build pack
3. Set commands (only if auto-detection does not set them)
   - **Build Command**: `npm run build`
   - **Start Command**: `node .next/standalone/server.js`
4. Set the Node version (match `package.json` engines if present)
5. Add required **Environment Variables**
6. Attach domain and enable HTTPS

### 2.2 Deploying Updates

1. Push to GitHub (Part 1.3)
2. In Coolify, trigger deploy (or let auto-deploy run)
3. Check the build and runtime logs for errors

### 2.3 Verify the Deployment

1. Visit the production domain
2. Check key pages and API routes
3. Verify assets load correctly (`/_next/static`)

---

## Part 3: Complete Deployment Checklist

```
□ All changes committed to GitHub
□ Changes tested locally (npm run dev)
□ Coolify build succeeded
□ App started successfully
□ Domain + HTTPS configured
□ Verify live site is working
```

---

## Part 4: Important Notes

### Environment Variables

Store secrets in Coolify, not in the repo:
- `.env` files are ignored by `.gitignore`
- Set `NEXT_PUBLIC_*` variables in Coolify as needed

### Node.js Restarts

Coolify restarts the app automatically after deployment. If you change environment variables, redeploy or restart the app in Coolify.

### Downtime

Deployments can cause brief downtime during restart. Deploy during low-traffic windows if possible.

---

## Part 5: Troubleshooting

### Build fails

1. Check the build logs in Coolify
2. Fix the code error locally
3. Push again to trigger a new build

### App starts but pages fail

1. Check runtime logs for missing environment variables
2. Ensure `output: 'standalone'` is set in `next.config.ts`
3. Confirm start command is `node .next/standalone/server.js`

### Assets not loading

1. Ensure the build completed successfully
2. Verify the domain is pointing to the Coolify app
3. Check for mixed-content or CSP issues

---

## Quick Reference Commands

```bash
# GITHUB (Source Code)
cd d:\Projects\ACCE - Copy\acce-nextjs
git pull origin main
git add .
git commit -m "message"
git push origin main

# LOCAL BUILD (optional sanity check)
npm run build
```

---

*Last updated: February 2026*
