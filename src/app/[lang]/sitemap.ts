// src/app/sitemap.ts
import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://devminds.online'
  
  // Por ahora solo tienes la página principal
  // Más adelante puedes agregar más rutas cuando las tengas
  const routes = ['']
  const languages = ['es', 'en', 'ja']
  
  const urls: MetadataRoute.Sitemap = []
  
  // Generar URLs para cada idioma
  languages.forEach(lang => {
    routes.forEach(route => {
      urls.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 1,
      })
    })
  })
  
  return urls
}