'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Types
interface SearchResult {
  product_id: string;
  title: string;
  price: number;
  color: string;
  material: string;
  sizes: string;
  image_path: string;
  score: number;
  score_text: number;
  score_img: number;
  score_kw: number;
  why_chips: string[];
}

interface SearchResponse {
  results: SearchResult[];
  total_time: number;
  num_results: number;
}

interface EvaluationMetrics {
  hit_at_1: number;
  recall_at_10: number;
  ndcg_at_10: number;
  zero_result_rate: number;
  total_queries: number;
}

// API Configuration
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Example queries for quick testing
const EXAMPLE_QUERIES = [
  'light blue tweed blazer',
  'long violet flowy dress',
  'black satin slip dress',
  'oversized camel coat',
  'cropped denim jacket',
  'pastel wool jacket',
  'vintage leather jacket',
  'maxi dress floral print',
  'cashmere sweater',
  'silk scarf printed',
];

// Color families for filtering
const COLOR_FAMILIES = [
  'black',
  'white',
  'red',
  'blue',
  'green',
  'yellow',
  'pink',
  'purple',
  'brown',
  'grey',
  'beige',
  'navy',
  'coral',
  'ivory',
  'gold',
  'silver',
];

// Material options for filtering
const MATERIALS = [
  'cotton',
  'denim',
  'leather',
  'silk',
  'wool',
  'cashmere',
  'linen',
  'polyester',
  'spandex',
  'satin',
  'chiffon',
  'velvet',
  'tweed',
];

