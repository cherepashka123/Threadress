import { NextResponse } from 'next/server';
import { testCLIPAdvanced } from '@/lib/clip-advanced';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await testCLIPAdvanced();

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (err) {
    console.error('CLIP advanced test error:', err);
    return NextResponse.json(
      {
        ok: false,
        error: 'CLIP advanced test failed',
        details: (err as Error).message,
      },
      { status: 500 }
    );
  }
}

