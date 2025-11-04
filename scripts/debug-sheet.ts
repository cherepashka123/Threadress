#!/usr/bin/env tsx

import { config } from 'dotenv';
import { google } from 'googleapis';

config({ path: '.env.local' });

async function debugSheet() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const range = 'manieredevoir!A1:Z10'; // First 10 rows

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range,
    });

    const rows = res.data.values ?? [];
    
    if (rows.length === 0) {
      console.log('No rows found');
      return;
    }

    console.log(`\n📋 Found ${rows.length} rows\n`);
    console.log('Headers:', rows[0]);
    console.log('\n📊 Sample rows:\n');

    // Show first 3 data rows
    for (let i = 1; i < Math.min(4, rows.length); i++) {
      const row = rows[i];
      const rowObj: Record<string, any> = {};
      rows[0].forEach((header: string, idx: number) => {
        rowObj[header] = row[idx] || '';
      });

      console.log(`Row ${i}:`);
      console.log('  Title field:', rowObj['text-unset'] || rowObj.text || rowObj.title || 'MISSING');
      console.log('  Image field:', rowObj['main-product-image src'] || rowObj.image_url || rowObj.url || 'MISSING');
      console.log('  Brand field:', rowObj['text-unset 2'] || rowObj.brand || 'MISSING');
      console.log('  Price field:', rowObj['actual-price1'] || rowObj.price || 'MISSING');
      console.log('  All fields:', Object.keys(rowObj).filter(k => rowObj[k]).slice(0, 10).join(', '));
      console.log('');
    }

    // Check validation
    console.log('🔍 Validation check:\n');
    const { isValidInventoryRow } = await import('../src/lib/text');
    
    for (let i = 1; i < Math.min(6, rows.length); i++) {
      const row = rows[i];
      const rowObj: Record<string, any> = {};
      rows[0].forEach((header: string, idx: number) => {
        rowObj[String(header).trim()] = row[idx] || '';
      });

      const isValid = isValidInventoryRow(rowObj);
      console.log(`Row ${i}: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
      if (!isValid) {
        const title = rowObj['text-unset'] || rowObj.text || rowObj.title || '';
        const image = rowObj['main-product-image src'] || rowObj.image_url || rowObj.url || '';
        console.log(`  Title: "${title}"`);
        console.log(`  Image: "${image}"`);
      }
    }

  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

debugSheet();

