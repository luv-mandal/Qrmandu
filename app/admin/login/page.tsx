'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@qrmandu.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push('/admin');
    } catch (e:any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-6">
      <div className="w-full max-w-[380px] rounded-[20px] bg-white p-8">
        <div className="flex items-center gap-2 justify-center">
          <div className="h-8 w-8 rounded-[10px] bg-ink-900 text-white flex items-center justify-center font-bold">Q</div>
          <span className="display font-semibold">QRmandu Admin</span>
        </div>
        <h1 className="mt-6 text-[20px] font-semibold text-center">Admin login</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div><Label>Email</Label><Input className="mt-2" value={email} onChange={e=>setEmail(e.target.value)} /></div>
          <div><Label>Password</Label><Input className="mt-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
          {error && <div className="rounded-[10px] bg-red-50 border border-red-200 p-3 text-[13px] text-red-800">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Logging in…' : 'Login'}</Button>
        </form>
        <div className="mt-6 text-center text-[12px] text-ink-500">Default: admin@qrmandu.com / admin123<br /><Link href="/" className="underline">Back to site</Link></div>
      </div>
    </div>
  );
}
