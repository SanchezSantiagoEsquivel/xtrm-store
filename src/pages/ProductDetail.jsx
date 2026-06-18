import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { getProductBySlug, formatPrice } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductGallery from '../components/ProductGallery';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import './ProductDetail.css';

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const { addItem } = useCart();

  const [colorIndex, setColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  if (!product) return <Navigate to="/tienda" replace />;

  const color = product.colors[colorIndex];
  const outOfStock = color.stock === 0;
  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const handleAddToCart = () => {
    addItem(product, color, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="product-detail">
      <div className="container product-detail__breadcrumb">
        <Link to="/tienda">Tienda</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="container product-detail__layout">
        <div className="product-detail__gallery-col">
          <ProductGallery images={color.images} productName={product.name} />
          <ProductVideoBlock product={product} />
        </div>

        <div className="product-detail__info">
          <span className="product-detail__collection">{product.collection}</span>
          <h1 className="product-detail__name">{product.name}</h1>

          <div className="product-detail__price-row">
            <span className="product-detail__price">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="product-detail__price-old">{formatPrice(product.compareAtPrice)}</span>
            )}
            {product.limitedEdition && (
              <span className="product-detail__badge">Edición limitada</span>
            )}
          </div>

          <p className="product-detail__description">{product.description}</p>

          {product.colors.length > 1 && (
            <div className="product-detail__option-group">
              <span className="product-detail__option-label">Color: {color.name}</span>
              <div className="product-detail__swatches">
                {product.colors.map((c, i) => (
                  <button
                    key={c.id}
                    className={`product-detail__swatch ${i === colorIndex ? 'is-active' : ''}`}
                    style={{
                      background: `linear-gradient(135deg, ${c.swatch} 50%, ${c.swatchSecondary} 50%)`,
                    }}
                    aria-label={c.name}
                    aria-pressed={i === colorIndex}
                    onClick={() => {
                      setColorIndex(i);
                      setQuantity(1);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="product-detail__option-group">
            <span className="product-detail__option-label">Talla: Única (ajustable)</span>
          </div>

          <div className="product-detail__qty-row">
            <div className="product-detail__qty">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Reducir cantidad"
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(color.stock, q + 1))}
                disabled={quantity >= color.stock}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
            {!outOfStock && color.stock <= 6 && (
              <span className="product-detail__stock-note">Quedan {color.stock} unidades</span>
            )}
          </div>

          <button
            className="btn btn-primary btn-full product-detail__add-btn"
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            {outOfStock ? 'Agotado' : added ? 'Agregado ✓' : 'Agregar al carrito'}
          </button>

          <div className="product-detail__tabs">
            <div className="product-detail__tab-buttons" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === 'details'}
                className={activeTab === 'details' ? 'is-active' : ''}
                onClick={() => setActiveTab('details')}
              >
                Detalles
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'care'}
                className={activeTab === 'care' ? 'is-active' : ''}
                onClick={() => setActiveTab('care')}
              >
                Cuidados
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'shipping'}
                className={activeTab === 'shipping' ? 'is-active' : ''}
                onClick={() => setActiveTab('shipping')}
              >
                Envío
              </button>
            </div>

            <div className="product-detail__tab-panel">
              {activeTab === 'details' && (
                <ul>
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
              {activeTab === 'care' && <p>{product.care}</p>}
              {activeTab === 'shipping' && (
                <p>
                  Envíos a todo el país en 3–6 días hábiles. Envío gratis en
                  compras superiores a {formatPrice(200000)}. Recibes el
                  número de guía por correo apenas se despache tu pedido.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="container product-detail__related">
        <h2>También te puede interesar</h2>
        <div className="product-detail__related-grid">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductVideoBlock({ product }) {
  // No hay video real del producto todavía: en vez de un placeholder roto,
  // mostramos un bloque de presentación con el mismo material visual,
  // listo para reemplazar por <video> cuando exista el archivo final.
  return (
    <div className="product-video">
      <div className="product-video__frame">
        <img src={product.colors[0].images[0]} alt="" aria-hidden="true" />
        <div className="product-video__overlay">
          <PlayIcon />
          <span>Video del producto próximamente</span>
        </div>
      </div>
      <p className="product-video__hint">
        Reemplaza este bloque por el video real subiendo el archivo .mp4 al
        proyecto y usando una etiqueta &lt;video&gt; en su lugar.
      </p>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="19" stroke="white" strokeWidth="1.5" opacity="0.6" />
      <path d="M16 13l13 7-13 7V13z" fill="white" />
    </svg>
  );
}
