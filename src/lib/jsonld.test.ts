import { describe, expect, it } from 'vitest';
import { jsonLd } from './jsonld';

describe('JSON-LD en una etiqueta script', () => {
  it('escapa "<" para que un texto de la DB no cierre el script', () => {
    const salida = jsonLd({ name: 'Proyecto </script><script>alert(1)</script>' });
    expect(salida).not.toContain('</script>');
    expect(JSON.parse(salida)).toEqual({ name: 'Proyecto </script><script>alert(1)</script>' });
  });
});
