'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type MemberRow = {
  id: string;
  name: string;
  hierarchy: string;
  sortOrder: number;
  translations: { locale: string; role: string }[];
};

export default function AdminTeamPage() {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/team')
      .then(r => r.json())
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm(`¿Eliminar miembro "${id}"?`)) return;
    await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
    setMembers(prev => prev.filter(m => m.id !== id));
  }

  if (loading) return <div className="text-gray-400">Cargando...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Equipo</h1>
        <Link
          href="/admin/team/new"
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Nuevo Miembro
        </Link>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Nombre</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Rol (ES)</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Jerarquía</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => {
              const esRole = member.translations.find(t => t.locale === 'es')?.role || '';
              return (
                <tr key={member.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-6 py-4 text-sm">{member.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{esRole}</td>
                  <td className="px-6 py-4 text-sm text-gray-400 capitalize">{member.hierarchy}</td>
                  <td className="px-6 py-4 text-sm text-right space-x-2">
                    <Link
                      href={`/admin/team/${member.id}/edit`}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(member.id)}
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
        {members.length === 0 && (
          <div className="text-center py-12 text-gray-500">No hay miembros aún</div>
        )}
      </div>
    </div>
  );
}
