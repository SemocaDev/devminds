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
    "url": baseUrl,
    "logo": `${baseUrl}/icon-512x512.svg`,
    "description": lang === 'es'
      ? "Estudio de software en Neiva, Huila. Páginas web, sistemas a medida y apps para negocios en Neiva, el Huila y toda Colombia."
      : "Software studio based in Colombia. Websites, custom systems and mobile apps for businesses anywhere.",
    "foundingDate": "2024",
    "founder": {
      "@type": "Person",
      "name": "Sebastián Morea Cañón",
      "jobTitle": "Founder & Software Engineer",
      "alumniOf": "Universidad Surcolombiana"
    },
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
    "name": "DevMinds",
    "alternateName": "DevMinds",
    "image": "https://www.devminds.online/icon-512x512.svg",
    "email": "semoca00@gmail.com",
    "url": "https://www.devminds.online",
    "description": lang === 'es'
      ? "Estudio de software en Neiva, Huila: páginas web con SEO local, sistemas a medida, apps móviles y soporte para negocios de Neiva, el Huila y toda Colombia."
      : "Software studio in Neiva, Colombia: websites, custom systems, mobile apps and support for businesses in Colombia and abroad.",
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
