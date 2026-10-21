'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import CampoPuntos from '@/app/components/reticula/CampoPuntos';
import { ESCALONES, type ClaveEscalon } from '@/config/escalones';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

// Posición en el mosaico móvil de 2 columnas: [web · puntos] [sistemas · apps] [puntos · soporte].
const ORDEN: Record<ClaveEscalon, string> = { web: 'order-1', sistemas: 'order-3', apps: 'order-4', soporte: 'order-6' };
const PASOS = ESCALONES.map((e) => ({ ...e, orden: ORDEN[e.clave] }));

const celdaPuntos = 'relative bg-background md:hidden';

/**
 * La oferta como camino que crece con el negocio. Es el elemento firma de la home.
 * Escritorio: cuatro escalones colgando del hero. Móvil: mosaico con celdas de puntos y, debajo, el párrafo del hero.
 */
export default function Escalera() {
  const t = useTranslations('Home.escalera');
  const tHome = useTranslations('Home');
  const { lang } = useParams<{ lang: string }>();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        gsap.from('[data-escalon]', {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
        });
      },
      ref
    );
    return () => mm.revert();
  }, []);

  return (
    <section id="services" ref={ref} className="relative">
      <div className="contenedor-reticula relative z-[2]">
        {/* Como en el prototipo, los escalones cuelgan del pie del hero; el título queda para lectores de pantalla y SEO */}
        <h2 className="sr-only">{t('titulo')}. {t('subtitulo')}</h2>
        <ol className="grid grid-cols-2 gap-px border-b border-guide bg-guide md:grid-cols-4 md:gap-0 md:border-0 md:bg-transparent">
          {PASOS.map((p) => (
            <li key={p.clave} data-escalon className={cn(p.orden, 'md:order-none')}>
              <Link
                href={`/${lang}/services#${p.clave}`}
                className={cn('group flex h-full min-h-[156px] flex-col p-4 md:min-h-[260px] md:p-6', p.fondo)}
              >
                <span className={cn('flex items-start justify-between gap-3 text-[13px] font-medium', p.tenue)}>
                  {t(`pasos.${p.clave}.etiqueta`)}
                  <ArrowUpRight className="size-4 shrink-0 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1 font-display text-lg font-bold leading-tight tracking-[-0.015em] md:text-[1.375rem] md:leading-normal">{t(`pasos.${p.clave}.titulo`)}</span>
                <span className={cn('mt-2 hidden text-[15px] leading-snug sm:block', p.tenue)}>{t(`pasos.${p.clave}.texto`)}</span>
                {t.has(`pasos.${p.clave}.tiempo`) && (
                  <span className="mt-auto pt-4 font-doto text-lg font-black tracking-[-0.03em] md:text-xl">{t(`pasos.${p.clave}.tiempo`)}</span>
                )}
              </Link>
            </li>
          ))}
          <li aria-hidden className={cn(celdaPuntos, 'order-2')}><CampoPuntos /></li>
          <li aria-hidden className={cn(celdaPuntos, 'order-5')}><CampoPuntos /></li>
        </ol>
        <p className="px-4 py-8 text-[17px] leading-relaxed text-muted-foreground md:hidden">{tHome('hero.texto')}</p>
      </div>
    </section>
  );
}
