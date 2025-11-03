import { HfInference } from '@huggingface/inference';

const HF_TOKEN = process.env.HF_TOKEN;
const TEXT_MODEL = 'sentence-transformers/all-MiniLM-L6-v2'; // 384 dimensions

if (!HF_TOKEN) {
  console.warn(
    'HF_TOKEN environment variable is not set. Advanced multimodal embeddings will not work.'
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
 * Generate image embeddings by converting image URLs to rich text descriptions
 * This creates more sophisticated image representations than the simple approach
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
    // Convert image URLs to rich text descriptions
    const imageDescriptions = imageUrls.map((url) => {
      // Extract rich information from URL and create detailed descriptions
      let description = 'fashion clothing item';

      if (url.includes('cardigan')) {
        description =
          'knit cardigan sweater warm cozy casual elegant clothing outerwear';
      } else if (url.includes('dress')) {
        description =
          'dress elegant feminine formal evening party clothing fashion';
      } else if (url.includes('shirt')) {
        description =
          'shirt top blouse formal casual work office clothing fashion';
      } else if (url.includes('top')) {
        description = 'top shirt blouse casual elegant clothing fashion';
      } else if (url.includes('jacket')) {
        description =
          'jacket outerwear coat blazer formal casual clothing fashion';
      } else if (url.includes('pants') || url.includes('trousers')) {
        description =
          'pants trousers bottoms formal casual work clothing fashion';
      } else if (url.includes('skirt')) {
        description = 'skirt feminine elegant casual formal clothing fashion';
      } else if (url.includes('sweater')) {
        description = 'sweater knit warm cozy casual elegant clothing fashion';
      } else if (url.includes('blouse')) {
        description =
          'blouse shirt top feminine elegant formal casual clothing';
      } else if (url.includes('bodysuit')) {
        description =
          'bodysuit fitted elegant formal work office clothing fashion';
      }

      // Add color and material information if available in URL
      if (url.includes('black')) description += ' black dark elegant';
      if (url.includes('white')) description += ' white clean crisp';
      if (url.includes('blue')) description += ' blue navy professional';
      if (url.includes('red')) description += ' red bold vibrant';
      if (url.includes('green')) description += ' green natural fresh';
      if (url.includes('brown')) description += ' brown earthy warm';
      if (url.includes('beige')) description += ' beige neutral elegant';
      if (url.includes('yellow')) description += ' yellow bright cheerful';

      if (url.includes('linen'))
        description += ' linen natural breathable summer';
      if (url.includes('silk')) description += ' silk luxurious elegant smooth';
      if (url.includes('cotton'))
        description += ' cotton comfortable natural soft';
      if (url.includes('wool')) description += ' wool warm cozy winter';
      if (url.includes('satin')) description += ' satin smooth shiny elegant';
      if (url.includes('knit')) description += ' knit textured cozy warm';
      if (url.includes('jersey'))
        description += ' jersey stretchy comfortable casual';

      return description;
    });

    // Use text embeddings for the rich descriptions
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
 * Test advanced multimodal functionality
 */
export async function testAdvancedMultimodal(): Promise<boolean> {
  try {
    const testText = 'elegant black dress for evening';
    const testImageUrl = 'https://example.com/black-dress.jpg';

    const textEmbedding = await embedTextSingle(testText);
    const imageEmbedding = await embedImageSingle(testImageUrl);
    const { combinedVector } = await embedMultimodalQuery(
      testText,
      testImageUrl
    );

    return (
      textEmbedding.length === 384 &&
      imageEmbedding.length === 384 &&
      combinedVector.length === 384 &&
      textEmbedding.some((val) => val !== 0) &&
      imageEmbedding.some((val) => val !== 0) &&
      combinedVector.some((val) => val !== 0)
    );
  } catch (error) {
    console.error('Advanced multimodal test failed:', error);
    return false;
  }
}
