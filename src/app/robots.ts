// src/app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/pattern-test', '/tech-stack-test'],
      },
    ],
    sitemap: 'https://www.devminds.online/sitemap.xml',
    host: 'https://www.devminds.online',
  }
}
