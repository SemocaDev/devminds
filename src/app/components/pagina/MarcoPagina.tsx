import type { ReactNode } from 'react';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer/Footer';
import BarraMovil from '@/app/components/layout/BarraMovil';
import Reticula from '@/app/components/reticula/Reticula';

/** Estructura común de las páginas internas: navbar, retícula a todo lo alto, footer y barra móvil. */
export default function MarcoPagina({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="relative flex-1">
        <Reticula entrada />
        {children}
      </main>
      <Footer conBarraMovil />
      <BarraMovil />
    </div>
  );
}
