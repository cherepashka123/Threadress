#!/usr/bin/env python3
"""
Build search indices for semantic search.
Creates text embeddings, image embeddings, and BM25 index.
"""

import os
import sys
import json
import pickle
import numpy as np
import pandas as pd
from pathlib import Path
from typing import List, Dict, Any, Tuple
import faiss
from sentence_transformers import SentenceTransformer
from PIL import Image
import torch
from rank_bm25 import BM25Okapi
from sklearn.preprocessing import normalize
import warnings
warnings.filterwarnings("ignore")

class SearchIndexBuilder:
    def __init__(self, data_dir: str = "data", artifacts_dir: str = "artifacts"):
        self.data_dir = Path(data_dir)
        self.artifacts_dir = Path(artifacts_dir)
        self.artifacts_dir.mkdir(parents=True, exist_ok=True)
        
        # Initialize models
        print("Loading models...")
        self.text_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.clip_model = SentenceTransformer('clip-ViT-B-32')
        print("Models loaded successfully!")
        
        # Default weights
        self.W_TEXT = 0.5
        self.W_IMG = 0.3
        self.W_KW = 0.2
        
    def load_products(self) -> pd.DataFrame:
        """Load products from CSV, create if missing."""
        csv_path = self.data_dir / "products.csv"
        
        if not csv_path.exists():
            print("Products CSV not found. Running ingestion...")
            # Run the ingestion script
            import subprocess
            import sys
            script_path = Path(__file__).parent / "util" / "ingest_from_public.py"
            result = subprocess.run([sys.executable, str(script_path)], 
                                  capture_output=True, text=True, cwd=Path(__file__).parent.parent)
            if result.returncode != 0:
                print(f"Error running ingestion: {result.stderr}")
                sys.exit(1)
            print("Ingestion completed!")
        
        df = pd.read_csv(csv_path)
        print(f"Loaded {len(df)} products")
        
        # Ensure minimum items
        if len(df) < 30:
            print("Warning: Less than 30 products found. Consider running augmentation.")
        
        return df
    
    def prepare_text_data(self, df: pd.DataFrame) -> List[str]:
        """Prepare text data for embedding."""
        texts = []
        for _, row in df.iterrows():
            # Combine title, description, and tags
            text_parts = []
            if pd.notna(row['title']):
                text_parts.append(str(row['title']))
            if pd.notna(row['description']):
                text_parts.append(str(row['description']))
            if pd.notna(row['tags']):
                text_parts.append(str(row['tags']))
            
            combined_text = ' '.join(text_parts)
            texts.append(combined_text)
        
        return texts
    
    def prepare_bm25_data(self, df: pd.DataFrame) -> List[List[str]]:
        """Prepare tokenized data for BM25."""
        tokenized_docs = []
        for _, row in df.iterrows():
            # Combine all text fields and tokenize
            text_parts = []
            for field in ['title', 'description', 'tags', 'color', 'material']:
                if pd.notna(row[field]):
                    text_parts.append(str(row[field]))
            
            combined_text = ' '.join(text_parts).lower()
            # Simple tokenization (split on whitespace and common punctuation)
            tokens = combined_text.replace(',', ' ').replace('.', ' ').split()
            tokenized_docs.append(tokens)
        
        return tokenized_docs
    
    def load_and_encode_images(self, df: pd.DataFrame) -> np.ndarray:
        """Load and encode images using CLIP."""
        print("Encoding images...")
        image_embeddings = []
        project_root = Path(__file__).parent.parent
        
        for idx, row in df.iterrows():
            image_path = project_root / "public" / row['image_path'].lstrip('/')
            
            try:
                if image_path.exists():
                    image = Image.open(image_path).convert('RGB')
                    # Resize to reasonable size for CLIP
                    image = image.resize((224, 224))
                    embedding = self.clip_model.encode([image])
                    image_embeddings.append(embedding[0])
                else:
                    print(f"Warning: Image not found: {image_path}")
                    # Use zero embedding as fallback
                    embedding = np.zeros(512)  # CLIP ViT-B-32 has 512 dims
                    image_embeddings.append(embedding)
            except Exception as e:
                print(f"Error processing image {image_path}: {e}")
                # Use zero embedding as fallback
                embedding = np.zeros(512)
                image_embeddings.append(embedding)
        
        return np.array(image_embeddings)
    
    def build_indices(self):
        """Build all search indices."""
        print("Building search indices...")
        
        # Load products
        df = self.load_products()
        
        # Prepare text data
        print("Preparing text data...")
        texts = self.prepare_text_data(df)
        
        # Encode text embeddings
        print("Encoding text embeddings...")
        text_embeddings = self.text_model.encode(texts, show_progress_bar=True)
        text_embeddings = normalize(text_embeddings, axis=1)
        
        # Encode image embeddings
        image_embeddings = self.load_and_encode_images(df)
        image_embeddings = normalize(image_embeddings, axis=1)
        
        # Build BM25 index
        print("Building BM25 index...")
        tokenized_docs = self.prepare_bm25_data(df)
        bm25 = BM25Okapi(tokenized_docs)
        
        # Build FAISS indices
        print("Building FAISS indices...")
        text_dim = text_embeddings.shape[1]
        img_dim = image_embeddings.shape[1]
        
        # Text index (Inner Product for cosine similarity)
        text_index = faiss.IndexFlatIP(text_dim)
        text_index.add(text_embeddings.astype('float32'))
        
        # Image index
        img_index = faiss.IndexFlatIP(img_dim)
        img_index.add(image_embeddings.astype('float32'))
        
        # Save artifacts
        print("Saving artifacts...")
        
        # Save FAISS indices
        faiss.write_index(text_index, str(self.artifacts_dir / "text.index"))
        faiss.write_index(img_index, str(self.artifacts_dir / "img.index"))
        
        # Save embeddings
        np.save(str(self.artifacts_dir / "E_text.npy"), text_embeddings)
        np.save(str(self.artifacts_dir / "E_img.npy"), image_embeddings)
        
        # Save BM25
        with open(self.artifacts_dir / "bm25.pkl", 'wb') as f:
            pickle.dump(bm25, f)
        
        # Save product catalog
        df.to_parquet(self.artifacts_dir / "catalog.parquet", index=False)
        
        # Save metadata
        metadata = {
            'num_products': len(df),
            'text_dim': text_dim,
            'img_dim': img_dim,
            'weights': {
                'text': self.W_TEXT,
                'image': self.W_IMG,
                'keyword': self.W_KW
            }
        }
        
        with open(self.artifacts_dir / "metadata.json", 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print(f"Indices built successfully!")
        print(f"Products: {len(df)}")
        print(f"Text embeddings: {text_embeddings.shape}")
        print(f"Image embeddings: {image_embeddings.shape}")
        print(f"Artifacts saved to: {self.artifacts_dir}")

def main():
    """Main function."""
    builder = SearchIndexBuilder()
    builder.build_indices()

if __name__ == "__main__":
    main()
