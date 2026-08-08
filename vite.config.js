import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // api/ son Vercel Functions — en dev las sirve e2e/api-shim.mjs (ver ese
    // archivo). En producción Vercel las sirve nativo, este proxy no aplica.
    proxy: {
      '/api': `http://localhost:${process.env.API_SHIM_PORT || 3011}`,
    },
  },
})
