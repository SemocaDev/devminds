import { db } from '@/db';
import { teamMembers, teamMemberTranslations } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export type TeamMemberWithTranslation = {
  id: string;
  name: string;
  nickname: string | null;
  hierarchy: string;
  location: string;
  education: string;
  skills: string[];
  tools: string[] | null;
  email: string | null;
  linkedin: string | null;
  github: string | null;
  photo: string | null;
  interests: { icon: string; labelKey: string }[];
  startDate: string | null;
  sortOrder: number | null;
  role: string;
  specialization: string;
  bio: string;
};

async function _getTeamMembers(locale: string): Promise<TeamMemberWithTranslation[]> {
  const rows = await db
    .select({
      id: teamMembers.id,
      name: teamMembers.name,
      nickname: teamMembers.nickname,
      hierarchy: teamMembers.hierarchy,
      location: teamMembers.location,
      education: teamMembers.education,
      skills: teamMembers.skills,
      tools: teamMembers.tools,
      email: teamMembers.email,
      linkedin: teamMembers.linkedin,
      github: teamMembers.github,
      photo: teamMembers.photo,
      interests: teamMembers.interests,
      startDate: teamMembers.startDate,
      sortOrder: teamMembers.sortOrder,
      role: teamMemberTranslations.role,
      specialization: teamMemberTranslations.specialization,
      bio: teamMemberTranslations.bio,
    })
    .from(teamMembers)
    .innerJoin(
      teamMemberTranslations,
      and(
        eq(teamMemberTranslations.memberId, teamMembers.id),
        eq(teamMemberTranslations.locale, locale)
      )
    )
    .orderBy(teamMembers.sortOrder);

  return rows;
}

// Cached for public pages
export const getTeamMembers = unstable_cache(_getTeamMembers, ['team'], {
  revalidate: 3600,
  tags: ['team'],
});

// Uncached for admin
export const getTeamMembersAdmin = _getTeamMembers;

// Get single member with all translations (for admin edit form)
export async function getMemberWithAllTranslations(id: string) {
  const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
  if (!member) return null;

  const translations = await db
    .select()
    .from(teamMemberTranslations)
    .where(eq(teamMemberTranslations.memberId, id));

  return { ...member, translations };
}
