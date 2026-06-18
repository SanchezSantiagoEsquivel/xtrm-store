import { Link } from 'react-router-dom';
import founderLateral from '../assets/morada-lateral.png';
import fuegoFrente from '../assets/fuego-frente.png';
import blancoDiagonal from '../assets/blanco-diagonal.png';
import detras from '../assets/gorra-detras.png';
import './Brand.css';

export default function Brand() {
  return (
    <main className="brand">
      <section className="brand__hero">
        <div className="container">
          <span className="brand__eyebrow">Manifiesto</span>
          <h1>
            UNA X PINTADA
            <br />
            QUE NUNCA SE SECÓ
          </h1>
          <p>
            XTRM nació de un trazo hecho rápido, con pintura que aún goteaba
            cuando se fotografió. Decidimos no corregirlo. Ese goteo se
            convirtió en nuestra firma: la prueba de que algo real estuvo
            ahí.
          </p>
        </div>
      </section>

      <section className="brand__story">
        <div className="container brand__story-grid">
          <div className="brand__story-media">
            <img src={fuegoFrente} alt="Gorra XTRM Blackout Fuego" />
          </div>
          <div className="brand__story-text">
            <span className="brand__eyebrow">01 — Origen</span>
            <h2>De la calle al bordado</h2>
            <p>
              Empezamos diseñando una sola gorra para un grupo cerrado de
              amigos que patinaban de noche. La X goteada era una broma
              interna que terminó pidiéndose más de lo que esperábamos. De
              ahí salió XTRM: una marca que no diseña para el catálogo, sino
              para la calle que la usa primero.
            </p>
          </div>
        </div>
      </section>

      <section className="brand__story brand__story--reverse">
        <div className="container brand__story-grid">
          <div className="brand__story-media">
            <img src={blancoDiagonal} alt="Gorra XTRM Classic" />
          </div>
          <div className="brand__story-text">
            <span className="brand__eyebrow">02 — Proceso</span>
            <h2>Bordado, no impresión</h2>
            <p>
              Cada diseño se traduce a bordado 3D de alta densidad porque
              una gorra impresa se desgasta en semanas y una bordada
              envejece bien. Probamos cada combinación de hilo y tensión
              hasta que el trazo de la X conserva su irregularidad
              original, incluso en miniatura.
            </p>
          </div>
        </div>
      </section>

      <section className="brand__story">
        <div className="container brand__story-grid">
          <div className="brand__story-media">
            <img src={founderLateral} alt="Gorra XTRM Original Founders" />
          </div>
          <div className="brand__story-text">
            <span className="brand__eyebrow">03 — Founders</span>
            <h2>Los primeros, marcados</h2>
            <p>
              La colección Founders existe para quienes compraron antes de
              que XTRM tuviera un catálogo. La estrella morada en el
              lateral no es decoración, es un registro: estuvieron ahí
              desde el inicio.
            </p>
          </div>
        </div>
      </section>

      <section className="brand__detail-strip">
        <img src={detras} alt="Detalle del cierre ajustable trasero" />
        <div className="brand__detail-text">
          <h2>Construidas para durar la calle</h2>
          <p>
            Estructura semi-rígida de 6 paneles, cierre ajustable de
            hebilla y visera curva reforzada. Cada gorra pasa por control
            de calidad de bordado antes de salir del taller.
          </p>
          <Link to="/tienda" className="btn btn-primary">Ver catálogo completo</Link>
        </div>
      </section>
    </main>
  );
}
