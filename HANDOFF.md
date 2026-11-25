# Handoff — XTRM Store

Actualizado: 25 nov 2026. El repo es **público**: no poner aquí llaves, tokens ni correos personales.
Mantenerlo al día cuando cambie algo de lo que dice.

## Qué es
Tienda de gorras XTRM (Colombia, precios en COP). Cliente: Diego. Desarrollo: Santiago.

- **Sitio:** https://xtrm-store.vercel.app (en producción, sin dominio propio todavía)
- **Repo:** https://github.com/SanchezSantiagoEsquivel/xtrm-store, rama `main`
- **Contacto y avisos de pedidos:** xtrmcorps@gmail.com

## Stack
React 19 + Vite 8 + react-router 7 (SPA, sin TypeScript), CSS por componente, functions de Vercel en `api/`. Sin base de datos.

- `src/App.jsx`: rutas `/`, `/tienda`, `/producto/:slug`, `/marca`, `/checkout`
- `src/data/products.js`: catálogo (3 gorras)
- `src/context/CartContext.jsx`: carrito
- `src/pages/Checkout.jsx`: formulario, redirección a Wompi y verificación al volver
- `api/wompi-integrity.js`: recalcula el total en el servidor y firma la transacción
- `api/_catalog.js`: precios del servidor y códigos de producto de la referencia
- `api/wompi-webhook.js`: valida la firma de Wompi y avisa por correo (Resend) si el pago es `APPROVED`
- `vercel.json`: rewrite SPA

## Comandos
`npm run dev` · `npm run build` · `npm run lint` · `npm run test:e2e` · `node e2e/webhook.check.mjs` (revisión local de `api/`, sin red)

Deploy **manual**, GitHub no está conectado a Vercel: `vercel --prod` (con la cuenta correcta, ver abajo). Un `git push` no publica.

Variables (ver `.env.example`): `VITE_WOMPI_PUBLIC_KEY`, `WOMPI_INTEGRITY_SECRET`, `WOMPI_EVENTS_SECRET`, `RESEND_API_KEY`, `ORDER_NOTIFICATION_EMAIL`.

## Cuidado con
- **Precios duplicados:** `src/data/products.js` y `api/_catalog.js`. Cambiar ambos. El envío (12.000, gratis desde 200.000) también se repite en `Checkout.jsx`.
- **Wompi en producción** (`pub_prod_`, según `docs/PRE-LANZAMIENTO.md`): los pagos son reales. `test:e2e` apunta a producción por defecto y usa tarjetas de sandbox; usar `E2E_BASE_URL` con un preview con llaves de prueba.
- **No usar `vercel dev`:** el rewrite SPA rompe Vite. Para probar `api/` en local: `e2e/api-shim.mjs` + proxy de `vite.config.js`.
- **Wompi rechaza `redirect-url` de localhost** (403).
- `docs/TODO.md` tiene partes viejas (pide llaves y webhook que ya existen). `README.md` es la plantilla de Vite.

## En curso: dominio propio
Santiago ya compró un dominio. **Falta saber cuál y en qué registrador.** Esto reemplaza la decisión anterior de quedarse en `vercel.app` (`docs/PRE-LANZAMIENTO.md`).

- [ ] Entrar a la cuenta dueña del proyecto en Vercel. El 25 nov el CLI quedó en una cuenta sin acceso (403). Proyecto vinculado en `.vercel/project.json`.
- [ ] Vercel → Settings → Domains: agregar el dominio y `www`
- [ ] DNS en el registrador con los valores que muestre Vercel; no tocar MX ni TXT
- [ ] Cambiar URLs fijas: `index.html`, `public/robots.txt`, `public/sitemap.xml`, `playwright.config.js`
- [ ] Verificar el dominio en Resend y cambiar el `from` en `api/wompi-webhook.js` (hoy `onboarding@resend.dev`)
- [ ] Actualizar la URL de eventos en Wompi si se deja de usar `vercel.app` o se redirige
- [ ] Build, deploy y probar

`Checkout.jsx` usa `window.location.origin`, no necesita cambios.

## Pendientes
- Textos de envíos, cambios y guía de tallas (los da Diego; bloqueante)
- Deploy automático: autorizar la GitHub App de Vercel en el repo
- Fotos de producto con fondo limpio (el borde blanco viene en la foto)
- `xtrm-store.html` (2,3 MB) está sin versionar en la raíz: decidir si se borra

### Corregido el 25 nov, **sin deploy todavía**
- El correo de pedido incluye productos (van codificados en la referencia de Wompi) y notas de entrega (`address-line-2`).
- Si Resend falla, el webhook registra el error y responde 500 para que Wompi reintente.
- Pago `PENDING` o no verificable: pantalla propia con "no vuelvas a pagar" y botón para consultar de nuevo.
- La pantalla final ya no promete un correo de confirmación que no se envía.

Falta verificar tras el deploy, con Wompi real: que acepte la referencia nueva y que el evento traiga `address_line_2` (su documentación no lo confirma).

### Sin corregir
- Si faltan `WOMPI_EVENTS_SECRET` o `RESEND_API_KEY` en Vercel, el webhook responde 200 y el aviso se pierde.
- Lint: 1 error previo en `CartContext.jsx` (fast refresh).
- Al volver de Wompi en otra pestaña, el mensaje final sale sin nombre ("Gracias, .").
