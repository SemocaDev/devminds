# Rediseño de la landing de DevMinds (2026-10-19)

## Objetivo

La landing actual se percibe "hacker": le habla a otros desarrolladores (stack, numeración `01.`, "listo para despliegue") cuando el cliente real es el dueño de un negocio o una empresa que necesita software. El rediseño la vuelve amigable para personas no técnicas sin perder la esencia de DevMinds (Doto, las líneas y los puntos), mejora la lectura y prioriza el celular.

**Éxito:** un dueño de negocio en Neiva entiende en el primer pantallazo qué hace DevMinds y cómo contactarlo; la página se reconoce como DevMinds (Doto + retícula); `impeccable critique` sube del 26/40 actual; cero scroll horizontal y contraste ≥ 4.5:1 a 390px.

## Contexto que motiva las decisiones

- **El negocio cambió** (develop_kit, `patrones/flujo-landing-negocio-local.md`): DevMinds vende landings con SEO local a negocios de Neiva y software a medida (SoftCount, Acreencia, SismAlert). El argumento que convence es "que te encuentren en Google", no la tecnología.
- **Doto ya es la firma de DevMinds afuera:** cada sitio de cliente lleva "Hecho por DevMinds" en Doto en el pie.
- **Reglas anti-"look de IA" ya fijadas en develop_kit:** nada de etiquetas en mayúsculas sobre cada título, kits de tarjetas idénticas, numeración donde no hay secuencia, ni fade-in en cada sección. Un elemento firma; lo demás sobrio.
- **Crítica `impeccable` (2026-10-19), 26/40.** Problemas principales: jerga técnica (heurística 2 = 1/4), Doto solo en etiquetas de 10–12px donde no se lee, contenido duplicado (Nosotros repite su párrafo como cita; tecnologías listadas 3 veces; dos CTA casi iguales), texto con degradado, neutros puros sin tinte, monospace como disfraz de "técnico".
- **Bugs encontrados:** el "07" de ContactCTA usa `text-foreground/6` (no existe en Tailwind v3) y se ve negro sólido; la clase `font-doto` del footer no existe; el texto del marquee de tecnologías queda cortado bajo los degradados laterales; no existe selector de idioma en ninguna parte del sitio.

## Decisiones

| Tema | Decisión | Por qué |
| --- | --- | --- |
| Alcance | Fase 1: sistema de diseño + home. Las demás páginas solo heredan tokens; se rediseñan en fase 2 | Entrega revisable sin arrastrar todo el sitio |
| Enfoque | Rediseño en sitio, rama `redesign/home`, una preview de Vercel por fase | Un solo código; producción y su SEO no se tocan hasta el merge |
| Fondo | Blanco "nieve fría" `#f8fafd`, no `#fff` | El usuario rechazó el crema; quería blanco no puro |
| Acento | Terracota `#b6522d`, uso ≤ 10% de la superficie | Cálido y cercano sin parecer error; contraste 4.8:1 |
| Doto | Wordmark, dentro del H1 ("**DevMinds** crea…") y cifras destacadas; nunca en texto pequeño | Variante C3 elegida en maquetas |
| Oferta | Paraguas + escalera de 4 escalones (elemento firma) | El usuario es ingeniero de software, no solo hace webs; la web es la entrada fácil |
| Lenguaje visual | "Retícula de estudio" como plano de 4 columnas: líneas de columna, divisores con cruces `+` en cada intersección, puntos dentro de celdas exactas, rieles anclados al hero (revisión 2026-10-20) | Estética de estudio de diseño que el usuario quiere conservar; la primera versión decoraba en vez de organizar |
| Wordmark | "DevMinds" del titular alterna fuentes (Doto, Outfit, Geist Mono, Instrument Serif) y descansa en Doto | Pedido del usuario: el toque final de la marca |
| Modo oscuro | Se elimina del sitio público; el bloque `.dark` queda solo para `/admin` | Prioridad modo claro; el admin fuerza `dark` y usa esos tokens |
| Idiomas | ES local (Neiva/Huila/Colombia); EN y JA globales (remoto/nearshore). Localización, no traducción | Nadie busca "web development Neiva" en inglés; `hreflang` separa mercados. JA es experimento sin expectativas |
| Voz | "Estudio de software" con voz de marca ("trabajamos"), sin afirmar tamaño de equipo, sin "agencia"/"empresa"; "Quiénes somos" presenta al fundador | DevMinds es una persona y no está constituida legalmente; la honestidad es argumento de venta ("hablas directo con el ingeniero") |
| Precio | Sin precio de referencia publicado | Decisión comercial del usuario, por ahora |
| Fundador | Solo Sebastián, como `founder`; se elimina el cofundador (Juan David Gómez Pérez) de la DB, del JSON-LD y del seed | El cofundador no participa; DevMinds es de una persona |
| Proyectos | Reescribir los 6 existentes en clave de resultado (3 idiomas) y renombrar categorías en lenguaje de cliente; SoftCount pasa a **RMConta**; no se agregan proyectos nuevos por ahora | La sección Trabajos debe hablarle al cliente, no al desarrollador |
| Cambios de datos | Por SQL ejecutado por Claude, con respaldo JSON previo y textos aprobados por el usuario antes de ejecutar | Pedido explícito del usuario |
| Pruebas | Vitest para lógica pura (enlaces, paridad de traducciones); verificación visual con Playwright | El proyecto no tiene test runner; Vitest es el estándar de los proyectos recientes |

