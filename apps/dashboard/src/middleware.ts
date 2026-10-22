import {
  SESSION_COOKIE,
  dashboardSecretConfigured,
  isDevAuthBypass,
  verifySessionToken,
} from '@/lib/dashboard-session';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  if (isDevAuthBypass()) {
    return NextResponse.next();
  }

  const secret = process.env.DASHBOARD_API_SECRET;
  const { pathname } = request.nextUrl;

  if (
    pathname === '/login' ||
    pathname === '/api/auth/login' ||
    pathname === '/api/auth/logout'
  ) {
    return NextResponse.next();
  }

  if (!dashboardSecretConfigured() || !secret) {
    const err = 'Server misconfiguration: set DASHBOARD_API_SECRET (min 16 characters)';
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: err }, { status: 503 });
    }
    return new NextResponse(err, {
      status: 503,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const ok = token ? await verifySessionToken(token, secret) : false;

  if (!ok) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
