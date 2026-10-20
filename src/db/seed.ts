/**
 * Seed script — migra datos de JSON y traducciones a la base de datos Neon.
 * Ejecutar: DATABASE_URL="..." npx tsx src/db/seed.ts
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import contenido from './contenido/proyectos.json';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Seeding database...');

  // ─── Project Categories ───
  const categories = [
    { id: 'all', sortOrder: 0 },
    ...contenido.categorias.map(({ id, sortOrder }) => ({ id, sortOrder })),
  ];

  for (const cat of categories) {
    await db.insert(schema.projectCategories).values(cat).onConflictDoNothing();
  }

  const categoryTranslationsData = [
    { categoryId: 'all', locale: 'es', name: 'Todos' },
    { categoryId: 'all', locale: 'en', name: 'All' },
    { categoryId: 'all', locale: 'ja', name: 'すべて' },
    ...contenido.categorias.flatMap((cat) =>
      Object.entries(cat.nombres).map(([locale, name]) => ({ categoryId: cat.id, locale, name }))
    ),
  ];

  for (const ct of categoryTranslationsData) {
    await db.insert(schema.categoryTranslations).values(ct).onConflictDoNothing();
  }
  console.log('✓ Categories seeded');

  // ─── Projects ───
  const projectsData = [
    {
      id: 'softcount',
      slug: 'softcount',
      category: 'custom-code',
      technologies: ['Next.js', 'TypeScript', 'PostgreSQL'],
      images: ['/projects/softcount/screenshot-1.png', '/projects/softcount/screenshot-2.png', '/projects/softcount/screenshot-3.png', '/projects/softcount/screenshot-4.png'],
      gradient: 'from-blue-600 to-cyan-600',
      featured: true,
      github: null,
      demo: null,
      year: 2024,
      client: null,
      sortOrder: 0,
    },
    {
      id: 'wilson-isaza',
      slug: 'wilson-isaza',
      category: 'wordpress',
      technologies: ['WordPress'],
      images: ['/projects/wilson-isaza/screenshot-1.png', '/projects/wilson-isaza/screenshot-2.png', '/projects/wilson-isaza/screenshot-3.png', '/projects/wilson-isaza/screenshot-4.png'],
      gradient: 'from-red-600 to-orange-600',
      featured: true,
      github: null,
      demo: 'https://wilsonisaza.com/',
      year: 2024,
      client: 'Wilson Isaza',
      sortOrder: 1,
    },
    {
      id: 'empo-guzman',
      slug: 'empo-guzman',
      category: 'wordpress',
      technologies: ['Wix'],
      images: ['/projects/empo-guzman/screenshot-1.png', '/projects/empo-guzman/screenshot-2.png', '/projects/empo-guzman/screenshot-3.png'],
      gradient: 'from-indigo-600 to-purple-600',
      featured: true,
      github: null,
      demo: 'https://www.empoguzman.com.co/',
      year: 2024,
      client: 'Empo Guzmán',
      sortOrder: 2,
    },
    {
      id: 'devminds-portfolio',
      slug: 'devminds-portfolio',
      category: 'wordpress',
      technologies: ['Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
      images: ['/projects/devminds-portfolio/screenshot-1.png'],
      gradient: 'from-purple-600 to-pink-600',
      featured: true,
      github: null,
      demo: 'https://devminds.online',
      year: 2024,
      client: null,
      sortOrder: 3,
    },
  ];

  for (const p of projectsData) {
    await db.insert(schema.projects).values(p).onConflictDoNothing();
  }

  // Solo se siembran traducciones de los proyectos que este seed crea (llave foránea).
  const idsSembrados = new Set(projectsData.map((p) => p.id));
  const projectTranslationsData = contenido.proyectos
    .filter((p) => idsSembrados.has(p.id))
    .flatMap((p) => Object.entries(p.textos).map(([locale, tx]) => ({ projectId: p.id, locale, ...tx })));

  for (const pt of projectTranslationsData) {
    await db.insert(schema.projectTranslations).values(pt).onConflictDoNothing();
  }
  console.log('✓ Projects seeded');

  // ─── Team Members ───
  const teamMembersData = [
    {
      id: 'sebastian-morea',
      name: 'Sebastian Morea Cañón',
      nickname: 'ItsEnder',
      hierarchy: 'founder',
      location: 'Neiva, Huila, Colombia',
      education: 'Universidad Surcolombiana (2020-2025)',
      skills: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'PostgreSQL', 'Node.js'],
      tools: ['Git', 'GitHub', 'Jira'],
      email: 'semoca00@gmail.com',
      linkedin: 'https://www.linkedin.com/in/sebastian-morea-ca%C3%B1on-5ba97729a/',
      github: 'https://github.com/SemocaDev',
      photo: '/team/sebastian-morea.jpg',
      interests: [
        { icon: 'Gamepad2', labelKey: 'gaming' },
        { icon: 'BookOpen', labelKey: 'anime' },
        { icon: 'BookOpen', labelKey: 'manga' },
        { icon: 'ChefHat', labelKey: 'cooking' },
      ],
      startDate: '2024-11-01',
      sortOrder: 0,
    },
  ];

  for (const tm of teamMembersData) {
    await db.insert(schema.teamMembers).values(tm).onConflictDoNothing();
  }

  const teamTranslationsData = [
    // Sebastian
    { memberId: 'sebastian-morea', locale: 'es', role: 'Ingeniero de Software', specialization: 'Especialista en Frontend y UX', bio: 'Ingeniero de Software apasionado por crear experiencias de usuario excepcionales. Especializado en desarrollo frontend con Next.js, React y TypeScript. Me enfoco en construir aplicaciones web modernas, eficientes y escalables que resuelvan problemas reales.' },
    { memberId: 'sebastian-morea', locale: 'en', role: 'Software Engineer', specialization: 'Frontend and UX Specialist', bio: 'Software Engineer passionate about creating exceptional user experiences. Specialized in frontend development with Next.js, React, and TypeScript. I focus on building modern, efficient, and scalable web applications that solve real problems.' },
    { memberId: 'sebastian-morea', locale: 'ja', role: 'ソフトウェアエンジニア', specialization: 'フロントエンドおよびUXスペシャリスト', bio: '優れたユーザーエクスペリエンスを作成することに情熱を注ぐソフトウェアエンジニア。Next.js、React、TypeScriptを使用したフロントエンド開発を専門としています。実際の問題を解決する現代的で効率的でスケーラブルなウェブアプリケーションの構築に注力しています。' },
  ];

  for (const tt of teamTranslationsData) {
    await db.insert(schema.teamMemberTranslations).values(tt).onConflictDoNothing();
  }
  console.log('✓ Team members seeded');

  console.log('✅ Database seeded successfully!');
}

seed().catch(console.error);
