'use client';

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
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
  SiExpress
} from "react-icons/si";

const technologies = [
  { icon: SiReact, name: "React", color: "#61DAFB" },
  { icon: SiNextdotjs, name: "Next.js", color: "#000000" },
  { icon: SiTypescript, name: "TypeScript", color: "#3178C6" },
  { icon: SiNodedotjs, name: "Node.js", color: "#339933" },
  { icon: SiPostgresql, name: "PostgreSQL", color: "#4169E1" },
  { icon: SiMongodb, name: "MongoDB", color: "#47A248" },
  { icon: SiTailwindcss, name: "Tailwind CSS", color: "#06B6D4" },
  { icon: SiDocker, name: "Docker", color: "#2496ED" },
  { icon: SiGit, name: "Git", color: "#F05032" },
  { icon: SiFigma, name: "Figma", color: "#F24E1E" },
  { icon: SiWordpress, name: "WordPress", color: "#21759B" },
  { icon: SiVercel, name: "Vercel", color: "#000000" },
  { icon: SiExpress, name: "Express", color: "#000000" },
];

// Duplicar para efecto infinito
const duplicatedTechs = [...technologies, ...technologies];

export default function TechStack() {
  const t = useTranslations("TechStack");

  return (
    <section id="techstack" className="section-spacing bg-background relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background pointer-events-none" />

      {/* CSS para animación infinita suave */}
      <style jsx>{`
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-scroll-left {
          animation: scroll-left 40s linear infinite;
        }

        .animate-scroll-right {
          animation: scroll-right 40s linear infinite;
        }

        .tech-marquee:hover .animate-scroll-left,
        .tech-marquee:hover .animate-scroll-right {
          animation-play-state: paused;
        }
      `}</style>

      <div className="container-main relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="numbered-section section-title justify-center" data-number="03">
            {t("title")}
          </h2>
          <p className="subtitle max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </motion.div>
      </div>

      {/* Marquee fuera del container para full width */}
      <div className="relative w-full overflow-hidden mt-8">
        {/* Primera fila - Izquierda a Derecha */}
        <div className="mb-8 tech-marquee">
          <div className="flex gap-12 md:gap-16 animate-scroll-left">
            {duplicatedTechs.map((tech, index) => (
              <div
                key={`tech-1-${index}`}
                className="flex-shrink-0 flex flex-col items-center gap-3 group/tech"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-all duration-300 grayscale group-hover/tech:grayscale-0">
                  <tech.icon
                    className="w-full h-full transition-colors duration-300"
                    style={{
                      color: "currentColor",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = tech.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "currentColor";
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover/tech:text-foreground transition-colors">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Segunda fila - Derecha a Izquierda */}
        <div className="tech-marquee">
          <div className="flex gap-12 md:gap-16 animate-scroll-right">
            {[...duplicatedTechs].reverse().map((tech, index) => (
              <div
                key={`tech-2-${index}`}
                className="flex-shrink-0 flex flex-col items-center gap-3 group/tech"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-all duration-300 grayscale group-hover/tech:grayscale-0">
                  <tech.icon
                    className="w-full h-full transition-colors duration-300"
                    style={{
                      color: "currentColor",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = tech.color;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "currentColor";
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover/tech:text-foreground transition-colors">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Overlays para efecto fade en los bordes */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
}
