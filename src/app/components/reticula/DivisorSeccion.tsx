import type { CSSProperties } from 'react';
import { retrasoCruce } from '@/lib/movimiento';
import { cn } from '@/lib/utils';

const DURACION_TRAZO_MS = 750;

type PropsCruz = {
  className?: string;
  /** Posición de la cruz a lo largo de una línea que se traza (0–1): nace cuando la punta del trazo pasa por ella. */
  fraccion?: number;
  /** Momento (ms) en que empieza el trazo de su línea. */
  inicioMs?: number;
};

/** Cruz "+" centrada en su punto; el padre debe ser `relative`. Dentro de un divisor, nace del trazo con un destello. */
export function Cruz({ className, fraccion, inicioMs = 0 }: PropsCruz) {
  const delTrazo = fraccion !== undefined;
  const estilo = delTrazo ? ({ '--retraso-cruz': `${retrasoCruce(fraccion, inicioMs, DURACION_TRAZO_MS)}ms` } as CSSProperties) : undefined;
  return (
    <span aria-hidden style={estilo} className={cn('pointer-events-none absolute z-10 size-[13px] -translate-x-1/2 -translate-y-1/2', className)}>
      {delTrazo && <span className="mov-destello absolute left-[2px] top-[2px] size-[9px] rounded-full bg-primary opacity-0" />}
      <span className="mov-brazo-v absolute left-[6px] top-0 h-full w-px bg-foreground/55" />
      <span className="mov-brazo-h absolute left-0 top-[6px] h-px w-full bg-foreground/55" />
    </span>
  );
}

type Props = {
  className?: string;
  /** Momento (ms) de la carga inicial en que se traza; sin él, se traza al entrar en pantalla. */
  entrada?: number;
};

/**
 * Línea de borde a borde con una cruz en cada línea de columna (5 en desktop, 2 en móvil).
 * La línea se traza de izquierda a derecha y cada cruz nace cuando el trazo la alcanza.
 * Las cruces no son hijas de la línea que se escala, para no deformarse.
 */
export default function DivisorSeccion({ className, entrada }: Props) {
  const inicio = entrada ?? 0;
  const cruz = (fraccion: number, clases: string) => <Cruz className={clases} fraccion={fraccion} inicioMs={inicio} />;
  return (
    <div
      aria-hidden
      data-mov="trazo-h"
      {...(entrada !== undefined && { 'data-mov-entrada': '' })}
      style={{ '--retraso': `${inicio}ms` } as CSSProperties}
      className={cn('relative z-10 h-px', className)}
    >
      <div className="mov-linea absolute inset-0 bg-guide" />
      <div className="contenedor-reticula h-px">
        <div className="relative h-px">
          {cruz(0, 'left-0 top-0')}
          {cruz(0.25, 'left-1/4 top-0 hidden md:block')}
          {cruz(0.5, 'left-1/2 top-0 hidden md:block')}
          {cruz(0.75, 'left-3/4 top-0 hidden md:block')}
          {cruz(1, 'left-full top-0 min-[1360px]:hidden')}
        </div>
      </div>
    </div>
  );
}
