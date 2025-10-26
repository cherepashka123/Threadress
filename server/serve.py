#!/usr/bin/env python3
"""
FastAPI server for semantic search.
Provides hybrid retrieval with text embeddings, image embeddings, and BM25.
"""

import os
import json
import time
import pickle
import numpy as np
import pandas as pd
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
import faiss
from sentence_transformers import SentenceTransformer, CrossEncoder
from rank_bm25 import BM25Okapi
from sklearn.preprocessing import normalize
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import warnings
warnings.filterwarnings("ignore")

# Request/Response models
class SearchRequest(BaseModel):
    query: str
    k: int = 20
    w_text: float = 0.5
    w_img: float = 0.3
    w_kw: float = 0.2
    rerank: bool = True

class SearchResult(BaseModel):
    product_id: str
    title: str
    price: int
    color: str
    material: str
    sizes: str
    image_path: str
    score: float
    score_text: float
    score_img: float
    score_kw: float
    why_chips: List[str]

class SearchResponse(BaseModel):
    results: List[SearchResult]
    total_time: float
    num_results: int

class AugmentRequest(BaseModel):
    count: int = 10
    rebuild: bool = True

class EvaluateRequest(BaseModel):
    queries: List[str]
    labels: Optional[Dict[str, List[str]]] = None

class EvaluateResponse(BaseModel):
    hit_at_1: float
    recall_at_10: float
    ndcg_at_10: float
    zero_result_rate: float
    total_queries: int

