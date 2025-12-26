// src/i18n.ts
import { getRequestConfig } from 'next-intl/server';

// Temporalmente desactivados: 'en', 'ja' - Solo español activo durante desarrollo
export const locales = ['es'] as const; // , 'en', 'ja'
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'es';

export default getRequestConfig(async ({ locale }) => {
  // Ensure locale is one of our supported locales, or use default
  const safeLocale = locales.includes(locale as Locale) 
    ? locale as Locale 
    : defaultLocale;
  
  return {
    messages: (await import(`../messages/${safeLocale}.json`)).default,
    locale: safeLocale // This is now guaranteed to be a string from our locales
  };
});