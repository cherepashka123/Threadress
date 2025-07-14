# Square API Integration Documentation

This document explains how to use the Square API integration in your Next.js application.

## Setup

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
SQUARE_APP_ID=sandbox-sq0idb-UDZYLAFrbs5CMChaXN-FgQ
SQUARE_ACCESS_TOKEN=EAAAlyXYB_mnr6bObo0k1_Yr184lCCtbjztPJjbz4OvRcchU_X1mSABljMfWbCw2
SQUARE_ENVIRONMENT=sandbox
```

### 2. Dependencies

The Square SDK is already installed:

```bash
npm install square
```

## API Endpoints

### Catalog API (`/api/square/catalog`)

#### GET - Fetch Catalog Items

```javascript
// Frontend usage
import { fetchCatalogItems } from '@/lib/square-api';

const response = await fetchCatalogItems({
  types: ['ITEM'],
  limit: 10,
});
```

#### POST - Create/Update Catalog Items

```javascript
// Frontend usage
import { upsertCatalogItem } from '@/lib/square-api';

const response = await upsertCatalogItem({
  idempotencyKey: 'unique-key',
  object: {
    type: 'ITEM',
    id: '#item-id',
    itemData: {
      name: 'Product Name',
      description: 'Product Description',
      variations: [...],
      categoryId: 'category-id'
    }
  }
});
```

### Locations API (`/api/square/locations`)

#### GET - Fetch Store Locations

```javascript
// Frontend usage
import { fetchLocations } from '@/lib/square-api';

const response = await fetchLocations();
```

### Inventory API (`/api/square/inventory`)

#### GET - Fetch Inventory Counts

```javascript
// Frontend usage
import { fetchInventory } from '@/lib/square-api';

const response = await fetchInventory({
  locationIds: ['location-id'],
  catalogObjectIds: ['item-id'],
});
```

#### POST - Adjust Inventory

```javascript
// Frontend usage
import { adjustInventory } from '@/lib/square-api';

const response = await adjustInventory({
  idempotencyKey: 'unique-key',
  changes: [
    {
      type: 'ADJUSTMENT',
      adjustment: {
        locationId: 'location-id',
        catalogObjectId: 'item-id',
        quantity: '5',
        occurredAt: '2023-01-01T00:00:00Z',
        fromState: 'IN_STOCK',
        toState: 'SOLD',
      },
    },
  ],
});
```

### Payments API (`/api/square/payments`)

#### POST - Create Payment

```javascript
// Frontend usage
import { createPayment, SANDBOX_TEST_CARDS } from '@/lib/square-api';

const response = await createPayment({
  sourceId: SANDBOX_TEST_CARDS.valid,
  idempotencyKey: 'unique-key',
  amountMoney: {
    amount: 1000, // $10.00
    currency: 'USD',
  },
  locationId: 'location-id',
  note: 'Payment for order #123',
});
```

#### GET - List Payments

```javascript
// Frontend usage
import { listPayments } from '@/lib/square-api';

const response = await listPayments({
  locationId: 'location-id',
});
```

## Sandbox Testing

### Test Card Nonces

Use these predefined test card nonces for payment testing:

```javascript
import { SANDBOX_TEST_CARDS } from '@/lib/square-api';

// Available test cards:
SANDBOX_TEST_CARDS.valid; // Successful payment
SANDBOX_TEST_CARDS.expired; // Expired card
SANDBOX_TEST_CARDS.insufficientFunds; // Insufficient funds
SANDBOX_TEST_CARDS.declined; // Declined card
SANDBOX_TEST_CARDS.processingError; // Processing error
SANDBOX_TEST_CARDS.cvvFailure; // CVV failure
SANDBOX_TEST_CARDS.invalidExpiry; // Invalid expiry
```

### Demo Component

Use the `SquareDemo` component to test all API endpoints:

```javascript
import SquareDemo from '@/components/SquareDemo';

// In your page component
<SquareDemo />;
```

## Error Handling

All API endpoints include comprehensive error handling:

```javascript
try {
  const response = await fetchCatalogItems();
  if (response.success) {
    // Handle success
    console.log(response.data);
  } else {
    // Handle error
    console.error(response.error);
  }
} catch (error) {
  // Handle network/other errors
  console.error('Request failed:', error);
}
```

## Logging

All API calls are logged to the console for debugging:

- Backend logs: Check your terminal/server logs
- Frontend logs: Check browser console
- API responses: Logged with timestamps and operation names

## Security Notes

1. **Environment Variables**: Never commit `.env.local` to version control
2. **Sandbox Only**: This integration uses Square Sandbox for safe testing
3. **Idempotency Keys**: Always use unique idempotency keys for POST requests
4. **Error Handling**: Always handle API errors gracefully in production

## Production Considerations

When moving to production:

1. Change `SQUARE_ENVIRONMENT` to `production`
2. Use production Square credentials
3. Implement proper error handling and retry logic
4. Add rate limiting and request validation
5. Implement webhook handling for real-time updates
6. Add proper logging and monitoring

## Troubleshooting

### Common Issues

1. **Invalid Access Token**: Ensure your Square access token is correct
2. **Location ID Required**: Some operations require a valid location ID
3. **Idempotency Key Conflicts**: Use unique keys for each request
4. **Sandbox Limitations**: Some features may not work in sandbox mode

### Debug Steps

1. Check environment variables are loaded correctly
2. Verify Square credentials in Square Dashboard
3. Check browser console for detailed error messages
4. Review server logs for backend errors
5. Test with the demo component first

## Additional Resources

- [Square API Documentation](https://developer.squareup.com/docs)
- [Square Sandbox Guide](https://developer.squareup.com/docs/testing/sandbox)
- [Square Node.js SDK](https://github.com/square/square-nodejs-sdk)
