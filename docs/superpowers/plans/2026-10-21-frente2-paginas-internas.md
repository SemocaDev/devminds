# Frente 2 · Páginas internas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Llevar Servicios, Portafolio, Nosotros, Contacto y 404 al lenguaje de la home (retícula, bandas, cartela de plano), crear la página de cada proyecto y unificar menú y metadata.

**Architecture:** Helpers puros en `src/lib/` (hojas/migas, metadata, vecinos de proyecto) con tests Vitest; un componente `EncabezadoPagina` con la cartela y un `MarcoPagina` (navbar + retícula + footer + barra móvil) que usan todas las páginas; cada página es un Server Component que lee la DB/mensajes y delega lo interactivo (filtros, formulario) a componentes cliente pequeños. Las bandas reutilizan `.banda-carbon`, `.banda-acento`, `bg-secondary` y las secciones `Process`, `FAQ`, `Cierre` de la home.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, next-intl 4, Tailwind 3 + shadcn/ui, Drizzle + Neon, Vitest.

**Spec:** `docs/superpowers/specs/2026-10-21-frente2-paginas-internas-design.md`

## Global Constraints

- Retícula: cada sección usa `contenedor-reticula relative z-[2]` + `grid md:grid-cols-4`, celdas con `px-4 md:px-6`; `Reticula` dentro de `<main className="relative">`; bandas de color `relative z-[2]` con su propia `<Reticula />`.
- Solo modo claro. Tokens existentes; `carbon`/`nieve` para botones fijos.
- Voz "estudio de software": sin "nuestro equipo", "empresa", tamaño de equipo ni valores genéricos. Tecnologías solo en una línea (Nosotros, ficha del proyecto).
- Numeración de hojas: 02 Servicios, 03 Portafolio, `03.N` proyecto (N = índice en el orden del portafolio + 1), 04 Nosotros, 05 Contacto, 404 error. "Volver" = enlace a la página madre.
- Historia del fundador: el texto del spec, en tercera persona, sin mencionar IA ni a la familia.
- Textos en `messages/{es,en,ja}.json`, paridad de claves (`src/lib/traducciones.test.ts`); ES local (Neiva/Huila), EN/JA global; localización, no traducción literal.
- DB de `.env.local` = producción. La única escritura autorizada es el slug `softcount` → `rmconta`, con respaldo previo.
- `pnpm lint` (eslint src) en 0, `pnpm test` en verde, `pnpm build` OK. Commits sin Co-Authored-By. Push solo de la rama; el merge a main espera la revisión de textos del usuario en la vista previa.
- Turbopack: si faltan clases nuevas, matar el dev server, `rm -rf .next/dev`, `pnpm dev`.

## Review Focus

1. Proyecto con una sola imagen o sin imágenes: la página no rompe; la galería no se pinta y la captura principal cae en una celda de puntos. → test en Task 1 (`galeriaDe`).
2. Proyecto sin `demo`, `client` o `duration`: la ficha omite la fila, sin "null" ni etiquetas vacías. → test en Task 1 (`fichaDe`).
3. Slug inexistente o sin traducción en el idioma: 404 (Hoja 404), no error 500. → test en Task 1 (`proyectoYVecinos` devuelve `null`).
4. Filtro de categoría sin proyectos: mensaje vacío amable, sin rejilla rota. → verificación manual en Task 6.
5. Títulos largos (JA, "RMConta - Software contable") a 360px: sin desborde horizontal en encabezado ni cartela. → verificación de desborde a 360px en Task 11.

---

### Task 1: Datos de proyectos y helpers de hojas

**Files:**
- Create: `src/lib/hojas.ts`, `src/lib/hojas.test.ts`
- Modify: `src/lib/schemas/breadcrumb-schema.ts` (reescribir), `src/db/seed.ts:43-47` (slug/id de RMConta si aplica: solo `slug`)
- Create: `docs/superpowers/respaldos/2026-10-21-proyectos.json`

**Interfaces:**
- Produces:
  - `type Miga = { nombre: string; ruta: string }` (ruta sin idioma, `''` = inicio).
  - `nombreCorto(titulo: string): string` — parte antes de `' - '`.
  - `hojaDeProyecto(indice: number): string` — `03.${indice + 1}`.
  - `proyectoYVecinos<T extends { slug: string }>(lista: T[], slug: string): { proyecto: T; indice: number; siguiente: T } | null` — siguiente envuelve al primero.
  - `fichaDe(p: { client: string | null; year: number; duration: string | null; technologies: string[] }): { clave: 'cliente' | 'anio' | 'duracion' | 'tecnologia'; valor: string }[]` — omite nulos/vacíos; tecnologías unidas con `' · '`.
  - `galeriaDe(images: string[]): { principal: string | null; resto: string[] }`.
  - `generateBreadcrumbSchema(lang: string, migas: Miga[])` — `BreadcrumbList` con "Inicio" (traducido por el llamador) como primera miga.

