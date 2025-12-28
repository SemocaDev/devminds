'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Check, Clock, Code, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const CallToAction = () => {
  const t = useTranslations('CTA');
  const params = useParams();
  const lang = params.lang as string;

  const features = [
    { icon: Code, text: t('feature1') },
    { icon: Zap, text: t('feature2') },
    { icon: Check, text: t('feature3') }
  ];

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-muted/50">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          {/* Card principal con diseño profesional y compacto */}
          <Card className="relative overflow-hidden border-2 border-primary/20 bg-card shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/5 to-transparent rounded-full" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/5 to-transparent rounded-full" />

            {/* Elementos decorativos pequeños con patrones */}
            <div className="absolute top-8 right-8 w-20 h-20 pattern-dots-sparse opacity-95 pointer-events-none" />
            <div className="absolute bottom-8 left-8 w-24 h-24 pattern-lines-grid opacity-95 pointer-events-none" />

            <div className="relative z-10 p-6 md:p-10 lg:p-12">
              <div className="grid lg:grid-cols-[1.3fr,0.7fr] gap-8 lg:gap-12 items-center">

                {/* Contenido principal */}
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-xs font-semibold text-primary">{t('status')}</span>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                      {t('title')}
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground">
                      {t('description')}
                    </p>
                  </div>

                  {/* Features en lista compacta */}
                  <div className="grid gap-2.5 pt-2">
                    {features.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/30 transition-all"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent p-2 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-full h-full text-white" />
                          </div>
                          <span className="text-sm font-semibold">{feature.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA Button compacto */}
                  <div className="pt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <Button asChild size="lg" className="group shadow-lg hover:shadow-xl">
                      <Link href={`/${lang}/contact`}>
                        {t('buttonText')}
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{t('responseTime')}</span>
                    </div>
                  </div>
                </div>

                {/* Stats visuales compactos */}
                <div className="space-y-3 lg:pl-4">
                  {/* Stat 1 */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                    <div className="text-3xl font-bold text-blue-600 mb-1">24h</div>
                    <div className="text-xs font-medium text-muted-foreground">Tiempo de respuesta</div>
                  </div>

                  {/* Stat 2 */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
                    <div className="text-3xl font-bold text-green-600 mb-1">100%</div>
                    <div className="text-xs font-medium text-muted-foreground">Proyectos completados</div>
                  </div>

                  {/* Stat 3 */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
                    <div className="text-3xl font-bold text-purple-600 mb-1">5★</div>
                    <div className="text-xs font-medium text-muted-foreground">Calidad garantizada</div>
                  </div>
                </div>

              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;