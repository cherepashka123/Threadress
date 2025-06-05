// src/context/CartContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Item } from '@/data/items';

export type CartItem = Item & {
  quantity: number;
  pickupDeadline?: Date;
};

export type CartContextValue = {
  items: CartItem[];
  add: (item: Item) => void;
  remove: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clear: () => void;
  setPickupDeadline: (itemId: number) => void;
  getTimeRemaining: (itemId: number) => string | null;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Function to format time remaining
  const formatTimeRemaining = (deadline: Date): string => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();

    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

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

  const setPickupDeadline = (itemId: number) => {
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 4); // Set deadline to 4 hours from now

    setItems((currentItems) =>
      currentItems.map((i) =>
        i.id === itemId ? { ...i, pickupDeadline: deadline } : i
      )
    );
  };

  const getTimeRemaining = (itemId: number): string | null => {
    const item = items.find((i) => i.id === itemId);
    if (!item?.pickupDeadline) return null;
    return formatTimeRemaining(item.pickupDeadline);
  };

  const clear = () => {
    setItems([]);
  };

  // Check for expired items every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setItems((currentItems) =>
        currentItems.filter((item) => {
          if (!item.pickupDeadline) return true;
          return item.pickupDeadline.getTime() > now.getTime();
        })
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        add,
        remove,
        updateQuantity,
        clear,
        setPickupDeadline,
        getTimeRemaining,
      }}
    >
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
