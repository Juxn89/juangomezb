# 📖 Development Context & History

Este documento captura el contexto completo del desarrollo del proyecto, decisiones arquitectónicas, problemas encontrados y sus soluciones, y lecciones aprendidas. Es esencial para retomar el proyecto después de un tiempo o en una nueva máquina.

---

## 🎯 Visión del Proyecto

### Objetivo Principal
Crear un portfolio profesional de Senior Software Engineer que sea:
- **Moderno y creativo**: Sin usar plantillas genéricas
- **Alto rendimiento**: Lighthouse scores 90+
- **Producción ready**: Seguridad, SEO, accesibilidad
- **Multilingüe**: Inglés y Español
- **Escalable**: Arquitectura limpia y mantenible

### Audiencia Target
- Recruiters y hiring managers
- Potenciales clientes (freelance/consultoría)
- Comunidad de desarrolladores
- Empleadores buscando senior engineers

---

## 🏗️ Arquitectura del Proyecto

### Stack Tecnológico (Decisiones y Razones)

#### Next.js 16.2.6
- **Por qué**: Framework moderno con RSC (React Server Components)
- **Ventajas**: 
  - SEO nativo
  - Routing automático
  - ISR para blog
  - Edge middleware para seguridad
- **Cambios breaking desde v14**:
  - `bg-gradient-to-*` → `bg-linear-to-*` (Tailwind 4)
  - TimeZone config en 2 lugares (i18n.ts + Providers.tsx)

#### React 19.2.4
- **Por qué**: Última versión con mejoras de performance
- **Features usados**:
  - Server Components por defecto
  - Client Components solo cuando necesario
  - Suspense boundaries
  - Async components

#### TypeScript 5+
- **Por qué**: Type safety, mejor DX
- **Configuración**: Strict mode habilitado
- **Patrón**: No usar `any`, preferir types específicos

#### Tailwind CSS 4
- **Por qué**: Utility-first, mobile-first, JIT
- **Custom config**: Forest Code palette
- **CSS Variables**: RGB format para mejor compatibilidad con opacity
- **Cambios de sintaxis**: 
  - `shrink-0` en lugar de `flex-shrink-0`
  - `bg-linear-to-*` en lugar de `bg-gradient-to-*`

#### next-intl 4.12.0
- **Por qué**: Mejor integración con App Router y RSC
- **Alternativas descartadas**:
  - react-i18next (no optimizado para RSC)
  - next-intlayer (menos maduro)
- **Configuración crítica**: TimeZone en DOS lugares para evitar warnings

#### Framer Motion 12.40.0
- **Por qué**: Animaciones complejas y performantes
- **Uso**: Solo para animaciones complejas, Tailwind para simples
- **Pattern**: `ease: [0.22, 1, 0.36, 1] as const` (TypeScript strict)

#### react-type-animation 3.2.0
- **Por qué**: Efecto typewriter específico para Hero
- **Alternativas consideradas**: 
  - Implementación custom (demasiado complejo)
  - typed.js (vanilla JS, peor integración)

#### Lucide React
- **Por qué**: Tree-shakeable, personalizable
- **Limitación conocida**: No tiene Github ni Linkedin icons (usamos SVG custom)
- **Icons técnicos usados**: Code, Database, Cloud, Package, Network, Terminal, Server, Cpu, GitBranch, Layers, Zap

### Estructura de Carpetas

```
src/
├── app/
│   ├── [locale]/           # Routing i18n
│   │   ├── layout.tsx      # Root layout con providers
│   │   ├── page.tsx        # Home (todas las secciones)
│   │   ├── blog/           # Blog integrado con Dev.to
│   │   └── not-found.tsx   # 404 localizado
│   ├── not-found.tsx       # 404 root (fallback)
│   └── globals.css         # Estilos globales + CSS vars
├── components/
│   ├── ui/                 # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── LocaleSwitcher.tsx
│   ├── sections/           # Secciones del portfolio
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── ProjectCard.tsx
│   └── layouts/
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── types/              # TypeScript types
│   ├── utils/              # Utilidades (cn, formatters)
│   └── data/               # Data estática (CV, projects)
└── messages/
    ├── en.json             # Traducciones inglés
    └── es.json             # Traducciones español
```

