'use client';

import dynamic from "next/dynamic";
import Hero from "@/app/components/sections/Hero";
import Navbar from "@/app/components/layout/Navbar";
import SocialSidebar from "@/app/components/layout/SocialSidebar";
import EmailSidebar from "@/app/components/layout/EmailSidebar";
import Footer from "@/app/components/layout/Footer/Footer";
import ScrollIndicator from "@/app/components/ui/ScrollIndicator/ScrollIndicator";
import { useScrollReveal } from "@/app/hooks/useScrollReveal";
import type { ProjectWithTranslation } from '@/db/queries/projects';

// Secciones bajo el fold: no se monta su JS (ni sus ScrollTrigger de GSAP)
// hasta que React las necesita, para no saturar el hilo principal al cargar el Hero.
const CallToAction = dynamic(() => import("@/app/components/sections/CallToAction"));
const AboutUs = dynamic(() => import("@/app/components/sections/AboutUs/AboutUs"));
const Services = dynamic(() => import("@/app/components/sections/Services/Services"));
const TechStack = dynamic(() => import("@/app/components/sections/TechStack/TechStack"));
const Projects = dynamic(() => import("@/app/components/sections/Projects/Projects"));
const Process = dynamic(() => import("@/app/components/sections/Process/Process"));
const FAQ = dynamic(() => import("@/app/components/sections/FAQ/FAQ"));
const ContactCTA = dynamic(() => import("@/app/components/sections/ContactCTA/ContactCTA"));

type Props = {
  featuredProjects: ProjectWithTranslation[];
};

export default function HomeClient({ featuredProjects }: Props) {
  const { hasScrolled } = useScrollReveal(300);

  return (
    <>
        <div className="min-h-screen flex flex-col w-full">
          {/* New Navigation */}
          <Navbar />
          <SocialSidebar />
          <EmailSidebar />

          {/* Main Content */}
          <main className="flex-1">
            {/* Hero - Full Screen */}
            <Hero />

            {/* CallToAction */}
            <CallToAction />

            {/* About con fondo claro */}
            <AboutUs />

            {/* Services */}
            <Services />

            {/* TechStack - Cinta infinita de tecnologías */}
            <TechStack />

            {/* Projects con fondo claro */}
            <Projects projects={featuredProjects} />

            {/* Process - Timeline del proceso */}
            <Process />

            {/* FAQ Section */}
            <FAQ />

            {/* Contact CTA */}
            <ContactCTA />
          </main>

          <ScrollIndicator show={!hasScrolled} />

          <Footer />
        </div>
    </>
  );
}
