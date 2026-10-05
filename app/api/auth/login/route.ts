import { NextRequest, NextResponse } from 'next/server';
import { findOne } from '@/lib/db';
import { verifyPassword, signToken, validateEmail } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });

    // Check admin first? No, admin login separate, but allow admin via same endpoint? We'll check both.
    const user = findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
    const admin = findOne('admin_users', (a) => a.email.toLowerCase() === email.toLowerCase());

    if (admin) {
      const ok = await verifyPassword(password, admin.password_hash);
      if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      const token = await signToken({ id: admin.id, email: admin.email, role: 'admin' });
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
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = await signToken({ id: user.id, email: user.email });
    const res = NextResponse.json({ success: true });
    res.cookies.set('qrmandu_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
