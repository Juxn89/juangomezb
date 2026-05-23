<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16.2+ Portfolio - AI Agent Guidelines

⚠️ **CRITICAL**: This project uses **Next.js 16.2.6** with breaking changes from previous versions.
Always check `node_modules/next/dist/docs/` for current APIs before coding.

## Project Overview
Senior Software Engineer portfolio built with modern, scalable, and production-ready architecture.

---

## 🎯 Core Principles

### Code Quality Standards
- ✅ Write **modern, non-legacy** code (ES2024+, TypeScript 5+)
- ✅ **Scalable & maintainable** architecture (SOLID principles, clean code)
- ✅ **Performance-first** mindset (Core Web Vitals, lighthouse scores 90+)
- ✅ **Type-safe** everything (strict TypeScript, no `any` unless absolutely necessary)
- ✅ **Mobile-first** responsive design (320px → 4K)
- ✅ **Accessible** (WCAG 2.1 AA minimum)

### Security & Protection
- 🛡️ **Bot & crawler protection** (rate limiting, fingerprinting, CAPTCHA when needed)
- 🛡️ **DDoS mitigation** (Vercel Edge middleware, Cloudflare integration)
- 🛡️ **XSS prevention** (Content Security Policy, sanitization)
- 🛡️ **CSRF tokens** for forms and API routes
- 🛡️ Secure headers (`X-Frame-Options`, `X-Content-Type-Options`, etc.)

---

## 📐 Architecture Guidelines

### File Structure (Next.js 16.2 App Router)
```
/app
  /[locale]                # i18n routing (en, es)
    /layout.tsx            # Root layout with providers
    /page.tsx              # Home page
    /about
      /page.tsx
    /projects
      /page.tsx
      /[slug]
        /page.tsx          # Dynamic project detail
    /blog
      /page.tsx
      /[slug]
        /page.tsx          # Dynamic blog post
    /contact
      /page.tsx
  /api
    /contact              # Contact form API (if not using Server Actions)
  /sitemap.ts             # Dynamic sitemap generation
  /robots.ts              # Dynamic robots.txt
  /not-found.tsx          # Custom 404 page
  /error.tsx              # Custom error page
  /global-error.tsx       # Global error boundary

/components
  /ui                     # Custom reusable UI components
    /Button.tsx
    /Card.tsx
    /Input.tsx
    /ThemeToggle.tsx
    /LocaleSwitcher.tsx
  /features               # Feature-specific components
    /Hero.tsx
    /ProjectCard.tsx
    /BlogPostCard.tsx
  /layouts                # Layout components
    /Header.tsx
    /Footer.tsx
    /Navigation.tsx

/lib
  /context               # React Context providers
    /theme-context.tsx
    /locale-context.tsx (if needed beyond next-intl)
  /hooks                 # Custom React hooks
    /useTheme.ts
    /useMediaQuery.ts
    /useScrollPosition.ts
  /utils                 # Utility functions
    /cn.ts              # className utility (clsx + tailwind-merge)
    /date.ts            # Date formatting with date-fns
    /seo.ts             # SEO utilities
  /constants             # Constants and configs
    /navigation.ts
    /seo-config.ts
  /security              # Security utilities
    /rate-limiter.ts
    /sanitize.ts
  /mdx                   # MDX processing (for blog/projects)
    /mdx-components.tsx
    /get-posts.ts

/messages                # i18n translations
  /en.json
  /es.json

/content                 # Local MDX content
  /projects
    /project-1.mdx
  /blog
    /post-1.mdx

/public
  /images
  /fonts
  /favicon.ico
  /robots.txt (fallback)

/styles
  /globals.css           # Global styles + Tailwind directives

/types                   # TypeScript definitions
  /index.ts
  /models.ts
  /api.ts

/tests
  /e2e                   # Playwright E2E tests
    /home.spec.ts
    /i18n.spec.ts
  /fixtures
  /helpers

/middleware.ts           # Edge middleware (security, rate limiting)
/i18n.ts                 # next-intl configuration
/next.config.ts          # Next.js configuration
/tailwind.config.ts      # Tailwind CSS configuration
/tsconfig.json           # TypeScript configuration
/playwright.config.ts    # Playwright configuration
/.env.local              # Local environment variables (git-ignored)
```

