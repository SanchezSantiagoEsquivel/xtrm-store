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

- [x] **Pago de prueba real hecho de punta a punta** (8 ago) contra producción, sandbox de Wompi: agregar al carrito → checkout → Wompi → tarjeta de prueba `4242...` → "¡Pago aprobado!" → vuelve a `xtrm-store.vercel.app/checkout?id=...` → "PEDIDO CONFIRMADO". Probé también la tarjeta de rechazo `4111...` → Wompi la rechaza → nuestro sitio muestra el estado de error correctamente, sin confirmar el pedido.
- [x] **Suite de tests E2E con Playwright** (`playwright.config.js`, `e2e/checkout.spec.js`, `npm run test:e2e`) — corre el flujo completo de verdad contra Wompi sandbox (tarjeta aprobada y rechazada) más los casos del endpoint `/api/wompi-integrity` (recalcula el total, ignora precio manipulado por el cliente, rechaza producto inválido/carrito vacío). No son mocks: si Wompi cambia su checkout o la firma se rompe, estos tests fallan.
  - **Importante:** corren contra un deploy real (`E2E_BASE_URL`, por defecto producción), no contra `localhost`. Wompi bloquea con un 403 de CloudFront cualquier `redirect-url` que no sea https pública.
  - Nota de infraestructura encontrada en el camino: `vercel dev` no sirve para desarrollo local de este proyecto — la regla de rewrite SPA de `vercel.json` (necesaria en producción) hace que también reescriba las peticiones internas de Vite (`/@vite/client`, `/src/main.jsx`) hacia `index.html`, rompiendo el HMR. Para probar `api/` en local se agregó `e2e/api-shim.mjs` + proxy en `vite.config.js`, así que `npm run dev` + ese shim sí funcionan (solo la API, el pago real solo se puede probar contra un deploy).
  - Las llaves de sandbox de Wompi ya quedaron guardadas en Vercel (Development y Production) para que esto funcione sin configuración extra.

- [x] Integrado el Web Checkout de Wompi: `api/wompi-integrity.js` (function serverless de Vercel) calcula el total en el servidor y firma la transacción; `Checkout.jsx` redirige a Wompi y verifica el resultado al volver (`?id=`) contra la API pública de Wompi.
- [ ] **Falta que pongas las llaves reales.** Crea una cuenta en [comercios.wompi.co](https://comercios.wompi.co), copia del dashboard (modo Sandbox para probar):
  - `VITE_WOMPI_PUBLIC_KEY` (empieza con `pub_test_`)
  - `WOMPI_INTEGRITY_SECRET` (empieza con `test_integrity_`)
  
  Ponlas con `vercel env add VITE_WOMPI_PUBLIC_KEY` y `vercel env add WOMPI_INTEGRITY_SECRET` (o desde el dashboard de Vercel → Settings → Environment Variables) y vuelve a desplegar. Sin esas variables el botón de pago muestra un error en vez de fallar en silencio.
  - Cuando quieras cobrar de verdad, repite el proceso con las llaves `pub_prod_` / `prod_integrity_` de producción.
- [ ] Wompi también manda **webhooks** para confirmar pagos async (PSE puede tardar). Este checkout solo verifica por el `id` que Wompi devuelve al redirigir — no hay backend/base de datos para registrar pedidos todavía, así que un pago que quede en `PENDING` no se actualiza solo. Si vas a vender en serio, hace falta un endpoint de webhook + donde guardar los pedidos (hoy no hay base de datos, todo vive en el navegador).

## Pendiente

- [ ] **3. Borde blanco** — sigue sin resolver: la nueva foto de "Gorra Detras" también trae el fondo de estudio claro horneado, así que el problema persiste igual que con las fotos anteriores. Se resuelve con fotos a las que se les quite el fondo (no es un cambio de código) o dejándolo así.

## Feedback de Diego (6 ago, `docs/new_changes.md`)

- [x] **Borrar sección "Nacida en la calle, hecha para durar"** (`Home.jsx:48`, `brand-strip`) — Diego: "Sale ese logo todo deformado y pues lo que dice ahí ese texto nada que ver, eliminarlo" (`image.png`). Es la sección con el logo grande + esa frase, justo debajo de "Destacadas" en el Home. Borrar el `<section>` completo (logo, texto y botón "Conocer la marca") y limpiar el CSS (`.brand-strip*` en `Home.css`) e imports que queden sin usar.
  - *Por qué se ve deformado:* no lo tengo claro todavía — el CSS actual (`height: 28px; width: auto`) no debería estirarlo así. Como la acción es borrar la sección entera, no hace falta diagnosticarlo, pero si en algún punto se vuelve a usar ese logo hay que revisar por qué se deforma antes.
- [x] **Borrar el Manifiesto** (`Brand.jsx:11`, `brand__hero`, "UNA X PINTADA QUE NUNCA SE SECÓ") — Diego: "Ese manifiesto eliminarlo también" (`image-1.png`). Borrar esa sección de `/marca` y su CSS (`.brand__hero*` en `Brand.css`).
- [x] **Borrar el subtítulo del hero** (`Home.jsx:25`, "Gorras de diseño propio. Bordado de alta densidad...") — Diego: "Y eliminar ese texto" (`image-3.png`, circulado en verde). Queda el título + los botones, sin el párrafo.
- [x] **Favicon: a Diego no le aparece en la pestaña del computador** — el archivo sí está bien servido en producción (`/favicon.png` responde 200, PNG correcto), así que era cache del navegador. Cambié `index.html` para pedirlo como `/favicon.png?v=2`, eso fuerza a que cualquier navegador lo vuelva a descargar en vez de usar el que tenía guardado. Aun así dile a Diego que si sigue sin verlo pruebe con recarga forzada (`Cmd+Shift+R`) o una pestaña de incógnito.

### Necesita definición — feedback contradictorio o incompleto

- [ ] **Logo en "Nuestra historia"** (`Brand.jsx`, sección que reemplacé por pedido del PDF) — Diego: "En la historia me tramaba que estuviera el logo que tengo de perfil" (`image-2.png`). Ahí ya puse `logo-blanco.png` (el logo grafiti grande), pero por cómo lo dice ("el que tengo de perfil") suena a que quiere el logo *compacto* que usa de foto de perfil — que podría ser este mismo archivo achicado, o un archivo distinto que no tengo. **Necesito que Diego mande el archivo exacto o confirme si es el mismo logo, solo que más pequeño.**
- [x] **Sección del Home con la foto del gorro repetida** (`image-4.png`, mismo `brand-strip` del primer punto) — resuelto de por sí: se borró la sección completa junto con el primer punto, así que la foto repetida ya no está. Si en algún momento prefieren esa sección de vuelta pero solo cambiando la foto (una de las 3 opciones que dio Diego), avisen.

## Asset recibido sin usar todavía

- `docs/pagina XTRM/XTRM Bordado contorno blanco.png` — logo XTRM en negro con contorno blanco, transparente. No hay ningún lugar en el sitio (todo es fondo oscuro) donde esta variante encaje mejor que `logo-blanco.png`; se queda guardado por si se necesita para algo sobre fondo claro (ej. merch, print).
