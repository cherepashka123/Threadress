import { NextRequest, NextResponse } from 'next/server';
import {
  loyaltyApi,
  handleSquareError,
  logApiResponse,
} from '@/lib/square-client';

/**
 * GET /api/square/loyalty
 *
 * Search loyalty accounts
 *
 * Query Parameters:
 * - cursor: Pagination cursor
 * - limit: Number of loyalty accounts to return
 *
 * Example usage:
 * GET /api/square/loyalty?limit=10
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: any = {};

    if (searchParams.get('cursor')) params.cursor = searchParams.get('cursor');
    if (searchParams.get('limit'))
      params.limit = parseInt(searchParams.get('limit')!);

    console.log('[Square API] Searching loyalty accounts with params:', params);

    const searchData = {
      query: {
        filter: {
          customer_ids: [], // Empty to get all accounts
        },
      },
      limit: params.limit || 10,
      cursor: params.cursor,
    };

    const response = await loyaltyApi.searchLoyaltyAccounts(searchData);

    logApiResponse('Search Loyalty Accounts', response);

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
 * POST /api/square/loyalty
 *
 * Creates a new loyalty account
 *
 * Request Body:
 * {
 *   "loyalty_account": {
 *     "program_id": "program-id",
 *     "customer_id": "customer-id"
 *   },
 *   "idempotency_key": "unique-key"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[Square API] Creating loyalty account:', body);

    const response = await loyaltyApi.createLoyaltyAccount(body);

    logApiResponse('Create Loyalty Account', response);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    const errorResponse = handleSquareError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
