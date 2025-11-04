import { HfInference } from '@huggingface/inference';
import sharp from 'sharp';

const HF_TOKEN = process.env.HF_TOKEN;
const TEXT_MODEL = 'sentence-transformers/all-MiniLM-L6-v2'; // 384 dimensions
const IMAGE_MODEL = 'sentence-transformers/clip-ViT-B-32'; // 512 dimensions for images

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

        // Convert to base64 data URI for Hugging Face API
        const base64Image = processedImage.toString('base64');
        const dataUri = `data:image/jpeg;base64,${base64Image}`;

        // Generate embedding
        const response = await hf.featureExtraction({
          model: IMAGE_MODEL,
          inputs: dataUri,
        });

        if (Array.isArray(response) && response.length === 512) {
          embeddings.push(response as number[]);
        } else {
          console.warn(`Invalid image embedding response for: ${imageUrl}`);
          embeddings.push(new Array(512).fill(0));
        }
      } catch (imageError) {
        console.warn(`Error processing image ${imageUrl}:`, imageError);
        embeddings.push(new Array(512).fill(0));
      }
    }

    return embeddings;
  } catch (error) {
    console.error('Image embedding error:', error);
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
 * Test multimodal functionality
 */
export async function testMultimodal(): Promise<boolean> {
  try {
    const testText = 'test text embedding';
    const testImageUrl = 'https://via.placeholder.com/224x224.jpg'; // Placeholder image

    const textEmbedding = await embedTextSingle(testText);
    const imageEmbedding = await embedImageSingle(testImageUrl);

    return (
      textEmbedding.length === 384 &&
      imageEmbedding.length === 512 &&
      textEmbedding.some((val) => val !== 0) &&
      imageEmbedding.some((val) => val !== 0)
    );
  } catch (error) {
    console.error('Multimodal test failed:', error);
    return false;
  }
}
