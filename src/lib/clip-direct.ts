/**
 * Direct CLIP embedding service client
 * Connects to local Python CLIP service instead of Hugging Face
 * NOTE: Only works in local development - always uses Hugging Face in production
 */

const CLIP_SERVICE_URL =
  process.env.CLIP_SERVICE_URL || 'http://localhost:8001';

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
      signal: AbortSignal.timeout(500), // Short timeout - fail fast
    });
    const isOk = response.ok;
    console.log(`🔍 CLIP service health check: ${isOk ? 'OK' : 'FAILED'} (${response.status})`);
    return isOk;
  } catch (error: any) {
    console.warn(`⚠️ CLIP service health check failed:`, error.message);
    return false;
  }
}

/**
 * Generate image embeddings using local CLIP service
 */
export async function embedImageSingle(imageUrl: string): Promise<number[]> {
  // Check if service is available first
  const isAvailable = await checkClipService();
  if (!isAvailable) {
    throw new Error('CLIP service not available');
  }

  try {
    const response = await fetch(`${CLIP_SERVICE_URL}/embed/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl }),
      signal: AbortSignal.timeout(30000), // 30 second timeout for image processing
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
 */
export async function embedTextSingle(text: string): Promise<number[]> {
  // Check if service is available first
  const isAvailable = await checkClipService();
  if (!isAvailable) {
    console.warn(`⚠️ CLIP service not available. URL: ${CLIP_SERVICE_URL}`);
    throw new Error('CLIP service not available');
  }
  
  try {
    console.log(`📤 Sending text embedding request to CLIP service: "${text.substring(0, 50)}..."`);
    const response = await fetch(`${CLIP_SERVICE_URL}/embed/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
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
    // Log errors in production for debugging
    console.error(`❌ CLIP text embedding failed for "${text.substring(0, 50)}...":`, error instanceof Error ? error.message : error);
    // Throw error so caller can fall back to Hugging Face
    throw error;
  }
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

