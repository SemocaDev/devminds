'use client';

import { motion } from 'framer-motion';
import contactConfig from '@/config/contact.json';

const EmailSidebar = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed right-0 bottom-0 hidden md:flex flex-col items-center gap-6 w-10 z-50 pb-8"
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
    </motion.div>
  );
};

export default EmailSidebar;
