import { NextRequest, NextResponse } from 'next/server';
import { findOne, insertOne } from '@/lib/db';
import { hashPassword, signToken, validateEmail } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    if (!validateEmail(email)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });

    const existing = findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 400 });

    const password_hash = await hashPassword(password);
    const now = new Date();
    const trialExpires = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const user = insertOne('users', {
      id: uuidv4(),
      email: email.toLowerCase(),
      password_hash,
      trial_started_at: now.toISOString(),
      trial_expires_at: trialExpires.toISOString(),
      created_at: now.toISOString(),
    });

    const token = await signToken({ id: user.id, email: user.email });

    const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
    res.cookies.set('qrmandu_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return res;
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
