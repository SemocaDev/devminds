'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Cloud } from "lucide-react";

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

const categoryNames: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  cms: "CMS",
  devops: "DevOps",
  tools: "Herramientas"
};

export default function TechStackTestPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container-main max-w-7xl">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Prueba de Diseños - Tech Stack
        </h1>
        <p className="text-center text-muted-foreground mb-16">
          Revisa las 3 opciones y decide cuál prefieres
        </p>

        {/* OPCIÓN 1: Lista horizontal condensada */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 pb-4 border-b-2 border-b-dotted border-b-primary/30">
            Opción 1: Lista Horizontal Condensada
          </h2>
          <p className="text-muted-foreground mb-6">
            Iconos en fila horizontal, compacto, nombre aparece en hover
          </p>

          <div className="space-y-8">
            {Object.entries(techStack).map(([category, techs]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {categoryNames[category]}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {techs.map((tech) => {
                    const Icon = tech.icon;
                    return (
                      <div
                        key={tech.name}
                        className="group relative p-3 rounded-lg bg-card border hover:border-primary transition-all cursor-pointer"
                        title={tech.name}
                      >
                        <Icon
                          className="w-8 h-8 transition-all grayscale group-hover:grayscale-0"
                          style={{ color: "currentColor" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = tech.color;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "currentColor";
                          }}
                        />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          <span className="text-xs font-medium bg-card px-2 py-1 rounded border">
                            {tech.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OPCIÓN 2: Grid de badges */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 pb-4 border-b-2 border-b-dotted border-b-primary/30">
            Opción 2: Grid de Badges Compacto
          </h2>
          <p className="text-muted-foreground mb-6">
            Badges con icono + nombre, muy compacto y limpio
          </p>

          <div className="space-y-8">
            {Object.entries(techStack).map(([category, techs]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {categoryNames[category]}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {techs.map((tech) => {
                    const Icon = tech.icon;
                    return (
                      <Badge
                        key={tech.name}
                        variant="outline"
                        className="px-3 py-2 text-sm gap-2 hover:bg-primary/10 hover:border-primary transition-all cursor-pointer group"
                      >
                        <Icon
                          className="w-4 h-4 transition-all grayscale group-hover:grayscale-0"
                          style={{ color: "currentColor" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = tech.color;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = "currentColor";
                          }}
                        />
                        <span>{tech.name}</span>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OPCIÓN 3: Accordion collapsible */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 pb-4 border-b-2 border-b-dotted border-b-primary/30">
            Opción 3: Accordion Collapsible
          </h2>
          <p className="text-muted-foreground mb-6">
            Categorías colapsadas, el usuario expande solo lo que le interesa
          </p>

          <Accordion type="single" collapsible className="space-y-3">
            {Object.entries(techStack).map(([category, techs]) => (
              <AccordionItem
                key={category}
                value={category}
                className="border-l-4 border-l-dotted border-l-primary/30 border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-lg font-semibold">{categoryNames[category]}</span>
                    <Badge variant="secondary" className="ml-2">
                      {techs.length}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="flex flex-wrap gap-3">
                    {techs.map((tech) => {
                      const Icon = tech.icon;
                      return (
                        <div
                          key={tech.name}
                          className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-background border hover:border-primary transition-all cursor-pointer"
                        >
                          <Icon
                            className="w-5 h-5 transition-all grayscale group-hover:grayscale-0"
                            style={{ color: "currentColor" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.color = tech.color;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.color = "currentColor";
                            }}
                          />
                          <span className="text-sm font-medium">{tech.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <div className="text-center mt-16 p-6 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">
            Esta página es temporal. Elige la opción que más te guste y la aplicaremos en la página de servicios.
          </p>
        </div>
      </div>
    </div>
  );
}