### Tech Stack
- **Framework**: Next.js 16.2.6 (App Router, RSC)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4 (JIT, CSS-in-JS) + Custom Components
- **React**: React 19.2.4 (Server Components, Suspense)
- **State Management**: React Context API (Zustand if complexity grows)
- **i18n**: next-intl (best for App Router + RSC)
- **Animations**: Tailwind CSS (primary) + Framer Motion (complex cases)
- **Testing**: Playwright (superior E2E, better parallelization)
- **Analytics**: Vercel Analytics (free tier, privacy-focused)
- **Content**: Local MDX files
- **Runtime**: Node 20+

---

## 🗂️ State Management Strategy

### Context API (Primary)
**Use for:**
- Theme state (dark/light mode)
- User preferences (locale, accessibility settings)
- Global UI state (mobile menu open/close)

**Pattern:**
```typescript
// /lib/context/app-context.tsx
'use client';

import {createContext, useContext, useState, ReactNode} from 'react';

type AppState = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({children}: {children: ReactNode}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <AppContext.Provider value={{mobileMenuOpen, setMobileMenuOpen}}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
```

### When to Consider Zustand
If complexity grows (unlikely for portfolio), use Zustand for:
- Complex form wizards
- Advanced filtering/search state
- Real-time features (if added later)

```typescript
// /lib/store/use-store.ts (example if needed)
import {create} from 'zustand';

type Store = {
  count: number;
  increment: () => void;
};

export const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({count: state.count + 1})),
}));
```

---

## 📝 Content Management (Local MDX)

### Why Local MDX?
- ✅ No external dependencies
- ✅ Type-safe content
- ✅ Git-based version control
- ✅ Fast builds (no API calls)
- ✅ Full control over rendering

### MDX Setup
```bash
npm install next-mdx-remote gray-matter
```

### Content Structure
```markdown
<!-- /content/projects/ecommerce-platform.mdx -->
---
title: "E-Commerce Platform"
description: "Full-stack e-commerce solution with Next.js and Stripe"
date: "2024-01-15"
tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"]
image: "/images/projects/ecommerce.jpg"
featured: true
---

# E-Commerce Platform

This project demonstrates...

## Technologies Used
- Next.js 14
- TypeScript
- Stripe Payments
```

### Reading MDX Content
```typescript
// /lib/mdx/get-posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export async function getPostBySlug(slug: string, folder: 'blog' | 'projects') {
  const fullPath = path.join(contentDirectory, folder, `${slug}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const {data, content} = matter(fileContents);

  return {
    metadata: data,
    content,
    slug,
  };
}

export async function getAllPosts(folder: 'blog' | 'projects') {
  const folderPath = path.join(contentDirectory, folder);
  const files = fs.readdirSync(folderPath);

  const posts = files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, '');
      const fullPath = path.join(folderPath, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const {data} = matter(fileContents);

      return {
        slug,
        metadata: data,
      };
    })
    .sort((a, b) => {
      return new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime();
    });

  return posts;
}
```

### Rendering MDX
```typescript
// /app/[locale]/blog/[slug]/page.tsx
import {MDXRemote} from 'next-mdx-remote/rsc';
import {getPostBySlug} from '@/lib/mdx/get-posts';

export default async function BlogPost({params}: {params: {slug: string}}) {
  const {metadata, content} = await getPostBySlug(params.slug, 'blog');

  return (
    <article>
      <h1>{metadata.title}</h1>
      <time>{metadata.date}</time>
      <MDXRemote source={content} />
    </article>
  );
}
```

---

## 🌍 Internationalization (i18n)

### Languages Support
- 🇺🇸 English (default: `en`)
- 🇪🇸 Spanish (`es`)

### Implementation: next-intl
**Why next-intl?**
- ✅ Best integration with App Router & Server Components
- ✅ Type-safe translations with TypeScript
- ✅ Automatic locale detection and routing
- ✅ Server-side translation (better performance)
- ✅ Built-in SEO support (hreflang, sitemap)

### Route Structure
```
/app
  /[locale]
    /layout.tsx
    /page.tsx
    /about/page.tsx
    /projects/page.tsx
