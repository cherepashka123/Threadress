#!/usr/bin/env python3
"""
Integrate FlyingSolo scraped data with the semantic search system.
"""

import os
import sys
import pandas as pd
import numpy as np
from pathlib import Path
from sentence_transformers import SentenceTransformer
from PIL import Image
import faiss
import pickle
from rank_bm25 import BM25Okapi
from sklearn.preprocessing import normalize
import warnings
warnings.filterwarnings("ignore")

def integrate_flyingsolo_data():
    """Integrate FlyingSolo data with existing semantic search indices"""
    
    # Paths
    project_root = Path(__file__).parent
    flyingsolo_csv = project_root / "public/data/flyingsolo/products.csv"
    server_artifacts = project_root / "server/artifacts"
    server_data = project_root / "server/data"
    
    # Check if FlyingSolo data exists
    if not flyingsolo_csv.exists():
        print("FlyingSolo data not found. Please run scrape_flyingsolo.py first.")
        return False
    
    print("Loading FlyingSolo data...")
    flyingsolo_df = pd.read_csv(flyingsolo_csv)
    print(f"Found {len(flyingsolo_df)} FlyingSolo products")
    
    # Load existing data
    existing_csv = server_data / "products.csv"
    if existing_csv.exists():
        existing_df = pd.read_csv(existing_csv)
        print(f"Found {len(existing_df)} existing products")
        
        # Ensure FlyingSolo data has required columns
        if 'color' not in flyingsolo_df.columns:
            flyingsolo_df['color'] = 'mixed'
        if 'material' not in flyingsolo_df.columns:
            flyingsolo_df['material'] = 'mixed'
        if 'image_path' not in flyingsolo_df.columns:
            # Use first image from image_paths if available
            flyingsolo_df['image_path'] = flyingsolo_df.get('image_paths', '').str.split('|').str[0]
            flyingsolo_df['image_path'] = flyingsolo_df['image_path'].fillna('')
        
        # Combine datasets
        combined_df = pd.concat([existing_df, flyingsolo_df], ignore_index=True)
        print(f"Combined dataset: {len(combined_df)} products")
    else:
        # Ensure FlyingSolo data has required columns
        if 'color' not in flyingsolo_df.columns:
            flyingsolo_df['color'] = 'mixed'
        if 'material' not in flyingsolo_df.columns:
            flyingsolo_df['material'] = 'mixed'
        if 'image_path' not in flyingsolo_df.columns:
            # Use first image from image_paths if available
            flyingsolo_df['image_path'] = flyingsolo_df.get('image_paths', '').str.split('|').str[0]
            flyingsolo_df['image_path'] = flyingsolo_df['image_path'].fillna('')
        
        combined_df = flyingsolo_df
        print("No existing data found, using FlyingSolo data only")
    
    # Remove duplicates before saving
    print(f"Before deduplication: {len(combined_df)} products")
    combined_df = combined_df.drop_duplicates(subset=['product_id'], keep='first')
    print(f"After deduplication: {len(combined_df)} products")
    
    # Save combined dataset
    combined_df.to_csv(existing_csv, index=False)
    print(f"Saved combined dataset to {existing_csv}")
    
    # Load models
    print("Loading models...")
    text_model = SentenceTransformer('all-MiniLM-L6-v2')
    clip_model = SentenceTransformer('clip-ViT-B-32')
    
    # Prepare text data
    print("Preparing text data...")
    texts = []
    for _, row in combined_df.iterrows():
        text_parts = []
        if pd.notna(row['title']):
            text_parts.append(str(row['title']))
        if pd.notna(row['description']):
            text_parts.append(str(row['description']))
        if pd.notna(row['tags']):
            text_parts.append(str(row['tags']))
        
        combined_text = ' '.join(text_parts)
        texts.append(combined_text)
    
    # Encode text embeddings
    print("Encoding text embeddings...")
    text_embeddings = text_model.encode(texts, show_progress_bar=True)
    text_embeddings = normalize(text_embeddings, axis=1)
    
    # Encode image embeddings
    print("Encoding image embeddings...")
    image_embeddings = []
    for idx, row in combined_df.iterrows():
        # Try to find an image for this product
        image_path = None
        
        # Check if image_paths column exists and has data
        if 'image_paths' in row and pd.notna(row['image_paths']):
            image_paths = str(row['image_paths']).split('|')
            for img_path in image_paths:
                if img_path.strip():
                    full_path = project_root / "public" / img_path.strip().lstrip('/')
                    if full_path.exists():
                        image_path = full_path
                        break
        
        # Fallback to existing image path
        if not image_path and 'image_path' in row and pd.notna(row['image_path']):
            full_path = project_root / "public" / str(row['image_path']).lstrip('/')
            if full_path.exists():
                image_path = full_path
        
        try:
            if image_path and image_path.exists():
                image = Image.open(image_path).convert('RGB')
                image = image.resize((224, 224))
                embedding = clip_model.encode([image])
                image_embeddings.append(embedding[0])
            else:
                # Use zero embedding as fallback
                embedding = np.zeros(512)  # CLIP ViT-B-32 has 512 dims
                image_embeddings.append(embedding)
        except Exception as e:
            print(f"Error processing image for product {idx}: {e}")
            # Use zero embedding as fallback
            embedding = np.zeros(512)
            image_embeddings.append(embedding)
    
    image_embeddings = np.array(image_embeddings)
    image_embeddings = normalize(image_embeddings, axis=1)
    
    # Build BM25 index
    print("Building BM25 index...")
    tokenized_docs = []
    for _, row in combined_df.iterrows():
        text_parts = []
        for field in ['title', 'description', 'tags', 'store']:
            if pd.notna(row[field]):
                text_parts.append(str(row[field]))
        
        combined_text = ' '.join(text_parts).lower()
        tokens = combined_text.replace(',', ' ').replace('.', ' ').split()
        tokenized_docs.append(tokens)
    
    bm25 = BM25Okapi(tokenized_docs)
    
    # Build FAISS indices
    print("Building FAISS indices...")
    text_dim = text_embeddings.shape[1]
    img_dim = image_embeddings.shape[1]
    
    # Text index
    text_index = faiss.IndexFlatIP(text_dim)
    text_index.add(text_embeddings.astype('float32'))
    
    # Image index
    img_index = faiss.IndexFlatIP(img_dim)
    img_index.add(image_embeddings.astype('float32'))
    
    # Save artifacts
    print("Saving artifacts...")
    server_artifacts.mkdir(parents=True, exist_ok=True)
    
    # Save FAISS indices
    faiss.write_index(text_index, str(server_artifacts / "text.index"))
    faiss.write_index(img_index, str(server_artifacts / "img.index"))
    
    # Save embeddings
    np.save(str(server_artifacts / "E_text.npy"), text_embeddings)
    np.save(str(server_artifacts / "E_img.npy"), image_embeddings)
    
    # Save BM25
    with open(server_artifacts / "bm25.pkl", 'wb') as f:
        pickle.dump(bm25, f)
    
    # Save product catalog
    combined_df.to_parquet(server_artifacts / "catalog.parquet", index=False)
    
    # Save metadata
    import json
    metadata = {
        'num_products': len(combined_df),
        'text_dim': text_dim,
        'img_dim': img_dim,
        'weights': {
            'text': 0.5,
            'image': 0.3,
            'keyword': 0.2
        },
        'data_sources': ['original', 'flyingsolo'],
        'flyingsolo_products': len(flyingsolo_df)
    }
    
    with open(server_artifacts / "metadata.json", 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"Integration completed!")
    print(f"Total products: {len(combined_df)}")
    print(f"FlyingSolo products: {len(flyingsolo_df)}")
    print(f"Text embeddings: {text_embeddings.shape}")
    print(f"Image embeddings: {image_embeddings.shape}")
    print(f"Artifacts saved to: {server_artifacts}")
    
    return True

if __name__ == "__main__":
    success = integrate_flyingsolo_data()
    if success:
        print("\n✅ Integration successful!")
        print("You can now restart the backend server to see FlyingSolo products in the lab.")
    else:
        print("\n❌ Integration failed!")
        sys.exit(1)
