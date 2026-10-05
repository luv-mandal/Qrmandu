import { findOne, findMany } from '@/lib/db';
import { notFound } from 'next/navigation';
import ReviewClient from '@/components/review/review-client';

export default function ReviewPage({ params, searchParams }: { params: { id: string }, searchParams: { qr?: string } }) {
  const business = findOne('businesses', (b:any)=>b.id===params.id || b.slug===params.id);
  if (!business) return notFound();

  const qrCode = searchParams.qr ? findOne('qr_codes', (q:any)=>q.code===searchParams.qr) : findOne('qr_codes', (q:any)=>q.business_id===business.id && q.status==='active');

  return <ReviewClient business={business} qrCode={qrCode} />;
}
