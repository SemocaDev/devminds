/** Los medios de un proyecto son una lista de enlaces: imágenes o videos. Se distinguen por el enlace. */

const EXTENSION_VIDEO = /\.(mp4|webm|mov)(\?.*)?$/i;
const VIDEO_DE_CLOUDINARY = '/video/upload/';

export function esVideo(url: string): boolean {
  return url.includes(VIDEO_DE_CLOUDINARY) || EXTENSION_VIDEO.test(url);
}

/**
 * La imagen fija con que se muestra un medio donde no cabe un video (tarjetas, vista previa en redes).
 * Una imagen es su propio póster; de un video de Cloudinary sale el primer fotograma; de otro video, nada.
 */
export function posterDe(url: string): string | null {
  if (!esVideo(url)) return url;
  if (!url.includes(VIDEO_DE_CLOUDINARY)) return null;
  return url.replace(VIDEO_DE_CLOUDINARY, `${VIDEO_DE_CLOUDINARY}so_0/`).replace(EXTENSION_VIDEO, '.jpg');
}
