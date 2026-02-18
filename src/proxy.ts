// src/proxy.ts (Next.js 16 usa "proxy" en vez de "middleware")
import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';
import { verifyTokenEdge } from './lib/admin/auth';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false,
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes: verify JWT (except login page and API routes)
  if (pathname.startsWith('/admin')) {
    // Let the login page and API routes pass through
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await verifyTokenEdge(token);
    if (!payload) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
  }

  // All other routes: handle with next-intl
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
