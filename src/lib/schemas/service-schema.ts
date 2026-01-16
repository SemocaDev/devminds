/**
 * Service Schema para SEO
 * Ayuda a Google a mostrar los servicios en rich snippets
 */

export function generateServiceSchema(lang: string) {
  const services = [
    {
      name: lang === 'es' ? 'Desarrollo Web Moderno' : 'Modern Web Development',
      description: lang === 'es'
        ? 'Desarrollo de sitios web y aplicaciones web profesionales con Next.js, React y TypeScript en Neiva, Colombia. Landing pages, e-commerce y aplicaciones web a medida optimizadas para SEO y velocidad.'
        : 'Professional website and web application development with Next.js, React and TypeScript in Neiva, Colombia. Landing pages, e-commerce and custom web applications optimized for SEO and speed.',
      offers: {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "priceCurrency": "COP"
      }
    },
    {
      name: lang === 'es' ? 'Software Personalizado' : 'Custom Software',
      description: lang === 'es'
        ? 'Desarrollo de aplicaciones a medida con Node.js, PostgreSQL y MongoDB. Sistemas internos, APIs REST, automatizaciones y soluciones empresariales adaptadas a sus necesidades.'
        : 'Custom application development with Node.js, PostgreSQL and MongoDB. Internal systems, REST APIs, automations and business solutions adapted to your needs.',
      offers: {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "priceCurrency": "COP"
      }
    },
    {
      name: 'WordPress & CMS',
      description: lang === 'es'
        ? 'Sitios web profesionales con WordPress optimizados para SEO en Colombia. Tiendas online con WooCommerce, blogs corporativos y sitios institucionales con panel de administración fácil de usar.'
        : 'Professional WordPress websites optimized for SEO in Colombia. Online stores with WooCommerce, corporate blogs and institutional sites with easy-to-use admin panel.',
      offers: {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "priceCurrency": "COP"
      }
    },
    {
      name: lang === 'es' ? 'Consultoría Técnica' : 'Technical Consulting',
      description: lang === 'es'
        ? 'Auditorías de código, optimización de performance, arquitectura de software y consultoría en tecnologías web modernas. Ayudamos a mejorar proyectos existentes y planificar nuevos desarrollos.'
        : 'Code audits, performance optimization, software architecture and consulting in modern web technologies. We help improve existing projects and plan new developments.',
      offers: {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "priceCurrency": "COP"
      }
    }
  ];

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": services.map((service, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Service",
        "serviceType": service.name,
        "name": service.name,
        "description": service.description,
        "provider": {
          "@type": "Organization",
          "@id": "https://www.devminds.online/#organization"
        },
        "areaServed": [
          {
            "@type": "City",
            "name": "Neiva"
          },
          {
            "@type": "State",
            "name": "Huila"
          },
          {
            "@type": "Country",
            "name": "Colombia"
          }
        ],
        "offers": service.offers
      }
    }))
  };
}
