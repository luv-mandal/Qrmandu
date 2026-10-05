'use client';
import { useEffect, useState } from 'react';
import { Input, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isValidGoogleReviewLink, isIdealGoogleReviewLink, normalizeGoogleReviewLink } from '@/lib/utils';

export default function SettingsPage() {
  const [business, setBusiness] = useState<any>(null);
  const [form, setForm] = useState({ name: '', google_review_link: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    fetch('/api/business/me').then(async r=>{
      if (r.ok) {
        const data = await r.json();
        setBusiness(data.business);
        setForm({ name: data.business.name, google_review_link: data.business.google_review_link });
      }
    });
  },[]);

  async function handleSave() {
    setLoading(true);
    setMsg('');
    try {
      const normalized = normalizeGoogleReviewLink(form.google_review_link);
      if (!isValidGoogleReviewLink(normalized)) throw new Error('Please enter a valid https:// link');
      
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...business, ...form, google_review_link: normalized }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg('Saved successfully — Google review link will run smoothly');
      setBusiness(data.business);
      setForm(f => ({ ...f, google_review_link: normalized }));
    } catch (e:any) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!business) return <div>Loading…</div>;

  const normalized = form.google_review_link ? normalizeGoogleReviewLink(form.google_review_link) : '';
  const isValid = normalized ? isValidGoogleReviewLink(normalized) : false;
  const isIdeal = normalized ? isIdealGoogleReviewLink(normalized) : true;

  return (
    <div>
      <h1 className="display text-[28px] font-semibold">Business Settings</h1>
      <div className="mt-6 max-w-[560px] rounded-[16px] border border-ink-100 bg-white p-6">
        <div className="space-y-5">
          <div>
            <Label>Business Name</Label>
            <Input className="mt-2" value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} />
          </div>
          <div>
            <Label>Google Review Page Link — ANY format now works smoothly</Label>
            <Input className="mt-2" value={form.google_review_link} onChange={e=>setForm(f=>({...f, google_review_link: e.target.value}))} placeholder="Paste any Google review link" />
            {form.google_review_link && (
              <div className={`mt-2 rounded-[10px] border p-3 text-[12px] ${isValid ? (isIdeal ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800') : 'bg-red-50 border-red-200 text-red-800'}`}>
                {isValid ? (isIdeal ? '✓ Valid — will run smoothly' : '⚠ Valid but use direct review link for best results — still works') : '✗ Invalid https URL'}
              </div>
            )}
            <div className="mt-2 text-[12px] text-ink-500">We auto-normalize to https:// and allow ANY Google link: g.page, search.google.com, maps, goo.gl short links — all run smoothly.</div>
            <div className="mt-3 flex gap-2">
              <a href={normalized || form.google_review_link} target="_blank" className={`inline-flex h-9 px-4 rounded-[10px] border text-[13px] ${isValid ? 'border-ink-900 text-ink-900' : 'border-ink-200 text-ink-400 pointer-events-none'}`}>Test review link — opens smoothly</a>
              {normalized && <span className="text-[11px] text-ink-400 py-2 font-mono break-all">{normalized}</span>}
            </div>
          </div>
          <div>
            <Label>Category</Label>
            <div className="mt-2 text-[14px]">{business.category} / {business.subcategory} {business.custom_category && `(${business.custom_category})`}</div>
            <a href="/onboarding" className="mt-2 inline-flex text-[13px] underline">Edit via onboarding</a>
          </div>
          {msg && <div className="rounded-[10px] bg-ink-50 border border-ink-100 p-3 text-[13px]">{msg}</div>}
          <Button onClick={handleSave} disabled={loading || !isValid}>{loading ? 'Saving…' : 'Save changes — runs smoothly'}</Button>
        </div>
      </div>
    </div>
  );
}
