# Semantic Search Backend

A FastAPI-based semantic search engine with hybrid retrieval using text embeddings, image embeddings, and BM25 keyword matching.

## Features

- **Hybrid Retrieval**: Combines dense text embeddings, CLIP image embeddings, and BM25 keyword scoring
- **Multi-vector Products**: Supports multiple image vectors per product with max pooling
- **Local Reranking**: Optional cross-encoder reranking for improved relevance
- **Explainability**: "Why it matched" chips for each result
- **Evaluation**: Built-in metrics (Hit@1, Recall@10, nDCG@10, zero-result rate)
- **Catalog Augmentation**: Synthetic product generation for testing

## Quick Start

1. **Setup Environment**:

```bash
cd server
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

2. **Build Indices**:

```bash
python build_index.py
```

3. **Start Server**:

```bash
uvicorn serve:app --reload --port 8000
```

## API Endpoints

### Core Search

- `GET /health` - Health check
- `POST /search` - Semantic search with weights
- `GET /search` - GET version of search

### Admin

- `POST /rebuild` - Rebuild all indices
- `POST /augment` - Add synthetic products
- `POST /evaluate` - Run evaluation metrics
- `GET /eval/queries` - Get built-in test queries

## Search Parameters

- `query`: Search text
- `k`: Number of results (default: 20)
- `w_text`: Text weight (default: 0.5)
- `w_img`: Image weight (default: 0.3)
- `w_kw`: Keyword weight (default: 0.2)
- `rerank`: Enable reranking (default: true)

## Architecture

### Models

- **Text Embeddings**: `sentence-transformers/all-MiniLM-L6-v2`
- **Image Embeddings**: `sentence-transformers/clip-ViT-B-32`
- **Reranker**: `cross-encoder/ms-marco-MiniLM-L-6-v2` (optional)

### Indices

- **FAISS**: Inner Product indices for text and image embeddings
- **BM25**: Keyword scoring with rank-bm25
- **Artifacts**: Stored in `server/artifacts/`

### Data Flow

1. Query → Text + Image embeddings
2. FAISS search on both indices
3. BM25 keyword scoring
4. Weighted combination: `w_text * s_text + w_img * s_img + w_kw * s_kw`
5. Optional reranking with cross-encoder
6. Return results with explainability chips

## File Structure

```
server/
├── requirements.txt          # Python dependencies
├── build_index.py           # Index building script
├── serve.py                 # FastAPI server
├── data/
│   └── products.csv         # Product catalog
├── artifacts/               # Generated indices
│   ├── text.index           # FAISS text index
│   ├── img.index            # FAISS image index
│   ├── bm25.pkl             # BM25 model
│   ├── E_text.npy           # Text embeddings
│   ├── E_img.npy            # Image embeddings
│   ├── catalog.parquet      # Product catalog
│   └── metadata.json        # Index metadata
├── util/
│   └── ingest_from_public.py # Product ingestion
└── eval/
    └── queries.txt          # Test queries
```

## Performance

- **Typical latency**: < 200ms for 100-200 products
- **Reranking overhead**: +50-100ms for top-40 candidates
- **Memory usage**: ~500MB for models + indices
- **Index size**: ~50MB for 100 products

## Troubleshooting

1. **Models not loading**: Check internet connection for first-time downloads
2. **Images not found**: Ensure `public/Products_for_prototype/` exists
3. **Memory issues**: Reduce batch size in `build_index.py`
4. **Slow search**: Disable reranking or reduce `k` parameter

## Development

- **Hot reload**: Server restarts on code changes
- **Logging**: Check console for detailed error messages
- **Debug**: Set `w_img=0` to test text-only search
- **Testing**: Use `/eval/queries` endpoint for built-in test set
