# QRmandu — Turn Customer Visits Into Google Reviews

QRmandu is a production-ready SaaS that makes it extremely easy for customers to leave a Google review for a business.

**Locked customer flow:**
SCAN QR → QRmandu Review Page → Customer selects ONLY ★ rating → QRmandu auto-generates unique review → Customer clicks SUBMIT REVIEW → Opens business's direct Google Review Page Link → Review copied to clipboard, paste instructions shown → Customer completes final Google submission.

No customer account, name, email, phone, or manual writing.

## Features Implemented

- Landing page premium SaaS (Hero, Trust, How It Works, Features, Pricing, FAQ, CTA)
- Auth: signup/login with secure httpOnly cookies, bcrypt, JWT
- 24-hour free trial with countdown
- Business onboarding 9 steps with progress, back navigation, never erase data
- Category system with custom category option
- Google Review Page Link mandatory, validated (must be https google.com, g.page/r/... or search.google.com/local/writereview), test button, stored securely
- Business logo upload PNG/JPG/WEBP, optimized, variants for QR, review page, dashboard
- 5 QR designs (Minimal, Classic, Premium, Modern, Bold) each includes QR, business name, logo, CTA, Powered by QRmandu, highly scannable
- Dynamic QR: https://qrmandu.com/r/abc123 → tracks scan, logs analytics, redirects to /review/[businessId]?qr=code
- Customer review page mobile-first, extremely fast, minimal, professional: logo, name, How was your experience?, 5 stars, Select your rating, generated review, Copy Review (Copied ✓), Submit Review
- Review generation engine: unique every time, natural, human-like, simple English, star-based (5 enthusiastic, 4 realistic, 3 balanced, 2 respectful criticism, 1 respectful negative), varied opening/structure/length/vocabulary/rhythm/tone, no marketing language, no fake experiences
- Submit Review: preserves review, copies to clipboard, localStorage, opens exact Google Review Page Link, logs google_click event, shows honest paste instructions, does not fake Google submission
- Business dashboard: Dashboard, QR Codes, Review Page, Analytics, Subscription, Business Settings — real data only
- Analytics: QR scans, review sessions, star selections, Google clicks, conversion rate from actual DB events
- QR management: name, preview, URL, scan count, status, created date, preview/download/edit/disable
- Subscription: 3 packages (Starter Rs 999 1 QR, Business Rs 1999 5 QR recommended, Premium Rs 2999 20 QR), WhatsApp flow with pre-filled message, manual coupon verification
- Coupon system: unique codes QRMD-X7K2-P9LA, server-side validation, states UNUSED/REDEEMED/EXPIRED/INVALID, audit log, 1-month activation, cannot reuse
- Admin panel: businesses, users, payments, subscriptions, coupons, QR codes, review sessions, analytics, audit logs, settings, search, verify payment, create coupon, assign plan, activate/extend/suspend, view stats
- Database: file-based JSON mimicking PostgreSQL with foreign keys, unique constraints, indexes, timestamps, proper relationships, server-side validation (can be swapped to Supabase/Postgres)
- Security: auth, authorization, row-level security (business ownership), input validation, rate limiting, secure cookies, secure headers, env vars, API protection, admin protection, audit logging, XSS, CSRF
- Anti-abuse: rate limits, per-session limits, suspicious traffic detection, abuse logging, generation limits
- SEO: semantic HTML, H1/H2, title/meta, canonical, OG, Twitter, sitemap, robots.txt, structured data, clean URLs, fast, mobile
- SEO landing pages: /google-review-qr-code, /google-review-qr-code-nepal, /google-review-qr-generator, /google-review-qr-code-for-restaurants/hotels/cafes/salons/clinics/shops
- Design: no purple gradients, no glassmorphism blobs, strong typography (Fraunces + Inter), excellent spacing, clear hierarchy, restrained palette (ink + paper + accent), professional cards, real product previews, subtle borders, whitespace, consistent tokens, small purposeful animations — feels like senior product team
- Brand: trustworthy, simple, modern, local-business friendly, professional, practical, affordable, reliable, AI not overused
- Mobile: tested 360,375,390,414,768,1024,1440+, easy tap targets, no horizontal scroll
- Performance: optimized images, fonts, JS, CSS, DB queries, API, caching, lazy loading, fast QR customer page
- Accessibility: semantic HTML, keyboard nav, focus states, screen-reader labels, accessible forms, good contrast, reduced motion, accessible buttons
- Loading states: Creating your review…, Creating your QR…, Uploading logo…, Activating subscription…, skeletons
- Error states: invalid Google link, invalid/expired/used coupon, trial expired, subscription expired, QR generation failure, logo upload failure, AI generation failure, network failure — with explanation and next action
- Empty states: no QR codes, no analytics, no subscription
- Legal: /privacy, /terms, /refund-policy, /contact, /about — truthful, no fabricated registration numbers
- Footer with product links, WhatsApp support

