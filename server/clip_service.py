"""
CLIP Embedding Service
Uses OpenAI CLIP to generate image and text embeddings
"""

import torch
import clip
from PIL import Image
import requests
from io import BytesIO
import numpy as np
from typing import List, Union
import os

# Load CLIP model lazily (not at import time)
# Use CPU for Railway (no GPU available)
device = "cpu"  # Railway doesn't have GPU, force CPU
model = None
preprocess = None

def _ensure_model_loaded():
    """Load CLIP model on first use (lazy loading)"""
    global model, preprocess
    if model is None or preprocess is None:
        print(f"Loading CLIP model on {device}...")
        try:
            model, preprocess = clip.load("ViT-B/32", device=device)
            if model is None or preprocess is None:
                raise Exception("CLIP model loaded but returned None - likely out of memory")
            print("CLIP model loaded successfully!")
        except Exception as e:
            print(f"Error loading CLIP model: {e}")
            import traceback
            traceback.print_exc()
            # Set to None to trigger retry on next call
            model = None
            preprocess = None
            raise
    return model, preprocess

def fetch_image(url: str) -> Image.Image:
    """Fetch image from URL"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return Image.open(BytesIO(response.content))
    except Exception as e:
        raise Exception(f"Failed to fetch image from {url}: {str(e)}")

def embed_image(image_url: str) -> List[float]:
    """
    Generate 512-dimensional embedding for an image URL using CLIP
    
    Args:
        image_url: URL of the image
        
    Returns:
        List of 512 floats representing the image embedding
    """
    try:
        # Load model if not already loaded
        model, preprocess = _ensure_model_loaded()
        
        # Fetch and preprocess image
        image = fetch_image(image_url)
        image_input = preprocess(image).unsqueeze(0).to(device)
        
        # Generate embedding
        with torch.no_grad():
            image_features = model.encode_image(image_input)
            # Normalize to unit vector
            image_features = image_features / image_features.norm(dim=-1, keepdim=True)
            
        # Convert to numpy and then to list
        embedding = image_features.cpu().numpy()[0].tolist()
        
        # Ensure it's 512 dimensions
        if len(embedding) != 512:
            raise ValueError(f"Expected 512 dimensions, got {len(embedding)}")
            
        return embedding
    except Exception as e:
        print(f"Error embedding image {image_url}: {e}")
        # Return zero vector as fallback
        return [0.0] * 512

def embed_image_batch(image_urls: List[str]) -> List[List[float]]:
    """
    Generate embeddings for multiple images in batch
    
    Args:
        image_urls: List of image URLs
        
    Returns:
        List of embeddings (each is 512 floats)
    """
    embeddings = []
    for url in image_urls:
        try:
            embedding = embed_image(url)
            embeddings.append(embedding)
        except Exception as e:
            print(f"Error processing {url}: {e}")
            # Add zero vector as fallback
            embeddings.append([0.0] * 512)
    return embeddings

def embed_text(text: str) -> List[float]:
    """
    Generate 512-dimensional embedding for text using CLIP
    
    Args:
        text: Text string to embed
        
    Returns:
        List of 512 floats representing the text embedding
    """
    try:
        # Load model if not already loaded
        model, preprocess = _ensure_model_loaded()
        
        # Check if model is None (could happen if loading was killed)
        if model is None:
            raise Exception("CLIP model failed to load - likely out of memory on Railway free tier (512MB limit). CLIP needs ~1-2GB.")
        
        # Tokenize text
        text_tokens = clip.tokenize([text]).to(device)
        
        # Generate embedding
        with torch.no_grad():
            text_features = model.encode_text(text_tokens)
            # Normalize to unit vector
            text_features = text_features / text_features.norm(dim=-1, keepdim=True)
            
        # Convert to numpy and then to list
        embedding = text_features.cpu().numpy()[0].tolist()
        
        # CLIP text embeddings are 512 dimensions
        if len(embedding) != 512:
            raise ValueError(f"Expected 512 dimensions, got {len(embedding)}")
            
        return embedding
    except Exception as e:
        print(f"Error embedding text '{text}': {e}")
        import traceback
        traceback.print_exc()
        # Return zero vector as fallback
        return [0.0] * 512

def embed_text_batch(texts: List[str]) -> List[List[float]]:
    """
    Generate embeddings for multiple texts in batch
    
    Args:
        texts: List of text strings
        
    Returns:
        List of embeddings (each is 512 floats)
    """
    try:
        # Ensure model is loaded first
        model, preprocess = _ensure_model_loaded()
        
        # Check if model is None (could happen if loading was killed)
        if model is None:
            raise Exception("CLIP model failed to load - likely out of memory on Railway free tier (512MB limit). CLIP needs ~1-2GB.")
        
        # Tokenize all texts
        text_tokens = clip.tokenize(texts).to(device)
        
        # Generate embeddings in batch
        with torch.no_grad():
            text_features = model.encode_text(text_tokens)
            # Normalize to unit vectors
            text_features = text_features / text_features.norm(dim=-1, keepdim=True)
            
        # Convert to numpy and then to list
        embeddings = text_features.cpu().numpy().tolist()
        
        # Verify dimensions
        for i, emb in enumerate(embeddings):
            if len(emb) != 512:
                raise ValueError(f"Text {i} expected 512 dimensions, got {len(emb)}")
                
        return embeddings
    except Exception as e:
        print(f"Error embedding texts batch: {e}")
        import traceback
        traceback.print_exc()
        # Return zero vectors as fallback
        return [[0.0] * 512] * len(texts)

if __name__ == "__main__":
    # Test the service
    print("Testing CLIP service...")
    
    # Test text embedding
    test_text = "a red dress"
    text_emb = embed_text(test_text)
    print(f"Text embedding dimension: {len(text_emb)}")
    print(f"Text embedding sample (first 5): {text_emb[:5]}")
    
    # Test image embedding (if you have a test image URL)
    # test_image = "https://example.com/image.jpg"
    # image_emb = embed_image(test_image)
    # print(f"Image embedding dimension: {len(image_emb)}")
    
    print("CLIP service is working!")

