# XTRM Store — qué falta antes de salir a producción

Checklist para hablar con Diego. Solo queda lo que necesita algo de ustedes — lo que se podía resolver por código ya está hecho (ver abajo).

---

## 🔴 Bloqueante — sin esto no se puede vender de verdad

### 1. Aviso de pedidos — falta un dato de Wompi para activarlo
Ya está el código: cuando Wompi aprueba un pago, un webhook (`api/wompi-webhook.js`) manda un correo a `xtrmcorps@gmail.com` con los datos del pedido (referencia, monto, comprador, dirección de envío). La API key de Resend que pasó Diego ya está configurada.

**Qué falta, y es tarea de Diego (dueño de la cuenta Wompi):**
1. Entrar a comercios.wompi.co → Configuración → Secretos, y copiarme el **"secreto de eventos"** (es distinto a la llave que ya usamos para el checkout).
2. En esa misma sección, registrar la URL del webhook: `https://xtrm-store.vercel.app/api/wompi-webhook`.

En cuanto tenga el secreto lo agrego a Vercel y queda funcionando de punta a punta.

⚠️ Nota aparte: el remitente del correo (`onboarding@resend.dev`) es el dominio de pruebas de Resend — normalmente solo entrega al correo con el que se creó la cuenta de Resend. Si el aviso no llega a `xtrmcorps@gmail.com`, hay que verificar un dominio propio en Resend (ej. `xtrm.com`) para que el envío sea confiable a largo plazo.

### 2. Contenido real de envíos, cambios y guía de tallas
No existe esa información en ningún lado del sitio (los enlaces que apuntaban a esas secciones ya se quitaron del footer porque no llevaban a nada). No puedo inventar plazos de envío, condiciones de devolución ni tallas — son datos de negocio reales.

**Qué necesito de ustedes:** el texto de esas 3 políticas (aunque sea corto), y los agrego al sitio.

---

## 🟡 Importante — no bloquea pero cojea

### 3. Deploy automático
El repositorio de GitHub no está conectado a Vercel. Cada cambio necesita que yo corra un deploy manual — no se publica solo al hacer push.

**Qué necesito de ustedes (Diego, dueño del repo):** aprobar el permiso de la GitHub App de Vercel sobre el repositorio `xtrm-store` (se las pide GitHub al intentar conectar, dos clics).

---

## Ya resuelto ✅

- Precios, nombres y descripciones de las 3 gorras
- Hero, footer, "Nuestra historia", sección Founders
- Logo y favicon reales (sin fondo negro)
- Checkout con Wompi integrado y **probado de punta a punta** en sandbox (pago aprobado y rechazado, ambos casos funcionan)
- Suite de tests automáticos (Playwright) que corre ese mismo flujo de pago real cada vez que se necesite verificar que nada se rompió
- El total de cada compra se calcula y verifica en el servidor — un cliente no puede manipular el precio desde el navegador
- **Llaves de Wompi ya en modo producción** (`pub_prod_`) — los pagos que se hagan ahora son reales, verificado en vivo
- Texto de desarrollador que había quedado visible en la página de producto, eliminado
- Enlaces muertos del footer quitados
- SEO básico: `robots.txt`, `sitemap.xml`, meta tags Open Graph/Twitter con imagen propia (el link se ve bien al compartirlo en WhatsApp/Instagram)
- Correo de contacto del footer actualizado a `xtrmcorps@gmail.com`
- Dominio: por decisión de Diego, se queda en `xtrm-store.vercel.app` por ahora