**Decisión**: Single-page portfolio con secciones navegables (#about, #projects, etc.)
- Mejor UX para portfolios
- Scroll smooth nativo
- Intersection Observer para active section

---

## 🎨 Sistema de Diseño

### Paleta de Colores: Forest Code

**Historia**: Originalmente se usó "Cyber Sunset" (azul/cyan/violeta), pero se cambió a "Forest Code" para una estética más natural y profesional.

#### Colores Principales
```css
/* Light Mode */
--color-accent-primary: 4 120 87;        /* Emerald #047857 */
--color-accent-secondary: 124 58 237;    /* Violet #7C3AED */
--color-accent-tertiary: 251 191 36;     /* Amber #FBBF24 */

/* Dark Mode */
--color-accent-primary: 16 185 129;      /* Emerald #10B981 */
--color-accent-secondary: 167 139 250;   /* Violet #A78BFA */
--color-accent-tertiary: 252 211 77;     /* Amber #FCD34D */
```

#### Gradientes
```css
.gradient-text {
  background: linear-gradient(
    135deg,
    rgb(var(--color-accent-primary)),
    rgb(var(--color-accent-secondary)),
    rgb(var(--color-accent-tertiary))
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding-bottom: 0.25rem;      /* Previene clipping */
  line-height: 1.25;            /* Previene clipping */
}
```

**Problema solucionado**: Las letras con "descenders" (j, g, p, q, y) se cortaban en la parte inferior. Solución: `pb-1` y `leading-tight`.

### Dark Mode
- **Detección**: `prefers-color-scheme`
- **Toggle**: Manual con botón en navbar
- **Persistencia**: localStorage + cookie
- **Implementación**: CSS variables con Context API
- **Prevención FOUC**: Inline script en layout

---

## 📊 Decisiones de Contenido

### Hero Section
**Evolución**:
1. **Versión inicial**: CTA buttons, texto genérico
2. **Versión actual**: Foto de perfil, typewriter con roles, social links, sin CTAs

**Por qué sin CTAs**: 
- Los portfolios modernos priorizan la información directa
- Las redes sociales son más efectivas como CTA
- Menos "noise", más profesional

**Roles en typewriter**:
```json
"roles": [
  "Software Engineer",
  "Backend Developer", 
  "Frontend Developer",
  "Full Stack Developer",
  "AI Developer"
]
```

**Decisión**: 5 roles que reflejan experiencia real, infinite loop para engagement.

### About Section - Stats

**Evolución crítica**: Las stats pasaron de placeholder a estratégicas.

#### Versión Inicial (Placeholder)
```json
"stats": [
  {"key": "experience", "value": "12+"},
  {"key": "projects", "value": "50+"},
  {"key": "clients", "value": "30+"}
]
```

#### Versión Actual (Estratégica)
```json
"stats": [
  {"key": "experience", "value": "15+"},
  {"key": "users", "value": "500K+"},
  {"key": "role", "value": "Architect"},
  {"key": "principle", "value": "Scalable"}
]
```

**Por qué el cambio**:
- **15+ años**: Demuestra seniority real
- **500K+ usuarios**: Impacto cuantificable (más impresionante que # proyectos)
- **Architect**: Rol claro para recruiters
- **Scalable**: Principio técnico que buscan empresas

### Skills - Optimización

**Criterio de selección**:
- ✅ Tecnologías con experiencia real (no "hello world")
- ✅ Relevantes para posiciones senior (2024-2026)
- ✅ Balance: Frontend + Backend + DevOps + Tools
- ❌ No incluir tecnologías obsoletas o sin experiencia

**22 Skills actuales**:

Frontend: React, TypeScript, Next.js, Tailwind
Backend: C#, .NET, Node.js, SQL Server, PostgreSQL
DevOps/Tools: Azure, Docker, Kubernetes, Git
Architecture: Microservices, REST API, GraphQL
Testing: xUnit, Jest, Cypress
Patterns: SOLID, Clean Code
Extra: Linux, Redis, NoSQL, RabbitMQ

**Correcciones de íconos** (importante):
- .NET: Database → Code
- Node.js: Database → Code  
- Docker: Cloud → Package
- Kubernetes: Cloud → Network

### Dev.to Integration

**Decisiones**:
- **API pública** sin autenticación (simple, sin rate limits problem)
- **ISR con revalidate 3600s** (1 hora) - balance entre freshness y performance
- **Username**: jgomezdev
- **Fetch en Server Component** - mejor SEO, menos JavaScript al cliente

**URL**: `https://dev.to/api/articles?username=jgomezdev`

---

## 🐛 Problemas Encontrados y Soluciones

### 1. Lucide-react Icons Faltantes

**Problema**: `Github` y `Linkedin` no existen en lucide-react

**Solución**: Custom SVG components
```tsx
const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    {/* SVG path */}
  </svg>
);
```

**Ubicación**: HeroSection.tsx líneas 61-79

### 2. next-intl ENVIRONMENT_FALLBACK Warning

**Problema**: Warning constante en consola sobre timezone fallback

**Solución**: Configurar `timeZone` en DOS lugares:
1. `i18n.ts` línea 13
2. `src/app/[locale]/Providers.tsx` líneas 15-19

**Por qué dos lugares**: next-intl necesita timezone en request config Y en provider.

### 3. Gradient Text Clipping

**Problema**: Letras j, g, p, q, y se cortaban por abajo

**Solución**: 
```css
padding-bottom: 0.25rem;  /* pb-1 */
line-height: 1.25;        /* leading-tight */
```

**Aplicado en**: Todos los elementos con clase `.gradient-text`

### 4. BlogCard.tsx Corruption

**Problema**: Archivo corrupto durante edición (causa desconocida)

**Solución**: Recrear desde cero
- Lección: Siempre hacer commits frecuentes
- Git es tu mejor amigo

### 5. HeroSection.tsx Revert

**Problema**: Archivo revertido a versión anterior durante conversación

**Solución**: Recreación completa (245 líneas)
- Pattern: Cuando un archivo se corrompe, recrear es más rápido que debuggear

### 6. Git Remote SSH

**Problema**: `git push origin` fallaba con autenticación

**Solución**: Remote configurado como `origin-ssh`
```bash
git push origin-ssh main
git push origin-ssh feature/ai-v2
```

**Lección**: Verificar remotes al clonar: `git remote -v`

### 7. Tailwind CSS 4 Syntax Changes

**Problema**: Build errors con `bg-gradient-to-*`

**Solución**: Tailwind 4 usa `bg-linear-to-*`
```tsx
// ❌ Antiguo (Tailwind 3)
className="bg-gradient-to-r from-blue-500 to-purple-500"

// ✅ Nuevo (Tailwind 4)
className="bg-linear-to-r from-blue-500 to-purple-500"
```

### 8. Root 404 Page Sin Estilos

**Problema**: `/not-found.tsx` (root) no tenía estilos de Tailwind

**Solución**: Crear `app/layout.tsx` (root layout)
- Next.js necesita layout en root para aplicar globals.css a rutas sin locale

### 9. Framer Motion TypeScript Errors

**Problema**: Ease arrays generaban error TypeScript
```tsx
ease: [0.22, 1, 0.36, 1]  // ❌ Error: Type 'number[]'
```

**Solución**: Assertion `as const`
```tsx
ease: [0.22, 1, 0.36, 1] as const  // ✅ Type readonly
```

### 10. Vercel Node.js 18 Discontinued

**Problema**: Build fallaba en Vercel (Node.js 18 deprecated)

**Solución**: Update `package.json`
```json
"engines": {
  "node": ">=24.x",
  "pnpm": ">=9.0.0"
}
```

### 11. pnpm-workspace.yaml Packages Field

**Problema**: Build warning sobre missing packages field

**Solución**: Agregar al config
```yaml
packages:
  - '.'
```

### 12. ProjectCard Buttons Position Inconsistent

**Problema**: Botones se movían verticalmente según cantidad de contenido

**Solución**: Flexbox layout
```tsx
// Container
<div className="relative z-10 flex flex-col h-full">
  {/* Content */}
  {/* Buttons */}
  <div className="flex gap-3 mt-auto">  {/* mt-auto empuja al fondo */}
```

**Commit**: `fix: posición inconsistente de botones en ProjectCard`

---

## 🚀 Deployment Journey

### Development → Production

#### 1. Pre-deployment Checklist
- ✅ Build exitoso localmente (`pnpm run build`)
- ✅ TypeScript sin errores
- ✅ ESLint sin errores
- ✅ Todas las rutas funcionales (/en, /es)
- ✅ Dark mode funciona
- ✅ i18n funciona
- ✅ Dev.to integration funciona
- ✅ 404 pages funcionan
- ✅ README.md actualizado
- ✅ CHANGELOG.md actualizado

#### 2. Vercel Configuration
```bash
# Build Settings
Framework: Next.js
Build Command: pnpm run build
Output Directory: .next
Install Command: pnpm install
Node Version: 24.x
```

#### 3. Environment Variables
```bash
NEXT_PUBLIC_SITE_URL=https://www.juangomezb.com
```

#### 4. Domain Setup
- **Primary**: www.juangomezb.com
- **Redirect**: juangomezb.com → www.juangomezb.com

#### 5. Post-deployment Verification
- ✅ Site loads correctly
- ✅ Both locales work
- ✅ Blog loads Dev.to articles
- ✅ 404 page accessible
- ✅ Dark mode persists
- ✅ Performance metrics OK

**Production URL**: https://www.juangomezb.com/en

---

## 📈 Lessons Learned

### Technical

1. **Next.js 16 Breaking Changes**
   - Siempre revisar changelog entre major versions
   - Tailwind 4 syntax es diferente
   - TimeZone config es más estricto

2. **TypeScript Strict Mode**
   - Vale la pena el esfuerzo inicial
   - Catch errores antes de runtime
   - Usar `as const` para arrays literales

3. **Component Architecture**
   - Server Components por defecto
   - Client Components solo cuando necesario ('use client')
   - Extract logic a custom hooks

4. **CSS Variables + Tailwind**
   - RGB format para mejor opacity support: `rgb(var(--color) / 0.5)`
   - CSS variables para theming
   - Tailwind para responsive

5. **Git Workflow**
   - Commits frecuentes y descriptivos
   - Feature branches para cambios grandes
   - Verificar remotes al clonar

### Design

1. **Less is More**
   - Quitar CTAs innecesarios mejoró el Hero
   - Gradient text debe tener suficiente padding
   - Animations sutiles > animations exageradas

2. **Mobile-First**
   - Diseñar para mobile primero
   - Desktop es "scaling up", no "scaling down"
   - Test en devices reales, no solo DevTools

3. **Dark Mode**
   - Debe ser default si el sistema lo prefiere
   - Colores deben tener suficiente contraste (WCAG AA)
   - Testing en ambos modes es crítico

### Content

1. **Stats Estratégicas**
   - Números que importan: impacto > cantidad proyectos
   - Roles claros para recruiters
   - Principios técnicos son keywords para ATS

2. **Skills Relevantes**
   - Calidad > cantidad
   - Solo skills con experiencia real
   - Actualizar según tendencias (2024-2026)

3. **i18n Completo**
   - Todo texto debe ser traducible
   - Incluir dates, numbers, plurals
   - Testing en ambos idiomas

---

## 🔮 Future Improvements (Backlog)

### Short-term (Next Sprint)
- [ ] Add Project detail pages (`/projects/[slug]`)
- [ ] Implement Contact form with validation
- [ ] Add testimonials section
- [ ] Optimize images (WebP/AVIF)
- [ ] Add more blog filters (tags, search)

### Medium-term
- [ ] Analytics integration (Vercel Analytics)
- [ ] SEO improvements (structured data, meta tags)
- [ ] Performance optimization (Lighthouse 95+)
- [ ] Add resume download feature
- [ ] Implement page transitions

### Long-term
- [ ] CMS integration (Sanity/Contentful) para projects
- [ ] Newsletter subscription
- [ ] Comments system en blog
- [ ] Multi-region deployment (Vercel Edge)
- [ ] A/B testing framework

---

## 📞 Mantener Contexto entre Sesiones

### Información Crítica para Recordar

1. **Git Remote**: `origin-ssh` (no `origin`)
2. **Node Version**: 24.x requerido
3. **TimeZone**: Configurado en DOS lugares (i18n.ts + Providers.tsx)
4. **Tailwind 4**: Usar `bg-linear-to-*`, no `bg-gradient-to-*`
5. **Lucide Icons**: Github/Linkedin no existen, usar custom SVG
6. **Dev Server**: Puerto 3000 (o 3001 si conflict)
7. **Palette**: Forest Code (emerald/violet/amber)
8. **Dev.to Username**: jgomezdev

### Documentos a Revisar al Retomar

1. **SETUP.md** - Configuración inicial
2. **AGENTS.md** - Guías de código
3. **CHANGELOG.md** - Últimos cambios
4. **README.md** - Overview general
5. **Este documento (DEVELOPMENT.md)** - Contexto completo

### Comandos Más Usados

```bash
# Desarrollo
pnpm run dev
pnpm run dev -- -p 3001  # Puerto alternativo

# Build & Test
pnpm run build
pnpm run start
pnpm run lint

# Git
git status
git add .
git commit -m "mensaje"
git push origin-ssh feature/ai-v2

# Limpiar y reiniciar
pnpm run clean
pnpm install
```

---

## 🎓 Knowledge Base

### Custom Components Importantes

1. **HeroSection.tsx**
   - TypeAnimation con roles infinitos
   - Custom GitHub/LinkedIn SVG icons
   - Social links con hover animations

2. **AboutSection.tsx**
   - Stats estratégicas
   - Skills cloud con 22 tecnologías
   - Gradient text sin clipping

3. **ProjectCard.tsx**
   - Flexbox layout para consistent button position
   - Hover effects con Framer Motion
   - Responsive card design

4. **404 Pages**
   - Root: `/not-found.tsx` (fallback)
   - Locale: `/[locale]/not-found.tsx` (i18n)
   - Tech theme con animations

### Patterns Usados

1. **Server Components por Defecto**
   ```tsx
   // Server Component (default)
   export default async function Page() {
     const data = await fetchData();
     return <div>{data}</div>;
   }
   ```

2. **Client Components Solo Cuando Necesario**
   ```tsx
   'use client';
   import {useState} from 'react';
   
   export default function Interactive() {
     const [state, setState] = useState();
     return <button onClick={() => setState(...)}>Click</button>;
   }
   ```

3. **i18n en Server Components**
   ```tsx
   import {getTranslations} from 'next-intl/server';
   
   export default async function Page() {
     const t = await getTranslations('namespace');
     return <h1>{t('title')}</h1>;
   }
   ```

4. **i18n en Client Components**
   ```tsx
   'use client';
   import {useTranslations} from 'next-intl';
   
   export default function Component() {
     const t = useTranslations('namespace');
     return <h1>{t('title')}</h1>;
   }
   ```

---

**Este documento debe actualizarse con cada decisión importante del proyecto.**

**Última actualización**: 2026-05-30
**Autor**: Juan Gomez (@juxn89)
**Version**: 2.0.0