- [ ] **Step 1: Respaldar y renombrar el slug en producción.** Exportar `projects` y `project_translations` a `docs/superpowers/respaldos/2026-10-21-proyectos.json` con un script tsx de un solo uso (en el scratchpad), luego `UPDATE projects SET slug = 'rmconta' WHERE id = 'softcount'`. Verificar con un SELECT que el slug es `rmconta`. Actualizar `slug` en `seed.ts`. (Autorizado por el usuario.)
- [ ] **Step 2: Escribir `src/lib/hojas.test.ts`** con:
  - `nombreCorto('RMConta - Software contable') === 'RMConta'`; `nombreCorto('DevMinds Links') === 'DevMinds Links'`.
  - `hojaDeProyecto(0) === '03.1'`, `hojaDeProyecto(5) === '03.6'`.
  - `proyectoYVecinos([a,b,c],'c')` → `{ proyecto: c, indice: 2, siguiente: a }`; slug desconocido → `null`; lista de uno → `siguiente` es el mismo.
  - `fichaDe({ client: null, year: 2026, duration: null, technologies: [] })` → `[{ clave: 'anio', valor: '2026' }]`; con todo → 4 entradas en el orden cliente, año, duración, tecnología.
  - `galeriaDe([])` → `{ principal: null, resto: [] }`; `galeriaDe(['x'])` → `{ principal: 'x', resto: [] }`.
  - `generateBreadcrumbSchema('es', [{nombre:'Inicio',ruta:''},{nombre:'Portafolio',ruta:'/portfolio'},{nombre:'RMConta',ruta:'/portfolio/rmconta'}])` → 3 `ListItem` con `item` `https://www.devminds.online/es`, `…/es/portfolio`, `…/es/portfolio/rmconta` y posiciones 1–3.
- [ ] **Step 3: Correr** `pnpm vitest run src/lib/hojas.test.ts` → FAIL (módulo no existe).
- [ ] **Step 4: Implementar** `src/lib/hojas.ts` y reescribir `breadcrumb-schema.ts` con la firma nueva (actualizar sus 4 llamadores en los layouts con migas explícitas de `Navbar`/mensajes).
- [ ] **Step 5: Correr** `pnpm test` → PASS; `pnpm lint` → 0.
- [ ] **Step 6: Commit** `feat(datos): slug rmconta y helpers de hojas, ficha y migas`.

### Task 2: Metadata por página

**Files:**
- Create: `src/lib/metadata.ts`, `src/lib/metadata.test.ts`
- Modify: `src/app/[lang]/{services,portfolio,about,contact}/layout.tsx`, `messages/{es,en,ja}.json` (`Metadata.services|portfolio|about|contact`, nuevo `Metadata.notFound`)

**Interfaces:**
- Produces: `metadataDePagina(o: { lang: string; ruta: string; title: string; description: string; imagen?: { url: string; width?: number; height?: number; alt: string } }): Metadata` — openGraph (siteName DevMinds, locale `es_CO`/`en_US`/`ja_JP`, type website, images `[imagen ?? imagenOg(lang)]`), twitter `summary_large_image`, canonical `https://www.devminds.online/${lang}${ruta}`, alternates `es/en/ja` + `x-default` (es).

- [ ] **Step 1: Test** `metadata.test.ts`: para `{lang:'en', ruta:'/about', …}` canonical es `https://www.devminds.online/en/about`, `alternates.languages['x-default']` termina en `/es/about`, `openGraph.locale === 'en_US'`, `openGraph.images[0].url` termina en `og-image-en.jpg`; con `imagen` propia la usa.
- [ ] **Step 2: Correr** → FAIL.
- [ ] **Step 3: Implementar** y reemplazar el `generateMetadata` repetido de los 4 layouts por `metadataDePagina`. Reescribir títulos y descripciones de `Metadata.*` en ES (foco Neiva/Huila), EN y JA (globales), sin "empresa", "equipo", "tiendas online"; quitar `keywords` si no aportan.
- [ ] **Step 4: Correr** `pnpm test` → PASS (incluye paridad).
- [ ] **Step 5: Commit** `feat(seo): metadata por página con helper común`.

### Task 3: Marco y encabezado con cartela

