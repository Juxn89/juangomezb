# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-05-26

### Added

#### Hero Section
- ✨ Profile photo with responsive sizing (w-48 h-48 on mobile, w-64 h-64 on desktop)
- ✨ Typewriter animation effect cycling through 5 professional roles infinitely
  - Software Engineer
  - Backend Developer
  - Frontend Developer
  - Full Stack Developer
  - AI Developer
- ✨ Social links section with hover animations (GitHub, LinkedIn, Email)
- ✨ Custom SVG icons for GitHub and LinkedIn (lucide-react doesn't export these)

#### About Section
- ✨ Strategic stats redesign for better recruiter appeal:
  - 15+ Years Experience
  - 500K+ Users Impacted
  - Architect Professional Role
  - Scalable Core Principle
- ✨ Optimized skills list (22 modern, relevant technologies):
  - Added: Kubernetes, GraphQL, xUnit, Cypress, NoSQL
  - Removed: Python (no experience), redundant/legacy skills
- ✨ Corrected skill icon semantics:
  - .NET: Database → Code icon
  - Node.js: Database → Code icon
  - Docker: Cloud → Package icon
  - Kubernetes: Cloud → Network icon

#### Blog Section
- ✨ Complete Dev.to integration via public API
- ✨ ISR caching with 1-hour revalidation
- ✨ BlogCard component with article metadata
- ✨ Blog navigation link in Header
- ✨ Automatic article fetching for username "jgomezdev"

#### 404 Page
- ✨ Creative animated error page with tech theme
- ✨ Floating particles animation (20 particles)
- ✨ Pulsing gradient orbs
- ✨ Animated tech icons (Terminal, Code, Server, Database, Cpu)
- ✨ Smart navigation (checks history before router.back())
- ✨ i18n support (English and Spanish versions)
- ✨ Tech-themed error messages

#### Design System
- ✨ Forest Code color palette:
  - Primary: Emerald Green (#047857 light / #10B981 dark)
  - Secondary: Violet (#7C3AED light / #A78BFA dark)
  - Tertiary: Amber (#FBBF24 light / #FCD34D dark)
- ✨ Updated favicon with Forest Code gradient
- ✨ Gradient text effects across all section titles
- ✨ Consistent visual hierarchy (H2 with gradient, H3 solid color)

#### Configuration
- ✨ Node.js 24.x requirement in package.json engines field
- ✨ `.nvmrc` file for local development consistency
- ✨ Comprehensive README.md with full project documentation

### Changed

#### Hero Section
- 🔄 Layout restructured: photo left, info right (column layout)
- 🔄 Removed CTA buttons (cleaner, more professional)
- 🔄 Enhanced hover effects on social links

#### About Section
- 🔄 Stats replaced: municipalities/companies → strategic mix
- 🔄 Skills reduced from 27 to 22 (removed redundant entries)
- 🔄 Skills reordered by expertise level and relevance

#### Experience Section
- 🔄 Added gradient-text to H2 title for consistency

#### Internationalization
- 🔄 Added roles array to translations (en.json, es.json)
- 🔄 Updated stats translation keys for new strategic mix
- 🔄 Added 404 page translations (notFound.title, subtitle, description)

#### Configuration
- 🔄 TimeZone set to "America/Managua" in both i18n.ts and Providers.tsx
- 🔄 Updated from Node.js 18.x to 24.x for Vercel compatibility

### Fixed

- 🐛 Gradient text clipping on descenders (j, g, p, q, y) - added `pb-1` and `leading-tight`
- 🐛 lucide-react missing GitHub/LinkedIn icons - created custom SVG components
- 🐛 next-intl ENVIRONMENT_FALLBACK warning - added timeZone configuration
- 🐛 BlogCard.tsx file corruption during refactor - recreated from scratch
- 🐛 404 page missing CSS - created root layout.tsx with globals.css import
- 🐛 TypeScript errors with framer-motion ease arrays - added `as const` assertion
- 🐛 Vercel deployment Node.js version error - updated to 24.x

### Dependencies

#### Added
- react-type-animation ^3.2.0 (typewriter effect in Hero)

#### Updated
- next: 16.2.6 (App Router with breaking changes)
- react: 19.2.4 (Server Components)
- next-intl: ^4.12.0 (improved i18n support)
- framer-motion: ^12.40.0 (animation system)
- lucide-react: ^1.16.0 (icon library)
- @vercel/analytics: ^2.0.1 (privacy-focused analytics)
- tailwindcss: ^4 (modern CSS framework)

### Removed

#### About Section Skills
- ❌ Python (no professional experience)
- ❌ Redux (replaced by modern state solutions)
- ❌ Vue.js (focusing on React ecosystem)
- ❌ Jenkins (using modern CI/CD)
- ❌ Redundant duplicate entries

### Security

- 🔒 Rate limiting middleware (100 req/15min per IP)
- 🔒 Security headers (X-Frame-Options, CSP, X-Content-Type-Options)
- 🔒 Bot detection in middleware
- 🔒 CSRF protection via Next.js Server Actions

### Documentation

- 📖 Comprehensive README.md with:
  - Project overview with badges
  - Features section
  - Complete tech stack details
  - Project structure diagram
  - Getting started guide
  - Configuration instructions
  - Customization examples
  - Deployment guide
  - Scripts reference
  - Contributing guidelines

---

## [1.0.0] - 2024-12-15

### Added
- 🎉 Initial release of portfolio website
- ✨ Next.js 14 with App Router
- ✨ TypeScript strict mode
- ✨ Tailwind CSS styling
- ✨ next-intl internationalization (en, es)
- ✨ Dark/Light theme toggle
- ✨ Responsive design (mobile-first)
- ✨ Contact form with validation
- ✨ Project showcase section
- ✨ Experience timeline
- ✨ SEO optimization (sitemap, robots.txt, metadata)
- ✨ Vercel Analytics integration

---

## Development Guidelines

### Commit Message Convention
This project follows [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, missing semi-colons, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Version Numbering
- **Major (X.0.0)**: Breaking changes, major redesigns
- **Minor (x.X.0)**: New features, non-breaking changes
- **Patch (x.x.X)**: Bug fixes, minor improvements

---

## Links

- **Repository**: [GitHub](https://github.com/juxn89/juangomezb)
- **Live Site**: [juangomezb.com](https://juangomezb.com)
- **Author**: Juan Carlos Gomez Baca
- **License**: MIT
