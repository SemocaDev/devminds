import type { FuenteBarrido } from '@/lib/movimiento';

// Primera familia de la variable CSS de next/font (la lista completa incluye la de respaldo local).
const familia = (variable: string) => getComputedStyle(document.documentElement).getPropertyValue(variable).split(',')[0].trim();

const DESCRIPTORES: Record<FuenteBarrido, () => string> = {
  outfit: () => `700 1em ${familia('--font-outfit')}`,
  mono: () => `600 1em ${familia('--font-geist-mono')}`,
  serif: () => `italic 400 1em ${familia('--font-instrument')}`,
};

/** Fuentes del barrido ya descargadas: solo esas se usan, así nunca asoma la de respaldo. */
export function fuentesCargadas(): Set<FuenteBarrido> {
  return new Set((Object.keys(DESCRIPTORES) as FuenteBarrido[]).filter((f) => document.fonts.check(DESCRIPTORES[f]())));
}

/** Pide ya las fuentes del barrido que no se precargan (Geist Mono, Instrument Serif). */
export function pedirFuentes(): void {
  Object.values(DESCRIPTORES).forEach((d) => document.fonts.load(d()).catch(() => []));
}
