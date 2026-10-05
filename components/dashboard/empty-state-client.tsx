'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export function EmptyStateClient({ userEmail }: { userEmail: string }) {
  const [restoring, setRestoring] = useState(false);
  const [hasBackup, setHasBackup] = useState(false);
  const [backupData, setBackupData] = useState<any>(null);
  const [autoTried, setAutoTried] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('qrmandu_business_backup');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          setHasBackup(true);
          setBackupData(parsed);
          // Auto-restore if backup exists and we haven't tried yet
          if (!autoTried) {
            setAutoTried(true);
            // Auto restore after 1s to avoid loop
            setTimeout(() => {
              handleRestore(parsed);
            }, 1000);
          }
        }
      }
    } catch {}
  }, [autoTried]);

  async function handleRestore(data?: any) {
    const toRestore = data || backupData;
    if (!toRestore) return;
    setRestoring(true);
    try {
      const res = await fetch('/api/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toRestore),
      });
      const result = await res.json();
      if (res.ok) {
        window.location.href = '/dashboard';
      } else {
        // If auto-restore fails, show manual button
        setRestoring(false);
      }
    } catch (e: any) {
      setRestoring(false);
    }
  }

  if (restoring) {
    return (
      <div className="max-w-[600px] mx-auto py-24 text-center">
        <div className="h-12 w-12 rounded-full border-2 border-ink-200 border-t-ink-900 animate-spin mx-auto" />
        <div className="mt-4 text-[14px] font-medium">Restoring your business…</div>
        <div className="mt-1 text-[13px] text-ink-500">Please wait, taking you to dashboard</div>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto py-12">
      <div className="rounded-[20px] border border-ink-100 bg-white p-8 shadow-soft text-center">
        <div className="h-16 w-16 rounded-full bg-ink-50 border border-ink-100 flex items-center justify-center mx-auto">
          <div className="h-8 w-8 rounded-[10px] bg-ink-900 text-white flex items-center justify-center font-bold">Q</div>
        </div>
        <h1 className="display mt-4 text-[28px] font-semibold">Welcome to QRmandu</h1>
        <p className="mt-2 text-[14px] text-ink-600">Let&apos;s set up your business to start getting Google reviews. It takes just 2 minutes.</p>
        
        {hasBackup && backupData && (
          <div className="mt-6 rounded-[12px] bg-green-50 border border-green-200 p-4 text-left">
            <div className="text-[13px] font-medium text-green-900">Found your previous business</div>
            <div className="mt-1 text-[13px] text-green-800">{backupData.name} • {backupData.category}</div>
            <button onClick={() => handleRestore()} disabled={restoring} className="mt-3 h-10 px-5 rounded-[10px] bg-green-900 text-white text-[13px] font-medium disabled:opacity-50">
              Restore {backupData.name}
            </button>
          </div>
        )}

        <div className="mt-8 rounded-[16px] bg-ink-50 border border-ink-100 p-5 text-left">
          <div className="text-[13px] font-medium">What you&apos;ll do:</div>
          <div className="mt-3 space-y-2 text-[13px] text-ink-600">
            <div className="flex gap-2"><span className="h-5 w-5 rounded-full bg-ink-900 text-white flex items-center justify-center text-[10px] flex-shrink-0">1</span> Enter business name and category</div>
            <div className="flex gap-2"><span className="h-5 w-5 rounded-full bg-ink-900 text-white flex items-center justify-center text-[10px] flex-shrink-0">2</span> Paste your Google review link (any format works)</div>
            <div className="flex gap-2"><span className="h-5 w-5 rounded-full bg-ink-900 text-white flex items-center justify-center text-[10px] flex-shrink-0">3</span> Upload logo and pick QR design</div>
            <div className="flex gap-2"><span className="h-5 w-5 rounded-full bg-ink-900 text-white flex items-center justify-center text-[10px] flex-shrink-0">4</span> Get your QR — print and start getting reviews</div>
          </div>
        </div>

        <Link href="/onboarding" className="mt-6 inline-flex h-12 px-7 rounded-[12px] bg-ink-900 text-white text-[15px] font-medium items-center justify-center shadow-soft hover:bg-ink-800 transition">Create your business profile</Link>
        
        <div className="mt-6 flex items-center justify-center gap-2 text-[12px] text-ink-500">
          <span>24-hour free trial</span>
          <span>•</span>
          <span>No card required</span>
        </div>
      </div>
    </div>
  );
}
