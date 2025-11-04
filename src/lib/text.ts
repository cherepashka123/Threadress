/**
 * Normalize brand names to the three official brands
 */
function normalizeBrandName(brand: string): string {
  if (!brand || typeof brand !== 'string') {
    return 'Maniere de Voir'; // Default fallback
  }
  
  const normalized = brand.toLowerCase().trim();
  
  // Check for Maniere de Voir variations
  if (normalized.includes('maniere') || normalized.includes('manieredevoir') || normalized.includes('mdv')) {
    return 'Maniere de Voir';
  }
  
  // Check for Rouje variations
  if (normalized.includes('rouje')) {
    return 'Rouje';
  }
  
  // Check for With Jean variations
  if (normalized.includes('with jean') || normalized.includes('withjean') || normalized.includes('withjean.com')) {
    return 'With Jean';
  }
  
  // If it's already one of the three brands, return as-is
  if (normalized === 'maniere de voir' || normalized === 'rouje' || normalized === 'with jean') {
    return brand.trim(); // Return original with proper casing
  }
  
  // Default fallback
  return 'Maniere de Voir';
}

/**
 * Build searchable text from inventory row data
 * Expects columns like: id | store_id | title | brand | category | description | price | currency | url
 * Works with your Sheet header mapping; adapt keys if needed.
 */

export function buildInventoryText(row: Record<string, any>): string {
  // Handle multiple formats:
  // 1. New format: Product_Name, Main_Image_URL, Price, Product_URL
  // 2. Old manieredevoir format: text-unset, main-product-image src, actual-price1
  // 3. Legacy format: text, title, image_url, price
  const title = row['Product_Name'] || row['text-unset'] || row.text || row.title || row.Title || '';
  const rawBrand = row['Source'] || row['text-unset 2'] || row.brand || row.Brand || '';
  const brand = normalizeBrandName(rawBrand);

  const parts = [
    title,
    brand,
    row.category || row.Category || '',
    (row.description || row.Description || title)
      .toString()
      .replace(/\s+/g, ' ')
      .slice(0, 1500),
    // Add attributes you care about, e.g., color, material, size …
    row.color || row.Color || '',
    row.material || row.Material || '',
    row.size || row.Size || row['size-sold'] || '',
    row.style || row.Style || '',
    row.occasion || row.Occasion || '',
    row.season || row.Season || '',
    row.tags || row.Tags || '',
  ].filter(Boolean);

  return parts.join(' | ');
}

/**
 * Extract key fields for filtering and display from inventory row
 */
