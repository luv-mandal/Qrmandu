'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      if (data.isAdmin) router.push('/admin');
      else router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-[400px]">
        <Link href="/" className="flex items-center gap-2 justify-center mb-10">
          <div className="h-8 w-8 rounded-[10px] bg-ink-900 flex items-center justify-center text-white font-bold text-[14px]">Q</div>
          <span className="display text-[20px] font-semibold">QRmandu</span>
        </Link>

        <div className="rounded-[20px] border border-ink-100 bg-white p-8 shadow-soft">
          <h1 className="display text-[24px] font-semibold">Welcome back</h1>
          <p className="mt-1 text-[14px] text-ink-600">Login to your business dashboard</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Label>Email</Label>
              <Input className="mt-2" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Password</Label>
              <Input className="mt-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
            </div>
            {error && <div className="rounded-[10px] bg-red-50 border border-red-200 p-3 text-[13px] text-red-800">{error}</div>}
            <Button type="submit" disabled={loading} className="w-full">{loading ? 'Logging in…' : 'Login'}</Button>
          </form>

          <div className="mt-6 text-center text-[13px] text-ink-600">
            Don&apos;t have an account? <Link href="/signup" className="font-medium text-ink-900 underline">Start free trial</Link>
          </div>

          <div className="mt-6 border-t border-ink-100 pt-6">
            <div className="text-[11px] uppercase tracking-widest font-semibold text-ink-500">Admin?</div>
            <Link href="/admin/login" className="mt-2 block text-[13px] text-ink-600 hover:text-ink-900 underline">Admin login →</Link>
            <div className="mt-1 text-[11px] text-ink-400">Default: admin@qrmandu.com / admin123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
