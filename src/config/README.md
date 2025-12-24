# Configuration Files

Este directorio contiene todos los archivos de configuración del portfolio en formato JSON.

## 📁 Estructura de Archivos

### `contact.json`
Información de contacto y redes sociales.
- **Usado en**: SocialSidebar, EmailSidebar
- **Contiene**: URLs de GitHub, LinkedIn, email

### `faq.json`
Preguntas frecuentes organizadas por categorías.
- **Usado en**: FAQ section (homepage)
- **Estructura**: Categorías con preguntas y respuestas

### `projects.json`
Catálogo de proyectos del portfolio.
- **Usado en**: Projects section (homepage), Portfolio page
- **Estructura**:
  - `projects[]` - Lista de proyectos
  - `categories[]` - Categorías de filtrado
- **Imágenes**: Guardar en `/public/projects/{slug}/`

### `team.json`
Información del equipo de DevMinds.
- **Usado en**: About/Team page
- **Estructura**:
  - `team[]` - Miembros del equipo
  - Jerarquías: co-founder, developer, designer, marketing
- **Fotos**: Guardar en `/public/team/`
- **Campos opcionales**: nickname, email, linkedin, github, photo

### `i18n-config.ts`
Configuración de internacionalización (idiomas).
- **Idiomas soportados**: Español (es), Inglés (en), Japonés (ja)
- **Idioma por defecto**: es

## 🔧 Cómo Editar

1. **Proyectos**: Edita `projects.json` y agrega imágenes a `/public/projects/{slug}/`
2. **Equipo**: Edita `team.json` y agrega fotos a `/public/team/`
3. **FAQ**: Edita `faq.json` para agregar/modificar preguntas
4. **Contacto**: Edita `contact.json` para actualizar redes sociales

## ⚠️ Notas Importantes

- Los JSON deben tener formato válido (usa un linter JSON)
- Las traducciones de contenido están en `/messages/{lang}.json`
- Después de editar, ejecuta `pnpm build` para verificar que no hay errores
- Las rutas de imágenes deben empezar con `/` (ej: `/team/foto.jpg`)
