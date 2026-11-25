import { defineConfig } from '@playwright/test';

// El checkout de Wompi (checkout.wompi.co) rechaza con un 403 de CloudFront
// cualquier `redirect-url` que no sea https pública — localhost no sirve.
// Por eso estos tests corren contra un deploy real
// en vez de contra `vite dev`. No hay valor por defecto: producción usa llaves
// reales de Wompi, así que E2E_BASE_URL debe ser un deploy con llaves de sandbox.
if (!process.env.E2E_BASE_URL) {
  throw new Error('Define E2E_BASE_URL con un deploy que use llaves de sandbox de Wompi');
}

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: false, // cada test hace una compra real en el sandbox de Wompi
  retries: 1,
  reporter: 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
