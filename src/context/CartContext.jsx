import { createContext, useContext, useEffect, useReducer } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'xtrm_cart_v1';

function loadInitialState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('No se pudo leer el carrito guardado', err);
  }
  return { items: [] };
}

function lineKey(productId, colorId) {
  return `${productId}__${colorId}`;
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, color, quantity } = action.payload;
      const key = lineKey(product.id, color.id);
      const existing = state.items.find((i) => i.key === key);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.key === key
              ? { ...i, quantity: Math.min(i.quantity + quantity, color.stock) }
              : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            key,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            collection: product.collection,
            price: product.price,
            colorId: color.id,
            colorName: color.name,
            image: color.images[0],
            stock: color.stock,
            quantity: Math.min(quantity, color.stock),
          },
        ],
      };
    }
    case 'UPDATE_QUANTITY': {
      const { key, quantity } = action.payload;
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.key !== key) };
      }
      return {
        items: state.items.map((i) =>
          i.key === key ? { ...i, quantity: Math.min(quantity, i.stock) } : i
        ),
      };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => i.key !== action.payload.key) };
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.error('No se pudo guardar el carrito', err);
    }
  }, [state]);

  const addItem = (product, color, quantity = 1) =>
    dispatch({ type: 'ADD_ITEM', payload: { product, color, quantity } });
  const updateQuantity = (key, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { key, quantity } });
  const removeItem = (key) => dispatch({ type: 'REMOVE_ITEM', payload: { key } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}
