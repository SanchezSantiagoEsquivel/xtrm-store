import { createHash } from 'node:crypto';

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
    // Todavía no está configurado del lado del servidor. Respondemos 200 para
    // que Wompi no reintente en bucle, pero no procesamos el evento.
    res.status(200).json({ received: true, processed: false });
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
    await sendOrderEmail(tx, notifyEmail, resendKey).catch(() => {});
  }

  res.status(200).json({ received: true });
}

async function sendOrderEmail(tx, to, apiKey) {
  const shipping = tx.shipping_address;
  const customer = tx.customer_data;
  const lines = [
    `Referencia: ${tx.reference}`,
    `Monto: $${(tx.amount_in_cents / 100).toLocaleString('es-CO')} COP`,
    `Método de pago: ${tx.payment_method_type ?? 'N/A'}`,
    `Correo del cliente: ${tx.customer_email ?? 'N/A'}`,
  ];
  if (customer?.full_name || customer?.phone_number) {
    lines.push(`Nombre: ${customer?.full_name ?? 'N/A'}`, `Teléfono: ${customer?.phone_number ?? 'N/A'}`);
  }
  if (shipping) {
    lines.push(
      `Dirección: ${[shipping.address_line_1, shipping.address_line_2].filter(Boolean).join(' ')}`,
      `Ciudad/región: ${shipping.city ?? ''}, ${shipping.region ?? ''}`
    );
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'XTRM Store <onboarding@resend.dev>',
      to,
      subject: `Nuevo pedido pagado — ${tx.reference}`,
      text: lines.join('\n'),
    }),
  });
}
