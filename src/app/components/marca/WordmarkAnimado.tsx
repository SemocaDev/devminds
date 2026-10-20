'use client';

import { useEffect, useRef } from 'react';
import { FASES_WORDMARK } from '@/lib/wordmark';
import { cn } from '@/lib/utils';

const TEXTO = 'DevMinds';

/**
 * "DevMinds" que alterna fuentes y descansa en Doto. Cada letra fija el ancho que tiene en Doto,
 * así el resto del titular no se mueve. Se pausa fuera de pantalla, con la pestaña oculta,
 * con el cursor o el foco sobre el titular, y no anima con prefers-reduced-motion.
 */
export default function WordmarkAnimado({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;
    const letras = [...raiz.querySelectorAll<HTMLSpanElement>('[data-letra]')];
    const titular = raiz.closest('h1') ?? raiz;
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)');
    const poner = (clase: string) => letras.forEach((l) => { l.className = `inline-block text-center ${clase}`; });
    const medir = () => {
      poner('wm-doto');
      letras.forEach((l) => { l.style.width = ''; });
      letras.forEach((l) => { l.style.width = `${l.getBoundingClientRect().width}px`; });
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

    document.fonts.ready.then(() => { if (!vivo) return; medir(); temporizador = window.setTimeout(tic, 1200); });

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
      <span aria-hidden>
        {[...TEXTO].map((letra, i) => (
          <span key={i} data-letra className="wm-doto inline-block text-center">{letra}</span>
        ))}
      </span>
    </span>
  );
}
