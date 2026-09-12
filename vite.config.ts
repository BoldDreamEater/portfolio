import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` is configurable so the same build works at a domain root (Vercel,
// Netlify, custom domain) and under a GitHub Pages subpath:
//   BASE_PATH=/portfolio/ npm run build
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    reportCompressedSize: false,
  },
})
