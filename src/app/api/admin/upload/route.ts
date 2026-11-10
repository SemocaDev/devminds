import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { uploadMedia } from '@/lib/admin/cloudinary';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const VIDEO_TYPES = ['video/mp4', 'video/webm'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
// Vercel rechaza cuerpos de más de 4.5MB en una función; el video debe caber con margen.
const MAX_VIDEO_SIZE = 4 * 1024 * 1024; // 4MB

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No se envió archivo' }, { status: 400 });
    }

    const esVideo = VIDEO_TYPES.includes(file.type);

    if (!esVideo && !IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Usa JPG, PNG, WebP o AVIF, o MP4 o WebM para video.' },
        { status: 400 }
      );
    }

    if (file.size > (esVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE)) {
      return NextResponse.json(
        { error: esVideo ? 'El video excede 4MB. Comprímelo o recórtalo.' : 'El archivo excede 5MB' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadMedia(buffer, folder, esVideo ? 'video' : 'image');

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Error al subir el archivo' }, { status: 500 });
  }
}
