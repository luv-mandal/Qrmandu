'use client';
import { useEffect, useState } from 'react';
import { getWhatsAppLink } from '@/lib/utils';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '9779800000000';

export default function SubscriptionPage() {
  const [business, setBusiness] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [coupon, setCoupon] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type:'error'|'success', text:string}|null>(null);

  useEffect(()=>{
    fetch('/api/business/me').then(async r=>{
      if (r.ok) {
        const data = await r.json();
        setBusiness(data.business);
      }
    });
    fetch('/api/plans').then(async r=>{
      if (r.ok) {
        const data = await r.json();
        setPlans(data.plans);
      }
    });
  },[]);

  function handleChoosePlan(plan:any) {
    if (!business) return;
    const msg = `${plan.whatsappMessage} for my business "${business.name}". Business ID: ${business.id}. Plan: ${plan.name} (${plan.priceLabel}). Please verify my payment.`;
    const link = getWhatsAppLink(WHATSAPP_NUMBER, msg);
    window.open(link, '_blank');
  }

  async function handleRedeem() {
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch('/api/coupons/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: coupon, businessId: business?.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setMessage({ type: 'success', text: `Subscription activated! Plan: ${data.subscription.plan_id}, expires: ${new Date(data.subscription.expires_at).toLocaleDateString()}` });
      setBusiness(data.business);
    } catch (e:any) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setLoading(false);
    }
  }

  if (!business) return <div className="text-[14px]">Loading…</div>;

  const now = Date.now();
  const subExp = business.subscription_expires_at ? new Date(business.subscription_expires_at).getTime() : 0;
  const isSubActive = subExp > now;
  const trialExp = business.trial_expires_at ? new Date(business.trial_expires_at).getTime() : 0;
  const trialExpired = trialExp < now && !isSubActive;

  return (
    <div>
      <h1 className="display text-[28px] font-semibold">Choose Your QRmandu Plan</h1>
      <p className="text-[14px] text-ink-600 mt-1">Exactly 3 packages. WhatsApp flow, manual coupon verification, 1-month activation.</p>

      {isSubActive ? (
        <div className="mt-6 rounded-[16px] border border-green-200 bg-green-50 p-5">
          <div className="font-semibold text-green-900">Active subscription</div>
          <div className="mt-1 text-[14px] text-green-800">Plan: {business.subscription_plan} • Expires: {new Date(business.subscription_expires_at).toLocaleString()} • {Math.floor((subExp-now)/(1000*60*60))}h remaining</div>
        </div>
      ) : trialExpired ? (
        <div className="mt-6 rounded-[16px] border border-amber-200 bg-amber-50 p-5">
          <div className="font-semibold text-amber-900">Trial expired</div>
          <div className="mt-1 text-[14px] text-amber-800">Your 24-hour free trial has ended. Choose a plan below to continue.</div>
        </div>
      ) : (
        <div className="mt-6 rounded-[16px] border border-ink-100 bg-white p-5">
          <div className="text-[14px]">Trial active • {Math.floor((trialExp-now)/3600000)}h remaining</div>
        </div>
      )}

      <div className="mt-8 grid md:grid-cols-3 gap-6 max-w-[1000px]">
        {plans.map(plan=>(
          <div key={plan.id} className={`rounded-[20px] border p-6 ${plan.recommended ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-200 bg-white'}`}>
            {plan.recommended && <div className="inline-flex rounded-full bg-white text-ink-900 px-3 py-1 text-[11px] font-semibold uppercase">Recommended</div>}
            <div className="mt-3 text-[18px] font-semibold">{plan.name}</div>
            <div className="mt-2 flex items-baseline gap-1"><span className="text-[28px] font-bold">{plan.priceLabel}</span><span className={`text-[13px] ${plan.recommended ? 'text-white/60' : 'text-ink-500'}`}>/{plan.duration}</span></div>
            <div className="mt-1 text-[12px] opacity-70">QR limit: {plan.qr_limit}</div>
            <ul className="mt-5 space-y-2 text-[13px]">
              {plan.features.map((f:string)=><li key={f} className="flex gap-2"><span className={`h-4 w-4 rounded-full flex items-center justify-center text-[9px] ${plan.recommended ? 'bg-white text-ink-900' : 'bg-ink-900 text-white'}`}>✓</span>{f}</li>)}
            </ul>
            <button onClick={()=>handleChoosePlan(plan)} className={`mt-6 w-full h-11 rounded-[12px] text-[14px] font-medium ${plan.recommended ? 'bg-white text-ink-900 hover:bg-ink-50' : 'bg-ink-900 text-white hover:bg-ink-800'}`}>Choose plan</button>
            <div className="mt-2 text-[11px] opacity-60 text-center">Opens WhatsApp with pre-filled message</div>
          </div>
        ))}
      </div>

      <div className="mt-12 max-w-[480px] rounded-[16px] border border-ink-100 bg-white p-6">
        <div className="text-[14px] font-semibold">Have a coupon code?</div>
        <div className="text-[13px] text-ink-600 mt-1">Admin verifies payment and provides unique coupon like QRMD-X7K2-P9LA. Enter it to activate 1-month subscription.</div>
        <div className="mt-4 flex gap-2">
          <input value={coupon} onChange={e=>setCoupon(e.target.value.toUpperCase())} placeholder="QRMD-XXXX-XXXX" className="flex-1 h-11 rounded-[12px] border border-ink-200 px-4 text-[14px] font-mono uppercase" />
          <button onClick={handleRedeem} disabled={loading || !coupon} className="h-11 px-5 rounded-[12px] bg-ink-900 text-white text-[14px] font-medium disabled:opacity-50">{loading ? 'Activating…' : 'Activate'}</button>
        </div>
        {message && <div className={`mt-3 rounded-[10px] p-3 text-[13px] ${message.type==='error'?'bg-red-50 border border-red-200 text-red-800':'bg-green-50 border border-green-200 text-green-800'}`}>{message.text}</div>}

        <div className="mt-6 text-[11px] text-ink-500 leading-4">
          Coupon validation happens server-side. States: UNUSED, REDEEMED, EXPIRED, INVALID. Redeemed coupon cannot be reused. Audit log stored.
        </div>
      </div>

      <div className="mt-8 rounded-[16px] border border-ink-100 bg-ink-50 p-6 max-w-[600px]">
        <div className="text-[13px] font-semibold">WhatsApp payment flow (locked)</div>
        <ol className="mt-3 space-y-2 text-[13px] text-ink-700 list-decimal pl-5">
          <li>Business selects package → Open WhatsApp</li>
          <li>Pre-filled message: “Hello QRmandu, I want to subscribe to Business plan for my business” + business reference</li>
          <li>Business sends payment proof to owner/admin manually</li>
          <li>Admin verifies, generates unique coupon</li>
          <li>Business enters coupon → 1-month activation</li>
        </ol>
        <div className="mt-3 text-[11px] text-ink-500">Do not replace with automatic payment processing in initial version.</div>
      </div>
    </div>
  );
}
