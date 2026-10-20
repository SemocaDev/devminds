'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer/Footer';
import BarraMovil from '@/app/components/layout/BarraMovil';
import Hero from '@/app/components/sections/Hero';
import Reticula from '@/app/components/reticula/Reticula';
import DivisorSeccion from '@/app/components/reticula/DivisorSeccion';
import type { ProjectWithTranslation } from '@/db/queries/projects';
import type { TeamMemberWithTranslation } from '@/db/queries/team';

// Secciones bajo el fold: su JS (y sus ScrollTrigger) se cargan después del hero.
// Temporal: las secciones viejas siguen hasta que su reemplazo exista (Tareas 11-15).
const Escalera = dynamic(() => import('@/app/components/sections/Escalera/Escalera'));
const Projects = dynamic(() => import('@/app/components/sections/Projects/Projects'));
const Process = dynamic(() => import('@/app/components/sections/Process/Process'));
const QuienesSomos = dynamic(() => import('@/app/components/sections/QuienesSomos/QuienesSomos'));
const FAQ = dynamic(() => import('@/app/components/sections/FAQ/FAQ'));
const ContactCTA = dynamic(() => import('@/app/components/sections/ContactCTA/ContactCTA'));

type Props = {
  featuredProjects: ProjectWithTranslation[];
  fundador: TeamMemberWithTranslation | null;
};

export default function HomeClient({ featuredProjects, fundador }: Props) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <main className="relative flex-1">
        <Reticula />
        <Hero />
        <DivisorSeccion />
        <Escalera />
        <DivisorSeccion />
        <Projects projects={featuredProjects} />
        <DivisorSeccion />
        <Process />
        <DivisorSeccion />
        <QuienesSomos fundador={fundador} />
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
