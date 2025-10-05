import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/bird-tracking/',   // GitHub Pages repo subpath
  build: { outDir: 'docs' }  // Pages serves from /docs
})
