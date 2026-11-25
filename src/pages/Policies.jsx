import './Policies.css';

function Contact() {
  return (
    <>
      <a href="mailto:xtrmcorps@gmail.com">xtrmcorps@gmail.com</a> o al{' '}
      <a href="tel:+573184066969">318 406 6969</a>
    </>
  );
}

export default function Policies() {
  return (
    <main className="policies">
      <div className="container policies__content">
        <h1>Políticas de la tienda</h1>
        <p>Vigentes desde el 25 de noviembre de 2026.</p>

        <section id="compra">
          <h2>Compra y pago</h2>
          <p>
            Los precios están en pesos colombianos y son el valor total de cada producto. El
            envío se muestra por separado antes de pagar. El pago se hace en Wompi con
            tarjeta, PSE o Nequi. Antes de pagar ves el resumen del pedido y puedes
            corregirlo o cancelarlo.
          </p>
        </section>

        <section id="envios">
          <h2>Envíos</h2>
          <ul>
            <li>Enviamos a toda Colombia.</li>
            <li>Costo: $12.000 COP. Gratis en compras desde $200.000 COP.</li>
            <li>
              El despacho y la entrega toman alrededor de 8 días hábiles, según la región, y
              en ningún caso más de 30 días calendario desde el día siguiente al pedido.
            </li>
            <li>Te enviamos el número de guía por correo o WhatsApp.</li>
            <li>
              Si el producto no está disponible o la entrega se pasa de ese plazo máximo, puedes cancelar
              y te devolvemos todo lo pagado en máximo 15 días calendario.
            </li>
            <li>
              Si el paquete se pierde o llega dañado, escríbenos a <Contact />. En caso de
              daño, envíanos fotos o video del producto y del empaque. Revisada la evidencia,
              te devolvemos el dinero.
            </li>
          </ul>
        </section>

        <section id="retracto">
          <h2>Retracto</h2>
          <p>
            Tienes 5 días hábiles desde la entrega para arrepentirte de la compra, sin
            explicar el motivo (artículo 47 de la Ley 1480 de 2011).
          </p>
          <ul>
            <li>Escríbenos a <Contact /> con tu número de pedido y fotos o video del estado del producto.</li>
            <li>Devuelve la gorra en las mismas condiciones en que la recibiste. El envío de regreso lo pagas tú.</li>
            <li>
              Te devolvemos todo lo pagado, sin descuentos, en máximo 15 días calendario desde
              que ejerces el retracto, devuelves el producto y nos das los datos para el
              reembolso. Se hace al mismo medio de pago o por el que acordemos contigo.
            </li>
          </ul>
        </section>

        <section id="cambios">
          <h2>Cambios</h2>
          <ul>
            <li>
              Escríbenos a <Contact /> con tu número de pedido, el motivo y fotos o video del
              estado del producto. Revisamos cada caso según disponibilidad.
            </li>
            <li>
              Si enviamos un producto equivocado o defectuoso, nosotros pagamos el envío. Si el
              cambio es por gusto, lo pagas tú.
            </li>
            <li>Esto no limita tu derecho de retracto ni la garantía.</li>
          </ul>
        </section>

        <section id="garantia">
          <h2>Garantía</h2>
          <p>Las gorras tienen un (1) mes de garantía por defectos, contado desde la entrega.</p>
          <ul>
            <li>
              Para usarla, escríbenos a <Contact /> con tu número de pedido y fotos o video que
              muestren el defecto y el estado del producto.
            </li>
            <li>
              Reparamos el defecto gratis, incluido el transporte. Si no se puede reparar, te
              cambiamos la gorra o te devolvemos el dinero. Si la falla se repite, eliges entre
              otra reparación, el cambio o la devolución total o parcial del dinero.
            </li>
            <li>El plazo se suspende mientras no tengas el producto y vuelve a empezar si te lo cambiamos.</li>
            <li>
              No cubre defectos causados por fuerza mayor, por un tercero, por uso indebido o por
              no seguir los cuidados indicados en la página del producto.
            </li>
          </ul>
        </section>

        <section id="reversion">
          <h2>Reversión del pago</h2>
          <p>
            Si hubo fraude, no pediste la operación, no recibiste el producto, no es el que
            pediste o llegó defectuoso, puedes pedir la reversión del pago (artículo 51 de la Ley
            1480). Dentro de los 5 días hábiles siguientes a enterarte, presenta la queja a{' '}
            <Contact />, devuelve el producto cuando corresponda y avisa al emisor de tu medio de
            pago.
          </p>
        </section>

        <section id="quejas">
          <h2>Peticiones, quejas y reclamos</h2>
          <p>
            Escríbenos a <Contact />. Te respondemos con un número de radicado, la fecha y la hora,
            para que puedas hacer seguimiento por el mismo medio. Resolvemos en máximo 15 días
            hábiles. También puedes acudir a la{' '}
            <a href="https://www.sic.gov.co" target="_blank" rel="noreferrer">
              Superintendencia de Industria y Comercio (SIC)
            </a>.
          </p>
        </section>

        <section id="datos">
          <h2>Tratamiento de datos personales</h2>
          <p>
            El responsable es XTRM Store, que también atiende las solicitudes sobre datos
            (Ley 1581 de 2012).
          </p>
          <ul>
            <li>Qué datos: nombre, correo, teléfono, dirección de entrega, notas y detalle del pedido.</li>
            <li>
              Para qué: cobrar, preparar y entregar tu pedido, responder cambios, garantías y
              reclamos, y cumplir obligaciones legales. No los usamos para publicidad.
            </li>
            <li>
              Con quién: los compartimos solo con los proveedores que hacen posible el pedido (pago,
              mensajería, correo y alojamiento del sitio). Algunos pueden procesarlos fuera de Colombia.
              Los datos de tu tarjeta los recibe Wompi, no la tienda.
            </li>
            <li>
              Tus derechos: conocer, actualizar, rectificar y suprimir tus datos, pedir prueba de la
              autorización, saber cómo se usan, revocarla, acceder gratis a ellos y quejarte ante la SIC.
            </li>
            <li>
              Cómo ejercerlos: escribe a <Contact /> con tu nombre y solicitud. Las consultas se
              atienden en máximo 10 días hábiles y los reclamos en máximo 15.
            </li>
            <li>
              Conservamos los datos mientras sean necesarios para el pedido, la garantía y las
              obligaciones legales.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
