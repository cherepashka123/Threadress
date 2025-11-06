# Railway CLIP Service Diagnosis

## Current Problem
- **502 Bad Gateway errors** from Railway
- **Timeout when testing** health endpoint (curl times out)
- **Zero vectors** being returned because CLIP fails → Hugging Face also fails

## Why Railway is Failing

### 1. **Service Might Be Sleeping (Free Tier)**
Railway free tier services sleep after ~15 minutes of inactivity. When sleeping:
- First request takes 30-60 seconds (cold start)
- Service needs to wake up
- CLIP model needs to load (another 30-60 seconds)
- Total: 60-120 seconds for first request

**Solution:** Railway might be sleeping. Try:
- Making a request and waiting 2 minutes
- Or upgrade to paid plan for always-on service

### 2. **Service Might Have Crashed**
If service crashes due to:
- Memory limits (CLIP needs ~1-2GB, Railway free tier has 512MB)
- CPU limits
- Model loading errors

**Check:** Railway Dashboard → Your Service → Logs
- Look for crash messages
- Look for "Killed" messages (out of memory)
- Look for Python errors

### 3. **Port Mismatch**
Service might be listening on wrong port.

**Check Railway:**
1. Railway Dashboard → Your Service → Variables
2. What is `PORT` set to?
3. Railway Dashboard → Your Service → Networking
4. Does "Target Port" match the PORT variable?

### 4. **Service Not Deployed Correctly**
Service might not be running at all.

**Check:**
1. Railway Dashboard → Your Service → Deployments
2. Is latest deployment "Active" or "Failed"?
3. If "Failed", check build logs

## Immediate Actions

### Step 1: Check Railway Status
1. Go to https://railway.app/dashboard
2. Click on your CLIP service
3. Check:
   - **Deployments tab**: Is it "Active"?
   - **Logs tab**: Is service running?
   - **Metrics tab**: CPU/Memory usage

### Step 2: Test Railway Health Endpoint
From your terminal:
```bash
# Test with longer timeout
curl --max-time 120 https://threadress-production.up.railway.app/health

# Or test root endpoint
curl --max-time 120 https://threadress-production.up.railway.app/
```

### Step 3: Check Railway Logs
In Railway Dashboard → Your Service → Logs, look for:
- `🚀 CLIP service starting on port XXXX`
- `Uvicorn running on http://0.0.0.0:XXXX`
- Any error messages
- Any "Killed" messages (out of memory)

### Step 4: Restart Railway Service
If service is stuck:
1. Railway Dashboard → Your Service
2. Click **"Settings"** → **"Restart"** or **"Redeploy"**
3. Wait 3-5 minutes for restart and model loading

## Why It Works Locally But Not Production

### Local Environment:
- ✅ CLIP service runs on `localhost:8001`
- ✅ No sleeping (always running)
- ✅ No memory limits
- ✅ Fast model loading

### Production (Railway):
- ❌ Service might be sleeping (free tier)
- ❌ Memory limits (512MB free tier vs 1-2GB needed)
- ❌ Port configuration issues
- ❌ Network routing issues

## What I've Fixed in Code

### 1. **Zero Vector Prevention**
- Added hash-based fallback embedding
- Never returns all-zero vectors
- Ensures search always works (even if quality is lower)

### 2. **Retry Logic**
- Retries up to 2 times on 502/timeout
- Exponential backoff (5s, 10s)
- Handles Railway cold starts

### 3. **Better Error Handling**
- Validates all embeddings before use
- Falls back to Hugging Face if CLIP fails
- Falls back to hash embedding if Hugging Face fails

## Next Steps

1. **Check Railway Dashboard** - Most important!
   - Is service running?
   - What do logs show?
   - Are there any errors?

2. **If Service is Sleeping:**
   - First request will take 2+ minutes
   - Keep retrying (my code already does this)
   - Consider upgrading Railway plan

3. **If Service Crashed:**
   - Check logs for errors
   - Restart service
   - Consider upgrading Railway plan for more memory

4. **If Port Mismatch:**
   - Railway Dashboard → Networking
   - Set "Target Port" to match service's listening port

## Quick Fix: Disable CLIP Temporarily

If Railway keeps failing, you can temporarily disable CLIP:
1. In Vercel, set `CLIP_SERVICE_URL=""` (empty)
2. System will use Hugging Face only
3. Search will still work (just without CLIP quality)

But this should be temporary - we should fix Railway!

