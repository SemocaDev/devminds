import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import MarcoPagina from '@/app/components/pagina/MarcoPagina';
import EncabezadoPagina from '@/app/components/pagina/EncabezadoPagina';
import FormularioContacto from '@/app/components/contacto/FormularioContacto';
import CampoPuntos from '@/app/components/reticula/CampoPuntos';
import DivisorSeccion from '@/app/components/reticula/DivisorSeccion';
import contactConfig from '@/config/contact.json';
import { enlaceCorreo, enlaceLlamada, enlaceWhatsApp } from '@/lib/enlaces';

type Props = { params: Promise<{ lang: string }> };

const rotulo = 'text-[11px] font-medium uppercase tracking-[0.14em]';

/** Hoja 05: WhatsApp primero y grande; correo y llamada al lado; el formulario como segunda vía. */
export default async function ContactPage({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const [t, tHome, tCartela, tNav] = await Promise.all([
    getTranslations('Contacto'),
    getTranslations('Home'),
    getTranslations('Cartela'),
    getTranslations('Navbar'),
  ]);
  const telefono = contactConfig.phone.replace(/^\+57(\d{3})(\d{3})(\d{4})$/, '+57 $1 $2 $3');

  return (
    <MarcoPagina>
      <EncabezadoPagina
        titulo={t('titulo')}
        bajada={t('bajada')}
        hoja="05"
        seccion={tNav('contact')}
        migas={[{ nombre: tCartela('inicio'), ruta: '' }, { nombre: tNav('contact'), ruta: '/contact' }]}
      />

      {/* Canales: WhatsApp a dos columnas, correo y llamada */}
      <div className="contenedor-reticula relative z-[2]">
        <div className="grid md:grid-cols-4">
          <a
            href={enlaceWhatsApp(tHome('whatsappMensaje'))}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-[200px] flex-col bg-primary p-5 text-primary-foreground transition-colors hover:bg-primary-hover md:col-span-2 md:min-h-[240px] md:p-6"
          >
            <span className={rotulo}>{t('whatsapp.rotulo')}</span>
            <span className="mt-auto flex items-end justify-between gap-4">
              <span>
                <span className="block font-display text-3xl font-bold tracking-[-0.02em] md:text-[2.5rem]">{t('whatsapp.titulo')}</span>
                <span className="mt-2 block text-[15px]">{t('whatsapp.texto')}</span>
              </span>
              <ArrowUpRight className="size-7 shrink-0 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </a>
          <a href={enlaceCorreo()} className="group flex min-h-[140px] flex-col bg-secondary p-5 transition-colors hover:bg-accent md:p-6">
            <span className={`${rotulo} text-muted-foreground`}>{t('correo')}</span>
            <span className="mt-auto flex items-center gap-2 break-all text-[15px] font-semibold"><Mail className="size-4 shrink-0" />{contactConfig.email}</span>
          </a>
          <a href={enlaceLlamada()} className="group flex min-h-[140px] flex-col bg-foreground p-5 text-background transition-colors hover:bg-foreground/90 md:p-6">
            <span className={`${rotulo} text-background/70`}>{t('llamada')}</span>
            <span className="mt-auto flex items-center gap-2 text-[15px] font-semibold"><Phone className="size-4 shrink-0" />{telefono}</span>
          </a>
        </div>
      </div>
      <DivisorSeccion />

      {/* Formulario como segunda vía */}
      <section className="bg-secondary py-14 md:py-20">
        <div className="contenedor-reticula relative z-[2]">
          <div className="grid gap-y-8 md:grid-cols-4">
            <div className="px-4 md:px-6">
              <h2 className="font-display text-2xl font-bold tracking-[-0.015em] md:text-3xl">{t('formulario.titulo')}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{t('formulario.texto')}</p>
            </div>
            <div className="relative px-4 md:col-span-2 md:px-6">
              <FormularioContacto />
            </div>
          </div>
        </div>
      </section>
      <DivisorSeccion />

      <div className="contenedor-reticula relative z-[2]">
        <div className="grid md:grid-cols-4">
          <div className="relative hidden min-h-[120px] md:block"><CampoPuntos /></div>
          <p className="px-4 py-10 text-[17px] leading-relaxed text-muted-foreground md:col-span-3 md:self-center md:px-6">{t('ubicacion')}</p>
        </div>
      </div>
    </MarcoPagina>
  );
}
