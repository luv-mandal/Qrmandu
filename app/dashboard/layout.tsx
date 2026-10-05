import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { findOne, findMany } from '@/lib/db';
import Link from 'next/link';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const business = findOne('businesses', (b:any)=>b.user_id===user.id);

  // Check trial expiration
  let trialExpired = false;
  let trialRemaining = '';
  if (business) {
    const now = Date.now();
    const exp = new Date(business.trial_expires_at || business.created_at).getTime() + 24*60*60*1000;
    // Actually trial_expires_at already set, but also check subscription
    const trialExpTime = business.trial_expires_at ? new Date(business.trial_expires_at).getTime() : exp;
    const subExp = business.subscription_expires_at ? new Date(business.subscription_expires_at).getTime() : 0;
    const isSubActive = subExp > now;
    if (!isSubActive && trialExpTime < now) trialExpired = true;
  }

  return (
    <div className="min-h-screen bg-paper flex">
      <aside className="hidden lg:flex w-[260px] border-r border-ink-100 bg-white flex-col">
        <div className="h-[64px] flex items-center gap-2 px-6 border-b border-ink-100">
          <div className="h-8 w-8 rounded-[10px] bg-ink-900 text-white flex items-center justify-center font-bold">Q</div>
          <span className="display font-semibold">QRmandu</span>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          {[
            { href: '/dashboard', label: 'Dashboard' },
            { href: '/dashboard/qr', label: 'QR Codes' },
            { href: '/dashboard/review-page', label: 'Review Page' },
            { href: '/dashboard/analytics', label: 'Analytics' },
            { href: '/dashboard/subscription', label: 'Subscription' },
            { href: '/dashboard/settings', label: 'Business Settings' },
          ].map(item => (
            <Link key={item.href} href={item.href} className="flex h-10 items-center rounded-[10px] px-3 text-[14px] font-medium text-ink-700 hover:bg-ink-50 hover:text-ink-900">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-ink-100">
          <div className="text-[12px] text-ink-500">{user.email}</div>
          <form action="/api/auth/logout" method="post">
            <button formAction="/api/auth/logout" className="mt-2 text-[13px] underline">Logout</button>
          </form>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[64px] border-b border-ink-100 bg-white flex items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-7 w-7 rounded-[8px] bg-ink-900 text-white flex items-center justify-center font-bold text-[12px]">Q</div>
              <span className="display font-semibold text-[16px]">QRmandu</span>
            </div>
            {business && (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-[14px] font-semibold">{business.name}</div>
                <div className={`text-[11px] px-2 py-0.5 rounded-full border ${trialExpired ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                  {business.subscription_status === 'active' ? 'Active' : trialExpired ? 'Expired' : 'Trial'}
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {business && !trialExpired && (
              <div className="text-[12px] text-ink-500 hidden md:block">
                {business.subscription_status === 'active' ? `Subscription active` : `Trial ends soon`}
              </div>
            )}
            <Link href="/dashboard/subscription" className="h-9 px-4 rounded-[10px] bg-ink-900 text-white text-[13px] font-medium flex items-center">Subscription</Link>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {business && trialExpired && (
            <div className="mb-6 rounded-[12px] border border-amber-200 bg-amber-50 p-4 flex justify-between items-center">
              <div className="text-[14px] text-amber-900"><span className="font-semibold">Your trial has expired.</span> Choose a plan to continue using QRmandu.</div>
              <Link href="/dashboard/subscription" className="h-9 px-4 rounded-[10px] bg-ink-900 text-white text-[13px] font-medium flex items-center">Choose plan</Link>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
