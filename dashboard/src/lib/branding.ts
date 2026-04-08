/**
 * Dashboard chrome — override with NEXT_PUBLIC_APP_NAME at build/runtime (e.g. in `.env`).
 */
export function getAppDisplayName(): string {
  const n = process.env.NEXT_PUBLIC_APP_NAME?.trim();
  return n && n.length > 0 ? n : 'Trading Terminal';
}
