'use client';

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Lightbulb,
  Code2,
  Rocket,
  Headphones
} from "lucide-react";

const processSteps = [
  {
    key: "step1",
    icon: MessageSquare,
    number: "01",
  },
  {
    key: "step2",
    icon: Lightbulb,
    number: "02",
  },
  {
    key: "step3",
    icon: Code2,
    number: "03",
  },
  {
    key: "step4",
    icon: Rocket,
    number: "04",
  },
  {
    key: "step5",
    icon: Headphones,
    number: "05",
  },
];

export default function Process() {
  const t = useTranslations("Process");

  return (
    <section id="process" className="py-20 bg-muted/50">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {t("title")}
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* Timeline - Horizontal en desktop, vertical en mobile */}
        <div className="relative">
          {/* Desktop - Horizontal */}
          <div className="hidden md:block">
            {/* Línea conectora */}
            <div className="absolute top-20 left-0 right-0 h-1 bg-border">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 2.5, delay: 0.4 }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-5 gap-8">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.key}
                    className="relative flex flex-col items-center text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.15 }}
                  >
                    {/* Icon Circle */}
                    <div className="relative z-10 w-40 h-40 rounded-full bg-background border-4 border-primary flex flex-col items-center justify-center mb-6 shadow-lg">
                      <Icon className="w-12 h-12 text-primary mb-2" />
                      <span className="text-xs font-bold text-muted-foreground">
                        {step.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="font-bold text-lg mb-2">
                        {t(`${step.key}.title`)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t(`${step.key}.description`)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile - Vertical */}
          <div className="md:hidden">
            {/* Línea conectora vertical */}
            <div className="absolute left-10 top-0 bottom-0 w-1 bg-border">
              <motion.div
                className="w-full bg-primary"
                initial={{ height: "0%" }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 2.5, delay: 0.4 }}
              />
            </div>

            {/* Steps */}
            <div className="space-y-12">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.key}
                    className="relative flex gap-6"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.12 }}
                  >
                    {/* Icon Circle */}
                    <div className="relative z-10 w-20 h-20 rounded-full bg-background border-4 border-primary flex flex-col items-center justify-center flex-shrink-0 shadow-lg">
                      <Icon className="w-8 h-8 text-primary" />
                      <span className="text-xs font-bold text-muted-foreground mt-1">
                        {step.number}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <h3 className="font-bold text-lg mb-2">
                        {t(`${step.key}.title`)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t(`${step.key}.description`)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
