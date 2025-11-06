"""
FastAPI endpoint for CLIP embeddings
Can be run alongside the existing serve.py or as a separate service
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import logging
import sys

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

# Don't import clip_service at module level - import it lazily to avoid startup crashes
# import clip_service

app = FastAPI(title="CLIP Embedding Service")
logger.info("FastAPI app created")

@app.on_event("startup")
async def startup_event():
    import os
    port = os.environ.get("PORT", "8001")
    logger.info(f"🚀 CLIP service starting on port {port}")
    logger.info(f"🚀 Listening on 0.0.0.0:{port}")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ImageEmbedRequest(BaseModel):
    image_url: str

class ImageEmbedBatchRequest(BaseModel):
    image_urls: List[str]

class TextEmbedRequest(BaseModel):
    text: str

class TextEmbedBatchRequest(BaseModel):
    texts: List[str]

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "status": "ok",
        "service": "clip-embeddings",
        "message": "CLIP Embedding Service is running"
    }

@app.get("/health")
async def health():
    """Health check endpoint - responds immediately without loading model"""
    # Don't import clip_service here - just return healthy
    # This ensures the endpoint works even if clip_service has import issues
    return {
        "status": "healthy",
        "service": "clip-embeddings"
    }

@app.post("/embed/image")
async def embed_image(request: ImageEmbedRequest):
    """Generate embedding for a single image"""
    try:
        import clip_service
        embedding = clip_service.embed_image(request.image_url)
        return {
            "ok": True,
            "embedding": embedding,
            "dimension": len(embedding)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embed/image/batch")
async def embed_image_batch(request: ImageEmbedBatchRequest):
    """Generate embeddings for multiple images"""
    try:
        import clip_service
        embeddings = clip_service.embed_image_batch(request.image_urls)
        return {
            "ok": True,
            "embeddings": embeddings,
            "count": len(embeddings),
            "dimension": len(embeddings[0]) if embeddings else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embed/text")
async def embed_text(request: TextEmbedRequest):
    """Generate embedding for a single text"""
    try:
        logger.info(f"Received text embedding request: {request.text[:50]}...")
        import clip_service
        logger.info("clip_service imported successfully")
        embedding = clip_service.embed_text(request.text)
        logger.info(f"Generated embedding: {len(embedding)} dimensions")
        return {
            "ok": True,
            "embedding": embedding,
            "dimension": len(embedding)
        }
    except ImportError as e:
        logger.error(f"Failed to import clip_service: {e}")
        raise HTTPException(status_code=500, detail=f"Service import error: {str(e)}")
    except Exception as e:
        logger.error(f"Error generating text embedding: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embed/text/batch")
async def embed_text_batch(request: TextEmbedBatchRequest):
    """Generate embeddings for multiple texts"""
    try:
        import clip_service
        embeddings = clip_service.embed_text_batch(request.texts)
        return {
            "ok": True,
            "embeddings": embeddings,
            "count": len(embeddings),
            "dimension": len(embeddings[0]) if embeddings else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)

