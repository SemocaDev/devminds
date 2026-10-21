// src/i18n.ts
import { getRequestConfig } from 'next-intl/server';

export const locales = ['es', 'en', 'ja'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'es';

// next-intl 4: el idioma llega en `requestLocale` (de setRequestLocale o del proxy). `locale` solo existe
// cuando se pide uno explícito, así que leerlo dejaba todas las páginas de servidor en español.
export default getRequestConfig(async ({ requestLocale, locale: explicito }) => {
  const pedido = explicito ?? (await requestLocale);
  const locale: Locale = locales.includes(pedido as Locale) ? (pedido as Locale) : defaultLocale;
  return {
    messages: (await import(`../messages/${locale}.json`)).default,
    locale,
  };
});
