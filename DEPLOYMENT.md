# GitHub Pages Deployment Guide

## Steps to Deploy:

1. **Build the project:**
   ```bash
   cd client
   npm run build
   ```

2. **If your repository is at `username.github.io/repo-name`:**
   - Copy the contents of `client/dist` folder to a `docs` folder in the root of your repo
   - OR copy to the root of a `gh-pages` branch
   - Make sure to include the `404.html` file (already created)

3. **If your repository is at `username.github.io` (root repository):**
   - Copy the contents of `client/dist` folder to the root of your repo
   - Make sure to include the `404.html` file

4. **Configure GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Select source branch (main/master) and folder (docs or root)
   - Save

5. **Set the base path (if needed):**
   - If your repo is NOT at the root (username.github.io/repo-name), create a `.env` file in the `client` folder:
   ```
   VITE_BASE_PATH=/repo-name/
   ```
   - Then rebuild: `npm run build`

## Important Files:
- `404.html` - Handles routing for GitHub Pages
- `vite.config.js` - Configured with base path support
- `App.jsx` - Updated to handle GitHub Pages routing

## Troubleshooting:
- If you see a white screen, check the browser console for errors
- Make sure all assets are loading (check Network tab)
- Verify the base path matches your repository structure
- Clear browser cache and try again

