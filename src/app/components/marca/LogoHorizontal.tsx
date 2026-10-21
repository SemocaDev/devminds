import Image from 'next/image';
import { cn } from '@/lib/utils';

// Proporción del viewBox de public/brand/logo-horizontal*.svg (519.594 × 66.24).
const PROPORCION = 519.594 / 66.24;

type Props = {
  /** `claro` para fondos claros (grafito); `oscuro` para fondos oscuros (nieve). */
  tono?: 'claro' | 'oscuro';
  /** Alto en px; el ancho sale de la proporción del SVG. */
  alto?: number;
  className?: string;
  prioridad?: boolean;
};

/** Logo horizontal de la identidad: celda de 3×3 puntos + wordmark en Doto. */
export default function LogoHorizontal({ tono = 'claro', alto = 24, className, prioridad = false }: Props) {
  return (
    <Image
      src={tono === 'claro' ? '/brand/logo-horizontal.svg' : '/brand/logo-horizontal-oscuro.svg'}
      alt="DevMinds"
      width={Math.round(alto * PROPORCION)}
      height={alto}
      priority={prioridad}
      unoptimized
      className={cn('block', className)}
    />
  );
}
