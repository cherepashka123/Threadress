'use client';

import React from 'react';
import { Product } from './types';

interface ResultsDisplayProps {
  products: Product[];
  allProducts: Product[];
  searchQuery: string;
  onSelectProduct: (product: Product) => void;
  userLocation?: { lat: number; lng: number } | null;
  boutiqueLocations?: Record<string, { lat: number; lng: number }>;
  getDistanceMiles?: (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => number;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  products,
  allProducts,
  searchQuery,
  onSelectProduct,
  userLocation,
  boutiqueLocations,
  getDistanceMiles,
}) => {
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-50 text-green-800 border-green-200';
    if (score >= 80) return 'bg-blue-50 text-blue-800 border-blue-200';
    if (score >= 70) return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    return 'bg-gray-50 text-gray-800 border-gray-200';
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 90) return 'Perfect Match';
    if (score >= 80) return 'Great Match';
    if (score >= 70) return 'Good Match';
    return 'Possible Match';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-xs ${
          index < Math.floor(rating) ? 'text-amber-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  // Get IDs of products in the main grid
  const mainProductIds = products.map((p) => p.id);

  // Find complementary items (different categories, not in main grid)
  // Show items from categories that complement what's already shown
  const mainCategories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];
  const complementaryCategories: Record<string, string[]> = {
    Dresses: ['Shoes', 'Bags', 'Accessories'],
    Tops: ['Bottoms', 'Accessories'],
    Bottoms: ['Tops', 'Shoes', 'Accessories'],
    Outerwear: ['Tops', 'Bottoms', 'Accessories'],
    Shoes: ['Dresses', 'Bottoms', 'Accessories'],
    Bags: ['Dresses', 'Outerwear', 'Accessories'],
    Accessories: ['Dresses', 'Tops', 'Bottoms'],
    Swimwear: ['Bags', 'Accessories', 'Shoes'],
  };

  // Get target categories based on what's already shown
  let targetCategories: string[] = [];
  if (mainCategories.length > 0) {
    // If main results are mostly one category, show complementary categories
    if (mainCategories.length === 1) {
      targetCategories = complementaryCategories[mainCategories[0] || ''] || [
        'Accessories',
        'Bags',
        'Shoes',
      ];
    } else {
      // If mixed categories, show accessories and shoes
      targetCategories = ['Accessories', 'Shoes', 'Bags'];
    }
  } else {
    // Fallback
    targetCategories = ['Accessories', 'Bags', 'Shoes'];
  }

  const similarItems = allProducts
    .filter(
      (p) =>
        !mainProductIds.includes(p.id) &&
        targetCategories.includes(p.category || '') &&
        (mainCategories[0] ? p.category !== mainCategories[0] : true) // Ensure different from primary category
    )
    .slice(0, 4);

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-light text-gray-900 mb-2">
          No matches found
        </h3>
        <p className="text-gray-500">
          Try adjusting your search or filters to find more results
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-16">
        {products.map((product) => {
          let distanceLabel = '';
          if (
            userLocation &&
            boutiqueLocations &&
            getDistanceMiles &&
            boutiqueLocations[product.boutique]
          ) {
            const dist = getDistanceMiles(
              userLocation.lat,
              userLocation.lng,
              boutiqueLocations[product.boutique].lat,
              boutiqueLocations[product.boutique].lng
            );
            distanceLabel = `${dist.toFixed(1)} miles away`;
          }
          return (
            <div
              key={product.id}
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => onSelectProduct(product)}
            >
              {/* Heart Icon */}
              <div className="w-full flex justify-center mb-2">
                <button className="text-gray-400 hover:text-gray-900 text-2xl focus:outline-none bg-transparent">
                  <svg
                    width="28"
                    height="28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16.5 3c-1.74 0-3.41 1.01-4.5 2.09C10.91 4.01 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54a2 2 0 0 0 2.9 0C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z" />
                  </svg>
                </button>
              </div>
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
                <div className="text-xs text-gray-400 mb-1">New Season</div>
                <div className="font-semibold text-gray-900 text-base leading-tight">
                  {product.boutique}
                </div>
                <div className="text-gray-700 text-sm mb-1">{product.name}</div>
                <div className="font-medium text-gray-900 text-base">
                  {formatPrice(product.price)}
                </div>
                {distanceLabel && (
                  <div className="text-xs text-gray-500 mt-1">
                    {distanceLabel}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* You May Also Like Section */}
      {similarItems.length > 0 && (
        <div className="mt-16">
          <h2
            className="text-center text-base font-semibold tracking-widest text-gray-700 mb-8 font-serif"
            style={{
              letterSpacing: '0.08em',
              fontFamily: 'Playfair Display, serif',
            }}
          >
            YOU MAY ALSO LIKE
          </h2>
          <div className="flex flex-row gap-10 overflow-x-auto pb-4 justify-center">
            {similarItems.map((product) => (
              <div
                key={product.id + '-similar'}
                className="min-w-[200px] max-w-[240px] flex-shrink-0 flex flex-col items-center cursor-pointer"
                onClick={() => onSelectProduct(product)}
              >
                <div className="w-full flex justify-center items-center aspect-[3/4] bg-white mb-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="object-contain max-h-56 max-w-full rounded-lg"
                  />
                </div>
                <div className="w-full text-center">
                  <div
                    className="text-lg text-gray-700 font-serif mb-1"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 500,
                    }}
                  >
                    {product.boutique}
                  </div>
                  <div
                    className="text-xl text-gray-900 font-serif mb-1 line-clamp-2"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {product.name}
                  </div>
                  <div
                    className="text-base text-gray-900 font-medium font-serif"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {formatPrice(product.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;
