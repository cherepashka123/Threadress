#!/usr/bin/env tsx

/**
 * Script to sync inventory from Google Sheets "manieredevoir" sheet to Qdrant
 * Runs the same sync logic as the API endpoint but as a standalone script
 */

import { config } from 'dotenv';
import { google } from 'googleapis';
// Import qdrant client after env vars are loaded
import { QdrantClient } from '@qdrant/js-client-rest';
import { INVENTORY_COLLECTION } from '../src/lib/qdrant';

// Load environment variables FIRST before creating clients
const envResult = config({ path: '.env.local' });
if (envResult.error) {
  console.warn('⚠️  Could not load .env.local, trying without path...');
  config(); // Try default .env
}

// Verify critical env vars are loaded
if (!process.env.QDRANT_URL || !process.env.QDRANT_API_KEY) {
  console.error('❌ Environment variables not loaded!');
  console.error('QDRANT_URL:', process.env.QDRANT_URL ? 'Set' : 'Missing');
  console.error('QDRANT_API_KEY:', process.env.QDRANT_API_KEY ? 'Set' : 'Missing');
  process.exit(1);
}

// Create qdrant client with env vars (now loaded)
const qdrantUrl = process.env.QDRANT_URL;
const qdrantApiKey = process.env.QDRANT_API_KEY;

console.log(`🔗 Connecting to Qdrant: ${qdrantUrl.substring(0, 60)}...`);

const qdrant = new QdrantClient({
  url: qdrantUrl,
  apiKey: qdrantApiKey,
  // Disable version check to avoid connection issues
  checkCompatibility: false,
});

// Local version of ensureInventoryCollection that uses our qdrant client
async function ensureInventoryCollection() {
  try {
    const collections = await qdrant.getCollections();
    const exists = collections.collections?.some(
      (c) => c.name === INVENTORY_COLLECTION
    );

    if (!exists) {
      console.log(`Creating Qdrant collection: ${INVENTORY_COLLECTION}`);
      await qdrant.createCollection(INVENTORY_COLLECTION, {
        vectors: {
          text: { size: 384, distance: 'Cosine' },
          image: { size: 512, distance: 'Cosine' },
          combined: { size: 512, distance: 'Cosine' },
        },
        optimizers_config: {
          default_segment_number: 2,
        },
        replication_factor: 1,
      });
      console.log(`Collection ${INVENTORY_COLLECTION} created`);
    } else {
      console.log(`Collection ${INVENTORY_COLLECTION} already exists`);
    }
  } catch (error) {
    console.error('Error ensuring collection:', error);
    throw error;
  }
}
import {
  embedTextBatch,
  embedImageBatch,
  combineAdvancedVectorsWithVibe,
} from '../src/lib/clip-advanced';

