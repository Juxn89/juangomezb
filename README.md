# 🚀 Juan Gomez - Senior Software Engineer Portfolio

Modern, high-performance portfolio website built with Next.js 16, React 19, and TypeScript. Features a creative design with Forest Code color palette, multilingual support (English/Spanish), and full integration with Dev.to blog.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ Features

### 🎨 **Modern Design**
- **Forest Code Color Palette**: Emerald green, violet, and amber gradients
- **Responsive Design**: Mobile-first approach (320px → 4K)
- **Dark/Light Mode**: System preference detection with smooth transitions
- **Smooth Animations**: Framer Motion with performance optimization
- **Gradient Text Effects**: Custom gradients without clipping issues

### 🌍 **Internationalization (i18n)**
- **Languages**: English (en) & Spanish (es)
- **Library**: next-intl 4.12.0 for Server Components
- **Auto-detection**: Browser language, cookies, URL path
- **SEO-friendly**: `hreflang` tags and locale-specific sitemaps

### 📝 **Content Management**
- **Dev.to Integration**: Automatic blog post fetching via API
- **ISR Caching**: 1-hour revalidation for optimal performance
- **Local MDX Support**: Ready for custom content
- **Dynamic Metadata**: SEO optimized for each page

### 🛡️ **Security & Performance**
- **Rate Limiting**: In-memory limiter (production-ready)
- **Security Headers**: CSP, XSS protection, CSRF prevention
- **Edge Middleware**: Bot protection and DDoS mitigation
- **Core Web Vitals**: Optimized for 90+ Lighthouse scores

### 🎯 **Key Sections**
- **Hero**: Profile photo, typewriter animation (5 roles), social links
- **About**: Professional stats (15+ years, 500K+ users, Architect, Scalable)
- **Experience**: Timeline of professional journey
- **Projects**: Featured work with case studies
- **Blog**: Dev.to articles integration
- **Contact**: Secure contact form
- **404 Page**: Creative tech-themed animated error page

---

## 🛠️ Tech Stack

