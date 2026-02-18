// src/proxy.ts (Next.js 16 usa "proxy" en vez de "middleware")
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  // 'always' = siempre muestra /es, /en, /ja en la URL
  localePrefix: 'always',
  // NO detectar idioma del navegador — siempre redirigir a ES por defecto
  // Esto evita que Google vea diferentes respuestas según el crawler
  localeDetection: false,
});

// Match all paths except for static files, API routes, and Vercel internals
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
