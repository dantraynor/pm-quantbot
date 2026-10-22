import {
  SESSION_COOKIE,
  dashboardSecretConfigured,
  isDevAuthBypass,
  signSessionToken,
} from '@/lib/dashboard-session';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (isDevAuthBypass()) {
    return NextResponse.json(
      { error: 'Login disabled when DASHBOARD_INSECURE_DEV_BYPASS is enabled' },
      { status: 503 },
    );
  }

  const secret = process.env.DASHBOARD_API_SECRET;
  if (!dashboardSecretConfigured() || !secret) {
    return NextResponse.json(
      { error: 'Server misconfiguration: set DASHBOARD_API_SECRET (min 16 characters)' },
      { status: 503 },
    );
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (typeof body.password !== 'string' || body.password !== secret) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = await signSessionToken(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return res;
}
