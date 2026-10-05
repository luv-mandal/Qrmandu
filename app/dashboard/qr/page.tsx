'use client';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

type QR = any;

export default function QRPage() {
  const [qrs, setQrs] = useState<QR[]>([]);
  const [business, setBusiness] = useState<any>(null);
  const [qrDataUrls, setQrDataUrls] = useState<Record<string,string>>({});

  useEffect(() => {
    fetch('/api/business/me').then(async r=>{
      if (r.ok) {
        const data = await r.json();
        setBusiness(data.business);
        setQrs(data.qrCodes || []);
        // generate QR data urls
        const map: Record<string,string> = {};
        for (const q of data.qrCodes || []) {
          const url = `${window.location.origin}/r/${q.code}`;
          map[q.id] = await QRCode.toDataURL(url, { margin: 1, width: 300 });
        }
        setQrDataUrls(map);
      }
    });
  }, []);

  async function downloadQR(qr: QR) {
    const dataUrl = qrDataUrls[qr.id];
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${business?.name || 'qrmandu'}-qr-${qr.code}.png`;
    a.click();
  }

  if (!business) return <div className="text-[14px]">Loading…</div>;

  return (
    <div>
      <h1 className="display text-[28px] font-semibold">QR Codes</h1>
      <p className="text-[14px] text-ink-600 mt-1">Dynamic QR codes — print once, manage destination anytime. Tracking enabled.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {qrs.map(qr => (
          <div key={qr.id} className="rounded-[16px] border border-ink-100 bg-white p-6 shadow-soft">
            <div className="flex gap-5">
              <div className="h-[140px] w-[140px] rounded-[12px] border border-ink-100 bg-white p-2 flex-shrink-0">
                {qrDataUrls[qr.id] ? <img src={qrDataUrls[qr.id]} alt="qr" className="h-full w-full object-contain" /> : <div className="h-full w-full bg-ink-100 animate-pulse" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[15px]">{qr.name}</div>
                <div className="mt-1 text-[12px] text-ink-500 break-all">https://qrmandu.com/r/{qr.code}</div>
                <div className="mt-2 text-[12px]"><span className="text-ink-500">Scans:</span> <span className="font-semibold">{qr.scan_count||0}</span> • <span className="text-ink-500">Status:</span> {qr.status}</div>
                <div className="mt-1 text-[12px]"><span className="text-ink-500">Design:</span> {['Minimal','Classic','Premium','Modern','Bold'][qr.design_index] || 'Minimal'}</div>
                <div className="mt-1 text-[12px]"><span className="text-ink-500">Created:</span> {new Date(qr.created_at).toLocaleDateString()}</div>
              </div>
            </div>

            {/* 5 design previews */}
            <div className="mt-5 grid grid-cols-5 gap-2">
              {[0,1,2,3,4].map(idx=>(
                <div key={idx} className={`rounded-[8px] border p-2 text-center ${qr.design_index===idx?'border-ink-900 bg-ink-50':'border-ink-100'}`}>
                  <div className="text-[10px]">{['Min','Cla','Pre','Mod','Bol'][idx]}</div>
                  <div className="mt-1 h-8 bg-ink-900 rounded-[2px] mx-auto w-8" />
                </div>
              ))}
            </div>

            <div className="mt-5 flex gap-2">
              <button onClick={()=>downloadQR(qr)} className="h-9 px-4 rounded-[10px] bg-ink-900 text-white text-[13px] font-medium">Download</button>
              <a href={`/review/${business.id}?qr=${qr.code}`} target="_blank" className="h-9 px-4 rounded-[10px] border border-ink-200 bg-white text-[13px] font-medium flex items-center">Preview</a>
              <a href={`/r/${qr.code}`} target="_blank" className="h-9 px-4 rounded-[10px] border border-ink-200 bg-white text-[13px] font-medium flex items-center">Test QR</a>
            </div>

            <div className="mt-4 rounded-[10px] bg-ink-50 border border-ink-100 p-3 text-[11px] text-ink-600">
              <div className="font-medium text-ink-900">QR Design Details</div>
              <div className="mt-1">Includes: QR, business name ({business.name}), {business.logo_url ? 'logo' : 'text identity'}, CTA “Scan to review”, “Powered by QRmandu”. Highly scannable, never sacrificed for decoration.</div>
            </div>
          </div>
        ))}
      </div>

      {qrs.length===0 && (
        <div className="mt-8 rounded-[16px] border border-dashed border-ink-200 bg-white p-12 text-center">
          <div className="text-[16px] font-medium">No QR codes yet</div>
          <div className="mt-1 text-[14px] text-ink-600">Create your first QR code to start your QRmandu journey.</div>
          <a href="/onboarding" className="mt-4 inline-flex h-10 px-5 rounded-[12px] bg-ink-900 text-white text-[14px] font-medium items-center">Create QR</a>
        </div>
      )}
    </div>
  );
}
