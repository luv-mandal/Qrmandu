export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { findOne } from '@/lib/db';
import { verifyPassword, signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    const { email, password } = body;
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

    let user, admin;
    try {
      user = findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
      admin = findOne('admin_users', (a) => a.email.toLowerCase() === email.toLowerCase());
    } catch (dbErr: any) {
      console.error('DB read error:', dbErr);
      return NextResponse.json({ error: `Database error: ${dbErr?.message}` }, { status: 500 });
    }

    if (admin) {
      let ok;
      try {
        ok = await verifyPassword(password, admin.password_hash);
      } catch (e: any) {
        return NextResponse.json({ error: `Password verify failed: ${e?.message}` }, { status: 500 });
      }
      if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      let token;
      try {
        token = await signToken({ id: admin.id, email: admin.email, role: 'admin' });
      } catch (e: any) {
        return NextResponse.json({ error: `Token failed: ${e?.message}` }, { status: 500 });
      }
      const res = NextResponse.json({ success: true, isAdmin: true });
      res.cookies.set('qrmandu_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      res.cookies.set('qrmandu_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
      return res;
    }

    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    
    let ok;
    try {
      ok = await verifyPassword(password, user.password_hash);
    } catch (e: any) {
      return NextResponse.json({ error: `Verify failed: ${e?.message}` }, { status: 500 });
    }
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    let token;
    try {
      token = await signToken({ id: user.id, email: user.email });
    } catch (e: any) {
      return NextResponse.json({ error: `Token failed: ${e?.message}` }, { status: 500 });
    }
    
    const res = NextResponse.json({ success: true });
    res.cookies.set('qrmandu_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return res;
  } catch (e: any) {
    console.error('Login error:', e, e?.stack);
    return NextResponse.json({ error: `Server error: ${e?.message}`, stack: process.env.NODE_ENV !== 'production' ? e?.stack : undefined }, { status: 500 });
  }
}
