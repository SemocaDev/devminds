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
    <section className="relative overflow-hidden">
      <CampoPuntos />
      <div className="container-main relative">
        <div className="px-4 pb-16 pt-28 md:px-10 md:pb-24 md:pt-40">
          <p className="entrada inline-flex rounded-full bg-accent-tint px-3 py-1 text-[13px] font-semibold text-primary-hover" style={paso(0)}>
            {t('hero.chip')}
          </p>
          <h1
            className="entrada mt-6 max-w-[19ch] font-display text-[2.125rem] font-bold leading-[1.06] tracking-[-0.025em] text-foreground sm:text-5xl lg:text-[4.25rem]"
            style={paso(1)}
          >
            <Wordmark className="block text-[1.55em] leading-[0.95] sm:inline sm:text-[1.14em] sm:leading-none" />{' '}
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
