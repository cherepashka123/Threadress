#!/bin/bash

# Start CLIP service for image embeddings
# This service uses OpenAI CLIP library directly

echo "🚀 Starting CLIP Embedding Service..."
echo "This will load the CLIP model (takes ~30 seconds on first run)"
echo ""

cd server
python clip_api.py

