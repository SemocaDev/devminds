/** Preguntas frecuentes de la home, en orden. Textos en messages/*.json → Home.preguntas.items.<id>. */
export const PREGUNTAS = ['costo', 'tiempo', 'propiedad', 'google', 'soporte', 'alcance'] as const;
export type PreguntaId = (typeof PREGUNTAS)[number];
