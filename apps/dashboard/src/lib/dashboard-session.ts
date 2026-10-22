/**
 * Signed session cookie for dashboard access (Edge-safe: Web Crypto only).
 */

export const SESSION_COOKIE = 'tradingbot_dashboard_session';

const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(s: string): Uint8Array {
  const pad = (4 - (s.length % 4)) % 4;
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad);
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
}

export function isDevAuthBypass(): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    process.env.DASHBOARD_INSECURE_DEV_BYPASS === 'true'
  );
}

export function dashboardSecretConfigured(): boolean {
  const s = process.env.DASHBOARD_API_SECRET;
  return typeof s === 'string' && s.length >= 16;
}

export async function signSessionToken(secret: string): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload = JSON.stringify({ exp });
  const payloadB64 = base64UrlEncode(new TextEncoder().encode(payload));
  const key = await importHmacKey(secret);
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payloadB64));
  const sigB64 = base64UrlEncode(new Uint8Array(sigBuf));
  return `${payloadB64}.${sigB64}`;
}

export async function verifySessionToken(full: string, secret: string): Promise<boolean> {
  const i = full.lastIndexOf('.');
  if (i <= 0) return false;
  const payloadB64 = full.slice(0, i);
  const sigB64 = full.slice(i + 1);
  if (!payloadB64 || !sigB64) return false;
  try {
    const key = await importHmacKey(secret);
    const sigBytes = base64UrlDecode(sigB64);
    const ok = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes as BufferSource,
      new TextEncoder().encode(payloadB64),
    );
    if (!ok) return false;
    const payloadJson = new TextDecoder().decode(base64UrlDecode(payloadB64));
    const { exp } = JSON.parse(payloadJson) as { exp?: number };
    return typeof exp === 'number' && Math.floor(Date.now() / 1000) < exp;
  } catch {
    return false;
  }
}
