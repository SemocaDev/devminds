'use client';

import { useState } from 'react';
import Link from 'next/link';
import { teamMemberFormSchema } from '@/lib/admin/schemas';
import ImageUpload from './ImageUpload';
import { X, Plus } from 'lucide-react';

const LOCALES = ['es', 'en', 'ja'] as const;
const LOCALE_LABELS = { es: 'Español', en: 'English', ja: '日本語' };
const HIERARCHIES = ['founder', 'co-founder', 'developer', 'designer', 'marketing'];

// Iconos disponibles (deben coincidir con iconMap en AboutClient.tsx)
const AVAILABLE_ICONS = [
  { value: 'Gamepad2', label: 'Gamepad (Juegos)' },
  { value: 'BookOpen', label: 'Libro (Lectura)' },
  { value: 'ChefHat', label: 'Chef (Cocina)' },
  { value: 'Code2', label: 'Código (Programación)' },
  { value: 'Database', label: 'Base de datos' },
];

// Labels disponibles (deben coincidir con About.interests.* en messages)
const AVAILABLE_LABELS = [
  { value: 'gaming', label: 'Videojuegos' },
  { value: 'anime', label: 'Anime' },
  { value: 'manga', label: 'Manga' },
  { value: 'cooking', label: 'Cocinar' },
  { value: 'systemDesign', label: 'Diseño de Sistemas' },
  { value: 'databases', label: 'Bases de Datos' },
  { value: 'reading', label: 'Lectura' },
  { value: 'coding', label: 'Programación' },
];

type Interest = { icon: string; labelKey: string };

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

function parseInterests(raw: unknown): Interest[] {
  if (Array.isArray(raw)) {
    return raw.filter((item): item is Interest =>
      typeof item === 'object' && item !== null && 'icon' in item && 'labelKey' in item
    );
  }
  return [];
}

