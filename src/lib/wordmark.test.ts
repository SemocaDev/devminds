import { describe, expect, it } from 'vitest';
import { FASES_WORDMARK } from './wordmark';

describe('FASES_WORDMARK', () => {
  it('empieza en Doto con el descanso largo', () => {
    expect(FASES_WORDMARK[0]).toEqual(['wm-doto', 4000]);
  });
  it('pasa por Outfit, Geist Mono e Instrument Serif a 350 ms cada una', () => {
    expect(FASES_WORDMARK.slice(1)).toEqual([['wm-outfit', 350], ['wm-mono', 350], ['wm-serif', 350]]);
  });
  it('Doto ocupa la mayor parte del ciclo', () => {
    const total = FASES_WORDMARK.reduce((s, [, ms]) => s + ms, 0);
    expect(FASES_WORDMARK[0][1] / total).toBeGreaterThan(0.75);
  });
});
