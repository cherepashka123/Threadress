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
            className="text-sm text-purple-500 hover:text-purple-700 font-medium font-serif"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Skip for now →
          </button>
        </div>
        <h2
          className="text-3xl md:text-4xl font-light text-neutral-900 mb-4 font-serif"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Let's personalize your experience
        </h2>
        <p
          className="text-neutral-600 font-light font-serif"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          Help us understand your style preferences
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div
          className="flex justify-between text-sm text-neutral-400 mb-2 font-serif"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          <span>Step {currentStep} of 4</span>
          <span>{Math.round((currentStep / 4) * 100)}%</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-1">
          <div
            className="bg-purple-400 h-1 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl p-8 mb-8 shadow-none border-none">
        {/* Step 1: Style Preferences */}
        {currentStep === 1 && (
          <div>
            <h3
              className="text-2xl font-light text-neutral-900 mb-6 font-serif"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              What's your style?
            </h3>
            <p
              className="text-neutral-600 mb-6 font-serif"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Select all styles that resonate with you
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {styleOptions.map((style) => (
                <button
                  key={style}
                  onClick={() => handleStyleToggle(style)}
                  className={`p-3 text-sm rounded-full border-2 transition-all font-serif font-light ${
                    formData.preferences.style.includes(style)
                      ? 'border-purple-500 text-purple-700 bg-purple-50'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-purple-200'
                  }`}
                  style={{ fontFamily: 'Playfair Display, serif' }}
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
            <h3
              className="text-2xl font-light text-neutral-900 mb-6 font-serif"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Size information
            </h3>
            <p
              className="text-neutral-600 mb-6 font-serif"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
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
                  <label
                    className="block text-sm font-medium text-neutral-700 mb-2 font-serif"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
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
                        className={`px-4 py-2 text-sm rounded-full border-2 transition-all font-serif font-light ${
                          formData.preferences.sizes[
                            category.key as keyof typeof formData.preferences.sizes
                          ] === size
                            ? 'border-purple-500 text-purple-700 bg-purple-50'
                            : 'border-neutral-200 text-neutral-700 bg-white hover:border-purple-200'
                        }`}
                        style={{ fontFamily: 'Playfair Display, serif' }}
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
            <h3
              className="text-2xl font-light text-neutral-900 mb-6 font-serif"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Favorite colors
            </h3>
            <p
              className="text-neutral-600 mb-6 font-serif"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Which colors do you gravitate towards?
            </p>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorToggle(color)}
                  className={`p-3 text-sm rounded-full border-2 transition-all font-serif font-light ${
                    formData.preferences.favoriteColors.includes(color)
                      ? 'border-purple-500 text-purple-700 bg-purple-50'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-purple-200'
                  }`}
                  style={{ fontFamily: 'Playfair Display, serif' }}
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
            <h3
              className="text-2xl font-light text-neutral-900 mb-6 font-serif"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              Budget range
            </h3>
            <p
              className="text-neutral-600 mb-6 font-serif"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              What's your typical spending range for a single piece?
            </p>
            <div className="space-y-3">
              {budgetOptions.map((budget) => (
                <button
                  key={budget.label}
                  onClick={() => handleBudgetSelect(budget.range)}
                  className={`w-full p-4 text-left rounded-full border-2 transition-all font-serif font-light ${
                    formData.preferences.priceRange.min === budget.range.min &&
                    formData.preferences.priceRange.max === budget.range.max
                      ? 'border-purple-500 text-purple-700 bg-purple-50'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-purple-200'
                  }`}
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  <div
                    className="font-medium text-neutral-900 font-serif"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {budget.label}
                  </div>
                  <div
                    className="text-sm text-neutral-600 font-serif"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    ${budget.range.min} - ${budget.range.max}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-2">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-6 py-3 border-2 border-purple-300 text-purple-700 bg-white rounded-full font-serif font-light hover:bg-purple-50 disabled:text-neutral-300 disabled:border-neutral-200 disabled:bg-white disabled:cursor-not-allowed transition-all"
          style={{ fontFamily: 'Playfair Display, serif' }}
        >
          ← Previous
        </button>

        <div className="flex space-x-3">
          <button
            onClick={onSkip}
            className="px-6 py-3 border-2 border-purple-300 text-purple-700 bg-white rounded-full font-serif font-light hover:bg-purple-50 transition-all"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Skip
          </button>
          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="px-6 py-3 border-2 border-purple-500 text-white bg-purple-500 rounded-full font-serif font-light hover:bg-purple-600 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:border-neutral-200 disabled:cursor-not-allowed transition-all"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {currentStep === 4 ? 'Complete' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
