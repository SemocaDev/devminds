// src/proxy.ts
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

// Create and export the middleware
export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

// Match all paths except for specific files and API routes
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};