## Sistema de diseño

### Paleta (modo claro, único)

Se mantienen los nombres de tokens de shadcn para no romper componentes; se agregan los nuevos. Valores en HSL como los lee `tailwind.config.ts` (`hsl(var(--x))`).

| Token | Hex | HSL | Uso |
| --- | --- | --- | --- |
| `--background` | `#f8fafd` | `216 56% 98.2%` | fondo de página |
| `--secondary`, `--muted` | `#eef3f7` | `207 36% 95.1%` | secciones alternas, escalón 2 |
| `--surface-3` (nuevo) | `#e4eaef` | `207 26% 91.6%` | escalón 3, hover |
| `--foreground` | `#191d24` | `218 18% 12%` | texto, títulos, escalón 4, footer |
| `--muted-foreground` | `#555b64` | `216 8% 36.3%` | texto secundario (≈ 6.5:1 sobre el fondo) |
| `--border`, `--input` | `#dde2e5` | `203 13% 88.2%` | bordes |
| `--guide` (nuevo) | `#d3d9de` | `207 14% 84.9%` | guías y divisores de la retícula |
| `--primary` | `#b6522d` | `16 60% 44.5%` | botón principal, palabra del H1, escalón 1, enlaces, foco |
| `--primary-hover` (nuevo) | `#9e4421` | `17 65% 37.5%` | hover del botón principal |
| `--primary-foreground` | `#fafcfe` | `210 67% 98.8%` | texto sobre terracota |
| `--accent-tint` (nuevo) | `#fbe9e0` | `20 77% 93.1%` | fondo de chips ("Respondemos en 24 h"); el texto del chip va en `--primary-hover` (terracota sobre este fondo no llega a 4.5:1) |
| `--dots` (nuevo) | `--foreground` al 26% | — | campo de puntos (intensidad media); un solo valor para ajustar |

Reglas: sin `#fff` ni `#000`. Terracota ≤ 10% de la superficie. Botones secundarios con borde gris. `--ring` = terracota.

### Tipografía

- **Doto 900**: wordmark (navbar, H1, footer) y cifras destacadas (tiempos de la escalera, pasos 1–4). Se crea una utilidad real `font-doto` (y se corrige el uso roto del footer). Fuera de todas las etiquetas pequeñas.
- **Outfit 700**: títulos de sección.
- **Geist**: texto corrido; cuerpo 17px en móvil, interlineado 1.6, ancho máximo ~65ch.
- Escala con saltos ≥ 1.25×. Sin etiquetas en mayúsculas espaciadas sobre cada título; sin numeración `01.` salvo en "Cómo trabajamos" (secuencia real).
- Sin texto con degradado; sin cursor de máquina de escribir.

