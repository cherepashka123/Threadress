# Railway Setup - Step by Step Guide

## Step-by-Step Instructions:

### Step 1: Go to Railway Dashboard
1. Open: https://railway.app/dashboard
2. Log in (or sign up if needed)

### Step 2: Create New Project (if you don't have one)
1. Click **"New Project"** button (top right)
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `threadress-site` (or your repo name)
4. Click **"Deploy Now"**

### Step 3: Configure the Service
**IMPORTANT: Do this BEFORE the first deployment completes!**

1. **Click on the service** that was just created (it will have your repo name)

2. **Click "Settings" tab** (gear icon on the right side)

3. **Scroll down to "Build & Deploy" section**

4. **Set Root Directory:**
   - Find **"Root Directory"** field
   - Type exactly: `server` (no quotes, no slash)
   - Click outside the field to save

5. **Set Build Type to Docker:**
   - Look for **"Build Type"** or **"Buildpack"** dropdown
   - Change it to **"Docker"** (not "Nixpacks" or "Node.js")
   - If you don't see this option, skip this step

6. **Clear Build/Start Commands (if they exist):**
   - **Build Command**: Leave EMPTY (or delete if there's text)
   - **Start Command**: Leave EMPTY (or delete if there's text)
   - Dockerfile will handle these automatically

7. **Click "Save"** at the bottom

### Step 4: Generate Public URL (Domain)
1. Still in **Settings** tab
2. Click **"Networking"** section (or "Generate Domain" button)
3. Click **"Generate Domain"** button
4. Copy the URL that appears (e.g., `https://clip-service-production-xxxx.up.railway.app`)
5. Save this URL - you'll need it for Vercel!

### Step 5: Verify Deployment
1. Go to **"Deployments"** tab (or "Logs" tab)
2. Watch the deployment logs
3. You should see:
   - ✅ `pip install` commands (Python dependencies)
   - ✅ `COPY requirements.txt` (Docker building)
   - ✅ `uvicorn clip_api:app` (service starting)
   - ❌ NO `npm install` or `next start` (these mean it's wrong)

### Step 6: Test the Service
1. Once deployment is complete, test the health endpoint:
   ```bash
   curl https://your-railway-url.railway.app/health
   ```
2. Should return: `{"status":"healthy","service":"clip-embeddings"}`

### Step 7: Add to Vercel
1. Go to: https://vercel.com/dashboard
2. Select your project (threadress-site)
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Enter:
   - **Key**: `CLIP_SERVICE_URL`
   - **Value**: `https://your-railway-url.railway.app` (from Step 4)
   - **Environment**: Check **Production** (and Preview if you want)
6. Click **"Save"**
7. **Redeploy** your Vercel app

## Troubleshooting:

### If you see `npm start` in logs:
- **Root Directory is wrong** - Make sure it's exactly `server` (not `/server` or `./server`)
- **Build Type is wrong** - Change to `Docker`

### If deployment fails:
- Check **Logs** tab for specific errors
- Make sure `server/Dockerfile` exists in your repo
- Make sure `server/requirements.txt` exists
- Make sure `server/clip_api.py` exists

### If you can't find "Build Type" option:
- Just set **Root Directory** to `server`
- Add environment variable: `NIXPACKS_PYTHON_VERSION=3.10`
- Set **Start Command**: `uvicorn clip_api:app --host 0.0.0.0 --port $PORT`

## Quick Checklist:

- [ ] Root Directory set to `server`
- [ ] Build Type set to `Docker` (if available)
- [ ] Build/Start commands cleared (or empty)
- [ ] Domain generated and URL copied
- [ ] Health endpoint returns `{"status":"healthy"}`
- [ ] `CLIP_SERVICE_URL` added to Vercel
- [ ] Vercel app redeployed

## That's it!

Once done, your Vercel app will use the Railway CLIP service for embeddings! 🚀


