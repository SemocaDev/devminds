// next.config.mjs
import createNextIntlPlugin from 'next-intl/plugin';

// Importante: pasar la ruta al archivo i18n.ts como argumento
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Redirects para consolidar www y rutas sin idioma
  async redirects() {
    const unlocalized = ['/about', '/services', '/portfolio', '/contact'];
    return [
      // Redirect non-www to www (preserva path completo)
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
      // Redirect rutas sin prefijo de idioma → /es (canónica española)
      ...unlocalized.map((route) => ({
        source: route,
        destination: `/es${route}`,
        permanent: true,
      })),
    ];
  },
};

export default withNextIntl(nextConfig);