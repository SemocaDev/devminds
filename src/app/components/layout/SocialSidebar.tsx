'use client';

import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

const SocialSidebar = () => {
  const socials = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      className="fixed left-0 bottom-0 hidden md:flex flex-col items-center gap-6 w-10 z-50 pb-8"
    >
      {/* Social Icons */}
      <ul className="flex flex-col items-center gap-5">
        {socials.map((social) => {
          const Icon = social.icon;
          return (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary hover:-translate-y-1 transition-all duration-300"
                aria-label={social.label}
              >
                <Icon className="w-5 h-5" />
              </a>
            </li>
          );
        })}
      </ul>

      {/* Decorative Line */}
      <div className="w-px h-24 bg-muted-foreground/30" />
    </motion.div>
  );
};

export default SocialSidebar;
