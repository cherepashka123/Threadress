import { NextResponse } from 'next/server';
import { testHuggingFace, embedSingle, EMBEDDING_DIM } from '@/lib/huggingface';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing Hugging Face connection...');

    // Test basic connection
    const connectionTest = await testHuggingFace();

    if (!connectionTest) {
      return NextResponse.json({
        ok: false,
        error: 'Hugging Face connection failed',
      });
    }

    // Test single embedding
    const testText =
      '2-In-1 Knit Bandeau Cardigan | Tops | Black | Ribbed knit';
    const embedding = await embedSingle(testText);

    return NextResponse.json({
      ok: true,
      connectionTest,
      embeddingLength: embedding.length,
      expectedLength: EMBEDDING_DIM,
      embeddingPreview: embedding.slice(0, 5),
      message: 'Hugging Face is working correctly',
    });
  } catch (err) {
    console.error('Hugging Face test error:', err);
    return NextResponse.json(
      {
        ok: false,
        error: 'Hugging Face test failed',
        details: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}


