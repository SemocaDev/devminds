'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window { __movListo?: boolean }
}

const PENDIENTES = '[data-mov]:not([data-mov-entrada]):not(.mov-activo)';

/**
 * Activa los gestos de movimiento al entrar en pantalla (una sola vez por elemento) y cierra la
 * entrada inicial. Lo que ya quedó por encima de la ventana (ancla, scroll restaurado) se activa al
 * instante para que nunca quede oculto. No pinta nada.
 */
export default function RevelarAlScroll() {
  const pathname = usePathname();

  useEffect(() => {
    window.__movListo = true;
    const raiz = document.documentElement;
    // La entrada de marca solo corre en la carga inicial; después, las páginas llegan ya armadas.
    const fin = window.setTimeout(() => raiz.classList.remove('mov-entrada'), 2200);
    return () => window.clearTimeout(fin);
  }, []);

  useEffect(() => {
    const raiz = document.documentElement;
    if (!raiz.classList.contains('mov')) return;

    const activar = (el: Element) => el.classList.add('mov-activo');
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting || e.boundingClientRect.bottom < 0) {
            activar(e.target);
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -15% 0px' }
    );

    const observar = () => {
      document.querySelectorAll(PENDIENTES).forEach((el) => {
        // Ya pasado (por ancla o scroll restaurado): visible de inmediato.
        if (el.getBoundingClientRect().bottom < 0) activar(el);
        else io.observe(el);
      });
    };
    observar();
    // Contenido que llega después (secciones diferidas, filtros): se observa al aparecer, una vez por fotograma.
    let marco = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(marco);
      marco = requestAnimationFrame(observar);
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(marco);
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
