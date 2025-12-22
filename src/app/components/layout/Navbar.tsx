'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname, useParams } from 'next/navigation';
import Link from 'next/link';
import ThemeSwitcher from '@/app/components/ui/ThemeSwitcher/ThemeSwitcher';

type HomeNavItem = {
  number: string;
  label: string;
  href: string;
};

type GlobalNavItem = {
  label: string;
  href: string;
};

const Navbar = () => {
  const t = useTranslations('Navbar');
  const pathname = usePathname();
  const params = useParams();
  const lang = params.lang as string;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const isHomepage = pathname === `/${lang}`;

  // Homepage navigation items (scroll to sections)
  const homeNavItems: HomeNavItem[] = [
    { number: '01', label: t('about'), href: '#about' },
    { number: '02', label: t('services'), href: '#services' },
    { number: '03', label: t('projects'), href: '#projects' },
    { number: '04', label: t('faq'), href: '#faq' },
    { number: '05', label: t('contact'), href: '#contact' }
  ];

  // Global navigation items (page links)
  const globalNavItems: GlobalNavItem[] = [
    { label: t('home'), href: `/${lang}` },
    { label: t('portfolio'), href: `/${lang}/portfolio` },
    { label: t('about'), href: `/${lang}/about` },
    { label: t('contact'), href: `/${lang}/contact` }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show shadow after scrolling
      setIsScrolled(currentScrollY > 50);

      // Hide navbar on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isHidden ? -100 : 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'backdrop-blur-md bg-background/80 shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container-main">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className="text-xl md:text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            DevMinds
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            {isHomepage ? (
              homeNavItems.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className="group flex items-center gap-2 text-sm hover:text-primary transition-colors"
                  >
                    <span className="text-primary font-mono text-xs">
                      {item.number}.
                    </span>
                    <span className="relative">
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                    </span>
                  </button>
                </li>
              ))
            ) : (
              globalNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group text-sm hover:text-primary transition-colors ${
                      pathname === item.href ? 'text-primary' : ''
                    }`}
                  >
                    <span className="relative">
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))
            )}
          </ul>

          {/* Desktop: ThemeSwitcher + CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Theme Switcher */}
            <ThemeSwitcher className="hover:bg-accent/20" />
            
            {/* CTA Button */}
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => scrollToSection('#contact')}
            >
              {t('startProject')}
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden flex items-center gap-4">
            {/* Theme Switcher en Mobile */}
            <ThemeSwitcher className="hover:bg-accent/20" />

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-10 w-10 border-border/50 hover:border-primary/50 hover:bg-accent/20"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[300px] p-0"
                onInteractOutside={(e) => e.preventDefault()} // Previene cerrar al hacer clic fuera
              >
                {/* Header del Sheet con botón de cerrar */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-border/50 bg-background/95 backdrop-blur-sm">
                  <Link
                    href={`/${lang}`}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-bold text-primary"
                  >
                    DevMinds
                  </Link>
                  
                  {/* Botón de cerrar - IDÉNTICO al de abrir */}
                  <SheetClose asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="h-10 w-10 border-border/50 hover:border-primary/50 hover:bg-accent/20"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </SheetClose>
                </div>

                {/* SheetTitle oculto para accesibilidad */}
                <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
                
                {/* Contenido del menú */}
                <div className="flex flex-col gap-4 p-6">
                  {isHomepage ? (
                    <>
                      {homeNavItems.map((item) => (
                        <button
                          key={item.href}
                          onClick={() => scrollToSection(item.href)}
                          className="flex items-center gap-3 text-base hover:text-primary transition-colors text-left py-3 px-2 rounded-lg hover:bg-accent/10"
                        >
                          <span className="text-primary font-mono text-sm">
                            {item.number}.
                          </span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                      <Button
                        className="mt-2"
                        onClick={() => {
                          setIsOpen(false);
                          scrollToSection('#contact');
                        }}
                      >
                        {t('startProject')}
                      </Button>
                    </>
                  ) : (
                    <>
                      {globalNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 text-base hover:text-primary transition-colors text-left py-3 px-2 rounded-lg hover:bg-accent/10 ${
                            pathname === item.href ? 'text-primary bg-primary/5' : ''
                          }`}
                        >
                          <span className="text-muted-foreground font-mono text-sm">•</span>
                          <span>{item.label}</span>
                        </Link>
                      ))}
                      <Link 
                        href={`/${lang}#contact`} 
                        onClick={() => setIsOpen(false)}
                        className="mt-2"
                      >
                        <Button className="w-full">
                          {t('startProject')}
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;