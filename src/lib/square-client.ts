/**
 * Square API Client Configuration
 *
 * This client is configured for Square Sandbox environment.
 * For production, change SQUARE_ENVIRONMENT to 'production' in .env.local
 */

if (!process.env.SQUARE_ACCESS_TOKEN) {
  throw new Error('SQUARE_ACCESS_TOKEN is required in environment variables');
}

if (!process.env.SQUARE_APP_ID) {
  throw new Error('SQUARE_APP_ID is required in environment variables');
}

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_BASE_URL =
  process.env.SQUARE_ENVIRONMENT === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';

/**
 * Make HTTP request to Square API
 */
async function makeSquareRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${SQUARE_BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Square-Version': '2024-06-13',
    Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Square API error: ${response.status} ${errorText}`);
  }

  return await response.json();
}

/**
 * Catalog API methods
 */
export const catalogApi = {
  async list(params: any = {}) {
    const searchParams = new URLSearchParams();
    if (params.cursor) searchParams.append('cursor', params.cursor);
    if (params.types) searchParams.append('types', params.types);
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const endpoint = `/v2/catalog/list${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return await makeSquareRequest(endpoint);
  },

  async batchUpsert(data: any) {
    return await makeSquareRequest('/v2/catalog/batch-upsert', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async upsertCatalogObject(data: any) {
    return await makeSquareRequest('/v2/catalog/object', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async retrieveCatalogObject(objectId: string) {
    return await makeSquareRequest(`/v2/catalog/object/${objectId}`);
  },

  async searchCatalogObjects(data: any) {
    return await makeSquareRequest('/v2/catalog/search', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Locations API methods
 */
export const locationsApi = {
  async list() {
    return await makeSquareRequest('/v2/locations');
  },

  async retrieve(locationId: string) {
    return await makeSquareRequest(`/v2/locations/${locationId}`);
  },

  async create(data: any) {
    return await makeSquareRequest('/v2/locations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(locationId: string, data: any) {
    return await makeSquareRequest(`/v2/locations/${locationId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Orders API methods
 */
export const ordersApi = {
  async createOrder(data: any) {
    return await makeSquareRequest('/v2/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async retrieveOrder(orderId: string) {
    return await makeSquareRequest(`/v2/orders/${orderId}`);
  },

  async updateOrder(orderId: string, data: any) {
    return await makeSquareRequest(`/v2/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async listOrders(params: any = {}) {
    const searchParams = new URLSearchParams();
    if (params.locationIds)
      searchParams.append('location_ids', params.locationIds);
    if (params.cursor) searchParams.append('cursor', params.cursor);
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const endpoint = `/v2/orders/search${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return await makeSquareRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  },

  async calculateOrder(data: any) {
    return await makeSquareRequest('/v2/orders/calculate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Payments API methods
 */
export const paymentsApi = {
  async createPayment(data: any) {
    return await makeSquareRequest('/v2/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async retrievePayment(paymentId: string) {
    return await makeSquareRequest(`/v2/payments/${paymentId}`);
  },

  async listPayments(params: any = {}) {
    const searchParams = new URLSearchParams();
    if (params.beginTime) searchParams.append('begin_time', params.beginTime);
    if (params.endTime) searchParams.append('end_time', params.endTime);
    if (params.sortOrder) searchParams.append('sort_order', params.sortOrder);
    if (params.cursor) searchParams.append('cursor', params.cursor);
    if (params.locationId)
      searchParams.append('location_id', params.locationId);
    if (params.total) searchParams.append('total', params.total.toString());
    if (params.last4) searchParams.append('last_4', params.last4);
    if (params.cardBrand) searchParams.append('card_brand', params.cardBrand);
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const endpoint = `/v2/payments${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return await makeSquareRequest(endpoint);
  },

  async cancelPayment(paymentId: string, data: any = {}) {
    return await makeSquareRequest(`/v2/payments/${paymentId}/cancel`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async completePayment(paymentId: string, data: any = {}) {
    return await makeSquareRequest(`/v2/payments/${paymentId}/complete`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Inventory API methods
 */
export const inventoryApi = {
  async batchRetrieveCounts(data: any) {
    return await makeSquareRequest('/v2/inventory/counts/batch-retrieve', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async batchChangeInventory(data: any) {
    return await makeSquareRequest('/v2/inventory/changes/batch', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async retrieveInventoryCount(
    catalogObjectId: string,
    locationIds: string[],
    params: any = {}
  ) {
    const searchParams = new URLSearchParams();
    if (locationIds.length > 0)
      searchParams.append('location_ids', locationIds.join(','));
    if (params.cursor) searchParams.append('cursor', params.cursor);
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const endpoint = `/v2/inventory/counts/${catalogObjectId}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return await makeSquareRequest(endpoint);
  },

  async listInventoryChanges(params: any = {}) {
    const searchParams = new URLSearchParams();
    if (params.locationIds)
      searchParams.append('location_ids', params.locationIds);
    if (params.cursor) searchParams.append('cursor', params.cursor);
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const endpoint = `/v2/inventory/changes${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return await makeSquareRequest(endpoint);
  },
};

/**
 * Customers API methods
 */
export const customersApi = {
  async createCustomer(data: any) {
    return await makeSquareRequest('/v2/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async retrieveCustomer(customerId: string) {
    return await makeSquareRequest(`/v2/customers/${customerId}`);
  },

  async updateCustomer(customerId: string, data: any) {
    return await makeSquareRequest(`/v2/customers/${customerId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async listCustomers(params: any = {}) {
    const searchParams = new URLSearchParams();
    if (params.cursor) searchParams.append('cursor', params.cursor);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.sortField) searchParams.append('sort_field', params.sortField);
    if (params.sortOrder) searchParams.append('sort_order', params.sortOrder);
    if (params.filter) searchParams.append('filter', params.filter);

    const endpoint = `/v2/customers${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return await makeSquareRequest(endpoint);
  },

  async searchCustomers(data: any) {
    return await makeSquareRequest('/v2/customers/search', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Subscriptions API methods
 */
export const subscriptionsApi = {
  async createSubscription(data: any) {
    return await makeSquareRequest('/v2/subscriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async retrieveSubscription(subscriptionId: string) {
    return await makeSquareRequest(`/v2/subscriptions/${subscriptionId}`);
  },

  async listSubscriptions(params: any = {}) {
    const searchParams = new URLSearchParams();
    if (params.cursor) searchParams.append('cursor', params.cursor);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.locationId)
      searchParams.append('location_id', params.locationId);
    if (params.status) searchParams.append('status', params.status);

    const endpoint = `/v2/subscriptions${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return await makeSquareRequest(endpoint);
  },

  async cancelSubscription(subscriptionId: string, data: any = {}) {
    return await makeSquareRequest(
      `/v2/subscriptions/${subscriptionId}/cancel`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },
};

/**
 * Team API methods
 */
export const teamApi = {
  async listTeamMembers(params: any = {}) {
    const searchParams = new URLSearchParams();
    if (params.cursor) searchParams.append('cursor', params.cursor);
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.locationIds)
      searchParams.append('location_ids', params.locationIds);
    if (params.status) searchParams.append('status', params.status);

    const endpoint = `/v2/team-members${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    return await makeSquareRequest(endpoint);
  },

  async retrieveTeamMember(teamMemberId: string) {
    return await makeSquareRequest(`/v2/team-members/${teamMemberId}`);
  },

  async createTeamMember(data: any) {
    return await makeSquareRequest('/v2/team-members', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateTeamMember(teamMemberId: string, data: any) {
    return await makeSquareRequest(`/v2/team-members/${teamMemberId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Loyalty API methods
 */
export const loyaltyApi = {
  async createLoyaltyAccount(data: any) {
    return await makeSquareRequest('/v2/loyalty/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async retrieveLoyaltyAccount(accountId: string) {
    return await makeSquareRequest(`/v2/loyalty/accounts/${accountId}`);
  },

  async searchLoyaltyAccounts(data: any) {
    return await makeSquareRequest('/v2/loyalty/accounts/search', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async accumulateLoyaltyPoints(accountId: string, data: any) {
    return await makeSquareRequest(
      `/v2/loyalty/accounts/${accountId}/accumulate`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  async adjustLoyaltyPoints(accountId: string, data: any) {
    return await makeSquareRequest(`/v2/loyalty/accounts/${accountId}/adjust`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Gift Cards API methods
 */
export const giftCardsApi = {
  async createGiftCard(data: any) {
    return await makeSquareRequest('/v2/gift-cards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async retrieveGiftCard(giftCardId: string) {
    return await makeSquareRequest(`/v2/gift-cards/${giftCardId}`);
  },

  async linkCustomerToGiftCard(giftCardId: string, data: any) {
    return await makeSquareRequest(
      `/v2/gift-cards/${giftCardId}/link-customer`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  async unlinkCustomerFromGiftCard(giftCardId: string) {
    return await makeSquareRequest(
      `/v2/gift-cards/${giftCardId}/unlink-customer`,
      {
        method: 'POST',
        body: JSON.stringify({}),
      }
    );
  },
};

/**
 * Helper function to handle Square API errors
 */
export function handleSquareError(error: any): {
  success: false;
  error: string;
  details?: any;
} {
  console.error('Square API Error:', error);

  if (error.result?.errors) {
    const errorMessages = error.result.errors
      .map((err: any) => err.detail || err.code)
      .join(', ');
    return {
      success: false,
      error: errorMessages,
      details: error.result.errors,
    };
  }

  return {
    success: false,
    error: error.message || 'An unexpected error occurred with Square API',
    details: error,
  };
}

/**
 * Helper function to log API responses for debugging
 */
export function logApiResponse(operation: string, response: any): void {
  console.log(`[Square API] ${operation}:`, {
    success: true,
    data: response,
    timestamp: new Date().toISOString(),
  });
}
