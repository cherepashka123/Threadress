import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import {
  qdrant,
  ensureInventoryCollection,
  INVENTORY_COLLECTION,
} from '@/lib/qdrant';
import {
  embedTextBatch,
  embedImageBatch,
  combineAdvancedVectorsWithVibe,
} from '@/lib/clip-advanced';
import {
  buildInventoryText,
  extractInventoryFields,
  generateInventoryId,
  isValidInventoryRow,
} from '@/lib/text';

export const dynamic = 'force-dynamic';

async function readSheet(sheetName: string = 'manieredevoir') {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Read all data from the specified sheet - use a wide range to capture all columns
  // Read all rows and up to column Z (26 columns), expand if needed
  const range = `${sheetName}!A:Z`;

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range,
    });

    const rows = res.data.values ?? [];
    if (rows.length < 2) {
      console.log(
        `No rows found in sheet "${sheetName}" (need at least header + 1 data row)`
      );
      return [];
    }

    const headers = rows[0].map((h) => String(h).trim());
    const toObj = (r: any[]) =>
      headers.reduce((acc: any, h: string, i: number) => {
        acc[h] = r[i] ?? '';
        return acc;
      }, {});

    const allItems = rows
      .slice(1)
      .filter((r) => r.some((c) => c && String(c).trim() !== '')) // Filter empty rows
      .map(toObj)
      .filter(isValidInventoryRow); // Filter out invalid rows

    console.log(
      `Read ${rows.length - 1} rows from sheet "${sheetName}", ${allItems.length} valid items after filtering`
    );

    return allItems;
  } catch (error: any) {
    console.error(`Error reading sheet "${sheetName}":`, error.message);
    // If the sheet doesn't exist, try Sheet1 as fallback
    if (
      sheetName !== 'Sheet1' &&
      error.message?.includes('Unable to parse range')
    ) {
      console.log(
        `Sheet "${sheetName}" not found, trying Sheet1 as fallback...`
      );
      return readSheet('Sheet1');
    }
    throw error;
  }
}

/**
 * Get list of all sheets in the spreadsheet
 */
async function getAllSheetNames(): Promise<string[]> {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const res = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    });

    const sheetNames =
      res.data.sheets?.map((sheet) => sheet.properties?.title || '').filter(Boolean) || [];

    return sheetNames;
  } catch (error: any) {
    console.error('Error getting sheet names:', error.message);
    // Fallback to default sheets if we can't list them
    return ['manieredevoir', 'rouje', 'Sheet1'];
  }
}

/**
 * Sync inventory from Google Sheets to Qdrant
 * Supports both GET (manual trigger) and POST (webhook/automatic)
 */
