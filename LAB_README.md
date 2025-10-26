# Threadress Semantic Search Lab

A comprehensive semantic search prototype with hybrid retrieval, evaluation metrics, and explainable AI features.

## 🚀 Quick Start

### 1. Start the Backend

```bash
# Make the script executable (if not already)
chmod +x start-backend.sh

# Start the Python backend
./start-backend.sh
```

The backend will:

- Create a Python virtual environment
- Install all dependencies
- Build search indices from your product catalog
- Start the FastAPI server on http://localhost:8000

### 2. Start the Frontend

```bash
# In a new terminal
npm run dev
```

### 3. Access the Lab

- **Main Lab**: http://localhost:3000/lab
- **Original Prototype**: http://localhost:3000/threadress (unchanged)
- **Backend API**: http://localhost:8000/docs

## 🔍 Features

### Hybrid Retrieval

- **Text Embeddings**: Dense semantic search using `all-MiniLM-L6-v2`
- **Image Embeddings**: CLIP visual similarity with `clip-ViT-B-32`
- **Keyword Matching**: BM25 sparse retrieval for exact matches
- **Weighted Combination**: Adjustable weights for each component

### Advanced Features

- **Reranking**: Optional cross-encoder reranking for top results
- **Explainability**: "Why it matched" chips showing matching factors
- **Live Weight Sliders**: Real-time adjustment of search weights
- **Facet Filtering**: Client-side filtering by color, material, price, size

### Evaluation System

- **Built-in Metrics**: Hit@1, Recall@10, nDCG@10, zero-result rate
- **Test Queries**: 40 pre-built queries including typos and edge cases
- **Performance Monitoring**: Search latency and result quality metrics

### Admin Tools

- **Backend Health**: Real-time status monitoring
- **Index Rebuilding**: Rebuild search indices from scratch
- **Catalog Augmentation**: Generate synthetic products for testing
- **Debug Mode**: Detailed scoring breakdown for each result

## 🏗️ Architecture

### Backend (Python/FastAPI)

```
server/
├── serve.py              # FastAPI server
├── build_index.py        # Index building
├── requirements.txt      # Dependencies
├── data/
│   └── products.csv      # Product catalog
├── artifacts/            # Generated indices
│   ├── text.index        # FAISS text index
│   ├── img.index         # FAISS image index
│   ├── bm25.pkl          # BM25 model
│   ├── E_text.npy        # Text embeddings
│   ├── E_img.npy         # Image embeddings
│   └── catalog.parquet   # Product data
└── util/
    └── ingest_from_public.py  # Product ingestion
```

### Frontend (Next.js)

```
src/app/lab/
└── page.tsx              # Lab interface
```

## 🎯 Usage

### Search Interface

1. **Enter Query**: Type fashion-related queries like "light blue tweed blazer"
2. **Adjust Weights**: Use sliders to balance text/image/keyword importance
3. **Enable Reranking**: Toggle for improved relevance (adds ~50ms latency)
4. **Apply Filters**: Filter by color, material, price range, or size

### Admin Functions

- **Rebuild**: Rebuild all indices (useful after adding products)
- **+10 Items**: Add 10 synthetic products for testing
- **Run Eval**: Execute evaluation with built-in test queries
- **Debug**: Show detailed scoring for each result

### Example Queries

- `light blue tweed blazer`
- `long violet flowy dress`
- `black satin slip dress`
- `oversized camel coat`
- `cropped denim jacket not distressed`
- `blezer tweed` (typo test)

## 📊 Performance

### Typical Performance

- **Search Latency**: <200ms for 100-200 products
- **Reranking Overhead**: +50-100ms for top-40 candidates
- **Memory Usage**: ~500MB for models + indices
- **Index Size**: ~50MB for 100 products

### Optimization Tips

- Disable reranking for faster searches
- Reduce `k` parameter for fewer results
- Use text-only search (set image weight to 0) for speed
- Rebuild indices after major catalog changes

## 🔧 Configuration

### Environment Variables

