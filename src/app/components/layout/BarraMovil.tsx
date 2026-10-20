'use client';

import { MessageCircle, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { enlaceLlamada, enlaceWhatsApp } from '@/lib/enlaces';

/** Barra fija inferior en móvil con la acción principal (WhatsApp) y Llamar. */
export default function BarraMovil() {
  const t = useTranslations('Home');
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md md:hidden">
      <div className="flex gap-2">
        <Button asChild size="lg" className="h-12 flex-[1.6]">
          <a href={enlaceWhatsApp(t('whatsappMensaje'))} target="_blank" rel="noopener noreferrer">
            <MessageCircle />{t('barra.whatsapp')}
          </a>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 flex-1">
          <a href={enlaceLlamada()}><Phone />{t('barra.llamar')}</a>
        </Button>
      </div>
    </div>
  );
}
