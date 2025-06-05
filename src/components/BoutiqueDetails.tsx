'use client';

import { motion } from 'framer-motion';
import {
  FaRuler,
  FaTag,
  FaHistory,
  FaTshirt,
  FaRegHeart,
  FaHeart,
} from 'react-icons/fa';
import { useState } from 'react';

export default function BoutiqueDetails() {
  const [favoriteItems, setFavoriteItems] = useState<number[]>([]);

  const trendingItems = [
    {
      id: 1,
      name: 'Silk Evening Gown',
      brand: 'Elegance',
      price: 299.99,
      size: 'S, M, L',
      material: 'Pure Silk',
      popularity: 98,
      restockTime: '2 days ago',
      similarItems: 3,
    },
    {
      id: 2,
      name: 'Designer Blazer',
      brand: 'ModernFit',
      price: 199.99,
      size: 'XS - XL',
      material: 'Wool Blend',
      popularity: 95,
      restockTime: '1 week ago',
      similarItems: 5,
    },
    {
      id: 3,
      name: 'Summer Dress',
      brand: 'SunStyle',
      price: 149.99,
      size: 'XS - L',
      material: 'Cotton',
      popularity: 92,
      restockTime: '3 days ago',
      similarItems: 4,
    },
  ];

  const toggleFavorite = (id: number) => {
    setFavoriteItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute left-4 top-4 bottom-4 w-80 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden z-[1000]"
    >
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-violet-600/5 to-indigo-600/5">
        <h2 className="text-lg font-semibold text-neutral-900">
          Trending Items
        </h2>
        <p className="text-sm text-gray-600">Real-time product insights</p>
      </div>

      <div className="overflow-auto h-full pb-4">
        {trendingItems.map((item, index) => (
          <motion.div
            key={`trending-${item.id}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 border-b border-gray-100 last:border-0"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-neutral-900">{item.name}</h3>
              <button
                onClick={() => toggleFavorite(item.id)}
                className="text-violet-600 hover:text-violet-700 transition-colors"
              >
                {favoriteItems.includes(item.id) ? (
                  <FaHeart className="w-5 h-5" />
                ) : (
                  <FaRegHeart className="w-5 h-5" />
                )}
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-3">{item.brand}</p>

            {/* Interactive price tag */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1 rounded-full inline-flex items-center space-x-1 mb-3"
            >
              <FaTag className="w-3 h-3" />
              <span className="text-sm font-medium">${item.price}</span>
            </motion.div>

            {/* Product details grid */}
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div className="flex items-center space-x-2 text-gray-600">
                <FaRuler className="w-4 h-4 text-violet-600" />
                <span>{item.size}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <FaTshirt className="w-4 h-4 text-violet-600" />
                <span>{item.material}</span>
              </div>
            </div>

            {/* Interactive popularity bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Popularity</span>
                <span>{item.popularity}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.popularity}%` }}
                  transition={{ duration: 1, delay: index * 0.2 }}
                  className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
                />
              </div>
            </div>

            {/* Additional info */}
            <div className="flex justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <FaHistory className="w-3 h-3" />
                <span>Restocked {item.restockTime}</span>
              </div>
              <span>{item.similarItems} similar items nearby</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
