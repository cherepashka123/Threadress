import { NextRequest, NextResponse } from 'next/server';
import {
  paymentsApi,
  handleSquareError,
  logApiResponse,
} from '@/lib/square-client';

/**
 * POST /api/square/payments
 *
 * Creates a new payment
 *
 * Request Body:
 * {
 *   "source_id": "cnon:card-nonce-ok",
 *   "idempotency_key": "unique-key",
 *   "amount_money": {
 *     "amount": 1000,
 *     "currency": "USD"
 *   },
 *   "location_id": "location-id",
 *   "note": "Payment note"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[Square API] Creating payment:', body);

    const response = await paymentsApi.createPayment(body);

    logApiResponse('Create Payment', response);

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
 * GET /api/square/payments
 *
 * Lists payments with optional filtering
 *
 * Query Parameters:
 * - beginTime: Start time for payment search (ISO 8601 format)
 * - endTime: End time for payment search (ISO 8601 format)
 * - sortOrder: Sort order (ASC, DESC)
 * - cursor: Pagination cursor
 * - locationId: Location ID to filter by
 * - total: Payment total amount
 * - last4: Last 4 digits of card
 * - cardBrand: Card brand (VISA, MASTERCARD, etc.)
 * - limit: Number of payments to return
 *
 * Example usage:
 * GET /api/square/payments?locationId=ABC123&limit=10&sortOrder=DESC
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: any = {};

    if (searchParams.get('beginTime'))
      params.beginTime = searchParams.get('beginTime');
    if (searchParams.get('endTime'))
      params.endTime = searchParams.get('endTime');
    if (searchParams.get('sortOrder'))
      params.sortOrder = searchParams.get('sortOrder');
    if (searchParams.get('cursor')) params.cursor = searchParams.get('cursor');
    if (searchParams.get('locationId'))
      params.locationId = searchParams.get('locationId');
    if (searchParams.get('total'))
      params.total = parseInt(searchParams.get('total')!);
    if (searchParams.get('last4')) params.last4 = searchParams.get('last4');
    if (searchParams.get('cardBrand'))
      params.cardBrand = searchParams.get('cardBrand');
    if (searchParams.get('limit'))
      params.limit = parseInt(searchParams.get('limit')!);

    console.log('[Square API] Fetching payments with params:', params);

    const response = await paymentsApi.listPayments(params);

    logApiResponse('List Payments', response);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    const errorResponse = handleSquareError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
