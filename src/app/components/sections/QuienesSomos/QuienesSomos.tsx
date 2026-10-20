'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TeamMemberWithTranslation } from '@/db/queries/team';

type Props = { fundador: TeamMemberWithTranslation | null };

/** Presenta al fundador sobre la retícula: foto (col 1), texto (cols 2–3), tecnologías (col 4). */
export default function QuienesSomos({ fundador }: Props) {
  const t = useTranslations('Home.quienes');
  const { lang } = useParams<{ lang: string }>();
  const conFoto = Boolean(fundador?.photo);

  return (
    <section id="about" className="py-16 md:py-24">
      <div className="contenedor-reticula relative z-[2]">
        <div className="grid gap-y-10 md:grid-cols-4">
          {fundador?.photo && (
            <div className="px-4 md:px-6">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-xl border border-border bg-secondary md:mx-0 md:max-w-none">
                <Image src={fundador.photo} alt={fundador.name} fill sizes="(max-width: 768px) 320px, 25vw" className="object-cover" />
              </div>
            </div>
          )}
          <div className={cn('px-4 md:col-span-2 md:self-end md:px-6', !conFoto && 'md:col-span-3')}>
            <h2 className="max-w-[20ch] font-display text-3xl font-bold tracking-[-0.02em] md:text-[2.5rem]">{t('titulo')}</h2>
            {fundador && (
              <>
                <p className="mt-5 max-w-[60ch] text-[17px] leading-relaxed text-foreground/85 md:text-lg">{t('texto', { nombre: fundador.name })}</p>
                <p className="mt-3 text-sm text-muted-foreground">{fundador.role} · {fundador.location}</p>
              </>
            )}
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
