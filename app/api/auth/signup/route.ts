export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { findOne, insertOne } from '@/lib/db';
import { hashPassword, signToken, validateEmail } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    const { email, password } = body;

    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    if (!validateEmail(email)) return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });

    let existing;
    try {
      existing = findOne('users', (u) => u.email.toLowerCase() === email.toLowerCase());
    } catch (dbErr: any) {
      console.error('DB findOne error:', dbErr);
      return NextResponse.json({ error: `Database read error: ${dbErr?.message || 'unknown'}` }, { status: 500 });
    }
    
    if (existing) return NextResponse.json({ error: 'Email already exists' }, { status: 400 });

    let password_hash;
    try {
      password_hash = await hashPassword(password);
    } catch (hashErr: any) {
      console.error('Hash error:', hashErr);
      return NextResponse.json({ error: `Password hashing failed: ${hashErr?.message}` }, { status: 500 });
    }

    const now = new Date();
    const trialExpires = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    let user;
    try {
      user = insertOne('users', {
        id: uuidv4(),
        email: email.toLowerCase(),
        password_hash,
        trial_started_at: now.toISOString(),
        trial_expires_at: trialExpires.toISOString(),
        created_at: now.toISOString(),
      });
    } catch (insertErr: any) {
      console.error('DB insert error:', insertErr);
      return NextResponse.json({ error: `Database write error: ${insertErr?.message || 'unknown'}` }, { status: 500 });
    }

    let token;
    try {
      token = await signToken({ id: user.id, email: user.email });
    } catch (tokenErr: any) {
      console.error('Token error:', tokenErr);
      return NextResponse.json({ error: `Token creation failed: ${tokenErr?.message}` }, { status: 500 });
    }

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
    console.error('Signup unhandled error:', e, e?.stack);
    return NextResponse.json({ error: `Server error: ${e?.message || 'unknown'}`, stack: process.env.NODE_ENV !== 'production' ? e?.stack : undefined }, { status: 500 });
  }
}
