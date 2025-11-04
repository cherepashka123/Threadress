/**
 * Google Apps Script for Automatic Inventory Sync
 * 
 * This script automatically syncs your Google Sheets inventory to the Threadress search database
 * whenever the spreadsheet is updated.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open your Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste this code
 * 4. Replace YOUR_WEBHOOK_URL with your actual webhook URL (e.g., https://your-domain.com/api/inventory-sync-webhook)
 * 5. Replace YOUR_WEBHOOK_SECRET with a secret string (optional but recommended)
 * 6. Set up a trigger:
 *    - Click on the clock icon (Triggers)
 *    - Add trigger → Choose function: onEdit
 *    - Event source: From spreadsheet
 *    - Event type: On edit
 *    - Save
 * 
 * ALTERNATIVE: Set up a time-driven trigger for periodic syncing
 *    - Add trigger → Choose function: periodicSync
 *    - Event source: Time-driven
 *    - Type: Hour timer, Every hour (or your preferred interval)
 */

// ⚙️ CONFIGURATION - UPDATE THESE VALUES
const WEBHOOK_URL = 'https://your-domain.com/api/inventory-sync-webhook';
const WEBHOOK_SECRET = 'your-secret-key-here'; // Optional but recommended
const SYNC_ON_EDIT = true; // Set to false if you only want periodic syncing

/**
 * Triggered when any cell in the spreadsheet is edited
 */
function onEdit(e) {
  if (!SYNC_ON_EDIT) {
    return;
  }

  // Only sync if the edit was in a data row (not header)
  const sheet = e.source.getActiveSheet();
  const row = e.range.getRow();
  
  // Skip if header row was edited
  if (row === 1) {
    return;
  }

  // Debounce: Wait 5 seconds before syncing to avoid multiple syncs for rapid edits
  Utilities.sleep(5000);
  
  console.log(`Sheet edited: ${sheet.getName()}, Row: ${row}`);
  triggerSync();
}

/**
 * Periodic sync function (can be called by time-driven trigger)
 */
function periodicSync() {
  console.log('Periodic sync triggered');
  triggerSync();
}

/**
 * Manually trigger sync (can be called from the script editor)
 */
function manualSync() {
  console.log('Manual sync triggered');
  triggerSync();
}

/**
 * Send webhook request to trigger sync
 */
function triggerSync() {
  try {
    const payload = {
      timestamp: new Date().toISOString(),
      source: 'google-apps-script',
    };

    const options = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      headers: {
        'x-webhook-secret': WEBHOOK_SECRET,
      },
      muteHttpExceptions: true,
    };

    console.log(`Sending sync request to: ${WEBHOOK_URL}`);

    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    if (responseCode === 200) {
      console.log('✅ Sync triggered successfully');
      console.log('Response:', responseText);
    } else {
      console.error(`❌ Sync failed with status ${responseCode}`);
      console.error('Response:', responseText);
      
      // Send email notification on failure (optional)
      // MailApp.sendEmail({
      //   to: 'your-email@example.com',
      //   subject: 'Inventory Sync Failed',
      //   body: `Sync failed with status ${responseCode}:\n${responseText}`,
      // });
    }
  } catch (error) {
    console.error('❌ Error triggering sync:', error);
    
    // Send email notification on error (optional)
    // MailApp.sendEmail({
    //   to: 'your-email@example.com',
    //   subject: 'Inventory Sync Error',
    //   body: `Error: ${error.toString()}`,
    // });
  }
}

/**
 * Test function to verify webhook is working
 */
function testWebhook() {
  console.log('Testing webhook connection...');
  triggerSync();
}

