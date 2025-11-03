#!/usr/bin/env tsx

/**
 * Simple test script with hardcoded Qdrant credentials
 */

// Set environment variables directly
process.env.QDRANT_URL =
  'https://2d684b58-dfb1-4058-967f-9d4f248030c8.us-east4-0.gcp.cloud.qdrant.io';
process.env.QDRANT_API_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.sRD2SjycruCSbj2HGoigYEwSh9TzT_zmOHa-3DGdTWg';

async function testQdrantConnection() {
  try {
    console.log('🔗 Testing Qdrant connection...');

    const { qdrant, ensureInventoryCollection, getCollectionInfo } =
      await import('../src/lib/qdrant');

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
    } else {
      console.log('   No results found (collection is empty)');
    }

    return true;
  } catch (error) {
    console.error('❌ Search test failed:', error);
    return false;
  }
}

async function testAddSampleData() {
  try {
    console.log('📝 Adding sample data...');

    const { qdrant, INVENTORY_COLLECTION } = await import('../src/lib/qdrant');

    // Create sample data with proper UUIDs
    const sampleData = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        vector: new Array(768).fill(0.1),
        payload: {
          title: 'Summer Dress',
          brand: 'Zara',
          category: 'Dresses',
          price: 89.99,
          color: 'Blue',
          material: 'Cotton',
          preview:
            'Summer Dress | Zara | Dresses | Blue cotton dress for summer',
          synced_at: new Date().toISOString(),
        },
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        vector: new Array(768).fill(0.2),
        payload: {
          title: 'Leather Jacket',
          brand: 'H&M',
          category: 'Jackets',
          price: 129.99,
          color: 'Black',
          material: 'Leather',
          preview: 'Leather Jacket | H&M | Jackets | Black leather jacket',
          synced_at: new Date().toISOString(),
        },
      },
    ];

    await qdrant.upsert(INVENTORY_COLLECTION, {
      wait: true,
      points: sampleData,
    });

    console.log('✅ Sample data added successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to add sample data:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing Qdrant integration...\n');

  const qdrantTest = await testQdrantConnection();
  if (!qdrantTest) {
    console.log('❌ Qdrant test failed, stopping tests');
    return;
  }

  const searchTest = await testBasicSearch();
  if (!searchTest) {
    console.log('❌ Search test failed');
    return;
  }

  const addDataTest = await testAddSampleData();
  if (!addDataTest) {
    console.log('❌ Add data test failed');
    return;
  }

  // Test search again with data
  const searchTest2 = await testBasicSearch();
  if (!searchTest2) {
    console.log('❌ Second search test failed');
    return;
  }

  console.log('\n🎉 Qdrant integration is working perfectly!');
  console.log('\nNext steps:');
  console.log('1. Create .env.local with your Google Sheets credentials');
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
