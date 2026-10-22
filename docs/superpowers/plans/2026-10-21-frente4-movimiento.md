# Frente 4 · Sistema de movimiento — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar al sitio una entrada de marca, revelados al hacer scroll y un paso entre páginas continuo, sin empeorar FCP/LCP/CLS.

**Architecture:** Movimiento **CSS-first**: todas las animaciones son keyframes en `src/styles/movimiento.css`, activadas por atributos `data-mov="<gesto>"`. La entrada corre sola desde el primer pintado (`data-mov-entrada` + retrasos calculados). Los revelados los activa un único componente cliente (`RevelarAlScroll`, IntersectionObserver) que añade `.mov-activo`. Un script en línea en `<head>` pone `html.mov` (habilita los estados ocultos) y `html.mov-entrada` (solo en la carga inicial), con red de seguridad si el JS no llega. El paso entre páginas usa `ViewTransition` de React (vendorizado por Next 16.1) con nombres persistentes para navbar, retícula y barra móvil. GSAP deja de usarse.

**Tech Stack:** Next.js 16.1 App Router, React 19 (el de Next exporta `ViewTransition`), Tailwind 3, CSS keyframes, IntersectionObserver, Vitest, Playwright (scripts del scratchpad).

**Spec:** `docs/superpowers/specs/2026-10-21-frente4-movimiento-design.md`

## Global Constraints

- Solo `transform`, `opacity` y `clip-path` en animaciones. Curva de entrada `cubic-bezier(0.16, 1, 0.3, 1)` (expo.out); curva del trazo `cubic-bezier(0.45, 0, 0.55, 1)` (power2.inOut); duraciones 450–900 ms; escalonado 40–90 ms.
- Cada elemento entra **una sola vez**; nada ligado al scroll (sin scrub/parallax); nada se mueve mientras se lee salvo "DevMinds".
- `prefers-reduced-motion: reduce` → todo visible y quieto, "DevMinds" fijo en Doto, sin transición entre páginas.
- Sin JS (o si falla) → todo el contenido visible.
- La entrada de marca completa solo en la carga inicial; en navegación cliente, solo la transición de contenido.
- Sin dependencias nuevas; se eliminan `gsap` y `framer-motion` (ya no las importa nada al terminar).
- Rendimiento (390 px, CPU ×4, ~1,6 Mbps): FCP y LCP no peores que producción actual (2,9 s / 3,2 s, ±100 ms), CLS = 0, primer barrido de "DevMinds" < 1,5 s tras el primer pintado; código propio de movimiento ≤ ~10 KB comprimidos.
- Lint en 0, tests en verde, commits sin Co-Authored-By. Turbopack: reiniciar `pnpm dev` si faltan clases.

## Review Focus

1. Llegar a mitad de página (ancla `#projects`, restaurar scroll al volver atrás, recargar abajo): lo que ya quedó por encima de la ventana debe verse, no quedarse oculto. → test Playwright en Task 2.
2. JS desactivado o el componente cliente nunca monta: todo visible. → test Playwright sin JS en Task 2.
3. Navegación cliente atrás/adelante: la nueva página no se queda con elementos ocultos y la entrada no se repite. → verificación en Task 7.
4. Navegador sin View Transitions: la navegación funciona igual, sin errores. → verificación en Task 7 (Firefox no disponible: forzar `document.startViewTransition = undefined`).
5. Fuentes lentas: "DevMinds" no muestra la fuente de respaldo durante el barrido. → test unitario de `fasesDisponibles` en Task 1.

---

### Task 1: Núcleo puro del movimiento

**Files:**
- Create: `src/lib/movimiento.ts`, `src/lib/movimiento.test.ts`
- Modify: `src/lib/wordmark.ts` (sustituir `FASES_WORDMARK`), su uso en `WordmarkAnimado.tsx` se ajusta en Task 4

**Interfaces:**
- Produces:
  - `CURVA_TRAZO = [0.45, 0, 0.55, 1] as const`
  - `progresoTrazo(t: number): number` — valor de la curva de trazo en t∈[0,1].
  - `tiempoParaProgreso(fraccion: number): number` — inversa numérica (bisección) de `progresoTrazo`, en [0,1].
  - `retrasoCruce(fraccion: number, inicioMs: number, duracionMs: number): number` — `inicioMs + tiempoParaProgreso(fraccion) * duracionMs`, redondeado.
  - `partirPalabras(texto: string, lang: string): string[]` — por espacios (conservando signos pegados); `ja` → `[texto]`.
  - `PASO_BARRIDO_MS = 110`, `DESCANSO_WORDMARK_MS = 2600`.
  - `fasesDisponibles(cargadas: Set<'outfit' | 'mono' | 'serif'>): string[]` — clases del barrido en orden `wm-outfit`, `wm-mono`, `wm-serif`, filtrando las no cargadas, y siempre termina en `wm-doto`.

