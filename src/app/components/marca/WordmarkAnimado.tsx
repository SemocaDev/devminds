'use client';

import { useEffect, useRef } from 'react';
import { DESCANSO_WORDMARK_MS, PASO_BARRIDO_MS, fasesDisponibles } from '@/lib/movimiento';
import { cn } from '@/lib/utils';

const TEXTO = 'DevMinds';
type Fuente = 'outfit' | 'mono' | 'serif';

/**
 * "DevMinds" que barre fuentes y descansa en Doto. El primer barrido es CSS (corre desde el primer pintado);
 * este ciclo sigue después y solo usa las fuentes ya descargadas, sin asomar la de respaldo. El ancho lo fija
 * la ranura en CSS (.wm-ranura), así el titular no se mueve.
 * Se pausa fuera de pantalla, con la pestaña oculta y con el cursor o el foco sobre el titular, y no anima
 * con prefers-reduced-motion. La palabra es texto real: lectores de pantalla y buscadores la leen una vez.
 */
export default function WordmarkAnimado({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const raiz = ref.current;
    const palabra = raiz?.querySelector<HTMLSpanElement>('[data-palabra]');
    if (!raiz || !palabra) return;
    const titular = raiz.closest('h1') ?? raiz;
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)');
    const css = getComputedStyle(document.documentElement);
    const familia = (variable: string) => css.getPropertyValue(variable);
    const FUENTES: Record<Fuente, string> = {
      outfit: `700 1em ${familia('--font-outfit')}`,
      mono: `600 1em ${familia('--font-geist-mono')}`,
      serif: `italic 400 1em ${familia('--font-instrument')}`,
    };

    const poner = (clase: string) => { palabra.className = `inline-block text-left ${clase}`; };
    const cargadas = () => new Set((Object.keys(FUENTES) as Fuente[]).filter((f) => document.fonts.check(FUENTES[f])));
    // Geist Mono e Instrument Serif no se precargan: se piden ya y se suman al barrido cuando lleguen.
    Object.values(FUENTES).forEach((f) => document.fonts.load(f).catch(() => []));

    let visible = true;
    let encima = false;
    let vivo = true;
    let fases = ['wm-doto'];
    let paso = 0;
    let temporizador: number | undefined;

    const tic = () => {
      if (!vivo) return;
      if (reducido.matches || !visible || encima || document.hidden) {
        paso = 0;
        poner('wm-doto');
        temporizador = window.setTimeout(tic, 1000);
        return;
      }
      if (paso === 0) fases = fasesDisponibles(cargadas());
      poner(fases[paso]);
      const ultima = paso === fases.length - 1;
      paso = ultima ? 0 : paso + 1;
      temporizador = window.setTimeout(tic, ultima ? DESCANSO_WORDMARK_MS : PASO_BARRIDO_MS);
    };

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(titular);
    const entrar = () => { encima = true; };
    const salir = () => { encima = false; };
    titular.addEventListener('mouseenter', entrar);
    titular.addEventListener('mouseleave', salir);
    titular.addEventListener('focusin', entrar);
    titular.addEventListener('focusout', salir);
    // El primer barrido (CSS) ya ocurrió en la entrada: el ciclo empieza tras un descanso.
    temporizador = window.setTimeout(tic, DESCANSO_WORDMARK_MS);

    return () => {
      vivo = false;
      window.clearTimeout(temporizador);
      io.disconnect();
      titular.removeEventListener('mouseenter', entrar);
      titular.removeEventListener('mouseleave', salir);
      titular.removeEventListener('focusin', entrar);
      titular.removeEventListener('focusout', salir);
    };
  }, []);

  return (
    <span ref={ref} className={cn('wm-ranura', className)}>
      <span data-palabra className="wm-doto inline-block text-left">{TEXTO}</span>

    </span>
  );
}
