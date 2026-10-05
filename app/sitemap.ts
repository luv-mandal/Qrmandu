import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://qrmandu.com';
  const pages = [
    '',
    '/google-review-qr-code',
    '/google-review-qr-code-nepal',
    '/google-review-qr-generator',
    '/google-review-qr-code-for-restaurants',
    '/google-review-qr-code-for-hotels',
    '/google-review-qr-code-for-cafes',
    '/google-review-qr-code-for-salons',
    '/google-review-qr-code-for-clinics',
    '/google-review-qr-code-for-shops',
    '/privacy',
    '/terms',
    '/refund-policy',
    '/contact',
    '/about',
  ];
  return pages.map(p => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.7,
  }));
}
