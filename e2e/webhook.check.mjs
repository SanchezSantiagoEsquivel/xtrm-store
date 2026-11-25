// Revisión local del webhook de pedidos, con un Resend falso (no manda correos
// ni toca Wompi). Correr con: node e2e/webhook.check.mjs
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

process.env.WOMPI_EVENTS_SECRET = 'eventos_prueba';
process.env.WOMPI_INTEGRITY_SECRET = 'integridad_prueba';
process.env.VITE_WOMPI_PUBLIC_KEY = 'pub_test_prueba';
process.env.RESEND_API_KEY = 're_prueba';

const integrity = (await import('../api/wompi-integrity.js')).default;
const webhook = (await import('../api/wompi-webhook.js')).default;

// Los precios que ve el cliente y los que cobra el servidor deben coincidir.
// Se lee como texto porque products.js importa imágenes.
const { CATALOG } = await import('../api/_catalog.js');
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const shown = [...read('../src/data/products.js').matchAll(/^ {4}id: '([^']+)',[\s\S]*?^ {4}price: (\d+),/gm)]
  .map(([, id, price]) => [id, Number(price)]);
assert.deepEqual(shown, Object.entries(CATALOG).map(([id, p]) => [id, p.price]));
for (const name of ['SHIPPING_FLAT_RATE', 'FREE_SHIPPING_THRESHOLD']) {
  const value = (path) => read(path).match(new RegExp(`const ${name} = (\\d+);`))[1];
  assert.equal(value('../src/pages/Checkout.jsx'), value('../api/wompi-integrity.js'), name);
}

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
assert.equal(order.body.total, 167_000); // temporal con Classic a 20.000; con 64.000 era 243_000
assert.match(order.body.reference, /^XTRM-\d+-\d+-CLB2-FDM1$/);
for (const productId of ['no-existe', 'toString', '__proto__']) {
  assert.equal((await call(integrity, { items: [{ productId, quantity: 1 }] })).status, 400);
}

function event(status, reference = order.body.reference) {
  const transaction = {
    id: 'tx-1', status, reference, amount_in_cents: order.body.amountInCents,
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
assert.match(JSON.parse(sent[0].body).from, /onboarding@resend\.dev/);
process.env.ORDER_FROM_EMAIL = 'XTRM <pedidos@prueba.test>';

// Referencia vieja, sin productos
await call(webhook, event('APPROVED', 'XTRM-1-2'));
assert.match(JSON.parse(sent[1].body).text, /Productos: N\/A/);
assert.equal(JSON.parse(sent[1].body).from, 'XTRM <pedidos@prueba.test>');

// Con dominio propio también se le confirma al comprador
const buyer = event('APPROVED');
buyer.data.transaction.customer_email = 'ana@prueba.test';
sent = [];
assert.equal((await call(webhook, buyer)).status, 200);
assert.equal(sent.length, 2);
const receipt = JSON.parse(sent[1].body);
assert.equal(receipt.to, 'ana@prueba.test');
assert.equal(receipt.reply_to, 'xtrmcorps@gmail.com');
assert.equal(sent[1].headers['Idempotency-Key'], 'comprador-tx-1');
assert.match(receipt.text, /2 × XTRM Classic.*: \$40\.000 COP\n1 × FOUNDERS.*: \$115\.000 COP\nEnvío: \$12\.000 COP\nTotal pagado: \$167\.000 COP/); // temporal con Classic a 20.000
buyer.data.transaction.reference = 'XTRM-1-2-CLB1';
buyer.data.transaction.amount_in_cents = 3_200_000;
await call(webhook, buyer);
assert.match(JSON.parse(sent[3].body).text, /Envío: \$12\.000 COP\nTotal pagado: \$32\.000 COP/);

// Sin dominio propio no se le escribe, porque Resend lo rechazaría
const from = process.env.ORDER_FROM_EMAIL;
delete process.env.ORDER_FROM_EMAIL;
sent = [];
await call(webhook, buyer);
assert.equal(sent.length, 1);
process.env.ORDER_FROM_EMAIL = from;

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

// Sin llaves tampoco se responde 200
delete process.env.RESEND_API_KEY;
assert.equal((await call(webhook, event('APPROVED'))).status, 500);

console.log('OK');
