import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';

export const metadata = { title: 'Refund Policy — QRmandu' };

export default function Refund() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="mx-auto max-w-[720px] px-6 py-16">
        <h1 className="display text-[36px] font-semibold">Refund Policy</h1>
        <div className="mt-8 space-y-6 text-[14px] leading-7 text-ink-700">
          <p>We want you to be happy with QRmandu.</p>
          <p>24-hour free trial lets you test everything: QR creation, designs, review page, analytics. No payment required during trial.</p>
          <p>After trial, you choose a plan via WhatsApp, send payment proof, admin verifies and provides coupon for 1-month activation. If you have issues within 7 days of activation, contact us via WhatsApp for assistance.</p>
          <p>We do not fabricate company registration numbers or addresses. Contact us for support.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