```

### Configuration Files
```
// /i18n.ts (root config)
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => ({
  messages: (await import(`./messages/${locale}.json`)).default
}));

// /messages/en.json
{
  "nav": {
    "home": "Home",
    "about": "About",
    "projects": "Projects"
  }
}

// /messages/es.json
{
  "nav": {
    "home": "Inicio",
    "about": "Acerca de",
    "projects": "Proyectos"
  }
}
```

### Usage in Components
```tsx
// Server Component
import {useTranslations} from 'next-intl';

export default function Page() {
  const t = useTranslations('nav');
  return <h1>{t('home')}</h1>;
}

// Client Component
'use client';
import {useTranslations} from 'next-intl';

export default function ClientButton() {
  const t = useTranslations('nav');
  return <button>{t('home')}</button>;
}
```

### SEO: Generate `<link rel="alternate" hreflang="..." />` tags
- Handled automatically by next-intl + metadata API
- Configure in root layout

### Locale Detection Priority
1. **URL path** (`/en/about`, `/es/about`)
2. **Cookie** (`NEXT_LOCALE`)
3. **Accept-Language header** (browser preference)
4. **Default** (`en`)

---

## 🎨 UI/UX Design Principles

### Visual Design
- ❌ **NO generic templates** (avoid cookie-cutter designs)
- ✅ **Modern, creative, memorable** aesthetic
- ✅ **Purposeful animations** (not overdone, performance-aware)
- ✅ **Dark mode + Light mode** (system preference detection)
- ✅ **Custom color palettes** (brand identity)
- ✅ **Micro-interactions** (hover states, transitions, feedback)

### Component Strategy
- **100% Custom Components** (no UI libraries like shadcn, Radix)
- Build reusable primitives (Button, Card, Input, etc.)
- Use composition pattern for flexibility
- Type-safe props with TypeScript
- Accessibility built-in (ARIA labels, keyboard navigation)

### Animation Guidelines
**Primary: Tailwind CSS Transitions**
```tsx
// Simple hover, focus, active states
<button className="transition-all duration-200 hover:scale-105 active:scale-95">
  Click me
</button>

// Entry animations
<div className="animate-fade-in opacity-0">Content</div>
```

**Secondary: Framer Motion (complex animations only)**
- Page transitions
- Staggered list animations
- Gesture-based interactions (drag, swipe)
- Parallax effects
- SVG path animations

```tsx
'use client';
import {motion} from 'framer-motion';

<motion.div
  initial={{opacity: 0, y: 20}}
  animate={{opacity: 1, y: 0}}
  transition={{duration: 0.5}}
>
  Complex animation
</motion.div>
```

**Performance Rules:**
- Respect `prefers-reduced-motion` media query
- Keep animations under 300ms (perceived instantaneity)
- Use `will-change` sparingly (GPU optimization)
- Avoid animating `width`, `height` (use `transform` instead)
- Use `transform` and `opacity` for 60fps animations

### Dark Mode Implementation
**Strategy: CSS Variables + Context API**

```tsx
// /lib/context/theme-context.tsx
'use client';
import {createContext, useContext, useEffect, useState} from 'react';

type Theme = 'light' | 'dark' | 'system';

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
}>({
  theme: 'system',
  setTheme: () => {},
});

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```

**CSS Variables (globals.css):**
```css
:root {
  --color-bg-primary: 255 255 255;
  --color-text-primary: 0 0 0;
}

