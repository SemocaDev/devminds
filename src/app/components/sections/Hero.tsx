"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";

const FULL_TEXT = "DevMinds";
const TYPING_SPEED = 90; // ms por carácter — más rápido que el original (150ms)

const Hero = () => {
  const t = useTranslations("Hero");
  const params = useParams();
  const lang = params.lang as string;

  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const titleTextRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Typewriter — escribe directo al DOM (fuera de React state) para no
  // forzar un re-render de la sección completa en cada carácter.
  // rAF con timestamp en vez de setInterval: si el hilo principal está
  // ocupado (hidratación, GSAP) al arrancar, se auto-corrige en vez de
  // acumular ticks atrasados como haría setInterval.
  useEffect(() => {
    let rafId: number;
    let start: number | null = null;
    const START_DELAY = 150; // deja que el gsap.set() inicial termine primero

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start - START_DELAY;
      const i = Math.max(0, Math.min(FULL_TEXT.length, Math.floor(elapsed / TYPING_SPEED) + 1));

      if (elapsed >= 0 && titleTextRef.current) {
        titleTextRef.current.textContent = FULL_TEXT.slice(0, i);
      }

      if (i >= FULL_TEXT.length && elapsed >= 0) {
        cursorRef.current?.remove();
        titleRef.current?.classList.add('hero-title--done');
        return;
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // GSAP entrada para todo menos el título (que hace typewriter)
  useEffect(() => {
    const ctx = gsap.context(() => {
      const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
      gsap.set(
        [labelRef.current, subtitleRef.current, descRef.current, ctaRef.current],
        { opacity: 0, y: 20 }
      );
      gsap.set(titleRef.current, { opacity: 1 });

      gsap.timeline({ delay: 0.1 })
        .to(labelRef.current,    { opacity: 1, y: 0, duration: 0.5, ease })
        .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6, ease }, `+=${FULL_TEXT.length * TYPING_SPEED / 1000 - 0.2}`)
        .to(descRef.current,     { opacity: 1, y: 0, duration: 0.5, ease }, "-=0.35")
        .to(ctaRef.current,      { opacity: 1, y: 0, duration: 0.45, ease }, "-=0.3");
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
    >
      {/* Fondo: grid + glows + partículas */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: "64px 64px",
          }}
        />
        {/* Glows sutiles — monocromático (blur moderado: blur-[120px]+ es muy costoso en Safari iOS) */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-foreground/5 blur-3xl translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-foreground/4 blur-3xl -translate-x-1/4 translate-y-1/4" />
        {/* Partículas CSS */}
        {[
          { top: "15%", left: "8%",  size: 3, dur: "18s", delay: "0s",   opacity: 0.5  },
          { top: "25%", left: "82%", size: 2, dur: "22s", delay: "3s",   opacity: 0.35 },
          { top: "60%", left: "5%",  size: 2, dur: "26s", delay: "6s",   opacity: 0.4  },
          { top: "72%", left: "90%", size: 3, dur: "20s", delay: "1.5s", opacity: 0.45 },
          { top: "40%", left: "92%", size: 2, dur: "24s", delay: "4s",   opacity: 0.3  },
          { top: "85%", left: "25%", size: 2, dur: "19s", delay: "8s",   opacity: 0.35 },
          { top: "10%", left: "55%", size: 2, dur: "28s", delay: "2s",   opacity: 0.25 },
          { top: "50%", left: "15%", size: 3, dur: "21s", delay: "5s",   opacity: 0.4  },
          { top: "30%", left: "45%", size: 2, dur: "23s", delay: "7s",   opacity: 0.2  },
          { top: "78%", left: "65%", size: 2, dur: "17s", delay: "9s",   opacity: 0.3  },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-foreground hero-particle"
            style={{
              top: p.top, left: p.left,
              width: p.size, height: p.size,
              opacity: p.opacity,
              ["--duration" as string]: p.dur,
              ["--delay" as string]: p.delay,
              ["--x-offset" as string]: `${(i % 2 === 0 ? 1 : -1) * (8 + i * 3)}px`,
            }}
          />
        ))}
      </div>

      <div className="container-main w-full">
        <div className="flex items-center justify-center py-32 lg:min-h-[100dvh]">

          <div className="flex flex-col gap-7 max-w-3xl items-center text-center">

            <p
              ref={labelRef}
              className="inline-flex items-center gap-3 text-xs font-mono font-semibold text-primary tracking-[0.18em] uppercase"
            >
              <span className="w-6 h-px bg-primary" />
              {t("greeting")}
            </p>

            {/* Título con typewriter — cursor visible mientras escribe */}
            <h1 ref={titleRef} className="hero-title">
              <span ref={titleTextRef} />
              <span ref={cursorRef} className="cursor-blink ml-1" aria-hidden="true">|</span>
            </h1>

            <p
              ref={subtitleRef}
              className="text-2xl md:text-3xl font-display font-medium text-foreground/75 leading-snug max-w-2xl"
            >
              {t("mainSubtitle")}
            </p>

            <p
              ref={descRef}
              className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl"
            >
              {t("description")}
            </p>

            <div ref={ctaRef} className="flex flex-wrap gap-4 pt-2 justify-center">
              <Button asChild size="lg" className="gap-2 font-semibold shadow-md shadow-primary/25">
                <Link href={`/${lang}/portfolio`}>
                  {t("viewProjects")}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 font-semibold border-border/60 hover:border-primary hover:text-primary"
              >
                <Link href={`/${lang}/contact`}>
                  {t("contactButton")}
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default Hero;
