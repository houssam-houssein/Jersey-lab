import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get the base path from environment variable
// For localhost development, use '/' (no base path)
// For GitHub Pages production, use '/NBA-store/'
// Set VITE_BASE_PATH=/NBA-store/ when building for production
// Use command 'mode' to detect dev vs build
export default defineConfig(({ command, mode }) => {
  // In dev mode (command === 'serve'), always use '/'
  // In build mode, use '/NBA-store/' unless VITE_BASE_PATH is set
  const base = process.env.VITE_BASE_PATH || (command === 'serve' ? '/' : '/NBA-store/')
  
  return {

    base: base,
    plugins: [
      react(),
      // Plugin to copy 404.html to build output folder for GitHub Pages
      {
        name: 'copy-404',
        writeBundle() {
          const src404 = path.resolve(__dirname, '404.html')
          const outDir = process.env.BUILD_TO_DOCS ? '../docs' : 'dist'
          const dest404 = path.resolve(__dirname, outDir, '404.html')
          if (fs.existsSync(src404)) {
            fs.copyFileSync(src404, dest404)
            console.log(`Copied 404.html to ${outDir} folder`)
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
      outDir: process.env.BUILD_TO_DOCS ? '../docs' : 'dist',
      assetsDir: 'assets',
      emptyOutDir: !process.env.BUILD_TO_DOCS, // Don't empty docs folder (keep .nojekyll and README)
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
  }
})

