import { NextRequest, NextResponse } from 'next/server';
import {
  ordersApi,
  handleSquareError,
  logApiResponse,
} from '@/lib/square-client';

/**
 * POST /api/square/orders
 *
 * Creates a new order in Square
 *
 * Request Body:
 * {
 *   "order": {
 *     "location_id": "location-id",
 *     "line_items": [
 *       {
 *         "quantity": "1",
 *         "catalog_object_id": "item-variation-id",
 *         "base_price_money": {
 *           "amount": 1000,
 *           "currency": "USD"
 *         }
 *       }
 *     ]
 *   },
 *   "idempotency_key": "unique-key"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[Square API] Creating order:', body);

    const response = await ordersApi.createOrder(body);

    logApiResponse('Create Order', response);

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
 * GET /api/square/orders
 *
 * Lists orders (not implemented in this demo)
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error: 'Order listing not implemented in this demo',
    },
    { status: 501 }
  );
}
