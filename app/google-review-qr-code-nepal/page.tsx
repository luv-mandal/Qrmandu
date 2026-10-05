
import { SeoPage } from '@/components/seo/seo-page';
export const metadata = { title: 'Google Review Qr Code Nepal — QRmandu', description: 'QRmandu helps businesses get more Google reviews with dynamic QR codes, star-only flow, and direct Google review link.' };
export default function Page() {
  return <SeoPage
    title="google-review-qr-code-nepal"
    description="QRmandu gives your customers a simple way to rate their experience and leave your business a Google review. Dynamic QR, 5 designs, real analytics, Nepal-friendly WhatsApp + coupon flow."
    h1="Google Review Qr Code Nepal"
    content={[
      "For local businesses in Nepal and beyond, getting Google reviews is hard because customers have to search, find the listing, and write a review manually. QRmandu removes friction: one scan, one star selection, auto-generated natural review, one tap to your direct Google review page.",
      "Businesses get 24-hour free trial, onboarding in 9 steps, category system with custom category option, logo upload, 5 QR designs (Minimal clean white space, Classic traditional business-card, Premium elegant typography, Modern contemporary local-business, Bold strong CTA), dynamic QR management, real analytics (QR scans, review sessions, star selections, Google clicks, conversion rate), and subscription via WhatsApp + unique coupon activation.",
      "Customer review page is mobile-first, extremely fast, minimal, professional. Business logo, name, How was your experience?, 5 stars, Select your rating. After selection, shows Your review with generated text, Copy Review (changes to Copied ✓), Submit Review. No customer text input, login, signup, email, phone, or unnecessary questions.",
      "Security: authentication, authorization, row-level security, input validation, rate limiting, secure cookies, secure headers, environment variables, API protection, admin protection, audit logging, XSS protection, CSRF where applicable. Anti-abuse: rate limits, per-session limits, suspicious traffic detection, CAPTCHA when necessary, abuse logging, generation limits based on subscription.",
      "SEO: semantic HTML, proper H1/H2, unique title tags, meta descriptions, canonical URLs, OpenGraph, Twitter metadata, XML sitemap, robots.txt, structured data, clean URLs, fast pages, mobile optimization."
    ]}
    faqs={[
      { q: 'How does QR scanning work?', a: 'Printed QR is https://qrmandu.com/r/abc123. When scanned, we track the scan, increment count, log analytics event, and redirect to /review/businessId?qr=code which shows your review page.' },
      { q: 'What about trial and subscription?', a: '24-hour free trial, then 3 packages: Starter Rs 999 (1 QR), Business Rs 1999 (5 QR, recommended), Premium Rs 2999 (20 QR). Choose plan → WhatsApp with pre-filled message → send payment proof → admin verifies → provides unique coupon like QRMD-X7K2-P9LA → business enters coupon → 1-month activation. Coupon validation server-side, states UNUSED, REDEEMED, EXPIRED, INVALID, audit logged.' },
      { q: 'Is it trustworthy?', a: 'We use real product explanations, no fabricated customer counts, testimonials, logos, partnerships, awards, revenue, reviews, certifications. Every button works, every QR works, every analytics number from real events. Design feels like senior product team, not AI template.' },
    ]}
  />;
}
