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
    <section id="contact" className="py-16 md:py-20 lg:py-24 bg-background">
      <div className="container-main">
        <motion.div
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-background/50 to-accent/5 border-2 border-primary/20 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

          <div className="relative z-10 py-12 md:py-16 lg:py-20 px-6 md:px-12">
            <div className="max-w-4xl mx-auto">
              {/* Content Grid - Desktop: horizontal, Mobile: vertical */}
              <div className="grid lg:grid-cols-[1fr,auto] gap-8 lg:gap-12 items-center">

                {/* Left: Text Content */}
                <div className="text-center lg:text-left space-y-6">
                  {/* Icon - Solo móvil */}
                  <motion.div
                    className="inline-flex lg:hidden items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 mx-auto"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </motion.div>

                  {/* Title */}
                  <motion.h2
                    className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {t('title')}
                  </motion.h2>

                  {/* Subtitle */}
                  <motion.p
                    className="text-base md:text-lg text-muted-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    {t('subtitle')}
                  </motion.p>

                  {/* Quick info */}
                  <motion.div
                    className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>{t('responseTime')}</span>
                  </motion.div>
                </div>

                {/* Right: CTA Buttons */}
                <motion.div
                  className="flex flex-col gap-3 lg:gap-4 min-w-[240px]"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Button asChild size="lg" className="group shadow-lg hover:shadow-xl w-full">
                    <Link href={`/${lang}/contact`}>
                      {t('primaryButton')}
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="lg" className="group w-full border-2">
                    <Link href="mailto:semoca00@gmail.com">
                      <Mail className="mr-2 w-4 h-4" />
                      {t('secondaryButton')}
                    </Link>
                  </Button>
                </motion.div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA;
