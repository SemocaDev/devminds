'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Mail,
  MapPin,
  Calendar,
  Code2,
  Gamepad2,
  BookOpen,
  ChefHat,
  Database,
  Linkedin as LinkedinIcon,
  Github as GithubIcon,
  Lightbulb,
  Target,
  Heart,
  Zap,
  Shield,
  Users,
  Clock,
  MessageCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer/Footer';
import SocialSidebar from '@/app/components/layout/SocialSidebar';
import EmailSidebar from '@/app/components/layout/EmailSidebar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import teamData from '@/config/team.json';
import { TeamMember, TeamHierarchy } from '@/types/team';
import { useEffect, useState } from 'react';
import Autoplay from 'embla-carousel-autoplay';

// Icon mapping
const iconMap: Record<string, any> = {
  Gamepad2,
  BookOpen,
  ChefHat,
  Code2,
  Database,
};

// Hierarchy badge colors
const hierarchyColors: Record<TeamHierarchy, string> = {
  'founder': 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
  'co-founder': 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
  'developer': 'bg-gradient-to-r from-green-600 to-emerald-600 text-white',
  'designer': 'bg-gradient-to-r from-orange-600 to-red-600 text-white',
  'marketing': 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white',
};

// Team Member Card Component
function TeamMemberCard({ member, t }: { member: TeamMember; t: any }) {
  return (
    <Card className="border-2 hover:shadow-2xl transition-all duration-500 h-full">
      <CardContent className="p-8">
        {/* Header with Photo and Basic Info */}
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          {/* Profile Image */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-4 border-primary/20 flex-shrink-0 mx-auto sm:mx-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
            {member.photo ? (
              <Image
                src={member.photo}
                alt={member.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Code2 className="w-16 h-16 text-primary/30" />
              </div>
            )}
          </div>

          {/* Name and Role */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              {member.name}
            </h2>
            {member.nickname && (
              <p className="text-sm text-muted-foreground italic mb-2">
                &quot;{member.nickname}&quot;
              </p>
            )}
            <div className="space-y-2 mb-3">
              <Badge className={`${hierarchyColors[member.hierarchy]} px-3 py-1`}>
                {t(`hierarchy.${member.hierarchy}`)}
              </Badge>
              <p className="text-lg text-primary font-semibold">
                {t(`roles.${member.role}`)}
              </p>
              <p className="text-sm text-muted-foreground">
                {t(`specializations.${member.specialization}`)}
              </p>
            </div>
          </div>
        </div>

        {/* Location and Education */}
        <div className="space-y-2 text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm">{member.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm">{member.education}</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm leading-relaxed mb-6">
          {t(`bios.${member.bio}`)}
        </p>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3">{t('skills.title')}</h3>
          <div className="flex flex-wrap gap-2">
            {member.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs px-2 py-1">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Interests */}
        {member.interests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-3">{t('interests.title')}</h3>
            <div className="flex flex-wrap gap-2">
              {member.interests.map((interest) => {
                const Icon = iconMap[interest.icon] || Code2;
                return (
                  <div
                    key={interest.labelKey}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-xs"
                  >
                    <Icon className="w-3 h-3" />
                    <span>{t(`interests.${interest.labelKey}`)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Contact Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {member.email && (
            <Link href={`mailto:${member.email}`}>
              <Button size="sm" className="gap-2">
                <Mail className="w-3 h-3" />
                {t('contact')}
              </Button>
            </Link>
          )}
          {member.linkedin && (
            <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="gap-2">
                <LinkedinIcon className="w-3 h-3" />
                LinkedIn
              </Button>
            </Link>
          )}
          {member.github && (
            <Link href={member.github} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="gap-2">
                <GithubIcon className="w-3 h-3" />
                GitHub
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AboutPage() {
  const t = useTranslations('About');
  const teamMembers = teamData.team as TeamMember[];

  // Separate founders from rest of team
  const founders = teamMembers.filter(
    (member) => member.hierarchy === 'founder' || member.hierarchy === 'co-founder'
  );

  const restOfTeam = teamMembers.filter(
    (member) => member.hierarchy !== 'founder' && member.hierarchy !== 'co-founder'
  );

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <Navbar />
      <SocialSidebar />
      <EmailSidebar />

      <main className="flex-1">
        <section className="section-spacing bg-background">
          <div className="container-main">
            {/* Hero */}
            <motion.div
              className="text-center mb-16 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="section-title">
                {t('title')}
              </h1>
              <p className="subtitle max-w-2xl mx-auto">
                {t('subtitle')}
              </p>
            </motion.div>

            {/* Historia de DevMinds */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <Lightbulb className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-bold">{t('history.title')}</h2>
                </div>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p className="text-lg">{t('history.paragraph1')}</p>
                  <p className="text-lg">{t('history.paragraph2')}</p>
                  <p className="text-lg">{t('history.paragraph3')}</p>
                </div>
              </div>
            </motion.div>

            {/* Valores de la Empresa */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-20"
            >
              <h2 className="text-3xl font-bold text-center mb-12">
                {t('values.title')}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {[
                  { icon: Zap, key: 'innovation', color: 'text-yellow-500' },
                  { icon: Heart, key: 'quality', color: 'text-red-500' },
                  { icon: Shield, key: 'commitment', color: 'text-blue-500' },
                  { icon: Users, key: 'transparency', color: 'text-green-500' },
                ].map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <motion.div
                      key={value.key}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="p-6 text-center">
                          <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                              <Icon className={`w-8 h-8 ${value.color}`} />
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mb-2">
                            {t(`values.${value.key}.title`)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t(`values.${value.key}.description`)}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Founders Carousel */}
            {founders.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-20"
              >
                <h2 className="text-2xl font-bold text-center mb-8">
                  {t('foundersTitle')}
                </h2>

                <div className="max-w-4xl mx-auto">
                  <Carousel
                    setApi={setApi}
                    opts={{
                      align: 'center',
                      loop: true,
                    }}
                    plugins={[
                      Autoplay({
                        delay: 5000,
                      }),
                    ]}
                    className="w-full"
                  >
                    <CarouselContent>
                      {founders.map((founder) => (
                        <CarouselItem key={founder.id}>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <TeamMemberCard member={founder} t={t} />
                          </motion.div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-0 sm:-left-12" />
                    <CarouselNext className="right-0 sm:-right-12" />
                  </Carousel>

                  {/* Dots indicator */}
                  {founders.length > 1 && (
                    <div className="flex justify-center gap-2 mt-6">
                      {founders.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => api?.scrollTo(index)}
                          className={`h-2 rounded-full transition-all ${
                            current === index
                              ? 'w-8 bg-primary'
                              : 'w-2 bg-primary/30 hover:bg-primary/50'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Rest of Team Grid */}
            {restOfTeam.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-center mb-8">
                  {t('teamTitle')}
                </h2>
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {restOfTeam.map((member, index) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    >
                      <TeamMemberCard member={member} t={t} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Por qué elegirnos */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-20"
            >
              <h2 className="text-3xl font-bold text-center mb-12">
                {t('whyChooseUs.title')}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {[
                  { icon: Code2, key: 'cleanCode', color: 'bg-blue-500' },
                  { icon: MessageCircle, key: 'communication', color: 'bg-green-500' },
                  { icon: Clock, key: 'onTime', color: 'bg-purple-500' },
                  { icon: Target, key: 'support', color: 'bg-orange-500' },
                ].map((reason, index) => {
                  const Icon = reason.icon;
                  return (
                    <motion.div
                      key={reason.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="text-center"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className={`w-14 h-14 rounded-lg ${reason.color} flex items-center justify-center`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="font-bold text-lg">
                          {t(`whyChooseUs.${reason.key}.title`)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t(`whyChooseUs.${reason.key}.description`)}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
