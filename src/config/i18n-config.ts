// src/config/i18n-config.ts
export const locales = ['es', 'en', 'ja'] as const;
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'es';