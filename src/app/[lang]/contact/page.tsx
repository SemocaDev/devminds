'use client';

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Mail,
  Clock,
  Send,
  Github,
  Linkedin,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import contactConfig from "@/config/contact.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer/Footer";
import SocialSidebar from "@/app/components/layout/SocialSidebar";
import EmailSidebar from "@/app/components/layout/EmailSidebar";

// Tipos para el estado del formulario
type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const t = useTranslations("ContactPage");
  const locale = useLocale(); // Obtener idioma actual (es, en, ja)

  // Estado del formulario
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [submitMessage, setSubmitMessage] = useState<string>('');

  /**
   * Valida el formulario
   */
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.message.trim()) {
      errors.message = "Message is required";
    } else if (formData.message.length > 5000) {
      errors.message = "Message is too long (max 5000 characters)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Maneja el cambio en los inputs
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario escribe
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar
    if (!validateForm()) {
      return;
    }

    // Enviar
    setFormStatus('loading');
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          locale // Incluir idioma actual
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormStatus('success');
        setSubmitMessage("Message sent successfully! We'll get back to you soon.");
        // Limpiar formulario
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setFormStatus('error');
        setSubmitMessage(data.error || "Failed to send message. Please try again.");
      }
    } catch (error) {
      setFormStatus('error');
      setSubmitMessage("Failed to send message. Please try again.");
      console.error('Contact form error:', error);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: t("contactInfo.email.title"),
      description: contactConfig.email,
      href: `mailto:${contactConfig.email}`,
      color: "text-blue-500"
    },
    {
      icon: MessageCircle,
      title: t("contactInfo.whatsapp.title"),
      description: contactConfig.phone,
      href: `https://wa.me/${contactConfig.phone.replace(/\+/g, '')}?text=${encodeURIComponent(t("contactInfo.whatsapp.defaultMessage"))}`,
      color: "text-green-500"
    },
    {
      icon: Clock,
      title: t("contactInfo.responseTime.title"),
      description: t("contactInfo.responseTime.description"),
      color: "text-amber-500"
    },
    {
      icon: Github,
      title: t("contactInfo.github.title"),
      description: "@SemocaDev",
      href: contactConfig.socials.github,
      color: "text-purple-500"
    },
    {
      icon: Linkedin,
      title: t("contactInfo.linkedin.title"),
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
                {t("hero.title")}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                {t("hero.subtitle")}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 bg-background">
          <div className="container-main">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-4">
                    {t("form.title")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("form.subtitle")}
                  </p>
                </div>

                <Card className="border-2">
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name Field */}
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          {t("form.name")} <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={t("form.namePlaceholder")}
                          className={`h-12 ${formErrors.name ? 'border-destructive' : ''}`}
                          disabled={formStatus === 'loading'}
                          required
                        />
                        {formErrors.name && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {formErrors.name}
                          </p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          {t("form.email")} <span className="text-destructive">*</span>
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t("form.emailPlaceholder")}
                          className={`h-12 ${formErrors.email ? 'border-destructive' : ''}`}
                          disabled={formStatus === 'loading'}
                          required
                        />
                        {formErrors.email && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {formErrors.email}
                          </p>
                        )}
                      </div>

                      {/* Subject Field */}
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          {t("form.subject")}
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder={t("form.subjectPlaceholder")}
                          className="h-12"
                          disabled={formStatus === 'loading'}
                        />
                      </div>

                      {/* Message Field */}
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          {t("form.message")} <span className="text-destructive">*</span>
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={6}
                          placeholder={t("form.messagePlaceholder")}
                          className={`resize-none ${formErrors.message ? 'border-destructive' : ''}`}
                          disabled={formStatus === 'loading'}
                          required
                        />
                        {formErrors.message && (
                          <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {formErrors.message}
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full group"
                        disabled={formStatus === 'loading'}
                      >
                        {formStatus === 'loading' ? (
                          <>
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            {t("form.submit")}
                          </>
                        )}
                      </Button>

                      {/* Status Messages */}
                      {submitMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-4 rounded-lg flex items-center gap-2 ${
                            formStatus === 'success'
                              ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800'
                              : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800'
                          }`}
                        >
                          {formStatus === 'success' ? (
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                          ) : (
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          )}
                          <p className="text-sm font-medium">{submitMessage}</p>
                        </motion.div>
                      )}

                      <p className="text-xs text-muted-foreground text-center">
                        {t("form.privacy")}
                      </p>
                    </form>
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
                    {t("contactInfo.title")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("contactInfo.subtitle")}
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

                {/* Additional CTA */}
                <motion.div
                  className="mt-8 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h3 className="text-xl font-bold mb-2">
                    {t("quickContact.title")}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t("quickContact.description")}
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="mailto:semoca00@gmail.com">
                      <Mail className="mr-2 w-4 h-4" />
                      {t("quickContact.button")}
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
