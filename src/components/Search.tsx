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
      title: 'Minimalist Summer Dress',
      designer: 'Pure Aesthetics',
      price: '$129',
      match: '98%',
      distance: '0.5 mi',
      tags: ['Trending', 'New'],
      sustainability: 92,
      inStock: true,
      colors: ['#FFFFFF', '#D1D5DB', '#9CA3AF'],
      sizes: ['XS', 'S', 'M', 'L'],
    },
    {
      id: 2,
      title: 'Essential Linen Blazer',
      designer: 'Modern Basics',
      price: '$189',
      match: '95%',
      distance: '0.8 mi',
      tags: ['Sustainable'],
      sustainability: 96,
      inStock: true,
      colors: ['#E5E7EB', '#1F2937', '#4B5563'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    {
      id: 3,
      title: 'Eco Canvas Tote',
      designer: 'Green Earth',
      price: '$79',
      match: '93%',
      distance: '1.2 mi',
      tags: ['Sustainable', 'Local'],
      sustainability: 98,
      inStock: true,
      colors: ['#F3F4F6', '#9CA3AF', '#4B5563'],
      sizes: ['One Size'],
    },
  ];

  const handleSearchFocus = () => {
    if (!isFullPage) {
      router.push('/smart-search');
      return;
    }
    setSearchFocused(true);
    setShowTrends(true);
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
    <div className="relative min-h-[80vh] bg-white">
      {/* Refined background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(99,102,241,0.02)_25%,transparent_25%,transparent_50%,rgba(99,102,241,0.02)_50%,rgba(99,102,241,0.02)_75%,transparent_75%,transparent)] bg-[length:48px_48px]" />
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        {/* Enhanced header with style insights */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative inline-block mb-4"
          >
            <motion.div
              className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-200 to-violet-200 opacity-75 blur"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
            <h2 className="relative text-4xl font-light tracking-tight text-gray-900">
              Discover Style
            </h2>
          </motion.div>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-4">
            Find unique pieces that match your aesthetic perfectly
          </p>

          {/* Rotating style insights */}
          <motion.div
            key={activeInsight}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full inline-block"
          >
            {styleInsights[activeInsight]}
          </motion.div>
        </div>

        {/* Main search container with improved symmetry */}
        <div className="max-w-3xl mx-auto">
          {/* Search bar with integrated trending and style matching */}
          <div className="relative mb-12">
            <div className="relative flex items-center justify-center">
              <motion.div
                className="absolute -inset-px rounded-xl bg-gradient-to-r from-indigo-200 to-violet-200 opacity-0"
                animate={{
                  opacity: searchFocused ? 0.5 : 0,
                }}
                transition={{ duration: 0.2 }}
              />
              <div className="relative flex w-full bg-white rounded-xl shadow-sm border border-gray-200 focus-within:border-indigo-300 transition-colors">
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
                  onFocus={() => {
                    setSearchFocused(true);
                    setShowTrends(true);
                  }}
                  onBlur={() => {
                    setSearchFocused(false);
                    setTimeout(() => setShowTrends(false), 200);
                  }}
                  placeholder="Search styles, designers, or trends..."
                  className="w-full pl-12 pr-24 py-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none text-lg"
                />

                {/* Style match button */}
                <button
                  onClick={() => setShowStyleMatch(!showStyleMatch)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <span>Style Match</span>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                </button>
              </div>
            </div>

            {/* Enhanced trending searches dropdown */}
            <AnimatePresence>
              {showTrends && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Trending Now
                      </h3>
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-2 h-2 rounded-full bg-green-400"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                        <span className="text-xs text-gray-400">
                          Live updates
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {trendingSearches.map((trend, index) => (
                        <motion.button
                          key={trend.term}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.1 }}
                          onClick={() => setSearchQuery(trend.term)}
                          className="flex flex-col p-4 hover:bg-gray-50 rounded-xl transition-colors group text-left bg-white border border-gray-100 relative overflow-hidden"
                        >
                          {/* Background gradient animation */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-violet-50/50 to-indigo-50/50 opacity-0"
                            initial={false}
                            animate={{
                              opacity: [0, 0.5, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              repeatType: 'reverse',
                            }}
                          />

                          {/* Content */}
                          <div className="relative">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-900 font-medium group-hover:text-indigo-600 transition-colors">
                                  {trend.term}
                                </span>
                                <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded-full">
                                  {trend.growth}
                                </span>
                              </div>
                              <motion.div
                                className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center"
                                whileHover={{ scale: 1.1 }}
                              >
                                <span className="text-lg">
                                  {trend.popularity[0]}
                                </span>
                              </motion.div>
                            </div>

                            <div className="space-y-2">
                              <p className="text-sm text-gray-600">
                                {trend.insight}
                              </p>

                              {/* AI Insight */}
                              <div className="flex items-center gap-2 text-xs text-indigo-600">
                                <svg
                                  className="w-4 h-4"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                  />
                                </svg>
                                <span>{trend.aiInsight}</span>
                              </div>

                              {/* Metrics */}
                              <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="bg-gray-50 rounded-lg p-2">
                                  <div className="text-xs text-gray-500 mb-1">
                                    Sustainability
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                      <motion.div
                                        className="h-full bg-green-500"
                                        initial={{ width: 0 }}
                                        animate={{
                                          width: `${trend.sustainability}%`,
                                        }}
                                        transition={{
                                          duration: 1,
                                          delay: index * 0.2,
                                        }}
                                      />
                                    </div>
                                    <span className="text-xs font-medium text-green-600">
                                      {trend.sustainability}%
                                    </span>
                                  </div>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-2">
                                  <div className="text-xs text-gray-500 mb-1">
                                    Match Score
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                      <motion.div
                                        className="h-full bg-indigo-500"
                                        initial={{ width: 0 }}
                                        animate={{
                                          width: `${trend.matchScore}%`,
                                        }}
                                        transition={{
                                          duration: 1,
                                          delay: index * 0.2,
                                        }}
                                      />
                                    </div>
                                    <span className="text-xs font-medium text-indigo-600">
                                      {trend.matchScore}%
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Recent Activity */}
                              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                <motion.div
                                  className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                                  animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.5, 1, 0.5],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    delay: index * 0.3,
                                  }}
                                />
                                <span>{trend.recentActivity}</span>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>

                    {/* Quick filters */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        Quick Filters:
                      </span>
                      {[
                        'New Arrivals',
                        'Local Stock',
                        'Sale Items',
                        'Sustainable',
                      ].map((filter, index) => (
                        <motion.button
                          key={filter}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          className="px-3 py-1 text-xs rounded-full border border-gray-200 text-gray-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        >
                          {filter}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Style match overlay */}
            <AnimatePresence>
              {showStyleMatch && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-500">
                        Style Match
                      </h3>
                      <button
                        onClick={() => setShowStyleMatch(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Your Style Profile
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Minimalist</span>
                            <span className="text-indigo-600">85%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Sustainable</span>
                            <span className="text-indigo-600">92%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Casual Chic</span>
                            <span className="text-indigo-600">78%</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Preferred Details
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 bg-white rounded text-xs text-gray-600">
                            Natural Fabrics
                          </span>
                          <span className="px-2 py-1 bg-white rounded text-xs text-gray-600">
                            Neutral Colors
                          </span>
                          <span className="px-2 py-1 bg-white rounded text-xs text-gray-600">
                            Classic Cuts
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-indigo-50 rounded-lg p-3">
                      <div className="text-sm font-medium text-indigo-600 mb-2">
                        AI Recommendations
                      </div>
                      <p className="text-sm text-gray-600">
                        Based on your style profile, we recommend exploring:
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white rounded-full text-xs text-indigo-600 border border-indigo-100">
                          Linen Blazers
                        </span>
                        <span className="px-3 py-1 bg-white rounded-full text-xs text-indigo-600 border border-indigo-100">
                          Organic Cotton Basics
                        </span>
                        <span className="px-3 py-1 bg-white rounded-full text-xs text-indigo-600 border border-indigo-100">
                          Eco Denim
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Enhanced category filters */}
          <div className="flex flex-col items-center space-y-8 mb-12">
            <div className="flex items-center justify-center gap-4 w-full">
              <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                <button
                  onClick={() => setActiveView('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    activeView === 'grid'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-400 hover:text-gray-600'
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
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setActiveView('visual')}
                  className={`p-2 rounded-md transition-colors ${
                    activeView === 'visual'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-400 hover:text-gray-600'
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() =>
                    setSelectedCategory(
                      category.id === selectedCategory ? '' : category.id
                    )
                  }
                  className={`
                    group relative px-4 py-2 rounded-lg text-sm transition-all
                    ${
                      category.id === selectedCategory
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="text-xs opacity-75">
                      ({category.count})
                    </span>
                  </span>

                  {/* AI Insight Tooltip */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap"
                  >
                    {category.aiInsight}
                    <svg
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 text-gray-900"
                      viewBox="0 0 8 8"
                    >
                      <path fill="currentColor" d="M4 8L0 0h8z" />
                    </svg>
                  </motion.div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Results grid with improved symmetry */}
          <AnimatePresence>
            {(searchQuery || selectedCategory) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`
                  ${
                    activeView === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'
                      : 'columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 sm:gap-6'
                  }
                `}
              >
                {sampleResults.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      group cursor-pointer
                      ${activeView === 'grid' ? '' : 'mb-6 break-inside-avoid'}
                    `}
                  >
                    <div className="relative bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-200">
                      {/* Image placeholder */}
                      <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-violet-50"
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 3, 0],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            repeatType: 'reverse',
                          }}
                        />

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
                        <div className="absolute bottom-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-green-600">
                          {result.sustainability}% Sustainable
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="mb-3">
                          <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {result.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {result.designer}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-lg font-medium text-indigo-600">
                            {result.price}
                          </span>
                          <span className="text-sm text-gray-500">
                            {result.distance}
                          </span>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-center gap-2">
                            {result.colors.map((color, i) => (
                              <button
                                key={i}
                                className="w-6 h-6 rounded-full border-2 border-white ring-2 ring-transparent hover:ring-gray-200 transition-all"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className="flex items-center justify-center gap-2">
                            {result.sizes.map((size) => (
                              <button
                                key={size}
                                className="min-w-[2.5rem] px-2 py-1 text-xs rounded border border-gray-200 text-gray-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                              >
                                {size}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Dynamic effects */}
      <CustomCursor />
      <DynamicParticleEffect />
    </div>
  );
}
