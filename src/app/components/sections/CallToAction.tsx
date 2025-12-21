'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Check, Clock, Code, Zap } from 'lucide-react';

const CallToAction = () => {
  const features = [
    { icon: Code, text: 'Arquitectura optimizada' },
    { icon: Zap, text: 'Código limpio y escalable' },
    { icon: Check, text: 'Sin deuda técnica' }
  ];

  return (
    <section className="section-spacing relative overflow-hidden">
      <div className="container-main">
        {/* Grid de 2 columnas */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">

          {/* Columna izquierda: Contenido */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-medium text-primary">Ready for deployment</span>
            </div>

            <h2 className="section-title">
              ¿Listo para optimizar tu proyecto?
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Transformamos ideas en soluciones digitales eficientes. Sin complejidad innecesaria,
              solo resultados que funcionan.
            </p>

            {/* Features list */}
            <div className="space-y-3 pt-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">{feature.text}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <Button size="lg" className="group text-lg px-8 py-6 h-auto">
                INICIAR CONSULTA
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Respuesta garantizada en {'<'} 24 horas
              </p>
            </div>
          </motion.div>

          {/* Columna derecha: Visual / Card decorativa */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Card className="p-8 border-2 border-primary/20 bg-card/50 backdrop-blur relative overflow-hidden">
              {/* Efecto de código */}
              <div className="font-mono text-sm space-y-2">
                <div className="text-muted-foreground">
                  <span className="text-accent">const</span>{' '}
                  <span className="text-primary">project</span> = {'{'}
                </div>
                <div className="text-muted-foreground pl-4">
                  status: <span className="text-green-500">"ready"</span>,
                </div>
                <div className="text-muted-foreground pl-4">
                  quality: <span className="text-green-500">"optimized"</span>,
                </div>
                <div className="text-muted-foreground pl-4">
                  deployment: <span className="text-green-500">"automated"</span>
                </div>
                <div className="text-muted-foreground">{'};'}</div>
              </div>

              {/* Status indicator */}
              <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-semibold text-green-500">Online & Ready</span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -z-10" />
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Background decorative */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </div>
    </section>
  );
};

export default CallToAction;