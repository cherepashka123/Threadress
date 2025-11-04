#!/usr/bin/env tsx

/**
 * Script to fetch missing images from product URLs and update Google Sheet
 * This helps fill in Main_Image_URL and Hover_Image_URL for items that are missing them
 */

import { config } from 'dotenv';
import { google } from 'googleapis';
import { QdrantClient } from '@qdrant/js-client-rest';
import * as cheerio from 'cheerio';

config({ path: '.env.local' });

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY!,
});

/**
 * Fetch image URL from product page
 */
async function fetchImageFromProductUrl(productUrl: string): Promise<string | null> {
  try {
    const response = await fetch(productUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // Try to find main product image
    // Common selectors for product images
    const imageSelectors = [
      'img[src*="cdn"], img[src*="shop"], img[src*="product"]',
      '.product-image img',
      '.product__media img',
      '.product-media img',
      '[data-product-image] img',
      'img.product-image',
      'img[class*="product"]',
    ];
    
    for (const selector of imageSelectors) {
      const img = $(selector).first();
      const src = img.attr('src') || img.attr('data-src') || img.attr('data-lazy-src');
      
      if (src) {
        let imageUrl = src;
        
        // Convert relative URLs to absolute
        if (imageUrl.startsWith('//')) {
          imageUrl = 'https:' + imageUrl;
        } else if (imageUrl.startsWith('/')) {
          const urlObj = new URL(productUrl);
          imageUrl = urlObj.origin + imageUrl;
        } else if (!imageUrl.startsWith('http')) {
          const urlObj = new URL(productUrl);
          imageUrl = urlObj.origin + '/' + imageUrl;
        }
        
        // Validate it's a real image URL
        if (imageUrl.startsWith('http') && 
            (imageUrl.includes('.jpg') || imageUrl.includes('.jpeg') || imageUrl.includes('.png') || imageUrl.includes('.webp'))) {
          return imageUrl;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching image from ${productUrl}:`, error);
    return null;
  }
}

async function main() {
  try {
    console.log('🔍 Finding items without images...\n');
    
    // Get all items from Qdrant
    const results = await qdrant.scroll('inventory_items', {
      limit: 1000,
      with_payload: true,
      with_vector: false,
    });
    
    const itemsWithoutImages: any[] = [];
    
    results.points?.forEach((point) => {
      const payload = point.payload || {};
      const main = (payload.Main_Image_URL || '').trim();
      const hover = (payload.Hover_Image_URL || '').trim();
      const url = (payload.url || '').trim();
      const productUrl = (payload.product_url || '').trim();
      
      const hasValidImage = 
        (main && main.startsWith('http') && !main.startsWith('data:')) ||
        (hover && hover.startsWith('http') && !hover.startsWith('data:')) ||
        (url && url.startsWith('http') && !url.startsWith('data:'));
      
      if (!hasValidImage && productUrl && productUrl.startsWith('http')) {
        itemsWithoutImages.push({
          id: point.id,
          title: payload.title || '',
          product_url: productUrl,
          source: payload.brand || payload.store_name || '',
        });
      }
    });
    
    console.log(`Found ${itemsWithoutImages.length} items without images\n`);
    
    if (itemsWithoutImages.length === 0) {
      console.log('✅ All items have images!');
      return;
    }
    
    // Fetch images for items (limit to first 20 to avoid rate limiting)
    console.log(`Fetching images for ${Math.min(itemsWithoutImages.length, 20)} items...\n`);
    
    const updates: Array<{ id: number; imageUrl: string }> = [];
    
    for (let i = 0; i < Math.min(itemsWithoutImages.length, 20); i++) {
      const item = itemsWithoutImages[i];
      console.log(`${i + 1}. Fetching image for: ${item.title.substring(0, 50)}...`);
      
      const imageUrl = await fetchImageFromProductUrl(item.product_url);
      
      if (imageUrl) {
        console.log(`   ✅ Found image: ${imageUrl.substring(0, 80)}...`);
        updates.push({ id: item.id, imageUrl });
      } else {
        console.log(`   ❌ Could not find image`);
      }
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n📊 Summary: Found images for ${updates.length} items`);
    console.log('\nTo update Qdrant with these images, you would need to:');
    console.log('1. Update the items in Qdrant with the new Main_Image_URL');
    console.log('2. Or update the Google Sheet and re-sync');
    
    // Optionally, update Qdrant directly
    if (updates.length > 0) {
      console.log('\n🔄 Updating Qdrant with fetched images...\n');
      
      for (const update of updates) {
        try {
          // Get current point
          const point = await qdrant.retrieve('inventory_items', {
            ids: [update.id],
            with_payload: true,
            with_vector: false,
          });
          
          if (point.length > 0 && point[0].payload) {
            const payload = point[0].payload;
            
            // Update payload with new image URL
            await qdrant.setPayload('inventory_items', {
              wait: true,
              payload: {
                Main_Image_URL: update.imageUrl,
                url: update.imageUrl, // Also update primary URL field
              },
              points: [update.id],
            });
            
            console.log(`✅ Updated item ${update.id} with image URL`);
          }
        } catch (error: any) {
          console.error(`❌ Failed to update item ${update.id}:`, error.message);
        }
      }
    }
    
    console.log('\n✅ Done!');
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

