import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date, unique } from 'drizzle-orm/pg-core';

// ─── Projects ───

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  category: text('category').notNull(),
  technologies: text('technologies').array().notNull(),
  images: text('images').array().notNull(),
  gradient: text('gradient').notNull(),
  featured: boolean('featured').default(false),
  github: text('github'),
  demo: text('demo'),
  year: integer('year').notNull(),
  client: text('client'),
  duration: text('duration'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const projectTranslations = pgTable('project_translations', {
  id: serial('id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  locale: text('locale').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  fullDescription: text('full_description').notNull(),
}, (table) => [
  unique('project_translations_project_locale').on(table.projectId, table.locale),
]);

// ─── Project Categories ───

export const projectCategories = pgTable('project_categories', {
  id: text('id').primaryKey(),
  sortOrder: integer('sort_order').default(0),
});

export const categoryTranslations = pgTable('category_translations', {
  id: serial('id').primaryKey(),
  categoryId: text('category_id').notNull().references(() => projectCategories.id, { onDelete: 'cascade' }),
  locale: text('locale').notNull(),
  name: text('name').notNull(),
}, (table) => [
  unique('category_translations_category_locale').on(table.categoryId, table.locale),
]);

// ─── Team Members ───

export const teamMembers = pgTable('team_members', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nickname: text('nickname'),
  hierarchy: text('hierarchy').notNull(),
  location: text('location').notNull(),
  education: text('education').notNull(),
  skills: text('skills').array().notNull(),
  tools: text('tools').array(),
  email: text('email'),
  linkedin: text('linkedin'),
  github: text('github'),
  photo: text('photo'),
  interests: jsonb('interests').notNull().$type<{ icon: string; labelKey: string }[]>().default([]),
  startDate: date('start_date'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const teamMemberTranslations = pgTable('team_member_translations', {
  id: serial('id').primaryKey(),
  memberId: text('member_id').notNull().references(() => teamMembers.id, { onDelete: 'cascade' }),
  locale: text('locale').notNull(),
  role: text('role').notNull(),
  specialization: text('specialization').notNull(),
  bio: text('bio').notNull(),
}, (table) => [
  unique('team_member_translations_member_locale').on(table.memberId, table.locale),
]);
