'use client';

import React, { useState } from 'react';
import { User, Filters } from './types';
import MinimalButton from '../MinimalButton';

interface SmartSearchProps {
  user: User | null;
  onSearch: (query: string, filters: Filters) => void;
  isLoading: boolean;
}

const SmartSearch: React.FC<SmartSearchProps> = ({
  user,
  onSearch,
  isLoading,
}) => {
  const [query, setQuery] = useState('');
  const [quickFilters, setQuickFilters] = useState<Filters>({
    location: '',
    budget: { min: 0, max: 1000 },
    style: [],
    size: '',
  });

  const searchExamples = [
    'maxi dress',
    'one piece swimsuit',
    'ballet flats',
    'printed scarf',
    'sandals',
  ];

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

  const handleSearch = () => {
    if (!query.trim()) return;

    // Apply user preferences if available
    let searchFilters = { ...quickFilters };
    if (user?.preferences) {
      searchFilters.budget = user.preferences.priceRange;
      if (user.preferences.style.length > 0) {
        searchFilters.style = user.preferences.style;
      }
    }

    onSearch(query, searchFilters);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  const handleLocationSelect = (location: string) => {
    setQuickFilters((prev) => ({ ...prev, location }));
  };

  const handleBudgetSelect = (budget: { min: number; max: number }) => {
    setQuickFilters((prev) => ({ ...prev, budget }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-8"
      style={{ fontFamily: 'Playfair Display, serif' }}
    >
      <div className="text-center mb-12">
        <h1
          className="text-5xl md:text-6xl font-light text-neutral-900 mb-4 font-serif"
          style={{
            fontFamily: 'Playfair Display, serif',
            letterSpacing: '-0.01em',
          }}
        >
          Describe what you’re looking for
        </h1>
        <p
          className="text-neutral-600 text-xl font-serif mb-2"
          style={{
            fontFamily: 'Playfair Display, serif',
            letterSpacing: '-0.01em',
          }}
        >
          Describe it. We’ll help you find it — nearby, in real-time.
        </p>
      </div>

      {/* Modern Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Start typing…"
          className="w-full px-6 py-4 text-xl bg-white border-2 border-neutral-200 text-neutral-900 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-400 transition-all duration-200 font-serif placeholder:text-neutral-400 placeholder:italic"
          style={{ fontFamily: 'Playfair Display, serif' }}
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 border border-neutral-200 text-neutral-900 bg-white rounded-full hover:border-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-300 transition-colors duration-200 font-serif text-lg"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Search
        </button>
      </div>

      {/* Search Examples */}
      <div className="mb-12">
        <p
          className="text-base text-neutral-400 mb-4 font-serif"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Popular searches:
        </p>
        <div className="flex flex-wrap gap-3">
          {searchExamples.map((example) => (
            <MinimalButton
              key={example}
              onClick={() => handleExampleClick(example)}
              className={`px-6 py-3 text-lg rounded-full font-serif transition-all duration-200 focus:outline-none ${
                query === example
                  ? 'border-neutral-900 text-neutral-900 bg-neutral-100'
                  : 'border-neutral-200 text-neutral-900 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-400'
              }`}
              style={{
                fontFamily: 'Playfair Display, serif',
                letterSpacing: '-0.01em',
                boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)',
              }}
            >
              {example}
            </MinimalButton>
          ))}
        </div>
      </div>

      {/* Filters Section - Modern minimalist */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Location Filter */}
          <div>
            <label
              className="block text-sm font-medium text-neutral-900 mb-3 font-serif"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Location
            </label>
            <div className="flex flex-wrap gap-2">
              {quickLocations.map((location) => (
                <MinimalButton
                  key={location}
                  onClick={() => handleLocationSelect(location)}
                  className={`px-4 py-2 text-sm rounded-full font-serif transition-all duration-200 focus:outline-none ${
                    quickFilters.location === location
                      ? 'border-neutral-900 text-neutral-900 bg-neutral-100'
                      : 'border-neutral-200 text-neutral-900 bg-transparent hover:border-neutral-400'
                  }`}
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    boxShadow: 'none',
                  }}
                >
                  {location}
                </MinimalButton>
              ))}
            </div>
          </div>

          {/* Budget Filter */}
          <div>
            <label
              className="block text-sm font-medium text-neutral-900 mb-3 font-serif"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Budget
            </label>
            <div className="flex flex-wrap gap-2">
              {quickBudgets.map((budget) => (
                <MinimalButton
                  key={budget.label}
                  onClick={() => handleBudgetSelect(budget)}
                  className={`px-4 py-2 text-sm rounded-full font-serif transition-all duration-200 focus:outline-none ${
                    quickFilters.budget.min === budget.min &&
                    quickFilters.budget.max === budget.max
                      ? 'border-neutral-900 text-neutral-900 bg-neutral-100'
                      : 'border-neutral-200 text-neutral-900 bg-transparent hover:border-neutral-400'
                  }`}
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    boxShadow: 'none',
                  }}
                >
                  {budget.label}
                </MinimalButton>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Preferences - Only shown if user has preferences */}
      {user?.preferences && (
        <div
          className="bg-neutral-100 rounded-2xl p-4 font-serif"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-neutral-700">
              Using your style preferences
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
