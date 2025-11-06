# Fix Railway 502 - Port Configuration

## Problem
Railway returns 502 because the service listening port doesn't match Railway's public networking target port.

## Solution: Configure Railway's Public Networking Port

### Step 1: Check What Port Your Service is Listening On
1. Railway Dashboard → Your CLIP Service → **"Logs"** tab
2. Look for: `Uvicorn running on http://0.0.0.0:XXXX`
3. Note the port number (e.g., 8080 or 8001)

### Step 2: Configure Railway's Public Networking
1. Railway Dashboard → Your CLIP Service
2. Click **"Networking"** tab
3. Under **"Public Networking"**:
   - Find your generated domain (e.g., `threadress-production.up.railway.app`)
   - Click on it or click the **settings/edit** icon
   - Look for **"Target Port"** or **"Port"** field
   - **Set it to match the port your service is listening on** (from Step 1)
   - If service shows 8080, set target port to **8080**
   - If service shows 8001, set target port to **8001**

### Step 3: Verify
After updating:
1. Wait 30 seconds for Railway to update routing
2. Test: `curl https://threadress-production.up.railway.app/health`
3. Should return: `{"status":"healthy","service":"clip-embeddings"}`

## Alternative: Set PORT Environment Variable
If Railway's networking doesn't have a target port setting:

1. Railway Dashboard → Your Service → **"Variables"** tab
2. Add/Update: `PORT=8001` (or whatever port you want)
3. Redeploy service
4. Service will listen on that port
5. Make sure Railway's networking routes to that port

## Why This Happens
- Railway assigns a PORT dynamically (could be 8080, 8001, etc.)
- Service listens on that PORT
- Railway's public networking needs to know which port to route to
- If they don't match → 502 error

