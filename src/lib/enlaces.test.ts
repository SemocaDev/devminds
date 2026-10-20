import { describe, expect, it } from 'vitest';
import { enlaceCorreo, enlaceLlamada, enlaceWhatsApp } from './enlaces';

describe('enlaceWhatsApp', () => {
  it('usa el número con indicativo y sin símbolos', () => {
    expect(enlaceWhatsApp()).toBe('https://wa.me/573102007674');
  });
  it('codifica acentos, signos y ampersand', () => {
    expect(enlaceWhatsApp('Hola, ¿cómo están? Sí & #1')).toBe(
      'https://wa.me/573102007674?text=Hola%2C%20%C2%BFc%C3%B3mo%20est%C3%A1n%3F%20S%C3%AD%20%26%20%231'
    );
  });
  it('codifica texto en japonés', () => {
    expect(enlaceWhatsApp('相談')).toBe('https://wa.me/573102007674?text=%E7%9B%B8%E8%AB%87');
  });
  it('ignora un mensaje vacío', () => {
    expect(enlaceWhatsApp('')).toBe('https://wa.me/573102007674');
  });
});

describe('enlaceLlamada', () => {
  it('arma un tel: internacional', () => {
    expect(enlaceLlamada()).toBe('tel:+573102007674');
  });
});

describe('enlaceCorreo', () => {
  it('sin asunto', () => {
    expect(enlaceCorreo()).toBe('mailto:semoca00@gmail.com');
  });
  it('con asunto codificado', () => {
    expect(enlaceCorreo('Proyecto web')).toBe('mailto:semoca00@gmail.com?subject=Proyecto%20web');
  });
});
