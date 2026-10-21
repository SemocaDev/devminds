# Frente 4 · Sistema de movimiento: entrada, scroll y paso entre páginas

Fecha: 2026-10-21 · Rama: `redesign/home` · Specs previos: `2026-10-19-rediseno-landing-design.md`, `2026-10-21-frente1-home-design.md`, `2026-10-21-frente2-paginas-internas-design.md`
Prototipo aprobado en el companion: `movimiento.html` (entrada del hero, cruces nacidas del trazo, scroll de secciones).

## Intención

El aspecto visual del sitio ya está resuelto; hoy se siente estático. Al abrir la página casi todo aparece de golpe, la animación de fuentes de "DevMinds" tarda (en un celular de gama media con red lenta, el primer cambio llegó a los ~16 s) y solo la Escalera reacciona al scroll. El objetivo es **rediseñar todo el movimiento como un sistema**: qué entra, cuándo y con qué ritmo, para que el sitio sorprenda a quien lo abre sin sentirse pesado ni ralentizar.

Éxito: quien abre devminds.online en el celular ve la página "armarse" en ~1 s, con "DevMinds" cambiando de fuente desde el primer instante. Al bajar, cada sección entra una vez con un gesto propio del lenguaje del plano (líneas que se trazan, cruces que nacen de los cruces). Al cambiar de página, la retícula se queda y solo cambia la hoja. Y nada de esto retrasa ver el contenido.

## Objetivos

1. Entrada de marca en la home (sin pantalla de carga) y una versión corta en cada página interna.
2. Revelado al hacer scroll en todas las secciones de la home y de las páginas internas.
3. Paso entre páginas continuo: la retícula persiste y cambia el contenido.
4. "DevMinds" anima desde el primer instante y con más frecuencia.
5. Micro-interacciones puntuales y coherentes.
6. Todo respetando el rendimiento actual y `prefers-reduced-motion`.

## No objetivos

- Pantalla de carga que tape la página (descartada: retrasaría el contenido).
- Animaciones ligadas al dedo mientras se hace scroll (scrub/parallax), cursor personalizado, efectos que siguen al mouse.
- Cambios de diseño, textos o estructura de las páginas.
- Panel /admin.

## Anti-objetivos (fallaría aunque funcione)

- Que el contenido principal aparezca más tarde que hoy (FCP ~2,9 s y LCP ~3,2 s medidos en producción con CPU ×4 y ~1,6 Mbps) o que algo salte mientras carga (CLS hoy 0).
- Tirones en un celular de gama media: animar solo `transform`, `opacity` y `clip-path`.
- Animaciones que se repiten cada vez que se pasa por una sección: cada cosa entra **una sola vez** y queda quieta.
- Movimiento que compita con la lectura: nada se mueve mientras se lee, salvo el ciclo de "DevMinds".
- Contenido invisible si el JavaScript falla o tarda: el estado inicial oculto solo se aplica cuando el script está listo para animarlo, o la animación de entrada es CSS que corre sola.

## Restricciones

- Librería única: GSAP + ScrollTrigger (ya en el proyecto). No se añaden dependencias; `framer-motion` se elimina si no la usa nada (el código público ya no la importa; verificar /admin).
- `prefers-reduced-motion: reduce` → todo aparece en su estado final, sin entrada, sin revelados, sin transición entre páginas y con "DevMinds" fijo en Doto.
- Componentes de la retícula existentes: `Reticula`, `DivisorSeccion`/`Cruz`, `CampoPuntos`, `EncabezadoPagina`, bandas `.banda-carbon`/`.banda-acento`. El sistema se monta sobre ellos, sin rehacer el diseño.
- Next 16.1 App Router + React 19 + Tailwind 3; Turbopack en desarrollo (reiniciar `pnpm dev` si no aparecen clases nuevas).
- Lint en 0, tests en verde, commits sin Co-Authored-By.

## Lo decidido

### Lenguaje común

