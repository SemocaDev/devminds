# Frente 1 · Home: color en las secciones, móvil impactante y SEO rápido

Fecha: 2026-10-21 · Rama: `redesign/home` · Spec previo: `2026-10-19-rediseno-landing-design.md`

Decisiones tomadas con el usuario en el companion (`secciones-color.html`, `hibrido-bc.html`, `integrar-puntos.html`).

## 1. Color de las secciones: ritmo de bandas (dirección A)

Recorrido de la home: hero (nieve, escalones de color) → Trabajos (nieve) → **Cómo trabajamos (carbón)** → Quiénes somos (nieve, respiro) → **Preguntas (gris)** → **Cierre (terracota)** → footer (carbón).

- Las bandas oscuras invierten los tokens localmente con una clase (`.banda-carbon`, `.banda-acento`) que redefine `--background`, `--foreground`, `--muted-foreground`, `--primary`, `--guide`, `--guide-soft`, `--dots`, `--border` y `--ring`. Los componentes siguen usando `bg-background`, `text-foreground`, `border-guide`, `Cruz`, `CampoPuntos` y `Reticula` sin variantes.
- Una banda de color es `relative z-[2]`: tapa la retícula general y pinta la suya (`<Reticula />` dentro), que hereda los tokens oscuros. Las líneas quedan sutiles sobre el color en lugar de brillar.
- **Cómo trabajamos (carbón):** título en cols 1–2 y celda de puntos claros en cols 3–4, a toda la altura de la fila del título (en móvil, franja de 88px bajo el título, como en el hero). Pasos en fila con línea superior y cruces; números en Doto con terracota claro.
- **Preguntas (gris):** `bg-secondary`; mismo layout.
- **Cierre (terracota):** titular a 3 columnas y botones en col 4: WhatsApp en nieve con texto carbón y Correo en carbón con texto nieve. Todo el texto en nieve sólido, sin transparencias. Anillo de foco en nieve.
- Nuevos colores fijos `carbon` y `nieve` en Tailwind para los botones que deben verse igual en cualquier banda.

## 2. Móvil (< 768px): primera pantalla "sobre la línea" + mosaico

1. Celda de puntos (88px) bajo la navbar.
2. "DevMinds" en Doto grande en su propia banda, apoyado bajo la línea de los puntos y cerrado por otra línea con cruces. Sigue siendo parte del H1 y la animación de fuentes se mantiene.
3. Titular ("crea el software…").
4. Escalera como **mosaico de 2 columnas** sin huecos, con líneas de 1px:
   `[web · puntos] [sistemas · apps] [puntos · soporte]`. En los escalones de móvil solo van etiqueta, título y tiempo; la descripción queda en escritorio.
5. Párrafo del hero debajo del mosaico (en móvil se oculta en el hero y se muestra al pie de la escalera).
6. Los botones del hero se ocultan en móvil: la barra inferior ya tiene WhatsApp y Llamar.

Escritorio (≥ 768px) no cambia salvo las bandas.

## 3. Ajustes finos

Repaso de alineación, ritmo vertical y tamaños a 390, 768, 1440 y 1920px después de los cambios. Criterio: cada texto empieza en el padding de su celda (`px-4 md:px-6`), cada línea cae sobre la retícula, sin overflow horizontal.

## 4. SEO rápido

- `organization-schema.ts`: sin `founder` (decisión del usuario: sin datos personales); descripción por mercado; `areaServed` local solo en ES. `ProfessionalService` sin `priceRange`, `paymentAccepted`, `currenciesAccepted`, horario ni calle inventada; servicios y catálogo alineados con los 4 escalones (sin tienda online); LinkedIn desde `config/contact.json`; imagen PNG.
- `service-schema.ts`: los 4 escalones reales (sin e-commerce, MongoDB ni WordPress); `areaServed` global fuera de ES.
- Borrar `/pattern-test` y `/tech-stack-test` (y sus entradas en `robots.ts`, que además no bloqueaban nada por faltarles el idioma); borrar el CSS `pattern-dots-*` si queda sin uso.
- `sitemap.ts`: `lastModified` real por ruta (constantes con fecha) en lugar de `new Date()` en cada build.

## Fuera de este frente

Metadata de páginas internas y 404 (frente 2), animaciones y pantalla de carga (frente 4).

## Plan de implementación

1. Tokens: `.banda-carbon`, `.banda-acento` en `globals.css` (fuera de `@layer`); `carbon`/`nieve` en Tailwind.
2. Process en banda carbón con celda de puntos.
3. FAQ en banda gris.
4. Cierre en banda terracota.
5. Hero móvil: banda del wordmark, ocultar párrafo y botones en móvil.
6. Escalera: mosaico móvil + párrafo móvil.
7. SEO: schemas, páginas de prueba, robots, sitemap.
8. Verificación: lint, tests, build, capturas a 390/768/1440/1920, contraste de las bandas, 0 errores de consola.
