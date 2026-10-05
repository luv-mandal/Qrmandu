export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { findOne } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const admin = findOne('admin_users', (a:any)=>a.email.toLowerCase()===email.toLowerCase());
  if (!admin) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const ok = await verifyPassword(password, admin.password_hash);
  if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const token = await signToken({ id: admin.id, email: admin.email, role: 'admin' });
  const res = NextResponse.json({ success: true });
  res.cookies.set('qrmandu_admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60*60*24*7,
    path: '/',
  });
  res.cookies.set('qrmandu_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60*60*24*7,
    path: '/',
  });
  return res;
}
