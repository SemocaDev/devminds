import { db } from '@/db';
import { projects, projectTranslations, projectCategories, categoryTranslations } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { unstable_cache } from 'next/cache';

export type ProjectWithTranslation = {
  id: string;
  slug: string;
  category: string;
  technologies: string[];
  images: string[];
  gradient: string;
  featured: boolean | null;
  github: string | null;
  demo: string | null;
  year: number;
  client: string | null;
  duration: string | null;
  sortOrder: number | null;
  title: string;
  description: string;
  fullDescription: string;
};

export type CategoryWithTranslation = {
  id: string;
  sortOrder: number | null;
  name: string;
};

async function _getProjects(locale: string): Promise<ProjectWithTranslation[]> {
  const rows = await db
    .select({
      id: projects.id,
      slug: projects.slug,
      category: projects.category,
      technologies: projects.technologies,
      images: projects.images,
      gradient: projects.gradient,
      featured: projects.featured,
      github: projects.github,
      demo: projects.demo,
      year: projects.year,
      client: projects.client,
      duration: projects.duration,
      sortOrder: projects.sortOrder,
      title: projectTranslations.title,
      description: projectTranslations.description,
      fullDescription: projectTranslations.fullDescription,
    })
    .from(projects)
    .innerJoin(
      projectTranslations,
      and(
        eq(projectTranslations.projectId, projects.id),
        eq(projectTranslations.locale, locale)
      )
    )
    .orderBy(projects.sortOrder);

  return rows;
}

async function _getFeaturedProjects(locale: string): Promise<ProjectWithTranslation[]> {
  const rows = await db
    .select({
      id: projects.id,
      slug: projects.slug,
      category: projects.category,
      technologies: projects.technologies,
      images: projects.images,
      gradient: projects.gradient,
      featured: projects.featured,
      github: projects.github,
      demo: projects.demo,
      year: projects.year,
      client: projects.client,
      duration: projects.duration,
      sortOrder: projects.sortOrder,
      title: projectTranslations.title,
      description: projectTranslations.description,
      fullDescription: projectTranslations.fullDescription,
    })
    .from(projects)
    .innerJoin(
      projectTranslations,
      and(
        eq(projectTranslations.projectId, projects.id),
        eq(projectTranslations.locale, locale)
      )
    )
    .where(eq(projects.featured, true))
    .orderBy(projects.sortOrder);

  return rows;
}

async function _getCategories(locale: string): Promise<CategoryWithTranslation[]> {
  const rows = await db
    .select({
      id: projectCategories.id,
      sortOrder: projectCategories.sortOrder,
      name: categoryTranslations.name,
    })
    .from(projectCategories)
    .innerJoin(
      categoryTranslations,
      and(
        eq(categoryTranslations.categoryId, projectCategories.id),
        eq(categoryTranslations.locale, locale)
      )
    )
    .orderBy(projectCategories.sortOrder);

  return rows;
}

// Cached versions for public pages
export const getProjects = unstable_cache(_getProjects, ['projects'], {
  revalidate: 3600,
  tags: ['projects'],
});

export const getFeaturedProjects = unstable_cache(_getFeaturedProjects, ['featured-projects'], {
  revalidate: 3600,
  tags: ['projects'],
});

export const getCategories = unstable_cache(_getCategories, ['categories'], {
  revalidate: 3600,
  tags: ['projects'],
});

// Uncached versions for admin
export const getProjectsAdmin = _getProjects;
export const getCategoriesAdmin = _getCategories;

// Get single project with all translations (for admin edit form)
export async function getProjectWithAllTranslations(id: string) {
  const [project] = await db.select().from(projects).where(eq(projects.id, id));
  if (!project) return null;

  const translations = await db
    .select()
    .from(projectTranslations)
    .where(eq(projectTranslations.projectId, id));

  return { ...project, translations };
}
