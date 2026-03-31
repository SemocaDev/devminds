'use client';

import { useState, KeyboardEvent } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { projectFormSchema } from '@/lib/admin/schemas';
import SortableImageGrid from './SortableImageGrid';

const LOCALES = ['es', 'en', 'ja'] as const;
const LOCALE_LABELS = { es: 'Español', en: 'English', ja: '日本語' };

const CATEGORY_OPTIONS = [
  { value: 'web-app', label: 'Aplicación Web' },
  { value: 'wordpress', label: 'WordPress / CMS' },
  { value: 'custom-code', label: 'Software a Medida' },
];

const GRADIENT_OPTIONS = [
  { value: 'from-blue-600 to-cyan-600', label: 'Océano' },
  { value: 'from-purple-600 to-pink-600', label: 'Púrpura' },
  { value: 'from-green-600 to-emerald-400', label: 'Bosque' },
  { value: 'from-orange-500 to-amber-400', label: 'Naranja' },
  { value: 'from-red-600 to-rose-400', label: 'Rojo' },
  { value: 'from-gray-700 to-gray-500', label: 'Gris' },
  { value: 'from-indigo-600 to-violet-600', label: 'Índigo' },
  { value: 'from-teal-600 to-cyan-400', label: 'Teal' },
];

type Props = {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  saving: boolean;
  initialData?: any;
  isEdit?: boolean;
};

type FieldErrors = Record<string, string>;

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getNestedError(errors: FieldErrors, path: string): string | undefined {
  return errors[path];
}

