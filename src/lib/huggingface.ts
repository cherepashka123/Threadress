import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HF_TOKEN);

// Use a good sentence transformer model for embeddings
const MODEL_NAME = 'sentence-transformers/all-MiniLM-L6-v2';
const EMBEDDING_DIM = 384; // This model produces 384-dimensional embeddings

export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  try {
    const embeddings: number[][] = [];

    for (const text of texts) {
      if (!text || text.trim() === '') {
        // Create a zero vector for empty texts
        embeddings.push(new Array(EMBEDDING_DIM).fill(0));
        continue;
      }

      try {
        const result = await hf.featureExtraction({
          model: MODEL_NAME,
          inputs: text.trim(),
        });

        // The result is a 1D array, we need to convert it to 2D
        if (Array.isArray(result) && result.length === EMBEDDING_DIM) {
          embeddings.push(result as number[]);
        } else {
          console.warn(
            `Unexpected embedding format for text: ${text.slice(0, 100)}...`
          );
          embeddings.push(new Array(EMBEDDING_DIM).fill(0));
        }
      } catch (embedError) {
        console.warn(
          `Embedding failed for text: ${text.slice(0, 100)}...`,
          embedError
        );
        embeddings.push(new Array(EMBEDDING_DIM).fill(0));
      }
    }

    return embeddings;
  } catch (error) {
    console.error('Hugging Face embedding error:', error);
    throw error;
  }
}

export async function embedSingle(text: string): Promise<number[]> {
  const results = await embedBatch([text]);
  return results[0] || new Array(EMBEDDING_DIM).fill(0);
}

export async function testHuggingFace(): Promise<boolean> {
  try {
    const testTexts = ['test embedding', 'another test'];
    const embeddings = await embedBatch(testTexts);

    return (
      embeddings.length === testTexts.length &&
      embeddings.every((emb) => emb.length === EMBEDDING_DIM) &&
      embeddings.every((emb) => emb.some((val) => val !== 0)) // Not all zeros
    );
  } catch (error) {
    console.error('Hugging Face test failed:', error);
    return false;
  }
}

export { EMBEDDING_DIM };