.dark {
  --color-bg-primary: 0 0 0;
  --color-text-primary: 255 255 255;
}
```

**Persist preference:**
- Store in `localStorage` (client-side)
- Set cookie (SSR support)
- Prevent FOUC (Flash of Unstyled Content) with inline script

---

## ⚡ Performance Optimization

### Image Optimization
- Use `next/image` with proper sizing
- WebP/AVIF formats with fallbacks
- Lazy loading below the fold
- Blur placeholders (LQIP)

### Code Splitting
- Dynamic imports for heavy components
- Route-based splitting (automatic with App Router)
- Conditional loading (client-only components)

### Caching Strategy
- Static pages: ISR (Incremental Static Regeneration)
- Dynamic content: Streaming SSR
- API routes: Edge caching with `Cache-Control`

### Metrics to Monitor
- **LCP** (Largest Contentful Paint) < 2.5s
- **FID** (First Input Delay) < 100ms
- **CLS** (Cumulative Layout Shift) < 0.1
- **TTI** (Time to Interactive) < 3.5s

---

## 🔍 SEO Best Practices

### Meta Tags (Every Page)
```
export const metadata: Metadata = {
  title: 'Page Title | Juan Gomez - Senior Software Engineer',
  description: 'Compelling 150-160 character description',
  openGraph: { /* OG tags */ },
  twitter: { /* Twitter Card */ },
  alternates: {
    canonical: 'https://juangomezb.com/page',
    languages: {
      'en': 'https://juangomezb.com/en/page',
      'es': 'https://juangomezb.com/es/page',
    },
  },
};
```

### Required Files
1. **`/app/sitemap.ts`** (Dynamic XML sitemap)
   - Multi-language support
   - Priority and changefreq
   - Last modified dates

2. **`/app/robots.ts`** (Dynamic robots.txt)
   - Allow/disallow rules
   - Sitemap reference
   - Crawler directives

3. **Structured Data** (JSON-LD)
   - Person schema
   - WebSite schema
   - BreadcrumbList
   - Article (for blog posts)

---

## 🛡️ Security Implementation

### Next.js 16.2 Proxy Configuration (Modern Approach)
**Note:** Middleware is NOT deprecated. Next.js 16.2 uses Edge Middleware + Proxy patterns.

```typescript
// /middleware.ts (Edge Runtime)
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {createRateLimiter} from './lib/security/rate-limiter';

const rateLimiter = createRateLimiter();

export async function middleware(request: NextRequest) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || '';

  // 1. Rate Limiting
  const rateLimitResult = await rateLimiter.check(ip);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      {error: 'Too many requests'},
      {status: 429, headers: {'Retry-After': '900'}}
    );
  }

  // 2. Bot Detection (basic)
  const suspiciousBots = ['curl', 'wget', 'python-requests', 'scrapy'];
  if (suspiciousBots.some(bot => userAgent.toLowerCase().includes(bot))) {
    return NextResponse.json({error: 'Forbidden'}, {status: 403});
  }

  // 3. Security Headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https://vitals.vercel-insights.com; frame-ancestors 'none';"
  );

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Rate Limiting Implementation (In-Memory)
```typescript
// /lib/security/rate-limiter.ts
type RateLimitStore = Map<string, {count: number; resetTime: number}>;

const store: RateLimitStore = new Map();

export function createRateLimiter(options = {
  maxRequests: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
}) {
  return {
    async check(identifier: string) {
      const now = Date.now();
      const record = store.get(identifier);

      if (!record || now > record.resetTime) {
        store.set(identifier, {
          count: 1,
          resetTime: now + options.windowMs,
        });
        return {success: true, remaining: options.maxRequests - 1};
      }

      if (record.count >= options.maxRequests) {
        return {success: false, remaining: 0};
      }

      record.count++;
      store.set(identifier, record);
      return {success: true, remaining: options.maxRequests - record.count};
    },
  };
}

// Cleanup old entries (optional)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (now > value.resetTime) {
      store.delete(key);
    }
  }
}, 60000); // Every minute
```

### Rate Limiting Strategy
- **General Pages**: 100 requests / 15min per IP
- **API Routes**: 20 requests / min per IP
- **Contact Form**: 3 submissions / hour per IP
- **For production**: Consider Upstash Redis or Vercel KV for distributed rate limiting

