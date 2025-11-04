import { NextResponse } from 'next/server';
import {
  testCLIPMultimodal,
  embedTextSingle,
  embedImageSingle,
  embedMultimodalQuery,
} from '@/lib/clip-multimodal';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing CLIP multimodal functionality...');

    // Test basic CLIP functionality
    const connectionTest = await testCLIPMultimodal();

    if (!connectionTest) {
      return NextResponse.json({
        ok: false,
        error: 'CLIP multimodal connection failed',
      });
    }

    // Test text embedding
    const testText = 'elegant black dress for evening';
    const textEmbedding = await embedTextSingle(testText);

    // Test image embedding with a real fashion image
    const testImageUrl =
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=224&h=224&fit=crop';
    const imageEmbedding = await embedImageSingle(testImageUrl);

    // Test combined multimodal query
    const { textVector, imageVector, combinedVector } =
      await embedMultimodalQuery(testText, testImageUrl, 0.6, 0.4);

    return NextResponse.json({
      ok: true,
      connectionTest,
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
      message: 'CLIP multimodal functionality is working correctly',
    });
  } catch (err) {
    console.error('CLIP test error:', err);
    return NextResponse.json(
      {
        ok: false,
        error: 'CLIP test failed',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
