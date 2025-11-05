# CLIP Service Dockerfile for Production
FROM python:3.10-slim

# Install system dependencies
# Note: libgl1-mesa-glx is replaced by libgl1 in newer Debian versions
RUN apt-get update && apt-get install -y \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY clip_api.py .
COPY clip_service.py .

# Expose port (Railway will map $PORT to this)
EXPOSE 8001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD python -c "import os, requests; port = os.environ.get('PORT', '8001'); requests.get(f'http://localhost:{port}/health')" || exit 1

# Run the service (uses $PORT from Railway, defaults to 8001)
# Use shell form to allow environment variable substitution
CMD python -m uvicorn clip_api:app --host 0.0.0.0 --port ${PORT:-8001}

