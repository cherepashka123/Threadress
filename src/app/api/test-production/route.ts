import { NextRequest, NextResponse } from 'next/server';
import { checkClipService } from '@/lib/clip-direct';

export const dynamic = 'force-dynamic';

/**
 * Diagnostic endpoint to check production setup
 */
export async function GET(req: NextRequest) {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL ? 'true' : 'false',
    },
    envVars: {
      CLIP_SERVICE_URL: process.env.CLIP_SERVICE_URL ? 'SET' : 'NOT SET',
      HF_TOKEN: process.env.HF_TOKEN ? 'SET' : 'NOT SET',
      QDRANT_URL: process.env.QDRANT_URL ? 'SET' : 'NOT SET',
      QDRANT_API_KEY: process.env.QDRANT_API_KEY ? 'SET' : 'NOT SET',
    },
    clipService: {
      url: process.env.CLIP_SERVICE_URL || 'not set',
      status: 'unknown',
      error: null as string | null,
    },
    qdrant: {
      connected: false,
      error: null as string | null,
    },
  };

  // Test CLIP service connection
  if (process.env.CLIP_SERVICE_URL) {
    try {
      const isAvailable = await checkClipService();
      diagnostics.clipService.status = isAvailable ? 'available' : 'unavailable';
      
      if (isAvailable) {
        // Test actual embedding
        try {
          const testUrl = `${process.env.CLIP_SERVICE_URL}/embed/text`;
          const response = await fetch(testUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: 'test' }),
            signal: AbortSignal.timeout(5000),
          });
          
          if (response.ok) {
            const data = await response.json();
            diagnostics.clipService.embeddingTest = {
              success: true,
              dimension: data.embedding?.length || 0,
              hasNonZero: data.embedding?.some((v: number) => v !== 0) || false,
            };
          } else {
            diagnostics.clipService.embeddingTest = {
              success: false,
              error: `HTTP ${response.status}`,
            };
          }
        } catch (testError: any) {
          diagnostics.clipService.embeddingTest = {
            success: false,
            error: testError.message,
          };
        }
      }
    } catch (error: any) {
      diagnostics.clipService.status = 'error';
      diagnostics.clipService.error = error.message;
    }
  } else {
    diagnostics.clipService.status = 'not configured';
    diagnostics.clipService.error = 'CLIP_SERVICE_URL environment variable not set';
  }

  // Test Qdrant connection
  try {
    const { qdrant, INVENTORY_COLLECTION } = await import('@/lib/qdrant');
    const collections = await qdrant.getCollections();
    diagnostics.qdrant.connected = true;
    diagnostics.qdrant.collections = collections.collections?.map(c => c.name) || [];
    
    // Check inventory collection
    try {
      const info = await qdrant.getCollection(INVENTORY_COLLECTION);
      diagnostics.qdrant.inventory = {
        exists: true,
        pointsCount: info.points_count || 0,
      };
    } catch (collError: any) {
      diagnostics.qdrant.inventory = {
        exists: false,
        error: collError.message,
      };
    }
  } catch (qdrantError: any) {
    diagnostics.qdrant.connected = false;
    diagnostics.qdrant.error = qdrantError.message;
  }

  // Test embedding generation
  try {
    const { embedTextSingle } = await import('@/lib/clip-advanced');
    const testEmbedding = await embedTextSingle('test query');
    diagnostics.embedding = {
      success: true,
      dimension: testEmbedding.length,
      hasNonZero: testEmbedding.some(v => v !== 0),
    };
  } catch (embedError: any) {
    diagnostics.embedding = {
      success: false,
      error: embedError.message,
    };
  }

  return NextResponse.json({
    ok: diagnostics.clipService.status === 'available' && diagnostics.qdrant.connected,
    diagnostics,
    recommendations: [] as string[],
  });
}

