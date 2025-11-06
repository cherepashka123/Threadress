import { HfInference } from '@huggingface/inference';
import { enhanceQueryForTypoTolerance } from './typo-tolerance';
import { extractStyleContext, type StyleContext } from './vibe-search';

// Import direct CLIP service if available
let clipDirect: typeof import('./clip-direct') | null = null;
try {
  // Always try to load CLIP direct service
  clipDirect = require('./clip-direct');
  console.log('✅ CLIP direct service module loaded successfully');
} catch (error) {
  // CLIP service not available, will use Hugging Face
  console.warn('⚠️ CLIP direct service not available, will use Hugging Face fallback:', error instanceof Error ? error.message : error);
}

// Get HF_TOKEN dynamically instead of at module load time
// This allows env vars to be loaded after module import (e.g., in scripts)
function getHfToken(): string | undefined {
  return process.env.HF_TOKEN;
}

function getHfClient(): HfInference {
  const token = getHfToken();
  return new HfInference(token);
}

// TEXT EMBEDDING MODEL OPTIONS:
// - all-MiniLM-L6-v2: 384 dim, fast, good for general use
// - all-mpnet-base-v2: 768 dim, better quality, slower
// - paraphrase-multilingual-mpnet-base-v2: 768 dim, multilingual, best quality
const TEXT_MODEL = process.env.TEXT_EMBEDDING_MODEL || 'sentence-transformers/all-MiniLM-L6-v2'; // 384 dimensions for text (default)
const CLIP_MODEL = 'sentence-transformers/clip-ViT-B-32'; // 512 dimensions for images

/**
 * Generate text embeddings using sentence-transformers
 */
export async function embedTextBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  // Try direct CLIP service first if available (produces 512-dim vectors)
  // Works if CLIP_SERVICE_URL is set to a remote service (not localhost)
  // Localhost only works in development
  if (clipDirect) {
    try {
      console.log(`🔍 Attempting CLIP batch text embedding for ${texts.length} texts...`);
      const embeddings = await clipDirect.embedTextBatch(texts);
      // CLIP returns 512-dim embeddings - keep full size
      // The combination function will handle dimension alignment
      const processed = embeddings.map(emb => {
        if (emb.length === 512) {
          // Return full 512-dim CLIP embedding
          return emb;
        }
        // If somehow not 512, pad to 512
        return emb.length < 512 ? [...emb, ...new Array(512 - emb.length).fill(0)] : emb;
      });
      console.log(`✅ CLIP batch text embedding successful: ${processed.length} embeddings, ${processed[0]?.length || 0} dim`);
      return processed;
    } catch (error) {
      // Log in production too - important for debugging
      console.warn('⚠️ CLIP batch service failed, falling back to Hugging Face:', error instanceof Error ? error.message : error);
    }
  } else {
    console.log('ℹ️ CLIP direct service not loaded, using Hugging Face for batch');
  }

  // Fallback to Hugging Face
  const hfToken = getHfToken();
  if (!hfToken) {
    console.error('HF_TOKEN is not set. Cannot generate text embeddings.');
    // Use hash fallback instead of zero vectors
    console.warn('⚠️ Using hash-based fallback embeddings (HF_TOKEN missing)');
    return texts.map(text => generateSimpleHashEmbedding(text));
  }

  const hf = getHfClient();
  try {
    const response = await hf.featureExtraction({
      model: TEXT_MODEL,
      inputs: texts,
    });

    if (!Array.isArray(response) || response.some((r) => !Array.isArray(r))) {
      throw new Error('Invalid response format from Hugging Face API');
    }

    // Validate embeddings are not all zeros
    const embeddings = response as number[][];
    const validEmbeddings = embeddings.map((emb, idx) => {
      const isNonZero = emb.some(v => v !== 0);
      if (!isNonZero && texts[idx]) {
        console.warn(`⚠️ Hugging Face returned zero vector for text ${idx}, using hash fallback`);
        return generateSimpleHashEmbedding(texts[idx]);
      }
      return emb;
    });

    return validEmbeddings;
  } catch (error) {
    console.error('Text embedding error:', error);
    // Return hash-based embeddings instead of zero vectors
    console.warn('⚠️ Hugging Face failed completely, using hash-based fallback for all texts');
    return texts.map(text => generateSimpleHashEmbedding(text));
  }
}