### **Core**
- **Framework**: [Next.js 16.2.6](https://nextjs.org/) (App Router, Turbopack)
- **React**: [React 19.2.4](https://reactjs.org/) (Server Components, Suspense)
- **Language**: [TypeScript 5+](https://www.typescriptlang.org/) (strict mode)
- **Runtime**: Node.js 20+

### **Styling**
- **CSS Framework**: [Tailwind CSS 4](https://tailwindcss.com/) (JIT mode, modern syntax)
- **Animations**: [Framer Motion 12.40.0](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/) (Terminal, Code, Server, Database, Cpu, etc.)
- **Fonts**: [Geist Sans & Geist Mono](https://vercel.com/font) (Google Fonts)

### **Internationalization**
- **i18n**: [next-intl 4.12.0](https://next-intl-docs.vercel.app/)
- **Timezone**: America/Managua
- **Locales**: en (default), es

### **Content & Data**
- **Blog**: [Dev.to Public API](https://dev.to/api) (username: jgomezdev)
- **MDX**: [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote) (ready for local content)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics) (privacy-focused)

### **Development Tools**
- **Package Manager**: pnpm (fast, efficient)
- **Linting**: ESLint with Next.js config
- **Testing**: Playwright (E2E, ready for CI/CD)
- **Git Remote**: origin-ssh (SSH authentication)

---

## 📂 Project Structure

```
juangomezb/
├── src/
│   ├── app/
│   │   ├── [locale]/           # Localized routes (en, es)
│   │   │   ├── layout.tsx      # Root layout with i18n
│   │   │   ├── page.tsx        # Home page (all sections)
│   │   │   └── not-found.tsx   # Localized 404 page
│   │   ├── layout.tsx          # Root layout (non-locale routes)
│   │   ├── not-found.tsx       # Root 404 page
│   │   ├── globals.css         # Global styles + Forest Code palette
│   │   ├── sitemap.ts          # Dynamic sitemap generation
│   │   └── robots.ts           # Dynamic robots.txt
│   ├── components/
│   │   ├── layouts/
│   │   │   ├── Header.tsx      # Navigation with locale switcher
│   │   │   └── Footer.tsx      # Footer with social links
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx         # Landing with typewriter
│   │   │   ├── AboutSection.tsx        # Stats, skills, expertise
│   │   │   ├── ExperienceSection.tsx   # Career timeline
│   │   │   ├── ProjectsSection.tsx     # Featured projects
│   │   │   ├── BlogSection.tsx         # Dev.to integration
│   │   │   ├── BlogCard.tsx            # Blog post card
│   │   │   └── ContactSection.tsx      # Contact form
│   │   ├── providers/
│   │   │   └── Providers.tsx   # Theme, i18n providers
│   │   └── ui/                 # Reusable UI components
│   ├── lib/
│   │   ├── api/
│   │   │   └── devto.ts        # Dev.to API client
│   │   ├── utils/
│   │   │   ├── cn.ts           # className utility (clsx + twMerge)
│   │   │   └── seo.ts          # SEO metadata generation
│   │   └── security/
│   │       └── rate-limiter.ts # In-memory rate limiting
│   └── types/                  # TypeScript definitions
├── messages/
│   ├── en.json                 # English translations
│   └── es.json                 # Spanish translations
├── public/
│   ├── images/
│   │   └── profile_photo.png   # Hero profile photo
│   ├── resume/
│   │   ├── juan-gomez-cv-en.pdf
│   │   └── juan-gomez-cv-es.pdf
│   └── favicon.svg             # Forest Code gradient favicon
├── middleware.ts               # Edge middleware (security, rate limiting)
├── i18n.ts                     # next-intl configuration
├── routing.ts                  # Locale routing config
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 20+ ([Download](https://nodejs.org/))
- pnpm 8+ ([Installation](https://pnpm.io/installation))

### **Installation**

```bash
# Clone the repository
git clone git@github.com:Juxn89/juangomezb.git
cd juangomezb

# Install dependencies
pnpm install
```

### **Development Server**

```bash
# Start dev server (localhost:3000)
pnpm dev

# Start dev server with Turbopack (faster)
pnpm dev --turbo
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### **Build for Production**

```bash
# Create optimized production build
pnpm build

# Preview production build locally
pnpm start
```

### **Testing**

```bash
# Run Playwright E2E tests
pnpm test

# Run tests in UI mode (visual debugging)
pnpm test:ui

# Run tests in headed mode (browser visible)
pnpm test:headed
```

---

## ⚙️ Configuration

### **Environment Variables**

Create a `.env.local` file in the root directory:

```bash
# Public
NEXT_PUBLIC_SITE_URL=https://juangomezb.com

# Optional (for production scaling)
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### **Locales**

Configure locales in `i18n.ts`:

```typescript
export default getRequestConfig(async ({locale}) => ({
  messages: (await import(`./messages/${locale}.json`)).default,
  timeZone: 'America/Managua',
}));
```

### **Dev.to Username**

Update username in `src/lib/api/devto.ts`:

```typescript
const DEVTO_USERNAME = 'jgomezdev'; // Change to your username
```

---

## 🎨 Customization

### **Color Palette (Forest Code)**

Edit `src/app/globals.css`:

```css
:root {
  --color-accent-primary: 4 120 87;     /* Emerald green */
  --color-accent-secondary: 124 58 237; /* Violet */
  --color-accent-tertiary: 251 191 36;  /* Amber */
}

.dark {
  --color-accent-primary: 16 185 129;   /* Bright green */
  --color-accent-secondary: 167 139 250;/* Soft violet */
  --color-accent-tertiary: 252 211 77;  /* Golden yellow */
}
```

### **Skills List**

Edit `src/components/sections/AboutSection.tsx`:

```typescript
const skills = [
  {name: '.NET', category: 'backend', icon: Code},
  {name: 'React', category: 'frontend', icon: Code},
  // Add your skills...
];
```

### **Stats Cards**

Edit `src/components/sections/AboutSection.tsx`:

```typescript
const stats = [
  {label: t('stats.experience'), value: '15+'},
  {label: t('stats.users'), value: '500K+'},
  // Customize your stats...
];
```

---

## 🌐 Deployment

### **Vercel (Recommended)**

1. Push to GitHub:
   ```bash
   git push origin-ssh main
   ```

2. Import project in [Vercel Dashboard](https://vercel.com/new)

3. Configure:
   - Framework: Next.js
   - Root Directory: `./`
   - Build Command: `pnpm build`
   - Output Directory: `.next`

4. Add environment variables in Vercel dashboard

5. Deploy! 🎉

### **Manual Deploy**

```bash
# Build
pnpm build

# Deploy .next folder to your hosting provider
```

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run Playwright tests |
| `pnpm test:ui` | Run tests in UI mode |

---

## 🤝 Contributing

This is a personal portfolio project, but suggestions and bug reports are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Juan Gomez**
- Portfolio: [juangomezb.com](https://juangomezb.com)
- GitHub: [@Juxn89](https://github.com/Juxn89)
- LinkedIn: [jcgomez89](https://www.linkedin.com/in/jcgomez89/)
- Email: gb.jc@outlook.com
- Dev.to: [@jgomezdev](https://dev.to/jgomezdev)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization
- [Dev.to](https://dev.to/) - Blogging platform API
- [Lucide](https://lucide.dev/) - Icon library

---

**Built with ❤️ using Next.js 16 and React 19**
