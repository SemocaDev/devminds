/**
 * Service Schema para SEO: los cuatro escalones de la home, con los mismos textos de messages/.
 */
import { areaServida, mensajesDe } from './organization-schema';

export function generateServiceSchema(lang: string) {
  const pasos = Object.values(mensajesDe(lang).Home.escalera.pasos);

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: pasos.map((paso, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: paso.titulo,
        serviceType: paso.titulo,
        description: paso.texto,
        provider: { '@type': 'Organization', '@id': 'https://www.devminds.online/#organization' },
        areaServed: areaServida(lang),
      },
    })),
  };
}