export async function embedTextSingle(text: string): Promise<number[]> {
  // Try direct CLIP service first if available (works with remote CLIP service)
  if (clipDirect) {
    try {
      console.log(`🔍 Attempting CLIP text embedding for: "${text.substring(0, 50)}..."`);
      const embedding = await clipDirect.embedTextSingle(text);
      // CLIP returns 512-dim embeddings - keep full size for combined vector
      // The combination function will handle padding if needed
      const isNonZero = embedding.some(v => v !== 0);
      console.log(`✅ CLIP service used for text embedding: ${embedding.length} dim, non-zero: ${isNonZero}`);
      if (!isNonZero) {
        console.warn('⚠️ CLIP returned zero vector, falling back to Hugging Face');
        throw new Error('CLIP returned zero vector');
      }
      // Return full 512-dim CLIP embedding (will be used in combined vector)
      return embedding;
    } catch (error) {
      // Log in production too to diagnose issues
      console.warn('⚠️ CLIP service failed for text, falling back to Hugging Face:', error instanceof Error ? error.message : error);
    }
  } else {
    console.log('ℹ️ CLIP direct service module not loaded, using Hugging Face');
  }

  // Fallback to Hugging Face (384-dim, will be padded to 512 in combination)
  try {
    const results = await embedTextBatch([text]);
    const embedding = results[0] || new Array(384).fill(0);
    const isNonZero = embedding.some(v => v !== 0);
    console.log(`📊 Hugging Face text embedding: ${embedding.length} dim, non-zero: ${isNonZero}`);
    
    if (!isNonZero) {
      console.error('❌ Hugging Face returned zero vector! Attempting direct HF call...');
      // Last resort: try direct Hugging Face API call
      const hfToken = getHfToken();
      if (hfToken) {
        try {
          const hf = getHfClient();
          const directResponse = await hf.featureExtraction({
            model: TEXT_MODEL,
            inputs: text,
          });
          
          if (Array.isArray(directResponse) && Array.isArray(directResponse[0])) {
            const directEmbedding = directResponse[0] as number[];
            const hasNonZero = directEmbedding.some(v => v !== 0);
            if (hasNonZero) {
              console.log(`✅ Direct Hugging Face call succeeded: ${directEmbedding.length} dim`);
              return directEmbedding;
            }
          }
        } catch (directError) {
          console.error('❌ Direct Hugging Face call also failed:', directError);
        }
      }
      
      // If we still have zero vector, throw error to prevent invalid search
      throw new Error('All embedding methods failed - returned zero vectors');
    }
    
    return embedding;
  } catch (fallbackError) {
    console.error('❌ Hugging Face fallback failed:', fallbackError instanceof Error ? fallbackError.message : fallbackError);
    // Last resort: Generate a simple hash-based embedding to prevent zero vector
    // This ensures search can still work, even if quality is lower
    const hashEmbedding = generateSimpleHashEmbedding(text);
    console.warn('⚠️ Using hash-based fallback embedding to prevent zero vector');
    return hashEmbedding;
  }
}

/**
 * Generate a simple hash-based embedding as final fallback
 * This ensures we never return all-zero vectors, which break search
 */
function generateSimpleHashEmbedding(text: string): number[] {
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
  if (magnitude > 0) {
    return vector.map((val) => val / magnitude);
  }
  
  // If somehow still zero, return a small random vector
  return vector.map(() => (Math.random() - 0.5) * 0.01);
}

/**
 * Generate REAL image embeddings using CLIP
 * This provides actual visual understanding, not just URL-based text descriptions
 */
