'use client';

import { Separator } from '@/components/ui/separator';
import { useTranslations } from 'next-intl';

const Footer = () => {
  const t = useTranslations('Footer');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container-main">
        <div className="py-6">
          <Separator className="mb-6" />
          <p className="text-center text-sm text-muted-foreground">
            {t('copyright', { year })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