**Files:**
- Create: `src/app/components/pagina/MarcoPagina.tsx`, `src/app/components/pagina/EncabezadoPagina.tsx`
- Modify: `messages/*.json` (nuevo namespace `Cartela`: `hoja`, `inicio`)

**Interfaces:**
- Consumes: `Miga` (Task 1).
- Produces:
  - `<MarcoPagina>{children}</MarcoPagina>` — Navbar, `<main className="relative flex-1">` con `<Reticula />`, `Footer conBarraMovil`, `BarraMovil`. Sin `Rieles` fijos (se quitan de las páginas internas).
  - `<EncabezadoPagina titulo={string} bajada?={ReactNode} meta?={string} hoja={string} seccion={string} migas={Miga[]} />` — H1 en cols 1–3 alineado abajo (`pt-16 md:pt-[72px]` bajo la navbar), cartela en col 4: volver (`migas.at(-2)`), ruta (Geist Mono, "/" terracota, último tramo en negrita, enlaces en los tramos intermedios), `CampoPuntos` flexible, fila "Hoja" + número Doto `text-primary` + sección. Móvil: franja "← madre" | "Hoja n", franja de puntos de 56px, título. Termina con `DivisorSeccion`.

- [ ] **Step 1: Implementar** ambos componentes según el boceto `cartela.html` (Server Components; enlaces con `next/link` a `/${lang}${ruta}`).
- [ ] **Step 2: Verificar** montando provisionalmente `EncabezadoPagina` en `/es/about` y capturando a 390 y 1440 con `scratchpad/pw/secciones.mjs` (o equivalente para la ruta): cartela en col 4, sin desborde.
- [ ] **Step 3: Commit** `feat(paginas): marco común y encabezado con cartela de plano`.

### Task 4: Menú único

**Files:**
- Modify: `src/app/components/layout/Navbar.tsx:26-41`, `messages/*.json` (`Navbar`)

- [ ] **Step 1:** Items fijos en todas las rutas: `services`, `projects` ("Trabajos" → `/portfolio`), `about`, `contact`, con `aria-current="page"` y `text-foreground font-medium` cuando `pathname` empieza por su ruta (la home no marca ninguno). Quitar `home`, `process`, `faq`, `portfolio` de `Navbar` en los 3 idiomas si quedan sin uso.
- [ ] **Step 2: Verificar** en `/es`, `/es/portfolio/rmconta` (marca Trabajos) y menú móvil.
- [ ] **Step 3: Commit** `feat(nav): mismo menú en todo el sitio`.

### Task 5: Servicios (Hoja 02)

**Files:**
- Create: `src/config/escalones.ts`
- Modify: `src/app/[lang]/services/page.tsx` (reescribir como Server Component), `src/app/components/sections/Escalera/Escalera.tsx` (usar `ESCALONES`, enlaces a `#web|#sistemas|#apps|#soporte`), `messages/*.json` (nuevo `Servicios`; borrar `ServicesPage`)

**Interfaces:**
- Produces: `ESCALONES` — `{ clave: 'web'|'sistemas'|'apps'|'soporte'; fondo: string; tenue: string }[]` con las clases actuales de color de `Escalera` (el `orden` móvil se queda en Escalera).

- [ ] **Step 1:** Mensajes `Servicios`: `titulo`, `bajada`, `quieroEsto`, y por escalón `paraQuien`, `incluye` (array de 3–4), `whatsapp` (mensaje). Etiqueta, nombre, texto y tiempo se leen de `Home.escalera.pasos`. Redactar ES sin prometer nada fuera de la home/proyectos; EN/JA localizados.
- [ ] **Step 2:** Página: `MarcoPagina` → `EncabezadoPagina` (hoja `02`, migas Inicio/Servicios) → 4 filas `id={clave}` (col 1 bloque de color con etiqueta, nombre y tiempo; cols 2–3 para quién + lista con "+" `text-primary`; col 4 botón "Quiero esto" a `enlaceWhatsApp(mensaje)`, terracota el primero y claros los demás) separadas por `DivisorSeccion` → `Process` → `FAQ` → `Cierre`. `generateServiceSchema` y `BreadcrumbList` se mantienen en el layout.
- [ ] **Step 3: Verificar** a 390/768/1440: anclas desde la Escalera de la home aterrizan en su fila (`scroll-margin-top`).
- [ ] **Step 4:** `pnpm test` (paridad) y `pnpm lint` → verdes.
- [ ] **Step 5: Commit** `feat(servicios): los cuatro escalones en detalle con la cartela 02`.

### Task 6: Portafolio (Hoja 03)

