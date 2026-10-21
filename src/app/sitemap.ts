// src/app/sitemap.ts
import { MetadataRoute } from 'next'
import { getFechasProyectos } from '@/db/queries/projects'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.devminds.online'

  // Fecha del último cambio real de contenido de cada ruta. Actualízala al cambiar esa página:
  // con new Date() cada build decía "modificado hoy" y Google deja de confiar en el dato.
  const routes: Record<string, string> = {
    '': '2026-10-21',
    '/about': '2026-10-21',
    '/services': '2026-10-21',
    '/portfolio': '2026-10-21',
    '/contact': '2026-10-21',
  }
  const languages = ['es', 'en', 'ja']

  const urls: MetadataRoute.Sitemap = []

  // No incluir baseUrl sin idioma — redirige a /es y genera duplicado

  languages.forEach(lang => {
    Object.entries(routes).forEach(([route, fecha]) => {
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
        lastModified: new Date(fecha),
        changeFrequency,
        priority,
        alternates: {
          languages: alternateLanguages,
        },
      })
    })
  })

  // Cada proyecto tiene su página; su fecha es la de su última actualización en la DB.
  const proyectos = await getFechasProyectos()
  proyectos.forEach(({ slug, updatedAt }) => {
    const ruta = `/portfolio/${slug}`
    const alternateLanguages: { [key: string]: string } = { 'x-default': `${baseUrl}/es${ruta}` }
    languages.forEach(altLang => { alternateLanguages[altLang] = `${baseUrl}/${altLang}${ruta}` })
    languages.forEach(lang => {
      urls.push({
        url: `${baseUrl}/${lang}${ruta}`,
        lastModified: updatedAt ?? new Date(routes['/portfolio']),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: { languages: alternateLanguages },
      })
    })
  })

  return urls
}
