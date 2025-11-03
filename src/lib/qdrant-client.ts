import { QdrantClient } from '@qdrant/js-client-rest';

// Qdrant configuration
const QDRANT_URL =
  'https://2d684b58-dfb1-4058-967f-9d4f248030c8.us-east4-0.gcp.cloud.qdrant.io';
const QDRANT_API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.sRD2SjycruCSbj2HGoigYEwSh9TzT_zmOHa-3DGdTWg';

// Initialize Qdrant client
export const qdrantClient = new QdrantClient({
  url: QDRANT_URL,
  apiKey: QDRANT_API_KEY,
});

// Collection name for inventory items
export const INVENTORY_COLLECTION = 'threadress-inventory';

// Vector dimension (using all-MiniLM-L6-v2 which has 384 dimensions)
export const VECTOR_DIMENSION = 384;

// Product interface for inventory items
export interface InventoryProduct {
  id: string;
  title: string;
  description?: string;
  price: number;
  color?: string;
  material?: string;
  size?: string;
  category?: string;
  brand?: string;
  imageUrl?: string;
  storeId: string;
  storeName: string;
  storeAddress?: string;
  storeLocation?: {
    lat: number;
    lng: number;
  };
  inStock: boolean;
  quantity?: number;
  squareVariationId?: string;
  squareCatalogId?: string;
  createdAt: string;
  updatedAt: string;
}

// Search result interface
export interface VectorSearchResult {
  id: string;
  score: number;
  payload: InventoryProduct;
}

// Search parameters
export interface SearchParams {
  query: string;
  limit?: number;
  filter?: {
    storeId?: string;
    category?: string;
    color?: string;
    material?: string;
    inStock?: boolean;
    priceRange?: {
      min?: number;
      max?: number;
    };
  };
  vector?: number[];
}

// Initialize collection if it doesn't exist
export async function initializeCollection(): Promise<void> {
  try {
    // Check if collection exists
    const collections = await qdrantClient.getCollections();
    const collectionExists = collections.collections.some(
      (col) => col.name === INVENTORY_COLLECTION
    );

    if (!collectionExists) {
      console.log(`Creating collection: ${INVENTORY_COLLECTION}`);

      await qdrantClient.createCollection(INVENTORY_COLLECTION, {
        vectors: {
          size: VECTOR_DIMENSION,
          distance: 'Cosine',
        },
        optimizers_config: {
          default_segment_number: 2,
        },
        replication_factor: 1,
      });

      // Create payload index for better filtering performance
      await qdrantClient.createPayloadIndex(INVENTORY_COLLECTION, {
        field_name: 'storeId',
        field_schema: 'keyword',
      });

      await qdrantClient.createPayloadIndex(INVENTORY_COLLECTION, {
        field_name: 'category',
        field_schema: 'keyword',
      });

      await qdrantClient.createPayloadIndex(INVENTORY_COLLECTION, {
        field_name: 'inStock',
        field_schema: 'bool',
      });

      console.log(`Collection ${INVENTORY_COLLECTION} created successfully`);
    } else {
      console.log(`Collection ${INVENTORY_COLLECTION} already exists`);
    }
  } catch (error) {
    console.error('Error initializing collection:', error);
    throw error;
  }
}

// Add or update a product in the vector database
export async function upsertProduct(
  product: InventoryProduct,
  vector: number[]
): Promise<void> {
  try {
    await qdrantClient.upsert(INVENTORY_COLLECTION, {
      wait: true,
      points: [
        {
          id: product.id,
          vector: vector,
          payload: {
            ...product,
            // Ensure all required fields are present
            createdAt: product.createdAt || new Date().toISOString(),
            updatedAt: product.updatedAt || new Date().toISOString(),
          },
        },
      ],
    });
  } catch (error) {
    console.error('Error upserting product:', error);
    throw error;
  }
}

// Batch upsert products
export async function batchUpsertProducts(
  products: Array<{ product: InventoryProduct; vector: number[] }>
): Promise<void> {
  try {
    const points = products.map(({ product, vector }) => ({
      id: product.id,
      vector: vector,
      payload: {
        ...product,
        createdAt: product.createdAt || new Date().toISOString(),
        updatedAt: product.updatedAt || new Date().toISOString(),
      },
    }));

    await qdrantClient.upsert(INVENTORY_COLLECTION, {
      wait: true,
      points: points,
    });

    console.log(`Successfully upserted ${products.length} products`);
  } catch (error) {
    console.error('Error batch upserting products:', error);
    throw error;
  }
}

// Search products using vector similarity
export async function searchProducts(
  params: SearchParams
): Promise<VectorSearchResult[]> {
  try {
    const { query, limit = 20, filter = {}, vector } = params;

    // Build filter conditions
    const must: any[] = [];

    if (filter.storeId) {
      must.push({
        key: 'storeId',
        match: { value: filter.storeId },
      });
    }

    if (filter.category) {
      must.push({
        key: 'category',
        match: { value: filter.category },
      });
    }

    if (filter.color) {
      must.push({
        key: 'color',
        match: { value: filter.color },
      });
    }

    if (filter.material) {
      must.push({
        key: 'material',
        match: { value: filter.material },
      });
    }

    if (filter.inStock !== undefined) {
      must.push({
        key: 'inStock',
        match: { value: filter.inStock },
      });
    }

    if (filter.priceRange) {
      const priceFilter: any = {
        key: 'price',
        range: {},
      };

      if (filter.priceRange.min !== undefined) {
        priceFilter.range.gte = filter.priceRange.min;
      }

      if (filter.priceRange.max !== undefined) {
        priceFilter.range.lte = filter.priceRange.max;
      }

      must.push(priceFilter);
    }

    const searchParams: any = {
      collection_name: INVENTORY_COLLECTION,
      limit: limit,
      with_payload: true,
      with_vector: false,
    };

    // If vector is provided, use it directly; otherwise use query for text search
    if (vector) {
      searchParams.vector = vector;
    } else {
      // For text search, we'll need to encode the query first
      // This should be done by the calling function
      throw new Error('Vector embedding required for search');
    }

    // Add filter if any conditions exist
    if (must.length > 0) {
      searchParams.filter = {
        must: must,
      };
    }

    const response = await qdrantClient.search(searchParams);

    return response.map((result) => ({
      id: result.id as string,
      score: result.score,
      payload: result.payload as InventoryProduct,
    }));
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
}

// Get product by ID
export async function getProduct(id: string): Promise<InventoryProduct | null> {
  try {
    const response = await qdrantClient.retrieve(INVENTORY_COLLECTION, {
      ids: [id],
      with_payload: true,
    });

    if (response.length === 0) {
      return null;
    }

    return response[0].payload as InventoryProduct;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
}

// Delete product by ID
export async function deleteProduct(id: string): Promise<void> {
  try {
    await qdrantClient.delete(INVENTORY_COLLECTION, {
      wait: true,
      points: [id],
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Get collection info
export async function getCollectionInfo() {
  try {
    const info = await qdrantClient.getCollection(INVENTORY_COLLECTION);
    return info;
  } catch (error) {
    console.error('Error getting collection info:', error);
    throw error;
  }
}

// Clear all products from collection
export async function clearCollection(): Promise<void> {
  try {
    await qdrantClient.delete(INVENTORY_COLLECTION, {
      wait: true,
      points: {
        filter: {},
      },
    });
    console.log(`Cleared all products from ${INVENTORY_COLLECTION}`);
  } catch (error) {
    console.error('Error clearing collection:', error);
    throw error;
  }
}


