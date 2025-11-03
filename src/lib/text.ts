/**
 * Build searchable text from inventory row data
 * Expects columns like: id | store_id | title | brand | category | description | price | currency | url
 * Works with your Sheet header mapping; adapt keys if needed.
 */

export function buildInventoryText(row: Record<string, any>): string {
  // Handle both new manieredevoir format and legacy format
  const title = row['text-unset'] || row.text || row.title || row.Title || '';
  const brand = row['text-unset 2'] || row.brand || row.Brand || '';

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
  // Handle the manieredevoir sheet format which has:
  // - "text-unset" = product title
  // - "text-unset 2" = brand name
  // - "main-product-image src" = image URL
  // - "actual-price1" = price
  // - "main-product-inner href" = product URL
  // Or legacy format: product_id, text, category, color, material, occasion, tags, price, store_name, address, lat, lng, image_url

  // Extract title - new format uses "text-unset", legacy uses "text" or "title"
  const title = row['text-unset'] || row.text || row.title || row.Title || '';

  // Extract brand - new format uses "text-unset 2", legacy uses "brand"
  const brand =
    row['text-unset 2'] || row.brand || row.Brand || 'Maniere de Voir';

  // Extract image URL - new format uses "main-product-image src", legacy uses "image_url"
  const imageUrl =
    row['main-product-image src'] ||
    row.image_url ||
    row.url ||
    row.Url ||
    row.URL ||
    '';

  // Extract product URL - new format uses "main-product-inner href"
  const productUrl = row['main-product-inner href'] || '';

  // Extract price - new format uses "actual-price1" (may have currency symbol), legacy uses "price"
  const priceStr = row['actual-price1'] || row.price || row.Price || '';
  // Remove currency symbols and convert to number
  const price = safeNum(priceStr.toString().replace(/[£$€,]/g, ''));

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
    url: imageUrl,
    product_url: productUrl,
    store_id: safeNum(row.store_id || row.Store || row.StoreID) || 1,
    color: row.color || row.Color || '',
    material: row.material || row.Material || '',
    size: row.size || row.Size || row['size-sold'] || '',
    style: row.style || row.Style || '',
    occasion: row.occasion || row.Occasion || '',
    season: row.season || row.Season || '',
    tags: row.tags || row.Tags || '',
    store_name:
      row.store_name || row.storeName || row.StoreName || 'Maniere de Voir',
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
    row['text-unset'] ||
    row.text ||
    row.title ||
    row.Title ||
    ''
  ).trim();
  const url = (
    row['main-product-inner href'] ||
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
  // Handle new manieredevoir format
  const title = row['text-unset'] || row.text || row.title || row.Title || '';
  const imageUrl =
    row['main-product-image src'] ||
    row.image_url ||
    row.url ||
    row.Url ||
    row.URL ||
    '';

  // For manieredevoir sheet format: need at least title and image
  if (title.trim() && imageUrl.trim()) {
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
