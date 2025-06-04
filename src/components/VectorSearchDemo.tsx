'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Image from 'next/image';
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

// Popular search suggestions (keep these aligned with actual items)
const searchSuggestions = [
  'Summer dress',
  'Evening wear',
  'Business casual',
  'Cocktail dress',
  'Casual basics',
  'Work attire',
  'Party outfit',
  'Weekend style',
  'Date night look',
];

// Sample data with better variety and matching descriptions
const sampleData: SearchItem[] = [
  {
    id: 1,
    text: 'Floral Summer Midi Dress',
    embedding: [0.9, 0.8, 0.7],
    category: 'Dresses',
    price: 165.99,
    imageUrl: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217',
    color: 'Multicolor Floral',
    material: 'Cotton Blend',
    occasion: 'Summer, Casual',
    store: {
      name: 'Summer Boutique',
      address: '123 Madison Ave, Upper East Side',
      lat: 40.7736,
      lng: -73.9566,
    },
  },
  {
    id: 2,
    text: 'Sequin Cocktail Dress',
    embedding: [0.85, 0.75, 0.8],
    category: 'Evening Wear',
    price: 285.0,
    imageUrl: 'https://images.unsplash.com/photo-1618436917352-cd3d11ea4d15',
    color: 'Midnight Blue',
    material: 'Sequin & Chiffon',
    occasion: 'Cocktail, Evening',
    store: {
      name: 'Evening Elegance',
      address: '456 Fifth Ave, Midtown',
      lat: 40.7508,
      lng: -73.9772,
    },
  },
  {
    id: 3,
    text: 'Linen Summer Maxi Dress',
    embedding: [0.8, 0.9, 0.6],
    category: 'Dresses',
    price: 145.0,
    imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
    color: 'Sand Beige',
    material: 'Linen',
    occasion: 'Summer, Beach',
    store: {
      name: 'Coastal Style',
      address: '789 Columbus Ave, Upper West Side',
      lat: 40.7829,
      lng: -73.9654,
    },
  },
  {
    id: 4,
    text: 'Satin Evening Gown',
    embedding: [0.7, 0.8, 0.9],
    category: 'Evening Wear',
    price: 325.0,
    imageUrl: 'https://images.unsplash.com/photo-1615310748170-4d7adb9d8e9a',
    color: 'Emerald Green',
    material: 'Silk Satin',
    occasion: 'Formal, Evening',
    store: {
      name: 'Formal Affair',
      address: '321 Park Ave, Midtown',
      lat: 40.7648,
      lng: -74.0012,
    },
  },
  {
    id: 5,
    text: 'Cotton Sundress',
    embedding: [0.82, 0.78, 0.75],
    category: 'Dresses',
    price: 125.0,
    imageUrl: 'https://images.unsplash.com/photo-1562137369-1a1a0bc66744',
    color: 'Yellow Floral',
    material: 'Cotton',
    occasion: 'Summer, Casual',
    store: {
      name: 'Sunny Day Styles',
      address: '567 Elizabeth St, Nolita',
      lat: 40.7225,
      lng: -73.9987,
    },
  },
  {
    id: 6,
    text: 'Velvet Cocktail Dress',
    embedding: [0.88, 0.82, 0.71],
    category: 'Evening Wear',
    price: 245.0,
    imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956',
    color: 'Deep Burgundy',
    material: 'Velvet',
    occasion: 'Cocktail, Party',
    store: {
      name: 'Party Perfect',
      address: '789 W 23rd St, Chelsea',
      lat: 40.7466,
      lng: -74.0046,
    },
  },
  {
    id: 7,
    text: 'Business Blazer Dress',
    embedding: [0.85, 0.79, 0.73],
    category: 'Work Wear',
    price: 195.0,
    imageUrl: 'https://images.unsplash.com/photo-1548454782-15b189d129ab',
    color: 'Black',
    material: 'Stretch Wool Blend',
    occasion: 'Work, Professional',
    store: {
      name: 'Professional Attire',
      address: '123 7th Ave, Chelsea',
      lat: 40.7352,
      lng: -73.9999,
    },
  },
  {
    id: 8,
    text: 'Printed Summer Wrap Dress',
    embedding: [0.87, 0.81, 0.76],
    category: 'Dresses',
    price: 155.0,
    imageUrl: '/summer-dress-4.jpg', // Wrap dress image
    color: 'Tropical Print',
    material: 'Rayon',
    occasion: 'Summer, Casual',
    store: {
      name: 'Wrap & Roll',
      address: '456 E 9th St, East Village',
      lat: 40.7291,
      lng: -73.9845,
    },
  },
  {
    id: 9,
    text: 'Leather Mini Skirt',
    embedding: [0.7, 0.8, 0.9],
    category: 'Skirts',
    price: 165.0,
    imageUrl: '/skirt1.jpg',
    color: 'Black',
    material: 'Vegan Leather',
    occasion: 'Night Out',
    store: {
      name: 'Urban Style',
      address: '321 Park Ave, Midtown',
      lat: 40.7648,
      lng: -74.0012,
    },
  },
  {
    id: 10,
    text: 'Satin Blouse',
    embedding: [0.82, 0.78, 0.75],
    category: 'Tops',
    price: 125.0,
    imageUrl: '/blouse1.jpg',
    color: 'Ivory',
    material: 'Satin',
    occasion: 'Work',
    store: {
      name: 'Fashion Forward',
      address: '567 Elizabeth St, Nolita',
      lat: 40.7225,
      lng: -73.9987,
    },
  },
  {
    id: 11,
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
    id: 12,
    text: 'Leather & Canvas Work Tote',
    embedding: [0.85, 0.79, 0.73],
    category: 'Accessories',
    price: 195.0,
    imageUrl: 'https://images.unsplash.com/photo-1591561954557-26941169b49e',
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
    id: 13,
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
    id: 14,
    text: 'Merino Wool Wrap Coat',
    embedding: [0.91, 0.85, 0.78],
    category: 'Outerwear',
    price: 495.0,
    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3',
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
    id: 15,
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
    id: 16,
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
    id: 17,
    text: 'Vintage Silk Scarf',
    embedding: [0.89, 0.83, 0.81],
    category: 'Accessories',
    price: 295.0,
    imageUrl: 'https://images.unsplash.com/photo-1601374192913-ac3c05b73a56',
    color: 'Navy & Gold',
    material: 'Silk Twill',
    occasion: 'All Occasions',
    store: {
      name: 'Vintage Accessories',
      address: '890 Madison Ave, Upper East',
      lat: 40.7739,
      lng: -73.9653,
    },
  },
  {
    id: 18,
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
    id: 19,
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
    id: 20,
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
    id: 21,
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
    id: 22,
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
    id: 23,
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
    id: 24,
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
    id: 25,
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
    id: 26,
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
    id: 27,
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
    id: 28,
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
    id: 29,
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
    id: 30,
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
    id: 31,
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
    id: 32,
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
    id: 33,
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

  // Update the handleSearch function to better match search terms
  const handleSearch = (term: string = searchTerm) => {
    setIsSearching(true);
    setShowSuggestions(false);

    // Create different vectors based on search terms
    let queryVector;
    const termLower = term.toLowerCase();

    if (termLower.includes('summer') || termLower.includes('casual')) {
      queryVector = [0.9, 0.8, 0.6]; // Summer/casual vector
    } else if (
      termLower.includes('evening') ||
      termLower.includes('cocktail')
    ) {
      queryVector = [0.7, 0.9, 0.9]; // Evening/cocktail vector
    } else if (termLower.includes('work') || termLower.includes('business')) {
      queryVector = [0.8, 0.7, 0.9]; // Work/business vector
    } else {
      queryVector = [0.85, 0.85, 0.85]; // Default vector
    }

    // Calculate similarities and filter based on search term
    const searchResults = sampleData
      .map((item) => ({
        ...item,
        similarity: calculateSimilarity(queryVector, item.embedding),
      }))
      .filter((item) => {
        const searchableText =
          `${item.text} ${item.occasion} ${item.category}`.toLowerCase();
        return searchableText.includes(termLower);
      })
      .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0));

    setTimeout(() => {
      setResults(searchResults.length > 0 ? searchResults : sampleData);
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="relative mb-12">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-6 py-4 rounded-xl bg-white border border-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-neutral-900 placeholder-neutral-400"
            placeholder="Try searching: summer dress, business casual, vintage..."
          />
          <motion.button
            onClick={() => handleSearch()}
            className="min-w-[120px] py-4 bg-neutral-900 text-white/95 rounded-xl font-light relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10">Search</span>
          </motion.button>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-50 left-0 right-[132px] mt-2 bg-white rounded-xl border border-neutral-100">
            {filteredSuggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                className="px-4 py-2 hover:bg-neutral-50 cursor-pointer transition-colors text-neutral-600"
                whileHover={{ x: 4 }}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </motion.div>
            ))}
          </div>
        )}

        {/* Popular Searches */}
        <div className="mt-3 flex flex-wrap gap-2">
          {searchSuggestions.slice(0, 5).map((suggestion, index) => (
            <motion.button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="text-sm px-3 py-1.5 rounded-full bg-white border border-neutral-100 text-neutral-600 hover:bg-neutral-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {suggestion}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Map */}
        <motion.div
          className="h-[400px] rounded-xl overflow-hidden bg-white border border-neutral-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Map
            stores={sampleData}
            activeResults={results}
            activeStore={activeStore}
            onStoreClick={setActiveStore}
          />
        </motion.div>

        {/* Results */}
        <div className="space-y-4">
          <AnimatePresence>
            {results.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl border ${
                  activeStore === result.id
                    ? 'bg-white border-indigo-500/20'
                    : 'bg-white border-neutral-100'
                }`}
                onClick={() => setActiveStore(result.id)}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-6">
                  <div className="w-24 h-32 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={result.imageUrl}
                      alt={result.text}
                      width={96}
                      height={128}
                      className="w-full h-full object-cover"
                      unoptimized
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99';
                      }}
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
