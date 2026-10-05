import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8 pt-16 pb-24 lg:pt-28 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-1 text-[12px] font-medium text-ink-700">
                <span className="h-2 w-2 rounded-full bg-accent-500 animate-pulse" />
                24-hour free trial • No card required
              </div>
              <h1 className="display mt-6 text-[42px] lg:text-[56px] font-[600] leading-[0.95] tracking-tight text-ink-900">
                Turn Customer<br />Visits Into<br />
                <span className="text-ink-400">Google Reviews</span>
              </h1>
              <p className="mt-6 text-[18px] leading-7 text-ink-600 max-w-[480px]">
                QRmandu gives your customers a simple way to rate their experience and leave your business a Google review.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/signup" className="inline-flex h-[48px] items-center justify-center rounded-[12px] bg-ink-900 px-7 text-[15px] font-medium text-white shadow-soft hover:bg-ink-800 transition">
                  Start 24-hour free trial
                </Link>
                <Link href="#how-it-works" className="inline-flex h-[48px] items-center justify-center rounded-[12px] border border-ink-200 bg-white px-7 text-[15px] font-medium text-ink-900 hover:bg-ink-50 transition">
                  See how it works
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-6 text-[13px] text-ink-500">
                <div className="flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-ink-900 text-white flex items-center justify-center text-[11px]">✓</span> No customer app</div>
                <div className="flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-ink-900 text-white flex items-center justify-center text-[11px]">✓</span> Direct Google link</div>
                <div className="flex items-center gap-2"><span className="h-5 w-5 rounded-full bg-ink-900 text-white flex items-center justify-center text-[11px]">✓</span> 2-min setup</div>
              </div>
            </div>

            {/* Product Preview */}
            <div className="relative lg:pl-8">
              <div className="relative mx-auto max-w-[380px] rounded-[32px] border border-ink-200 bg-white p-3 shadow-soft-lg">
                <div className="rounded-[24px] border border-ink-100 bg-ink-50 p-6">
                  <div className="flex justify-center">
                    <div className="h-10 w-10 rounded-full bg-white border border-ink-200 flex items-center justify-center text-[18px] font-bold">A</div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-[11px] uppercase tracking-widest font-semibold text-ink-500">ABC Book Store</div>
                    <div className="display mt-2 text-[22px] font-semibold">How was your experience?</div>
                    <div className="mt-5 flex justify-center gap-2">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-10 w-10 rounded-full border flex items-center justify-center text-[18px] ${i===5 ? 'bg-ink-900 text-white border-ink-900' : 'bg-white border-ink-200 text-ink-300'}`}>★</div>
                      ))}
                    </div>
                    <div className="mt-2 text-[13px] text-ink-500">Select your rating</div>

                    <div className="mt-6 rounded-[16px] bg-white border border-ink-100 p-4 text-left">
                      <div className="text-[11px] uppercase tracking-widest font-semibold text-ink-500">Your review</div>
                      <div className="mt-2 text-[14px] leading-6 text-ink-800">Really loved my time here at ABC Book Store. Staff were friendly and helpful and place was clean and well maintained. Highly recommend to others.</div>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="h-10 rounded-[10px] border border-ink-200 flex items-center justify-center text-[13px] font-medium">Copy review</div>
                        <div className="h-10 rounded-[10px] bg-ink-900 text-white flex items-center justify-center text-[13px] font-medium">Submit review</div>
                      </div>
                    </div>

                    <div className="mt-4 text-[11px] text-ink-400">Powered by QRmandu • No login required</div>
                  </div>
                </div>
              </div>

              {/* Floating QR */}
              <div className="absolute -right-6 top-12 hidden lg:block rounded-[16px] border border-ink-200 bg-white p-4 shadow-soft w-[180px]">
                <div className="h-[120px] w-[120px] mx-auto bg-ink-900 rounded-[8px] grid grid-cols-5 gap-[2px] p-2">
                  {Array.from({length:25}).map((_,i)=>(<div key={i} className={`rounded-[1px] ${Math.random()>0.5?'bg-white':'bg-transparent'}`} />))}
                </div>
                <div className="mt-3 text-center">
                  <div className="text-[12px] font-semibold">Scan to review</div>
                  <div className="text-[10px] text-ink-500">ABC Book Store</div>
                </div>
              </div>

              <div className="absolute -left-8 bottom-8 hidden lg:block rounded-[12px] border border-ink-100 bg-white px-4 py-3 shadow-soft">
                <div className="text-[11px] text-ink-500">Conversion today</div>
                <div className="text-[18px] font-semibold">65.6% • 42 reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-y border-ink-100 bg-white">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6 text-[13px]">
          {[
            '24-hour free trial',
            'Simple setup',
            'No customer app required',
            'Mobile-first',
            'Direct Google review destination',
            'Easy QR printing',
            'Simple business dashboard',
          ].map(t => (
            <div key={t} className="flex items-center gap-2 text-ink-700">
              <span className="h-6 w-6 rounded-full bg-ink-50 border border-ink-100 flex items-center justify-center text-[10px]">✓</span>
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="max-w-[560px]">
            <div className="text-[12px] font-semibold uppercase tracking-widest text-ink-500">How it works</div>
            <h2 className="display mt-3 text-[36px] font-semibold leading-[1.1]">From scan to Google review in 15 seconds</h2>
            <p className="mt-4 text-[16px] leading-7 text-ink-600">Customer scans your QR. Selects stars. Gets a natural review generated. One tap opens your direct Google review page. They paste and submit.</p>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Business creates QR', desc: 'Sign up, add your Google review link, upload logo, pick a QR design. Download and print.' },
              { step: '02', title: 'Customer scans & rates', desc: 'No app, no signup, no form. Customer just selects 1-5 stars. Review is generated automatically.' },
              { step: '03', title: 'Submits on Google', desc: 'Tap Submit Review. We open your exact Google review page and copy the review. Customer pastes and posts.' },
            ].map(card => (
              <div key={card.step} className="rounded-[20px] border border-ink-100 bg-white p-8 shadow-soft">
                <div className="text-[12px] font-mono text-ink-400">{card.step}</div>
                <div className="display mt-3 text-[20px] font-semibold">{card.title}</div>
                <div className="mt-3 text-[14px] leading-6 text-ink-600">{card.desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-[20px] border border-amber-200 bg-amber-50 p-6 flex gap-4">
            <div className="h-8 w-8 rounded-full bg-amber-900 text-white flex items-center justify-center text-[14px] flex-shrink-0">!</div>
            <div className="text-[14px] leading-6 text-amber-900">
              <span className="font-semibold">Honest handoff:</span> We never fake Google submission. If browser restrictions prevent auto-inserting text into Google’s composer, we copy the review and show clear paste instructions. Final submission stays with the customer — exactly how Google wants it.
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-white border-y border-ink-100">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-widest text-ink-500">Features</div>
              <h2 className="display mt-3 text-[36px] font-semibold leading-[1.1]">Everything you need to get more Google reviews</h2>
              <div className="mt-10 space-y-8">
                {[
                  { title: 'Dynamic QR codes', desc: 'Print once. We use qrmandu.com/r/xyz links, not your Google URL directly. Change destination anytime without reprinting.' },
                  { title: '5 professional QR designs', desc: 'Minimal, Classic, Premium, Modern, Bold. Each includes your logo, business name, CTA, and stays highly scannable.' },
                  { title: 'Star-only customer flow', desc: 'No name, no email, no phone, no manual writing. Customer only selects stars. We generate a unique, natural, simple-English review.' },
                  { title: 'Real analytics', desc: 'QR scans, review sessions, star selections, Google clicks, conversion rate. All from real events, never fabricated.' },
                  { title: 'Nepal-friendly payments', desc: 'Choose a plan, WhatsApp us, send proof, get a unique coupon code, activate 1-month subscription. No card needed.' },
                ].map(f => (
                  <div key={f.title} className="flex gap-4">
                    <div className="h-7 w-7 rounded-full bg-ink-900 text-white flex items-center justify-center text-[12px] flex-shrink-0 mt-0.5">✓</div>
                    <div>
                      <div className="font-semibold text-[15px]">{f.title}</div>
                      <div className="mt-1 text-[14px] leading-6 text-ink-600">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[20px] border border-ink-100 bg-ink-50 p-8">
                <div className="text-[12px] uppercase tracking-widest font-semibold text-ink-500">Customer review page</div>
                <div className="mt-4 grid grid-cols-5 gap-2">
                  <div className="rounded-[12px] bg-white border border-ink-200 p-3 text-center"><div className="text-[10px] text-ink-500">Minimal</div><div className="mt-2 h-16 bg-ink-900 rounded" /></div>
                  <div className="rounded-[12px] bg-white border border-ink-900 p-3 text-center ring-1 ring-ink-900"><div className="text-[10px] font-semibold">Classic</div><div className="mt-2 h-16 bg-ink-900 rounded" /></div>
                  <div className="rounded-[12px] bg-white border border-ink-200 p-3 text-center"><div className="text-[10px] text-ink-500">Premium</div><div className="mt-2 h-16 bg-ink-900 rounded" /></div>
                  <div className="rounded-[12px] bg-white border border-ink-200 p-3 text-center"><div className="text-[10px] text-ink-500">Modern</div><div className="mt-2 h-16 bg-ink-900 rounded" /></div>
                  <div className="rounded-[12px] bg-white border border-ink-200 p-3 text-center"><div className="text-[10px] text-ink-500">Bold</div><div className="mt-2 h-16 bg-ink-900 rounded" /></div>
                </div>
                <div className="mt-6 text-[13px] text-ink-600">Every design includes QR, business name, logo, review CTA, and “Powered by QRmandu”. QR readability is never sacrificed for decoration.</div>
              </div>

              <div className="rounded-[20px] border border-ink-100 bg-white p-8 shadow-soft">
                <div className="text-[12px] uppercase tracking-widest font-semibold text-ink-500">Review generation</div>
                <div className="mt-4 space-y-3 text-[14px]">
                  <div className="flex justify-between"><span>5 stars</span><span className="text-ink-500">Positive & enthusiastic</span></div>
                  <div className="flex justify-between"><span>4 stars</span><span className="text-ink-500">Positive but realistic</span></div>
                  <div className="flex justify-between"><span>3 stars</span><span className="text-ink-500">Balanced</span></div>
                  <div className="flex justify-between"><span>2 stars</span><span className="text-ink-500">Respectful criticism</span></div>
                  <div className="flex justify-between"><span>1 star</span><span className="text-ink-500">Respectful negative feedback</span></div>
                </div>
                <div className="mt-6 text-[13px] leading-5 text-ink-600">Unique every time. Varies opening, sentence structure, length, vocabulary, rhythm, tone. Simple English, human-like, non-repetitive. No fake experiences invented.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="text-center max-w-[600px] mx-auto">
            <div className="text-[12px] font-semibold uppercase tracking-widest text-ink-500">Pricing</div>
            <h2 className="display mt-3 text-[36px] font-semibold">Simple plans for local businesses</h2>
            <p className="mt-4 text-[16px] text-ink-600">Start with 24-hour free trial. No card. After trial, choose a plan, WhatsApp us, get coupon, activate.</p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
            {[
              { name: 'Starter', price: 'Rs 999', duration: '/month', features: ['1 QR code', 'Up to 200 scans/month', 'Basic analytics', 'Email support'], rec: false },
              { name: 'Business', price: 'Rs 1,999', duration: '/month', features: ['5 QR codes', 'Unlimited scans', 'Advanced analytics', 'Priority support', 'Custom branding'], rec: true },
              { name: 'Premium', price: 'Rs 2,999', duration: '/month', features: ['20 QR codes', 'Unlimited scans', 'Advanced analytics + export', 'Dedicated support', 'API access', 'White-label'], rec: false },
            ].map(plan => (
              <div key={plan.name} className={`rounded-[20px] border p-8 ${plan.rec ? 'border-ink-900 bg-ink-900 text-white shadow-soft-lg' : 'border-ink-200 bg-white'}`}>
                {plan.rec && <div className="inline-flex rounded-full bg-white text-ink-900 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">Most popular</div>}
                <div className="mt-4 text-[18px] font-semibold">{plan.name}</div>
                <div className="mt-2 flex items-baseline gap-1"><span className="text-[32px] font-bold">{plan.price}</span><span className={`text-[14px] ${plan.rec ? 'text-white/60' : 'text-ink-500'}`}>{plan.duration}</span></div>
                <ul className="mt-6 space-y-3 text-[14px]">
                  {plan.features.map(f => (
                    <li key={f} className="flex gap-2"><span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${plan.rec ? 'bg-white text-ink-900' : 'bg-ink-900 text-white'}`}>✓</span>{f}</li>
                  ))}
                </ul>
                <Link href="/signup" className={`mt-8 flex h-11 items-center justify-center rounded-[12px] text-[14px] font-medium ${plan.rec ? 'bg-white text-ink-900 hover:bg-ink-50' : 'bg-ink-900 text-white hover:bg-ink-800'}`}>Choose plan</Link>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center text-[13px] text-ink-500">WhatsApp payment flow • Manual coupon verification • 1-month activation • Extend anytime</div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white border-y border-ink-100">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="max-w-[640px] mx-auto">
            <div className="text-center">
              <div className="text-[12px] font-semibold uppercase tracking-widest text-ink-500">FAQ</div>
              <h2 className="display mt-3 text-[32px] font-semibold">Common questions</h2>
            </div>
            <div className="mt-12 space-y-6">
              {[
                { q: 'Do customers need to create an account?', a: 'No. Customer flow is locked: scan QR → select stars only → get generated review → copy → submit on Google. No name, email, phone, or manual writing.' },
                { q: 'What Google link do I need to provide?', a: 'Your direct Google Review Page Link (e.g., g.page/r/.../review or search.google.com/local/writereview?placeid=...). We do not ask for a generic Maps search URL. We open that exact URL on Submit Review.' },
                { q: 'Can QRmandu automatically post to Google?', a: 'No, and we do not fake it. We open your direct review link, copy the generated review to clipboard, and show clear paste instructions. Final submission stays under customer control, as required by Google.' },
                { q: 'What happens after 24-hour trial?', a: 'Trial expires and you see three plans. Choose one, we open WhatsApp with a pre-filled message. Send payment proof, admin verifies, gives you a unique coupon like QRMD-X7K2-P9LA. Enter coupon to activate 1-month subscription.' },
                { q: 'Is the QR dynamic?', a: 'Yes. We never encode your Google URL directly. Printed QR is https://qrmandu.com/r/abc123 which routes through QRmandu to your review page. You can manage it later without reprinting.' },
                { q: 'Are generated reviews unique?', a: 'Yes. Every generation is unique, natural, simple-English, human-like, appropriate to the selected rating, non-repetitive, with varied opening, structure, length, vocabulary, rhythm, tone.' },
              ].map(item => (
                <div key={item.q} className="rounded-[16px] border border-ink-100 p-6">
                  <div className="font-semibold text-[15px]">{item.q}</div>
                  <div className="mt-2 text-[14px] leading-6 text-ink-600">{item.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-[1200px] px-6 lg:px-8">
          <div className="rounded-[24px] bg-ink-900 px-8 py-16 lg:px-16 lg:py-20 text-center text-white">
            <h2 className="display text-[32px] lg:text-[44px] font-semibold leading-[1.05]">Give your customers an easier<br />way to review your business.</h2>
            <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-6 text-white/70">24-hour free trial, 2-minute setup, no customer app, direct Google destination, real analytics.</p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/signup" className="inline-flex h-12 items-center justify-center rounded-[12px] bg-white px-7 text-[15px] font-medium text-ink-900 hover:bg-ink-50">Start 24-hour free trial</Link>
              <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-[12px] border border-white/20 px-7 text-[15px] font-medium text-white hover:bg-white/10">Login</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