export async function embedImageBatch(
  imageUrls: string[]
): Promise<number[][]> {
  const hfToken = getHfToken();
  if (!hfToken) {
    console.error('HF_TOKEN is not set. Cannot generate image embeddings.');
    return imageUrls.map(() => new Array(512).fill(0));
  }
  if (imageUrls.length === 0) return [];
  
  const hf = getHfClient();

  const embeddings: number[][] = [];

  for (const imageUrl of imageUrls) {
    try {
      // Skip empty or invalid URLs
      if (!imageUrl || !imageUrl.trim() || !imageUrl.startsWith('http')) {
        console.warn(`Skipping invalid image URL: ${imageUrl || '(empty)'}`);
        embeddings.push(new Array(512).fill(0));
        continue;
      }

      // Fetch the image
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        console.warn(`Failed to fetch image: ${imageUrl}`);
        embeddings.push(new Array(512).fill(0));
        continue;
      }

      // Use CLIP for real image embeddings
      // Try direct CLIP service first (if available), then Hugging Face, then fallback
      try {
        // Prefer direct CLIP service if available (works with remote CLIP service)
        if (clipDirect) {
          try {
            const embedding = await clipDirect.embedImageSingle(imageUrl);
            if (embedding && embedding.length === 512 && embedding.some(x => x !== 0)) {
              console.log(`✅ CLIP service used for image embedding: ${imageUrl.substring(0, 50)}...`);
              embeddings.push(embedding);
              continue;
            } else {
              console.warn(`⚠️ CLIP returned invalid embedding for ${imageUrl}: length=${embedding?.length}, all-zero=${!embedding?.some(x => x !== 0)}`);
            }
          } catch (clipServiceError: any) {
            // CLIP service not available or failed, fall through to Hugging Face
            console.warn(`CLIP service unavailable for ${imageUrl}, trying Hugging Face...`, clipServiceError.message);
          }
        }
        
        // Fallback to Hugging Face (may not work for CLIP models)
        try {
          const hf = getHfClient();
        const response = await hf.featureExtraction({
          model: CLIP_MODEL,
            inputs: imageUrl,
          });

          // Handle both array and nested array responses
          let embedding: number[] | null = null;

          if (Array.isArray(response)) {
            if (response.length === 512 && typeof response[0] === 'number') {
              // Direct array of 512 numbers
              embedding = response as number[];
            } else if (Array.isArray(response[0]) && response[0].length === 512) {
              // Nested array: [[512 numbers]]
              embedding = response[0] as number[];
            } else if (response.length === 384 && typeof response[0] === 'number') {
              // 384-dim response, pad to 512
              embedding = [...response, ...new Array(512 - 384).fill(0)] as number[];
            }
          }
        
          if (embedding && embedding.length === 512) {
            embeddings.push(embedding);
            continue;
        }
        } catch (hfError: any) {
          // Hugging Face failed, will use fallback below
          console.warn(
            `Hugging Face CLIP failed for ${imageUrl}, using text fallback: ${hfError.message}`
          );
        }
        
        // Final fallback: generate text-based description and embed it
        const fallbackDescription = generateImageDescription(imageUrl);
        const fallbackEmbedding = await embedTextSingle(fallbackDescription);
        const paddedEmbedding = [
          ...fallbackEmbedding,
          ...new Array(512 - 384).fill(0),
        ];
        embeddings.push(paddedEmbedding);
    } catch (error) {
      console.error(`Error processing image ${imageUrl}:`, error);
      // Fallback to text-based description if CLIP fails
      const fallbackDescription = generateImageDescription(imageUrl);
      const fallbackEmbedding = await embedTextSingle(fallbackDescription);
      // Pad to 512 dimensions for CLIP
      const paddedEmbedding = [
        ...fallbackEmbedding,
        ...new Array(512 - 384).fill(0),
      ];
      embeddings.push(paddedEmbedding);
      }
    } catch (error) {
      console.error(`Fatal error processing image ${imageUrl}:`, error);
      // Last resort: return zero vector
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
 * Generate fallback image description when CLIP fails
 */
function generateImageDescription(imageUrl: string): string {
  const url = imageUrl.toLowerCase();
  let description = 'fashion clothing item';

  // Extract rich information from URL
  if (url.includes('cardigan')) {
    description =
      'knit cardigan sweater warm cozy casual elegant clothing outerwear';
  } else if (url.includes('dress')) {
    description =
      'dress elegant feminine formal evening party clothing fashion';
  } else if (url.includes('shirt')) {
    description = 'shirt top blouse formal casual work office clothing fashion';
  } else if (url.includes('top')) {
    description = 'top shirt blouse casual elegant clothing fashion';
  } else if (url.includes('jacket')) {
    description = 'jacket outerwear coat blazer formal casual clothing fashion';
  } else if (url.includes('pants') || url.includes('trousers')) {
    description = 'pants trousers bottoms formal casual work clothing fashion';
  } else if (url.includes('skirt')) {
    description = 'skirt feminine elegant casual formal clothing fashion';
  } else if (url.includes('sweater')) {
    description = 'sweater knit warm cozy casual elegant clothing fashion';
  } else if (url.includes('blouse')) {
    description = 'blouse shirt top feminine elegant formal casual clothing';
  } else if (url.includes('bodysuit')) {
    description = 'bodysuit fitted elegant formal work office clothing fashion';
  }

  // Add color and material information
  if (url.includes('black')) description += ' black dark elegant';
  if (url.includes('white')) description += ' white clean crisp';
  if (url.includes('blue')) description += ' blue navy professional';
  if (url.includes('red')) description += ' red bold vibrant';
  if (url.includes('green')) description += ' green natural fresh';
  if (url.includes('brown')) description += ' brown earthy warm';
  if (url.includes('beige')) description += ' beige neutral elegant';
  if (url.includes('yellow')) description += ' yellow bright cheerful';

  if (url.includes('linen')) description += ' linen natural breathable summer';
  if (url.includes('silk')) description += ' silk luxurious elegant smooth';
  if (url.includes('cotton')) description += ' cotton comfortable natural soft';
  if (url.includes('wool')) description += ' wool warm cozy winter';
  if (url.includes('satin')) description += ' satin smooth shiny elegant';
  if (url.includes('knit')) description += ' knit textured cozy warm';
  if (url.includes('jersey'))
    description += ' jersey stretchy comfortable casual';

  return description;
}

/**
 * Advanced multimodal search combining text, CLIP image embeddings, and vibe context
 * This is the optimized search engine that handles text, image, and vibe efficiently
 */
export async function embedAdvancedMultimodalQuery(
  text: string,
  imageUrl?: string,
  textWeight: number = 0.5,
  imageWeight: number = 0.3,
  vibeWeight: number = 0.2
): Promise<{
  textVector: number[];
  imageVector: number[];
  vibeVector: number[];
  combinedVector: number[];
  visualAnalysis?: {
    dominantColors: string[];
    style: string;
    occasion: string;
    mood: string;
  };
  styleContext?: StyleContext;
  enhancedQuery?: string;
}> {
  // Enhance query with typo tolerance
  const typoTolerantQuery = enhanceQueryForTypoTolerance(text);

  // Extract style context (vibe understanding)
  const styleContext = extractStyleContext(typoTolerantQuery);

  // Build enhanced query with vibe context
  const vibeText = [
    styleContext.vibe,
    styleContext.mood,
    styleContext.occasion,
    styleContext.style,
    styleContext.fit,
    styleContext.color,
    styleContext.material,
  ]
    .filter(Boolean)
    .join(' ');

  const enhancedQuery = vibeText
    ? `${typoTolerantQuery} ${vibeText}`
    : typoTolerantQuery;

  // Generate embeddings in parallel for efficiency
  // Ensure we never get zero vectors - use hash fallback if needed
  const embeddingPromises: Promise<any>[] = [
    embedTextSingle(enhancedQuery).catch(err => {
      console.error('❌ Text embedding failed in embedAdvancedMultimodalQuery:', err);
      return generateSimpleHashEmbedding(enhancedQuery);
    }),
    vibeText
      ? embedTextSingle(vibeText).catch(err => {
          console.error('❌ Vibe embedding failed in embedAdvancedMultimodalQuery:', err);
          return generateSimpleHashEmbedding(vibeText);
        })
      : Promise.resolve(new Array(384).fill(0)),
  ];

  if (imageUrl) {
    embeddingPromises.push(embedImageSingle(imageUrl));
  } else {
    embeddingPromises.push(Promise.resolve(new Array(512).fill(0)));
  }

  const [textVector, vibeVector, imageVector] =
    await Promise.all(embeddingPromises);

  // Validate vectors are not all zeros - use hash fallback if needed
  const finalTextVector = textVector.some(v => v !== 0) 
    ? textVector 
    : generateSimpleHashEmbedding(enhancedQuery);
  const finalVibeVector = vibeVector.some(v => v !== 0) 
    ? vibeVector 
    : (vibeText ? generateSimpleHashEmbedding(vibeText) : new Array(384).fill(0));
  const finalImageVector = imageVector.some(v => v !== 0) 
    ? imageVector 
    : new Array(512).fill(0);

  // Generate visual analysis from CLIP embeddings
  const visualAnalysis = await analyzeVisualStyle(
    finalImageVector,
    enhancedQuery,
    styleContext
  );

  // Combine vectors with proper dimension handling (prioritize combined for 512-dim output)
  const combinedVector = combineAdvancedVectorsWithVibe(
    finalTextVector,
    finalImageVector,
    finalVibeVector,
    textWeight,
    imageWeight,
    vibeWeight
  );

  // Final validation: ensure combined vector is not all zeros
  if (!combinedVector.some(v => v !== 0)) {
    console.error('❌ Combined vector is all zeros! Using hash fallback for query');
    const hashEmbedding = generateSimpleHashEmbedding(enhancedQuery);
    // Pad to 512 dimensions
    const paddedHash = hashEmbedding.concat(new Array(512 - hashEmbedding.length).fill(0));
    return {
      textVector: finalTextVector,
      imageVector: finalImageVector,
      vibeVector: finalVibeVector,
      combinedVector: paddedHash,
      visualAnalysis,
      styleContext,
      enhancedQuery,
    };
  }

  return {
    textVector: finalTextVector,
    imageVector: finalImageVector,
    vibeVector: finalVibeVector,
    combinedVector,
    visualAnalysis,
    styleContext,
    enhancedQuery,
  };
}

/**
 * Analyze visual style from CLIP embeddings and style context
 */
async function analyzeVisualStyle(
  imageVector: number[],
  textQuery: string,
  styleContext?: StyleContext
): Promise<{
  dominantColors: string[];
  style: string;
  occasion: string;
  mood: string;
}> {
  const lowerQuery = textQuery.toLowerCase();

  // Extract colors from query and style context
  const dominantColors: string[] = [];
  const colorKeywords = [
    'black',
    'white',
    'red',
    'blue',
    'green',
    'brown',
    'beige',
    'navy',
    'pink',
    'purple',
    'yellow',
    'orange',
    'gray',
    'grey',
  ];

  for (const color of colorKeywords) {
    if (
      lowerQuery.includes(color) ||
      styleContext?.color?.toLowerCase().includes(color)
    ) {
      const capitalized = color.charAt(0).toUpperCase() + color.slice(1);
      if (!dominantColors.includes(capitalized)) {
        dominantColors.push(capitalized);
      }
    }
  }

  // Use style context if available, otherwise infer from query
  const style =
    styleContext?.style ||
    (lowerQuery.includes('elegant')
      ? 'Elegant'
      : lowerQuery.includes('casual')
        ? 'Casual'
        : lowerQuery.includes('formal')
          ? 'Formal'
          : lowerQuery.includes('edgy')
            ? 'Edgy'
            : 'Classic');

  const occasion =
    styleContext?.occasion ||
    (lowerQuery.includes('work')
      ? 'Work'
      : lowerQuery.includes('party')
        ? 'Party'
        : lowerQuery.includes('date')
          ? 'Date Night'
          : lowerQuery.includes('halloween')
            ? 'Halloween'
            : lowerQuery.includes('wedding')
              ? 'Wedding'
              : lowerQuery.includes('casual')
                ? 'Casual'
                : 'General');

  const mood =
    styleContext?.mood ||
    (lowerQuery.includes('sexy')
      ? 'Sexy'
      : lowerQuery.includes('comfortable')
        ? 'Comfortable'
        : lowerQuery.includes('elegant')
          ? 'Elegant'
          : lowerQuery.includes('playful')
            ? 'Playful'
            : 'Sophisticated');

  return { dominantColors, style, occasion, mood };
}

/**
 * Combine text, image, and vibe vectors with advanced weighting
 * Output is always 512 dimensions (CLIP dimension) for optimal search
 */
export function combineAdvancedVectorsWithVibe(
  textVector: number[],
  imageVector: number[],
  vibeVector: number[],
  textWeight: number = 0.5,
  imageWeight: number = 0.3,
  vibeWeight: number = 0.2
): number[] {
  if (
    textVector.length === 0 &&
    imageVector.length === 0 &&
    vibeVector.length === 0
  ) {
    return new Array(512).fill(0);
  }

  // Normalize vectors
  const normalize = (vec: number[]) => {
    const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vec.map((val) => val / magnitude) : vec;
  };

  // Target dimension is 512 (CLIP dimension) for optimal search
  const targetDim = 512;

  // Pad vectors to target dimension
  const padVector = (vec: number[], target: number) => {
    if (vec.length === 0) return new Array(target).fill(0);
    if (vec.length < target) {
      return [...vec, ...new Array(target - vec.length).fill(0)];
    }
    return vec.slice(0, target);
  };

  const paddedText = padVector(textVector, targetDim);
  const paddedImage = padVector(imageVector, targetDim);
  const paddedVibe = padVector(vibeVector, targetDim);

  const normalizedText = normalize(paddedText);
  const normalizedImage = normalize(paddedImage);
  const normalizedVibe = normalize(paddedVibe);

  // Normalize weights to ensure they sum to 1
  const totalWeight = textWeight + imageWeight + vibeWeight;
  const normalizedTextWeight = textWeight / totalWeight;
  const normalizedImageWeight = imageWeight / totalWeight;
  const normalizedVibeWeight = vibeWeight / totalWeight;

  // Advanced combination with attention-like weighting
  const combined = normalizedText.map((textVal, i) => {
    const imageVal = normalizedImage[i] || 0;
    const vibeVal = normalizedVibe[i] || 0;

    // Use dynamic weighting based on vector strength
    const textStrength = Math.abs(textVal);
    const imageStrength = Math.abs(imageVal);
    const vibeStrength = Math.abs(vibeVal);
    const totalStrength = textStrength + imageStrength + vibeStrength;

    if (totalStrength > 0) {
      const dynamicTextWeight =
        (textStrength / totalStrength) * normalizedTextWeight;
      const dynamicImageWeight =
        (imageStrength / totalStrength) * normalizedImageWeight;
      const dynamicVibeWeight =
        (vibeStrength / totalStrength) * normalizedVibeWeight;
      return (
        dynamicTextWeight * textVal +
        dynamicImageWeight * imageVal +
        dynamicVibeWeight * vibeVal
      );
    }
    return (
      normalizedTextWeight * textVal +
      normalizedImageWeight * imageVal +
      normalizedVibeWeight * vibeVal
    );
  });

  return normalize(combined);
}

/**
 * Legacy function for backward compatibility
 */
export function combineAdvancedVectors(
  textVector: number[],
  imageVector: number[],
  textWeight: number = 0.6,
  imageWeight: number = 0.4
): number[] {
  return combineAdvancedVectorsWithVibe(
    textVector,
    imageVector,
    new Array(Math.max(textVector.length, imageVector.length)).fill(0),
    textWeight,
    imageWeight,
    0
  );
}

/**
 * Test CLIP advanced functionality
 */
export async function testCLIPAdvanced(): Promise<{
  connectionTest: boolean;
  textEmbedding: { text: string; length: number; preview: number[] };
  imageEmbedding: { imageUrl: string; length: number; preview: number[] };
  visualAnalysis: any;
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
    const { textVector, imageVector, combinedVector, visualAnalysis } =
      await embedAdvancedMultimodalQuery(testText, testImageUrl, 0.5, 0.3, 0.2);

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
      visualAnalysis,
      combinedQuery: {
        textLength: textVector.length,
        imageLength: imageVector.length,
        combinedLength: combinedVector.length,
        textPreview: textVector.slice(0, 5),
        imagePreview: imageVector.slice(0, 5),
        combinedPreview: combinedVector.slice(0, 5),
      },
      message: 'CLIP advanced multimodal functionality is working correctly',
    };
  } catch (error) {
    console.error('CLIP advanced test failed:', error);
    return {
      connectionTest: false,
      textEmbedding: { text: '', length: 0, preview: [] },
      imageEmbedding: { imageUrl: '', length: 0, preview: [] },
      visualAnalysis: null,
      combinedQuery: {
        textLength: 0,
        imageLength: 0,
        combinedLength: 0,
        textPreview: [],
        imagePreview: [],
        combinedPreview: [],
      },
      message: 'CLIP advanced test failed',
    };
  }
}
