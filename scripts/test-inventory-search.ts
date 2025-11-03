#!/usr/bin/env tsx

/**
 * Test script for the inventory search integration
 * Tests both sync and search functionality
 */

import { config } from 'dotenv';
import {
  ensureInventoryCollection,
  getCollectionInfo,
  clearInventoryCollection,
} from '../src/lib/qdrant';
import { testVertexAI } from '../src/lib/vertex';

// Load environment variables
config({ path: '.env.local' });

async function testEnvironmentVariables() {
  console.log('🔍 Checking environment variables...');

  const required = [
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_PRIVATE_KEY',
    'GOOGLE_SHEET_ID',
    'GOOGLE_CLOUD_PROJECT',
    'QDRANT_URL',
    'QDRANT_API_KEY',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    return false;
  }

  console.log('✅ All required environment variables are set');
  return true;
}

async function testQdrantConnection() {
  try {
    console.log('🔗 Testing Qdrant connection...');

    await ensureInventoryCollection();
    const info = await getCollectionInfo();

    console.log('✅ Qdrant connection successful');
    console.log(`   Collection: ${info.collection_name}`);
    console.log(`   Points: ${info.points_count}`);
    console.log(`   Vector size: ${info.config.params.vectors.size}`);

    return true;
  } catch (error) {
    console.error('❌ Qdrant connection failed:', error);
    return false;
  }
}

async function testVertexAI() {
  try {
    console.log('🧠 Testing Vertex AI connection...');

    const success = await testVertexAI();

    if (success) {
      console.log('✅ Vertex AI connection successful');
    } else {
      console.error('❌ Vertex AI test failed');
    }

    return success;
  } catch (error) {
    console.error('❌ Vertex AI connection failed:', error);
    return false;
  }
}

async function testSyncEndpoint() {
  try {
    console.log('📤 Testing sync endpoint...');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/inventory/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (result.ok) {
      console.log('✅ Sync endpoint successful');
      console.log(`   Upserted: ${result.upserted} items`);
      console.log(`   Errors: ${result.errors || 0}`);
    } else {
      console.error('❌ Sync endpoint failed:', result.error);
    }

    return result.ok;
  } catch (error) {
    console.error('❌ Sync endpoint test failed:', error);
    return false;
  }
}

async function testSearchEndpoint() {
  try {
    console.log('🔍 Testing search endpoint...');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const testQueries = [
      'summer dress',
      'leather jacket',
      'business casual',
      'evening wear',
      'cotton t-shirt',
    ];

    for (const query of testQueries) {
      console.log(`   Testing query: "${query}"`);

      const response = await fetch(
        `${baseUrl}/api/inventory/search?q=${encodeURIComponent(query)}&k=3`
      );
      const result = await response.json();

      if (result.ok) {
        console.log(`   ✅ Found ${result.count} results`);
        if (result.hits.length > 0) {
          console.log(
            `      Top result: ${result.hits[0].title} (score: ${result.hits[0].score.toFixed(3)})`
          );
        }
      } else {
        console.error(`   ❌ Search failed: ${result.error}`);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Search endpoint test failed:', error);
    return false;
  }
}

async function testFilteredSearch() {
  try {
    console.log('🔍 Testing filtered search...');

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/inventory/search?q=dress&category=dresses&minPrice=50&maxPrice=200&k=5`
    );
    const result = await response.json();

    if (result.ok) {
      console.log('✅ Filtered search successful');
      console.log(`   Found ${result.count} filtered results`);
      console.log(`   Filters applied:`, result.filters);
    } else {
      console.error('❌ Filtered search failed:', result.error);
    }

    return result.ok;
  } catch (error) {
    console.error('❌ Filtered search test failed:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting inventory search integration tests...\n');

  // Test environment variables
  const envTest = await testEnvironmentVariables();
  if (!envTest) {
    console.log('❌ Environment test failed, stopping tests');
    return;
  }

  // Test Qdrant connection
  const qdrantTest = await testQdrantConnection();
  if (!qdrantTest) {
    console.log('❌ Qdrant test failed, stopping tests');
    return;
  }

  // Test Vertex AI connection
  const vertexTest = await testVertexAI();
  if (!vertexTest) {
    console.log('❌ Vertex AI test failed, stopping tests');
    return;
  }

  // Test sync endpoint (only if server is running)
  console.log('\n📤 Testing sync endpoint (requires running server)...');
  const syncTest = await testSyncEndpoint();
  if (!syncTest) {
    console.log(
      '⚠️  Sync test failed - make sure the server is running with: npm run dev'
    );
  }

  // Test search endpoints (only if server is running)
  console.log('\n🔍 Testing search endpoints (requires running server)...');
  const searchTest = await testSearchEndpoint();
  if (!searchTest) {
    console.log(
      '⚠️  Search test failed - make sure the server is running with: npm run dev'
    );
  }

  const filteredTest = await testFilteredSearch();
  if (!filteredTest) {
    console.log(
      '⚠️  Filtered search test failed - make sure the server is running with: npm run dev'
    );
  }

  console.log('\n🎉 Integration tests completed!');
  console.log('\nNext steps:');
  console.log('1. Start the server: npm run dev');
  console.log('2. Sync your inventory: POST /api/inventory/sync');
  console.log(
    '3. Search your inventory: GET /api/inventory/search?q=your_query'
  );
}

// Run the script
if (require.main === module) {
  main();
}


