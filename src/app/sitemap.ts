// src/app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.devminds.online'

  const routes = ['', '/about', '/services', '/portfolio', '/contact']
  const languages = ['es', 'en', 'ja']

  // Usar fecha dinámica para que Google detecte cambios en cada build
  const now = new Date()

  const urls: MetadataRoute.Sitemap = []

  // URL raíz canónica (redirige a /es pero Google debe conocerla)
  urls.push({
    url: baseUrl,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1.0,
  })

  languages.forEach(lang => {
    routes.forEach(route => {
      let priority = 0.8
      let changeFrequency: 'weekly' | 'monthly' = 'weekly'

      if (route === '') {
        priority = 1.0
        changeFrequency = 'weekly'
      } else if (route === '/services' || route === '/contact') {
        priority = 0.9
        changeFrequency = 'monthly'
      }

      // Alternates con x-default apuntando a la versión ES (idioma principal)
      const alternateLanguages: { [key: string]: string } = {
        'x-default': `${baseUrl}/es${route}`,
      }
      languages.forEach(altLang => {
        alternateLanguages[altLang] = `${baseUrl}/${altLang}${route}`
      })

      urls.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: now,
        changeFrequency,
        priority,
        alternates: {
          languages: alternateLanguages,
        },
      })
    })
  })

  return urls
}
