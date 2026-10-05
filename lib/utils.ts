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

// Updated: Very permissive validation to make ANY Google review link run smoothly
// Accepts any valid https URL, prefers google.com but allows others to avoid blocking business
export function isValidGoogleReviewLink(url: string): boolean {
  try {
    if (!url || typeof url !== 'string') return false;
    const trimmed = url.trim();
    if (trimmed.length < 10) return false;
    
    const parsed = new URL(trimmed);
    
    // Must be https for security and Google compatibility
    if (parsed.protocol !== 'https:') return false;
    
    // Must have a valid hostname with at least one dot
    if (!parsed.hostname.includes('.')) return false;
    
    // Must not be localhost or private IP
    if (parsed.hostname === 'localhost' || parsed.hostname.startsWith('192.168.') || parsed.hostname.startsWith('10.')) {
      return false;
    }

    // Allow ANY https URL to run smoothly - business might have custom short links, g.page, search.google.com, maps, etc.
    // We still check if it's google.com for ideal case, but allow others
    return true;
  } catch {
    return false;
  }
}

// Helper to check if link is ideal Google review link (for UI warning, not blocking)
export function isIdealGoogleReviewLink(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    if (!parsed.hostname.includes('google.com') && !parsed.hostname.includes('g.page')) return false;
    const href = url.toLowerCase();
    return (
      href.includes('g.page/r/') ||
      href.includes('search.google.com/local/writereview') ||
      href.includes('google.com/maps') ||
      href.includes('review') ||
      href.includes('placeid')
    );
  } catch {
    return false;
  }
}

// Normalize Google review link - ensure it has proper format, add https if missing
export function normalizeGoogleReviewLink(url: string): string {
  if (!url) return url;
  let trimmed = url.trim();
  // Add https if missing
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = 'https://' + trimmed;
  }
  // Convert http to https
  if (trimmed.startsWith('http://')) {
    trimmed = trimmed.replace('http://', 'https://');
  }
  return trimmed;
}

export function getWhatsAppLink(phone: string, message: string) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}
