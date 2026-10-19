# Rediseño de la landing de DevMinds — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar la home de devminds.online en modo claro (blanco nieve fría, terracota, Doto en marca y cifras, "retícula de estudio" con rieles), con contenido para clientes no técnicos (ES local, EN/JA global), y limpiar los datos de equipo y proyectos en la DB.

**Architecture:** Rediseño en sitio sobre la rama `redesign/home`. Fase 0 cambia datos en la DB de producción (respaldo previo, aprobación del usuario antes de escribir). Luego se reemplazan los tokens de Tailwind/shadcn, se quita el tema oscuro público, se crean componentes de retícula y navegación, y se reescriben las secciones de la home una por una; las secciones viejas conviven hasta la tarea de limpieza para que el build pase en cada commit. Lógica pura (enlaces, rutas de idioma, selección de fundador, línea de metadatos, paridad de traducciones) con TDD en Vitest; lo visual se verifica con capturas de Playwright en checkpoints.

**Tech Stack:** Next.js 16.1 (App Router) · React 19 · TypeScript · Tailwind CSS 3 + shadcn/ui · next-intl 4 · GSAP 3 (ScrollTrigger) · Drizzle + Neon Postgres · Vitest 5 (nuevo) · pnpm

**Spec:** `docs/superpowers/specs/2026-10-19-rediseno-landing-design.md`

## Global Constraints

- Gestor de paquetes: **pnpm** (`node_modules/.pnpm`; `package-lock.json` está obsoleto, no tocarlo).
- Commits: Conventional Commits en español, explicando el porqué. **Nunca `Co-Authored-By`** ni coautoría de IA (no-negociable de develop_kit y memoria del usuario).
- Rama: `redesign/home`. Nada se mergea a `main` sin aprobación de la última preview.
- **La DB local (`.env.local`) y la de producción son la misma** (`ep-spring-wave…/devminds`). Toda escritura en la DB es en producción: respaldo previo y confirmación explícita del usuario en el momento.
- Colores: nunca `#fff` ni `#000`. Terracota (`--primary`) ≤ 10% de la superficie.
- Tokens (HSL, sin `hsl()`): `--background 216 56% 98.2%` · `--secondary/--muted 207 36% 95.1%` · `--surface-3 207 26% 91.6%` · `--foreground 218 18% 12%` · `--muted-foreground 216 8% 36.3%` · `--border/--input 203 13% 88.2%` · `--guide 207 14% 84.9%` · `--primary 16 60% 44.5%` · `--primary-hover 17 65% 37.5%` · `--primary-foreground 210 67% 98.8%` · `--accent-tint 20 77% 93.1%` · `--dots 218 18% 12% / 0.26`.
- Tipografía: Doto 900 solo en wordmark y cifras grandes; Outfit 700 (`font-display`) en títulos; Geist en cuerpo (17px móvil, `leading-relaxed`, máx ~65ch). Sin etiquetas en mayúsculas espaciadas, sin numeración `01.` salvo "Cómo trabajamos", sin texto con degradado.
- Copy: sin em dash (—) ni `--` en textos visibles. Voz de "estudio de software", sin "agencia", "empresa" ni tamaño de equipo.
- Un solo momento animado (entrada del hero + escalera); `prefers-reduced-motion` respetado.
- Táctil ≥ 44px (`min-h-11`), contraste ≥ 4.5:1 en texto normal, 0px de desborde horizontal a 390px.
- Verificación por tarea: `pnpm exec tsc --noEmit` sin errores; `pnpm exec eslint <archivos tocados>` sin errores nuevos (línea base: 20 errores preexistentes en `src`); `pnpm test` en verde desde la Tarea 4; `pnpm build` en las tareas que lo indiquen.
- Skills de diseño (cargarlas con la herramienta Skill al empezar la tarea indicada y aplicarlas al código que el plan trae): `frontend-design` y `design-taste-frontend` en las Tareas 10 a 15; `emil-design-eng` y `gsap-react` en las Tareas 10 y 11 (las dos únicas animaciones); `ui-ux-pro-max` como checklist de accesibilidad y táctil en la Tarea 17 (descartar su paleta sugerida); `impeccable` (critique y polish) en la Tarea 17. Si una skill sugiere cambiar algo ya decidido en el spec, proponerlo al usuario en vez de aplicarlo.
- Ruta del scratchpad (scripts y capturas, no versionados): `C:/Users/DELL/AppData/Local/Temp/claude/c--devminds/21b02871-a4c5-47c2-aae8-a729aa6193f5/scratchpad`

## Review Focus

1. **Proyecto con categoría desconocida, sin cliente o sin imagen** → la tarjeta de Trabajos se muestra igual, sin "undefined", sin clave de traducción cruda y sin hueco roto. Test de `lineaMeta` en la Tarea 4; guarda `t.has` + fondo de respaldo en la Tarea 12.
2. **Cambio de idioma desde una subruta** (`/es/portfolio`, `/es`, `/ja/about`) → lleva a la misma página en el otro idioma, sin duplicar prefijos. Tests de `rutaEnIdioma` en la Tarea 4.
3. **Clave presente en `es.json` pero ausente en `en.json`/`ja.json` (o pregunta listada sin texto)** → el test falla antes de llegar a producción. Tests de paridad y de preguntas en la Tarea 7.
4. **Mensaje de WhatsApp con `¿`, `ñ`, `&`, `#` o japonés** → la URL `wa.me` queda bien codificada y abre el chat con el texto completo. Tests de `enlaceWhatsApp` en la Tarea 4.
5. **DB sin fundador marcado (o sin miembros)** → "Quiénes somos" se muestra sin nombre ni foto rota. Tests de `elegirFundador` en la Tarea 4; render condicional en la Tarea 14.

---

## Procedimientos compartidos

### CV · Checkpoint visual

Se usa al final de las tareas que lo piden. `RUTAS` y `SECCIONES` los indica cada tarea.

1. Confirmar el dev server: `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/es` → `200`. Si no, arrancar `pnpm dev` en segundo plano y esperar el `200`.
2. Ejecutar con Playwright (`browser_run_code_unsafe`), sustituyendo `RUTAS` y `SECCIONES`:

```js
async (page) => {
  const dir = 'C:/Users/DELL/AppData/Local/Temp/claude/c--devminds/21b02871-a4c5-47c2-aae8-a729aa6193f5/scratchpad/capturas/';
  const RUTAS = ['/es'];
  const SECCIONES = [];            // p. ej. ['#services', '#projects']
  const anchos = [390, 768, 1440];
  const out = [];
  for (const ruta of RUTAS) for (const w of anchos) {
    await page.setViewportSize({ width: w, height: w === 390 ? 844 : 900 });
    await page.goto('http://localhost:3000' + ruta, { waitUntil: 'networkidle' });
    const H = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < H; y += 500) { await page.evaluate(v => window.scrollTo(0, v), y); await page.waitForTimeout(120); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    const desborde = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const base = ruta.replace(/\//g, '_') + '-' + w;
    await page.screenshot({ path: dir + base + '.png', fullPage: true });
    for (const sel of SECCIONES) {
      const el = page.locator(sel).first();
      if (await el.count()) await el.screenshot({ path: dir + base + sel.replace('#', '-') + '.png' });
    }
    out.push(`${base} desborde=${desborde}px`);
  }
  return out.join('\n');
}
```

3. Leer las capturas con la herramienta Read. Criterios: `desborde=0px` en todas; nada cortado; guías verticales alineadas con los bordes del contenido; cruces sobre las guías; textos legibles.
4. Dejar `http://localhost:3000/es` abierto en el navegador y avisar al usuario qué cambió y qué mirar. **En los checkpoints marcados "con pausa"**, esperar su visto bueno antes de seguir; en los demás, seguir y anotar sus comentarios cuando lleguen ("nada es definitivo": un comentario puede reabrir una tarea anterior).

### PV · Preview de Vercel

```bash
git push -u origin redesign/home
sleep 90
gh api repos/SemocaDev/devminds/commits/$(git rev-parse HEAD)/status --jq '.statuses[] | select(.context | test("vercel"; "i")) | "\(.state) \(.target_url)"'
```

Si el estado es `pending`, repetir la consulta (sin `sleep` largo; un Monitor o una espera corta). Pasar la URL al usuario para revisarla en el celular. Si no aparece ningún estado de Vercel, reportarlo: la integración Git de Vercel podría no estar activa para ramas.

---

## Fase 0 · Datos

### Task 1: Respaldo de la DB

**Files:**
- Create: `docs/superpowers/respaldos/2026-10-19-db.json`
- Create (no versionado): `<scratchpad>/db-respaldo.mjs`

**Interfaces:**
- Consumes: `DATABASE_URL` de `.env.local`.
- Produces: el respaldo JSON que permite restaurar cualquier cambio de las Tareas 2 y 3.

- [ ] **Step 1: Escribir el script de respaldo**

`<scratchpad>/db-respaldo.mjs`:

```js
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const { neon } = createRequire('C:/devminds/package.json')('@neondatabase/serverless');
const env = Object.fromEntries(
  readFileSync('C:/devminds/.env.local', 'utf8').split(/\r?\n/)
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]; })
);
const sql = neon(env.DATABASE_URL);
const respaldo = {
  fecha: new Date().toISOString(),
  team_members: await sql`select * from team_members order by sort_order`,
  team_member_translations: await sql`select * from team_member_translations order by member_id, locale`,
  projects: await sql`select * from projects order by sort_order`,
  project_translations: await sql`select * from project_translations order by project_id, locale`,
  project_categories: await sql`select * from project_categories order by sort_order`,
  category_translations: await sql`select * from category_translations order by category_id, locale`,
};
mkdirSync('C:/devminds/docs/superpowers/respaldos', { recursive: true });
writeFileSync('C:/devminds/docs/superpowers/respaldos/2026-10-19-db.json', JSON.stringify(respaldo, null, 2));
console.log(Object.entries(respaldo).filter(([k]) => k !== 'fecha').map(([k, v]) => `${k}: ${v.length}`).join('\n'));
```

- [ ] **Step 2: Ejecutarlo**

Run: `node "<scratchpad>/db-respaldo.mjs"`
Expected: `team_members: 2`, `team_member_translations: 6`, `projects: 6`, `project_translations: 18`, `project_categories: 4`, `category_translations: 12`.

- [ ] **Step 3: Revisar que no haya secretos**

Run: `grep -c "password\|secret\|DATABASE" docs/superpowers/respaldos/2026-10-19-db.json`
Expected: `0`. (Solo textos públicos y el correo público `semoca00@gmail.com`.)

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/respaldos/2026-10-19-db.json
git commit -m "chore(db): respaldo de equipo, proyectos y categorías antes del rediseño

La DB local y la de producción son la misma; este respaldo permite revertir
los cambios de datos de la fase 0."
```

### Task 2: Fundador único

**Files:**
- Create (no versionado): `<scratchpad>/db-equipo.mjs`
- Modify: `src/lib/schemas/organization-schema.ts` (bloque `founders`, `legalName`, descripciones)
- Modify: `src/db/seed.ts` (miembros y traducciones del equipo)

**Interfaces:**
- Produces: en la DB, `team_members.sebastian-morea.hierarchy = 'founder'` y ningún registro `juan-gomez`. La Tarea 4 (`elegirFundador`) y la 14 dependen de esto.

- [ ] **Step 1: Escribir el script**

`<scratchpad>/db-equipo.mjs` (mismo encabezado de lectura de `.env.local` que en la Tarea 1):

```js
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const { neon } = createRequire('C:/devminds/package.json')('@neondatabase/serverless');
const env = Object.fromEntries(
  readFileSync('C:/devminds/.env.local', 'utf8').split(/\r?\n/)
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]; })
);
const sql = neon(env.DATABASE_URL);
await sql.transaction([
  sql`update team_members set hierarchy = 'founder' where id = 'sebastian-morea'`,
  sql`delete from team_member_translations where member_id = 'juan-gomez'`,
  sql`delete from team_members where id = 'juan-gomez'`,
]);
console.log(await sql`select id, hierarchy from team_members order by sort_order`);
console.log(await sql`select member_id, locale from team_member_translations order by member_id, locale`);
```

- [ ] **Step 2: Pedir confirmación al usuario**

Mostrar el script y decir: "Esto cambia producción: paso a `founder` y elimino a Juan David (respaldo en `docs/superpowers/respaldos/2026-10-19-db.json`). ¿Lo ejecuto?". No seguir sin un sí explícito.

- [ ] **Step 3: Ejecutar y verificar**

Run: `node "<scratchpad>/db-equipo.mjs"`
Expected: `[ { id: 'sebastian-morea', hierarchy: 'founder' } ]` y tres filas `sebastian-morea` (`en`, `es`, `ja`).

- [ ] **Step 4: JSON-LD con un solo fundador**

En `src/lib/schemas/organization-schema.ts`, dentro de `generateOrganizationSchema`:
- Eliminar la línea `"legalName": "DevMinds - Desarrollo Web y Software",` (DevMinds no está constituida legalmente).
- Reemplazar el bloque `"founders": [ ... ],` completo por:

```ts
    "founder": {
      "@type": "Person",
      "name": "Sebastián Morea Cañón",
      "jobTitle": "Founder & Software Engineer",
      "alumniOf": "Universidad Surcolombiana"
    },
```

- Reemplazar la `description` de `generateOrganizationSchema` por:

```ts
    "description": lang === 'es'
      ? "Estudio de software en Neiva, Huila. Páginas web, sistemas a medida y apps para negocios en Neiva, el Huila y toda Colombia."
      : "Software studio based in Colombia. Websites, custom systems and mobile apps for businesses anywhere.",
```

- En `generateLocalBusinessSchema`, reemplazar `"name": "DevMinds - Desarrollo Web Neiva",` por `"name": "DevMinds",` y su `description` por:

```ts
    "description": lang === 'es'
      ? "Estudio de software en Neiva, Huila: páginas web con SEO local, sistemas a medida, apps móviles y soporte para negocios de Neiva, el Huila y toda Colombia."
      : "Software studio in Neiva, Colombia: websites, custom systems, mobile apps and support for businesses in Colombia and abroad.",
```

- [ ] **Step 5: Seed coherente**

En `src/db/seed.ts`:
- En el objeto `sebastian-morea` de `teamMembersData`, cambiar `hierarchy: 'co-founder',` por `hierarchy: 'founder',`.
- Eliminar el objeto completo `{ id: 'juan-gomez', ... sortOrder: 1, },` de `teamMembersData`.
- Eliminar de `teamTranslationsData` el comentario `// Juan` y las tres filas `memberId: 'juan-gomez'`.

