'use client';

import React, { useState, useEffect } from 'react';
import MinimalButton from '@/components/MinimalButton';

interface SearchResult {
  id: string;
  score: number;
  title: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  url: string;
  color: string;
  material: string;
  size: string;
  style: string;
  occasion: string;
  season: string;
  preview: string;
  synced_at: string;
}

interface SearchResponse {
  ok: boolean;
  mode: string;
  query: string;
  imageUrl: string;
  textWeight: number;
  imageWeight: number;
  count: number;
  hits: SearchResult[];
  filters: {
    brand: string | null;
    category: string | null;
    minPrice: number | undefined;
    maxPrice: number | undefined;
    storeId: number | undefined;
    color: string | null;
    material: string | null;
    style: string | null;
    occasion: string | null;
    season: string | null;
  };
}

export default function MultimodalTestPage() {
  // Search state
  const [query, setQuery] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchExamples = [
    'cardigan',
    'elegant black dress',
    'linen shirt',
    'knit sweater',
    'satin blouse',
    'draped top',
    'tight dress for halloween party',
    'elegant blouse for work meeting',
    'comfortable sweater for weekend',
    'edgy leather jacket for concert',
    'romantic flowy dress for wedding',
  ];

  // Single optimized mode: CLIP Advanced with typo tolerance and vibe understanding
  const searchMode = 'clip-advanced';

  const quickLocations = [
    'SoHo',
    'Williamsburg',
    'West Village',
    'Tribeca',
    'Upper East Side',
    'Brooklyn',
    'Lower East Side',
    'Chelsea',
  ];

  const quickBudgets = [
    { label: 'Under $100', min: 0, max: 100 },
    { label: '$100-250', min: 100, max: 250 },
    { label: '$250-500', min: 250, max: 500 },
    { label: '$500+', min: 500, max: 1000 },
  ];

  const handleSearch = async () => {
    if (!query.trim() && !imageUrl.trim()) {
      setError('Please enter a search query or image URL');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      if (query.trim()) searchParams.set('q', query);
      if (imageUrl.trim()) searchParams.set('imageUrl', imageUrl);
      searchParams.set('k', '20'); // Number of results

      const response = await fetch(
        `/api/inventory-search?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.ok) {
        setResults({
          ...data,
          mode: 'clip-advanced',
          textWeight: 0,
          imageWeight: 0,
          filters: {
            brand: null,
            category: null,
            minPrice: undefined,
            maxPrice: undefined,
            storeId: undefined,
            color: null,
            material: null,
            style: null,
            occasion: null,
            season: null,
          },
        });
      } else {
        setError(data.error || 'Search failed');
      }
    } catch (err) {
      setError('Network error: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(price);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600';
    if (score >= 0.6) return 'text-yellow-600';
    if (score >= 0.4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return 'Perfect Match';
    if (score >= 0.6) return 'Great Match';
    if (score >= 0.4) return 'Good Match';
    return 'Fair Match';
  };

  return (
    <div
      className="min-h-screen bg-neutral-50"
      style={{ fontFamily: 'Playfair Display, serif' }}
    >
      {/* Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-light text-neutral-900 mb-2">
              Advanced Multimodal Search Test
            </h1>
            <p className="text-neutral-600 text-lg">
              CLIP Advanced search with typo tolerance and vibe understanding
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 sticky top-8">
              {/* Main Search Interface */}
              <div className="mb-8">
                <h2 className="text-2xl font-light text-neutral-900 mb-4">
                  Describe what you're looking for
                </h2>
                <p className="text-neutral-600 text-sm mb-6">
                  Describe it. We'll help you find it — nearby, in real-time.
                </p>

                {/* Search Input */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Start typing…"
                    className="w-full px-4 py-3 text-lg bg-white border-2 border-neutral-200 text-neutral-900 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-400 transition-all duration-200 font-serif placeholder:text-neutral-400 placeholder:italic"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  />
                </div>

                {/* Image URL Input */}
                <div className="relative mb-4">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Or paste an image URL…"
                    className="w-full px-4 py-3 text-lg bg-white border-2 border-neutral-200 text-neutral-900 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-400 transition-all duration-200 font-serif placeholder:text-neutral-400 placeholder:italic"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  />
                </div>

                {/* Search Examples */}
                <div className="mb-6">
                  <p className="text-sm text-neutral-400 mb-3">
                    Popular searches:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {searchExamples.map((example) => (
                      <MinimalButton
                        key={example}
                        onClick={() => handleExampleClick(example)}
                        className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${
                          query === example
                            ? 'border-neutral-900 text-neutral-900 bg-neutral-100'
                            : 'border-neutral-200 text-neutral-900 bg-neutral-50 hover:bg-neutral-100'
                        }`}
                      >
                        {example}
                      </MinimalButton>
                    ))}
                  </div>
                </div>

                {/* Info Box */}
                <div className="mb-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <p className="text-xs text-neutral-600">
                    <strong>Advanced Multimodal Search</strong> — Uses
                    HuggingFace CLIP to understand visual and textual context,
                    with automatic typo correction and style understanding for
                    precise, curated results.
                  </p>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-neutral-900 text-white rounded-full font-serif text-lg hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Search Error
                    </h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                  </div>
                </div>
              </div>
            )}

            {results && (
              <div className="mb-6">
                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-medium text-neutral-900">
                      Search Results ({results.count} items)
                    </h3>
                    <div className="text-sm text-neutral-500">
                      Mode: {results.mode || 'clip-advanced'}
                    </div>
                  </div>

                  {results.query && (
                    <div className="text-sm text-neutral-600 mb-2">
                      <strong>Query:</strong> "{results.query}"
                    </div>
                  )}

                  {results.imageUrl && (
                    <div className="text-sm text-neutral-600 mb-4">
                      <strong>Image:</strong>
                      <img
                        src={results.imageUrl}
                        alt="Search image"
                        className="inline-block ml-2 w-16 h-16 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Results Grid */}
            {results && results.hits.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.hits.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow duration-200"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-neutral-100">
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            '/placeholder-product.jpg';
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-medium text-neutral-900 line-clamp-2">
                          {item.title}
                        </h4>
                        <div
                          className={`text-sm font-medium ${getScoreColor(item.score)}`}
                        >
                          {getScoreLabel(item.score)}
                        </div>
                      </div>

                      <div className="text-sm text-neutral-600 mb-3">
                        <div>Score: {(item.score * 100).toFixed(1)}%</div>
                        <div>
                          Price: {formatPrice(item.price, item.currency)}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-neutral-500">
                        {item.brand && (
                          <div>
                            <strong>Brand:</strong> {item.brand}
                          </div>
                        )}
                        {item.category && (
                          <div>
                            <strong>Category:</strong> {item.category}
                          </div>
                        )}
                        {item.color && (
                          <div>
                            <strong>Color:</strong> {item.color}
                          </div>
                        )}
                        {item.material && (
                          <div>
                            <strong>Material:</strong> {item.material}
                          </div>
                        )}
                        {item.style && (
                          <div>
                            <strong>Style:</strong> {item.style}
                          </div>
                        )}
                        {item.occasion && (
                          <div>
                            <strong>Occasion:</strong> {item.occasion}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-neutral-100">
                        <div className="text-xs text-neutral-400">
                          {item.preview}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {results && results.hits.length === 0 && (
              <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
                <div className="text-neutral-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  No results found
                </h3>
                <p className="text-neutral-500">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            )}

            {!results && !loading && (
              <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center">
                <div className="text-neutral-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  Ready to search
                </h3>
                <p className="text-neutral-500">
                  Enter a search query or image URL to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
