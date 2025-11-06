# GitHub Pages Black Screen Debugging Guide

## ✅ Files Are Ready
Your `docs` folder now has:
- ✅ Correct base path: `/NBA/assets/...`
- ✅ Updated React Router basename detection
- ✅ Error handling in main.jsx
- ✅ 404.html for SPA routing

## 📤 Upload to GitHub

1. **Go to your GitHub repository**
2. **Navigate to `docs` folder**
3. **Delete ALL old files** in `docs`
4. **Upload these files from `C:\Users\houssam\Desktop\NBA\docs\`:**
   - `index.html`
   - `404.html`
   - `assets/` folder (with ALL contents inside)

## 🔍 Debugging Black Screen

After uploading, if you still see a black screen:

### Step 1: Open Browser Console
1. Press **F12** (or Right-click → Inspect)
2. Go to **Console** tab
3. Look for **RED errors**

**Common errors to look for:**
- `Failed to load module script` → JavaScript file not found
- `404 Not Found` → File path incorrect
- `CORS error` → Cross-origin issue
- `Cannot read property` → JavaScript error

### Step 2: Check Network Tab
1. Press **F12** → **Network** tab
2. **Refresh the page** (F5)
3. Look for **RED failed requests**

**Check these files load successfully (should be GREEN/200):**
- `/NBA/assets/index-K9npDvE1.js` ✅
- `/NBA/assets/index.C4qO2Td3.css` ✅
- `/NBA/assets/images/logo.XXXXX.png` ✅
- `/NBA/assets/images/poster.XXXXX.png` ✅

### Step 3: Verify URL
**Make sure you're accessing:**
- ✅ `https://YOUR_USERNAME.github.io/NBA/` (with trailing slash)
- ❌ NOT: `https://YOUR_USERNAME.github.io/NBA` (missing slash)

### Step 4: Check File Structure on GitHub
Your `docs` folder on GitHub should look like:
```
docs/
├── index.html          (684 bytes)
├── 404.html            (for SPA routing)
└── assets/
    ├── index-K9npDvE1.js      (174 KB)
    ├── index.C4qO2Td3.css     (19 KB)
    └── images/
        ├── logo.8rOKhDtD.png  (14 KB)
        └── poster.Bbr87nBh.png (1.7 MB)
```

## 🐛 Common Issues & Fixes

### Issue 1: JavaScript file returns 404
**Symptom:** Console shows `Failed to load module script: The server responded with a non-JavaScript MIME type`

**Fix:** 
- Verify the file exists in `docs/assets/`
- Check the filename matches in `index.html` (should be `index-K9npDvE1.js`)
- Make sure you uploaded the entire `assets` folder

### Issue 2: Base path mismatch
**Symptom:** Console shows `Failed to fetch` or `404` on assets

**Fix:**
- Verify your repository name is exactly "NBA"
- If different, update `client/vite.config.js` line 8: `const base = process.env.VITE_BASE_PATH || '/YOUR-REPO-NAME/'`
- Rebuild: `cd client && npm run build`
- Copy files again

### Issue 3: React not rendering
**Symptom:** Black screen, no console errors, but title shows correctly

**Possible causes:**
- JavaScript file loaded but React failed to initialize
- Check Console for any warnings
- Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

## 📋 What to Share If Still Not Working

Please share:
1. **Browser Console errors** (F12 → Console → Screenshot or copy errors)
2. **Network tab** showing which files failed (F12 → Network → Screenshot)
3. **Your GitHub repository URL**
4. **Screenshot of your `docs` folder** on GitHub showing file structure

## ✅ Quick Test

After uploading, test these URLs:
- `https://YOUR_USERNAME.github.io/NBA/` → Should show homepage
- `https://YOUR_USERNAME.github.io/NBA/shipping-returns` → Should show shipping page
- `https://YOUR_USERNAME.github.io/NBA/signup` → Should show signup page

If all work, your deployment is successful! 🎉

