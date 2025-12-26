# 📧 Contact Form Implementation - DevMinds

## ✅ Implementación Completa

Se ha implementado un formulario de contacto completamente funcional siguiendo la **Arquitectura Hexagonal** (Ports & Adapters) para garantizar escalabilidad, mantenibilidad y desacoplamiento.

---

## 🏗️ Arquitectura Implementada

### 📁 Estructura de Archivos

```
src/
├── core/                                    # Backend con Arquitectura Hexagonal
│   ├── domain/                              # Capa de Dominio
│   │   └── contact/
│   │       ├── entities/
│   │       │   └── ContactMessage.ts        # Entidad con validaciones
│   │       ├── ports/
│   │       │   ├── IEmailService.ts         # Contrato para email
│   │       │   └── IContactRepository.ts    # Contrato para persistencia
│   │       └── use-cases/
│   │           └── SendContactMessage.ts    # Lógica de negocio
│   ├── infrastructure/                      # Capa de Infraestructura
│   │   ├── email/
│   │   │   ├── ResendEmailAdapter.ts        # Implementación con Resend
│   │   │   ├── MockEmailAdapter.ts          # Mock para development
│   │   │   └── EmailServiceFactory.ts       # Factory pattern
│   │   └── repositories/
│   │       └── InMemoryContactRepository.ts # Repositorio en memoria
│   └── README.md                            # Documentación de arquitectura
│
├── app/
│   ├── api/
│   │   └── contact/
│   │       └── route.ts                     # API Route con rate limiting
│   └── [lang]/
│       └── contact/
│           └── page.tsx                     # Frontend del formulario
│
├── .env.local                               # Variables de entorno (no committed)
└── .env.example                             # Template de variables de entorno
```

---

## 🎯 Características Implementadas

### Backend (Arquitectura Hexagonal)

✅ **Validación Robusta**
- Validación en la entidad de dominio
- Validación de email con regex
- Límite de longitud de mensaje (5000 caracteres)
- Sanitización de inputs

✅ **Múltiples Adaptadores de Email**
- **ResendEmailAdapter**: Producción con Resend API
- **MockEmailAdapter**: Development (logs en consola)
- **Factory Pattern**: Cambiar proveedor por configuración

✅ **Rate Limiting**
- Límite de 3 requests por minuto por IP
- Protección contra spam
- Headers HTTP apropiados (`Retry-After`)

✅ **Manejo de Errores**
- Try-catch en todas las capas
- Errores descriptivos
- Logging para debugging
- Respuestas HTTP apropiadas

✅ **Seguridad**
- Escapado de HTML (prevención de XSS)
- Validación de tipos
- Rate limiting
- CORS configurado

### Frontend (React + Next.js)

✅ **UI/UX Profesional**
- Validación en tiempo real
- Estados visuales claros (idle, loading, success, error)
- Animaciones suaves con Framer Motion
- Feedback inmediato al usuario
- Accesibilidad (labels, ARIA)

✅ **Manejo de Estado**
- React hooks (`useState`)
- Estado de formulario tipado (TypeScript)
- Limpieza de formulario después del envío exitoso
- Mensajes de error por campo

✅ **Validación Frontend**
- Validación antes de enviar
- Errores específicos por campo
- Validación de formato de email
- Campos requeridos marcados

---

## 🔧 Configuración

### 1. Variables de Entorno

Crear `.env.local` con:

```env
# Email Provider
EMAIL_PROVIDER=resend     # o 'mock' para development

# Resend Configuration
RESEND_API_KEY=re_2QHYgkxv_3hrazJGTn1qeVoQMpLrxe3tH
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=semoca00@gmail.com
```

### 2. Instalación

Resend ya está instalado:
```bash
pnpm add resend  # ✅ Ya hecho
```

### 3. Uso

El formulario está en: `/contact` (en todos los idiomas)

---

## 🚀 Flujo de Funcionamiento

```
1. Usuario llena el formulario
   └─> Frontend valida los campos

2. Usuario envía el formulario
   └─> POST /api/contact

3. API Route recibe la request
   ├─> Verifica rate limit
   ├─> Valida el body
   └─> Crea el DTO

4. Caso de Uso (SendContactMessage)
   ├─> Crea entidad ContactMessage (valida automáticamente)
   ├─> (Opcional) Persiste en repositorio
   └─> Llama al servicio de email

5. Email Service (ResendEmailAdapter)
   ├─> Construye el email HTML bonito
   ├─> Envía vía Resend API
   └─> Retorna messageId

6. API Route responde
   └─> Frontend muestra mensaje de éxito/error
```

---

## 📧 Template de Email

El email enviado incluye:

