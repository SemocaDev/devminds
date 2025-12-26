'use client';

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import {
  Code2,
  Palette,
  Wrench,
  Users,
  ArrowRight,
  CheckCircle2,
  Cloud
} from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiPostgresql,
  SiMongodb,
  SiTailwindcss,
  SiDocker,
  SiGit,
  SiFigma,
  SiWordpress,
  SiVercel,
  SiExpress,
  SiPhp,
  SiPostman
} from "react-icons/si";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer/Footer";
import SocialSidebar from "@/app/components/layout/SocialSidebar";
import EmailSidebar from "@/app/components/layout/EmailSidebar";

const services = [
  {
    key: "webdev",
    icon: Code2,
    color: "text-blue-500",
  },
  {
    key: "custom",
    icon: Wrench,
    color: "text-purple-500",
  },
  {
    key: "wordpress",
    icon: Palette,
    color: "text-green-500",
  },
  {
    key: "consulting",
    icon: Users,
    color: "text-orange-500",
  },
];

const techStack = {
  frontend: [
    { icon: SiReact, name: "React", color: "#61DAFB" },
    { icon: SiNextdotjs, name: "Next.js", color: "#000000" },
    { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
    { icon: SiTailwindcss, name: "Tailwind CSS", color: "#06B6D4" },
  ],
  backend: [
    { icon: SiNodedotjs, name: "Node.js", color: "#339933" },
    { icon: SiExpress, name: "Express", color: "#000000" },
    { icon: SiPostgresql, name: "PostgreSQL", color: "#4169E1" },
    { icon: SiMongodb, name: "MongoDB", color: "#47A248" },
  ],
  cms: [
    { icon: SiWordpress, name: "WordPress", color: "#21759B" },
    { icon: SiPhp, name: "PHP", color: "#777BB4" },
  ],
  devops: [
    { icon: SiGit, name: "Git", color: "#F05032" },
    { icon: SiDocker, name: "Docker", color: "#2496ED" },
    { icon: Cloud, name: "Cloud", color: "#3B82F6" },
    { icon: SiVercel, name: "Vercel", color: "#000000" },
  ],
  tools: [
    { icon: SiFigma, name: "Figma", color: "#F24E1E" },
    { icon: SiPostman, name: "Postman", color: "#FF6C37" },
  ],
};

export default function ServicesPage() {
  const t = useTranslations("ServicesPage");
  const params = useParams();
  const lang = params.lang as string;

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
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {t("hero.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid with Accordion */}
      <section className="py-20 bg-background">
        <div className="container-main">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
          >
            {t("services.title")}
          </motion.h2>

          <Accordion type="single" collapsible className="space-y-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <AccordionItem
                    value={service.key}
                    className="border rounded-lg px-6 bg-card hover:shadow-lg transition-shadow"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-4">
                        <div className={`${service.color}`}>
                          <Icon className="w-8 h-8" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-xl font-bold">
                            {t(`services.items.${service.key}.title`)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t(`services.items.${service.key}.shortDescription`)}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          {t(`services.items.${service.key}.description`)}
                        </p>

                        {/* Technologies */}
                        <div>
                          <h4 className="font-semibold mb-2">
                            {t("services.technologies")}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {t(`services.items.${service.key}.technologies`)}
                          </p>
                        </div>

                        {/* Ideal for */}
                        <div>
                          <h4 className="font-semibold mb-2">
                            {t("services.idealFor")}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {t(`services.items.${service.key}.idealFor`)}
                          </p>
                        </div>

                        {/* Features */}
                        <div>
                          <h4 className="font-semibold mb-2">
                            {t("services.features")}
                          </h4>
                          <ul className="space-y-2">
                            {(t.raw(`services.items.${service.key}.features`) as string[]).map(
                              (feature, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  <span className="text-muted-foreground">{feature}</span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </Accordion>
        </div>
      </section>

      {/* Tech Stack Complete */}
      <section className="py-20 bg-muted/50">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("techStack.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("techStack.subtitle")}
            </p>
          </motion.div>

          {/* Tech Categories */}
          <div className="space-y-16">
            {Object.entries(techStack).map(([category, techs], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-1 w-12 bg-primary rounded-full" />
                  <h3 className="text-2xl font-bold capitalize">
                    {t(`techStack.categories.${category}`)}
                  </h3>
                  <div className="h-1 flex-1 bg-border rounded-full" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {techs.map((tech, techIndex) => {
                    const TechIcon = tech.icon;
                    return (
                      <motion.div
                        key={tech.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: techIndex * 0.05 }}
                        className="group relative"
                      >
                        <div className="relative h-full p-6 rounded-xl bg-card border-2 border-border hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                          {/* Icon */}
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-300">
                              <TechIcon
                                className="w-full h-full transition-all duration-300 group-hover:scale-110"
                                style={{ color: "currentColor" }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = tech.color;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color = "currentColor";
                                }}
                              />
                            </div>

                            {/* Name */}
                            <div className="text-center">
                              <span className="text-sm font-semibold group-hover:text-primary transition-colors">
                                {tech.name}
                              </span>
                            </div>
                          </div>

                          {/* Decorative corner accent */}
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t("cta.title")}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {t("cta.subtitle")}
            </p>
            <Link
              href={`/${lang}/contact`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              {t("cta.button")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
      </div>

      <Footer />
    </>
  );
}
