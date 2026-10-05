import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set('qrmandu_token', '', { httpOnly: true, maxAge: 0, path: '/' });
  res.cookies.set('qrmandu_admin_token', '', { httpOnly: true, maxAge: 0, path: '/' });
  return res;
}
