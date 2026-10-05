'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper flex">
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-16 max-w-[560px] mx-auto w-full">
        <Link href="/" className="flex items-center gap-2 mb-12">
          <div className="h-8 w-8 rounded-[10px] bg-ink-900 flex items-center justify-center text-white font-bold text-[14px]">Q</div>
          <span className="display text-[20px] font-semibold">QRmandu</span>
        </Link>

        <div>
          <h1 className="display text-[32px] font-semibold leading-tight">Create your account</h1>
          <p className="mt-2 text-[15px] text-ink-600">Start your 24-hour free trial. No card required.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <Label>Email</Label>
              <Input className="mt-2" type="email" placeholder="you@business.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Password</Label>
              <Input className="mt-2" type="password" placeholder="At least 8 characters" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} />
              <div className="mt-2 text-[12px] text-ink-500">Must be at least 8 characters. We hash it securely server-side.</div>
            </div>

            {error && <div className="rounded-[12px] bg-red-50 border border-red-200 p-3 text-[13px] text-red-800">{error}</div>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Creating account…' : 'Start 24-hour free trial'}
            </Button>

            <div className="text-center text-[13px] text-ink-600">
              Already have an account? <Link href="/login" className="font-medium text-ink-900 underline">Login</Link>
            </div>
          </form>

          <div className="mt-10 rounded-[12px] border border-ink-100 bg-white p-4 text-[12px] leading-5 text-ink-600">
            By signing up you agree to our <Link href="/terms" className="underline">Terms</Link> and <Link href="/privacy" className="underline">Privacy</Link>. Trial countdown starts immediately after signup: <span className="font-mono">23:59:59 remaining</span> shown in dashboard.
          </div>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 bg-ink-900 text-white p-12 flex-col justify-between">
        <div></div>
        <div>
          <div className="display text-[36px] font-semibold leading-tight">Simple for businesses.<br />Extremely fast for customers.</div>
          <div className="mt-6 space-y-4 text-[14px] text-white/70 max-w-[400px]">
            <div className="flex gap-3"><span className="text-white">✓</span> Business onboarding: 9 steps, progress shown, back navigation, never erase data</div>
            <div className="flex gap-3"><span className="text-white">✓</span> 5 QR designs, dynamic QR, real analytics, WhatsApp + coupon flow</div>
            <div className="flex gap-3"><span className="text-white">✓</span> Customer selects only stars — review generated automatically</div>
          </div>
        </div>
        <div className="text-[12px] text-white/50">© QRmandu • Built for local businesses</div>
      </div>
    </div>
  );
}
