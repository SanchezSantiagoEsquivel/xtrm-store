import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import './CartDrawer.css';

export default function CartDrawer({ open, onClose }) {
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <>
      <div
        className={`cart-drawer__backdrop ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`cart-drawer ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
      >
        <div className="cart-drawer__header">
          <h2>Tu carrito</h2>
          <button className="cart-drawer__close" onClick={onClose} aria-label="Cerrar carrito">
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <p>Tu carrito está vacío.</p>
            <Link to="/tienda" className="btn btn-primary" onClick={onClose}>
              Ver gorras
            </Link>
          </div>
        ) : (
          <>
            <ul className="cart-drawer__list">
              {items.map((item) => (
                <li key={item.key} className="cart-drawer__item">
                  <img src={item.image} alt={item.name} />
                  <div className="cart-drawer__item-info">
                    <span className="cart-drawer__item-name">{item.name}</span>
                    <span className="cart-drawer__item-color">{item.colorName}</span>
                    <span className="cart-drawer__item-price">{formatPrice(item.price)}</span>
                    <div className="cart-drawer__qty">
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        aria-label={`Reducir cantidad de ${item.name}`}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        aria-label={`Aumentar cantidad de ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="cart-drawer__remove"
                    onClick={() => removeItem(item.key)}
                    aria-label={`Quitar ${item.name} del carrito`}
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__subtotal">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="cart-drawer__shipping-note">Envío calculado en el checkout</p>
              <Link to="/checkout" className="btn btn-primary btn-full" onClick={onClose}>
                Ir a pagar
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
