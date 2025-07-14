import { NextRequest, NextResponse } from 'next/server';
import {
  catalogApi,
  handleSquareError,
  logApiResponse,
} from '@/lib/square-client';

/**
 * GET /api/square/catalog
 *
 * Fetches catalog items from Square
 *
 * Query Parameters:
 * - cursor: Pagination cursor
 * - types: Comma-separated list of catalog types (ITEM, CATEGORY, etc.)
 *
 * Example usage:
 * GET /api/square/catalog?types=ITEM
 * GET /api/square/catalog?cursor=abc123&types=ITEM,CATEGORY
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor') || undefined;
    const types = searchParams.get('types') || undefined; // e.g., 'ITEM'

    console.log('[Square API] Fetching catalog items with:', { cursor, types });

    // Use the SDK's method as intended
    const params: any = {};
    if (cursor) params.cursor = cursor;
    if (types) params.types = types;
    const response = await catalogApi.list(params);

    logApiResponse('List Catalog', response);

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
 * POST /api/square/catalog
 *
 * Creates or updates catalog items
 *
 * Request Body:
 * {
 *   "idempotencyKey": "unique-key",
 *   "object": {
 *     "type": "ITEM",
 *     "id": "#item-id",
 *     "itemData": {
 *       "name": "Product Name",
 *       "description": "Product Description",
 *       "variations": [...],
 *       "categoryId": "category-id"
 *     }
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[Square API] Creating/updating catalog item:', body);

    const response = await catalogApi.batchUpsert(body);

    logApiResponse('Batch Upsert Catalog Objects', response);

    return NextResponse.json({
      success: true,
      data: response,
      catalogObject: response.idMappings,
    });
  } catch (error) {
    const errorResponse = handleSquareError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
