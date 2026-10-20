'use client';

import { useTranslations } from 'next-intl';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PREGUNTAS } from '@/config/preguntas';

/** Seis preguntas que deciden la compra: título en la columna 1, acordeón en las columnas 2–4. */
export default function FAQ() {
  const t = useTranslations('Home.preguntas');
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="contenedor-reticula relative z-[2]">
        <div className="grid gap-y-8 md:grid-cols-4">
          <div className="px-4 md:px-6">
            <h2 className="font-display text-3xl font-bold tracking-[-0.02em] md:text-[2.25rem]">{t('titulo')}</h2>
            <p className="mt-3 text-[17px] text-muted-foreground">{t('subtitulo')}</p>
          </div>
          <Accordion type="single" collapsible className="border-t border-border px-4 md:col-span-3 md:px-6">
            {PREGUNTAS.map((id) => (
              <AccordionItem key={id} value={id} className="border-b border-border">
                <AccordionTrigger className="min-h-11 py-5 text-left text-[17px] font-semibold hover:no-underline">
                  {t(`items.${id}.pregunta`)}
                </AccordionTrigger>
                <AccordionContent className="max-w-[65ch] pb-5 text-base leading-relaxed text-muted-foreground">
                  {t(`items.${id}.respuesta`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
