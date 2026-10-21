'use client';

import { useEffect, useState } from 'react';
import { PASO_BARRIDO_MS } from '@/lib/movimiento';
import { cn } from '@/lib/utils';

const BARRIDO = ['bd-outfit', 'bd-mono', 'bd-serif'];
// Hoja de la página anterior dentro de la misma visita: la home es la 01.
let hojaAnterior = '01';

/** Hoja con su punto dibujado como cuadrito: en Doto el punto se lee como "+" y "03.2" parecería "03+2". */
function Digitos({ hoja }: { hoja: string }) {
  return hoja.split('.').map((parte, i) => (
    <span key={i}>{i > 0 && <span className="mx-[0.06em] inline-block size-[0.14em] bg-current" />}{parte}</span>
  ));
}

/**
 * Número de hoja de la cartela. En la carga inicial hace un barrido de fuentes sobre su propia hoja; al llegar
 * navegando desde otra página, empieza en la hoja anterior y barre hasta la nueva, como pasar de hoja en un plano.
 */
export default function NumeroHoja({ hoja, className }: { hoja: string; className?: string }) {
  const [mostrada, setMostrada] = useState(hoja);
  const [clase, setClase] = useState('');

  useEffect(() => {
    const anterior = hojaAnterior;
    hojaAnterior = hoja;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cargaInicial = document.documentElement.classList.contains('mov-entrada');
    const inicio = cargaInicial ? 450 : 120;
    const desde = cargaInicial ? hoja : anterior;
    const temporizadores: number[] = [];
    // El primer estado (hoja de partida) se pone en un temporizador, no de forma síncrona en el efecto.
    temporizadores.push(window.setTimeout(() => setMostrada(desde), 0));
    BARRIDO.forEach((c, i) => {
      temporizadores.push(window.setTimeout(() => {
        setClase(c);
        if (i === 1) setMostrada(hoja);
      }, inicio + i * PASO_BARRIDO_MS));
    });
    temporizadores.push(window.setTimeout(() => setClase(''), inicio + BARRIDO.length * PASO_BARRIDO_MS));
    return () => temporizadores.forEach((t) => window.clearTimeout(t));
  }, [hoja]);

  return (
    <span aria-hidden className={cn(clase, className)}>
      <Digitos hoja={mostrada} />
    </span>
  );
}
