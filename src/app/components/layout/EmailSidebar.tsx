'use client';

import contactConfig from '@/config/contact.json';

const EmailSidebar = () => {
  return (
    <div
      className="fixed right-0 bottom-0 hidden md:flex flex-col items-center gap-6 w-10 z-50 pb-8 animate-fade-in-delayed"
    >
      {/* Decorative Line */}
      <div className="w-px h-24 bg-muted-foreground/30" />

      {/* Email Link */}
      <a
        href={`mailto:${contactConfig.email}`}
        className="text-muted-foreground hover:text-primary hover:-translate-y-1 transition-all duration-300 text-xs tracking-widest"
        style={{
          writingMode: 'vertical-rl',
        }}
      >
        {contactConfig.email}
      </a>
    </div>
  );
};

export default EmailSidebar;
