# Core - Hexagonal Architecture

Este directorio contiene la lógica de negocio y la infraestructura del backend siguiendo la **Arquitectura Hexagonal** (Ports & Adapters).

## 📐 Arquitectura

```
src/core/
├── domain/              # Capa de Dominio (Lógica de Negocio)
│   └── contact/
│       ├── entities/    # Entidades de dominio
│       ├── ports/       # Contratos (interfaces)
│       └── use-cases/   # Casos de uso (lógica de negocio)
└── infrastructure/      # Capa de Infraestructura (Adaptadores)
    ├── email/           # Adaptadores para servicios de email
    └── repositories/    # Adaptadores para persistencia
```

## 🎯 Principios Aplicados

### 1. **Hexagonal Architecture (Ports & Adapters)**
- **Dominio** en el centro, independiente de implementaciones externas
- **Puertos** (interfaces) definen contratos
- **Adaptadores** (implementaciones) conectan con servicios externos

### 2. **Dependency Inversion Principle (DIP)**
- El dominio depende de **abstracciones** (IEmailService), no de **implementaciones** concretas (ResendEmailAdapter)
- Los adaptadores dependen del dominio, no al revés

### 3. **Single Responsibility Principle (SRP)**
- Cada clase tiene una única responsabilidad
- `ContactMessage`: Validar y representar un mensaje
- `SendContactMessage`: Coordinar el envío
- `ResendEmailAdapter`: Comunicarse con Resend API

### 4. **Open/Closed Principle (OCP)**
- Abierto a extensión: Puedes agregar nuevos adaptadores (SendGridAdapter, MailgunAdapter)
- Cerrado a modificación: No necesitas cambiar el dominio o casos de uso

## 🔧 Componentes

### Domain Layer

#### **Entities** (`domain/contact/entities/`)
Objetos de valor y entidades del dominio.

- `ContactMessage.ts`: Representa un mensaje de contacto con validaciones integradas

#### **Ports** (`domain/contact/ports/`)
Interfaces que definen contratos.

- `IEmailService.ts`: Contrato para enviar emails
- `IContactRepository.ts`: Contrato para persistir mensajes (opcional)

#### **Use Cases** (`domain/contact/use-cases/`)
Lógica de negocio de la aplicación.

- `SendContactMessage.ts`: Orquesta el envío de un mensaje de contacto

### Infrastructure Layer

#### **Email Adapters** (`infrastructure/email/`)
Implementaciones concretas de servicios de email.

- `ResendEmailAdapter.ts`: Implementación usando Resend
- `MockEmailAdapter.ts`: Implementación mock para desarrollo/testing
- `EmailServiceFactory.ts`: Factory para crear instancias según configuración

#### **Repositories** (`infrastructure/repositories/`)
Implementaciones de persistencia.

- `InMemoryContactRepository.ts`: Repositorio en memoria (para logging/testing)

## 🚀 Uso

### Configuración

1. **Instalar dependencias:**
   ```bash
   pnpm add resend
   ```

2. **Configurar variables de entorno** (`.env.local`):
   ```env
   EMAIL_PROVIDER=resend              # o 'mock' para development
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   RESEND_FROM_EMAIL=onboarding@resend.dev
   RESEND_TO_EMAIL=you@example.com
   ```

3. **Verificar dominio en Resend** (solo si usas email personalizado):
   - Ve a [Resend Dashboard](https://resend.com/domains)
   - Agrega y verifica tu dominio
   - Actualiza `RESEND_FROM_EMAIL` con tu dominio verificado

### Ejemplo de Uso en API Route

```typescript
import { SendContactMessage } from '@/core/domain/contact/use-cases/SendContactMessage';
import { EmailServiceFactory } from '@/core/infrastructure/email/EmailServiceFactory';

// Crear caso de uso con dependencias
const emailService = EmailServiceFactory.create();
const sendContactMessage = new SendContactMessage(emailService);

// Ejecutar
const result = await sendContactMessage.execute({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello!',
  subject: 'Contact Form'
});

if (result.success) {
  console.log('Email sent:', result.messageId);
} else {
  console.error('Error:', result.error);
}
```

## 🔌 Agregar un Nuevo Proveedor de Email

Para agregar un nuevo proveedor (ej: SendGrid):

1. **Crear el adaptador** (`infrastructure/email/SendGridEmailAdapter.ts`):
   ```typescript
   import { IEmailService } from '@/core/domain/contact/ports/IEmailService';
   import { ContactMessage } from '@/core/domain/contact/entities/ContactMessage';

   export class SendGridEmailAdapter implements IEmailService {
     async sendContactEmail(message: ContactMessage): Promise<string> {
       // Implementación con SendGrid API
     }
   }
   ```

2. **Actualizar el Factory** (`EmailServiceFactory.ts`):
   ```typescript
   case 'sendgrid':
     return new SendGridEmailAdapter();
   ```

3. **Configurar** (`.env.local`):
   ```env
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=xxxxx
   ```

**No necesitas modificar**:
- ❌ Entidades del dominio
- ❌ Casos de uso
- ❌ API routes
- ❌ Componentes React

## 🧪 Testing

### Usar Mock Adapter para Development

```env
EMAIL_PROVIDER=mock
```

Esto mostrará los emails en la consola sin enviarlos realmente.

### Testing Unitario de Dominio

```typescript
import { ContactMessage } from '@/core/domain/contact/entities/ContactMessage';

describe('ContactMessage', () => {
  it('should validate email format', () => {
    expect(() => {
      new ContactMessage('John', 'invalid-email', 'Hello');
    }).toThrow('Invalid email format');
  });
});
```

### Testing de Casos de Uso

```typescript
import { SendContactMessage } from '@/core/domain/contact/use-cases/SendContactMessage';
import { MockEmailAdapter } from '@/core/infrastructure/email/MockEmailAdapter';

describe('SendContactMessage', () => {
  it('should send email successfully', async () => {
    const emailService = new MockEmailAdapter();
    const useCase = new SendContactMessage(emailService);

    const result = await useCase.execute({
      name: 'John',
      email: 'john@example.com',
      message: 'Test'
    });

    expect(result.success).toBe(true);
  });
});
```

## 📊 Beneficios de esta Arquitectura

### ✅ **Testabilidad**
- Fácil crear mocks y stubs
- Testing unitario sin dependencias externas
- Testing de integración con adapters reales

### ✅ **Mantenibilidad**
- Código organizado por responsabilidad
- Cambios aislados en capas específicas
- Fácil entender el flujo

### ✅ **Escalabilidad**
- Agregar nuevos proveedores sin modificar dominio
- Fácil migrar entre servicios (Resend → SendGrid → Mailgun)
- Permite agregar features (rate limiting, analytics, logs)

### ✅ **Desacoplamiento**
- Dominio independiente de frameworks
- Fácil migrar de Next.js a otro framework
- Reutilizable en otros proyectos

## 🔮 Extensiones Futuras

Siguiendo esta arquitectura, puedes agregar fácilmente:

- **Multiple Email Providers**: Fallback automático si Resend falla
- **Analytics**: Trackear tasa de conversión de contactos
- **CRM Integration**: Sync con HubSpot, Salesforce, etc.
- **Queue System**: Procesar emails asíncronamente con BullMQ
- **Email Templates**: Sistema de plantillas dinámicas
- **Webhooks**: Notificar cuando se recibe un mensaje

## 📚 Recursos

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Dependency Inversion Principle](https://en.wikipedia.org/wiki/Dependency_inversion_principle)
- [Resend Documentation](https://resend.com/docs)