- [ ] **Step 1: Test** `movimiento.test.ts`:
  - `progresoTrazo(0) === 0`, `progresoTrazo(1) === 1`, `progresoTrazo(0.5) ≈ 0.5` (±0.01).
  - Para f en [0.25, 0.5, 0.75]: `Math.abs(progresoTrazo(tiempoParaProgreso(f)) - f) < 0.005`; `tiempoParaProgreso(0) === 0`, `tiempoParaProgreso(1) === 1`.
  - `retrasoCruce(0.5, 350, 750) === 350 + Math.round(0.5 * 750)` (±2 ms), monotónico: `retrasoCruce(0.25,…) < retrasoCruce(0.75,…)`.
  - `partirPalabras('crea el software que tu negocio necesita.', 'es')` → 7 palabras, última `'necesita.'`; `partirPalabras('あなたのビジネスに', 'ja')` → `['あなたのビジネスに']`.
  - `fasesDisponibles(new Set())` → `['wm-doto']`; `fasesDisponibles(new Set(['outfit']))` → `['wm-outfit', 'wm-doto']`; con las tres → `['wm-outfit', 'wm-mono', 'wm-serif', 'wm-doto']`.
- [ ] **Step 2: Correr** `pnpm vitest run src/lib/movimiento.test.ts` → FAIL (módulo no existe).
- [ ] **Step 3: Implementar** `src/lib/movimiento.ts` (curva cúbica de Bézier evaluada por parámetro y resuelta en x por bisección, 20 iteraciones). Borrar `FASES_WORDMARK` de `wordmark.ts` si queda sin uso tras Task 4 (o reexportar constantes nuevas).
- [ ] **Step 4: Correr** `pnpm test` → PASS.
- [ ] **Step 5: Commit** `feat(movimiento): núcleo puro (curvas, cruces, palabras, barrido)`.

### Task 2: Infraestructura CSS + activación

**Files:**
- Create: `src/styles/movimiento.css` (importado desde `src/styles/globals.css`, fuera de `@layer`), `src/app/components/movimiento/RevelarAlScroll.tsx`
- Modify: `src/app/[lang]/layout.tsx` (script en línea en `<head>` y `<RevelarAlScroll />` dentro del provider)

**Interfaces:**
- Produces (contrato de atributos que usan las tareas siguientes):
  - `data-mov="trazo-v" | "trazo-h" | "cruce" | "encender" | "subir" | "aparecer" | "descubrir" | "desplegar" | "colgar" | "subir-barra"`.
  - `data-mov-entrada` → se anima en la carga inicial (solo si `html.mov-entrada`); los demás esperan `.mov-activo`.
  - `style={{ '--retraso': 'NNNms' }}` → retraso del gesto.
  - `.mov-palabra > span` → palabra que sube dentro de su máscara (gesto `subir` aplicado al contenedor).
  - Clases `bd-outfit | bd-mono | bd-serif` (solo `font-family`, sin cambiar tamaño) para barridos de números Doto.
  - `window.__movListo = true` lo marca `RevelarAlScroll` al montar.

