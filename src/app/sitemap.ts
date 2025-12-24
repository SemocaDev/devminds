// src/app/sitemap.ts
import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://devminds.online'
  
  // Rutas disponibles
  const routes = ['', '/portfolio', '/about']
  const languages = ['es', 'en', 'ja']
  
  const urls: MetadataRoute.Sitemap = []
  
  // Generar URLs para cada idioma
  languages.forEach(lang => {
    routes.forEach(route => {
      urls.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: route === '' ? 1 : 0.8,
      })
    })
  })
  
  return urls
}