```bash
# Frontend (optional)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend weights (in serve.py)
W_TEXT=0.5    # Text similarity weight
W_IMG=0.3     # Image similarity weight
W_KW=0.2      # Keyword match weight
```

### Search Parameters

- `k`: Number of results (default: 20)
- `w_text`: Text weight (0.0-1.0)
- `w_img`: Image weight (0.0-1.0)
- `w_kw`: Keyword weight (0.0-1.0)
- `rerank`: Enable reranking (true/false)

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**

   - Check Python 3.8+ is installed
   - Ensure virtual environment is created
   - Verify all dependencies are installed

2. **Models not loading**

   - Check internet connection (first-time downloads)
   - Verify sufficient disk space (~2GB for models)
   - Check firewall settings

3. **Images not found**

   - Ensure `public/Products_for_prototype/` exists
   - Verify image files are accessible
   - Check file permissions

4. **Slow search performance**

   - Disable reranking
   - Reduce number of results (`k`)
   - Use text-only search (set image weight to 0)

5. **Memory issues**
   - Close other applications
   - Reduce batch size in `build_index.py`
   - Use CPU-only models (already configured)

### Debug Mode

Enable debug mode in the lab interface to see:

- Individual component scores (text, image, keyword)
- Matched tokens and phrases
- Reranking deltas
- Detailed timing information

## 📈 Evaluation Metrics

### Hit@1

Percentage of queries where the top result is relevant.

### Recall@10

Percentage of relevant items found in the top 10 results.

### nDCG@10

Normalized Discounted Cumulative Gain - measures ranking quality.

### Zero Result Rate

Percentage of queries that return no results.

## 🔄 Data Flow

1. **Query Processing**

   - Text query → Text embedding (all-MiniLM-L6-v2)
   - Text query → Image embedding (CLIP text-to-image)
   - Query tokens → BM25 scoring

2. **Retrieval**

   - FAISS search on text index
   - FAISS search on image index
   - BM25 scoring for all documents

3. **Combination**

   - Weighted score: `w_text * s_text + w_img * s_img + w_kw * s_kw`
   - Optional reranking with cross-encoder
   - Final ranking and result preparation

4. **Explainability**
   - Extract matching tokens
   - Generate "why" chips
   - Calculate component scores

## 🎨 UI/UX Features

### Design Consistency

- Matches original prototype styling
- Playfair Display serif font for headings
- Consistent spacing and shadows
- Responsive grid layout

### Interactive Elements

- Real-time weight adjustment
- Debounced search (300ms)
- Smooth animations with Framer Motion
- Loading states and error handling

### Accessibility

- Keyboard navigation
- Screen reader support
- High contrast ratios
- Mobile-responsive design

## 🚀 Production Considerations

### Scalability

- Current setup handles 100-200 products efficiently
- For larger catalogs, consider:
  - GPU acceleration for embeddings
  - Distributed FAISS indices
  - Caching strategies

### Security

- CORS configured for localhost development
- No authentication (development only)
- Input validation on all endpoints

### Monitoring

- Health check endpoint
- Performance metrics
- Error logging
- Search analytics

## 📝 Development Notes

### Adding New Products

1. Add images to `public/Products_for_prototype/`
2. Run `python server/util/ingest_from_public.py`
3. Rebuild indices via admin panel or `python server/build_index.py`

### Customizing Weights

- Default weights: Text=0.5, Image=0.3, Keyword=0.2
- Adjust in `server/serve.py` or via UI sliders
- Weights should sum to 1.0 for best results

### Adding New Features

- Backend: Add endpoints in `server/serve.py`
- Frontend: Extend `src/app/lab/page.tsx`
- Styling: Follow existing design patterns

## 🎯 Next Steps

### Potential Enhancements

- User feedback collection
- A/B testing framework
- Advanced filtering options
- Export functionality
- Real-time collaboration
- Multi-language support

### Performance Optimizations

- Model quantization
- Embedding caching
- Batch processing
- CDN integration
- Database optimization

---

**Ready to explore semantic search?** Start with `./start-backend.sh` and visit http://localhost:3000/lab!
