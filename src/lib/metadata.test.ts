import { describe, expect, it } from 'vitest';
import { metadataDePagina } from './metadata';

describe('metadata por página', () => {
  const base = { lang: 'en', ruta: '/about', title: 'About', description: 'Who builds it' };

  it('apunta el canonical y los idiomas a la misma ruta', () => {
    const m = metadataDePagina(base);
    expect(m.alternates?.canonical).toBe('https://www.devminds.online/en/about');
    expect(m.alternates?.languages).toEqual({
      'x-default': 'https://www.devminds.online/es/about',
      es: 'https://www.devminds.online/es/about',
      en: 'https://www.devminds.online/en/about',
      ja: 'https://www.devminds.online/ja/about',
    });
  });

  it('usa la imagen y el locale del mercado', () => {
    const og = metadataDePagina(base).openGraph as { locale: string; images: { url: string }[] };
    expect(og.locale).toBe('en_US');
    expect(og.images[0].url).toMatch(/og-image-en\.jpg$/);
  });

  it('acepta una imagen propia, como la de un proyecto', () => {
    const imagen = { url: 'https://x.test/p.jpg', alt: 'RMConta' };
    const m = metadataDePagina({ ...base, imagen });
    expect((m.openGraph as { images: unknown[] }).images[0]).toEqual(imagen);
    expect((m.twitter as { images: string[] }).images[0]).toBe('https://x.test/p.jpg');
  });
});
