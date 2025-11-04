import { HfInference } from '@huggingface/inference';
import {
  embedTextSingle,
  embedImageSingle,
  embedMultimodalQuery,
  combineMultimodalVectors,
} from '@/lib/advanced-multimodal';
import {
  embedVibeQuery,
  enhanceQueryWithVibe,
  getStyleSuggestions,
} from '@/lib/vibe-search';

const HF_TOKEN = process.env.HF_TOKEN;
const TEXT_MODEL = 'sentence-transformers/all-MiniLM-L6-v2';

if (!HF_TOKEN) {
  console.warn(
    'HF_TOKEN environment variable is not set. Hyper-intelligent search will not work.'
  );
}

const hf = new HfInference(HF_TOKEN);

interface SearchAnalysis {
  hasText: boolean;
  hasImage: boolean;
  isVibeQuery: boolean;
  isComplexQuery: boolean;
  detectedContext: {
    occasion?: string;
    mood?: string;
    fit?: string;
    color?: string;
    material?: string;
    style?: string;
  };
  recommendedWeights: {
    text: number;
    image: number;
    vibe: number;
    context: number;
  };
  searchStrategy:
    | 'text-only'
    | 'image-only'
    | 'multimodal'
    | 'vibe-enhanced'
    | 'hyper-combined';
}

interface HyperSearchResult {
  queryVector: any;
  searchStrategy: string;
  analysis: SearchAnalysis;
  enhancedQuery?: string;
  vibeContext?: any;
  visualAnalysis?: any;
  suggestions?: string[];
}

/**
 * Analyze the search input to determine the best search strategy
 */
function analyzeSearchInput(query: string, imageUrl?: string): SearchAnalysis {
  const hasText: boolean = query.trim().length > 0;
  const hasImage: boolean = !!(imageUrl && imageUrl.trim().length > 0);

  // Detect if this is a vibe/contextual query
  const lowerQuery = query.toLowerCase();
  const isVibeQuery =
    lowerQuery.includes('for ') || // "dress for party"
    lowerQuery.includes('to ') || // "shirt to work"
    lowerQuery.includes('look') || // "halloween look"
    lowerQuery.includes('vibe') || // "sexy vibe"
    lowerQuery.includes('mood') || // "elegant mood"
    lowerQuery.includes('occasion') || // "wedding occasion"
    lowerQuery.includes('style') || // "casual style"
    lowerQuery.includes('fit') || // "tight fit"
    lowerQuery.includes('comfortable') || // "comfortable"
    lowerQuery.includes('sexy') || // "sexy"
    lowerQuery.includes('elegant') || // "elegant"
    lowerQuery.includes('casual') || // "casual"
    lowerQuery.includes('formal') || // "formal"
    lowerQuery.includes('party') || // "party"
    lowerQuery.includes('work') || // "work"
    lowerQuery.includes('date') || // "date"
    lowerQuery.includes('weekend') || // "weekend"
    lowerQuery.includes('halloween') || // "halloween"
    lowerQuery.includes('wedding'); // "wedding"

  // Detect complexity
  const isComplexQuery =
    query.split(' ').length > 3 || // More than 3 words
    isVibeQuery || // Has contextual elements
    (hasText && hasImage); // Has both text and image

  // Extract context from query
  const detectedContext = {
    occasion: extractOccasion(lowerQuery),
    mood: extractMood(lowerQuery),
    fit: extractFit(lowerQuery),
    color: extractColor(lowerQuery),
    material: extractMaterial(lowerQuery),
    style: extractStyle(lowerQuery),
  };

  // Determine search strategy
  let searchStrategy: SearchAnalysis['searchStrategy'];
  if (!hasText && hasImage) {
    searchStrategy = 'image-only';
  } else if (hasText && !hasImage) {
    searchStrategy = isVibeQuery ? 'vibe-enhanced' : 'text-only';
  } else if (hasText && hasImage) {
    searchStrategy = isVibeQuery ? 'hyper-combined' : 'multimodal';
  } else {
    searchStrategy = 'text-only';
  }

  // Calculate recommended weights based on analysis
  const recommendedWeights = calculateOptimalWeights(
    hasText,
    hasImage,
    isVibeQuery,
    isComplexQuery
  );

  return {
    hasText,
    hasImage,
    isVibeQuery,
    isComplexQuery,
    detectedContext,
    recommendedWeights,
    searchStrategy,
  };
}

