/**
 * Mock embedding service for testing purposes
 * This generates simple hash-based embeddings with 384 dimensions to match Hugging Face
 */

const EMBEDDING_DIM = 384;

export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  const embeddings: number[][] = [];

  for (const text of texts) {
    if (!text || text.trim() === '') {
      embeddings.push(new Array(EMBEDDING_DIM).fill(0));
      continue;
    }

    // Generate a simple hash-based embedding
    const embedding = generateHashEmbedding(text);
    embeddings.push(embedding);
  }

  return embeddings;
}

export async function embedSingle(text: string): Promise<number[]> {
  const results = await embedBatch([text]);
  return results[0] || new Array(EMBEDDING_DIM).fill(0);
}

export async function testVertexAI(): Promise<boolean> {
  try {
    const testTexts = ['test embedding', 'another test'];
    const embeddings = await embedBatch(testTexts);

    return (
      embeddings.length === testTexts.length &&
      embeddings.every((emb) => emb.length === EMBEDDING_DIM) &&
      embeddings.every((emb) => emb.some((val) => val !== 0)) // Not all zeros
    );
  } catch (error) {
    console.error('Mock embedding test failed:', error);
    return false;
  }
}

function generateHashEmbedding(text: string): number[] {
  // Simple hash-based embedding generation
  const embedding = new Array(EMBEDDING_DIM).fill(0);

  // Use text hash to seed the embedding
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Generate pseudo-random values based on hash
  for (let i = 0; i < EMBEDDING_DIM; i++) {
    hash = (hash * 1664525 + 1013904223) % 2147483647;
    embedding[i] = (hash / 2147483647) * 2 - 1; // Normalize to [-1, 1]
  }

  return embedding;
}
