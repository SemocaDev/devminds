import { describe, expect, it } from 'vitest';
import { fasesDisponibles, partirPalabras, progresoTrazo, retrasoCruce, tiempoParaProgreso } from './movimiento';

describe('curva del trazo', () => {
  it('va de 0 a 1 y pasa por el medio', () => {
    expect(progresoTrazo(0)).toBe(0);
    expect(progresoTrazo(1)).toBe(1);
    expect(progresoTrazo(0.5)).toBeCloseTo(0.5, 2);
  });

  it('la inversa devuelve el momento en que el trazo alcanza cada fracción', () => {
    for (const f of [0.25, 0.5, 0.75]) expect(Math.abs(progresoTrazo(tiempoParaProgreso(f)) - f)).toBeLessThan(0.005);
    expect(tiempoParaProgreso(0)).toBe(0);
    expect(tiempoParaProgreso(1)).toBe(1);
  });
});

describe('cruces', () => {
  it('nacen cuando la punta del trazo pasa por su vertical', () => {
    expect(Math.abs(retrasoCruce(0.5, 350, 750) - (350 + Math.round(0.5 * 750)))).toBeLessThanOrEqual(2);
    expect(retrasoCruce(0.25, 350, 750)).toBeLessThan(retrasoCruce(0.75, 350, 750));
    expect(retrasoCruce(0, 350, 750)).toBe(350);
  });
});

describe('palabras del titular', () => {
  it('parte por espacios conservando la puntuación', () => {
    const p = partirPalabras('crea el software que tu negocio necesita.', 'es');
    expect(p).toHaveLength(7);
    expect(p.at(-1)).toBe('necesita.');
  });

  it('en japonés el bloque sube entero', () => {
    expect(partirPalabras('あなたのビジネスに', 'ja')).toEqual(['あなたのビジネスに']);
  });
});

describe('barrido de DevMinds', () => {
  it('solo usa las fuentes ya cargadas y siempre termina en Doto', () => {
    expect(fasesDisponibles(new Set())).toEqual(['wm-doto']);
    expect(fasesDisponibles(new Set(['outfit']))).toEqual(['wm-outfit', 'wm-doto']);
    expect(fasesDisponibles(new Set(['serif', 'outfit', 'mono']))).toEqual(['wm-outfit', 'wm-mono', 'wm-serif', 'wm-doto']);
  });
});
