'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import faqData from '@/config/faq.json';
import type { FAQCategory } from '@/types/faq';

const FAQ = () => {
  const t = useTranslations('FAQ');

  const categories: FAQCategory[] = ['general', 'services', 'pricing', 'technical'];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="faq" className="section-spacing bg-background overflow-hidden">
      <div className="container-main">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="numbered-section section-title justify-center" data-number="06">
            {t('title')}
          </h2>
          <p className="subtitle max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.div
              key={category}
              variants={item}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-primary" />
                {t(`categories.${category}`)}
              </h3>

              <Accordion type="single" collapsible className="space-y-3">
                {faqData[category].map((faqItem) => (
                  <AccordionItem
                    key={faqItem.id}
                    value={faqItem.id}
                    className="border border-border/50 rounded-lg px-6 data-[state=open]:border-primary/50 transition-colors"
                  >
                    <AccordionTrigger className="text-left hover:text-primary transition-colors">
                      {t(`questions.${faqItem.id}.question`)}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {t(`questions.${faqItem.id}.answer`)}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
