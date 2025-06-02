// src/app/cart/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTrashAlt,
  FaMinusCircle,
  FaPlusCircle,
  FaShoppingCart,
} from 'react-icons/fa';
import { useCart, CartItem } from '@/context/CartContext';

export default function CartPage() {
  const {
    cartItems = [],
    add,
    remove,
    updateQuantity,
    clear,
  } = useCart() as {
    cartItems: CartItem[];
    add: (item: CartItem) => void;
    remove: (item: CartItem) => void;
    updateQuantity: (id: number, qty: number) => void;
    clear: () => void;
  };

  const [subtotal, setSubtotal] = useState<number>(0);

  useEffect(() => {
    // Now each `item` is a CartItem (which has `quantity`)
    const total = cartItems.reduce(
      (acc: number, item: CartItem) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(total);
  }, [cartItems]);

  // 4-hour countdown timer (in seconds)
  const [timeLeft, setTimeLeft] = useState<number>(4 * 3600);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format seconds as "HH:MM:SS"
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  // Framer‐motion variants
  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 120, damping: 20 },
    },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } },
  };
  const pulseVariants = {
    idle: { boxShadow: '0 0 0px rgba(255,255,255,0)' },
    pulse: {
      boxShadow: '0 0 15px rgba(255,255,255,0.5)',
      transition: { yoyo: Infinity, duration: 1 },
    },
  };

  return (
    <div className="min-h-screen bg-[#f9f5f0] py-16 px-4 lg:px-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 px-4 lg:px-0">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <FaShoppingCart /> My Cart
        </h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-6xl mx-auto">
        {/* Cart Items List */}
        <main className="flex-1 space-y-6">
          {cartItems.length === 0 ? (
            <p className="text-gray-700">Your cart is empty.</p>
          ) : (
            <AnimatePresence>
              <motion.ul
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={listVariants}
              >
                {cartItems.map((item: CartItem) => (
                  <motion.li
                    key={item.id}
                    className="flex bg-white rounded-2xl shadow-md overflow-hidden"
                    variants={itemVariants}
                    exit="exit"
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {item.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {item.storeName}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="text-gray-600 disabled:opacity-50"
                          >
                            <FaMinusCircle size={20} />
                          </button>
                          <span className="text-gray-800">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="text-gray-600"
                          >
                            <FaPlusCircle size={20} />
                          </button>
                        </div>

                        {/* Price & Remove */}
                        <div className="flex items-center space-x-4">
                          <span className="text-indigo-600 font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => remove(item)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            aria-label={`Remove ${item.name}`}
                          >
                            <FaTrashAlt size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          )}
        </main>

        {/* Right Column: Pickup Notice + Order Summary */}
        <aside className="lg:w-1/3 space-y-6">
          {cartItems.length > 0 && (
            <motion.div
              className="bg-[#fff8f0] border-l-4 border-[#f0d1b8] p-4 rounded-lg shadow-sm"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="flex items-center justify-between"
                variants={pulseVariants}
                initial="idle"
                animate="pulse"
              >
                <p className="text-[#8b5e3c] font-semibold text-lg">
                  Pickup in:{' '}
                  <span className="font-bold">{formatTime(timeLeft)}</span>
                </p>
              </motion.div>
              <p className="mt-2 text-sm text-gray-600">
                Store hours may affect availability and pickup time.
              </p>
            </motion.div>
          )}

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>
            <div className="flex justify-between text-gray-700 mb-2">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700 mb-4">
              <span>Tax (8%)</span>
              <span>${(subtotal * 0.08).toFixed(2)}</span>
            </div>
            <hr className="border-gray-200 mb-4" />
            <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
              <span>Total</span>
              <span>${(subtotal * 1.08).toFixed(2)}</span>
            </div>
            <button
              disabled={cartItems.length === 0}
              className={`w-full py-3 text-white font-semibold rounded-lg transition duration-300 ${
                cartItems.length === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#c3a78e] to-[#b3926a] hover:opacity-90'
              }`}
            >
              Proceed to Checkout
            </button>
            {cartItems.length > 0 && (
              <button
                onClick={() => clear()}
                className="w-full mt-3 py-2 text-red-600 font-medium rounded-lg hover:bg-red-50 transition"
              >
                Clear Cart
              </button>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Checkout Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-inner lg:hidden">
          <button className="w-full py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-[#c3a78e] to-[#b3926a] hover:opacity-90 transition">
            Checkout — ${(subtotal * 1.08).toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
}

// Helper to format seconds as "HH:MM:SS"
function formatTime(seconds: number) {
  const hrs = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0');
  const mins = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}
