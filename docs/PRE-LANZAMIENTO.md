# XTRM Store — qué falta antes de salir a producción

Checklist para hablar con Diego. Ordenado por urgencia: lo que impide vender de verdad primero, lo cosmético al final.

---

## 🔴 Bloqueante — sin esto no se puede vender de verdad

### 1. Nadie se entera cuando entra un pedido
Es el hueco más grave. El checkout le dice al cliente *"te enviamos la confirmación a tu correo"*, pero ese correo no existe — nuestro código nunca lo manda (lo único que sale es el recibo genérico de Wompi, sin dirección de envío ni qué gorra compró). Tampoco hay base de datos: el pedido vive solo en el navegador del cliente. Si cierra la pestaña, ustedes nunca saben que alguien pagó.

**Qué se necesita:** al menos un webhook de Wompi que les avise (email o Slack/WhatsApp) con los datos del pedido cuando se aprueba el pago.

### 2. Llaves de Wompi en modo sandbox
Ahora mismo el pago es de mentiras — nadie puede cobrar ni pagar de verdad.

**Qué se necesita:**
- Cuenta de comercio **verificada/activada** en Wompi (no solo registrada)
- Llaves de producción: `pub_prod_...` y `prod_integrity_...`
- Con eso, cambio las variables en Vercel y redespliego (5 min una vez las tengan)

### 3. Texto de desarrollador visible a los clientes
En cada página de producto, debajo del bloque de video, sale literalmente:
> "Reemplaza este bloque por el video real subiendo el archivo .mp4..."

Es una nota interna que quedó pública por error. Hay que quitarla (o poner el video real).

### 4. Enlaces muertos en el footer
"Envíos", "Cambios y devoluciones" y "Guía de talla" no llevan a ningún lado — apuntan a secciones que no existen. Un cliente hace clic y no pasa nada.

**Qué se necesita:** contenido real para esas 3 políticas (aunque sea corto), o quitar los links mientras tanto.

---

## 🟡 Importante — no bloquea pero cojea

### 5. Correo de contacto
`hola@xtrm.com` en el footer — confirmar que es un correo real que revisan, o cambiarlo.

### 6. Dominio propio
Hoy el sitio vive en `xtrm-store.vercel.app`. Si va a salir en redes/tarjetas/empaques, probablemente quieran algo como `xtrm.com.co`.

### 7. Deploys manuales
El repositorio de GitHub no está conectado a Vercel (falta un permiso de la GitHub App que Diego/Santiago deben aprobar desde GitHub). Cada cambio necesita un deploy manual — no se publica solo al hacer push.

### 8. Borde blanco en las fotos de producto
El fondo de estudio se ve como un marco claro alrededor de las gorras en las fotos actuales. Se resuelve con fotos nuevas con el fondo ya recortado — no es algo que se arregle por código.

---

## ⚪ Cosmético / SEO

- Sin `robots.txt` ni `sitemap.xml`
- Sin meta tags Open Graph — cuando alguien comparta el link en WhatsApp/Instagram no sale imagen ni descripción, solo la URL pelada

---

## Ya resuelto ✅

- Precios, nombres y descripciones de las 3 gorras
- Hero, footer, "Nuestra historia", sección Founders
- Logo y favicon reales (sin fondo negro)
- Checkout con Wompi integrado y **probado de punta a punta** en sandbox (pago aprobado y rechazado, ambos casos funcionan)
- Suite de tests automáticos (Playwright) que corre ese mismo flujo de pago real cada vez que se necesite verificar que nada se rompió
- El total de cada compra se calcula y verifica en el servidor — un cliente no puede manipular el precio desde el navegador
