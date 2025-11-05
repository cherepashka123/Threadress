# Verify Vector Search Tools in Production

## Quick Check

1. **Test the diagnostic endpoint:**
   ```
   https://your-domain.vercel.app/api/test-production
   ```
   This will show:
   - ✅ CLIP service status (available/unavailable)
   - ✅ Qdrant connection
   - ✅ Embedding generation test
   - ✅ Environment variables

2. **Check Vercel logs** after a search query:
   - Look for: `✅ CLIP service used for text embedding` or `ℹ️ CLIP direct service not available, using Hugging Face`
   - Look for: `✅ CLIP service used for image embedding` or `CLIP service unavailable`
   - Look for: `📊 Hugging Face text embedding: 384 dim, non-zero: true`

## Required Environment Variables in Vercel

1. **CLIP_SERVICE_URL** (if using Railway CLIP service)
   - Set to your Railway service URL: `https://your-service.railway.app`
   - If not set, will use Hugging Face only

2. **HF_TOKEN** (Required)
   - Your Hugging Face API token
   - Fallback when CLIP service unavailable

3. **QDRANT_URL** (Required)
   - Your Qdrant cloud URL

4. **QDRANT_API_KEY** (Required)
   - Your Qdrant API key

## Vector Search Components

### 1. Text Embeddings
- **Primary**: CLIP service (512-dim → sliced to 384-dim)
- **Fallback**: Hugging Face `sentence-transformers/all-MiniLM-L6-v2` (384-dim)
- **Used in**: All text queries

### 2. Image Embeddings
- **Primary**: CLIP service (512-dim)
- **Fallback**: Hugging Face `sentence-transformers/clip-ViT-B-32` (512-dim)
- **Used in**: Image-based searches

### 3. Multimodal Search
- **Combines**: Text + Image + Vibe embeddings
- **Output**: 512-dim combined vector
- **Used in**: `/api/inventory-search` endpoint

### 4. Qdrant Vector Search
- **Collection**: `inventory_items`
- **Vector size**: 512-dim (combined vector)
- **Search type**: Cosine similarity

## What to Look For in Logs

### ✅ CLIP Working:
```
✅ CLIP service used for text embedding: 512 dim → 384 dim, non-zero: true
✅ CLIP service used for image embedding: [image URL]...
🔍 CLIP_SERVICE_URL: SET (https://your-railway-url.railway.app)
```

### ⚠️ CLIP Not Available (Using Hugging Face):
```
ℹ️ CLIP direct service not available, using Hugging Face
📊 Hugging Face text embedding: 384 dim, non-zero: true
```

### ❌ Problem:
```
❌ Hugging Face returned zero vector!
⚠️ CLIP returned zero vector, falling back to Hugging Face
```

## Troubleshooting

### No results showing:
1. Check `/api/test-production` - verify all components are working
2. Check Vercel logs for errors
3. Verify embeddings are non-zero (`non-zero: true`)
4. Check Qdrant has data: `/api/check-database`

### CLIP service not working:
1. Check Railway service is running
2. Verify `CLIP_SERVICE_URL` is set in Vercel
3. Test Railway health: `https://your-railway-url.railway.app/health`
4. Check Railway logs for errors

### Search results inaccurate:
- This is expected if CLIP service is not available (using Hugging Face only)
- CLIP provides better semantic understanding
- Ensure Railway CLIP service is running and accessible

