# How to View CLIP Service Logs on Railway

## Step-by-Step Instructions

### 1. Go to Railway Dashboard
1. Open your browser
2. Go to: **https://railway.app/dashboard**
3. Log in if needed

### 2. Find Your CLIP Service
1. In the dashboard, you'll see your projects/services
2. Look for a service named something like:
   - `threadress` or `threadress-production`
   - `clip-service`
   - Or the service you created for CLIP
3. **Click on the service** (the card/box that represents it)

### 3. View Logs
Once you're in the service page:
1. Look for tabs at the top: **"Metrics"**, **"Logs"**, **"Deployments"**, **"Settings"**, etc.
2. Click on the **"Logs"** tab
3. You'll see real-time logs from your CLIP service

### 4. What to Look For in Logs

**Good signs:**
- `uvicorn clip_api:app --host 0.0.0.0 --port ...` (service starting)
- `Application startup complete`
- `INFO: Uvicorn running on http://0.0.0.0:8001`
- No errors

**Bad signs:**
- `Error loading CLIP model: ...`
- `ModuleNotFoundError: ...`
- `MemoryError` or `Killed`
- `502 Bad Gateway`
- Crash/restart loops

### 5. Check Deployment Status
1. Click the **"Deployments"** tab
2. Look at the latest deployment:
   - ✅ **Green/Active** = Service is running
   - ❌ **Red/Failed** = Deployment failed (check build logs)
   - ⏳ **Building** = Still deploying

### 6. Check Build Logs (if deployment failed)
1. Click on the failed deployment
2. Scroll through the build logs
3. Look for errors during:
   - Docker build
   - Package installation
   - Model download

### 7. Alternative: Check via Railway CLI
If you have Railway CLI installed:
```bash
railway logs --service <service-name>
```

## Quick Troubleshooting

**If you can't find the service:**
- Check all projects in your Railway dashboard
- Look for services with Dockerfile or Python
- Check the "Networking" tab to see which service has the public URL

**If logs are empty:**
- Service might be sleeping (free tier)
- Try making a request to wake it up
- Check if service is actually deployed

**If you see 502 errors:**
- Service crashed or not responding
- Check logs for crash messages
- Try restarting the service (Settings → Restart)

