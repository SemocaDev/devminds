import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type TipoMedio = 'image' | 'video';

/** Sube una imagen o un video a Cloudinary. Las imágenes se optimizan al subir; los videos se guardan tal cual. */
export async function uploadMedia(
  buffer: Buffer,
  folder: string,
  tipo: TipoMedio = 'image'
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `devminds/${folder}`,
          resource_type: tipo,
          ...(tipo === 'image' && { transformation: [{ quality: 'auto', fetch_format: 'auto' }] }),
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Upload failed'));
            return;
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      )
      .end(buffer);
  });
}

export const uploadImage = (buffer: Buffer, folder: string) => uploadMedia(buffer, folder, 'image');

export async function deleteImage(publicId: string, tipo: TipoMedio = 'image'): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: tipo });
}
