import { NextRequest, NextResponse } from 'next/server';
import {
  subscriptionsApi,
  handleSquareError,
  logApiResponse,
} from '@/lib/square-client';

/**
 * GET /api/square/subscriptions
 *
 * Lists subscriptions with optional filtering
 *
 * Query Parameters:
 * - cursor: Pagination cursor
 * - limit: Number of subscriptions to return
 * - locationId: Location ID to filter by
 * - status: Subscription status (ACTIVE, PAUSED, CANCELLED, etc.)
 *
 * Example usage:
 * GET /api/square/subscriptions?status=ACTIVE&limit=10
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: any = {};

    if (searchParams.get('cursor')) params.cursor = searchParams.get('cursor');
    if (searchParams.get('limit'))
      params.limit = parseInt(searchParams.get('limit')!);
    if (searchParams.get('locationId'))
      params.locationId = searchParams.get('locationId');
    if (searchParams.get('status')) params.status = searchParams.get('status');

    console.log('[Square API] Fetching subscriptions with params:', params);

    const response = await subscriptionsApi.listSubscriptions(params);

    logApiResponse('List Subscriptions', response);

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
 * POST /api/square/subscriptions
 *
 * Creates a new subscription
 *
 * Request Body:
 * {
 *   "idempotency_key": "unique-key",
 *   "location_id": "location-id",
 *   "plan_id": "plan-id",
 *   "customer_id": "customer-id",
 *   "start_date": "2023-01-01",
 *   "card_id": "card-id"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[Square API] Creating subscription:', body);

    const response = await subscriptionsApi.createSubscription(body);

    logApiResponse('Create Subscription', response);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    const errorResponse = handleSquareError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
