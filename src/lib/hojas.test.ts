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
    expect(fichaDe({ client: null, year: 2026, duration: null, technologies: [] }, 'es')).toEqual([{ clave: 'anio', valor: '2026' }]);
    expect(fichaDe({ client: 'Pymes', year: 2025, duration: '3 meses', technologies: ['Next.js', 'PostgreSQL'] }, 'es')).toEqual([
      { clave: 'cliente', valor: 'Pymes' },
      { clave: 'anio', valor: '2025' },
      { clave: 'duracion', valor: '3 meses' },
      { clave: 'tecnologia', valor: 'Next.js · PostgreSQL' },
    ]);
  });

  it('la duración se escribe en el idioma de la página', () => {
    const duracion = (d: string, lang: string) => fichaDe({ client: null, year: 2026, duration: d, technologies: [] }, lang)[1].valor;
    expect(duracion('1 mes', 'en')).toBe('1 month');
    expect(duracion('3 meses', 'en')).toBe('3 months');
    expect(duracion('1 mes', 'ja')).toBe('1 か月');
    expect(duracion('2 semanas', 'en')).toBe('2 weeks');
    expect(duracion('1 año', 'ja')).toBe('1 年');
    expect(duracion('10 días', 'en')).toBe('10 days');
    expect(duracion('1 mes', 'es')).toBe('1 mes');
  });

  it('una duración que no se entiende se muestra tal cual', () => {
    expect(fichaDe({ client: null, year: 2026, duration: 'Continuo', technologies: [] }, 'en')[1].valor).toBe('Continuo');
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
