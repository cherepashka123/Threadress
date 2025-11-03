import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // 🔁 change only this line if your tab name changes
    const range = 'Sheet1!A1:M';

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range,
    });

    const rows = res.data.values ?? [];
    if (rows.length < 2) {
      return NextResponse.json({ ok: true, inventory: [] });
    }

    // headers are row 1
    const headers = rows[0].map((h) => String(h).trim());
    const toObj = (r: string[]) =>
      headers.reduce(
        (acc, h, i) => {
          acc[h] = r[i] ?? '';
          return acc;
        },
        {} as Record<string, string>
      );

    const inventory = rows
      .slice(1)
      .filter((r) => r.some((c) => c && String(c).trim() !== ''))
      .map(toObj);

    return NextResponse.json({ ok: true, count: inventory.length, inventory });
  } catch (err: any) {
    console.error('GET /api/inventory error:', err?.message || err);
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch Google Sheet.' },
      { status: 500 }
    );
  }
}
