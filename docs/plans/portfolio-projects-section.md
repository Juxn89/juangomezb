# Portfolio · Sección de proyectos: contenido curado y case studies

> Plan de implementación **en este repo** (`juangomezb`). Es la Parte 2 del catálogo en
> [`featured-projects-catalog.md`](./featured-projects-catalog.md), extraída a su propio documento y
> reescrita contra el estado real del código (verificado el 27 ago 2026).
> Los repos [A2](./a2-talent-mcp.md), [A1](./a1-talent-match.md) y [A3](./a3-talent-flow.md) son trabajo
> aparte, de unos 4 meses; este plan no los espera.

## Context

`ProjectsSection.tsx:11` llama a `getPinnedProjects('juxn89', locale, 4)`, que lee los repos *pinned* de
GitHub y muestra 4. Hoy en juangomezb.com se ven **Covid19-Cases**, **juangomezb** (el propio portfolio),
**net-core-microservice** y **food-delivery-app-react-native**: material de aprendizaje, no evidencia de
15+ años de arquitectura. El pipeline funciona; el problema es qué muestra y cómo lo genera.

Cinco defectos concretos, todos verificados en el código:

1. **Títulos y highlights autogenerados sin valor.** `transformRepoToProject` (`src/lib/github/api.ts:115`)
   fabrica el título desde el nombre del repo → "Juangomezb", "Net Core Microservice"; y los `highlights`
   son metadatos (`⭐ N estrellas`, `🔀 N forks`, `💻 Desarrollado en X`). Cero métricas, cero decisiones
   de arquitectura — justo lo que se evalúa en un perfil senior.
2. **Orden arbitrario.** Ordena por `stars` descendente (`api.ts:195`, mutando el array in-place) y corta a
   4. Con todos los repos a 0 stars, qué proyecto sale destacado es indeterminado.
