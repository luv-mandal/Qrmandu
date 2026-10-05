import { NextRequest, NextResponse } from 'next/server';
import { findOne, updateOne, insertOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { code, businessId } = await req.json();
  if (!code) return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });

  const coupon = findOne('coupons', (c:any)=>c.code===code.trim().toUpperCase());
  if (!coupon) return NextResponse.json({ error: 'Invalid coupon' }, { status: 400 });

  if (coupon.status === 'REDEEMED') return NextResponse.json({ error: 'Coupon already used' }, { status: 400 });
  if (coupon.status === 'EXPIRED') return NextResponse.json({ error: 'Coupon expired' }, { status: 400 });
  if (coupon.status !== 'UNUSED') return NextResponse.json({ error: `Coupon ${coupon.status}` }, { status: 400 });

  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
    updateOne('coupons', coupon.id, { status: 'EXPIRED' });
    return NextResponse.json({ error: 'Coupon expired' }, { status: 400 });
  }

  // If coupon assigned to specific business, check
  if (coupon.business_id && coupon.business_id !== businessId) {
    return NextResponse.json({ error: 'Coupon not assigned to this business' }, { status: 400 });
  }

  const business = findOne('businesses', (b:any)=>b.id===businessId && b.user_id===user.id);
  if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 });

  const now = new Date();
  const expires = new Date(now.getTime() + 30*24*60*60*1000); // 1 month

  // Update coupon
  updateOne('coupons', coupon.id, {
    status: 'REDEEMED',
    redeemed_at: now.toISOString(),
    business_id: business.id,
  });

  // Update business subscription
  const updatedBusiness = updateOne('businesses', business.id, {
    subscription_status: 'active',
    subscription_plan: coupon.plan_id,
    subscription_expires_at: expires.toISOString(),
    status: 'active',
  });

  // Create subscription record
  const subscription = insertOne('subscriptions', {
    id: uuidv4(),
    business_id: business.id,
    plan_id: coupon.plan_id,
    status: 'active',
    started_at: now.toISOString(),
    expires_at: expires.toISOString(),
    coupon_id: coupon.id,
  });

  // Audit log
  insertOne('audit_logs', {
    id: uuidv4(),
    admin_id: coupon.created_by_admin_id || null,
    action: 'coupon_redeemed',
    target_type: 'coupon',
    target_id: coupon.id,
    details: { business_id: business.id, user_id: user.id, plan_id: coupon.plan_id },
    created_at: now.toISOString(),
  });

  return NextResponse.json({ success: true, business: updatedBusiness, subscription });
}
