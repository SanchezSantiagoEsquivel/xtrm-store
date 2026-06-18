import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import logoBlanco from '../assets/logo-blanco.png';
import './Header.css';

export default function Header({ onOpenCart, onSearch }) {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query);
    navigate(`/tienda?q=${encodeURIComponent(query)}`);
    setSearchOpen(false);
  };

  return (
    <header className="header">
      <div className="header__bar container">
        <button
          className="header__menu-btn"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`hamburger ${menuOpen ? 'is-open' : ''}`}>
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav className={`header__nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegación principal">
          <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/tienda" onClick={() => setMenuOpen(false)}>Tienda</Link>
          <Link to="/marca" onClick={() => setMenuOpen(false)}>La marca</Link>
          <Link to="/tienda?collection=Founders" onClick={() => setMenuOpen(false)}>Founders</Link>
        </nav>

        <Link to="/" className="header__logo" aria-label="XTRM, inicio">
          <img src={logoBlanco} alt="XTRM" />
        </Link>

        <div className="header__actions">
          <button
            className="header__icon-btn"
            aria-label="Buscar productos"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <SearchIcon />
          </button>
          <button
            className="header__icon-btn header__cart-btn"
            aria-label={`Carrito de compras, ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`}
            onClick={onOpenCart}
          >
            <CartIcon />
            {itemCount > 0 && <span className="header__cart-count">{itemCount}</span>}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="header__search container">
          <form onSubmit={handleSearchSubmit} role="search">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar gorras..."
              autoFocus
              aria-label="Buscar productos"
            />
            <button type="submit" className="btn btn-primary">Buscar</button>
          </form>
        </div>
      )}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M13.5 13.5L18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 6h12l-1 10.5a1 1 0 01-1 .9H6a1 1 0 01-1-.9L4 6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M7 6V4.5a3 3 0 016 0V6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