class SemanticSearchEngine:
    def __init__(self, artifacts_dir: str = "artifacts"):
        self.artifacts_dir = Path(artifacts_dir)
        self.models_loaded = False
        self.catalog = None
        self.text_index = None
        self.img_index = None
        self.bm25 = None
        self.text_embeddings = None
        self.img_embeddings = None
        self.text_model = None
        self.clip_model = None
        self.reranker = None
        self.metadata = {}
        
    def load_models(self):
        """Load all models and indices."""
        if self.models_loaded:
            return
            
        print("Loading models and indices...")
        
        try:
            # Load models
            self.text_model = SentenceTransformer('all-MiniLM-L6-v2')
            self.clip_model = SentenceTransformer('clip-ViT-B-32')
            
            # Optional reranker
            try:
                self.reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')
                print("Reranker loaded successfully")
            except Exception as e:
                print(f"Warning: Could not load reranker: {e}")
                self.reranker = None
            
            # Load indices
            self.text_index = faiss.read_index(str(self.artifacts_dir / "text.index"))
            self.img_index = faiss.read_index(str(self.artifacts_dir / "img.index"))
            
            # Load embeddings
            self.text_embeddings = np.load(str(self.artifacts_dir / "E_text.npy"))
            self.img_embeddings = np.load(str(self.artifacts_dir / "E_img.npy"))
            
            # Load BM25
            with open(self.artifacts_dir / "bm25.pkl", 'rb') as f:
                self.bm25 = pickle.load(f)
            
            # Load catalog
            self.catalog = pd.read_parquet(self.artifacts_dir / "catalog.parquet")
            
            # Load metadata
            with open(self.artifacts_dir / "metadata.json", 'r') as f:
                self.metadata = json.load(f)
            
            self.models_loaded = True
            print("All models and indices loaded successfully!")
            
        except Exception as e:
            print(f"Error loading models: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to load models: {str(e)}")
    
    def search(self, query: str, k: int = 20, w_text: float = 0.5, 
               w_img: float = 0.3, w_kw: float = 0.2, rerank: bool = True) -> SearchResponse:
        """Perform hybrid semantic search."""
        if not self.models_loaded:
            self.load_models()
        
        start_time = time.time()
        
        try:
            # Encode query
            query_text_embedding = self.text_model.encode([query])
            query_text_embedding = normalize(query_text_embedding, axis=1)[0]
            
            # CLIP text-to-image embedding
            query_img_embedding = self.clip_model.encode([query])
            query_img_embedding = normalize(query_img_embedding, axis=1)[0]
            
            # Text search
            text_scores, text_indices = self.text_index.search(
                query_text_embedding.reshape(1, -1).astype('float32'), k
            )
            text_scores = text_scores[0]
            text_indices = text_indices[0]
            
            # Image search
            img_scores, img_indices = self.img_index.search(
                query_img_embedding.reshape(1, -1).astype('float32'), k
            )
            img_scores = img_scores[0]
            img_indices = img_indices[0]
            
            # BM25 search
            bm25_scores = self.bm25.get_scores(query.lower().split())
            bm25_scores = np.array(bm25_scores)
            # Normalize BM25 scores to 0-1
            if bm25_scores.max() > 0:
                bm25_scores = bm25_scores / bm25_scores.max()
            
            # Combine results
            all_indices = set(text_indices) | set(img_indices)
            if len(all_indices) < k:
                # Add more indices if needed
                remaining = set(range(len(self.catalog))) - all_indices
                all_indices.update(list(remaining)[:k-len(all_indices)])
            
            # Calculate combined scores
            results = []
            for idx in all_indices:
                if idx >= len(self.catalog):
                    continue
                    
                # Get individual scores
                text_score = 0.0
                if idx in text_indices:
                    text_pos = np.where(text_indices == idx)[0]
                    if len(text_pos) > 0:
                        text_score = float(text_scores[text_pos[0]])
                
                img_score = 0.0
                if idx in img_indices:
                    img_pos = np.where(img_indices == idx)[0]
                    if len(img_pos) > 0:
                        img_score = float(img_scores[img_pos[0]])
                
                kw_score = float(bm25_scores[idx])
                
                # Combined score
                combined_score = (w_text * text_score + 
                                w_img * img_score + 
                                w_kw * kw_score)
                
                results.append({
                    'idx': idx,
                    'score': combined_score,
                    'text_score': text_score,
                    'img_score': img_score,
                    'kw_score': kw_score
                })
            
            # Sort by combined score
            results.sort(key=lambda x: x['score'], reverse=True)
            
            # Reranking (optional)
            if rerank and self.reranker and len(results) > 0:
                try:
                    # Take top candidates for reranking
                    top_k = min(40, len(results))
                    rerank_candidates = results[:top_k]
                    
                    # Prepare pairs for reranking
                    pairs = []
                    for result in rerank_candidates:
                        idx = result['idx']
                        row = self.catalog.iloc[idx]
                        text = f"{row['title']} {row['description']}"
                        pairs.append([query, text])
                    
                    # Rerank
                    rerank_scores = self.reranker.predict(pairs)
                    rerank_scores = (rerank_scores - rerank_scores.min()) / (rerank_scores.max() - rerank_scores.min() + 1e-8)
                    
                    # Blend scores
                    for i, result in enumerate(rerank_candidates):
                        result['score'] = 0.8 * result['score'] + 0.2 * rerank_scores[i]
                    
                    # Re-sort
                    results = rerank_candidates + results[top_k:]
                    results.sort(key=lambda x: x['score'], reverse=True)
                    
                except Exception as e:
                    print(f"Reranking failed: {e}")
                    # Continue without reranking
            
            # Prepare final results
            search_results = []
            for result in results[:k]:
                idx = result['idx']
                row = self.catalog.iloc[idx]
                
                # Generate "why" chips
                why_chips = self._generate_why_chips(query, row, result)
                
                # Handle image path - prefer image_path, fallback to first image from image_paths
                image_path = ''
                if pd.notna(row['image_path']) and str(row['image_path']).strip():
                    image_path = str(row['image_path']).strip()
                elif pd.notna(row.get('image_paths', '')) and str(row.get('image_paths', '')).strip():
                    # Get first image from image_paths
                    image_paths = str(row.get('image_paths', '')).strip()
                    if image_paths:
                        first_image = image_paths.split('|')[0].strip()
                        if first_image:
                            image_path = first_image
                
                search_result = SearchResult(
                    product_id=str(row['product_id']),
                    title=str(row['title']),
                    price=int(row['price']) if pd.notna(row['price']) else 0,
                    color=str(row['color']) if pd.notna(row['color']) else 'mixed',
                    material=str(row['material']) if pd.notna(row['material']) else 'mixed',
                    sizes=str(row['sizes']) if pd.notna(row['sizes']) else 'One Size',
                    image_path=image_path,
                    score=result['score'],
                    score_text=result['text_score'],
                    score_img=result['img_score'],
                    score_kw=result['kw_score'],
                    why_chips=why_chips
                )
                search_results.append(search_result)
            
            total_time = time.time() - start_time
            
            return SearchResponse(
                results=search_results,
                total_time=total_time,
                num_results=len(search_results)
            )
            
        except Exception as e:
            print(f"Search error: {e}")
            raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
    
    def _generate_why_chips(self, query: str, row: pd.Series, result: Dict) -> List[str]:
        """Generate explanation chips for why a result matched."""
        chips = []
        query_lower = query.lower()
        
        # Check title matches
        title_lower = str(row['title']).lower()
        for word in query_lower.split():
            if word in title_lower and len(word) > 2:
                chips.append(f"Title: {word}")
        
        # Check color matches
        color_lower = str(row['color']).lower()
        for word in query_lower.split():
            if word in color_lower and len(word) > 2:
                chips.append(f"Color: {word}")
        
        # Check material matches
        material_lower = str(row['material']).lower()
        for word in query_lower.split():
            if word in material_lower and len(word) > 2:
                chips.append(f"Material: {word}")
        
        # Add score-based chips
        if result['text_score'] > 0.7:
            chips.append("Text similarity")
        if result['img_score'] > 0.7:
            chips.append("Visual similarity")
        if result['kw_score'] > 0.5:
            chips.append("Keyword match")
        
        # Limit to top 4 chips
        return chips[:4]
    
    def augment_catalog(self, count: int) -> Dict[str, Any]:
        """Augment the catalog with synthetic products."""
        if not self.models_loaded:
            self.load_models()
        
        # Load the ingestion script
        import sys
        sys.path.append(str(Path(__file__).parent))
        from util.ingest_from_public import augment_products
        
        # Convert catalog to list of dicts
        products = self.catalog.to_dict('records')
        
        # Generate augmented products
        augmented = augment_products(products, count)
        
        # Append to catalog
        new_df = pd.DataFrame(augmented)
        self.catalog = pd.concat([self.catalog, new_df], ignore_index=True)
        
        # Save updated catalog
        self.catalog.to_parquet(self.artifacts_dir / "catalog.parquet", index=False)
        
        return {
            "message": f"Added {count} synthetic products",
            "total_products": len(self.catalog)
        }
    
    def evaluate(self, queries: List[str], labels: Optional[Dict[str, List[str]]] = None) -> EvaluateResponse:
        """Evaluate search performance."""
        if not self.models_loaded:
            self.load_models()
        
        total_queries = len(queries)
        hit_at_1 = 0
        recall_at_10 = 0
        ndcg_at_10 = 0
        zero_results = 0
        
        for query in queries:
            try:
                results = self.search(query, k=10)
                
                if len(results.results) == 0:
                    zero_results += 1
                    continue
                
                # If no labels provided, use heuristic evaluation
                if labels is None or query not in labels:
                    # Simple heuristic: if top result has high score, consider it a hit
                    if results.results[0].score > 0.3:
                        hit_at_1 += 1
                    if any(r.score > 0.2 for r in results.results[:10]):
                        recall_at_10 += 1
                    # Simple NDCG approximation
                    ndcg_at_10 += min(1.0, results.results[0].score)
                else:
                    # Use provided labels for evaluation
                    relevant_ids = set(labels[query])
                    result_ids = [r.product_id for r in results.results]
                    
                    # Hit@1
                    if result_ids[0] in relevant_ids:
                        hit_at_1 += 1
                    
                    # Recall@10
                    relevant_found = len(set(result_ids[:10]) & relevant_ids)
                    recall_at_10 += relevant_found / len(relevant_ids) if relevant_ids else 0
                    
                    # NDCG@10 (simplified)
                    dcg = 0
                    for i, result_id in enumerate(result_ids[:10]):
                        if result_id in relevant_ids:
                            dcg += 1 / np.log2(i + 2)
                    idcg = sum(1 / np.log2(i + 2) for i in range(min(len(relevant_ids), 10)))
                    ndcg_at_10 += dcg / idcg if idcg > 0 else 0
                    
            except Exception as e:
                print(f"Error evaluating query '{query}': {e}")
                zero_results += 1
        
        return EvaluateResponse(
            hit_at_1=hit_at_1 / total_queries,
            recall_at_10=recall_at_10 / total_queries,
            ndcg_at_10=ndcg_at_10 / total_queries,
            zero_result_rate=zero_results / total_queries,
            total_queries=total_queries
        )

