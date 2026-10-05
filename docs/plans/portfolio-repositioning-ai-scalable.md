# Reposicionamiento del portfolio: aplicaciones robustas y escalables, con IA, sin perder el legacy

## Context
Hoy el portfolio se presenta como "Senior Software Engineer / full-stack / cloud". La IA solo aparece como un rol más del typewriter ("AI Developer"). El legacy solo aparece en el bio y en los logros de INIFOM. El objetivo es que el mensaje principal sea **"construyo software robusto y escalable, potenciado por IA"** y que el legacy funcione como prueba de experiencia: 15+ años modernizando sistemas.

Decisiones tomadas con el usuario:
- **Alcance**: copy + SEO + una sección nueva de enfoque.
- **IA que se puede afirmar** (revisado el 2026-10-05):
  - **En Stepstone**: features con LLMs en producto y desarrollo asistido por IA adoptado en el equipo.
  - **Trabajo público propio**, respaldado por artículos en DEV.to: agentes con tool use, servidores y clientes MCP, RAG local en .NET y desarrollo asistido por IA (Claude Code).
    - El repo `talent-mcp` (servidor MCP en .NET 10) se menciona cuando esté publicado y funcional.
  - Esto **reemplaza** la decisión anterior de no mencionar RAG, MCP ni agentes, que se tomó cuando no había evidencia pública. Ahora 8 de los 15 artículos en inglés son de IA.
- **Regla**: toda afirmación de IA del sitio que no venga de Stepstone debe poder enlazar a un artículo o repo.
- **Skills de IA**: Claude API / Anthropic, OpenAI / Azure OpenAI, Agents & Tool Use, MCP (Model Context Protocol), RAG, Claude Code / AI-Assisted Development.
- **Titular recomendado**: opción 1, "I build robust, scalable software — powered by AI".
  - Recruiters y ATS siguen buscando "Senior Software Engineer", así que se mantiene como ancla.
  - La IA va como especialidad, ahora con evidencia pública, y el legacy queda como diferenciador.

> **Estado (2026-10-05)**:
> - Sección 9 (DEV.to) implementada en `b40bc54`.
> - Secciones 1–8 revisadas con el usuario (alcance de IA ampliado, evidencia por pilar, logros de Stepstone), pero sin implementar.
> - La rama es `feat/ai-scalable-repositioning`.

## Cambios

Todo el copy va en `messages/en.json` **y** `messages/es.json`, con las mismas claves.

### 1. Hero (`messages/*.json` → `hero`)
**`hero.title`** (también es el `<title>` SEO):
- EN: `Juan Gómez - Senior Software Engineer · Scalable Systems & AI`
- ES: `Juan Gómez - Ingeniero de Software Senior · Sistemas Escalables e IA`

**`hero.roles`**:
- EN: `Senior Software Engineer`, `Scalable Systems Builder`, `AI Agents & MCP Developer`, `LLM Integration Engineer`, `Legacy Modernization Expert`
- ES: `Ingeniero de Software Senior`, `Constructor de Sistemas Escalables`, `Desarrollador de Agentes IA y MCP`, `Ingeniero de Integración LLM`, `Experto en Modernización Legacy`

**`hero.description`** (también es la meta description, ≤160 caracteres; verificar el largo al implementar):
- EN: "I build robust, scalable software — powered by AI. From LLM features and agents to modernizing legacy systems, 15+ years shipping for global companies."
- ES: "Construyo software robusto y escalable, potenciado por IA. De LLMs y agentes a modernizar sistemas legacy: 15+ años entregando para empresas globales."

### 2. Sección nueva "Approach / Cómo construyo software"
- **Archivo nuevo**: `src/components/sections/ApproachSection.tsx`.
  - Sigue el patrón de `AboutSection.tsx`: `'use client'`, `motion` con `containerVariants`/`itemVariants`, cards con `cn()` y tokens `bg-bg-secondary`, `border-border`, `accent-*`.