### Retícula de estudio: plano de 4 columnas (revisión 2026-10-20)

La retícula organiza el contenido, no lo decora (opción "A · Plano de columnas", maqueta `reticula-A-estructurada.html`). La primera versión (guías solo en los bordes, puntos desvanecidos por toda la sección, rieles fijos a la ventana) se descartó: las cruces solo aparecían tras hacer scroll, los puntos se salían de las líneas y los rieles no se relacionaban con nada.

- **Columnas**: `container-main` dividido en 4 columnas iguales (≥ `md`). Marco exterior en `--guide`; las 3 líneas interiores en `--guide-soft` (`207 20% 91.4%`, ≈ `#e3e8ec`). Todas a todo lo alto de la página. En móvil solo se dibuja el marco.
- **Todo el contenido se apoya en columnas**: cada bloque ocupa columnas completas (`md:col-span-*`) con el mismo margen interior (`px-4 md:px-6`) medido desde la línea de su columna. Nada flota entre columnas.
- **Divisores de sección**: línea horizontal de borde a borde con una cruz `+` en cada intersección con las 5 líneas verticales (2 en móvil).
- **Puntos**: solo dentro de una celda exacta de la retícula, con bordes limpios (sin máscara de desvanecido). En el hero: la columna 4 completa. En móvil: una franja de ~88px arriba del titular, de marco a marco.
- **Rieles** (≥ 1360px, donde hay margen fuera del marco): anclados al hero, no a la ventana. Arrancan en la cruz bajo la navbar; `2.93°N` en Doto queda a la altura de la cruz del pie del hero.
- La escalera usa las mismas 4 columnas (un escalón por columna) y se apoya en la línea del pie del hero.

### Composición del hero (revisión 2026-10-20)

- **No ocupa toda la pantalla**: navbar (con su línea y cruces) + banda superior + banda inferior; a 1440×900 la escalera asoma bajo el pie del hero, así que las cruces se ven sin hacer scroll.
- **Banda superior**: titular en columnas 1–3, apoyado sobre la línea de la banda. Puntos en la columna 4 (ocupa ambas bandas).
- **Banda inferior** (tras una línea suave con cruces en las columnas 1–4): párrafo en columnas 1–2; los dos botones apilados en la columna 3, del ancho de la columna, con el ícono a la derecha.
- **Navbar alineada a columnas**: logo en la columna 1, enlaces desde la columna 2, acciones al final de la columna 4 (menú hamburguesa por debajo de `lg`).
- Sin chip "Respondemos en 24 h" (genérico). El titular va todo en grafito: sin palabra acentuada en terracota.

### Wordmark animado (revisión 2026-10-20)

- "DevMinds" del titular cambia de fuente como un tipógrafo probando tipos: Doto → Outfit → Geist Mono → Instrument Serif (cursiva) → Doto, 0,35 s por fuente, y descansa 4 s en Doto. Ciclo continuo.
- Cada letra tiene el ancho fijo que mide en Doto: el resto del titular nunca se mueve.
- Accesibilidad (WCAG 2.2.2): con `prefers-reduced-motion` queda fijo en Doto; se pausa cuando el hero sale de pantalla, cuando la pestaña está oculta y mientras el cursor o el foco están sobre el titular. Lectores de pantalla leen "DevMinds" (letras `aria-hidden`).
- Fuentes nuevas: Geist Mono (600) e Instrument Serif (400 cursiva) vía `next/font`, sin precarga.

### Forma, espacio y movimiento

- Radios 10–12px; sin sombras pesadas; espaciado vertical variable por sección (no el mismo `py` en todas).
- **Movimiento acotado**: la entrada del hero (CSS), la de la escalera (GSAP) y el wordmark animado. El resto de secciones aparece sin fade-in.
- Se eliminan: partículas, glows, cuadrícula milimetrada del hero, texto con degradado, typewriter.
- `prefers-reduced-motion` respetado.

### Móvil y accesibilidad

