#!/usr/bin/env tsx

import { config } from 'dotenv';
import {
  qdrant,
  INVENTORY_COLLECTION,
  TEXT_EMBED_DIM,
  IMAGE_EMBED_DIM,
  COMBINED_EMBED_DIM,
} from '../src/lib/qdrant';

config({ path: '.env.local' });

async function recreateCollection() {
  try {
    console.log('🗑️  Deleting existing collection...');
    try {
      await qdrant.deleteCollection(INVENTORY_COLLECTION);
      console.log('✅ Collection deleted');
    } catch (err: any) {
      if (err.message?.includes("doesn't exist")) {
        console.log('Collection does not exist, creating new one...');
      } else {
        throw err;
      }
    }

    console.log('\n📦 Creating collection with named vectors...');
    await qdrant.createCollection(INVENTORY_COLLECTION, {
      vectors: {
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
    console.log('✅ Collection created with named vectors');

    console.log('\n📊 Creating payload indexes...');
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
      console.log('✅ Indexes created');
    } catch (err) {
      console.warn('⚠️  Could not create indexes:', err);
    }

    console.log('\n✅ Collection ready for sync!');
  } catch (err: any) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

recreateCollection();
