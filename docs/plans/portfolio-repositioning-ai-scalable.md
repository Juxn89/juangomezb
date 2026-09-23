# Reposicionamiento del portfolio: aplicaciones robustas y escalables, con IA, sin perder el legacy

## Context
Hoy el portfolio se presenta como "Senior Software Engineer / full-stack / cloud". La IA solo aparece como un rol más del typewriter ("AI Developer"). El legacy solo aparece en el bio y en los logros de INIFOM. El objetivo es que el mensaje principal sea **"construyo software robusto y escalable, potenciado por IA"** y que el legacy funcione como prueba de experiencia: 15+ años modernizando sistemas.

Decisiones tomadas con el usuario:
- **Alcance**: copy + SEO + una sección nueva de enfoque.
- **IA real que se puede afirmar**: integración de LLMs en productos (en Stepstone) y desarrollo asistido por IA.
- **Skills de IA**: Claude (Anthropic) y OpenAI / Azure OpenAI. **No** se mencionan RAG, MCP ni agentes.
- **Titular recomendado**: opción 1, "I build robust, scalable software — powered by AI".
  - Recruiters y ATS siguen buscando "Senior Software Engineer". Un perfil "AI-first" sin proyectos de IA públicos resta credibilidad.
  - Esta opción suma IA sin perder los 15 años de experiencia, y deja el legacy como diferenciador.

> **Estado (2026-09-23)**: plan retomado en una sesión nueva. Se comprobó que las referencias siguen vigentes: `hero.roles` con "AI Developer", valores hardcodeados 'Architect'/'Scalable' en `AboutSection.tsx:47-48`, `worksFor`/`knowsAbout` en `seo.ts:117,132`, `footer.tagline` y los .docx de `cv-base/20260828`. No hay nada implementado aún; la rama es `feat/ai-scalable-repositioning`.

## Cambios

Todo el copy va en `messages/en.json` **y** `messages/es.json`, con las mismas claves.

### 1. Hero (`messages/*.json` → `hero`)
**`hero.title`** (también es el `<title>` SEO):
- EN: `Juan Gómez - Senior Software Engineer · Scalable Systems & AI`
- ES: `Juan Gómez - Ingeniero de Software Senior · Sistemas Escalables e IA`

**`hero.roles`**:
- EN: `Senior Software Engineer`, `Scalable Systems Builder`, `AI-Powered Developer`, `LLM Integration Engineer`, `Legacy Modernization Expert`
- ES: `Ingeniero de Software Senior`, `Constructor de Sistemas Escalables`, `Desarrollador Potenciado por IA`, `Ingeniero de Integración LLM`, `Experto en Modernización Legacy`

**`hero.description`** (también es la meta description, ≤160 caracteres):
- EN: "I build robust, scalable software — powered by AI. From LLM-driven features to modernizing legacy systems, 15+ years shipping for global companies."
- ES: "Construyo software robusto y escalable, potenciado por IA. De funcionalidades con LLMs a modernizar sistemas legacy: 15+ años entregando para empresas globales."

### 2. Sección nueva "Approach / Cómo construyo software"
- **Archivo nuevo**: `src/components/sections/ApproachSection.tsx`.
  - Sigue el patrón de `AboutSection.tsx`: `'use client'`, `motion` con `containerVariants`/`itemVariants`, cards con `cn()` y tokens `bg-bg-secondary`, `border-border`, `accent-*`.
- **Ubicación**: se inserta en `src/app/[locale]/page.tsx` entre `HeroSection` y `AboutSection`, con `id="approach"`.
- **Contenido**: 3 pilares en grid `md:grid-cols-3`. Cada uno tiene icono lucide, título, texto y 2–3 bullets de prueba.
  1. **Robusto y escalable** (`ShieldCheck`): microservicios, microfrontends, colas, >99.9% de disponibilidad, CI/CD, testing.
  2. **Potenciado por IA** (`Sparkles`): integración de LLMs (Claude, OpenAI/Azure OpenAI) en productos reales, y desarrollo asistido por IA para entregar más rápido sin sacrificar calidad.
  3. **Legacy → moderno** (`RefreshCw`): VB6 / ASP.NET → .NET Core, de escritorio a web, de monolito a microservicios. Modernización gradual con continuidad de negocio.
