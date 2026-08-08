import { test, expect } from '@playwright/test';

// Tests de integración real: cada uno agrega una gorra al carrito, llena el
// checkout, paga en el Web Checkout real de Wompi (modo sandbox, tarjetas de
// prueba oficiales) y verifica que nuestro sitio confirme o rechace el pedido
// correctamente al volver. No hay mocks — si Wompi cambia su flujo o nuestras
// llaves/firma se rompen, estos tests lo detectan.
//
// Tarjetas de prueba de Wompi (cualquier fecha futura y CVC de 3 dígitos):
//   4242 4242 4242 4242 → aprobada
//   4111 1111 1111 1111 → rechazada
// https://docs.wompi.co/docs/en-us/datos-de-prueba-en-sandbox

const CARD_APPROVED = '4242424242424242';
const CARD_DECLINED = '4111111111111111';

const BUYER = {
  fullName: 'Cliente de Prueba',
  email: 'prueba@xtrm.test',
  phone: '3001234567',
  address: 'Calle 123 #45-67',
  city: 'Cali',
  department: 'Valle del Cauca',
};

/** Home → tienda → primer producto → agregar al carrito → checkout. */
async function addFirstProductAndGoToCheckout(page) {
  await page.goto('/');
  await page.getByRole('link', { name: /^tienda$/i }).first().click();
  await page.locator('.product-card').first().click();
  await page.waitForURL(/\/producto\//);
  await page.getByRole('button', { name: /agregar al carrito/i }).click();
  await page.getByRole('button', { name: /carrito de compras/i }).click();
  await page.getByRole('link', { name: /ir a pagar/i }).click();
  await page.waitForURL(/\/checkout$/);
}

/** Llena el formulario de envío y hace click en "Pagar", hasta llegar a Wompi. */
async function fillShippingAndPay(page) {
  await page.fill('#fullName', BUYER.fullName);
  await page.fill('#email', BUYER.email);
  await page.fill('#phone', BUYER.phone);
  await page.fill('#address', BUYER.address);
  await page.fill('#city', BUYER.city);
  await page.fill('#department', BUYER.department);

  await Promise.all([
    page.waitForURL(/checkout\.wompi\.co/, { timeout: 20_000 }),
    page.getByRole('button', { name: /^pagar/i }).click(),
  ]);
}

/** En el Web Checkout de Wompi: elige tarjeta, llena comprador + tarjeta, confirma. */
async function payWithCard(page, cardNumber) {
  await page.getByText('Tarjeta débito o crédito').click();
  // el widget de Wompi tarda un momento en montar el formulario y habilitar
  // el botón tras cada paso — sin esta espera el click llega antes de que
  // termine de re-renderizar y queda pegado en "not stable"/"not enabled".
  await page.waitForTimeout(1000);
  await page.getByPlaceholder('Ingresa tu nombres y apellidos').fill(BUYER.fullName);
  await page.getByPlaceholder('Ingresa tu correo electrónico').fill(BUYER.email);
  await page.getByPlaceholder('Ingresa tu número de celular').fill(BUYER.phone);
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /continuar con tu pago/i }).click();
  await page.waitForTimeout(1000);

  await page.getByPlaceholder('Ingresa el número de la tarjeta').fill(cardNumber);
  await page.locator('select').nth(0).selectOption({ label: '12' }); // mes
  await page.locator('select').nth(1).selectOption({ index: 1 }); // primer año disponible (siempre futuro)
  await page.getByPlaceholder('Ingresa tu código seguridad').fill('123');
  await page.getByPlaceholder('Ingresa nombre y apellido del titular').fill(BUYER.fullName);
  await page.getByPlaceholder('Ingresa tu número de documento').fill('123456789');
  await page.getByText('Acepto haber leído').click();
  await page.getByText('Acepto la').click();
  await page.waitForTimeout(500);

  await page.getByRole('button', { name: /continuar con tu pago/i }).click();
  await page.waitForURL(/checkout\.wompi\.co\/(transaction_checker|summary)/, { timeout: 30_000 });
}

test.describe('Checkout con Wompi (sandbox)', () => {
  test('tarjeta aprobada → vuelve al sitio con el pedido confirmado', async ({ page }) => {
    await addFirstProductAndGoToCheckout(page);
    await fillShippingAndPay(page);
    await payWithCard(page, CARD_APPROVED);

    await expect(page.getByText('¡Pago aprobado!')).toBeVisible({ timeout: 15_000 });

    await Promise.all([
      page.waitForURL(/\/checkout\?id=/, { timeout: 20_000 }),
      page.getByRole('button', { name: /volver al comercio/i }).click(),
    ]);

    await expect(page.getByRole('heading', { name: /pedido confirmado/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(BUYER.email)).toBeVisible();
  });

  test('tarjeta rechazada → vuelve al sitio mostrando el error, sin confirmar el pedido', async ({
    page,
  }) => {
    await addFirstProductAndGoToCheckout(page);
    await fillShippingAndPay(page);
    await payWithCard(page, CARD_DECLINED);

    await Promise.all([
      page.waitForURL(/\/checkout\?id=/, { timeout: 20_000 }),
      page.getByRole('button', { name: /volver al comercio/i }).click(),
    ]);

    await expect(page.getByRole('heading', { name: /el pago no se completó/i })).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText(/DECLINED/i)).toBeVisible();
    // el carrito no se vació — el pedido nunca se confirmó
    await expect(page.getByRole('link', { name: /volver a intentar/i })).toBeVisible();
  });
});

test.describe('/api/wompi-integrity', () => {
  const endpoint = () => new URL('/api/wompi-integrity', test.info().project.use.baseURL).href;

  test('recalcula el total en el servidor e ignora el precio que mande el cliente', async ({
    request,
  }) => {
    const res = await request.post(endpoint(), {
      data: {
        items: [{ productId: 'xtrm-classic-blanco', quantity: 1, price: 1 }],
        amountInCents: 1,
      },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    // XTRM Classic 64.000 + envío 12.000 = 76.000, sin importar lo que mandó el cliente
    expect(body.total).toBe(76_000);
    expect(body.amountInCents).toBe(7_600_000);
    expect(body.signature).toMatch(/^[a-f0-9]{64}$/);
  });

  test('da envío gratis sobre el umbral', async ({ request }) => {
    const res = await request.post(endpoint(), {
      data: { items: [{ productId: 'xtrm-founders-morado', quantity: 2 }] },
    });
    const body = await res.json();
    expect(body.total).toBe(230_000); // 2 × 115.000, sin cargo de envío
  });

  test('rechaza un producto inexistente', async ({ request }) => {
    const res = await request.post(endpoint(), {
      data: { items: [{ productId: 'no-existe', quantity: 1 }] },
    });
    expect(res.status()).toBe(400);
  });

  test('rechaza un carrito vacío', async ({ request }) => {
    const res = await request.post(endpoint(), { data: { items: [] } });
    expect(res.status()).toBe(400);
  });
});
