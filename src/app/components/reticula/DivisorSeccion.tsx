import { cn } from '@/lib/utils';

function Cruz({ lado }: { lado: 'izq' | 'der' }) {
  return (
    <span aria-hidden className={cn('absolute top-1/2 size-[13px] -translate-y-1/2', lado === 'izq' ? '-left-[6px]' : '-right-[6px]')}>
      <span className="absolute left-[6px] top-0 h-full w-px bg-foreground/55" />
      <span className="absolute left-0 top-[6px] h-px w-full bg-foreground/55" />
    </span>
  );
}

/** Línea de borde a borde con una cruz "+" donde toca cada guía vertical. */
export default function DivisorSeccion() {
  return (
    <div aria-hidden className="relative z-10 h-px bg-guide">
      <div className="container-main h-px">
        <div className="relative h-px">
          <Cruz lado="izq" />
          <Cruz lado="der" />
        </div>
      </div>
    </div>
  );
}
