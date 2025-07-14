import { NextRequest, NextResponse } from 'next/server';
import {
  locationsApi,
  handleSquareError,
  logApiResponse,
} from '@/lib/square-client';

/**
 * GET /api/square/locations
 *
 * Fetches all locations for the Square account
 *
 * Example usage:
 * GET /api/square/locations
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[Square API] Fetching locations');

    const response = await locationsApi.list();
    console.log(
      '[Square API] locationsApi.list() response:',
      JSON.stringify(response, null, 2)
    );

    // The Square SDK returns locations directly in the response
    const locations = response.locations || [];

    logApiResponse('List Locations', response);

    return NextResponse.json({
      success: true,
      data: { locations },
    });
  } catch (error) {
    return NextResponse.json(handleSquareError(error), { status: 400 });
  }
}
