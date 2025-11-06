"""
Hugging Face Spaces compatible FastAPI app
This is the entry point for HF Spaces deployment
"""
import os

# HF Spaces sets PORT env var to 7860
# Import and run the FastAPI app from clip_api
from clip_api import app

# The app is already configured in clip_api.py
# HF Spaces will automatically detect this FastAPI app and run it

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)

