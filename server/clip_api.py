"""
FastAPI endpoint for CLIP embeddings
Can be run alongside the existing serve.py or as a separate service
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import clip_service

app = FastAPI(title="CLIP Embedding Service")

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

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "clip-embeddings"}

@app.post("/embed/image")
async def embed_image(request: ImageEmbedRequest):
    """Generate embedding for a single image"""
    try:
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
        embedding = clip_service.embed_text(request.text)
        return {
            "ok": True,
            "embedding": embedding,
            "dimension": len(embedding)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/embed/text/batch")
async def embed_text_batch(request: TextEmbedBatchRequest):
    """Generate embeddings for multiple texts"""
    try:
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
    uvicorn.run(app, host="0.0.0.0", port=8001)