- **Ubicación**: se inserta en `src/app/[locale]/page.tsx` entre `HeroSection` y `AboutSection`, con `id="approach"`.
- **Contenido**: 3 pilares en grid `md:grid-cols-3`. Cada uno tiene icono lucide, título, texto, 2–3 bullets de prueba y **1–2 links a artículos de DEV.to como evidencia**.
  1. **Robusto y escalable** (`ShieldCheck`):
     - **Bullets**: microservicios, microfrontends y colas en 6 marcas internacionales, >99.9% de disponibilidad, CI/CD, testing y observabilidad.
     - **Evidencia**: RabbitMQ from Fundamentals to Production (Part 1) y Logs, Metrics and Traces Are One Request.
  2. **Potenciado por IA** (`Sparkles`):
     - **Bullets**:
       - Features con LLMs (Claude, OpenAI/Azure OpenAI) en producto.
       - Agentes con tool use y servidores/clientes MCP en .NET.
       - RAG local.
       - Desarrollo asistido por IA para entregar más rápido sin sacrificar calidad.
     - **Evidencia**: Build an MCP Server in C# y Build a Claude Tool-Use Agent in C#.
  3. **Legacy → moderno** (`RefreshCw`):
     - **Bullets**: VB6 / ASP.NET → .NET Core → .NET 10, de escritorio a web, de monolito a microservicios. Modernización gradual con continuidad de negocio.
     - **Evidencia**: Native AOT in .NET 10 y Minimal APIs Done Right in .NET 10.
- **Links por idioma**: viven en i18n (`approach.pillars.*.evidence[] = {title, url}`) con la URL de DEV.to de cada versión. Se fijan a mano y no se piden a la API, para no depender de ella en el hero.

| Artículo | EN | ES |
|---|---|---|
| RabbitMQ Part 1 | `rabbitmq-from-fundamentals-to-production-part-1-exchanges-queues-and-bindings-49df` | `rabbitmq-de-los-fundamentos-a-produccion-parte-1-exchanges-colas-y-bindings-256h` |
| Observabilidad | `logs-metrics-and-traces-are-not-three-pillars-theyre-one-request-538l` | `logs-metricas-y-trazas-no-son-tres-pilares-son-una-sola-peticion-1idb` |
| MCP Server | `build-an-mcp-server-in-c-write-your-tools-once-use-them-in-every-claude-4oa1` | `crea-un-servidor-mcp-en-c-escribe-tus-herramientas-una-vez-y-usalas-en-cualquier-claude-3gg3` |
| Tool-use agent | `build-a-claude-tool-use-agent-in-c-not-a-chatbot-on-steroids-3e9g` | `crea-un-agente-con-tool-use-de-claude-en-c-no-es-un-chatbot-con-esteroides-fjh` |
| Native AOT | `native-aot-in-net-10-ship-a-minimal-api-that-skips-the-jit-tax-4i9b` | `native-aot-en-net-10-publica-un-minimal-api-que-se-salta-el-peaje-del-jit-17ck` |
| Minimal APIs | `minimal-apis-done-right-in-net-10-validation-versioning-and-openapi-without-controllers-48lg` | `minimal-apis-bien-hechos-en-net-10-validacion-versionado-y-openapi-sin-controladores-3i84` |

(Todas con el prefijo `https://dev.to/jgomezdev/`. Verificadas contra la API el 2026-10-05.)
- **Claves i18n nuevas**: `approach.title`, `approach.subtitle`, `approach.pillars.{robust,ai,legacy}.{title,description,points[],evidence[]}`. Los arrays se leen con `t.raw()`, igual que `hero.roles`.
- **Links**: `target="_blank" rel="noopener noreferrer"`, con un `aria-label` que indique que abren DEV.to.

### 3. About (`src/components/sections/AboutSection.tsx` + `about.*`)
**`about.bio`** (EN; ES equivalente):
> "Senior Software Engineer with 15+ years building robust, scalable systems for multinational companies and the public sector. I ship LLM-powered features (Claude, OpenAI) in production, build AI agents and MCP servers in .NET, and use AI-assisted development to deliver faster without compromising quality. Deep track record modernizing legacy platforms — VB6 and ASP.NET to .NET Core, monoliths to microservices — delivering >99.9% availability and +35% performance gains."

**`about.subtitle`**:
- EN: "Engineering for scale, powered by AI"
- ES: "Ingeniería para escalar, potenciada por IA"

