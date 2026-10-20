import { describe, expect, it } from 'vitest';
import { rutaEnIdioma } from './rutas';

describe('rutaEnIdioma', () => {
  it('cambia la raíz del idioma', () => {
    expect(rutaEnIdioma('/es', 'en')).toBe('/en');
  });
  it('conserva la subruta', () => {
    expect(rutaEnIdioma('/es/portfolio', 'ja')).toBe('/ja/portfolio');
  });
  it('no toca segmentos que empiezan igual que un idioma', () => {
    expect(rutaEnIdioma('/es/estudio', 'en')).toBe('/en/estudio');
  });
  it('agrega el idioma si la ruta no lo tiene', () => {
    expect(rutaEnIdioma('/', 'ja')).toBe('/ja');
    expect(rutaEnIdioma('/about', 'en')).toBe('/en/about');
  });
});
