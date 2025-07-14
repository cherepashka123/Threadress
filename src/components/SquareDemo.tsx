'use client';

import { useState } from 'react';
import {
  fetchCatalogItems,
  fetchLocations,
  fetchInventory,
  createPayment,
  SANDBOX_TEST_CARDS,
} from '@/lib/square-api';

/**
 * Square API Demo Component
 *
 * This component demonstrates how to use the Square API endpoints
 * for fetching inventory and creating payments with sandbox data.
 */
export default function SquareDemo() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchCatalog = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchCatalogItems({
        types: ['ITEM'],
        limit: 10,
      });
      setResults(response);
      console.log('Catalog items:', response);
    } catch (err) {
      setError('Failed to fetch catalog items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchLocations();
      setResults(response);
      console.log('Locations:', response);
    } catch (err) {
      setError('Failed to fetch locations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchInventory({
        locationIds: ['YOUR_LOCATION_ID'], // Replace with actual location ID
        catalogObjectIds: ['YOUR_ITEM_ID'], // Replace with actual item ID
      });
      setResults(response);
      console.log('Inventory:', response);
    } catch (err) {
      setError('Failed to fetch inventory');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayment = async (
    cardType: keyof typeof SANDBOX_TEST_CARDS
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createPayment({
        sourceId: SANDBOX_TEST_CARDS[cardType],
        idempotencyKey: `payment-${Date.now()}`,
        amountMoney: {
          amount: 1000, // $10.00
          currency: 'USD',
        },
        locationId: 'YOUR_LOCATION_ID', // Replace with actual location ID
        note: `Test payment with ${cardType} card`,
      });
      setResults(response);
      console.log('Payment result:', response);
    } catch (err) {
      setError(`Failed to create payment with ${cardType} card`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Square API Demo
        </h2>
        <p className="text-gray-600 mb-6">
          This demo shows how to integrate Square API functionality into your
          Next.js app. All operations use Square Sandbox data for safe testing.
        </p>

        {/* API Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Catalog Operations
            </h3>
            <button
              onClick={handleFetchCatalog}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch Catalog Items'}
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Location Operations
            </h3>
            <button
              onClick={handleFetchLocations}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch Locations'}
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Inventory Operations
            </h3>
            <button
              onClick={handleFetchInventory}
              disabled={loading}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Fetch Inventory'}
            </button>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Payment Operations
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleCreatePayment('valid')}
                disabled={loading}
                className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
              >
                Valid Card
              </button>
              <button
                onClick={() => handleCreatePayment('declined')}
                disabled={loading}
                className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
              >
                Declined Card
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold">Error</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Results Display */}
        {results && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-gray-800 font-semibold mb-3">API Response</h3>
            <pre className="bg-white p-4 rounded border text-sm overflow-auto max-h-96">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}

        {/* Documentation */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-semibold mb-2">Usage Notes</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>
              • Replace 'YOUR_LOCATION_ID' with actual location ID from Square
              Dashboard
            </li>
            <li>• Replace 'YOUR_ITEM_ID' with actual catalog item ID</li>
            <li>
              • All payments use sandbox test card nonces for safe testing
            </li>
            <li>• Check browser console for detailed API logs</li>
            <li>• Environment variables must be set in .env.local</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
