import { defineConfig } from 'vite'
export default defineConfig({
  base: '/bird-tracking/',   // repo name with trailing slash
  build: { outDir: 'docs' }  // Pages serves from /docs
})
