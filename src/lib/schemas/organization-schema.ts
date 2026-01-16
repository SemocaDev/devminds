/**
 * Organization y LocalBusiness Schema para SEO
 * Ayuda a Google a entender quién es DevMinds y aparecer en búsquedas locales
 */

export function generateOrganizationSchema(lang: string) {
  const baseUrl = 'https://www.devminds.online';

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    "name": "DevMinds",
    "legalName": "DevMinds - Desarrollo Web y Software",
    "url": baseUrl,
    "logo": `${baseUrl}/icon-512x512.svg`,
    "description": lang === 'es'
      ? "Agencia de desarrollo web en Neiva, Colombia. Especialistas en Next.js, React, WordPress y software personalizado. Ingenieros de software con experiencia en aplicaciones web modernas y consultoría técnica."
      : "Web development agency in Neiva, Colombia. Specialists in Next.js, React, WordPress and custom software. Software engineers with experience in modern web applications and technical consulting.",
    "foundingDate": "2024",
    "founders": [
      {
        "@type": "Person",
        "name": "Sebastian Morea Cañon",
        "jobTitle": "Co-founder & Software Engineer",
        "alumniOf": "Universidad Surcolombiana"
      },
      {
        "@type": "Person",
        "name": "Juan David Gomez Perez",
        "jobTitle": "Co-founder & Software Engineer",
        "alumniOf": "Universidad Surcolombiana"
      }
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Neiva",
      "addressRegion": "Huila",
      "addressCountry": "CO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "2.9273",
      "longitude": "-75.2819"
    },
    "areaServed": [
      { "@type": "City", "name": "Neiva" },
      { "@type": "State", "name": "Huila" },
      { "@type": "Country", "name": "Colombia" }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "semoca00@gmail.com",
      "contactType": "Customer Service",
      "availableLanguage": ["es", "en"]
    },
    "sameAs": [
      "https://github.com/SemocaDev",
      "https://www.linkedin.com/in/sebastian-morea"
    ],
    "knowsAbout": [
      "Web Development",
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "WordPress",
      "Custom Software Development",
      "Technical Consulting"
    ]
  };
}

export function generateLocalBusinessSchema(lang: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://www.devminds.online/#localbusiness",
    "name": "DevMinds - Desarrollo Web Neiva",
    "alternateName": "DevMinds",
    "image": "https://www.devminds.online/icon-512x512.svg",
    "email": "semoca00@gmail.com",
    "url": "https://www.devminds.online",
    "description": lang === 'es'
      ? "Agencia de desarrollo web profesional en Neiva, Huila. Diseño de páginas web, software personalizado, tiendas online y aplicaciones modernas con Next.js y React. Programadores en Colombia."
      : "Professional web development agency in Neiva, Huila. Website design, custom software, online stores and modern applications with Next.js and React. Programmers in Colombia.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Neiva",
      "addressLocality": "Neiva",
      "addressRegion": "Huila",
      "postalCode": "410001",
      "addressCountry": "CO"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "2.9273",
      "longitude": "-75.2819"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Neiva",
        "@id": "https://www.wikidata.org/wiki/Q205737"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Huila"
      },
      {
        "@type": "Country",
        "name": "Colombia",
        "@id": "https://www.wikidata.org/wiki/Q739"
      }
    ],
    "serviceType": [
      "Desarrollo Web",
      "Diseño de Páginas Web",
      "Software Personalizado",
      "Tiendas Online",
      "E-commerce",
      "Aplicaciones Web",
      "Consultoría Técnica",
      "WordPress"
    ],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card", "Bank Transfer", "Nequi", "Daviplata"],
    "currenciesAccepted": "COP, USD",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      }
    ],
    "sameAs": [
      "https://github.com/SemocaDev",
      "https://www.linkedin.com/in/sebastian-morea"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": lang === 'es' ? "Servicios de Desarrollo Web" : "Web Development Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Landing Page",
            "description": lang === 'es'
              ? "Página web de una sola página optimizada para conversión"
              : "Single page website optimized for conversion"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": lang === 'es' ? "Sitio Web Corporativo" : "Corporate Website",
            "description": lang === 'es'
              ? "Sitio web profesional multi-página para empresas en Neiva"
              : "Professional multi-page website for businesses"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": lang === 'es' ? "Tienda Online" : "Online Store",
            "description": lang === 'es'
              ? "E-commerce completo con carrito de compras y pagos para negocios en Huila"
              : "Complete e-commerce with shopping cart and payments"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": lang === 'es' ? "Software a Medida" : "Custom Software",
            "description": lang === 'es'
              ? "Desarrollo de software personalizado para empresas en Neiva, Colombia"
              : "Custom software development for businesses in Colombia"
          }
        }
      ]
    }
  };
}
