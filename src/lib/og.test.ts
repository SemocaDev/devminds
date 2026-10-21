import { describe, expect, it } from 'vitest';
import { imagenOg } from './og';

describe('imagenOg', () => {
  it('usa la imagen en español por defecto', () => {
    expect(imagenOg('es')).toMatchObject({ url: 'https://www.devminds.online/og-image.jpg', width: 1200, height: 630 });
  });
  it('usa la imagen de cada idioma', () => {
    expect(imagenOg('en').url).toBe('https://www.devminds.online/og-image-en.jpg');
    expect(imagenOg('ja').url).toBe('https://www.devminds.online/og-image-ja.jpg');
  });
  it('cae en español con un idioma desconocido', () => {
    expect(imagenOg('fr').url).toBe('https://www.devminds.online/og-image.jpg');
  });
  it('el alt repite el titular del idioma', () => {
    expect(imagenOg('en').alt).toBe('DevMinds builds the software your business needs.');
  });
});
