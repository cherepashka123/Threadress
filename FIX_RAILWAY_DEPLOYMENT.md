# Fix Railway Deployment - Running Next.js Instead of Python CLIP Service

## Problem:
Railway is deploying your Next.js app instead of the Python CLIP service. The logs show `npm start` and `next start` instead of Python/uvicorn.

## Solution: Force Railway to Use Docker

### Option 1: Use Docker (Recommended)

1. **Go to Railway Dashboard** → Your Service → **Settings**

2. **In "Build & Deploy" section:**
   - **Root Directory**: `server` (should already be set)
   - **Build Command**: Leave empty (will use Dockerfile)
   - **Start Command**: Leave empty (will use Dockerfile CMD)

3. **Set Build Type to Docker:**
   - In Settings → **"Build"** section
   - Change **"Build Type"** to **"Docker"**
   - Railway should detect `server/Dockerfile` automatically

4. **Save** and Railway will redeploy

### Option 2: Explicitly Set Python Environment

1. **Go to Railway Dashboard** → Your Service → **Settings**

2. **In "Build & Deploy" section:**
   - **Root Directory**: `server`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn clip_api:app --host 0.0.0.0 --port $PORT`

3. **Force Python Runtime:**
   - Go to **"Variables"** tab
   - Add: `NIXPACKS_PYTHON_VERSION=3.10`
   - This tells Railway to use Python instead of Node.js

4. **Save** and redeploy

### Option 3: Create New Service (Cleanest)

1. **Delete the current service** in Railway (or create a new project)

2. **Create New Service** → **GitHub Repo** → Select your repo

3. **IMMEDIATELY** (before first deploy):
   - Go to **Settings** → **Build & Deploy**
   - **Root Directory**: `server`
   - **Build Type**: `Docker`
   - Save

4. Railway will use `server/Dockerfile` and deploy correctly

## Verify It's Working:

After fixing, you should see in Railway logs:
- ✅ `pip install` commands (not `npm install`)
- ✅ Python dependencies installing
- ✅ `uvicorn clip_api:app` starting
- ✅ No `npm start` or `next start` messages
- ✅ Health check at `/health` endpoint working

## Test the Service:

Once deployed, test it:
```bash
curl https://your-railway-url.railway.app/health
```

Should return: `{"status":"healthy","service":"clip-embeddings"}`


