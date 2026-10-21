import type { Metadata } from 'next';
import { imagenOg } from '@/lib/og';

const BASE = 'https://www.devminds.online';
const IDIOMAS = ['es', 'en', 'ja'] as const;
const LOCALES: Record<string, string> = { es: 'es_CO', en: 'en_US', ja: 'ja_JP' };

type Imagen = { url: string; width?: number; height?: number; alt: string };

/** Metadata de una página interna: Open Graph, Twitter, canonical y alternates por idioma. */
export function metadataDePagina(o: { lang: string; ruta: string; title: string; description: string; imagen?: Imagen }): Metadata {
  const { lang, ruta, title, description } = o;
  const imagen = o.imagen ?? imagenOg(lang);
  const url = (idioma: string) => `${BASE}/${idioma}${ruta}`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: url(lang),
      siteName: 'DevMinds',
      locale: LOCALES[lang] ?? LOCALES.es,
      type: 'website',
      images: [imagen],
    },
    twitter: { card: 'summary_large_image', title, description, images: [imagen.url] },
    alternates: {
      canonical: url(lang),
      languages: { 'x-default': url('es'), ...Object.fromEntries(IDIOMAS.map((i) => [i, url(i)])) },
    },
  };
}
