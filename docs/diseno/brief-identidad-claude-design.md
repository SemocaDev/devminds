# Brief para Claude Design · Identidad de DevMinds (Open Graph, favicon, logo)

> Para pegar en Claude Design con el repo `SemocaDev/devminds` conectado. Antes de diseñar, leer `DESIGN.md`, `PRODUCT.md`, `src/styles/globals.css` (tokens) y `src/app/components/marca/` y `src/app/components/reticula/` (cómo se ve la marca hoy en la web).

## Prompt

Diseña el sistema de identidad gráfica de **DevMinds**, un estudio de software en Neiva, Huila (Colombia) que hace páginas web con SEO local, sistemas a medida, apps móviles y soporte para negocios no técnicos. La web ya está rediseñada y es la referencia: blanco nieve fría, grafito, un acento terracota, la fuente **Doto** (de puntos) como firma, y una **retícula de estudio de arquitectura**: columnas con líneas finas, cruces "+" en las intersecciones y campos de puntos dentro de celdas exactas.

Necesito, como un Design System con variantes para elegir:

1. **Logo horizontal**: wordmark "DevMinds" en Doto 900, con una versión que incorpore un elemento de la retícula (una cruz "+", una celda de puntos o una línea de marco) sin volverse un ícono genérico. Variantes sobre fondo claro (`#f8fafd`) y oscuro (`#191d24`).
2. **Marca corta / símbolo** para espacios pequeños: un monograma o símbolo que funcione a 16px. Explorar al menos: "D" en Doto, una cruz "+" con un punto terracota, y una celda de 3×3 puntos con uno destacado.
3. **Favicon**: el símbolo resuelto para `favicon.ico` (16 y 32px), `apple-touch-icon` (180px), `android-chrome` 192 y 512px (con versión maskable, zona segura del 80%) y un **SVG** escalable. Debe leerse a 16px: probar cuántos puntos sobreviven.
4. **Imagen Open Graph** 1200×630 para compartir en WhatsApp, LinkedIn, X y Facebook: composición sobre la retícula (líneas y cruces), wordmark en Doto, el titular "DevMinds crea el software que tu negocio necesita." y una celda de puntos. Variantes en español, inglés ("DevMinds builds the software your business needs.") y japonés. Debe leerse bien cuando WhatsApp la recorta a cuadrado.

## Patrones visuales (no negociables)

| Elemento | Valor |
| --- | --- |
| Fondo | Blanco nieve fría `#f8fafd`. Nunca `#ffffff` puro. |
| Texto | Grafito `#191d24`; secundario `#555b64`. Nunca `#000000`. |
| Acento | Terracota `#b6522d` (hover `#9e4421`, tinte `#fbe9e0`). Máximo ~10% de la superficie. |
| Superficies | `#eef3f7`, `#e4eaef`; carbón `#191d24` para bloques oscuros. |
| Líneas | Marco `#d3d9de`, líneas interiores `#e3e8ec`, 1px. Cruces "+" de 13px en grafito al 55%. |
| Puntos | Círculos de 1.3px, grafito al 26%, retícula de 18px. Siempre dentro de una celda con bordes limpios, sin desvanecido. |
| Tipografía | **Doto 900** para la marca y cifras; **Outfit 700** para titulares; **Geist** para texto. |
| Composición | Asimétrica y anclada a columnas: el texto se apoya en líneas, nada flota. |

## Evitar

- Estética "hacker": terminal, código, glitch, neón, fondo negro con verde.
- Degradados en texto, sombras pesadas, brillos, glassmorphism.
- Íconos genéricos de software (llaves `{}`, `</>`, engranajes, cohetes).
- Más de un color de acento. Mayúsculas espaciadas como etiqueta decorativa.

## Entregables en el repo

- `public/og-image.jpg` (1200×630; hoy la metadata lo referencia pero **no existe**) y, si hay variantes por idioma, `public/og-image-en.jpg` / `public/og-image-ja.jpg`.
- `public/favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-192x192.png`, `android-chrome-512x512.png` (reemplazan los actuales) y `public/icon.svg`.
- `public/icon-512x512.svg` (lo usa el JSON-LD como logo y hoy **no existe**).
- Logo horizontal en SVG (`public/brand/logo-horizontal.svg` y `logo-horizontal-oscuro.svg`).
- Actualizar `public/manifest.json`: `background_color` `#f8fafd` y `theme_color` `#f8fafd` (hoy tiene los colores viejos `#FFFFFF` / `#0A0A0A`).
