import { HfInference } from '@huggingface/inference';

const HF_TOKEN = process.env.HF_TOKEN;
const TEXT_MODEL = 'sentence-transformers/all-MiniLM-L6-v2'; // 384 dimensions

if (!HF_TOKEN) {
  console.warn(
    'HF_TOKEN environment variable is not set. Vibe search will not work.'
  );
}

const hf = new HfInference(HF_TOKEN);

export interface StyleContext {
  occasion: string;
  mood: string;
  fit: string;
  color: string;
  material: string;
  style: string;
  season: string;
  vibe: string;
}

interface VibeSearchResult {
  enhancedQuery: string;
  styleContext: StyleContext;
  searchWeights: {
    text: number;
    image: number;
    vibe: number;
    context: number;
  };
}

/**
 * Extract style context and vibe from natural language queries
 */
export function extractStyleContext(query: string): StyleContext {
  const lowerQuery = query.toLowerCase();

  // Occasion detection
  const occasions = {
    halloween: 'Halloween',
    party: 'Party',
    'night out': 'Night Out',
    'date night': 'Date Night',
    work: 'Work',
    office: 'Office',
    casual: 'Casual',
    formal: 'Formal',
    wedding: 'Wedding',
    cocktail: 'Cocktail',
    dinner: 'Dinner',
    vacation: 'Vacation',
    resort: 'Resort',
    gym: 'Gym',
    workout: 'Workout',
    beach: 'Beach',
    summer: 'Summer',
    winter: 'Winter',
    fall: 'Fall',
    spring: 'Spring',
  };

  // Mood/vibe detection
  const moods = {
    sexy: 'Sexy',
    elegant: 'Elegant',
    edgy: 'Edgy',
    romantic: 'Romantic',
    playful: 'Playful',
    sophisticated: 'Sophisticated',
    minimalist: 'Minimalist',
    bohemian: 'Bohemian',
    vintage: 'Vintage',
    modern: 'Modern',
    classic: 'Classic',
    trendy: 'Trendy',
    chic: 'Chic',
    glamorous: 'Glamorous',
    casual: 'Casual',
    comfortable: 'Comfortable',
  };

  // Fit detection
  const fits = {
    tight: 'Tight',
    fitted: 'Fitted',
    loose: 'Loose',
    oversized: 'Oversized',
    cropped: 'Cropped',
    long: 'Long',
    short: 'Short',
    'high-waisted': 'High-Waisted',
    'low-waisted': 'Low-Waisted',
    cinched: 'Cinched',
    belted: 'Belted',
    flowy: 'Flowy',
    structured: 'Structured',
    relaxed: 'Relaxed',
    bodycon: 'Bodycon',
    'a-line': 'A-Line',
    wrap: 'Wrap',
    asymmetric: 'Asymmetric',
  };

  // Color detection
  const colors = {
    black: 'Black',
    white: 'White',
    red: 'Red',
    blue: 'Blue',
    green: 'Green',
    yellow: 'Yellow',
    pink: 'Pink',
    purple: 'Purple',
    orange: 'Orange',
    brown: 'Brown',
    beige: 'Beige',
    navy: 'Navy',
    burgundy: 'Burgundy',
    maroon: 'Maroon',
    cream: 'Cream',
    ivory: 'Ivory',
    gray: 'Gray',
    grey: 'Grey',
    silver: 'Silver',
    gold: 'Gold',
    metallic: 'Metallic',
    neutral: 'Neutral',
    dark: 'Dark',
    light: 'Light',
    bright: 'Bright',
    pastel: 'Pastel',
  };

  // Material detection
  const materials = {
    silk: 'Silk',
    satin: 'Satin',
    velvet: 'Velvet',
    leather: 'Leather',
    denim: 'Denim',
    cotton: 'Cotton',
    linen: 'Linen',
    wool: 'Wool',
    cashmere: 'Cashmere',
    jersey: 'Jersey',
    knit: 'Knit',
    lace: 'Lace',
    sequin: 'Sequin',
    metallic: 'Metallic',
    sheer: 'Sheer',
    mesh: 'Mesh',
    organza: 'Organza',
    chiffon: 'Chiffon',
    tulle: 'Tulle',
    'faux fur': 'Faux Fur',
    suede: 'Suede',
    polyester: 'Polyester',
    viscose: 'Viscose',
    rayon: 'Rayon',
  };

  // Style detection
  const styles = {
    minimalist: 'Minimalist',
    bohemian: 'Bohemian',
    vintage: 'Vintage',
    retro: 'Retro',
    modern: 'Modern',
    classic: 'Classic',
    contemporary: 'Contemporary',
    edgy: 'Edgy',
    romantic: 'Romantic',
    preppy: 'Preppy',
    streetwear: 'Streetwear',
    athleisure: 'Athleisure',
    gothic: 'Gothic',
    punk: 'Punk',
    grunge: 'Grunge',
    preppy: 'Preppy',
    preppy: 'Preppy',
    preppy: 'Preppy',
  };

  // Extract values
  const occasion =
    Object.entries(occasions).find(([key]) => lowerQuery.includes(key))?.[1] ||
    '';

  const mood =
    Object.entries(moods).find(([key]) => lowerQuery.includes(key))?.[1] || '';

  const fit =
    Object.entries(fits).find(([key]) => lowerQuery.includes(key))?.[1] || '';

  const color =
    Object.entries(colors).find(([key]) => lowerQuery.includes(key))?.[1] || '';

  const material =
    Object.entries(materials).find(([key]) => lowerQuery.includes(key))?.[1] ||
    '';

  const style =
    Object.entries(styles).find(([key]) => lowerQuery.includes(key))?.[1] || '';

  // Season detection
  const season = lowerQuery.includes('summer')
    ? 'Summer'
    : lowerQuery.includes('winter')
      ? 'Winter'
      : lowerQuery.includes('fall') || lowerQuery.includes('autumn')
        ? 'Fall'
        : lowerQuery.includes('spring')
          ? 'Spring'
          : '';

  // Overall vibe detection
  const vibe = mood || style || occasion || 'Elegant';

  return {
    occasion,
    mood,
    fit,
    color,
    material,
    style,
    season,
    vibe,
  };
}

