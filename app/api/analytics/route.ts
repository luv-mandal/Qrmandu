import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { findOne, findMany } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const business = findOne('businesses', (b:any)=>b.user_id===user.id);
  if (!business) return NextResponse.json({ error: 'No business' }, { status: 404 });

  const events = findMany('analytics_events', (e:any)=>e.business_id===business.id);
  const sessions = findMany('review_sessions', (s:any)=>s.business_id===business.id);
  const qrCodes = findMany('qr_codes', (q:any)=>q.business_id===business.id);

  return NextResponse.json({ business, events, sessions, qrCodes });
}
