import { useState } from 'react';
import './ProductGallery.css';

export default function ProductGallery({ images, productName }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="product-gallery">
      <div className="product-gallery__main">
        <img src={images[activeIndex]} alt={`${productName}, vista ${activeIndex + 1}`} />
      </div>
      <div className="product-gallery__thumbs" role="tablist" aria-label="Ángulos de la gorra">
        {images.map((img, i) => (
          <button
            key={img}
            role="tab"
            aria-selected={i === activeIndex}
            className={`product-gallery__thumb ${i === activeIndex ? 'is-active' : ''}`}
            onClick={() => setActiveIndex(i)}
          >
            <img src={img} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
