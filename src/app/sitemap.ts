// src/app/sitemap.ts
import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://devminds.online'
  
  // Rutas disponibles
  const routes = ['', '/about', '/services', '/portfolio', '/contact']
  const languages = ['es', 'en'] // Español e inglés activos para SEO

  const urls: MetadataRoute.Sitemap = []

  // Generar URLs para cada idioma con prioridades diferenciadas
  languages.forEach(lang => {
    routes.forEach(route => {
      // Priorizar homepage (1.0), contact (0.9), resto (0.8)
      let priority = 0.8
      if (route === '') priority = 1
      else if (route === '/contact') priority = 0.9

      urls.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority,
      })
    })
  })
  
  return urls
}