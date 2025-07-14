import { NextRequest, NextResponse } from 'next/server';
import {
  inventoryApi,
  handleSquareError,
  logApiResponse,
} from '@/lib/square-client';

function chunkArray(array: any[], size: number) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

/**
 * POST /api/square/populate-inventory
 *
 * Populates Square inventory with realistic stock levels for the Threadress prototype
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[Square API] Starting inventory population...');

    // Get current inventory to see what items exist
    const inventoryResponse = await inventoryApi.batchRetrieveCounts({
      location_ids: ['LK6H4RBZGCF5C'],
    });

    const existingInventory =
      inventoryResponse.result?.counts || inventoryResponse.counts || [];
    console.log(
      `[Square API] Found ${existingInventory.length} existing inventory records`
    );

    if (!existingInventory.length) {
      return NextResponse.json({
        success: false,
        error: 'No inventory records found',
      });
    }

    // Only adjust inventory for ITEM_VARIATION types
    const stockableInventory = existingInventory.filter(
      (item: any) => item.catalog_object_type === 'ITEM_VARIATION'
    );
    const inventoryChanges = stockableInventory.map((item: any) => {
      const stockLevel = Math.floor(Math.random() * 11) + 5; // 5-15 units
      return {
        type: 'ADJUSTMENT',
        adjustment: {
          locationId: 'LK6H4RBZGCF5C',
          catalogObjectId: item.catalog_object_id,
          quantity: stockLevel.toString(),
          occurredAt: new Date().toISOString(),
          fromState: 'IN_STOCK',
          toState: 'IN_STOCK',
          note: `Initial stock setup for Threadress - ${stockLevel} units`,
        },
      };
    });

    // Batch in groups of 25
    const batches = chunkArray(inventoryChanges, 25);
    let totalSuccess = 0;
    let totalFailed = 0;
    for (const batch of batches) {
      try {
        const updateResponse = await inventoryApi.batchChangeInventory({
          idempotencyKey: `populate-inventory-${Date.now()}-${Math.random()}`,
          changes: batch,
        });
        logApiResponse('Populate Inventory', updateResponse);
        totalSuccess += batch.length;
      } catch (error) {
        totalFailed += batch.length;
        console.error('[Square API] Inventory batch error:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully populated inventory for ${totalSuccess} items. Failed: ${totalFailed}`,
      data: {
        updatedItems: totalSuccess,
        failedItems: totalFailed,
      },
    });
  } catch (error) {
    const errorResponse = handleSquareError(error);
    console.error('[Square API] Inventory population error:', errorResponse);
    return NextResponse.json(errorResponse, { status: 400 });
  }
}
