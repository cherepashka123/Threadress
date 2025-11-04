import { QdrantClient } from '@qdrant/js-client-rest';

export const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY!,
});

export const INVENTORY_COLLECTION = 'inventory_items';
export const TEXT_EMBED_DIM = 384; // Hugging Face sentence-transformers for text
export const IMAGE_EMBED_DIM = 512; // CLIP for images
export const COMBINED_EMBED_DIM = 512; // Combined multimodal vector

export async function ensureInventoryCollection() {
  try {
    const collections = await qdrant.getCollections();
    const exists = collections.collections?.some(
      (c) => c.name === INVENTORY_COLLECTION
    );

    if (!exists) {
      console.log(`Creating Qdrant collection: ${INVENTORY_COLLECTION}`);
      await qdrant.createCollection(INVENTORY_COLLECTION, {
        vectors: {
          // Named vectors for multimodal search
          text: {
            size: TEXT_EMBED_DIM,
            distance: 'Cosine',
          },
          image: {
            size: IMAGE_EMBED_DIM,
            distance: 'Cosine',
          },
          combined: {
            size: COMBINED_EMBED_DIM,
            distance: 'Cosine',
          },
        },
        optimizers_config: {
          default_segment_number: 2,
        },
        replication_factor: 1,
      });

      // Create payload indexes for better filtering performance
      try {
        await qdrant.createPayloadIndex(INVENTORY_COLLECTION, {
          field_name: 'brand',
          field_schema: 'keyword',
        });

        await qdrant.createPayloadIndex(INVENTORY_COLLECTION, {
          field_name: 'category',
          field_schema: 'keyword',
        });

        await qdrant.createPayloadIndex(INVENTORY_COLLECTION, {
          field_name: 'store_id',
          field_schema: 'integer',
        });

        await qdrant.createPayloadIndex(INVENTORY_COLLECTION, {
          field_name: 'price',
          field_schema: 'float',
        });

        console.log(`Collection ${INVENTORY_COLLECTION} created with indexes`);
      } catch (indexError) {
        console.warn('Could not create payload indexes:', indexError);
      }
    } else {
      console.log(`Collection ${INVENTORY_COLLECTION} already exists`);
    }
  } catch (error) {
    console.error('Error ensuring collection:', error);
    throw error;
  }
}

export async function getCollectionInfo() {
  try {
    return await qdrant.getCollection(INVENTORY_COLLECTION);
  } catch (error) {
    console.error('Error getting collection info:', error);
    throw error;
  }
}

export async function clearInventoryCollection() {
  try {
    // Delete all points by using scroll to get all IDs first
    const allPoints = await qdrant.scroll(INVENTORY_COLLECTION, {
      limit: 10000,
      with_payload: false,
      with_vector: false,
    });
    
    if (allPoints.points && allPoints.points.length > 0) {
      const ids = allPoints.points.map(p => p.id);
      await qdrant.delete(INVENTORY_COLLECTION, {
        wait: true,
        points: ids,
      });
      console.log(`Cleared ${ids.length} points from ${INVENTORY_COLLECTION}`);
    } else {
      console.log(`No points to clear from ${INVENTORY_COLLECTION}`);
    }
  } catch (error) {
    console.error('Error clearing collection:', error);
    throw error;
  }
}
