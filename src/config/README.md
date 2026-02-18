# Configuration Files

Este directorio contiene archivos de configuración estática en formato JSON.

## Estructura de Archivos

### `contact.json`
Información de contacto y redes sociales.
- **Usado en**: SocialSidebar, EmailSidebar
- **Contiene**: URLs de GitHub, LinkedIn, email

### `faq.json`
Preguntas frecuentes organizadas por categorías.
- **Usado en**: FAQ section (homepage)
- **Estructura**: Categorías con preguntas y respuestas

### `i18n-config.ts`
Configuración de internacionalización (idiomas).
- **Idiomas soportados**: Español (es), Inglés (en), Japonés (ja)
- **Idioma por defecto**: es

## Datos dinámicos (Base de Datos)

Los proyectos y miembros del equipo se gestionan desde el **panel admin** (`/admin`) y se almacenan en la base de datos PostgreSQL (Neon). Las imágenes se suben a Cloudinary.
