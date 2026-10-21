/** Los cuatro escalones de la oferta, con su color. Los usan la Escalera de la home y la página de Servicios. */
export const ESCALONES = [
  { clave: 'web', fondo: 'bg-primary text-primary-foreground', tenue: 'text-primary-foreground' },
  { clave: 'sistemas', fondo: 'bg-secondary text-foreground', tenue: 'text-muted-foreground' },
  { clave: 'apps', fondo: 'bg-surface-3 text-foreground', tenue: 'text-muted-foreground' },
  { clave: 'soporte', fondo: 'bg-foreground text-background', tenue: 'text-background/70' },
] as const;

export type ClaveEscalon = (typeof ESCALONES)[number]['clave'];
