// ponytail: precios duplicados de src/data/products.js porque ese archivo importa
// assets de imagen (no cargan en el runtime de Node de la function). Si cambian
// los precios ahí, hay que actualizarlos aquí también. Subir a un JSON compartido
// si el catálogo crece más allá de estos 3.
// `code` va dentro de la referencia de pago: solo letras, único, y no cambiarlo.
export const CATALOG = {
  'xtrm-classic-blanco': { code: 'CLB', name: 'XTRM Classic (Negro / Blanco)', price: 20000 }, // temporal, volver a 64000
  'xtrm-blackout-fuego': { code: 'BLF', name: 'Blackout Fuego', price: 85000 },
  'xtrm-founders-morado': { code: 'FDM', name: 'FOUNDERS Edition (Black / Purple)', price: 115000 },
};

// ponytail: sin base de datos, el pedido viaja en la referencia de Wompi
// (ej. XTRM-1764000000000-1234-CLB2-FDM1), que va firmada por el servidor.
// Si los productos llegan a tener varios colores, guardar pedidos en una tabla.
export function buildReference(items) {
  const quantities = {};
  for (const { productId, quantity } of items) {
    quantities[productId] = (quantities[productId] ?? 0) + Number(quantity);
  }
  const codes = Object.entries(quantities).map(([id, qty]) => `${CATALOG[id].code}${qty}`);
  return ['XTRM', Date.now(), Math.floor(Math.random() * 10000), ...codes].join('-');
}

// Las referencias viejas (sin códigos) devuelven una lista vacía. `product` queda
// sin definir si el código no existe.
export function parseItems(reference) {
  return String(reference).split('-').slice(3).map((part) => {
    const [, code, qty] = part.match(/^([A-Z]+)(\d+)$/) ?? [];
    return { part, qty: Number(qty), product: Object.values(CATALOG).find((p) => p.code === code) };
  });
}

export function describeItems(reference) {
  return parseItems(reference).map(({ part, qty, product }) => (product ? `${qty} × ${product.name}` : part));
}
