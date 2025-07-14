import { NextRequest, NextResponse } from 'next/server';
import {
  giftCardsApi,
  handleSquareError,
  logApiResponse,
} from '@/lib/square-client';

/**
 * GET /api/square/gift-cards
 *
 * Lists gift cards (not directly supported by Square API)
 * This endpoint provides information about gift card functionality
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[Square API] Gift cards listing not directly supported');

    return NextResponse.json({
      success: true,
      data: {
        message: 'Gift card listing requires individual retrieval by ID',
        features: [
          'Create gift cards',
          'Retrieve gift card by ID',
          'Link/unlink customers to gift cards',
          'Gift card balance tracking',
        ],
      },
    });
  } catch (error) {
    const errorResponse = handleSquareError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}

/**
 * POST /api/square/gift-cards
 *
 * Creates a new gift card
 *
 * Request Body:
 * {
 *   "idempotency_key": "unique-key",
 *   "gift_card": {
 *     "type": "DIGITAL",
 *     "gan_source": "SQUARE"
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[Square API] Creating gift card:', body);

    const response = await giftCardsApi.createGiftCard(body);

    logApiResponse('Create Gift Card', response);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    const errorResponse = handleSquareError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
