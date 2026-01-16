// src/app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.devminds.online'

  // Rutas disponibles
  const routes = ['', '/about', '/services', '/portfolio', '/contact']
  const languages = ['es', 'en'] // Español e inglés activos para SEO

  const urls: MetadataRoute.Sitemap = []

  // Generar URLs para cada idioma con prioridades diferenciadas y hreflang alternates
  languages.forEach(lang => {
    routes.forEach(route => {
      // Priorizar homepage (1.0), services y contact (0.9), resto (0.8)
      let priority = 0.8
      let changeFrequency: 'weekly' | 'monthly' = 'weekly'

      if (route === '') {
        priority = 1.0
        changeFrequency = 'weekly'
      } else if (route === '/services' || route === '/contact') {
        priority = 0.9
        changeFrequency = 'monthly'
      }

      // Generar alternates para hreflang
      const alternates: { [key: string]: string } = {}
      languages.forEach(altLang => {
        alternates[altLang] = `${baseUrl}/${altLang}${route}`
      })

      urls.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: {
          languages: alternates
        }
      })
    })
  })

  return urls
}