# Configuration Files

Este directorio contiene archivos de configuración estática en formato JSON.

## Estructura de Archivos

### `contact.json`
Información de contacto y redes sociales.
- **Usado en**: Rieles, enlaces.ts (WhatsApp, llamada, correo)
- **Contiene**: URLs de GitHub, LinkedIn, email

### `preguntas.ts`
Ids de las preguntas frecuentes de la home, en orden. Los textos viven en `messages/*.json` → `Home.preguntas.items.<id>`.
- **Usado en**: sección Preguntas y JSON-LD `FAQPage` de la home

### `i18n-config.ts`
Configuración de internacionalización (idiomas).
- **Idiomas soportados**: Español (es), Inglés (en), Japonés (ja)
- **Idioma por defecto**: es

## Datos dinámicos (Base de Datos)

Los proyectos y miembros del equipo se gestionan desde el **panel admin** (`/admin`) y se almacenan en la base de datos PostgreSQL (Neon). Las imágenes se suben a Cloudinary.
