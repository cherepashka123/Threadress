#!/usr/bin/env tsx

import { config } from 'dotenv';
import { google } from 'googleapis';

config({ path: '.env.local' });

async function listSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    });

    console.log('Available sheets:');
    spreadsheet.data.sheets?.forEach((sheet) => {
      console.log(`  - "${sheet.properties?.title}"`);
    });
  } catch (error: any) {
    console.error('Error listing sheets:', error.message);
  }
}

listSheets();