- [ ] **Step 1: Script en línea** (string fijo en `layout.tsx`, `<script dangerouslySetInnerHTML>` en `<head>`): si `!matchMedia('(prefers-reduced-motion: reduce)').matches` → `documentElement.classList.add('mov','mov-entrada')`; `setTimeout(() => { if (!window.__movListo) documentElement.classList.remove('mov') }, 3000)`.
- [ ] **Step 2: `movimiento.css`**: keyframes por gesto (trazo-v `scaleY 0→1` origen arriba; trazo-h `scaleX 0→1` origen izquierda con curva de trazo 750 ms; cruce: brazos `.h`/`.v` `scale 0→1`; destello: círculo terracota `opacity .7→0, scale .2→1.8` 500 ms; encender `clip-path inset(0 0 100% 0)→inset(0)`; subir `translateY(105%)→0` sin opacidad; aparecer `opacity 0, translateY(14px)→0`; descubrir `clip-path inset(100% 0 0 0)→0` + hijo `scale 1.08→1`; desplegar = encender 900 ms; colgar = encender 800 ms; subir-barra `translateY(100%)→0`). Reglas: `html.mov [data-mov]:not(.mov-activo):not([data-mov-entrada])` en estado inicial oculto; `html.mov.mov-entrada [data-mov-entrada], html.mov [data-mov].mov-activo` → `animation` con `animation-delay: var(--retraso, 0ms)` y `both`. `@media (prefers-reduced-motion: reduce)` → `animation: none !important` y estados finales. Reemplaza `.entrada` (se borra de `globals.css` al terminar Task 4).
- [ ] **Step 3: `RevelarAlScroll`** (cliente, `null` de render): marca `window.__movListo`; IntersectionObserver (`rootMargin: '0px 0px -15% 0px'`) sobre `[data-mov]:not([data-mov-entrada]):not(.mov-activo)`; al entrar o si `getBoundingClientRect().top < innerHeight` (ya pasado), añade `.mov-activo` y deja de observar; re-escanea cuando cambia `usePathname()`; quita `mov-entrada` de `<html>` 1600 ms después del primer montaje.
- [ ] **Step 4: Verificación** (script Playwright `scratchpad/pw/mov-seguridad.mjs`): (a) `javaScriptEnabled: false` en `/es` y `/es/services` → ningún elemento `[data-mov]` con `opacity < 1` o `clip-path` distinto de `none`/`inset(0…)` tras 500 ms; (b) `/es#projects` y recarga con scroll a 2000 px → los elementos por encima de la ventana tienen `.mov-activo`; (c) `reducedMotion: 'reduce'` → `document.getAnimations().length === 0` tras 1 s. Expected: todo OK.
- [ ] **Step 5: Commit** `feat(movimiento): gestos CSS y activación al scroll con red de seguridad`.

### Task 3: Retícula y divisores que se trazan

**Files:**
- Modify: `src/app/components/reticula/Reticula.tsx`, `src/app/components/reticula/DivisorSeccion.tsx`

**Interfaces:**
- Consumes: `retrasoCruce` (Task 1), gestos `trazo-v`, `trazo-h`, `cruce` (Task 2).
- Produces:
  - `<Reticula entrada?: boolean />` — sus líneas verticales usan `data-mov="trazo-v"` (+ `data-mov-entrada` si `entrada`), escalonadas 40 ms.
  - `<DivisorSeccion className? entrada?: number />` — `entrada` = inicio en ms para la carga inicial; sin ella se revela al scroll. Estructura: contenedor `relative h-px` sin fondo + línea absoluta `data-mov="trazo-h"` + cruces hermanas.
  - `<Cruz className? fraccion?: number inicioMs?: number />` — brazos `.h`/`.v` + destello; retraso = `retrasoCruce(fraccion, inicioMs, 750)`.

- [ ] **Step 1:** Reestructurar `DivisorSeccion` (las cruces ya no son hijas del elemento que se escala) y `Cruz` (dos brazos + destello, colores actuales `bg-foreground/55`; destello `bg-primary`). Cruces en fracciones 0, .25, .5, .75, 1 (en móvil 0 y 1, las mismas clases `hidden md:block` actuales).
- [ ] **Step 2:** Las `Cruz` sueltas (Hero, Process, EncabezadoPagina, about) sin `fraccion` se comportan como hoy pero con el gesto `cruce` al revelarse con su contenedor.
- [ ] **Step 3: Verificación** en `/es` a 1440: capturas a 450 ms y 1200 ms de la carga (con `reducedMotion: 'no-preference'`): a 450 ms la línea bajo la navbar está a medio trazo y solo las cruces a su izquierda visibles; a 1200 ms todas. Sin desborde.
- [ ] **Step 4: Commit** `feat(movimiento): líneas que se trazan y cruces que nacen del trazo`.

### Task 4: Entrada de la home

**Files:**
- Modify: `src/app/components/sections/Hero.tsx`, `src/app/components/marca/WordmarkAnimado.tsx`, `src/lib/wordmark.ts`, `src/app/components/sections/Escalera/Escalera.tsx`, `src/app/components/layout/BarraMovil.tsx`, `src/app/components/layout/Navbar.tsx`, `src/app/[lang]/HomeClient.tsx`, `src/styles/globals.css` (borrar `.entrada`)
- Create: `src/app/components/movimiento/Palabras.tsx`

