'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type ProjectRow = {
  id: string;
  slug: string;
  category: string;
  featured: boolean;
  year: number;
  client: string | null;
  sortOrder: number;
  translations: { locale: string; title: string }[];
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm(`¿Eliminar proyecto "${id}"?`)) return;
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    setProjects(prev => prev.filter(p => p.id !== id));
  }

  if (loading) return <div className="text-gray-400">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Proyectos</h1>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Nuevo Proyecto
        </Link>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Título (ES)</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Categoría</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Año</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Featured</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const esTitle = project.translations.find(t => t.locale === 'es')?.title || project.id;
              return (
                <tr key={project.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-6 py-4 text-sm">{esTitle}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{project.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{project.year}</td>
                  <td className="px-6 py-4 text-sm">
                    {project.featured ? <span className="text-cyan-400">Sí</span> : <span className="text-gray-500">No</span>}
                  </td>
                  <td className="px-6 py-4 text-sm text-right space-x-2">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {projects.length === 0 && (
          <div className="text-center py-12 text-gray-500">No hay proyectos aún</div>
        )}
      </div>
    </div>
  );
}