**Files:**
- Create: `src/app/[lang]/portfolio/FiltroProyectos.tsx` (cliente)
- Modify: `src/app/[lang]/portfolio/page.tsx`; delete `PortfolioClient.tsx`; `messages/*.json` (nuevo `Portafolio`: `titulo`, `bajada`, `todos`, `vacio`; borrar el `Portfolio` viejo cuando nada lo use)

**Interfaces:**
- Consumes: `getProjects(lang)`, `getCategories(lang)`, `lineaMeta` (`src/lib/proyectos.ts`), `Home.trabajos.tipos`.
- Produces: `<FiltroProyectos proyectos={ProjectWithTranslation[]} categorias={CategoryWithTranslation[]} />` — fila de celdas (Todos + categorías; activa `bg-foreground text-background`) y rejilla `md:grid-cols-4`: el primero del filtro activo `md:col-span-2` con `aspect-[16/10]`, el resto `aspect-[4/3]`; tarjeta → `/${lang}/portfolio/${slug}`. Filtro vacío → `Portafolio.vacio`.

- [ ] **Step 1: Implementar** página (`MarcoPagina` + `EncabezadoPagina` hoja `03`) y `FiltroProyectos` siguiendo el estilo de `sections/Projects/Projects.tsx` (sin insignias, sin modal).
- [ ] **Step 2: Verificar** cada filtro a 390/1440 (Review Focus 4: categoría sin proyectos).
- [ ] **Step 3: Commit** `feat(portafolio): lista sobre la retícula con filtros y cartela 03`.

### Task 7: Página de proyecto (Hoja 03.N)

**Files:**
- Create: `src/app/[lang]/portfolio/[slug]/page.tsx`
- Modify: `src/app/sitemap.ts` (async: añade `/portfolio/{slug}` por idioma con `updatedAt`; requiere `getProjects` o una consulta de slugs+`updatedAt`), `messages/*.json` (nuevo `Proyecto`: `queHicimos`, `verSitio`, `siguiente`, `ficha.cliente|anio|duracion|tecnologia`), `public/projects/devminds-portfolio/screenshot-1.png` (nueva captura 1440×900 de la home actual)

**Interfaces:**
- Consumes: `getProjects`, `proyectoYVecinos`, `hojaDeProyecto`, `nombreCorto`, `fichaDe`, `galeriaDe`, `metadataDePagina`, `generateBreadcrumbSchema`, `lineaMeta`.

- [ ] **Step 1: Implementar** `generateStaticParams` (slugs × es/en/ja), `revalidate = 3600`, `generateMetadata` (título del proyecto, `description`, imagen principal como OG) y la página: `proyectoYVecinos(...) ?? notFound()`; `EncabezadoPagina` (titulo = título completo, meta = tipo · año, hoja `hojaDeProyecto(indice)`, migas Inicio/Trabajos/`nombreCorto`); captura principal a 4 columnas (o `CampoPuntos` si `principal` es `null`); fila ficha (celda gris) · `fullDescription` (cols 2–3) · "Ver sitio ↗" terracota si `demo`; galería `resto` en celdas con `CampoPuntos` de relleno hasta múltiplo de 4; banda carbón "Siguiente proyecto →" con `nombreCorto(siguiente.title)`; JSON-LD `BreadcrumbList`.
- [ ] **Step 2:** Captura nueva de "Este sitio" con playwright a 1440×900 sobre producción y reemplazar el PNG (misma ruta, sin tocar la DB; verificar primero que la DB apunta a esa ruta).
- [ ] **Step 3: Verificar** `/es/portfolio/rmconta`, `/en/portfolio/wilson-isaza`, `/ja/portfolio/devminds-portfolio`, el último proyecto (siguiente = primero) y `/es/portfolio/no-existe` → 404. `sitemap.xml` incluye las páginas de proyecto.
- [ ] **Step 4: Commit** `feat(proyecto): página propia por proyecto con hoja 03.N`.

### Task 8: Nosotros (Hoja 04)

**Files:**
- Modify: `src/app/[lang]/about/page.tsx` (Server Component); delete `AboutClient.tsx`; `src/app/[lang]/about/layout.tsx` (JSON-LD `Person`); `messages/*.json` (nuevo `Nosotros`: `titulo`, `bajada`, `historia` (3 párrafos), `datos.base|formacion`, `principios.titulo` + 4 × `titulo|texto`, `tecnologias.titulo|lista`; borrar `About`)

**Interfaces:**
- Consumes: `getTeamMembers(lang)` → el miembro con `hierarchy === 'founder'` (foto, nombre, linkedin, github).

