/**
 * Typo tolerance utilities for search queries
 * Provides fuzzy matching and typo correction for better search results
 */

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}

/**
 * Calculate similarity ratio (0-1) between two strings
 */
function similarityRatio(str1: string, str2: string): number {
  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1.0;
  const distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLen;
}

/**
 * Common fashion/clothing term corrections
 */
const FASHION_TERMS: Record<string, string[]> = {
  dress: ['dres', 'dreses', 'dresess', 'dresz', 'drss'],
  cardigan: ['cardign', 'cardgan', 'cardigan', 'cardign'],
  sweater: ['sweater', 'sweeter', 'sweter', 'swaeter'],
  jacket: ['jacket', 'jackett', 'jaket', 'jakcet'],
  shirt: ['shirt', 'shrit', 'shirt', 'shrt'],
  pants: ['pants', 'pant', 'pnts', 'pantz'],
  jeans: ['jeans', 'jean', 'jeens', 'jens'],
  blouse: ['blouse', 'blouce', 'bluse', 'blouze'],
  skirt: ['skirt', 'skrt', 'skrit', 'skirt'],
  top: ['top', 'tp', 'top', 'topp'],
  black: ['black', 'blak', 'blck', 'blac'],
  white: ['white', 'whit', 'whte', 'whit'],
  red: ['red', 're', 'red', 'rd'],
  blue: ['blue', 'blu', 'bleu', 'blu'],
  elegant: ['elegant', 'elegnt', 'elgant', 'elegan'],
  casual: ['casual', 'casul', 'casul', 'casula'],
  formal: ['formal', 'forml', 'forml', 'forma'],
  sexy: ['sexy', 'secy', 'sex', 'sex'],
  vintage: ['vintage', 'vintag', 'vintge', 'vintag'],
  silk: ['silk', 'sil', 'slik', 'silk'],
  cotton: ['cotton', 'coton', 'cotn', 'cottn'],
  leather: ['leather', 'lether', 'leathr', 'leathe'],
};

/**
 * Expand query with common typo variations
 */
export function expandQueryWithTypos(query: string): string {
  const lowerQuery = query.toLowerCase();
  const words = lowerQuery.split(/\s+/);
  const expandedWords: string[] = [];

  for (const word of words) {
    expandedWords.push(word);

    // Check if word matches any known fashion terms (with typos)
    for (const [correct, variations] of Object.entries(FASHION_TERMS)) {
      // Check if current word is similar to variations
      for (const variation of variations) {
        if (similarityRatio(word, variation) > 0.7) {
          // Add the correct term
          if (!expandedWords.includes(correct)) {
            expandedWords.push(correct);
          }
        }
      }

      // Check if current word is similar to correct term
      if (similarityRatio(word, correct) > 0.7 && word !== correct) {
        if (!expandedWords.includes(correct)) {
          expandedWords.push(correct);
        }
      }
    }
  }

  // Return original query + expanded version
  const expanded = expandedWords.join(' ');
  return expanded !== lowerQuery ? `${query} ${expanded}` : query;
}

/**
 * Enhance query with typo tolerance
 * This function normalizes the query and adds common variations
 */
export function enhanceQueryForTypoTolerance(query: string): string {
  if (!query || query.trim().length === 0) return query;

  // Normalize query
  let enhanced = query.toLowerCase().trim();

  // Expand with typo variations
  enhanced = expandQueryWithTypos(enhanced);

  // Remove duplicate words while preserving order
  const words = enhanced.split(/\s+/);
  const uniqueWords = Array.from(new Set(words));
  enhanced = uniqueWords.join(' ');

  return enhanced;
}

/**
 * Fuzzy match two strings (handles typos)
 */
export function fuzzyMatch(
  str1: string,
  str2: string,
  threshold: number = 0.7
): boolean {
  return similarityRatio(str1.toLowerCase(), str2.toLowerCase()) >= threshold;
}

/**
 * Find best matching term from a list of terms (typo tolerant)
 */
export function findBestMatch(
  query: string,
  terms: string[],
  threshold: number = 0.6
): string | null {
  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const term of terms) {
    const score = similarityRatio(query.toLowerCase(), term.toLowerCase());
    if (score > bestScore && score >= threshold) {
      bestScore = score;
      bestMatch = term;
    }
  }

  return bestMatch;
}

/**
 * Test typo tolerance functionality
 */
export function testTypoTolerance(): {
  test: string;
  enhanced: string;
  passed: boolean;
}[] {
  const testCases = [
    { query: 'dres for party', expected: 'dress' },
    { query: 'blak cardgn', expected: 'black cardigan' },
    { query: 'elegnt silk drss', expected: 'elegant silk dress' },
    { query: 'casul sweter', expected: 'casual sweater' },
  ];

  return testCases.map(({ query, expected }) => {
    const enhanced = enhanceQueryForTypoTolerance(query);
    const passed = fuzzyMatch(enhanced, expected);
    return { test: query, enhanced, passed };
  });
}
