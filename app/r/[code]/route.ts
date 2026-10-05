import { NextRequest, NextResponse } from 'next/server';
import { findOne, insertOne, updateOne } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest, { params }: { params: { code: string } }) {
  const code = params.code;
  const qr = findOne('qr_codes', (q:any)=>q.code===code);
  if (!qr) {
    return new NextResponse('QR code not found', { status: 404 });
  }

  const business = findOne('businesses', (b:any)=>b.id===qr.business_id);
  if (!business) {
    return new NextResponse('Business not found', { status: 404 });
  }

  // Track scan
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.ip || 'unknown';
  try {
    insertOne('analytics_events', {
      id: uuidv4(),
      business_id: business.id,
      event_type: 'qr_scan',
      qr_code_id: qr.id,
      metadata: { code },
      created_at: new Date().toISOString(),
      ip,
    });
    updateOne('qr_codes', qr.id, { scan_count: (qr.scan_count||0)+1 });
  } catch {}

  // Redirect to review page
  const url = new URL(`/review/${business.id}`, req.url);
  url.searchParams.set('qr', code);
  return NextResponse.redirect(url, 302);
}