# Initialize FastAPI app
app = FastAPI(title="Semantic Search API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize search engine
search_engine = SemanticSearchEngine()

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "models_loaded": search_engine.models_loaded}

@app.post("/rebuild")
async def rebuild_indices():
    """Rebuild all indices."""
    try:
        import subprocess
        import sys
        result = subprocess.run([sys.executable, "server/build_index.py"], 
                              capture_output=True, text=True)
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=f"Build failed: {result.stderr}")
        
        # Reload models
        search_engine.models_loaded = False
        search_engine.load_models()
        
        return {"message": "Indices rebuilt successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/search")
async def search(request: SearchRequest):
    """Perform semantic search."""
    return search_engine.search(
        query=request.query,
        k=request.k,
        w_text=request.w_text,
        w_img=request.w_img,
        w_kw=request.w_kw,
        rerank=request.rerank
    )

@app.get("/search")
async def search_get(
    q: str = Query(..., description="Search query"),
    k: int = Query(20, description="Number of results"),
    w_text: float = Query(0.5, description="Text weight"),
    w_img: float = Query(0.3, description="Image weight"),
    w_kw: float = Query(0.2, description="Keyword weight"),
    rerank: bool = Query(True, description="Enable reranking")
):
    """GET endpoint for search."""
    return search_engine.search(
        query=q,
        k=k,
        w_text=w_text,
        w_img=w_img,
        w_kw=w_kw,
        rerank=rerank
    )

@app.post("/augment")
async def augment_catalog(request: AugmentRequest):
    """Augment catalog with synthetic products."""
    result = search_engine.augment_catalog(request.count)
    
    if request.rebuild:
        # Rebuild indices
        await rebuild_indices()
        result["message"] += " and indices rebuilt"
    
    return result

@app.post("/evaluate")
async def evaluate(request: EvaluateRequest):
    """Evaluate search performance."""
    return search_engine.evaluate(request.queries, request.labels)

@app.get("/eval/queries")
async def get_eval_queries():
    """Get built-in evaluation queries."""
    queries_file = Path("server/eval/queries.txt")
    if queries_file.exists():
        with open(queries_file, 'r') as f:
            queries = [line.strip() for line in f if line.strip()]
        return {"queries": queries}
    else:
        return {"queries": []}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
