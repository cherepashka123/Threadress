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
} from 'react-icons/fa';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items: cartItems, remove, updateQuantity } = useCart();

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

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

      <div className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-light tracking-[-0.02em] text-neutral-900 mb-4">
            Your Cart
          </h1>
          <p className="text-neutral-600 font-light">
            Review and complete your purchase
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
                        <div className="text-sm text-neutral-600 font-light">
                          {item.storeName}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                              className="p-1 hover:bg-neutral-100 rounded"
                            >
                              <FaMinus className="w-3 h-3" />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1 hover:bg-neutral-100 rounded"
                            >
                              <FaPlus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-neutral-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-neutral-400 hover:text-neutral-600 transition-colors"
                      >
                        <FaTrash />
                      </button>
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
                    className="inline-flex items-center gap-2 text-[#8b6f5f] mt-4"
                  >
                    <FaArrowLeft />
                    Continue Shopping
                  </Link>
                </div>
              )}
            </motion.div>
          </div>

          {/* Summary Section */}
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
                  <span>$99.99</span>
                </div>
                <div className="flex justify-between text-neutral-600 font-light">
                  <span>Tax</span>
                  <span>$9.99</span>
                </div>
                <div className="flex justify-between text-neutral-900 font-medium pt-4 border-t border-neutral-100">
                  <span>Total</span>
                  <span>$109.98</span>
                </div>
              </div>

              <motion.button
                className="w-full bg-neutral-900 text-white/95 px-6 py-3 rounded-xl font-light relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">Proceed to Checkout</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
