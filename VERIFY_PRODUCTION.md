# Verify Production Setup - Step by Step

## Issue: No search results showing on deployed website

## Checklist to Verify:

### 1. Railway CLIP Service Status

**Check Railway Dashboard:**
1. Go to https://railway.app/dashboard
2. Find your CLIP service (Threadress service)
3. Check the **"Logs"** tab
4. Look for:
   - ✅ Service started successfully
   - ✅ `uvicorn clip_api:app` running
   - ✅ No `$PORT` errors
   - ✅ Health endpoint responding

**Test Railway Service Directly:**
```bash
# Get your Railway service URL from Railway dashboard
# Then test:
curl https://your-railway-url.railway.app/health
```
Should return: `{"status":"healthy","service":"clip-embeddings"}`

### 2. Vercel Environment Variables

**Check Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select your project (threadress-site)
3. Go to **Settings** → **Environment Variables**
4. Verify these are set for **Production**:
   - ✅ `CLIP_SERVICE_URL` = `https://your-railway-url.railway.app` (your Railway URL)
   - ✅ `HF_TOKEN` = (your Hugging Face token)
   - ✅ `QDRANT_URL` = (your Qdrant URL)
   - ✅ `QDRANT_API_KEY` = (your Qdrant API key)

**IMPORTANT:** After adding/updating `CLIP_SERVICE_URL`, you MUST **Redeploy** your Vercel app!

### 3. Vercel Deployment Logs

**Check Vercel Logs:**
1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click on the latest deployment
3. Go to **"Logs"** tab
4. Look for:
   - ✅ `CLIP_SERVICE_URL` is set
   - ✅ Attempting to connect to Railway URL (not localhost)
   - ✅ No connection errors to Railway
   - ✅ Qdrant connection successful
   - ✅ Search queries processing

**Common Issues:**
- ❌ `CLIP_SERVICE_URL` not set → Service won't connect
- ❌ `CLIP_SERVICE_URL` points to `localhost` → Won't work in production
- ❌ `CLIP_SERVICE_URL` incorrect → Connection errors
- ❌ No redeploy after setting env var → Old deployment still running

### 4. Test Search Endpoint Directly

**Test from your terminal:**
```bash
# Test the search API directly
curl "https://your-vercel-url.vercel.app/api/inventory-search?q=dress"

# Or test with Railway CLIP service
curl "https://your-railway-url.railway.app/health"
```

### 5. Check Vector Dimensions

The search expects:
- **Combined vector**: 512 dimensions
- **Text vector**: 384 dimensions (from Hugging Face) or 512 (from CLIP)
- **Image vector**: 512 dimensions (from CLIP)

If CLIP service is used, text should be 512-dim, not sliced to 384.

### 6. Quick Diagnostic

**Run this in Vercel logs or via API:**
```bash
curl "https://your-vercel-url.vercel.app/api/check-database"
```

Should return database status and sample items.

## Most Likely Issues:

1. **`CLIP_SERVICE_URL` not set in Vercel** → Add it and redeploy
2. **Railway service not running** → Check Railway logs
3. **Vector dimension mismatch** → Check if CLIP returns correct dimensions
4. **No data in Qdrant** → Run sync script

## Next Steps:

1. Verify Railway service is running and accessible
2. Add `CLIP_SERVICE_URL` to Vercel (if missing)
3. Redeploy Vercel app
4. Check Vercel logs for connection errors
5. Test search endpoint directly