### CSRF Protection (Server Actions)
```typescript
// Next.js 16.2 Server Actions have built-in CSRF protection
// No additional library needed for form submissions
'use server';

export async function submitContactForm(formData: FormData) {
  // CSRF token automatically validated by Next.js
  const name = formData.get('name');
  // Process form...
}
```

---

## 📝 TypeScript Best Practices

### Strict Configuration
```
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Type Patterns
- Prefer `type` over `interface` for unions/intersections
- Use `as const` for literal types
- Avoid type assertions (`as`) unless necessary
- Create discriminated unions for complex states
- Use generics for reusable components

---

## 🧪 Testing Strategy

### E2E Testing with Playwright
**Why Playwright over Cypress?**
- ✅ Better performance (true parallelization)
- ✅ Multiple browser support out of the box (Chromium, Firefox, WebKit)
- ✅ Built-in test isolation
- ✅ Auto-wait mechanisms (fewer flaky tests)
- ✅ Better debugging with trace viewer
- ✅ Faster execution (headless mode optimized)

### Setup
```bash
npm init playwright@latest
```

### Test Structure
```
/tests
  /e2e
    /home.spec.ts
    /navigation.spec.ts
    /contact-form.spec.ts
    /i18n.spec.ts
    /theme-toggle.spec.ts
  /fixtures
    /test-data.ts
  /helpers
    /page-objects.ts
```

### Example Test
```typescript
// /tests/e2e/home.spec.ts
import {test, expect} from '@playwright/test';

