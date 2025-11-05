# How to Delete Old Files and Redeploy on GitHub Pages

## Option 1: Delete Files via GitHub Web Interface (Easiest)

1. **Go to your GitHub repository** in a web browser
2. **Navigate to the folder** where you deployed your files (usually `docs/` folder or root of `gh-pages` branch)
3. **Click on each file/folder** you want to delete
4. **Click the trash icon** (🗑️) at the top right
5. **Click "Commit changes"** to delete the files
6. **Repeat** for all old files

## Option 2: Delete Files via Git Commands (Recommended)

### Step 1: Delete old deployment files locally

```bash
# Navigate to your project root
cd C:\Users\houssam\Desktop\NBA

# If you deployed to a 'docs' folder in the root:
# Delete the docs folder (if it exists)
rm -rf docs

# If you deployed to a 'gh-pages' branch:
# Switch to gh-pages branch and delete files
git checkout gh-pages
# Then delete all files except .git
```

### Step 2: Rebuild your project

```bash
# Go to client directory
cd client

# Rebuild with latest changes
npm run build

# This creates/updates the client/dist folder
```

### Step 3: Copy new files to deployment location

**If deploying to a `docs` folder:**

```bash
# From project root
cd C:\Users\houssam\Desktop\NBA

# Create docs folder if it doesn't exist
mkdir docs

# Copy all files from client/dist to docs
# Windows PowerShell:
Copy-Item -Path "client\dist\*" -Destination "docs\" -Recurse -Force

# Also copy the 404.html file
Copy-Item -Path "client\404.html" -Destination "docs\404.html" -Force
```

**If deploying to `gh-pages` branch:**

```bash
# Create or switch to gh-pages branch
git checkout --orphan gh-pages
# OR if branch exists:
git checkout gh-pages

# Delete all files
git rm -rf .

# Copy files from dist
cp -r client/dist/* .
# OR on Windows PowerShell:
Copy-Item -Path "client\dist\*" -Destination "." -Recurse -Force

# Copy 404.html
Copy-Item -Path "client\404.html" -Destination "404.html" -Force
```

### Step 4: Commit and push

```bash
# Add all new files
git add .

# Commit the changes
git commit -m "Update deployment with latest changes"

# Push to GitHub
git push origin main  # If using docs folder
# OR
git push origin gh-pages  # If using gh-pages branch
```

## Quick PowerShell Script (Windows)

Save this as `redeploy.ps1` in your project root:

```powershell
# Rebuild the project
Write-Host "Building project..." -ForegroundColor Green
cd client
npm run build
cd ..

# Remove old docs folder
Write-Host "Removing old files..." -ForegroundColor Green
if (Test-Path "docs") {
    Remove-Item -Path "docs" -Recurse -Force
}

# Create new docs folder
Write-Host "Creating new deployment..." -ForegroundColor Green
New-Item -ItemType Directory -Path "docs" -Force | Out-Null

# Copy new files
Write-Host "Copying files..." -ForegroundColor Green
Copy-Item -Path "client\dist\*" -Destination "docs\" -Recurse -Force
Copy-Item -Path "client\404.html" -Destination "docs\404.html" -Force

Write-Host "Deployment files ready!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. git add docs/" -ForegroundColor Cyan
Write-Host "2. git commit -m 'Update deployment'" -ForegroundColor Cyan
Write-Host "3. git push origin main" -ForegroundColor Cyan
```

Then run: `.\redeploy.ps1`

## Verify Deployment

After pushing:
1. Go to your repository on GitHub
2. Navigate to Settings → Pages
3. Make sure the source is set correctly
4. Wait a few minutes for GitHub Pages to rebuild
5. Visit your site URL

## Troubleshooting

- **Files not updating?** Clear browser cache or use incognito mode
- **Still seeing old files?** GitHub Pages may take 1-5 minutes to update
- **404 errors?** Make sure `404.html` is in the deployment folder
- **White screen?** Check browser console for errors and verify all assets are loading

