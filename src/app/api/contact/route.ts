import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { SendContactMessage, SendContactMessageDTO } from '@/core/domain/contact/use-cases/SendContactMessage';
import { EmailServiceFactory } from '@/core/infrastructure/email/EmailServiceFactory';
import { InMemoryContactRepository } from '@/core/infrastructure/repositories/InMemoryContactRepository';
import { EmailMetadata } from '@/core/domain/contact/ports/IEmailService';
import { contactApiSchema } from '@/core/domain/contact/schemas/contactMessageSchema';

/**
 * API Route: POST /api/contact
 * Maneja el envío de mensajes de contacto con validación Zod y protección anti-spam
 *
 * Arquitectura:
 * - Esta capa es solo un adaptador de entrada (HTTP)
 * - Convierte Request HTTP -> DTO del dominio
 * - Valida con Zod antes de ejecutar caso de uso
 * - Verifica honeypot para detectar bots
 * - Ejecuta el caso de uso
 * - Convierte resultado -> Response HTTP
 */

// Rate limiting simple en memoria (en producción usar Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const RATE_LIMIT_MAX_REQUESTS = 3; // 3 requests por minuto

/**
 * Verifica el rate limit para una IP
 */
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    // Nueva ventana de tiempo
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    // Límite excedido
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  // Incrementar contador
  record.count++;
  return { allowed: true };
}

/**
 * POST /api/contact
 * Envía un mensaje de contacto
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          errorCode: 'RATE_LIMIT_EXCEEDED',
          retryAfter: rateLimit.retryAfter
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfter || 60)
          }
        }
      );
    }

    // 2. Parsear body
    const body = await request.json();

    // 3. Validar con Zod
    let validatedData;
    try {
      validatedData = contactApiSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            success: false,
            errorCode: 'VALIDATION_ERROR',
            errors: error.flatten().fieldErrors
          },
          { status: 400 }
        );
      }
      throw error;
    }

    // 4. Verificar honeypot
    if (validatedData.website && validatedData.website.trim() !== '') {
      console.warn('[SPAM DETECTED] Honeypot triggered:', {
        ip,
        timestamp: new Date().toISOString(),
        website: validatedData.website
      });

      // Responder exitosamente para no alertar al bot
      return NextResponse.json(
        { success: true, messageId: 'spam-blocked' },
        { status: 200 }
      );
    }

    // 5. Crear DTO (sin el campo website)
    const dto: SendContactMessageDTO = {
      name: validatedData.name,
      email: validatedData.email,
      message: validatedData.message,
      subject: validatedData.subject
    };

    // 6. Crear metadata con información técnica
    const metadata: EmailMetadata = {
      ip: ip,
      userAgent: request.headers.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString(),
      language: validatedData.locale
    };

    // 7. Ejecutar el caso de uso con dependencias
    const emailService = EmailServiceFactory.create();
    const contactRepository = new InMemoryContactRepository();
    const sendContactMessage = new SendContactMessage(emailService, contactRepository);

    const result = await sendContactMessage.execute(dto, validatedData.locale, metadata);

    // 8. Retornar respuesta
    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          messageId: result.messageId,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          errorCode: 'SEND_FAILED',
          error: result.error
        },
        { status: 500 }
      );
    }
  } catch (error) {
    // Error inesperado del servidor
    console.error('[POST /api/contact] Unexpected error:', error);

    return NextResponse.json(
      {
        success: false,
        errorCode: 'SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/contact
 * Maneja CORS preflight requests
 */
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    }
  );
}
