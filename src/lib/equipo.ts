/** Elige a quién mostrar como fundador: el marcado `founder`, si no el primero, si no `null`. */
export function elegirFundador<T extends { hierarchy: string }>(miembros: T[]): T | null {
  return miembros.find((m) => m.hierarchy === 'founder') ?? miembros[0] ?? null;
}
