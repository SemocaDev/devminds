const BASE = 'https://www.devminds.online';

const IMAGENES: Record<string, { archivo: string; alt: string }> = {
  es: { archivo: 'og-image.jpg', alt: 'DevMinds crea el software que tu negocio necesita.' },
  en: { archivo: 'og-image-en.jpg', alt: 'DevMinds builds the software your business needs.' },
  ja: { archivo: 'og-image-ja.jpg', alt: 'DevMindsは、あなたのビジネスに必要なソフトウェアをつくります。' },
};

/** Imagen Open Graph (public/og-image*.jpg) del idioma, para metadata de cualquier página; cae en español. */
export function imagenOg(lang: string) {
  const { archivo, alt } = IMAGENES[lang] ?? IMAGENES.es;
  return { url: `${BASE}/${archivo}`, width: 1200, height: 630, alt };
}
