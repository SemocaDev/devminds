/** Serializa un JSON-LD para `<script type="application/ld+json">`, escapando "<" para que ningún texto cierre la etiqueta. */
export function jsonLd(datos: unknown): string {
  return JSON.stringify(datos).replace(/</g, '\\u003c');
}
