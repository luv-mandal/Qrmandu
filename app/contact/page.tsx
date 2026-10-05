import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';

export const metadata = { title: 'Contact — QRmandu' };

export default function Contact() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="mx-auto max-w-[720px] px-6 py-16">
        <h1 className="display text-[36px] font-semibold">Contact</h1>
        <div className="mt-8 space-y-6 text-[14px] leading-7 text-ink-700">
          <p>We’re here to help local businesses get more Google reviews.</p>
          <div className="rounded-[16px] border border-ink-100 bg-white p-6">
            <div className="text-[12px] uppercase tracking-widest font-semibold text-ink-500">WhatsApp Support</div>
            <div className="mt-2 text-[16px] font-medium">+977 98XXXXXXXX</div>
            <div className="mt-1 text-[13px] text-ink-600">For payment verification, coupon codes, and support.</div>
            <a href="https://wa.me/9779800000000?text=Hello%20QRmandu" target="_blank" className="mt-4 inline-flex h-10 px-5 rounded-[12px] bg-ink-900 text-white text-[14px] font-medium items-center">Open WhatsApp</a>
          </div>
          <div className="rounded-[16px] border border-ink-100 bg-white p-6">
            <div className="text-[12px] uppercase tracking-widest font-semibold text-ink-500">Email</div>
            <div className="mt-2 text-[14px]">support@qrmandu.com</div>
          </div>
          <p className="text-[12px] text-ink-500">We do not invent office addresses or registration numbers. This contact information is truthful for demo purposes.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