3. **Fallback roto y con datos inventados.** Si GitHub falla, `ProjectsSection.tsx:14-26` cae a
   `projects.items` de los mensajes: 4 proyectos ficticios ("Cloud Banking Platform", "Healthcare Management
   System"…) de dominios que **no corresponden a su trayectoria**. Y como esos items **no tienen `codeUrl`**,
   `ProjectCard.tsx:112` no renderiza ningún botón: **tarjetas sin una sola acción**.
4. **El tipo está triplicado.** `ProjectData` (`api.ts:28-39`), la interfaz inline de
   `ProjectCard.tsx:19-32`, y otro tipo inline en `ProjectsSection.tsx:14-26`. En `ProjectData`, `demoUrl` es
   **obligatorio** y `codeUrl` opcional — exactamente al revés de lo que la UI usa.
5. **Restos muertos.** La clave `projects.viewDemo` existe en ambos locales y **nadie la llama**;
   `project.demoUrl` no se usa en ningún componente; el badge `Featured` está hardcodeado en inglés
   (`ProjectCard.tsx:53`).

**Resultado buscado:** contenido curado y versionado en el repo como fuente de verdad, tarjetas con métricas
reales, y una página de case study por proyecto con URL propia. GitHub deja de decidir qué se muestra y pasa
a aportar solo señal viva (stars, último push).

---

## Decisiones cerradas (usuario)

| Decisión | Elección |
|---|---|
| Qué se publica ahora | **Solo B1 (Stepstone) y B2 (Axxis)**. Los repos OSS entran cuando existan y tengan algo que enseñar |
| Rutas | **`/projects` + `/projects/[slug]`**. La home sigue siendo one-page con anclas |
| Docker | **Fuera de este plan** — va a un plan aparte |

**Por qué solo B1 y B2.** Publicar cinco tarjetas donde tres dicen "en construcción" sin enlace a código
durante meses es peor que publicar dos sólidas: si en tres meses siguen igual, el efecto se invierte. B1 y B2
son trabajo real, terminado y con métricas verificables. La arquitectura queda lista para que añadir A2 sea
**editar dos JSON**, sin tocar código.

---

## Lineamientos 6-9 aplicados a este repo

- **Dirección de dependencia** (6): `src/lib/**` no importa de `src/components/**`. `get-projects.ts` es el
  **único** punto por el que los componentes acceden al contenido y a GitHub — hoy `ProjectsSection.tsx:11`
  llama a la API de GitHub directamente, y eso es lo que se elimina.
- **Sin literales sueltos** (7): nace `src/lib/constants/site.ts`. Hoy `'juxn89'` está hardcodeado en
  `ProjectsSection.tsx:11`, `HeroSection.tsx:78`, `Footer.tsx:42` y `seo.ts:128`; el literal
  `process.env.NEXT_PUBLIC_SITE_URL || 'https://juangomezb.com'` se repite **6 veces** (`sitemap.ts:4`,
  `robots.ts:4`, `seo.ts:24,107,151,186`); y los locales, declarados en `src/routing.ts:6`, se
  **re-hardcodean** en `sitemap.ts:5` y `seo.ts:86-87`.
  Ojo con una inconsistencia real: el CI construye con `https://www.juangomezb.com` (con `www`) y el fallback
  del código es sin `www`. La constante lo unifica.
- **E2E** (8): Playwright, Fase 4. Nota: el CI (`.github/workflows/ci.yml`) hoy corre `tsc`, `vitest` y
  `build`, pero **no corre lint ni E2E** — se añaden como gate.
- **Verificar antes de aplicar** (9): la lista del final es el gate; nada se cierra sin
  `pnpm test && pnpm lint && pnpm build` en verde.

---

## Fase 1 — Constantes y modelo de datos

**Nuevo** `src/lib/constants/site.ts` — primer módulo de constantes del repo:

```ts
export const GITHUB_USERNAME = 'juxn89';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.juangomezb.com';
export const FEATURED_PROJECTS_LIMIT = 4;
export const SECONDARY_REPOS_LIMIT = 6;
export const EXCLUDED_REPOS = ['juangomezb'] as const;   // el sitio no es un proyecto que mostrar
export const CACHE_TAGS = {devto: 'devto-articles', githubProjects: 'github-projects'} as const;
export const REVALIDATE = {github: 3600, devto: 1800} as const;
```

Se adopta donde ya hay duplicación (`sitemap.ts`, `robots.ts`, `seo.ts`, `HeroSection`, `Footer`). Los
locales salen de `routing.locales`, que ya existe.

**Nuevo** `src/lib/projects/types.ts` — un solo tipo, sustituyendo las tres copias:

```ts
export type ProjectKind = 'oss' | 'case-study';
export type ProjectStatus = 'live' | 'in-progress' | 'archived';

export interface ProjectMetric { label: string; value: string; }

export interface ProjectDecision { title: string; rationale: string; tradeoff: string; }

export interface ProjectCaseStudy {
	context: string;
	constraints: string[];
	architecture: string;         // prosa; el diagrama es SVG inline por slug
	decisions: ProjectDecision[];
	results: string[];
}

export interface Project {
	slug: string;                 // clave de ruta y de i18n
	kind: ProjectKind;
	status: ProjectStatus;
	featured: boolean;
	year: string;
	role: string;
	title: string;
	tagline: string;
	description: string;
	metrics: ProjectMetric[];
	stack: string[];
	highlights: string[];
	repoUrl?: string;             // ausente en case studies
	caseStudy?: ProjectCaseStudy;
	// enriquecimiento en runtime, nunca en el contenido:
	stars?: number;
	lastPushedAt?: string;
}
```

`demoUrl` **se elimina del modelo**. Se decidió no publicar demos, y hoy el campo es doblemente muerto:
`ProjectCard` nunca lo lee y los placeholders lo tienen a `"#"`. La clave `projects.viewDemo` se borra de
ambos locales en lugar de conectarse. Si algún proyecto futuro tiene demo, se añade entonces.

**Nuevo** `src/lib/projects/schema.ts` — **primera validación con Zod del repo** (`zod@^4.4.3` ya es
dependencia pero no hay ningún esquema escrito, así que no hay estilo de casa que seguir). Valida en el
límite donde `t.raw()` devuelve datos sin tipar: una entrada mal editada se descarta y se registra, en vez
de reventar el render con un `undefined`.

**Nuevo** `src/lib/projects/get-projects.ts` — el puerto único:
- `getProjects(locale)` → `t.raw('items')` → parseo Zod → descarta inválidas con `console.warn`.
- `getFeaturedProjects(locale, limit = FEATURED_PROJECTS_LIMIT)`, `getProjectBySlug(locale, slug)`,
  `getProjectSlugs(locale)` (para `generateStaticParams`).
- `enrichWithGitHub(projects)` — solo para los que tienen `repoUrl`; si GitHub falla, devuelve los proyectos
  intactos sin badges. **Añade el cache tag** `'github-projects'`: hoy `api.ts:92` usa
  `next: {revalidate: 3600}` **sin tags**, así que los proyectos no son revalidables por tag. Con el tag,
  `src/app/api/revalidate/route.ts` (que solo revalida `'devto-articles'`, línea 11) puede refrescarlos.

`getPinnedProjects` **se conserva tal cual** para el bloque secundario "más repos" de `/projects`, subiendo
el `limit` y excluyendo `EXCLUDED_REPOS`. Sus 17 tests en `src/lib/github/api.test.ts` siguen válidos; se
añade el caso del filtro de exclusión.

### Contenido: `projects.items` en ambos locales

Reemplaza los 4 placeholders ficticios. Se sigue la convención de `experience.jobs` (contenido completo en
los mensajes, mismo orden y longitud en EN y ES), cambiando el `id` numérico por `slug`.

**Métricas: solo lo trazable.** Verificado en `messages/en.json` → `experience.jobs`:

| Proyecto | Métrica | Fuente |
|---|---|---|
| B1 Stepstone | **~25% menos** en tiempos de despliegue | `jobs[0].achievements[1]` ✅ |
| B1 Stepstone | **6 marcas** internacionales (UK, Alemania, Irlanda, Centroamérica) | `jobs[0].description` ✅ |
| B2 Axxis | **~15% más** de eficiencia operativa | `jobs[1].achievements[0]` ✅ |
| B2 Axxis | **~20% menos** en tiempos de carga | `jobs[1].achievements[1]` ✅ |

**A confirmar antes de redactar:** el catálogo citaba también ">99.9% uptime", "+35% rendimiento" y
"millones de usuarios". **No están en `experience.jobs`**, y no pude extraer el texto del CV en PDF para
comprobarlas (fuentes con subconjunto de glifos). O se confirman con una fuente concreta, o **no se usan** —
inventar métricas es precisamente el defecto que arrastra la sección hoy. Lo que sí está y es honesto:
"alta disponibilidad en AWS", en cualitativo.

**B1 y B2 ante NDA:** problema, restricciones, arquitectura y resultados, sin nombres de clientes internos,
sin identificadores de sistemas privados y sin capturas de producto. En primera persona sobre *su*
contribución.

---

## Fase 2 — Tarjeta y sección

**`src/components/sections/ProjectCard.tsx`**
- Importar `Project` en lugar de redeclarar el shape.
- Añadir la fila de **métricas** (el gancho principal), chips de rol y año, y badges de `kind`
  (`Open Source` / `Case Study`) y de `status`. Reutilizar el primitivo `Badge`
  (`src/components/ui/Badge.tsx`, variantes `default|primary|secondary|success|warning|error`).
- CTA primario al case study; el repo como secundario y **solo si `repoUrl` existe**.
- Traducir el `Featured` hardcodeado (`ProjectCard.tsx:53`).

**Detalle que hay que resolver:** `LinkButton` (`src/components/ui/LinkButton.tsx:32-35`) siempre abre en
`target="_blank"` con `rel="noopener noreferrer"`. Para el CTA interno al case study hace falta navegación
en la misma pestaña con el `Link` de `@/routing`. Se añade una prop `external?: boolean` (por defecto
`true`, para no tocar los usos actuales) que elige entre `motion.a` y el `Link` de next-intl.

**`src/components/sections/ProjectsSection.tsx`** — se reescribe siguiendo el patrón que **ya usa
`BlogSection.tsx`**: `Promise.all([getTranslations, getLocale])` (línea 57), componente async separado
envuelto en `<Suspense>` con skeleton (líneas 79-81). Hoy `ProjectsSection` no tiene `Suspense` y llama
GitHub de forma bloqueante. Además: `getFeaturedProjects` en vez de `getPinnedProjects`, fuera el username
hardcodeado, y enlace "ver todos" a `/projects`.

---

## Fase 3 — Rutas, Header y SEO

**El trabajo que el borrador no contemplaba.** El sitio es hoy **una sola página**: `src/app/[locale]/` solo
tiene `layout/page/error/not-found/template`, y no existe ninguna ruta `[slug]`. Las secciones son anclas.

`src/components/layouts/Header.tsx:18-23` define la navegación como anclas desnudas (`#home`, `#about`…),
con `handleNavClick` haciendo `preventDefault()` + `getElementById().scrollIntoView()` (líneas 65-72) y un
IntersectionObserver que resuelve `document.getElementById` (línea 50). **En `/en/projects/talent-match` esas
secciones no existen**: los enlaces del Header quedan muertos y el observer recibe `null` para todas.

Arreglo: el Header pasa a ser consciente de la ruta. Con `usePathname`, si está en la home usa el scroll
suave actual; si no, los `href` se vuelven `/{locale}#about` y navegan de verdad. El observer solo se
registra en la home. Mismo cambio en `MobileMenu.tsx`.

**`LocaleSwitcher` no necesita cambios** — verificado: `getPathForLocale` (línea 30) quita el prefijo de
locale y el `Link` de next-intl lo vuelve a poner, así que `/en/projects/x` → `/es/projects/x` ya funciona.

**Nuevo** `src/app/[locale]/projects/page.tsx` — índice: los proyectos curados más el bloque secundario
"más repos" desde `getPinnedProjects` con `EXCLUDED_REPOS` aplicado. Mover ahí ese bloque descarga la home.

**Nuevo** `src/app/[locale]/projects/[slug]/page.tsx` — case study.
- `generateStaticParams` sobre los slugs de ambos locales, siguiendo el patrón de
  `src/app/[locale]/layout.tsx:45-47`.
- `generateMetadata` reutilizando `generateSEOMetadata` (`src/lib/utils/seo.ts:14`), que **ya soporta**
  `type: 'article'`, `publishedTime` y `authors`. Patrón de `await params` en `layout.tsx:26-43`.
- JSON-LD: reutilizar `generateBreadcrumbSchema` (`seo.ts:182`), que **existe y hoy nadie usa**. No hay
  `generateArticleSchema`; se añade uno mínimo en `seo.ts` junto a los otros.
- `notFound()` si el slug no existe.
- Secciones: contexto → restricciones → arquitectura → decisiones con trade-offs → resultados.

**`src/app/sitemap.ts`** — hoy emite solo `''` (línea 8) y hardcodea `locales` (línea 5). Extender con
`/projects` y `/projects/{slug}` por locale, tomando locales de `routing` y la URL de la constante nueva.

**Diagramas:** SVG inline en el componente, theme-aware con `currentColor`. Evita tocar
`images.remotePatterns` en `next.config.ts`, que hoy solo permite los hosts de dev.to.

---

## Fase 4 — Tests

Vitest está configurado como `include: ['src/**/*.test.ts']` con `environment: 'node'` — **solo `.ts`**, así
que los tests de componentes exigirían cambiar la config y añadir jsdom. No se hace: la UI la cubre
Playwright, y así la config no se toca.

- **Nuevo** `src/lib/projects/get-projects.test.ts`: parseo Zod válido e inválido, descarte de entradas
  malas, filtro de destacados, `getProjectBySlug` con slug inexistente, y que GitHub caído no rompa el
  enriquecimiento.
- **Nuevo** `src/lib/projects/messages-parity.test.ts` — **no estaba previsto y hace falta**: hoy no existe
  ningún test que compare `messages/en.json` con `es.json`. Con contenido rico en dos idiomas la deriva es
  cuestión de tiempo (una clave añadida solo en EN, un array de métricas de distinta longitud). Compara
  slugs, longitudes de arrays y presencia de claves. Es un `.ts`, así que entra en la config actual.
- `src/lib/github/api.test.ts`: añadir el caso del filtro `EXCLUDED_REPOS`.
- **Nuevo** `tests/e2e/projects.spec.ts`: las tarjetas se muestran en `en` y `es`; el click navega al case
  study; slug inexistente da 404; **los enlaces del Header funcionan desde un case study** (la regresión de
  la Fase 3); ninguna tarjeta queda sin acción.
- Ampliar `tests/e2e/home.spec.ts` — hoy solo asserta que el heading es visible.
- `.github/workflows/ci.yml`: añadir `pnpm lint` y los E2E al gate.

---

## Verificación

```bash
pnpm test          # Vitest: get-projects, parity, github api
pnpm lint
npx tsc --noEmit
pnpm build         # valida generateStaticParams y el sitemap
pnpm dev           # /en y /es: home + /projects + un case study
pnpm test:e2e
```

Comprobaciones manuales:
1. `/en` y `/es`: cada tarjeta muestra métricas y CTA al case study. **Ninguna tarjeta sin botón** (el bug
   actual del fallback) y ningún botón de demo.
2. Desde `/en/projects/{slug}`, los enlaces del Header vuelven a la home y hacen scroll a su sección — no
   quedan muertos.
3. El LocaleSwitcher en un case study mantiene la ruta: `/en/projects/x` → `/es/projects/x`.
4. Sin `GITHUB_TOKEN`, la sección sigue renderizando (solo sin stars).
5. `curl localhost:3000/sitemap.xml` incluye los case studies en ambos locales con sus `alternates`.
6. `POST /api/revalidate?secret=…` refresca el tag `github-projects`.
7. Lighthouse ≥ 90 en un case study, sin scroll horizontal a 320px.
8. Ninguna métrica publicada sin fuente trazable en `experience.jobs` o confirmada por el usuario.

---

## Orden de corte

Si hay que reducir: el índice `/projects` (las tarjetas de la home ya enlazan a los case studies) → los
diagramas SVG → el bloque "más repos". **No se recorta**: el modelo de datos único, el arreglo del Header
en subpáginas, y el test de paridad de mensajes.
