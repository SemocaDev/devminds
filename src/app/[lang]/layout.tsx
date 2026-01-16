// src/app/[lang]/layout.tsx - Versión mejorada con SEO y Temas
import { Roboto, Doto } from "next/font/google";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import ClientThemeWrapper from "@/app/components/ClientThemeWrapper";
import { Toaster } from "@/components/ui/sonner";
import { generateOrganizationSchema, generateLocalBusinessSchema } from "@/lib/schemas/organization-schema";
import "@/styles/globals.css";

// Font configurations
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

const doto = Doto({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
  variable: "--font-doto",
  display: "swap",
});

import { locales, Locale } from '@/config/i18n-config';

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string; }>;
};

// Generar rutas estáticas para todos los idiomas
export function generateStaticParams() {
  return locales.map((locale) => ({ lang: locale }));
}

// Función para generar metadatos dinámicos según el idioma usando traducciones
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const t = await getTranslations({ locale: lang, namespace: 'Metadata' });

  const title = t('home.title');
  const description = t('home.description');
  const keywords = t('home.keywords');

  return {
    title,
    description,
    keywords,

    // Iconos - PWA optimizado
    icons: {
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
        { url: '/icon-512x512.svg', sizes: '512x512', type: 'image/svg+xml' },
      ],
      apple: [
        { url: '/apple-touch-icon.svg', sizes: '180x180', type: 'image/svg+xml' },
      ],
    },

    // Metadatos básicos
    authors: [{ name: "DevMinds Team" }],
    creator: "DevMinds",
    publisher: "DevMinds",

    // Open Graph para redes sociales
    openGraph: {
      type: 'website',
      locale: lang === 'es' ? 'es_CO' : lang === 'en' ? 'en_US' : 'ja_JP',
      url: `https://www.devminds.online/${lang}`,
      title,
      description,
      siteName: 'DevMinds',
      images: [
        {
          url: 'https://www.devminds.online/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'DevMinds - Desarrollo Web Profesional en Neiva, Colombia',
        }
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@devminds',
      images: ['https://www.devminds.online/og-image.jpg'],
    },

    // Robots y indexación
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Canonical URL - Usando www como canónica
    alternates: {
      canonical: `https://www.devminds.online/${lang}`,
      languages: {
        'es': 'https://www.devminds.online/es',
        'en': 'https://www.devminds.online/en',
        'ja': 'https://www.devminds.online/ja',
      },
    },

    // Metadatos adicionales
    category: 'technology',
    classification: 'Professional Web Development Services',

    // Para aplicaciones web progresivas (PWA)
    manifest: '/manifest.json',

    // Verificación de motores de búsqueda (agregar cuando tengas las keys)
    // verification: {
    //   google: 'tu-codigo-de-verificacion-google',
    //   yandex: 'tu-codigo-de-verificacion-yandex',
    //   yahoo: 'tu-codigo-de-verificacion-yahoo',
    // },
  };
}

export default async function RootLayout(props: Props) {
  const { lang } = await props.params;

  // Habilitar renderizado estático para este locale
  setRequestLocale(lang);

  if (!locales.includes(lang as Locale)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../../messages/${lang}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={lang} className={`${roboto.variable} ${doto.variable} overflow-x-hidden`}>
      <head>
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#FFFFFF" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0A0A0A" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="geo.region" content="CO" />
        <meta name="geo.placename" content="Colombia" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />

        {/* JSON-LD Schemas para SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema(lang))
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateLocalBusinessSchema(lang))
          }}
        />

        {/* Google Analytics 4 */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col font-roboto antialiased overflow-x-hidden">
        <ClientThemeWrapper>
          <NextIntlClientProvider locale={lang} messages={messages}>
            {props.children}
          </NextIntlClientProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              classNames: {
                toast: 'font-mono',
                title: 'font-semibold',
                description: 'text-sm opacity-90',
              },
            }}
          />
        </ClientThemeWrapper>
      </body>
    </html>
  );
}