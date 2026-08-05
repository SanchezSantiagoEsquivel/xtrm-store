import { createHash } from 'node:crypto';

// ponytail: precios duplicados de src/data/products.js porque ese archivo importa
// assets de imagen (no cargan en el runtime de Node de la function). Si cambian
// los precios ahí, hay que actualizarlos aquí también. Subir a un JSON compartido
// si el catálogo crece más allá de estos 3.
const PRICES = {
  'xtrm-classic-blanco': 64000,
  'xtrm-blackout-fuego': 85000,
  'xtrm-founders-morado': 115000,
};

const SHIPPING_FLAT_RATE = 12000;
const FREE_SHIPPING_THRESHOLD = 200000;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const secret = process.env.WOMPI_INTEGRITY_SECRET;
  const publicKey = process.env.VITE_WOMPI_PUBLIC_KEY;
  if (!secret || !publicKey) {
    res.status(500).json({ error: 'Wompi no está configurado en el servidor' });
    return;
  }

  const { items } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: 'Carrito vacío' });
    return;
  }

  // El total se recalcula acá con los precios del servidor — nunca se confía
  // en un monto que venga del cliente, para que no se pueda pagar menos.
  let subtotal = 0;
  for (const item of items) {
    const price = PRICES[item.productId];
    const quantity = Number(item.quantity);
    if (!price || !Number.isInteger(quantity) || quantity <= 0 || quantity > 20) {
      res.status(400).json({ error: `Producto inválido: ${item.productId}` });
      return;
    }
    subtotal += price * quantity;
  }
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const total = subtotal + shipping;
  const amountInCents = total * 100;
  const currency = 'COP';
  const reference = `XTRM-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  const signature = createHash('sha256')
    .update(`${reference}${amountInCents}${currency}${secret}`)
    .digest('hex');

  res.status(200).json({ reference, amountInCents, currency, signature, publicKey, total });
}
