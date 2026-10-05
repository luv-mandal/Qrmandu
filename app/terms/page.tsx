import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';

export const metadata = { title: 'Terms — QRmandu' };

export default function Terms() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="mx-auto max-w-[720px] px-6 py-16">
        <h1 className="display text-[36px] font-semibold">Terms of Service</h1>
        <div className="mt-8 space-y-6 text-[14px] leading-7 text-ink-700">
          <p>By using QRmandu, you agree to these terms.</p>
          <h2 className="text-[18px] font-semibold">Service</h2>
          <p>QRmandu provides dynamic QR codes that route to a review page where customers select star rating and get a generated review. We open your direct Google review page link for final submission. We do not guarantee Google will publish reviews; final submission is under customer control.</p>
          <h2 className="text-[18px] font-semibold">Trial and subscription</h2>
          <p>24-hour free trial, then paid plans via WhatsApp manual verification and coupon activation. 1-month subscription. No automatic renewal in v1.</p>
          <h2 className="text-[18px] font-semibold">Acceptable use</h2>
          <p>Do not abuse review generation endpoint, do not attempt to bypass rate limits, do not use for spam or fake reviews. Reviews must correspond to real customer experiences.</p>
          <h2 className="text-[18px] font-semibold">Liability</h2>
          <p>Service provided as-is. We are not responsible for Google review publishing decisions.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
