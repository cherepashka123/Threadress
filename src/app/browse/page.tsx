// src/app/browse/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { items as rawItems, Item } from '@/data/items';
import { useCart } from '@/context/CartContext';

type WithDistance = Item & {
  distanceMiles: number | null;
};

export default function BrowsePage() {
  const { add } = useCart();

  // 1) Track user coordinates
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);

  // 2) Track items augmented with distance
  const [itemsWithDistance, setItemsWithDistance] = useState<WithDistance[]>(
    []
  );

  // 3) Toast state
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

  // 4) Haversine formula for miles
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

  // 5) Request geolocation on mount
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

  // 6) Compute distances whenever location changes
  useEffect(() => {
    if (userLat === null || userLng === null) {
      // No location → distances become null
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
      return {
        ...it,
        distanceMiles: dist,
      };
    });
    setItemsWithDistance(withDist);
  }, [userLat, userLng]);

  // 7) Show toast helper
  function triggerToast(message: string) {
    setToastMessage(message);
    setShowToast(true);
    // Hide after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }

  return (
    <main className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-heading font-bold text-center text-gray-900 mb-12">
          Browse Local Items
        </h1>

        {/* Toast Notification */}
        {showToast && (
          <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
            {toastMessage}
          </div>
        )}

        {/* Animated grid container */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {itemsWithDistance.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden group"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: 'spring', stiffness: 120, damping: 20 },
                },
              }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Image Card */}
              <div className="relative w-full h-60 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Details */}
              <div className="p-4 space-y-2">
                {/* Name & Store */}
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h2>
                <p className="text-sm text-gray-500">{item.storeName}</p>

                {/* Distance */}
                {item.distanceMiles != null ? (
                  <div className="flex items-center text-xs text-gray-500">
                    <FaMapMarkerAlt className="mr-1 text-red-500" />
                    {item.distanceMiles.toFixed(1)} mi away
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">Distance unknown</p>
                )}

                {/* Price */}
                <p className="text-base font-medium text-indigo-600">
                  ${item.price.toFixed(2)}
                </p>

                {/* Add to Cart Button */}
                <button
                  onClick={() => {
                    add(item);
                    triggerToast(`${item.name} added to cart`);
                  }}
                  className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-medium rounded-lg shadow-md hover:opacity-90 transition"
                >
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
