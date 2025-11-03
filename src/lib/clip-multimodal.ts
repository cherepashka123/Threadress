import { HfInference } from '@huggingface/inference';
import sharp from 'sharp';

const HF_TOKEN = process.env.HF_TOKEN;
const TEXT_MODEL = 'sentence-transformers/all-MiniLM-L6-v2'; // 384 dimensions
const CLIP_MODEL = 'sentence-transformers/clip-ViT-B-32'; // 512 dimensions for images

if (!HF_TOKEN) {
  console.warn(
    'HF_TOKEN environment variable is not set. CLIP multimodal embeddings will not work.'
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
 * Generate image embeddings using CLIP
 */
export async function embedImageBatch(
  imageUrls: string[]
): Promise<number[][]> {
  if (!HF_TOKEN) {
    console.error('HF_TOKEN is not set. Cannot generate image embeddings.');
    return imageUrls.map(() => new Array(512).fill(0));
  }
  if (imageUrls.length === 0) return [];

  try {
    const embeddings: number[][] = [];

    for (const imageUrl of imageUrls) {
      try {
        // Fetch and process image
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
          console.warn(`Failed to fetch image: ${imageUrl}`);
          embeddings.push(new Array(512).fill(0));
          continue;
        }

        const imageBuffer = await imageResponse.arrayBuffer();
        const imageData = Buffer.from(imageBuffer);

        // Process image with sharp to ensure compatibility
        const processedImage = await sharp(imageData)
          .resize(224, 224) // CLIP expects 224x224
          .jpeg()
          .toBuffer();

        // Generate CLIP embedding
        const response = await hf.featureExtraction({
          model: CLIP_MODEL,
          inputs: processedImage,
        });

        if (Array.isArray(response) && response.length === 512) {
          embeddings.push(response as number[]);
        } else {
          console.warn(`Invalid CLIP embedding response for: ${imageUrl}`);
          embeddings.push(new Array(512).fill(0));
        }
      } catch (imageError) {
        console.warn(`Error processing image ${imageUrl}:`, imageError);
        embeddings.push(new Array(512).fill(0));
      }
    }

    return embeddings;
  } catch (error) {
    console.error('CLIP image embedding error:', error);
    return imageUrls.map(() => new Array(512).fill(0));
  }
}

export async function embedImageSingle(imageUrl: string): Promise<number[]> {
  const results = await embedImageBatch([imageUrl]);
  return results[0] || new Array(512).fill(0);
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
 * Advanced multimodal search: Combine text and image vectors
 * This creates a weighted combination of text and image embeddings
 */
export function combineMultimodalVectors(
  textVector: number[],
  imageVector: number[],
  textWeight: number = 0.6,
  imageWeight: number = 0.4
): number[] {
  // Normalize vectors to unit length
  const normalize = (vec: number[]) => {
    const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vec.map((val) => val / magnitude) : vec;
  };

  const normalizedText = normalize(textVector);
  const normalizedImage = normalize(imageVector);

  // Combine vectors with weights
  const combined = normalizedText.map(
    (textVal, i) =>
      textWeight * textVal + imageWeight * (normalizedImage[i] || 0)
  );

  // Normalize the combined vector
  return normalize(combined);
}

/**
 * Generate combined multimodal query vector
 */
export async function embedMultimodalQuery(
  text: string,
  imageUrl: string,
  textWeight: number = 0.6,
  imageWeight: number = 0.4
): Promise<{
  textVector: number[];
  imageVector: number[];
  combinedVector: number[];
}> {
  const [textVector, imageVector] = await Promise.all([
    embedTextSingle(text),
    embedImageSingle(imageUrl),
  ]);

  const combinedVector = combineMultimodalVectors(
    textVector,
    imageVector,
    textWeight,
    imageWeight
  );

  return { textVector, imageVector, combinedVector };
}

/**
 * Test CLIP multimodal functionality
 */
export async function testCLIPMultimodal(): Promise<boolean> {
  try {
    const testText = 'elegant black dress for evening';
    const testImageUrl =
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=224&h=224&fit=crop'; // Real fashion image

    const textEmbedding = await embedTextSingle(testText);
    const imageEmbedding = await embedImageSingle(testImageUrl);

    return (
      textEmbedding.length === 384 &&
      imageEmbedding.length === 512 &&
      textEmbedding.some((val) => val !== 0) &&
      imageEmbedding.some((val) => val !== 0)
    );
  } catch (error) {
    console.error('CLIP multimodal test failed:', error);
    return false;
  }
}
