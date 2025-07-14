import { NextRequest, NextResponse } from 'next/server';
import {
  teamApi,
  handleSquareError,
  logApiResponse,
} from '@/lib/square-client';

/**
 * GET /api/square/team
 *
 * Lists team members with optional filtering
 *
 * Query Parameters:
 * - cursor: Pagination cursor
 * - limit: Number of team members to return
 * - locationIds: Comma-separated list of location IDs to filter by
 * - status: Team member status (ACTIVE, INACTIVE)
 *
 * Example usage:
 * GET /api/square/team?status=ACTIVE&limit=10
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params: any = {};

    if (searchParams.get('cursor')) params.cursor = searchParams.get('cursor');
    if (searchParams.get('limit'))
      params.limit = parseInt(searchParams.get('limit')!);
    if (searchParams.get('locationIds'))
      params.locationIds = searchParams.get('locationIds');
    if (searchParams.get('status')) params.status = searchParams.get('status');

    console.log('[Square API] Fetching team members with params:', params);

    const response = await teamApi.listTeamMembers(params);

    logApiResponse('List Team Members', response);

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
 * POST /api/square/team
 *
 * Creates a new team member
 *
 * Request Body:
 * {
 *   "idempotency_key": "unique-key",
 *   "team_member": {
 *     "given_name": "John",
 *     "family_name": "Doe",
 *     "email_address": "john.doe@example.com",
 *     "phone_number": "+1234567890",
 *     "location_ids": ["location-id"],
 *     "status": "ACTIVE",
 *     "role_ids": ["role-id"]
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('[Square API] Creating team member:', body);

    const response = await teamApi.createTeamMember(body);

    logApiResponse('Create Team Member', response);

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    const errorResponse = handleSquareError(error);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
