---
title: Threadress CLIP Embeddings
emoji: 🎨
colorFrom: pink
colorTo: purple
sdk: docker
sdk_version: latest
app_port: 7860
---

# Threadress CLIP Embedding Service

CLIP (Contrastive Language-Image Pre-training) embedding service for product search.

## Features

- Text embeddings (512 dimensions)
- Image embeddings (512 dimensions)
- Batch processing support
- Fast inference with lazy model loading

## API Endpoints

- `GET /health` - Health check
- `POST /embed/text` - Single text embedding
- `POST /embed/text/batch` - Batch text embeddings
- `POST /embed/image` - Single image embedding
- `POST /embed/image/batch` - Batch image embeddings

## Example Usage

```python
import requests

# Text embedding
response = requests.post(
    "https://YOUR_USERNAME-threadress-clip.hf.space/embed/text",
    json={"text": "elegant black dress"}
)
print(response.json())

# Image embedding
response = requests.post(
    "https://YOUR_USERNAME-threadress-clip.hf.space/embed/image",
    json={"image_url": "https://example.com/image.jpg"}
)
print(response.json())
```

## Model

- **Model**: CLIP ViT-B/32
- **Device**: CPU (GPU available on HF Spaces)
- **Embedding Dimension**: 512

