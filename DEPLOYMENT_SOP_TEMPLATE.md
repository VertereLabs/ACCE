# Deployment SOP Template (Coolify + Nixpacks)

This document is a standard, project-agnostic deployment SOP you can reuse
across projects. Replace placeholders in brackets with project-specific values.

---

## 1 Project Assumptions

- Framework: [framework and version]
- Deployment target: [hosting environment] via Coolify
- Build pack: Nixpacks (or [other build pack])
- Repo host: [GitHub/GitLab/Bitbucket]

---

## 2 One-Time Coolify Setup

1. Create a new Application in Coolify from the repo.
2. Select Nixpacks as the build pack.
3. Set commands (only if auto-detection does not set them):
   - Build command: `[build command]`
   - Start command: `[start command]`
4. Set runtime version if needed (match the project config, e.g. `package.json`).
5. Add required environment variables.
6. Attach domain and enable HTTPS.

---

## 3 Standard Operating Procedure (SOP)

### 3.1 Pre-Deploy (Local)

```bash
cd [path to repo]
git pull origin [default-branch]
[run local dev command]
```

Optional sanity build:

```bash
[run build command]
```

### 3.2 Deploy (Repo + Coolify)

```bash
git status
git add .
git commit -m "[type]: describe change"
git push origin [default-branch]
```

In Coolify:
1. Confirm deployment started (auto or manual).
2. Watch build logs for success.
3. Confirm runtime logs show the app started.

### 3.3 Post-Deploy Verification

1. Visit the domain.
2. Verify key pages and any API routes.
3. Confirm assets load (e.g. static assets or CDN paths).

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
2. Verify Coolify has the correct internal port (e.g. 3000).
3. Check proxy or healthcheck logs in Coolify.

### 5.3 Pages load but assets fail

1. Ensure the build completed successfully.
2. Verify the domain is mapped to the correct app.
3. Check for CSP or mixed-content issues.

---

## 6 Quick Reference

```bash
# Pull latest
git pull origin [default-branch]

# Run dev
[run local dev command]

# Build
[run build command]

# Commit + push
git add .
git commit -m "[type]: message"
git push origin [default-branch]
```

