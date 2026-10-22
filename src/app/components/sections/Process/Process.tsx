'use client';

import { useLocale, useTranslations } from 'next-intl';
import CampoPuntos from '@/app/components/reticula/CampoPuntos';
import { Cruz } from '@/app/components/reticula/DivisorSeccion';
import Reticula from '@/app/components/reticula/Reticula';
import Palabras from '@/app/components/movimiento/Palabras';
import type { CSSProperties } from 'react';
import NumeroDoto from '@/app/components/movimiento/NumeroDoto';

const PASOS = ['conversamos', 'proponemos', 'construimos', 'lanzamos'] as const;

/** Banda carbón: título (cols 1–2) junto a una celda de puntos (cols 3–4) y los cuatro pasos, uno por columna. */
export default function Process() {
  const t = useTranslations('Home.proceso');
  const lang = useLocale();
  return (
    <section id="process" data-mov="desplegar" className="banda-carbon relative z-[2]">
      <Reticula />
      <div className="contenedor-reticula relative z-[2]">
        <div className="grid md:grid-cols-4">
          <h2 className="max-w-[22ch] px-4 pb-10 pt-16 font-display text-3xl font-bold tracking-[-0.02em] md:col-span-2 md:px-6 md:pb-14 md:pt-24 md:text-[2.5rem]"><Palabras texto={t('titulo')} lang={lang} /></h2>
          <div data-mov="encender" style={{ '--retraso': '250ms' } as CSSProperties} className="relative h-[88px] border-t border-guide md:col-span-2 md:h-auto md:border-0">
            <CampoPuntos />
            <Cruz className="left-0 top-0 md:hidden" />
            <Cruz className="left-full top-0 md:hidden" />
          </div>
        </div>
        <ol className="grid gap-y-10 pb-16 md:grid-cols-4 md:pb-24">
          {PASOS.map((clave, i) => (
            <li key={clave} data-mov="aparecer" style={{ '--retraso': `${200 + i * 80}ms` } as CSSProperties} className="relative border-t border-guide px-4 pt-6 md:px-6">
              <Cruz className="left-0 top-0" />
              <Cruz className={i === PASOS.length - 1 ? 'left-full top-0 min-[1360px]:hidden' : 'left-full top-0 md:hidden'} />
              <span aria-hidden><NumeroDoto valor={String(i + 1)} className="text-4xl font-black leading-none tracking-[-0.03em] text-primary" /></span>
              <h3 className="mt-4 font-display text-xl font-bold tracking-[-0.015em]">{t(`pasos.${clave}.titulo`)}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(`pasos.${clave}.texto`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
