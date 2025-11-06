# Deploy CLIP to Hugging Face Spaces

## Quick Setup Guide

### Step 1: Create Hugging Face Account
1. Go to https://huggingface.co/join
2. Sign up (free, no credit card needed)

### Step 2: Create a Space
1. Go to https://huggingface.co/new-space
2. Fill in:
   - **Space name**: `threadress-clip` (or any name)
   - **SDK**: Select **"Docker"**
   - **Visibility**: Public (free) or Private (requires Pro)
3. Click **"Create Space"**

### Step 3: Clone Your Space
```bash
pip install huggingface_hub
huggingface-cli login

# Clone your space
git clone https://huggingface.co/spaces/YOUR_USERNAME/threadress-clip
cd threadress-clip
```

### Step 4: Add Files to Space

Create `app.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import clip_service
import logging

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "service": "clip-embeddings"}

@app.get("/health")
def health():
    return {"status": "healthy", "service": "clip-embeddings"}

@app.post("/embed/text")
async def embed_text(request: dict):
    text = request.get("text", "")
    embedding = clip_service.embed_text(text)
    return {"ok": True, "embedding": embedding, "dimension": len(embedding)}

@app.post("/embed/text/batch")
async def embed_text_batch(request: dict):
    texts = request.get("texts", [])
    embeddings = clip_service.embed_text_batch(texts)
    return {"ok": True, "embeddings": embeddings, "count": len(embeddings)}

@app.post("/embed/image")
async def embed_image(request: dict):
    image_url = request.get("image_url", "")
    embedding = clip_service.embed_image(image_url)
    return {"ok": True, "embedding": embedding, "dimension": len(embedding)}
```

Keep your existing `Dockerfile` (already in `server/` folder)

Create `requirements.txt`:
```
fastapi
uvicorn[standard]
torch==2.1.0
torchvision==0.16.0
torchaudio==2.1.0
pillow
requests
numpy
git+https://github.com/openai/CLIP.git
```

### Step 5: Update Dockerfile for HF Spaces

HF Spaces uses port 7860 by default. Update your Dockerfile:
```dockerfile
# ... existing Dockerfile content ...

# HF Spaces expects app to run on port 7860
CMD python -m uvicorn app:app --host 0.0.0.0 --port 7860
```

### Step 6: Push to HF Space

```bash
cd threadress-clip
git add .
git commit -m "Add CLIP service"
git push
```

### Step 7: Wait for Build

HF Spaces will automatically:
1. Build your Docker image
2. Deploy your service
3. Give you a URL like: `https://YOUR_USERNAME-threadress-clip.hf.space`

### Step 8: Update Vercel Environment Variable

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `CLIP_SERVICE_URL` to: `https://YOUR_USERNAME-threadress-clip.hf.space`
3. Redeploy your Vercel app

### Step 9: Test

```bash
curl https://YOUR_USERNAME-threadress-clip.hf.space/health
```

Should return: `{"status":"healthy","service":"clip-embeddings"}`

---

## Benefits of HF Spaces

✅ **Free GPU** - Faster than CPU  
✅ **2GB RAM** - Enough for CLIP  
✅ **Auto HTTPS** - Secure by default  
✅ **Easy updates** - Just git push  
✅ **Free tier** - No credit card  

## Limitations

⚠️ **2-hour sleep** - Free tier sleeps after 2 hours inactivity  
⚠️ **First request** - Takes ~30 seconds to wake up (cold start)  
⚠️ **Public repos** - Free tier requires public repos (or Pro for private)  

---

## Alternative: Use Modal (Always-On)

If you need always-on service, Modal is better:
- No sleep timeout
- Pay per request (cheaper for low traffic)
- $30/month free credits

See `MODAL_SETUP.md` for Modal deployment.

