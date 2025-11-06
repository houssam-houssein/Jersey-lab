# GitHub Pages Deployment Checklist

## ✅ Current Status
- ✅ Base path configured: `/NBA/`
- ✅ Assets paths correct: `/NBA/assets/...`
- ✅ 404.html configured for SPA routing
- ✅ React Router basename configured

## 📋 Steps to Deploy

1. **Upload `docs` folder to GitHub:**
   - Go to your GitHub repository
   - Navigate to the `docs` folder
   - Delete ALL old files in `docs`
   - Upload these new files:
     - `index.html`
     - `404.html`
     - `assets/` folder (with all contents)

2. **Verify GitHub Pages Settings:**
   - Settings → Pages
   - Source: `Deploy from a branch`
   - Branch: `main` (or `master`)
   - Folder: `/docs`
   - Click Save

3. **Wait 1-5 minutes** for GitHub to rebuild

4. **Test the site:**
   - Visit: `https://YOUR_USERNAME.github.io/NBA/`
   - Clear browser cache: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

## 🔍 Troubleshooting Black Screen

If you still see a black screen:

1. **Open Browser Console** (F12 or Right-click → Inspect → Console)
   - Look for any RED errors
   - Common issues:
     - `404 Not Found` on `/NBA/assets/...` → Check if files are uploaded correctly
     - `Failed to fetch` → Check network tab
     - `SyntaxError` → Check if JavaScript file is corrupted

2. **Check Network Tab** (F12 → Network)
   - Refresh the page
   - Look for failed requests (RED)
   - Verify these files load:
     - `/NBA/assets/index-XXXXX.js` ✅
     - `/NBA/assets/index.XXXXX.css` ✅
     - `/NBA/assets/images/logo.XXXXX.png` ✅
     - `/NBA/assets/images/poster.XXXXX.png` ✅

3. **Verify File Structure on GitHub:**
   ```
   docs/
   ├── index.html
   ├── 404.html
   └── assets/
       ├── index-XXXXX.js
       ├── index.XXXXX.css
       └── images/
           ├── logo.XXXXX.png
           └── poster.XXXXX.png
   ```

4. **Check URL:**
   - Must include trailing slash: `https://YOUR_USERNAME.github.io/NBA/`
   - NOT: `https://YOUR_USERNAME.github.io/NBA` (missing slash)

## 📝 If Repository Name is NOT "NBA"

If your repository name is different:

1. Edit `client/.env`:
   ```
   VITE_BASE_PATH=/your-repo-name/
   ```

2. Rebuild:
   ```powershell
   cd client
   npm run build
   ```

3. Copy files:
   ```powershell
   Remove-Item -Path "docs" -Recurse -Force
   robocopy "client\dist" "docs" /E
   Copy-Item -Path "client\404.html" -Destination "docs\404.html" -Force
   ```

4. Update `client/src/App.jsx` line 17-19 to match your repo name

## 🆘 Still Having Issues?

Share:
1. Browser console errors (F12 → Console)
2. Network tab errors (F12 → Network → Refresh)
3. Your GitHub repository URL
4. Screenshot of the `docs` folder on GitHub

