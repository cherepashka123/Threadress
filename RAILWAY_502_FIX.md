# Fix Railway 502 Error

## Current Issue
Railway is returning 502 "Application failed to respond" errors.

## Steps to Fix

### 1. Check Railway Deployment Status
1. Go to https://railway.app/dashboard
2. Click on your CLIP service
3. Check the **"Deployments"** tab:
   - Is the latest deployment "Active" or "Failed"?
   - If "Failed", click on it and check the build logs

### 2. Check Railway Logs
1. In Railway dashboard → Your service → **"Logs"** tab
2. Look for:
   - `uvicorn clip_api:app` starting message
   - `Loading CLIP model on cpu...` (should NOT appear at startup anymore)
   - Any Python errors
   - Any crash messages

### 3. Restart Railway Service
If the service is stuck:
1. Railway Dashboard → Your service → Settings
2. Click **"Restart"** or **"Redeploy"**
3. Wait 2-3 minutes for restart

### 4. Verify Service is Running
After restart, test the health endpoint:
```bash
curl https://threadress-production.up.railway.app/health
```

Expected response:
```json
{"status":"healthy","service":"clip-embeddings","model_loaded":false}
```

### 5. Check Railway Resource Limits
Railway free tier has limits:
- **Memory**: 512MB (CLIP needs ~1-2GB)
- **CPU**: Limited
- **Sleep**: Services can sleep after inactivity

**If you're on free tier:**
- The service might be sleeping
- First request after sleep takes 30-60 seconds (cold start)
- Consider upgrading to paid plan for always-on service

### 6. Force Redeploy
If nothing works:
1. Railway Dashboard → Your service → Settings
2. Click **"Redeploy"** 
3. Or trigger via Railway CLI:
   ```bash
   railway up
   ```

## What I Fixed (Lazy Loading)
- Model now loads on first request, not at startup
- Health endpoint responds immediately
- This should prevent 502 errors on startup

## Next Steps
1. Check Railway logs (most important!)
2. Share what you see in the logs
3. If service keeps crashing, we may need to:
   - Check memory limits
   - Optimize model loading further
   - Consider using a different deployment platform

