'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import WordmarkAnimado from '@/app/components/marca/WordmarkAnimado';
import CampoPuntos from '@/app/components/reticula/CampoPuntos';
import DivisorSeccion, { Cruz } from '@/app/components/reticula/DivisorSeccion';
import Rieles from '@/app/components/reticula/Rieles';
import { enlaceWhatsApp } from '@/lib/enlaces';
import { cn } from '@/lib/utils';

const paso = (i: number) => ({ '--i': i }) as CSSProperties;
const boton = 'flex min-h-12 w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left text-[15px] font-semibold leading-tight transition-colors [&>svg]:shrink-0';

/**
 * Hero en dos bandas sobre la retícula: titular (cols 1–3) y puntos (col 4); párrafo (cols 1–2) y botones (col 3).
 * En móvil: puntos, "DevMinds" en su propia banda y el titular; el párrafo pasa bajo el mosaico de la escalera
 * y los botones quedan en la barra inferior.
 */
export default function Hero() {
  const t = useTranslations('Home');
  return (
    <section className="relative">
      <Rieles />
      <DivisorSeccion entrada={350} className="absolute inset-x-0 top-16 md:top-[72px]" />
      <div className="contenedor-reticula relative z-[2] pt-16 md:pt-[72px]">
        <div className="grid md:grid-cols-4">
          <div className="relative order-first h-[88px] border-b border-guide md:order-none md:col-start-4 md:row-span-2 md:row-start-1 md:h-auto md:border-0">
            <CampoPuntos />
            <Cruz className="left-0 top-full md:hidden" />
            <Cruz className="left-full top-full md:hidden" />
          </div>

          <div className="px-4 pb-8 pt-3 md:col-span-3 md:col-start-1 md:row-start-1 md:flex md:min-h-[300px] md:items-end md:px-6 md:pb-10 md:pt-16">
            <h1
              className="entrada font-display text-[2.125rem] font-bold leading-[1.04] tracking-[-0.025em] text-foreground sm:text-5xl lg:text-[3.25rem] xl:text-[3.625rem] min-[1600px]:text-[4.5rem]"
              style={paso(0)}
            >
              <span className="relative -mx-4 mb-6 block border-b border-guide px-4 pb-3 md:static md:m-0 md:inline md:border-0 md:p-0">
                <WordmarkAnimado className="block text-[length:min(1.85em,calc((100vw_-_64px)/5.2))] leading-[0.95] md:inline md:text-[1em] md:leading-[0.85]" />
                <Cruz className="left-0 top-full md:hidden" />
                <Cruz className="left-full top-full md:hidden" />
              </span>{' '}
              {t('hero.titulo')}
            </h1>
          </div>

          <div className="relative hidden border-t border-guide-soft px-4 pb-8 pt-6 md:col-span-2 md:block md:col-start-1 md:row-start-2 md:px-6 md:pb-12">
            <Cruz className="left-0 top-0" />
            <Cruz className="left-1/2 top-0 hidden md:block" />
            <Cruz className="left-full top-0 md:hidden" />
            <p className="entrada max-w-[52ch] text-[17px] leading-relaxed text-muted-foreground" style={paso(1)}>
              {t('hero.texto')}
            </p>
          </div>

          <div className="relative hidden px-4 pb-12 md:col-start-3 md:block md:row-start-2 md:border-t md:border-guide-soft md:px-6 md:pt-6">
            <Cruz className="left-0 top-0 hidden md:block" />
            <Cruz className="left-full top-0 hidden md:block" />
            <div className="entrada flex flex-col gap-2" style={paso(2)}>
              <a href={enlaceWhatsApp(t('whatsappMensaje'))} target="_blank" rel="noopener noreferrer" className={cn(boton, 'bg-primary text-primary-foreground hover:bg-primary-hover')}>
                {t('hero.whatsapp')}<ArrowUpRight className="size-4" />
              </a>
              <Link href="#projects" className={cn(boton, 'border border-border bg-background text-foreground hover:bg-secondary')}>
                {t('hero.verTrabajos')}<ArrowDown className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
