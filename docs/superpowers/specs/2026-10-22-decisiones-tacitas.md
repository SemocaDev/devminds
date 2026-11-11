# Decisiones tácitas — rediseño 2026-10 (frentes 1, 2 y 4) y actualización del portafolio

Decisiones que se aplicaban en el código o se tomaron en sesión sin quedar escritas en ningún doc. Confirmadas por Sebastián el 2026-10-22 al correr `PROMPT_INGESTA.md` de develop_kit.

## Del código

1. **Animaciones solo con CSS, sin librerías.** GSAP y Framer Motion se quitaron (`c2af421`). Los gestos se activan por atributos `data-mov*`; el revelado al hacer scroll lo hace un script en línea (`src/lib/revelado.ts`) que no espera la hidratación de React. Si el JS no llega en 3 s, el script del `<head>` quita `html.mov` y todo queda visible. **Por qué:** las animaciones deben sentirse fluidas sin pesar ni retrasar el contenido; con una librería y revelado atado a React, el contenido aparecía tarde.
2. **`prefers-reduced-motion` es el único interruptor del movimiento.** No se mira red, equipo ni tamaño de pantalla. Si la preferencia cambia a mitad de visita, todo se detiene y queda visible.
3. **Portafolio en la DB con caché de una hora.** `getProjects` y afines usan `unstable_cache` (tag `projects`, revalidate 3600). Un cambio hecho directo en la DB se ve al expirar la caché o tras `vercel redeploy` del deploy de producción.
4. **Respaldo antes de escribir en producción y archivo en vez de borrado.** `.env.local` apunta a la base de producción: antes de escribir se guarda un JSON en `docs/superpowers/respaldos/`. Las imágenes de Cloudinary que dejan de usarse se mueven a `devminds/archivo` y Sebastián decide si borrarlas.
5. **Los ids de categoría son históricos.** `wordpress` = "Página web", `custom-code` = "Sistema a medida", `web-app` = "Aplicación web". La etiqueta visible sale de `messages/*.json`; los ids no se renombran porque están en los datos.
6. **Texto libre sin versión por idioma se guarda en español y se localiza al mostrarse.** Ejemplo: la duración ("1 mes") pasa por `Intl.NumberFormat` con unidad en `fichaDe` (`src/lib/hojas.ts`); lo que no tenga la forma "N unidad" se muestra tal cual.

## De la sesión

1. **Criterio de inclusión del portafolio.** Entran proyectos propios o de clientes reales que representen el trabajo. Quedan fuera: conceptos sin construir (MADNESS), repos clonados (ai-job-search), código ajeno (microservicio Java) y trabajos sin pulir (Le Zitro, que además el cliente rechazó). SismAlert queda fuera por ahora (pausado, sin capturas). Wilson Isaza y Empo Guzmán se conservan al final y sin protagonismo porque esos sitios ya no están en línea (no depende de DevMinds).
2. **Orden y destacados (2026-10-22).** RMConta, Dra. Nélida Tejada y DevMinds Links son los destacados de la home (encajan exactos en la retícula: 2 + 1 + 1 columnas). Después: Acreencia, este sitio, Sabajón, Auditoría de Discord (herramienta propia sobre un servidor propio), Wilson Isaza y Empo Guzmán.
3. **Textos honestos.** Nada que no sea cierto; lo que está en construcción se dice (Dra. Nélida) y las fotos de muestra se declaran. Sin mencionar IA en los textos del estudio por ahora.
4. **Capturas sin exponer datos.** En cuentas reales (RMConta es la cuenta de producción del papá de Sebastián) la IA no escribe contraseñas: la persona inicia sesión y antes de cada captura se difuminan nombres, empresa, documentos, correos, cifras y escalas de gráficas. Sistemas internos de clientes (Acreencia) se capturan en local con la cuenta de prueba documentada y datos ficticios. En capturas de un sitio sin terminar se ocultan los controles de desarrollo y los textos marcadores.
5. **Sin foto ni datos personales del fundador en la home;** en "Nosotros" sí.
6. **Ritmo del wordmark elegido por Sebastián:** 350 ms por fuente y 4 s de descanso. Una versión más rápida se descartó por sentirse frenética.
7. **Cartela de plano con "volver" (opción B)** como migas comunes de todas las páginas internas, elegida sobre unas migas estándar por ser más distintiva.
