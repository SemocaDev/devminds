/** Curva del trazo de las líneas (power2.inOut), la misma que usa el CSS de movimiento. */
export const CURVA_TRAZO = [0.45, 0, 0.55, 1] as const;

/** Milisegundos que se muestra cada fuente en el barrido rápido de un número en Doto. */
export const PASO_BARRIDO_MS = 110;
/** Milisegundos que se muestra cada fuente en el barrido de "DevMinds" (ritmo pausado, a pedido del usuario). */
export const PASO_WORDMARK_MS = 350;
/** Pausa en Doto entre barridos de "DevMinds". */
export const DESCANSO_WORDMARK_MS = 4000;

const [X1, Y1, X2, Y2] = CURVA_TRAZO;
const bezier = (t: number, p1: number, p2: number) => 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3;

/** Parámetro t de la curva cuyo eje x vale x (bisección). */
function parametroParaX(x: number): number {
  let bajo = 0;
  let alto = 1;
  for (let i = 0; i < 20; i++) {
    const medio = (bajo + alto) / 2;
    if (bezier(medio, X1, X2) < x) bajo = medio;
    else alto = medio;
  }
  return (bajo + alto) / 2;
}

/** Progreso del trazo (0–1) en el instante t (0–1) de su duración. */
export function progresoTrazo(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return bezier(parametroParaX(t), Y1, Y2);
}

/** Instante (0–1) en que el trazo alcanza la fracción dada de su largo. */
export function tiempoParaProgreso(fraccion: number): number {
  if (fraccion <= 0) return 0;
  if (fraccion >= 1) return 1;
  let bajo = 0;
  let alto = 1;
  for (let i = 0; i < 20; i++) {
    const medio = (bajo + alto) / 2;
    if (progresoTrazo(medio) < fraccion) bajo = medio;
    else alto = medio;
  }
  return (bajo + alto) / 2;
}

/** Retraso (ms) de la cruz que está en `fraccion` del largo de una línea que se traza desde `inicioMs` durante `duracionMs`. */
export function retrasoCruce(fraccion: number, inicioMs: number, duracionMs: number): number {
  return Math.round(inicioMs + tiempoParaProgreso(fraccion) * duracionMs);
}

/**
 * Palabras de un título para que suban una a una. En japonés no hay espacios: se parte por segmentos
 * (Intl.Segmenter), así el titular conserva su diseño y se unen sin espacios.
 */
export function partirPalabras(texto: string, lang: string): string[] {
  if (lang === 'ja') return [...new Intl.Segmenter('ja', { granularity: 'word' }).segment(texto)].map((s) => s.segment);
  return texto.split(/\s+/).filter(Boolean);
}

export type FuenteBarrido = 'outfit' | 'mono' | 'serif';
const ORDEN_BARRIDO: FuenteBarrido[] = ['outfit', 'mono', 'serif'];

/** Clases del barrido de "DevMinds" con las fuentes ya cargadas (así nunca asoma la de respaldo); siempre termina en Doto. */
export function fasesDisponibles(cargadas: Set<FuenteBarrido>): string[] {
  return [...ORDEN_BARRIDO.filter((f) => cargadas.has(f)).map((f) => `wm-${f}`), 'wm-doto'];
}

/** Clases del barrido de un número en Doto con las fuentes ya cargadas (sin fuente de respaldo). */
export function barridoNumero(cargadas: Set<FuenteBarrido>): string[] {
  return ORDEN_BARRIDO.filter((f) => cargadas.has(f)).map((f) => `bd-${f}`);
}

// Hoja de partida de la cartela en la navegación: la última hoja vista (la home es la 01). Las dos cartelas
// de una página (móvil y escritorio) piden la misma hoja de destino y deben recibir la misma de partida.
let hojaActual = '01';
let ultimaPeticion: { destino: string; desde: string } | null = null;

/** Hoja desde la que barre la cartela al llegar a `destino`; registra `destino` como la hoja actual. */
export function hojaDesde(destino: string): string {
  if (ultimaPeticion?.destino === destino) return ultimaPeticion.desde;
  ultimaPeticion = { destino, desde: hojaActual };
  hojaActual = destino;
  return ultimaPeticion.desde;
}

/** Solo para pruebas: vuelve al estado inicial (en la home). */
export function reiniciarHojas(): void {
  hojaActual = '01';
  ultimaPeticion = null;
}