**Interfaces:**
- Consumes: `partirPalabras`, `fasesDisponibles`, `PASO_BARRIDO_MS`, `DESCANSO_WORDMARK_MS` (Task 1); gestos (Task 2); `Reticula entrada`, `DivisorSeccion entrada` (Task 3).
- Produces: `<Palabras texto={string} lang={string} entrada?: number paso?: number />` — envuelve cada palabra en `.mov-palabra` con `data-mov="subir"`, retraso `entrada + i * paso` (por defecto `paso = 45`); sin `entrada` se revela al scroll.

- [ ] **Step 1:** Orden de la entrada (ms desde el primer pintado): verticales 0 (escalonadas 40) · línea bajo navbar `entrada={350}` · navbar `aparecer` 100 · puntos del hero `encender` 200 · "DevMinds" primer barrido al montar · palabras del titular `subir` desde 150 · párrafo y botones `aparecer` 450/510/570 · línea bajo el hero `entrada={550}` · escalones `colgar` 650 + 70·i (móvil: teselas y celdas de puntos en el orden del mosaico) · barra móvil `subir-barra` 1100.
- [ ] **Step 2:** `WordmarkAnimado`: sin esperar `document.fonts.ready`; calcula `fasesDisponibles` con `document.fonts.check()` para Outfit, Geist Mono e Instrument Serif; primer barrido inmediato al montar (pasos de `PASO_BARRIDO_MS`), luego descanso de `DESCANSO_WORDMARK_MS`; vuelve a evaluar fuentes en cada ciclo; mantiene ancho fijo, pausas (fuera de pantalla, pestaña oculta, mouse/foco) y reduced motion.
- [ ] **Step 3:** `Escalera` deja GSAP: usa `data-mov="colgar"` con `data-mov-entrada`. El párrafo móvil al pie usa `aparecer` al scroll.
- [ ] **Step 4: Verificación:** script `scratchpad/pw/rendimiento.mjs` contra `pnpm build && pnpm start`: FCP/LCP/CLS no peores que la línea base del spec; primer cambio de clase de `[data-palabra]` < FCP + 1500 ms. Capturas a 390 y 1440 en 300/700/1300 ms.
- [ ] **Step 5: Commit** `feat(movimiento): entrada de marca en la home y DevMinds desde el primer instante`.

### Task 5: Revelados al scroll en la home

**Files:**
- Create: `src/app/components/movimiento/NumeroDoto.tsx`
- Modify: `src/app/components/sections/{Projects/Projects,Process/Process,QuienesSomos/QuienesSomos,FAQ/FAQ,Cierre/Cierre}.tsx`, `src/app/components/proyectos/TarjetaProyecto.tsx`, `src/components/ui/accordion.tsx` (micro), `tailwind.config.ts` (curva/duración del acordeón)

**Interfaces:**
- Produces: `<NumeroDoto valor={string} className? entrada?: number />` — cliente; al activarse (entrada o al entrar en pantalla) hace un barrido con `bd-outfit → bd-mono → bd-serif → (sin clase)` a `PASO_BARRIDO_MS`; respeta reduced motion.

- [ ] **Step 1:** Títulos de sección con `<Palabras>`; imágenes de `TarjetaProyecto` con `descubrir` (escalonado 80 ms por columna); bandas carbón/terracota (`Process`, `Cierre`) con `desplegar` y su celda de puntos con `encender`; pasos de `Process` con `aparecer` escalonado 80 ms y número con `NumeroDoto`; celda de puntos de `QuienesSomos` con `encender`; acordeón con curva expo.out y 300 ms.
- [ ] **Step 2: Verificación:** recorrido Playwright de `/es` bajando de 600 en 600 px a 1440 y 390: cada sección termina con `.mov-activo` y sin desborde; sin errores de consola.
- [ ] **Step 3: Commit** `feat(movimiento): revelados al scroll en la home`.

### Task 6: Páginas internas

**Files:**
- Create: `src/app/components/movimiento/NumeroHoja.tsx`
- Modify: `src/app/components/pagina/EncabezadoPagina.tsx`, `src/app/components/pagina/MarcoPagina.tsx`, `src/app/[lang]/services/page.tsx`, `src/app/[lang]/portfolio/FiltroProyectos.tsx`, `src/app/[lang]/portfolio/[slug]/page.tsx`, `src/app/[lang]/about/page.tsx`, `src/app/[lang]/not-found.tsx`

