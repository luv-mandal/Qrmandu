import { findOne } from '@/lib/db';
import { notFound } from 'next/navigation';
import ReviewClient from '@/components/review/review-client';

export const dynamic = 'force-static';
export const dynamicParams = true;

export function generateStaticParams() {
  return [];
}

export default function ReviewPage({ params, searchParams }: { params: { id: string }, searchParams: { qr?: string } }) {
  try {
    const business = findOne('businesses', (b:any)=>b.id===params.id || b.slug===params.id);
    if (!business) {
      // For static export, show placeholder
      if (process.env.NEXT_PHASE === 'phase-export' || process.env.NODE_ENV === 'production') {
        return <ReviewClient business={{ id: params.id, name: 'Demo Business', category: 'Retail', subcategory: 'Shop', logo_url: '', google_review_link: 'https://g.page/r/demo/review' }} qrCode={{ code: 'demo123' }} />;
      }
      return notFound();
    }
    const qrCode = searchParams?.qr ? findOne('qr_codes', (q:any)=>q.code===searchParams.qr) : findOne('qr_codes', (q:any)=>q.business_id===business.id && q.status==='active');
    return <ReviewClient business={business} qrCode={qrCode} />;
  } catch {
    return <ReviewClient business={{ id: params.id, name: 'Demo Business', category: 'Retail', subcategory: 'Shop', logo_url: '', google_review_link: 'https://g.page/r/demo/review' }} qrCode={{ code: 'demo123' }} />;
  }
}
