# Railway CLIP Service - Memory Issue Fix

## Problem Identified from Logs

**Root Cause**: Railway free tier has **512MB memory limit**, but CLIP model needs **~1-2GB** to load and run.

### What's Happening:
1. Service starts successfully ✅
2. Receives embedding request ✅
3. Starts loading CLIP model ✅
4. Downloads model (338MB) ✅
5. **Gets "Killed" by Railway OOM killer** ❌ (out of memory)
6. Process restarts → cycle repeats
7. Error: `'NoneType' object has no attribute 'encode_text'` (model is None after kill)

### Evidence from Logs:
- Multiple "Killed" messages right after model loading starts
- Error: `Error embedding texts batch: 'NoneType' object has no attribute 'encode_text'`
- Service keeps restarting but can't complete model loading

## Solutions

### Option 1: Upgrade Railway Plan (Recommended)
**Best long-term solution**

1. Go to Railway Dashboard → Your Service → Settings
2. Upgrade to **Pro Plan** ($5/month):
   - 2GB RAM (enough for CLIP)
   - Always-on (no sleeping)
   - Better performance

### Option 2: Use Lighter CLIP Model
**Quick fix but lower quality**

Modify `server/clip_service.py`:
```python
# Instead of ViT-B/32 (338MB), use a smaller model
model, preprocess = clip.load("ViT-B/16", device=device)  # Still might be too large
# Or use a quantized/distilled model
```

But even smaller models might exceed 512MB when loaded.

### Option 3: Deploy to Alternative Platform
**If Railway doesn't work**

- **Render**: 512MB free tier (same issue), but $7/month gives 2GB
- **Fly.io**: 256MB free, but can scale up
- **AWS/GCP**: Pay-as-you-go, more flexible
- **Hugging Face Spaces**: Free GPU hosting (might work better)

### Option 4: Use Hugging Face API Only (Temporary)
**Disable CLIP, use Hugging Face embeddings**

The system already falls back to Hugging Face when CLIP fails. This works but:
- Lower quality embeddings (384-dim vs 512-dim)
- No image understanding
- Search still works!

## Immediate Fix Applied

I've fixed the error handling in `clip_service.py`:
- ✅ Better error messages when model fails to load
- ✅ Properly handles `model is None` case
- ✅ More detailed error logging

## Recommendation

**Upgrade Railway to Pro Plan ($5/month)** for:
- 2GB RAM (enough for CLIP)
- Always-on service
- Better reliability

Or **use Hugging Face only** (already working as fallback) until you can upgrade.

The code will now provide clearer error messages when memory is insufficient.

