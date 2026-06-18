import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import './Checkout.css';

const SHIPPING_FLAT_RATE = 12000;
const FREE_SHIPPING_THRESHOLD = 200000;

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  department: '',
  notes: '',
  paymentMethod: 'card',
};

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null);

  if (items.length === 0 && !orderId) {
    return <Navigate to="/tienda" replace />;
  }

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT_RATE;
  const total = subtotal + shipping;

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Ingresa tu nombre completo';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Ingresa un correo válido';
    if (!/^\d{7,}$/.test(form.phone.replace(/\s/g, ''))) next.phone = 'Ingresa un teléfono válido';
    if (!form.address.trim()) next.address = 'Ingresa tu dirección de envío';
    if (!form.city.trim()) next.city = 'Ingresa tu ciudad';
    if (!form.department.trim()) next.department = 'Ingresa tu departamento';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setPlacing(true);
    // Simulación de procesamiento de pago: aquí se integraría
    // la pasarela real (ej. Wompi) cuando esté disponible.
    await new Promise((resolve) => setTimeout(resolve, 1400));
    const id = `XTRM-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(id);
    clearCart();
    setPlacing(false);
  };

  if (orderId) {
    return (
      <main className="checkout checkout--confirmation">
        <div className="container checkout__confirmation">
          <span className="checkout__check">✓</span>
          <h1>Pedido confirmado</h1>
          <p>
            Gracias, {form.fullName.split(' ')[0]}. Tu pedido{' '}
            <strong>{orderId}</strong> fue recibido. Te enviamos la
            confirmación a <strong>{form.email}</strong> y el número de guía
            apenas se despache.
          </p>
          <Link to="/tienda" className="btn btn-primary">Seguir comprando</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout">
      <div className="container checkout__header">
        <h1>Checkout</h1>
        <Link to="/tienda" className="checkout__back-link">← Seguir comprando</Link>
      </div>

      <div className="container checkout__layout">
        <form className="checkout__form" onSubmit={handleSubmit} noValidate>
          <fieldset>
            <legend>Datos de contacto y envío</legend>

            <div className="checkout__field">
              <label htmlFor="fullName">Nombre completo</label>
              <input
                id="fullName"
                type="text"
                value={form.fullName}
                onChange={handleChange('fullName')}
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && <span className="checkout__error">{errors.fullName}</span>}
            </div>

            <div className="checkout__row">
              <div className="checkout__field">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <span className="checkout__error">{errors.email}</span>}
              </div>
              <div className="checkout__field">
                <label htmlFor="phone">Teléfono</label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone && <span className="checkout__error">{errors.phone}</span>}
              </div>
            </div>

            <div className="checkout__field">
              <label htmlFor="address">Dirección</label>
              <input
                id="address"
                type="text"
                value={form.address}
                onChange={handleChange('address')}
                aria-invalid={!!errors.address}
              />
              {errors.address && <span className="checkout__error">{errors.address}</span>}
            </div>

            <div className="checkout__row">
              <div className="checkout__field">
                <label htmlFor="city">Ciudad</label>
                <input
                  id="city"
                  type="text"
                  value={form.city}
                  onChange={handleChange('city')}
                  aria-invalid={!!errors.city}
                />
                {errors.city && <span className="checkout__error">{errors.city}</span>}
              </div>
              <div className="checkout__field">
                <label htmlFor="department">Departamento</label>
                <input
                  id="department"
                  type="text"
                  value={form.department}
                  onChange={handleChange('department')}
                  aria-invalid={!!errors.department}
                />
                {errors.department && <span className="checkout__error">{errors.department}</span>}
              </div>
            </div>

            <div className="checkout__field">
              <label htmlFor="notes">Notas de entrega (opcional)</label>
              <textarea
                id="notes"
                rows="3"
                value={form.notes}
                onChange={handleChange('notes')}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Método de pago</legend>
            <div className="checkout__payment-options">
              <label className={`checkout__payment-option ${form.paymentMethod === 'card' ? 'is-active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={form.paymentMethod === 'card'}
                  onChange={() => setForm((f) => ({ ...f, paymentMethod: 'card' }))}
                />
                Tarjeta de crédito o débito
              </label>
              <label className={`checkout__payment-option ${form.paymentMethod === 'transfer' ? 'is-active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={form.paymentMethod === 'transfer'}
                  onChange={() => setForm((f) => ({ ...f, paymentMethod: 'transfer' }))}
                />
                Transferencia / PSE
              </label>
            </div>
            <p className="checkout__payment-note">
              Esta es una pasarela de pago simulada para el prototipo. Ningún
              cobro real se procesa en este flujo.
            </p>
          </fieldset>

          <button type="submit" className="btn btn-primary btn-full checkout__submit" disabled={placing}>
            {placing ? 'Procesando pedido...' : `Pagar ${formatPrice(total)}`}
          </button>
        </form>

        <aside className="checkout__summary">
          <h2>Resumen del pedido</h2>
          <ul className="checkout__summary-list">
            {items.map((item) => (
              <li key={item.key}>
                <img src={item.image} alt={item.name} />
                <div>
                  <span className="checkout__summary-name">{item.name}</span>
                  <span className="checkout__summary-meta">{item.colorName} · x{item.quantity}</span>
                </div>
                <span className="checkout__summary-price">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="checkout__summary-totals">
            <div>
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div>
              <span>Envío</span>
              <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
            </div>
            <div className="checkout__summary-total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
