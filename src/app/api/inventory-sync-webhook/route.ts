import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Webhook endpoint for automatic sync when Google Sheets is updated
 * 
 * This can be called by:
 * 1. Google Apps Script (when sheet changes)
 * 2. Scheduled cron jobs
 * 3. External automation tools
 * 
 * Usage:
 * - POST to /api/inventory-sync-webhook
 * - Optional: Include webhook secret in header for security
 */
export async function POST(req: NextRequest) {
  try {
    // Optional: Verify webhook secret for security
    const webhookSecret = req.headers.get('x-webhook-secret');
    const expectedSecret = process.env.SYNC_WEBHOOK_SECRET;

    if (expectedSecret && webhookSecret !== expectedSecret) {
      return NextResponse.json(
        { ok: false, error: 'Invalid webhook secret' },
        { status: 401 }
      );
    }

    // Trigger sync by calling the sync endpoint internally
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const syncUrl = `${baseUrl}/api/inventory-sync`;

    console.log('🔄 Webhook triggered - starting automatic sync...');

    try {
      const response = await fetch(syncUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (data.ok) {
        console.log(`✅ Automatic sync completed: ${data.message}`);
        return NextResponse.json({
          ok: true,
          message: 'Sync triggered successfully',
          syncResult: data,
        });
      } else {
        console.error('❌ Sync failed:', data.error);
        return NextResponse.json(
          {
            ok: false,
            error: 'Sync failed',
            details: data,
          },
          { status: 500 }
        );
      }
    } catch (syncError: any) {
      console.error('Error calling sync endpoint:', syncError);
      return NextResponse.json(
        {
          ok: false,
          error: 'Failed to trigger sync',
          details: syncError.message,
        },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error('Webhook error:', err?.message || err);
    return NextResponse.json(
      {
        ok: false,
        error: 'Webhook processing failed',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Allow GET requests for testing the webhook
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: 'Inventory sync webhook endpoint',
    usage: {
      method: 'POST',
      endpoint: '/api/inventory-sync-webhook',
      description: 'Triggers automatic sync of Google Sheets to Qdrant',
      headers: {
        'x-webhook-secret': 'Optional: Webhook secret for security',
      },
    },
    note: 'To enable automatic syncing, set up Google Apps Script or a cron job to call this endpoint when sheets are updated.',
  });
}