- Objetivos táctiles ≥ 44px; foco visible en terracota; contraste ≥ 4.5:1 verificado.
- **Barra fija inferior** en móvil: WhatsApp (terracota) + Llamar.
- En el H1, en móvil "DevMinds" ocupa su propia línea en tamaño grande.
- Sin scroll horizontal a 390px.

## Estructura de la home

| # | Sección | Reemplaza | Contenido |
| --- | --- | --- | --- |
| — | Navbar | Navbar | Wordmark Doto; Servicios · Trabajos · Cómo trabajamos · Preguntas; botón "Hablemos"; selector ES/EN/JA (nuevo); sin ThemeSwitcher |
| 1 | Hero | Hero | Chip, H1 C3, texto, botones WhatsApp + Ver trabajos; campo de puntos |
| 2 | Escalera | Services + CallToAction | 4 escalones enlazados a anclas de `/services` |
| 3 | Trabajos | Projects | Proyectos destacados (DB): screenshot, tipo (`category`), cliente y año, título, descripción; sin muro de badges |
| 4 | Cómo trabajamos | Process | 4 pasos con números en Doto; sin la animación de 5 s |
| 5 | Quiénes somos | AboutUs + TechStack | Fundador (foto y datos de la tabla `team`, el de menor `sortOrder`), una línea discreta de tecnologías, enlace a `/about` |
| 6 | Preguntas | FAQ | 6 preguntas en una columna; `FAQPage` JSON-LD actualizado |
| 7 | Cierre | ContactCTA | Un solo CTA final; sin el "07" |
| — | Footer | Footer | Wordmark Doto real, enlaces, redes, idioma |
| — | Barra móvil | (nuevo) | WhatsApp + Llamar |

Se eliminan de la home: `TechStack` (marquee), `ScrollIndicator`, `CallToAction`, `SocialSidebar`, `EmailSidebar`. Se conservan: anclas usadas por otras páginas (`#faq` desde el footer), metadata SEO, JSON-LD de organización, carga diferida de secciones bajo el fold.

## Contenido

### Reglas

- Tono de tú a tú, frases cortas, beneficios antes que tecnología. Sin guiones largos (em dash).
- Voz de "estudio de software" sin afirmar tamaño de equipo; sin "agencia" ni "empresa".
- **Localización por mercado**: ES apunta a Neiva/Huila/Colombia; EN y JA a clientes globales (remoto, nearshore desde Colombia, comunicación en inglés, horario compatible con EE. UU., el código es del cliente). JA es una versión del mensaje global, sin keywords propias.
- Metadata (`title`, description, keywords) por idioma según su mercado.

### Español (borrador aprobado)

- **Navbar**: Servicios · Trabajos · Cómo trabajamos · Preguntas · [Hablemos]
- **Hero**: (sin chip; revisión 2026-10-20). H1: **DevMinds** crea el software que tu negocio necesita. Texto: *Ingeniería de software desde Neiva, Huila. Empezamos por lo que más te urge y crecemos contigo, explicándote todo sin tecnicismos.* Botones: **Escríbenos por WhatsApp** · Ver trabajos.
- **Escalera**: *Crecemos contigo, paso a paso* / *La mayoría empieza por el primer escalón.*
  1. *Que te encuentren* · **Página web + Google** · Aparece en Google y Maps y recibe clientes por WhatsApp · `1–2 sem.`
  2. *Organiza tu negocio* · **Sistemas a medida** · Facturación, cobranza, inventarios: lo que hoy haces en Excel · `1–3 meses`
  3. *Llega a tus clientes* · **Apps móviles** · Tu servicio en el celular de tus clientes
  4. *Ya tienes software* · **Consultoría y soporte** · Lo revisamos, lo mejoramos y lo mantenemos
