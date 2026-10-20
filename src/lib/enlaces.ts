import contactConfig from '@/config/contact.json';

const telefono = contactConfig.phone.replace(/\D/g, '');

/** URL de WhatsApp (wa.me) al número de DevMinds, con mensaje prellenado opcional. */
export function enlaceWhatsApp(mensaje?: string): string {
  const base = `https://wa.me/${telefono}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

/** URL `tel:` internacional para llamar a DevMinds. */
export function enlaceLlamada(): string {
  return `tel:+${telefono}`;
}

/** URL `mailto:` al correo de DevMinds, con asunto opcional. */
export function enlaceCorreo(asunto?: string): string {
  const base = `mailto:${contactConfig.email}`;
  return asunto ? `${base}?subject=${encodeURIComponent(asunto)}` : base;
}
