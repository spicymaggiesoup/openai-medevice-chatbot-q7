// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db';

// (선택) Node 런타임 고정하고 싶으면 아래 주석 해제
// export const runtime = 'nodejs';

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json({ ok: true, users });
  } catch (e) {
    console.error('GET /api/users error:', e);
    return NextResponse.json({ ok: false, error: 'DB error' }, { status: 500 });
  }
}
