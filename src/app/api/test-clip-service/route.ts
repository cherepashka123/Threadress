import { NextRequest, NextResponse } from 'next/server';
import { checkClipService } from '@/lib/clip-direct';
import { embedTextSingle } from '@/lib/clip-direct';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const clipServiceUrl = process.env.CLIP_SERVICE_URL || 'not set';
    
    // Check if service is available
    const isAvailable = await checkClipService();
    
    // Try to get an embedding
    let embeddingTest: any = null;
    let embeddingError: string | null = null;
    
    try {
      const testEmbedding = await embedTextSingle('test query');
      embeddingTest = {
        success: true,
        dimensions: testEmbedding.length,
        isNonZero: testEmbedding.some((v: number) => v !== 0),
        sample: testEmbedding.slice(0, 5),
      };
    } catch (error) {
      embeddingError = error instanceof Error ? error.message : String(error);
    }
    
    return NextResponse.json({
      ok: true,
      clipServiceUrl,
      isAvailable,
      embeddingTest,
      embeddingError,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL ? 'true' : 'false',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

