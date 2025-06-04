// src/app/browse/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaFilter, FaSort, FaTimes } from 'react-icons/fa';
import { items as rawItems, Item } from '@/data/items';
import { useCart } from '@/context/CartContext';

type WithDistance = Item & {
  distanceMiles: number | null;
};

type SortOption = 'distance' | 'price-low' | 'price-high' | 'name';
type FilterOption = 'all' | 'dresses' | 'tops' | 'bottoms' | 'accessories';

export default function BrowsePage() {
  const { add } = useCart();
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

      <div className="max-w-7xl mx-auto px-6 relative">
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
            <h1 className="text-4xl font-[500] text-[#8b6f5f] tracking-tight mb-4">
              Browse Local Fashion
            </h1>
          </div>
        </motion.div>

        {/* Filters and Sort Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 flex flex-wrap gap-4 justify-between items-center"
        >
          {/* Filter Toggle Button */}
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#8b6f5f]/20 text-[#8b6f5f] hover:bg-[#8b6f5f] hover:text-white transition-all duration-300"
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
            className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[#8b6f5f]/20 text-[#8b6f5f] hover:border-[#8b6f5f] transition-all duration-300 cursor-pointer"
          >
            <option value="distance">Nearest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </motion.div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-[#8b6f5f]/20 shadow-lg">
                <div className="flex flex-wrap gap-4">
                  {['all', 'dresses', 'tops', 'bottoms', 'accessories'].map(
                    (option) => (
                      <motion.button
                        key={option}
                        onClick={() => setFilterBy(option as FilterOption)}
                        className={`px-4 py-2 rounded-full transition-all duration-300 ${
                          filterBy === option
                            ? 'bg-[#8b6f5f] text-white'
                            : 'bg-white/50 text-[#8b6f5f] hover:bg-[#8b6f5f]/10'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                      </motion.button>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Items Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {filteredAndSortedItems.map((item) => (
            <motion.div
              key={item.id}
              className="group relative"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: 'spring', stiffness: 120, damping: 20 },
                },
              }}
            >
              <motion.div
                className="relative bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 transition-all duration-300 group-hover:border-transparent group-hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)]"
                whileHover={{ y: -5 }}
              >
                {/* Image Container */}
                <div className="relative w-full h-60 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800 group-hover:text-[#8b6f5f] transition-colors duration-300">
                    {item.name}
                  </h2>
                  <p className="text-sm text-gray-500">{item.storeName}</p>

                  {/* Distance */}
                  {item.distanceMiles != null ? (
                    <div className="flex items-center text-xs text-gray-500">
                      <FaMapMarkerAlt className="mr-1 text-[#8b6f5f]" />
                      {item.distanceMiles.toFixed(1)} mi away
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">Distance unknown</p>
                  )}

                  {/* Price */}
                  <p className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#8b6f5f] to-[#d4c4bc]">
                    ${item.price.toFixed(2)}
                  </p>

                  {/* Add to Cart Button */}
                  <motion.button
                    onClick={() => {
                      add(item);
                      triggerToast(`${item.name} added to cart`);
                    }}
                    className="w-full px-4 py-2 bg-white text-[#8b6f5f] border border-[#8b6f5f] rounded-lg hover:bg-[#8b6f5f] hover:text-white transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add to Cart
                  </motion.button>
                </div>

                {/* Hover Accent */}
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute top-0 left-0 w-20 h-20">
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'radial-gradient(circle at 0 0, rgba(139,111,95,0.1), transparent 70%)',
                      }}
                    />
                  </div>
                  <div className="absolute bottom-0 right-0 w-20 h-20">
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
            </motion.div>
          ))}
        </motion.div>
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
