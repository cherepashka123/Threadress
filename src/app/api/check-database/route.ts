import { NextRequest, NextResponse } from 'next/server';
import { qdrant, INVENTORY_COLLECTION, getCollectionInfo } from '@/lib/qdrant';

export const dynamic = 'force-dynamic';

/**
 * Diagnostic endpoint to check database status
 * Helps debug why no items are showing in production
 */
export async function GET(req: NextRequest) {
  try {
    const checks: any = {
      environment: {
        HF_TOKEN: !!process.env.HF_TOKEN,
        QDRANT_URL: !!process.env.QDRANT_URL,
        QDRANT_API_KEY: !!process.env.QDRANT_API_KEY,
      },
      qdrant: null,
      collection: null,
      sample: null,
    };

    // Check Qdrant connection
    try {
      const collections = await qdrant.getCollections();
      checks.qdrant = {
        connected: true,
        collections: collections.collections?.map((c: any) => c.name) || [],
      };
    } catch (error: any) {
      checks.qdrant = {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      return NextResponse.json({
        ok: false,
        checks,
        message: 'Qdrant connection failed',
      });
    }

    // Check collection exists and has data
    try {
      const info = await getCollectionInfo();
      checks.collection = {
        exists: true,
        name: info.collection_name,
        points_count: info.points_count,
        vector_size: info.config?.params?.vectors?.combined?.size || 'unknown',
      };

      // Get sample points to verify data
      if (info.points_count > 0) {
        const sample = await qdrant.scroll(INVENTORY_COLLECTION, {
          limit: 3,
          with_payload: true,
          with_vector: false,
        });
        checks.sample = {
          count: sample.points?.length || 0,
          items: sample.points?.slice(0, 2).map((p: any) => ({
            id: p.id,
            title: p.payload?.title || 'No title',
            brand: p.payload?.brand || 'No brand',
          })),
        };
      } else {
        checks.sample = {
          count: 0,
          message: 'Collection is empty - data needs to be synced',
        };
      }
    } catch (error: any) {
      checks.collection = {
        exists: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    const allGood = 
      checks.environment.HF_TOKEN &&
      checks.environment.QDRANT_URL &&
      checks.environment.QDRANT_API_KEY &&
      checks.qdrant?.connected &&
      checks.collection?.exists &&
      (checks.collection?.points_count || 0) > 0;

    return NextResponse.json({
      ok: allGood,
      checks,
      message: allGood
        ? 'Database is ready!'
        : 'Database check failed - see details below',
      recommendations: [
        !checks.environment.HF_TOKEN && 'Add HF_TOKEN to Vercel environment variables',
        !checks.environment.QDRANT_URL && 'Add QDRANT_URL to Vercel environment variables',
        !checks.environment.QDRANT_API_KEY && 'Add QDRANT_API_KEY to Vercel environment variables',
        !checks.qdrant?.connected && 'Check Qdrant connection - verify URL and API key',
        !checks.collection?.exists && 'Collection does not exist - run sync first',
        checks.collection?.points_count === 0 && 'Collection is empty - sync data from Google Sheets',
      ].filter(Boolean),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Diagnostic check failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

