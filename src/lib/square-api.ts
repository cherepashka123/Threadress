/**
 * Frontend Square API Utilities
 *
 * This file contains functions to interact with our Square API endpoints
 * from the frontend components.
 */

const API_BASE = '/api/square';

/**
 * Fetch catalog items from Square
 */
export async function fetchCatalogItems(params?: {
  cursor?: string;
  types?: string[];
  limit?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params?.cursor) searchParams.append('cursor', params.cursor);
  if (params?.types) searchParams.append('types', params.types.join(','));
  if (params?.limit) searchParams.append('limit', params.limit.toString());

  const response = await fetch(`${API_BASE}/catalog?${searchParams}`);
  return response.json();
}

/**
 * Create or update catalog items
 */
export async function upsertCatalogItem(data: {
  idempotencyKey: string;
  object: any;
}) {
  const response = await fetch(`${API_BASE}/catalog`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * Fetch store locations from Square
 */
export async function fetchLocations(params?: { limit?: number }) {
  const searchParams = new URLSearchParams();

  if (params?.limit) searchParams.append('limit', params.limit.toString());

  const response = await fetch(`${API_BASE}/locations?${searchParams}`);
  return response.json();
}

/**
 * Fetch inventory counts for catalog items
 */
export async function fetchInventory(params?: {
  locationIds?: string[];
  catalogObjectIds?: string[];
  cursor?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params?.locationIds)
    searchParams.append('locationIds', params.locationIds.join(','));
  if (params?.catalogObjectIds)
    searchParams.append('catalogObjectIds', params.catalogObjectIds.join(','));
  if (params?.cursor) searchParams.append('cursor', params.cursor);

  const response = await fetch(`${API_BASE}/inventory?${searchParams}`);
  return response.json();
}

/**
 * Adjust inventory counts
 */
export async function adjustInventory(data: {
  idempotencyKey: string;
  changes: any[];
}) {
  const response = await fetch(`${API_BASE}/inventory`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * Create a payment using Square
 */
export async function createPayment(data: {
  sourceId: string;
  idempotencyKey: string;
  amountMoney: {
    amount: number;
    currency: string;
  };
  locationId: string;
  note?: string;
}) {
  const response = await fetch(`${API_BASE}/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

/**
 * List payments (for admin/debugging)
 */
export async function listPayments(params?: {
  locationId?: string;
  beginTime?: string;
  endTime?: string;
  cursor?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params?.locationId) searchParams.append('locationId', params.locationId);
  if (params?.beginTime) searchParams.append('beginTime', params.beginTime);
  if (params?.endTime) searchParams.append('endTime', params.endTime);
  if (params?.cursor) searchParams.append('cursor', params.cursor);

  const response = await fetch(`${API_BASE}/payments?${searchParams}`);
  return response.json();
}

/**
 * Sandbox test card nonces for testing payments
 */
export const SANDBOX_TEST_CARDS = {
  valid: 'cnon:card-nonce-ok',
  expired: 'cnon:card-nonce-expired',
  insufficientFunds: 'cnon:card-nonce-insufficient-funds',
  declined: 'cnon:card-nonce-declined',
  processingError: 'cnon:card-nonce-processing-error',
  cvvFailure: 'cnon:card-nonce-cvv-failure',
  invalidExpiry: 'cnon:card-nonce-invalid-expiry',
} as const;
