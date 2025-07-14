import { inventoryApi, catalogApi } from '../src/lib/square-client';

/**
 * Script to populate Square inventory with realistic stock levels
 * This sets up inventory counts for all catalog items to simulate a real boutique
 */

async function populateInventory() {
  try {
    console.log('🔄 Starting inventory population...');

    // First, get all catalog items
    const catalogResponse = await catalogApi.list({
      types: ['ITEM'],
      limit: 100,
    });

    if (!catalogResponse.result.objects) {
      console.log('❌ No catalog items found');
      return;
    }

    console.log(
      `📦 Found ${catalogResponse.result.objects.length} catalog items`
    );

    // Get locations
    const locationsResponse = await fetch('/api/square/locations');
    const locationsData = await locationsResponse.json();

    if (!locationsData.success || !locationsData.data.locations) {
      console.log('❌ No locations found');
      return;
    }

    const locationId = locationsData.data.locations[0].id;
    console.log(`📍 Using location: ${locationId}`);

    // Create inventory adjustments for each item
    const changes = catalogResponse.result.objects
      .filter((item: any) => item.type === 'ITEM' && item.itemData?.variations)
      .flatMap((item: any) => {
        return item.itemData.variations.map((variation: any) => ({
          type: 'ADJUSTMENT',
          adjustment: {
            locationId: locationId,
            catalogObjectId: variation.id,
            quantity: generateRandomStock(),
            occurredAt: new Date().toISOString(),
            fromState: 'NONE',
            toState: 'IN_STOCK',
            note: 'Initial inventory setup for Threadress prototype',
          },
        }));
      });

    console.log(`📊 Creating ${changes.length} inventory adjustments...`);

    // Batch adjust inventory
    const inventoryResponse = await inventoryApi.batchChangeInventory({
      idempotencyKey: `inventory-setup-${Date.now()}`,
      changes: changes,
    });

    if (
      inventoryResponse.result.errors &&
      inventoryResponse.result.errors.length > 0
    ) {
      console.log('⚠️ Some inventory adjustments failed:');
      inventoryResponse.result.errors.forEach((error: any) => {
        console.log(`  - ${error.code}: ${error.message}`);
      });
    }

    if (inventoryResponse.result.counts) {
      console.log(
        `✅ Successfully set inventory for ${inventoryResponse.result.counts.length} items`
      );

      // Show some examples
      inventoryResponse.result.counts.slice(0, 5).forEach((count: any) => {
        console.log(`  📦 ${count.catalogObjectId}: ${count.quantity} units`);
      });
    }

    console.log('🎉 Inventory population complete!');
  } catch (error) {
    console.error('❌ Error populating inventory:', error);
  }
}

function generateRandomStock(): string {
  // Generate realistic stock levels: 0-15 units for most items, 20-30 for popular items
  const isPopular = Math.random() < 0.3; // 30% chance of being popular
  const maxStock = isPopular ? 30 : 15;
  const minStock = isPopular ? 5 : 0;
  return Math.floor(
    Math.random() * (maxStock - minStock + 1) + minStock
  ).toString();
}

// Run the script
populateInventory();
