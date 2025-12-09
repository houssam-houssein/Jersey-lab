import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get the base path from environment variable
// For localhost development, use '/' (no base path)
// For GitHub Pages production, use '/NBA-store/'
// Set VITE_BASE_PATH=/NBA-store/ when building for production
const base = process.env.VITE_BASE_PATH || (process.env.NODE_ENV === 'production' ? '/NBA-store/' : '/')

export default defineConfig({
  base: base,
  plugins: [
    react(),
    // Plugin to copy 404.html to dist folder for GitHub Pages
    {
      name: 'copy-404',
      writeBundle() {
        const fs = require('fs')
        const path = require('path')
        const src404 = path.resolve(__dirname, '404.html')
        const dest404 = path.resolve(__dirname, 'dist', '404.html')
        if (fs.existsSync(src404)) {
          fs.copyFileSync(src404, dest404)
          console.log('Copied 404.html to dist folder')
        }
      }
    }
  ],
  server: {
    port: 3000,
    hmr: {
      overlay: true
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.png')) {
            return 'assets/images/[name].[hash][extname]'
          }
          return 'assets/[name].[hash][extname]'
        }
      }
    }
  }
})

