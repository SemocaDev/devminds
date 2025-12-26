'use client';

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Mail,
  Clock,
  Send,
  MapPin,
  Phone,
  Github,
  Linkedin,
  MessageCircle
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

export default function ContactPage() {
  const t = useTranslations("ContactPage");

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
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {t("form.name")} <span className="text-destructive">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder={t("form.namePlaceholder")}
                          className="h-12"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {t("form.email")} <span className="text-destructive">*</span>
                        </label>
                        <Input
                          type="email"
                          placeholder={t("form.emailPlaceholder")}
                          className="h-12"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {t("form.subject")}
                        </label>
                        <Input
                          type="text"
                          placeholder={t("form.subjectPlaceholder")}
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {t("form.message")} <span className="text-destructive">*</span>
                        </label>
                        <Textarea
                          rows={6}
                          placeholder={t("form.messagePlaceholder")}
                          className="resize-none"
                          required
                        />
                      </div>

                      <Button type="submit" size="lg" className="w-full group">
                        <Send className="mr-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        {t("form.submit")}
                      </Button>

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
