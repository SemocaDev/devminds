'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ProjectForm from '@/app/admin/components/ProjectForm';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/projects/${id}`)
      .then(r => r.json())
      .then(data => {
        // Transform API data into form-friendly format
        const translations = {
          title: { es: '', en: '', ja: '' },
          description: { es: '', en: '', ja: '' },
          fullDescription: { es: '', en: '', ja: '' },
        };
        for (const t of data.translations || []) {
          const locale = t.locale as 'es' | 'en' | 'ja';
          translations.title[locale] = t.title;
          translations.description[locale] = t.description;
          translations.fullDescription[locale] = t.fullDescription;
        }
        setInitialData({ ...data, translations });
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(data: Record<string, unknown>) {
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Error al guardar');
        return;
      }
      router.push('/admin/projects');
    } catch {
      setError('Error de conexión');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-gray-400">Cargando...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Editar Proyecto</h1>
      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm mb-6">{error}</div>}
      <ProjectForm onSubmit={handleSubmit} saving={saving} initialData={initialData} isEdit />
    </div>
  );
}