- **Trabajos**: *Proyectos reales para negocios reales.* Botón *Ver todos los trabajos*.
- **Cómo trabajamos**: *Sin sorpresas, de principio a fin.* 1 **Conversamos**: nos cuentas tu negocio y lo que necesitas; la primera consulta es gratis. 2 **Te proponemos**: alcance, tiempos y un precio fijo por escrito; puedes pagar por etapas. 3 **Construimos contigo**: ves avances reales cada semana, no solo al final. 4 **Lanzamos y te acompañamos**: publicamos, te enseñamos a usarlo y seguimos ahí.
- **Quiénes somos**: *Personas, no una fábrica de código.* *Detrás de DevMinds está Sebastián Morea Cañón, ingeniero de software en Neiva. Hablas directo con quien diseña y construye tu proyecto, sin intermediarios.* Línea de tecnologías: *Trabajamos con Next.js, React, Flutter, PostgreSQL y lo que tu proyecto necesite.* Enlace *Conoce más →*.
- **Preguntas**: ¿Cuánto cuesta y cómo se paga? · ¿Cuánto tiempo toma? · ¿La página y el código son míos? · ¿Me ayudan a aparecer en Google Maps? · ¿Qué pasa después de la entrega? · ¿Solo trabajan en Neiva? (respuestas basadas en el FAQ actual; las dos nuevas: ficha de Google Business + reseñas; base en Neiva, proyectos en toda Colombia y fuera por videollamada).
- **Cierre**: *¿Hablamos de tu proyecto?* / *Cuéntanos qué necesitas y te respondemos en menos de 24 horas, sin compromiso.* Botones: **Escríbenos por WhatsApp** · Enviar un correo.

### Inglés y japonés (global)

Misma estructura, contenido localizado: H1 equivalente orientado a empresas de cualquier lugar ("Software engineering from Colombia for companies anywhere" como dirección); escalón 1 = *Websites & landing pages* (sin Google Maps); FAQ cambia "¿Solo trabajan en Neiva?" por "Do you work with clients outside Colombia?" y suma comunicación en inglés y zona horaria; el correo gana peso junto a WhatsApp. El riel "Neiva, Huila · Colombia" se mantiene en todos los idiomas. El texto final en EN/JA se redacta en la implementación y se revisa en la preview.

## Datos y centralización

- WhatsApp, teléfono, correo y redes: solo en `src/config/contact.json`.
- `src/lib/enlaces.ts` (nuevo): única fuente de URLs `wa.me` (con mensaje prellenado por idioma), `tel:` y `mailto:`. Ningún componente arma estas URLs.
- Fundador: `getTeamMembers(lang)` en `src/app/[lang]/page.tsx`, se pasa el primero por `sortOrder` a "Quiénes somos".
- Preguntas: `src/config/faq.json` reducido a las 6 nuevas; textos en `messages/*.json`; `src/lib/schemas/faq-schema.ts` emite las mismas.
- Sin cambios de esquema de base de datos.

## Contenido en la base de datos (producción)

Cambios solo de datos, ejecutados por SQL desde un script en el scratchpad (no se versiona el script con credenciales). Antes de cualquier escritura: respaldo JSON completo de `team_members`, `team_member_translations`, `projects`, `project_translations`, `category_translations`, guardado en `docs/superpowers/respaldos/2026-10-19-db.json` (sin datos sensibles; son textos públicos). Los textos nuevos se presentan al usuario y se ejecutan solo con su aprobación.

**Equipo**
- `team_members` `sebastian-morea`: `hierarchy` `co-founder` → `founder`.
- Eliminar `juan-gomez` y sus 3 filas de `team_member_translations`.
- Código: `src/lib/schemas/organization-schema.ts` declara un solo fundador (`jobTitle` "Founder & Software Engineer"); `src/db/seed.ts` igual. `/about` sigue funcionando con un fundador (el título "Fundadores" en plural se ajusta en fase 2).

