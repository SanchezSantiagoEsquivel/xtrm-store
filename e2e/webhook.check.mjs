// Revisión local del webhook de pedidos, con un Resend falso (no manda correos
// ni toca Wompi). Correr con: node e2e/webhook.check.mjs
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

process.env.WOMPI_EVENTS_SECRET = 'eventos_prueba';
process.env.WOMPI_INTEGRITY_SECRET = 'integridad_prueba';
process.env.VITE_WOMPI_PUBLIC_KEY = 'pub_test_prueba';
process.env.RESEND_API_KEY = 're_prueba';

const integrity = (await import('../api/wompi-integrity.js')).default;
const webhook = (await import('../api/wompi-webhook.js')).default;

async function call(handler, body) {
  const out = {};
  const res = {
    status(code) { out.status = code; return this; },
    json(value) { out.body = value; },
  };
  await handler({ method: 'POST', body }, res);
  return out;
}

const order = await call(integrity, {
  items: [
    { productId: 'xtrm-classic-blanco', quantity: 1 },
    { productId: 'xtrm-founders-morado', quantity: 1 },
    { productId: 'xtrm-classic-blanco', quantity: 1 },
  ],
});
assert.equal(order.body.total, 243_000);
assert.match(order.body.reference, /^XTRM-\d+-\d+-CLB2-FDM1$/);
for (const productId of ['no-existe', 'toString', '__proto__']) {
  assert.equal((await call(integrity, { items: [{ productId, quantity: 1 }] })).status, 400);
}

function event(status, reference = order.body.reference) {
  const transaction = {
    id: 'tx-1', status, reference, amount_in_cents: 24_300_000,
    shipping_address: { address_line_1: 'Calle 1', address_line_2: 'Portería', city: 'Cali', region: 'Valle' },
  };
  const checksum = createHash('sha256').update(`tx-1${status}123eventos_prueba`).digest('hex');
  return {
    event: 'transaction.updated', timestamp: 123, data: { transaction },
    signature: { properties: ['transaction.id', 'transaction.status'], checksum },
  };
}

let sent = [];
let reply = () => new Response('{}');
globalThis.fetch = async (url, options) => { sent.push(options); return reply(); };

assert.equal((await call(webhook, event('APPROVED'))).status, 200);
const { text } = JSON.parse(sent[0].body);
assert.match(text, /Productos: 2 × XTRM Classic.*1 × FOUNDERS Edition/);
assert.match(text, /Dirección: Calle 1\n/);
assert.match(text, /Notas de entrega: Portería/);
assert.equal(sent[0].headers['Idempotency-Key'], 'pedido-tx-1');

// Referencia vieja, sin productos
await call(webhook, event('APPROVED', 'XTRM-1-2'));
assert.match(JSON.parse(sent[1].body).text, /Productos: N\/A/);

// Un pago no aprobado o con firma mala no avisa
sent = [];
assert.equal((await call(webhook, event('DECLINED'))).status, 200);
assert.equal((await call(webhook, { ...event('APPROVED'), timestamp: 999 })).status, 401);
assert.equal(sent.length, 0);

// Si Resend falla, no se responde 200 para que Wompi reintente
console.error = () => {};
reply = () => new Response('no', { status: 403 });
assert.equal((await call(webhook, event('APPROVED'))).status, 500);
reply = () => { throw new Error('sin red'); };
assert.equal((await call(webhook, event('APPROVED'))).status, 500);

console.log('OK');
