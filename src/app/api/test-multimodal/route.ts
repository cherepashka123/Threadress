import { NextResponse } from 'next/server';
import {
  testMultimodal,
  embedTextSingle,
  embedImageSingle,
} from '@/lib/simple-multimodal';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing multimodal functionality...');

    // Test basic multimodal functionality
    const connectionTest = await testMultimodal();

    if (!connectionTest) {
      return NextResponse.json({
        ok: false,
        error: 'Multimodal connection failed',
      });
    }

    // Test text embedding
    const testText = 'elegant black dress for evening';
    const textEmbedding = await embedTextSingle(testText);

    // Test image embedding with a sample image
    const testImageUrl = 'https://via.placeholder.com/224x224.jpg';
    const imageEmbedding = await embedImageSingle(testImageUrl);

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
      message: 'Multimodal functionality is working correctly',
    });
  } catch (err) {
    console.error('Multimodal test error:', err);
    return NextResponse.json(
      {
        ok: false,
        error: 'Multimodal test failed',
        details: err?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
