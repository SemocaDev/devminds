/**
 * Revelado al hacer scroll, sin depender de la hidratación de React. Se inyecta como script en línea al final
 * de <body> (layout.tsx usa `instalarRevelado.toString()`), así que debe ser autocontenida: sin imports.
 *
 * - Lo que ya está en pantalla o quedó por encima (ancla, scroll restaurado) se revela en el acto.
 * - El resto se revela al entrar en pantalla (IntersectionObserver), una sola vez.
 * - Al revelarse un elemento se revelan también sus descendientes pendientes (contenido de una banda).
 * - Al volver atrás/adelante, lo que ya está en pantalla aparece sin animación ("quieto").
 * - Tras el primer clic interno o atrás/adelante deja de ser la carga inicial: sin entrada de marca.
 * La marca de revelado es el atributo data-mov-activo, que React no gestiona y no borra al re-renderizar.
 */
export function instalarRevelado() {
  const d = document.documentElement;
  const w = window as unknown as { __movListo?: boolean; __movNavegado?: boolean; __movVolviendoHasta?: number; __movEscanear?: () => void };
  w.__movListo = true;

  const navegar = (volviendo: boolean) => {
    w.__movNavegado = true;
    if (volviendo) w.__movVolviendoHasta = performance.now() + 900;
    d.classList.remove('mov-entrada');
  };
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href^="/"]');
    if (a && !(a as HTMLAnchorElement).target) navegar(false);
  }, true);
  window.addEventListener('popstate', () => navegar(true));
  window.setTimeout(() => d.classList.remove('mov-entrada'), 2200);

  if (!d.classList.contains('mov')) return;

  const SEL = '[data-mov]:not([data-mov-entrada]):not([data-mov-activo])';
  const pendientes = new Set<Element>();
  const activar = (el: Element, modo: string) => {
    [el, ...Array.from(el.querySelectorAll(SEL))].forEach((x) => {
      x.setAttribute('data-mov-activo', modo);
      io.unobserve(x);
      pendientes.delete(x);
    });
  };
  const io = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting || e.boundingClientRect.bottom < 0) activar(e.target, '');
    });
  }, { rootMargin: '0px 0px -15% 0px' });

  const escanear = () => {
    const quieto = (w.__movVolviendoHasta ?? 0) > performance.now();
    const limite = window.innerHeight * 0.85;
    document.querySelectorAll(SEL).forEach((el) => {
      if (!el.isConnected || el.hasAttribute('data-mov-activo')) return;
      const r = el.getBoundingClientRect();
      const vacio = r.width === 0 && r.height === 0; // oculto por breakpoint: lo vigila el observador
      if (!vacio && (r.bottom < 0 || r.top < (quieto ? window.innerHeight : limite))) {
        activar(el, quieto ? 'quieto' : '');
        return;
      }
      if (!pendientes.has(el)) {
        pendientes.add(el);
        io.observe(el);
      }
    });
  };
  w.__movEscanear = escanear;

  // Red de seguridad al bajar rápido: lo que ya quedó por encima de la ventana se activa.
  let marcoScroll = 0;
  window.addEventListener('scroll', () => {
    if (marcoScroll || pendientes.size === 0) return;
    marcoScroll = requestAnimationFrame(() => {
      marcoScroll = 0;
      pendientes.forEach((el) => {
        const r = el.getBoundingClientRect();
        if ((r.width > 0 || r.height > 0) && r.bottom < 0) activar(el, '');
      });
    });
  }, { passive: true });

  // Contenido que llega después (navegación, secciones diferidas, filtros): un escaneo por fotograma.
  let marco = 0;
  new MutationObserver(() => {
    if (marco) return;
    marco = requestAnimationFrame(() => {
      marco = 0;
      escanear();
    });
  }).observe(document.body, { childList: true, subtree: true });

  escanear();
}
