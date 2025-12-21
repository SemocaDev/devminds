'use client';

import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container-main">
        <div className="py-6">
          <Separator className="mb-6" />
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} DevMinds. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