- ✅ **Header**: Diseño profesional con gradiente
- ✅ **Información del remitente**: Nombre, Email
- ✅ **Subject**: (Opcional)
- ✅ **Mensaje**: Formateado con saltos de línea
- ✅ **Timestamp**: Fecha y hora del mensaje
- ✅ **Versión HTML + Text**: Para compatibilidad
- ✅ **Reply-To**: Configurado al email del remitente

---

## 🧪 Testing

### Development Mode (Mock Email)

```env
EMAIL_PROVIDER=mock
```

Los emails se mostrarán en la consola del servidor:

```
📧 [MockEmailAdapter] Email would be sent:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
From: John Doe <john@example.com>
Subject: Project Inquiry
Message:
I would like to discuss a project...

Timestamp: 2024-01-15T10:30:00.000Z
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Production Mode (Resend)

```env
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

Emails se enviarán realmente via Resend.

---

## 🎨 Principios de Arquitectura

### ✅ Hexagonal Architecture (Ports & Adapters)
- **Dominio** en el centro (lógica de negocio pura)
- **Puertos** (interfaces) definen contratos
- **Adaptadores** conectan con servicios externos
- **Fácil cambiar** proveedores sin modificar el dominio

### ✅ SOLID Principles

**S** - Single Responsibility
- `ContactMessage`: Solo validar y representar
- `SendContactMessage`: Solo coordinar envío
- `ResendEmailAdapter`: Solo comunicarse con Resend

**O** - Open/Closed
- Abierto a extensión (agregar SendGridAdapter)
- Cerrado a modificación (no tocar el dominio)

**L** - Liskov Substitution
- Cualquier `IEmailService` puede reemplazarse

**I** - Interface Segregation
- Interfaces específicas y pequeñas

**D** - Dependency Inversion
- Dominio depende de abstracciones, no implementaciones

---

## 🔌 Agregar Nuevos Proveedores

### Ejemplo: SendGrid

1. **Crear adaptador**:
```typescript
// src/core/infrastructure/email/SendGridEmailAdapter.ts
export class SendGridEmailAdapter implements IEmailService {
  async sendContactEmail(message: ContactMessage): Promise<string> {
    // Implementación con SendGrid
  }
}
```

2. **Actualizar Factory**:
```typescript
case 'sendgrid':
  return new SendGridEmailAdapter();
```

3. **Configurar**:
```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=xxxxx
```

**No necesitas cambiar**:
- ❌ Entidades
- ❌ Casos de uso
- ❌ API routes
- ❌ Frontend

---

## 📊 Beneficios

### ✅ Mantenibilidad
- Código organizado y fácil de entender
- Cambios aislados por capa
- Documentación clara

### ✅ Testabilidad
- Fácil crear mocks
- Testing unitario sin dependencias externas
- Testing de integración con adaptadores reales

### ✅ Escalabilidad
- Agregar proveedores sin modificar dominio
- Migrar entre servicios fácilmente
- Agregar features (analytics, webhooks, etc.)

### ✅ Desacoplamiento
- Independiente de frameworks
- Reutilizable en otros proyectos
- Fácil migrar de Next.js a otro framework

---

## 🔮 Extensiones Futuras

Con esta arquitectura, puedes agregar fácilmente:

- [ ] **Multiple Email Providers**: Fallback si Resend falla
- [ ] **Analytics**: Trackear tasa de conversión
- [ ] **CRM Integration**: Sync con HubSpot, Salesforce
- [ ] **Queue System**: Procesar emails asíncronamente
- [ ] **Email Templates**: Sistema de plantillas dinámicas
- [ ] **Webhooks**: Notificar cuando se recibe mensaje
- [ ] **Admin Dashboard**: Ver mensajes recibidos
- [ ] **Auto-responder**: Email automático al usuario

---

## 📚 Recursos

- [Resend Documentation](https://resend.com/docs)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

## ✅ Checklist de Implementación

- [x] Arquitectura hexagonal configurada
- [x] Entidad ContactMessage con validaciones
- [x] Casos de uso implementados
- [x] Adaptador Resend implementado
- [x] Adaptador Mock para development
- [x] Factory pattern para cambiar proveedores
- [x] API Route con rate limiting
- [x] Frontend con validación y feedback
- [x] Variables de entorno configuradas
- [x] Resend API key configurada
- [x] Email template HTML profesional
- [x] Manejo de errores robusto
- [x] TypeScript types completos
- [x] Documentación completa
- [x] Build sin errores ✅

---

## 🎉 ¡Todo Listo!

El formulario de contacto está **completamente funcional** y listo para producción.

Visita `/contact` para probarlo.

**Estado**: ✅ Producción Ready
**Última actualización**: 2024-01-15
