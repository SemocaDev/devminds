import { describe, expect, it } from 'vitest';
import { elegirFundador } from './equipo';

describe('elegirFundador', () => {
  it('prefiere a quien tiene hierarchy founder', () => {
    expect(elegirFundador([{ hierarchy: 'developer', n: 1 }, { hierarchy: 'founder', n: 2 }])).toEqual({ hierarchy: 'founder', n: 2 });
  });
  it('si no hay founder, usa el primero', () => {
    expect(elegirFundador([{ hierarchy: 'co-founder', n: 1 }])).toEqual({ hierarchy: 'co-founder', n: 1 });
  });
  it('sin miembros devuelve null', () => {
    expect(elegirFundador([])).toBeNull();
  });
});