test.describe('Home Page', () => {
  test('should load and display hero section', async ({page}) => {
    await page.goto('/');

    await expect(page.getByRole('heading', {level: 1})).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('should toggle dark mode', async ({page}) => {
    await page.goto('/');

    const themeToggle = page.getByRole('button', {name: /theme/i});
    await themeToggle.click();

    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('should navigate to projects page', async ({page}) => {
    await page.goto('/');

    await page.getByRole('link', {name: /projects/i}).click();
    await expect(page).toHaveURL(/.*projects/);
  });
});
```

### i18n Testing
```typescript
// /tests/e2e/i18n.spec.ts
import {test, expect} from '@playwright/test';

test.describe('Internationalization', () => {
  test('should display content in English by default', async ({page}) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/en/);
  });

  test('should switch to Spanish', async ({page}) => {
    await page.goto('/en');

    const langSwitcher = page.getByRole('button', {name: /language/i});
    await langSwitcher.click();
    await page.getByRole('menuitem', {name: /español/i}).click();

    await expect(page).toHaveURL(/\/es/);
  });

  test('should maintain locale across navigation', async ({page}) => {
    await page.goto('/es');
    await page.getByRole('link', {name: /proyectos/i}).click();
    await expect(page).toHaveURL(/\/es\/projects/);
  });
});
```

### Configuration
```typescript
// playwright.config.ts
import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {...devices['Desktop Chrome']},
    },
    {
      name: 'Mobile Chrome',
      use: {...devices['Pixel 5']},
    },
    {
      name: 'Mobile Safari',
      use: {...devices['iPhone 12']},
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Running Tests
```bash
# Run all tests
npx playwright test

# Run in UI mode (visual debugging)
npx playwright test --ui

# Run specific test file
npx playwright test home.spec.ts

# Run with trace (debugging)
npx playwright test --trace on

# Generate test report
npx playwright show-report
```

### Pre-commit Hooks
- ESLint (Next.js config + custom rules)
- TypeScript compilation check
- Playwright tests (optional: smoke tests only)
- No console.log in production

### Naming Conventions
- **Components**: PascalCase (`Button.tsx`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Types**: PascalCase (`UserProfile`)
- **Hooks**: camelCase with `use` prefix (`useTheme`)

---

## 🚀 Deployment Checklist

### Before Production
- [ ] All Lighthouse scores > 90
- [ ] Sitemap & robots.txt working
- [ ] All meta tags present
- [ ] i18n routing tested (both languages)
- [ ] Dark/Light mode functional
- [ ] Rate limiting active
- [ ] Security headers validated
- [ ] Error pages (404, 500) styled
- [ ] Vercel Analytics integrated
- [ ] All Playwright tests passing
- [ ] Mobile-first responsive design verified
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Core Web Vitals optimized
- [ ] No console.log in production build

### Analytics Integration (Vercel Analytics - Free)
```typescript
// /app/[locale]/layout.tsx
import {Analytics} from '@vercel/analytics/react';

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

**Features:**
- ✅ Privacy-focused (GDPR compliant, no cookies)
- ✅ Core Web Vitals tracking
- ✅ Page views & unique visitors
- ✅ Real user monitoring (RUM)
- ✅ Zero configuration
- ✅ **Completely free** on Vercel

### Environment Variables
```bash
# .env.local (never commit)
NEXT_PUBLIC_SITE_URL=https://juangomezb.com

# Optional (for production scaling)
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

### Vercel Deployment Settings
```json
// vercel.json (optional optimization)
{
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## 📚 Resources & Documentation

### Next.js 16.2 Specific
- Check `node_modules/next/dist/docs/` for breaking changes
- Use `use client` directive only when necessary
- Server Components by default (faster, better SEO)
- Use Server Actions for forms (no API routes needed)

### Project Dependencies
```json
// package.json additions
{
  "dependencies": {
    "next": "16.2.6",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "next-intl": "^3.x",
    "framer-motion": "^11.x",
    "next-mdx-remote": "^5.x",
    "zod": "^3.x",
    "date-fns": "^3.x",
    "lucide-react": "^0.x"
  },
  "devDependencies": {
    "@playwright/test": "^1.x",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "typescript": "^5",
    "tailwindcss": "^4",
    "@tailwindcss/postcss": "^4",
    "eslint": "^9",
    "eslint-config-next": "16.2.6",
    "@vercel/analytics": "^1.x"
  }
}
```

### Recommended Usage
- **next-intl**: Internationalization (type-safe, RSC-compatible)
- **Framer Motion**: Complex animations only
- **next-mdx-remote**: For blog posts / project descriptions
- **Zod**: Form validation + type inference
- **date-fns**: Date formatting (lighter than moment.js)
- **lucide-react**: Icons (tree-shakeable, customizable)
- **@vercel/analytics**: Free, privacy-focused analytics
- **@playwright/test**: E2E testing (better than Cypress for modern apps)

---

## 🎯 Additional Best Practices

### Utility Functions

**className Utility (cn.ts)**
```typescript
// /lib/utils/cn.ts
import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
<button className={cn('base-class', condition && 'conditional-class')}>
```

### Performance Patterns

**Image Component Wrapper**
```typescript
// /components/ui/OptimizedImage.tsx
import Image from 'next/image';
import {cn} from '@/lib/utils/cn';

type Props = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

export function OptimizedImage({src, alt, className, priority = false}: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn('object-cover', className)}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}
```

**Dynamic Component Loading**
```typescript
// Load heavy components only when needed
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/features/Chart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // Client-only component
});
```

### Accessibility Helpers

**Focus Management**
```typescript
// /lib/hooks/useFocusTrap.ts
import {useEffect, useRef} from 'react';

export function useFocusTrap<T extends HTMLElement>() {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const focusableElements = element.querySelectorAll<HTMLElement>(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }

    element.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return elementRef;
}
```

### Mobile-First Breakpoints (Tailwind Config)
```typescript
// tailwind.config.ts
export default {
  theme: {
    screens: {
      'sm': '640px',   // Mobile landscape
      'md': '768px',   // Tablet portrait
      'lg': '1024px',  // Tablet landscape / Small desktop
      'xl': '1280px',  // Desktop
      '2xl': '1536px', // Large desktop
    },
  },
};

// Usage (mobile-first)
<div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
```

### SEO Utilities
```typescript
// /lib/utils/seo.ts
import type {Metadata} from 'next';

