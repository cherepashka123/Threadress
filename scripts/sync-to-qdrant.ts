#!/usr/bin/env tsx

/**
 * Script to sync inventory data from Square to Qdrant vector database
 * This script will:
 * 1. Fetch all catalog items from Square
 * 2. Get inventory counts for each item
 * 3. Generate embeddings for each product
 * 4. Upload to Qdrant vector database
 */

import { config } from 'dotenv';
import {
  initializeCollection,
  batchUpsertProducts,
  clearCollection,
  getCollectionInfo,
  type InventoryProduct,
} from '../src/lib/qdrant-client';
import {
  generateQueryEmbedding,
  generateProductEmbedding,
  batchGenerateProductEmbeddings,
  testEmbeddingService,
} from '../src/lib/embedding-service';

// Load environment variables
config({ path: '.env.local' });

interface SquareCatalogItem {
  id: string;
  type: string;
  itemData?: {
    name: string;
    description?: string;
    categoryId?: string;
    imageUrl?: string;
    variations?: Array<{
      id: string;
      itemVariationData?: {
        name?: string;
        priceMoney?: {
          amount: number;
        };
      };
    }>;
    customAttributes?: Array<{
      name: string;
      stringValue?: string;
      numberValue?: number;
    }>;
  };
}

interface SquareLocation {
  id: string;
  name: string;
  address?: {
    addressLine1?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  capabilities?: string[];
}

interface SquareInventoryCount {
  catalog_object_id: string;
  quantity: number;
  state: string;
}

// Square API configuration
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_ENVIRONMENT = process.env.SQUARE_ENVIRONMENT || 'sandbox';
const SQUARE_BASE_URL =
  SQUARE_ENVIRONMENT === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';

if (!SQUARE_ACCESS_TOKEN) {
  console.error('❌ SQUARE_ACCESS_TOKEN environment variable is required');
  process.exit(1);
}

async function makeSquareRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${SQUARE_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${SQUARE_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'Square-Version': '2023-10-18',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Square API error: ${response.status} ${error}`);
  }

  return response.json();
}

async function fetchCatalogItems(): Promise<SquareCatalogItem[]> {
  console.log('📦 Fetching catalog items from Square...');

  const response = await makeSquareRequest('/v2/catalog/list', {
    method: 'POST',
    body: JSON.stringify({
      types: ['ITEM'],
      limit: 100,
    }),
  });

  return response.objects || [];
}

async function fetchLocations(): Promise<SquareLocation[]> {
  console.log('📍 Fetching locations from Square...');

  const response = await makeSquareRequest('/v2/locations');
  return response.locations || [];
}

async function fetchInventoryCounts(
  catalogObjectIds: string[]
): Promise<SquareInventoryCount[]> {
  console.log('📊 Fetching inventory counts from Square...');

  const response = await makeSquareRequest(
    '/v2/inventory/counts/batch-retrieve',
    {
      method: 'POST',
      body: JSON.stringify({
        catalog_object_ids: catalogObjectIds,
      }),
    }
  );

  return response.counts || [];
}

function extractAttribute(
  itemData: any,
  attributeName: string
): string | undefined {
  if (!itemData.customAttributes) return undefined;

  const attr = itemData.customAttributes.find(
    (attr: any) =>
      attr.name === attributeName ||
      attr.name?.toLowerCase() === attributeName.toLowerCase()
  );

  return attr?.stringValue || attr?.numberValue?.toString();
}

async function convertToInventoryProducts(
  catalogItems: SquareCatalogItem[],
  locations: SquareLocation[],
  inventoryCounts: SquareInventoryCount[]
): Promise<InventoryProduct[]> {
  console.log('🔄 Converting catalog items to inventory products...');

  const inventoryMap = new Map(
    inventoryCounts.map((count) => [count.catalog_object_id, count])
  );
  const location = locations[0]; // Use first location for now

  const products: InventoryProduct[] = [];

  for (const item of catalogItems) {
    if (item.type !== 'ITEM' || !item.itemData?.variations) continue;

    for (const variation of item.itemData.variations) {
      const inventoryCount = inventoryMap.get(variation.id);

      const product: InventoryProduct = {
        id: variation.id,
        title: variation.itemVariationData?.name || item.itemData.name,
        description: item.itemData.description || '',
        price: variation.itemVariationData?.priceMoney?.amount || 0,
        color: extractAttribute(item.itemData, 'Color'),
        material: extractAttribute(item.itemData, 'Material'),
        size: variation.itemVariationData?.name || 'One Size',
        category: item.itemData.categoryId || 'Uncategorized',
        brand: extractAttribute(item.itemData, 'Brand'),
        imageUrl: item.itemData.imageUrl || '',
        storeId: location.id,
        storeName: location.name,
        storeAddress: location.address?.addressLine1 || '',
        storeLocation: location.capabilities?.includes('CREDIT_CARD_PROCESSING')
          ? {
              lat: 40.7128, // Default NYC coordinates
              lng: -74.006,
            }
          : undefined,
        inStock: inventoryCount ? inventoryCount.quantity > 0 : false,
        quantity: inventoryCount?.quantity || 0,
        squareVariationId: variation.id,
        squareCatalogId: item.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      products.push(product);
    }
  }

  return products;
}

async function main() {
  try {
    console.log('🚀 Starting inventory sync to Qdrant...\n');

    // Test embedding service
    console.log('🧪 Testing embedding service...');
    const embeddingTest = await testEmbeddingService();
    if (!embeddingTest) {
      console.error('❌ Embedding service test failed');
      process.exit(1);
    }
    console.log('✅ Embedding service is working\n');

    // Initialize Qdrant collection
    console.log('🗄️ Initializing Qdrant collection...');
    await initializeCollection();
    console.log('✅ Collection initialized\n');

    // Fetch data from Square
    const [catalogItems, locations, inventoryCounts] = await Promise.all([
      fetchCatalogItems(),
      fetchLocations(),
      fetchInventoryCounts([]), // We'll get the IDs from catalog items
    ]);

    console.log(`📦 Found ${catalogItems.length} catalog items`);
    console.log(`📍 Found ${locations.length} locations`);
    console.log(`📊 Found ${inventoryCounts.length} inventory counts\n`);

    // Get inventory counts for all variations
    const variationIds = catalogItems
      .filter((item) => item.type === 'ITEM' && item.itemData?.variations)
      .flatMap((item) =>
        item.itemData.variations.map((variation) => variation.id)
      );

    const allInventoryCounts = await fetchInventoryCounts(variationIds);
    console.log(`📊 Retrieved ${allInventoryCounts.length} inventory counts\n`);

    // Convert to inventory products
    const products = await convertToInventoryProducts(
      catalogItems,
      locations,
      allInventoryCounts
    );
    console.log(`🔄 Converted ${products.length} products\n`);

    // Generate embeddings
    console.log('🧠 Generating embeddings...');
    const productsWithEmbeddings =
      await batchGenerateProductEmbeddings(products);
    console.log(
      `✅ Generated embeddings for ${productsWithEmbeddings.length} products\n`
    );

    // Clear existing collection (optional)
    const shouldClear = process.argv.includes('--clear');
    if (shouldClear) {
      console.log('🗑️ Clearing existing collection...');
      await clearCollection();
      console.log('✅ Collection cleared\n');
    }

    // Upload to Qdrant
    console.log('⬆️ Uploading to Qdrant...');
    await batchUpsertProducts(productsWithEmbeddings);
    console.log(
      `✅ Successfully uploaded ${productsWithEmbeddings.length} products to Qdrant\n`
    );

    // Get collection info
    const collectionInfo = await getCollectionInfo();
    console.log('📊 Collection Info:');
    console.log(`   - Points count: ${collectionInfo.points_count}`);
    console.log(
      `   - Vector size: ${collectionInfo.config.params.vectors.size}`
    );
    console.log(
      `   - Distance metric: ${collectionInfo.config.params.vectors.distance}\n`
    );

    console.log('🎉 Inventory sync completed successfully!');
    console.log('\nYou can now use the vector search API:');
    console.log('GET /api/inventory?q=summer dress&limit=10');
    console.log('POST /api/inventory with sync action to re-sync');
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}


