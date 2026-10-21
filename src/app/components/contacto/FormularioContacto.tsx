"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { contactMessageSchema, type ContactFormData } from "@/core/domain/contact/schemas/contactMessageSchema";

const DRAFT_KEY = 'devminds_contact_draft';

type ButtonStatus = 'idle' | 'loading' | 'success' | 'error';

/** Formulario de contacto: validación con zod, borrador en localStorage, honeypot y envío a /api/contact. */
export default function FormularioContacto() {
  const t = useTranslations("ContactForm");
  const tPagina = useTranslations("Contacto");
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
            const translationKey = `validation.${error.message}`;
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

  return (
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
                      ? 'border-foreground/40'
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
                      ? 'border-foreground/40'
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
                <span className={`text-xs font-mono transition-colors px-2 py-1 rounded ${
                  messageLength > 5000
                    ? 'text-destructive font-semibold bg-destructive/10'
                    : messageLength > 4500
                    ? 'text-primary font-semibold bg-accent-tint'
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
                      ? 'border-foreground/40'
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
          className="w-full group bg-carbon text-nieve hover:bg-carbon/85"
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
          {tPagina("formulario.privacidad")}
        </p>
      </form>
    </Form>
  );
}
