# XTRM Store — qué falta antes de salir a producción

Checklist para hablar con Diego. Solo queda lo que necesita algo de ustedes — lo que se podía resolver por código ya está hecho (ver abajo).

---

## 🔴 Bloqueante — sin esto no se puede vender de verdad

### 1. Nadie se entera cuando entra un pedido
El checkout le dice al cliente *"te enviamos la confirmación a tu correo"*, pero ese correo no existe — nuestro código nunca lo manda (lo único que sale es el recibo genérico de Wompi, sin dirección de envío ni qué gorra compró). Tampoco hay base de datos: el pedido vive solo en el navegador del cliente. Si cierra la pestaña, ustedes nunca saben que alguien pagó.

**Qué necesito de ustedes:** decidir cómo quieren enterarse (email o WhatsApp/Slack). Si es email, necesito una cuenta de un servicio de envío (ej. Resend, gratis para empezar) y su API key. En cuanto me digan, armo el webhook de Wompi que avisa con los datos del pedido apenas se aprueba el pago.

### 2. Contenido real de envíos, cambios y guía de tallas
No existe esa información en ningún lado del sitio (los enlaces que apuntaban a esas secciones ya se quitaron del footer porque no llevaban a nada). No puedo inventar plazos de envío, condiciones de devolución ni tallas — son datos de negocio reales.

**Qué necesito de ustedes:** el texto de esas 3 políticas (aunque sea corto), y los agrego al sitio.

---

## 🟡 Importante — no bloquea pero cojea

### 3. Correo de contacto
`hola@xtrm.com` en el footer — confirmar que es un correo real que revisan, o darme el correo correcto.

### 4. Dominio propio
Hoy el sitio vive en `xtrm-store.vercel.app`. Si va a salir en redes/tarjetas/empaques, probablemente quieran algo como `xtrm.com.co`.

**Qué necesito de ustedes:** decidir si lo compran y cuál, y darme acceso o las credenciales para configurar el DNS.

### 5. Deploy automático
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
