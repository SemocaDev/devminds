import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { teamMembers, teamMemberTranslations } from '@/db/schema';
import { teamMemberSchema } from '@/lib/admin/schemas';
import { getAdminSession } from '@/lib/admin/auth';
import { revalidateTag } from 'next/cache';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const allMembers = await db.select().from(teamMembers).orderBy(teamMembers.sortOrder);
  const allTranslations = await db.select().from(teamMemberTranslations);

  const result = allMembers.map(m => ({
    ...m,
    translations: allTranslations.filter(t => t.memberId === m.id),
  }));

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await request.json();
    const data = teamMemberSchema.parse(body);

    const { translations, ...memberData } = data;

    await db.insert(teamMembers).values({
      ...memberData,
      nickname: memberData.nickname ?? null,
      tools: memberData.tools ?? null,
      email: memberData.email ?? null,
      linkedin: memberData.linkedin ?? null,
      github: memberData.github ?? null,
      photo: memberData.photo ?? null,
      startDate: memberData.startDate ?? null,
    });

    const locales = ['es', 'en', 'ja'] as const;
    for (const locale of locales) {
      await db.insert(teamMemberTranslations).values({
        memberId: data.id,
        locale,
        role: translations.role[locale],
        specialization: translations.specialization[locale],
        bio: translations.bio[locale],
      });
    }

    revalidateTag('team', 'default');
    return NextResponse.json({ success: true, id: data.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
