import { describe, expect, it } from 'vitest';
import es from '../../messages/es.json';
import en from '../../messages/en.json';
import ja from '../../messages/ja.json';
import { PREGUNTAS } from '@/config/preguntas';

function claves(obj: unknown, prefijo = ''): string[] {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return [prefijo];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => claves(v, prefijo ? `${prefijo}.${k}` : k));
}

const base = claves(es).sort();

describe('paridad de traducciones', () => {
  it.each([['en', en], ['ja', ja]] as const)('%s tiene exactamente las claves de es', (_, msgs) => {
    expect(claves(msgs).sort()).toEqual(base);
  });
});

describe('preguntas frecuentes', () => {
  it.each([['es', es], ['en', en], ['ja', ja]] as const)('%s tiene pregunta y respuesta para cada id', (_, msgs) => {
    const items = (msgs as { Home: { preguntas?: { items: Record<string, { pregunta?: string; respuesta?: string }> } } }).Home.preguntas?.items ?? {};
    for (const id of PREGUNTAS) {
      expect(items[id]?.pregunta, `${id}.pregunta`).toBeTruthy();
      expect(items[id]?.respuesta, `${id}.respuesta`).toBeTruthy();
    }
  });
});
