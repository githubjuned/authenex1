Write-Host "=========================================="
Write-Host "   AUTHENEX GOOGLE CLOUD DEPLOYMENT PREP"
Write-Host "=========================================="

# 1. Build Frontend
Write-Host "Step 1: Building Frontend..."
Set-Location frontend
npm install
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Frontend build failed!"
    exit 1
}

# 2. Copy to Backend
Write-Host "Step 2: Copying build artifacts to backend..."
Set-Location ..
if (!(Test-Path "backend/public")) {
    New-Item -ItemType Directory -Force -Path "backend/public"
}

Copy-Item -Recurse -Force "frontend/dist/*" "backend/public/"

# 3. Instructions
Write-Host "=========================================="
Write-Host "   BUILD COMPLETE!"
Write-Host "=========================================="
Write-Host "Your app is ready for Google App Engine."
Write-Host ""
Write-Host "NEXT STEPS:"
Write-Host "1. Install Google Cloud SDK: https://cloud.google.com/sdk/docs/install"
Write-Host "2. Initialize SDK: gcloud init"
Write-Host "3. Deploy:"
Write-Host "   cd backend"
Write-Host "   gcloud app deploy"
Write-Host ""
Write-Host "NOTE: Ensure you have added your environment variables to backend/app.yaml"
Write-Host "=========================================="
Read-Host -Prompt "Press Enter to exit"