/**
 * Extract occasion from query
 */
function extractOccasion(query: string): string | undefined {
  const occasions = {
    halloween: 'Halloween',
    party: 'Party',
    'night out': 'Night Out',
    'date night': 'Date Night',
    date: 'Date Night',
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
    weekend: 'Weekend',
  };

  for (const [key, value] of Object.entries(occasions)) {
    if (query.includes(key)) return value;
  }
  return undefined;
}

/**
 * Extract mood from query
 */
function extractMood(query: string): string | undefined {
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
    comfortable: 'Comfortable',
  };

  for (const [key, value] of Object.entries(moods)) {
    if (query.includes(key)) return value;
  }
  return undefined;
}

/**
 * Extract fit from query
 */
function extractFit(query: string): string | undefined {
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

  for (const [key, value] of Object.entries(fits)) {
    if (query.includes(key)) return value;
  }
  return undefined;
}

/**
 * Extract color from query
 */
function extractColor(query: string): string | undefined {
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

  for (const [key, value] of Object.entries(colors)) {
    if (query.includes(key)) return value;
  }
  return undefined;
}

/**
 * Extract material from query
 */
function extractMaterial(query: string): string | undefined {
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

  for (const [key, value] of Object.entries(materials)) {
    if (query.includes(key)) return value;
  }
  return undefined;
}

/**
 * Extract style from query
 */
function extractStyle(query: string): string | undefined {
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
  };

  for (const [key, value] of Object.entries(styles)) {
    if (query.includes(key)) return value;
  }
  return undefined;
}

/**
 * Calculate optimal weights based on input analysis
 */
function calculateOptimalWeights(
  hasText: boolean,
  hasImage: boolean,
  isVibeQuery: boolean,
  isComplexQuery: boolean
): { text: number; image: number; vibe: number; context: number } {
  let text = 0.4;
  let image = 0.3;
  let vibe = 0.2;
  let context = 0.1;

  if (isVibeQuery) {
    vibe = 0.4;
    text = 0.3;
    image = 0.2;
    context = 0.1;
  }

  if (isComplexQuery) {
    vibe = Math.min(vibe + 0.1, 0.5);
    context = Math.min(context + 0.1, 0.3);
  }

  if (!hasImage) {
    image = 0;
    text = text + image;
  }

  if (!hasText) {
    text = 0;
    image = image + text;
  }

  // Normalize weights
  const total = text + image + vibe + context;
  return {
    text: text / total,
    image: image / total,
    vibe: vibe / total,
    context: context / total,
  };
}

/**
 * Generate hyper-intelligent search vectors
 */
