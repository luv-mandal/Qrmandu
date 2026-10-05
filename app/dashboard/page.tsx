import { getCurrentUser } from '@/lib/auth';
import { findOne, findMany } from '@/lib/db';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  const business = findOne('businesses', (b:any)=>b.user_id===user.id);
  if (!business) redirect('/onboarding');

  const qrCodes = findMany('qr_codes', (q:any)=>q.business_id===business.id);
  const sessions = findMany('review_sessions', (s:any)=>s.business_id===business.id);
  const events = findMany('analytics_events', (e:any)=>e.business_id===business.id);

  const scans = events.filter((e:any)=>e.event_type==='qr_scan').length || qrCodes.reduce((acc:number, q:any)=>acc+(q.scan_count||0),0);
  const reviewSessions = sessions.length;
  const starSelections = sessions.filter((s:any)=>s.star_rating).length;
  const googleClicks = events.filter((e:any)=>e.event_type==='google_click').length || sessions.filter((s:any)=>s.google_clicked).length;
  const conversion = reviewSessions > 0 ? ((googleClicks / reviewSessions)*100).toFixed(1) : '0.0';

  const now = Date.now();
  const trialExp = business.trial_expires_at ? new Date(business.trial_expires_at).getTime() : 0;
  const subExp = business.subscription_expires_at ? new Date(business.subscription_expires_at).getTime() : 0;
  const isSubActive = subExp > now;
  const trialActive = trialExp > now && !isSubActive;
  const remainingMs = isSubActive ? subExp - now : trialExp - now;
  const hours = Math.max(0, Math.floor(remainingMs / (1000*60*60)));
  const minutes = Math.max(0, Math.floor((remainingMs % (1000*60*60)) / (1000*60)));

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="display text-[28px] font-semibold">Dashboard</h1>
          <p className="text-[14px] text-ink-600 mt-1">{business.name} • {business.category} {business.subcategory ? `• ${business.subcategory}` : ''}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/review/${business.id}`} target="_blank" className="h-10 px-5 rounded-[12px] border border-ink-200 bg-white text-[14px] font-medium flex items-center">Open review page</Link>
          <Link href="/dashboard/qr" className="h-10 px-5 rounded-[12px] bg-ink-900 text-white text-[14px] font-medium flex items-center">Manage QR</Link>
        </div>
      </div>

      {/* Status cards */}
      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <div className="rounded-[16px] border border-ink-100 bg-white p-5 shadow-soft">
          <div className="text-[11px] uppercase tracking-widest font-semibold text-ink-500">Trial / Subscription</div>
          <div className="mt-2 text-[16px] font-semibold">{isSubActive ? 'Active subscription' : trialActive ? '24-hour free trial' : 'Expired'}</div>
          <div className="mt-1 text-[13px] text-ink-600">
            {isSubActive ? `${hours}h ${minutes}m remaining • Plan: ${business.subscription_plan}` : trialActive ? `${hours}h ${minutes}m remaining • ${Math.floor(remainingMs/1000)}s` : 'Choose a plan to continue'}
          </div>
          {trialActive && <div className="mt-3 text-[12px] font-mono bg-ink-50 border border-ink-100 rounded-[8px] px-3 py-2">{hours.toString().padStart(2,'0')}:{(minutes%60).toString().padStart(2,'0')}:{Math.floor((remainingMs%60000)/1000).toString().padStart(2,'0')} remaining</div>}
        </div>
        <div className="rounded-[16px] border border-ink-100 bg-white p-5 shadow-soft">
          <div className="text-[11px] uppercase tracking-widest font-semibold text-ink-500">Google Review Link</div>
          <div className="mt-2 text-[13px] break-all text-ink-800">{business.google_review_link || 'Not set'}</div>
          <Link href="/dashboard/settings" className="mt-3 inline-flex text-[13px] underline">Edit link</Link>
        </div>
        <div className="rounded-[16px] border border-ink-100 bg-white p-5 shadow-soft">
          <div className="text-[11px] uppercase tracking-widest font-semibold text-ink-500">QR Code</div>
          <div className="mt-2 text-[14px]">{qrCodes.length} QR codes • {qrCodes.filter((q:any)=>q.status==='active').length} active</div>
          <div className="mt-1 text-[13px] text-ink-600">Dynamic URL: /r/{qrCodes[0]?.code || '...'}</div>
          <Link href="/dashboard/qr" className="mt-3 inline-flex text-[13px] underline">View QR</Link>
        </div>
      </div>

      {/* Analytics */}
      <div className="mt-8">
        <h2 className="text-[16px] font-semibold">Analytics — real data only</h2>
        <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-[16px] border border-ink-100 bg-white p-5">
            <div className="text-[11px] uppercase tracking-widest text-ink-500">QR Scans</div>
            <div className="mt-2 text-[28px] font-bold tracking-tight">{scans}</div>
            <div className="mt-1 text-[12px] text-ink-500">Number of QR scans</div>
          </div>
          <div className="rounded-[16px] border border-ink-100 bg-white p-5">
            <div className="text-[11px] uppercase tracking-widest text-ink-500">Review Sessions</div>
            <div className="mt-2 text-[28px] font-bold tracking-tight">{reviewSessions}</div>
            <div className="mt-1 text-[12px] text-ink-500">Customer review sessions</div>
          </div>
          <div className="rounded-[16px] border border-ink-100 bg-white p-5">
            <div className="text-[11px] uppercase tracking-widest text-ink-500">Google Clicks</div>
            <div className="mt-2 text-[28px] font-bold tracking-tight">{googleClicks}</div>
            <div className="mt-1 text-[12px] text-ink-500">Submit Review clicked</div>
          </div>
          <div className="rounded-[16px] border border-ink-100 bg-white p-5">
            <div className="text-[11px] uppercase tracking-widest text-ink-500">Conversion</div>
            <div className="mt-2 text-[28px] font-bold tracking-tight">{conversion}%</div>
            <div className="mt-1 text-[12px] text-ink-500">Sessions → Google clicks</div>
          </div>
        </div>

        {reviewSessions===0 && (
          <div className="mt-6 rounded-[16px] border border-dashed border-ink-200 bg-ink-50 p-8 text-center">
            <div className="text-[14px] font-medium">No analytics yet</div>
            <div className="mt-1 text-[13px] text-ink-600">Your first customer scan will appear here. Print your QR and place it at checkout, tables, or entrance.</div>
          </div>
        )}
      </div>

      {/* Recent sessions */}
      <div className="mt-8 rounded-[16px] border border-ink-100 bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Recent review sessions</div>
          <Link href="/dashboard/analytics" className="text-[13px] underline">View all</Link>
        </div>
        <div className="mt-4">
          {sessions.length===0 ? (
            <div className="py-8 text-center text-[14px] text-ink-500">No review sessions yet. Share your QR to start getting reviews.</div>
          ) : (
            <div className="space-y-3">
              {sessions.slice(-5).reverse().map((s:any)=>(
                <div key={s.id} className="flex items-center justify-between border-b border-ink-50 pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-ink-50 border border-ink-100 flex items-center justify-center text-[12px]">{s.star_rating}★</div>
                    <div>
                      <div className="text-[13px] font-medium">{s.star_rating} stars • {new Date(s.created_at).toLocaleString()}</div>
                      <div className="text-[12px] text-ink-500 truncate max-w-[320px]">{s.generated_review}</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-ink-400">{s.google_clicked ? 'Google clicked' : 'Viewed'}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
