import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-[10px] bg-ink-900 flex items-center justify-center text-white font-bold text-[14px]">Q</div>
              <span className="display text-[20px] font-semibold">QRmandu</span>
            </div>
            <p className="text-[14px] leading-6 text-ink-600 max-w-[280px]">Make it easier for your customers to review your business. Simple QR codes, no app needed.</p>
            <div className="mt-6 text-[13px] text-ink-500">WhatsApp support: +977 98XXXXXXXX</div>
          </div>
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-widest text-ink-500 mb-4">Product</div>
            <ul className="space-y-3 text-[14px] text-ink-700">
              <li><Link href="#how-it-works" className="hover:text-ink-900">How It Works</Link></li>
              <li><Link href="#features" className="hover:text-ink-900">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-ink-900">Pricing</Link></li>
              <li><Link href="#faq" className="hover:text-ink-900">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-widest text-ink-500 mb-4">Company</div>
            <ul className="space-y-3 text-[14px] text-ink-700">
              <li><Link href="/about" className="hover:text-ink-900">About</Link></li>
              <li><Link href="/contact" className="hover:text-ink-900">Contact</Link></li>
              <li><Link href="/login" className="hover:text-ink-900">Login</Link></li>
              <li><Link href="/signup" className="hover:text-ink-900">Start trial</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-widest text-ink-500 mb-4">Legal</div>
            <ul className="space-y-3 text-[14px] text-ink-700">
              <li><Link href="/privacy" className="hover:text-ink-900">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-ink-900">Terms</Link></li>
              <li><Link href="/refund-policy" className="hover:text-ink-900">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-ink-100 flex flex-col md:flex-row justify-between gap-4 text-[13px] text-ink-500">
          <div>© {new Date().getFullYear()} QRmandu. All rights reserved.</div>
          <div>Built for local businesses in Nepal and beyond.</div>
        </div>
      </div>
    </footer>
  );
}
