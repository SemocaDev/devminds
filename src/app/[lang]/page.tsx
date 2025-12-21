'use client';

import Hero from "@/app/components/sections/Hero";
import CallToAction from "@/app/components/sections/CallToAction";
import AboutUs from "@/app/components/sections/AboutUs/AboutUs";
import Services from "@/app/components/sections/Services/Services";
import Projects from "@/app/components/sections/Projects/Projects";
import Contact from "@/app/components/sections/Contact/Contact";
import Navbar from "@/app/components/layout/Navbar";
import SocialSidebar from "@/app/components/layout/SocialSidebar";
import EmailSidebar from "@/app/components/layout/EmailSidebar";
import Footer from "@/app/components/layout/Footer/Footer";
import ScrollIndicator from "@/app/components/ui/ScrollIndicator/ScrollIndicator";
import ScrollRevealWrapper from "@/app/components/ui/ScrollReveal/ScrollRevealWrapper";
import { useScrollReveal } from "@/app/hooks/useScrollReveal";

export default function Home() {
  const { hasScrolled } = useScrollReveal(300);

  return (
    <div className="min-h-screen flex flex-col">
      {/* New Navigation */}
      <Navbar />
      <SocialSidebar />
      <EmailSidebar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero - Full Screen */}
        <Hero />

        {/* Resto de secciones reveladas con scroll */}
        <ScrollRevealWrapper isVisible={hasScrolled} delay={0.2}>
          {/* CallToAction con fondo de gradiente */}
          <div className="gradient-bg">
            <CallToAction />
          </div>

          {/* About con fondo claro */}
          <AboutUs />

          {/* Services con gradiente */}
          <Services />

          {/* Projects con fondo claro */}
          <Projects />

          {/* Contact con gradiente */}
          <div className="gradient-bg">
            <Contact />
          </div>
        </ScrollRevealWrapper>
      </main>

      <ScrollIndicator show={!hasScrolled} />

      <Footer />
    </div>
  );
}
