import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// POST /api/auth  → guarda token en cookie httpOnly
export async function POST(request: Request) {
  const { token } = await request.json();
  const store = await cookies();
  store.set('at_token', token, {
    httpOnly: false, // necesario para leerlo en cliente al hacer fetch
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
  });
  return NextResponse.json({ ok: true });
}

// DELETE /api/auth  → borra el token (logout)
export async function DELETE() {
  const store = await cookies();
  store.delete('at_token');
  return NextResponse.json({ ok: true });
}
