import { NextRequest, NextResponse } from 'next/server';
import { qdrant, INVENTORY_COLLECTION } from '@/lib/qdrant';
import {
  embedAdvancedMultimodalQuery,
  embedTextSingle,
  embedImageSingle,
} from '@/lib/clip-advanced';
import {
  ultraAdvancedSearch,
  multiQuerySearch,
} from '@/lib/ultra-advanced-search';

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

    // Perform initial search
    const res = await qdrant.search(INVENTORY_COLLECTION, qdrantSearchParams);

    // Format initial results
    const initialHits = res
      .map((h: any) => ({
        id: h.id,
        score: h.score,
        ...h.payload,
      }))
      .filter((h: any) => h.score > 0.05); // Lower threshold to get more candidates

    // Apply ultra-advanced enhancements with HYPER-OPTIMIZED keyword matching
    const enhancedHits = await ultraAdvancedSearch(
      q,
      imageUrl || undefined,
      initialHits,
      {
        priceRelevanceWeight: 0.1,
        seasonRelevanceWeight: 0.1,
        brandAffinityWeight: 0.1,
        popularityWeight: 0.05,
        attributeMatchWeight: 0.2, // Increased for better attribute matching
        keywordMatchWeight: 0.25, // HYPER-OPTIMIZED: Word-by-word matching (25% weight)
      }
    );

    // Format final results with store information prominently displayed
    const hits = enhancedHits
      .map((enhanced: any) => ({
        id: enhanced.id,
        score: enhanced.score,
        baseScore: enhanced.baseScore,
        // Ensure store information is always included
        // Use brand field (contains domain like manieredevoir.com, withjean.com) to determine store
        store_name: (() => {
          // Brand field contains the source domain/name (manieredevoir.com, withjean.com, rouje, etc.)
          const sourceValue = enhanced.payload.brand || enhanced.payload.store_name || '';
          const normalized = sourceValue.toLowerCase().trim();
          
          // Normalize based on brand field patterns (domain names or brand names)
          if (normalized.includes('maniere') || normalized.includes('manieredevoir') || normalized.includes('mdv') || normalized.includes('manieredevoir.com')) {
            return 'Maniere de Voir';
          } else if (normalized.includes('rouje') || normalized.includes('rouje.com')) {
            return 'Rouje';
          } else if (normalized.includes('with jean') || normalized.includes('withjean') || normalized.includes('withjean.com')) {
            return 'With Jean';
          }
          
          // If already normalized, return as-is
          if (normalized === 'maniere de voir' || normalized === 'rouje' || normalized === 'with jean') {
            return sourceValue;
          }
          
          // Default fallback
          return 'Maniere de Voir';
        })(),
        store: (() => {
          const sourceValue = enhanced.payload.brand || enhanced.payload.store_name || '';
          const normalized = sourceValue.toLowerCase().trim();
          
          if (normalized.includes('maniere') || normalized.includes('manieredevoir') || normalized.includes('mdv') || normalized.includes('manieredevoir.com')) {
            return 'Maniere de Voir';
          } else if (normalized.includes('rouje') || normalized.includes('rouje.com')) {
            return 'Rouje';
          } else if (normalized.includes('with jean') || normalized.includes('withjean') || normalized.includes('withjean.com')) {
            return 'With Jean';
          }
          
          if (normalized === 'maniere de voir' || normalized === 'rouje' || normalized === 'with jean') {
            return sourceValue;
          }
          
          return 'Maniere de Voir';
        })(),
        brand: (() => {
          const sourceValue = enhanced.payload.brand || enhanced.payload.store_name || '';
          const normalized = sourceValue.toLowerCase().trim();
          
          if (normalized.includes('maniere') || normalized.includes('manieredevoir') || normalized.includes('mdv') || normalized.includes('manieredevoir.com')) {
            return 'Maniere de Voir';
          } else if (normalized.includes('rouje') || normalized.includes('rouje.com')) {
            return 'Rouje';
          } else if (normalized.includes('with jean') || normalized.includes('withjean') || normalized.includes('withjean.com')) {
            return 'With Jean';
          }
          
          if (normalized === 'maniere de voir' || normalized === 'rouje' || normalized === 'with jean') {
            return sourceValue;
          }
          
          return 'Maniere de Voir';
        })(),
        store_id: enhanced.payload.store_id || 1,
        // Product information
        title: enhanced.payload.title,
        description: enhanced.payload.description,
        price: enhanced.payload.price,
        currency: enhanced.payload.currency || 'USD',
        // Image URL - check ALL possible image URL fields with priority order
        // CRITICAL: Ensure ALL valid image URLs are passed through
        url: (() => {
          // Try ALL possible image URL fields in priority order
          const candidates = [
            enhanced.payload.Main_Image_URL,
            enhanced.payload.main_image_url,
            enhanced.payload['Main Image URL'],
            enhanced.payload.Hover_Image_URL,
            enhanced.payload.hover_image_url,
            enhanced.payload['Hover Image URL'],
            enhanced.payload.url,
            enhanced.payload.image_url,
            enhanced.payload.imageUrl,
            enhanced.payload.Image_URL,
            enhanced.payload.ImageUrl,
            enhanced.payload.image,
            enhanced.payload.Image,
            enhanced.payload['Product Image'],
            enhanced.payload.product_image,
            enhanced.payload['main-product-image src'],
            enhanced.payload['main-product-image-src'],
          ];
          
          // Find first valid HTTP/HTTPS URL (be more lenient - accept 8+ char URLs)
          for (const candidate of candidates) {
            if (!candidate || typeof candidate !== 'string') continue;
            
            const cleaned = candidate.trim();
            
            // Skip invalid URLs (base64, data URIs, empty, too short)
            if (cleaned.length < 8) continue; // Reduced from 10 to 8 for shorter valid URLs
            if (cleaned.startsWith('data:')) continue;
            if (cleaned.startsWith('data:image')) continue;
            if (cleaned.includes('data:image')) continue; // Extra check for embedded data URIs
            if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) continue;
            
            // Valid HTTP/HTTPS URL found
            return cleaned;
          }
          
          // No valid URL found
          return '';
        })(),
        // Also include Main_Image_URL and Hover_Image_URL as separate fields for fallback
        Main_Image_URL: (() => {
          const url = enhanced.payload.Main_Image_URL || enhanced.payload.main_image_url || enhanced.payload['Main Image URL'] || '';
          if (url && typeof url === 'string') {
            const cleaned = url.trim();
            if (cleaned.length >= 8 && (cleaned.startsWith('http://') || cleaned.startsWith('https://')) && !cleaned.startsWith('data:') && !cleaned.includes('data:image')) {
              return cleaned;
            }
          }
          return '';
        })(),
        Hover_Image_URL: (() => {
          const url = enhanced.payload.Hover_Image_URL || enhanced.payload.hover_image_url || enhanced.payload['Hover Image URL'] || '';
          if (url && typeof url === 'string') {
            const cleaned = url.trim();
            if (cleaned.length >= 8 && (cleaned.startsWith('http://') || cleaned.startsWith('https://')) && !cleaned.startsWith('data:') && !cleaned.includes('data:image')) {
              return cleaned;
            }
          }
          return '';
        })(),
        image_url: enhanced.payload.image_url || '',
        product_url: enhanced.payload.product_url || enhanced.payload.url || enhanced.payload.productUrl || '',
        // Attributes
        color: enhanced.payload.color,
        material: enhanced.payload.material,
        size: enhanced.payload.size,
        style: enhanced.payload.style,
        occasion: enhanced.payload.occasion,
        season: enhanced.payload.season,
        category: enhanced.payload.category,
        tags: enhanced.payload.tags,
        // Location (if available)
        // Location data removed - only showing store name
        // Enhancement scores (for debugging/display)
        enhancementScores: enhanced.enhancementScores,
      }))
      .filter((h: any) => h.score > 0.1) // Filter after enhancement
      .slice(0, k); // Limit to requested number

    console.log(`Found ${res.length} initial results, ${hits.length} after ultra-advanced enhancement`);

    const response: any = {
      ok: true,
      mode: 'ultra-advanced', // Updated mode name
      query: q,
      imageUrl,
      count: hits.length,
      hits,
      // Group hits by store for easier display
      stores: Array.from(
        new Set(hits.map((h: any) => h.store_name || h.brand).filter(Boolean))
      ),
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
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
