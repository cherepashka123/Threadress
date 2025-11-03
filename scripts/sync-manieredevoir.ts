#!/usr/bin/env tsx

/**
 * Script to sync inventory from Google Sheets "manieredevoir" sheet to Qdrant
 * Runs the same sync logic as the API endpoint but as a standalone script
 */

import { config } from 'dotenv';
import { google } from 'googleapis';
import {
  qdrant,
  ensureInventoryCollection,
  INVENTORY_COLLECTION,
} from '../src/lib/qdrant';
import {
  embedTextBatch,
  embedImageBatch,
  combineAdvancedVectorsWithVibe,
} from '../src/lib/clip-advanced';
import {
  buildInventoryText,
  extractInventoryFields,
  generateInventoryId,
  isValidInventoryRow,
} from '../src/lib/text';

// Load environment variables
config({ path: '.env.local' });

// Fix private key - dotenv might not handle multi-line values correctly
// Read it directly from the file if needed
import fs from 'fs';
import path from 'path';

if (
  !process.env.GOOGLE_PRIVATE_KEY ||
  process.env.GOOGLE_PRIVATE_KEY.length < 100
) {
  try {
    const envFile = fs.readFileSync(
      path.join(process.cwd(), '.env.local'),
      'utf8'
    );
    const keyMatch = envFile.match(/GOOGLE_PRIVATE_KEY="([^"]+)"/s);
    if (keyMatch && keyMatch[1]) {
      // Replace literal \n with actual newlines
      process.env.GOOGLE_PRIVATE_KEY = keyMatch[1].replace(/\\n/g, '\n');
    }
  } catch (err) {
    console.warn('Could not read private key from file directly');
  }
}

// Verify required environment variables
if (!process.env.QDRANT_URL) {
  console.error('❌ QDRANT_URL environment variable is not set');
  process.exit(1);
}
if (!process.env.QDRANT_API_KEY) {
  console.error('❌ QDRANT_API_KEY environment variable is not set');
  process.exit(1);
}
if (!process.env.HF_TOKEN) {
  console.warn(
    '⚠️  HF_TOKEN environment variable is not set - embeddings may not work'
  );
}
if (!process.env.GOOGLE_SHEET_ID) {
  console.error('❌ GOOGLE_SHEET_ID environment variable is not set');
  process.exit(1);
}

console.log('✅ Environment variables loaded');
console.log(`   QDRANT_URL: ${process.env.QDRANT_URL?.substring(0, 50)}...`);
console.log(
  `   QDRANT_API_KEY: ${process.env.QDRANT_API_KEY ? 'Set' : 'Missing'}`
);
console.log(`   HF_TOKEN: ${process.env.HF_TOKEN ? 'Set' : 'Missing'}`);
console.log(`   GOOGLE_SHEET_ID: ${process.env.GOOGLE_SHEET_ID}\n`);

