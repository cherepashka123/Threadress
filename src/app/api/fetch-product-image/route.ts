import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint to fetch product image from product URL
 * This helps fill in missing images for items that have Product_URL but no Main_Image_URL
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productUrl = searchParams.get('url');

    if (!productUrl) {
      return NextResponse.json(
        { ok: false, error: 'Product URL required' },
        { status: 400 }
      );
    }

    // Try to extract or construct image URL based on product URL patterns
    let imageUrl: string | null = null;

    try {
      const url = new URL(productUrl);
      
      // Rouje.com pattern - fetch from product page
      if (url.hostname.includes('rouje.com')) {
        try {
          // Fetch the product page HTML
          // Create abort controller for timeout
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
          
          const response = await fetch(productUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
            },
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const html = await response.text();
            
            // Try to find image in common Shopify patterns
            // Look for img tags with src containing "cdn" or "shop"
            // Also check for data-src, data-lazy-src, and other lazy loading attributes
            const imageMatches = [
              ...html.matchAll(/<img[^>]+src=["']([^"']*cdn[^"']*\.(jpg|jpeg|png|webp|gif))[^"']*["']/gi),
              ...html.matchAll(/<img[^>]+data-src=["']([^"']*cdn[^"']*\.(jpg|jpeg|png|webp|gif))[^"']*["']/gi),
              ...html.matchAll(/<img[^>]+data-lazy-src=["']([^"']*cdn[^"']*\.(jpg|jpeg|png|webp|gif))[^"']*["']/gi),
              ...html.matchAll(/<img[^>]+src=["']([^"']*shop[^"']*\.(jpg|jpeg|png|webp|gif))[^"']*["']/gi),
              ...html.matchAll(/<img[^>]+src=["']([^"']*files\/[^"']*\.(jpg|jpeg|png|webp|gif))[^"']*["']/gi),
            ];
            
            for (const match of imageMatches) {
              const src = match[1];
              if (src && src.startsWith('http')) {
                imageUrl = src;
                break;
              } else if (src && (src.startsWith('//') || src.startsWith('/'))) {
                // Convert relative to absolute
                imageUrl = src.startsWith('//') ? `https:${src}` : `${url.origin}${src}`;
                break;
              }
            }
            
            // If still no image, try meta tags (og:image)
            if (!imageUrl) {
              const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
              if (ogImageMatch && ogImageMatch[1]) {
                const metaUrl = ogImageMatch[1];
                imageUrl = metaUrl.startsWith('http') ? metaUrl : `${url.origin}${metaUrl}`;
              }
            }
          }
        } catch (error) {
          // Fallback to pattern-based URL if fetch fails
          const handleMatch = productUrl.match(/products\/([^\/\?]+)/);
          if (handleMatch && handleMatch[1]) {
            const productHandle = handleMatch[1];
            // Try common Rouje Shopify CDN pattern
            imageUrl = `https://cdn.shopify.com/s/files/1/0512/3103/1472/files/${productHandle}_1.jpg`;
          }
        }
      }
      
      // Maniere de Voir pattern - fetch from product page
      if (url.hostname.includes('manieredevoir.com')) {
        try {
          // Create abort controller for timeout
          const controller2 = new AbortController();
          const timeoutId2 = setTimeout(() => controller2.abort(), 10000);
          
          const response = await fetch(productUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
            },
            signal: controller2.signal,
          });
          
          clearTimeout(timeoutId2);
          
          if (response.ok) {
            const html = await response.text();
            const imageMatches = [
              ...html.matchAll(/<img[^>]+src=["']([^"']*cdn[^"']*shop[^"']*\.(jpg|jpeg|png|webp|gif))[^"']*["']/gi),
              ...html.matchAll(/<img[^>]+data-src=["']([^"']*cdn[^"']*shop[^"']*\.(jpg|jpeg|png|webp|gif))[^"']*["']/gi),
              ...html.matchAll(/<img[^>]+data-lazy-src=["']([^"']*cdn[^"']*shop[^"']*\.(jpg|jpeg|png|webp|gif))[^"']*["']/gi),
              ...html.matchAll(/<img[^>]+src=["']([^"']*files\/[^"']*\.(jpg|jpeg|png|webp|gif))[^"']*["']/gi),
            ];
            
            for (const match of imageMatches) {
              const src = match[1];
              if (src && src.startsWith('http')) {
                imageUrl = src;
                break;
              } else if (src && (src.startsWith('//') || src.startsWith('/'))) {
                imageUrl = src.startsWith('//') ? `https:${src}` : `${url.origin}${src}`;
                break;
              }
            }
            
            // Try meta tags if no image found
            if (!imageUrl) {
              const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
              if (ogImageMatch && ogImageMatch[1]) {
                const metaUrl = ogImageMatch[1];
                imageUrl = metaUrl.startsWith('http') ? metaUrl : `${url.origin}${metaUrl}`;
              }
            }
          }
        } catch (error) {
          // Fallback to pattern
          const handleMatch = productUrl.match(/products\/([^\/\?]+)/);
          if (handleMatch && handleMatch[1]) {
            imageUrl = `https://www.manieredevoir.com/cdn/shop/files/${handleMatch[1]}.jpg`;
          }
        }
      }
      
      // With Jean pattern (Shopify) - fetch from product page
      if (url.hostname.includes('withjean.com')) {
        try {
          // Create abort controller for timeout
          const controller2 = new AbortController();
          const timeoutId2 = setTimeout(() => controller2.abort(), 10000);
          
          const response = await fetch(productUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
            },
            signal: controller2.signal,
          });
          
          clearTimeout(timeoutId2);
          
          if (response.ok) {
            const html = await response.text();
            const imageMatches = [
              ...html.matchAll(/<img[^>]+src=["']([^"']*cdn\.shopify[^"']*\.(jpg|jpeg|png|webp|gif))[^"']*["']/gi),
              ...html.matchAll(/<img[^>]+data-src=["']([^"']*cdn\.shopify[^"']*\.(jpg|jpeg|png|webp|gif))[^"']*["']/gi),
              ...html.matchAll(/<img[^>]+data-lazy-src=["']([^"']*cdn\.shopify[^"']*\.(jpg|jpeg|png|webp|gif))[^"']*["']/gi),
              ...html.matchAll(/<img[^>]+src=["']([^"']*files\/[^"']*\.(jpg|jpeg|png|webp|gif))[^"']*["']/gi),
            ];
            
            for (const match of imageMatches) {
              const src = match[1];
              if (src && src.startsWith('http')) {
                imageUrl = src;
                break;
              } else if (src && (src.startsWith('//') || src.startsWith('/'))) {
                imageUrl = src.startsWith('//') ? `https:${src}` : `${url.origin}${src}`;
                break;
              }
            }
            
            // Try meta tags if no image found
            if (!imageUrl) {
              const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
              if (ogImageMatch && ogImageMatch[1]) {
                const metaUrl = ogImageMatch[1];
                imageUrl = metaUrl.startsWith('http') ? metaUrl : `${url.origin}${metaUrl}`;
              }
            }
          }
        } catch (error) {
          // Fallback to pattern
          const handleMatch = productUrl.match(/products\/([^\/\?]+)/);
          if (handleMatch && handleMatch[1]) {
            imageUrl = `https://cdn.shopify.com/s/files/1/0512/3103/1472/files/${handleMatch[1]}_1.jpg`;
          }
        }
      }
      
    } catch (error) {
      // Invalid URL
      return NextResponse.json(
        { ok: false, error: 'Invalid product URL' },
        { status: 400 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { ok: false, error: 'Could not determine image URL pattern' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      imageUrl,
      productUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to fetch image' },
      { status: 500 }
    );
  }
}

