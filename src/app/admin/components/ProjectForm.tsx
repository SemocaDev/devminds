'use client';

import { useState } from 'react';
import Link from 'next/link';
import { projectFormSchema } from '@/lib/admin/schemas';
import SortableImageGrid from './SortableImageGrid';

const LOCALES = ['es', 'en', 'ja'] as const;
const LOCALE_LABELS = { es: 'Español', en: 'English', ja: '日本語' };
const CATEGORIES = ['web-app', 'wordpress', 'custom-code'];

type Props = {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  saving: boolean;
  initialData?: any;
  isEdit?: boolean;
};

type FieldErrors = Record<string, string>;

function getNestedError(errors: FieldErrors, path: string): string | undefined {
  return errors[path];
}

export default function ProjectForm({ onSubmit, saving, initialData, isEdit }: Props) {
  const [activeTab, setActiveTab] = useState<'es' | 'en' | 'ja'>('es');
  const [errors, setErrors] = useState<FieldErrors>({});

  const [form, setForm] = useState({
    id: initialData?.id || '',
    slug: initialData?.slug || '',
    category: initialData?.category || 'web-app',
    technologies: initialData?.technologies?.join(', ') || '',
    images: (initialData?.images as string[]) || [],
    gradient: initialData?.gradient || 'from-blue-600 to-cyan-600',
    featured: initialData?.featured ?? false,
    github: initialData?.github || '',
    demo: initialData?.demo || '',
    year: initialData?.year || new Date().getFullYear(),
    client: initialData?.client || '',
    duration: initialData?.duration || '',
    sortOrder: initialData?.sortOrder || 0,
    translations: initialData?.translations || {
      title: { es: '', en: '', ja: '' },
      description: { es: '', en: '', ja: '' },
      fullDescription: { es: '', en: '', ja: '' },
    },
  });

  function updateField(field: string, value: unknown) {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function updateTranslation(field: string, locale: string, value: string) {
    setForm(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [field]: { ...prev.translations[field as keyof typeof prev.translations], [locale]: value },
      },
    }));
    setErrors(prev => {
      const next = { ...prev };
      delete next[`translations.${field}.${locale}`];
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = projectFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }

      // Cambiar a la pestaña con error en traducciones
      for (const key of Object.keys(fieldErrors)) {
        const match = key.match(/^translations\.\w+\.(es|en|ja)$/);
        if (match) {
          setActiveTab(match[1] as 'es' | 'en' | 'ja');
          break;
        }
      }

      setErrors(fieldErrors);
      return;
    }

    const data = {
      ...form,
      technologies: form.technologies.split(',').map((t: string) => t.trim()).filter(Boolean),
      github: form.github || null,
      demo: form.demo || null,
      client: form.client || null,
      duration: form.duration || null,
      year: Number(form.year),
      sortOrder: Number(form.sortOrder),
    };
    await onSubmit(data);
  }

  const inputClass = 'w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm';
  const inputErrorClass = 'w-full px-4 py-2.5 bg-gray-800 border border-red-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm';
  const labelClass = 'block text-sm font-medium text-gray-300 mb-1.5';
  const errorClass = 'text-red-400 text-xs mt-1';

  function fieldInput(field: string) {
    return errors[field] ? inputErrorClass : inputClass;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Datos Generales */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-4">
        <h2 className="text-lg font-semibold mb-4">Datos Generales</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>ID *</label>
            <input className={fieldInput('id')} value={form.id} onChange={e => updateField('id', e.target.value)} disabled={isEdit} placeholder="mi-proyecto" />
            {errors.id && <p className={errorClass}>{errors.id}</p>}
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input className={fieldInput('slug')} value={form.slug} onChange={e => updateField('slug', e.target.value)} placeholder="mi-proyecto" />
            {errors.slug && <p className={errorClass}>{errors.slug}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Categoría *</label>
            <select className={fieldInput('category')} value={form.category} onChange={e => updateField('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Año *</label>
            <input type="number" className={fieldInput('year')} value={form.year} onChange={e => updateField('year', e.target.value)} />
            {errors.year && <p className={errorClass}>{errors.year}</p>}
          </div>
          <div>
            <label className={labelClass}>Orden</label>
            <input type="number" className={inputClass} value={form.sortOrder} onChange={e => updateField('sortOrder', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Cliente</label>
            <input className={inputClass} value={form.client} onChange={e => updateField('client', e.target.value)} placeholder="Nombre del cliente" />
          </div>
          <div>
            <label className={labelClass}>Duración</label>
            <input className={inputClass} value={form.duration} onChange={e => updateField('duration', e.target.value)} placeholder="2 meses" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Tecnologías * (separadas por coma)</label>
          <input className={fieldInput('technologies')} value={form.technologies} onChange={e => updateField('technologies', e.target.value)} placeholder="Next.js, TypeScript, PostgreSQL" />
          {errors.technologies && <p className={errorClass}>{errors.technologies}</p>}
        </div>

        <div>
          <label className={labelClass}>Imágenes</label>
          <SortableImageGrid
            images={form.images}
            onChange={(imgs) => updateField('images', imgs)}
            folder="projects"
          />
        </div>

        <div>
          <label className={labelClass}>Gradiente (clase Tailwind)</label>
          <input className={fieldInput('gradient')} value={form.gradient} onChange={e => updateField('gradient', e.target.value)} placeholder="from-blue-600 to-cyan-600" />
          {errors.gradient && <p className={errorClass}>{errors.gradient}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>GitHub URL</label>
            <input className={fieldInput('github')} value={form.github} onChange={e => updateField('github', e.target.value)} placeholder="https://github.com/..." />
            {errors.github && <p className={errorClass}>{errors.github}</p>}
          </div>
          <div>
            <label className={labelClass}>Demo URL</label>
            <input className={fieldInput('demo')} value={form.demo} onChange={e => updateField('demo', e.target.value)} placeholder="https://..." />
            {errors.demo && <p className={errorClass}>{errors.demo}</p>}
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.featured} onChange={e => updateField('featured', e.target.checked)} className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-cyan-500 focus:ring-cyan-500" />
          <span className="text-sm text-gray-300">Proyecto destacado (aparece en homepage)</span>
        </label>
      </div>

      {/* Traducciones */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold mb-4">Traducciones</h2>

        <div className="flex gap-1 mb-6 bg-gray-800 rounded-lg p-1">
          {LOCALES.map(locale => {
            const hasError = Object.keys(errors).some(k => k.endsWith(`.${locale}`));
            return (
              <button
                key={locale}
                type="button"
                onClick={() => setActiveTab(locale)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === locale ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
                } ${hasError ? 'ring-2 ring-red-500' : ''}`}
              >
                {LOCALE_LABELS[locale]}
              </button>
            );
          })}
        </div>

        {LOCALES.map(locale => (
          <div key={locale} className={`space-y-4 ${activeTab === locale ? '' : 'hidden'}`}>
            <div>
              <label className={labelClass}>Título ({LOCALE_LABELS[locale]}) *</label>
              <input className={fieldInput(`translations.title.${locale}`)} value={form.translations.title[locale]} onChange={e => updateTranslation('title', locale, e.target.value)} />
              {getNestedError(errors, `translations.title.${locale}`) && <p className={errorClass}>{getNestedError(errors, `translations.title.${locale}`)}</p>}
            </div>
            <div>
              <label className={labelClass}>Descripción corta ({LOCALE_LABELS[locale]}) *</label>
              <input className={fieldInput(`translations.description.${locale}`)} value={form.translations.description[locale]} onChange={e => updateTranslation('description', locale, e.target.value)} />
              {getNestedError(errors, `translations.description.${locale}`) && <p className={errorClass}>{getNestedError(errors, `translations.description.${locale}`)}</p>}
            </div>
            <div>
              <label className={labelClass}>Descripción completa ({LOCALE_LABELS[locale]}) *</label>
              <textarea className={`${fieldInput(`translations.fullDescription.${locale}`)} h-32`} value={form.translations.fullDescription[locale]} onChange={e => updateTranslation('fullDescription', locale, e.target.value)} />
              {getNestedError(errors, `translations.fullDescription.${locale}`) && <p className={errorClass}>{getNestedError(errors, `translations.fullDescription.${locale}`)}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Acciones */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear Proyecto'}
        </button>
        <Link href="/admin/projects" className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
