// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // /_next/ no se bloquea: Google necesita sus JS y CSS para renderizar la página.
        disallow: ['/api/', '/admin'],
      },
    ],
    sitemap: 'https://www.devminds.online/sitemap.xml',
    host: 'https://www.devminds.online',
  }
}
