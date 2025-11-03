import { NextResponse } from 'next/server';
import {
  testAdvancedMultimodal,
  embedTextSingle,
  embedImageSingle,
  embedMultimodalQuery,
} from '@/lib/advanced-multimodal';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing advanced multimodal functionality...');

    // Test basic functionality
    const connectionTest = await testAdvancedMultimodal();

    if (!connectionTest) {
      return NextResponse.json({
        ok: false,
        error: 'Advanced multimodal connection failed',
      });
    }

    // Test text embedding
    const testText = 'elegant black dress for evening';
    const textEmbedding = await embedTextSingle(testText);

    // Test image embedding with a fashion image URL
    const testImageUrl =
      'https://www.manieredevoir.com/cdn/shop/files/MDV_0000_MDV4_d3b35c14-82e8-451f-b081-d4e615679a73.jpg?v=1758728595';
    const imageEmbedding = await embedImageSingle(testImageUrl);

    // Test combined multimodal query with different weights
    const { textVector, imageVector, combinedVector } =
      await embedMultimodalQuery(testText, testImageUrl, 0.6, 0.4);

    // Test with different weight combinations
    const { combinedVector: textHeavy } = await embedMultimodalQuery(
      testText,
      testImageUrl,
      0.8,
      0.2
    );

    const { combinedVector: imageHeavy } = await embedMultimodalQuery(
      testText,
      testImageUrl,
      0.3,
      0.7
    );

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
      weightVariations: {
        balanced: {
          weights: { text: 0.6, image: 0.4 },
          preview: combinedVector.slice(0, 5),
        },
        textHeavy: {
          weights: { text: 0.8, image: 0.2 },
          preview: textHeavy.slice(0, 5),
        },
        imageHeavy: {
          weights: { text: 0.3, image: 0.7 },
          preview: imageHeavy.slice(0, 5),
        },
      },
      message: 'Advanced multimodal functionality is working correctly',
    });
  } catch (err) {
    console.error('Advanced multimodal test error:', err);
    return NextResponse.json(
      {
        ok: false,
        error: 'Advanced multimodal test failed',
        details: err?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
