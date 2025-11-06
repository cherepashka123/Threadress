# Quick Fix: Railway Deploying Next.js Instead of Python

## The Problem:
Your Railway logs show `npm start` and `next start` - Railway is deploying your Next.js app, not the Python CLIP service.

## The Fix (3 Steps):

### Step 1: Set Root Directory in Railway

1. Go to **Railway Dashboard** → Your Service → **Settings**
2. Scroll to **"Build & Deploy"** section
3. Set **Root Directory** to: `server`
4. **Save**

### Step 2: Force Docker Build

1. Still in **Settings** → **"Build & Deploy"**
2. Look for **"Build Type"** or **"Buildpack"** 
3. Change it to **"Docker"** (not "Nixpacks" or "Node.js")
4. Railway should detect `server/Dockerfile` automatically
5. **Save**

### Step 3: Clear Build Command (if exists)

1. In **"Build & Deploy"** section
2. **Build Command**: Leave EMPTY (Dockerfile handles this)
3. **Start Command**: Leave EMPTY (Dockerfile handles this)
4. **Save**

### Step 4: Redeploy

1. Go to **"Deployments"** tab
2. Click **"Redeploy"** or push a new commit
3. Watch the logs - you should see:
   - ✅ `pip install` (not `npm install`)
   - ✅ Python dependencies installing
   - ✅ `uvicorn clip_api:app` starting
   - ❌ NO `npm start` or `next start`

## Alternative: If Docker option doesn't appear

1. **Delete the current service**
2. **Create new service** → **GitHub Repo**
3. **BEFORE first deploy**, go to **Settings**:
   - Root Directory: `server`
   - Add Environment Variable: `NIXPACKS_PYTHON_VERSION=3.10`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn clip_api:app --host 0.0.0.0 --port $PORT`
4. **Save** and deploy

## Verify Success:

After redeploy, test:
```bash
curl https://your-railway-url.railway.app/health
```

Should return: `{"status":"healthy","service":"clip-embeddings"}`