**Stats**: los valores hardcodeados ('Architect', 'Scalable') pasan a i18n (`about.stats.*Value`). Quedan así:
- `15+` años
- `500K+` usuarios
- `99.9%` disponibilidad
- `AI` "integrada en producto" / "integrated in products"

**Skills**:
- Se añaden con icono `Sparkles` y category `ai`: `Claude API`, `OpenAI / Azure OpenAI`, `AI Agents & Tool Use`, `MCP (Model Context Protocol)`, `RAG`, `AI-Assisted Development`.
- Se añade `Legacy Modernization` con category `architecture`.
- Van primero en el array para que se vean al principio.

**Expertise**:
- Se añade una 4ª card, **"AI Engineering"**, con `expertise.ai` e icono `Sparkles`. El grid pasa de `md:grid-cols-3` a `md:grid-cols-2 lg:grid-cols-4`.
- Los títulos hardcodeados ("Frontend", "Backend", "Cloud & DevOps") pasan a i18n en `about.expertiseTitles.*`.
- `expertise.backend` menciona modernización de legacy.

### 4. Experiencia (`experience.jobs[0]`, Stepstone)
- **Logros nuevos**: se añaden 2 logros al principio, confirmados por el usuario: features con LLMs en producto y desarrollo asistido por IA en el equipo.
  - EN 1: "Delivered LLM-powered features (Claude, OpenAI) in production recruitment platforms used by millions of jobseekers"
  - EN 2: "Drove adoption of AI-assisted development workflows within the team, accelerating delivery while keeping code-review and testing standards"
  - ES equivalentes.
  - **Pendiente del usuario**:
    - Dar 1 ejemplo concreto de feature (p. ej. matching, extracción de skills, generación de textos) para cambiar "LLM-powered features" por algo específico.
    - Confirmar si hay una métrica (tiempo ahorrado, % de adopción).
    - Sin métrica, no se inventa ninguna.
- **Limpieza**: se eliminan los 3 bullets de tareas genéricas (l.158-160 de `en.json`: "Build user interfaces…", "Develop microservices…", "Create applications…"). Así quedan logros de impacto y la lista de Stepstone no crece a 10.
- **`technologies`**: se añaden `LLMs (Claude, OpenAI)` y `AI-Assisted Development`.
- Los strings sin traducir de `ExperienceSection.tsx:220,231` pasan a i18n (`experience.ctaTitle`, `experience.ctaLink`). Son pocos y aparecen junto al copy nuevo.

### 5. Footer
**`footer.tagline`**:
- EN: `Senior Software Engineer · Scalable Systems & AI • Managua, Nicaragua`
- ES equivalente.
- Mantiene "Senior Software Engineer", así que `tests/e2e/home.spec.ts:36` sigue pasando.

### 6. SEO (`src/lib/utils/seo.ts`)
- **Title suffix (l.27)**: `| Juan Carlos Gómez - Senior Software Engineer · AI & Scalable Systems`.
- **`keywords` (l.32-44)**: se añaden AI Engineer, LLM Integration, AI Agents, Model Context Protocol, RAG, AI-Powered Development, Scalable Systems, Software Architecture, Legacy Modernization, .NET, Microservices.
- **Person schema**:
  - `jobTitle`: `Senior Software Engineer`, sin cambios.
  - `worksFor`: se corrige a `The Stepstone Group`.
  - `knowsAbout`: se añaden Artificial Intelligence, Large Language Models, LLM Integration, AI Agents, Model Context Protocol, Retrieval-Augmented Generation, Scalable Systems Architecture, Legacy System Modernization, .NET, Microservices.
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
- **Skills**: hoy son una lista plana de 27 items. Se agrupan por categoría: *AI & LLMs* (Claude API, OpenAI / Azure OpenAI, AI Agents & Tool Use, MCP, RAG, AI-Assisted Development), *Backend*, *Frontend*, *Cloud & DevOps*, *Architecture & Practices*. Legacy Modernization va en Architecture.
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

### 9. DEV.to: `canonical_url` y resiliencia del blog
**Decisión (del usuario)**: DEV.to es el original y el portfolio es la copia. Si hay canonical, va en el portfolio apuntando a DEV.to, nunca al revés. No se toca el front matter de los artículos en el repo codex-hermes.

