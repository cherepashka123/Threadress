'use client';

import React, { useState, useEffect } from 'react';
import { Product, User, Reservation } from './types';

interface ReservationFlowProps {
  product: Product;
  user: User | null;
  allProducts: Product[];
  onComplete: (reservation: Reservation) => void;
  onBack: () => void;
  reservationType?: 'hold' | 'prepay' | null;
}

const ReservationFlow: React.FC<ReservationFlowProps> = ({
  product,
  user,
  allProducts,
  onComplete,
  onBack,
  reservationType = null,
}) => {
  const [step, setStep] = useState(1); // 1: Details, 2: Confirmation
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canProceed = () => {
    return email.trim() !== '' && phone.trim() !== '';
  };

  // Step 1: Minimal form
  if (step === 1) {
    return (
      <div className="max-w-lg mx-auto w-full">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back to Results
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Reserve Your Item
        </h1>
        <p className="text-gray-600 mb-6">
          Complete your reservation for same-day pickup
        </p>
        {reservationType === 'prepay' && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg text-purple-800 text-sm font-medium text-center">
            <span className="font-semibold">Prepay Perks:</span> Your item will
            be held for 24 hours, you get early access to new arrivals, and a
            free gift at pickup!
          </div>
        )}
        {reservationType === 'hold' && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm text-center">
            <span className="font-semibold">In-stock:</span> Your item is in
            stock in your selected size.
            <br />
            <span className="font-semibold">In-store Hold:</span> Your item will
            be held for 4 hours. Pay at pickup.
          </div>
        )}
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            setStep(2);
          }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              placeholder="Enter your phone number"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gray-900 text-white rounded-md font-semibold text-lg hover:bg-gray-800 transition-colors"
          >
            Continue
          </button>
        </form>
        {/* Reservation Summary (sidebar or below) */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">
            Reservation Summary
          </h3>
          <div className="flex items-center gap-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-16 h-20 object-cover rounded-lg"
            />
            <div>
              <div className="font-medium text-gray-900 text-sm">
                {product.name}
              </div>
              <div className="text-sm text-gray-500">{product.boutique}</div>
              <div className="text-lg font-bold text-gray-900 mt-1">
                ${product.price}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Confirmation with QR code
  if (step === 2) {
    return (
      <div className="max-w-lg mx-auto w-full text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Reservation Confirmed!
        </h2>
        <p className="text-gray-600 mb-6">
          Show this QR code when you arrive at the boutique.
        </p>
        <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
          <div className="text-center">
            <div className="text-2xl mb-1">📱</div>
            <div className="text-xs text-gray-500">QR Code</div>
          </div>
        </div>
        <div className="text-gray-700 text-center mt-2">
          <div className="font-medium">Pickup Address:</div>
          <div>
            {product.boutique}, {product.boutiqueLocation}
          </div>
        </div>
        {reservationType === 'hold' && (
          <div className="text-gray-700 text-center mt-2">
            <div className="font-medium">Pickup Window:</div>
            <div>4 hours from reservation</div>
          </div>
        )}
        {reservationType === 'prepay' && (
          <div className="text-gray-700 text-center mt-2">
            <div className="font-medium">Pickup Window:</div>
            <div>24 hours from reservation</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          ← Back to Results
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Reserve Your Item</h1>
        <p className="text-gray-600 mt-2">
          Complete your reservation for same-day pickup
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {[
            { number: 1, label: 'Item Details' },
            { number: 2, label: 'Your Info' },
            { number: 3, label: 'Confirmation' },
          ].map((s, index) => (
            <div key={s.number} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s.number
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > s.number ? '✓' : s.number}
              </div>
              <span
                className={`ml-2 text-sm ${
                  step >= s.number ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {s.label}
              </span>
              {index < 2 && (
                <div
                  className={`w-12 h-0.5 mx-4 ${
                    step > s.number ? 'bg-purple-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold mb-6">
                Item & Pickup Details
              </h2>

              <div className="space-y-6">
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="(555) 123-4567"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send you pickup confirmation and any updates
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Reservation Confirmed!
              </h2>
              <p className="text-gray-600 mb-6">
                Your item has been reserved. You'll receive a confirmation email
                shortly.
              </p>

              {/* QR Code Placeholder */}
              <div className="w-32 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
                <div className="text-center">
                  <div className="text-2xl mb-1">📱</div>
                  <div className="text-xs text-gray-500">QR Code</div>
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Show this QR code when you arrive at the boutique
              </p>
            </div>
          )}

          {/* Navigation */}
          {step < 3 && (
            <div className="flex justify-between mt-6">
              <button
                onClick={() => (step > 1 ? setStep(step - 1) : onBack())}
                className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← {step > 1 ? 'Previous' : 'Back to Results'}
              </button>

              {step < 2 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsSubmitting(true);
                    setTimeout(() => {
                      setIsSubmitting(false);
                      setStep(3);
                    }, 1000);
                  }}
                  disabled={!canProceed() || isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <span>Confirm Reservation</span>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Product Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">
              Reservation Summary
            </h3>

            <div className="space-y-4">
              {/* Product Image & Details */}
              <div className="flex space-x-3">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-16 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-500">{product.boutique}</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">
                    ${product.price}
                  </p>
                </div>
              </div>

              {/* Boutique Info */}
              <div className="border-t border-gray-100 pt-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">
                  Boutique:
                </h5>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="font-medium">{product.boutique}</div>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${i < Math.floor(product.boutiqueRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-xs">({product.boutiqueRating})</span>
                  </div>
                  <div>{product.boutiqueStyle} Style</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationFlow;
