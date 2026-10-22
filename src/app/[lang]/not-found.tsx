import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import MarcoPagina from '@/app/components/pagina/MarcoPagina';
import EncabezadoPagina from '@/app/components/pagina/EncabezadoPagina';
import CampoPuntos from '@/app/components/reticula/CampoPuntos';
import { cn } from '@/lib/utils';
import type { CSSProperties } from 'react';
import NumeroDoto from '@/app/components/movimiento/NumeroDoto';

/** Hoja 404: la cartela hace el chiste y la página ofrece las hojas que sí existen. */
export default async function NotFound() {
  const lang = await getLocale();
  const [t, tCartela, tNav] = await Promise.all([getTranslations('NotFound'), getTranslations('Cartela'), getTranslations('Navbar')]);

  const hojas = [
    { numero: '01', nombre: tCartela('inicio'), ruta: '', color: 'bg-primary text-primary-foreground hover:bg-primary-hover' },
    { numero: '02', nombre: tNav('services'), ruta: '/services', color: 'bg-secondary hover:bg-accent' },
    { numero: '03', nombre: tNav('projects'), ruta: '/portfolio', color: 'bg-surface-3 hover:bg-accent' },
    { numero: '04', nombre: tNav('about'), ruta: '/about', color: 'bg-accent-tint hover:bg-accent' },
    { numero: '05', nombre: tNav('contact'), ruta: '/contact', color: 'bg-foreground text-background hover:bg-foreground/90 md:col-span-2' },
  ];

  return (
    <MarcoPagina>
      <EncabezadoPagina
        titulo={t('titulo')}
        bajada={t('bajada')}
        hoja="404"
        seccion={t('seccion')}
        migas={[{ nombre: tCartela('inicio'), ruta: '' }, { nombre: t('desconocida'), ruta: '' }]}
      />
      <div className="contenedor-reticula relative z-[2]">
        <nav className="grid grid-cols-2 md:grid-cols-4">
          {hojas.map((h, i) => (
            <Link key={h.numero} href={`/${lang}${h.ruta}`} data-mov="colgar" style={{ '--retraso': `${i * 70}ms` } as CSSProperties} className={cn('flex min-h-[140px] flex-col p-5 transition-colors md:min-h-[180px] md:p-6', h.color)}>
              <NumeroDoto valor={h.numero} className="text-3xl font-black leading-none tracking-[-0.03em]" />
              <span className="mt-auto font-display text-xl font-bold tracking-[-0.015em]">{h.nombre}</span>
            </Link>
          ))}
          <div aria-hidden className="relative min-h-[140px] md:col-span-2"><CampoPuntos /></div>
        </nav>
      </div>
    </MarcoPagina>
  );
}
