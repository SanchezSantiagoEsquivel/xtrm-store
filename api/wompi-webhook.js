import { createHash } from 'node:crypto';
import { describeItems, parseItems } from './_catalog.js';

// ponytail: sin base de datos — este webhook solo avisa por correo cuando se
// aprueba un pago, no persiste el pedido. Si el volumen crece, guardar en una
// tabla real en vez de depender solo del correo.

function getByPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const eventsSecret = process.env.WOMPI_EVENTS_SECRET;
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.ORDER_NOTIFICATION_EMAIL || 'xtrmcorps@gmail.com';

  if (!eventsSecret || !resendKey) {
    // Sin llaves no se puede avisar: con un error queda registrado y Wompi
    // reintenta, en vez de perder el pedido en silencio.
    console.error('Faltan WOMPI_EVENTS_SECRET o RESEND_API_KEY');
    res.status(500).json({ error: 'El webhook no está configurado en el servidor' });
    return;
  }

  const body = req.body || {};
  const { signature, timestamp, data, event } = body;
  if (!signature?.checksum || !Array.isArray(signature?.properties) || !timestamp) {
    res.status(400).json({ error: 'Payload inválido' });
    return;
  }

  // Verificación de firma: Wompi manda las rutas de las propiedades relativas
  // a "data" (ej. "transaction.id" = data.transaction.id).
  const concat =
    signature.properties.map((path) => getByPath(data, path) ?? '').join('') +
    timestamp +
    eventsSecret;
  const expected = createHash('sha256').update(concat).digest('hex');
  if (expected.toLowerCase() !== String(signature.checksum).toLowerCase()) {
    res.status(401).json({ error: 'Firma inválida' });
    return;
  }

  const tx = data?.transaction;
  if (event === 'transaction.updated' && tx?.status === 'APPROVED') {
    try {
      await sendOrderEmail(tx, notifyEmail, resendKey);
      // Sin dominio verificado Resend no le entrega al comprador.
      if (process.env.ORDER_FROM_EMAIL && tx.customer_email) {
        await sendBuyerEmail(tx, notifyEmail, resendKey);
      }
    } catch (err) {
      // Con un status distinto de 200 Wompi reintenta (a los 30 min, 3 h y 24 h).
      console.error(`No se pudieron enviar los correos del pedido ${tx.reference}`, err);
      res.status(500).json({ error: 'No se pudo enviar el aviso del pedido' });
      return;
    }
  }

  res.status(200).json({ received: true });
}

async function sendOrderEmail(tx, to, apiKey) {
  const shipping = tx.shipping_address;
  const customer = tx.customer_data;
  const lines = [
    `Referencia: ${tx.reference}`,
    `Productos: ${describeItems(tx.reference).join(', ') || 'N/A'}`,
    `Monto: $${(tx.amount_in_cents / 100).toLocaleString('es-CO')} COP`,
    `Método de pago: ${tx.payment_method_type ?? 'N/A'}`,
    `Correo del cliente: ${tx.customer_email ?? 'N/A'}`,
  ];
  if (customer?.full_name || customer?.phone_number) {
    lines.push(`Nombre: ${customer?.full_name ?? 'N/A'}`, `Teléfono: ${customer?.phone_number ?? 'N/A'}`);
  }
  if (shipping) {
    lines.push(
      `Dirección: ${shipping.address_line_1 ?? 'N/A'}`,
      `Ciudad/región: ${shipping.city ?? ''}, ${shipping.region ?? ''}`,
      // Checkout.jsx manda las notas de entrega en address-line-2
      `Notas de entrega: ${shipping.address_line_2 || 'Ninguna'}`
    );
  }

  await sendEmail(apiKey, `pedido-${tx.id}`, {
    to,
    subject: `Nuevo pedido pagado — ${tx.reference}`,
    text: lines.join('\n'),
  });
}

// Acuse de recibo que exige el artículo 50 d) de la Ley 1480: tiempo de entrega,
// precio, envío y forma de pago. El plazo debe coincidir con /politicas.
async function sendBuyerEmail(tx, storeEmail, apiKey) {
  const cop = (value) => `$${value.toLocaleString('es-CO')} COP`;
  const total = tx.amount_in_cents / 100;
  const items = parseItems(tx.reference);
  const lines = ['Gracias por tu compra en XTRM. Recibimos tu pago y tu pedido.', '', `Pedido: ${tx.reference}`];
  if (items.length && items.every((i) => i.product)) {
    const subtotal = items.reduce((sum, { qty, product }) => sum + qty * product.price, 0);
    // El total cobrado manda: el envío es lo que no son productos.
    lines.push(
      ...items.map(({ qty, product }) => `${qty} × ${product.name}: ${cop(qty * product.price)}`),
      `Envío: ${total > subtotal ? cop(total - subtotal) : 'Gratis'}`
    );
  }
  lines.push(`Total pagado: ${cop(total)}`, `Forma de pago: ${tx.payment_method_type ?? 'Wompi'}`);
  const shipping = tx.shipping_address;
  if (shipping?.address_line_1) {
    lines.push(`Entrega en: ${[shipping.address_line_1, shipping.city, shipping.region].filter(Boolean).join(', ')}`);
  }
  lines.push(
    '',
    'Tiempo de entrega: alrededor de 8 días hábiles, según la región, y en ningún caso más de 30 días calendario. Te enviaremos el número de guía.',
    'Cambios, retracto, garantía y datos personales: https://www.xtrmoficial.com/politicas',
    `¿Dudas? Responde este correo o escríbenos a ${storeEmail}.`
  );

  await sendEmail(apiKey, `comprador-${tx.id}`, {
    to: tx.customer_email,
    reply_to: storeEmail,
    subject: `Recibimos tu pedido ${tx.reference}`,
    text: lines.join('\n'),
  });
}

async function sendEmail(apiKey, idempotencyKey, message) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      // Un reintento de Wompi no duplica el correo
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({
      from: process.env.ORDER_FROM_EMAIL || 'XTRM Store <onboarding@resend.dev>',
      ...message,
    }),
  });
  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`);
}
