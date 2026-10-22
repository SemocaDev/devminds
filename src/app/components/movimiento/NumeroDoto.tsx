'use client';

import { useEffect, useRef } from 'react';
import { PASO_BARRIDO_MS, barridoNumero } from '@/lib/movimiento';
import { fuentesCargadas, pedirFuentes } from '@/app/components/movimiento/fuentes';
import { cn } from '@/lib/utils';


/**
 * Número en Doto que hace un barrido de fuentes al aparecer, eco de "DevMinds".
 * Solo cambia la familia (clases bd-*) y solo con fuentes ya descargadas; no anima con prefers-reduced-motion.
 */
export default function NumeroDoto({ valor, className }: { valor: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    pedirFuentes();
    const temporizadores: number[] = [];
    const barrer = () => {
      const BARRIDO = barridoNumero(fuentesCargadas());
      BARRIDO.forEach((clase, i) => {
        temporizadores.push(window.setTimeout(() => {
          el.classList.remove('bd-outfit', 'bd-mono', 'bd-serif');
          el.classList.add(clase);
        }, i * PASO_BARRIDO_MS));
      });
      temporizadores.push(window.setTimeout(() => el.classList.remove('bd-outfit', 'bd-mono', 'bd-serif'), BARRIDO.length * PASO_BARRIDO_MS));
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      barrer();
    }, { rootMargin: '0px 0px -15% 0px' });
    io.observe(el);
    return () => {
      io.disconnect();
      temporizadores.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return <span ref={ref} className={cn('font-doto', className)}>{valor}</span>;
}
