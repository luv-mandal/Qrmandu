'use client';
import { useState } from 'react';

type Props = {
  business: any;
  qrCode?: any;
};

function normalizeLink(url: string): string {
  if (!url) return url;
  let trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = 'https://' + trimmed;
  }
  if (trimmed.startsWith('http://')) {
    trimmed = trimmed.replace('http://', 'https://');
  }
  return trimmed;
}

export default function ReviewClient({ business, qrCode }: Props) {
  const [rating, setRating] = useState<number | null>(null);
  const [generatedReview, setGeneratedReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [copied, setCopied] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const googleLink = normalizeLink(business.google_review_link || '');

  async function handleRatingSelect(stars: number) {
    setRating(stars);
    setLoading(true);
    try {
      const res = await fetch('/api/reviews/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: business.id,
          rating: stars,
          qrCodeId: qrCode?.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedReview(data.review);
        setSessionId(data.sessionId);
      }
    } catch {}
    setLoading(false);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(generatedReview);
      setCopied(true);
      setTimeout(()=>setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = generatedReview;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(()=>setCopied(false), 2000);
    }
  }

  async function handleSubmit() {
    // Preserve review, copy to clipboard, open Google link smoothly for ANY link format
    try {
      await navigator.clipboard.writeText(generatedReview);
    } catch {}
    try {
      localStorage.setItem('qrmandu_last_review', generatedReview);
      localStorage.setItem('qrmandu_last_business', business.name);
      localStorage.setItem('qrmandu_last_link', googleLink);
    } catch {}

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessId: business.id,
        event_type: 'google_click',
        qrCodeId: qrCode?.id,
        sessionId,
      }),
    }).catch(()=>{});

    setShowInstructions(true);
    
    // Open ANY Google review link smoothly - with fallback handling
    try {
      const newWindow = window.open(googleLink, '_blank', 'noopener,noreferrer');
      // If popup blocked, newWindow will be null - instructions modal will show manual link
      if (!newWindow) {
        console.log('Popup blocked, showing manual link in modal');
      }
    } catch (e) {
      // Fallback: try location href if window.open fails
      console.error('Failed to open link:', e);
      window.location.href = googleLink;
    }
  }

  return (
    <div className="min-h-screen bg-[#fefcfa] flex flex-col">
      <div className="h-[56px] border-b border-ink-100 bg-white flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-[9px] bg-ink-900 text-white flex items-center justify-center font-bold text-[12px]">Q</div>
          <span className="display text-[16px] font-semibold">QRmandu</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[380px]">
          <div className="rounded-[24px] border border-ink-100 bg-white shadow-soft p-7">
            <div className="text-center">
              {business.logo_url ? (
                <img src={business.logo_url} alt={business.name} className="h-[64px] w-[64px] rounded-full object-cover mx-auto border border-ink-100" />
              ) : (
                <div className="h-[64px] w-[64px] rounded-full bg-ink-900 text-white flex items-center justify-center mx-auto text-[24px] font-bold">
                  {business.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="mt-3 text-[11px] uppercase tracking-widest font-semibold text-ink-500">{business.subcategory || business.category}</div>
              <div className="mt-1 font-semibold text-[16px]">{business.name}</div>
              <div className="display mt-5 text-[24px] font-semibold leading-tight">How was your experience?</div>

              <div className="mt-6 flex justify-center gap-2">
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    onClick={()=>handleRatingSelect(star)}
                    aria-label={`${star} stars`}
                    className={`h-[48px] w-[48px] rounded-full border text-[22px] transition-all active:scale-95 ${
                      rating && star <= rating
                        ? 'bg-ink-900 border-ink-900 text-white shadow-soft'
                        : 'bg-white border-ink-200 text-ink-300 hover:border-ink-300 hover:text-ink-500'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <div className="mt-3 text-[13px] text-ink-500">{rating ? `${rating} star${rating>1?'s':''} selected` : 'Select your rating'}</div>
            </div>

            {loading && (
              <div className="mt-8 rounded-[16px] bg-ink-50 border border-ink-100 p-5 text-center animate-fadeIn">
                <div className="text-[14px] font-medium">Creating your review…</div>
                <div className="mt-2 h-1 w-full bg-ink-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-ink-900 animate-pulse" />
                </div>
              </div>
            )}

            {generatedReview && !loading && (
              <div className="mt-8 animate-fadeIn">
                <div className="rounded-[16px] border border-ink-100 bg-ink-50 p-5">
                  <div className="text-[11px] uppercase tracking-widest font-semibold text-ink-500">Your review</div>
                  <div className="mt-3 text-[15px] leading-[1.6] text-ink-900">{generatedReview}</div>
                </div>

                <div className="mt-4 grid grid-cols-[1fr_1.4fr] gap-3">
                  <button onClick={handleCopy} className="h-[48px] rounded-[12px] border border-ink-200 bg-white text-[14px] font-medium hover:bg-ink-50 transition">
                    {copied ? 'Copied ✓' : 'Copy review'}
                  </button>
                  <button onClick={handleSubmit} className="h-[48px] rounded-[12px] bg-ink-900 text-white text-[14px] font-medium shadow-soft hover:bg-ink-800 transition">
                    Submit review
                  </button>
                </div>

                <div className="mt-4 text-[11px] leading-4 text-ink-500 text-center">
                  Tapping Submit review opens your Google review page smoothly — any link format works: g.page, search.google.com, maps, goo.gl. Your review is copied — paste it there.
                </div>
              </div>
            )}

            {!rating && !loading && (
              <div className="mt-8 text-center text-[12px] text-ink-400">
                No login • No forms • Just stars<br />
                Powered by QRmandu • Link runs smoothly
              </div>
            )}
          </div>

          <div className="mt-6 text-center text-[11px] text-ink-400">
            QR: {qrCode?.code || 'direct'} • {business.name} • Secure smooth handoff
          </div>
        </div>
      </div>

      {showInstructions && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
          <div className="w-full max-w-[420px] rounded-[20px] bg-white p-6 shadow-soft-lg animate-fadeIn">
            <div className="h-10 w-10 rounded-full bg-green-50 border border-green-200 text-green-700 flex items-center justify-center">✓</div>
            <div className="mt-4 display text-[20px] font-semibold">Review copied — now paste on Google</div>
            <div className="mt-2 text-[14px] leading-6 text-ink-600">
              We opened your business&apos;s Google review page smoothly in a new tab and copied your review.<br /><br />
              <span className="font-medium text-ink-900">Steps:</span> Paste your review into the Google text box, confirm stars, tap Post. Works with any Google link format.
            </div>
            <div className="mt-4 rounded-[12px] bg-ink-50 border border-ink-100 p-3 text-[13px] break-all">{generatedReview}</div>
            <div className="mt-3 text-[11px] text-ink-500 break-all">Google link: {googleLink}</div>
            <div className="mt-5 flex gap-3">
              <button onClick={handleCopy} className="flex-1 h-11 rounded-[12px] border border-ink-200 bg-white text-[14px] font-medium">Copy again</button>
              <button onClick={()=>setShowInstructions(false)} className="flex-1 h-11 rounded-[12px] bg-ink-900 text-white text-[14px] font-medium">Got it</button>
            </div>
            <div className="mt-3 text-center space-y-1">
              <div className="text-[11px] text-ink-400">If popup was blocked:</div>
              <a href={googleLink} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 px-4 rounded-[10px] bg-ink-900 text-white text-[12px] font-medium items-center">Open Google review page — runs smoothly</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
