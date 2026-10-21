import { describe, expect, it } from 'vitest';
import { fichaDe, galeriaDe, hojaDeProyecto, nombreCorto, proyectoYVecinos } from './hojas';
import { generateBreadcrumbSchema } from './schemas/breadcrumb-schema';

describe('hojas del plano', () => {
  it('el nombre corto es lo que va antes del guion', () => {
    expect(nombreCorto('RMConta - Software contable')).toBe('RMConta');
    expect(nombreCorto('DevMinds Links')).toBe('DevMinds Links');
  });

  it('si el nombre corto es solo la marca, usa el título completo', () => {
    expect(nombreCorto('DevMinds - Este sitio')).toBe('DevMinds - Este sitio');
  });

  it('cada proyecto es una subhoja de Portafolio', () => {
    expect(hojaDeProyecto(0)).toBe('03.1');
    expect(hojaDeProyecto(5)).toBe('03.6');
  });

  it('el siguiente proyecto da la vuelta al primero', () => {
    const [a, b, c] = [{ slug: 'a' }, { slug: 'b' }, { slug: 'c' }];
    expect(proyectoYVecinos([a, b, c], 'c')).toEqual({ proyecto: c, indice: 2, siguiente: a });
    expect(proyectoYVecinos([a, b, c], 'a')?.siguiente).toBe(b);
    expect(proyectoYVecinos([a], 'a')?.siguiente).toBe(a);
  });

  it('un slug desconocido no tiene hoja', () => {
    expect(proyectoYVecinos([{ slug: 'a' }], 'zzz')).toBeNull();
  });

  it('la ficha omite los datos que faltan', () => {
    expect(fichaDe({ client: null, year: 2026, duration: null, technologies: [] })).toEqual([{ clave: 'anio', valor: '2026' }]);
    expect(fichaDe({ client: 'Pymes', year: 2025, duration: '3 meses', technologies: ['Next.js', 'PostgreSQL'] })).toEqual([
      { clave: 'cliente', valor: 'Pymes' },
      { clave: 'anio', valor: '2025' },
      { clave: 'duracion', valor: '3 meses' },
      { clave: 'tecnologia', valor: 'Next.js · PostgreSQL' },
    ]);
  });

  it('la galería separa la captura principal del resto', () => {
    expect(galeriaDe([])).toEqual({ principal: null, resto: [] });
    expect(galeriaDe(['x'])).toEqual({ principal: 'x', resto: [] });
    expect(galeriaDe(['x', 'y', 'z'])).toEqual({ principal: 'x', resto: ['y', 'z'] });
  });

  it('el BreadcrumbList repite la ruta de la cartela', () => {
    const schema = generateBreadcrumbSchema('es', [
      { nombre: 'Inicio', ruta: '' },
      { nombre: 'Portafolio', ruta: '/portfolio' },
      { nombre: 'RMConta', ruta: '/portfolio/rmconta' },
    ]);
    expect(schema.itemListElement.map((i) => [i.position, i.name, i.item])).toEqual([
      [1, 'Inicio', 'https://www.devminds.online/es'],
      [2, 'Portafolio', 'https://www.devminds.online/es/portfolio'],
      [3, 'RMConta', 'https://www.devminds.online/es/portfolio/rmconta'],
    ]);
  });
});
