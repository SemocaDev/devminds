import { cn } from '@/lib/utils';

/** Puntos que rellenan exactamente su celda de la retícula (eco de Doto). El padre debe ser `relative`. */
export default function CampoPuntos({ className }: { className?: string }) {
  return <div aria-hidden className={cn('campo-puntos pointer-events-none absolute inset-0', className)} />;
}
