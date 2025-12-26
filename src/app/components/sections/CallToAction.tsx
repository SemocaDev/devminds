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
    <section className="section-spacing relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Card principal con diseño profesional */}
          <Card className="relative overflow-hidden border-2 border-primary/20 bg-card/80 backdrop-blur-xl shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl" />

            <div className="relative z-10 p-8 md:p-12 lg:p-16">
              <div className="grid lg:grid-cols-[1.2fr,1fr] gap-12 items-center">

                {/* Contenido principal */}
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-semibold text-primary">{t('status')}</span>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                      {t('title')}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      {t('description')}
                    </p>
                  </div>

                  {/* Features con diseño mejorado */}
                  <div className="grid gap-4 pt-4">
                    {features.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 hover:shadow-md transition-all"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent p-2.5 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-full h-full text-white" />
                          </div>
                          <span className="text-foreground font-semibold pt-2">{feature.text}</span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* CTA Button mejorado */}
                  <div className="pt-6 flex flex-col sm:flex-row gap-4">
                    <Button asChild size="lg" className="group text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl">
                      <Link href={`/${lang}/contact`}>
                        {t('buttonText')}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground px-4">
                      <Clock className="w-4 h-4" />
                      <span>{t('responseTime')}</span>
                    </div>
                  </div>
                </div>

                {/* Stats visuales profesionales */}
                <div className="space-y-6 lg:pl-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                  >
                    {/* Stat 1 */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
                      <div className="text-4xl font-bold text-blue-600 mb-2">24h</div>
                      <div className="text-sm font-medium text-muted-foreground">Tiempo de respuesta</div>
                    </div>

                    {/* Stat 2 */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
                      <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                      <div className="text-sm font-medium text-muted-foreground">Proyectos completados</div>
                    </div>

                    {/* Stat 3 */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20">
                      <div className="text-4xl font-bold text-purple-600 mb-2">5★</div>
                      <div className="text-sm font-medium text-muted-foreground">Calidad garantizada</div>
                    </div>
                  </motion.div>
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