import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

const COLUMNAS = [
  // Móvil: una sola columna con el marco a ambos lados. Desde md: marco a la izquierda, líneas suaves dentro.
  'border-x border-guide md:border-r-guide-soft',
  'hidden border-r border-guide-soft md:block',
  'hidden border-r border-guide-soft md:block',
  'hidden border-r border-guide md:block min-[1360px]:border-r-0',
];

/**
 * Plano de 4 columnas: marco en --guide y líneas interiores en --guide-soft, a todo lo alto del padre (`relative`).
 * Con `entrada`, sus líneas bajan escalonadas en la carga inicial.
 */
export default function Reticula({ entrada = false }: { entrada?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
      <div className="contenedor-reticula h-full">
        <div className="grid h-full grid-cols-1 md:grid-cols-4">
          {COLUMNAS.map((clases, i) => (
            <div
              key={i}
              className={cn(clases)}
              {...(entrada && { 'data-mov': 'trazo-v', 'data-mov-entrada': '', style: { '--retraso': `${i * 40}ms` } as CSSProperties })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