- Curva de entrada `expo.out` (o `power2/3.out` en recortes largos); duraciones de 0,45 a 0,9 s; escalonado de 40 a 90 ms. Una sola familia de curvas en todo el sitio.
- Gestos del plano, los únicos que se usan:
  1. **Trazo:** las líneas verticales bajan (`scaleY` desde arriba) y las horizontales se trazan de izquierda a derecha (`scaleX`).
  2. **Cruce:** cada cruz nace cuando la punta del trazo horizontal pasa por su vertical. Sus brazos crecen desde el centro (el horizontal primero y el vertical ~40 ms después) con un **destello terracota** breve que se expande y se apaga (~0,5 s). Sin giro. La cruz no es hija del elemento que se escala (si no, se deforma).
  3. **Encendido:** las celdas de puntos se descubren de arriba abajo (`clip-path`).
  4. **Subida por líneas:** los títulos suben línea a línea dentro de una máscara (`yPercent` desde 105).
  5. **Descubrir:** las imágenes se destapan de abajo arriba (`clip-path`) con un zoom leve de 1,08 a 1.
  6. **Despliegue:** las bandas de color (carbón y terracota) se despliegan desde su línea superior (`clip-path`).
  7. **Barrido Doto:** cambio rápido de fuentes (Outfit → Geist Mono → Instrument Serif → Doto, ~110 ms cada una), firma de "DevMinds" y eco en los números en Doto.

### Entrada de la home (0 a ~1,2 s)

Orden aprobado en el prototipo:
1. Bajan las verticales de la retícula.
2. La línea bajo la navbar se traza y enciende sus cruces; la navbar aparece con un fundido.
3. La celda de puntos se enciende.
4. "DevMinds" hace su barrido.
5. El titular sube por líneas.
6. Aparecen el párrafo y los botones.
7. La línea bajo el hero se traza con sus cruces y los escalones cuelgan uno a uno.

En **celular**, la misma lógica en su composición:
1. Puntos.
2. Línea y cruces bajo la celda de puntos.
3. Banda de "DevMinds".
4. Titular.
5. El mosaico de la escalera se arma tesela por tesela.
6. La barra inferior (WhatsApp/Llamar) **sube desde abajo al final de la entrada**.

El titular debe pintarse en el primer fotograma útil (su animación no puede empezar oculta más tiempo que hoy con `.entrada`).

### "DevMinds"

- Barrido desde el primer instante, sin esperar a que todas las fuentes estén descargadas: empieza con las ya disponibles (Doto, Outfit) y suma Geist Mono e Instrument Serif cuando lleguen.
- Después, un barrido cada ~2,6 s (hoy: 4 s de descanso y arranque tardío).
- Mantiene lo que ya existe: ancho fijo de Doto (el titular no se mueve), pausa fuera de pantalla, con la pestaña oculta y con el mouse o el foco sobre el titular.

### Al hacer scroll (home y páginas internas)

Cada elemento entra una vez, al llegar a ~85 % de la altura de la ventana:
- `DivisorSeccion`: trazo + cruces nacidas del trazo.
- Títulos de sección: subida por líneas.
- Capturas de proyectos (Trabajos, Portafolio, galería de proyecto, foto de Nosotros): descubrir.
- Bandas carbón y terracota (Cómo trabajamos, Cierre, Siguiente proyecto, principios de Nosotros): despliegue; su celda de puntos se enciende.
- Pasos de Cómo trabajamos: entran escalonados y su número en Doto hace un barrido. Lo mismo para los principios de Nosotros y las hojas de la 404.
- Filas de Servicios: el bloque de color cuelga como los escalones y el texto sube.
- Escalera de la home: se integra en la entrada (ya no depende solo del scroll).

### Páginas internas y paso entre páginas

- **Entrada propia corta** (~0,8 s) al cargar una página interna directamente: verticales, trazo de la línea bajo la navbar con sus cruces, cartela (volver, ruta, puntos) y el número de hoja con barrido Doto; el título sube por líneas.
- **Navegación entre páginas del sitio:** la navbar, la retícula y sus líneas permanecen. Solo el contenido cambia, con un fundido corto y un leve desplazamiento hacia arriba. El número de la cartela hace su barrido de la hoja anterior a la nueva (por ejemplo de "02" a "03.2"). Se usa la API de View Transitions del navegador. Si el navegador no la soporta, cada página hace su entrada corta. Al volver atrás también se usa la transición, y el scroll queda donde corresponde.

