import { NextRequest, NextResponse } from 'next/server';
import { findOne, insertOne, updateOne, findMany } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { isValidGoogleReviewLink, slugify, generateShortCode } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { name, category, subcategory, custom_category, google_review_link, logo_url, qr_design } = body;

  if (!name || name.trim().length < 2) return NextResponse.json({ error: 'Business name required' }, { status: 400 });
  if (google_review_link && !isValidGoogleReviewLink(google_review_link)) {
    return NextResponse.json({ error: 'Invalid Google Review Page Link. Must be a valid https:// google.com URL like g.page/r/... or search.google.com/local/writereview?placeid=...' }, { status: 400 });
  }

  // Check existing business for user
  let business = findOne('businesses', (b) => b.user_id === user.id);

  const slugBase = slugify(name);
  const slug = business ? business.slug : `${slugBase}-${generateShortCode(4)}`;

  const now = new Date().toISOString();
  const trialExpires = new Date(Date.now() + 24*60*60*1000).toISOString();

  if (business) {
    business = updateOne('businesses', business.id, {
      name: name.trim(),
      category,
      subcategory,
      custom_category,
      google_review_link,
      logo_url,
      qr_design: qr_design ?? business.qr_design ?? 0,
      slug,
      updated_at: now,
    });
  } else {
    business = insertOne('businesses', {
      id: uuidv4(),
      user_id: user.id,
      name: name.trim(),
      category,
      subcategory,
      custom_category,
      google_review_link,
      logo_url,
      qr_design: qr_design ?? 0,
      slug,
      status: 'trial',
      subscription_status: 'trial',
      subscription_plan: null,
      subscription_expires_at: null,
      trial_expires_at: trialExpires,
      created_at: now,
      updated_at: now,
    });
  }

  // Ensure QR code exists
  let qr = findOne('qr_codes', (q) => q.business_id === business.id && q.status === 'active');
  if (!qr) {
    const code = generateShortCode(6);
    qr = insertOne('qr_codes', {
      id: uuidv4(),
      business_id: business.id,
      code,
      design_index: qr_design ?? 0,
      name: `${business.name} QR`,
      url: `/r/${code}`,
      scan_count: 0,
      status: 'active',
      created_at: now,
    });
  } else {
    // update design if changed
    if (typeof qr_design === 'number' && qr.design_index !== qr_design) {
      qr = updateOne('qr_codes', qr.id, { design_index: qr_design });
    }
  }

  return NextResponse.json({ success: true, business, qr_code: qr });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const business = findOne('businesses', (b) => b.user_id === user.id);
  const qrCodes = business ? findMany('qr_codes', (q) => q.business_id === business.id) : [];
  return NextResponse.json({ business, qrCodes });
}
