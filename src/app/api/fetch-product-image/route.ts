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
          const response = await fetch(productUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            },
          });
          
          if (response.ok) {
            const html = await response.text();
            
            // Try to find image in common Shopify patterns
            // Look for img tags with src containing "cdn" or "shop"
            const imageMatches = [
              ...html.matchAll(/<img[^>]+src=["']([^"']*cdn[^"']*\.(jpg|jpeg|png|webp))[^"']*["']/gi),
              ...html.matchAll(/<img[^>]+data-src=["']([^"']*cdn[^"']*\.(jpg|jpeg|png|webp))[^"']*["']/gi),
              ...html.matchAll(/<img[^>]+src=["']([^"']*shop[^"']*\.(jpg|jpeg|png|webp))[^"']*["']/gi),
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
                imageUrl = ogImageMatch[1];
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
          const response = await fetch(productUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            },
          });
          
          if (response.ok) {
            const html = await response.text();
            const imageMatches = [
              ...html.matchAll(/<img[^>]+src=["']([^"']*cdn[^"']*shop[^"']*\.(jpg|jpeg|png|webp))[^"']*["']/gi),
              ...html.matchAll(/<img[^>]+data-src=["']([^"']*cdn[^"']*shop[^"']*\.(jpg|jpeg|png|webp))[^"']*["']/gi),
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
          const response = await fetch(productUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            },
          });
          
          if (response.ok) {
            const html = await response.text();
            const imageMatches = [
              ...html.matchAll(/<img[^>]+src=["']([^"']*cdn\.shopify[^"']*\.(jpg|jpeg|png|webp))[^"']*["']/gi),
              ...html.matchAll(/<img[^>]+data-src=["']([^"']*cdn\.shopify[^"']*\.(jpg|jpeg|png|webp))[^"']*["']/gi),
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

