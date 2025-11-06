# CLIP Service Dockerfile for Production
FROM python:3.10-slim

# Install system dependencies
# Note: libgl1-mesa-glx is replaced by libgl1 in newer Debian versions
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    wget \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
# Use CPU-only PyTorch to reduce image size (Railway runs on CPU anyway)
# This reduces image from ~3GB to ~1GB and speeds up build/push
RUN pip install --no-cache-dir torch==2.1.0 torchvision==0.16.0 torchaudio==2.1.0 --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY clip_api.py .
COPY clip_service.py .

# Expose port - Railway will set PORT env var dynamically
# We expose both 8001 (default) and use Railway's PORT
EXPOSE 8001

# Health check - give more time for CLIP model to load (it can take 2-3 minutes)
HEALTHCHECK --interval=30s --timeout=10s --start-period=180s --retries=5 \
  CMD python -c "import os, requests; port = os.environ.get('PORT', '8001'); requests.get(f'http://localhost:{port}/health', timeout=5)" || exit 1

# Run the service (reads PORT from environment variable)
# Use shell form to allow environment variable substitution
CMD sh -c "python -m uvicorn clip_api:app --host 0.0.0.0 --port ${PORT:-8001}"