/**
 * Enhance query with style context and vibe
 */
export function enhanceQueryWithVibe(
  query: string,
  imageUrl?: string
): VibeSearchResult {
  const styleContext = extractStyleContext(query);

  // Build enhanced query with context
  const contextParts = [
    query,
    styleContext.vibe && `vibe: ${styleContext.vibe}`,
    styleContext.occasion && `occasion: ${styleContext.occasion}`,
    styleContext.mood && `mood: ${styleContext.mood}`,
    styleContext.fit && `fit: ${styleContext.fit}`,
    styleContext.color && `color: ${styleContext.color}`,
    styleContext.material && `material: ${styleContext.material}`,
    styleContext.style && `style: ${styleContext.style}`,
    styleContext.season && `season: ${styleContext.season}`,
  ].filter(Boolean);

  const enhancedQuery = contextParts.join(' | ');

  // Determine search weights based on query complexity and context
  const hasImage = !!imageUrl;
  const hasVibe = !!styleContext.vibe;
  const hasContext = Object.values(styleContext).some((v) => v);

  let searchWeights = {
    text: 0.4,
    image: 0.3,
    vibe: 0.2,
    context: 0.1,
  };

  // Adjust weights based on input
  if (hasImage && !hasVibe) {
    searchWeights = { text: 0.3, image: 0.5, vibe: 0.1, context: 0.1 };
  } else if (hasVibe && !hasImage) {
    searchWeights = { text: 0.4, image: 0.1, vibe: 0.4, context: 0.1 };
  } else if (hasVibe && hasImage) {
    searchWeights = { text: 0.3, image: 0.3, vibe: 0.3, context: 0.1 };
  }

  return {
    enhancedQuery,
    styleContext,
    searchWeights,
  };
}

/**
 * Generate vibe-based embeddings
 */
export async function embedVibeQuery(
  query: string,
  imageUrl?: string
): Promise<{
  textVector: number[];
  imageVector: number[];
  vibeVector: number[];
  contextVector: number[];
  combinedVector: number[];
  searchWeights: any;
}> {
  const { enhancedQuery, styleContext, searchWeights } = enhanceQueryWithVibe(
    query,
    imageUrl
  );

  // Generate text embedding
  const textVector = await embedTextSingle(enhancedQuery);

  // Generate image embedding if provided
  const imageVector = imageUrl
    ? await embedImageSingle(imageUrl)
    : new Array(384).fill(0);

  // Generate vibe embedding
  const vibeText = [
    styleContext.vibe,
    styleContext.mood,
    styleContext.occasion,
    styleContext.style,
  ]
    .filter(Boolean)
    .join(' ');

  const vibeVector = vibeText
    ? await embedTextSingle(vibeText)
    : new Array(384).fill(0);

  // Generate context embedding
  const contextText = [
    styleContext.fit,
    styleContext.color,
    styleContext.material,
    styleContext.season,
  ]
    .filter(Boolean)
    .join(' ');

  const contextVector = contextText
    ? await embedTextSingle(contextText)
    : new Array(384).fill(0);

  // Combine all vectors with weights
  const combinedVector = combineVibeVectors(
    textVector,
    imageVector,
    vibeVector,
    contextVector,
    searchWeights
  );

  return {
    textVector,
    imageVector,
    vibeVector,
    contextVector,
    combinedVector,
    searchWeights,
  };
}

