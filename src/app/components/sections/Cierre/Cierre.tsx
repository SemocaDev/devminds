'use client';

import { useLocale, useTranslations } from 'next-intl';
import { ArrowUpRight, Mail } from 'lucide-react';
import Reticula from '@/app/components/reticula/Reticula';
import { enlaceCorreo, enlaceWhatsApp } from '@/lib/enlaces';
import { cn } from '@/lib/utils';
import Palabras from '@/app/components/movimiento/Palabras';

const boton = 'flex min-h-12 w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left text-[15px] font-semibold leading-tight transition-colors [&>svg]:shrink-0';

/** Banda terracota con el único llamado final: título en las columnas 1–3, botones apilados en la columna 4. */
export default function Cierre() {
  const t = useTranslations('Home');
  const lang = useLocale();
  return (
    <section id="contact" data-mov="desplegar" className="banda-acento relative z-[2] py-20 md:py-28">
      <Reticula />
      <div className="contenedor-reticula relative z-[2]">
        <div className="grid gap-y-8 md:grid-cols-4 md:items-end">
          <div className="px-4 md:col-span-3 md:px-6">
            <h2 className="max-w-[16ch] font-display text-4xl font-bold leading-[1.05] tracking-[-0.025em] md:text-6xl"><Palabras texto={t('cierre.titulo')} lang={lang} /></h2>
            <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed md:text-lg">{t('cierre.texto')}</p>
          </div>
          <div className="flex flex-col gap-2 px-4 md:px-6">
            <a href={enlaceWhatsApp(t('whatsappMensaje'))} target="_blank" rel="noopener noreferrer" className={cn(boton, 'bg-nieve text-carbon hover:bg-nieve/90')}>
              {t('cierre.whatsapp')}<ArrowUpRight className="size-4" />
            </a>
            <a href={enlaceCorreo(t('cierre.asunto'))} className={cn(boton, 'bg-carbon text-nieve hover:bg-carbon/85')}>
              {t('cierre.correo')}<Mail className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
