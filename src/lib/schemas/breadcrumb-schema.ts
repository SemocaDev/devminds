/**
 * Breadcrumb Schema para SEO: la misma ruta que muestra la cartela de cada página.
 */
import type { Miga } from '@/lib/hojas';

export function generateBreadcrumbSchema(lang: string, migas: Miga[]) {
  const baseUrl = 'https://www.devminds.online';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: migas.map((miga, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: miga.nombre,
      item: `${baseUrl}/${lang}${miga.ruta}`,
    })),
  };
}
