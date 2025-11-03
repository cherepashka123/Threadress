#!/usr/bin/env tsx

/**
 * Test script for API endpoints only (no Google Sheets required)
 */

async function testSearchEndpoint() {
  try {
    console.log('🔍 Testing search endpoint...');

    const baseUrl = 'http://localhost:3000';
    const response = await fetch(
      `${baseUrl}/api/inventory/search?q=summer+dress&k=5`
    );

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Search endpoint successful');
      console.log(`   Found ${result.count} results`);
      if (result.hits && result.hits.length > 0) {
        console.log(
          `   Top result: ${result.hits[0].title} (score: ${result.hits[0].score.toFixed(3)})`
        );
      }
      return true;
    } else {
      const error = await response.text();
      console.error('❌ Search endpoint failed:', response.status, error);
      return false;
    }
  } catch (error) {
    console.error('❌ Search endpoint test failed:', error);
    return false;
  }
}

async function testOriginalInventoryEndpoint() {
  try {
    console.log('📦 Testing original inventory endpoint...');

    const baseUrl = 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/inventory`);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Original inventory endpoint successful');
      console.log(
        `   Found ${result.count || result.inventory?.length || 0} items`
      );
      return true;
    } else {
      const error = await response.text();
      console.error(
        '❌ Original inventory endpoint failed:',
        response.status,
        error
      );
      return false;
    }
  } catch (error) {
    console.error('❌ Original inventory endpoint test failed:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing API endpoints...\n');

  // Wait a moment for server to be ready
  console.log('⏳ Waiting for server to be ready...');
  await new Promise((resolve) => setTimeout(resolve, 3000));

  const searchTest = await testSearchEndpoint();
  const inventoryTest = await testOriginalInventoryEndpoint();

  console.log('\n📊 Test Results:');
  console.log(`   Search endpoint: ${searchTest ? '✅' : '❌'}`);
  console.log(`   Original inventory endpoint: ${inventoryTest ? '✅' : '❌'}`);

  if (searchTest && inventoryTest) {
    console.log('\n🎉 All API endpoints are working!');
  } else {
    console.log('\n⚠️  Some endpoints failed - check the server logs');
  }

  console.log('\nNext steps:');
  console.log('1. Add your Google Sheets credentials to .env.local');
  console.log('2. Test sync endpoint: POST /api/inventory/sync');
  console.log('3. Test search with real data');
}

// Run the script
if (require.main === module) {
  main();
}


