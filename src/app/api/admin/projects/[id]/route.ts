import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, projectTranslations } from '@/db/schema';
import { getAdminSession } from '@/lib/admin/auth';
import { eq, and } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await context.params;
  const [project] = await db.select().from(projects).where(eq(projects.id, id));
  if (!project) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  const translations = await db.select().from(projectTranslations).where(eq(projectTranslations.projectId, id));

  return NextResponse.json({ ...project, translations });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await context.params;

  try {
    const body = await request.json();
    const { translations, ...projectData } = body;

    await db.update(projects).set({
      ...projectData,
      updatedAt: new Date(),
    }).where(eq(projects.id, id));

    if (translations) {
      const locales = ['es', 'en', 'ja'] as const;
      for (const locale of locales) {
        if (translations.title?.[locale]) {
          await db
            .update(projectTranslations)
            .set({
              title: translations.title[locale],
              description: translations.description[locale],
              fullDescription: translations.fullDescription[locale],
            })
            .where(
              and(
                eq(projectTranslations.projectId, id),
                eq(projectTranslations.locale, locale)
              )
            );
        }
      }
    }

    revalidateTag('projects', 'default');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await context.params;

  await db.delete(projects).where(eq(projects.id, id));

  revalidateTag('projects', 'default');
  return NextResponse.json({ success: true });
}
