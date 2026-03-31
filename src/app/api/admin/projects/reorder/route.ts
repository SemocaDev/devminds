import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getAdminSession } from '@/lib/admin/auth';
import { revalidateTag } from 'next/cache';

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const { ids } = await request.json() as { ids: string[] };
    if (!Array.isArray(ids)) {
      return NextResponse.json({ error: 'ids debe ser un array' }, { status: 400 });
    }

    for (let i = 0; i < ids.length; i++) {
      await db.update(projects).set({ sortOrder: i }).where(eq(projects.id, ids[i]));
    }

    revalidateTag('projects', 'default');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
