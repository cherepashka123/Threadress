'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import type { MapProps } from '@/components/Map';

// Dynamically import the Map component with no SSR
const Map = dynamic<MapProps>(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-50">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

interface StoreLocation {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

export interface SearchItem {
  id: number;
  text: string;
  embedding: number[];
  category: string;
  price: number;
  store: StoreLocation;
  imageUrl: string;
  color?: string;
  size?: string;
  material?: string;
  occasion?: string;
  similarity?: number;
}

// Popular search suggestions
const searchSuggestions = [
  'Y2K aesthetic outfit',
  'Cottagecore dress',
  'Minimalist basics',
  'Statement blazer',
  'Parisian chic look',
  'Sustainable loungewear',
  'Indie aesthetic',
  'Dark academia outfit',
  'Designer vintage',
];

// Sample data with pre-computed "embeddings" for demonstration
const sampleData: SearchItem[] = [
  {
    id: 1,
    text: 'Tailored Italian Wool Blazer',
    embedding: [0.9, 0.8, 0.7],
    category: 'Outerwear',
    price: 495.99,
    imageUrl: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660',
    color: 'Charcoal Grey',
    material: 'Italian Wool',
    occasion: 'Business',
    store: {
      name: 'Sartorial Excellence',
      address: '123 Madison Ave, Upper East Side',
      lat: 40.7736,
      lng: -73.9566,
    },
  },
  {
    id: 2,
    text: 'Silk Evening Gown',
    embedding: [0.85, 0.75, 0.8],
    category: 'Dresses',
    price: 595.0,
    imageUrl: 'https://images.unsplash.com/photo-1595073885566-5c8f18c50e6e',
    color: 'Ivory',
    material: 'Silk Georgette',
    occasion: 'Evening',
    store: {
      name: 'Luxury Atelier',
      address: '456 Fifth Ave, Midtown',
      lat: 40.7508,
      lng: -73.9772,
    },
  },
  {
    id: 3,
    text: 'Cashmere Turtleneck Sweater',
    embedding: [0.8, 0.9, 0.6],
    category: 'Knitwear',
    price: 245.0,
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
    color: 'Camel',
    material: 'Pure Cashmere',
    occasion: 'Smart Casual',
    store: {
      name: 'Premium Knits',
      address: '789 Columbus Ave, Upper West Side',
      lat: 40.7829,
      lng: -73.9654,
    },
  },
  {
    id: 4,
    text: 'Leather Pencil Skirt',
    embedding: [0.7, 0.8, 0.9],
    category: 'Skirts',
    price: 295.0,
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa',
    color: 'Black',
    material: 'Nappa Leather',
    occasion: 'Business',
    store: {
      name: 'Modern Professional',
      address: '321 Park Ave, Midtown',
      lat: 40.7648,
      lng: -74.0012,
    },
  },
  {
    id: 5,
    text: 'Classic Silk Blouse',
    embedding: [0.82, 0.78, 0.75],
    category: 'Tops',
    price: 185.0,
    imageUrl: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f',
    color: 'Pearl White',
    material: 'Silk Charmeuse',
    occasion: 'Work',
    store: {
      name: 'Elegant Essentials',
      address: '567 Elizabeth St, Nolita',
      lat: 40.7225,
      lng: -73.9987,
    },
  },
  {
    id: 6,
    text: 'Wide-Leg Wool Trousers',
    embedding: [0.88, 0.82, 0.71],
    category: 'Pants',
    price: 245.0,
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1',
    color: 'Navy',
    material: 'Italian Wool',
    occasion: 'Business',
    store: {
      name: 'Tailored Traditions',
      address: '789 W 23rd St, Chelsea',
      lat: 40.7466,
      lng: -74.0046,
    },
  },
  {
    id: 7,
    text: 'Leather & Canvas Work Tote',
    embedding: [0.85, 0.79, 0.73],
    category: 'Accessories',
    price: 195.0,
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7',
    color: 'Tan',
    material: 'Canvas & Leather',
    occasion: 'Work',
    store: {
      name: 'Professional Accessories',
      address: '123 7th Ave, Chelsea',
      lat: 40.7352,
      lng: -73.9999,
    },
  },
  {
    id: 8,
    text: 'Pearl & Gold Drop Earrings',
    embedding: [0.87, 0.81, 0.76],
    category: 'Jewelry',
    price: 325.0,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
    color: 'White Gold',
    material: 'Gold & Pearls',
    occasion: 'Special Event',
    store: {
      name: 'Fine Jewelry House',
      address: '456 E 9th St, East Village',
      lat: 40.7291,
      lng: -73.9845,
    },
  },
  {
    id: 9,
    text: 'Merino Wool Wrap Coat',
    embedding: [0.91, 0.85, 0.78],
    category: 'Outerwear',
    price: 495.0,
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
    color: 'Camel',
    material: 'Merino Wool',
    occasion: 'Winter',
    store: {
      name: 'Luxury Outerwear',
      address: '789 5th Ave, Upper East',
      lat: 40.7735,
      lng: -73.9712,
    },
  },
  {
    id: 10,
    text: 'Crystal-Embellished Evening Clutch',
    embedding: [0.83, 0.88, 0.77],
    category: 'Accessories',
    price: 245.0,
    imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d',
    color: 'Midnight Blue',
    material: 'Satin & Crystal',
    occasion: 'Evening',
    store: {
      name: 'Evening Elegance',
      address: '321 Park Ave, Midtown',
      lat: 40.7505,
      lng: -73.9934,
    },
  },
  {
    id: 11,
    text: 'Italian Leather Pumps',
    embedding: [0.86, 0.84, 0.79],
    category: 'Shoes',
    price: 395.0,
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2',
    color: 'Burgundy',
    material: 'Italian Leather',
    occasion: 'Formal',
    store: {
      name: 'Luxury Footwear',
      address: '567 Madison Ave, Midtown',
      lat: 40.7616,
      lng: -73.9742,
    },
  },
  {
    id: 12,
    text: 'Hermès Vintage Silk Scarf',
    embedding: [0.89, 0.83, 0.81],
    category: 'Accessories',
    price: 495.0,
    imageUrl: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e',
    color: 'Navy & Gold',
    material: 'Silk Twill',
    occasion: 'All Occasions',
    store: {
      name: 'Vintage Luxury',
      address: '890 Madison Ave, Upper East',
      lat: 40.7739,
      lng: -73.9653,
    },
  },
  {
    id: 13,
    text: 'Pinstripe Wool Blazer',
    embedding: [0.84, 0.86, 0.75],
    category: 'Suits',
    price: 495.0,
    imageUrl: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660',
    color: 'Navy Pinstripe',
    material: 'Super 120s Wool',
    occasion: 'Business Formal',
    store: {
      name: 'Bespoke & Co.',
      address: '123 Worth St, Financial District',
      lat: 40.7193,
      lng: -73.9554,
    },
  },
  {
    id: 14,
    text: 'Cashmere-Silk Evening Wrap',
    embedding: [0.88, 0.85, 0.82],
    category: 'Accessories',
    price: 245.0,
    imageUrl: 'https://images.unsplash.com/photo-1582142839970-2b9e04b60f65',
    color: 'Soft Grey',
    material: 'Cashmere-Silk Blend',
    occasion: 'Evening',
    store: {
      name: 'Luxury Knits',
      address: '456 Metropolitan Ave, Williamsburg',
      lat: 40.7139,
      lng: -73.9537,
    },
  },
  {
    id: 15,
    text: 'Leather Business Portfolio',
    embedding: [0.85, 0.87, 0.8],
    category: 'Accessories',
    price: 295.0,
    imageUrl: 'https://images.unsplash.com/photo-1590739293931-a38b08273c1c',
    color: 'Cognac',
    material: 'Full-grain Leather',
    occasion: 'Business',
    store: {
      name: 'Professional Leather Goods',
      address: '789 Court St, Downtown',
      lat: 40.6782,
      lng: -73.9972,
    },
  },
  {
    id: 16,
    text: 'Wool-Blend Sheath Dress',
    embedding: [0.86, 0.88, 0.83],
    category: 'Dresses',
    price: 325.0,
    imageUrl: 'https://images.unsplash.com/photo-1595073885566-5c8f18c50e6e',
    color: 'Forest Green',
    material: 'Silk-Wool Blend',
    occasion: 'Work',
    store: {
      name: 'Executive Style',
      address: '234 Broadway, Financial District',
      lat: 40.7127,
      lng: -74.0059,
    },
  },
  {
    id: 17,
    text: 'Diamond Tennis Bracelet',
    embedding: [0.87, 0.89, 0.84],
    category: 'Jewelry',
    price: 2995.0,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
    color: 'Platinum',
    material: 'Platinum & Diamonds',
    occasion: 'Special Event',
    store: {
      name: 'Diamond District Jewelers',
      address: '580 5th Ave, Diamond District',
      lat: 40.7557,
      lng: -73.9789,
    },
  },
  {
    id: 18,
    text: 'Classic Oxford Dress Shoes',
    embedding: [0.88, 0.86, 0.85],
    category: 'Shoes',
    price: 395.0,
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2',
    color: 'Dark Brown',
    material: 'Calfskin Leather',
    occasion: 'Business Formal',
    store: {
      name: 'Bespoke Footwear',
      address: '345 Madison Ave, Midtown',
      lat: 40.7541,
      lng: -73.9772,
    },
  },
  {
    id: 19,
    text: 'Vintage Floral Silk Scarf',
    embedding: [0.89, 0.84, 0.82],
    category: 'Accessories',
    price: 445.0,
    imageUrl: 'https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e',
    color: 'Ivory & Floral',
    material: 'Silk Twill',
    occasion: 'All Occasions',
    store: {
      name: 'Luxury Vintage Collective',
      address: '678 Madison Ave, Upper East',
      lat: 40.7718,
      lng: -73.9631,
    },
  },
  {
    id: 20,
    text: 'Heritage Cotton Trench Coat',
    embedding: [0.9, 0.85, 0.83],
    category: 'Outerwear',
    price: 895.0,
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
    color: 'Classic Beige',
    material: 'Cotton Gabardine',
    occasion: 'All Seasons',
    store: {
      name: 'Heritage Luxury',
      address: '432 5th Ave, Midtown',
      lat: 40.7512,
      lng: -73.9814,
    },
  },
  {
    id: 21,
    text: 'Designer Leather Crossbody Bag',
    embedding: [0.87, 0.86, 0.84],
    category: 'Accessories',
    price: 1450.0,
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7',
    color: 'Black',
    material: 'Calfskin Leather',
    occasion: 'Everyday Luxury',
    store: {
      name: 'Designer Gallery',
      address: '555 5th Ave, Midtown',
      lat: 40.7553,
      lng: -73.9783,
    },
  },
  {
    id: 22,
    text: 'Luxury Tweed Blazer',
    embedding: [0.88, 0.87, 0.85],
    category: 'Outerwear',
    price: 1900.0,
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
    color: 'Black & White',
    material: 'Wool Tweed',
    occasion: 'Business & Evening',
    store: {
      name: 'Haute Couture House',
      address: '737 Madison Ave, Upper East',
      lat: 40.7677,
      lng: -73.9641,
    },
  },
  {
    id: 23,
    text: 'Handwoven Leather Evening Clutch',
    embedding: [0.86, 0.85, 0.83],
    category: 'Accessories',
    price: 1200.0,
    imageUrl: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d',
    color: 'Caramel',
    material: 'Woven Leather',
    occasion: 'Evening',
    store: {
      name: 'Italian Luxury',
      address: '815 Madison Ave, Upper East',
      lat: 40.7721,
      lng: -73.9651,
    },
  },
  {
    id: 24,
    text: 'Pure Camel Hair Coat',
    embedding: [0.85, 0.84, 0.82],
    category: 'Outerwear',
    price: 1690.0,
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
    color: 'Camel',
    material: 'Pure Camel Hair',
    occasion: 'Winter',
    store: {
      name: 'Designer Collections',
      address: '980 Madison Ave, Upper East',
      lat: 40.7741,
      lng: -73.9633,
    },
  },
  {
    id: 25,
    text: 'Signature Gold Bangle',
    embedding: [0.89, 0.88, 0.86],
    category: 'Jewelry',
    price: 2750.0,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
    color: 'Yellow Gold',
    material: '18K Gold',
    occasion: 'Everyday Luxury',
    store: {
      name: 'Fine Jewelry Boutique',
      address: '653 5th Ave, Midtown',
      lat: 40.7575,
      lng: -73.9745,
    },
  },
  {
    id: 26,
    text: 'Designer Canvas Shoulder Bag',
    embedding: [0.87, 0.86, 0.85],
    category: 'Accessories',
    price: 1290.0,
    imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7',
    color: 'Brown',
    material: 'Canvas & Leather',
    occasion: 'Everyday Luxury',
    store: {
      name: 'Luxury Accessories',
      address: '598 Madison Ave, Upper East',
      lat: 40.7628,
      lng: -73.9715,
    },
  },
  {
    id: 27,
    text: 'Patent Leather Stilettos',
    embedding: [0.86, 0.85, 0.84],
    category: 'Shoes',
    price: 745.0,
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2',
    color: 'Black Patent',
    material: 'Patent Leather',
    occasion: 'Evening',
    store: {
      name: 'Designer Footwear',
      address: '965 Madison Ave, Upper East',
      lat: 40.7738,
      lng: -73.9648,
    },
  },
  {
    id: 28,
    text: 'Diamond Floral Necklace',
    embedding: [0.9, 0.89, 0.88],
    category: 'Jewelry',
    price: 4500.0,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
    color: 'Rose Gold',
    material: '18K Gold & Diamonds',
    occasion: 'Special Event',
    store: {
      name: 'Fine Jewelry House',
      address: '744 5th Ave, Midtown',
      lat: 40.7629,
      lng: -73.9731,
    },
  },
];

const calculateSimilarity = (v1: number[], v2: number[]): number => {
  const dotProduct = v1.reduce((acc, val, i) => acc + val * v2[i], 0);
  const mag1 = Math.sqrt(v1.reduce((acc, val) => acc + val * val, 0));
  const mag2 = Math.sqrt(v2.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (mag1 * mag2);
};

const VectorSearchDemo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchItem[]>(sampleData);
  const [isSearching, setIsSearching] = useState(false);
  const [activeStore, setActiveStore] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  // Handle search input changes
  const handleSearchInput = (value: string) => {
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = searchSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setResults(sampleData); // Reset to show all items when search is cleared
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  // Simulate vector search process
  const handleSearch = (term: string = searchTerm) => {
    setIsSearching(true);
    setShowSuggestions(false);

    // Simulate query vector based on search term
    const queryVector = [0.9, 0.85, 0.75];

    // Calculate similarities and sort results
    const searchResults = sampleData
      .map((item) => ({
        ...item,
        similarity: calculateSimilarity(queryVector, item.embedding),
      }))
      .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0));

    // Simulate API delay
    setTimeout(() => {
      setResults(searchResults);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Fashion Store Locator</h2>
        <p className="text-gray-600">
          Find similar styles across our partner stores using AI-powered search
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <div className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-6 py-4 rounded-xl bg-white shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8b6f5f] focus:border-transparent text-gray-800 placeholder-gray-500"
              placeholder="Try searching: summer dress, business casual, vintage..."
            />
            <button
              onClick={() => handleSearch()}
              className="min-w-[120px] py-4 bg-[#8b6f5f] text-white rounded-xl hover:bg-[#8b6f5f]/90 transition-colors font-medium"
            >
              Search
            </button>
          </div>

          {/* Search Suggestions */}
          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute z-50 left-0 right-[132px] mt-2 bg-white rounded-lg shadow-lg border border-gray-200">
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}

          {/* Popular Searches */}
          <div className="mt-3 flex flex-wrap gap-2">
            {searchSuggestions.slice(0, 5).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-sm px-3 py-1.5 rounded-full bg-[#8b6f5f]/10 hover:bg-[#8b6f5f]/20 text-[#8b6f5f] border border-[#8b6f5f]/20 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
          <Map
            stores={sampleData}
            activeResults={results}
            activeStore={activeStore}
            onStoreClick={setActiveStore}
          />
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg backdrop-blur-lg border ${
                  activeStore === result.id
                    ? 'bg-[#8b6f5f]/10 border-[#8b6f5f]'
                    : 'bg-white/10 border-gray-200'
                }`}
                onClick={() => setActiveStore(result.id)}
              >
                <div className="flex items-center gap-6">
                  <div className="w-24 h-32 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={result.imageUrl}
                      alt={result.text}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{result.text}</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      ${result.price}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {result.color && (
                        <span className="text-xs px-2 py-1 bg-[#8b6f5f]/10 text-[#8b6f5f] font-medium rounded-full">
                          {result.color}
                        </span>
                      )}
                      {result.material && (
                        <span className="text-xs px-2 py-1 bg-[#8b6f5f]/10 text-[#8b6f5f] font-medium rounded-full">
                          {result.material}
                        </span>
                      )}
                      {result.occasion && (
                        <span className="text-xs px-2 py-1 bg-[#8b6f5f]/10 text-[#8b6f5f] font-medium rounded-full">
                          {result.occasion}
                        </span>
                      )}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">{result.store.name}</p>
                      <p className="text-gray-500">{result.store.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono bg-[#8b6f5f] text-white px-3 py-1.5 rounded-full">
                      {((result.similarity ?? 0) * 100).toFixed(1)}% match
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VectorSearchDemo;
