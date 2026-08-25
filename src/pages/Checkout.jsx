import { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../data/products';
import './Checkout.css';

const SHIPPING_FLAT_RATE = 12000;
const FREE_SHIPPING_THRESHOLD = 200000;
const PENDING_ORDER_KEY = 'xtrm_pending_order';
const WOMPI_PUBLIC_KEY = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
const WOMPI_API_BASE = WOMPI_PUBLIC_KEY?.startsWith('pub_test_')
  ? 'https://sandbox.wompi.co/v1'
  : 'https://production.wompi.co/v1';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  department: '',
  notes: '',
};

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null);
  // form | verifying | declined | verify-error
  const [payment, setPayment] = useState(() =>
    searchParams.get('id') ? { status: 'verifying' } : { status: 'form' }
  );

  // Volvimos del Web Checkout de Wompi con ?id=<transaction_id>
  useEffect(() => {
    const transactionId = searchParams.get('id');
    if (!transactionId) return;

    fetch(`${WOMPI_API_BASE}/transactions/${transactionId}`, {
      headers: { Authorization: `Bearer ${WOMPI_PUBLIC_KEY}` },
    })
      .then((r) => r.json())
      .then((body) => {
        const tx = body?.data;
        const pendingRaw = sessionStorage.getItem(PENDING_ORDER_KEY);
        const pending = pendingRaw ? JSON.parse(pendingRaw) : null;

        if (tx?.status === 'APPROVED') {
          if (pending) setForm((f) => ({ ...f, ...pending.form }));
          setOrderId(tx.reference);
          clearCart();
          sessionStorage.removeItem(PENDING_ORDER_KEY);
          setPayment({ status: 'approved' });
        } else {
          setPayment({ status: 'declined', wompiStatus: tx?.status ?? 'DESCONOCIDO' });
        }
      })
      .catch(() => setPayment({ status: 'verify-error' }))
      .finally(() => setSearchParams({}, { replace: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0 && !orderId && payment.status === 'form') {
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
    if (!WOMPI_PUBLIC_KEY) {
      setErrors((prev) => ({ ...prev, form: 'Los pagos no están configurados todavía.' }));
      return;
    }
    setPlacing(true);
    try {
      const res = await fetch('/api/wompi-integrity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });
      if (!res.ok) throw new Error('No se pudo iniciar el pago');
      const { reference, amountInCents, currency, signature } = await res.json();

      sessionStorage.setItem(
        PENDING_ORDER_KEY,
        JSON.stringify({ reference, form, items, subtotal, shipping, total })
      );

      const params = new URLSearchParams({
        'public-key': WOMPI_PUBLIC_KEY,
        currency,
        'amount-in-cents': amountInCents,
        reference,
        'signature:integrity': signature,
        'redirect-url': `${window.location.origin}/checkout`,
        // Para que el webhook de confirmación de pedido tenga con quién
        // contactar y a dónde enviar, sin depender de que el cliente vuelva.
        'customer-data:email': form.email,
        'customer-data:full-name': form.fullName,
        'customer-data:phone-number': form.phone,
        'shipping-address:address-line-1': form.address,
        'shipping-address:city': form.city,
        'shipping-address:region': form.department,
        'shipping-address:country': 'CO',
        'shipping-address:name': form.fullName,
        'shipping-address:phone-number': form.phone,
      });
      window.location.assign(`https://checkout.wompi.co/p/?${params.toString()}`);
    } catch {
      setPlacing(false);
      setErrors((prev) => ({ ...prev, form: 'No pudimos conectar con la pasarela de pago. Intenta de nuevo.' }));
    }
  };

  if (payment.status === 'verifying') {
    return (
      <main className="checkout checkout--confirmation">
        <div className="container checkout__confirmation">
          <h1>Verificando tu pago…</h1>
          <p>Un momento, estamos confirmando la transacción con Wompi.</p>
        </div>
      </main>
    );
  }

  if (payment.status === 'declined' || payment.status === 'verify-error') {
    return (
      <main className="checkout checkout--confirmation">
        <div className="container checkout__confirmation">
          <span className="checkout__check checkout__check--error">✕</span>
          <h1>El pago no se completó</h1>
          <p>
            {payment.status === 'declined'
              ? `Wompi reportó el estado "${payment.wompiStatus}". No se hizo ningún cobro.`
              : 'No pudimos verificar el resultado del pago. Si alcanzaste a pagar, escríbenos con tu correo.'}
            {' '}Tu carrito sigue guardado, puedes intentarlo de nuevo.
          </p>
          <Link to="/checkout" className="btn btn-primary" onClick={() => setPayment({ status: 'form' })}>
            Volver a intentar
          </Link>
        </div>
      </main>
    );
  }

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
            <p className="checkout__payment-note">
              Al pagar te llevamos a Wompi (pasarela segura) para elegir
              tarjeta, PSE o Nequi y completar el pago.
            </p>
            {errors.form && <span className="checkout__error">{errors.form}</span>}
          </fieldset>

          <button type="submit" className="btn btn-primary btn-full checkout__submit" disabled={placing}>
            {placing ? 'Conectando con Wompi...' : `Pagar ${formatPrice(total)}`}
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
