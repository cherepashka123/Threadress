// src/context/CartContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';
import { Item } from '@/data/items';

export type CartItem = Item & { quantity: number };

export type CartContextValue = {
  items: CartItem[];
  add: (item: Item) => void;
  remove: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (item: Item) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((i) => i.id === item.id);
      if (existingItem) {
        return currentItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...currentItems, { ...item, quantity: 1 }];
    });
  };

  const remove = (itemId: number) => {
    setItems((currentItems) => currentItems.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    setItems((currentItems) =>
      quantity === 0
        ? currentItems.filter((i) => i.id !== itemId)
        : currentItems.map((i) =>
            i.id === itemId ? { ...i, quantity: quantity } : i
          )
    );
  };

  const clear = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, add, remove, updateQuantity, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