export default function TeamMemberForm({ onSubmit, saving, initialData, isEdit }: Props) {
  const [activeTab, setActiveTab] = useState<'es' | 'en' | 'ja'>('es');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [interests, setInterests] = useState<Interest[]>(parseInterests(initialData?.interests));

  const [form, setForm] = useState({
    id: initialData?.id || '',
    name: initialData?.name || '',
    nickname: initialData?.nickname || '',
    hierarchy: initialData?.hierarchy || 'developer',
    location: initialData?.location || '',
    education: initialData?.education || '',
    skills: initialData?.skills?.join(', ') || '',
    tools: initialData?.tools?.join(', ') || '',
    email: initialData?.email || '',
    linkedin: initialData?.linkedin || '',
    github: initialData?.github || '',
    photo: initialData?.photo || '',
    interests: JSON.stringify(initialData?.interests || []),
    startDate: initialData?.startDate || '',
    sortOrder: initialData?.sortOrder || 0,
    translations: initialData?.translations || {
      role: { es: '', en: '', ja: '' },
      specialization: { es: '', en: '', ja: '' },
      bio: { es: '', en: '', ja: '' },
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

  function addInterest() {
    setInterests(prev => [...prev, { icon: 'Code2', labelKey: 'coding' }]);
  }

  function updateInterest(index: number, field: keyof Interest, value: string) {
    setInterests(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  }

  function removeInterest(index: number) {
    setInterests(prev => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    // Sincronizar interests al form para la validación Zod
    const formWithInterests = { ...form, interests: JSON.stringify(interests) };

    const result = teamMemberFormSchema.safeParse(formWithInterests);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join('.');
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }

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
      skills: form.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
      tools: form.tools ? form.tools.split(',').map((t: string) => t.trim()).filter(Boolean) : null,
      nickname: form.nickname || null,
      email: form.email || null,
      linkedin: form.linkedin || null,
      github: form.github || null,
      photo: form.photo || null,
      startDate: form.startDate || null,
      sortOrder: Number(form.sortOrder),
      interests,
    };
    await onSubmit(data);
  }

  const inputClass = 'w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-sm';
  const inputErrorClass = 'w-full px-4 py-2.5 bg-gray-800 border border-red-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm';
  const labelClass = 'block text-sm font-medium text-gray-300 mb-1.5';
  const errorClass = 'text-red-400 text-xs mt-1';
  const selectClass = 'px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500';

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
            <input className={fieldInput('id')} value={form.id} onChange={e => updateField('id', e.target.value)} disabled={isEdit} placeholder="nombre-apellido" />
            {errors.id && <p className={errorClass}>{errors.id}</p>}
          </div>
          <div>
            <label className={labelClass}>Nombre completo *</label>
            <input className={fieldInput('name')} value={form.name} onChange={e => updateField('name', e.target.value)} />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Nickname</label>
            <input className={inputClass} value={form.nickname} onChange={e => updateField('nickname', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Jerarquía *</label>
            <select className={inputClass} value={form.hierarchy} onChange={e => updateField('hierarchy', e.target.value)}>
              {HIERARCHIES.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Orden</label>
            <input type="number" className={inputClass} value={form.sortOrder} onChange={e => updateField('sortOrder', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Ubicación *</label>
            <input className={fieldInput('location')} value={form.location} onChange={e => updateField('location', e.target.value)} placeholder="Neiva, Huila, Colombia" />
            {errors.location && <p className={errorClass}>{errors.location}</p>}
          </div>
          <div>
            <label className={labelClass}>Educación *</label>
            <input className={fieldInput('education')} value={form.education} onChange={e => updateField('education', e.target.value)} />
            {errors.education && <p className={errorClass}>{errors.education}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Skills * (separados por coma)</label>
          <input className={fieldInput('skills')} value={form.skills} onChange={e => updateField('skills', e.target.value)} placeholder="Next.js, TypeScript, PostgreSQL" />
          {errors.skills && <p className={errorClass}>{errors.skills}</p>}
        </div>

        <div>
          <label className={labelClass}>Herramientas (separadas por coma)</label>
          <input className={inputClass} value={form.tools} onChange={e => updateField('tools', e.target.value)} placeholder="Git, GitHub, Jira" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" className={fieldInput('email')} value={form.email} onChange={e => updateField('email', e.target.value)} />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>
          <div>
            <label className={labelClass}>LinkedIn</label>
            <input className={fieldInput('linkedin')} value={form.linkedin} onChange={e => updateField('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." />
            {errors.linkedin && <p className={errorClass}>{errors.linkedin}</p>}
          </div>
          <div>
            <label className={labelClass}>GitHub</label>
            <input className={fieldInput('github')} value={form.github} onChange={e => updateField('github', e.target.value)} placeholder="https://github.com/..." />
            {errors.github && <p className={errorClass}>{errors.github}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Foto</label>
            <ImageUpload
              value={form.photo || null}
              onChange={(url) => updateField('photo', url || '')}
              folder="team"
            />
          </div>
          <div>
            <label className={labelClass}>Fecha de inicio</label>
            <input type="date" className={inputClass} value={form.startDate} onChange={e => updateField('startDate', e.target.value)} />
          </div>
        </div>

        {/* Intereses */}
        <div>
          <label className={labelClass}>Intereses</label>
          <div className="space-y-2">
            {interests.map((interest, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={interest.icon}
                  onChange={e => updateInterest(index, 'icon', e.target.value)}
                  className={selectClass}
                >
                  {AVAILABLE_ICONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <select
                  value={interest.labelKey}
                  onChange={e => updateInterest(index, 'labelKey', e.target.value)}
                  className={`${selectClass} flex-1`}
                >
                  {AVAILABLE_LABELS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeInterest(index)}
                  className="w-8 h-8 flex items-center justify-center rounded bg-red-600/20 hover:bg-red-600/40 text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addInterest}
              className="flex items-center gap-2 px-3 py-2 text-sm text-cyan-400 hover:text-cyan-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar interés
            </button>
          </div>
        </div>
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
              <label className={labelClass}>Rol ({LOCALE_LABELS[locale]}) *</label>
              <input className={fieldInput(`translations.role.${locale}`)} value={form.translations.role[locale]} onChange={e => updateTranslation('role', locale, e.target.value)} placeholder="Ingeniero de Software" />
              {getNestedError(errors, `translations.role.${locale}`) && <p className={errorClass}>{getNestedError(errors, `translations.role.${locale}`)}</p>}
            </div>
            <div>
              <label className={labelClass}>Especialización ({LOCALE_LABELS[locale]}) *</label>
              <input className={fieldInput(`translations.specialization.${locale}`)} value={form.translations.specialization[locale]} onChange={e => updateTranslation('specialization', locale, e.target.value)} />
              {getNestedError(errors, `translations.specialization.${locale}`) && <p className={errorClass}>{getNestedError(errors, `translations.specialization.${locale}`)}</p>}
            </div>
            <div>
              <label className={labelClass}>Biografía ({LOCALE_LABELS[locale]}) *</label>
              <textarea className={`${fieldInput(`translations.bio.${locale}`)} h-32`} value={form.translations.bio[locale]} onChange={e => updateTranslation('bio', locale, e.target.value)} />
              {getNestedError(errors, `translations.bio.${locale}`) && <p className={errorClass}>{getNestedError(errors, `translations.bio.${locale}`)}</p>}
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
          {saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear Miembro'}
        </button>
        <Link href="/admin/team" className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
