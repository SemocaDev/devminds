import { cn } from '@/lib/utils';

/** Campo de puntos que se desvanece (eco de Doto). Solo en el hero; el padre debe ser `relative`. */
export default function CampoPuntos({ className }: { className?: string }) {
  return <div aria-hidden className={cn('campo-puntos pointer-events-none absolute inset-0', className)} />;
}
