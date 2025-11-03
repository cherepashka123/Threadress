import { VertexAI } from '@google-cloud/vertexai';

const project = process.env.GOOGLE_CLOUD_PROJECT!;
const location = process.env.VERTEX_LOCATION || 'us-central1';

if (!project) {
  throw new Error('GOOGLE_CLOUD_PROJECT environment variable is required');
}

const vertex = new VertexAI({ project, location });

// Try text-embedding-004 first, fallback to textembedding-gecko@001 if not available
let model = vertex.getGenerativeModel({ model: 'text-embedding-004' });

export async function embedBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  try {
    // API accepts single text at a time; batch by looping to keep it simple and robust
    const out: number[][] = [];

    for (const text of texts) {
      if (!text || text.trim() === '') {
        // Create a zero vector for empty texts
        out.push(new Array(768).fill(0));
        continue;
      }

      try {
        const res = await model.embedContent({
          content: {
            parts: [{ text: text.trim() }],
          },
        });

        const vec = res?.embeddings?.[0]?.values ?? res?.embedding?.values;
        if (!vec || !Array.isArray(vec)) {
          console.warn(
            `No embedding returned for text: ${text.slice(0, 100)}...`
          );
          out.push(new Array(768).fill(0));
          continue;
        }

        out.push(vec as unknown as number[]);
      } catch (embedError) {
        console.warn(
          `Embedding failed for text: ${text.slice(0, 100)}...`,
          embedError
        );
        out.push(new Array(768).fill(0));
      }
    }

    return out;
  } catch (error) {
    console.error('Vertex AI embedding error:', error);

    // Fallback to textembedding-gecko@001 if text-embedding-004 fails
    if (
      error instanceof Error &&
      error.message.includes('text-embedding-004')
    ) {
      console.log('Falling back to textembedding-gecko@001 model');
      try {
        model = vertex.getGenerativeModel({ model: 'textembedding-gecko@001' });
        return await embedBatch(texts);
      } catch (fallbackError) {
        console.error('Fallback model also failed:', fallbackError);
        throw new Error('Both embedding models failed');
      }
    }

    throw error;
  }
}

export async function embedSingle(text: string): Promise<number[]> {
  const results = await embedBatch([text]);
  return results[0] || new Array(768).fill(0);
}

// Test function to verify Vertex AI connection
export async function testVertexAI(): Promise<boolean> {
  try {
    const testTexts = ['test embedding', 'another test'];
    const embeddings = await embedBatch(testTexts);

    return (
      embeddings.length === testTexts.length &&
      embeddings.every((emb) => emb.length === 768)
    );
  } catch (error) {
    console.error('Vertex AI test failed:', error);
    return false;
  }
}


