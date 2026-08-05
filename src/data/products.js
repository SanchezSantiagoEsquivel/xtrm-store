import blancoFrente from '../assets/blanco-frente.png';
import blancoLateral from '../assets/blanco-lateral.png';
import blancoLateral2 from '../assets/blanco-lateral-2.png';
import blancoDiagonal from '../assets/blanco-diagonal.png';
import fuegoFrente from '../assets/fuego-frente.png';
import fuegoLateral from '../assets/fuego-lateral.png';
import fuegoLateral2 from '../assets/fuego-lateral-2.png';
import fuegoDiagonal from '../assets/fuego-diagonal.png';
import moradaFrente from '../assets/morada-frente.png';
import moradaLateral from '../assets/morada-lateral.png';
import moradaLateral2 from '../assets/morada-lateral-2.png';
import moradaDiagonal from '../assets/morada-diagonal.png';
import moradaDiagonal2 from '../assets/morada-diagonal-2.png';
import gorraDetras from '../assets/gorra-detras.png';

export const COLLECTIONS = {
  CLASSIC: 'Classic',
  BLACKOUT: 'Blackout',
  FOUNDERS: 'Founders',
};

export const PRODUCTS = [
  {
    id: 'xtrm-classic-blanco',
    slug: 'classic-blanco',
    name: 'XTRM Classic',
    collection: COLLECTIONS.CLASSIC,
    price: 64000,
    compareAtPrice: 80000,
    colors: [
      {
        id: 'blanco',
        name: 'Negro / Blanco',
        swatch: '#0A0A0A',
        swatchSecondary: '#FFFFFF',
        stock: 14,
        images: [blancoFrente, blancoLateral, blancoDiagonal, blancoLateral2, gorraDetras],
      },
    ],
    description: 'La clásica que queda bien con todo.',
    details: [
      'Bordado 3D de alta densidad, hilo blanco mate',
      'Estructura semi-rígida, 6 paneles',
      'Visera curva con ribete reflectante blanco',
      'Cierre ajustable con hebilla trasera',
      'Talla única, ajustable a la mayoría de cabezas',
    ],
    care: 'Limpiar con paño húmedo. No lavar en lavadora. No exponer al sol directo por tiempo prolongado para preservar el color del bordado.',
    featured: true,
  },
  {
    id: 'xtrm-blackout-fuego',
    slug: 'blackout-fuego',
    name: 'Blackout Fuego',
    collection: COLLECTIONS.BLACKOUT,
    price: 85000,
    compareAtPrice: null,
    colors: [
      {
        id: 'negro-total',
        name: 'Full Black',
        swatch: '#0A0A0A',
        swatchSecondary: '#0A0A0A',
        stock: 9,
        images: [fuegoFrente, fuegoDiagonal, fuegoLateral, fuegoLateral2, gorraDetras],
      },
    ],
    description: 'Llamas que transmiten fuerza y personalidad - Fire Will',
    details: [
      'Bordado tonal 3D negro sobre negro',
      'Visera con llamas en relieve bordado texturizado',
      'Estructura semi-rígida, 6 paneles',
      'Cierre ajustable con hebilla trasera',
      'Talla única, ajustable a la mayoría de cabezas',
    ],
    care: 'Limpiar con paño húmedo. No lavar en lavadora. El relieve de las llamas requiere cepillado suave ocasional para mantener su definición.',
    featured: true,
  },
  {
    id: 'xtrm-founders-morado',
    slug: 'founders-morado',
    name: 'FOUNDERS Edition',
    collection: COLLECTIONS.FOUNDERS,
    price: 115000,
    compareAtPrice: null,
    limitedEdition: true,
    colors: [
      {
        id: 'morado',
        name: 'Black / Purple',
        swatch: '#0A0A0A',
        swatchSecondary: '#8B2FE3',
        stock: 5,
        images: [moradaFrente, moradaDiagonal, moradaLateral, moradaDiagonal2, moradaLateral2, gorraDetras],
      },
    ],
    description:
      'Edición Founders. La estrella morada en el lateral marca a quienes estuvieron desde el inicio. Bordado XTRM tonal en negro con contorno morado, visera con ribete morado.',
    details: [
      'Edición limitada — pieza numerada de la colección Founders',
      'Bordado tonal negro con contorno morado bordado',
      'Estrella "XTRM Original Founders" bordada en lateral izquierdo',
      'Visera con ribete interior morado',
      'Talla única, ajustable a la mayoría de cabezas',
    ],
    care: 'Limpiar con paño húmedo. No lavar en lavadora. Guardar en lugar seco para preservar el contraste del bordado morado.',
    featured: true,
  },
];

export function getProductBySlug(slug) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatPrice(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value);
}
