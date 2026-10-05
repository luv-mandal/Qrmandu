export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { findOne, insertOne, updateOne } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { businessId, event_type, qrCodeId, sessionId } = await req.json();
    if (!businessId || !event_type) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const business = findOne('businesses', (b:any)=>b.id===businessId);
    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

    insertOne('analytics_events', {
      id: uuidv4(),
      business_id: businessId,
      event_type,
      qr_code_id: qrCodeId || null,
      metadata: { sessionId },
      created_at: new Date().toISOString(),
      ip,
    });

    if (event_type === 'google_click' && sessionId) {
      const session = findOne('review_sessions', (s:any)=>s.id===sessionId);
      if (session) {
        updateOne('review_sessions', session.id, { google_clicked: true });
      }
    }

    if (event_type === 'qr_scan' && qrCodeId) {
      const qr = findOne('qr_codes', (q:any)=>q.id===qrCodeId || q.code===qrCodeId);
      if (qr) {
        updateOne('qr_codes', qr.id, { scan_count: (qr.scan_count||0)+1 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
