# CLIP Service Setup Guide

This guide explains how to set up the OpenAI CLIP service for generating image embeddings.

## Why CLIP Service?

The Hugging Face Inference API doesn't support CLIP models for image embeddings. We use the OpenAI CLIP library directly via a Python service.

## Setup Steps

### 1. Install Python Dependencies

```bash
cd server
pip install -r requirements.txt
```

This installs:
- PyTorch (for CLIP)
- OpenAI CLIP library
- FastAPI (for the API endpoint)
- Other dependencies

### 2. Start the CLIP Service

```bash
cd server
python clip_api.py
```

The service will:
- Load the CLIP model (takes ~30 seconds on first run)
- Start on `http://localhost:8001`
- Provide endpoints for image and text embeddings

### 3. Configure Environment Variable

Add to your `.env.local`:

```env
CLIP_SERVICE_URL=http://localhost:8001
```

### 4. Update Code to Use CLIP Service

The sync script and search will automatically use the CLIP service if `CLIP_SERVICE_URL` is set.

## Usage

### Manual Testing

```bash
# Test image embedding
curl -X POST http://localhost:8001/embed/image \
  -H "Content-Type: application/json" \
  -d '{"image_url": "https://example.com/image.jpg"}'

# Test text embedding
curl -X POST http://localhost:8001/embed/text \
  -H "Content-Type: application/json" \
  -d '{"text": "a red dress"}'

# Test batch embeddings
curl -X POST http://localhost:8001/embed/image/batch \
  -H "Content-Type: application/json" \
  -d '{"image_urls": ["url1", "url2"]}'
```

### Integration

The CLIP service is automatically used when:
1. `CLIP_SERVICE_URL` is set in environment
2. The sync script runs (for image embeddings)
3. The search endpoint runs (for query embeddings)

## Performance

- **Model Loading**: ~30 seconds on first startup
- **Image Embedding**: ~100-500ms per image (depends on network for fetching)
- **Text Embedding**: ~50-100ms per text
- **Batch Processing**: Much faster than individual requests

## Troubleshooting

### "Connection refused" errors

- Make sure the CLIP service is running: `python server/clip_api.py`
- Check the port (default: 8001)
- Verify `CLIP_SERVICE_URL` is set correctly

### "CUDA out of memory" errors

- CLIP works on CPU (slower but fine)
- If you have GPU, it will use it automatically
- Reduce batch size if needed

### Model download fails

- CLIP downloads models on first run (~350MB)
- Ensure internet connection is available
- Models are cached in `~/.cache/clip/`

## Alternative: Use Hugging Face for Text Only

If you don't want to run the CLIP service:
- Text embeddings can still use Hugging Face (works fine)
- Image embeddings will fallback to text-based descriptions
- Search will still work, just without true image understanding

## Production Deployment

For production, run the CLIP service as a separate service:
1. Deploy to a server with GPU (recommended)
2. Use a process manager (systemd, PM2, etc.)
3. Set `CLIP_SERVICE_URL` to your production URL
4. Consider using a load balancer for multiple instances