- [ ] **Step 6: Verificar tipos y lint**

Run: `pnpm exec tsc --noEmit && pnpm exec eslint src/lib/schemas/organization-schema.ts src/db/seed.ts`
Expected: sin errores.

- [ ] **Step 7: Commit**

```bash
git add src/lib/schemas/organization-schema.ts src/db/seed.ts
git commit -m "fix(seo): declarar un solo fundador y quitar legalName

El cofundador ya no participa en DevMinds y se retiró de la DB; el JSON-LD
seguía anunciando a Google dos cofundadores y una razón social que no existe."
```

### Task 3: Textos de proyectos y categorías

**Files:**
- Create: `src/db/contenido/proyectos.json` (fuente única de textos de proyectos y nombres de categorías)
- Create (no versionado): `<scratchpad>/db-proyectos.mjs`
- Modify: `src/db/seed.ts` (categorías y traducciones de proyectos leídas del JSON)
- Modify: `src/app/admin/components/ProjectForm.tsx:12-16` y `src/app/admin/(dashboard)/projects/page.tsx:25-27` (etiquetas de categoría)

**Interfaces:**
- Produces: categorías `wordpress` = Páginas web (orden 1), `custom-code` = Sistemas a medida (2), `web-app` = Aplicaciones web (3). La Tarea 7 usa estos mismos `id` en `Home.trabajos.tipos`.

- [ ] **Step 1: Crear el contenido**

`src/db/contenido/proyectos.json`:

```json
{
  "categorias": [
    { "id": "wordpress", "sortOrder": 1, "nombres": { "es": "Páginas web", "en": "Websites", "ja": "ウェブサイト" } },
    { "id": "custom-code", "sortOrder": 2, "nombres": { "es": "Sistemas a medida", "en": "Custom systems", "ja": "カスタムシステム" } },
    { "id": "web-app", "sortOrder": 3, "nombres": { "es": "Aplicaciones web", "en": "Web apps", "ja": "ウェブアプリ" } }
  ],
  "proyectos": [
    {
      "id": "ldevminds", "category": "web-app", "client": null,
      "textos": {
        "es": { "title": "DevMinds Links", "description": "Acortador de enlaces y páginas link-in-bio con analíticas, para compartir todo desde un solo enlace.", "fullDescription": "Plataforma propia para acortar enlaces y crear páginas link-in-bio personalizables. Mide cada clic, permite elegir colores y estilos sin tocar código y gestiona usuarios con roles. Disponible en español, inglés y japonés." },
        "en": { "title": "DevMinds Links", "description": "Link shortener and link-in-bio pages with analytics, so you can share everything from a single link.", "fullDescription": "Our own platform to shorten links and build customizable link-in-bio pages. It tracks every click, lets you pick colors and styles without code, and manages users with roles. Available in Spanish, English and Japanese." },
        "ja": { "title": "DevMinds Links", "description": "アナリティクス付きのURL短縮とリンクインバイオページ。ひとつのリンクですべてを共有できます。", "fullDescription": "リンクの短縮と、カスタマイズ可能なリンクインバイオページを作成できる自社プラットフォーム。クリックごとの計測、コード不要の色・スタイル設定、ロールによるユーザー管理に対応。スペイン語・英語・日本語で利用できます。" }
      }
    },
    {
      "id": "softcount", "category": "custom-code", "client": null,
      "textos": {
        "es": { "title": "RMConta - Software contable", "description": "Contabilidad y facturación electrónica para pymes colombianas, conectada con la DIAN.", "fullDescription": "Software contable propio para pequeñas y medianas empresas en Colombia. Reúne la contabilidad y la facturación electrónica validada ante la DIAN para dejar atrás las hojas de cálculo y los procesos manuales." },
        "en": { "title": "RMConta - Accounting software", "description": "Accounting and electronic invoicing for small businesses in Colombia, connected to the national tax authority (DIAN).", "fullDescription": "Our own accounting software for small and medium businesses in Colombia. It brings bookkeeping and DIAN-validated electronic invoicing together, replacing spreadsheets and manual work." },
        "ja": { "title": "RMConta - 会計ソフトウェア", "description": "コロンビアの中小企業向け会計・電子請求ソフト。税務当局(DIAN)と連携。", "fullDescription": "コロンビアの中小企業向けに開発した自社会計ソフトウェア。会計と、DIANで検証される電子請求をひとつにまとめ、表計算や手作業から解放します。" }
      }
    },
    {
      "id": "wilson-isaza", "category": "wordpress", "client": "Wilson Isaza",
      "textos": {
        "es": { "title": "Wilson Isaza - Sitio de campaña", "description": "Sitio de campaña para que los votantes conozcan sus propuestas y su trayectoria.", "fullDescription": "Sitio web en WordPress para la campaña de Wilson Isaza. Reúne sus propuestas, su trayectoria y las noticias de la campaña en un solo lugar fácil de actualizar, pensado para leerse bien en el celular." },
        "en": { "title": "Wilson Isaza - Campaign website", "description": "Campaign website so voters can get to know his proposals and track record.", "fullDescription": "WordPress website for Wilson Isaza's campaign. It brings his proposals, background and campaign news together in one place that is easy to update and reads well on phones." },
        "ja": { "title": "Wilson Isaza - 選挙キャンペーンサイト", "description": "有権者が政策と経歴を知るためのキャンペーンサイト。", "fullDescription": "Wilson Isaza氏の選挙キャンペーン用WordPressサイト。政策、経歴、ニュースを更新しやすい形でひとつにまとめ、スマートフォンでも読みやすく設計しました。" }
      }
    },
    {
      "id": "empo-guzman", "category": "wordpress", "client": "Empo Guzmán",
      "textos": {
        "es": { "title": "Empo Guzmán - Sitio institucional", "description": "Sitio institucional para que los usuarios encuentren fácil la información de la empresa de servicios públicos.", "fullDescription": "Sitio web institucional hecho en Wix para Empo Guzmán, empresa de servicios públicos. Organiza la información para los usuarios en un sitio sencillo que el equipo puede actualizar sin ayuda técnica." },
        "en": { "title": "Empo Guzmán - Institutional website", "description": "Institutional website so residents can easily find the utility company's information.", "fullDescription": "Institutional website built on Wix for Empo Guzmán, a public utility company. It organizes information for residents in a simple site the team can update without technical help." },
        "ja": { "title": "Empo Guzmán - 公式サイト", "description": "公共サービス企業の情報を住民が見つけやすい公式サイト。", "fullDescription": "公共サービス企業Empo GuzmánのためにWixで制作した公式サイト。住民向けの情報をわかりやすく整理し、チームが専門知識なしで更新できます。" }
      }
    },
    {
      "id": "sabajon-portafolio", "category": "wordpress", "client": null,
      "textos": {
        "es": { "title": "Sabajón - Landing de ejemplo", "description": "Ejemplo de landing para un negocio local, pensada para aparecer en Google y convertir visitas en clientes.", "fullDescription": "Proyecto de ejemplo para un negocio ficticio de sabajón artesanal en Neiva. Muestra cómo trabajamos una landing para negocios locales: carga rápida, optimizada para búsquedas locales en Google y con una estructura pensada para convertir visitas en clientes." },
        "en": { "title": "Sabajón - Sample landing page", "description": "Sample landing page for a local business, built to show up on Google and turn visits into customers.", "fullDescription": "Sample project for a fictional craft sabajón shop in Neiva, Colombia. It shows how we approach landing pages for local businesses: fast loading, optimized for local search, and structured to turn visitors into customers." },
        "ja": { "title": "Sabajón - LPサンプル", "description": "地域ビジネス向けLPのサンプル。Google検索に強く、訪問者をお客様に変える設計。", "fullDescription": "コロンビア・ネイバの架空の手作りサバホン店のためのサンプルプロジェクト。高速表示、地域検索への最適化、訪問者をお客様に変える構成など、地域ビジネス向けLPの作り方を示しています。" }
      }
    },
    {
      "id": "devminds-portfolio", "category": "wordpress", "client": null,
      "textos": {
        "es": { "title": "DevMinds - Este sitio", "description": "El sitio que estás viendo: en tres idiomas, rápido y pensado primero para el celular.", "fullDescription": "Sitio de DevMinds en español, inglés y japonés. Muestra los servicios y proyectos del estudio, carga rápido y está diseñado primero para el celular." },
        "en": { "title": "DevMinds - This website", "description": "The site you are looking at: three languages, fast, and designed mobile-first.", "fullDescription": "DevMinds website in Spanish, English and Japanese. It presents the studio's services and projects, loads fast and is designed mobile-first." },
        "ja": { "title": "DevMinds - このサイト", "description": "ご覧のサイト。3言語対応、高速、モバイルファースト設計。", "fullDescription": "スペイン語・英語・日本語に対応したDevMindsのサイト。スタジオのサービスと実績を紹介し、高速表示とモバイルファーストで設計しています。" }
      }
    }
  ]
}
```

- [ ] **Step 2: Checkpoint con pausa, aprobación de textos**

Mostrar al usuario los textos en español (título y descripción por proyecto) y el mapeo de categorías. Señalar los dos datos a confirmar: que Empo Guzmán es una empresa de servicios públicos y que RMConta está conectado con la DIAN. Aplicar sus correcciones al JSON. No seguir sin aprobación.

- [ ] **Step 3: Script de aplicación**

`<scratchpad>/db-proyectos.mjs` (mismo encabezado de `.env.local` que la Tarea 1):

```js
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
const { neon } = createRequire('C:/devminds/package.json')('@neondatabase/serverless');
const env = Object.fromEntries(
  readFileSync('C:/devminds/.env.local', 'utf8').split(/\r?\n/)
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]; })
);
const sql = neon(env.DATABASE_URL);
const c = JSON.parse(readFileSync('C:/devminds/src/db/contenido/proyectos.json', 'utf8'));
const q = [];
for (const cat of c.categorias) {
  q.push(sql`update project_categories set sort_order = ${cat.sortOrder} where id = ${cat.id}`);
  for (const [locale, name] of Object.entries(cat.nombres)) {
    q.push(sql`update category_translations set name = ${name} where category_id = ${cat.id} and locale = ${locale}`);
  }
}
for (const p of c.proyectos) {
  q.push(sql`update projects set category = ${p.category}, client = ${p.client}, updated_at = now() where id = ${p.id}`);
  for (const [locale, tx] of Object.entries(p.textos)) {
    q.push(sql`update project_translations set title = ${tx.title}, description = ${tx.description}, full_description = ${tx.fullDescription} where project_id = ${p.id} and locale = ${locale}`);
  }
}
await sql.transaction(q);
console.log(await sql`select p.id, p.category, p.client, t.title from projects p join project_translations t on t.project_id = p.id and t.locale = 'es' order by p.sort_order`);
console.log(await sql`select category_id, name from category_translations where locale = 'es' order by category_id`);
```

- [ ] **Step 4: Confirmación y ejecución**

Pedir confirmación al usuario ("aplico los textos aprobados en producción"). Luego:
Run: `node "<scratchpad>/db-proyectos.mjs"`
Expected: 6 filas con los títulos nuevos (`RMConta - Software contable`, etc.) y categorías `Páginas web`, `Sistemas a medida`, `Aplicaciones web`, `Todos`.

- [ ] **Step 5: Seed leyendo el JSON**

En `src/db/seed.ts`:
- Agregar debajo de los imports: `import contenido from './contenido/proyectos.json';`
- Reemplazar el array `categories` por:

```ts
  const categories = [
    { id: 'all', sortOrder: 0 },
    ...contenido.categorias.map(({ id, sortOrder }) => ({ id, sortOrder })),
  ];
```

- Reemplazar el array `categoryTranslationsData` por:

```ts
  const categoryTranslationsData = [
    { categoryId: 'all', locale: 'es', name: 'Todos' },
    { categoryId: 'all', locale: 'en', name: 'All' },
    { categoryId: 'all', locale: 'ja', name: 'すべて' },
    ...contenido.categorias.flatMap((cat) =>
      Object.entries(cat.nombres).map(([locale, name]) => ({ categoryId: cat.id, locale, name }))
    ),
  ];
```

- En cada objeto de `projectsData`, igualar `category` y `client` a los del JSON (`softcount` → `custom-code`, `client: null`; `empo-guzman` → `wordpress`, `'Empo Guzmán'`; `sabajon-portafolio` y `devminds-portfolio` → `wordpress`, `null`; `wilson-isaza` → `'Wilson Isaza'`; `ldevminds` → `null`). Si un `id` del JSON no existe en `projectsData`, no agregarlo (el seed solo siembra lo que ya sembraba).
- Reemplazar el array `projectTranslationsData` completo por:

```ts
  const projectTranslationsData = contenido.proyectos.flatMap((p) =>
    Object.entries(p.textos).map(([locale, tx]) => ({ projectId: p.id, locale, ...tx }))
  );
```

- [ ] **Step 6: Etiquetas del admin**

En `src/app/admin/components/ProjectForm.tsx` reemplazar `CATEGORY_OPTIONS` por:

```ts
const CATEGORY_OPTIONS = [
  { value: 'wordpress', label: 'Página web' },
  { value: 'custom-code', label: 'Sistema a medida' },
  { value: 'web-app', label: 'Aplicación web' },
];
```

y en `src/app/admin/(dashboard)/projects/page.tsx:25-27` usar las mismas etiquetas (`'web-app': 'Aplicación web'`, `'wordpress': 'Página web'`, `'custom-code': 'Sistema a medida'`).

- [ ] **Step 7: Verificar**

Run: `pnpm exec tsc --noEmit && pnpm exec eslint src/db/seed.ts src/app/admin/components/ProjectForm.tsx "src/app/admin/(dashboard)/projects/page.tsx"`
Expected: sin errores nuevos.
Run: `curl -s http://localhost:3000/es/portfolio | grep -o "Sistemas a medida" | head -1` (puede tardar hasta 1 h por `unstable_cache`; si no aparece, reiniciar el dev server y repetir).
Expected: `Sistemas a medida`.

- [ ] **Step 8: Commit**

