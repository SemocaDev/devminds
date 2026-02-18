/**
 * Seed script — migra datos de JSON y traducciones a la base de datos Neon.
 * Ejecutar: DATABASE_URL="..." npx tsx src/db/seed.ts
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Seeding database...');

  // ─── Project Categories ───
  const categories = [
    { id: 'all', sortOrder: 0 },
    { id: 'web-app', sortOrder: 1 },
    { id: 'wordpress', sortOrder: 2 },
    { id: 'custom-code', sortOrder: 3 },
  ];

  for (const cat of categories) {
    await db.insert(schema.projectCategories).values(cat).onConflictDoNothing();
  }

  const categoryTranslationsData = [
    { categoryId: 'all', locale: 'es', name: 'Todos' },
    { categoryId: 'all', locale: 'en', name: 'All' },
    { categoryId: 'all', locale: 'ja', name: 'すべて' },
    { categoryId: 'web-app', locale: 'es', name: 'Aplicaciones Web' },
    { categoryId: 'web-app', locale: 'en', name: 'Web Applications' },
    { categoryId: 'web-app', locale: 'ja', name: 'ウェブアプリケーション' },
    { categoryId: 'wordpress', locale: 'es', name: 'WordPress' },
    { categoryId: 'wordpress', locale: 'en', name: 'WordPress' },
    { categoryId: 'wordpress', locale: 'ja', name: 'WordPress' },
    { categoryId: 'custom-code', locale: 'es', name: 'Wix/Plantillas' },
    { categoryId: 'custom-code', locale: 'en', name: 'Wix/Templates' },
    { categoryId: 'custom-code', locale: 'ja', name: 'Wix/テンプレート' },
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
      category: 'web-app',
      technologies: ['Next.js', 'TypeScript', 'PostgreSQL'],
      images: ['/projects/softcount/screenshot-1.png', '/projects/softcount/screenshot-2.png', '/projects/softcount/screenshot-3.png', '/projects/softcount/screenshot-4.png'],
      gradient: 'from-blue-600 to-cyan-600',
      featured: true,
      github: null,
      demo: null,
      year: 2024,
      client: 'Proyecto Propio',
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
      client: 'Wilson Isaza - Político',
      sortOrder: 1,
    },
    {
      id: 'empo-guzman',
      slug: 'empo-guzman',
      category: 'custom-code',
      technologies: ['Wix'],
      images: ['/projects/empo-guzman/screenshot-1.png', '/projects/empo-guzman/screenshot-2.png', '/projects/empo-guzman/screenshot-3.png'],
      gradient: 'from-indigo-600 to-purple-600',
      featured: true,
      github: null,
      demo: 'https://www.empoguzman.com.co/',
      year: 2024,
      client: 'Empresas Públicas',
      sortOrder: 2,
    },
    {
      id: 'devminds-portfolio',
      slug: 'devminds-portfolio',
      category: 'web-app',
      technologies: ['Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
      images: ['/projects/devminds-portfolio/screenshot-1.png'],
      gradient: 'from-purple-600 to-pink-600',
      featured: true,
      github: null,
      demo: 'https://devminds.online',
      year: 2024,
      client: 'DevMinds',
      sortOrder: 3,
    },
  ];

  for (const p of projectsData) {
    await db.insert(schema.projects).values(p).onConflictDoNothing();
  }

  const projectTranslationsData = [
    // SoftCount
    { projectId: 'softcount', locale: 'es', title: 'SoftCount - Software de Contabilidad', description: 'Software de contabilidad profesional (En construcción)', fullDescription: 'SoftCount es un software de contabilidad desarrollado con Next.js, TypeScript y PostgreSQL. Proyecto propio en construcción diseñado para ofrecer una solución completa de gestión contable y financiera.' },
    { projectId: 'softcount', locale: 'en', title: 'SoftCount - Accounting Software', description: 'Professional accounting software (Under construction)', fullDescription: 'SoftCount is accounting software developed with Next.js, TypeScript, and PostgreSQL. Own project under construction designed to offer a complete accounting and financial management solution.' },
    { projectId: 'softcount', locale: 'ja', title: 'SoftCount - 会計ソフトウェア', description: 'プロフェッショナル会計ソフトウェア(開発中)', fullDescription: 'SoftCountは、Next.js、TypeScript、PostgreSQLで開発された会計ソフトウェアです。完全な会計および財務管理ソリューションを提供するために設計された開発中の自社プロジェクトです。' },
    // Wilson Isaza
    { projectId: 'wilson-isaza', locale: 'es', title: 'Wilson Isaza - Sitio Político', description: 'Sitio web en WordPress para político', fullDescription: 'Sitio web desarrollado en WordPress para el político Wilson Isaza. Plataforma informativa profesional para su campaña política.' },
    { projectId: 'wilson-isaza', locale: 'en', title: 'Wilson Isaza - Political Website', description: 'WordPress website for politician', fullDescription: 'Website developed in WordPress for politician Wilson Isaza. Professional informational platform for his political campaign.' },
    { projectId: 'wilson-isaza', locale: 'ja', title: 'Wilson Isaza - 政治サイト', description: '政治家向けWordPressウェブサイト', fullDescription: '政治家Wilson Isaza向けにWordPressで開発されたウェブサイト。政治キャンペーン用のプロフェッショナルな情報プラットフォーム。' },
    // Empo Guzmán
    { projectId: 'empo-guzman', locale: 'es', title: 'Empo Guzmán - Sitio Empresas Públicas', description: 'Sitio web para empresas públicas en Wix', fullDescription: 'Sitio web desarrollado en Wix para Empo Guzmán, enfocado en empresas públicas. Diseño con plantillas personalizadas.' },
    { projectId: 'empo-guzman', locale: 'en', title: 'Empo Guzmán - Public Companies Website', description: 'Website for public companies in Wix', fullDescription: 'Website developed in Wix for Empo Guzmán, focused on public companies. Design with custom templates.' },
    { projectId: 'empo-guzman', locale: 'ja', title: 'Empo Guzmán - 公共企業サイト', description: 'Wixで作成された公共企業向けウェブサイト', fullDescription: '公共企業に焦点を当てたEmpo Guzmán向けにWixで開発されたウェブサイト。カスタマイズされたテンプレートを使用したデザイン。' },
    // DevMinds Portfolio
    { projectId: 'devminds-portfolio', locale: 'es', title: 'DevMinds - Portfolio Profesional', description: 'Este mismo sitio web que estás viendo', fullDescription: 'Portfolio profesional desarrollado con Next.js 16, TypeScript, TailwindCSS y Framer Motion. Incluye sistema de i18n multi-idioma (ES, EN, JA), animaciones fluidas y diseño responsive moderno.' },
    { projectId: 'devminds-portfolio', locale: 'en', title: 'DevMinds - Professional Portfolio', description: 'This very website you\'re viewing', fullDescription: 'Professional portfolio developed with Next.js 16, TypeScript, TailwindCSS, and Framer Motion. Includes multi-language i18n system (ES, EN, JA), smooth animations, and modern responsive design.' },
    { projectId: 'devminds-portfolio', locale: 'ja', title: 'DevMinds - プロフェッショナルポートフォリオ', description: 'ご覧いただいているこのウェブサイト', fullDescription: 'Next.js 16、TypeScript、TailwindCSS、Framer Motionで開発されたプロフェッショナルポートフォリオ。多言語i18nシステム(ES、EN、JA)、スムーズなアニメーション、モダンなレスポンシブデザインを含みます。' },
  ];

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
      hierarchy: 'co-founder',
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
    {
      id: 'juan-gomez',
      name: 'Juan David Gomez Perez',
      nickname: null,
      hierarchy: 'co-founder',
      location: 'Neiva, Huila, Colombia',
      education: 'Universidad Surcolombiana (2020-2025)',
      skills: ['Node.js', 'PostgreSQL', 'TypeScript', 'Express', 'API Design', 'Database Design'],
      tools: ['Git', 'GitHub', 'Jira'],
      email: null,
      linkedin: null,
      github: null,
      photo: null,
      interests: [
        { icon: 'Code2', labelKey: 'systemDesign' },
        { icon: 'Database', labelKey: 'databases' },
      ],
      startDate: null,
      sortOrder: 1,
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
    // Juan
    { memberId: 'juan-gomez', locale: 'es', role: 'Ingeniero de Software', specialization: 'Especialista en Backend', bio: 'Ingeniero de Software enfocado en el desarrollo backend y arquitectura de sistemas. Experto en diseño de APIs, bases de datos y soluciones escalables que dan soporte a aplicaciones robustas.' },
    { memberId: 'juan-gomez', locale: 'en', role: 'Software Engineer', specialization: 'Backend Specialist', bio: 'Software Engineer focused on backend development and system architecture. Expert in API design, databases, and scalable solutions that support robust applications.' },
    { memberId: 'juan-gomez', locale: 'ja', role: 'ソフトウェアエンジニア', specialization: 'バックエンドスペシャリスト', bio: 'バックエンド開発とシステムアーキテクチャに焦点を当てたソフトウェアエンジニア。API設計、データベース、堅牢なアプリケーションをサポートするスケーラブルなソリューションの専門家。' },
  ];

  for (const tt of teamTranslationsData) {
    await db.insert(schema.teamMemberTranslations).values(tt).onConflictDoNothing();
  }
  console.log('✓ Team members seeded');

  console.log('✅ Database seeded successfully!');
}

seed().catch(console.error);
