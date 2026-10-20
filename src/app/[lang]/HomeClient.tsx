'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer/Footer';
import BarraMovil from '@/app/components/layout/BarraMovil';
import Hero from '@/app/components/sections/Hero';
import Reticula from '@/app/components/reticula/Reticula';
import DivisorSeccion from '@/app/components/reticula/DivisorSeccion';
import Rieles from '@/app/components/reticula/Rieles';
import type { ProjectWithTranslation } from '@/db/queries/projects';
import type { TeamMemberWithTranslation } from '@/db/queries/team';

// Secciones bajo el fold: su JS (y sus ScrollTrigger) se cargan después del hero.
// Temporal: las secciones viejas siguen hasta que su reemplazo exista (Tareas 11-15).
const CallToAction = dynamic(() => import('@/app/components/sections/CallToAction'));
const Services = dynamic(() => import('@/app/components/sections/Services/Services'));
const Projects = dynamic(() => import('@/app/components/sections/Projects/Projects'));
const Process = dynamic(() => import('@/app/components/sections/Process/Process'));
const AboutUs = dynamic(() => import('@/app/components/sections/AboutUs/AboutUs'));
const FAQ = dynamic(() => import('@/app/components/sections/FAQ/FAQ'));
const ContactCTA = dynamic(() => import('@/app/components/sections/ContactCTA/ContactCTA'));

type Props = {
  featuredProjects: ProjectWithTranslation[];
  fundador: TeamMemberWithTranslation | null;
};

export default function HomeClient({ featuredProjects, fundador }: Props) {
  void fundador; // se usa en la Tarea 14
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <Rieles />
      <main className="relative flex-1">
        <Reticula />
        <Hero />
        <DivisorSeccion />
        <CallToAction />
        <Services />
        <DivisorSeccion />
        <Projects projects={featuredProjects} />
        <DivisorSeccion />
        <Process />
        <DivisorSeccion />
        <AboutUs />
        <DivisorSeccion />
        <FAQ />
        <DivisorSeccion />
        <ContactCTA />
      </main>
      <Footer conBarraMovil />
      <BarraMovil />
    </div>
  );
}
