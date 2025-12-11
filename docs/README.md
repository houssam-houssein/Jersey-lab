# GitHub Pages

This directory is used for GitHub Pages deployment.

The React application is built and deployed from the `client/` directory.

## Deployment

To update the GitHub Pages deployment:

1. Build the client application:
   ```bash
   cd client
   npm run build
   ```

2. Copy the built files to the docs folder:
   ```bash
   # From the project root
   Copy-Item -Path "client\dist\*" -Destination "docs\" -Recurse -Force
   ```

3. Commit and push the changes:
   ```bash
   git add docs/
   git commit -m "Update GitHub Pages deployment"
   git push origin main
   ```

The site will be automatically deployed to: `https://houssam-houssein.github.io/Jersey-lab/`

## Features

- Modern, responsive e-commerce website
- Dark-themed UI with custom green accent color (#bfff00)
- Mobile-friendly navigation with burger menu
- Product catalog management
- Admin dashboard with order management, user management, and promo code system
- Shopping cart with promo code support
- User authentication (email/password and Google OAuth)
- Teamwear inquiry system

## Tech Stack

- **Frontend**: React 18, Vite, React Router
- **Backend**: Node.js, Express, MongoDB
- **Styling**: CSS3 with responsive design
