# Railway Port Configuration Fix

## Issue
Railway 502 error - service is running but Railway proxy can't connect.

## Root Cause
Port mismatch between:
- Service listening port (from logs: 8080)
- Railway's public networking configuration (might be set to 8001)

## Solution

### Option 1: Update Railway Public Networking Port
1. Go to Railway Dashboard → Your CLIP Service
2. Click **"Networking"** tab
3. Under **"Public Networking"**:
   - Find your generated domain
   - Click on it or the settings
   - Make sure the **"Target Port"** matches what your service is actually listening on
   - Service logs show: **8080** (Railway-assigned PORT)
   - Set target port to: **8080** (or whatever Railway's PORT env var is)

### Option 2: Force Service to Use Specific Port
If Railway allows you to set PORT env var:
1. Railway Dashboard → Your Service → Variables
2. Set `PORT=8001` (or whatever you want)
3. Redeploy service

### Option 3: Check Railway's Auto-Port Detection
Railway should automatically detect the port from the PORT env var. But if it doesn't:
- Check Railway's service settings
- Look for "Port" or "Target Port" configuration
- Ensure it matches the service's listening port

## Verification

After fixing:
1. Check Railway logs - should show service listening on correct port
2. Test health endpoint - should return 200 OK
3. Service should respond to requests

## Current Configuration
- Dockerfile: `EXPOSE 8001` (but this is just documentation)
- CMD: Uses `${PORT:-8001}` (falls back to 8001 if PORT not set)
- Railway logs show: Service listening on **8080** (Railway's assigned PORT)
- **Action needed**: Ensure Railway's public networking target port is **8080**