```bash
git add src/db/contenido/proyectos.json src/db/seed.ts src/app/admin/components/ProjectForm.tsx "src/app/admin/(dashboard)/projects/page.tsx"
git commit -m "feat(contenido): textos de proyectos en clave de resultado y categorías para clientes

Los proyectos se describían por la tecnología usada; ahora cuentan qué le
resolvieron al cliente. SoftCount pasa a RMConta, Sabajón queda marcado como
ejemplo y las categorías usan lenguaje de cliente. El JSON es la fuente única
para la DB y el seed."
```

---

## Fase 1 · Base

### Task 4: Vitest y lógica pura (enlaces, rutas, equipo, metadatos)

**Files:**
- Create: `vitest.config.mts`
- Create: `src/lib/enlaces.ts`, `src/lib/enlaces.test.ts`
- Create: `src/lib/rutas.ts`, `src/lib/rutas.test.ts`
- Create: `src/lib/equipo.ts`, `src/lib/equipo.test.ts`
- Create: `src/lib/proyectos.ts`, `src/lib/proyectos.test.ts`
- Modify: `package.json` (script `test`, devDependency `vitest`)

**Interfaces:**
- Produces:
  - `enlaceWhatsApp(mensaje?: string): string`, `enlaceLlamada(): string`, `enlaceCorreo(asunto?: string): string`
  - `rutaEnIdioma(pathname: string, idioma: Locale): string`
  - `elegirFundador<T extends { hierarchy: string }>(miembros: T[]): T | null`
  - `lineaMeta(partes: Array<string | number | null | undefined>): string`

- [ ] **Step 1: Instalar Vitest**

Run: `pnpm add -D vitest@5.0.5`
Agregar a `scripts` de `package.json`: `"test": "vitest run"`.

`vitest.config.mts`:

```ts
import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: { include: ['src/**/*.test.ts'], environment: 'node' },
});
```

- [ ] **Step 2: Tests que fallan**

`src/lib/enlaces.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { enlaceCorreo, enlaceLlamada, enlaceWhatsApp } from './enlaces';

describe('enlaceWhatsApp', () => {
  it('usa el número con indicativo y sin símbolos', () => {
    expect(enlaceWhatsApp()).toBe('https://wa.me/573102007674');
  });
  it('codifica acentos, signos y ampersand', () => {
    expect(enlaceWhatsApp('Hola, ¿cómo están? Sí & #1')).toBe(
      'https://wa.me/573102007674?text=Hola%2C%20%C2%BFc%C3%B3mo%20est%C3%A1n%3F%20S%C3%AD%20%26%20%231'
    );
  });
  it('codifica texto en japonés', () => {
    expect(enlaceWhatsApp('相談')).toBe('https://wa.me/573102007674?text=%E7%9B%B8%E8%AB%87');
  });
  it('ignora un mensaje vacío', () => {
    expect(enlaceWhatsApp('')).toBe('https://wa.me/573102007674');
  });
});

describe('enlaceLlamada', () => {
  it('arma un tel: internacional', () => {
    expect(enlaceLlamada()).toBe('tel:+573102007674');
  });
});

describe('enlaceCorreo', () => {
  it('sin asunto', () => {
    expect(enlaceCorreo()).toBe('mailto:semoca00@gmail.com');
  });
  it('con asunto codificado', () => {
    expect(enlaceCorreo('Proyecto web')).toBe('mailto:semoca00@gmail.com?subject=Proyecto%20web');
  });
});
```

`src/lib/rutas.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { rutaEnIdioma } from './rutas';

describe('rutaEnIdioma', () => {
  it('cambia la raíz del idioma', () => {
    expect(rutaEnIdioma('/es', 'en')).toBe('/en');
  });
  it('conserva la subruta', () => {
    expect(rutaEnIdioma('/es/portfolio', 'ja')).toBe('/ja/portfolio');
  });
  it('no toca segmentos que empiezan igual que un idioma', () => {
    expect(rutaEnIdioma('/es/estudio', 'en')).toBe('/en/estudio');
  });
  it('agrega el idioma si la ruta no lo tiene', () => {
    expect(rutaEnIdioma('/', 'ja')).toBe('/ja');
    expect(rutaEnIdioma('/about', 'en')).toBe('/en/about');
  });
});
```

`src/lib/equipo.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { elegirFundador } from './equipo';

describe('elegirFundador', () => {
  it('prefiere a quien tiene hierarchy founder', () => {
    expect(elegirFundador([{ hierarchy: 'developer', n: 1 }, { hierarchy: 'founder', n: 2 }])).toEqual({ hierarchy: 'founder', n: 2 });
  });
  it('si no hay founder, usa el primero', () => {
    expect(elegirFundador([{ hierarchy: 'co-founder', n: 1 }])).toEqual({ hierarchy: 'co-founder', n: 1 });
  });
  it('sin miembros devuelve null', () => {
    expect(elegirFundador([])).toBeNull();
  });
});
```

`src/lib/proyectos.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { lineaMeta } from './proyectos';

describe('lineaMeta', () => {
  it('une las partes con punto medio', () => {
    expect(lineaMeta(['Página web', 'Wilson Isaza', 2026])).toBe('Página web · Wilson Isaza · 2026');
  });
  it('omite vacíos, null y undefined', () => {
    expect(lineaMeta(['Sistema a medida', null, undefined, '', 2026])).toBe('Sistema a medida · 2026');
  });
  it('todo vacío da cadena vacía', () => {
    expect(lineaMeta([null, undefined])).toBe('');
  });
});
```

- [ ] **Step 3: Verificar que fallan**

Run: `pnpm test`
Expected: FAIL, los cuatro archivos con "Failed to resolve import" (`./enlaces`, `./rutas`, `./equipo`, `./proyectos`).

- [ ] **Step 4: Implementación mínima**

`src/lib/enlaces.ts`:

```ts
import contactConfig from '@/config/contact.json';

const telefono = contactConfig.phone.replace(/\D/g, '');

/** URL de WhatsApp (wa.me) al número de DevMinds, con mensaje prellenado opcional. */
export function enlaceWhatsApp(mensaje?: string): string {
  const base = `https://wa.me/${telefono}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

/** URL `tel:` internacional para llamar a DevMinds. */
export function enlaceLlamada(): string {
  return `tel:+${telefono}`;
}

/** URL `mailto:` al correo de DevMinds, con asunto opcional. */
export function enlaceCorreo(asunto?: string): string {
  const base = `mailto:${contactConfig.email}`;
  return asunto ? `${base}?subject=${encodeURIComponent(asunto)}` : base;
}
```

`src/lib/rutas.ts`:

```ts
import { locales, type Locale } from '@/config/i18n-config';

const prefijo = new RegExp(`^/(${locales.join('|')})(?=/|$)`);

/** Devuelve `pathname` con su prefijo de idioma cambiado a `idioma` (o agregado si no lo tenía). */
export function rutaEnIdioma(pathname: string, idioma: Locale): string {
  if (prefijo.test(pathname)) return pathname.replace(prefijo, `/${idioma}`);
  return pathname === '/' ? `/${idioma}` : `/${idioma}${pathname}`;
}
```

`src/lib/equipo.ts`:

```ts
/** Elige a quién mostrar como fundador: el marcado `founder`, si no el primero, si no `null`. */
export function elegirFundador<T extends { hierarchy: string }>(miembros: T[]): T | null {
  return miembros.find((m) => m.hierarchy === 'founder') ?? miembros[0] ?? null;
}
```

`src/lib/proyectos.ts`:

```ts
/** Une tipo, cliente y año de un proyecto con " · ", omitiendo partes vacías. */
export function lineaMeta(partes: Array<string | number | null | undefined>): string {
  return partes.filter((p) => p !== null && p !== undefined && p !== '').join(' · ');
}
```

- [ ] **Step 5: Verificar que pasan**

Run: `pnpm test`
Expected: PASS, 15 tests.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.mts package.json pnpm-lock.yaml src/lib/enlaces.ts src/lib/enlaces.test.ts src/lib/rutas.ts src/lib/rutas.test.ts src/lib/equipo.ts src/lib/equipo.test.ts src/lib/proyectos.ts src/lib/proyectos.test.ts
git commit -m "feat: helpers centralizados de enlaces, idioma, fundador y metadatos con Vitest

WhatsApp, tel: y mailto: se armaban en cada componente; ahora salen de un solo
módulo con tests (incluye mensajes con acentos y japonés). Se agrega Vitest,
el estándar de los proyectos recientes."
```

### Task 5: Tokens, tipografía y fin del tema oscuro público

**Files:**
- Modify: `src/styles/globals.css` (bloque `:root`, comentario de `.dark`, utilidades)
- Modify: `tailwind.config.ts` (colores y `fontFamily.doto`)
- Modify: `src/components/ui/button.tsx` (hover y tamaño `lg`)
- Modify: `src/components/ui/sonner.tsx` (tema fijo claro)
- Modify: `src/app/[lang]/layout.tsx` (script de tema, wrapper, metas, peso de Doto)
- Modify: `src/app/components/layout/Navbar.tsx` (quitar `ThemeSwitcher`, temporal hasta la Tarea 8)
- Modify: `src/app/components/layout/Footer/Footer.tsx:44` (`font-doto` ya existe tras este cambio)
- Delete: `src/app/contexts/ThemeContext.tsx`, `src/app/components/ui/ThemeSwitcher/ThemeSwitcher.tsx`, `src/app/components/ClientThemeWrapper.tsx`
- Modify: `package.json` (quitar `next-themes`)

**Interfaces:**
- Produces: clases Tailwind `bg-surface-3`, `border-guide`, `bg-guide`, `bg-accent-tint`, `hover:bg-primary-hover`, `text-primary-hover`, `font-doto`; utilidad CSS `.entrada` (con `--i`) y `.campo-puntos`. Las usan todas las tareas siguientes.

- [ ] **Step 1: Tokens en `globals.css`**

Reemplazar el bloque `:root { ... }` del primer `@layer base` por:

```css
  :root {
    /* Modo claro único: blanco nieve fría, grafito y terracota (spec 2026-10-19) */
    --background: 216 56% 98.2%;
    --foreground: 218 18% 12%;
    --card: 216 56% 98.2%;
    --card-foreground: 218 18% 12%;
    --popover: 216 56% 98.2%;
    --popover-foreground: 218 18% 12%;
    --primary: 16 60% 44.5%;
    --primary-foreground: 210 67% 98.8%;
    --primary-hover: 17 65% 37.5%;
    --secondary: 207 36% 95.1%;
    --secondary-foreground: 218 18% 12%;
    --muted: 207 36% 95.1%;
    --muted-foreground: 216 8% 36.3%;
    --accent: 207 26% 91.6%;
    --accent-foreground: 218 18% 12%;
    --accent-tint: 20 77% 93.1%;
    --surface-3: 207 26% 91.6%;
    --destructive: 0 72% 45%;
    --destructive-foreground: 210 67% 98.8%;
    --border: 203 13% 88.2%;
    --input: 203 13% 88.2%;
    --ring: 16 60% 44.5%;
    --guide: 207 14% 84.9%;
    --dots: 218 18% 12% / 0.26;
    --radius: 0.75rem;
  }
```

Encima de `.dark {` agregar el comentario `/* Solo para /admin, que fuerza className="dark". El sitio público no tiene modo oscuro. */`.

Al final del segundo `@layer base` (después de la regla de `prefers-reduced-motion`) agregar:

```css
  html {
    scroll-behavior: smooth;
  }
  section[id] {
    scroll-margin-top: 5rem;
  }
  :focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 3px;
  }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
  }
```

En el bloque `@layer components` de "HERO PARTICLES ANIMATION", agregar al final:

```css
  /* Entrada única del hero: CSS puro, sin flash de hidratación */
  @keyframes entrada {
    from { opacity: 0; transform: translateY(14px); }
    to { opacity: 1; transform: none; }
  }
  .entrada {
    animation: entrada 700ms cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: calc(var(--i, 0) * 80ms + 60ms);
  }

  /* Campo de puntos de la retícula (eco de Doto), intensidad media */
  .campo-puntos {
    background-image: radial-gradient(circle, hsl(var(--dots)) 1.3px, transparent 1.6px);
    background-size: 18px 18px;
    -webkit-mask-image: radial-gradient(ellipse 65% 80% at 85% 35%, #000 30%, transparent 78%);
    mask-image: radial-gradient(ellipse 65% 80% at 85% 35%, #000 30%, transparent 78%);
  }
  @media (max-width: 767px) {
    .campo-puntos {
      -webkit-mask-image: radial-gradient(ellipse 85% 45% at 80% 15%, #000 20%, transparent 75%);
      mask-image: radial-gradient(ellipse 85% 45% at 80% 15%, #000 20%, transparent 75%);
    }
  }
```

- [ ] **Step 2: `tailwind.config.ts`**

En `theme.extend.colors`: cambiar `primary` por

```ts
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))'
        },
```

y agregar dentro de `colors`:

```ts
        'accent-tint': 'hsl(var(--accent-tint))',
        'surface-3': 'hsl(var(--surface-3))',
        guide: 'hsl(var(--guide))',
```

En `fontFamily` agregar `doto: ['var(--font-doto)', 'monospace'],` (se conserva `mono` para las páginas de la fase 2). Cambiar `darkMode: ['class', 'class'],` por `darkMode: 'class',`.

- [ ] **Step 3: Botón**

En `src/components/ui/button.tsx`: variante `default` → `"bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover"`; tamaño `lg` → `"h-11 rounded-lg px-6 text-[15px]"`.

- [ ] **Step 4: Sonner fijo en claro**

`src/components/ui/sonner.tsx`: borrar `import { useTheme } from "next-themes"` y la línea `const { theme = "system" } = useTheme()`; cambiar `theme={theme as ToasterProps["theme"]}` por `theme="light"`.

- [ ] **Step 5: Layout**

En `src/app/[lang]/layout.tsx`:
- Doto: `weight: ["900"],`.
- Borrar el `<script dangerouslySetInnerHTML>` del tema (el que lee `devminds-theme`).
- Reemplazar las dos metas `theme-color` por `<meta name="theme-color" content="#f8fafd" />` y `msapplication-TileColor` por `#f8fafd`.
- Borrar `import ClientThemeWrapper ...` y reemplazar `<ClientThemeWrapper> ... </ClientThemeWrapper>` por su contenido (el `NextIntlClientProvider` y el `Toaster`).

- [ ] **Step 6: Quitar el switch**

