# Frente 2 · Páginas internas con el lenguaje de la home

Fecha: 2026-10-21 · Rama: `redesign/home` · Specs previos: `2026-10-19-rediseno-landing-design.md`, `2026-10-21-frente1-home-design.md`
Bocetos aprobados en el companion: `breadcrumb.html` (opción B), `cartela.html`, `paginas-estructura.html`.

## Intención

La home ya convence y lleva a escribir por WhatsApp. Las páginas internas son a donde va quien quiere saber más antes de decidir. Hoy todas siguen siendo del sitio anterior: voz de agencia ("Nuestro equipo", "más que una empresa de desarrollo", valores genéricos), contenido que no coincide con la oferta (WordPress, MongoDB, tiendas online) y un aspecto que no usa la retícula. El objetivo es que todo el sitio se sienta como **un solo plano de estudio**: misma retícula, mismas cruces, bandas de color con ritmo propio en cada página y un elemento común muy distintivo, la **cartela**.

Éxito: alguien que llega de la home a cualquier página reconoce el mismo estudio, entiende qué recibe y tiene WhatsApp a un toque; Google encuentra títulos, descripciones y datos propios de cada página y de cada proyecto.

## Objetivos

1. Cartela de plano (breadcrumb + volver) en todas las páginas internas.
2. Rediseñar Servicios, Portafolio, Nosotros, Contacto y 404, y crear la página de cada proyecto.
3. Menú único en todo el sitio, home incluida.
4. Metadata propia por página y por proyecto en ES/EN/JA, localizada por mercado (ES local Neiva/Huila; EN/JA global).

## No objetivos

- Animaciones nuevas y pantalla de carga (frente 4). Las páginas pueden usar la clase `.entrada` existente; nada más.
- Panel /admin.
- Precios publicados (decisión vigente: sin precio de referencia).

## Anti-objetivos (fallaría aunque funcione)

- Voz de agencia o de equipo grande: nada de "nuestro equipo", "empresa", tamaño de equipo ni valores genéricos ("Innovación", "Calidad").
- Jerga técnica al frente: las tecnologías solo en una línea discreta (Nosotros y la ficha de cada proyecto).
- Volver al aspecto "hacker": degradados, bloques de código decorativos, neones.
- Encabezados distintos en cada página: la cartela y su posición son iguales en todas.
- Que el formulario de contacto le gane protagonismo a WhatsApp.

## Restricciones

- Mismo sistema que la home: `contenedor-reticula`, `Reticula`, `DivisorSeccion`/`Cruz`, `CampoPuntos`, bandas `.banda-carbon` / `.banda-acento` / `bg-secondary`, tokens existentes. Solo modo claro.
- Voz "estudio de software". En Nosotros sí aparece el fundador con foto y datos (decisión del usuario 2026-10-21; en la home siguen sin aparecer).
- La DB de `.env.local` es **producción**: cualquier escritura necesita respaldo y confirmación explícita del usuario.
- Textos en `messages/{es,en,ja}.json` con paridad de claves (test `traducciones.test.ts`). Localización, no traducción literal.
- Lint en 0, tests en verde, commits sin Co-Authored-By.
- Turbopack + Tailwind 3 no recoge clases de archivos editados por script: reiniciar `pnpm dev` si faltan estilos.

## Lo decidido

### Cartela de plano (componente común)

Encabezado de cada página interna, idéntico en estructura:

- **Escritorio (≥768px):** fila de 4 columnas bajo la navbar. Columnas 1–3: título (H1) y bajada, alineados abajo. Columna 4: la cartela, en este orden de arriba abajo:
  1. "← {página madre}" (enlace).
  2. Ruta completa en Geist Mono pequeño, separadores "/" en terracota, último tramo en negrita (`Inicio / Portafolio / RMConta`).
  3. Celda de puntos que llena el alto disponible.
  4. "Hoja" (rótulo pequeño en mayúsculas) + número de hoja en Doto terracota, y el nombre de la sección a la derecha.
- **Celular:** franja bajo la navbar con "← {página madre}" a la izquierda y "Hoja {n}" a la derecha; debajo una franja de puntos (~56px) y luego el título. Igual que el boceto.
- **"Volver" lleva siempre a la página madre** (enlace real, no `history.back()`): de Servicios/Portafolio/Nosotros/Contacto a Inicio; de un proyecto a Portafolio.
- **Numeración de hojas:** 01 Inicio (no lleva cartela), 02 Servicios, 03 Portafolio, 03.N cada proyecto (N = posición en el orden del portafolio, empezando en 1), 04 Nosotros, 05 Contacto, 404 la página de error.
- La ruta de la cartela y el JSON-LD `BreadcrumbList` (ya existe `breadcrumb-schema.ts`) deben decir lo mismo.

