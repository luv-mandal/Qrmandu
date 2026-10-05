import { SeoPage } from '@/components/seo/seo-page';

export const metadata = {
  title: 'Google Review QR Code Generator — QRmandu',
  description: 'Create a Google review QR code that turns customer visits into Google reviews. Dynamic QR, 5 designs, star-only flow, direct Google link.',
};

export default function Page() {
  return <SeoPage
    title="Google Review QR Code"
    description="QRmandu creates a dynamic Google review QR code for your business. Customers scan, select stars only, get a natural review generated, and submit on your direct Google review page."
    h1="Google Review QR Code — Simple, Dynamic, Scannable"
    content={[
      "A Google review QR code is the easiest way to turn a customer visit into a Google review. Instead of asking customers to search your business on Google, you show a QR code at checkout, on tables, or on your entrance.",
      "QRmandu does not encode your Google URL directly into the printed QR. We use a dynamic link like https://qrmandu.com/r/abc123 that routes through QRmandu to your review page. If you change your Google review link later, you do not need to reprint.",
      "Our customer flow is locked for simplicity: scan QR → QRmandu business review page → customer selects ONLY star rating → QRmandu automatically generates a unique, natural, simple-English review → customer clicks Submit Review → we open your exact direct Google Review Page Link and copy the review to clipboard → customer pastes and completes final submission on Google.",
      "We never ask the customer to write a review manually, create an account, or enter name, email, or phone. Only star rating.",
      "Business onboarding is 9 steps: business name, category, subcategory, custom category option, direct Google Review Page Link (paste your direct link, not a generic Maps search URL), upload business logo (PNG, JPG, WEBP, optimized automatically), generate 5 QR designs (Minimal, Classic, Premium, Modern, Bold — each includes QR, business name, logo, CTA, Powered by QRmandu, highly scannable), preview review page, finish. 24-hour free trial starts immediately with countdown.",
    ]}
    faqs={[
      { q: 'What link do I need?', a: 'Your direct Google Review Page Link — e.g., g.page/r/.../review or search.google.com/local/writereview?placeid=... We validate it is https and google.com domain, store securely, allow edit later, and provide Test Review Link button.' },
      { q: 'Can you auto-post to Google?', a: 'No, and we do not fake it. We open your exact Google review page, copy the generated review, and show paste instructions. Final submission stays under customer control, as Google requires.' },
      { q: 'Is the review unique?', a: 'Yes. Every generation is unique, human-like, simple English, appropriate to selected rating (5 positive enthusiastic, 4 positive realistic, 3 balanced, 2 respectful criticism, 1 respectful negative), varied opening, structure, length, vocabulary, rhythm, tone, non-repetitive.' },
    ]}
  />;
}
