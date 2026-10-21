# DevMinds — sistema visual

Fuente de verdad: `docs/superpowers/specs/2026-10-19-rediseno-landing-design.md` (con las revisiones del 2026-10-20) y los tokens de `src/styles/globals.css`.

## Color (modo claro único)
- Fondo blanco nieve fría `#f8fafd`; texto grafito `#191d24`; secundario `#555b64`; bordes `#dde2e5`.
- Retícula: marco `#d3d9de` (`--guide`), líneas interiores `#e3e8ec` (`--guide-soft`).
- Acento terracota `#b6522d` (hover `#9e4421`, tinte `#fbe9e0`), ≤ 10% de la superficie. Nunca `#fff` ni `#000`.

## Tipografía
- **Doto 900**: wordmark (navbar, H1, footer, celda de Quiénes somos) y cifras.
- **Outfit 700** (`font-display`): títulos. **Geist**: cuerpo, 17px en móvil.
- El "DevMinds" del H1 alterna Doto → Outfit → Geist Mono → Instrument Serif (cursiva), 350 ms por fuente, y descansa 4 s en Doto; ancho fijo de la palabra en Doto; se pausa fuera de pantalla, con cursor/foco encima y con `prefers-reduced-motion`.

## Retícula de estudio
- `contenedor-reticula`: todo el ancho (tope 1920px), 4 columnas desde `md`. Desde 1360px es asimétrico: carril de 64px a la izquierda (rieles + línea de marco) y la columna 4 llega al borde derecho.
- Divisores de sección de borde a borde con cruces `+` en cada línea de columna.
- Puntos solo dentro de celdas exactas (columna 4 del hero, celda de Quiénes somos, franja móvil del hero).
- Cada bloque ocupa columnas completas con `px-4 md:px-6`.

## Composición de la home
Hero en dos bandas (titular cols 1–3 + puntos col 4; párrafo cols 1–2 + botones col 3) · escalera de 4 bloques colgando del pie del hero · Trabajos (destacado cols 1–2) · Cómo trabajamos (un paso por columna) · Quiénes somos (puntos + marca, texto, tecnologías) · Preguntas (título col 1, acordeón cols 2–4) · Cierre (título cols 1–3, botones col 4) · Footer en 4 columnas.

## Movimiento y accesibilidad
Solo: entrada del hero (CSS), despliegue de la escalera (GSAP) y el wordmark. Táctil ≥ 44px; contraste ≥ 4.5:1 en texto normal (verificado por script).