### Menú

Mismo menú en todo el sitio: **Servicios · Trabajos · Nosotros · Contacto** como enlaces a sus páginas (`/services`, `/portfolio`, `/about`, `/contact`), con la página actual marcada, más el botón "Hablemos" (WhatsApp) y el selector de idioma como hoy. La home deja de usar anclas a sus secciones.

### 02 · Servicios

1. Cartela (Hoja 02). Título tipo "Del primer escalón al software completo."
2. Los **4 escalones de la home**, uno por fila sobre la retícula, con el ancla de cada uno (`#web`, `#sistemas`, `#apps`, `#soporte`); los enlaces de la Escalera de la home apuntan a estas anclas.
   - Columna 1: bloque de color del escalón (los mismos colores de la home), etiqueta, nombre y tiempo en Doto si lo tiene.
   - Columnas 2–3: para quién es y qué incluye (lista corta con "+" terracota).
   - Columna 4: botón "Quiero esto" que abre WhatsApp con un mensaje específico de ese servicio. El primero va en terracota; los demás, claros.
3. Bandas reutilizadas de la home: Cómo trabajamos (carbón), Preguntas (gris) y Cierre (terracota).
4. Se elimina la sección de stack tecnológico.

El texto de "para quién" y "qué incluye" de cada escalón lo redacta el builder (ES primero, luego EN/JA localizados) y **el usuario lo revisa antes de publicar**. No debe prometer nada que no esté en los textos de la home o en los proyectos reales.

### 03 · Portafolio

1. Cartela (Hoja 03).
2. Filtros como una fila de celdas de la retícula (Todos + categorías de la DB); la activa en carbón.
3. Proyectos con el estilo de la sección Trabajos de la home: el destacado ocupa 2 columnas, el resto 1, con imagen, línea meta (tipo · cliente · año) y título. Cada tarjeta lleva a la página del proyecto. Se quita el modal y las insignias "Featured".

### 03.N · Página de cada proyecto (nueva)

Ruta `/{lang}/portfolio/{slug}`, renderizada en servidor con datos de la DB (`description`, `fullDescription`, `images`, `category`, `client`, `year`, `duration`, `technologies`, `demo`).

1. Cartela (Hoja 03.N; volver a Portafolio). Sobre el título, línea meta (tipo · año).
2. Captura principal a todo el ancho de la retícula.
3. Fila: ficha en celda gris (cliente, año, duración si existe, tecnologías) · "Qué hicimos" (`fullDescription`) en columnas 2–3 · "Ver sitio ↗" en terracota si hay `demo`.
4. Galería con el resto de imágenes en celdas, con una celda de puntos si quedan huecos.
5. Banda carbón "Siguiente proyecto →" con el siguiente en el orden del portafolio (el último enlaza al primero).
6. Metadata propia (título, descripción, OG con su imagen principal), `BreadcrumbList` y entrada en el sitemap con su fecha de actualización (`updatedAt`).
7. Slug inexistente → 404 de la Hoja 404.

### 04 · Nosotros

1. Cartela (Hoja 04). Título tipo "Detrás de DevMinds."
2. Fila del fundador: foto (col 1) · nombre e historia real contada en tercera persona, manteniendo la voz de estudio (cols 2–3) · celda gris con datos (base Neiva, Huila; formación Ingeniería de Software, Universidad Surcolombiana) y enlaces a LinkedIn y GitHub (col 4). Foto y nombre salen del miembro fundador de la DB.
3. Banda carbón "Cómo trabajo" con 4 principios concretos, uno por columna: hablas con quien construye, precio fijo por escrito, avances cada semana, el código es tuyo (alineados con los textos del proceso y las preguntas de la home).
4. Fila "Con qué trabajo": una línea de tecnologías.
5. Cierre terracota.
6. Se eliminan "Nuestra historia" actual, valores, carrusel de equipo, apodo, intereses y "¿Por qué elegirnos?".

### 05 · Contacto

