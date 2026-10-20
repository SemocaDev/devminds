'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const PASOS = [
  { clave: 'web', ancla: 'webdev', alto: 'md:h-[260px]', margen: 'mr-9', fondo: 'bg-primary text-primary-foreground', tenue: 'text-primary-foreground/80' },
  { clave: 'sistemas', ancla: 'custom', alto: 'md:h-[260px]', margen: 'mr-6', fondo: 'bg-secondary text-foreground', tenue: 'text-muted-foreground' },
  { clave: 'apps', ancla: 'custom', alto: 'md:h-[260px]', margen: 'mr-3', fondo: 'bg-surface-3 text-foreground', tenue: 'text-muted-foreground' },
  { clave: 'soporte', ancla: 'consulting', alto: 'md:h-[260px]', margen: 'mr-0', fondo: 'bg-foreground text-background', tenue: 'text-background/70' },
] as const;

/** La oferta como camino que crece con el negocio. Es el elemento firma de la home. */
export default function Escalera() {
  const t = useTranslations('Home.escalera');
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
        <ol className="flex flex-col gap-2 py-6 md:grid md:grid-cols-4 md:gap-0 md:py-0">
          {PASOS.map((p) => (
            <li key={p.clave} data-escalon className={cn(p.margen, 'md:mr-0')}>
              <Link
                href={`/${lang}/services#${p.ancla}`}
                className={cn('group flex h-full flex-col rounded-xl p-5 md:rounded-none md:p-6', p.fondo, p.alto)}
              >
                <span className={cn('flex items-start justify-between gap-3 text-[13px] font-medium', p.tenue)}>
                  {t(`pasos.${p.clave}.etiqueta`)}
                  <ArrowUpRight className="size-4 shrink-0 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1 font-display text-xl font-bold tracking-[-0.015em] md:text-[1.375rem]">{t(`pasos.${p.clave}.titulo`)}</span>
                <span className={cn('mt-2 text-[15px] leading-snug', p.tenue)}>{t(`pasos.${p.clave}.texto`)}</span>
                {t.has(`pasos.${p.clave}.tiempo`) && (
                  <span className="mt-auto pt-4 font-doto text-xl font-black tracking-[-0.03em]">{t(`pasos.${p.clave}.tiempo`)}</span>
                )}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