export function generateSEOMetadata({
  title,
  description,
  path,
  locale,
  image = '/og-image.jpg',
}: {
  title: string;
  description: string;
  path: string;
  locale: 'en' | 'es';
  image?: string;
}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://juangomezb.com';
  const url = `${siteUrl}/${locale}${path}`;

  return {
    title: `${title} | Juan Gomez - Senior Software Engineer`,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Juan Gomez',
      images: [{url: `${siteUrl}${image}`}],
      locale: locale === 'en' ? 'en_US' : 'es_ES',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${siteUrl}${image}`],
    },
    alternates: {
      canonical: url,
      languages: {
        'en': `${siteUrl}/en${path}`,
        'es': `${siteUrl}/es${path}`,
      },
    },
  };
}
```

### Error Handling Pattern
```typescript
// /app/[locale]/error.tsx
'use client';

import {useEffect} from 'react';
import {useTranslations} from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  const t = useTranslations('error');

  useEffect(() => {
    console.error('Error caught:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">{t('title')}</h1>
      <p className="mt-4 text-lg">{t('message')}</p>
      <button
        onClick={reset}
        className="mt-8 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        {t('tryAgain')}
      </button>
    </div>
  );
}
```

---

## ⚠️ Common Pitfalls to Avoid

1. ❌ Don't use `'use client'` everywhere (kills performance)
2. ❌ Don't ignore `alt` tags on images (accessibility + SEO)
3. ❌ Don't use `any` type (defeats TypeScript purpose)
4. ❌ Don't skip error boundaries (crashes = bad UX)
5. ❌ Don't forget loading states (Suspense boundaries)
6. ❌ Don't hardcode text (breaks i18n)
7. ❌ Don't use `px` for font sizes (use `rem` for accessibility)
8. ❌ Don't forget ARIA labels for screen readers

---

## 🤖 AI Agent Instructions

When generating code for this project:
1. **Always use tabs for indentation** (EditorConfig: `indent_style = tab`)
2. **Check Next.js 16.2 docs** before suggesting deprecated APIs
3. **Prioritize Server Components** over Client Components (use `'use client'` only when necessary)
4. **Include TypeScript types** for all functions/components (no `any` types)
5. **Build custom components** (no shadcn/ui, no Radix - 100% custom)
6. **Use Tailwind CSS** for animations first, Framer Motion only for complex cases
7. **Follow mobile-first** approach (320px → 4K, use min-width media queries)
8. **Include loading/error states** for async operations (Suspense boundaries)
9. **Validate all user inputs** (never trust client data, use Zod schemas)
10. **Optimize images** with next/image automatically (WebP/AVIF, lazy loading)
11. **Use next-intl** for all text content (no hardcoded strings)
12. **Implement dark mode** with CSS variables + Context API
13. **Add security headers** in middleware (XSS, CSP, rate limiting)
14. **Write accessible code** (ARIA labels, keyboard navigation, semantic HTML)
15. **Include Playwright tests** for critical user flows
16. **Use MDX** for blog posts and project descriptions (local content)
17. **Integrate Vercel Analytics** (free, privacy-focused)
18. **Generate sitemaps** dynamically with multi-language support
19. **Add structured data** (JSON-LD) for SEO
20. **Test both locales** (en, es) before considering a feature complete

### Code Style Preferences
- **State Management**: Context API (Zustand only if absolutely needed)
- **Forms**: React Hook Form + Zod validation
- **Icons**: lucide-react (tree-shakeable)
- **Dates**: date-fns (not moment.js)
- **Animations**: `transition-all duration-200` (Tailwind) or Framer Motion
- **Naming**: PascalCase for components, camelCase for functions/hooks
- **Comments**: Only for complex logic, code should be self-documenting

---

## 🆘 When in Doubt

1. Read the latest Next.js 16.2 documentation
2. Check React 19 migration guide
3. Validate against Web.dev best practices
4. Test on mobile devices first
5. Run Lighthouse audit frequently
6. Ask clarifying questions before implementing

<!-- END:nextjs-agent-rules -->