1. Cartela (Hoja 05). Título tipo "Hablemos de tu proyecto."
2. Fila de canales: WhatsApp en celda terracota grande (cols 1–2, con "respondemos en menos de 24 horas") · correo (celda gris) · llamada (celda carbón).
3. Banda gris con el formulario existente (mismo envío por la API actual), presentado como "O escríbenos con calma".
4. Fila final: celda de puntos + ubicación (Neiva, Huila, Colombia; ES local, EN/JA "clientes de cualquier lugar").

### Hoja 404

Cartela con Hoja 404 y ruta `Inicio / ¿?`. Título "Esta hoja no está en el plano." y una bajada amable. Debajo, las hojas que sí existen como celdas de color que enlazan a cada página (01 Inicio terracota, 02 Servicios gris, 03 Portafolio gris 3, 04 Nosotros, 05 Contacto carbón) y una fila de puntos. Aplica también al catch-all `[...notFound]`.

### Metadata y SEO

- Título y descripción reescritos por página y por mercado en `Metadata` (sin "empresa", "equipo", "tiendas online"). ES con foco local, EN/JA global.
- OG/Twitter con `imagenOg(lang)` (la del proyecto en su página), canonical y alternates por idioma en todas.
- `BreadcrumbList` en cada página interna, coherente con la cartela.
- Sitemap: añadir las páginas de proyecto (ES/EN/JA) con `updatedAt`; mantener fechas fijas para el resto.
- Nosotros puede llevar JSON-LD `Person` del fundador enlazado a la organización (allí sí se muestran sus datos).

## Decisiones del builder (mías, revisables)

- Estructura de componentes, nombres y si la cartela recibe la ruta como props o la deriva.
- Copys exactos de títulos y bajadas (los de los bocetos son de ejemplo), con revisión del usuario junto con los de Servicios.
- Cómo se ve cada página en tablet (768–1024px), siguiendo el criterio de la home: celdas que crecen con su contenido y sin desbordes.
- Si la página de proyecto usa `generateStaticParams` + `revalidate` o render dinámico, mientras el resultado quede indexable.
- Limpieza de componentes y claves de traducción que queden sin uso.

- **Proyecto ancho del portafolio:** el primero en el orden del portafolio, recalculado con cada filtro (no se usa la bandera `featured` en esta página).
- **Voz en Nosotros:** los encabezados siguen la voz del sitio ("Cómo trabajamos", "Con qué trabajamos"); la historia del fundador va en tercera persona. EN/JA mantienen el "we".
- **Historia y datos del fundador:** viven en `messages/*.json` (no se toca `bio` de la DB); de la DB solo salen foto, nombre y enlaces.
- **Revisión de textos:** se construye con los textos redactados por el builder; el usuario los revisa en la vista previa de Vercel de la rama, **antes del merge a main**. Ajustes de copy tras la revisión van como un commit más.

## Historia del fundador (aprobada como base, 2026-10-21)

Tercera persona, sin datos familiares (RMConta es de un familiar: no se menciona) y **sin mencionar IA** (decisión del usuario). EN/JA localizados a partir de esta:

> DevMinds nació en la universidad. Mientras sus compañeros armaban portafolios con su nombre, Sebastián quiso hacer algo más trabajado y lo construyó bajo una marca propia. La primera versión era muy "tech"; con el tiempo el estudio maduró y hoy se enfoca en lo que le importa a un negocio.
>
> Hoy DevMinds mantiene RMConta, un sistema contable que una empresa usa todos los meses, y ha construido un registro de cartera para un comerciante de Neiva, la web de un consultorio odontológico y varias páginas en WordPress y Wix.
>
> Lo que lo distingue no es escribir más código, sino entender el negocio antes de construir: qué problema hay, quién lo va a usar y cuál es la forma más simple de resolverlo. Trabaja con un método propio que documenta cada proyecto y cada lección para hacerlo mejor la próxima vez. Y cuando algo le da curiosidad, lo prueba: lo más reciente, aplicaciones de escritorio en .NET que funcionan sin internet.

Fuera de este frente: agregar Acreencia y el consultorio odontológico al portafolio.

## Datos

- Slug de RMConta: renombrar `softcount` → `rmconta` en la DB de producción, con respaldo previo (autorizado por el usuario el 2026-10-21). Actualizar también `seed.ts`/`proyectos.json` si guardan el slug. No hay URL pública previa, así que no hacen falta redirecciones.
- El H1 del proyecto usa el título de la DB tal cual; la cartela muestra el nombre corto (parte antes de " - ").
