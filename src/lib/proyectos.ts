/** Une tipo, cliente y año de un proyecto con " · ", omitiendo partes vacías. */
export function lineaMeta(partes: Array<string | number | null | undefined>): string {
  return partes.filter((p) => p !== null && p !== undefined && p !== '').join(' · ');
}
