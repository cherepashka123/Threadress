# Hugging Face Spaces Setup - Step by Step

Follow these steps to deploy your CLIP service to Hugging Face Spaces:

## Step 1: Create Hugging Face Account

1. Go to https://huggingface.co/join
2. Sign up with your email or GitHub account
3. Verify your email if needed

**Time: 2 minutes**

---

## Step 2: Install HF CLI (Optional but Recommended)

```bash
pip install huggingface_hub
```

Then login:
```bash
huggingface-cli login
```

Enter your HF token (get it from https://huggingface.co/settings/tokens)

**Time: 2 minutes**

---

## Step 3: Create a New Space

1. Go to https://huggingface.co/new-space
2. Fill in:
   - **Space name**: `threadress-clip` (or any name you like)
   - **SDK**: Select **"Docker"**
   - **Visibility**: **Public** (free tier) or Private (requires Pro)
3. Click **"Create Space"**

**Time: 1 minute**

---

## Step 4: Clone Your Space Repository

After creating the space, HF will give you a git URL. Clone it:

```bash
git clone https://huggingface.co/spaces/YOUR_USERNAME/threadress-clip
cd threadress-clip
```

Replace `YOUR_USERNAME` with your actual Hugging Face username.

**Time: 1 minute**

---

## Step 5: Copy Files to Your Space

Copy these files from your `server/` folder to the cloned space:

```bash
# From your project root
cp server/clip_api.py threadress-clip/
cp server/clip_service.py threadress-clip/
cp server/requirements.txt threadress-clip/
cp server/Dockerfile.hf threadress-clip/Dockerfile
cp server/README_SPACE.md threadress-clip/README.md
cp server/app.py threadress-clip/
```

Or manually copy:
- `clip_api.py`
- `clip_service.py`
- `requirements.txt`
- `Dockerfile.hf` → rename to `Dockerfile`
- `README_SPACE.md` → rename to `README.md`
- `app.py`

**Time: 2 minutes**

---

## Step 6: Push to Hugging Face

```bash
cd threadress-clip
git add .
git commit -m "Add CLIP embedding service"
git push
```

**Time: 1 minute**

---

## Step 7: Wait for Build

1. Go to your space page: `https://huggingface.co/spaces/YOUR_USERNAME/threadress-clip`
2. Click on the **"Logs"** tab
3. Watch the build progress (takes 5-10 minutes first time)
4. Wait for: `Application startup complete`

**Time: 5-10 minutes (first build)**

---

## Step 8: Test Your Service

Once built, test the health endpoint:

```bash
curl https://YOUR_USERNAME-threadress-clip.hf.space/health
```

Should return: `{"status":"healthy","service":"clip-embeddings"}`

Test text embedding:
```bash
curl -X POST https://YOUR_USERNAME-threadress-clip.hf.space/embed/text \
  -H "Content-Type: application/json" \
  -d '{"text": "elegant black dress"}'
```

**Time: 2 minutes**

---

## Step 9: Update Vercel Environment Variable

1. Go to https://vercel.com/dashboard
2. Select your **Threadress** project
3. Go to **Settings** → **Environment Variables**
4. Find `CLIP_SERVICE_URL`
5. Update it to: `https://YOUR_USERNAME-threadress-clip.hf.space`
   - Replace `YOUR_USERNAME` with your actual HF username
6. Make sure it's set for **Production** environment
7. Click **Save**
8. **Redeploy** your Vercel app (go to Deployments → ... → Redeploy)

**Time: 2 minutes**

---

## Step 10: Verify Everything Works

1. Go to your deployed website
2. Try a search query
3. Check Vercel logs to see if CLIP is being used
4. You should see logs like:
   - `✅ CLIP service used for text embedding`
   - Or `⚠️ CLIP service failed, falling back to Hugging Face`

**Time: 2 minutes**

---

## Total Time: ~15-20 minutes

---

## Troubleshooting

### Build Fails
- Check the **Logs** tab in your HF Space
- Look for Python errors
- Make sure all files are copied correctly

### Service Not Responding
- Check if build completed successfully
- Wait a few minutes after first build (cold start)
- Check logs for errors

### Port Issues
- HF Spaces uses port 7860 automatically
- Make sure `Dockerfile` uses `${PORT:-7860}`

### Memory Issues
- HF Spaces free tier has 2GB RAM (should be enough)
- If you see "Killed" messages, the model might be too large
- Try a smaller CLIP model variant

---

## Your Space URL Format

Once deployed, your service will be available at:
```
https://YOUR_USERNAME-threadress-clip.hf.space
```

Replace `YOUR_USERNAME` with your actual Hugging Face username.

---

## Need Help?

- HF Spaces Docs: https://huggingface.co/docs/hub/spaces
- HF Spaces Discord: https://huggingface.co/join/discord
- Check your space logs for detailed error messages

