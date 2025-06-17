'use client';

import React, { useState } from 'react';
import { User, Filters } from './types';

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
    'maxi denim dress',
    'white swimsuit',
    'ballet flats',
    'printed scarf',
    'leather sandals',
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-light text-gray-900 mb-4">
          What fashion piece are you searching for?
        </h1>
        <p className="text-gray-600 text-lg">
          Describe what you want and we'll find it at local boutiques
        </p>
      </div>

      {/* Modern Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for a specific piece..."
          className="w-full px-6 py-4 text-lg bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-all duration-200"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors duration-200"
        >
          Search
        </button>
      </div>

      {/* Search Examples */}
      <div className="mb-12">
        <p className="text-sm text-gray-500 mb-4">Popular searches:</p>
        <div className="flex flex-wrap gap-2">
          {searchExamples.map((example) => (
            <button
              key={example}
              onClick={() => handleExampleClick(example)}
              className="px-4 py-2 text-sm text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-900 rounded-none transition-all duration-200 focus:outline-none"
              style={{ boxShadow: 'none' }}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Section - Modern minimalist */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Location
            </label>
            <div className="flex flex-wrap gap-2">
              {quickLocations.map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationSelect(location)}
                  className={`px-4 py-2 text-sm bg-transparent border-b-2 border-transparent hover:border-gray-900 rounded-none text-gray-900 transition-all duration-200 focus:outline-none ${
                    quickFilters.location === location
                      ? 'border-gray-900 font-semibold'
                      : ''
                  }`}
                  style={{ boxShadow: 'none' }}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>

          {/* Budget Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Budget
            </label>
            <div className="flex flex-wrap gap-2">
              {quickBudgets.map((budget) => (
                <button
                  key={budget.label}
                  onClick={() => handleBudgetSelect(budget)}
                  className={`px-4 py-2 text-sm bg-transparent border-b-2 border-transparent hover:border-gray-900 rounded-none text-gray-900 transition-all duration-200 focus:outline-none ${
                    quickFilters.budget.min === budget.min &&
                    quickFilters.budget.max === budget.max
                      ? 'border-gray-900 font-semibold'
                      : ''
                  }`}
                  style={{ boxShadow: 'none' }}
                >
                  {budget.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Preferences - Only shown if user has preferences */}
      {user?.preferences && (
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4 text-gray-600"
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
            <span className="text-sm text-gray-600">
              Using your style preferences
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
