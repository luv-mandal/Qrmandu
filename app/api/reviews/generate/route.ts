import { NextRequest, NextResponse } from 'next/server';
import { findOne, insertOne, updateOne } from '@/lib/db';
import { generateReview } from '@/lib/reviewGenerator';
import { v4 as uuidv4 } from 'uuid';

// Simple in-memory rate limiting per IP
const rateMap = new Map<string, { count: number; reset: number }>();

function checkRateLimit(ip: string, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.ip || 'unknown';
    if (!checkRateLimit(ip, 20, 60000)) {
      return NextResponse.json({ error: 'Too many requests, please wait' }, { status: 429 });
    }

    const { businessId, rating, qrCodeId } = await req.json();
    if (!businessId || !rating) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const numRating = Number(rating);
    if (![1,2,3,4,5].includes(numRating)) return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });

    const business = findOne('businesses', (b:any)=>b.id===businessId);
    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    // Check subscription/trial status for generation limits
    const now = Date.now();
    const trialExp = business.trial_expires_at ? new Date(business.trial_expires_at).getTime() : 0;
    const subExp = business.subscription_expires_at ? new Date(business.subscription_expires_at).getTime() : 0;
    const isActive = subExp > now || trialExp > now;
    // Allow even if expired? For customer flow, allow but log. Business flow requires active to create QR, but customer review should still work for existing QR? Spec says trial expiration leads to subscription. We'll allow review generation even if expired to avoid breaking customer experience, but business dashboard shows expired.
    
    const reviewText = generateReview(numRating as any, {
      name: business.name,
      category: business.category,
      subcategory: business.subcategory,
    });

    const session = insertOne('review_sessions', {
      id: uuidv4(),
      business_id: business.id,
      qr_code_id: qrCodeId || null,
      star_rating: numRating,
      generated_review: reviewText,
      ip,
      user_agent: req.headers.get('user-agent') || '',
      created_at: new Date().toISOString(),
      google_clicked: false,
    });

    // Also log analytics event
    insertOne('analytics_events', {
      id: uuidv4(),
      business_id: business.id,
      event_type: 'star_select',
      qr_code_id: qrCodeId || null,
      metadata: { rating: numRating, session_id: session.id },
      created_at: new Date().toISOString(),
      ip,
    });

    insertOne('analytics_events', {
      id: uuidv4(),
      business_id: business.id,
      event_type: 'review_session',
      qr_code_id: qrCodeId || null,
      metadata: { rating: numRating, session_id: session.id },
      created_at: new Date().toISOString(),
      ip,
    });

    return NextResponse.json({ success: true, review: reviewText, sessionId: session.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