export default function ProjectForm({ onSubmit, saving, initialData, isEdit }: Props) {
  const [activeTab, setActiveTab] = useState<'es' | 'en' | 'ja'>('es');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [techInput, setTechInput] = useState('');

  const [form, setForm] = useState({
    id: initialData?.id || '',
    slug: initialData?.slug || '',
    category: initialData?.category || 'web-app',
    technologies: (initialData?.technologies as string[]) || [],
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
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
  }

  function updateTranslation(field: string, locale: string, value: string) {
    // Auto-fill ID from Spanish title when creating
    if (field === 'title' && locale === 'es' && !isEdit) {
      const newId = slugify(value);
      setForm(prev => ({
        ...prev,
        id: newId,
        slug: newId,
        translations: { ...prev.translations, [field]: { ...prev.translations[field as keyof typeof prev.translations], [locale]: value } },
      }));
    } else {
      setForm(prev => ({
        ...prev,
        translations: { ...prev.translations, [field]: { ...prev.translations[field as keyof typeof prev.translations], [locale]: value } },
      }));
    }
    setErrors(prev => { const n = { ...prev }; delete n[`translations.${field}.${locale}`]; return n; });
  }

  function addTech() {
    const val = techInput.trim();
    if (!val || form.technologies.includes(val)) return;
    updateField('technologies', [...form.technologies, val]);
    setTechInput('');
  }

  function removeTech(tech: string) {
    updateField('technologies', form.technologies.filter((t: string) => t !== tech));
  }

  function handleTechKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { e.preventDefault(); addTech(); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const toValidate = {
      ...form,
      technologies: form.technologies.join(', '),
    };

    const result = projectFormSchema.safeParse(toValidate);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        if (!fieldErrors[path]) fieldErrors[path] = issue.message;
      }
      for (const key of Object.keys(fieldErrors)) {
        const match = key.match(/^translations\.\w+\.(es|en|ja)$/);
        if (match) { setActiveTab(match[1] as 'es' | 'en' | 'ja'); break; }
      }
      setErrors(fieldErrors);
      return;
    }

    await onSubmit({
      ...form,
      github: form.github || null,
      demo: form.demo || null,
      client: form.client || null,
      duration: form.duration || null,
      year: Number(form.year),
      sortOrder: Number(form.sortOrder),
    });
  }

  const inputClass = 'w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm';
  const inputErrorClass = 'w-full px-4 py-2.5 bg-gray-800 border border-red-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm';
  const labelClass = 'block text-sm font-medium text-gray-300 mb-1.5';
  const errorClass = 'text-red-400 text-xs mt-1';

  function fieldInput(field: string) {
    return errors[field] ? inputErrorClass : inputClass;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">

      {/* Traducciones — primero para que el ID se auto-complete */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold mb-4">Contenido</h2>

        <div className="flex gap-1 mb-6 bg-gray-800 rounded-lg p-1">
          {LOCALES.map(locale => {
            const hasError = Object.keys(errors).some(k => k.endsWith(`.${locale}`));
            return (
              <button key={locale} type="button" onClick={() => setActiveTab(locale)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === locale ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'} ${hasError ? 'ring-2 ring-red-500' : ''}`}>
                {LOCALE_LABELS[locale]}
              </button>
            );
          })}
        </div>

        {LOCALES.map(locale => (
          <div key={locale} className={`space-y-4 ${activeTab === locale ? '' : 'hidden'}`}>
            <div>
              <label className={labelClass}>Título *</label>
              <input
                className={fieldInput(`translations.title.${locale}`)}
                value={form.translations.title[locale]}
                onChange={e => updateTranslation('title', locale, e.target.value)}
                placeholder={locale === 'es' ? 'Mi Proyecto Web' : locale === 'en' ? 'My Web Project' : 'ウェブプロジェクト'}
              />
              {locale === 'es' && !isEdit && (
                <p className="text-xs text-gray-500 mt-1">El ID se genera automáticamente desde este campo.</p>
              )}
              {getNestedError(errors, `translations.title.${locale}`) && <p className={errorClass}>{getNestedError(errors, `translations.title.${locale}`)}</p>}
            </div>
            <div>
              <label className={labelClass}>Descripción corta *</label>
              <input
                className={fieldInput(`translations.description.${locale}`)}
                value={form.translations.description[locale]}
                onChange={e => updateTranslation('description', locale, e.target.value)}
                placeholder="Una línea resumiendo el proyecto"
              />
              {getNestedError(errors, `translations.description.${locale}`) && <p className={errorClass}>{getNestedError(errors, `translations.description.${locale}`)}</p>}
            </div>
            <div>
              <label className={labelClass}>Descripción completa *</label>
              <textarea
                className={`${fieldInput(`translations.fullDescription.${locale}`)} h-28`}
                value={form.translations.fullDescription[locale]}
                onChange={e => updateTranslation('fullDescription', locale, e.target.value)}
                placeholder="Describe el proyecto, tecnologías usadas, desafíos, resultados..."
              />
              {getNestedError(errors, `translations.fullDescription.${locale}`) && <p className={errorClass}>{getNestedError(errors, `translations.fullDescription.${locale}`)}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Datos Generales */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-5">
        <h2 className="text-lg font-semibold">Datos del Proyecto</h2>

        {/* ID (solo lectura al editar, auto-generado al crear) */}
        <div>
          <label className={labelClass}>ID del proyecto</label>
          <input
            className={fieldInput('id')}
            value={form.id}
            onChange={e => { updateField('id', e.target.value); updateField('slug', e.target.value); }}
            disabled={isEdit}
            placeholder="se-genera-desde-el-titulo"
          />
          {errors.id && <p className={errorClass}>{errors.id}</p>}
          {isEdit && <p className="text-xs text-gray-500 mt-1">El ID no se puede cambiar una vez creado.</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Categoría */}
          <div>
            <label className={labelClass}>Categoría *</label>
            <div className="flex flex-col gap-2">
              {CATEGORY_OPTIONS.map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => updateField('category', opt.value)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-colors border ${form.category === opt.value ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400' : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Año + Cliente + Duración */}
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Año *</label>
              <input type="number" className={fieldInput('year')} value={form.year}
                onChange={e => updateField('year', e.target.value)} min={2000} max={2100} />
              {errors.year && <p className={errorClass}>{errors.year}</p>}
            </div>
            <div>
              <label className={labelClass}>Cliente <span className="text-gray-500 font-normal">(opcional)</span></label>
              <input className={inputClass} value={form.client}
                onChange={e => updateField('client', e.target.value)} placeholder="Nombre del cliente" />
            </div>
            <div>
              <label className={labelClass}>Duración <span className="text-gray-500 font-normal">(opcional)</span></label>
              <input className={inputClass} value={form.duration}
                onChange={e => updateField('duration', e.target.value)} placeholder="ej: 2 meses" />
            </div>
          </div>
        </div>

        {/* Tecnologías con chips */}
        <div>
          <label className={labelClass}>Tecnologías *</label>
          <div className="flex gap-2 mb-2">
            <input
              className={`flex-1 px-4 py-2.5 bg-gray-800 border ${errors.technologies ? 'border-red-500' : 'border-gray-700'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm`}
              value={techInput}
              onChange={e => setTechInput(e.target.value)}
              onKeyDown={handleTechKeyDown}
              placeholder="Ej: Next.js, TypeScript..."
            />
            <button type="button" onClick={addTech}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap">
              Agregar
            </button>
          </div>
          {form.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.technologies.map((tech: string) => (
                <span key={tech} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300">
                  {tech}
                  <button type="button" onClick={() => removeTech(tech)} className="text-gray-500 hover:text-red-400 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          {errors.technologies && <p className={errorClass}>{errors.technologies}</p>}
        </div>

        {/* Gradiente visual */}
        <div>
          <label className={labelClass}>Color de fondo</label>
          <div className="grid grid-cols-4 gap-2">
            {GRADIENT_OPTIONS.map(opt => (
              <button key={opt.value} type="button"
                onClick={() => updateField('gradient', opt.value)}
                className={`relative h-12 rounded-lg bg-gradient-to-r ${opt.value} transition-all ${form.gradient === opt.value ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-105' : 'opacity-70 hover:opacity-100'}`}
                title={opt.label}
              >
                {form.gradient === opt.value && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-medium">{opt.label}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Imágenes */}
        <div>
          <label className={labelClass}>Imágenes <span className="text-gray-500 font-normal">(opcional)</span></label>
          <SortableImageGrid images={form.images} onChange={(imgs) => updateField('images', imgs)} folder="projects" />
        </div>

        {/* URLs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>GitHub <span className="text-gray-500 font-normal">(opcional)</span></label>
            <input className={fieldInput('github')} value={form.github}
              onChange={e => updateField('github', e.target.value)} placeholder="https://github.com/..." />
            {errors.github && <p className={errorClass}>{errors.github}</p>}
            <p className="text-xs text-gray-500 mt-1">Vacío = "Proyecto Privado"</p>
          </div>
          <div>
            <label className={labelClass}>Demo <span className="text-gray-500 font-normal">(opcional)</span></label>
            <input className={fieldInput('demo')} value={form.demo}
              onChange={e => updateField('demo', e.target.value)} placeholder="https://..." />
            {errors.demo && <p className={errorClass}>{errors.demo}</p>}
            <p className="text-xs text-gray-500 mt-1">Vacío = no se muestra botón demo</p>
          </div>
        </div>

        {/* Destacado */}
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 transition-colors">
          <input type="checkbox" checked={form.featured} onChange={e => updateField('featured', e.target.checked)}
            className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-cyan-500 focus:ring-cyan-500" />
          <div>
            <span className="text-sm font-medium text-gray-200">Proyecto destacado</span>
            <p className="text-xs text-gray-500">Aparece en la sección de proyectos de la página principal.</p>
          </div>
        </label>
      </div>

      {/* Acciones */}
      <div className="flex gap-4">
        <button type="submit" disabled={saving}
          className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">
          {saving ? 'Guardando...' : isEdit ? 'Actualizar Proyecto' : 'Crear Proyecto'}
        </button>
        <Link href="/admin/projects"
          className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
