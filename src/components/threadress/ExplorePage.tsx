'use client';

import React from 'react';
import { Product, User } from './types';

interface ExplorePageProps {
  user: User | null;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigateToSearch: () => void;
}

const ExplorePage: React.FC<ExplorePageProps> = ({
  user,
  allProducts,
  onSelectProduct,
  onNavigateToSearch,
}) => {
  // Trending: just use allProducts, or a subset if you want to limit
  const trendingProducts = allProducts.slice(0, 18); // Show first 18 as trending

  return (
    <div className="max-w-screen-2xl mx-auto px-8 py-10">
      {/* Modern Trending Banner */}
      <div className="mb-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl mx-auto text-center">
          <h1
            className="text-4xl font-bold text-gray-900 mb-4 tracking-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            Trending Now
          </h1>
          <p className="text-lg text-gray-500 mb-6">
            The most sought-after pieces in NYC boutiques right now. Reserve
            your favorite before it's gone.
          </p>
        </div>
        {/* Cool trending visual: animated gradient bar */}
        <div className="w-40 h-2 rounded-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 animate-pulse mb-2" />
      </div>

      {/* Trending Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-16">
        {trendingProducts.map((product) => (
          <div
            key={product.id}
            className="flex flex-col items-center group cursor-pointer"
            onClick={() => onSelectProduct(product)}
          >
            {/* Product Image */}
            <div className="w-full flex justify-center items-center aspect-[3/4] bg-white mb-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-contain max-h-72 max-w-full transition-transform duration-300 group-hover:scale-105"
                style={{ background: 'white' }}
              />
            </div>
            {/* Product Info */}
            <div className="w-full text-center">
              <div className="font-semibold text-gray-900 text-base leading-tight mb-1">
                {product.name}
              </div>
              <div className="text-gray-700 text-sm mb-1">${product.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modern Call to Action */}
      <div className="mt-16 text-center">
        <div className="inline-block px-8 py-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl border border-purple-100 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Want more?
          </h2>
          <p className="text-gray-600 mb-4">
            Try our Smart Search to discover hidden gems tailored to your style.
          </p>
          <button
            onClick={onNavigateToSearch}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-semibold"
          >
            Try Smart Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
