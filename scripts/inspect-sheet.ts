#!/usr/bin/env tsx

import { config } from 'dotenv';
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

config({ path: '.env.local' });

// Fix private key
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
      process.env.GOOGLE_PRIVATE_KEY = keyMatch[1].replace(/\\n/g, '\n');
    }
  } catch (err) {}
}

async function inspectSheet() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(
        /^["']|["']$/g,
        ''
      ).replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: 'manieredevoir!A1:Z10',
  });

  const rows = res.data.values ?? [];
  console.log(`Found ${rows.length} rows\n`);
  console.log('Headers:', rows[0]);
  console.log('\nFirst 3 data rows:');
  rows.slice(1, 4).forEach((row, i) => {
    console.log(`\nRow ${i + 1}:`, row);
    const obj = rows[0].reduce((acc: any, h: string, idx: number) => {
      acc[h] = row[idx] ?? '';
      return acc;
    }, {});
    console.log('As object:', JSON.stringify(obj, null, 2));
  });
}

inspectSheet();
