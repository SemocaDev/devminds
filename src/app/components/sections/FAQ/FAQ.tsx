'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import faqData from '@/config/faq.json';
import type { FAQCategory } from '@/types/faq';

gsap.registerPlugin(ScrollTrigger);

const FAQ = () => {
  const t = useTranslations('FAQ');
  const sectionRef = useRef<HTMLElement>(null);

  const categories: FAQCategory[] = ['general', 'services', 'pricing', 'technical'];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
      gsap.fromTo('.faq-header',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true } }
      );
      gsap.fromTo('.faq-column',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.55, ease, stagger: 0.1,
          scrollTrigger: { trigger: '.faq-grid', start: 'top 82%', once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="faq" ref={sectionRef} className="section-spacing bg-muted/20 overflow-hidden">
      <div className="container-main">

        <div className="faq-header mb-14 opacity-0">
          <p className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary tracking-[0.2em] uppercase mb-4">
            <span className="w-6 h-px bg-primary" />
            06
          </p>
          <h2 className="section-title max-w-xl">{t('title')}</h2>
          <p className="subtitle max-w-lg mt-3">{t('subtitle')}</p>
        </div>

        <div className="faq-grid grid md:grid-cols-2 gap-8 max-w-5xl">
          {categories.map((category) => (
            <div key={category} className="faq-column opacity-0 space-y-3">
              <h3 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-[0.18em] mb-4">
                {t(`categories.${category}`)}
              </h3>

              <Accordion type="single" collapsible className="space-y-2">
                {faqData[category].map((faqItem) => (
                  <AccordionItem
                    key={faqItem.id}
                    value={faqItem.id}
                    className="border border-border/50 rounded-lg px-5 data-[state=open]:border-foreground/30 transition-colors duration-200"
                  >
                    <AccordionTrigger className="text-left text-sm font-medium hover:text-foreground transition-colors py-4">
                      {t(`questions.${faqItem.id}.question`)}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                      {t(`questions.${faqItem.id}.answer`)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
