import { NextRequest, NextResponse } from 'next/server';
import { qdrant, INVENTORY_COLLECTION } from '@/lib/qdrant';
import {
  embedAdvancedMultimodalQuery,
  embedTextSingle,
  embedImageSingle,
} from '@/lib/clip-advanced';

export const dynamic = 'force-dynamic';

/**
 * Optimized search endpoint using CLIP Advanced with typo tolerance and vibe understanding
 * Returns most curated results - no filters, just the best matches
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const imageUrl = searchParams.get('imageUrl') || '';
    const k = parseInt(searchParams.get('k') || '20', 10);

    if (!q.trim() && !imageUrl.trim()) {
      return NextResponse.json({
        ok: true,
        message: 'No search query or image provided',
        hits: [],
      });
    }

    console.log(`CLIP Advanced search:`, {
      query: q,
      imageUrl: imageUrl ? 'provided' : 'not provided',
      k,
    });

    // Generate query embeddings using CLIP Advanced (with typo tolerance and vibe understanding)
    let queryVector: number[];
    let visualAnalysis: any;
    let styleContext: any;
    let enhancedQuery: string | undefined;

    if (q.trim() && imageUrl.trim()) {
      // Both text and image - full multimodal search
      const clipResult = await embedAdvancedMultimodalQuery(q, imageUrl);
      queryVector = clipResult.combinedVector;
      visualAnalysis = clipResult.visualAnalysis;
      styleContext = clipResult.styleContext;
      enhancedQuery = clipResult.enhancedQuery;
    } else if (q.trim()) {
      // Text only - use CLIP Advanced with vibe understanding
      const clipResult = await embedAdvancedMultimodalQuery(q);
      queryVector = clipResult.combinedVector;
      visualAnalysis = clipResult.visualAnalysis;
      styleContext = clipResult.styleContext;
      enhancedQuery = clipResult.enhancedQuery;
    } else if (imageUrl.trim()) {
      // Image only
      const imageVector = await embedImageSingle(imageUrl);
      queryVector = imageVector;
    } else {
      return NextResponse.json(
        {
          ok: false,
          error: 'Query or image URL required',
        },
        { status: 400 }
      );
    }

    // Search Qdrant using the combined vector (most curated results)
    const qdrantSearchParams: any = {
      limit: Math.min(k, 100), // Max 100 results
      with_payload: true,
      vector: {
        name: 'combined',
        vector: queryVector,
      },
    };

    const res = await qdrant.search(INVENTORY_COLLECTION, qdrantSearchParams);

    // Format results - return most curated (highest scores first)
    const hits = res
      .map((h: any) => ({
        id: h.id,
        score: h.score,
        ...h.payload,
      }))
      .filter((h: any) => h.score > 0.3) // Filter low-quality matches
      .slice(0, k); // Limit to requested number

    console.log(`Found ${hits.length} curated results`);

    const response: any = {
      ok: true,
      mode: 'clip-advanced',
      query: q,
      imageUrl,
      count: hits.length,
      hits,
    };

    // Add context information if available
    if (visualAnalysis) {
      response.visualAnalysis = visualAnalysis;
    }
    if (styleContext) {
      response.styleContext = styleContext;
    }
    if (enhancedQuery) {
      response.enhancedQuery = enhancedQuery;
    }

    return NextResponse.json(response);
  } catch (err: any) {
    console.error('GET /api/inventory/search error:', err?.message || err);
    return NextResponse.json(
      {
        ok: false,
        error: 'Search failed',
        details: err?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
