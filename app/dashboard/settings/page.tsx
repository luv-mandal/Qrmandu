'use client';
import { useEffect, useState } from 'react';
import { Input, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...business, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg('Saved successfully');
      setBusiness(data.business);
    } catch (e:any) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (!business) return <div>Loading…</div>;

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
            <Label>Google Review Page Link</Label>
            <Input className="mt-2" value={form.google_review_link} onChange={e=>setForm(f=>({...f, google_review_link: e.target.value}))} />
            <div className="mt-2 text-[12px] text-ink-500">Paste direct Google review page link. We validate URL. Store securely. Allow edit later. Test button available.</div>
            <a href={form.google_review_link} target="_blank" className="mt-3 inline-flex h-9 px-4 rounded-[10px] border border-ink-200 text-[13px]">Test review link</a>
          </div>
          <div>
            <Label>Category</Label>
            <div className="mt-2 text-[14px]">{business.category} / {business.subcategory} {business.custom_category && `(${business.custom_category})`}</div>
            <a href="/onboarding" className="mt-2 inline-flex text-[13px] underline">Edit via onboarding</a>
          </div>
          {msg && <div className="rounded-[10px] bg-ink-50 border border-ink-100 p-3 text-[13px]">{msg}</div>}
          <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving…' : 'Save changes'}</Button>
        </div>
      </div>
    </div>
  );
}
