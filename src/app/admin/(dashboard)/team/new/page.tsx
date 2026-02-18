'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TeamMemberForm from '@/app/admin/components/TeamMemberForm';

export default function NewTeamMemberPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(data: Record<string, unknown>) {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Error al guardar');
        return;
      }
      router.push('/admin/team');
    } catch {
      setError('Error de conexión');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Nuevo Miembro del Equipo</h1>
      {error && <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm mb-6">{error}</div>}
      <TeamMemberForm onSubmit={handleSubmit} saving={saving} />
    </div>
  );
}