**Proyectos** (6 existentes; `id` y `slug` no cambian)
- `title`, `description`, `full_description` reescritos en ES, EN y JA en clave de resultado ("qué le resolvió al cliente"), con la misma regla de localización (ES local, EN/JA global).
- `softcount`: título visible **RMConta**; se describe por lo que hace, sin "(en construcción)".
- `sabajon-portafolio`: etiquetado honestamente como ejemplo (negocio ficticio).
- `client` corregido donde está mal (`empo-guzman` = "Empresas Públicas", `sabajon-portafolio` = "Devminds").
- `category_translations`: nombres visibles en lenguaje de cliente (p. ej. "Aplicaciones Web" → "Sistema a medida" / "Página web" según el caso; "Wix/Plantillas" → "Página web"). Los `id` de categoría no cambian (los usa el filtro de `/portfolio`); si el mapeo requiere mover un proyecto de categoría, se cambia `projects.category`.
- Sin proyectos nuevos por ahora (Dra. Nélida Tejada, Acreencia y SismAlert quedan como candidatos; hoy ningún proyecto respalda el escalón "Apps móviles").

## Eliminación del tema oscuro público

Quitar: `ThemeSwitcher`, `ThemeContext`, `ClientThemeWrapper`, el script inline del `<head>` en `src/app/[lang]/layout.tsx`, la meta `theme-color` oscura y `useTheme` en `src/components/ui/sonner.tsx` (tema fijo claro). Conservar el bloque `.dark` de `globals.css` con un comentario que indique que existe solo para `/admin` (que fuerza `className="dark"`). Verificar que el admin se sigue viendo igual.

## Pruebas y verificación

- **Vitest** (nuevo, `pnpm test`), con TDD:
  - `enlaces.ts`: formato de `wa.me` con mensaje codificado, `tel:` con prefijo, `mailto:`.
  - **Paridad de traducciones**: falla si `en.json` o `ja.json` no tienen exactamente las mismas claves que `es.json`.
- En cada fase: `next lint` y `next build` en verde.
- Capturas con Playwright a 390, 768 y 1440px de cada sección, en los 3 idiomas, revisadas antes de cada push.
- Script de contraste para los pares de color usados; sin scroll horizontal a 390px.
- Verificar el admin (tema oscuro intacto) y que `/about`, `/services`, `/portfolio`, `/contact` no se rompen con los tokens nuevos.
- Al final: `impeccable critique` (comparar con 26/40) e `impeccable polish`.

## Fases de entrega

0. Datos: respaldo, textos nuevos de proyectos y categorías para aprobación, SQL de equipo y proyectos, JSON-LD y seed con un solo fundador.
1. Sistema base (tokens, `font-doto`, `Wordmark`, quitar tema oscuro público, Vitest).
2. Retícula (`Reticula`, `DivisorSeccion`, `CampoPuntos`, `Rieles`).
3. Navegación (Navbar con idioma, `BarraMovil`, Footer, `enlaces.ts`).
4. Secciones de la home en orden.
5. Contenido ES + localización EN/JA + limpieza de claves sin uso.
6. Pulido (animación única, reduced motion, contraste, táctil) y crítica final.

Cada fase: commit convencional sin `Co-Authored-By` (no-negociable de develop_kit) y preview de Vercel. Merge a `main` tras aprobar la última preview.

## Skills

- `frontend-design` y `design-taste-frontend`: construcción de cada sección.
- `emil-design-eng` y `gsap-react`: la animación única.
- `ui-ux-pro-max`: checklist de accesibilidad y táctil (descartar su paleta sugerida).
- `impeccable`: crítica final y pulido. Crear `PRODUCT.md` y `DESIGN.md` en la raíz a partir de este spec para que impeccable tenga contexto del proyecto.

## Fuera de alcance (fase 2)

Rediseño de `/about`, `/services`, `/portfolio`, `/contact` (en esta fase solo heredan tokens); panel admin; agregar proyectos nuevos (Dra. Nélida Tejada, Acreencia, SismAlert); migración a Tailwind v4.

## Cierre

Al terminar: correr `PROMPT_INGESTA.md` de develop_kit para exportar decisiones y el patrón "retícula de estudio".

## Preguntas abiertas

Ninguna. Resueltas:
- "Quiénes somos" no menciona colaboradores (el cofundador se retira y no hay colaboradores fijos).
- Campo de puntos: intensidad **media** (puntos de 1.3px, `--foreground` al 26%, retícula de 18px), ajustable desde el token `--dots` si en la preview se ve distinto.
