'use client';
import { useState } from 'react';

export default function AdminClient({ initialData, admin }: { initialData: any, admin: any }) {
  const [data, setData] = useState(initialData);
  const [tab, setTab] = useState('businesses');
  const [search, setSearch] = useState('');
  const [couponForm, setCouponForm] = useState({ plan_id: 'business', business_id: '', expires_days: 30 });
  const [message, setMessage] = useState('');

  async function refresh() {
    const res = await fetch('/api/admin/data');
    if (res.ok) {
      const d = await res.json();
      setData(d);
    }
  }

  async function createCoupon() {
    setMessage('');
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(couponForm),
    });
    const result = await res.json();
    if (!res.ok) setMessage(result.error);
    else {
      setMessage(`Coupon created: ${result.coupon.code}`);
      refresh();
    }
  }

  async function suspendBusiness(id: string) {
    await fetch('/api/admin/businesses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'suspend', id }) });
    refresh();
  }

  async function activateBusiness(id: string) {
    await fetch('/api/admin/businesses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'activate', id }) });
    refresh();
  }

  const filteredBusinesses = data.businesses.filter((b:any)=> !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.id.includes(search));

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="h-[64px] border-b border-ink-200 bg-white flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-[10px] bg-ink-900 text-white flex items-center justify-center font-bold">Q</div>
          <span className="display font-semibold">QRmandu Admin</span>
          <span className="text-[12px] text-ink-500 ml-4">{admin.email}</span>
        </div>
        <div className="flex gap-2">
          <a href="/dashboard" className="h-9 px-4 rounded-[10px] border border-ink-200 text-[13px] flex items-center">Business view</a>
          <form action="/api/auth/logout" method="post"><button className="h-9 px-4 rounded-[10px] bg-ink-900 text-white text-[13px]">Logout</button></form>
        </div>
      </header>

      <div className="flex">
        <aside className="w-[200px] border-r border-ink-200 bg-white min-h-[calc(100vh-64px)] p-4 space-y-1">
          {[
            { id: 'businesses', label: `Businesses (${data.businesses.length})` },
            { id: 'users', label: `Users (${data.users.length})` },
            { id: 'coupons', label: `Coupons (${data.coupons.length})` },
            { id: 'qr', label: `QR Codes (${data.qr_codes.length})` },
            { id: 'sessions', label: `Review Sessions (${data.review_sessions.length})` },
            { id: 'payments', label: `Payments (${data.payments.length})` },
            { id: 'analytics', label: `Analytics (${data.analytics_events.length})` },
            { id: 'audit', label: `Audit Logs (${data.audit_logs.length})` },
          ].map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} className={`w-full text-left h-9 px-3 rounded-[10px] text-[13px] font-medium ${tab===t.id ? 'bg-ink-900 text-white' : 'hover:bg-ink-50'}`}>{t.label}</button>
          ))}
        </aside>

        <main className="flex-1 p-6">
          {tab==='businesses' && (
            <div>
              <div className="flex justify-between items-center">
                <h1 className="text-[20px] font-semibold">Businesses</h1>
                <input placeholder="Search businesses" value={search} onChange={e=>setSearch(e.target.value)} className="h-9 rounded-[10px] border border-ink-200 px-3 text-[13px]" />
              </div>
              <div className="mt-4 rounded-[12px] border border-ink-200 bg-white overflow-auto">
                <table className="w-full text-[13px]">
                  <thead className="bg-ink-50 text-[11px] uppercase tracking-widest text-ink-500"><tr><th className="p-3 text-left">Name</th><th className="p-3">Category</th><th className="p-3">Status</th><th className="p-3">Plan</th><th className="p-3">QR Scans</th><th className="p-3">Actions</th></tr></thead>
                  <tbody>
                    {filteredBusinesses.map((b:any)=>(
                      <tr key={b.id} className="border-t border-ink-100">
                        <td className="p-3"><div className="font-medium">{b.name}</div><div className="text-[11px] text-ink-500">{b.id.slice(0,8)} • {b.google_review_link?.slice(0,30)}</div></td>
                        <td className="p-3">{b.category}/{b.subcategory}</td>
                        <td className="p-3"><span className={`px-2 py-1 rounded-full text-[11px] border ${b.status==='suspended'?'bg-red-50 border-red-200 text-red-700':'bg-green-50 border-green-200 text-green-700'}`}>{b.status}</span><div className="text-[11px] mt-1">{b.subscription_status}</div></td>
                        <td className="p-3">{b.subscription_plan || 'trial'}</td>
                        <td className="p-3">{data.qr_codes.filter((q:any)=>q.business_id===b.id).reduce((acc:number,q:any)=>acc+(q.scan_count||0),0)}</td>
                        <td className="p-3 flex gap-1">
                          <button onClick={()=>suspendBusiness(b.id)} className="h-7 px-2 rounded-[8px] border border-ink-200 text-[11px]">Suspend</button>
                          <button onClick={()=>activateBusiness(b.id)} className="h-7 px-2 rounded-[8px] bg-ink-900 text-white text-[11px]">Activate</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab==='users' && (
            <div>
              <h1 className="text-[20px] font-semibold">Users</h1>
              <div className="mt-4 rounded-[12px] border border-ink-200 bg-white p-4">
                {data.users.map((u:any)=><div key={u.id} className="flex justify-between py-2 border-b border-ink-50 text-[13px]"><span>{u.email}</span><span className="text-ink-500">{new Date(u.created_at).toLocaleString()}</span></div>)}
              </div>
            </div>
          )}

          {tab==='coupons' && (
            <div>
              <h1 className="text-[20px] font-semibold">Coupons — Manual verification</h1>
              <div className="mt-4 rounded-[12px] border border-ink-200 bg-white p-5 max-w-[600px]">
                <div className="grid grid-cols-3 gap-3">
                  <select value={couponForm.plan_id} onChange={e=>setCouponForm(f=>({...f, plan_id: e.target.value}))} className="h-10 rounded-[10px] border border-ink-200 px-3 text-[13px]">
                    <option value="starter">Starter</option>
                    <option value="business">Business</option>
                    <option value="premium">Premium</option>
                  </select>
                  <input placeholder="Business ID (optional)" value={couponForm.business_id} onChange={e=>setCouponForm(f=>({...f, business_id: e.target.value}))} className="h-10 rounded-[10px] border border-ink-200 px-3 text-[13px]" />
                  <input type="number" placeholder="Expires days" value={couponForm.expires_days} onChange={e=>setCouponForm(f=>({...f, expires_days: Number(e.target.value)}))} className="h-10 rounded-[10px] border border-ink-200 px-3 text-[13px]" />
                </div>
                <button onClick={createCoupon} className="mt-3 h-10 px-5 rounded-[10px] bg-ink-900 text-white text-[13px]">Create unique coupon</button>
                {message && <div className="mt-3 rounded-[10px] bg-ink-50 border border-ink-200 p-3 text-[13px] font-mono">{message}</div>}
                <div className="mt-3 text-[11px] text-ink-500">Generates QRMD-XXXX-XXXX, stores server-side, audit logged. States: UNUSED, REDEEMED, EXPIRED, INVALID.</div>
              </div>

              <div className="mt-6 rounded-[12px] border border-ink-200 bg-white overflow-auto">
                <table className="w-full text-[12px]">
                  <thead className="bg-ink-50"><tr><th className="p-2 text-left">Code</th><th>Plan</th><th>Status</th><th>Business</th><th>Created</th><th>Redeemed</th></tr></thead>
                  <tbody>
                    {data.coupons.slice().reverse().map((c:any)=>(
                      <tr key={c.id} className="border-t border-ink-100"><td className="p-2 font-mono font-medium">{c.code}</td><td className="p-2">{c.plan_id}</td><td className="p-2"><span className={`px-2 py-0.5 rounded-full border text-[11px] ${c.status==='UNUSED'?'bg-green-50 border-green-200':'bg-ink-50'}`}>{c.status}</span></td><td className="p-2">{c.business_id?.slice(0,8) || '—'}</td><td className="p-2">{new Date(c.created_at).toLocaleDateString()}</td><td className="p-2">{c.redeemed_at ? new Date(c.redeemed_at).toLocaleString() : '—'}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab==='qr' && (
            <div>
              <h1 className="text-[20px] font-semibold">QR Codes</h1>
              <div className="mt-4 rounded-[12px] border border-ink-200 bg-white overflow-auto">
                <table className="w-full text-[12px]">
                  <thead className="bg-ink-50"><tr><th className="p-2 text-left">Code</th><th>Business</th><th>Scans</th><th>Design</th><th>Status</th><th>Created</th></tr></thead>
                  <tbody>
                    {data.qr_codes.map((q:any)=>(
                      <tr key={q.id} className="border-t border-ink-100"><td className="p-2 font-mono">/r/{q.code}</td><td className="p-2">{data.businesses.find((b:any)=>b.id===q.business_id)?.name || q.business_id.slice(0,8)}</td><td className="p-2">{q.scan_count||0}</td><td className="p-2">{['Minimal','Classic','Premium','Modern','Bold'][q.design_index]}</td><td className="p-2">{q.status}</td><td className="p-2">{new Date(q.created_at).toLocaleDateString()}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab==='sessions' && (
            <div>
              <h1 className="text-[20px] font-semibold">Review Sessions</h1>
              <div className="mt-4 rounded-[12px] border border-ink-200 bg-white overflow-auto">
                <table className="w-full text-[12px]">
                  <thead className="bg-ink-50"><tr><th className="p-2 text-left">Business</th><th>Rating</th><th>Review</th><th>Google Click</th><th>IP</th><th>Date</th></tr></thead>
                  <tbody>
                    {data.review_sessions.slice().reverse().slice(0,100).map((s:any)=>(
                      <tr key={s.id} className="border-t border-ink-100"><td className="p-2">{data.businesses.find((b:any)=>b.id===s.business_id)?.name || s.business_id.slice(0,6)}</td><td className="p-2">{s.star_rating}★</td><td className="p-2 max-w-[300px] truncate">{s.generated_review}</td><td className="p-2">{s.google_clicked ? 'Yes' : 'No'}</td><td className="p-2">{s.ip}</td><td className="p-2">{new Date(s.created_at).toLocaleString()}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab==='analytics' && (
            <div>
              <h1 className="text-[20px] font-semibold">Analytics Events</h1>
              <div className="mt-4 rounded-[12px] border border-ink-200 bg-white p-4 max-h-[600px] overflow-auto">
                {data.analytics_events.slice().reverse().slice(0,200).map((e:any)=><div key={e.id} className="py-2 border-b border-ink-50 text-[12px] flex justify-between"><span>{e.event_type} • {e.business_id.slice(0,8)} • {e.metadata?.rating ? `${e.metadata.rating}★` : ''}</span><span className="text-ink-500">{new Date(e.created_at).toLocaleString()}</span></div>)}
              </div>
            </div>
          )}

          {tab==='audit' && (
            <div>
              <h1 className="text-[20px] font-semibold">Audit Logs</h1>
              <div className="mt-4 rounded-[12px] border border-ink-200 bg-white p-4 max-h-[600px] overflow-auto">
                {data.audit_logs.slice().reverse().map((l:any)=><div key={l.id} className="py-2 border-b border-ink-50 text-[12px]"><div className="font-medium">{l.action} • {l.target_type} {l.target_id?.slice(0,8)}</div><div className="text-ink-500">{JSON.stringify(l.details)} • {new Date(l.created_at).toLocaleString()}</div></div>)}
              </div>
            </div>
          )}

          {tab==='payments' && (
            <div>
              <h1 className="text-[20px] font-semibold">Payments — Manual verification</h1>
              <div className="mt-4 rounded-[12px] border border-ink-200 bg-white p-8 text-center text-[13px] text-ink-500">Payment proof sent via WhatsApp manually. Admin verifies and creates coupon. No auto payment in v1.</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
