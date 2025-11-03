import { NextResponse } from 'next/server';
import { testRealCLIP } from '@/lib/real-clip-multimodal';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await testRealCLIP();

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (err) {
    console.error('Real CLIP test error:', err);
    return NextResponse.json(
      {
        ok: false,
        error: 'Real CLIP test failed',
        details: (err as Error).message,
      },
      { status: 500 }
    );
  }
}

