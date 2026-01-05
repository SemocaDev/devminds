# DevMinds

Una landing page moderna y multiidioma construida con Next.js 15, que presenta la arquitectura de soluciones digitales de DevMinds con un diseño minimalista inspirado en interfaces de terminal. en Colombia

## 🚀 Características

- **Multiidioma**: Soporte completo para Español, Inglés y Japonés
- **Responsive**: Diseño adaptativo para todos los dispositivos
- **Animaciones fluidas**: Implementadas con Framer Motion
- **Tipografía moderna**: Fuentes Google (Roboto y Doto)
- **Interfaz terminal**: Diseño inspirado en interfaces de línea de comandos
- **Performance optimizada**: Construido con Next.js 15 y React 19

## 🛠️ Tecnologías

- **Frontend**: Next.js 15.1.5, React 19, TypeScript 5.7.3
- **Internacionalización**: next-intl 4.1.0
- **Animaciones**: Framer Motion 12.0.0
- **Estilos**: Tailwind CSS 3.4.17
- **Linting**: ESLint con configuración de Next.js
- **Gestión de paquetes**: pnpm

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── [lang]/                    # Rutas dinámicas por idioma
│   │   ├── layout.tsx            # Layout principal con proveedores
│   │   └── page.tsx              # Página principal
│   └── components/
│       ├── layout/               # Componentes de layout
│       │   ├── Footer/
│       │   ├── Overlay/          # Menú overlay con animaciones
│       │   └── Sidebar/          # Barra lateral con selector de idioma
│       ├── sections/             # Secciones de la página
│       │   └── Hero.tsx
│       └── ui/                   # Componentes de interfaz
│           └── MainTitle/        # Título animado con efecto typewriter
├── config/
│   └── i18n-config.ts           # Configuración de idiomas
├── styles/
│   └── globals.css              # Estilos globales
├── middleware.ts                # Middleware de internacionalización
└── i18n.ts                     # Configuración de next-intl
```

## ⚡ Inicio Rápido

### Prerrequisitos

- Node.js 18.17.0 o superior
- pnpm (recomendado) o npm

### Instalación

1. **Clona el repositorio**:
   ```bash
   git clone <tu-repositorio>
   cd devminds
   ```

2. **Instala las dependencias**:
   ```bash
   pnpm install
   # o
   npm install
   ```

3. **Ejecuta el servidor de desarrollo**:
   ```bash
   pnpm dev
   # o
   npm run dev
   ```

4. **Abre tu navegador**:
   Visita [http://localhost:3000](http://localhost:3000)

### Scripts Disponibles

```bash
pnpm dev      # Inicia el servidor de desarrollo
pnpm build    # Construye la aplicación para producción
pnpm start    # Inicia el servidor de producción
pnpm lint     # Ejecuta el linter
```

## 🌐 Internacionalización

El proyecto soporta tres idiomas:

- **Español (es)** - Idioma por defecto
- **Inglés (en)**
- **Japonés (ja)**

### Estructura de mensajes

Los archivos de traducción se encuentran en `messages/`:
- `es.json` - Traducciones en español
- `en.json` - Traducciones en inglés  
- `ja.json` - Traducciones en japonés

### Agregar nuevos idiomas

1. Agrega el nuevo idioma en `src/config/i18n-config.ts`
2. Crea el archivo de traducciones correspondiente en `messages/`
3. El middleware automáticamente detectará y manejará el nuevo idioma

## 🎨 Personalización

### Colores

El proyecto utiliza un esquema de colores personalizado definido en la configuración de Tailwind:

- **carbon**: Color de fondo principal
- **whiteText**: Color de texto principal  
- **primary-300/400**: Colores de acento

### Fuentes

- **Roboto**: Fuente principal para el contenido
- **Doto**: Fuente decorativa para elementos específicos

### Animaciones

Las animaciones están implementadas con Framer Motion e incluyen:
- Efecto typewriter en el título principal
- Transiciones suaves en el overlay del menú
- Animaciones de entrada para secciones

## 📱 Responsive Design

El diseño se adapta automáticamente a diferentes tamaños de pantalla:

- **Desktop (≥1024px)**: Sidebar vertical fijo
- **Tablet/Mobile (<1024px)**: Sidebar horizontal superior
- **Breakpoints personalizados** para una experiencia óptima

## 🔧 Configuración

### Variables de entorno

El proyecto no requiere variables de entorno específicas para funcionar, pero puedes agregar las tuyas en `.env.local`.

### Tailwind CSS

La configuración de Tailwind se encuentra en `tailwind.config.js` e incluye:
- Colores personalizados
- Variables de fuente
- Configuración responsive personalizada

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Vercel detectará automáticamente que es un proyecto Next.js
3. El despliegue se realizará automáticamente

### Otros servicios

El proyecto es compatible con cualquier plataforma que soporte Node.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🤝 Contribución

Si deseas contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request


## 📞 Contacto

**DevMinds** - Arquitectura de Soluciones Digitales

---

Construido con ❤️ usando Next.js y tecnologías modernas de desarrollo web.
