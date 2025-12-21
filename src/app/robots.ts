// src/app/robots.ts
import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Por ahora no tienes rutas privadas, pero es buena práctica tenerlo
      disallow: ['/api/', '/_next/'],
    },
    sitemap: 'https://devminds.online/sitemap.xml',
  }
}