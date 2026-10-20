'use client';

import { useTranslations } from 'next-intl';
import { Cruz } from '@/app/components/reticula/DivisorSeccion';

const PASOS = ['conversamos', 'proponemos', 'construimos', 'lanzamos'] as const;

/** Cuatro pasos en lenguaje llano, uno por columna; aquí sí hay numeración porque es una secuencia real. */
export default function Process() {
  const t = useTranslations('Home.proceso');
  return (
    <section id="process" className="bg-secondary py-16 md:py-24">
      <div className="container-main relative z-[2]">
        <div className="grid md:grid-cols-4">
          <h2 className="max-w-[22ch] px-4 font-display text-3xl font-bold tracking-[-0.02em] md:col-span-2 md:px-6 md:text-[2.5rem]">{t('titulo')}</h2>
        </div>
        <ol className="mt-10 grid gap-y-10 md:mt-14 md:grid-cols-4">
          {PASOS.map((clave, i) => (
            <li key={clave} className="relative border-t border-guide px-4 pt-6 md:px-6">
              <Cruz className="left-0 top-0" />
              <Cruz className={i === PASOS.length - 1 ? 'left-full top-0' : 'left-full top-0 md:hidden'} />
              <span aria-hidden className="font-doto text-4xl font-black leading-none tracking-[-0.03em] text-primary">{i + 1}</span>
              <h3 className="mt-4 font-display text-xl font-bold tracking-[-0.015em]">{t(`pasos.${clave}.titulo`)}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(`pasos.${clave}.texto`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