- [ ] **Step 1:** Textos: historia del spec (ES) y su localización EN/JA; principios "Hablas con quien construye", "Precio fijo por escrito", "Avances cada semana", "El código es tuyo" alineados con `Home.proceso` y `Home.preguntas`; encabezados "Cómo trabajamos" / "Con qué trabajamos".
- [ ] **Step 2:** Página: encabezado hoja `04` → fila fundador (foto col 1 con `next/image`; nombre + historia cols 2–3; celda gris con datos y enlaces col 4) → banda carbón con los 4 principios (uno por columna, cruces como en `Process`) → fila "Con qué trabajamos" → `Cierre`. `Person` JSON-LD: `name`, `jobTitle` (Ingeniero de software / Software engineer), `alumniOf` Universidad Surcolombiana, `worksFor` `{ '@id': 'https://www.devminds.online/#organization' }`, `sameAs` LinkedIn/GitHub.
- [ ] **Step 3: Verificar** a 390/1440; sin foto en la DB → celda de puntos.
- [ ] **Step 4: Commit** `feat(nosotros): la persona detrás del estudio con hoja 04`.

### Task 9: Contacto (Hoja 05)

**Files:**
- Create: `src/app/components/contacto/FormularioContacto.tsx` (cliente; lógica actual de `react-hook-form` + zod + `/api/contact` extraída de `contact/page.tsx`)
- Modify: `src/app/[lang]/contact/page.tsx` (Server Component); `messages/*.json` (nuevo `Contacto`: `titulo`, `bajada`, `whatsapp.rotulo|titulo|texto`, `correo`, `llamada`, `formulario.titulo|texto`, `ubicacion`; borrar `ContactPage` y lo que quede sin uso de `Contact`)
- Delete: `src/app/components/sections/Contact/` si nada lo importa

- [ ] **Step 1:** Extraer el formulario sin cambiar su envío ni validaciones; estilo de la retícula (campos `border-border bg-background`, botón carbón), sin framer-motion.
- [ ] **Step 2:** Página: encabezado hoja `05` → fila de canales (WhatsApp `banda-acento`-like celda terracota cols 1–2 con "respondemos en menos de 24 horas"; correo celda `bg-secondary`; llamada celda carbón con `enlaceLlamada()`) → banda gris con `FormularioContacto` (texto en col 1, formulario cols 2–4) → fila final puntos + ubicación por mercado.
- [ ] **Step 3: Verificar** envío real del formulario en local solo con validación (no enviar a producción); estados de error visibles; 390/1440.
- [ ] **Step 4: Commit** `feat(contacto): WhatsApp primero y formulario como segunda vía, hoja 05`.

### Task 10: Hoja 404

**Files:**
- Modify: `src/app/[lang]/not-found.tsx`; `messages/*.json` (`NotFound` reescrito: `titulo`, `bajada`, `hojas`; borrar claves viejas)

- [ ] **Step 1:** `MarcoPagina` + `EncabezadoPagina` (hoja `404`, sección "Sin hoja", migas Inicio / `¿?` sin enlace) → fila de 5 celdas-enlace (01 Inicio terracota, 02 Servicios `bg-secondary`, 03 Trabajos `bg-surface-3`, 04 Nosotros `bg-accent-tint`, 05 Contacto carbón; en md 4 columnas + la quinta a lo ancho, en móvil 2 columnas) → fila de puntos. `metadata` con `robots: { index: false }`.
- [ ] **Step 2: Verificar** `/es/cualquier-cosa`, `/en/x/y` y slug de proyecto inexistente.
- [ ] **Step 3: Commit** `feat(404): la hoja que no está en el plano`.

### Task 11: Limpieza y verificación final

**Files:**
- Modify: `messages/*.json` (claves huérfanas), componentes sin uso, `src/styles/globals.css` (`pattern-dots-*` si queda sin uso)

- [ ] **Step 1:** Buscar claves y componentes sin referencias (`grep`) y borrarlos; `Rieles modo="fijo"` si ya nadie lo usa.
- [ ] **Step 2:** `pnpm lint` → 0; `pnpm test` → PASS; `pnpm build` → OK; `pnpm tsc --noEmit` → 0.
- [ ] **Step 3:** Script playwright sobre `/{es,en,ja}/{services,portfolio,portfolio/rmconta,about,contact,no-existe}` a 360/390/768/1440/1920: desborde 0px, 0 errores de consola, H1 único, JSON-LD `BreadcrumbList` presente (Review Focus 5).
- [ ] **Step 4: Commit** `chore: limpieza del frente 2` y `git push` de la rama para la vista previa; pedir al usuario la revisión de textos antes del merge.
