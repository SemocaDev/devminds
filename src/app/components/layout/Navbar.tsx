'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
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
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col gap-8 mt-12">
                {/* ThemeSwitcher en Mobile (opcional) */}
                <div className="flex justify-center mb-4">
                  <ThemeSwitcher />
                </div>

                {isHomepage ? (
                  <>
                    {homeNavItems.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => scrollToSection(item.href)}
                        className="flex items-center gap-3 text-lg hover:text-primary transition-colors text-left"
                      >
                        <span className="text-primary font-mono text-sm">
                          {item.number}.
                        </span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                    <Button
                      className="mt-4"
                      onClick={() => scrollToSection('#contact')}
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
                        className={`text-lg hover:text-primary transition-colors text-left ${
                          pathname === item.href ? 'text-primary' : ''
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <Link href={`/${lang}#contact`} onClick={() => setIsOpen(false)}>
                      <Button className="mt-4 w-full">
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
    </motion.nav>
  );
};

export default Navbar;