// Try to import CLIP direct service if available
let clipDirect: any = null;
try {
  if (process.env.CLIP_SERVICE_URL) {
    clipDirect = require('../src/lib/clip-direct');
    console.log('✅ CLIP direct service available');
  }
} catch (e) {
  // CLIP service not available, will use HuggingFace
}
import {
  buildInventoryText,
  extractInventoryFields,
  generateInventoryId,
  isValidInventoryRow,
} from '../src/lib/text';

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
        url: fields.url, // Primary image URL
        Main_Image_URL: fields.Main_Image_URL || '', // Store separately for fallback
        Hover_Image_URL: fields.Hover_Image_URL || '', // Store separately for fallback
        product_url: fields.product_url || '',
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
    const failedItems: number[] = []; // Track indices of failed items

    console.log(
      `🔄 Processing ${ids.length} items in batches of ${BATCH_SIZE}...\n`
    );

    // Helper function to process a single item
    async function processSingleItem(
      index: number,
      id: string | number,
      text: string,
      imageUrl: string,
      payload: Record<string, any>
    ): Promise<boolean> {
      try {
        // Generate embeddings
        let textVectors: number[][];
        let imageVectors: number[][];

        if (clipDirect && process.env.CLIP_SERVICE_URL) {
          try {
            const [clipTextVectors, clipImageVectors] = await Promise.all([
              clipDirect.embedTextBatch([text]),
              clipDirect.embedImageBatch([imageUrl]),
            ]);

            const hasValidText = clipTextVectors.some(v => v.some(x => x !== 0));
            if (!hasValidText) {
              // Fallback to HuggingFace
              const [hfTextVectors, hfImageVectors] = await Promise.all([
                embedTextBatch([text]),
                embedImageBatch([imageUrl]),
              ]);
              textVectors = hfTextVectors;
              imageVectors = hfImageVectors;
            } else {
              textVectors = clipTextVectors.map(v => v.slice(0, 384));
              imageVectors = clipImageVectors;
            }
          } catch (clipError: any) {
            // Fallback to HuggingFace
            [textVectors, imageVectors] = await Promise.all([
              embedTextBatch([text]),
              embedImageBatch([imageUrl]),
            ]);
          }
        } else {
          [textVectors, imageVectors] = await Promise.all([
            embedTextBatch([text]),
            embedImageBatch([imageUrl]),
          ]);
        }

        // Verify text vectors are valid
        const hasValidText = textVectors.some(v => v.some(x => x !== 0));
        if (!hasValidText) {
          // Last resort: try with a simplified text if original failed
          console.warn(`   ⚠️  Item ${index + 1}: Text embeddings failed, trying simplified text...`);
          const simplifiedText = text.length > 0 ? text.substring(0, 200) : 'product item';
          
          // Force HuggingFace for this item
          try {
            const [hfTextVectors, hfImageVectors] = await Promise.all([
              embedTextBatch([simplifiedText]),
              embedImageBatch([imageUrl]),
            ]);
            
            const hasValidHfText = hfTextVectors.some(v => v.some(x => x !== 0));
            if (hasValidHfText) {
              textVectors = hfTextVectors;
              imageVectors = hfImageVectors;
              console.log(`   ✅ Item ${index + 1}: Simplified text embedding succeeded`);
            } else {
              throw new Error('Text embeddings are all zeros even with simplified text');
            }
          } catch (retryError: any) {
            throw new Error(`Text embeddings failed: ${retryError.message}`);
          }
        }

        // Generate combined vector
        const combinedVector = combineAdvancedVectorsWithVibe(
          textVectors[0],
          imageVectors[0],
          new Array(384).fill(0),
          0.7,
          0.3,
          0.0
        );

        // Upsert to Qdrant
        await qdrant.upsert(INVENTORY_COLLECTION, {
          wait: true,
          points: [{
            id: typeof id === 'number' ? id : parseInt(String(id), 10),
            vector: {
              text: textVectors[0],
              image: imageVectors[0],
              combined: combinedVector,
            },
            payload,
          }],
        });

        return true;
      } catch (error: any) {
        console.error(`   ❌ Item ${index + 1} failed: ${error.message}`);
        return false;
      }
    }

    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      const chunkIds = ids.slice(i, i + BATCH_SIZE);
      const chunkTexts = texts.slice(i, i + BATCH_SIZE);
      const chunkImageUrls = imageUrls.slice(i, i + BATCH_SIZE);
      const chunkPayloads = payloads.slice(i, i + BATCH_SIZE);

      try {
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(ids.length / BATCH_SIZE);
        console.log(`📦 Processing batch ${batchNum}/${totalBatches}...`);

        // Verify HF_TOKEN is available before generating embeddings
        if (!process.env.HF_TOKEN) {
          console.error(`❌ Batch ${batchNum}: HF_TOKEN not available for embeddings`);
          throw new Error('HF_TOKEN is required for generating embeddings');
        }

        // Generate embeddings using CLIP Advanced
        console.log(`   Generating embeddings for batch ${batchNum}...`);
        console.log(`   HF_TOKEN available: ${process.env.HF_TOKEN ? 'YES' : 'NO'}`);
        console.log(`   CLIP service available: ${process.env.CLIP_SERVICE_URL ? 'YES' : 'NO'}`);
        
        // Use CLIP service if available, otherwise use HuggingFace
        let textVectors: number[][];
        let imageVectors: number[][];
        
        if (clipDirect && process.env.CLIP_SERVICE_URL) {
          // Use direct CLIP service (better quality)
          console.log(`   Using CLIP service for embeddings...`);
          let retryCount = 0;
          const maxRetries = 2;
          
          while (retryCount <= maxRetries) {
            try {
              const [clipTextVectors, clipImageVectors] = await Promise.all([
                clipDirect.embedTextBatch(chunkTexts),
                clipDirect.embedImageBatch(chunkImageUrls),
              ]);
              
              // Verify the vectors are valid
              const hasValidText = clipTextVectors.some(v => v.some(x => x !== 0));
              const hasValidImage = clipImageVectors.some(v => v.some(x => x !== 0));
              
              if (!hasValidText && retryCount < maxRetries) {
                retryCount++;
                console.warn(`   Batch ${batchNum}: CLIP returned zero vectors, retrying... (${retryCount}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
                continue;
              }
              
              // CLIP returns 512-dim, convert text to 384 for compatibility
              textVectors = clipTextVectors.map(v => v.slice(0, 384));
              imageVectors = clipImageVectors; // Already 512-dim
              break; // Success, exit retry loop
            } catch (clipError: any) {
              if (retryCount < maxRetries) {
                retryCount++;
                console.warn(`   Batch ${batchNum}: CLIP service error, retrying... (${retryCount}/${maxRetries}):`, clipError.message);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
                continue;
              }
              console.warn(`   CLIP service failed after ${maxRetries} retries, falling back to HuggingFace:`, clipError.message);
              // Fallback to HuggingFace
              [textVectors, imageVectors] = await Promise.all([
                embedTextBatch(chunkTexts),
                embedImageBatch(chunkImageUrls),
              ]);
              break;
            }
          }
        } else {
          // Use HuggingFace (text embeddings work, images may fail)
          console.log(`   Using HuggingFace for embeddings...`);
          [textVectors, imageVectors] = await Promise.all([
            embedTextBatch(chunkTexts),
            embedImageBatch(chunkImageUrls),
          ]);
        }

        // Verify embeddings are not all zeros
        const hasValidTextVectors = textVectors.some(v => v.some(x => x !== 0));
        const hasValidImageVectors = imageVectors.some(v => v.some(x => x !== 0));
        
        if (!hasValidTextVectors) {
          console.error(`   ❌ Batch ${batchNum}: Text vectors are ALL ZEROS!`);
          console.error(`   First text sample: "${chunkTexts[0]?.substring(0, 50)}..."`);
          console.error(`   First vector sample: [${textVectors[0]?.slice(0, 5).join(', ')}...]`);
          // Try HuggingFace as last resort fallback
          console.warn(`   Trying HuggingFace as fallback for batch ${batchNum}...`);
          try {
            const [hfTextVectors, hfImageVectors] = await Promise.all([
          embedTextBatch(chunkTexts),
          embedImageBatch(chunkImageUrls),
        ]);
            const hasValidHfText = hfTextVectors.some(v => v.some(x => x !== 0));
            if (hasValidHfText) {
              textVectors = hfTextVectors;
              imageVectors = hfImageVectors;
              console.log(`   ✅ Batch ${batchNum}: HuggingFace fallback succeeded`);
            } else {
              throw new Error('Text embeddings failed - all vectors are zero (both CLIP and HuggingFace)');
            }
          } catch (fallbackError: any) {
            console.error(`   ❌ Batch ${batchNum}: All embedding methods failed`);
            throw new Error(`Text embeddings failed - all vectors are zero: ${fallbackError.message}`);
          }
        }
        
        if (!hasValidImageVectors) {
          console.warn(`   ⚠️  Batch ${batchNum}: Image vectors are all zeros (CLIP may not be available, using text-only)`);
          console.warn(`   This is OK - images will use text-based fallback`);
        } else {
          console.log(`   ✅ Batch ${batchNum}: Text and image vectors generated successfully`);
        }

        // Generate combined multimodal vectors with CLIP Advanced
        // Always use the advanced combination - it handles zero vectors gracefully
        const combinedVectors = textVectors.map((textVec, j) => {
          const vibeVector = new Array(384).fill(0);
          const imageVec = imageVectors[j];
          
          // Use CLIP Advanced combination with optimized weights
          // This preserves the advanced search capabilities even if images fail
          return combineAdvancedVectorsWithVibe(
            textVec,
            imageVec,
            vibeVector,
            0.7, // text weight (higher since images may fail)
            0.3, // image weight (lower since CLIP may not be available)
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
        console.log(`   Processing batch ${batchNum} items individually...`);
        
        // Process items individually when batch fails
        for (let j = 0; j < chunkIds.length; j++) {
          const itemIndex = i + j;
          const success = await processSingleItem(
            itemIndex,
            chunkIds[j],
            chunkTexts[j],
            chunkImageUrls[j],
            chunkPayloads[j]
          );
          
          if (success) {
            upserted++;
          } else {
            errors++;
            failedItems.push(itemIndex);
          }
          
          // Small delay between individual items
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      }
    }

    // Retry failed items
    if (failedItems.length > 0) {
      console.log(`\n🔄 Retrying ${failedItems.length} failed items...\n`);
      
      for (const index of failedItems) {
        const success = await processSingleItem(
          index,
          ids[index],
          texts[index],
          imageUrls[index],
          payloads[index]
        );
        
        if (success) {
          upserted++;
          errors--;
        }
        
        // Small delay between retries
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      
      console.log(`\n✅ Retry complete: ${upserted} items synced, ${errors} still failed\n`);
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