export function extractInventoryFields(row: Record<string, any>) {
  // Handle multiple formats:
  // 1. New format: Product_Name, Main_Image_URL, Price, Product_URL, Source, Style_Name, Available_Sizes, Sold_Out_Sizes
  // 2. Old manieredevoir format: text-unset, main-product-image src, actual-price1
  // 3. Legacy format: product_id, text, category, color, material, occasion, tags, price, store_name, address, lat, lng, image_url

  // Extract title - prioritize new format, then old formats
  const title = row['Product_Name'] || row['Style_Name'] || row['text-unset'] || row.text || row.title || row.Title || '';

  // Extract brand/source - new format uses "Source", old uses "text-unset 2", legacy uses "brand"
  // Normalize brand names to the three official brands
  const rawBrand = row['Source'] || row['text-unset 2'] || row.brand || row.Brand || '';
  const brand = normalizeBrandName(rawBrand);

  // Extract image URL - check ALL possible image URL fields
  // Priority: Main_Image_URL > Hover_Image_URL > main-product-image src > image_url > url > other variants
  const imageUrl =
    row['Main_Image_URL'] ||
    row['main_image_url'] ||
    row['Main Image URL'] ||
    row['Hover_Image_URL'] ||
    row['hover_image_url'] ||
    row['Hover Image URL'] ||
    row['main-product-image src'] ||
    row['main-product-image-src'] ||
    row.image_url ||
    row.imageUrl ||
    row.Image_URL ||
    row.ImageUrl ||
    row.url ||
    row.Url ||
    row.URL ||
    row['Product Image'] ||
    row['product_image'] ||
    row['Image'] ||
    row.image ||
    '';

  // Extract product URL - new format uses "Product_URL", old uses "main-product-inner href"
  const productUrl = row['Product_URL'] || row['main-product-inner href'] || '';

  // Extract price - new format uses "Price", old uses "actual-price1", legacy uses "price"
  const priceStr = row['Price'] || row['actual-price1'] || row.price || row.Price || '';
  // Remove currency symbols and convert to number
  const price = safeNum(priceStr.toString().replace(/[£$€,]/g, ''));

  // Validate and clean image URLs - reject data URIs and invalid URLs
  // Also extract Hover_Image_URL separately for fallback
  const hoverImageUrl = 
    row['Hover_Image_URL'] ||
    row['hover_image_url'] ||
    row['Hover Image URL'] ||
    '';
  
  const validateImageUrl = (url: string): string => {
    if (!url || typeof url !== 'string') return '';
    const cleaned = url.trim();
    // Reject data URIs and invalid URLs (be lenient - accept 8+ char URLs)
    if (cleaned.length < 8) return ''; // Reduced from 10 to 8 for shorter valid URLs
    if (cleaned.startsWith('data:')) return '';
    if (cleaned.startsWith('data:image')) return '';
    if (cleaned.includes('data:image')) return ''; // Extra check for embedded data URIs
    if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) return '';
    return cleaned; // Valid URL
  };
  
  let finalImageUrl = validateImageUrl(imageUrl);
  let finalHoverImageUrl = validateImageUrl(hoverImageUrl);
  
  // If no image URL found, try to generate one from product URL
  // This is a fallback for items missing images in the sheet
  if (!finalImageUrl && !finalHoverImageUrl && productUrl) {
    // Try to extract or generate image URL from product URL
    // For Shopify stores, images are often in predictable locations
    // For other stores, we can try common patterns
    
    // Common Shopify image pattern: cdn.shopify.com/s/files/...
    // Common MDV pattern: cdn/shop/files/...
    // We'll try to construct a likely image URL
    
    if (productUrl.includes('shopify.com') || productUrl.includes('cdn.shopify.com')) {
      // For Shopify stores, try to construct image URL
      // Extract product handle from URL
      const urlMatch = productUrl.match(/products\/([^\/\?]+)/);
      if (urlMatch && urlMatch[1]) {
        const productHandle = urlMatch[1];
        // Try common Shopify image URL patterns (these are guesses, may not work)
        // In production, you'd scrape the actual product page
      }
    }
    
    // For Maniere de Voir, try CDN pattern
    if (productUrl.includes('manieredevoir.com')) {
      const urlMatch = productUrl.match(/products\/([^\/\?]+)/);
      if (urlMatch && urlMatch[1]) {
        const productHandle = urlMatch[1];
        // Try MDV CDN pattern (this is a fallback, may not always work)
        const fallbackUrl = `https://www.manieredevoir.com/cdn/shop/files/${productHandle}.jpg`;
        // Don't set it automatically - let the sheet data be the source of truth
        // But we'll keep product_url available for potential scraping
      }
    }
  }
  
  return {
    title,
    brand,
    category: row.category || row.Category || '',
    description: title, // Use title as description for now
    price,
    currency: priceStr.includes('£')
      ? 'GBP'
      : priceStr.includes('€')
        ? 'EUR'
        : priceStr.includes('$')
          ? 'USD'
          : row.currency || row.Currency || 'USD',
    url: finalImageUrl || finalHoverImageUrl, // Primary image URL (use hover as fallback if main is missing)
    Main_Image_URL: finalImageUrl, // Store separately for fallback
    Hover_Image_URL: finalHoverImageUrl, // Store separately for fallback
    product_url: productUrl, // Keep product URL - frontend can use it as last resort
    store_id: safeNum(row.store_id || row.Store || row.StoreID) || 1,
    color: row.color || row.Color || '',
    material: row.material || row.Material || '',
    size: row['Available_Sizes'] || row['Sold_Out_Sizes'] || row.size || row.Size || row['size-sold'] || '',
    style: row.style || row.Style || '',
    occasion: row.occasion || row.Occasion || '',
    season: row.season || row.Season || '',
    tags: row.tags || row.Tags || '',
    // Use Source column as primary source for store_name (it contains the brand name)
    store_name: normalizeBrandName(
      row['Source'] || row.store_name || row.storeName || row.StoreName || rawBrand || row['text-unset 2'] || row.brand || row.Brand || ''
    ),
    address: row.address || row.Address || '521 Broadway, Soho, NYC',
    lat: safeNum(row.lat || row.lat) || 40.7258074,
    lng: safeNum(row.lng || row.lng) || -73.9952559,
    // Keep original row for reference
    original_row: row,
  };
}

