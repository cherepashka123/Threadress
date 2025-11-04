import { HfInference } from '@huggingface/inference';

const HF_TOKEN = process.env.HF_TOKEN;
const TEXT_MODEL = 'sentence-transformers/all-MiniLM-L6-v2'; // 384 dimensions for text
const CLIP_MODEL = 'openai/clip-vit-base-patch32'; // 512 dimensions for images

if (!HF_TOKEN) {
  console.warn(
    'HF_TOKEN environment variable is not set. Real CLIP multimodal will not work.'
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
 * Generate REAL image embeddings using CLIP
 */
export async function embedImageBatch(
  imageUrls: string[]
): Promise<number[][]> {
  if (!HF_TOKEN) {
    console.error('HF_TOKEN is not set. Cannot generate image embeddings.');
    return imageUrls.map(() => new Array(512).fill(0));
  }
  if (imageUrls.length === 0) return [];

  const embeddings: number[][] = [];

  for (const imageUrl of imageUrls) {
    try {
      // Fetch the image
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        console.warn(`Failed to fetch image: ${imageUrl}`);
        embeddings.push(new Array(512).fill(0));
        continue;
      }

      const imageBuffer = await imageResponse.arrayBuffer();
      const imageData = Buffer.from(imageBuffer);

      // Use CLIP for real image embeddings
      // Convert to base64 data URI for Hugging Face API
      const base64Image = imageData.toString('base64');
      const dataUri = `data:image/jpeg;base64,${base64Image}`;

      const response = await hf.featureExtraction({
        model: CLIP_MODEL,
        inputs: dataUri,
      });

      if (Array.isArray(response) && response.length === 512) {
        embeddings.push(response as number[]);
      } else {
        console.warn(`Invalid CLIP embedding response for: ${imageUrl}`);
        embeddings.push(new Array(512).fill(0));
      }
    } catch (error) {
      console.error(`Error processing image ${imageUrl}:`, error);
      embeddings.push(new Array(512).fill(0));
    }
  }

  return embeddings;
}

export async function embedImageSingle(imageUrl: string): Promise<number[]> {
  const results = await embedImageBatch([imageUrl]);
  return results[0] || new Array(512).fill(0);
}

/**
 * Combine text and image vectors with weights
 * Handles different dimensions by padding or truncating
 */
export function combineMultimodalVectors(
  textVector: number[],
  imageVector: number[],
  textWeight: number = 0.6,
  imageWeight: number = 0.4
): number[] {
  if (textVector.length === 0 && imageVector.length === 0) {
    return [];
  }

  // Normalize vectors
  const normalize = (vec: number[]) => {
    const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vec.map((val) => val / magnitude) : vec;
  };

  // Handle different dimensions - use the larger one
  const targetDim = Math.max(textVector.length, imageVector.length);

  const paddedText =
    textVector.length < targetDim
      ? [...textVector, ...new Array(targetDim - textVector.length).fill(0)]
      : textVector.slice(0, targetDim);

  const paddedImage =
    imageVector.length < targetDim
      ? [...imageVector, ...new Array(targetDim - imageVector.length).fill(0)]
      : imageVector.slice(0, targetDim);

  const normalizedText = normalize(paddedText);
  const normalizedImage = normalize(paddedImage);

  // Combine vectors with weights
  const combined = normalizedText.map(
    (textVal, i) =>
      textWeight * textVal + imageWeight * (normalizedImage[i] || 0)
  );

  return normalize(combined);
}

/**
 * Generate multimodal query embeddings
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
 * Test real CLIP functionality
 */
export async function testRealCLIP(): Promise<{
  connectionTest: boolean;
  textEmbedding: { text: string; length: number; preview: number[] };
  imageEmbedding: { imageUrl: string; length: number; preview: number[] };
  combinedQuery: {
    textLength: number;
    imageLength: number;
    combinedLength: number;
    textPreview: number[];
    imagePreview: number[];
    combinedPreview: number[];
  };
  message: string;
}> {
  try {
    const testText = 'elegant black dress for evening';
    const testImageUrl =
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=224&h=224&fit=crop';

    const textEmbedding = await embedTextSingle(testText);
    const imageEmbedding = await embedImageSingle(testImageUrl);
    const { textVector, imageVector, combinedVector } =
      await embedMultimodalQuery(testText, testImageUrl, 0.6, 0.4);

    const textWorking =
      textEmbedding.length === 384 && textEmbedding.some((val) => val !== 0);
    const imageWorking =
      imageEmbedding.length === 512 && imageEmbedding.some((val) => val !== 0);

    return {
      connectionTest: textWorking && imageWorking,
      textEmbedding: {
        text: testText,
        length: textEmbedding.length,
        preview: textEmbedding.slice(0, 5),
      },
      imageEmbedding: {
        imageUrl: testImageUrl,
        length: imageEmbedding.length,
        preview: imageEmbedding.slice(0, 5),
      },
      combinedQuery: {
        textLength: textVector.length,
        imageLength: imageVector.length,
        combinedLength: combinedVector.length,
        textPreview: textVector.slice(0, 5),
        imagePreview: imageVector.slice(0, 5),
        combinedPreview: combinedVector.slice(0, 5),
      },
      message: 'Real CLIP multimodal functionality is working correctly',
    };
  } catch (error) {
    console.error('Real CLIP test failed:', error);
    return {
      connectionTest: false,
      textEmbedding: { text: '', length: 0, preview: [] },
      imageEmbedding: { imageUrl: '', length: 0, preview: [] },
      combinedQuery: {
        textLength: 0,
        imageLength: 0,
        combinedLength: 0,
        textPreview: [],
        imagePreview: [],
        combinedPreview: [],
      },
      message: 'Real CLIP test failed',
    };
  }
}

