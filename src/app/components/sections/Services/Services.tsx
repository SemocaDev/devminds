'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Code2, Laptop, Search, Wrench, ArrowRight } from 'lucide-react';

const Services = () => {
  const t = useTranslations('Services');

  const services = [
    { key: 'web', icon: Laptop, gradient: 'from-blue-500 to-cyan-500' },
    { key: 'software', icon: Code2, gradient: 'from-purple-500 to-pink-500' },
    { key: 'consulting', icon: Search, gradient: 'from-orange-500 to-yellow-500' },
    { key: 'support', icon: Wrench, gradient: 'from-green-500 to-emerald-500' }
  ];

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
    <section id="services" className="section-spacing gradient-bg">
      <div className="container-main">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="numbered-section section-title justify-center" data-number="02">
            {t('title')}
          </h2>
          <p className="subtitle max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.key} variants={item}>
                <Card className="relative group h-full hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 hover:border-primary/50">
                  {/* Gradiente de fondo al hacer hover */}
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500 from-primary to-accent" />

                  <CardHeader className="relative">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {t(`${service.key}.title`)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <CardDescription className="text-sm leading-relaxed">
                      {t(`${service.key}.description`)}
                    </CardDescription>
                  </CardContent>

                  {/* Indicador de hover */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Button size="lg" className="group">
            {t('ctaButton')}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
