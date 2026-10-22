'use client';

import { useEffect, useState } from 'react';
import { PASO_BARRIDO_MS, barridoNumero, hojaDesde } from '@/lib/movimiento';
import { fuentesCargadas, pedirFuentes } from '@/app/components/movimiento/fuentes';
import { cn } from '@/lib/utils';

/** Hoja con su punto dibujado como cuadrito: en Doto el punto se lee como "+" y "03.2" parecería "03+2". */
function Digitos({ hoja }: { hoja: string }) {
  return hoja.split('.').map((parte, i) => (
    <span key={i}>{i > 0 && <span className="mx-[0.06em] inline-block size-[0.14em] bg-current" />}{parte}</span>
  ));
}

const navegando = () => typeof window !== 'undefined' && !!window.__movNavegado;

/**
 * Número de hoja de la cartela. En la carga inicial hace un barrido de fuentes sobre su propia hoja; al llegar
 * navegando desde otra página, empieza en la hoja anterior (la home es la 01) y barre hasta la nueva.
 * Solo usa fuentes ya descargadas.
 */
export default function NumeroHoja({ hoja, className }: { hoja: string; className?: string }) {
  // En navegación cliente arranca ya en la hoja anterior (sin asomar la nueva); en la carga inicial, la propia.
  const [desde] = useState(() => (navegando() ? hojaDesde(hoja) : hoja));
  const [mostrada, setMostrada] = useState(desde);
  const [clase, setClase] = useState('');

  useEffect(() => {
    const inicial = !navegando();
    if (inicial) hojaDesde(hoja); // registra la hoja actual para la próxima navegación
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMostrada(hoja);
      return;
    }
    pedirFuentes();
    const pasos = barridoNumero(fuentesCargadas());
    const inicio = inicial ? 450 : 120;
    const temporizadores: number[] = [];
    const t = (ms: number, f: () => void) => temporizadores.push(window.setTimeout(f, ms));
    pasos.forEach((c, i) => t(inicio + i * PASO_BARRIDO_MS, () => {
      setClase(c);
      if (i === Math.floor(pasos.length / 2)) setMostrada(hoja);
    }));
    t(inicio + pasos.length * PASO_BARRIDO_MS, () => {
      setClase('');
      setMostrada(hoja);
    });
    return () => temporizadores.forEach((x) => window.clearTimeout(x));
  }, [hoja]);

  return (
    <span aria-hidden className={cn(clase, className)}>
      <Digitos hoja={mostrada} />
    </span>
  );
}
