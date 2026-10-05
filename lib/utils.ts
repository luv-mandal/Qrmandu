export function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatTimeRemaining(expiresAt: string | Date) {
  const now = new Date().getTime();
  const exp = new Date(expiresAt).getTime();
  const diff = exp - now;
  if (diff <= 0) return 'Expired';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} remaining`;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50);
}

export function generateShortCode(length = 6) {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function isValidGoogleReviewLink(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Must be google.com domain and contain review-related path
    if (!parsed.hostname.includes('google.com')) return false;
    // Accept various Google review URL formats:
    // https://g.page/r/...
    // https://search.google.com/local/writereview?placeid=...
    // https://www.google.com/maps/place/.../...
    // We allow any google.com URL but warn if not obviously review link
    // For validation, just check it's google domain and has https
    if (parsed.protocol !== 'https:') return false;
    // Basic check: should contain at least one of: g.page, search.google.com/local, google.com/maps, review
    const href = url.toLowerCase();
    if (
      href.includes('g.page') ||
      href.includes('search.google.com/local') ||
      href.includes('google.com/maps') ||
      href.includes('google.com/search') ||
      href.includes('review')
    ) {
      return true;
    }
    // Still allow if google.com but not matching above? For safety, allow google.com domain
    return true;
  } catch {
    return false;
  }
}

export function getWhatsAppLink(phone: string, message: string) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
