/**
 * FAQ Schema para SEO
 * Ayuda a aparecer en la posición 0 de Google con respuestas directas
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(questions: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(qa => ({
      "@type": "Question",
      "name": qa.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": qa.answer
      }
    }))
  };
}

/**
 * FAQs predefinidas para la homepage en español
 */
export const faqsES: FAQItem[] = [
  {
    question: "¿Cuánto cuesta desarrollar un sitio web en Neiva?",
    answer: "El costo de desarrollo web en Neiva varía según complejidad. Una landing page simple puede costar desde $800.000 COP, mientras que una aplicación web completa puede ir desde $3.000.000 COP. Ofrecemos cotizaciones gratuitas adaptadas a tu presupuesto y necesidades."
  },
  {
    question: "¿Qué tecnologías utilizan para desarrollo web?",
    answer: "Utilizamos tecnologías modernas y escalables: Next.js y React para frontend, Node.js para backend, PostgreSQL y MongoDB para bases de datos, TypeScript para código más robusto, y WordPress cuando el cliente lo requiere. Todas son tecnologías profesionales usadas por empresas líderes."
  },
  {
    question: "¿Cuánto tiempo toma desarrollar un proyecto web?",
    answer: "El tiempo depende del alcance del proyecto. Una landing page puede estar lista en 1-2 semanas, un sitio web corporativo en 3-4 semanas, y una aplicación web compleja puede tomar 2-3 meses. Trabajamos con metodología ágil para entregas incrementales."
  },
  {
    question: "¿Ofrecen mantenimiento y soporte después del lanzamiento?",
    answer: "Sí, ofrecemos planes de mantenimiento mensual que incluyen actualizaciones de seguridad, corrección de bugs, optimizaciones de performance y soporte técnico prioritario. También ofrecemos capacitación para que puedas administrar tu sitio de forma independiente."
  },
  {
    question: "¿Trabajan con clientes fuera de Neiva?",
    answer: "Sí, aunque estamos basados en Neiva, Huila, trabajamos con clientes en toda Colombia y de forma remota a nivel internacional. Utilizamos herramientas de comunicación modernas para colaboración efectiva sin importar la ubicación."
  }
];

/**
 * FAQs predefinidas para la homepage en inglés
 */
export const faqsEN: FAQItem[] = [
  {
    question: "How much does it cost to develop a website in Neiva?",
    answer: "Web development costs in Neiva vary by complexity. A simple landing page can start from $200 USD, while a complete web application can range from $800 USD. We offer free quotes tailored to your budget and needs."
  },
  {
    question: "What technologies do you use for web development?",
    answer: "We use modern and scalable technologies: Next.js and React for frontend, Node.js for backend, PostgreSQL and MongoDB for databases, TypeScript for more robust code, and WordPress when clients require it. All are professional technologies used by leading companies."
  },
  {
    question: "How long does it take to develop a web project?",
    answer: "Time depends on project scope. A landing page can be ready in 1-2 weeks, a corporate website in 3-4 weeks, and a complex web application can take 2-3 months. We work with agile methodology for incremental deliveries."
  },
  {
    question: "Do you offer maintenance and support after launch?",
    answer: "Yes, we offer monthly maintenance plans that include security updates, bug fixes, performance optimizations and priority technical support. We also offer training so you can manage your site independently."
  },
  {
    question: "Do you work with clients outside Neiva?",
    answer: "Yes, although we are based in Neiva, Huila, we work with clients throughout Colombia and remotely at an international level. We use modern communication tools for effective collaboration regardless of location."
  }
];
