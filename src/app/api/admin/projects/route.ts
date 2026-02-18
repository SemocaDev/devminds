import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects, projectTranslations } from '@/db/schema';
import { projectSchema } from '@/lib/admin/schemas';
import { getAdminSession } from '@/lib/admin/auth';
import { revalidateTag } from 'next/cache';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const allProjects = await db.select().from(projects).orderBy(projects.sortOrder);
  const allTranslations = await db.select().from(projectTranslations);

  const result = allProjects.map(p => ({
    ...p,
    translations: allTranslations.filter(t => t.projectId === p.id),
  }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await request.json();
    const data = projectSchema.parse(body);

    const { translations, ...projectData } = data;

    await db.insert(projects).values({
      ...projectData,
      github: projectData.github ?? null,
      demo: projectData.demo ?? null,
      client: projectData.client ?? null,
      duration: projectData.duration ?? null,
    });

    const locales = ['es', 'en', 'ja'] as const;
    for (const locale of locales) {
      await db.insert(projectTranslations).values({
        projectId: data.id,
        locale,
        title: translations.title[locale],
        description: translations.description[locale],
        fullDescription: translations.fullDescription[locale],
      });
    }

    revalidateTag('projects', 'default');
    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
