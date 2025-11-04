#!/usr/bin/env tsx

import { config } from 'dotenv';
import { QdrantClient } from '@qdrant/js-client-rest';
import { INVENTORY_COLLECTION } from '../src/lib/qdrant';

// Load env vars first
config({ path: '.env.local' });

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY!,
  checkCompatibility: false,
});

async function testSearch() {
  try {
    console.log('🔍 Testing search functionality...\n');

    // 1. Check collection exists and has data
    console.log('1. Checking collection...');
    const collectionInfo = await qdrant.getCollection(INVENTORY_COLLECTION);
    console.log(`   Collection: ${INVENTORY_COLLECTION}`);
    console.log(`   Points count: ${collectionInfo.points_count || 'unknown'}`);
    console.log(`   Vectors config:`, JSON.stringify(collectionInfo.config?.params?.vectors, null, 2));
    console.log('');

    // 2. Get a few sample points
    console.log('2. Fetching sample points...');
    const samplePoints = await qdrant.scroll(INVENTORY_COLLECTION, {
      limit: 3,
      with_payload: true,
      with_vector: false,
    });
    
    console.log(`   Found ${samplePoints.points?.length || 0} sample points`);
    if (samplePoints.points && samplePoints.points.length > 0) {
      const firstPoint = samplePoints.points[0];
      console.log(`   Sample point ID: ${firstPoint.id}`);
      console.log(`   Sample payload:`, JSON.stringify(firstPoint.payload, null, 2));
    }
    console.log('');

    // 3. Test a simple search
    console.log('3. Testing search with dummy vector...');
    // Create a dummy 512-dim vector (all zeros except first few values)
    const dummyVector = new Array(512).fill(0);
    dummyVector[0] = 0.1;
    dummyVector[1] = 0.1;
    
    try {
      const searchResults = await qdrant.search(INVENTORY_COLLECTION, {
        vector: {
          name: 'combined',
          vector: dummyVector,
        },
        limit: 5,
        with_payload: true,
      });
      
      console.log(`   Search returned ${searchResults.length} results`);
      if (searchResults.length > 0) {
        console.log(`   First result:`, {
          id: searchResults[0].id,
          score: searchResults[0].score,
          title: searchResults[0].payload?.title,
        });
      } else {
        console.log('   ⚠️  No results found - this might indicate vector issues');
      }
    } catch (searchError: any) {
      console.error('   ❌ Search failed:', searchError.message);
    }
    console.log('');

    // 4. Check if vectors are actually populated
    console.log('4. Checking vector quality...');
    const pointWithVector = await qdrant.retrieve(INVENTORY_COLLECTION, {
      ids: [samplePoints.points?.[0]?.id || 1],
      with_vector: true,
      with_payload: false,
    });
    
    if (pointWithVector.length > 0 && pointWithVector[0].vector) {
      const vector = pointWithVector[0].vector;
      if (typeof vector === 'object' && 'combined' in vector) {
        const combinedVec = (vector as any).combined;
        const nonZeroCount = combinedVec.filter((v: number) => v !== 0).length;
        console.log(`   Combined vector dimension: ${combinedVec.length}`);
        console.log(`   Non-zero values: ${nonZeroCount}/${combinedVec.length}`);
        if (nonZeroCount === 0) {
          console.log('   ❌ VECTORS ARE ALL ZEROS - This is the problem!');
          console.log('   The embeddings were not generated properly during sync.');
        } else {
          console.log(`   ✅ Vectors look good (${((nonZeroCount/combinedVec.length)*100).toFixed(1)}% non-zero)`);
        }
      }
    }

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

testSearch();

