'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const t = useTranslations('Footer');
  const params = useParams();
  const lang = params.lang as string;
  const year = new Date().getFullYear();

  const navigation = [
    { label: t('nav.home'), href: `/${lang}` },
    { label: t('nav.about'), href: `/${lang}/about` },
    { label: t('nav.services'), href: `/${lang}/services` },
    { label: t('nav.portfolio'), href: `/${lang}/portfolio` },
    { label: t('nav.contact'), href: `/${lang}/contact` },
  ];

  const resources = [
    { label: t('resources.portfolio'), href: `/${lang}/portfolio` },
    { label: t('resources.faq'), href: `/${lang}#faq` },
  ];

  const social = [
    { label: 'GitHub', href: 'https://github.com/SemocaDev', icon: Github },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sebastian-morea', icon: Linkedin },
    { label: 'Email', href: 'mailto:semoca00@gmail.com', icon: Mail },
  ];

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container-main">
        <div className="py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Brand Column */}
            <div>
              <h3 className="text-xl font-bold text-primary mb-4">DevMinds</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('tagline')}
              </p>
            </div>

            {/* Navigation Column */}
            <div>
              <h4 className="font-semibold mb-4">{t('navigation')}</h4>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="font-semibold mb-4">{t('resourcesTitle')}</h4>
              <ul className="space-y-2">
                {resources.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Column */}
            <div>
              <h4 className="font-semibold mb-4">{t('social')}</h4>
              <ul className="space-y-3">
                {social.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              {t('copyright', { year })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
