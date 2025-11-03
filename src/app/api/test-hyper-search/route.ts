import { NextResponse } from 'next/server';
import { testHyperIntelligentSearch } from '@/lib/hyper-intelligent-search';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await testHyperIntelligentSearch();

    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (err) {
    console.error('Hyper-intelligent search test error:', err);
    return NextResponse.json(
      {
        ok: false,
        error: 'Hyper-intelligent search test failed',
        details: (err as Error).message,
      },
      { status: 500 }
    );
  }
}

