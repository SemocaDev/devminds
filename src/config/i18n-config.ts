// src/config/i18n-config.ts
// Temporalmente desactivados: 'en', 'ja' - Solo español activo durante desarrollo
export const locales = ['es'] as const; // , 'en', 'ja'
export type Locale = typeof locales[number];
export const defaultLocale: Locale = 'es';