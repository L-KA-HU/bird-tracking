import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],            // <- brings back the automatic JSX runtime
  base: '/bird-tracking/',       // <- GitHub Pages subpath
  build: { outDir: 'docs' }      // <- Pages serves from /docs
})
