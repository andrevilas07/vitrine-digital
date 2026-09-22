import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  function addItem(product, size, qty = 1) {
    const key = `${product.id}-${size ? size.id : 'sem-tamanho'}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...prev, { key, product, size, qty }];
    });
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }

  function updateQty(key, qty) {
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, qty: Math.max(1, qty) } : item))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, item) => sum + Number(item.product.price) * item.qty, 0);
  const count = items.reduce((sum, item) => sum + item.qty, 0);

  const value = { items, addItem, removeItem, updateQty, clearCart, total, count };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
