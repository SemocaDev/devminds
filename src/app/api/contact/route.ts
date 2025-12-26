import { NextRequest, NextResponse } from 'next/server';
import { SendContactMessage, SendContactMessageDTO } from '@/core/domain/contact/use-cases/SendContactMessage';
import { EmailServiceFactory } from '@/core/infrastructure/email/EmailServiceFactory';
import { InMemoryContactRepository } from '@/core/infrastructure/repositories/InMemoryContactRepository';
import { EmailMetadata } from '@/core/domain/contact/ports/IEmailService';

/**
 * API Route: POST /api/contact
 * Maneja el envío de mensajes de contacto
 *
 * Arquitectura:
 * - Esta capa es solo un adaptador de entrada (HTTP)
 * - Convierte Request HTTP -> DTO del dominio
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
          error: 'Too many requests. Please try again later.',
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

    // 2. Parsear y validar el body
    const body = await request.json();

    // Validación básica de estructura
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Crear DTO
    const dto: SendContactMessageDTO = {
      name: body.name,
      email: body.email,
      message: body.message,
      subject: body.subject
    };

    // Extraer locale del body (enviado por el frontend)
    const locale = body.locale || 'es';

    // Crear metadata con información técnica
    const metadata: EmailMetadata = {
      ip: ip,
      userAgent: request.headers.get('user-agent') || 'unknown',
      timestamp: new Date().toISOString(),
      language: locale
    };

    // 3. Crear el caso de uso con dependencias
    const emailService = EmailServiceFactory.create();
    const contactRepository = new InMemoryContactRepository();
    const sendContactMessage = new SendContactMessage(emailService, contactRepository);

    // 4. Ejecutar el caso de uso con locale y metadata
    const result = await sendContactMessage.execute(dto, locale, metadata);

    // 5. Retornar respuesta apropiada
    if (result.success) {
      return NextResponse.json(
        {
          success: true,
          messageId: result.messageId,
          message: 'Message sent successfully'
        },
        { status: 200 }
      );
    } else {
      // Error en la lógica de negocio (validación, envío, etc.)
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to send message'
        },
        { status: 400 }
      );
    }
  } catch (error) {
    // Error inesperado del servidor
    console.error('[POST /api/contact] Unexpected error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error. Please try again later.'
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
