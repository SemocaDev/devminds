/**
 * Organization y LocalBusiness Schema para SEO
 * Ayuda a Google a entender quién es DevMinds y aparecer en búsquedas locales
 */

export function generateOrganizationSchema(lang: string) {
  const baseUrl = 'https://devminds.online';

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
    "@type": "LocalBusiness",
    "name": "DevMinds",
    "image": `https://devminds.online/icon-512x512.svg`,
    "@id": "https://devminds.online/#localbusiness",
    "email": "semoca00@gmail.com",
    "description": lang === 'es'
      ? "Agencia de desarrollo web profesional en Neiva, Huila. Desarrollo de aplicaciones web modernas, software a medida y consultoría técnica."
      : "Professional web development agency in Neiva, Huila. Modern web application development, custom software and technical consulting.",
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
    "url": "https://devminds.online",
    "telephone": "+57",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "08:00",
        "closes": "18:00"
      }
    ],
    "servesCuisine": null,
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "currenciesAccepted": "COP, USD"
  };
}
