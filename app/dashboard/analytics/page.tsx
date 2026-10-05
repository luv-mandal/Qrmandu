'use client';
import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(()=>{
    fetch('/api/analytics').then(async r=>{
      if (r.ok) setData(await r.json());
    });
  },[]);

  if (!data) return <div className="text-[14px]">Loading analytics…</div>;

  const { business, events, sessions, qrCodes } = data;
  const scans = events.filter((e:any)=>e.event_type==='qr_scan').length;
  const reviewSessions = sessions.length;
  const starCounts: Record<number, number> = {1:0,2:0,3:0,4:0,5:0};
  sessions.forEach((s:any)=>{ if (s.star_rating) starCounts[s.star_rating]++; });
  const googleClicks = events.filter((e:any)=>e.event_type==='google_click').length;
  const conversion = reviewSessions ? ((googleClicks/reviewSessions)*100).toFixed(1) : '0.0';

  return (
    <div>
      <h1 className="display text-[28px] font-semibold">Analytics</h1>
      <p className="text-[14px] text-ink-600 mt-1">Real data only — never fabricated. From actual database events.</p>

      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-[16px] border border-ink-100 bg-white p-5"><div className="text-[11px] uppercase tracking-widest text-ink-500">QR Scans</div><div className="mt-2 text-[28px] font-bold">{scans}</div></div>
        <div className="rounded-[16px] border border-ink-100 bg-white p-5"><div className="text-[11px] uppercase tracking-widest text-ink-500">Review Sessions</div><div className="mt-2 text-[28px] font-bold">{reviewSessions}</div></div>
        <div className="rounded-[16px] border border-ink-100 bg-white p-5"><div className="text-[11px] uppercase tracking-widest text-ink-500">Star Selections</div><div className="mt-2 text-[28px] font-bold">{Object.values(starCounts).reduce((a,b)=>a+b,0)}</div></div>
        <div className="rounded-[16px] border border-ink-100 bg-white p-5"><div className="text-[11px] uppercase tracking-widest text-ink-500">Google Clicks</div><div className="mt-2 text-[28px] font-bold">{googleClicks}</div><div className="text-[12px] text-ink-500">{conversion}% conversion</div></div>
      </div>

      <div className="mt-8 grid lg:grid-cols-2 gap-6">
        <div className="rounded-[16px] border border-ink-100 bg-white p-6">
          <div className="font-semibold">Star breakdown</div>
          <div className="mt-4 space-y-3">
            {[5,4,3,2,1].map(star=>(
              <div key={star} className="flex items-center gap-3">
                <div className="text-[13px] w-12">{star} stars</div>
                <div className="flex-1 h-2 bg-ink-100 rounded-full overflow-hidden">
                  <div className="h-full bg-ink-900" style={{width: `${reviewSessions? (starCounts[star]/reviewSessions)*100 : 0}%`}} />
                </div>
                <div className="text-[13px] w-8">{starCounts[star]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[16px] border border-ink-100 bg-white p-6">
          <div className="font-semibold">QR performance</div>
          <div className="mt-4 space-y-3">
            {qrCodes.map((q:any)=>(
              <div key={q.id} className="flex justify-between text-[13px] border-b border-ink-50 pb-2">
                <span>/r/{q.code} • {['Minimal','Classic','Premium','Modern','Bold'][q.design_index]}</span>
                <span className="font-medium">{q.scan_count||0} scans</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[16px] border border-ink-100 bg-white p-6">
        <div className="font-semibold">Recent events</div>
        <div className="mt-4 max-h-[400px] overflow-auto space-y-2">
          {events.slice(-50).reverse().map((e:any)=>(
            <div key={e.id} className="flex justify-between text-[12px] border-b border-ink-50 py-2">
              <span>{e.event_type} • {e.qr_code_id ? `QR ${e.qr_code_id.slice(0,6)}` : 'direct'} • {e.metadata?.rating ? `${e.metadata.rating}★` : ''}</span>
              <span className="text-ink-500">{new Date(e.created_at).toLocaleString()}</span>
            </div>
          ))}
          {events.length===0 && <div className="text-[13px] text-ink-500 py-8 text-center">No events yet. Your first customer scan will appear here.</div>}
        </div>
      </div>
    </div>
  );
}
