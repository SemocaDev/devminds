'use client';

import dynamic from 'next/dynamic';
import { ViewTransition } from 'react';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer/Footer';
import BarraMovil from '@/app/components/layout/BarraMovil';
import Hero from '@/app/components/sections/Hero';
import Reticula from '@/app/components/reticula/Reticula';
import DivisorSeccion from '@/app/components/reticula/DivisorSeccion';
import type { ProjectWithTranslation } from '@/db/queries/projects';

// Secciones bajo el fold: su JS (y sus ScrollTrigger) se cargan después del hero.
const Escalera = dynamic(() => import('@/app/components/sections/Escalera/Escalera'));
const Projects = dynamic(() => import('@/app/components/sections/Projects/Projects'));
const Process = dynamic(() => import('@/app/components/sections/Process/Process'));
const QuienesSomos = dynamic(() => import('@/app/components/sections/QuienesSomos/QuienesSomos'));
// Import estático a propósito: con next/dynamic, los ids de useId del acordeón (Radix) difieren entre servidor y cliente.
import FAQ from '@/app/components/sections/FAQ/FAQ';
const Cierre = dynamic(() => import('@/app/components/sections/Cierre/Cierre'));

type Props = {
  featuredProjects: ProjectWithTranslation[];
};

export default function HomeClient({ featuredProjects }: Props) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <ViewTransition name="navbar"><Navbar /></ViewTransition>
      <main className="relative flex-1">
        <ViewTransition name="reticula"><Reticula entrada /></ViewTransition>
        <Hero />
        <DivisorSeccion entrada={550} />
        <Escalera />
        <DivisorSeccion />
        <Projects projects={featuredProjects} />
        <DivisorSeccion />
        <Process />
        <DivisorSeccion />
        <QuienesSomos />
        <DivisorSeccion />
        <FAQ />
        <DivisorSeccion />
        <Cierre />
      </main>
      <Footer conBarraMovil />
      <ViewTransition name="barra"><BarraMovil /></ViewTransition>
    </div>
  );
}
