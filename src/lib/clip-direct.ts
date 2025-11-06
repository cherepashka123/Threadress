/**
 * Direct CLIP embedding service client
 * Connects to local Python CLIP service instead of Hugging Face
 * NOTE: Only works in local development - always uses Hugging Face in production
 */

// Normalize CLIP_SERVICE_URL to always include protocol
function normalizeClipServiceUrl(): string {
  const url = process.env.CLIP_SERVICE_URL || 'http://localhost:8001';
  // If URL doesn't start with http:// or https://, add https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

const CLIP_SERVICE_URL = normalizeClipServiceUrl();

// Check if CLIP service is available
export async function checkClipService(): Promise<boolean> {
  // If CLIP_SERVICE_URL points to localhost, only use it in development
  if (CLIP_SERVICE_URL.includes('localhost') || CLIP_SERVICE_URL.includes('127.0.0.1')) {
    // Localhost only works in development (not on Vercel)
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      return false;
    }
    // Only try localhost in development
    if (process.env.NODE_ENV !== 'development') {
      return false;
    }
  }
  
  // If CLIP_SERVICE_URL is set to a remote URL (not localhost), allow it in production
  // This enables deploying CLIP service separately (e.g., on a VPS, AWS EC2, etc.)
  // Example: CLIP_SERVICE_URL=https://clip-api.yourdomain.com
  
  try {
    const healthUrl = `${CLIP_SERVICE_URL}/health`;
    console.log(`🔍 Checking CLIP service health: ${healthUrl}`);
    const response = await fetch(healthUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(10000), // 10 seconds - Railway may be slow to respond, especially on cold start
    });
    const isOk = response.ok;
    console.log(`🔍 CLIP service health check: ${isOk ? 'OK' : 'FAILED'} (${response.status})`);
    return isOk;
  } catch (error: any) {
    console.warn(`⚠️ CLIP service health check failed:`, error.message);
    // Don't immediately give up - Railway might be cold-starting
    // Return false but log that we'll retry on actual embedding requests
    return false;
  }
}

/**
 * Generate image embeddings using local CLIP service
 */
export async function embedImageSingle(imageUrl: string): Promise<number[]> {
  // Soft check - don't fail immediately if health check fails
  // Railway might be cold-starting or slow, but embedding request might still work
  const isAvailable = await checkClipService();
  if (!isAvailable) {
    console.warn(`⚠️ CLIP service health check failed, but trying image embedding request anyway. URL: ${CLIP_SERVICE_URL}`);
    // Don't throw - try the actual request anyway
  }

  try {
    const response = await fetch(`${CLIP_SERVICE_URL}/embed/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl }),
      signal: AbortSignal.timeout(90000), // 90 second timeout - CLIP model loading can take 30-60s on Railway cold start
    });

    if (!response.ok) {
      throw new Error(`CLIP service error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.ok && data.embedding) {
      return data.embedding;
    }

    throw new Error('Invalid response from CLIP service');
  } catch (error) {
    console.error(`CLIP image embedding failed for ${imageUrl}:`, error);
    // Return zero vector as fallback
    return new Array(512).fill(0);
  }
}

/**
 * Generate image embeddings in batch
 */
export async function embedImageBatch(
  imageUrls: string[]
): Promise<number[][]> {
  if (imageUrls.length === 0) return [];

  // Check if service is available first
  const isAvailable = await checkClipService();
  if (!isAvailable) {
    throw new Error('CLIP service not available');
  }

  try {
    const response = await fetch(`${CLIP_SERVICE_URL}/embed/image/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_urls: imageUrls }),
      signal: AbortSignal.timeout(60000), // 60 second timeout for batch
    });

    if (!response.ok) {
      throw new Error(`CLIP service error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.ok && data.embeddings) {
      return data.embeddings;
    }

    throw new Error('Invalid response from CLIP service');
  } catch (error) {
    console.error('CLIP batch image embedding failed:', error);
    // Return zero vectors as fallback
    return imageUrls.map(() => new Array(512).fill(0));
  }
}

/**
 * Generate text embeddings using local CLIP service
 * Includes retry logic for Railway cold starts (502 errors)
 */
export async function embedTextSingle(text: string): Promise<number[]> {
  // Soft check - don't fail immediately if health check fails
  // Railway might be cold-starting or slow, but embedding request might still work
  const isAvailable = await checkClipService();
  if (!isAvailable) {
    console.warn(`⚠️ CLIP service health check failed, but trying embedding request anyway. URL: ${CLIP_SERVICE_URL}`);
    // Don't throw - try the actual request anyway
  }
  
  const maxRetries = 2; // Retry up to 2 times
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        // Wait before retrying (exponential backoff: 5s, 10s)
        const waitTime = 5000 * attempt;
        console.log(`⏳ Retrying CLIP text embedding (attempt ${attempt + 1}/${maxRetries + 1}) after ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      
      console.log(`📤 Sending text embedding request to CLIP service: "${text.substring(0, 50)}..."`);
      const response = await fetch(`${CLIP_SERVICE_URL}/embed/text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: AbortSignal.timeout(60000), // 60 second timeout - Vercel pro tier max is 60s
      });

      if (!response.ok) {
        // If it's a 502 (Bad Gateway), it might be a cold start - retry
        if (response.status === 502 && attempt < maxRetries) {
          const errorText = await response.text().catch(() => '');
          console.warn(`⚠️ CLIP service returned 502 (likely cold start), will retry... (attempt ${attempt + 1}/${maxRetries + 1})`);
          lastError = new Error(`CLIP service error: ${response.statusText}`);
          continue; // Retry
        }
        
        // For other errors or final attempt, throw
        const errorText = await response.text();
        console.error(`❌ CLIP service error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`CLIP service error: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.ok && data.embedding) {
        console.log(`✅ CLIP text embedding received: ${data.embedding.length} dim, non-zero: ${data.embedding.some((v: number) => v !== 0)}`);
        return data.embedding;
      }

      throw new Error('Invalid response from CLIP service');
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // If it's a timeout or network error and we have retries left, retry
      if (
        attempt < maxRetries && 
        (lastError.message.includes('timeout') || 
         lastError.message.includes('fetch failed') ||
         lastError.message.includes('502'))
      ) {
        console.warn(`⚠️ CLIP request failed (attempt ${attempt + 1}/${maxRetries + 1}), will retry:`, lastError.message);
        continue;
      }
      
      // Log errors in production for debugging
      console.error(`❌ CLIP text embedding failed for "${text.substring(0, 50)}...":`, lastError.message);
      // Throw error so caller can fall back to Hugging Face
      throw lastError;
    }
  }
  
  // Should never reach here, but TypeScript needs it
  throw lastError || new Error('CLIP service failed after retries');
}

/**
 * Generate text embeddings in batch
 */
export async function embedTextBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];

  // Check if service is available first (will return false in production)
  const isAvailable = await checkClipService();
  if (!isAvailable) {
    throw new Error('CLIP service not available');
  }

  try {
    const response = await fetch(`${CLIP_SERVICE_URL}/embed/text/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts }),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`CLIP service error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.ok && data.embeddings) {
      return data.embeddings;
    }

    throw new Error('Invalid response from CLIP service');
  } catch (error) {
    // Don't log errors in production - they're expected when service isn't available
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('CLIP batch text embedding failed:', error);
    }
    // Throw error so caller can fall back to Hugging Face
    throw error;
  }
}

