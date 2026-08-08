import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/ProductCard';
import heroPortada from '../assets/hero-portada.jpg';
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
    </main>
  );
}
