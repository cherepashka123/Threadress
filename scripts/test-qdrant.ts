#!/usr/bin/env tsx

/**
 * Test script to verify Qdrant integration
 * This script will test the vector search functionality
 */

import { config } from 'dotenv';
import {
  initializeCollection,
  searchProducts,
  getCollectionInfo,
  clearCollection,
  type SearchParams,
} from '../src/lib/qdrant-client';
import { generateQueryEmbedding } from '../src/lib/embedding-service';

// Load environment variables
config({ path: '.env.local' });

async function testQdrantConnection() {
  try {
    console.log('🧪 Testing Qdrant connection...');

    // Initialize collection
    await initializeCollection();
    console.log('✅ Collection initialized');

    // Get collection info
    const info = await getCollectionInfo();
    console.log('📊 Collection info:', {
      pointsCount: info.points_count,
      vectorSize: info.config.params.vectors.size,
      distance: info.config.params.vectors.distance,
    });

    return true;
  } catch (error) {
    console.error('❌ Qdrant connection failed:', error);
    return false;
  }
}

async function testVectorSearch() {
  try {
    console.log('🔍 Testing vector search...');

    const testQueries = [
      'summer dress',
      'business casual',
      'evening wear',
      'leather jacket',
      'cotton t-shirt',
    ];

    for (const query of testQueries) {
      console.log(`\n🔎 Searching for: "${query}"`);

      const vector = await generateQueryEmbedding(query);

      const searchParams: SearchParams = {
        query,
        limit: 5,
        vector,
      };

      const results = await searchProducts(searchParams);

      console.log(`   Found ${results.length} results:`);
      results.forEach((result, index) => {
        console.log(
          `   ${index + 1}. ${result.payload.title} (score: ${result.score.toFixed(3)})`
        );
      });
    }

    return true;
  } catch (error) {
    console.error('❌ Vector search test failed:', error);
    return false;
  }
}

async function testFilteredSearch() {
  try {
    console.log('🔍 Testing filtered search...');

    const vector = await generateQueryEmbedding('dress');

    const searchParams: SearchParams = {
      query: 'dress',
      limit: 3,
      filter: {
        inStock: true,
        priceRange: {
          min: 50,
          max: 200,
        },
      },
      vector,
    };

    const results = await searchProducts(searchParams);

    console.log(
      `   Found ${results.length} in-stock dresses between $50-$200:`
    );
    results.forEach((result, index) => {
      console.log(
        `   ${index + 1}. ${result.payload.title} - $${result.payload.price} (in stock: ${result.payload.inStock})`
      );
    });

    return true;
  } catch (error) {
    console.error('❌ Filtered search test failed:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting Qdrant integration tests...\n');

  // Test connection
  const connectionTest = await testQdrantConnection();
  if (!connectionTest) {
    console.log('❌ Connection test failed, stopping tests');
    return;
  }

  // Test vector search
  const searchTest = await testVectorSearch();
  if (!searchTest) {
    console.log('❌ Vector search test failed');
    return;
  }

  // Test filtered search
  const filteredTest = await testFilteredSearch();
  if (!filteredTest) {
    console.log('❌ Filtered search test failed');
    return;
  }

  console.log(
    '\n🎉 All tests passed! Qdrant integration is working correctly.'
  );
  console.log('\nYou can now use the API endpoints:');
  console.log('- GET /api/inventory?q=your_search_query');
  console.log('- POST /api/inventory with sync action');
}

// Run the script
if (require.main === module) {
  main();
}


