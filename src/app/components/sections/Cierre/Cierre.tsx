'use client';

import { useTranslations } from 'next-intl';
import { ArrowUpRight, Mail } from 'lucide-react';
import { enlaceCorreo, enlaceWhatsApp } from '@/lib/enlaces';
import { cn } from '@/lib/utils';

const boton = 'flex h-12 w-full items-center justify-between rounded-lg px-4 text-[15px] font-semibold transition-colors';

/** Único llamado final a la acción: título en las columnas 1–3, botones apilados en la columna 4. */
export default function Cierre() {
  const t = useTranslations('Home');
  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="contenedor-reticula relative z-[2]">
        <div className="grid gap-y-8 md:grid-cols-4 md:items-end">
          <div className="px-4 md:col-span-3 md:px-6">
            <h2 className="max-w-[16ch] font-display text-4xl font-bold leading-[1.05] tracking-[-0.025em] md:text-6xl">{t('cierre.titulo')}</h2>
            <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-muted-foreground md:text-lg">{t('cierre.texto')}</p>
          </div>
          <div className="flex flex-col gap-2 px-4 md:px-6">
            <a href={enlaceWhatsApp(t('whatsappMensaje'))} target="_blank" rel="noopener noreferrer" className={cn(boton, 'bg-primary text-primary-foreground hover:bg-primary-hover')}>
              {t('cierre.whatsapp')}<ArrowUpRight className="size-4" />
            </a>
            <a href={enlaceCorreo(t('cierre.asunto'))} className={cn(boton, 'border border-border bg-background text-foreground hover:bg-secondary')}>
              {t('cierre.correo')}<Mail className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
