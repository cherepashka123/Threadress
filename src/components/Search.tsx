// src/components/Search.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { items, Item } from '@/data/items';
import {
  motion,
  AnimatePresence,
  useAnimation,
  useMotionValue,
  useSpring,
} from 'framer-motion';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      {/* Main cursor (needle) */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <svg
          viewBox="0 0 24 24"
          className="w-full h-full transform rotate-45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d="M12 2L12 22M12 2L8 6M12 2L16 6M12 22L8 18M12 22L16 18"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </svg>
      </motion.div>

      {/* Thread effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-40"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            style={{
              x: 0,
              y: 0,
              scale: 0.5 - i * 0.1,
            }}
            animate={{
              x: [0, Math.random() * 20 - 10],
              y: [0, Math.random() * 20 - 10],
              opacity: [0.8, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: 'reverse',
              delay: i * 0.2,
            }}
          />
        ))}
      </motion.div>

      {/* Tech ring */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-30 border-2 border-white/30 rounded-full mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
    </>
  );
};

const ParticleEffect = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; vx: number; vy: number; life: number }>
  >([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prevParticles) => {
        // Update existing particles
        const updatedParticles = prevParticles
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 1,
          }))
          .filter((particle) => particle.life > 0);

        // Add new particles near mouse position
        if (mousePosition.x !== 0 && mousePosition.y !== 0) {
          const newParticle = {
            x: mousePosition.x,
            y: mousePosition.y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: 50,
          };
          return [...updatedParticles, newParticle];
        }

        return updatedParticles;
      });
    }, 16); // 60fps

    return () => clearInterval(interval);
  }, [mousePosition]);

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          style={{
            x: particle.x,
            y: particle.y,
            opacity: particle.life / 50,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      ))}
    </div>
  );
};

// Wrap the component with dynamic import
const DynamicParticleEffect = dynamic(() => Promise.resolve(ParticleEffect), {
  ssr: false,
});

const GridPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
        linear-gradient(to right, #8b6f5f 1px, transparent 1px),
        linear-gradient(to bottom, #8b6f5f 1px, transparent 1px)
      `,
        backgroundSize: '24px 24px',
      }}
    />
  </div>
);

interface SearchProps {
  isFullPage?: boolean;
}

export default function Search({ isFullPage = false }: SearchProps) {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeView, setActiveView] = useState<'grid' | 'visual'>('grid');
  const [showTrends, setShowTrends] = useState(false);
  const [showStyleMatch, setShowStyleMatch] = useState(false);
  const [activeInsight, setActiveInsight] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(false);
  const [priceRange, setPriceRange] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const hasActiveFilters =
    selectedStyles.length > 0 ||
    selectedSizes.length > 0 ||
    selectedColors.length > 0;

  // Enhanced trending searches with more context
  const trendingSearches = [
    {
      term: 'Sustainable Denim',
      growth: '+127%',
      insight:
        'Eco-friendly denim is trending due to water conservation techniques',
      matchScore: 94,
      aiInsight: 'Perfect match with your style preferences',
      sustainability: 92,
      popularity: ['🔥', '85% match with your previous purchases'],
      recentActivity: '43 new items in the last 24h',
    },
    {
      term: 'Summer Linen',
      growth: '+85%',
      insight: 'Natural fabrics gaining popularity for warm weather',
      matchScore: 88,
      aiInsight: 'Trending in your region',
      sustainability: 95,
      popularity: ['⚡️', '92% of users interested in sustainable fashion'],
      recentActivity: '27 new items in the last 24h',
    },
    {
      term: 'Minimalist Accessories',
      growth: '+62%',
      insight: 'Clean, versatile pieces trending in accessories',
      matchScore: 91,
      aiInsight: 'Matches your aesthetic preferences',
      sustainability: 89,
      popularity: ['📈', 'Growing trend in your area'],
      recentActivity: '35 new items in the last 24h',
    },
  ];

  // Style insights that rotate
  const styleInsights = [
    '👗 Items in your preferred color palette are now in stock',
    '🎯 92% match with your previous style choices',
    '✨ New arrivals from designers you follow',
    '🌟 Trending in your size and preferred fit',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % styleInsights.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Show content when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Enhanced categories with more metadata and AI insights
  const categories = [
    {
      id: 'trending',
      name: 'Trending',
      icon: '✨',
      count: 248,
      growth: '+27%',
      aiInsight: 'High engagement in your region',
    },
    {
      id: 'sustainable',
      name: 'Sustainable',
      icon: '🌱',
      count: 156,
      growth: '+45%',
      aiInsight: 'Matches your eco preferences',
    },
    {
      id: 'local',
      name: 'Local',
      icon: '🏠',
      count: 89,
      growth: '+12%',
      aiInsight: 'Within 5 miles radius',
    },
    {
      id: 'new',
      name: 'New',
      icon: '🆕',
      count: 324,
      growth: '+38%',
      aiInsight: 'Fresh styles this week',
    },
  ];

  // Sample results with more details
  const sampleResults = [
    {
      id: 1,
      title: 'Minimalist Linen Dress',
      designer: 'Eco Studio',
      price: '129.99',
      image: '/images/products/dress-1.jpg',
      match: '98%',
      distance: '0.8',
      tags: ['Sustainable', 'Local', 'New Arrival'],
      sustainability: 95,
      inStock: true,
      colors: ['#F9F9F9', '#000000', '#C4B5A6'],
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      id: 2,
      title: 'Organic Cotton Blouse',
      designer: 'Pure Basics',
      price: '89.99',
      image: '/images/products/blouse-1.jpg',
      match: '95%',
      distance: '1.2',
      tags: ['Organic', 'Bestseller'],
      sustainability: 90,
      inStock: true,
      colors: ['#FFFFFF', '#B8C2CC', '#E2E8F0'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 3,
      title: 'Eco Canvas Tote',
      designer: 'Green Earth',
      price: '$79',
      image: '/images/products/tote-1.jpg',
      match: '93%',
      distance: '1.2 mi',
      tags: ['Sustainable', 'Local'],
      sustainability: 98,
      inStock: true,
      colors: ['#F3F4F6', '#9CA3AF', '#4B5563'],
      sizes: ['One Size'],
    },
  ];

  // Update the type definition
  type SearchResult = {
    id: number;
    title: string;
    designer: string;
    price: string;
    image: string;
    match: string;
    distance: string;
    tags: string[];
    sustainability: number;
    inStock: boolean;
    colors: string[];
    sizes: string[];
  };

  const handleSearchFocus = () => {
    if (!isFullPage) {
      router.push('/smart-search');
      return;
    }
    setSearchFocused(true);
    setShowTrends(true);
  };

  const handleSearch = () => {
    // Implement search logic here
    console.log('Searching...', {
      searchQuery,
      selectedCategory,
      priceRange,
      selectedStyles,
      selectedSizes,
      selectedColors,
    });
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const removeFilter = (filter: string) => {
    setSelectedStyles((prev) => prev.filter((s) => s !== filter));
    setSelectedSizes((prev) => prev.filter((s) => s !== filter));
    setSelectedColors((prev) => prev.filter((c) => c !== filter));
  };

  const clearAllFilters = () => {
    setSelectedStyles([]);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  // If not full page, render enhanced landing page search
  if (!isFullPage) {
    return (
      <div className="relative">
        {/* Animated insights banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-lg px-4 py-3 mb-6"
        >
          <motion.div
            key={activeInsight}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <p className="text-sm text-indigo-600 font-medium">
              {styleInsights[activeInsight]}
            </p>
            <div className="flex gap-1">
              {styleInsights.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    index === activeInsight ? 'bg-indigo-600' : 'bg-indigo-200'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative mb-6"
        >
          <div className="relative flex items-center justify-center">
            <motion.div
              className="absolute -inset-px rounded-lg bg-gradient-to-r from-indigo-200 to-violet-200 opacity-0"
              animate={{
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
            <div className="relative flex w-full bg-white rounded-lg shadow-sm border border-gray-200 focus-within:border-indigo-300 transition-colors">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                placeholder="Search styles, designers, or trends..."
                className="w-full pl-12 pr-4 py-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-lg"
              />
            </div>
          </div>
        </motion.div>

        {/* Trending searches */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-medium text-gray-500">Trending Now</h3>
          <div className="grid grid-cols-2 gap-3">
            {trendingSearches.map((trend, index) => (
              <motion.button
                key={trend.term}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                onClick={() => setSearchQuery(trend.term)}
                className="flex flex-col p-3 hover:bg-gray-50 rounded-lg transition-colors group text-left bg-white border border-gray-100"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-700 group-hover:text-indigo-600 font-medium">
                    {trend.term}
                  </span>
                  <span className="text-green-500 text-sm font-medium">
                    {trend.growth}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{trend.insight}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-indigo-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${trend.matchScore}%` }}
                      transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {trend.matchScore}% match
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Full page search component
  return (
    <div className={`w-full ${isFullPage ? 'min-h-screen py-24' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced search interface */}
        <div className="relative">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Main search input */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  placeholder="Describe what you're looking for..."
                  className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm z-20"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-30">
                  <button
                    onClick={() => setSearchQuery('')}
                    className={`p-1.5 text-neutral-400 hover:text-neutral-600 transition-colors ${
                      !searchQuery ? 'hidden' : ''
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <div className="h-6 w-px bg-neutral-200" />
                  <button
                    onClick={handleSearch}
                    className="p-1.5 text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced filters */}
            <div className="flex gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm"
              >
                <option value="">All Categories</option>
                <option value="dresses">Dresses</option>
                <option value="tops">Tops</option>
                <option value="bottoms">Bottoms</option>
                <option value="outerwear">Outerwear</option>
                <option value="accessories">Accessories</option>
              </select>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-2 bg-white border border-neutral-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm"
              >
                <option value="">Any Price</option>
                <option value="0-50">Under $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200+">$200+</option>
              </select>

              <button
                onClick={toggleAdvancedFilters}
                className="px-4 py-2 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-all duration-200 shadow-sm flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                <span>More Filters</span>
              </button>
            </div>
          </div>

          {/* Advanced filters panel */}
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Style preferences */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-900 mb-3">
                    Style
                  </h3>
                  <div className="space-y-2">
                    {[
                      'Casual',
                      'Formal',
                      'Bohemian',
                      'Minimalist',
                      'Vintage',
                    ].map((style) => (
                      <label key={style} className="flex items-center">
                        <input
                          type="checkbox"
                          className="form-checkbox text-indigo-600 rounded"
                          checked={selectedStyles.includes(style)}
                          onChange={() => toggleStyle(style)}
                        />
                        <span className="ml-2 text-sm text-neutral-600">
                          {style}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Size filter */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-900 mb-3">
                    Size
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                          selectedSizes.includes(size)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color filter */}
                <div>
                  <h3 className="text-sm font-medium text-neutral-900 mb-3">
                    Color
                  </h3>
                  <div className="grid grid-cols-6 gap-2">
                    {[
                      { name: 'Black', color: '#000000' },
                      { name: 'White', color: '#FFFFFF' },
                      { name: 'Red', color: '#EF4444' },
                      { name: 'Blue', color: '#3B82F6' },
                      { name: 'Green', color: '#10B981' },
                      { name: 'Yellow', color: '#F59E0B' },
                    ].map((colorOption) => (
                      <button
                        key={colorOption.name}
                        onClick={() => toggleColor(colorOption.name)}
                        className="relative w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        style={{ backgroundColor: colorOption.color }}
                        title={colorOption.name}
                      >
                        {selectedColors.includes(colorOption.name) && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke={
                                colorOption.name === 'White'
                                  ? '#000000'
                                  : '#FFFFFF'
                              }
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Active filters */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {[...selectedStyles, ...selectedSizes, ...selectedColors].map(
                (filter) => (
                  <span
                    key={filter}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                  >
                    {filter}
                    <button
                      onClick={() => removeFilter(filter)}
                      className="ml-2 text-indigo-600 hover:text-indigo-700"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                )
              )}
              <button
                onClick={clearAllFilters}
                className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </div>

        {/* Results grid with enhanced item cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleResults.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Image container */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={result.image}
                  alt={result.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Quick actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white rounded-full shadow-sm hover:shadow text-gray-600 hover:text-indigo-600 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 bg-white rounded-full shadow-sm hover:shadow text-gray-600 hover:text-indigo-600 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </button>
                </div>

                {/* Sustainability badge */}
                {result.sustainability && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Eco-friendly
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-medium text-neutral-900 mb-1 line-clamp-1">
                  {result.title}
                </h3>
                <p className="text-sm text-neutral-500 mb-2 line-clamp-1">
                  {result.designer}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-neutral-900">
                    ${result.price}
                  </span>
                  <div className="flex items-center text-sm text-neutral-500">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {result.distance}mi
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dynamic effects */}
      <CustomCursor />
      <DynamicParticleEffect />
    </div>
  );
}
