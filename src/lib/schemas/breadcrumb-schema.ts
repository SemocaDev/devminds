/**
 * Breadcrumb Schema para SEO
 * Muestra breadcrumbs en los resultados de búsqueda de Google
 */

export function generateBreadcrumbSchema(pathname: string, lang: string) {
  const baseUrl = 'https://www.devminds.online';
  const segments = pathname.split('/').filter(Boolean);

  // Nombres traducidos de las rutas
  const names: Record<string, string> = {
    'about': lang === 'es' ? 'Nosotros' : 'About',
    'services': lang === 'es' ? 'Servicios' : 'Services',
    'portfolio': 'Portfolio',
    'contact': lang === 'es' ? 'Contacto' : 'Contact'
  };

  // Siempre empieza con Home
  const items = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": lang === 'es' ? 'Inicio' : 'Home',
      "item": `${baseUrl}/${lang}`
    }
  ];

  // Construir el path acumulativo
  let currentPath = '';
  segments.forEach((segment, index) => {
    // Saltar el segmento de idioma
    if (segment === lang || segment === 'es' || segment === 'en' || segment === 'ja') {
      return;
    }

    currentPath += `/${segment}`;
    items.push({
      "@type": "ListItem",
      "position": items.length + 1,
      "name": names[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
      "item": `${baseUrl}/${lang}${currentPath}`
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items
  };
}
