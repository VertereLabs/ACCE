# ACCE Standalone Deployment Script
# This script builds and assembles the deploy folder according to STANDALONE_BUILD_GUIDE.md

Write-Host "=== ACCE Standalone Deployment Script ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build the project
Write-Host "Step 1: Building Next.js project (standalone mode)..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please fix errors and try again." -ForegroundColor Red
    exit 1
}
Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

# Step 2: Clean and prepare deploy folder
Write-Host "Step 2: Preparing deploy folder..." -ForegroundColor Yellow

# Remove old deploy contents (except keeping the folder itself)
if (Test-Path "deploy\.next") {
    Remove-Item -Recurse -Force "deploy\.next"
    Write-Host "  - Cleaned old deploy\.next" -ForegroundColor Gray
}
if (Test-Path "deploy\public") {
    Remove-Item -Recurse -Force "deploy\public"
    Write-Host "  - Cleaned old deploy\public" -ForegroundColor Gray
}
if (Test-Path "deploy\server.js") {
    Remove-Item -Force "deploy\server.js"
    Write-Host "  - Cleaned old deploy\server.js" -ForegroundColor Gray
}
if (Test-Path "deploy\package.json") {
    Remove-Item -Force "deploy\package.json"
    Write-Host "  - Cleaned old deploy\package.json" -ForegroundColor Gray
}
if (Test-Path "deploy\package-lock.json") {
    Remove-Item -Force "deploy\package-lock.json"
    Write-Host "  - Cleaned old deploy\package-lock.json" -ForegroundColor Gray
}
if (Test-Path "deploy\node_modules") {
    Remove-Item -Recurse -Force "deploy\node_modules"
    Write-Host "  - Cleaned old deploy\node_modules" -ForegroundColor Gray
}

# Ensure deploy folder exists
if (-not (Test-Path "deploy")) {
    New-Item -ItemType Directory -Path "deploy" | Out-Null
}

Write-Host "  Deploy folder prepared." -ForegroundColor Green
Write-Host ""

# Step 3: Copy files to deploy folder
Write-Host "Step 3: Assembling deploy folder..." -ForegroundColor Yellow

# 3a: Copy server.js from standalone
Write-Host "  - Copying server.js from .next\standalone\" -ForegroundColor Gray
Copy-Item ".next\standalone\server.js" "deploy\server.js"

# 3b: Create .next folder in deploy
New-Item -ItemType Directory -Path "deploy\.next" -Force | Out-Null

# 3c: Copy root-level .next files (BUILD_ID, manifests, etc.)
Write-Host "  - Copying .next\ root files (BUILD_ID, manifests)" -ForegroundColor Gray
$rootFiles = @(
    "BUILD_ID",
    "build-manifest.json",
    "app-path-routes-manifest.json",
    "export-marker.json",
    "fallback-build-manifest.json",
    "images-manifest.json",
    "package.json",
    "prerender-manifest.json",
    "required-server-files.js",
    "required-server-files.json",
    "routes-manifest.json"
)
foreach ($file in $rootFiles) {
    $sourcePath = ".next\$file"
    if (Test-Path $sourcePath) {
        Copy-Item $sourcePath "deploy\.next\$file"
    }
}

# 3d: Copy .next\server to deploy\.next\server
Write-Host "  - Copying .next\server\ (app logic)" -ForegroundColor Gray
Copy-Item -Recurse ".next\server" "deploy\.next\server"

# 3e: Copy .next\static to deploy\.next\static
Write-Host "  - Copying .next\static\ (client assets: CSS, JS)" -ForegroundColor Gray
Copy-Item -Recurse ".next\static" "deploy\.next\static"

# 3f: Copy public folder
Write-Host "  - Copying public\ (static assets)" -ForegroundColor Gray
Copy-Item -Recurse "public" "deploy\public"

# 3g: Copy package files
Write-Host "  - Copying package.json and package-lock.json" -ForegroundColor Gray
Copy-Item "package.json" "deploy\package.json"
Copy-Item "package-lock.json" "deploy\package-lock.json"

Write-Host "  Assembly complete!" -ForegroundColor Green
Write-Host ""

# Step 4: Summary
Write-Host "=== Deployment Package Ready ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Deploy folder structure:" -ForegroundColor White
Write-Host "  deploy\" -ForegroundColor Gray
Write-Host "  +-- .next\" -ForegroundColor Gray
Write-Host "  |   +-- BUILD_ID, manifests (root files)" -ForegroundColor Gray
Write-Host "  |   +-- server\     (app logic)" -ForegroundColor Gray
Write-Host "  |   +-- static\     (client assets)" -ForegroundColor Gray
Write-Host "  +-- public\         (static files)" -ForegroundColor Gray
Write-Host "  +-- server.js       (startup script)" -ForegroundColor Gray
Write-Host "  +-- package.json" -ForegroundColor Gray
Write-Host "  +-- package-lock.json" -ForegroundColor Gray
Write-Host ""
Write-Host "=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Upload the contents of the 'deploy' folder to your server" -ForegroundColor White
Write-Host "2. On the server, run: npm install --omit=dev" -ForegroundColor White
Write-Host "3. Start the app with: node server.js" -ForegroundColor White
Write-Host "   (or set 'server.js' as Application Startup File in hosting panel)" -ForegroundColor Gray
Write-Host ""
Write-Host "Done!" -ForegroundColor Green
