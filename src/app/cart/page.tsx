// src/app/cart/page.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaShoppingCart,
  FaTrash,
  FaMinus,
  FaPlus,
  FaArrowLeft,
  FaClock,
  FaStore,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const {
    items: cartItems,
    remove,
    updateQuantity,
    setPickupDeadline,
    getTimeRemaining,
  } = useCart();
  const [showPickupTimer, setShowPickupTimer] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  // Handle checkout
  const handleCheckout = () => {
    // Set pickup deadline for all items
    cartItems.forEach((item) => {
      setPickupDeadline(item.id);
    });
    setCheckoutComplete(true);
    setShowPickupTimer(true);
  };

  // Force component update every minute for timer
  useEffect(() => {
    if (showPickupTimer) {
      const interval = setInterval(() => {
        // Force re-render
        setShowPickupTimer((prev) => prev);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [showPickupTimer]);

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100 },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 },
    },
  };

  return (
    <main className="relative bg-[#fafafa] min-h-screen">
      {/* Tech-inspired background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-light tracking-[-0.02em] text-neutral-900 mb-4">
            {checkoutComplete ? 'Order Confirmed!' : 'Your Cart'}
          </h1>
          <p className="text-neutral-600 font-light">
            {checkoutComplete
              ? 'Your items are ready for pickup. Please collect them within 4 hours.'
              : 'Review and complete your purchase'}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            <motion.div className="bg-white rounded-xl border border-neutral-100 p-6">
              {cartItems.length > 0 ? (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="flex gap-6 p-4 hover:bg-neutral-50 rounded-lg transition-colors"
                    >
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-light text-neutral-900">
                          {item.name}
                        </h3>
                        <div className="text-sm text-neutral-600 font-light flex items-center gap-2">
                          <FaStore className="w-3 h-3" />
                          {item.storeName}
                        </div>
                        {item.latitude && item.longitude && (
                          <div className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                            <FaMapMarkerAlt className="w-3 h-3" />
                            <span>In store pickup available</span>
                          </div>
                        )}
                        {showPickupTimer && item.pickupDeadline && (
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <FaClock className="w-3 h-3 text-indigo-600" />
                            <span className="text-indigo-600 font-medium">
                              Pickup in: {getTimeRemaining(item.id)}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-4 mt-4">
                          {!checkoutComplete && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    Math.max(1, item.quantity - 1)
                                  )
                                }
                                className="p-1 hover:bg-indigo-50 rounded transition-colors"
                              >
                                <FaMinus className="w-3 h-3 text-indigo-600" />
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="p-1 hover:bg-indigo-50 rounded transition-colors"
                              >
                                <FaPlus className="w-3 h-3 text-indigo-600" />
                              </button>
                            </div>
                          )}
                          <span className="text-indigo-600 font-medium">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      {!checkoutComplete && (
                        <button
                          onClick={() => remove(item.id)}
                          className="text-neutral-400 hover:text-indigo-600 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-neutral-600 font-light">
                    Your cart is empty
                  </div>
                  <Link
                    href="/browse"
                    className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors mt-4"
                  >
                    <FaArrowLeft />
                    Continue Shopping
                  </Link>
                </div>
              )}
            </motion.div>
          </div>

          {/* Summary Section */}
          {cartItems.length > 0 && (
            <div className="lg:col-span-1">
              <motion.div
                className="bg-white rounded-xl border border-neutral-100 p-6 sticky top-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-xl font-light text-neutral-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-neutral-600 font-light">
                    <span>Subtotal</span>
                    <span className="text-indigo-600">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-600 font-light">
                    <span>Shipping</span>
                    <span className="text-indigo-600">
                      ${shipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-neutral-900 font-medium pt-4 border-t border-neutral-100">
                    <span>Total</span>
                    <span className="text-indigo-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                {!checkoutComplete ? (
                  <motion.button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white/95 px-6 py-3 rounded-xl font-light relative overflow-hidden group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-indigo-400/30 via-purple-400/30 to-indigo-400/30 bg-[length:200%_100%]"
                      animate={{
                        backgroundPosition: ['200% 0', '-200% 0'],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <span className="relative z-10">Proceed to Checkout</span>
                  </motion.button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                      <div className="text-green-800 font-medium mb-1">
                        Pickup Instructions
                      </div>
                      <p className="text-sm text-green-700">
                        Please pick up your items within 4 hours at the
                        respective stores. Show your order confirmation at the
                        counter.
                      </p>
                    </div>
                    <Link href="/browse">
                      <motion.button
                        className="w-full bg-neutral-900 text-white px-6 py-3 rounded-xl font-light"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Continue Shopping
                      </motion.button>
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
