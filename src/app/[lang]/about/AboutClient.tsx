'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Mail, MapPin, Calendar, Code2, Gamepad2, BookOpen, ChefHat, Database,
  Linkedin as LinkedinIcon, Github as GithubIcon,
  Lightbulb, Target, Heart, Zap, Shield, Users, Clock, MessageCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer/Footer';
import SocialSidebar from '@/app/components/layout/SocialSidebar';
import EmailSidebar from '@/app/components/layout/EmailSidebar';
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import type { TeamMemberWithTranslation } from '@/db/queries/team';
import Autoplay from 'embla-carousel-autoplay';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Gamepad2, BookOpen, ChefHat, Code2, Database,
};

const hierarchyLabels: Record<string, string> = {
  founder: 'Fundador',
  'co-founder': 'Co-fundador',
  developer: 'Desarrollador',
  designer: 'Diseñador',
  marketing: 'Marketing',
};

function TeamMemberCard({ member, t }: { member: TeamMemberWithTranslation; t: ReturnType<typeof useTranslations> }) {
  return (
    <article className="border border-border/50 rounded-2xl overflow-hidden h-full">
      <div className="p-8">
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-border/40 flex-shrink-0 mx-auto sm:mx-0 bg-muted">
            {member.photo ? (
              <Image src={member.photo} alt={member.name} fill className="object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Code2 className="w-10 h-10 text-muted-foreground/30" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-display font-bold mb-1">{member.name}</h2>
            {member.nickname && (
              <p className="text-sm text-muted-foreground italic mb-2">&quot;{member.nickname}&quot;</p>
            )}
            <div className="space-y-1 mb-3">
              <Badge variant="outline" className="text-xs border-border/60">
                {t(`hierarchy.${member.hierarchy}`) || hierarchyLabels[member.hierarchy] || member.hierarchy}
              </Badge>
              <p className="text-base font-semibold">{member.role}</p>
              <p className="text-sm text-muted-foreground">{member.specialization}</p>
            </div>
          </div>
        </div>

        <div className="space-y-1.5 text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-sm">{member.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-sm">{member.education}</span>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground mb-5 max-w-[65ch]">{member.bio}</p>

        {member.skills.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">{t('skills.title')}</p>
            <div className="flex flex-wrap gap-1.5">
              {member.skills.map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs px-2 py-0.5 border-border/50">{skill}</Badge>
              ))}
            </div>
          </div>
        )}

        {member.interests && member.interests.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-mono font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">{t('interests.title')}</p>
            <div className="flex flex-wrap gap-1.5">
              {member.interests.map((interest) => {
                const Icon = iconMap[interest.icon] || Code2;
                return (
                  <div key={interest.labelKey} className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-border/40 bg-muted/40 text-xs text-muted-foreground">
                    <Icon className="w-3 h-3" />
                    <span>{t(`interests.${interest.labelKey}`)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(member.email || member.linkedin || member.github) && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-border/40">
            {member.email && (
              <Link href={`mailto:${member.email}`}>
                <Button size="sm" variant="outline" className="gap-1.5 border-border/50 hover:border-foreground text-xs">
                  <Mail className="w-3 h-3" />{t('contact')}
                </Button>
              </Link>
            )}
            {member.linkedin && (
              <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="gap-1.5 border-border/50 hover:border-foreground text-xs">
                  <LinkedinIcon className="w-3 h-3" />LinkedIn
                </Button>
              </Link>
            )}
            {member.github && (
              <Link href={member.github} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="gap-1.5 border-border/50 hover:border-foreground text-xs">
                  <GithubIcon className="w-3 h-3" />GitHub
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

type Props = { members: TeamMemberWithTranslation[] };

export default function AboutClient({ members }: Props) {
  const t = useTranslations('About');
  const mainRef = useRef<HTMLElement>(null);
  const founders = members.filter(m => m.hierarchy === 'founder' || m.hierarchy === 'co-founder');
  const restOfTeam = members.filter(m => m.hierarchy !== 'founder' && m.hierarchy !== 'co-founder');
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';
      gsap.fromTo('.about-hero',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease, delay: 0.1 }
      );
      gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease,
            scrollTrigger: { trigger: el, start: 'top 82%', once: true } }
        );
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  const values = [
    { icon: Zap,     key: 'innovation'   },
    { icon: Heart,   key: 'quality'      },
    { icon: Shield,  key: 'commitment'   },
    { icon: Users,   key: 'transparency' },
  ];

  const reasons = [
    { icon: Code2,         key: 'cleanCode'     },
    { icon: MessageCircle, key: 'communication' },
    { icon: Clock,         key: 'onTime'        },
    { icon: Target,        key: 'support'       },
  ];

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <Navbar />
      <SocialSidebar />
      <EmailSidebar />

      <main ref={mainRef} className="flex-1">

        {/* Hero */}
        <section className="section-spacing bg-background">
          <div className="container-main">
            <div className="about-hero opacity-0 mb-16 text-center">
              <p className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-primary tracking-[0.2em] uppercase mb-4">
                <span className="w-6 h-px bg-primary" />
                {t('pageLabel')}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4 max-w-2xl mx-auto">
                {t('title')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-[55ch] leading-relaxed mx-auto">{t('subtitle')}</p>
            </div>

            {/* Historia */}
            <div className="gsap-reveal mb-20 max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-5 h-5 text-foreground/50" />
                <h2 className="text-2xl font-display font-bold">{t('history.title')}</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed pl-8 border-l border-border/50">
                <p className="text-base">{t('history.paragraph1')}</p>
                <p className="text-base">{t('history.paragraph2')}</p>
                <p className="text-base">{t('history.paragraph3')}</p>
              </div>
            </div>

            {/* Valores — grid 2×2, sin colores hardcoded */}
            <div className="gsap-reveal mb-20">
              <h2 className="text-2xl font-display font-bold mb-8 text-center">{t('values.title')}</h2>
              <div className="grid md:grid-cols-2 gap-px bg-border/40 border border-border/40 rounded-2xl overflow-hidden max-w-3xl mx-auto">
                {values.map(({ icon: Icon, key }) => (
                  <div key={key} className="bg-background p-6 hover:bg-muted/20 transition-colors duration-200">
                    <div className="w-8 h-8 rounded-lg border border-border/60 flex items-center justify-center mb-4">
                      <Icon className="w-4 h-4 text-foreground/70" />
                    </div>
                    <h3 className="font-semibold mb-1">{t(`values.${key}.title`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(`values.${key}.description`)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Founders Carousel */}
            {founders.length > 0 && (
              <div className="gsap-reveal mb-20">
                <h2 className="text-2xl font-display font-bold mb-8 text-center">{t('foundersTitle')}</h2>
                <div className="max-w-3xl mx-auto">
                  <Carousel
                    setApi={setApi}
                    opts={{ align: 'center', loop: true }}
                    plugins={[Autoplay({ delay: 5000 })]}
                    className="w-full"
                  >
                    <CarouselContent>
                      {founders.map((founder) => (
                        <CarouselItem key={founder.id}>
                          <TeamMemberCard member={founder} t={t} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0 sm:-left-12" />
                    <CarouselNext className="right-0 sm:-right-12" />
                  </Carousel>
                  {founders.length > 1 && (
                    <div className="flex justify-center gap-2 mt-5">
                      {founders.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => api?.scrollTo(index)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            current === index ? 'w-8 bg-foreground' : 'w-1.5 bg-foreground/20 hover:bg-foreground/40'
                          }`}
                          aria-label={`Ir a ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Resto del equipo */}
            {restOfTeam.length > 0 && (
              <div className="gsap-reveal mb-20">
                <h2 className="text-2xl font-display font-bold mb-8 text-center">{t('teamTitle')}</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                  {restOfTeam.map((member) => (
                    <TeamMemberCard key={member.id} member={member} t={t} />
                  ))}
                </div>
              </div>
            )}

            {/* Por qué elegirnos */}
            <div className="gsap-reveal">
              <h2 className="text-2xl font-display font-bold mb-8 text-center">{t('whyChooseUs.title')}</h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {reasons.map(({ icon: Icon, key }) => (
                  <div key={key} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg border border-border/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-foreground/70" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t(`whyChooseUs.${key}.title`)}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{t(`whyChooseUs.${key}.description`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
