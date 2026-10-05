import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'QRmandu — Turn Customer Visits Into Google Reviews',
    template: '%s | QRmandu',
  },
  description: 'QRmandu gives your customers a simple way to rate their experience and leave your business a Google review. Just a QR scan and a star rating.',
  keywords: ['Google review QR code', 'QR code for Google reviews', 'Google review generator', 'Nepal business reviews'],
  authors: [{ name: 'QRmandu' }],
  creator: 'QRmandu',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://qrmandu.com',
    title: 'QRmandu — Turn Customer Visits Into Google Reviews',
    description: 'Simple QR codes that turn customer visits into Google reviews. No app, no forms, just stars.',
    siteName: 'QRmandu',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QRmandu — Turn Customer Visits Into Google Reviews',
    description: 'Simple QR codes that turn customer visits into Google reviews.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper antialiased">
        {children}
      </body>
    </html>
  );
}
