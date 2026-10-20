'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import CampoPuntos from '@/app/components/reticula/CampoPuntos';

/** El estudio en primera persona, sin datos personales: puntos con la marca (col 1), texto (cols 2–3), tecnologías (col 4). */
export default function QuienesSomos() {
  const t = useTranslations('Home.quienes');
  const { lang } = useParams<{ lang: string }>();

  return (
    <section id="about" className="py-16 md:py-24">
      <div className="contenedor-reticula relative z-[2]">
        <div className="grid gap-y-10 md:grid-cols-4">
          <div className="relative hidden min-h-[260px] md:block">
            <CampoPuntos />
            <span className="absolute bottom-0 left-6 bg-background px-1 font-doto text-3xl font-black tracking-[-0.03em]">DevMinds</span>
          </div>
          <div className="px-4 md:col-span-2 md:self-end md:px-6">
            <h2 className="max-w-[20ch] font-display text-3xl font-bold tracking-[-0.02em] md:text-[2.5rem]">{t('titulo')}</h2>
            <p className="mt-5 max-w-[60ch] text-[17px] leading-relaxed text-foreground/85 md:text-lg">{t('texto')}</p>
            <Link href={`/${lang}/about`} className="mt-6 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-primary transition-colors hover:text-primary-hover">
              {t('enlace')}<ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="px-4 text-[15px] leading-relaxed text-muted-foreground md:self-end md:px-6">{t('tecnologias')}</p>
        </div>
      </div>
    </section>
  );
}
