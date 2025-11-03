import { InventoryProduct } from './qdrant-client';

// This service handles text embeddings for vector search
// It can integrate with your existing Python embedding service or use a local model

const EMBEDDING_SERVICE_URL =
  process.env.EMBEDDING_SERVICE_URL || 'http://localhost:8000';

export interface EmbeddingRequest {
  texts: string[];
}

export interface EmbeddingResponse {
  embeddings: number[][];
}

// Generate embeddings using your existing Python service
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  try {
    // Try to use your existing Python embedding service first
    const response = await fetch(`${EMBEDDING_SERVICE_URL}/embed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ texts }),
    });

    if (response.ok) {
      const data: EmbeddingResponse = await response.json();
      return data.embeddings;
    }
  } catch (error) {
    console.warn(
      'Failed to use Python embedding service, falling back to local generation:',
      error
    );
  }

  // Fallback to local embedding generation
  return generateLocalEmbeddings(texts);
}

// Generate a single embedding for a query
export async function generateQueryEmbedding(query: string): Promise<number[]> {
  const embeddings = await generateEmbeddings([query]);
  return embeddings[0];
}

// Generate embedding for a product
export async function generateProductEmbedding(
  product: InventoryProduct
): Promise<number[]> {
  const text = createProductText(product);
  return generateQueryEmbedding(text);
}

// Create searchable text from product data
export function createProductText(product: InventoryProduct): string {
  const parts = [
    product.title,
    product.description || '',
    product.category || '',
    product.color || '',
    product.material || '',
    product.brand || '',
    product.size || '',
  ].filter(Boolean);

  return parts.join(' ').toLowerCase();
}

// Local embedding generation (fallback)
function generateLocalEmbeddings(texts: string[]): number[][] {
  return texts.map((text) => generateLocalEmbedding(text));
}

// Simple local embedding generation using hash-based approach
// This is a placeholder - in production you'd want to use a proper embedding model
function generateLocalEmbedding(text: string): number[] {
  const words = text.toLowerCase().split(/\s+/);
  const vector = new Array(384).fill(0);

  // Create a simple hash-based embedding
  let hash = 0;
  for (const word of words) {
    for (let i = 0; i < word.length; i++) {
      hash = ((hash << 5) - hash + word.charCodeAt(i)) & 0xffffffff;
    }
  }

  // Generate vector based on hash
  for (let i = 0; i < 384; i++) {
    const seed = hash + i;
    vector[i] = Math.sin(seed) * Math.cos(seed * 1.1) * 0.1;
  }

  // Normalize the vector
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map((val) => val / magnitude);
}

// Batch generate embeddings for multiple products
export async function batchGenerateProductEmbeddings(
  products: InventoryProduct[]
): Promise<Array<{ product: InventoryProduct; vector: number[] }>> {
  const texts = products.map(createProductText);
  const embeddings = await generateEmbeddings(texts);

  return products.map((product, index) => ({
    product,
    vector: embeddings[index],
  }));
}

// Test the embedding service
export async function testEmbeddingService(): Promise<boolean> {
  try {
    const testTexts = ['summer dress', 'business casual', 'evening wear'];
    const embeddings = await generateEmbeddings(testTexts);

    return (
      embeddings.length === testTexts.length &&
      embeddings.every((emb) => emb.length === 384)
    );
  } catch (error) {
    console.error('Embedding service test failed:', error);
    return false;
  }
}