### Micro-interacciones

- Se mantienen el empujón de la flecha en botones y enlaces, y el zoom de las tarjetas al pasar el mouse.
- Filtros de Trabajos: el fondo del filtro activo se desliza entre celdas en vez de saltar.
- Preguntas frecuentes: apertura y cierre con altura animada suave.
- Nada más.

### Rendimiento y accesibilidad (criterios de aceptación)

- Medido en producción con la misma prueba de este documento (390 px, CPU ×4, ~1,6 Mbps):
  - FCP y LCP no peores que hoy (±100 ms).
  - CLS = 0.
  - Primer barrido de "DevMinds" antes de ~1,5 s tras el primer pintado.
- No se añade JavaScript de terceros. El código de animación del sitio no supera ~10 KB comprimidos adicionales.
- ScrollTrigger y el código de revelado se cargan sin bloquear el primer pintado.
- `prefers-reduced-motion: reduce`: todo visible y quieto desde el inicio; "DevMinds" fijo en Doto; sin transición entre páginas.
- Si el JavaScript no corre, todo el contenido es visible.

## Decisiones del builder (mías, revisables)

- Estructura del código: un módulo de movimiento común (gestos reutilizables y presets de duración y curva) en lugar de animaciones sueltas por componente; si la entrada usa CSS, GSAP o ambos; cómo se marca qué anima cada elemento (atributos `data-*` o props).
- Mecanismo exacto de View Transitions con Next 16.1 / React 19 (soporte integrado si es estable en esta versión, o envolver la navegación del router), y cómo se nombran los elementos persistentes.
- Ajuste fino de tiempos dentro de los rangos de este documento, verificado en el navegador a 390 y 1440 px.
- Qué hacer con `.entrada` actual (reemplazarla o integrarla).
- Si la navbar se oculta al bajar durante la entrada.

## Resuelto tras la revisión del builder (decisiones mías, revisables)

- **Presupuesto de JS:** los ~10 KB son del código propio de animación. GSAP + ScrollTrigger (~40–45 KB comprimidos, ya dependencia del proyecto) se puede usar en todo el sitio, pero se carga **diferido**, después del primer pintado (import dinámico o en reposo). Nunca está en el camino crítico. La entrada del primer fotograma no depende de él.
- **Titular sin JavaScript:** los H1 (hero y `EncabezadoPagina`) no se parten por líneas reales. Se renderizan en servidor envueltos **palabra por palabra** y suben con una animación CSS escalonada que arranca en el primer pintado. Sin `opacity: 0` inicial: solo desplazamiento dentro de una máscara, así cuentan como pintados para el LCP. En japonés, que no separa palabras, sube el bloque entero. Los títulos de sección bajo el pliegue sí pueden partirse por líneas con JS antes de revelarse.
- **Dónde se mide:** en la vista previa de Vercel de la rama, con la misma limitación (390 px, CPU ×4, ~1,6 Mbps), comparada contra producción actual. Es la puerta antes del merge. Tras el merge se repite en producción.
- **Navegación desde y hacia la home:**
  - La entrada de marca completa solo ocurre al cargar la home desde cero.
  - Al volver a la home desde otra página, solo se funde el contenido. La barra inferior no vuelve a subir: persiste.
  - De la home a una página interna, el número de la cartela barre desde "01" hasta la hoja nueva.
  - Entre páginas internas, barre de una hoja a otra.
- **La lista de revelados al hacer scroll es exhaustiva:**
  - Líneas divisorias, títulos de sección, imágenes, bandas de color con sus puntos, pasos y principios, filas de Servicios, hojas de la 404 y la celda de puntos de "Quiénes somos".
  - No se revelan: párrafos, preguntas frecuentes (solo la apertura suave), el formulario, la ficha del proyecto ni el footer. Aparecen ya puestos, para que nada se mueva mientras se lee.
- **`framer-motion`:** ningún archivo la importa (tampoco /admin); se elimina la dependencia.
