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

    const pendientes = new Set<Element>();
    // Al revelarse un elemento, también su contenido pendiente (cada pieza con su propio retraso): dentro de
    // una banda que aún se despliega, el recorte impide que el observador vea entrar a sus hijos.
    const activar = (el: Element) => {
      for (const x of [el, ...el.querySelectorAll(PENDIENTES)]) {
        x.classList.add('mov-activo');
        io.unobserve(x);
        pendientes.delete(x);
      }
    };
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting || e.boundingClientRect.bottom < 0) activar(e.target);
      },
      { rootMargin: '0px 0px -15% 0px' }
    );

    const observar = () => {
      document.querySelectorAll(PENDIENTES).forEach((el) => {
        // Ya pasado (por ancla o scroll restaurado): visible de inmediato.
        if (el.getBoundingClientRect().bottom < 0) activar(el);
        else if (!pendientes.has(el)) {
          pendientes.add(el);
          io.observe(el);
        }
      });
    };
    // Red de seguridad al bajar rápido: lo que ya quedó por encima de la ventana se activa.
    let marcoScroll = 0;
    const alDesplazar = () => {
      if (marcoScroll || pendientes.size === 0) return;
      marcoScroll = requestAnimationFrame(() => {
        marcoScroll = 0;
        for (const el of pendientes) if (el.getBoundingClientRect().bottom < 0) activar(el);
      });
    };
    window.addEventListener('scroll', alDesplazar, { passive: true });
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
      cancelAnimationFrame(marcoScroll);
      window.removeEventListener('scroll', alDesplazar);
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
