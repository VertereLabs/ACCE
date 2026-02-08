# ACCE Deployment Guide (Coolify + Nixpacks)

This guide defines the standard workflow for deploying the ACCE Next.js app
to the VPS using Coolify and Nixpacks.

---

## 1 Project Assumptions

- Framework: Next.js (App Router)
- Deployment target: VPS via Coolify
- Build pack: Nixpacks
- Repo: GitHub

---

## 2 One-Time Coolify Setup

1. Create a new Application in Coolify from the GitHub repo.
2. Select Nixpacks as the build pack.
3. Set commands (only if auto-detection does not set them):
   - Build command: `npm run build`
   - Start command: `npm run start`
4. Set Node version if needed (match `package.json` engines).
5. Add required Environment Variables.
6. Attach domain and enable HTTPS.

---

## 3 Standard Operating Procedure (SOP)

### 3.1 Pre-Deploy (Local)

```bash
cd d:\Projects\ACCE - Copy\acce-nextjs
git pull origin main
npm run dev
```

Optional sanity build:

```bash
npm run build
```

### 3.2 Deploy (GitHub + Coolify)

```bash
git status
git add .
git commit -m "feat: Describe change"
git push origin main
```

In Coolify:
1. Confirm deployment started (auto or manual).
2. Watch build logs for success.
3. Confirm runtime logs show the app started.

### 3.3 Post-Deploy Verification

1. Visit the domain.
2. Verify key pages and any API routes.
3. Confirm assets load (`/_next/static`).

---

## 4 Environment Variables

- Store secrets in Coolify, not in the repo.
- If you change env vars, restart or redeploy the app in Coolify.

---

## 5 Troubleshooting

### 5.1 Build fails

1. Check the build logs in Coolify.
2. Fix the error locally.
3. Push again to trigger a new build.

### 5.2 Bad Gateway (502)

1. Confirm the app is running and listening on the expected port.
2. Verify Coolify has the correct internal port (default 3000).
3. Check proxy or healthcheck logs in Coolify.

### 5.3 Pages load but assets fail

1. Ensure the build completed successfully.
2. Verify the domain is mapped to the correct app.
3. Check for CSP or mixed-content issues.

---

## 6 Quick Reference

```bash
# Pull latest
git pull origin main

# Run dev
npm run dev

# Build
npm run build

# Commit + push
git add .
git commit -m "message"
git push origin main
```

