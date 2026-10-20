import { cn } from '@/lib/utils';

/** Cruz "+" centrada en su punto; el padre debe ser `relative`. */
export function Cruz({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('pointer-events-none absolute z-10 size-[13px] -translate-x-1/2 -translate-y-1/2', className)}>
      <span className="absolute left-[6px] top-0 h-full w-px bg-foreground/55" />
      <span className="absolute left-0 top-[6px] h-px w-full bg-foreground/55" />
    </span>
  );
}

/** Línea de borde a borde con una cruz en cada línea de columna (5 en desktop, 2 en móvil). */
export default function DivisorSeccion({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('relative z-10 h-px bg-guide', className)}>
      <div className="container-main h-px">
        <div className="relative h-px">
          <Cruz className="left-0 top-0" />
          <Cruz className="left-1/4 top-0 hidden md:block" />
          <Cruz className="left-1/2 top-0 hidden md:block" />
          <Cruz className="left-3/4 top-0 hidden md:block" />
          <Cruz className="left-full top-0" />
        </div>
      </div>
    </div>
  );
}
