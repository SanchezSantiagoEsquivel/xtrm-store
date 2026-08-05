import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
import heroPortada from '../assets/hero-portada.jpg';
import fuegoLateral from '../assets/fuego-lateral.png';
import logoBlanco from '../assets/logo-blanco.png';
import './Home.css';

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.featured);

  return (
    <main>
      <section className="hero">
        <div className="hero__image-wrap">
          <img src={heroPortada} alt="Equipo XTRM entrenando en el gimnasio" />
        </div>
        <div className="container hero__content">
          <span className="hero__eyebrow">Fire Will</span>
          <h1 className="hero__title">
            PARA QUIEN LO INTENTA,
            <br />
            NADA ES IMPOSIBLE
          </h1>
          <p className="hero__subtitle">
            Gorras de diseño propio. Bordado de alta densidad, trazo de pintura
            goteada como firma, hechas para quienes marcan el camino.
          </p>
          <div className="hero__actions">
            <Link to="/tienda" className="btn btn-primary">Ver tienda</Link>
            <Link to="/tienda?collection=Founders" className="btn btn-violet">Founders</Link>
          </div>
        </div>
      </section>

      <section className="container featured">
        <div className="section-heading">
          <h2>Destacadas</h2>
          <Link to="/tienda" className="section-heading__link">Ver todas →</Link>
        </div>
        <div className="featured__grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="brand-strip">
        <div className="container brand-strip__inner">
          <div className="brand-strip__media">
            <img src={fuegoLateral} alt="Gorra XTRM Blackout Fuego, vista lateral" />
          </div>
          <div className="brand-strip__text">
            <img src={logoBlanco} alt="" className="brand-strip__mark" aria-hidden="true" />
            <h2>Nacida en la calle, hecha para durar</h2>
            <p>
              XTRM empezó con un trazo: una X pintada con pintura que aún
              gotea. Esa imperfección intencional es el corazón de cada
              gorra que bordamos. No hacemos colecciones de temporada,
              hacemos piezas que se quedan.
            </p>
            <Link to="/marca" className="btn">Conocer la marca</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
