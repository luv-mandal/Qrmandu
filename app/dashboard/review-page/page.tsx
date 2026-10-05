'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ReviewPageManagement() {
  const [business, setBusiness] = useState<any>(null);
  const [qr, setQr] = useState<any>(null);

  useEffect(()=>{
    fetch('/api/business/me').then(async r=>{
      if (r.ok) {
        const data = await r.json();
        setBusiness(data.business);
        setQr(data.qr_code);
      }
    });
  },[]);

  if (!business) return <div className="text-[14px]">Loading…</div>;

  return (
    <div>
      <h1 className="display text-[28px] font-semibold">Review Page</h1>
      <p className="text-[14px] text-ink-600 mt-1">Manage your customer-facing review experience. This is the most important screen.</p>

      <div className="mt-8 grid lg:grid-cols-2 gap-8">
        <div className="rounded-[16px] border border-ink-100 bg-white p-6 shadow-soft">
          <div className="text-[12px] uppercase tracking-widest font-semibold text-ink-500">Business</div>
          <div className="mt-4 space-y-3 text-[14px]">
            <div className="flex justify-between"><span className="text-ink-500">Name</span><span className="font-medium">{business.name}</span></div>
            <div className="flex justify-between"><span className="text-ink-500">Category</span><span>{business.category} / {business.subcategory}</span></div>
            <div className="flex justify-between"><span className="text-ink-500">Custom</span><span>{business.custom_category || '—'}</span></div>
            <div className="flex justify-between"><span className="text-ink-500">Logo</span><span>{business.logo_url ? 'Uploaded' : 'Text identity'}</span></div>
          </div>

          <div className="mt-6">
            <div className="text-[12px] uppercase tracking-widest font-semibold text-ink-500">Google Review Page Link</div>
            <div className="mt-2 text-[13px] break-all p-3 rounded-[10px] bg-ink-50 border border-ink-100">{business.google_review_link}</div>
            <a href={business.google_review_link} target="_blank" className="mt-3 inline-flex h-9 px-4 rounded-[10px] border border-ink-200 text-[13px] font-medium">Test review link</a>
          </div>

          <div className="mt-6 flex gap-2">
            <Link href="/onboarding" className="h-10 px-5 rounded-[12px] bg-ink-900 text-white text-[14px] font-medium flex items-center">Edit business</Link>
            <Link href={`/review/${business.id}`} target="_blank" className="h-10 px-5 rounded-[12px] border border-ink-200 bg-white text-[14px] font-medium flex items-center">Open review page</Link>
          </div>
        </div>

        <div className="rounded-[16px] border border-ink-100 bg-white p-6 shadow-soft">
          <div className="text-[12px] uppercase tracking-widest font-semibold text-ink-500">Customer flow test</div>
          <div className="mt-4 space-y-3 text-[14px]">
            <div className="flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-ink-900 text-white flex items-center justify-center text-[10px]">1</span> Scan QR: /r/{qr?.code}</div>
            <div className="flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-ink-900 text-white flex items-center justify-center text-[10px]">2</span> Lands on: /review/{business.id}</div>
            <div className="flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-ink-900 text-white flex items-center justify-center text-[10px]">3</span> Customer selects only ★ rating</div>
            <div className="flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-ink-900 text-white flex items-center justify-center text-[10px]">4</span> Review auto-generated (unique, natural)</div>
            <div className="flex items-center gap-2"><span className="h-6 w-6 rounded-full bg-ink-900 text-white flex items-center justify-center text-[10px]">5</span> Submit opens Google review page, copies review</div>
          </div>

          <div className="mt-6 rounded-[12px] bg-amber-50 border border-amber-200 p-4 text-[12px] text-amber-900">
            Locked flow: Customer must NOT be asked to write review manually, create account, enter name/email/phone, or enter additional text. Only star rating.
          </div>

          <div className="mt-6">
            <Link href={`/review/${business.id}`} target="_blank" className="w-full h-11 rounded-[12px] bg-ink-900 text-white text-[14px] font-medium flex items-center justify-center">Test customer flow</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
