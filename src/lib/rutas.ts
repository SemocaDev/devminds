import { locales, type Locale } from '@/config/i18n-config';

const prefijo = new RegExp(`^/(${locales.join('|')})(?=/|$)`);

/** Devuelve `pathname` con su prefijo de idioma cambiado a `idioma` (o agregado si no lo tenía). */
export function rutaEnIdioma(pathname: string, idioma: Locale): string {
  if (prefijo.test(pathname)) return pathname.replace(prefijo, `/${idioma}`);
  return pathname === '/' ? `/${idioma}` : `/${idioma}${pathname}`;
}
