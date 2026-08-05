import { Link } from 'react-router-dom';
import founderLateral from '../assets/morada-lateral.png';
import blancoDiagonal from '../assets/blanco-diagonal.png';
import detras from '../assets/gorra-detras.png';
import logoBlanco from '../assets/logo-blanco.png';
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
          <div className="brand__story-media brand__story-media--logo">
            <img src={logoBlanco} alt="XTRM" />
          </div>
          <div className="brand__story-text">
            <span className="brand__eyebrow">Nuestra historia</span>
            <p>
              XTRM nació de la hermandad de dos amigos apasionados por el
              deporte, con el propósito de inspirar a las personas a
              alcanzar sus objetivos y transformar su estilo de vida.
            </p>
            <p>
              A través de consejos, tips y el ejemplo de su propia
              disciplina, comenzaron a compartir su proceso, motivando a
              otros a descubrir ese deporte que realmente los haga vibrar.
              Así fue como, de manera orgánica, nació una comunidad basada
              en la constancia, la mentalidad y la determinación.
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