export async function GET(req: NextRequest) {
  // Allow manual sync via GET request - call the POST handler logic
  return await POST(req);
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body to get optional sheet names
    let requestedSheets: string[] = [];
    try {
      const body = await req.json().catch(() => ({}));
      requestedSheets = body.sheets || [];
    } catch {
      // If no body or invalid JSON, use all sheets
    }

    console.log('Starting inventory sync from Google Sheets to Qdrant...');

    // Determine which sheets to sync
    let sheetsToSync: string[] = [];
    if (requestedSheets.length > 0) {
      // Use requested sheets
      sheetsToSync = requestedSheets;
      console.log(`Syncing requested sheets: ${sheetsToSync.join(', ')}`);
    } else {
      // Auto-detect all sheets (excluding system sheets)
      const allSheets = await getAllSheetNames();
      // Filter out common system sheet names
      const systemSheets = ['Sheet1', 'Sheet2', 'Sheet3', 'Template', 'Instructions'];
      sheetsToSync = allSheets.filter(
        (name) => !systemSheets.includes(name) && name.length > 0
      );
      // If no specific sheets found, default to manieredevoir
      if (sheetsToSync.length === 0) {
        sheetsToSync = ['manieredevoir'];
      }
      console.log(`Auto-detected sheets to sync: ${sheetsToSync.join(', ')}`);
    }

    // Read inventory from all specified sheets
    let allInventory: any[] = [];
    const sheetStats: Record<string, number> = {};

    for (const sheetName of sheetsToSync) {
      try {
        const inventory = await readSheet(sheetName);
        sheetStats[sheetName] = inventory.length;
        allInventory = allInventory.concat(inventory);
        console.log(
          `Found ${inventory.length} valid items from "${sheetName}" sheet`
        );
      } catch (error: any) {
        console.error(`Error reading sheet "${sheetName}":`, error.message);
        // Continue with other sheets even if one fails
      }
    }

    console.log(
      `Total: ${allInventory.length} valid inventory items from ${sheetsToSync.length} sheet(s)`
    );

    if (allInventory.length === 0) {
      return NextResponse.json({
        ok: true,
        message: 'No inventory items found to sync',
        upserted: 0,
        sheets: sheetStats,
        collection: INVENTORY_COLLECTION,
      });
    }

    // Ensure Qdrant collection exists
    await ensureInventoryCollection();

    // Build texts, image URLs & payloads
    const ids: number[] = []; // Qdrant requires unsigned integers or UUIDs
    const texts: string[] = [];
    const imageUrls: string[] = [];
    const payloads: Record<string, any>[] = [];

    for (const row of allInventory) {
      const id = generateInventoryId(row);
      const text = buildInventoryText(row);
      const fields = extractInventoryFields(row);

      ids.push(id);
      texts.push(text);
      imageUrls.push(fields.url || ''); // Use image URL from the row
      payloads.push({
        // Keep fields for filters and display
        title: fields.title,
        brand: fields.brand,
        category: fields.category,
        description: fields.description,
        price: fields.price,
        currency: fields.currency,
        url: fields.url, // Primary image URL
        Main_Image_URL: fields.Main_Image_URL || '', // Store separately for fallback
        Hover_Image_URL: fields.Hover_Image_URL || '', // Store separately for fallback
        product_url: fields.product_url || '', // Product URL for fetching images if needed
        store_id: fields.store_id || 1, // Default store_id if not provided
        color: fields.color,
        material: fields.material,
        size: fields.size,
        style: fields.style,
        occasion: fields.occasion,
        season: fields.season,
        tags: fields.tags,
        store_name: fields.store_name,
        address: fields.address,
        lat: fields.lat,
        lng: fields.lng,
        // Small preview for display
        preview: text.slice(0, 240),
        // Metadata
        synced_at: new Date().toISOString(),
      });
    }

    // Batch process to avoid rate limits
    const BATCH_SIZE = 48; // Conservative batch size for Vertex AI
    let upserted = 0;
    let errors = 0;

    console.log(
      `Processing ${ids.length} items in batches of ${BATCH_SIZE}...`
    );

    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      const chunkIds = ids.slice(i, i + BATCH_SIZE);
      const chunkTexts = texts.slice(i, i + BATCH_SIZE);
      const chunkImageUrls = imageUrls.slice(i, i + BATCH_SIZE);
      const chunkPayloads = payloads.slice(i, i + BATCH_SIZE);

      try {
        console.log(
          `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(ids.length / BATCH_SIZE)}...`
        );

        // Generate text and image embeddings for this batch using CLIP Advanced
        const [textVectors, imageVectors] = await Promise.all([
          embedTextBatch(chunkTexts),
          embedImageBatch(chunkImageUrls),
        ]);

        // Generate combined multimodal vectors with CLIP Advanced (512 dimensions)
        // Use optimized weights: text 0.5, image 0.3, vibe 0.2
        // For batch sync, we don't extract vibe context, so vibe weight will be effectively zero
        const combinedVectors = textVectors.map((textVec, j) => {
          // Vibe vector will be zero for batch processing - vibe is extracted at query time
          const vibeVector = new Array(384).fill(0);
          return combineAdvancedVectorsWithVibe(
            textVec,
            imageVectors[j],
            vibeVector,
            0.6, // text weight (higher since no vibe at sync time)
            0.4, // image weight
            0.0 // vibe weight (will be extracted at query time)
          );
        });

        // Upsert to Qdrant with all three vector types
        // IDs must be unsigned integers or UUIDs per Qdrant requirements
        await qdrant.upsert(INVENTORY_COLLECTION, {
          wait: true,
          points: chunkIds.map((id, j) => ({
            id: typeof id === 'number' ? id : parseInt(String(id), 10),
            vector: {
              text: textVectors[j],
              image: imageVectors[j],
              combined: combinedVectors[j],
            },
            payload: chunkPayloads[j],
          })),
        });

        upserted += chunkIds.length;
        console.log(
          `✅ Batch ${Math.floor(i / BATCH_SIZE) + 1} completed: ${chunkIds.length} items`
        );

        // Small delay to avoid rate limiting
        if (i + BATCH_SIZE < ids.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (batchError) {
        console.error(
          `❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed:`,
          batchError
        );
        errors += chunkIds.length;
      }
    }

    const success = errors === 0;
    const message = success
      ? `Successfully synced ${upserted} items to Qdrant`
      : `Synced ${upserted} items with ${errors} errors`;

    console.log(`Sync completed: ${message}`);

    return NextResponse.json({
      ok: success,
      message,
      upserted,
      errors,
      total: allInventory.length,
      sheets: sheetStats,
      collection: INVENTORY_COLLECTION,
    });
  } catch (err: any) {
    console.error('POST /api/inventory/sync error:', err?.message || err);
    return NextResponse.json(
      {
        ok: false,
        error: 'Sync to Qdrant failed',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Helper function for safe number conversion
function safeNum(v: any): number | undefined {
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}
