import { NextRequest, NextResponse } from 'next/server';
import {
  inventoryApi,
  handleSquareError,
  logApiResponse,
} from '@/lib/square-client';

/**
 * GET /api/square/inventory
 *
 * Fetches inventory counts for catalog items
 *
 * Query Parameters:
 * - location_ids: Comma-separated list of location IDs
 * - catalog_object_ids: Comma-separated list of catalog object IDs
 * - cursor: Pagination cursor
 *
 * Example usage:
 * GET /api/square/inventory?location_ids=ABC123&catalog_object_ids=ITEM1,ITEM2
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locationIds = searchParams.get('location_ids');
    const catalogObjectIds = searchParams.get('catalog_object_ids');
    const cursor = searchParams.get('cursor');

    const requestParams: any = {};

    if (locationIds) {
      requestParams.location_ids = locationIds.split(',');
    }

    if (catalogObjectIds) {
      requestParams.catalog_object_ids = catalogObjectIds.split(',');
    }

    if (cursor) {
      requestParams.cursor = cursor;
    }

    console.log('[Square API] Fetching inventory with params:', requestParams);

    const response = await inventoryApi.batchRetrieveCounts(requestParams);

    logApiResponse('Batch Retrieve Inventory Counts', response);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    const errorResponse = handleSquareError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}

/**
 * POST /api/square/inventory
 *
 * Adjusts inventory counts for catalog items
 *
 * Request Body:
 * {
 *   "idempotencyKey": "unique-key",
 *   "changes": [
 *     {
 *       "type": "ADJUSTMENT",
 *       "adjustment": {
 *         "locationId": "location-id",
 *         "catalogObjectId": "item-id",
 *         "quantity": "5",
 *         "occurredAt": "2023-01-01T00:00:00Z",
 *         "fromState": "IN_STOCK",
 *         "toState": "SOLD"
 *       }
 *     }
 *   ]
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[Square API] Adjusting inventory:', body);

    const response = await inventoryApi.batchChangeInventory(body);

    logApiResponse('Batch Change Inventory', response);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    const errorResponse = handleSquareError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
