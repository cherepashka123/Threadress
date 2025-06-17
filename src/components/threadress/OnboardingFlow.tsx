'use client';

import React, { useState } from 'react';
import { User } from './types';

interface OnboardingFlowProps {
  onComplete: (user: User) => void;
  onSkip: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  onComplete,
  onSkip,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferences: {
      style: [] as string[],
      priceRange: { min: 50, max: 300 },
      sizes: {
        top: '',
        bottom: '',
        dress: '',
        shoe: '',
      },
      favoriteColors: [] as string[],
    },
  });

  const styleOptions = [
    'Minimalist',
    'Classic',
    'Modern',
    'Vintage',
    'Bohemian',
    'Edgy',
    'Romantic',
    'Casual',
  ];

  const colorOptions = [
    'Black',
    'White',
    'Gray',
    'Navy',
    'Beige',
    'Brown',
    'Green',
    'Blue',
  ];

  const budgetOptions = [
    { label: 'Budget-friendly', range: { min: 25, max: 100 } },
    { label: 'Moderate', range: { min: 100, max: 300 } },
    { label: 'Premium', range: { min: 300, max: 600 } },
    { label: 'Luxury', range: { min: 600, max: 1200 } },
  ];

  const handleStyleToggle = (style: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        style: prev.preferences.style.includes(style)
          ? prev.preferences.style.filter((s) => s !== style)
          : [...prev.preferences.style, style],
      },
    }));
  };

  const handleColorToggle = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        favoriteColors: prev.preferences.favoriteColors.includes(color)
          ? prev.preferences.favoriteColors.filter((c) => c !== color)
          : [...prev.preferences.favoriteColors, color],
      },
    }));
  };

  const handleBudgetSelect = (budget: { min: number; max: number }) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        priceRange: budget,
      },
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || 'Guest',
      email: formData.email,
      preferences: formData.preferences,
    };
    onComplete(user);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.preferences.style.length > 0;
      case 2:
        return true; // Sizing is optional
      case 3:
        return formData.preferences.favoriteColors.length > 0;
      case 4:
        return true; // Budget always has a default
      default:
        return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-6">
          <button
            onClick={onSkip}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium"
          >
            Skip for now →
          </button>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Let's personalize your experience
        </h2>
        <p className="text-gray-600">
          Help us understand your style preferences
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Step {currentStep} of 4</span>
          <span>{Math.round((currentStep / 4) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-gray-900 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
        {/* Step 1: Style Preferences */}
        {currentStep === 1 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              What's your style?
            </h3>
            <p className="text-gray-600 mb-6">
              Select all styles that resonate with you
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {styleOptions.map((style) => (
                <button
                  key={style}
                  onClick={() => handleStyleToggle(style)}
                  className={`p-3 text-sm rounded-lg border-2 transition-all font-medium ${
                    formData.preferences.style.includes(style)
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Sizing */}
        {currentStep === 2 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Size information
            </h3>
            <p className="text-gray-600 mb-6">
              Help us find the right fit (optional)
            </p>
            <div className="space-y-4">
              {[
                {
                  key: 'top',
                  label: 'Tops',
                  options: ['XS', 'S', 'M', 'L', 'XL'],
                },
                {
                  key: 'bottom',
                  label: 'Bottoms',
                  options: ['XS', 'S', 'M', 'L', 'XL'],
                },
                {
                  key: 'dress',
                  label: 'Dresses',
                  options: ['XS', 'S', 'M', 'L', 'XL'],
                },
                {
                  key: 'shoe',
                  label: 'Shoes',
                  options: ['6', '7', '8', '9', '10', '11'],
                },
              ].map((category) => (
                <div key={category.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {category.label}
                  </label>
                  <div className="flex gap-2">
                    {category.options.map((size) => (
                      <button
                        key={size}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              sizes: {
                                ...prev.preferences.sizes,
                                [category.key]:
                                  prev.preferences.sizes[
                                    category.key as keyof typeof prev.preferences.sizes
                                  ] === size
                                    ? ''
                                    : size,
                              },
                            },
                          }))
                        }
                        className={`px-3 py-2 text-sm rounded border transition-all ${
                          formData.preferences.sizes[
                            category.key as keyof typeof formData.preferences.sizes
                          ] === size
                            ? 'border-gray-900 bg-gray-900 text-white'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Color Preferences */}
        {currentStep === 3 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Favorite colors
            </h3>
            <p className="text-gray-600 mb-6">
              Which colors do you gravitate towards?
            </p>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorToggle(color)}
                  className={`p-3 text-sm rounded-lg border-2 transition-all font-medium ${
                    formData.preferences.favoriteColors.includes(color)
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Budget */}
        {currentStep === 4 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Budget range
            </h3>
            <p className="text-gray-600 mb-6">
              What's your typical spending range for a single piece?
            </p>
            <div className="space-y-3">
              {budgetOptions.map((budget) => (
                <button
                  key={budget.label}
                  onClick={() => handleBudgetSelect(budget.range)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    formData.preferences.priceRange.min === budget.range.min &&
                    formData.preferences.priceRange.max === budget.range.max
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">
                    {budget.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    ${budget.range.min} - ${budget.range.max}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-6 py-3 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
        >
          ← Previous
        </button>

        <div className="flex space-x-3">
          <button
            onClick={onSkip}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium"
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {currentStep === 4 ? 'Complete' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
