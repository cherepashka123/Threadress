import { HfInference } from '@huggingface/inference';

const HF_TOKEN = process.env.HF_TOKEN;
const TEXT_MODEL = 'sentence-transformers/all-MiniLM-L6-v2'; // 384 dimensions

if (!HF_TOKEN) {
  console.warn(
    'HF_TOKEN environment variable is not set. Multimodal embeddings will not work.'
  );
}

const hf = new HfInference(HF_TOKEN);

/**
 * Generate text embeddings using sentence-transformers
 */
export async function embedTextBatch(texts: string[]): Promise<number[][]> {
  if (!HF_TOKEN) {
    console.error('HF_TOKEN is not set. Cannot generate text embeddings.');
    return texts.map(() => new Array(384).fill(0));
  }
  if (texts.length === 0) return [];

  try {
    const response = await hf.featureExtraction({
      model: TEXT_MODEL,
      inputs: texts,
    });

    if (!Array.isArray(response) || response.some((r) => !Array.isArray(r))) {
      throw new Error('Invalid response format from Hugging Face API');
    }

    return response as number[][];
  } catch (error) {
    console.error('Text embedding error:', error);
    return texts.map(() => new Array(384).fill(0));
  }
}

export async function embedTextSingle(text: string): Promise<number[]> {
  const results = await embedTextBatch([text]);
  return results[0] || new Array(384).fill(0);
}

/**
 * Generate image embeddings by converting image URLs to text descriptions
 * This is a simplified approach for demonstration purposes
 */
export async function embedImageBatch(
  imageUrls: string[]
): Promise<number[][]> {
  if (!HF_TOKEN) {
    console.error('HF_TOKEN is not set. Cannot generate image embeddings.');
    return imageUrls.map(() => new Array(384).fill(0));
  }
  if (imageUrls.length === 0) return [];

  try {
    // Convert image URLs to text descriptions for now
    // In a real implementation, you would use CLIP or similar
    const imageDescriptions = imageUrls.map((url) => {
      // Extract basic info from URL or use a placeholder
      if (url.includes('cardigan')) return 'cardigan knit sweater clothing';
      if (url.includes('dress')) return 'dress clothing fashion';
      if (url.includes('shirt')) return 'shirt top clothing';
      if (url.includes('top')) return 'top shirt clothing';
      return 'fashion clothing item';
    });

    // Use text embeddings for the descriptions
    return await embedTextBatch(imageDescriptions);
  } catch (error) {
    console.error('Image embedding error:', error);
    return imageUrls.map(() => new Array(384).fill(0));
  }
}

export async function embedImageSingle(imageUrl: string): Promise<number[]> {
  const results = await embedImageBatch([imageUrl]);
  return results[0] || new Array(384).fill(0);
}

/**
 * Generate multimodal embeddings (text + image) for a single item
 * Returns both text and image embeddings
 */
export async function embedMultimodalItem(
  text: string,
  imageUrl: string
): Promise<{ textEmbedding: number[]; imageEmbedding: number[] }> {
  const [textEmbedding, imageEmbedding] = await Promise.all([
    embedTextSingle(text),
    embedImageSingle(imageUrl),
  ]);

  return { textEmbedding, imageEmbedding };
}

/**
 * Test multimodal functionality
 */
export async function testMultimodal(): Promise<boolean> {
  try {
    const testText = 'test text embedding';
    const testImageUrl = 'https://example.com/test-image.jpg';

    const textEmbedding = await embedTextSingle(testText);
    const imageEmbedding = await embedImageSingle(testImageUrl);

    return (
      textEmbedding.length === 384 &&
      imageEmbedding.length === 384 &&
      textEmbedding.some((val) => val !== 0) &&
      imageEmbedding.some((val) => val !== 0)
    );
  } catch (error) {
    console.error('Multimodal test failed:', error);
    return false;
  }
}
