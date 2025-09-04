// Utility functions for data processing and validation
import { z } from 'zod';

// Convert string to kebab-case and trim whitespace
export function toKebabCase(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Validate and normalize redirect parameters
export const redirectParamsSchema = z.object({
  client: z.string().min(1).transform(toKebabCase),
  service: z.string().min(1).transform(toKebabCase),
  industry: z.string().min(1).transform(toKebabCase),
  channel: z.string().min(1).transform(toKebabCase),
  campaign: z.string().optional().transform(val => val ? toKebabCase(val) : undefined),
  dest: z.string().url('Destination must be a valid URL')
});

export type RedirectParams = z.infer<typeof redirectParamsSchema>;

// Hash IP address with salt (for privacy)
export async function hashIP(ip: string): Promise<string> {
  const salt = process.env.IP_HASH_SALT || 'default-salt';
  const data = new TextEncoder().encode(salt + ip);
  
  // Use Web Crypto API (works in both Node and Edge runtime)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Extract real IP from headers (handle proxies)
export function extractIP(headers: Headers): string | null {
  // Try common proxy headers first
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    // Take first IP if comma-separated list
    return forwarded.split(',')[0].trim();
  }

  const realIP = headers.get('x-real-ip');
  if (realIP) {
    return realIP.trim();
  }

  // Fallback to other headers
  return headers.get('cf-connecting-ip') || null;
}

// Validate destination URL is safe to redirect to
export function isValidDestination(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

// Build redirect URL with click_id appended
export function buildRedirectURL(baseURL: string, clickId: string, originalParams: URLSearchParams): string {
  const url = new URL(baseURL);
  
  // Add original params plus click_id
  originalParams.forEach((value, key) => {
    if (key !== 'dest') { // Don't pass dest param to final URL
      url.searchParams.set(key, value);
    }
  });
  url.searchParams.set('click_id', clickId);
  
  return url.toString();
}