En `src/app/components/layout/Navbar.tsx`: borrar el import de `ThemeSwitcher` y sus dos usos (`<ThemeSwitcher className="hover:bg-accent/20" />`). Borrar `src/app/contexts/ThemeContext.tsx`, `src/app/components/ui/ThemeSwitcher/ThemeSwitcher.tsx` y `src/app/components/ClientThemeWrapper.tsx`.
Run: `pnpm remove next-themes`
Run: `grep -rn "ThemeContext\|ThemeSwitcher\|ClientThemeWrapper\|next-themes\|devminds-theme" src`
Expected: sin resultados.

- [ ] **Step 7: Verificar**

Run: `pnpm exec tsc --noEmit && pnpm exec eslint src/components/ui/button.tsx src/components/ui/sonner.tsx "src/app/[lang]/layout.tsx" src/app/components/layout/Navbar.tsx && pnpm test`
Expected: sin errores; tests en verde.

- [ ] **Step 8: CV (con pausa)**

`RUTAS = ['/es', '/es/about', '/es/services', '/es/portfolio', '/es/contact']`, `SECCIONES = []`. Además abrir `http://localhost:3000/admin/login` y comprobar que sigue oscuro. Mostrar al usuario: la home vieja con los colores nuevos (aún sin rediseño) y las demás páginas heredando sin romperse. Corregir lo que se vea roto (texto ilegible por un token que cambió de oscuro a claro, como `bg-accent`).

- [ ] **Step 9: Commit**

```bash
git add -A src/styles/globals.css tailwind.config.ts src/components/ui/button.tsx src/components/ui/sonner.tsx "src/app/[lang]/layout.tsx" src/app/components/layout/Navbar.tsx src/app/contexts src/app/components/ui/ThemeSwitcher src/app/components/ClientThemeWrapper.tsx package.json pnpm-lock.yaml
git commit -m "feat(diseño): tokens de modo claro (nieve fría + terracota) y fin del tema oscuro público

El modo claro es el que más se acerca a una marca amigable; mantener dos temas
duplicaba el trabajo. El bloque .dark queda solo para /admin."
```

### Task 6: Marca y retícula

**Files:**
- Create: `src/app/components/marca/Wordmark.tsx`
- Create: `src/app/components/reticula/Reticula.tsx`, `DivisorSeccion.tsx`, `CampoPuntos.tsx`, `Rieles.tsx`
- Modify: `src/app/[lang]/about/AboutClient.tsx`, `src/app/[lang]/contact/page.tsx`, `src/app/[lang]/portfolio/PortfolioClient.tsx`, `src/app/[lang]/services/page.tsx`, `src/app/[lang]/HomeClient.tsx` (cambiar `SocialSidebar` + `EmailSidebar` por `Rieles`)
- Modify: `messages/es.json`, `messages/en.json`, `messages/ja.json` (clave `Home.rieles.ubicacion`)
- Delete: `src/app/components/layout/SocialSidebar.tsx`, `src/app/components/layout/EmailSidebar.tsx`

**Interfaces:**
- Consumes: clases de la Tarea 5.
- Produces: `<Wordmark className?: string />`, `<Reticula />` (padre `relative`), `<DivisorSeccion />`, `<CampoPuntos className?: string />`, `<Rieles />`.

- [ ] **Step 1: Wordmark**

```tsx
import { cn } from '@/lib/utils';

/** Marca "DevMinds" en Doto 900. Único lugar donde se define el wordmark. */
export default function Wordmark({ className }: { className?: string }) {
  return <span className={cn('font-doto font-black tracking-[-0.03em]', className)}>DevMinds</span>;
}
```

- [ ] **Step 2: Retícula**

`Reticula.tsx`:

```tsx
/** Guías verticales en los bordes de la columna de contenido, a todo lo alto del padre (`relative`). */
export default function Reticula() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
      <div className="container-main h-full">
        <div className="h-full border-x border-guide" />
      </div>
    </div>
  );
}
```

`DivisorSeccion.tsx`:

```tsx
import { cn } from '@/lib/utils';

function Cruz({ lado }: { lado: 'izq' | 'der' }) {
  return (
    <span aria-hidden className={cn('absolute top-1/2 size-[13px] -translate-y-1/2', lado === 'izq' ? '-left-[6px]' : '-right-[6px]')}>
      <span className="absolute left-[6px] top-0 h-full w-px bg-foreground/55" />
      <span className="absolute left-0 top-[6px] h-px w-full bg-foreground/55" />
    </span>
  );
}

/** Línea de borde a borde con una cruz "+" donde toca cada guía vertical. */
export default function DivisorSeccion() {
  return (
    <div aria-hidden className="relative z-10 h-px bg-guide">
      <div className="container-main h-px">
        <div className="relative h-px">
          <Cruz lado="izq" />
          <Cruz lado="der" />
        </div>
      </div>
    </div>
  );
}
```

`CampoPuntos.tsx`:

```tsx
import { cn } from '@/lib/utils';

/** Campo de puntos que se desvanece (eco de Doto). Solo en el hero; el padre debe ser `relative`. */
export default function CampoPuntos({ className }: { className?: string }) {
  return <div aria-hidden className={cn('campo-puntos pointer-events-none absolute inset-0', className)} />;
}
```

`Rieles.tsx`:

```tsx
'use client';

import { Github, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import contactConfig from '@/config/contact.json';

const enlace = 'text-muted-foreground transition-colors hover:text-primary';

/** Rieles fijos en los márgenes (solo con ancho ≥ 1360px, donde caben fuera de las guías). */
export default function Rieles() {
  const t = useTranslations('Home.rieles');
  return (
    <>
      <div className="fixed bottom-0 left-0 z-40 hidden w-10 flex-col items-center gap-5 pb-8 min-[1360px]:flex">
        <a href={contactConfig.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={enlace}>
          <Github className="size-[18px]" />
        </a>
        <a href={contactConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={enlace}>
          <Linkedin className="size-[18px]" />
        </a>
        <span className="h-20 w-px bg-guide" />
      </div>
      <div className="fixed bottom-0 right-0 z-40 hidden w-10 flex-col items-center gap-4 pb-8 min-[1360px]:flex">
        <span className="text-xs tracking-[0.08em] text-muted-foreground [writing-mode:vertical-rl]">{t('ubicacion')}</span>
        <span className="font-doto text-xs font-black text-foreground">2.93°N</span>
        <span className="h-20 w-px bg-guide" />
      </div>
    </>
  );
}
```

- [ ] **Step 3: Clave de ubicación**

En los tres `messages/*.json` agregar al final del objeto raíz: `"Home": { "rieles": { "ubicacion": "Neiva, Huila · Colombia" } }` (el mismo texto en los tres idiomas). La Tarea 7 completa `Home`.

- [ ] **Step 4: Reemplazar las barras laterales**

En `HomeClient.tsx`, `AboutClient.tsx`, `contact/page.tsx`, `PortfolioClient.tsx` y `services/page.tsx`: cambiar los imports de `SocialSidebar` y `EmailSidebar` por `import Rieles from '@/app/components/reticula/Rieles';` y sus dos usos JSX por un solo `<Rieles />`. Borrar `SocialSidebar.tsx` y `EmailSidebar.tsx`.
Run: `grep -rn "SocialSidebar\|EmailSidebar" src`
Expected: sin resultados.

- [ ] **Step 5: Verificar**

Run: `pnpm exec tsc --noEmit && pnpm exec eslint src/app/components/marca src/app/components/reticula && pnpm test`
Expected: sin errores.

- [ ] **Step 6: CV (sin pausa)**

`RUTAS = ['/es/about']` a 1440: los rieles aparecen en los márgenes y no tapan contenido. A 1280: no aparecen.

- [ ] **Step 7: Commit**

```bash
git add -A src/app/components/marca src/app/components/reticula src/app/components/layout messages "src/app/[lang]"
git commit -m "feat(diseño): wordmark en Doto y componentes de la retícula de estudio

Las líneas y los puntos se conservan como estructura (guías, cruces, rieles)
en lugar de efectos. Los rieles reemplazan las barras laterales y muestran la
ubicación en vez del correo personal."
```

### Task 7: Textos de la home en ES, EN y JA

**Files:**
- Modify: `messages/es.json`, `messages/en.json`, `messages/ja.json` (`Home` completo, `Navbar`, `Footer.tagline`, `Metadata.home`)
- Create: `src/config/preguntas.ts`
- Create: `src/lib/traducciones.test.ts`

**Interfaces:**
- Produces: espacio de textos `Home.*` (claves exactas abajo) y `PREGUNTAS: readonly ['costo', 'tiempo', 'propiedad', 'google', 'soporte', 'alcance']`, `type PreguntaId`.

- [ ] **Step 1: Tests que fallan**

`src/lib/traducciones.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import es from '../../messages/es.json';
import en from '../../messages/en.json';
import ja from '../../messages/ja.json';
import { PREGUNTAS } from '@/config/preguntas';

function claves(obj: unknown, prefijo = ''): string[] {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return [prefijo];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => claves(v, prefijo ? `${prefijo}.${k}` : k));
}

const base = claves(es).sort();

describe('paridad de traducciones', () => {
  it.each([['en', en], ['ja', ja]] as const)('%s tiene exactamente las claves de es', (_, msgs) => {
    expect(claves(msgs).sort()).toEqual(base);
  });
});

describe('preguntas frecuentes', () => {
  it.each([['es', es], ['en', en], ['ja', ja]] as const)('%s tiene pregunta y respuesta para cada id', (_, msgs) => {
    const items = (msgs as { Home: { preguntas: { items: Record<string, { pregunta?: string; respuesta?: string }> } } }).Home.preguntas.items;
    for (const id of PREGUNTAS) {
      expect(items[id]?.pregunta, `${id}.pregunta`).toBeTruthy();
      expect(items[id]?.respuesta, `${id}.respuesta`).toBeTruthy();
    }
  });
});
```

`src/config/preguntas.ts`:

```ts
/** Preguntas frecuentes de la home, en orden. Textos en messages/*.json → Home.preguntas.items.<id>. */
export const PREGUNTAS = ['costo', 'tiempo', 'propiedad', 'google', 'soporte', 'alcance'] as const;
export type PreguntaId = (typeof PREGUNTAS)[number];
```

Run: `pnpm test src/lib/traducciones.test.ts`
Expected: FAIL en "preguntas frecuentes" (no existe `Home.preguntas`). Si la paridad también falla por claves viejas que ya faltaban, anotar cuáles: se resuelven en el Step 3.

- [ ] **Step 2: Escribir `Home` en los tres idiomas**

Reemplazar el objeto `Home` (creado en la Tarea 6) de cada archivo por el de su idioma.

`messages/es.json` → `"Home"`:

```json
{
  "whatsappMensaje": "Hola DevMinds, quiero hablar de un proyecto.",
  "rieles": { "ubicacion": "Neiva, Huila · Colombia" },
  "hero": {
    "chip": "Respondemos en 24 h",
    "titulo": "crea el software que tu negocio <acento>necesita</acento>.",
    "texto": "Ingeniería de software desde Neiva, Huila. Empezamos por lo que más te urge y crecemos contigo, explicándote todo sin tecnicismos.",
    "whatsapp": "Escríbenos por WhatsApp",
    "verTrabajos": "Ver trabajos"
  },
  "escalera": {
    "titulo": "Crecemos contigo, paso a paso",
    "subtitulo": "La mayoría empieza por el primer escalón.",
    "pasos": {
      "web": { "etiqueta": "Que te encuentren", "titulo": "Página web + Google", "texto": "Aparece en Google y Maps y recibe clientes por WhatsApp.", "tiempo": "1–2 sem." },
      "sistemas": { "etiqueta": "Organiza tu negocio", "titulo": "Sistemas a medida", "texto": "Facturación, cobranza, inventarios: lo que hoy haces en Excel.", "tiempo": "1–3 meses" },
      "apps": { "etiqueta": "Llega a tus clientes", "titulo": "Apps móviles", "texto": "Tu servicio en el celular de tus clientes." },
      "soporte": { "etiqueta": "Ya tienes software", "titulo": "Consultoría y soporte", "texto": "Lo revisamos, lo mejoramos y lo mantenemos." }
    }
  },
  "trabajos": {
    "titulo": "Proyectos reales para negocios reales.",
    "verTodos": "Ver todos los trabajos",
    "tipos": { "wordpress": "Página web", "custom-code": "Sistema a medida", "web-app": "Aplicación web" }
  },
  "proceso": {
    "titulo": "Sin sorpresas, de principio a fin.",
    "pasos": {
      "conversamos": { "titulo": "Conversamos", "texto": "Nos cuentas tu negocio y lo que necesitas. La primera consulta es gratis." },
      "proponemos": { "titulo": "Te proponemos", "texto": "Alcance, tiempos y un precio fijo por escrito. Puedes pagar por etapas." },
      "construimos": { "titulo": "Construimos contigo", "texto": "Ves avances reales cada semana, no solo al final." },
      "lanzamos": { "titulo": "Lanzamos y te acompañamos", "texto": "Publicamos, te enseñamos a usarlo y seguimos ahí." }
    }
  },
  "quienes": {
    "titulo": "Personas, no una fábrica de código.",
    "texto": "Detrás de DevMinds está {nombre}, ingeniero de software en Neiva. Hablas directo con quien diseña y construye tu proyecto, sin intermediarios.",
    "tecnologias": "Trabajamos con Next.js, React, Flutter, PostgreSQL y lo que tu proyecto necesite.",
    "enlace": "Conoce más"
  },
  "preguntas": {
    "titulo": "Preguntas frecuentes",
    "subtitulo": "Lo que casi todos nos preguntan antes de empezar.",
    "items": {
      "costo": { "pregunta": "¿Cuánto cuesta y cómo se paga?", "respuesta": "Cada proyecto es distinto. Después de una primera consulta gratis te enviamos una propuesta por escrito con alcance, tiempos y precio fijo. Puedes pagar por etapas a medida que avanza el proyecto." },
      "tiempo": { "pregunta": "¿Cuánto tiempo toma?", "respuesta": "Una página web suele estar lista en 1 a 2 semanas. Un sistema a medida toma de 1 a 3 meses, según el alcance. Acordamos los tiempos antes de empezar." },
      "propiedad": { "pregunta": "¿La página y el código son míos?", "respuesta": "Sí. Al terminar recibes todo el código, la documentación y los accesos. Es tuyo por completo." },
      "google": { "pregunta": "¿Me ayudan a aparecer en Google Maps?", "respuesta": "Sí. Creamos o mejoramos tu ficha de Google Business, la conectamos con tu página y te damos un enlace para que tus clientes te dejen reseñas, que es lo que más pesa para salir arriba." },
      "soporte": { "pregunta": "¿Qué pasa después de la entrega?", "respuesta": "Te enseñamos a usar lo que construimos y ofrecemos planes de soporte y mantenimiento para que todo siga funcionando a medida que tu negocio crece." },
      "alcance": { "pregunta": "¿Solo trabajan en Neiva?", "respuesta": "No. Estamos en Neiva, Huila, y trabajamos con negocios de toda Colombia y de otros países por videollamada." }
    }
  },
  "cierre": {
    "titulo": "¿Hablamos de tu proyecto?",
    "texto": "Cuéntanos qué necesitas y te respondemos en menos de 24 horas, sin compromiso.",
    "whatsapp": "Escríbenos por WhatsApp",
    "correo": "Enviar un correo",
    "asunto": "Quiero hablar de un proyecto"
  },
  "barra": { "whatsapp": "WhatsApp", "llamar": "Llamar" }
}
```

