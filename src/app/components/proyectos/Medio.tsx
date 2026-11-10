import Image from 'next/image';
import { esVideo, posterDe } from '@/lib/medios';

type Props = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Una imagen o un video, llenando a su contenedor. El video va mudo, en bucle y con controles. */
export default function Medio({ src, alt, sizes, priority, className }: Props) {
  if (esVideo(src)) {
    return (
      <video
        src={src}
        poster={posterDe(src) ?? undefined}
        aria-label={alt}
        controls
        muted
        loop
        playsInline
        preload="metadata"
        className={`absolute inset-0 size-full ${className ?? ''}`}
      />
    );
  }
  return <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={className} />;
}
