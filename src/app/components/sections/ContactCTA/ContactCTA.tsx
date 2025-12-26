'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const ContactCTA = () => {
  const t = useTranslations('ContactCTA');
  const params = useParams();
  const lang = params.lang as string;

  return (
    <section id="contact" className="section-spacing">
      <div className="container-main">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border-2 border-primary/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative z-10 py-20 px-6 md:py-32 md:px-12 text-center">
            {/* Icon */}
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <MessageCircle className="w-10 h-10 text-primary" />
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {t('title')}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {t('subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button asChild size="lg" className="group min-w-[200px]">
                <Link href={`/${lang}/contact`}>
                  {t('primaryButton')}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="group min-w-[200px]">
                <Link href="mailto:semoca00@gmail.com">
                  <Mail className="mr-2 w-4 h-4" />
                  {t('secondaryButton')}
                </Link>
              </Button>
            </motion.div>

            {/* Quick info */}
            <motion.p
              className="mt-8 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {t('responseTime')}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA;
