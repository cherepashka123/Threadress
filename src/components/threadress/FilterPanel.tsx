'use client';

import React, { useState } from 'react';
import { Filters } from './types';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface FilterPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onSearch: () => void;
}

const brandList = [
  'Aurelia',
  'Vireo',
  'Lunaris',
  'Mira Mode',
  'Solace',
  'Opaline',
  'Eclipse',
  'Nova Atelier',
];

type SectionKey = 'category' | 'brand' | 'colour';

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  onSearch,
}) => {
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(
    {
      category: true,
      brand: true,
      colour: false,
    }
  );
  const [brandSearch, setBrandSearch] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const locations = [
    'SoHo',
    'Williamsburg',
    'West Village',
    'Tribeca',
    'Upper East Side',
    'Brooklyn',
    'Lower East Side',
    'Chelsea',
    'Nolita',
    'East Village',
    'Meatpacking District',
    'Dumbo',
  ];

  const styleOptions = [
    'Minimalist',
    'Bohemian',
    'Classic',
    'Edgy',
    'Romantic',
    'Sporty',
    'Vintage',
    'Contemporary',
    'Grunge',
    'Preppy',
    'Streetwear',
    'Luxury',
  ];

  const sizeOptions = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleSectionToggle = (section: SectionKey) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const filteredBrands = brandList.filter((brand) =>
    brand.toLowerCase().includes(brandSearch.toLowerCase())
  );

  const handleLocationChange = (location: string) => {
    onFiltersChange({
      ...filters,
      location: filters.location === location ? '' : location,
    });
  };

  const handleStyleToggle = (style: string) => {
    const currentStyles = filters.style || [];
    const newStyles = currentStyles.includes(style)
      ? currentStyles.filter((s) => s !== style)
      : [...currentStyles, style];

    onFiltersChange({
      ...filters,
      style: newStyles,
    });
  };

  const handleBudgetChange = (field: 'min' | 'max', value: number) => {
    onFiltersChange({
      ...filters,
      budget: {
        ...filters.budget,
        [field]: value,
      },
    });
  };

  const handleSizeChange = (size: string) => {
    onFiltersChange({
      ...filters,
      size: filters.size === size ? '' : size,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      location: '',
      budget: { min: 0, max: 1000 },
      style: [],
      size: '',
    });
  };

  const hasActiveFilters =
    filters.location ||
    filters.style.length > 0 ||
    filters.size ||
    filters.budget.min > 0 ||
    filters.budget.max < 1000 ||
    selectedBrands.length > 0;

  return (
    <div className="bg-white rounded-2xl p-6 w-full max-w-xs min-h-screen flex flex-col relative shadow-xl">
      {/* Sticky Close Button */}
      <button
        className="absolute top-6 right-6 text-2xl text-gray-400 hover:text-gray-900 focus:outline-none"
        aria-label="Close filters"
        onClick={() => onSearch()}
      >
        &times;
      </button>
      <h2 className="text-2xl font-light mb-8 tracking-tight">All Filters</h2>

      {/* Location Filter */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Location
        </label>
        <div className="flex flex-wrap gap-2">
          {locations.map((location) => (
            <button
              key={location}
              onClick={() => handleLocationChange(location)}
              className={`px-4 py-2 text-sm bg-transparent border-b-2 border-transparent hover:border-gray-900 rounded-none text-gray-900 font-normal transition-all duration-200 focus:outline-none ${
                filters.location === location
                  ? 'border-gray-900 font-medium'
                  : ''
              }`}
              style={{ boxShadow: 'none' }}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Range */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Budget
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              onFiltersChange({ ...filters, budget: { min: 0, max: 100 } })
            }
            className={`px-4 py-2 text-sm bg-transparent border-b-2 border-transparent hover:border-gray-900 rounded-none text-gray-900 font-normal transition-all duration-200 focus:outline-none ${
              filters.budget.min === 0 && filters.budget.max === 100
                ? 'border-gray-900 font-medium'
                : ''
            }`}
            style={{ boxShadow: 'none' }}
          >
            Under $100
          </button>
          <button
            onClick={() =>
              onFiltersChange({ ...filters, budget: { min: 100, max: 250 } })
            }
            className={`px-4 py-2 text-sm bg-transparent border-b-2 border-transparent hover:border-gray-900 rounded-none text-gray-900 font-normal transition-all duration-200 focus:outline-none ${
              filters.budget.min === 100 && filters.budget.max === 250
                ? 'border-gray-900 font-medium'
                : ''
            }`}
            style={{ boxShadow: 'none' }}
          >
            $100-250
          </button>
          <button
            onClick={() =>
              onFiltersChange({ ...filters, budget: { min: 250, max: 500 } })
            }
            className={`px-4 py-2 text-sm bg-transparent border-b-2 border-transparent hover:border-gray-900 rounded-none text-gray-900 font-normal transition-all duration-200 focus:outline-none ${
              filters.budget.min === 250 && filters.budget.max === 500
                ? 'border-gray-900 font-medium'
                : ''
            }`}
            style={{ boxShadow: 'none' }}
          >
            $250-500
          </button>
          <button
            onClick={() =>
              onFiltersChange({ ...filters, budget: { min: 500, max: 1000 } })
            }
            className={`px-4 py-2 text-sm bg-transparent border-b-2 border-transparent hover:border-gray-900 rounded-none text-gray-900 font-normal transition-all duration-200 focus:outline-none ${
              filters.budget.min === 500 && filters.budget.max === 1000
                ? 'border-gray-900 font-medium'
                : ''
            }`}
            style={{ boxShadow: 'none' }}
          >
            $500+
          </button>
        </div>
      </div>

      {/* Style Filter */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-900 mb-3">
          Style
        </label>
        <div className="flex flex-wrap gap-2">
          {styleOptions.map((style) => (
            <button
              key={style}
              onClick={() => handleStyleToggle(style)}
              className={`px-4 py-2 text-sm bg-transparent border-b-2 border-transparent hover:border-gray-900 rounded-none text-gray-900 font-normal transition-all duration-200 focus:outline-none ${
                filters.style.includes(style)
                  ? 'border-gray-900 font-medium'
                  : ''
              }`}
              style={{ boxShadow: 'none' }}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Category Section */}
      <div className="mb-8">
        <div
          className="flex items-center justify-between cursor-pointer mb-3"
          onClick={() => handleSectionToggle('category')}
        >
          <label className="block text-sm font-medium text-gray-900">
            CATEGORY
          </label>
          {openSections.category ? (
            <FaChevronUp className="text-gray-500" />
          ) : (
            <FaChevronDown className="text-gray-500" />
          )}
        </div>
        {openSections.category && (
          <div className="flex flex-col gap-2">
            {[
              'Body Jewelry',
              'Bracelets',
              'Brooches & Pins',
              'Earrings',
              'Necklaces',
              'Rings',
              'Watches',
            ].map((cat) => (
              <label
                key={cat}
                className="flex items-center gap-3 px-2 py-2 rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={
                    Array.isArray(filters.category) &&
                    filters.category.includes(cat)
                  }
                  onChange={() => {
                    if (Array.isArray(filters.category)) {
                      onFiltersChange({
                        ...filters,
                        category: filters.category.includes(cat)
                          ? filters.category.filter((c: string) => c !== cat)
                          : [...filters.category, cat],
                      });
                    } else {
                      onFiltersChange({
                        ...filters,
                        category: [cat],
                      });
                    }
                  }}
                  className="form-checkbox h-6 w-6 text-gray-900 border-gray-400 rounded-none focus:ring-0 focus:ring-offset-0"
                  style={{ accentColor: 'black', borderRadius: 0 }}
                />
                <span className="text-base text-gray-900 font-normal">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Show Results Button (sticky at bottom) */}
      <div className="mt-auto pt-8 pb-2 bg-white sticky bottom-0 left-0 right-0">
        <button
          onClick={onSearch}
          className="w-full py-3 bg-black text-white rounded-xl text-base font-medium shadow-lg hover:bg-gray-900 transition-colors"
        >
          Show Results
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
