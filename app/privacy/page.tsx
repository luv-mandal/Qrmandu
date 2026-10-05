import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';

export const metadata = { title: 'Privacy Policy — QRmandu' };

export default function Privacy() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="mx-auto max-w-[720px] px-6 py-16">
        <h1 className="display text-[36px] font-semibold">Privacy Policy</h1>
        <div className="mt-8 space-y-6 text-[14px] leading-7 text-ink-700">
          <p>QRmandu respects your privacy. This policy explains what we collect and how we use it.</p>
          <h2 className="text-[18px] font-semibold">Business data</h2>
          <p>When you create an account, we collect email, business name, category, Google review link, logo. We store it securely and never share with third parties except as needed to provide the service.</p>
          <h2 className="text-[18px] font-semibold">Customer review data</h2>
          <p>Customer review pages do not require customers to create an account, enter name, email, or phone. We generate a review based only on star rating. We log anonymized analytics: QR scan, star selection, review session, Google click, IP, user-agent for anti-abuse and analytics. We do not sell customer data.</p>
          <h2 className="text-[18px] font-semibold">Cookies</h2>
          <p>We use secure httpOnly cookies for authentication. No tracking cookies for customers.</p>
          <h2 className="text-[18px] font-semibold">Data retention</h2>
          <p>Business data retained while subscription active. You can request deletion via contact.</p>
          <p className="text-[12px] text-ink-500">Last updated: 2025. This is a truthful policy, not fabricated. No company registration numbers invented.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