/**
 * Combine multiple vectors with weights
 */
export function combineVibeVectors(
  textVector: number[],
  imageVector: number[],
  vibeVector: number[],
  contextVector: number[],
  weights: { text: number; image: number; vibe: number; context: number }
): number[] {
  // Normalize vectors to unit length
  const normalize = (vec: number[]) => {
    const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vec.map((val) => val / magnitude) : vec;
  };

  const normalizedText = normalize(textVector);
  const normalizedImage = normalize(imageVector);
  const normalizedVibe = normalize(vibeVector);
  const normalizedContext = normalize(contextVector);

  // Combine vectors with weights
  const combined = normalizedText.map(
    (textVal, i) =>
      weights.text * textVal +
      weights.image * (normalizedImage[i] || 0) +
      weights.vibe * (normalizedVibe[i] || 0) +
      weights.context * (normalizedContext[i] || 0)
  );

  // Normalize the combined vector
  return normalize(combined);
}

/**
 * Generate text embeddings
 */
export async function embedTextSingle(text: string): Promise<number[]> {
  if (!HF_TOKEN) {
    console.error('HF_TOKEN is not set. Cannot generate text embeddings.');
    return new Array(384).fill(0);
  }

  try {
    const response = await hf.featureExtraction({
      model: TEXT_MODEL,
      inputs: text,
    });

    if (!Array.isArray(response)) {
      throw new Error('Invalid response format from Hugging Face API');
    }

    return response as number[];
  } catch (error) {
    console.error('Text embedding error:', error);
    return new Array(384).fill(0);
  }
}

/**
 * Generate image embeddings (simplified for now)
 */
export async function embedImageSingle(imageUrl: string): Promise<number[]> {
  if (!HF_TOKEN) {
    console.error('HF_TOKEN is not set. Cannot generate image embeddings.');
    return new Array(384).fill(0);
  }

  try {
    // For now, we'll use a simplified approach
    // In a real implementation, you'd use CLIP or similar
    const imageDescription = `fashion clothing item from ${imageUrl}`;
    return await embedTextSingle(imageDescription);
  } catch (error) {
    console.error('Image embedding error:', error);
    return new Array(384).fill(0);
  }
}

/**
 * Get style suggestions based on query
 */
export function getStyleSuggestions(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  const suggestions: string[] = [];

  // Occasion-based suggestions
  if (lowerQuery.includes('halloween')) {
    suggestions.push('black dress', 'costume', 'spooky', 'dramatic', 'edgy');
  }
  if (lowerQuery.includes('party')) {
    suggestions.push('sequin dress', 'cocktail dress', 'glamorous', 'sparkly');
  }
  if (lowerQuery.includes('work')) {
    suggestions.push('blazer', 'professional', 'business casual', 'structured');
  }
  if (lowerQuery.includes('date')) {
    suggestions.push('romantic', 'elegant', 'feminine', 'flirty');
  }

  // Fit-based suggestions
  if (lowerQuery.includes('tight')) {
    suggestions.push('bodycon', 'fitted', 'cinched waist', 'curve-hugging');
  }
  if (lowerQuery.includes('loose')) {
    suggestions.push('oversized', 'flowy', 'relaxed', 'comfortable');
  }

  // Color-based suggestions
  if (lowerQuery.includes('black')) {
    suggestions.push(
      'little black dress',
      'elegant',
      'sophisticated',
      'timeless'
    );
  }
  if (lowerQuery.includes('red')) {
    suggestions.push('bold', 'confident', 'sexy', 'statement piece');
  }

  return suggestions.slice(0, 5); // Return top 5 suggestions
}

/**
 * Test vibe search functionality
 */
export async function testVibeSearch(): Promise<boolean> {
  try {
    const testQuery = 'tight black dress for halloween party';
    const result = enhanceQueryWithVibe(testQuery);

    return (
      result.styleContext.vibe === 'Sexy' &&
      result.styleContext.occasion === 'Halloween' &&
      result.styleContext.fit === 'Tight' &&
      result.styleContext.color === 'Black' &&
      result.enhancedQuery.includes('vibe: Sexy')
    );
  } catch (error) {
    console.error('Vibe search test failed:', error);
    return false;
  }
}
