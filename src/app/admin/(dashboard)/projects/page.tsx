'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { GripVertical, Pencil, Trash2, Loader2, Star } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const CATEGORY_LABELS: Record<string, string> = {
  'web-app': 'Aplicación Web',
  'wordpress': 'WordPress / CMS',
  'custom-code': 'Software a Medida',
};

type ProjectRow = {
  id: string;
  category: string;
  featured: boolean;
  year: number;
  sortOrder: number;
  translations: { locale: string; title: string }[];
};

function SortableRow({ project, onDelete, onToggleFeatured }: {
  project: ProjectRow;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, current: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });
  const esTitle = project.translations.find(t => t.locale === 'es')?.title || project.id;

  return (
    <tr
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="border-b border-gray-800/50 hover:bg-gray-800/30"
    >
      <td className="px-3 py-4 w-10">
        <button
          {...attributes}
          {...listeners}
          className="text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing p-1 rounded"
          type="button"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </td>
      <td className="px-4 py-4 text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleFeatured(project.id, project.featured)}
            title={project.featured ? 'Quitar de destacados' : 'Marcar como destacado'}
            className={`transition-colors flex-shrink-0 ${project.featured ? 'text-cyan-400 hover:text-gray-500' : 'text-gray-700 hover:text-cyan-400'}`}
          >
            <Star className="w-3.5 h-3.5" fill={project.featured ? 'currentColor' : 'none'} />
          </button>
          {esTitle}
        </div>
      </td>
      <td className="px-4 py-4 text-sm text-gray-400">
        {CATEGORY_LABELS[project.category] ?? project.category}
      </td>
      <td className="px-4 py-4 text-sm text-gray-400">{project.year}</td>
      <td className="px-4 py-4 text-sm text-right">
        <div className="flex items-center justify-end gap-3">
          <Link href={`/admin/projects/${project.id}/edit`}
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
            <Pencil className="w-3.5 h-3.5" />
            Editar
          </Link>
          <button onClick={() => onDelete(project.id)} type="button"
            className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then(data => setProjects(data.sort((a: ProjectRow, b: ProjectRow) => a.sortOrder - b.sortOrder)))
      .finally(() => setLoading(false));
  }, []);

  const saveOrder = useCallback(async (ordered: ProjectRow[]) => {
    setReordering(true);
    try {
      await fetch('/api/admin/projects/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: ordered.map(p => p.id) }),
      });
    } finally {
      setReordering(false);
    }
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setProjects(prev => {
      const oldIndex = prev.findIndex(p => p.id === active.id);
      const newIndex = prev.findIndex(p => p.id === over.id);
      const reordered = arrayMove(prev, oldIndex, newIndex);
      saveOrder(reordered);
      return reordered;
    });
  }

  async function handleToggleFeatured(id: string, current: boolean) {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, featured: !current } : p));
    await fetch(`/api/admin/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !current }),
    });
  }

  async function handleDelete(id: string) {
    const title = projects.find(p => p.id === id)?.translations.find(t => t.locale === 'es')?.title || id;
    if (!confirm(`¿Eliminar el proyecto "${title}"? Esta acción no se puede deshacer.`)) return;
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
    setProjects(prev => prev.filter(p => p.id !== id));
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (loading) return <div className="text-gray-400 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Proyectos</h1>
          <p className="text-sm text-gray-500 mt-1">Arrastra las filas para reordenar. El orden se guarda automáticamente.</p>
        </div>
        <div className="flex items-center gap-3">
          {reordering && (
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" /> Guardando orden...
            </span>
          )}
          <Link href="/admin/projects/new"
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors">
            + Nuevo Proyecto
          </Link>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        {projects.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="mb-4">No hay proyectos aún.</p>
            <Link href="/admin/projects/new" className="text-cyan-400 hover:text-cyan-300">Crea el primero →</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="w-10 px-3 py-4" />
                <th className="text-left px-4 py-4 text-sm font-medium text-gray-400">Título</th>
                <th className="text-left px-4 py-4 text-sm font-medium text-gray-400">Categoría</th>
                <th className="text-left px-4 py-4 text-sm font-medium text-gray-400">Año</th>
                <th className="text-right px-4 py-4 text-sm font-medium text-gray-400">Acciones</th>
              </tr>
            </thead>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                <tbody>
                  {projects.map(project => (
                    <SortableRow key={project.id} project={project} onDelete={handleDelete} onToggleFeatured={handleToggleFeatured} />
                  ))}
                </tbody>
              </SortableContext>
            </DndContext>
          </table>
        )}
      </div>
    </div>
  );
}
