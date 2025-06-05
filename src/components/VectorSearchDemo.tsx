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
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
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
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa',
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
    imageUrl: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f',
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
  const [results, setResults] = useState<SearchItem[]>(sampleData.slice(0, 6)); // Show initial items
  const [isSearching, setIsSearching] = useState(false);
  const [activeStore, setActiveStore] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  // Handle search input changes
  const handleSearchInput = (value: string) => {
    setSearchTerm(value);

    // Clear results if search is empty
    if (value.length === 0) {
      setResults(sampleData.slice(0, 6)); // Show initial items when search is cleared
      setShowSuggestions(false);
      return;
    }

    // Show suggestions for non-empty search
    const filtered = searchSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);

    // Perform instant search as user types
    const termLower = value.toLowerCase();
    const searchResults = sampleData
      .filter((item) => {
        const searchableText =
          `${item.text} ${item.color || ''} ${item.material || ''} ${item.occasion || ''} ${item.category} ${item.store.name}`.toLowerCase();
        return searchableText.includes(termLower);
      })
      .map((item) => ({
        ...item,
        similarity: calculateRelevanceScore(termLower, item),
      }))
      .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0));

    setResults(
      searchResults.length > 0 ? searchResults : sampleData.slice(0, 6)
    );
  };

  // Enhanced relevance scoring
  const calculateRelevanceScore = (
    searchTerm: string,
    item: SearchItem
  ): number => {
    const terms = searchTerm.split(' ').filter((term) => term.length > 0);
    let score = 0;

    terms.forEach((term) => {
      // Check exact matches in different fields with different weights
      if (item.text.toLowerCase().includes(term)) score += 0.5;
      if (item.category.toLowerCase() === term) score += 0.3;
      if (item.color?.toLowerCase() === term) score += 0.2;
      if (item.material?.toLowerCase() === term) score += 0.2;
      if (item.occasion?.toLowerCase().includes(term)) score += 0.2;

      // Calculate embedding similarity
      const termVector = getTermVector(term);
      score += calculateSimilarity(termVector, item.embedding) * 0.4;
    });

    return Math.min(score, 1); // Normalize to 0-1 range
  };

  // Get vector representation for search terms
  const getTermVector = (term: string): number[] => {
    const termLower = term.toLowerCase();
    if (termLower.includes('summer') || termLower.includes('casual')) {
      return [0.9, 0.8, 0.6];
    } else if (
      termLower.includes('evening') ||
      termLower.includes('cocktail')
    ) {
      return [0.7, 0.9, 0.9];
    } else if (termLower.includes('work') || termLower.includes('business')) {
      return [0.8, 0.7, 0.9];
    }
    return [0.85, 0.85, 0.85];
  };

  // Handle suggestion click with immediate search
  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setIsSearching(true);

    // Simulate AI processing
    setTimeout(() => {
      const results = sampleData
        .filter((item) => {
          const searchableText =
            `${item.text} ${item.color || ''} ${item.material || ''} ${item.occasion || ''} ${item.category} ${item.store.name}`.toLowerCase();
          return searchableText.includes(suggestion.toLowerCase());
        })
        .map((item) => ({
          ...item,
          similarity: calculateRelevanceScore(suggestion.toLowerCase(), item),
        }))
        .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0));

      setResults(results.length > 0 ? results : sampleData.slice(0, 6));
      setIsSearching(false);
    }, 800);
  };

  // Handle search button click
  const handleSearch = () => {
    if (!searchTerm) return;

    setIsSearching(true);
    setShowSuggestions(false);

    // Simulate AI processing
    setTimeout(() => {
      const results = sampleData
        .filter((item) => {
          const searchableText =
            `${item.text} ${item.color || ''} ${item.material || ''} ${item.occasion || ''} ${item.category} ${item.store.name}`.toLowerCase();
          return searchableText.includes(searchTerm.toLowerCase());
        })
        .map((item) => ({
          ...item,
          similarity: calculateRelevanceScore(searchTerm.toLowerCase(), item),
        }))
        .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0));

      setResults(results.length > 0 ? results : sampleData.slice(0, 6));
      setIsSearching(false);
    }, 800);
  };

  // Handle keyboard events for search
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Enhanced Search Section */}
      <div className="relative mb-12">
        {/* Tech-inspired background elements */}
        <motion.div
          className="absolute inset-0 -z-10"
          initial={false}
          animate={{
            background: [
              'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)',
              'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.03) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Search Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-green-500"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <span className="text-sm text-gray-600">AI Engine Active</span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-indigo-600">
                {sampleData.length}
              </span>{' '}
              items indexed
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-indigo-600">12</span> boutiques
              connected
            </div>
          </div>
          <motion.div
            className="text-sm text-gray-600 flex items-center gap-2"
            animate={{
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <span className="w-1 h-1 rounded-full bg-indigo-600" />
            Last updated 2 minutes ago
          </motion.div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <motion.div
              className="absolute -inset-1 rounded-xl bg-gradient-to-r from-violet-500/20 to-indigo-500/20 blur opacity-0 transition-opacity duration-300"
              animate={{
                opacity: searchTerm ? 0.5 : 0,
              }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-6 py-4 rounded-xl bg-white border border-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-neutral-900 placeholder-neutral-400"
              placeholder="Try searching: summer dress, business casual, vintage..."
            />

            {/* Enhanced Search Suggestions */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl border border-neutral-100 shadow-lg overflow-hidden"
              >
                {filteredSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={`filtered-suggestion-${suggestion.toLowerCase().replace(/\s+/g, '-')}-${index}`}
                    className="group px-4 py-3 hover:bg-neutral-50 cursor-pointer transition-colors border-b border-neutral-100 last:border-0"
                    whileHover={{ x: 4 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600 group-hover:text-neutral-900 transition-colors">
                        {suggestion}
                      </span>
                      <motion.div
                        className="text-xs text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        animate={{ x: [0, 3, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        Try this →
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
          <motion.button
            onClick={() => handleSearch()}
            className="min-w-[120px] py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white/95 rounded-xl font-light relative overflow-hidden group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-violet-400/30 via-indigo-400/30 to-violet-400/30 bg-[length:200%_100%]"
              animate={{
                backgroundPosition: ['200% 0', '-200% 0'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <span className="relative z-10">Search</span>
          </motion.button>
        </div>

        {/* Popular Searches with enhanced styling */}
        <div className="mt-4">
          <div className="text-xs text-gray-500 mb-2">Popular Searches</div>
          <div className="flex flex-wrap gap-2">
            {searchSuggestions.slice(0, 5).map((suggestion, index) => (
              <motion.button
                key={`popular-suggestion-${suggestion.toLowerCase().replace(/\s+/g, '-')}-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-sm px-3 py-1.5 rounded-full bg-white border border-neutral-100 text-neutral-600 hover:border-indigo-500/20 hover:bg-indigo-50/50 transition-colors relative group overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-indigo-500/5"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{
                    duration: 0.6,
                    ease: 'easeInOut',
                  }}
                />
                <span className="relative">{suggestion}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Map with enhanced styling */}
        <motion.div
          className="relative h-[400px] rounded-xl overflow-hidden bg-white border border-neutral-100"
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

          {/* Map Stats Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 border border-white/40 shadow-sm"
          >
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-green-500" />
                <span>Real-time inventory</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-indigo-500" />
                <span>AI-powered matching</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Results with enhanced styling */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isSearching ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-12"
              >
                <div className="text-center">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-violet-500/20 to-indigo-500/20 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <svg
                      className="w-8 h-8 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </motion.div>
                  <p className="text-gray-600">Searching with AI...</p>
                </div>
              </motion.div>
            ) : (
              results.map((result, index) => (
                <motion.div
                  key={`search-result-${result.id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl border ${
                    activeStore === result.id
                      ? 'bg-white border-indigo-500/20 shadow-lg'
                      : 'bg-white border-neutral-100 hover:border-indigo-500/20'
                  } transition-all duration-300 cursor-pointer relative group`}
                  onClick={() => setActiveStore(result.id)}
                  whileHover={{ y: -4 }}
                >
                  {/* Tech lines effect */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={false}
                    animate={{
                      background: [
                        'linear-gradient(to right, rgba(99,102,241,0.03) 0%, transparent 100%)',
                        'linear-gradient(to right, transparent 0%, rgba(99,102,241,0.03) 50%, transparent 100%)',
                        'linear-gradient(to right, transparent 0%, rgba(99,102,241,0.03) 100%)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />

                  <div className="flex items-center gap-6">
                    <motion.div
                      className="relative w-24 h-32 rounded-lg overflow-hidden bg-gray-100 group-hover:shadow-lg transition-shadow duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
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
                      <motion.div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-indigo-600 transition-all duration-300">
                          {result.text}
                        </h3>
                        <motion.span
                          className="text-sm font-mono bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-3 py-1.5 rounded-full"
                          whileHover={{ scale: 1.05 }}
                        >
                          {((result.similarity ?? 0) * 100).toFixed(1)}% match
                        </motion.span>
                      </div>
                      <p className="text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-indigo-500 mb-3">
                        ${result.price.toFixed(2)}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {result.color && (
                          <span className="text-xs px-2 py-1 bg-indigo-500/10 text-indigo-600 font-medium rounded-full">
                            {result.color}
                          </span>
                        )}
                        {result.material && (
                          <span className="text-xs px-2 py-1 bg-indigo-500/10 text-indigo-600 font-medium rounded-full">
                            {result.material}
                          </span>
                        )}
                        {result.occasion && (
                          <span className="text-xs px-2 py-1 bg-indigo-500/10 text-indigo-600 font-medium rounded-full">
                            {result.occasion}
                          </span>
                        )}
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">
                          {result.store.name}
                        </p>
                        <p className="text-gray-500">{result.store.address}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default VectorSearchDemo;
