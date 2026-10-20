'use client';

import { useEffect, useRef } from 'react';
import { FASES_WORDMARK } from '@/lib/wordmark';
import { cn } from '@/lib/utils';

const TEXTO = 'DevMinds';

/**
 * "DevMinds" que alterna fuentes y descansa en Doto. La palabra fija el ancho que tiene en Doto,
 * así el resto del titular no se mueve. Se pausa fuera de pantalla, con la pestaña oculta,
 * con el cursor o el foco sobre el titular, y no anima con prefers-reduced-motion.
 */
export default function WordmarkAnimado({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;
    const palabra = raiz.querySelector<HTMLSpanElement>('[data-palabra]');
    if (!palabra) return;
    const titular = raiz.closest('h1') ?? raiz;
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)');
    const poner = (clase: string) => { palabra.className = `inline-block text-left ${clase}`; };
    // El ancho de la palabra en Doto queda fijo: las otras fuentes son más angostas y el titular no se mueve.
    const medir = () => {
      poner('wm-doto');
      palabra.style.width = '';
      palabra.style.width = `${palabra.getBoundingClientRect().width}px`;
    };

    let visible = true;
    let encima = false;
    let vivo = true;
    let fase = 0;
    let temporizador: number | undefined;

    const tic = () => {
      if (!vivo) return;
      if (reducido.matches || !visible || encima || document.hidden) {
        fase = 0;
        poner('wm-doto');
        temporizador = window.setTimeout(tic, 1000);
        return;
      }
      const [clase, ms] = FASES_WORDMARK[fase];
      poner(clase);
      fase = (fase + 1) % FASES_WORDMARK.length;
      temporizador = window.setTimeout(tic, ms);
    };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(titular);
    const entrar = () => { encima = true; };
    const salir = () => { encima = false; };
    titular.addEventListener('mouseenter', entrar);
    titular.addEventListener('mouseleave', salir);
    titular.addEventListener('focusin', entrar);
    titular.addEventListener('focusout', salir);
    let marco = 0;
    const alRedimensionar = () => { cancelAnimationFrame(marco); marco = requestAnimationFrame(medir); };
    window.addEventListener('resize', alRedimensionar);

    // Geist Mono e Instrument Serif no se precargan: se piden aquí para que el primer ciclo no muestre la fuente de respaldo.
    const raizCss = getComputedStyle(document.documentElement);
    const precargas = [
      `700 1em ${raizCss.getPropertyValue('--font-outfit')}`,
      `600 1em ${raizCss.getPropertyValue('--font-geist-mono')}`,
      `italic 400 1em ${raizCss.getPropertyValue('--font-instrument')}`,
    ].map((fuente) => document.fonts.load(fuente).catch(() => []));
    Promise.all([document.fonts.ready, ...precargas]).then(() => { if (!vivo) return; medir(); temporizador = window.setTimeout(tic, 1200); });

    return () => {
      vivo = false;
      window.clearTimeout(temporizador);
      cancelAnimationFrame(marco);
      io.disconnect();
      titular.removeEventListener('mouseenter', entrar);
      titular.removeEventListener('mouseleave', salir);
      titular.removeEventListener('focusin', entrar);
      titular.removeEventListener('focusout', salir);
      window.removeEventListener('resize', alRedimensionar);
    };
  }, []);

  return (
    <span ref={ref} className={cn('whitespace-nowrap', className)}>
      <span className="sr-only">{TEXTO}</span>
      <span aria-hidden data-palabra className="wm-doto inline-block text-left">{TEXTO}</span>
    </span>
  );
}