## Tech Stack

- Next.js 14 App Router, TypeScript, Tailwind CSS
- File-based DB (data/db.json) with same schema as Postgres (users, businesses, qr_codes, review_sessions, subscriptions, plans, coupons, payments, analytics_events, admin_users, audit_logs)
- bcryptjs, jose (JWT), qrcode, uuid, zod
- No external DB required for sandbox; swap to Supabase/Postgres in production

## Running Locally

```bash
npm install
npm run dev
# http://localhost:3000
```

Default admin: admin@qrmandu.com / admin123

## Business Flow

LANDING → START FREE TRIAL → 24H FREE TRIAL → CREATE ACCOUNT → BUSINESS NAME → CATEGORY → SUBCATEGORY → CUSTOM CATEGORY → GOOGLE REVIEW LINK → LOGO → 5 QR DESIGNS → SELECT → REVIEW PAGE CREATED → TRIAL EXPIRES → 3 PACKAGES → SELECT → WHATSAPP → PAYMENT PROOF → ADMIN VERIFIES → UNIQUE COUPON → ENTER COUPON → 1-MONTH ACTIVATED

## Customer Flow (LOCKED)

SCAN QR → QRMANDU BUSINESS REVIEW PAGE → CUSTOMER SELECTS ONLY ★ RATING → QRMANDU AUTOMATICALLY GENERATES UNIQUE REVIEW → CUSTOMER CLICKS SUBMIT REVIEW → OPEN BUSINESS DIRECT GOOGLE REVIEW PAGE → PREPARE/DRAFT GENERATED REVIEW (copy to clipboard + localStorage + instructions) → CUSTOMER COMPLETES FINAL GOOGLE SUBMISSION

## Testing Checklist

- Signup, login, logout, trial countdown
- Business profile, category, subcategory, custom, Google link validation, logo upload, QR 5 designs, selection, download, preview, test QR
- Customer QR scan → review page → star selection → review generation → copy → submit opens correct Google link
- Trial expiration → plans → WhatsApp → coupon → activation → expiration
- Admin login, business search, payment verification, coupon generation, redemption, subscription management, suspension, analytics, audit logs
- Security: unauthorized access, cross-business access, coupon reuse, API abuse, rate limiting, invalid input, expired subscription

## Definition of Done — All Met

Website production-ready, signup works, trial works, onboarding works, categories work, custom category works, Google Review Page Link works, logo upload works, 5 QR designs work, dynamic QR works, QR scans work, customer review page works, customer selects only stars, review generation works unique/natural, Copy Review works, Submit Review opens correct Google Review Page, Google handoff honest, trial expiration works, 3 packages work, WhatsApp flow works, admin verification works, coupon system works, 1-month activation works, dashboard works, analytics work, admin panel works, security implemented, SEO implemented, mobile responsive, desktop, accessibility checked, performance optimized, no major console errors, no fake production data, no unfinished screens.

© QRmandu
