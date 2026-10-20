'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Wordmark from '@/app/components/marca/Wordmark';
import CampoPuntos from '@/app/components/reticula/CampoPuntos';
import { enlaceWhatsApp } from '@/lib/enlaces';

const paso = (i: number) => ({ '--i': i }) as CSSProperties;

/** Paraguas de la home: qué hace DevMinds, para quién y cómo contactarlo. */
export default function Hero() {
  const t = useTranslations('Home');
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden">
      <CampoPuntos />
      <div className="container-main relative w-full">
        <div className="px-4 pb-16 pt-28 md:px-10 md:pb-20 md:pt-32">
          <p className="entrada inline-flex rounded-full bg-accent-tint px-3 py-1 text-[13px] font-semibold text-primary-hover" style={paso(0)}>
            {t('hero.chip')}
          </p>
          <h1
            className="entrada mt-6 max-w-[22ch] font-display text-[2.125rem] font-bold leading-[1.06] tracking-[-0.025em] text-foreground sm:text-5xl lg:text-[4rem] xl:text-[4.5rem]"
            style={paso(1)}
          >
            {/* leading < 1 en el wordmark para que Doto no agrande la primera línea */}
            <Wordmark className="block text-[1.55em] leading-[0.95] sm:inline sm:text-[1.14em] sm:leading-[0.85]" />{' '}
            {t.rich('hero.titulo', { acento: (c) => <span className="text-primary">{c}</span> })}
          </h1>
          <p className="entrada mt-6 max-w-[52ch] text-[17px] leading-relaxed text-muted-foreground md:text-lg" style={paso(2)}>
            {t('hero.texto')}
          </p>
          <div className="entrada mt-9 flex flex-col gap-3 sm:flex-row" style={paso(3)}>
            <Button asChild size="lg">
              <a href={enlaceWhatsApp(t('whatsappMensaje'))} target="_blank" rel="noopener noreferrer">
                <MessageCircle />{t('hero.whatsapp')}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#projects">{t('hero.verTrabajos')}<ArrowRight /></Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
