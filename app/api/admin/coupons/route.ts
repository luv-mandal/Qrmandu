import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { insertOne } from '@/lib/db';
import { generateCouponCode } from '@/lib/reviewGenerator';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin || admin.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { plan_id, business_id, expires_days } = await req.json();
  if (!plan_id) return NextResponse.json({ error: 'Plan required' }, { status: 400 });

  const now = new Date();
  const expires = new Date(now.getTime() + (expires_days || 30)*24*60*60*1000);

  const coupon = insertOne('coupons', {
    id: uuidv4(),
    code: generateCouponCode(),
    plan_id,
    business_id: business_id || null,
    status: 'UNUSED',
    created_at: now.toISOString(),
    redeemed_at: null,
    expires_at: expires.toISOString(),
    created_by_admin_id: admin.id,
  });

  insertOne('audit_logs', {
    id: uuidv4(),
    admin_id: admin.id,
    action: 'coupon_created',
    target_type: 'coupon',
    target_id: coupon.id,
    details: { code: coupon.code, plan_id, business_id },
    created_at: now.toISOString(),
  });

  return NextResponse.json({ success: true, coupon });
}