async function readSheet(sheetName: string = 'manieredevoir') {
  // Handle private key formatting - replace literal \n with actual newlines
  let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
  // Remove surrounding quotes if present
  privateKey = privateKey.replace(/^["']|["']$/g, '');
  // Replace literal \n sequences with actual newlines
  privateKey = privateKey.replace(/\\n/g, '\n');

  if (!privateKey.includes('BEGIN PRIVATE KEY')) {
    throw new Error('Invalid private key format - missing BEGIN PRIVATE KEY');
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const range = `${sheetName}!A:Z`;

  try {
    console.log(`Reading sheet "${sheetName}"...`);
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
      .filter((r) => r.some((c) => c && String(c).trim() !== ''))
      .map(toObj)
      .filter(isValidInventoryRow);

    console.log(
      `Read ${rows.length - 1} rows from sheet "${sheetName}", ${allItems.length} valid items after filtering`
    );

    return allItems;
  } catch (error: any) {
    console.error(`Error reading sheet "${sheetName}":`, error.message);
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

async function main() {
  try {
    console.log('🚀 Starting inventory sync from Google Sheets to Qdrant...\n');

    // Read inventory from the "manieredevoir" sheet
    const inventory = await readSheet('manieredevoir');
    console.log(`📦 Found ${inventory.length} valid inventory items\n`);

    if (inventory.length === 0) {
      console.log('❌ No inventory items found to sync');
      process.exit(0);
    }

    // Ensure Qdrant collection exists
    console.log('🗄️ Ensuring Qdrant collection exists...');
    await ensureInventoryCollection();
    console.log('✅ Collection ready\n');

    // Build texts, image URLs & payloads
    const ids: (string | number)[] = [];
    const texts: string[] = [];
    const imageUrls: string[] = [];
    const payloads: Record<string, any>[] = [];

    console.log('📝 Processing items...');
    for (const row of inventory) {
      const id = generateInventoryId(row);
      const text = buildInventoryText(row);
      const fields = extractInventoryFields(row);

      ids.push(id);
      texts.push(text);
      imageUrls.push(fields.url || '');
      payloads.push({
        title: fields.title,
        brand: fields.brand,
        category: fields.category,
        description: fields.description,
        price: fields.price,
        currency: fields.currency,
        url: fields.url,
        store_id: fields.store_id || 1,
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
        preview: text.slice(0, 240),
        synced_at: new Date().toISOString(),
      });
    }

    // Batch process to avoid rate limits
    const BATCH_SIZE = 48;
    let upserted = 0;
    let errors = 0;

    console.log(
      `🔄 Processing ${ids.length} items in batches of ${BATCH_SIZE}...\n`
    );

    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      const chunkIds = ids.slice(i, i + BATCH_SIZE);
      const chunkTexts = texts.slice(i, i + BATCH_SIZE);
      const chunkImageUrls = imageUrls.slice(i, i + BATCH_SIZE);
      const chunkPayloads = payloads.slice(i, i + BATCH_SIZE);

      try {
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(ids.length / BATCH_SIZE);
        console.log(`📦 Processing batch ${batchNum}/${totalBatches}...`);

        // Generate embeddings using CLIP Advanced
        const [textVectors, imageVectors] = await Promise.all([
          embedTextBatch(chunkTexts),
          embedImageBatch(chunkImageUrls),
        ]);

        // Generate combined multimodal vectors
        const combinedVectors = textVectors.map((textVec, j) => {
          const vibeVector = new Array(384).fill(0);
          return combineAdvancedVectorsWithVibe(
            textVec,
            imageVectors[j],
            vibeVector,
            0.6, // text weight
            0.4, // image weight
            0.0 // vibe weight (extracted at query time)
          );
        });

        // Upsert to Qdrant - IDs must be unsigned integers or UUIDs
        const points = chunkIds.map((id, j) => ({
          id: typeof id === 'number' ? id : parseInt(String(id), 10),
          vector: {
            text: textVectors[j],
            image: imageVectors[j],
            combined: combinedVectors[j],
          },
          payload: chunkPayloads[j],
        }));

        await qdrant.upsert(INVENTORY_COLLECTION, {
          wait: true,
          points,
        });

        upserted += chunkIds.length;
        console.log(
          `✅ Batch ${batchNum} completed: ${chunkIds.length} items\n`
        );

        // Small delay to avoid rate limiting
        if (i + BATCH_SIZE < ids.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      } catch (batchError: any) {
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        console.error(`❌ Batch ${batchNum} failed:`, batchError.message);
        if (batchError.data) {
          console.error(
            'Error data:',
            JSON.stringify(batchError.data, null, 2)
          );
        }
        errors += chunkIds.length;
      }
    }

    const success = errors === 0;
    console.log('\n' + '='.repeat(60));
    if (success) {
      console.log(`✅ Successfully synced ${upserted} items to Qdrant!`);
    } else {
      console.log(`⚠️  Synced ${upserted} items with ${errors} errors`);
    }
    console.log(`📊 Total items processed: ${inventory.length}`);
    console.log('='.repeat(60));

    process.exit(success ? 0 : 1);
  } catch (err: any) {
    console.error('❌ Sync failed:', err?.message || err);
    process.exit(1);
  }
}

// Run the script
main();
