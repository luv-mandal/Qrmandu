export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { findOne, updateOne, insertOne } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { action, id } = await req.json();
  const business = findOne('businesses', (b:any)=>b.id===id);
  if (!business) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (action === 'suspend') {
    updateOne('businesses', id, { status: 'suspended' });
  } else if (action === 'activate') {
    updateOne('businesses', id, { status: 'active' });
  } else if (action === 'extend') {
    const newExp = new Date(Date.now() + 30*24*60*60*1000).toISOString();
    updateOne('businesses', id, { subscription_expires_at: newExp, subscription_status: 'active', status: 'active' });
  }

  insertOne('audit_logs', {
    id: uuidv4(),
    admin_id: admin.id,
    action: `business_${action}`,
    target_type: 'business',
    target_id: id,
    details: { action },
    created_at: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
