export interface Project {
  id: string;
  slug: string;
  category: string;
  technologies: string[];
  images: string[]; // Array de imágenes
  gradient: string;
  featured: boolean;
  github?: string | null;
  demo?: string | null;
  year: number;
  client?: string;
  duration?: string;
}

export interface ProjectCategory {
  id: string;
  name: string;
}

export interface ProjectsData {
  projects: Project[];
  categories: ProjectCategory[];
}

export type ProjectCategoryId = 'all' | 'web-app' | 'mobile' | 'open-source' | 'consulting';