- **Claves i18n nuevas**: `approach.title`, `approach.subtitle`, `approach.pillars.{robust,ai,legacy}.{title,description,points[]}`. Los arrays se leen con `t.raw()`, igual que `hero.roles`.

### 3. About (`src/components/sections/AboutSection.tsx` + `about.*`)
**`about.bio`** (EN; ES equivalente):
> "Senior Software Engineer with 15+ years building robust, scalable systems for multinational companies and the public sector. I integrate LLMs (Claude, OpenAI) into real products and use AI-assisted development to ship faster without compromising quality. Deep track record modernizing legacy platforms — VB6 and ASP.NET to .NET Core, monoliths to microservices — delivering >99.9% availability and +35% performance gains."

**`about.subtitle`**:
- EN: "Engineering for scale, powered by AI"
- ES: "Ingeniería para escalar, potenciada por IA"

**Stats**: los valores hardcodeados ('Architect', 'Scalable') pasan a i18n (`about.stats.*Value`). Quedan así:
- `15+` años
- `500K+` usuarios
- `99.9%` disponibilidad
- `AI` "integrada en producto" / "integrated in products"

**Skills**: se añaden `Claude API`, `OpenAI / Azure OpenAI`, `LLM Integration`, `Prompt Engineering`, `AI-Assisted Development` (icono `Sparkles`, category `ai`) y `Legacy Modernization` (category `architecture`). Van primero en el array para que se vean al principio.

**Expertise**:
- Se añade una 4ª card, **"AI Engineering"**, con `expertise.ai` e icono `Sparkles`. El grid pasa de `md:grid-cols-3` a `md:grid-cols-2 lg:grid-cols-4`.
- Los títulos hardcodeados ("Frontend", "Backend", "Cloud & DevOps") pasan a i18n en `about.expertiseTitles.*`.
- `expertise.backend` menciona modernización de legacy.

### 4. Experiencia (`experience.jobs[0]`, Stepstone)
- Se añade un logro al principio y "LLMs (Claude, OpenAI)" en `technologies`.
  - EN: "Integrated LLM-powered capabilities (Claude, OpenAI) into recruitment platform features and adopted AI-assisted development workflows to accelerate delivery"
  - ES equivalente.
  - **El usuario revisará la redacción exacta antes del commit.**
- Los strings sin traducir de `ExperienceSection.tsx:220,231` pasan a i18n (`experience.ctaTitle`, `experience.ctaLink`). Son pocos y aparecen junto al copy nuevo.

### 5. Footer
**`footer.tagline`**:
- EN: `Senior Software Engineer · Scalable Systems & AI • Managua, Nicaragua`
- ES equivalente.
- Mantiene "Senior Software Engineer", así que `tests/e2e/home.spec.ts:36` sigue pasando.

### 6. SEO (`src/lib/utils/seo.ts`)
- **Title suffix (l.27)**: `| Juan Carlos Gómez - Senior Software Engineer · AI & Scalable Systems`.
- **`keywords` (l.32-44)**: se añaden AI Engineer, LLM Integration, AI-Powered Development, Scalable Systems, Software Architecture, Legacy Modernization, .NET, Microservices.
- **Person schema**:
  - `jobTitle`: `Senior Software Engineer`, sin cambios.
  - `worksFor`: se corrige a `The Stepstone Group`.
  - `knowsAbout`: se añaden Artificial Intelligence, Large Language Models, LLM Integration, Scalable Systems Architecture, Legacy System Modernization, .NET, Microservices.
- **WebSite description (l.159-162)**: se alinea con el nuevo `hero.description`.
- Se actualizan o añaden asserts en `src/lib/utils/seo.test.ts` para `knowsAbout` y el suffix.

### 7. Docs
- `README.md`: título (l.1) y descripción de roles/stats (l.41-42).
- `CHANGELOG.md`: nueva entrada.
- Se copia este plan a `docs/plans/portfolio-repositioning-ai-scalable.md`, según la convención del repo.

