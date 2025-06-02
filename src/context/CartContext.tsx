// src/context/CartContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Item } from '@/data/items';

type CartContextValue = {
  cartItems: Item[];
  add: (item: Item) => void;
  remove: (item: Item) => void;
  updateQuantity: (id: number, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<Item[]>([]);

  function add(item: Item) {
    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        // increment quantity
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  }

  function remove(item: Item) {
    setCartItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  function updateQuantity(id: number, qty: number) {
    setCartItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: Math.max(qty, 1) } : i))
        .filter((i) => i.quantity! > 0)
    );
  }

  function clear() {
    setCartItems([]);
  }

  return (
    <CartContext.Provider
      value={{ cartItems, add, remove, updateQuantity, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
