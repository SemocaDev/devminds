import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { teamMembers, teamMemberTranslations } from '@/db/schema';
import { getAdminSession } from '@/lib/admin/auth';
import { eq, and } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await context.params;
  const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
  if (!member) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  const translations = await db.select().from(teamMemberTranslations).where(eq(teamMemberTranslations.memberId, id));

  return NextResponse.json({ ...member, translations });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await context.params;

  try {
    const body = await request.json();
    const { translations, ...memberData } = body;

    await db.update(teamMembers).set({
      ...memberData,
      updatedAt: new Date(),
    }).where(eq(teamMembers.id, id));

    if (translations) {
      const locales = ['es', 'en', 'ja'] as const;
      for (const locale of locales) {
        if (translations.role?.[locale]) {
          await db
            .update(teamMemberTranslations)
            .set({
              role: translations.role[locale],
              specialization: translations.specialization[locale],
              bio: translations.bio[locale],
            })
            .where(
              and(
                eq(teamMemberTranslations.memberId, id),
                eq(teamMemberTranslations.locale, locale)
              )
            );
        }
      }
    }

    revalidateTag('team', 'default');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await context.params;

  await db.delete(teamMembers).where(eq(teamMembers.id, id));

  revalidateTag('team', 'default');
  return NextResponse.json({ success: true });
}
