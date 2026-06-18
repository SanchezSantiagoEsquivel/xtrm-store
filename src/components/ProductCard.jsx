import { Link } from 'react-router-dom';
import { formatPrice } from '../data/products';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const primaryColor = product.colors[0];
  const [imgA, imgB] = primaryColor.images;
  const lowStock = primaryColor.stock <= 6;

  return (
    <Link to={`/producto/${product.slug}`} className="product-card">
      <div className="product-card__media">
        <img src={imgA} alt={product.name} className="product-card__img product-card__img--front" />
        {imgB && (
          <img src={imgB} alt="" className="product-card__img product-card__img--hover" aria-hidden="true" />
        )}
        {product.limitedEdition && <span className="product-card__tag">Edición limitada</span>}
        {product.compareAtPrice && <span className="product-card__tag product-card__tag--sale">Oferta</span>}
      </div>
      <div className="product-card__info">
        <span className="product-card__collection">{product.collection}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__price-row">
          <span className="product-card__price">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="product-card__price-old">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
        {lowStock && <span className="product-card__stock">Quedan {primaryColor.stock} unidades</span>}
      </div>
    </Link>
  );
}
