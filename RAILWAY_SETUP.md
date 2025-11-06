# Railway CLIP Service Setup

## Your Deployment ID
`c4b98e1a-e119-44d7-bece-06c6b1ddfb1d`

## Steps to Get Your Service URL

### Option 1: Railway Dashboard (Easiest)

1. **Go to**: https://railway.app/dashboard
2. **Find your project** with the CLIP service
3. **Click on the service** (should show "clip-service" or similar)
4. **Look for "Settings"** tab
5. **Click "Generate Domain"** or check "Domains" section
6. **Copy the URL** (looks like: `https://clip-service-production.up.railway.app`)

### Option 2: Railway CLI

```bash
# Install Railway CLI if needed
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Get service URL
railway domain
```

### Option 3: Check Railway Service

If you can't find it:
1. Go to https://railway.app/dashboard
2. Click on your project
3. The service URL should be visible in the service card
4. Or go to Settings → Networking → Public URL

## Once You Have the URL

The URL will look like: `https://clip-service-production-xxxx.up.railway.app`

### Add to Vercel:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project** (threadress-site)
3. **Settings** → **Environment Variables**
4. **Add new variable**:
   - **Key**: `CLIP_SERVICE_URL`
   - **Value**: `https://your-railway-url.railway.app` (your actual URL)
   - **Environment**: Production (and Preview if you want)
5. **Save**
6. **Redeploy** your Vercel app

## Test the Connection

After redeploying, test your CLIP service:

```bash
# Test health endpoint
curl https://your-railway-url.railway.app/health

# Should return: {"status":"healthy","service":"clip-embeddings"}
```

## Verify It's Working

1. **Check Vercel logs** after deployment
2. **Search for items** - should see CLIP being used
3. **Check logs** - should see "CLIP service" instead of "Hugging Face" fallback


