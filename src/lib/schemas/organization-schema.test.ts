import { describe, expect, it } from 'vitest';
import es from '../../../messages/es.json';
import en from '../../../messages/en.json';
import { generateLocalBusinessSchema, generateOrganizationSchema } from './organization-schema';
import { generateServiceSchema } from './service-schema';

describe('datos estructurados', () => {
  it('no publican datos personales del fundador', () => {
    const texto = JSON.stringify([generateOrganizationSchema('es'), generateLocalBusinessSchema('es')]);
    expect(texto).not.toContain('founder');
    expect(texto).not.toContain('Sebastián');
  });

  it('no prometen lo que el estudio no ofrece', () => {
    const negocio = generateLocalBusinessSchema('es');
    for (const campo of ['priceRange', 'paymentAccepted', 'currenciesAccepted', 'openingHoursSpecification']) {
      expect(negocio).not.toHaveProperty(campo);
    }
    const texto = JSON.stringify([negocio, generateServiceSchema('es')]).toLowerCase();
    for (const palabra of ['e-commerce', 'tienda', 'woocommerce', 'mongodb']) expect(texto).not.toContain(palabra);
  });

  it('los servicios son los cuatro escalones de la home, en el idioma de la página', () => {
    for (const [lang, mensajes] of [['es', es], ['en', en]] as const) {
      const nombres = generateServiceSchema(lang).itemListElement.map((i) => i.item.name);
      expect(nombres).toEqual(Object.values(mensajes.Home.escalera.pasos).map((p) => p.titulo));
    }
  });

  it('solo el mercado en español se presenta como local', () => {
    expect(JSON.stringify(generateOrganizationSchema('es').areaServed)).toContain('Neiva');
    expect(JSON.stringify(generateOrganizationSchema('en').areaServed)).not.toContain('Neiva');
    expect(generateOrganizationSchema('en').description).toBe(en.Metadata.home.description);
  });
});
