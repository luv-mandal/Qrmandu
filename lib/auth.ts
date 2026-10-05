import * as jose from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { findOne, insertOne, readDB } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'qrmandu-dev-secret-key-change-in-production-32chars';
const secret = new TextEncoder().encode(JWT_SECRET);

export type UserPayload = {
  id: string;
  email: string;
  role?: string;
};

export async function hashPassword(pw: string) {
  return bcrypt.hash(pw, 10);
}

export async function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export async function signToken(payload: UserPayload) {
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
  return jwt;
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    return payload as unknown as UserPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('qrmandu_token')?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export async function getCurrentAdmin(): Promise<UserPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('qrmandu_admin_token')?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function rateLimitStore() {
  // simple in-memory rate limiting
  const store = new Map<string, { count: number; reset: number }>();
  return {
    check: (key: string, limit: number, windowMs: number) => {
      const now = Date.now();
      const entry = store.get(key);
      if (!entry || now > entry.reset) {
        store.set(key, { count: 1, reset: now + windowMs });
        return { allowed: true, remaining: limit - 1 };
      }
      if (entry.count >= limit) {
        return { allowed: false, remaining: 0 };
      }
      entry.count++;
      return { allowed: true, remaining: limit - entry.count };
    }
  };
}

// global rate limiter
const globalRateLimiter = rateLimitStore();

export function checkRateLimit(key: string, limit = 10, windowMs = 60000) {
  return globalRateLimiter.check(key, limit, windowMs);
}
