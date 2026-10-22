# DevMinds — devminds.online

Sitio del estudio de software DevMinds (Neiva, Huila): servicios, portafolio, nosotros y contacto, en español, inglés y japonés. Producto, tono y anti-referencias en [PRODUCT.md](PRODUCT.md); sistema visual en [DESIGN.md](DESIGN.md). Specs y planes en `docs/superpowers/{specs,plans}`.

## Stack

- Next.js 16.1 (App Router) + React 19 + TypeScript + Tailwind 3 + next-intl 4 (es/en/ja) + pnpm. Vitest para lógica pura (`src/lib/*.test.ts`).
- Datos: Drizzle + Neon Postgres. Proyectos, categorías y equipo viven en la DB y se administran desde `/admin`; las imágenes van a Cloudinary (`src/lib/admin/cloudinary.ts`, carpeta `devminds/projects`).
- Lecturas de la DB con `unstable_cache` (tag `projects`, revalidate 3600). Un cambio hecho directo en la DB no se ve hasta que expira la caché: para verlo ya, `vercel redeploy <deploy de producción> --target production`.
- Sin librerías de animación: el movimiento es CSS + View Transitions (ver "Movimiento").
- Despliegue: Vercel, cada merge a `main` despliega a producción. Trabajo en rama + PR; el merge a `main` lo aprueba Sebastián.

## Reglas que no se ven en el código

- **`.env.local` apunta a la base de producción.** Antes de escribir en la DB: respaldo en JSON (`docs/superpowers/respaldos/`) y confirmación explícita.
- **Imágenes que dejan de usarse no se borran:** se mueven a `devminds/archivo` en Cloudinary (rename) y Sebastián decide si borrarlas. Antes de mover, cruzar contra todas las tablas y el código (`src`, `public`, `messages`), no contra los respaldos de `docs/`.
- **Los ids de categoría son históricos:** `wordpress` se muestra como "Página web", `custom-code` como "Sistema a medida", `web-app` como "Aplicación web" (`messages/*.json` → `Home.trabajos.tipos`). No renombrar los ids.
- **Textos de proyectos en 3 idiomas, honestos:** nada que no sea cierto; lo que está en construcción se dice; fotos de muestra se declaran. Campos de texto libre que no se traducen por idioma (duración) se guardan en español y se localizan al mostrarse (`fichaDe` en `src/lib/hojas.ts`).
- **Sin foto ni datos personales del fundador en la home**; en "Nosotros" sí.
- Las páginas de servidor toman el idioma de la URL (`setRequestLocale(lang)`), nunca el idioma por defecto.

## Portafolio: actualizar capturas

- Capturas a 1440×900 con movimiento reducido, más una vista móvil de dos teléfonos (390×844 @2x) sobre fondo nieve.
- Cuentas de producción de clientes o familiares: la IA nunca escribe la contraseña; la persona inicia sesión y antes de cada captura se difuminan nombres, documentos, correos, teléfonos, cifras y escalas de gráficas.
- Sistemas internos de clientes: capturar en local (`localhost`) con la cuenta de prueba documentada del propio proyecto y datos ficticios, ocultando el indicador de desarrollo de Next.
- Criterio de inclusión: proyectos propios o de clientes reales que representen el trabajo. Fuera: conceptos sin construir, repos clonados, código ajeno y trabajos sin pulir.

## Movimiento

- Gestos por atributos `data-mov` / `data-mov-entrada` / `data-mov-activo` (`src/styles/movimiento.css`); solo se animan transform, opacity y clip-path.
- Un script en `<head>` pone `html.mov` solo si el sistema no pide reducir movimiento; `src/lib/revelado.ts` se inyecta en línea al final de `<body>` y revela al hacer scroll sin esperar la hidratación de React. Si el JS no llega en 3 s se quita `html.mov`: el contenido nunca queda oculto.
- `prefers-reduced-motion` es el único interruptor (ni red ni equipo). Ritmos en `src/lib/movimiento.ts`; el wordmark va a 350 ms por fuente y descansa 4 s, valor elegido por Sebastián: no acelerarlo.
- Capas decorativas (retícula, puntos) nunca encima de elementos interactivos: los enlaces del riel van con `z-[3]`.

## Git

- Conventional Commits en español, explicando el porqué. Sin `Co-Authored-By` ni firmas de IA en commits ni en descripciones de PR.

## develop_kit

Este proyecto alimenta y consume `SemocaDev/develop_kit` (biblioteca central de patrones y decisiones). Integrado el 2026-10-22.
- Antes de una decisión de arquitectura nueva: revisar `patrones/` de develop_kit (no asumir que el stack/patrón por defecto aplica tal cual sin confirmarlo).
- Al cerrar un ciclo de `superpowers` (spec/plan completado): correr `PROMPT_INGESTA.md` de develop_kit como último paso, antes de dar la tarea por terminada.