/**
 * Generate a stable ID from inventory row
 * Uses product_id if available (from manieredevoir sheet), otherwise hashes key fields
 */
export function generateInventoryId(row: Record<string, any>): number {
  // Create a stable numeric ID from key identifying fields
  // Qdrant accepts unsigned integers or UUIDs - using unsigned integer for efficiency
  // Use the product URL or image URL as the base for a hash
  const title = (
    row['Product_Name'] ||
    row['Style_Name'] ||
    row['text-unset'] ||
    row.text ||
    row.title ||
    row.Title ||
    ''
  ).trim();
  const url = (
    row['Product_URL'] ||
    row['main-product-inner href'] ||
    row['Main_Image_URL'] ||
    row['main-product-image src'] ||
    row.url ||
    row.Url ||
    row.URL ||
    row.image_url ||
    ''
  ).trim();

  // Use URL if available (most stable), otherwise use title
  const idString = url || title;

  if (!idString) {
    // Fallback: generate a hash from timestamp + random
    return Math.abs(Date.now() % 2147483647); // Max 32-bit signed integer, but we'll make it unsigned
  }

  // Generate a stable hash from the string
  let hash = 0;
  for (let i = 0; i < idString.length; i++) {
    const char = idString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Convert to unsigned integer (Qdrant requirement)
  // Use absolute value and ensure it's within unsigned int range
  return Math.abs(hash) % 2147483647; // Keep within safe range, Qdrant will handle as unsigned
}

/**
 * Safe number conversion
 */
function safeNum(v: any): number | undefined {
  if (v === null || v === undefined || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Validate inventory row has minimum required fields
 */
export function isValidInventoryRow(row: Record<string, any>): boolean {
  // Handle multiple formats:
  // 1. New format: Product_Name, Main_Image_URL
  // 2. Old manieredevoir format: text-unset, main-product-image src
  // 3. Legacy format: text, title, image_url
  const title = row['Product_Name'] || row['Style_Name'] || row['text-unset'] || row.text || row.title || row.Title || '';
  const imageUrl =
    row['Main_Image_URL'] ||
    row['Hover_Image_URL'] ||
    row['main-product-image src'] ||
    row.image_url ||
    row.url ||
    row.Url ||
    row.URL ||
    '';

  // Need at least title and image (or product URL)
  const productUrl = row['Product_URL'] || row['main-product-inner href'] || '';
  if (title.trim() && (imageUrl.trim() || productUrl.trim())) {
    return true;
  }

  // Legacy format validation
  const brand =
    row['text-unset 2'] ||
    row.brand ||
    row.Brand ||
    row.store_name ||
    row.storeName ||
    '';
  const category = row.category || row.Category || '';

  // Fallback validation: at least one identifying field
  return !!(title.trim() || brand.trim() || category.trim());
}