**Interfaces:**
- Produces: `<NumeroHoja hoja={string} />` — cliente; variable de módulo `hojaAnterior` (inicial `'01'`); en carga inicial hace barrido sobre su propia hoja; en navegación cliente muestra `hojaAnterior` y barre hasta `hoja`; actualiza `hojaAnterior`. Mantiene el punto-cuadrito y el `sr-only` actuales.

- [ ] **Step 1:** Entrada corta (~800 ms) en `EncabezadoPagina` con `data-mov-entrada`: línea bajo navbar `entrada={250}`, cartela (`aparecer` 300/360 y puntos `encender` 350), `NumeroHoja`, título con `<Palabras entrada={150}>`; `MarcoPagina` pasa `entrada` a `Reticula`.
- [ ] **Step 2:** Servicios: bloque de color `colgar`, texto `aparecer`; Portafolio: tarjetas como en la home y **indicador del filtro activo** que se desliza (elemento absoluto con `transform` hacia la celda activa, 350 ms expo.out); Proyecto: captura `descubrir`, galería `descubrir`, banda "Siguiente" `desplegar`; Nosotros: foto `descubrir`, banda de principios `desplegar`, "+" con `aparecer`; 404: hojas `colgar` escalonado + `NumeroDoto`.
- [ ] **Step 3: Verificación:** carga directa de cada ruta interna en es/en/ja a 390/1440: entrada completa < 1 s, sin desborde, sin errores; los elementos bajo el pliegue terminan con `.mov-activo` al bajar.
- [ ] **Step 4: Commit** `feat(movimiento): entrada corta y revelados en las páginas internas`.

### Task 7: Paso entre páginas

**Files:**
- Modify: `next.config.*` (`experimental.viewTransition: true`), `src/app/components/pagina/MarcoPagina.tsx`, `src/app/[lang]/HomeClient.tsx`, `src/styles/movimiento.css`
- Create (si TypeScript no conoce el export): `src/types/react-view-transition.d.ts`

- [ ] **Step 1:** Envolver Navbar (`name="navbar"`), `Reticula` (`name="reticula"`) y `BarraMovil` (`name="barra"`) en `<ViewTransition>` en `MarcoPagina` y `HomeClient`; CSS: `::view-transition-old(root)` fundido 200 ms y `::view-transition-new(root)` `opacity 0→1` + `translateY(8px)→0` 280 ms expo.out; grupos nombrados sin animación propia; `prefers-reduced-motion` → `animation: none` en todo `::view-transition-*`.
- [ ] **Step 2: Verificación:** Playwright: home → Servicios → proyecto → atrás → adelante: sin errores, navbar y retícula no parpadean (capturas a mitad de transición), la entrada de marca no se repite (sin `html.mov-entrada`), y en la página nueva los elementos visibles terminan con `.mov-activo`. Repetir con `document.startViewTransition = undefined` inyectado antes de navegar: navegación correcta.
- [ ] **Step 3: Commit** `feat(movimiento): paso entre páginas con la retícula fija`.

### Task 8: Limpieza, rendimiento y verificación final

**Files:**
- Modify: `package.json` / `pnpm-lock.yaml` (quitar `gsap`, `framer-motion`), restos de `.entrada`/`FASES_WORDMARK` sin uso

- [ ] **Step 1:** `grep -rn "gsap\|framer-motion\|entrada\b" src` → sin usos; `pnpm remove gsap framer-motion`.
- [ ] **Step 2:** `pnpm lint` → 0; `pnpm test` → PASS; `pnpm tsc --noEmit` → 0; `pnpm build` → OK.
- [ ] **Step 3:** Barrido Playwright de 90 combinaciones (6 rutas × 3 idiomas × 5 anchos) sobre `pnpm start`: desborde 0, un H1, idioma correcto, 0 errores de consola, todo `.mov-activo` tras recorrer.
- [ ] **Step 4:** Push de la rama; medir con `rendimiento.mjs` en la vista previa de Vercel contra producción: FCP/LCP (±100 ms), CLS 0, primer barrido < FCP + 1500 ms. Si algo empeora, corregir antes del merge.
- [ ] **Step 5: Commit** `chore(movimiento): quitar gsap y framer-motion y verificación final`.
