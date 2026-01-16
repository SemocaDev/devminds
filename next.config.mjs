// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

// Importante: pasar la ruta al archivo i18n.ts como argumento
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Redirects para consolidar www como canónica
  async redirects() {
    return [
      // Redirect non-www to www
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'devminds.online',
          },
        ],
        destination: 'https://www.devminds.online/:path*',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);