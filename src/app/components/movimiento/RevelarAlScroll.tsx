'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window { __movListo?: boolean; __movNavegado?: boolean; __movEscanear?: () => void }
}

/**
 * El revelado vive en un script en línea (src/lib/revelado.ts) para no esperar la hidratación. Este componente
 * solo vuelve a escanear al cambiar de ruta, por si la página nueva llegó sin mutaciones que lo disparen.
 */
export default function RevelarAlScroll() {
  const pathname = usePathname();
  useEffect(() => {
    window.__movEscanear?.();
  }, [pathname]);
  return null;
}
