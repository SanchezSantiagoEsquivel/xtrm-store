import { defineConfig } from '@playwright/test';

// El checkout de Wompi (checkout.wompi.co) rechaza con un 403 de CloudFront
// cualquier `redirect-url` que no sea https pública — localhost no sirve.
// Por eso estos tests corren contra un deploy real (por defecto producción)
// en vez de contra `vite dev`. Pasa E2E_BASE_URL para apuntar a un preview.
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: false, // cada test hace una compra real en el sandbox de Wompi
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'https://xtrm-store.vercel.app',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
