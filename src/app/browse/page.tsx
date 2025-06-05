// src/app/browse/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaMapMarkerAlt,
  FaFilter,
  FaSort,
  FaTimes,
  FaMinus,
  FaPlus,
} from 'react-icons/fa';
import { items as rawItems, Item } from '@/data/items';
import { useCart, CartItem } from '@/context/CartContext';

type WithDistance = Item & {
  distanceMiles: number | null;
};

type SortOption = 'distance' | 'price-low' | 'price-high' | 'name';
type FilterOption = 'all' | 'dresses' | 'tops' | 'bottoms' | 'accessories';

export default function BrowsePage() {
  const { add, items: cartItems, updateQuantity } = useCart();
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [itemsWithDistance, setItemsWithDistance] = useState<WithDistance[]>(
    []
  );
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('distance');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Haversine formula for miles
  function haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 3958.8; // Earth radius in miles

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Request geolocation on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported');
      setUserLat(null);
      setUserLng(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude);
        setUserLng(pos.coords.longitude);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setUserLat(null);
        setUserLng(null);
      }
    );
  }, []);

  // Compute distances whenever location changes
  useEffect(() => {
    if (userLat === null || userLng === null) {
      setItemsWithDistance(
        rawItems.map((it) => ({ ...it, distanceMiles: null }))
      );
      return;
    }

    const withDist: WithDistance[] = rawItems.map((it) => {
      const dist =
        it.latitude != null && it.longitude != null
          ? haversineDistance(userLat, userLng, it.latitude, it.longitude)
          : null;
      return { ...it, distanceMiles: dist };
    });
    setItemsWithDistance(withDist);
  }, [userLat, userLng]);

  // Show toast helper
  function triggerToast(message: string) {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }

  // Sort and filter items
  const filteredAndSortedItems = [...itemsWithDistance]
    .filter((item) => filterBy === 'all' || item.category === filterBy)
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          if (a.distanceMiles === null) return 1;
          if (b.distanceMiles === null) return -1;
          return a.distanceMiles - b.distanceMiles;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

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
            Browse Collection
          </h1>
          <p className="text-neutral-600 font-light">
            Discover unique pieces from local boutiques
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          className="bg-white rounded-xl p-6 border border-neutral-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Filters and Sort Bar */}
          <div className="mb-8 flex flex-wrap gap-4 justify-between items-center">
            {/* Filter Toggle Button */}
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-neutral-200/50 text-neutral-600 hover:bg-neutral-900 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {showFilters ? <FaTimes /> : <FaFilter />}
              <span>{showFilters ? 'Close Filters' : 'Filters'}</span>
            </motion.button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-neutral-200/50 text-neutral-600 hover:border-neutral-900 transition-all duration-300 cursor-pointer"
            >
              <option value="distance">Nearest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 overflow-hidden"
              >
                <div className="flex flex-wrap gap-4">
                  {['all', 'dresses', 'tops', 'bottoms', 'accessories'].map(
                    (option) => (
                      <motion.button
                        key={option}
                        onClick={() => setFilterBy(option as FilterOption)}
                        className={`px-4 py-2 rounded-full transition-all duration-300 ${
                          filterBy === option
                            ? 'bg-neutral-900 text-white'
                            : 'bg-white/50 text-neutral-600 hover:bg-neutral-100'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </motion.button>
                    )
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredAndSortedItems.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white rounded-xl border border-neutral-100 overflow-hidden group"
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              {/* Product image */}
              <div className="relative aspect-square">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ opacity: 1 }}
                />
                <div className="relative w-full h-60 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Product details */}
              <div className="p-4">
                <h3 className="text-lg font-light text-neutral-900">
                  {item.name}
                </h3>
                <div className="text-sm text-neutral-600 font-light">
                  {item.storeName}
                </div>

                {/* Distance info - Fixed nested p tags */}
                <div className="mt-2">
                  {item.distanceMiles != null ? (
                    <div className="flex items-center text-xs text-gray-500">
                      <FaMapMarkerAlt className="mr-1 text-[#8b6f5f]" />
                      <span>{item.distanceMiles.toFixed(1)} mi away</span>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">
                      Distance unknown
                    </div>
                  )}
                </div>

                {/* Price - Fixed nested p tags */}
                <div className="mt-2">
                  <span className="text-indigo-600 font-medium">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <motion.div className="p-4 border-t border-neutral-100">
                <div className="flex items-center justify-between gap-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        const existingItem = cartItems.find(
                          (i: CartItem) => i.id === item.id
                        );
                        const currentQuantity = existingItem?.quantity || 0;
                        if (currentQuantity > 0) {
                          updateQuantity(item.id, currentQuantity - 1);
                          triggerToast(`Removed one ${item.name} from cart`);
                        }
                      }}
                      className="p-2 rounded-full hover:bg-indigo-50 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaMinus className="w-3 h-3 text-indigo-600" />
                    </motion.button>
                    <span className="w-8 text-center">
                      {cartItems.find((i: CartItem) => i.id === item.id)
                        ?.quantity || 0}
                    </span>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        add(item);
                        triggerToast(`Added one ${item.name} to cart`);
                      }}
                      className="p-2 rounded-full hover:bg-indigo-50 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaPlus className="w-3 h-3 text-indigo-600" />
                    </motion.button>
                  </div>

                  {/* Add to Cart Button */}
                  <motion.button
                    onClick={() => {
                      add(item);
                      triggerToast(`${item.name} added to cart`);
                    }}
                    className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white/95 px-4 py-2 rounded-lg transition-all duration-300 relative overflow-hidden group"
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
                    <span className="relative z-10">Add to Cart</span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-5 right-5 bg-[#8b6f5f] text-white px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
