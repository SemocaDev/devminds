/** Un tramo de la ruta de la cartela. `ruta` va sin idioma; '' es el inicio. */
export type Miga = { nombre: string; ruta: string };

export type DatoFicha = { clave: 'cliente' | 'anio' | 'duracion' | 'tecnologia'; valor: string };

/** "RMConta - Software contable" → "RMConta": el nombre que cabe en la cartela. */
export function nombreCorto(titulo: string): string {
  return titulo.split(' - ')[0];
}

/** Cada proyecto es una subhoja de Portafolio (03): 03.1, 03.2… según su orden. */
export function hojaDeProyecto(indice: number): string {
  return `03.${indice + 1}`;
}

/** El proyecto del slug, su posición y el siguiente (el último enlaza al primero); null si no existe. */
export function proyectoYVecinos<T extends { slug: string }>(lista: T[], slug: string) {
  const indice = lista.findIndex((p) => p.slug === slug);
  if (indice === -1) return null;
  return { proyecto: lista[indice], indice, siguiente: lista[(indice + 1) % lista.length] };
}

/** Datos de la ficha del proyecto, sin los que faltan. */
export function fichaDe(p: { client: string | null; year: number; duration: string | null; technologies: string[] }): DatoFicha[] {
  const datos: DatoFicha[] = [];
  if (p.client) datos.push({ clave: 'cliente', valor: p.client });
  datos.push({ clave: 'anio', valor: String(p.year) });
  if (p.duration) datos.push({ clave: 'duracion', valor: p.duration });
  if (p.technologies.length > 0) datos.push({ clave: 'tecnologia', valor: p.technologies.join(' · ') });
  return datos;
}

/** La primera imagen es la captura principal; el resto va a la galería. */
export function galeriaDe(images: string[]): { principal: string | null; resto: string[] } {
  return { principal: images[0] ?? null, resto: images.slice(1) };
}
