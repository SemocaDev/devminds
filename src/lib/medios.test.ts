import { describe, expect, it } from 'vitest';
import { esVideo, posterDe } from './medios';

const VIDEO = 'https://res.cloudinary.com/demo/video/upload/v1/devminds/projects/clip.mp4';
const IMAGEN = 'https://res.cloudinary.com/demo/image/upload/v1/devminds/projects/foto.webp';

describe('medios de un proyecto', () => {
  it('reconoce un video por su carpeta de Cloudinary o por su extensión', () => {
    expect(esVideo(VIDEO)).toBe(true);
    expect(esVideo('https://ejemplo.com/clip.webm')).toBe(true);
    expect(esVideo('https://ejemplo.com/clip.MP4?x=1')).toBe(true);
  });

  it('una imagen no es video', () => {
    expect(esVideo(IMAGEN)).toBe(false);
    expect(esVideo('')).toBe(false);
  });

  it('el póster de un video de Cloudinary es un fotograma en JPG', () => {
    expect(posterDe(VIDEO)).toBe('https://res.cloudinary.com/demo/video/upload/so_0/v1/devminds/projects/clip.jpg');
  });

  it('una imagen es su propio póster', () => {
    expect(posterDe(IMAGEN)).toBe(IMAGEN);
  });

  it('un video que no es de Cloudinary no tiene póster', () => {
    expect(posterDe('https://ejemplo.com/clip.webm')).toBeNull();
  });
});
