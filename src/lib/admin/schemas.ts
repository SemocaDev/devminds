import { z } from 'zod';

// ─── Translation schemas ───

const translationSchema = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
  ja: z.string().min(1),
});

// ─── Projects ───

export const projectSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  category: z.string().min(1),
  technologies: z.array(z.string().min(1)).min(1),
  images: z.array(z.string().min(1)),
  gradient: z.string().min(1),
  featured: z.boolean().default(false),
  github: z.string().url().nullable().optional(),
  demo: z.string().url().nullable().optional(),
  year: z.number().int().min(2000).max(2100),
  client: z.string().nullable().optional(),
  duration: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
  translations: z.object({
    title: translationSchema,
    description: translationSchema,
    fullDescription: translationSchema,
  }),
});

export const projectUpdateSchema = projectSchema.omit({ id: true }).partial();

// ─── Team Members ───

export const teamMemberSchema = z.object({
  id: z.string().min(1).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  nickname: z.string().nullable().optional(),
  hierarchy: z.enum(['founder', 'co-founder', 'developer', 'designer', 'marketing']),
  location: z.string().min(1),
  education: z.string().min(1),
  skills: z.array(z.string().min(1)).min(1),
  tools: z.array(z.string().min(1)).nullable().optional(),
  email: z.string().email().nullable().optional(),
  linkedin: z.string().url().nullable().optional(),
  github: z.string().url().nullable().optional(),
  photo: z.string().nullable().optional(),
  interests: z.array(z.object({
    icon: z.string().min(1),
    labelKey: z.string().min(1),
  })).default([]),
  startDate: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
  translations: z.object({
    role: translationSchema,
    specialization: translationSchema,
    bio: translationSchema,
  }),
});

export const teamMemberUpdateSchema = teamMemberSchema.omit({ id: true }).partial();

export type ProjectInput = z.infer<typeof projectSchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;

// ─── Client-side form schemas (pre-transform) ───

const translationFormSchema = z.object({
  es: z.string().min(1, 'Requerido en Español'),
  en: z.string().min(1, 'Requerido en English'),
  ja: z.string().min(1, 'Requerido en 日本語'),
});

export const projectFormSchema = z.object({
  id: z.string().min(1, 'ID requerido').regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  slug: z.string().min(1, 'Slug requerido').regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  category: z.string().min(1, 'Categoría requerida'),
  technologies: z.string().min(1, 'Al menos una tecnología'),
  images: z.array(z.string()).default([]),
  gradient: z.string().min(1, 'Gradiente requerido'),
  featured: z.boolean(),
  github: z.string().url('URL inválida').or(z.literal('')).optional(),
  demo: z.string().url('URL inválida').or(z.literal('')).optional(),
  year: z.coerce.number().int().min(2000, 'Año mínimo 2000').max(2100, 'Año máximo 2100'),
  client: z.string().optional(),
  duration: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  translations: z.object({
    title: translationFormSchema,
    description: translationFormSchema,
    fullDescription: translationFormSchema,
  }),
});

export const teamMemberFormSchema = z.object({
  id: z.string().min(1, 'ID requerido').regex(/^[a-z0-9-]+$/, 'Solo letras minúsculas, números y guiones'),
  name: z.string().min(1, 'Nombre requerido'),
  nickname: z.string().optional(),
  hierarchy: z.enum(['founder', 'co-founder', 'developer', 'designer', 'marketing']),
  location: z.string().min(1, 'Ubicación requerida'),
  education: z.string().min(1, 'Educación requerida'),
  skills: z.string().min(1, 'Al menos un skill'),
  tools: z.string().optional(),
  email: z.string().email('Email inválido').or(z.literal('')).optional(),
  linkedin: z.string().url('URL inválida').or(z.literal('')).optional(),
  github: z.string().url('URL inválida').or(z.literal('')).optional(),
  photo: z.string().optional(),
  interests: z.string().optional(),
  startDate: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  translations: z.object({
    role: translationFormSchema,
    specialization: translationFormSchema,
    bio: translationFormSchema,
  }),
});

export type ProjectFormInput = z.infer<typeof projectFormSchema>;
export type TeamMemberFormInput = z.infer<typeof teamMemberFormSchema>;
