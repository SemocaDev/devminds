'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import TarjetaProyecto from '@/app/components/proyectos/TarjetaProyecto';
import { cn } from '@/lib/utils';
import type { ProjectWithTranslation } from '@/db/queries/projects';
import Palabras from '@/app/components/movimiento/Palabras';

type Props = { projects?: ProjectWithTranslation[] };

/** Proyectos destacados sobre la retícula: el primero ocupa dos columnas, los otros una cada uno. */
export default function Projects({ projects = [] }: Props) {
  const t = useTranslations('Home.trabajos');
  const { lang } = useParams<{ lang: string }>();

  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="contenedor-reticula relative z-[2]">
        <div className="grid gap-y-4 md:grid-cols-4 md:items-end">
          <h2 className="max-w-[20ch] px-4 font-display text-3xl font-bold tracking-[-0.02em] md:col-span-3 md:px-6 md:text-[2.5rem]"><Palabras texto={t('titulo')} lang={lang} /></h2>
          <Link
            href={`/${lang}/portfolio`}
            className="inline-flex min-h-11 items-center gap-2 px-4 text-[15px] font-semibold text-primary transition-colors hover:text-primary-hover md:justify-self-end md:px-6"
          >
            {t('verTodos')}<ArrowRight className="size-4" />
          </Link>
        </div>
        {projects.length > 0 && (
          <ul className="mt-10 grid gap-y-10 md:mt-12 md:grid-cols-4 md:gap-y-12">
            {projects.map((p, i) => {
              const tipo = t.has(`tipos.${p.category}`) ? t(`tipos.${p.category}`) : null;
              const destacado = i === 0;
              return (
                <li key={p.id} className={cn('px-4 md:px-6', destacado && 'md:col-span-2')}>
                  <TarjetaProyecto proyecto={p} href={`/${lang}/portfolio/${p.slug}`} tipo={tipo} destacado={destacado} retraso={i * 80} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