**Hallazgos (verificados el 2026-10-05)**:
- **Render**: `BlogSection.tsx` es un Server Component async. `getDevToArticles()` hace fetch con `next.revalidate: 1800` y el tag `devto-articles`, así que es render en servidor (ISR). Google indexa ese HTML; la pregunta abierta queda resuelta.
- **No hay páginas de artículo**:
  - El portfolio solo muestra cards con título, descripción, tags y cover, y enlazan a `article.url` en DEV.to.
  - No hay `/[locale]/blog/[slug]`, el sitemap solo tiene `/en` y `/es`, y el texto completo no se duplica.
  - Por eso hoy no existe ninguna página donde poner `<link rel="canonical">` hacia DEV.to.
  - El canonical de `/en` y `/es` debe seguir siendo self-referencing (`seo.ts:84`). Ponerlo hacia DEV.to desindexaría la home.
- **API**: `GET /api/articles/latest?username=jgomezdev` ya devuelve `canonical_url`, igual a `url` cuando está vacío en DEV.to. No hace falta otro endpoint.

**Decisión (2026-10-05)**: por ahora no se crean páginas de artículo. Sin ellas, el canonical **no aporta SEO**:
- El portfolio no duplica contenido; un listado con título y descripción es normal.
- `canonical_url` coincide con `url` en los posts revisados, así que el HTML no cambia.

Se descarta el JSON-LD `BlogPosting` en la home: no genera rich results y su valor es marginal. Se implementa solo lo mínimo, como preparación para el futuro.

**Cambios**:
1. **`src/lib/api/devto.ts`**: añadir `canonical_url: string` a `DevToArticle`.
2. **`BlogCard.tsx:114`**: el link "Read more" usa `article.canonical_url || article.url`. Respeta la URL canónica declarada sin construirla a mano.
3. **Guardarraíl para el futuro**: un comentario de una línea en `DevToArticle.canonical_url`. Si algún día se crean páginas `/[locale]/blog/[slug]` con el texto completo, su `generateMetadata` debe usar `alternates.canonical = article.canonical_url`.
4. **Resiliencia ante fallo o rate limit de la API** (independiente del canonical; es lo que ve quien llega buscándote):
   - `getDevToArticles` devuelve `{articles, status: 'ok' | 'empty' | 'error'}` en vez de `[]` silencioso.
     - Un 429 o un 5xx cuenta como `'error'`.
     - El cache de ISR sigue sirviendo la última versión buena; el fallback solo aplica si no la hay.
   - Para `'error'`, `BlogContent` muestra un estado amable con CTA al perfil `dev.to/jgomezdev`. Para `'empty'`, un mensaje neutro.
   - Strings hardcodeados a i18n:
     - `"No articles found."` (`BlogSection.tsx:41`) → `blog.empty`.
     - `"View All Articles on Dev.to"` (l.91) → `blog.viewAll`.
     - Claves nuevas: `blog.error`, `blog.errorCta`.
   - Actualizar `src/lib/api/devto.test.ts`: los casos de error/429 devuelven `status: 'error'`, y se comprueba que `canonical_url` se preserva.

**Implementado (2026-10-05)**: puntos 1–4.
- **Bug previo corregido de paso**: faltaba `setRequestLocale(locale)` en `src/app/[locale]/layout.tsx` y `page.tsx`.
  - Por eso `getLocale()` en `BlogSection` devolvía `en` en `/es`.
  - En `/es` se mostraban los posts en inglés y el encabezado del blog en inglés.
- **E2E con fallos previos**: 4 tests fallan igual sin estos cambios.
  - `home.spec.ts:35` (footer tagline)
  - `i18n.spec.ts:16` (switch EN→ES)
  - `navigation.spec.ts:18` (scroll a sección)
  - `navigation.spec.ts:25` (dark mode)

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
7. Blog / DEV.to:
   - En el código fuente de `/en` y `/es`, los links de las cards deben apuntar al `canonical_url` de DEV.to.
   - El `<link rel="canonical">` de la home debe seguir apuntando a `juangomezb.com/{locale}`.
   - Para simular un fallo de la API, apuntar temporalmente `DEV_TO_API_URL` a una URL inválida o mockear un 429 en vitest. Debe verse el estado de error traducido con el CTA a DEV.to, y no "No articles found.".
