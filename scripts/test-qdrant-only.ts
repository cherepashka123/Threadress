#!/usr/bin/env tsx

/**
 * Test script for Qdrant connection only (no Google Sheets required)
 */

import { config } from 'dotenv';
import {
  ensureInventoryCollection,
  getCollectionInfo,
} from '../src/lib/qdrant';

// Load environment variables
config({ path: '.env.local' });

async function testQdrantOnly() {
  try {
    console.log('🔗 Testing Qdrant connection...');

    // Set minimal required env vars for Qdrant
    if (!process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) {
      console.error('❌ QDRANT_URL and QDRANT_API_KEY are required');
      return false;
    }

    await ensureInventoryCollection();
    const info = await getCollectionInfo();

    console.log('✅ Qdrant connection successful');
    console.log(`   Collection: ${info.collection_name}`);
    console.log(`   Points: ${info.points_count}`);
    console.log(`   Vector size: ${info.config.params.vectors.size}`);
    console.log(`   Distance: ${info.config.params.vectors.distance}`);

    return true;
  } catch (error) {
    console.error('❌ Qdrant connection failed:', error);
    return false;
  }
}

async function testBasicSearch() {
  try {
    console.log('🔍 Testing basic search...');

    const { qdrant, INVENTORY_COLLECTION } = await import('../src/lib/qdrant');

    // Create a simple test vector (768 dimensions)
    const testVector = new Array(768).fill(0.1);

    const results = await qdrant.search(INVENTORY_COLLECTION, {
      vector: testVector,
      limit: 5,
      with_payload: true,
    });

    console.log(`✅ Search successful - found ${results.length} results`);

    if (results.length > 0) {
      console.log('   Sample result:', {
        id: results[0].id,
        score: results[0].score,
        payload: results[0].payload,
      });
    }

    return true;
  } catch (error) {
    console.error('❌ Search test failed:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing Qdrant integration...\n');

  const qdrantTest = await testQdrantOnly();
  if (!qdrantTest) {
    console.log('❌ Qdrant test failed, stopping tests');
    return;
  }

  const searchTest = await testBasicSearch();
  if (!searchTest) {
    console.log('❌ Search test failed');
    return;
  }

  console.log('\n🎉 Qdrant integration is working!');
  console.log('\nNext steps:');
  console.log('1. Add your Google Sheets credentials to .env.local');
  console.log('2. Start the server: npm run dev');
  console.log('3. Sync your inventory: POST /api/inventory/sync');
  console.log(
    '4. Search your inventory: GET /api/inventory/search?q=your_query'
  );
}

// Run the script
if (require.main === module) {
  main();
}


