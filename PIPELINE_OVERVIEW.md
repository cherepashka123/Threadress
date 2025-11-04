# Threadress Pipeline Overview

## Complete Data Flow Architecture

This document explains the end-to-end pipeline from inventory data ingestion to search results.

---

## 🗂️ **Data Sources**

### 1. **Google Sheets** (Primary Inventory Source)

- **Location**: Google Sheets with multiple sheets (e.g., `manieredevoir`, `rouje`, `withjean`)
- **Columns**:
  - `Product_Name`, `Style_Name`
  - `Main_Image_URL`, `Hover_Image_URL`
  - `Price`, `Product_URL`
  - `Source` (brand name: Maniere de Voir, Rouje, With Jean)
  - `Available_Sizes`, `Sold_Out_Sizes`
- **Format**: Spreadsheet with headers and product rows

---

## 📥 **Data Ingestion Pipeline**

### **Step 1: Read from Google Sheets**

- **API**: `/api/inventory-sync` (POST/GET)
- **File**: `src/app/api/inventory-sync/route.ts`
- **Process**:
  1. Authenticate with Google Sheets API using service account
  2. Read data from specified sheets (auto-detects all sheets if not specified)
  3. Parse rows and validate using `isValidInventoryRow()`
  4. Extract fields using `extractInventoryFields()`
  5. Build searchable text using `buildInventoryText()`

### **Step 2: Generate Embeddings**

- **Library**: `src/lib/clip-advanced.ts`
- **Process**:
  1. **Text Embeddings**:
     - Use Hugging Face Inference API (`sentence-transformers/all-MiniLM-L6-v2` or configurable)
     - Or local CLIP service if `CLIP_SERVICE_URL` is set
     - Generates 384-dim or 512-dim vectors
  2. **Image Embeddings**:
     - Fetch image from `Main_Image_URL` or `Hover_Image_URL`
     - Use OpenAI CLIP via local service (`server/clip_service.py`) or Hugging Face
     - Generates 512-dim vectors
  3. **Combine Vectors**:
     - Weighted combination: `textWeight: 0.7`, `imageWeight: 0.3`
     - Creates a combined vector for semantic search

### **Step 3: Store in Qdrant Vector Database**

- **Library**: `src/lib/qdrant.ts`
- **Collection**: `inventory_items`
- **Process**:
  1. Ensure collection exists with proper configuration
  2. Batch upsert items (48 items per batch to avoid rate limits)
  3. Store:
     - **Vector**: Combined embedding (text + image)
     - **Payload**: All product metadata (title, brand, price, URLs, etc.)
     - **ID**: Generated from product URL/image URL for stability

### **Step 4: Automatic Sync**

- **Webhook**: `/api/inventory-sync-webhook`
- **Trigger**: Google Apps Script (`google-apps-script-sync.js`)
- **Setup**: When Google Sheet is edited, automatically calls webhook to sync
- **Documentation**: `AUTOMATIC_SYNC_SETUP.md`

---

## 🔍 **Search Pipeline**

### **Step 1: Query Processing**

- **API**: `/api/inventory-search` (GET)
- **File**: `src/app/api/inventory-search/route.ts`
- **Input**:
  - `q`: Text query (e.g., "elegant black dress")
  - `imageUrl`: Optional image URL for visual search
  - `k`: Number of results (default: 20)

### **Step 2: Generate Query Embedding**

- **Library**: `src/lib/clip-advanced.ts`
- **Process**:
  1. **Text Query**:
     - Uses `embedAdvancedMultimodalQuery()` which:
       - Generates text embedding
       - Analyzes "vibe" (elegant, casual, party, etc.)
       - Extracts style context (color, material, occasion)
       - Enhances query with contextual understanding
  2. **Image Query** (if provided):
     - Generates image embedding
     - Analyzes visual style
  3. **Combined**:
     - Combines text + image + vibe vectors
     - Creates a unified query vector

### **Step 3: Vector Search in Qdrant**

- **Process**:
  1. Search Qdrant collection using combined query vector
  2. Initial threshold: `score > 0.05` (low to get many candidates)
  3. Returns top K results with similarity scores

### **Step 4: Ultra-Advanced Enhancement**

- **Library**: `src/lib/ultra-advanced-search.ts`
- **Function**: `ultraAdvancedSearch()`
- **Enhancements Applied**:
  1. **Keyword Matching** (25% weight):
     - Word-by-word matching across all product fields
     - Special handling for category words (shirt, dress, etc.)
     - Exact word matches get strong boost
     - Category mismatches get penalties
  2. **Attribute Matching** (20% weight):
     - Matches color, material, style, occasion, season
     - Extracts attributes from query and style context
     - Checks multiple product fields
  3. **Price Relevance** (10% weight):
     - Considers price range in query
     - Adjusts scores based on price similarity
  4. **Season Relevance** (10% weight):
     - Matches seasonal items (summer, winter, etc.)
  5. **Brand Affinity** (10% weight):
     - Boosts results from preferred brands
  6. **Popularity** (5% weight):
     - Considers item popularity/visibility

### **Step 5: Result Formatting**

- **Process**:
  1. Normalize brand names (Maniere de Voir, Rouje, With Jean)
  2. Extract and validate image URLs (multiple fallbacks)
  3. Include store information
  4. Sort by enhanced score
  5. Return formatted results

---

## 🎨 **Frontend Display**

### **Search Interface**

- **Page**: `/multimodal-test` (`src/app/multimodal-test/page.tsx`)
- **Features**:
  - Text search input
  - Image upload (optional)
  - Real-time search results
  - Product cards with:
    - Product image (with fallback logic)
    - Title, brand, price
    - Store name
    - Enhanced score breakdown (optional)

