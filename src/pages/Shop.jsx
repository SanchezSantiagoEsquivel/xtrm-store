import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS, COLLECTIONS, formatPrice } from '../data/products';
import ProductCard from '../components/ProductCard';
import './Shop.css';

const PRICE_BUCKETS = [
  { id: 'all', label: 'Todos los precios', test: () => true },
  { id: 'under-150', label: 'Hasta ' + formatPrice(150000), test: (p) => p <= 150000 },
  { id: '150-180', label: formatPrice(150000) + ' – ' + formatPrice(180000), test: (p) => p > 150000 && p <= 180000 },
  { id: 'over-180', label: 'Más de ' + formatPrice(180000), test: (p) => p > 180000 },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCollection = searchParams.get('collection') || 'all';

  const [query, setQuery] = useState(initialQuery);
  const [collection, setCollection] = useState(initialCollection);
  const [priceBucket, setPriceBucket] = useState('all');
  const [sort, setSort] = useState('relevance');

  const filtered = useMemo(() => {
    const bucket = PRICE_BUCKETS.find((b) => b.id === priceBucket) || PRICE_BUCKETS[0];
    let list = PRODUCTS.filter((p) => {
      const matchesQuery =
        !query.trim() ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.collection.toLowerCase().includes(query.toLowerCase());
      const matchesCollection = collection === 'all' || p.collection === collection;
      const matchesPrice = bucket.test(p.price);
      return matchesQuery && matchesCollection && matchesPrice;
    });

    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);

    return list;
  }, [query, collection, priceBucket, sort]);

  const handleCollectionChange = (value) => {
    setCollection(value);
    const next = new URLSearchParams(searchParams);
    if (value === 'all') next.delete('collection');
    else next.set('collection', value);
    setSearchParams(next, { replace: true });
  };

  return (
    <main className="shop">
      <div className="container shop__header">
        <h1>Tienda</h1>
        <p>{filtered.length} {filtered.length === 1 ? 'gorra encontrada' : 'gorras encontradas'}</p>
      </div>

      <div className="container shop__layout">
        <aside className="shop__filters" aria-label="Filtros de producto">
          <div className="shop__filter-group">
            <label htmlFor="shop-search">Buscar</label>
            <input
              id="shop-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nombre del producto..."
            />
          </div>

          <div className="shop__filter-group">
            <span className="shop__filter-label">Colección</span>
            <div className="shop__radio-list">
              <label>
                <input
                  type="radio"
                  name="collection"
                  checked={collection === 'all'}
                  onChange={() => handleCollectionChange('all')}
                />
                Todas
              </label>
              {Object.values(COLLECTIONS).map((c) => (
                <label key={c}>
                  <input
                    type="radio"
                    name="collection"
                    checked={collection === c}
                    onChange={() => handleCollectionChange(c)}
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          <div className="shop__filter-group">
            <span className="shop__filter-label">Precio</span>
            <div className="shop__radio-list">
              {PRICE_BUCKETS.map((b) => (
                <label key={b.id}>
                  <input
                    type="radio"
                    name="price"
                    checked={priceBucket === b.id}
                    onChange={() => setPriceBucket(b.id)}
                  />
                  {b.label}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <section className="shop__results">
          <div className="shop__sort">
            <label htmlFor="sort-select">Ordenar por</label>
            <select id="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="relevance">Relevancia</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="shop__empty">
              <p>No encontramos gorras con esos filtros.</p>
              <button
                className="btn"
                onClick={() => {
                  setQuery('');
                  handleCollectionChange('all');
                  setPriceBucket('all');
                }}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="shop__grid">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
