import { google } from "googleapis";

/**
 * Appends a single row to the GTM User Database sheet.
 * Row format: [timestamp, email, city, notes, imageBase64]
 */
export async function appendInspoUserRow(row: (string | null)[]) {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey =
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_USER_SHEET_ID;
  const tab = process.env.GOOGLE_USER_SHEET_TAB || "Sheet1";

  if (!clientEmail || !privateKey || !spreadsheetId) {
    throw new Error(
      "Missing Google Sheets environment variables (email, key, or sheet ID)."
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tab}!A:E`,
    valueInputOption: "RAW",
    requestBody: {
      values: [row],
    },
  });
}