### **Image Loading**

- **Component**: `ProductImage`
- **Fallback Logic**:
  1. Try `Main_Image_URL` first
  2. Fallback to `Hover_Image_URL`
  3. Try other image URL fields
  4. If no image found, fetch from product URL via `/api/fetch-product-image`
  5. Display placeholder if all fail

---

## 🔧 **Key Technologies**

### **Vector Database**

- **Qdrant**: Cloud-hosted vector database
- **Collection**: `inventory_items`
- **Vector Dimensions**:
  - Combined: 512-dim (or 896-dim depending on model)
  - Text: 384-dim (or 512-dim)
  - Image: 512-dim

### **Embedding Services**

1. **Hugging Face Inference API**:
   - Text: `sentence-transformers/all-MiniLM-L6-v2` (or configurable)
   - Image: `sentence-transformers/clip-ViT-B-32` (may not work reliably)
2. **Local CLIP Service** (Python):
   - File: `server/clip_service.py`
   - Uses OpenAI CLIP library directly
   - More reliable for image embeddings
   - Started via `start-clip-service.sh`

### **Data Processing**

- **Text Processing**: `src/lib/text.ts`
  - `buildInventoryText()`: Creates searchable text from product data
  - `extractInventoryFields()`: Extracts and normalizes product fields
  - `normalizeBrandName()`: Standardizes brand names
  - `validateImageUrl()`: Filters invalid URLs

---

## 📊 **Data Flow Diagram**

```
Google Sheets
    │
    ├─> Read via Google Sheets API
    │
    ├─> Extract & Validate Fields
    │   └─> extractInventoryFields()
    │
    ├─> Build Searchable Text
    │   └─> buildInventoryText()
    │
    ├─> Generate Embeddings
    │   ├─> Text Embedding (HF API or CLIP service)
    │   ├─> Image Embedding (CLIP service or HF API)
    │   └─> Combine Vectors
    │
    └─> Store in Qdrant
        ├─> Vector (combined embedding)
        ├─> Payload (all product metadata)
        └─> ID (stable identifier)
```

```
User Query (Text + Optional Image)
    │
    ├─> Generate Query Embedding
    │   ├─> Text Embedding
    │   ├─> Image Embedding (if provided)
    │   ├─> Vibe Analysis
    │   └─> Combine Vectors
    │
    ├─> Vector Search in Qdrant
    │   └─> Initial candidates (score > 0.05)
    │
    ├─> Ultra-Advanced Enhancement
    │   ├─> Keyword Matching (25%)
    │   ├─> Attribute Matching (20%)
    │   ├─> Price Relevance (10%)
    │   ├─> Season Relevance (10%)
    │   ├─> Brand Affinity (10%)
    │   └─> Popularity (5%)
    │
    └─> Format & Return Results
        ├─> Normalize brands
        ├─> Validate image URLs
        └─> Sort by enhanced score
```

---

## 🔄 **Sync Workflow**

### **Manual Sync**

```bash
# Via API
curl -X POST http://localhost:3000/api/inventory-sync

# Or via script
npx tsx scripts/sync-manieredevoir.ts
```

### **Automatic Sync**

1. Google Sheet is edited
2. Google Apps Script trigger fires
3. Calls `/api/inventory-sync-webhook`
4. Webhook calls `/api/inventory-sync` POST
5. Data is synced to Qdrant

---

## 📁 **Key Files**

### **Data Ingestion**

- `src/app/api/inventory-sync/route.ts` - Main sync endpoint
- `src/lib/text.ts` - Text processing utilities
- `src/lib/clip-advanced.ts` - Embedding generation
- `src/lib/qdrant.ts` - Qdrant client configuration

### **Search**

- `src/app/api/inventory-search/route.ts` - Search endpoint
- `src/lib/ultra-advanced-search.ts` - Result enhancement
- `src/lib/clip-advanced.ts` - Query embedding

### **Frontend**

- `src/app/multimodal-test/page.tsx` - Search interface
- `src/app/api/fetch-product-image/route.ts` - Image fetching fallback

### **Services**

- `server/clip_service.py` - Local CLIP service
- `server/clip_api.py` - CLIP API wrapper
- `start-clip-service.sh` - Service startup script

---

## 🎯 **Current Status**

- ✅ **Data Sources**: Google Sheets with multiple brands
- ✅ **Embeddings**: Text + Image using CLIP Advanced
- ✅ **Vector DB**: Qdrant cloud-hosted
- ✅ **Search**: Ultra-advanced with keyword matching
- ✅ **Auto-sync**: Google Apps Script webhook
- ✅ **Image Loading**: Multi-fallback system
- ✅ **Brand Normalization**: Maniere de Voir, Rouje, With Jean

---

## 🚀 **Performance**

- **Batch Size**: 48 items per batch (to avoid rate limits)
- **Search Speed**: < 200ms (vector search + enhancement)
- **Sync Speed**: ~1-2 items/second (depends on embedding generation)
- **Image Fallback**: Automatic fetching from product URLs

---

## 📝 **Environment Variables**

Required for full pipeline:

- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`
- `QDRANT_URL`
- `QDRANT_API_KEY`
- `HF_TOKEN` (Hugging Face token)
- `CLIP_SERVICE_URL` (optional, for local CLIP service)
- `TEXT_EMBEDDING_MODEL` (optional, defaults to all-MiniLM-L6-v2)

See `ENV_SETUP.md` for detailed setup instructions.
