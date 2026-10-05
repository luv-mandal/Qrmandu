import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';

export const metadata = { title: 'About — QRmandu' };

export default function About() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <div className="mx-auto max-w-[720px] px-6 py-16">
        <h1 className="display text-[36px] font-semibold">About QRmandu</h1>
        <div className="mt-8 space-y-6 text-[15px] leading-7 text-ink-700">
          <p>QRmandu was built to solve a simple problem: customers want to leave Google reviews, but the process is too complicated. They have to search, find the listing, tap write review, and write something manually.</p>
          <p>We make it extremely easy: scan QR, select stars only, get a natural review generated, tap Submit Review, paste on Google, done. No app, no signup, no forms.</p>
          <p>For businesses: 24-hour free trial, 9-step onboarding, category system with custom option, direct Google review page link, logo upload, 5 professional QR designs, dynamic QR (print once, manage anytime), real analytics, WhatsApp + coupon subscription flow, admin verification.</p>
          <p>Our design philosophy: trustworthy, simple, modern, local-business friendly, professional, practical, affordable, reliable. No purple gradients, no glassmorphism blobs, no fake social proof. Real product, real data, real functionality.</p>
          <p>Built as a production-ready SaaS with security, anti-abuse, SEO, mobile-first, accessibility, performance in mind.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
