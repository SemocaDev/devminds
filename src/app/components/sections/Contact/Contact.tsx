'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Mail, Clock, Send } from 'lucide-react';

const Contact = () => {
  const t = useTranslations('Contact');

  return (
    <section id="contact" className="section-spacing">
      <div className="container-main">
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="numbered-section section-title justify-center" data-number="04">
            {t('title')}
          </h2>
          <p className="subtitle max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-2">
              <CardContent className="pt-6">
                <form className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('form.name')}
                    </label>
                    <Input
                      type="text"
                      placeholder={t('form.namePlaceholder')}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('form.email')}
                    </label>
                    <Input
                      type="email"
                      placeholder={t('form.emailPlaceholder')}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('form.message')}
                    </label>
                    <Textarea
                      rows={5}
                      placeholder={t('form.messagePlaceholder')}
                      className="resize-none"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full group">
                    <Send className="mr-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    {t('form.submit')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info de contacto */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-2 hover:border-primary/50 transition-colors group">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {t('info.responseTime.title')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('info.responseTime.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors group">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {t('info.email.title')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('info.email.description')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="pt-6">
              <Button variant="outline" size="lg" className="w-full">
                {t('detailedContact')}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