export default function LabPage() {
  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTime, setSearchTime] = useState(0);

  // Weight controls
  const [weights, setWeights] = useState({
    text: 0.5,
    image: 0.3,
    keyword: 0.2,
  });
  const [rerank, setRerank] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    color: '',
    material: '',
    priceRange: [0, 500],
    size: '',
  });

  // Admin state
  const [backendHealth, setBackendHealth] = useState<
    'unknown' | 'healthy' | 'unhealthy'
  >('unknown');
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalResults, setEvalResults] = useState<EvaluationMetrics | null>(
    null
  );
  const [evalLoading, setEvalLoading] = useState(false);

  // Debug state
  const [showDebug, setShowDebug] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SearchResult | null>(
    null
  );

  // Check backend health
  const checkBackendHealth = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      const data = await response.json();
      setBackendHealth(data.status === 'healthy' ? 'healthy' : 'unhealthy');
    } catch (error) {
      setBackendHealth('unhealthy');
    }
  }, []);

  // Debounced search
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchQuery: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (searchQuery.trim()) {
            performSearch(searchQuery);
          }
        }, 300);
      };
    })(),
    [weights, rerank]
  );

  // Perform search
  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        k: '20',
        w_text: weights.text.toString(),
        w_img: weights.image.toString(),
        w_kw: weights.keyword.toString(),
        rerank: rerank.toString(),
      });

      const response = await fetch(`${API_BASE}/search?${params}`);
      const data: SearchResponse = await response.json();

      setResults(data.results);
      setSearchTime(data.total_time);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter results
  const filteredResults = useMemo(() => {
    return results.filter((result) => {
      if (
        filters.color &&
        !result.color.toLowerCase().includes(filters.color.toLowerCase())
      ) {
        return false;
      }
      if (
        filters.material &&
        !result.material.toLowerCase().includes(filters.material.toLowerCase())
      ) {
        return false;
      }
      if (
        result.price < filters.priceRange[0] ||
        result.price > filters.priceRange[1]
      ) {
        return false;
      }
      if (
        filters.size &&
        !result.sizes.toLowerCase().includes(filters.size.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [results, filters]);

  // Admin functions
  const rebuildIndices = async () => {
    try {
      const response = await fetch(`${API_BASE}/rebuild`, { method: 'POST' });
      const data = await response.json();
      alert(data.message || 'Indices rebuilt successfully');
      checkBackendHealth();
    } catch (error) {
      alert('Failed to rebuild indices');
    }
  };

  const augmentCatalog = async () => {
    try {
      const response = await fetch(`${API_BASE}/augment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 10, rebuild: true }),
      });
      const data = await response.json();
      alert(data.message || 'Catalog augmented successfully');
      checkBackendHealth();
    } catch (error) {
      alert('Failed to augment catalog');
    }
  };

  const runEvaluation = async () => {
    setEvalLoading(true);
    try {
      // Get built-in queries
      const queriesResponse = await fetch(`${API_BASE}/eval/queries`);
      const queriesData = await queriesResponse.json();

      // Run evaluation
      const response = await fetch(`${API_BASE}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queries: queriesData.queries }),
      });
      const data: EvaluationMetrics = await response.json();

      setEvalResults(data);
    } catch (error) {
      console.error('Evaluation failed:', error);
      alert('Failed to run evaluation');
    } finally {
      setEvalLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, [checkBackendHealth]);

  useEffect(() => {
    if (query.trim()) {
      debouncedSearch(query);
    }
  }, [query, debouncedSearch]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="font-semibold text-gray-900">
                  Threadress Lab
                </span>
              </Link>
              <div className="hidden sm:block w-px h-6 bg-gray-300" />
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    backendHealth === 'healthy'
                      ? 'bg-green-500'
                      : backendHealth === 'unhealthy'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {backendHealth === 'healthy'
                    ? 'Backend Online'
                    : backendHealth === 'unhealthy'
                      ? 'Backend Offline'
                      : 'Checking...'}
                </span>
              </div>
            </div>

            {/* Admin Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={rebuildIndices}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Rebuild
              </button>
              <button
                onClick={augmentCatalog}
                className="px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
              >
                +10 Items
              </button>
              <button
                onClick={() => setShowEvalModal(true)}
                className="px-3 py-1.5 text-sm bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
              >
                Run Eval
              </button>
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Debug
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-4xl mx-auto">
            <h1
              className="text-3xl font-light text-gray-900 mb-6 text-center"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Semantic Search Lab
            </h1>
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500">
                Data © Flying Solo NYC (used for private demo)
              </p>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for fashion items... (e.g., 'light blue tweed blazer')"
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                style={{ fontFamily: 'Playfair Display, serif' }}
              />
              {loading && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Example Queries */}
            <div className="flex flex-wrap gap-2 mb-6">
              {EXAMPLE_QUERIES.slice(0, 6).map((example, index) => (
                <button
                  key={index}
                  onClick={() => setQuery(example)}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>

            {/* Weight Controls */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Search Weights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text Similarity: {Math.round(weights.text * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={weights.text}
                    onChange={(e) =>
                      setWeights((prev) => ({
                        ...prev,
                        text: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Similarity: {Math.round(weights.image * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={weights.image}
                    onChange={(e) =>
                      setWeights((prev) => ({
                        ...prev,
                        image: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keyword Match: {Math.round(weights.keyword * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={weights.keyword}
                    onChange={(e) =>
                      setWeights((prev) => ({
                        ...prev,
                        keyword: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rerank}
                    onChange={(e) => setRerank(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Enable Reranking
                  </span>
                </label>
                {searchTime > 0 && (
                  <span className="text-sm text-gray-500">
                    Search time: {Math.round(searchTime * 1000)}ms
                  </span>
                )}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Filters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <select
                    value={filters.color}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, color: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Colors</option>
                    {COLOR_FAMILIES.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material
                  </label>
                  <select
                    value={filters.material}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        material: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">All Materials</option>
                    {MATERIALS.map((material) => (
                      <option key={material} value={material}>
                        {material}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      ${filters.priceRange[0]}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: [
                            prev.priceRange[0],
                            parseInt(e.target.value),
                          ],
                        }))
                      }
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500">
                      ${filters.priceRange[1]}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <input
                    type="text"
                    value={filters.size}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, size: e.target.value }))
                    }
                    placeholder="XS, S, M, L, XL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-gray-900">
              Results ({filteredResults.length})
            </h2>
            {results.length > 0 && (
              <div className="text-sm text-gray-500">
                Showing {filteredResults.length} of {results.length} results
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredResults.map((result, index) => (
                <motion.div
                  key={result.product_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={result.image_path || '/placeholder-product.jpg'}
                      alt={result.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.src = '/placeholder-product.jpg';
                      }}
                    />
                    {showDebug && (
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {Math.round(result.score * 100)}%
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3
                      className="font-medium text-gray-900 mb-2 line-clamp-2"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {result.title}
                    </h3>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-semibold text-gray-900">
                        ${result.price}
                      </span>
                      <div className="text-sm text-gray-500">
                        {result.color} • {result.material}
                      </div>
                    </div>

                    {/* Why Chips */}
                    {result.why_chips.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {result.why_chips.map((chip, chipIndex) => (
                          <span
                            key={chipIndex}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Debug Info */}
                    {showDebug && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">Text:</span>
                            <span className="ml-1 font-medium">
                              {Math.round(result.score_text * 100)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Image:</span>
                            <span className="ml-1 font-medium">
                              {Math.round(result.score_img * 100)}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Keyword:</span>
                            <span className="ml-1 font-medium">
                              {Math.round(result.score_kw * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">No results found</div>
              <div className="text-sm text-gray-400">
                Try adjusting your search or filters
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-2">
                Enter a search query to get started
              </div>
              <div className="text-sm text-gray-400">
                Try one of the example queries above
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Evaluation Modal */}
      <AnimatePresence>
        {showEvalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowEvalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Evaluation Results
                </h3>
                <button
                  onClick={() => setShowEvalModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {evalLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : evalResults ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Hit@1</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {Math.round(evalResults.hit_at_1 * 100)}%
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Recall@10</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {Math.round(evalResults.recall_at_10 * 100)}%
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">nDCG@10</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {Math.round(evalResults.ndcg_at_10 * 100)}%
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-sm text-gray-600">Zero Results</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {Math.round(evalResults.zero_result_rate * 100)}%
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 text-center">
                    Based on {evalResults.total_queries} test queries
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <button
                    onClick={runEvaluation}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Run Evaluation
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