### 8. CV (EN y ES)
**Fuentes**:
- `docs/templates/cv-base/20260828/Juan_Gomez_CV_{EN,ES}.docx` → PDF en `public/resume/juan-gomez-cv-{en,es}.pdf`.
- `src/app/api/download-cv/route.ts` sirve el PDF desde Vercel Blob.

**Hallazgos de la revisión del PDF actual (EN, 2 páginas)**:
- **Bug**: el link de GitHub dice `github.com/jux89`, pero el usuario real es `juxn89` (lo usa `ProjectsSection.tsx`). Hay que corregirlo.
- **Contacto**: falta el portfolio `juangomezb.com`. Se añade.
- **Titular**: solo dice "Senior Software Engineer". Pasa a "Senior Software Engineer · Scalable Systems & AI", igual que el sitio.
- **Summary**: es idéntico al bio viejo. Se reescribe con el bio nuevo, en versión CV más compacta.
- **Stepstone** tiene 10 bullets. Varios son tareas, no impacto: "Built user interfaces using ReactJS…", "Developed microservices using .NET…", "Created applications to help jobseekers…".
  - Se consolidan en 5–6 bullets de impacto.
  - Primero va el bullet nuevo de LLM (Claude, OpenAI/Azure OpenAI) y desarrollo asistido por IA.
- **Axxis**: se recortan los bullets genéricos ("Responsible for bug fixing…", "Collaborated with cross-functional teams…").
- **Skills**: hoy son una lista plana de 27 items. Se agrupan por categoría: *AI & LLMs* (Claude API, OpenAI / Azure OpenAI, LLM Integration, Prompt Engineering, AI-Assisted Development), *Backend*, *Frontend*, *Cloud & DevOps*, *Architecture & Practices*. Legacy Modernization va en Architecture.
- **Inconsistencias CV ↔ sitio**:
  - Stepstone: el CV dice "Senior Software Engineer" y el sitio dice "Software Engineer".
  - INIFOM: el CV lo separa en dos roles (Software Developer 2017-19, Team Leader 2019-20) y el sitio muestra un solo rol, 2017-20.
  - Se alinea `messages/*.json` con el CV, que es la fuente verdadera y está alineada con LinkedIn.

**Proceso**:
1. Editar los `.docx` (skill `docx`) en una carpeta nueva `docs/templates/cv-base/<YYYYMMDD>/`. La versión 20260828 se conserva.
2. Exportar a PDF, idealmente con LibreOffice headless si está instalado; si no, el usuario exporta desde Word.
3. Revisar visualmente los dos PDF.
4. Reemplazar `public/resume/*.pdf` y mover los anteriores a `public/resume/previous/`.
5. Subir a Vercel Blob con la misma ruta `resume/juan-gomez-cv-{en,es}.pdf`. **Hay que confirmar con el usuario antes**, porque la subida es pública.
6. Recordatorio: actualizar LinkedIn con el mismo titular y summary.

### Fuera de alcance (pendiente para el usuario)
- **GitHub**: fijar en `juxn89` algún repo de IA con buena description/topics. La sección Projects se alimenta de los repos pinned.
- **Otros**: OG image inexistente (`/og-image.jpg`) y `ContactSection` no renderizada.

## Verificación
1. `npm run lint` y `npx tsc --noEmit`.
2. `npm run test` (vitest de `seo.test.ts`) y `npx playwright test`. `home.spec.ts` debe seguir pasando.
3. `npm run dev`:
   - Revisar `/en` y `/es`: typewriter con los nuevos roles, sección Approach entre Hero y About, 4 cards de expertise, stats traducidas.
   - Probar en móvil (320px) y desktop, en dark y light.
4. Ver el código fuente de `/en` y `/es`: `<title>`, meta description y JSON-LD (`knowsAbout`, `worksFor`) actualizados.
5. Confirmar que no quedan claves faltantes (next-intl avisa por consola) y que los JSON en/es tienen las mismas claves.
6. CV:
   - Abrir los PDF nuevos y revisar que el layout no se rompe, que los links (GitHub `juxn89`, portfolio, LinkedIn) funcionan y que el contenido EN = ES.
   - Tras subir a Blob, probar `/api/download-cv?locale=en` y `?locale=es` en local.
