'use client';

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Mail,
  Clock,
  Send,
  Github,
  Linkedin,
  MessageCircle,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer/Footer";
import SocialSidebar from "@/app/components/layout/SocialSidebar";
import EmailSidebar from "@/app/components/layout/EmailSidebar";

import { contactMessageSchema, type ContactFormData } from "@/core/domain/contact/schemas/contactMessageSchema";
import contactConfig from "@/config/contact.json";

const DRAFT_KEY = 'devminds_contact_draft';

type ButtonStatus = 'idle' | 'loading' | 'success' | 'error';

export default function ContactPage() {
  const t = useTranslations("ContactForm");
  const tPage = useTranslations("ContactPage");
  const locale = useLocale();

  const [buttonStatus, setButtonStatus] = useState<ButtonStatus>('idle');
  const [messageLength, setMessageLength] = useState(0);
  const hasMountedRef = useRef(false);

  // React Hook Form con Zod resolver
  const form = useForm<ContactFormData>({
    resolver: async (values, context, options) => {
      // Resolver con zodResolver
      const result = await zodResolver(contactMessageSchema)(values, context, options);

      // Traducir los mensajes de error
      if (result.errors) {
        Object.keys(result.errors).forEach((key) => {
          const error = result.errors[key as keyof typeof result.errors];
          if (error && error.message) {
            // Traducir el código de error
            const translationKey = `validation.${error.message}` as any;
            const translated = t(translationKey);

            // Actualizar el mensaje con la traducción
            error.message = translated;
          }
        });
      }

      return result;
    },
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      website: '', // honeypot
    },
  });

  // Watch para contador de caracteres
  const messageValue = form.watch('message');
  useEffect(() => {
    setMessageLength(messageValue?.length || 0);
  }, [messageValue]);

  // localStorage draft con debounce (1 segundo)
  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values.name || values.email || values.message) {
        const timeoutId = setTimeout(() => {
          localStorage.setItem(DRAFT_KEY, JSON.stringify({
            name: values.name,
            email: values.email,
            subject: values.subject,
            message: values.message,
            savedAt: new Date().toISOString()
          }));
        }, 1000);
        return () => clearTimeout(timeoutId);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Recuperar draft al montar componente
  useEffect(() => {
    // Prevenir duplicados en React StrictMode
    if (hasMountedRef.current) return;
    hasMountedRef.current = true;

    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const draftData = JSON.parse(draft);

        toast(t('draft.recoveryMessage'), {
          duration: 10000,
          action: {
            label: t('draft.recover'),
            onClick: () => {
              form.reset(draftData);
              toast.dismiss();
            },
          },
          cancel: {
            label: t('draft.dismiss'),
            onClick: () => {
              localStorage.removeItem(DRAFT_KEY);
              toast.dismiss();
            },
          },
        });
      } catch (error) {
        console.error('Error parsing draft:', error);
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }, [form, t]);

  // Submit handler
  const onSubmit = async (data: ContactFormData) => {
    setButtonStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          locale
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Éxito
        setButtonStatus('success');

        toast.success(t('toast.success.title'), {
          description: t('toast.success.description'),
          duration: 5000,
        });

        // Limpiar formulario y draft
        form.reset();
        localStorage.removeItem(DRAFT_KEY);

        // Scroll suave al top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Volver a idle después de 2 segundos
        setTimeout(() => setButtonStatus('idle'), 2000);

      } else {
        // Error
        setButtonStatus('error');
        const errorCode = result.errorCode || 'UNKNOWN';

        switch (errorCode) {
          case 'RATE_LIMIT_EXCEEDED':
            toast.error(t('toast.error.rateLimit.title'), {
              description: t('toast.error.rateLimit.description', {
                seconds: result.retryAfter || 60
              }),
              duration: 8000,
            });
            break;

          case 'VALIDATION_ERROR':
            toast.error(t('toast.error.validation.title'), {
              description: t('toast.error.validation.description'),
              duration: 5000,
            });
            break;

          default:
            toast.error(t('toast.error.server.title'), {
              description: t('toast.error.server.description'),
              duration: 5000,
            });
        }

        setTimeout(() => setButtonStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setButtonStatus('error');

      toast.error(t('toast.error.network.title'), {
        description: t('toast.error.network.description'),
        duration: 5000,
      });

      setTimeout(() => setButtonStatus('idle'), 3000);
    }
  };

  // Info de contacto
  const contactInfo = [
    {
      icon: Mail,
      title: tPage("contactInfo.email.title"),
      description: contactConfig.email,
      href: `mailto:${contactConfig.email}`,
    },
    {
      icon: MessageCircle,
      title: tPage("contactInfo.whatsapp.title"),
      description: contactConfig.phone,
      href: `https://wa.me/${contactConfig.phone.replace(/\+/g, '')}?text=${encodeURIComponent(tPage("contactInfo.whatsapp.defaultMessage"))}`,
    },
    {
      icon: Clock,
      title: tPage("contactInfo.responseTime.title"),
      description: tPage("contactInfo.responseTime.description"),
    },
    {
      icon: Github,
      title: tPage("contactInfo.github.title"),
      description: "@SemocaDev",
      href: contactConfig.socials.github,
    },
    {
      icon: Linkedin,
      title: tPage("contactInfo.linkedin.title"),
      description: "Sebastian Morea",
      href: contactConfig.socials.linkedin,
    }
  ];

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <EmailSidebar />

      <div className="min-h-screen flex flex-col">
        {/* Hero */}
        <section className="section-spacing bg-background">
          <div className="container-main">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-16 max-w-2xl"
            >
              <p className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary tracking-[0.2em] uppercase mb-4">
                <span className="w-6 h-px bg-primary" />
                Contacto
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4">
                {tPage("hero.title")}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-[55ch]">
                {tPage("hero.subtitle")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="pb-20 bg-background">
          <div className="container-main">
            <div className="grid lg:grid-cols-2 gap-12 max-w-5xl">

              {/* FORMULARIO */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-display font-bold mb-2">
                    {tPage("form.title")}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {tPage("form.subtitle")}
                  </p>
                </div>

                <Card className="border border-border/50">
                  <CardContent className="pt-6">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Leyenda de campos requeridos */}
                        <p className="text-sm text-muted-foreground -mt-2">
                          {t('requiredFieldsLegend')}
                        </p>

                        {/* Name Field */}
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('labels.name')} <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('placeholders.name')}
                                  className={`h-12 transition-colors ${
                                    form.formState.errors.name
                                      ? 'border-destructive focus-visible:ring-destructive'
                                      : field.value && !form.formState.errors.name
                                      ? 'border-green-500 focus-visible:ring-green-500'
                                      : ''
                                  }`}
                                  disabled={buttonStatus === 'loading'}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Email Field */}
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('labels.email')} <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder={t('placeholders.email')}
                                  className={`h-12 transition-colors ${
                                    form.formState.errors.email
                                      ? 'border-destructive focus-visible:ring-destructive'
                                      : field.value && !form.formState.errors.email
                                      ? 'border-green-500 focus-visible:ring-green-500'
                                      : ''
                                  }`}
                                  disabled={buttonStatus === 'loading'}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Subject Field */}
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {t('labels.subjectOptional')}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t('placeholders.subject')}
                                  className="h-12"
                                  disabled={buttonStatus === 'loading'}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Message Field con Contador */}
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex justify-between items-center">
                                <FormLabel>
                                  {t('labels.message')} <span className="text-destructive">*</span>
                                </FormLabel>
                                <span className={`text-xs font-mono transition-colors px-2 py-1 rounded pattern-dots-dense ${
                                  messageLength > 5000
                                    ? 'text-red-600 font-semibold bg-red-50 dark:bg-red-950'
                                    : messageLength > 4500
                                    ? 'text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950'
                                    : 'text-muted-foreground bg-muted/50'
                                }`}>
                                  {t('characterCount.current', {
                                    current: messageLength,
                                    max: 5000
                                  })}
                                </span>
                              </div>
                              <FormControl>
                                <Textarea
                                  rows={6}
                                  placeholder={t('placeholders.message')}
                                  className={`resize-none transition-colors ${
                                    form.formState.errors.message
                                      ? 'border-destructive focus-visible:ring-destructive'
                                      : field.value && !form.formState.errors.message
                                      ? 'border-green-500 focus-visible:ring-green-500'
                                      : ''
                                  }`}
                                  disabled={buttonStatus === 'loading'}
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Honeypot Field (invisible) */}
                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem className="absolute left-[-9999px] opacity-0 pointer-events-none">
                              <FormControl>
                                <Input
                                  type="text"
                                  tabIndex={-1}
                                  autoComplete="off"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {/* Submit Button con Estados */}
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full group"
                          disabled={buttonStatus === 'loading'}
                        >
                          {buttonStatus === 'loading' && (
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          )}
                          {buttonStatus === 'success' && (
                            <CheckCircle2 className="mr-2 w-4 h-4" />
                          )}
                          {buttonStatus === 'error' && (
                            <AlertCircle className="mr-2 w-4 h-4" />
                          )}
                          {buttonStatus === 'idle' && (
                            <Send className="mr-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          )}
                          {t(`button.${buttonStatus}`)}
                        </Button>

                        {/* Privacy Notice */}
                        <p className="text-xs text-muted-foreground text-center">
                          {tPage("form.privacy")}
                        </p>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Info de contacto */}
              <motion.div
                className="space-y-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-display font-bold mb-2">
                    {tPage("contactInfo.title")}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {tPage("contactInfo.subtitle")}
                  </p>
                </div>

                <div className="space-y-2">
                  {contactInfo.map((item) => {
                    const Icon = item.icon;
                    const isLink = !!item.href;

                    const content = (
                      <div className={`flex items-start gap-4 p-4 rounded-xl border border-border/50 transition-colors duration-200 ${isLink ? 'hover:border-foreground/30 cursor-pointer group' : ''}`}>
                        <div className="w-8 h-8 rounded-lg border border-border/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 text-foreground/60" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-0.5">{item.title}</p>
                          <p className={`text-sm ${isLink ? 'text-muted-foreground group-hover:text-foreground transition-colors' : 'text-muted-foreground'}`}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );

                    return isLink ? (
                      <Link key={item.title} href={item.href!} target="_blank" rel="noopener noreferrer">
                        {content}
                      </Link>
                    ) : (
                      <div key={item.title}>{content}</div>
                    );
                  })}
                </div>
              </motion.div>

            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
