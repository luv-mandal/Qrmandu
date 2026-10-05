'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORIES } from '@/lib/categories';
import { Input, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import QRCode from 'qrcode';

type BusinessForm = {
  name: string;
  category: string;
  subcategory: string;
  custom_category: string;
  google_review_link: string;
  logo_url: string;
  qr_design: number;
};

const STEPS = [
  'Business Name',
  'Category',
  'Subcategory',
  'Custom Category',
  'Google Review Link',
  'Business Logo',
  'QR Designs',
  'Preview',
  'Finish',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<BusinessForm>({
    name: '',
    category: '',
    subcategory: '',
    custom_category: '',
    google_review_link: '',
    logo_url: '',
    qr_design: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [qrDataUrls, setQrDataUrls] = useState<string[]>([]);
  const [businessId, setBusinessId] = useState('');
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    // Load existing business if any
    fetch('/api/business/me').then(async r => {
      if (r.ok) {
        const data = await r.json();
        if (data.business) {
          setBusinessId(data.business.id);
          setForm({
            name: data.business.name || '',
            category: data.business.category || '',
            subcategory: data.business.subcategory || '',
            custom_category: data.business.custom_category || '',
            google_review_link: data.business.google_review_link || '',
            logo_url: data.business.logo_url || '',
            qr_design: data.business.qr_design ?? 0,
          });
          if (data.business.logo_url) setLogoPreview(data.business.logo_url);
          if (data.business.qr_code) setQrCode(data.business.qr_code.code);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (step === 7 && form.name) {
      // Generate 5 QR preview data URLs for design selection
      const fakeUrl = `https://qrmandu.com/r/${qrCode || 'demo123'}`;
      Promise.all([0,1,2,3,4].map(() => QRCode.toDataURL(fakeUrl, { margin: 1, width: 200 }))).then(setQrDataUrls);
    }
  }, [step, form.name, qrCode]);

  const canNext = () => {
    if (step === 1) return form.name.trim().length >= 2;
    if (step === 2) return !!form.category;
    if (step === 3) return !!form.subcategory;
    if (step === 4) return true; // custom optional unless Other
    if (step === 5) return form.google_review_link.includes('google.com') || form.google_review_link.includes('g.page');
    if (step === 6) return true;
    if (step === 7) return true;
    return true;
  };

  async function saveBusiness() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setBusinessId(data.business.id);
      if (data.qr_code) setQrCode(data.qr_code.code);
      return data;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  async function handleNext() {
    if (!canNext()) {
      setError('Please complete this step');
      return;
    }
    setError('');
    if (step < 9) {
      // Save on certain steps
      if ([1,2,3,4,5,6,7].includes(step)) {
        try { await saveBusiness(); } catch {}
      }
      setStep(s => s + 1);
    } else {
      router.push('/dashboard');
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/png','image/jpeg','image/webp','image/jpg'].includes(file.type)) {
      setError('Supported: PNG, JPG, WEBP');
      return;
    }
    const fd = new FormData();
    fd.append('logo', file);
    setLoading(true);
    try {
      const res = await fetch('/api/upload/logo', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm(f => ({ ...f, logo_url: data.url }));
      setLogoPreview(data.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const selectedCategory = CATEGORIES.find(c => c.name === form.category);

  return (
    <div className="min-h-screen bg-paper">
      <div className="mx-auto max-w-[800px] px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-[10px] bg-ink-900 text-white flex items-center justify-center font-bold">Q</div>
            <span className="display font-semibold">QRmandu</span>
          </div>
          <div className="text-[13px] text-ink-500">Step {step} of 9</div>
        </div>

        <div className="mt-6 h-2 w-full rounded-full bg-ink-100 overflow-hidden">
          <div className="h-full bg-ink-900 transition-all" style={{ width: `${(step/9)*100}%` }} />
        </div>

        <div className="mt-8 rounded-[20px] border border-ink-100 bg-white p-8 shadow-soft">
          <div className="text-[12px] uppercase tracking-widest font-semibold text-ink-500">{STEPS[step-1]}</div>

          {step === 1 && (
            <div className="mt-6">
              <h2 className="display text-[28px] font-semibold">What&apos;s your business name?</h2>
              <p className="mt-2 text-[14px] text-ink-600">This will appear on your QR code and customer review page.</p>
              <div className="mt-6">
                <Label>Business Name</Label>
                <Input className="mt-2" placeholder="ABC Book Store" value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="mt-6">
              <h2 className="display text-[28px] font-semibold">Select your category</h2>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {CATEGORIES.map(cat => (
                  <button key={cat.name} onClick={()=>setForm(f=>({...f, category: cat.name, subcategory: ''}))} className={`rounded-[12px] border p-4 text-left text-[14px] font-medium ${form.category===cat.name?'border-ink-900 bg-ink-900 text-white':'border-ink-200 bg-white hover:border-ink-300'}`}>
                    {cat.name}
                  </button>
                ))}
                <button onClick={()=>setForm(f=>({...f, category: 'Custom', subcategory: 'Custom'}))} className={`rounded-[12px] border p-4 text-left text-[14px] font-medium ${form.category==='Custom'?'border-ink-900 bg-ink-900 text-white':'border-ink-200 bg-white'}`}>Custom</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="mt-6">
              <h2 className="display text-[28px] font-semibold">Select subcategory</h2>
              <p className="mt-2 text-[14px] text-ink-600">Category: {form.category}</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {(selectedCategory?.subcategories || ['Custom']).map(sub => (
                  <button key={sub} onClick={()=>setForm(f=>({...f, subcategory: sub}))} className={`rounded-[12px] border p-4 text-left text-[14px] font-medium ${form.subcategory===sub?'border-ink-900 bg-ink-900 text-white':'border-ink-200 bg-white hover:border-ink-300'}`}>
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="mt-6">
              <h2 className="display text-[28px] font-semibold">Custom category</h2>
              <p className="mt-2 text-[14px] text-ink-600">If your category is not listed, enter it here. Otherwise you can skip.</p>
              <div className="mt-6">
                <Label>Custom Category (optional)</Label>
                <Input className="mt-2" placeholder="e.g., Book Store, Thrift Shop" value={form.custom_category} onChange={e=>setForm(f=>({...f, custom_category: e.target.value}))} />
                <div className="mt-3 text-[12px] text-ink-500">Example: Book Store — business can enter any category not already available.</div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="mt-6">
              <h2 className="display text-[28px] font-semibold">Direct Google Review Page Link</h2>
              <p className="mt-2 text-[14px] text-ink-600">Paste the direct Google review page link customers should use to review your business. Do not use a generic Maps search URL.</p>
              <div className="mt-6">
                <Label>Google Review Page Link</Label>
                <Input className="mt-2" placeholder="Paste your direct Google Review Page Link" value={form.google_review_link} onChange={e=>setForm(f=>({...f, google_review_link: e.target.value}))} />
                <div className="mt-3 flex gap-2">
                  <a href={form.google_review_link} target="_blank" rel="noopener noreferrer" className={`inline-flex h-9 px-4 items-center rounded-[10px] border text-[13px] font-medium ${form.google_review_link ? 'border-ink-900 text-ink-900 hover:bg-ink-50' : 'border-ink-200 text-ink-400 pointer-events-none'}`}>Test review link</a>
                  <span className="text-[12px] text-ink-500 py-2">We validate URL and store securely. You can edit later.</span>
                </div>
                <div className="mt-4 rounded-[12px] bg-amber-50 border border-amber-200 p-3 text-[12px] text-amber-900">
                  Accepted formats: https://g.page/r/.../review or https://search.google.com/local/writereview?placeid=... Must be https and google.com domain.
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="mt-6">
              <h2 className="display text-[28px] font-semibold">Upload business logo</h2>
              <p className="mt-2 text-[14px] text-ink-600">PNG, JPG, WEBP supported. We optimize automatically and create variants for QR, review page, dashboard.</p>
              <div className="mt-6">
                <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLogoUpload} className="block w-full text-[14px]" />
                {logoPreview && (
                  <div className="mt-4 flex items-center gap-4">
                    <img src={logoPreview} alt="logo" className="h-20 w-20 rounded-[12px] object-cover border border-ink-100" />
                    <div className="text-[13px] text-ink-600">Logo uploaded. We will use it in QR designs and review page. If no logo, we create clean text-based identity.</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="mt-6">
              <h2 className="display text-[28px] font-semibold">Select QR design</h2>
              <p className="mt-2 text-[14px] text-ink-600">Automatically generated 5 professional designs. Each includes QR, business name, logo, CTA, Powered by QRmandu.</p>
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                {[
                  { name: 'Minimal', desc: 'Clean white space' },
                  { name: 'Classic', desc: 'Traditional business-card' },
                  { name: 'Premium', desc: 'Elegant typography' },
                  { name: 'Modern', desc: 'Contemporary local-business' },
                  { name: 'Bold', desc: 'Strong CTA and hierarchy' },
                ].map((design, idx) => (
                  <button key={design.name} onClick={()=>setForm(f=>({...f, qr_design: idx}))} className={`rounded-[16px] border p-4 text-left ${form.qr_design===idx?'border-ink-900 ring-1 ring-ink-900 bg-ink-50':'border-ink-200 bg-white hover:border-ink-300'}`}>
                    <div className="flex gap-4">
                      <div className="h-20 w-20 bg-white border border-ink-100 rounded-[8px] overflow-hidden flex items-center justify-center">
                        {qrDataUrls[idx] ? <img src={qrDataUrls[idx]} alt="qr" className="h-full w-full object-contain" /> : <div className="h-12 w-12 bg-ink-900" />}
                      </div>
                      <div>
                        <div className="font-semibold text-[14px]">{idx+1}. {design.name}</div>
                        <div className="text-[12px] text-ink-500">{design.desc}</div>
                        <div className="mt-2 text-[11px] text-ink-600">{form.name || 'Business Name'} • {logoPreview ? 'Logo included' : 'Text identity'}</div>
                        <div className="mt-1 text-[10px] text-ink-400">Scan to review • Powered by QRmandu</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="mt-6">
              <h2 className="display text-[28px] font-semibold">Preview your review page</h2>
              <p className="mt-2 text-[14px] text-ink-600">This is what customers see after scanning your QR.</p>
              <div className="mt-6 rounded-[20px] border border-ink-200 bg-ink-50 p-6 max-w-[380px] mx-auto">
                <div className="text-center">
                  {logoPreview ? <img src={logoPreview} alt="logo" className="h-14 w-14 rounded-full mx-auto object-cover border border-ink-100" /> : <div className="h-14 w-14 rounded-full bg-ink-900 text-white flex items-center justify-center mx-auto text-[20px] font-bold">{form.name.charAt(0) || 'B'}</div>}
                  <div className="mt-3 font-semibold">{form.name || 'Your Business'}</div>
                  <div className="display mt-2 text-[20px] font-semibold">How was your experience?</div>
                  <div className="mt-4 flex justify-center gap-2">
                    {[1,2,3,4,5].map(s=><div key={s} className="h-10 w-10 rounded-full bg-white border border-ink-200 flex items-center justify-center">☆</div>)}
                  </div>
                  <div className="mt-2 text-[12px] text-ink-500">Select your rating</div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <a href={businessId ? `/review/${businessId}` : '#'} target="_blank" className="inline-flex h-10 px-5 items-center rounded-[10px] bg-ink-900 text-white text-[14px] font-medium">Open review page</a>
              </div>
            </div>
          )}

          {step === 9 && (
            <div className="mt-6 text-center py-8">
              <div className="h-16 w-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto text-[28px]">✓</div>
              <h2 className="display mt-4 text-[28px] font-semibold">Your QRmandu page is ready</h2>
              <p className="mt-2 text-[14px] text-ink-600 max-w-[400px] mx-auto">24-hour free trial has started. You can create profile, add link, select category, upload logo, generate QR designs, preview page, test QR, download QR.</p>
              <div className="mt-6 inline-flex rounded-full bg-ink-50 border border-ink-200 px-4 py-2 text-[13px]">Trial: 23:59:42 remaining (example)</div>
            </div>
          )}

          {error && <div className="mt-6 rounded-[12px] bg-red-50 border border-red-200 p-3 text-[13px] text-red-800">{error}</div>}

          <div className="mt-8 flex justify-between">
            <button disabled={step===1} onClick={()=>setStep(s=>Math.max(1,s-1))} className="h-11 px-5 rounded-[12px] border border-ink-200 text-[14px] font-medium disabled:opacity-50">Back</button>
            <Button onClick={handleNext} disabled={loading || !canNext()}>
              {loading ? 'Saving…' : step===9 ? 'Go to dashboard' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
