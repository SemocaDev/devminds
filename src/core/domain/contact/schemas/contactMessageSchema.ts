import { z } from 'zod';

/**
 * Schema Zod para validación del formulario de contacto
 * Compartido entre frontend y backend para garantizar consistencia
 */
export const contactMessageSchema = z.object({
  name: z
    .string()
    .min(1, 'NAME_REQUIRED')
    .min(2, 'NAME_TOO_SHORT')
    .max(100, 'NAME_TOO_LONG')
    .refine(
      (val) => /^(?=.*[a-zA-ZÀ-ÿ])[a-zA-ZÀ-ÿ\s'-]+$/.test(val.trim()),
      'NAME_INVALID_FORMAT'
    )
    .transform((val) => val.trim()),

  email: z
    .string()
    .min(1, 'EMAIL_REQUIRED')
    .email('EMAIL_INVALID')
    .max(254, 'EMAIL_TOO_LONG')
    .transform((val) => val.trim().toLowerCase()),

  subject: z
    .string()
    .max(200, 'SUBJECT_TOO_LONG')
    .transform((val) => val?.trim() || '')
    .optional(),

  message: z
    .string()
    .min(1, 'MESSAGE_REQUIRED')
    .min(10, 'MESSAGE_TOO_SHORT')
    .max(5000, 'MESSAGE_TOO_LONG')
    .transform((val) => val.trim()),

  // Honeypot field - debe estar vacío para usuarios reales
  website: z
    .string()
    .default('')
    .optional(),
});

export type ContactFormData = z.infer<typeof contactMessageSchema>;

/**
 * Schema extendido para la API
 * Incluye el campo locale para soporte multiidioma
 */
export const contactApiSchema = contactMessageSchema.extend({
  locale: z.enum(['es', 'en', 'ja']).optional().default('es'),
});

export type ContactApiData = z.infer<typeof contactApiSchema>;
