import { NextResponse } from 'next/server';
import { findOne, findMany } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const business = findOne('businesses', (b) => b.user_id === user.id);
  if (!business) return NextResponse.json({ business: null });
  const qrCodes = findMany('qr_codes', (q) => q.business_id === business.id);
  const activeQr = qrCodes.find((q:any)=>q.status==='active') || qrCodes[0];
  return NextResponse.json({ business, qr_code: activeQr, qrCodes });
}
