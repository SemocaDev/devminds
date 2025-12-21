// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { locales } from '@/config/i18n-config';

// Create and export the middleware
export default createMiddleware({
  // Define supported locales
  locales,
  defaultLocale: 'es', // Cambiado a español como predeterminado
  // This configures the behavior in case someone visits the root URL (/)
  // In this case, they will be redirected to their preferred locale
  localePrefix: 'always'
});

// Match all paths except for specific files and API routes
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};