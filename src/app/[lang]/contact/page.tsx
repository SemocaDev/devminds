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
      color: "text-blue-500"
    },
    {
      icon: MessageCircle,
      title: tPage("contactInfo.whatsapp.title"),
      description: contactConfig.phone,
      href: `https://wa.me/${contactConfig.phone.replace(/\+/g, '')}?text=${encodeURIComponent(tPage("contactInfo.whatsapp.defaultMessage"))}`,
      color: "text-green-500"
    },
    {
      icon: Clock,
      title: tPage("contactInfo.responseTime.title"),
      description: tPage("contactInfo.responseTime.description"),
      color: "text-amber-500"
    },
    {
      icon: Github,
      title: tPage("contactInfo.github.title"),
      description: "@SemocaDev",
      href: contactConfig.socials.github,
      color: "text-purple-500"
    },
    {
      icon: Linkedin,
      title: tPage("contactInfo.linkedin.title"),
      description: "Sebastian Morea",
      href: contactConfig.socials.linkedin,
      color: "text-blue-600"
    }
  ];

  return (
    <>
      <Navbar />
      <SocialSidebar />
      <EmailSidebar />

      <div className="min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-primary/5 overflow-hidden">
          <div className="container-main relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                {tPage("hero.title")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                {tPage("hero.subtitle")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 bg-background">
          <div className="container-main">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

              {/* FORMULARIO CON REACT HOOK FORM */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    {tPage("form.title")}
                  </h2>
                  <p className="text-muted-foreground">
                    {tPage("form.subtitle")}
                  </p>
                </div>

                <Card className="border-2">
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

              {/* Contact Info */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    {tPage("contactInfo.title")}
                  </h2>
                  <p className="text-muted-foreground">
                    {tPage("contactInfo.subtitle")}
                  </p>
                </div>

                <div className="space-y-4">
                  {contactInfo.map((item, index) => {
                    const Icon = item.icon;
                    const isLink = !!item.href;

                    const content = (
                      <Card className={`border-2 transition-all duration-300 ${isLink ? 'hover:border-primary/50 hover:shadow-lg cursor-pointer' : ''} group`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 ${isLink ? 'group-hover:scale-110' : ''} transition-transform`}>
                              <Icon className={`w-6 h-6 ${item.color}`} />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-1">
                                {item.title}
                              </h3>
                              <p className={`${isLink ? 'text-primary group-hover:underline' : 'text-muted-foreground'}`}>
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );

                    return (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        {isLink ? (
                          <Link href={item.href} target="_blank" rel="noopener noreferrer">
                            {content}
                          </Link>
                        ) : (
                          content
                        )}
                      </motion.div>
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
