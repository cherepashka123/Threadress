# Railway Environment Variables for CLIP Service

## Good News: No Environment Variables Needed! 🎉

The CLIP service is **standalone** and doesn't require any API keys or external service connections.

## What Railway Sets Automatically:

- ✅ **`PORT`** - Railway automatically sets this (you don't need to configure it)
  - The service uses: `port = int(os.environ.get("PORT", 8001))`
  - Railway will provide the port automatically

## Environment Variables NOT Needed:

- ❌ **`HF_TOKEN`** - Not needed (CLIP service uses local CLIP models, not Hugging Face API)
- ❌ **`QDRANT_URL`** - Not needed (CLIP service only generates embeddings, doesn't connect to Qdrant)
- ❌ **`QDRANT_API_KEY`** - Not needed
- ❌ **Any API keys** - Not needed

## What the CLIP Service Does:

1. Loads CLIP model (`ViT-B/32`) from disk on startup
2. Generates embeddings for images/texts
3. Returns embeddings via HTTP API
4. That's it! No external API calls needed.

## Optional: Performance Tuning (if needed)

If you want to optimize performance, you can optionally set:

- **`DEVICE`** - Set to `"cpu"` or `"cuda"` (defaults to auto-detect)
  - Currently: `device = "cuda" if torch.cuda.is_available() else "cpu"`
  - You can force CPU if needed: `DEVICE=cpu`

But this is **optional** - the service will work fine without it.

## Summary:

**You don't need to add any environment variables in Railway!** 

Just:
1. Set Root Directory to `server`
2. Set Build Type to `Docker`
3. Deploy!

Railway will handle the `PORT` automatically.


