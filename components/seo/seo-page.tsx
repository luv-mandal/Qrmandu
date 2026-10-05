import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import Link from 'next/link';

export function SeoPage({ title, description, h1, content, faqs }: { title: string, description: string, h1: string, content: string[], faqs: {q:string,a:string}[] }) {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="mx-auto max-w-[800px] px-6 lg:px-8 py-16">
        <div className="text-[12px] uppercase tracking-widest font-semibold text-ink-500">QRmandu Guide</div>
        <h1 className="display mt-3 text-[36px] font-semibold leading-[1.1]">{h1}</h1>
        <p className="mt-4 text-[16px] leading-7 text-ink-600">{description}</p>

        <div className="mt-12 space-y-6 text-[15px] leading-7 text-ink-700">
          {content.map((p,i)=><p key={i}>{p}</p>)}
        </div>

        <div className="mt-12 rounded-[20px] border border-ink-100 bg-white p-8">
          <div className="font-semibold">How QRmandu works for this use case</div>
          <ol className="mt-4 space-y-3 list-decimal pl-5 text-[14px] text-ink-700">
            <li>Business signs up, adds direct Google Review Page Link (g.page/r/... or search.google.com/local/writereview?placeid=...), uploads logo, selects QR design from 5 options.</li>
            <li>Dynamic QR generated: https://qrmandu.com/r/xyz — print and place at entrance, tables, checkout, bills.</li>
            <li>Customer scans, sees review page with business logo/name, selects only star rating (1-5).</li>
            <li>QRmandu generates unique, natural, simple-English review appropriate to rating.</li>
            <li>Customer taps Submit Review → opens exact Google review link, review copied to clipboard, paste instructions shown. Customer completes final submission on Google.</li>
          </ol>
        </div>

        <div className="mt-12">
          <h2 className="display text-[24px] font-semibold">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {faqs.map(f=>(
              <div key={f.q} className="rounded-[12px] border border-ink-100 bg-white p-5">
                <div className="font-medium text-[14px]">{f.q}</div>
                <div className="mt-2 text-[14px] text-ink-600 leading-6">{f.a}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-[20px] bg-ink-900 text-white p-8 text-center">
          <div className="display text-[24px] font-semibold">Start your 24-hour free trial</div>
          <div className="mt-2 text-[14px] text-white/70">No card required • 2-minute setup • Real QR preview</div>
          <Link href="/signup" className="mt-6 inline-flex h-11 px-6 rounded-[12px] bg-white text-ink-900 text-[14px] font-medium">Start free trial</Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
