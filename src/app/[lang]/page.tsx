'use client';

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Hero from "@/app/components/sections/Hero";
import CallToAction from "@/app/components/sections/CallToAction";
import AboutUs from "@/app/components/sections/AboutUs/AboutUs";
import Services from "@/app/components/sections/Services/Services";
import TechStack from "@/app/components/sections/TechStack/TechStack";
import Projects from "@/app/components/sections/Projects/Projects";
import Process from "@/app/components/sections/Process/Process";
import FAQ from "@/app/components/sections/FAQ/FAQ";
import ContactCTA from "@/app/components/sections/ContactCTA/ContactCTA";
import Navbar from "@/app/components/layout/Navbar";
import SocialSidebar from "@/app/components/layout/SocialSidebar";
import EmailSidebar from "@/app/components/layout/EmailSidebar";
import Footer from "@/app/components/layout/Footer/Footer";
import ScrollIndicator from "@/app/components/ui/ScrollIndicator/ScrollIndicator";
import ScrollRevealWrapper from "@/app/components/ui/ScrollReveal/ScrollRevealWrapper";
import LoadingScreen from "@/app/components/layout/LoadingScreen";
import { useScrollReveal } from "@/app/hooks/useScrollReveal";

export default function Home() {
  const { hasScrolled } = useScrollReveal(300);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    // Verificar si ya se mostró el loading en esta sesión
    const hasSeenLoading = sessionStorage.getItem('devminds-loading-shown');

    if (hasSeenLoading) {
      // Si ya se vio, no mostrar la pantalla de carga
      setIsLoading(false);
      setShowLoading(false);
    } else {
      // Primera vez en esta sesión, mostrar loading
      setShowLoading(true);
      // Marcar como visto para el resto de la sesión
      sessionStorage.setItem('devminds-loading-shown', 'true');
    }
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showLoading && isLoading && (
          <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
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
              {/* CallToAction */}
              <CallToAction />

              {/* About con fondo claro */}
              <AboutUs />

              {/* Services */}
              <Services />

              {/* TechStack - Cinta infinita de tecnologías */}
              <TechStack />

              {/* Projects con fondo claro */}
              <Projects />

              {/* Process - Timeline del proceso */}
              <Process />

              {/* FAQ Section */}
              <FAQ />

              {/* Contact CTA */}
              <ContactCTA />
            </ScrollRevealWrapper>
          </main>

          <ScrollIndicator show={!hasScrolled} />

          <Footer />
        </div>
      )}
    </>
  );
}
