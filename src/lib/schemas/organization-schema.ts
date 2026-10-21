/**
 * Organization y ProfessionalService para SEO.
 * Solo datos que el sitio sostiene: sin fundador (decisión de no publicar datos personales),
 * sin precios, horarios ni medios de pago. Los textos salen de messages/ para no desalinearse de la home.
 */
import contactConfig from '@/config/contact.json';
import es from '../../../messages/es.json';
import en from '../../../messages/en.json';
import ja from '../../../messages/ja.json';

const BASE = 'https://www.devminds.online';
const MENSAJES = { es, en, ja } as const;
const LOGO = `${BASE}/android-chrome-512x512.png`;
const SAME_AS = [contactConfig.socials.github, contactConfig.socials.linkedin];

export function mensajesDe(lang: string) {
  return MENSAJES[lang as keyof typeof MENSAJES] ?? MENSAJES.es;
}

/** ES apunta al mercado local (Neiva, Huila, Colombia); EN y JA, al global. */
export function areaServida(lang: string) {
  return lang === 'es'
    ? [
        { '@type': 'City', name: 'Neiva', '@id': 'https://www.wikidata.org/wiki/Q205737' },
        { '@type': 'AdministrativeArea', name: 'Huila' },
        { '@type': 'Country', name: 'Colombia', '@id': 'https://www.wikidata.org/wiki/Q739' },
      ]
    : 'Worldwide';
}

const direccion = {
  '@type': 'PostalAddress',
  addressLocality: 'Neiva',
  addressRegion: 'Huila',
  addressCountry: 'CO',
};

export function generateOrganizationSchema(lang: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE}/#organization`,
    name: 'DevMinds',
    url: BASE,
    logo: LOGO,
    description: mensajesDe(lang).Metadata.home.description,
    foundingDate: '2024',
    address: direccion,
    areaServed: areaServida(lang),
    contactPoint: {
      '@type': 'ContactPoint',
      email: contactConfig.email,
      telephone: contactConfig.phone,
      contactType: 'customer service',
      availableLanguage: ['es', 'en'],
    },
    sameAs: SAME_AS,
  };
}

export function generateLocalBusinessSchema(lang: string) {
  const pasos = mensajesDe(lang).Home.escalera.pasos;
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${BASE}/#localbusiness`,
    name: 'DevMinds',
    image: LOGO,
    url: BASE,
    email: contactConfig.email,
    telephone: contactConfig.phone,
    description: mensajesDe(lang).Metadata.home.description,
    address: direccion,
    geo: { '@type': 'GeoCoordinates', latitude: 2.9273, longitude: -75.2819 },
    areaServed: areaServida(lang),
    parentOrganization: { '@id': `${BASE}/#organization` },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: mensajesDe(lang).Home.escalera.titulo,
      itemListElement: Object.values(pasos).map((p) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: p.titulo, description: p.texto },
      })),
    },
    sameAs: SAME_AS,
  };
}
