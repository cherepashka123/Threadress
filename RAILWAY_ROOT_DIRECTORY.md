# How to Set Root Directory to "server" in Railway

## Steps:

1. **Go to Railway Dashboard**: https://railway.app/dashboard

2. **Select your project** (or create a new one)

3. **Click on your service** (or create a new service from GitHub)

4. **Click on "Settings" tab** (in the service view)

5. **Scroll down to "Build & Deploy"** section

6. **Find "Root Directory"** field

7. **Enter**: `server` (without quotes)

8. **Save** changes

## Alternative: If you're creating a new service:

1. **New Service** → **GitHub Repo** → Select your repo

2. **Before deploying**, go to **Settings** tab

3. **Set Root Directory** to: `server`

4. **Save** and Railway will redeploy

## What this does:

- Tells Railway to run commands from the `server/` folder
- Railway will look for `requirements.txt`, `clip_api.py`, etc. in `server/`
- Build commands will execute from `server/` directory

## Verify it's working:

After setting Root Directory:
- Railway should show build logs from `server/` folder
- You should see Python dependencies being installed
- The service should start successfully


