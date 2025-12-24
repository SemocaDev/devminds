# DevMinds Portfolio

Portfolio profesional multiidioma para DevMinds, construido con Next.js 16, TypeScript y TailwindCSS.

## 🚀 Características

- **Multiidioma**: Soporte completo para Español, Inglés y Japonés
- **Responsive**: Diseño adaptativo para todos los dispositivos
- **Tema Claro/Oscuro**: Cambio dinámico de tema con persistencia
- **Animaciones fluidas**: Implementadas con Framer Motion
- **Sistema de Gestión de Equipo**: Carousel automático para fundadores + grid para equipo
- **Portfolio Dinámico**: Sistema de categorías y proyectos con imágenes
- **SEO Optimizado**: Sitemap dinámico y metadata por página
- **Performance**: Optimizado con Next.js 16 y Turbopack

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 16.1.0 (App Router)
- **Frontend**: React 19, TypeScript 5.7.3
- **Estilos**: TailwindCSS 3.4.17, shadcn/ui
- **Animaciones**: Framer Motion 12.0.0
- **Internacionalización**: next-intl 4.1.0
- **Carousel**: Embla Carousel con autoplay
- **Iconos**: Lucide React
- **Gestión de paquetes**: pnpm

## 📁 Estructura del Proyecto

```
devminds/
├── src/
│   ├── app/
│   │   ├── [lang]/                 # Rutas dinámicas por idioma
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── about/page.tsx     # Página del equipo
│   │   │   ├── portfolio/page.tsx # Portfolio completo
│   │   │   └── layout.tsx         # Layout con providers
│   │   ├── components/
│   │   │   ├── layout/            # Navbar, Footer, Sidebars
│   │   │   ├── sections/          # Hero, Services, Projects, etc.
│   │   │   └── ui/                # Componentes UI reutilizables
│   │   ├── contexts/              # ThemeContext
│   │   ├── hooks/                 # Custom hooks
│   │   └── sitemap.ts             # Generación de sitemap
│   ├── components/ui/             # shadcn/ui components
│   ├── config/                    # Archivos de configuración JSON
│   │   ├── projects.json          # Catálogo de proyectos
│   │   ├── team.json              # Información del equipo
│   │   ├── faq.json               # Preguntas frecuentes
│   │   ├── contact.json           # Datos de contacto
│   │   └── i18n-config.ts         # Config de idiomas
│   ├── types/                     # TypeScript interfaces
│   ├── lib/                       # Utilidades
│   └── middleware.ts              # i18n middleware
├── messages/                      # Traducciones (es, en, ja)
├── public/
│   ├── projects/                  # Imágenes de proyectos
│   └── team/                      # Fotos del equipo
└── tailwind.config.ts
```

## ⚡ Inicio Rápido

### Prerrequisitos

- Node.js 18.17.0 o superior
- pnpm (recomendado)

### Instalación

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/SemocaDev/devminds.git
   cd devminds
   ```

2. **Instala las dependencias**:
   ```bash
   pnpm install
   ```

3. **Ejecuta el servidor de desarrollo**:
   ```bash
   pnpm dev
   ```

4. **Abre tu navegador**:
   Visita [http://localhost:3000](http://localhost:3000)

### Scripts Disponibles

```bash
pnpm dev      # Servidor de desarrollo (puerto 3000)
pnpm build    # Build de producción
pnpm start    # Servidor de producción
pnpm lint     # Ejecuta ESLint
```

## 🌐 Internacionalización

### Idiomas Soportados

- **Español (es)** - Idioma por defecto
- **Inglés (en)**
- **Japonés (ja)**

### Archivos de Traducción

- `messages/es.json` - Español
- `messages/en.json` - Inglés
- `messages/ja.json` - Japonés

### Agregar Nuevo Idioma

1. Agrega el código de idioma en `src/config/i18n-config.ts`
2. Crea `messages/{codigo}.json` con las traducciones
3. El middleware detectará automáticamente el nuevo idioma

## 📝 Gestión de Contenido

### Proyectos (`src/config/projects.json`)

```json
{
  "projects": [
    {
      "id": "proyecto-id",
      "slug": "proyecto-slug",
      "category": "web-app",
      "technologies": ["Next.js", "TypeScript"],
      "images": ["/projects/slug/screenshot-1.png"],
      "gradient": "from-blue-600 to-cyan-600",
      "featured": true,
      "github": "url-opcional",
      "demo": "url-opcional",
      "year": 2024,
      "client": "Nombre Cliente"
    }
  ]
}
```

**Imágenes**: Guardar en `/public/projects/{slug}/`

### Equipo (`src/config/team.json`)

```json
{
  "team": [
    {
      "id": "miembro-id",
      "name": "Nombre Completo",
      "nickname": "Alias",
      "role": "softwareEngineer",
      "hierarchy": "co-founder",
      "specialization": "frontendUX",
      "bio": "claveBio",
      "location": "Ciudad, País",
      "education": "Universidad (años)",
      "skills": ["Skill1", "Skill2"],
      "email": "email@ejemplo.com",
      "linkedin": "url",
      "github": "url",
      "photo": "/team/foto.jpg",
      "interests": [
        {"icon": "IconName", "labelKey": "interestKey"}
      ]
    }
  ]
}
```

**Jerarquías**: `co-founder`, `developer`, `designer`, `marketing`
**Fotos**: Guardar en `/public/team/`

### FAQ (`src/config/faq.json`)

Estructura de categorías con preguntas y respuestas.

### Contacto (`src/config/contact.json`)

URLs de redes sociales y email.

## 🎨 Personalización

### Temas

El proyecto soporta tema claro y oscuro con persistencia en localStorage.

### Colores (TailwindCSS)

Los colores se definen en `tailwind.config.ts`:
- Variables CSS para temas dinámicos
- Paleta personalizada de colores

### Fuentes

- **Geist Sans** - Fuente principal
- **Geist Mono** - Fuente monoespaciada

## 🏗️ Arquitectura

### Páginas

- `/` - Homepage con todas las secciones
- `/about` - Página del equipo (carousel + grid)
- `/portfolio` - Portfolio completo con filtros

### Características Destacadas

1. **Carousel de Fundadores**: Auto-rotación cada 5 segundos con dots de navegación
2. **Grid de Equipo**: Responsive (1→2→3 columnas)
3. **Filtros de Portfolio**: Por categoría con animaciones
4. **Sidebars Fijos**: Social (izquierda) y Email (derecha)
5. **Navbar Responsive**: Sheet menu para móvil

## 🚀 Despliegue

### Vercel (Recomendado)

El proyecto está optimizado para Vercel:

1. Conecta el repositorio
2. Vercel detecta Next.js automáticamente
3. Deploy automático en cada push

### Variables de Entorno

No se requieren variables de entorno para el funcionamiento básico.

## 📄 Licencia

Proyecto privado de DevMinds.

## 👥 Equipo

- **Sebastian Morea Cañón** (ItsEnder) - Co-fundador, Frontend & UX
- **Juan David Gomez Perez** - Co-fundador, Backend
- **Carlos Alberto Castillo Roa** (CarlosLite) - Full Stack Developer
- **Maria Jose Vargas Bustos** (Mavabu) - UX Research & Marketing

## 📞 Contacto

**Email**: semoca00@gmail.com
**GitHub**: [github.com/SemocaDev](https://github.com/SemocaDev)
**LinkedIn**: [Sebastian Morea Cañón](https://www.linkedin.com/in/sebastian-morea-ca%C3%B1on-5ba97729a/)

---

Construido con ❤️ por DevMinds usando Next.js 16 y tecnologías modernas.
