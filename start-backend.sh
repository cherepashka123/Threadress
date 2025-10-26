#!/bin/bash

# Start the semantic search backend
echo "Starting Threadress Semantic Search Backend..."
echo "=============================================="

# Check if Python virtual environment exists
if [ ! -d "server/.venv" ]; then
    echo "Creating Python virtual environment..."
    cd server
    python3 -m venv .venv
    source .venv/bin/activate
    echo "Installing dependencies..."
    pip install -r requirements.txt
    cd ..
fi

# Activate virtual environment
cd server
source .venv/bin/activate

# Build indices if they don't exist
if [ ! -f "artifacts/text.index" ]; then
    echo "Building search indices..."
    python build_index.py
fi

# Start the server
echo "Starting FastAPI server on http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn serve:app --reload --port 8000 --host 0.0.0.0
