import { LucideIcon } from 'lucide-react';

export type TeamHierarchy = 'founder' | 'co-founder' | 'developer' | 'designer' | 'marketing';

export interface TeamMemberInterest {
  icon: string; // Icon name from lucide-react
  labelKey: string; // Translation key
}

export interface TeamMember {
  id: string;
  name: string;
  nickname?: string; // Optional nickname/alias
  role: string; // Translation key
  hierarchy: TeamHierarchy;
  specialization: string; // Translation key
  bio: string; // Translation key
  location: string;
  education: string;
  skills: string[];
  tools?: string[];
  email?: string;
  linkedin?: string;
  github?: string;
  photo?: string; // Path to photo in /public/team/
  interests: TeamMemberInterest[];
  startDate?: string; // ISO date format
}
