# Automatic Inventory Sync Setup Guide

This guide explains how to set up automatic syncing from your Google Sheets to the search database, so that whenever you add new items (like from Rouje store), they automatically appear in the multimodal search.

## How It Works

1. **You update Google Sheets** (add new items to manieredevoir, rouje, or other sheets)
2. **Automatic sync is triggered** (via webhook or scheduled job)
3. **New items are synced to Qdrant** (the search database)
4. **Items appear in search immediately**

## Option 1: Google Apps Script (Recommended)

This automatically syncs whenever you edit the spreadsheet.

### Setup Steps

1. **Open your Google Sheet**
   - Go to the spreadsheet with your inventory

2. **Open Apps Script**
   - Click `Extensions` → `Apps Script`
   - Or go to: https://script.google.com

3. **Copy the Script**
   - Open `google-apps-script-sync.js` from this repository
   - Copy the entire contents
   - Paste into the Apps Script editor

4. **Configure the Script**
   - Replace `YOUR_WEBHOOK_URL` with your actual webhook URL:
     - **Local development**: `http://localhost:3000/api/inventory-sync-webhook`
     - **Production**: `https://your-domain.com/api/inventory-sync-webhook`
   - Replace `YOUR_WEBHOOK_SECRET` with a secret string (optional but recommended)
   - Add the secret to your `.env.local`:
     ```env
     SYNC_WEBHOOK_SECRET=your-secret-key-here
     ```

5. **Save the Script**
   - Click the floppy disk icon or `Ctrl+S` / `Cmd+S`
   - Name it "Inventory Auto Sync"

6. **Set Up Trigger (On Edit)**
   - Click the clock icon (Triggers) on the left
   - Click `+ Add Trigger` (bottom right)
   - Configure:
     - Function: `onEdit`
     - Event source: `From spreadsheet`
     - Event type: `On edit`
   - Click `Save`
   - Authorize the script when prompted

7. **Test It**
   - Edit a cell in your spreadsheet
   - Wait 5 seconds
   - Check your server logs - you should see sync triggered

### Optional: Periodic Sync

If you want to sync every hour (even without edits):

1. **Add Time-Driven Trigger**
   - Click the clock icon (Triggers)
   - Click `+ Add Trigger`
   - Configure:
     - Function: `periodicSync`
     - Event source: `Time-driven`
     - Type: `Hour timer`
     - Hour interval: `Every hour`
   - Click `Save`

## Option 2: Manual Sync via API

You can manually trigger sync anytime:

### Via Browser/curl
```bash
# Trigger sync for all sheets
curl -X POST http://localhost:3000/api/inventory-sync

# Or via GET
curl http://localhost:3000/api/inventory-sync
```

### Via Your Frontend
```javascript
// Trigger sync from your app
const response = await fetch('/api/inventory-sync', {
  method: 'POST',
});
const data = await response.json();
console.log(data);
```

## Option 3: Cron Job / Scheduled Task

For production, you can set up a cron job to sync periodically.

### Using Vercel Cron Jobs

1. Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/inventory-sync",
    "schedule": "0 * * * *"
  }]
}
```
This syncs every hour.

### Using External Cron Service

Use a service like:
- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)
- [GitHub Actions](https://docs.github.com/en/actions)

Set up to call: `POST https://your-domain.com/api/inventory-sync`

## Multiple Sheets Support

The sync automatically detects and syncs all sheets in your spreadsheet:
- ✅ `manieredevoir` - Maniere de Voir inventory
- ✅ `rouje` - Rouje store inventory
- ✅ Any other sheets you add

**To sync specific sheets only:**
```bash
curl -X POST http://localhost:3000/api/inventory-sync \
  -H "Content-Type: application/json" \
  -d '{"sheets": ["manieredevoir", "rouje"]}'
```

## Testing the Sync

### 1. Test Webhook Endpoint
```bash
curl http://localhost:3000/api/inventory-sync-webhook
```

Should return webhook information.

### 2. Test Sync Endpoint
```bash
curl -X POST http://localhost:3000/api/inventory-sync
```

Should return:
```json
{
  "ok": true,
  "message": "Successfully synced X items to Qdrant",
  "upserted": 150,
  "total": 150,
  "sheets": {
    "manieredevoir": 100,
    "rouje": 50
  }
}
```

### 3. Verify in Search
- Go to your multimodal search page
- Search for a product you just added
- It should appear in results!

## Troubleshooting

### Sync Not Triggering

1. **Check Apps Script Logs**
   - Open Apps Script editor
   - Click "Executions" (clock icon)
   - Check for errors

2. **Verify Webhook URL**
   - Make sure the URL is correct in the script
   - Test it manually: `curl http://your-webhook-url`

3. **Check Server Logs**
   - Look for sync requests in your server console
   - Check for errors

### Items Not Appearing in Search

1. **Run Manual Sync**
   ```bash
   curl -X POST http://localhost:3000/api/inventory-sync
   ```

2. **Check Sheet Format**
   - Make sure sheets have proper headers
   - Verify data rows are valid (not empty)

3. **Check Qdrant Collection**
   - Verify items are in Qdrant
   - Check collection size

### Permission Errors

1. **Apps Script Authorization**
   - Make sure you authorized the script
   - Re-authorize if needed

2. **Google Sheets API**
   - Verify service account has access
   - Check `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_PRIVATE_KEY`

## Security Best Practices

1. **Use Webhook Secret**
   - Set `SYNC_WEBHOOK_SECRET` in `.env.local`
   - Add it to your Apps Script
   - This prevents unauthorized syncs

2. **Rate Limiting**
   - The sync has built-in rate limiting
   - Don't trigger too frequently (max once per minute)

3. **Monitor Syncs**
   - Check logs regularly
   - Set up alerts for failures

## Current Sync Status

To check what's synced:
```bash
curl http://localhost:3000/api/inventory-sync
```

Response includes:
- Total items synced
- Items per sheet
- Last sync status

## Next Steps

1. ✅ Set up Google Apps Script (Option 1)
2. ✅ Test with a new item
3. ✅ Verify it appears in search
4. ✅ Set up periodic sync (optional)
5. ✅ Monitor for a few days

## Support

If you encounter issues:
1. Check server logs
2. Check Apps Script execution logs
3. Test endpoints manually
4. Verify environment variables

