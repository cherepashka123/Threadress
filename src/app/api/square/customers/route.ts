import { NextRequest, NextResponse } from 'next/server';
import {
  customersApi,
  handleSquareError,
  logApiResponse,
} from '@/lib/square-client';

/**
 * GET /api/square/customers
 *
 * Lists customers with optional filtering
 *
 * Query Parameters:
 * - cursor: Pagination cursor
 * - limit: Number of customers to return
 * - sortField: Field to sort by (CREATED_AT, UPDATED_AT, etc.)
 * - sortOrder: Sort order (ASC, DESC)
 *
 * Example usage:
 * GET /api/square/customers?limit=10&sortField=CREATED_AT&sortOrder=DESC
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: any = {};

    if (searchParams.get('cursor')) params.cursor = searchParams.get('cursor');
    if (searchParams.get('limit'))
      params.limit = parseInt(searchParams.get('limit')!);
    if (searchParams.get('sortField'))
      params.sortField = searchParams.get('sortField');
    if (searchParams.get('sortOrder'))
      params.sortOrder = searchParams.get('sortOrder');
    if (searchParams.get('filter')) params.filter = searchParams.get('filter');

    console.log('[Square API] Fetching customers with params:', params);

    const response = await customersApi.listCustomers(params);

    logApiResponse('List Customers', response);

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
 * POST /api/square/customers
 *
 * Creates a new customer
 *
 * Request Body:
 * {
 *   "idempotency_key": "unique-key",
 *   "given_name": "John",
 *   "family_name": "Doe",
 *   "email_address": "john.doe@example.com",
 *   "phone_number": "+1234567890",
 *   "address": {
 *     "address_line_1": "123 Main St",
 *     "locality": "San Francisco",
 *     "administrative_district_level_1": "CA",
 *     "postal_code": "94102",
 *     "country": "US"
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[Square API] Creating customer:', body);

    const response = await customersApi.createCustomer(body);

    logApiResponse('Create Customer', response);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    const errorResponse = handleSquareError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
