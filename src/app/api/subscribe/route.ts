// src/app/api/subscribe/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();
  console.log('New signup:', email);
  return NextResponse.json({ success: true });
}