`messages/en.json` → `"Home"`:

```json
{
  "whatsappMensaje": "Hi DevMinds, I'd like to talk about a project.",
  "rieles": { "ubicacion": "Neiva, Huila · Colombia" },
  "hero": {
    "chip": "We reply within 24 h",
    "titulo": "builds the software your business <acento>needs</acento>.",
    "texto": "Software engineering from Colombia for companies anywhere. Clear communication in English, US-friendly hours, and code that belongs to you.",
    "whatsapp": "Message us on WhatsApp",
    "verTrabajos": "See our work"
  },
  "escalera": {
    "titulo": "We grow with you, step by step",
    "subtitulo": "Most clients start with the first step.",
    "pasos": {
      "web": { "etiqueta": "Get found", "titulo": "Websites & landing pages", "texto": "Fast, search-ready sites that turn visitors into clients.", "tiempo": "1–2 wks" },
      "sistemas": { "etiqueta": "Run your business", "titulo": "Custom systems", "texto": "Invoicing, collections, inventory: the work you still do in spreadsheets.", "tiempo": "1–3 months" },
      "apps": { "etiqueta": "Reach your customers", "titulo": "Mobile apps", "texto": "Your service in your customers' pockets." },
      "soporte": { "etiqueta": "Already have software", "titulo": "Consulting & support", "texto": "We review it, improve it and keep it running." }
    }
  },
  "trabajos": {
    "titulo": "Real projects for real businesses.",
    "verTodos": "See all work",
    "tipos": { "wordpress": "Website", "custom-code": "Custom system", "web-app": "Web app" }
  },
  "proceso": {
    "titulo": "No surprises, start to finish.",
    "pasos": {
      "conversamos": { "titulo": "We talk", "texto": "Tell us about your business and what you need. The first call is free." },
      "proponemos": { "titulo": "We send a proposal", "texto": "Scope, timeline and a fixed price in writing. You can pay in stages." },
      "construimos": { "titulo": "We build it with you", "texto": "You see real progress every week, not just at the end." },
      "lanzamos": { "titulo": "We launch and stay around", "texto": "We go live, show you how to use it and keep supporting you." }
    }
  },
  "quienes": {
    "titulo": "People, not a code factory.",
    "texto": "Behind DevMinds is {nombre}, a software engineer based in Colombia. You talk directly to the person who designs and builds your project, no middlemen.",
    "tecnologias": "We work with Next.js, React, Flutter, PostgreSQL and whatever your project needs.",
    "enlace": "Learn more"
  },
  "preguntas": {
    "titulo": "Frequently asked questions",
    "subtitulo": "What almost everyone asks before we start.",
    "items": {
      "costo": { "pregunta": "How much does it cost and how do I pay?", "respuesta": "Every project is different. After a free first call we send a written proposal with scope, timeline and a fixed price. You can pay in stages as the project moves forward." },
      "tiempo": { "pregunta": "How long does it take?", "respuesta": "A website or landing page usually takes 1 to 2 weeks. Custom systems take 1 to 3 months depending on scope. We agree on a clear timeline before starting." },
      "propiedad": { "pregunta": "Do I own the code?", "respuesta": "Yes. When the project is done you get the full source code, documentation and every access. It is yours." },
      "google": { "pregunta": "Will my website show up on Google?", "respuesta": "Yes. Sites are built search-ready: fast, well structured and with proper metadata. If you have a physical location, we also help you set up your Google Business Profile." },
      "soporte": { "pregunta": "What happens after launch?", "respuesta": "We show you how to use what we built and offer support and maintenance plans so everything keeps working as your business grows." },
      "alcance": { "pregunta": "Do you work with clients outside Colombia?", "respuesta": "Yes. We work remotely by video call with clients anywhere. Colombia shares business hours with the US, so meetings are easy to schedule." }
    }
  },
  "cierre": {
    "titulo": "Let's talk about your project",
    "texto": "Tell us what you need and we will reply within 24 hours, no strings attached.",
    "whatsapp": "Message us on WhatsApp",
    "correo": "Send an email",
    "asunto": "Project inquiry"
  },
  "barra": { "whatsapp": "WhatsApp", "llamar": "Call" }
}
```

`messages/ja.json` → `"Home"`:

```json
{
  "whatsappMensaje": "こんにちは、DevMinds。プロジェクトについて相談したいです。",
  "rieles": { "ubicacion": "Neiva, Huila · Colombia" },
  "hero": {
    "chip": "24時間以内に返信します",
    "titulo": "は、あなたのビジネスに<acento>必要な</acento>ソフトウェアをつくります。",
    "texto": "コロンビアから世界中の企業へ、ソフトウェアエンジニアリングを。英語でのやり取りに対応し、コードはすべてお客様のものです。",
    "whatsapp": "WhatsAppで相談する",
    "verTrabajos": "実績を見る"
  },
  "escalera": {
    "titulo": "一歩ずつ、ともに成長します",
    "subtitulo": "多くのお客様は最初の一歩から始めます。",
    "pasos": {
      "web": { "etiqueta": "見つけてもらう", "titulo": "ウェブサイト・LP", "texto": "検索に強く、訪問者をお客様に変える高速なサイト。", "tiempo": "1〜2週間" },
      "sistemas": { "etiqueta": "業務を整える", "titulo": "カスタムシステム", "texto": "請求、回収、在庫管理など、表計算で行っている業務を。", "tiempo": "1〜3か月" },
      "apps": { "etiqueta": "お客様に届ける", "titulo": "モバイルアプリ", "texto": "あなたのサービスを、お客様のスマートフォンに。" },
      "soporte": { "etiqueta": "既存のソフトウェアがある", "titulo": "コンサルティング・サポート", "texto": "診断し、改善し、安定して動かし続けます。" }
    }
  },
  "trabajos": {
    "titulo": "実際のビジネスのための、実際のプロジェクト。",
    "verTodos": "すべての実績を見る",
    "tipos": { "wordpress": "ウェブサイト", "custom-code": "カスタムシステム", "web-app": "ウェブアプリ" }
  },
  "proceso": {
    "titulo": "最初から最後まで、明確に。",
    "pasos": {
      "conversamos": { "titulo": "相談", "texto": "ビジネスと必要なことをお聞かせください。初回相談は無料です。" },
      "proponemos": { "titulo": "提案", "texto": "範囲、スケジュール、固定価格を書面でご提案します。段階的なお支払いも可能です。" },
      "construimos": { "titulo": "一緒につくる", "texto": "毎週、実際の進捗をご確認いただけます。" },
      "lanzamos": { "titulo": "公開とサポート", "texto": "公開後は使い方をご案内し、その後もサポートします。" }
    }
  },
  "quienes": {
    "titulo": "コード工場ではなく、人がつくります。",
    "texto": "DevMindsを率いるのは、コロンビアのソフトウェアエンジニア、{nombre}です。設計し、開発する本人と直接やり取りできます。",
    "tecnologias": "Next.js、React、Flutter、PostgreSQLなど、プロジェクトに必要な技術で開発します。",
    "enlace": "詳しく見る"
  },
  "preguntas": {
    "titulo": "よくある質問",
    "subtitulo": "始める前によくいただく質問です。",
    "items": {
      "costo": { "pregunta": "費用と支払い方法は?", "respuesta": "プロジェクトごとに異なります。無料の初回相談のあと、範囲・スケジュール・固定価格を記載した提案書をお送りします。進行に合わせた段階的なお支払いが可能です。" },
      "tiempo": { "pregunta": "期間はどのくらいですか?", "respuesta": "ウェブサイトは通常1〜2週間、カスタムシステムは範囲に応じて1〜3か月です。開始前にスケジュールを合意します。" },
      "propiedad": { "pregunta": "コードは自分のものになりますか?", "respuesta": "はい。完了時にソースコード、ドキュメント、すべてのアクセス権をお渡しします。" },
      "google": { "pregunta": "Googleで見つけてもらえますか?", "respuesta": "はい。高速で構造化された、検索に強いサイトとして構築します。店舗がある場合はGoogleビジネスプロフィールの設定もお手伝いします。" },
      "soporte": { "pregunta": "公開後はどうなりますか?", "respuesta": "使い方をご案内し、更新・修正・改善を含むサポートと保守のプランをご用意しています。" },
      "alcance": { "pregunta": "コロンビア国外のお客様にも対応していますか?", "respuesta": "はい。ビデオ通話を使い、世界中のお客様とリモートで仕事をしています。" }
    }
  },
  "cierre": {
    "titulo": "プロジェクトについて話しましょう",
    "texto": "必要なことをお聞かせください。24時間以内に返信します。",
    "whatsapp": "WhatsAppで相談する",
    "correo": "メールを送る",
    "asunto": "プロジェクトのご相談"
  },
  "barra": { "whatsapp": "WhatsApp", "llamar": "電話" }
}
```

- [ ] **Step 3: Navbar, Footer y Metadata**

`Navbar`: conservar `stack` (se borra en la Tarea 16) y fijar estos valores, agregando `menu` e `idioma`:
- es: `home "Inicio"`, `portfolio "Portafolio"`, `about "Nosotros"`, `services "Servicios"`, `projects "Trabajos"`, `process "Cómo trabajamos"`, `faq "Preguntas"`, `contact "Contacto"`, `startProject "Hablemos"`, `menu "Menú"`, `idioma "Idioma"`.
- en: `home "Home"`, `portfolio "Portfolio"`, `about "About"`, `services "Services"`, `projects "Work"`, `process "How we work"`, `faq "FAQ"`, `contact "Contact"`, `startProject "Let's talk"`, `menu "Menu"`, `idioma "Language"`.
- ja: `home "ホーム"`, `portfolio "ポートフォリオ"`, `about "私たちについて"`, `services "サービス"`, `projects "実績"`, `process "進め方"`, `faq "よくある質問"`, `contact "お問い合わせ"`, `startProject "相談する"`, `menu "メニュー"`, `idioma "言語"`.

`Footer.tagline`: es `"Estudio de software en Neiva, Huila."` · en `"Software studio based in Colombia."` · ja `"コロンビアのソフトウェアスタジオ。"`

`Metadata.home`:
- es: `title "Desarrollo de Software y Páginas Web en Neiva, Huila | DevMinds"`, `description "Páginas web, sistemas a medida y apps para negocios en Neiva, Huila y toda Colombia. Te explicamos todo sin tecnicismos. Primera consulta gratis."`, `keywords "desarrollo de software neiva, crear pagina web neiva, paginas web para negocios neiva, desarrollo web huila, software a medida neiva, programador neiva, aplicaciones moviles neiva, seo local neiva, google maps negocio neiva"`.
- en: `title "Custom Software Development from Colombia | DevMinds"`, `description "Websites, custom systems and mobile apps built by a software engineer in Colombia. English communication, US-friendly hours, and code you own."`, `keywords "custom software development colombia, nearshore software development, software engineer colombia, hire developer latin america, web development colombia, next.js developer colombia, remote software developer"`.
- ja: `title "コロンビア発のソフトウェア開発 | DevMinds"`, `description "ウェブサイト、カスタムシステム、モバイルアプリをコロンビアのソフトウェアエンジニアが開発します。英語対応、コードはお客様のものです。"`, `keywords "ソフトウェア開発 コロンビア, ニアショア開発, ウェブ制作, カスタムシステム開発, モバイルアプリ開発"`.

Si el Step 1 reportó claves preexistentes faltantes en `en`/`ja`, agregarlas ahora traducidas.

- [ ] **Step 4: Verificar**

Run: `pnpm test`
Expected: PASS (paridad y preguntas incluidas).
Run: `grep -n "—" messages/es.json messages/en.json messages/ja.json | grep -v "\"Home\"" | head` y revisar a mano que dentro de `Home`, `Navbar`, `Footer.tagline` y `Metadata.home` no haya em dash.

- [ ] **Step 5: Commit**

```bash
git add messages src/config/preguntas.ts src/lib/traducciones.test.ts
git commit -m "feat(i18n): textos de la home para clientes, localizados por mercado

Español le habla a negocios de Neiva y Colombia; inglés y japonés a clientes
globales (remoto, código propio). Un test asegura que los tres idiomas tengan
las mismas claves y que cada pregunta tenga su respuesta."
```

### Task 8: Navbar y selector de idioma

**Files:**
- Create: `src/app/components/layout/SelectorIdioma.tsx`
- Modify (reescritura): `src/app/components/layout/Navbar.tsx`

**Interfaces:**
- Consumes: `Wordmark`, `rutaEnIdioma`, `enlaceWhatsApp`, `Navbar.*`, `Home.whatsappMensaje`.
- Produces: `<SelectorIdioma className?: string tono?: 'claro' | 'oscuro' />` (lo usa el Footer de la Tarea 9).

- [ ] **Step 1: SelectorIdioma**

