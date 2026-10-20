import { describe, expect, it } from 'vitest';
import { lineaMeta } from './proyectos';

describe('lineaMeta', () => {
  it('une las partes con punto medio', () => {
    expect(lineaMeta(['Página web', 'Wilson Isaza', 2026])).toBe('Página web · Wilson Isaza · 2026');
  });
  it('omite vacíos, null y undefined', () => {
    expect(lineaMeta(['Sistema a medida', null, undefined, '', 2026])).toBe('Sistema a medida · 2026');
  });
  it('todo vacío da cadena vacía', () => {
    expect(lineaMeta([null, undefined])).toBe('');
  });
});