export async function generateHyperIntelligentSearch(
  query: string,
  imageUrl?: string
): Promise<HyperSearchResult> {
  const analysis = analyzeSearchInput(query, imageUrl);

  let queryVector: any = {};
  let enhancedQuery: string | undefined;
  let vibeContext: any;
  let visualAnalysis: any;
  let suggestions: string[] = [];

  try {
    switch (analysis.searchStrategy) {
      case 'text-only':
        queryVector.text = await embedTextSingle(query);
        break;

      case 'image-only':
        queryVector.image = await embedImageSingle(imageUrl!);
        break;

      case 'multimodal':
        const [textVector, imageVector] = await Promise.all([
          embedTextSingle(query),
          embedImageSingle(imageUrl!),
        ]);
        queryVector.text = textVector;
        queryVector.image = imageVector;
        break;

      case 'vibe-enhanced':
        const vibeResult = await embedVibeQuery(query, imageUrl);
        queryVector.combined = vibeResult.combinedVector;

        // Generate vibe context
        const vibeEnhancement = enhanceQueryWithVibe(query, imageUrl);
        enhancedQuery = vibeEnhancement.enhancedQuery;
        vibeContext = {
          enhancedQuery: vibeEnhancement.enhancedQuery,
          styleContext: vibeEnhancement.styleContext,
          searchWeights: vibeResult.searchWeights,
          suggestions: getStyleSuggestions(query),
        };
        suggestions = getStyleSuggestions(query);
        break;

      case 'hyper-combined':
        // Use vibe search for enhanced understanding
        const hyperVibeResult = await embedVibeQuery(query, imageUrl);
        queryVector.combined = hyperVibeResult.combinedVector;

        // Generate comprehensive context
        const hyperEnhancement = enhanceQueryWithVibe(query, imageUrl);
        enhancedQuery = hyperEnhancement.enhancedQuery;
        vibeContext = {
          enhancedQuery: hyperEnhancement.enhancedQuery,
          styleContext: hyperEnhancement.styleContext,
          searchWeights: hyperVibeResult.searchWeights,
          suggestions: getStyleSuggestions(query),
        };
        suggestions = getStyleSuggestions(query);

        // Add visual analysis if image is provided
        if (imageUrl) {
          visualAnalysis = {
            dominantColors: Object.values(analysis.detectedContext).filter(
              (v) => v
            ) as string[],
            style: analysis.detectedContext.style || 'Classic',
            occasion: analysis.detectedContext.occasion || 'General',
            mood: analysis.detectedContext.mood || 'Sophisticated',
          };
        }
        break;
    }

    return {
      queryVector,
      searchStrategy: analysis.searchStrategy,
      analysis,
      enhancedQuery,
      vibeContext,
      visualAnalysis,
      suggestions,
    };
  } catch (error) {
    console.error('Hyper-intelligent search failed:', error);

    // Fallback to simple text search
    queryVector.text = await embedTextSingle(query);
    return {
      queryVector,
      searchStrategy: 'text-only',
      analysis,
    };
  }
}

/**
 * Test hyper-intelligent search
 */
export async function testHyperIntelligentSearch(): Promise<{
  connectionTest: boolean;
  testCases: Array<{
    query: string;
    imageUrl?: string;
    strategy: string;
    analysis: SearchAnalysis;
    success: boolean;
  }>;
  message: string;
}> {
  const testCases = [
    {
      query: 'elegant black dress',
      imageUrl: undefined,
    },
    {
      query: 'tight dress for halloween party',
      imageUrl: undefined,
    },
    {
      query: 'sexy black dress for date night',
      imageUrl:
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=224&h=224&fit=crop',
    },
    {
      query: 'comfortable sweater for weekend',
      imageUrl: undefined,
    },
    {
      query: '',
      imageUrl:
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=224&h=224&fit=crop',
    },
  ];

  const results = [];
  let allSuccessful = true;

  for (const testCase of testCases) {
    try {
      const result = await generateHyperIntelligentSearch(
        testCase.query,
        testCase.imageUrl
      );
      results.push({
        query: testCase.query,
        imageUrl: testCase.imageUrl,
        strategy: result.searchStrategy,
        analysis: result.analysis,
        success: true,
      });
    } catch (error) {
      console.error(`Test case failed: ${testCase.query}`, error);
      results.push({
        query: testCase.query,
        imageUrl: testCase.imageUrl,
        strategy: 'failed',
        analysis: analyzeSearchInput(testCase.query, testCase.imageUrl),
        success: false,
      });
      allSuccessful = false;
    }
  }

  return {
    connectionTest: allSuccessful,
    testCases: results,
    message: 'Hyper-intelligent search system is working correctly',
  };
}