```tsx
'use client';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { locales } from '@/config/i18n-config';
import { rutaEnIdioma } from '@/lib/rutas';
import { cn } from '@/lib/utils';

type Props = { className?: string; tono?: 'claro' | 'oscuro' };

/** Enlaces ES · EN · JA a la misma página en otro idioma. */
export default function SelectorIdioma({ className, tono = 'claro' }: Props) {
  const t = useTranslations('Navbar');
  const pathname = usePathname();
  const { lang } = useParams<{ lang: string }>();
  return (
    <nav aria-label={t('idioma')} className={cn('flex items-center', className)}>
      {locales.map((l) => {
        const activo = l === lang;
        return (
          <Link
            key={l}
            href={rutaEnIdioma(pathname, l)}
            hrefLang={l}
            aria-current={activo ? 'true' : undefined}
            className={cn(
              'inline-flex min-h-11 min-w-11 items-center justify-center rounded-md text-xs font-semibold uppercase transition-colors',
              tono === 'claro'
                ? activo ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                : activo ? 'text-background' : 'text-background/60 hover:text-background'
            )}
          >
            {l}
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: Navbar**

Reemplazar todo `Navbar.tsx` por:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Wordmark from '@/app/components/marca/Wordmark';
import SelectorIdioma from '@/app/components/layout/SelectorIdioma';
import { enlaceWhatsApp } from '@/lib/enlaces';
import { cn } from '@/lib/utils';

type ItemNav = { label: string; href: string };

const Navbar = () => {
  const t = useTranslations('Navbar');
  const tHome = useTranslations('Home');
  const pathname = usePathname();
  const { lang } = useParams<{ lang: string }>();
  const [conFondo, setConFondo] = useState(false);
  const [oculta, setOculta] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const ultimoY = useRef(0);

  const esHome = pathname === `/${lang}`;
  const items: ItemNav[] = esHome
    ? [
        { label: t('services'), href: '#services' },
        { label: t('projects'), href: '#projects' },
        { label: t('process'), href: '#process' },
        { label: t('faq'), href: '#faq' },
      ]
    : [
        { label: t('home'), href: `/${lang}` },
        { label: t('services'), href: `/${lang}/services` },
        { label: t('portfolio'), href: `/${lang}/portfolio` },
        { label: t('about'), href: `/${lang}/about` },
        { label: t('contact'), href: `/${lang}/contact` },
      ];

  useEffect(() => {
    let pendiente = false;
    const alDesplazar = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setConFondo(y > 24);
        setOculta(y > ultimoY.current && y > 120);
        ultimoY.current = y;
        pendiente = false;
      });
    };
    window.addEventListener('scroll', alDesplazar, { passive: true });
    return () => window.removeEventListener('scroll', alDesplazar);
  }, []);

  const whatsapp = enlaceWhatsApp(tHome('whatsappMensaje'));

  return (
    <nav
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-[transform,background-color,border-color] duration-300 ease-out',
        oculta && !abierto ? '-translate-y-full' : 'translate-y-0',
        conFondo ? 'border-border bg-background/90 backdrop-blur-md' : 'border-transparent bg-transparent'
      )}
    >
      <div className="container-main">
        <div className="flex h-16 items-center justify-between gap-6 md:h-[72px] md:px-10">
          <Link href={`/${lang}`} aria-label="DevMinds" className="text-[22px] text-foreground transition-opacity hover:opacity-75">
            <Wordmark />
          </Link>

          <ul className="hidden items-center gap-7 lg:flex">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <SelectorIdioma />
            <Button asChild className="bg-foreground text-background hover:bg-foreground/85">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">{t('startProject')}</a>
            </Button>
          </div>

          <div className="lg:hidden">
            <Sheet open={abierto} onOpenChange={setAbierto}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="size-11" aria-label={t('menu')}>
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex w-[300px] flex-col p-0">
                <SheetTitle className="sr-only">{t('menu')}</SheetTitle>
                <div className="flex h-16 items-center border-b border-border px-5">
                  <Wordmark className="text-xl" />
                </div>
                <ul className="flex flex-col p-3">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setAbierto(false)}
                        className="flex min-h-11 items-center rounded-md px-3 text-base text-foreground transition-colors hover:bg-secondary"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto space-y-3 border-t border-border p-5">
                  <SelectorIdioma className="-ml-3" />
                  <Button asChild size="lg" className="w-full">
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer">{t('startProject')}</a>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

- [ ] **Step 3: Verificar**

Run: `pnpm exec tsc --noEmit && pnpm exec eslint src/app/components/layout/Navbar.tsx src/app/components/layout/SelectorIdioma.tsx && pnpm test`
Expected: sin errores.

- [ ] **Step 4: CV (sin pausa)**

`RUTAS = ['/es', '/en/portfolio']`. Además, con Playwright a 390px: abrir el menú (`getByRole('button', { name: 'Menú' })`), hacer clic en "EN" y verificar que la URL termina en `/en`. Desde `/es/portfolio`, clic en "JA" y verificar `/ja/portfolio`.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/layout/Navbar.tsx src/app/components/layout/SelectorIdioma.tsx
git commit -m "feat(nav): navbar con wordmark, enlaces en lenguaje llano y selector de idioma

El sitio no tenía forma visible de cambiar de idioma. Los enlaces dejan la
numeración 01-07 y el botón principal abre WhatsApp."
```

### Task 9: Footer y barra móvil

**Files:**
- Modify (reescritura): `src/app/components/layout/Footer/Footer.tsx`
- Create: `src/app/components/layout/BarraMovil.tsx`

**Interfaces:**
- Consumes: `Wordmark`, `SelectorIdioma` (`tono="oscuro"`), `enlaceWhatsApp`, `enlaceLlamada`, `enlaceCorreo`.
- Produces: `<Footer conBarraMovil?: boolean />` (deja espacio bajo la barra en móvil), `<BarraMovil />`.

- [ ] **Step 1: Footer**

```tsx
'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Github, Linkedin, Mail } from 'lucide-react';
import Wordmark from '@/app/components/marca/Wordmark';
import SelectorIdioma from '@/app/components/layout/SelectorIdioma';
import contactConfig from '@/config/contact.json';
import { enlaceCorreo } from '@/lib/enlaces';
import { cn } from '@/lib/utils';

const enlace = 'inline-flex min-h-11 items-center gap-2 text-sm text-background/70 transition-colors hover:text-background';

/** Pie de página en carbón con wordmark, navegación, redes e idioma. */
export default function Footer({ conBarraMovil = false }: { conBarraMovil?: boolean }) {
  const t = useTranslations('Footer');
  const { lang } = useParams<{ lang: string }>();
  const anio = new Date().getFullYear();

  const navegacion = [
    { label: t('nav.home'), href: `/${lang}` },
    { label: t('nav.services'), href: `/${lang}/services` },
    { label: t('nav.portfolio'), href: `/${lang}/portfolio` },
    { label: t('nav.about'), href: `/${lang}/about` },
    { label: t('nav.contact'), href: `/${lang}/contact` },
  ];

  return (
    <footer className={cn('mt-auto bg-foreground text-background', conBarraMovil && 'pb-[76px] md:pb-0')}>
      <div className="container-main py-14 md:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark className="text-3xl" />
            <p className="mt-3 max-w-xs text-sm text-background/70">{t('tagline')}</p>
            <SelectorIdioma tono="oscuro" className="-ml-3 mt-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">{t('navigation')}</h2>
            <ul className="mt-2">
              {navegacion.map((item) => (
                <li key={item.href}><Link href={item.href} className={enlace}>{item.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold">{t('social')}</h2>
            <ul className="mt-2">
              <li><a href={contactConfig.socials.github} target="_blank" rel="noopener noreferrer" className={enlace}><Github className="size-4" />GitHub</a></li>
              <li><a href={contactConfig.socials.linkedin} target="_blank" rel="noopener noreferrer" className={enlace}><Linkedin className="size-4" />LinkedIn</a></li>
              <li><a href={enlaceCorreo()} className={enlace}><Mail className="size-4" />{contactConfig.email}</a></li>
            </ul>
          </div>
        </div>
        <p className="mt-12 border-t border-background/15 pt-6 text-sm text-background/60">{t('copyright', { year: anio })}</p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: BarraMovil**

```tsx
'use client';

