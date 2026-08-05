# TODO — cambios XTRM store

Fuente: `docs/TEXTOS XTRM.pdf` y `docs/Cambios pagina.pdf`

## Hecho

- [x] **3. Borde blanco en fotos de producto** — investigado: no viene del CSS (no hay bordes blancos en `ProductGallery.css`/`ProductCard.css`, solo grises oscuros). Está "horneado" en las fotos (fondo de estudio claro). Requiere fotos con fondo limpio, no un cambio de código — pendiente de fotos nuevas si se quiere resolver.
- [x] **4. XTRM Classic** (`src/data/products.js`) — precio 64.000 (tachado 80.000), descripción "La clásica que queda bien con todo."
- [x] **5. Blackout Fuego** (`src/data/products.js`) — nombre "Blackout Fuego", precio fijo 85.000 (sin descuento), descripción "Llamas que transmiten fuerza y personalidad - Fire Will"
- [x] **6. Founders Edition** (`src/data/products.js`) — nombre "FOUNDERS Edition", precio 115.000, descripción sin cambios. Falta reemplazar la foto trasera por la nueva cuando llegue (ver pendientes).
- [x] **7. Footer** (`src/components/Footer.jsx`) — texto reemplazado por la cita "Si llevas XTRM llevas una decisión..."
- [x] **2. Hero** (`src/pages/Home.jsx`, `Home.css`) — degradado suavizado para que la foto se vea, título cambiado al slogan "PARA QUIEN LO INTENTA, NADA ES IMPOSIBLE", badge "Fire Will". Sigue usando `morada-frente.png` como imagen (ver pendientes: falta la foto "portada" real).

- [x] **1. Logo roto** — encontrado un bug real (no era el que se sospechaba): `src/assets/logo-negro.png` está prácticamente todo negro (corrupto/mal exportado, solo 0.4% de píxeles blancos), así que el mark de la sección `brand-strip` del Home era invisible sobre el fondo oscuro. Cambiado a `logo-blanco.png` (que sí funciona) y quitado el `filter: invert(1)` que ya no aplica. Header y Footer ya usaban `logo-blanco.png` correctamente, sin cambios ahí.
- [x] **8. "Nuestra historia"** — decisión tomada: reemplacé la primera sección de historia en `/marca` (antes "01 — Origen / De la calle al bordado", justo después del manifiesto) por "Nuestra historia" con el texto exacto del cliente. Las secciones "Proceso" y "Founders" de esa página quedaron intactas por no estar mencionadas.
- [x] **9. Logo en vez de gorra** — en esa misma sección reemplazado la foto de gorra (`fuego-frente.png`) por el logo grafiti (`logo-blanco.png`, que ya existía en `src/assets` y es exactamente el logo que pedía el PDF). Revisé el catálogo completo (código + el `xtrm-store.html` suelto en la raíz) y no encontré "otras gorras" además de las 3 productos actuales en ningún lado — si te referías a otra pantalla, dime cuál.

- [x] **2. Hero** — foto de portada recibida (`docs/WhatsApp Image 2026-08-04...`), movida a `src/assets/hero-portada.jpg` y puesta en `Home.jsx` en lugar de `morada-frente.png`.

- [x] **6. Foto trasera** — `docs/pagina XTRM/Gorra Detras.png` recibida, reemplaza `src/assets/gorra-detras.png` (el mismo asset que ya se reutilizaba en las 3 líneas de producto). Convertida a JPEG-en-.png igual que el resto de fotos del repo (523KB → 99KB, sin pérdida visible).
- [x] **1. Logo/favicon** — recibidos los archivos reales con transparencia (los anteriores en `src/assets` eran JPEGs con fondo negro horneado, por eso el "cuadro negro"). `Logo Blanco XTRM.png` → `src/assets/logo-blanco.png` (usado en Header, Footer, Home y `/marca`). `FAVICON.png` → `public/favicon.png`, centrado en un lienzo cuadrado 512×512 con margen (el original era 290×536, no cuadrado).
- [x] **2. Hero** — `PORTADA.JPEG` (export oficial de Lightroom, más nítido que la captura de WhatsApp) reemplaza `src/assets/hero-portada.jpg`. Recomprimida de 913KB a 385KB (calidad de exportación era casi sin pérdida, innecesaria para web) sin pérdida visible.

## Pasarela de pagos (Wompi)

- [x] Integrado el Web Checkout de Wompi: `api/wompi-integrity.js` (function serverless de Vercel) calcula el total en el servidor y firma la transacción; `Checkout.jsx` redirige a Wompi y verifica el resultado al volver (`?id=`) contra la API pública de Wompi.
- [ ] **Falta que pongas las llaves reales.** Crea una cuenta en [comercios.wompi.co](https://comercios.wompi.co), copia del dashboard (modo Sandbox para probar):
  - `VITE_WOMPI_PUBLIC_KEY` (empieza con `pub_test_`)
  - `WOMPI_INTEGRITY_SECRET` (empieza con `test_integrity_`)
  
  Ponlas con `vercel env add VITE_WOMPI_PUBLIC_KEY` y `vercel env add WOMPI_INTEGRITY_SECRET` (o desde el dashboard de Vercel → Settings → Environment Variables) y vuelve a desplegar. Sin esas variables el botón de pago muestra un error en vez de fallar en silencio.
  - Cuando quieras cobrar de verdad, repite el proceso con las llaves `pub_prod_` / `prod_integrity_` de producción.
- [ ] Wompi también manda **webhooks** para confirmar pagos async (PSE puede tardar). Este checkout solo verifica por el `id` que Wompi devuelve al redirigir — no hay backend/base de datos para registrar pedidos todavía, así que un pago que quede en `PENDING` no se actualiza solo. Si vas a vender en serio, hace falta un endpoint de webhook + donde guardar los pedidos (hoy no hay base de datos, todo vive en el navegador).

## Pendiente

- [ ] **3. Borde blanco** — sigue sin resolver: la nueva foto de "Gorra Detras" también trae el fondo de estudio claro horneado, así que el problema persiste igual que con las fotos anteriores. Se resuelve con fotos a las que se les quite el fondo (no es un cambio de código) o dejándolo así.

## Asset recibido sin usar todavía

- `docs/pagina XTRM/XTRM Bordado contorno blanco.png` — logo XTRM en negro con contorno blanco, transparente. No hay ningún lugar en el sitio (todo es fondo oscuro) donde esta variante encaje mejor que `logo-blanco.png`; se queda guardado por si se necesita para algo sobre fondo claro (ej. merch, print).
