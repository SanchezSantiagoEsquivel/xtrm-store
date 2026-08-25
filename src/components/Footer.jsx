import { Link } from 'react-router-dom';
import logoBlanco from '../assets/logo-blanco.png';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <img src={logoBlanco} alt="XTRM" className="footer__logo" />
          <p>
            Si llevas XTRM llevas una decisión. La decisión de seguir. De
            mejorar. De no rendirte cuando el progreso se vuelve lento. -
            FIRE WILL
          </p>
        </div>

        <div className="footer__col">
          <h3>Tienda</h3>
          <Link to="/tienda">Todas las gorras</Link>
          <Link to="/tienda?collection=Founders">Founders</Link>
          <Link to="/tienda?collection=Blackout">Blackout</Link>
        </div>

        <div className="footer__col">
          <h3>Marca</h3>
          <Link to="/marca">Nuestra historia</Link>
          <a href="mailto:hola@xtrm.com">Contacto</a>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} XTRM. Todos los derechos reservados.</span>
        <span className="footer__tagline">FIRE WILL. ESTD. 2024.</span>
      </div>
    </footer>
  );
}
