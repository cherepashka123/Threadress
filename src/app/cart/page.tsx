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
import { useCart, CartItem } from '@/context/CartContext';

export default function CartPage() {
  const { items: cartItems, remove, updateQuantity, clear } = useCart();
  const subtotal = cartItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 relative">
      {/* Tech background */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #8b6f5f08 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-20 left-[20%] w-32 h-32 rounded-full bg-gradient-to-r from-[#8b6f5f]/5 to-transparent blur-xl" />
        <div className="absolute bottom-40 right-[30%] w-40 h-40 rounded-full bg-gradient-to-r from-[#d4c4bc]/5 to-transparent blur-xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        {/* Header with animated underline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '120%' }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute -left-[10%] top-[50%] h-px bg-gradient-to-r from-transparent via-[#8b6f5f]/30 to-transparent"
            />
            <h1 className="text-4xl font-[500] text-[#8b6f5f] tracking-tight mb-4 flex items-center justify-center gap-3">
              <FaShoppingCart className="w-8 h-8" />
              Shopping Cart
            </h1>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Cart Items List */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 px-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-[#8b6f5f]/20"
              >
                <FaShoppingCart className="w-12 h-12 mx-auto text-[#8b6f5f]/30 mb-4" />
                <p className="text-gray-600 mb-6">Your cart is empty</p>
                <Link
                  href="/browse"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#8b6f5f] text-white rounded-full hover:bg-[#7a6152] transition-colors duration-300"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Continue Shopping
                </Link>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  className="space-y-4"
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {cartItems.map((item: CartItem) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      exit="exit"
                      className="group relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 transition-all duration-300 hover:border-transparent hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)]"
                    >
                      <div className="flex items-center p-4 gap-4">
                        {/* Image */}
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#8b6f5f] transition-colors duration-300">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.storeName}
                          </p>
                          <p className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#8b6f5f] to-[#d4c4bc]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(0, item.quantity - 1)
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#8b6f5f]/20 text-[#8b6f5f] hover:bg-[#8b6f5f] hover:text-white transition-all duration-300"
                          >
                            <FaMinus className="w-3 h-3" />
                          </motion.button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-[#8b6f5f]/20 text-[#8b6f5f] hover:bg-[#8b6f5f] hover:text-white transition-all duration-300"
                          >
                            <FaPlus className="w-3 h-3" />
                          </motion.button>
                        </div>

                        {/* Remove Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => remove(item.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                        >
                          <FaTrash className="w-3 h-3" />
                        </motion.button>
                      </div>

                      {/* Hover Accent */}
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                        transition={{ duration: 0.3 }}
                      >
                        <div className="absolute top-0 left-0 w-16 h-16">
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                'radial-gradient(circle at 0 0, rgba(139,111,95,0.1), transparent 70%)',
                            }}
                          />
                        </div>
                        <div className="absolute bottom-0 right-0 w-16 h-16">
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                'radial-gradient(circle at 100% 100%, rgba(212,196,188,0.1), transparent 70%)',
                            }}
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-80 space-y-6"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#8b6f5f]/20 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-800">Total</span>
                      <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#8b6f5f] to-[#d4c4bc]">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 px-6 py-3 bg-[#8b6f5f] text-white rounded-xl hover:bg-[#7a6152] transition-colors duration-300"
                >
                  Proceed to Checkout
                </motion.button>

                {/* Clear Cart Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clear}
                  className="w-full mt-3 px-6 py-3 border border-[#8b6f5f]/20 text-[#8b6f5f] rounded-xl hover:bg-[#8b6f5f] hover:text-white transition-all duration-300"
                >
                  Clear Cart
                </motion.button>
              </div>

              {/* Free Shipping Notice */}
              {subtotal < 100 && (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#8b6f5f]/20 p-4 text-sm text-gray-600">
                  Add ${(100 - subtotal).toFixed(2)} more to get free shipping!
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
