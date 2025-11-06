# Railway Setup: Setting Root Directory to "server"

## Step-by-Step Instructions:

### 1. In Railway Dashboard:

1. **Go to**: https://railway.app/dashboard
2. **Click on your project** (or create new one)
3. **Click "New Service"** or select existing service
4. **Select "GitHub Repo"** → Choose your `threadress-site` repo

### 2. Configure Root Directory:

**Before the first deployment completes:**

1. **Click on the service** you just created
2. **Go to "Settings" tab** (gear icon)
3. **Scroll to "Build & Deploy" section**
4. **Find "Root Directory"** field
5. **Type**: `server` (exactly this, no quotes, no slash)
6. **Click "Save"**

### 3. Configure Build Settings:

In the same Settings tab, also set:

- **Build Command**: (leave empty or use Dockerfile)
- **Start Command**: `uvicorn clip_api:app --host 0.0.0.0 --port $PORT`
- **Or use Dockerfile**: Railway will detect `server/Dockerfile` automatically

### 4. Generate Domain:

1. **Go to "Settings"** → **"Networking"**
2. **Click "Generate Domain"**
3. **Copy the URL** (e.g., `https://clip-service-production-xxxx.up.railway.app`)

### 5. Add to Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add: `CLIP_SERVICE_URL` = `https://your-railway-url.railway.app`
3. Save and redeploy

## Troubleshooting:

**If you see errors:**
- Make sure Root Directory is exactly `server` (not `/server` or `./server`)
- Check that `server/requirements.txt` exists
- Verify `server/clip_api.py` exists
- Check Railway logs for specific errors

**If deployment fails:**
- Check Railway logs in the "Deployments" tab
- Make sure Python dependencies are installing correctly
- Verify the start command is correct


