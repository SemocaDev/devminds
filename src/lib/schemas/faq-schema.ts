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
