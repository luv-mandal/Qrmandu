'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink-100 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[64px] max-w-[1200px] items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-[10px] bg-ink-900 flex items-center justify-center text-white font-bold text-[14px]">Q</div>
          <span className="display text-[20px] font-semibold tracking-tight text-ink-900">QRmandu</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-ink-600">
          <Link href="#how-it-works" className="hover:text-ink-900 transition">How It Works</Link>
          <Link href="#features" className="hover:text-ink-900 transition">Features</Link>
          <Link href="#pricing" className="hover:text-ink-900 transition">Pricing</Link>
          <Link href="#faq" className="hover:text-ink-900 transition">FAQ</Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-[14px] font-medium text-ink-700 hover:text-ink-900 px-3 py-2">Login</Link>
          <Link href="/signup"><Button size="sm">Start free trial</Button></Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg border border-ink-200">
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className={`block h-0.5 w-full bg-ink-900 transition ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-0.5 w-full bg-ink-900 transition ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 w-full bg-ink-900 transition ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-ink-100 bg-white px-6 py-6 space-y-4 animate-fadeIn">
          <Link href="#how-it-works" onClick={() => setOpen(false)} className="block text-[15px] font-medium">How It Works</Link>
          <Link href="#features" onClick={() => setOpen(false)} className="block text-[15px] font-medium">Features</Link>
          <Link href="#pricing" onClick={() => setOpen(false)} className="block text-[15px] font-medium">Pricing</Link>
          <Link href="#faq" onClick={() => setOpen(false)} className="block text-[15px] font-medium">FAQ</Link>
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/login" className="text-center py-3 border border-ink-200 rounded-[12px] font-medium">Login</Link>
            <Link href="/signup" className="text-center py-3 bg-ink-900 text-white rounded-[12px] font-medium">Start free trial</Link>
          </div>
        </div>
      )}
    </header>
  );
}