import { MessageCircle, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { enlaceLlamada, enlaceWhatsApp } from '@/lib/enlaces';

/** Barra fija inferior en móvil con la acción principal (WhatsApp) y Llamar. */
export default function BarraMovil() {
  const t = useTranslations('Home');
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 pb-[max(0.625rem,env(safe-area-inset-bottom))] pt-2.5 backdrop-blur-md md:hidden">
      <div className="flex gap-2">
        <Button asChild size="lg" className="h-12 flex-[1.6]">
          <a href={enlaceWhatsApp(t('whatsappMensaje'))} target="_blank" rel="noopener noreferrer">
            <MessageCircle />{t('barra.whatsapp')}
          </a>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-12 flex-1">
          <a href={enlaceLlamada()}><Phone />{t('barra.llamar')}</a>
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verificar**

Run: `pnpm exec tsc --noEmit && pnpm exec eslint src/app/components/layout/Footer/Footer.tsx src/app/components/layout/BarraMovil.tsx && pnpm test`
Expected: sin errores. (`BarraMovil` se monta en la Tarea 10.)

- [ ] **Step 4: Commit**

```bash
git add src/app/components/layout/Footer/Footer.tsx src/app/components/layout/BarraMovil.tsx
git commit -m "feat(layout): footer en carbón con Doto real y barra móvil de contacto

La clase font-doto del footer no existía; ahora el wordmark sale en Doto. La
barra móvil deja WhatsApp y Llamar siempre a un toque en el celular."
```

---

## Fase 2 · Secciones

### Task 10: Hero, estructura de la home y datos del servidor

**Files:**
- Modify (reescritura): `src/app/components/sections/Hero.tsx`
- Modify (reescritura): `src/app/[lang]/HomeClient.tsx`
- Modify: `src/app/[lang]/page.tsx`
- Modify: `src/lib/schemas/faq-schema.ts` (quitar `faqsES` y `faqsEN`)

**Interfaces:**
- Consumes: `Reticula`, `DivisorSeccion`, `CampoPuntos`, `Wordmark`, `Rieles`, `BarraMovil`, `Footer conBarraMovil`, `elegirFundador`, `PREGUNTAS`, `generateFAQSchema`.
- Produces: `HomeClient` con props `{ featuredProjects: ProjectWithTranslation[]; fundador: TeamMemberWithTranslation | null }`. Las secciones nuevas se enchufan aquí (Tareas 11 a 15). Hasta entonces, las viejas `CallToAction`, `AboutUs`, `Services`, `TechStack`, `ContactCTA` siguen montadas para que la página no quede vacía.

- [ ] **Step 1: Hero**

```tsx
'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Wordmark from '@/app/components/marca/Wordmark';
import CampoPuntos from '@/app/components/reticula/CampoPuntos';
import { enlaceWhatsApp } from '@/lib/enlaces';

const paso = (i: number) => ({ '--i': i }) as CSSProperties;

/** Paraguas de la home: qué hace DevMinds, para quién y cómo contactarlo. */
export default function Hero() {
  const t = useTranslations('Home');
  return (
    <section className="relative overflow-hidden">
      <CampoPuntos />
      <div className="container-main relative">
        <div className="px-4 pb-16 pt-28 md:px-10 md:pb-24 md:pt-40">
          <p className="entrada inline-flex rounded-full bg-accent-tint px-3 py-1 text-[13px] font-semibold text-primary-hover" style={paso(0)}>
            {t('hero.chip')}
          </p>
          <h1
            className="entrada mt-6 max-w-[19ch] font-display text-[2.125rem] font-bold leading-[1.06] tracking-[-0.025em] text-foreground sm:text-5xl lg:text-[4.25rem]"
            style={paso(1)}
          >
            <Wordmark className="block text-[1.55em] leading-[0.95] sm:inline sm:text-[1.14em] sm:leading-none" />{' '}
            {t.rich('hero.titulo', { acento: (c) => <span className="text-primary">{c}</span> })}
          </h1>
          <p className="entrada mt-6 max-w-[52ch] text-[17px] leading-relaxed text-muted-foreground md:text-lg" style={paso(2)}>
            {t('hero.texto')}
          </p>
          <div className="entrada mt-9 flex flex-col gap-3 sm:flex-row" style={paso(3)}>
            <Button asChild size="lg">
              <a href={enlaceWhatsApp(t('whatsappMensaje'))} target="_blank" rel="noopener noreferrer">
                <MessageCircle />{t('hero.whatsapp')}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#projects">{t('hero.verTrabajos')}<ArrowRight /></Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: HomeClient**

```tsx
'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer/Footer';
import BarraMovil from '@/app/components/layout/BarraMovil';
import Hero from '@/app/components/sections/Hero';
import Reticula from '@/app/components/reticula/Reticula';
import DivisorSeccion from '@/app/components/reticula/DivisorSeccion';
import Rieles from '@/app/components/reticula/Rieles';
import type { ProjectWithTranslation } from '@/db/queries/projects';
import type { TeamMemberWithTranslation } from '@/db/queries/team';

// Secciones bajo el fold: su JS (y sus ScrollTrigger) se cargan después del hero.
// Temporal: las secciones viejas siguen hasta que su reemplazo exista (Tareas 11-15).
const CallToAction = dynamic(() => import('@/app/components/sections/CallToAction'));
const Services = dynamic(() => import('@/app/components/sections/Services/Services'));
const Projects = dynamic(() => import('@/app/components/sections/Projects/Projects'));
const Process = dynamic(() => import('@/app/components/sections/Process/Process'));
const AboutUs = dynamic(() => import('@/app/components/sections/AboutUs/AboutUs'));
const FAQ = dynamic(() => import('@/app/components/sections/FAQ/FAQ'));
const ContactCTA = dynamic(() => import('@/app/components/sections/ContactCTA/ContactCTA'));

type Props = {
  featuredProjects: ProjectWithTranslation[];
  fundador: TeamMemberWithTranslation | null;
};

export default function HomeClient({ featuredProjects, fundador }: Props) {
  void fundador; // se usa en la Tarea 14
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />
      <Rieles />
      <main className="relative flex-1">
        <Reticula />
        <Hero />
        <DivisorSeccion />
        <CallToAction />
        <Services />
        <DivisorSeccion />
        <Projects projects={featuredProjects} />
        <DivisorSeccion />
        <Process />
        <DivisorSeccion />
        <AboutUs />
        <DivisorSeccion />
        <FAQ />
        <DivisorSeccion />
        <ContactCTA />
      </main>
      <Footer conBarraMovil />
      <BarraMovil />
    </div>
  );
}
```

(`TechStack` y `ScrollIndicator` dejan de montarse desde aquí; sus archivos se borran en la Tarea 16.)

- [ ] **Step 3: page.tsx con fundador y FAQ JSON-LD**

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getFeaturedProjects } from '@/db/queries/projects';
import { getTeamMembers } from '@/db/queries/team';
import { PREGUNTAS } from '@/config/preguntas';
import { elegirFundador } from '@/lib/equipo';
import { generateFAQSchema } from '@/lib/schemas/faq-schema';
import HomeClient from './HomeClient';

type Props = {
  params: Promise<{ lang: string }>;
};

export const revalidate = 3600;

export default async function Home({ params }: Props) {
  const { lang } = await params;
  setRequestLocale(lang);

  const [featuredProjects, miembros, t] = await Promise.all([
    getFeaturedProjects(lang),
    getTeamMembers(lang),
    getTranslations({ locale: lang, namespace: 'Home.preguntas' }),
  ]);

  const faqSchema = generateFAQSchema(
    PREGUNTAS.map((id) => ({ question: t(`items.${id}.pregunta`), answer: t(`items.${id}.respuesta`) }))
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      <HomeClient featuredProjects={featuredProjects} fundador={elegirFundador(miembros)} />
    </>
  );
}
```

En `src/lib/schemas/faq-schema.ts` borrar `faqsES` y `faqsEN` con sus comentarios (publicaban precios que ya no se publican). Run: `grep -rn "faqsES\|faqsEN" src` → sin resultados.

- [ ] **Step 4: Verificar**

Run: `pnpm exec tsc --noEmit && pnpm exec eslint src/app/components/sections/Hero.tsx "src/app/[lang]/HomeClient.tsx" "src/app/[lang]/page.tsx" src/lib/schemas/faq-schema.ts && pnpm test`
Expected: sin errores.
Run: `curl -s http://localhost:3000/es | grep -o '"@type":"FAQPage"'`
Expected: `"@type":"FAQPage"`.

- [ ] **Step 5: CV (con pausa)**

`RUTAS = ['/es', '/en', '/ja']`, `SECCIONES = []`. Verificar en las capturas: a 390px "DevMinds" en su propia línea, grande; en `ja` el H1 se lee "DevMinds は、…"; campo de puntos visible pero sin competir con el texto; guías y cruces alineadas; barra móvil abajo sin tapar el footer. Mostrar al usuario el hero nuevo en `http://localhost:3000/es` y esperar comentarios.

- [ ] **Step 6: Commit**

```bash
git add src/app/components/sections/Hero.tsx "src/app/[lang]/HomeClient.tsx" "src/app/[lang]/page.tsx" src/lib/schemas/faq-schema.ts
git commit -m "feat(home): hero paraguas con Doto en el titular, retícula y FAQ en JSON-LD

El hero deja de vender tecnología y dice qué hace DevMinds y cómo contactarlo.
El FAQPage existía pero nunca se emitía; ahora sale de las mismas preguntas
visibles."
```

### Task 11: Escalera

**Files:**
- Create: `src/app/components/sections/Escalera/Escalera.tsx`
- Modify: `src/app/[lang]/HomeClient.tsx` (reemplazar `CallToAction` + `Services` por `Escalera`)

**Interfaces:**
- Consumes: `Home.escalera.*`; anclas de `/services`: `webdev`, `custom`, `consulting`.
- Produces: sección con `id="services"` (ancla de la navbar).

- [ ] **Step 1: Componente**

```tsx
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger);

const PASOS = [
  { clave: 'web', ancla: 'webdev', alto: 'md:h-[260px]', margen: 'mr-9', fondo: 'bg-primary text-primary-foreground', tenue: 'text-primary-foreground/80' },
  { clave: 'sistemas', ancla: 'custom', alto: 'md:h-[300px]', margen: 'mr-6', fondo: 'bg-secondary text-foreground', tenue: 'text-muted-foreground' },
  { clave: 'apps', ancla: 'custom', alto: 'md:h-[340px]', margen: 'mr-3', fondo: 'bg-surface-3 text-foreground', tenue: 'text-muted-foreground' },
  { clave: 'soporte', ancla: 'consulting', alto: 'md:h-[380px]', margen: 'mr-0', fondo: 'bg-foreground text-background', tenue: 'text-background/70' },
] as const;

/** La oferta como camino que crece con el negocio. Es el elemento firma de la home. */
export default function Escalera() {
  const t = useTranslations('Home.escalera');
  const { lang } = useParams<{ lang: string }>();
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        gsap.from('[data-escalon]', {
          clipPath: 'inset(100% 0% 0% 0%)',
          duration: 0.9,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: ref.current, start: 'top 75%', once: true },
        });
      },
      ref
    );
    return () => mm.revert();
  }, []);

  return (
    <section id="services" ref={ref} className="relative pt-16 md:pt-24">
      <div className="container-main">
        <div className="px-4 md:px-10">
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em] md:text-[2.5rem]">{t('titulo')}</h2>
          <p className="mt-3 text-[17px] text-muted-foreground">{t('subtitulo')}</p>
        </div>
        <ol className="mt-10 flex flex-col gap-2 pb-14 md:mt-14 md:grid md:grid-cols-4 md:items-end md:gap-0 md:pb-0">
          {PASOS.map((p) => (
            <li key={p.clave} data-escalon className={cn(p.margen, 'md:mr-0')}>
              <Link
                href={`/${lang}/services#${p.ancla}`}
                className={cn('group flex h-full flex-col rounded-xl p-5 md:rounded-none md:p-6', p.fondo, p.alto)}
              >
                <span className={cn('flex items-start justify-between gap-3 text-[13px] font-medium', p.tenue)}>
                  {t(`pasos.${p.clave}.etiqueta`)}
                  <ArrowUpRight className="size-4 shrink-0 transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
                <span className="mt-1 font-display text-xl font-bold tracking-[-0.015em] md:text-[1.375rem]">{t(`pasos.${p.clave}.titulo`)}</span>
                <span className={cn('mt-2 text-[15px] leading-snug', p.tenue)}>{t(`pasos.${p.clave}.texto`)}</span>
                {t.has(`pasos.${p.clave}.tiempo`) && (
                  <span className="mt-auto pt-4 font-doto text-xl font-black tracking-[-0.03em]">{t(`pasos.${p.clave}.tiempo`)}</span>
                )}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Enchufar**

En `HomeClient.tsx`: borrar los `dynamic` de `CallToAction` y `Services`; agregar `const Escalera = dynamic(() => import('@/app/components/sections/Escalera/Escalera'));`; reemplazar `<CallToAction />` y `<Services />` por `<Escalera />`.

- [ ] **Step 3: Verificar**

Run: `pnpm exec tsc --noEmit && pnpm exec eslint src/app/components/sections/Escalera "src/app/[lang]/HomeClient.tsx" && pnpm test`
Expected: sin errores.

- [ ] **Step 4: CV (con pausa)**

`RUTAS = ['/es', '/en']`, `SECCIONES = ['#services']`. Verificar: en desktop, los escalones crecen de izquierda a derecha y se apoyan en el divisor (sin espacio debajo); en 390px, filas escalonadas a la derecha, todas ≥ 44px de alto; tiempos en Doto; en `en`, "Websites & landing pages" no se corta. Clic en el escalón 1 lleva a `/es/services#webdev`. Mostrar al usuario y esperar comentarios.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/sections/Escalera "src/app/[lang]/HomeClient.tsx"
git commit -m "feat(home): escalera de servicios como elemento firma

Reemplaza la grilla de cuatro tarjetas iguales y el CTA duplicado: la oferta se
lee como un camino (web, sistemas, apps, soporte) donde la web es la puerta de
entrada."
```

### Task 12: Trabajos

**Files:**
- Modify (reescritura): `src/app/components/sections/Projects/Projects.tsx`

**Interfaces:**
- Consumes: `ProjectWithTranslation` (`id`, `category`, `client`, `year`, `images`, `title`, `description`), `Home.trabajos.*`, `lineaMeta`.
- Produces: sección con `id="projects"`; default export con props `{ projects?: ProjectWithTranslation[] }` (la firma no cambia, así `HomeClient` no se toca).

- [ ] **Step 1: Componente**

```tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { lineaMeta } from '@/lib/proyectos';
import type { ProjectWithTranslation } from '@/db/queries/projects';

type Props = { projects?: ProjectWithTranslation[] };

/** Proyectos destacados contados como resultado, no como lista de tecnologías. */
export default function Projects({ projects = [] }: Props) {
  const t = useTranslations('Home.trabajos');
  const { lang } = useParams<{ lang: string }>();

  return (
    <section id="projects" className="py-16 md:py-24">
      <div className="container-main">
        <div className="px-4 md:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <h2 className="max-w-[20ch] font-display text-3xl font-bold tracking-[-0.02em] md:text-[2.5rem]">{t('titulo')}</h2>
            <Link href={`/${lang}/portfolio`} className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-primary transition-colors hover:text-primary-hover">
              {t('verTodos')}<ArrowRight className="size-4" />
            </Link>
          </div>
          {projects.length > 0 && (
            <ul className="mt-10 grid gap-10 md:mt-12 md:grid-cols-3 md:gap-6">
              {projects.map((p) => {
                const tipo = t.has(`tipos.${p.category}`) ? t(`tipos.${p.category}`) : null;
                return (
                  <li key={p.id}>
                    <Link href={`/${lang}/portfolio`} className="group block">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-secondary">
                        {p.images?.[0] && (
                          <Image
                            src={p.images[0]}
                            alt={p.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                          />
                        )}
                      </div>
                      <p className="mt-4 text-[13px] font-medium text-muted-foreground">{lineaMeta([tipo, p.client, p.year])}</p>
                      <h3 className="mt-1 font-display text-xl font-bold tracking-[-0.015em] text-foreground">{p.title}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{p.description}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar**

Run: `pnpm exec tsc --noEmit && pnpm exec eslint src/app/components/sections/Projects/Projects.tsx && pnpm test`
Expected: sin errores.

- [ ] **Step 3: CV (sin pausa)**

`RUTAS = ['/es', '/ja']`, `SECCIONES = ['#projects']`. Verificar: la línea "Aplicación web · 2026" (sin cliente) no muestra separadores sobrantes; títulos nuevos (RMConta…); imágenes sin deformar.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/sections/Projects/Projects.tsx
git commit -m "feat(home): trabajos con tipo, cliente y resultado en vez de muro de badges"
```

### Task 13: Cómo trabajamos

**Files:**
- Modify (reescritura): `src/app/components/sections/Process/Process.tsx`

**Interfaces:**
- Consumes: `Home.proceso.*`.
- Produces: sección con `id="process"`; default export sin props.

- [ ] **Step 1: Componente**

```tsx
'use client';

import { useTranslations } from 'next-intl';

const PASOS = ['conversamos', 'proponemos', 'construimos', 'lanzamos'] as const;

/** Cuatro pasos en lenguaje llano; aquí sí hay numeración porque es una secuencia real. */
export default function Process() {
  const t = useTranslations('Home.proceso');
  return (
    <section id="process" className="bg-secondary py-16 md:py-24">
      <div className="container-main">
        <div className="px-4 md:px-10">
          <h2 className="max-w-[22ch] font-display text-3xl font-bold tracking-[-0.02em] md:text-[2.5rem]">{t('titulo')}</h2>
          <ol className="mt-10 grid gap-10 md:mt-14 md:grid-cols-4 md:gap-8">
            {PASOS.map((clave, i) => (
              <li key={clave} className="border-t border-guide pt-5">
                <span aria-hidden className="font-doto text-4xl font-black leading-none tracking-[-0.03em] text-primary">{i + 1}</span>
                <h3 className="mt-4 font-display text-xl font-bold tracking-[-0.015em]">{t(`pasos.${clave}.titulo`)}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{t(`pasos.${clave}.texto`)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar y CV (sin pausa)**

Run: `pnpm exec tsc --noEmit && pnpm exec eslint src/app/components/sections/Process/Process.tsx && pnpm test` → sin errores.
CV: `RUTAS = ['/es']`, `SECCIONES = ['#process']`. Las guías verticales siguen visibles sobre el fondo gris.

- [ ] **Step 3: Commit**

```bash
git add src/app/components/sections/Process/Process.tsx
git commit -m "feat(home): proceso en cuatro pasos sin jerga ni animación de 5 segundos"
```

### Task 14: Quiénes somos

**Files:**
- Create: `src/app/components/sections/QuienesSomos/QuienesSomos.tsx`
- Modify: `src/app/[lang]/HomeClient.tsx` (reemplazar `AboutUs`; quitar `void fundador`)

**Interfaces:**
- Consumes: `TeamMemberWithTranslation | null` (`name`, `photo`, `role`, `location`), `Home.quienes.*`.
- Produces: sección con `id="about"`; props `{ fundador: TeamMemberWithTranslation | null }`.

- [ ] **Step 1: Componente**

```tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import type { TeamMemberWithTranslation } from '@/db/queries/team';

type Props = { fundador: TeamMemberWithTranslation | null };

/** Presenta al fundador: una persona real, sin afirmar tamaño de equipo. */
export default function QuienesSomos({ fundador }: Props) {
  const t = useTranslations('Home.quienes');
  const { lang } = useParams<{ lang: string }>();
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container-main">
        <div className="grid gap-10 px-4 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:gap-16 md:px-10">
          {fundador?.photo && (
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[320px] overflow-hidden rounded-xl border border-border bg-secondary md:mx-0">
              <Image src={fundador.photo} alt={fundador.name} fill sizes="(max-width: 768px) 320px, 40vw" className="object-cover" />
            </div>
          )}
          <div className={fundador?.photo ? undefined : 'md:col-span-2'}>
            <h2 className="max-w-[20ch] font-display text-3xl font-bold tracking-[-0.02em] md:text-[2.5rem]">{t('titulo')}</h2>
            {fundador && (
              <>
                <p className="mt-5 max-w-[60ch] text-[17px] leading-relaxed text-foreground/85 md:text-lg">{t('texto', { nombre: fundador.name })}</p>
                <p className="mt-3 text-sm text-muted-foreground">{fundador.role} · {fundador.location}</p>
              </>
            )}
            <p className="mt-6 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground">{t('tecnologias')}</p>
            <Link href={`/${lang}/about`} className="mt-6 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-primary transition-colors hover:text-primary-hover">
              {t('enlace')}<ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Enchufar**

En `HomeClient.tsx`: borrar el `dynamic` de `AboutUs` y la línea `void fundador;`; agregar `const QuienesSomos = dynamic(() => import('@/app/components/sections/QuienesSomos/QuienesSomos'));`; reemplazar `<AboutUs />` por `<QuienesSomos fundador={fundador} />`.

- [ ] **Step 3: Verificar y CV (sin pausa)**

Run: `pnpm exec tsc --noEmit && pnpm exec eslint src/app/components/sections/QuienesSomos "src/app/[lang]/HomeClient.tsx" && pnpm test` → sin errores.
CV: `RUTAS = ['/es', '/en']`, `SECCIONES = ['#about']`. Foto nítida, nombre de la DB, texto en primera persona del estudio.

- [ ] **Step 4: Commit**

```bash
git add src/app/components/sections/QuienesSomos "src/app/[lang]/HomeClient.tsx"
git commit -m "feat(home): quiénes somos con el fundador real en vez de la cita duplicada

La sección anterior repetía su propio párrafo como cita y listaba las
tecnologías dos veces. Ahora muestra a la persona detrás de DevMinds."
```

### Task 15: Preguntas y cierre

**Files:**
- Modify (reescritura): `src/app/components/sections/FAQ/FAQ.tsx`
- Create: `src/app/components/sections/Cierre/Cierre.tsx`
- Modify: `src/app/[lang]/HomeClient.tsx` (reemplazar `ContactCTA` por `Cierre`)

**Interfaces:**
- Consumes: `PREGUNTAS`, `Home.preguntas.*`, `Home.cierre.*`, `enlaceWhatsApp`, `enlaceCorreo`.
- Produces: secciones con `id="faq"` (ancla que usa el footer viejo y la navbar) e `id="contact"`.

- [ ] **Step 1: FAQ**

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PREGUNTAS } from '@/config/preguntas';

/** Seis preguntas que deciden la compra, en una sola columna. */
export default function FAQ() {
  const t = useTranslations('Home.preguntas');
  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="container-main">
        <div className="grid gap-8 px-4 md:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] md:gap-16 md:px-10">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-[-0.02em] md:text-[2.5rem]">{t('titulo')}</h2>
            <p className="mt-3 text-[17px] text-muted-foreground">{t('subtitulo')}</p>
          </div>
          <Accordion type="single" collapsible className="border-t border-border">
            {PREGUNTAS.map((id) => (
              <AccordionItem key={id} value={id} className="border-b border-border">
                <AccordionTrigger className="min-h-11 py-5 text-left text-[17px] font-semibold hover:no-underline">
                  {t(`items.${id}.pregunta`)}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">
                  {t(`items.${id}.respuesta`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Cierre**

```tsx
'use client';

import { useTranslations } from 'next-intl';
import { Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { enlaceCorreo, enlaceWhatsApp } from '@/lib/enlaces';

/** Único llamado final a la acción de la home. */
export default function Cierre() {
  const t = useTranslations('Home');
  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container-main">
        <div className="px-4 md:px-10">
          <h2 className="max-w-[16ch] font-display text-4xl font-bold leading-[1.05] tracking-[-0.025em] md:text-6xl">{t('cierre.titulo')}</h2>
          <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed text-muted-foreground md:text-lg">{t('cierre.texto')}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <a href={enlaceWhatsApp(t('whatsappMensaje'))} target="_blank" rel="noopener noreferrer"><MessageCircle />{t('cierre.whatsapp')}</a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={enlaceCorreo(t('cierre.asunto'))}><Mail />{t('cierre.correo')}</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Enchufar**

En `HomeClient.tsx`: borrar el `dynamic` de `ContactCTA` y el comentario "Temporal…"; agregar `const Cierre = dynamic(() => import('@/app/components/sections/Cierre/Cierre'));`; reemplazar `<ContactCTA />` por `<Cierre />`. El orden final de `main` queda: `Reticula`, `Hero`, `DivisorSeccion`, `Escalera`, `DivisorSeccion`, `Projects`, `DivisorSeccion`, `Process`, `DivisorSeccion`, `QuienesSomos`, `DivisorSeccion`, `FAQ`, `DivisorSeccion`, `Cierre`.

- [ ] **Step 4: Verificar y CV (con pausa)**

Run: `pnpm exec tsc --noEmit && pnpm exec eslint src/app/components/sections/FAQ src/app/components/sections/Cierre "src/app/[lang]/HomeClient.tsx" && pnpm test` → sin errores.
CV: `RUTAS = ['/es', '/en', '/ja']`, `SECCIONES = ['#faq', '#contact']`. Abrir una pregunta con Playwright y capturar. Es la primera vez que la home está completa: mostrar al usuario el recorrido entero y esperar comentarios.

- [ ] **Step 5: Commit**

```bash
git add src/app/components/sections/FAQ src/app/components/sections/Cierre "src/app/[lang]/HomeClient.tsx"
git commit -m "feat(home): seis preguntas que deciden la compra y un solo cierre

Se pasa de diez preguntas en cuatro categorías a seis en una columna, y los
dos CTA casi iguales se fusionan en uno al final."
```

### Task 16: Limpieza

**Files:**
- Delete: `src/app/components/sections/CallToAction.tsx`, `src/app/components/sections/AboutUs/`, `src/app/components/sections/Services/`, `src/app/components/sections/TechStack/`, `src/app/components/sections/ContactCTA/`, `src/app/components/ui/ScrollIndicator/`, `src/app/hooks/useScrollReveal.tsx`, `src/config/faq.json`, `src/types/faq.ts`
- Modify: `messages/*.json` (borrar namespaces `Hero`, `CTA`, `AboutUs`, `Services`, `TechStack`, `Projects`, `Process`, `FAQ`, `ContactCTA`; `Navbar.stack`; `Footer.resourcesTitle`, `Footer.resources`)
- Modify: `src/styles/globals.css` (borrar `.hero-title`, `.hero-title--done`, `.cursor-blink`, `@keyframes blink`, `.hero-particle`, `@keyframes float-particle`, `scroll-bounce`, `scroll-text-pulse` y sus clases)

**Interfaces:**
- Consumes: nada nuevo. No debe quedar ninguna referencia a lo borrado.

- [ ] **Step 1: Confirmar que nadie más los usa**

Run: `grep -rln "sections/CallToAction\|sections/AboutUs\|sections/Services/\|sections/TechStack\|sections/ContactCTA\|ScrollIndicator\|useScrollReveal\|config/faq.json\|types/faq" src`
Expected: sin resultados (si aparece algo fuera de los archivos a borrar, no borrarlo y reportarlo).
Run: `grep -rn "useTranslations(['\"]\(Hero\|CTA\|AboutUs\|Services\|TechStack\|Projects\|Process\|FAQ\|ContactCTA\)['\"])" src`
Expected: sin resultados.
Run: `grep -rn "hero-title\|cursor-blink\|hero-particle\|animate-scroll-bounce\|animate-scroll-text-pulse" src --include=*.tsx`
Expected: sin resultados.

- [ ] **Step 2: Borrar**

```bash
git rm -r src/app/components/sections/CallToAction.tsx src/app/components/sections/AboutUs src/app/components/sections/Services src/app/components/sections/TechStack src/app/components/sections/ContactCTA src/app/components/ui/ScrollIndicator src/app/hooks/useScrollReveal.tsx src/config/faq.json src/types/faq.ts
```

Borrar los namespaces y claves de los tres `messages/*.json` con un script (mismo cambio en los tres para conservar la paridad):

```bash
node -e "
const fs=require('fs');
for (const l of ['es','en','ja']) {
  const f='messages/'+l+'.json'; const m=JSON.parse(fs.readFileSync(f,'utf8'));
  for (const k of ['Hero','CTA','AboutUs','Services','TechStack','Projects','Process','FAQ','ContactCTA']) delete m[k];
  delete m.Navbar.stack; delete m.Footer.resourcesTitle; delete m.Footer.resources;
  fs.writeFileSync(f, JSON.stringify(m,null,2)+'\n');
}"
```

Borrar en `globals.css` las reglas listadas en **Files**.

- [ ] **Step 3: Verificar todo**

Run: `pnpm exec tsc --noEmit && pnpm test && pnpm exec eslint src`
Expected: tsc y tests sin errores; eslint con ≤ 20 problemas (ninguno en archivos nuevos o reescritos).
Run: `pnpm build`
Expected: build exitoso, con las rutas `/[lang]` generadas para `es`, `en` y `ja`.

- [ ] **Step 4: Commit**

```bash
git add -A src messages
git commit -m "chore: borrar las secciones, textos y estilos de la home anterior

Ya no se montan en ninguna página; dejarlos solo confundía al buscar dónde
vive cada texto."
```

---

## Fase 3 · Verificación y cierre

### Task 17: Verificación final, preview y cierre del ciclo

**Files:**
- Create: `PRODUCT.md`, `DESIGN.md` (contexto para impeccable, derivado del spec)
- Create (no versionado): `<scratchpad>/contraste.mjs`

- [ ] **Step 1: Contraste**

`<scratchpad>/contraste.mjs`:

```js
const hex = (h) => h.match(/\w\w/g).map((x) => parseInt(x, 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
const lum = (h) => { const [r, g, b] = hex(h.replace('#', '')); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const pares = [
  ['texto sobre fondo', '#191d24', '#f8fafd', 4.5],
  ['secundario sobre fondo', '#555b64', '#f8fafd', 4.5],
  ['secundario sobre gris (proceso)', '#555b64', '#eef3f7', 4.5],
  ['secundario sobre escalón 3', '#555b64', '#e4eaef', 4.5],
  ['blanco sobre terracota (botón)', '#fafcfe', '#b6522d', 4.5],
  ['terracota como texto/enlace', '#b6522d', '#f8fafd', 4.5],
  ['chip: terracota oscuro sobre durazno', '#9e4421', '#fbe9e0', 4.5],
  ['cifras terracota sobre gris (texto grande)', '#b6522d', '#eef3f7', 3],
];
let ok = true;
for (const [n, a, b, min] of pares) { const r = ratio(a, b); if (r < min) ok = false; console.log(`${r >= min ? 'OK ' : 'MAL'} ${r.toFixed(2)}:1 (mín ${min}) ${n}`); }
process.exit(ok ? 0 : 1);
```

Run: `node "<scratchpad>/contraste.mjs"`
Expected: todas las líneas `OK`, exit 0. Si alguna sale `MAL`, ajustar el token en `globals.css`, volver a correr, y anotar el cambio para el spec.

- [ ] **Step 2: CV completo (con pausa)**

`RUTAS = ['/es', '/en', '/ja', '/es/about', '/es/services', '/es/portfolio', '/es/contact']`, `SECCIONES = ['#services', '#projects', '#process', '#about', '#faq', '#contact']`. Además:
- Emular `prefers-reduced-motion: reduce` (`page.emulateMedia({ reducedMotion: 'reduce' })`) en `/es`: el hero aparece sin desplazarse y la escalera completa.
- `/admin/login` sigue en oscuro.
- Todos los `desborde=0px`.

- [ ] **Step 3: Preview**

Ejecutar **PV**. Pasarle al usuario la URL para el celular.

- [ ] **Step 4: Crítica final**

Invocar la skill `impeccable` con `critique` sobre `src/app/[lang]/HomeClient.tsx` (live en `http://localhost:3000/es`). Comparar el puntaje con el 26/40 del 2026-10-19. Mostrar el resultado al usuario y aplicar con `impeccable polish` solo los hallazgos que apruebe, con un commit por grupo de arreglos.

- [ ] **Step 5: Contexto para impeccable**

`PRODUCT.md` (raíz):

```markdown
# DevMinds

register: brand

## Producto
Estudio de software de una persona (Sebastián Morea Cañón, Neiva, Huila, Colombia). Vende páginas web con SEO local, sistemas a medida, apps móviles y soporte.

## Usuarios
- ES: dueños de negocios de Neiva, el Huila y Colombia, no técnicos, que llegan desde Google en el celular.
- EN/JA: empresas y founders de afuera que buscan desarrollo remoto/nearshore desde Colombia.

## Tono
Cercano, de tú a tú, sin jerga ni tecnicismos; beneficios antes que tecnología. Voz de "estudio", sin afirmar tamaño de equipo ni "agencia"/"empresa". Sin em dash.

## Anti-referencias
Portafolio de desarrollador "hacker": terminal, partículas, numeración 01-07, stack como argumento de venta, monospace como disfraz.

## Principios
Un elemento firma (la escalera) y lo demás sobrio. Móvil primero. La acción principal es WhatsApp.
```

`DESIGN.md` (raíz):

```markdown
# DevMinds — sistema visual

Fuente de verdad: `docs/superpowers/specs/2026-10-19-rediseno-landing-design.md` y los tokens de `src/styles/globals.css`.

- Modo claro único. Fondo blanco nieve fría `#f8fafd`, texto grafito `#191d24`, secundario `#555b64`, bordes `#dde2e5`, guías `#d3d9de`.
- Acento terracota `#b6522d` (hover `#9e4421`, tinte `#fbe9e0`), ≤ 10% de la superficie.
- Tipos: Doto 900 (wordmark, H1 "DevMinds", cifras), Outfit 700 (títulos), Geist (cuerpo 17px móvil).
- Retícula de estudio: guías verticales en los bordes del contenido, divisores con cruces "+", campo de puntos solo en el hero, rieles en los márgenes ≥ 1360px.
- Elemento firma: escalera de 4 escalones (web, sistemas, apps, soporte).
- Movimiento: solo la entrada del hero (CSS) y de la escalera (GSAP); respeta reduced motion.
- Táctil ≥ 44px; contraste ≥ 4.5:1.
```

- [ ] **Step 6: Commit**

```bash
git add PRODUCT.md DESIGN.md
git commit -m "docs: contexto de producto y diseño para las skills de diseño"
git push
```

- [ ] **Step 7: Merge (con pausa)**

Con el visto bueno del usuario sobre la preview, ofrecer las opciones de integración con la skill `superpowers:finishing-a-development-branch` (merge a `main` o PR). No mergear sin su aprobación.

- [ ] **Step 8: Cierre en develop_kit**

Correr `PROMPT_INGESTA.md` de `SemocaDev/develop_kit` (vía `gh api`) para exportar el spec, el plan y la decisión "retícula de estudio" a `usuarios/sebastian/proyectos/devminds/raw/`, y agregar a `patrones/lecciones-aprendidas.md` → `## devminds`: "la DB local y la de producción eran la misma; todo cambio de datos necesitó respaldo y confirmación".
