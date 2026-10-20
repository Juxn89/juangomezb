<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/readme/hero-dark.svg">
  <img src="docs/readme/hero-light.svg" alt="Juan Gómez — Senior Software Engineer. Scalable .NET systems, cloud architecture and AI that ships." width="100%">
</picture>

<br><br>

<a href="https://www.juangomezb.com"><img src="https://img.shields.io/badge/Visit-juangomezb.com-047857?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Visit juangomezb.com"></a>
<a href="https://dev.to/jgomezdev"><img src="https://img.shields.io/badge/Read-the_blog-7c3aed?style=for-the-badge&logo=devdotto&logoColor=white" alt="Read the blog on DEV"></a>
<a href="https://www.linkedin.com/in/jcgomez89/"><img src="https://img.shields.io/badge/Connect-LinkedIn-0a66c2?style=for-the-badge&logo=linkedin&logoColor=white" alt="Connect on LinkedIn"></a>

<a href="https://github.com/Juxn89/juangomezb/actions/workflows/ci.yml"><img src="https://github.com/Juxn89/juangomezb/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
<img src="https://img.shields.io/badge/Next.js-16.2-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 16.2">
<img src="https://img.shields.io/badge/React-19.2-149ECA?style=flat-square&logo=react&logoColor=white" alt="React 19.2">
<img src="https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript strict">
<img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4">
<a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-f59e0b?style=flat-square" alt="MIT License"></a>

</div>

<br>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/readme/stats-dark.svg">
  <img src="docs/readme/stats-light.svg" alt="15+ years building software · 500K+ users reached · every page in English and Spanish · no UI kits, all components custom" width="100%">
</picture>

<br><br>

The source of my personal site: a **bilingual Next.js 16 portfolio** rendered with React Server
Components, fed by my DEV.to articles and GitHub repositories, and **hardened at the edge** like a
production service — because a portfolio is also a sample of how I build.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/readme/showcase-dark.png">
    <img src="docs/readme/showcase-light.png" alt="juangomezb.com in a desktop browser and, in Spanish, on a phone" width="100%">
  </picture>
</p>

<p align="center"><img src="docs/readme/divider.svg" width="100%" alt=""></p>

## ✦ What's inside

<table>
  <tr>
    <td width="50%" valign="top">
      <img src="docs/readme/icon-bilingual.svg" width="44" alt=""><br>
      <b>Bilingual by design</b><br>
      <sub>English and Spanish on every route (<code>/en</code>, <code>/es</code>) with next-intl, <code>hreflang</code> alternates and a localized sitemap.</sub>
    </td>
    <td width="50%" valign="top">
      <img src="docs/readme/icon-theme.svg" width="44" alt=""><br>
      <b>Light, dark or system</b><br>
      <sub>A three-way theme toggle over CSS variables of the <i>Forest Code</i> palette, remembered across visits.</sub>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <img src="docs/readme/icon-blog.svg" width="44" alt=""><br>
      <b>Blog from DEV.to</b><br>
      <sub>Articles fetched from the DEV API and cached with ISR for 30 minutes; a secured endpoint refreshes them on demand.</sub>
    </td>
    <td valign="top">
      <img src="docs/readme/icon-projects.svg" width="44" alt=""><br>
      <b>Projects with case studies</b><br>
      <sub>Curated projects in both languages, validated with Zod, each with its own page: problem, decisions and measured results.</sub>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <img src="docs/readme/icon-security.svg" width="44" alt=""><br>
      <b>Hardened edge</b><br>
      <sub>Scanner and bad-bot blocking, rate limiting, nonce-based CSP, HSTS and an origin shield — in middleware, before any page work.</sub>
    </td>
    <td valign="top">
      <img src="docs/readme/icon-seo.svg" width="44" alt=""><br>
      <b>Search-ready</b><br>
      <sub>Per-page metadata, Open Graph, JSON-LD (<code>Person</code>, <code>WebSite</code>) and dynamic <code>sitemap.xml</code> / <code>robots.txt</code>.</sub>
    </td>
  </tr>
  <tr>
    <td valign="top">
      <img src="docs/readme/icon-mobile.svg" width="44" alt=""><br>
      <b>Mobile-first</b><br>
      <sub>Designed from 320&nbsp;px up; the same content in a single column on phones, with a dedicated menu.</sub>
    </td>
    <td valign="top">
      <img src="docs/readme/icon-cv.svg" width="44" alt=""><br>
      <b>CV on demand</b><br>
      <sub><code>/api/download-cv?locale=en|es</code> serves the PDF in the visitor's language.</sub>
    </td>
  </tr>
</table>

## ✦ How a request flows

```mermaid
flowchart LR
    V([Visitor]) --> EDGE{{"<b>Edge middleware</b><br/>block scanners & bots<br/>rate limit · i18n<br/>CSP nonce · headers"}}

    subgraph APP["Next.js App Router"]
        PAGE["Pages<br/>Server Components"]
        REVAL["/api/revalidate"]
        CV["/api/download-cv"]
    end

    subgraph EXT["External services"]
        DEVTO[("DEV.to API")]
        GH[("GitHub GraphQL")]
        BLOB[("Vercel Blob")]
    end

    EDGE --> PAGE & REVAL & CV
    PAGE -->|"ISR · 30 min"| DEVTO
    PAGE --> GH
    REVAL -.->|purges cache| PAGE
    CV --> BLOB

    classDef edge fill:#047857,stroke:#10b981,color:#ffffff
    classDef app fill:#6d28d9,stroke:#a78bfa,color:#ffffff
    classDef ext fill:#f59e0b,stroke:#b45309,color:#1f2937
    class EDGE edge
    class PAGE,REVAL,CV app
    class DEVTO,GH,BLOB ext
```

> [!TIP]
> Requests from scanners and blocked user agents end at the edge — they never reach a page, an API
> route or an external API. Only what needs the browser (theme, menus, animations) ships as client
> JavaScript; everything else renders on the server.

## ✦ Tech stack

<table>
  <tr>
    <th align="left">Frontend</th>
    <td>
      <img src="https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 16">
      <img src="https://img.shields.io/badge/React_19-149ECA?style=flat-square&logo=react&logoColor=white" alt="React 19">
      <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript">
      <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4">
      <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white" alt="Framer Motion">
      <img src="https://img.shields.io/badge/Lucide-F56565?style=flat-square&logo=lucide&logoColor=white" alt="Lucide icons">
    </td>
  </tr>
  <tr>
    <th align="left">Content &amp; i18n</th>
    <td>
      <img src="https://img.shields.io/badge/next--intl_4-0F172A?style=flat-square" alt="next-intl 4">
      <img src="https://img.shields.io/badge/DEV.to_API-0A0A0A?style=flat-square&logo=devdotto&logoColor=white" alt="DEV.to API">
      <img src="https://img.shields.io/badge/GitHub_GraphQL-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub GraphQL API">
      <img src="https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white" alt="Zod">
    </td>
  </tr>
  <tr>
    <th align="left">Quality</th>
    <td>
      <img src="https://img.shields.io/badge/Vitest-6E9F18?style=flat-square&logo=vitest&logoColor=white" alt="Vitest">
      <img src="https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white" alt="Playwright">
      <img src="https://img.shields.io/badge/ESLint_9-4B32C3?style=flat-square&logo=eslint&logoColor=white" alt="ESLint 9">
      <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white" alt="GitHub Actions">
    </td>
  </tr>
  <tr>
    <th align="left">Platform</th>
    <td>
      <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel">
      <img src="https://img.shields.io/badge/Vercel_Blob-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel Blob">
      <img src="https://img.shields.io/badge/Vercel_Analytics-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel Analytics">
      <img src="https://img.shields.io/badge/Node.js_24-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js 24">
      <img src="https://img.shields.io/badge/pnpm_9-F69220?style=flat-square&logo=pnpm&logoColor=white" alt="pnpm 9">
    </td>
  </tr>
</table>

## ✦ Quick start

```bash
git clone https://github.com/Juxn89/juangomezb.git && cd juangomezb
pnpm install
pnpm dev            # → http://localhost:3000
```

<details>
<summary><b>Environment variables</b> — all optional for local development</summary>
<br>

Put them in `.env.local`:

| Variable | Used for | Without it |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, robots | Falls back to `https://juangomezb.com` |
| `REVALIDATE_SECRET` | Protects `POST /api/revalidate` | The endpoint refuses every request |
| `ORIGIN_SHIELD_SECRET` | Only requests through the CDN (header `x-origin-shield`) reach the app | The origin is reachable directly |

</details>

<details>
<summary><b>Scripts</b></summary>
<br>

| Command | What it does |
|---|---|
| `pnpm dev` | Development server (Turbopack) |
| `pnpm build` · `pnpm start` | Production build · production server |
| `pnpm lint` | ESLint |
| `pnpm test` · `pnpm test:watch` · `pnpm test:coverage` | Unit tests (Vitest) · watch mode · coverage of `src/lib` |
| `pnpm test:e2e` · `pnpm test:e2e:ui` | Playwright end-to-end tests · in UI mode |
| `pnpm ci` | Unit tests, then a production build |

</details>

## ✦ Quality gate

```mermaid
flowchart LR
    PUSH([push / pull request]) --> TSC[Type check] --> UNIT[Unit tests<br/>Vitest] --> BUILD[Production build] --> SHIP([Vercel deploy])

    classDef step fill:#047857,stroke:#10b981,color:#ffffff
    classDef io fill:#6d28d9,stroke:#a78bfa,color:#ffffff
    class TSC,UNIT,BUILD step
    class PUSH,SHIP io
```

- **Unit tests** (`src/**/*.test.ts`): the DEV.to and GitHub clients, SEO metadata and utilities.
- **End to end** (`tests/e2e`): home page, navigation and both locales in a real browser.
- **CI** ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)): a failing check stops the build.

## ✦ Security at the edge

| Layer | What it stops |
|---|---|
| 🚫 **Scanner paths** | Probes for `/.env`, `/.git`, WordPress, PHP admin panels… never reach the app |
| 🤖 **Bad user agents** | Known scanners and exploitation tools (nikto, nmap, nuclei, ZAP…) |
| ⏱️ **Rate limiting** | 100 requests / 15 min per IP for pages, 5 for API routes |
| 🔐 **CSP with a per-request nonce** | Injected scripts: no `unsafe-inline` in production |
| 🛡️ **Security headers** | Clickjacking, MIME sniffing, downgrade (HSTS), unneeded browser APIs |
| 🧱 **Origin shield** | Traffic that bypasses the CDN (404 without the shared secret) |
| 🔑 **Constant-time secret checks** | Timing attacks on the origin-shield header and the revalidation token |

Everything lives in [`middleware.ts`](middleware.ts). Background and decisions:
[docs/security-hardening.md](docs/security-hardening.md) · [docs/summaries](docs/summaries).

## ✦ Project structure

<details>
<summary>Show the tree</summary>

```
├── messages/                # en.json · es.json — every UI string
├── src/
│   ├── app/
│   │   ├── [locale]/        # Localized pages, layout, error and 404
│   │   │   └── projects/    # Project index and /projects/[slug] case studies
│   │   ├── api/             # revalidate · download-cv
│   │   ├── sitemap.ts       # Multilingual sitemap
│   │   └── robots.ts
│   ├── components/
│   │   ├── sections/        # Hero, About, Experience, Projects, Blog
│   │   ├── layouts/         # Header, Footer, MobileMenu
│   │   └── ui/              # Button, Card, Badge, ThemeToggle, LocaleSwitcher…
│   ├── lib/
│   │   ├── api/devto.ts     # DEV.to client (ISR)
│   │   ├── projects/        # Project model, Zod schema and accessors
│   │   ├── constants/       # Site URL, GitHub profile, home sections
│   │   ├── hooks/           # Section navigation shared by the header and mobile menu
│   │   ├── context/         # Theme context
│   │   └── utils/           # cn, SEO helpers
│   ├── proxy.ts             # Blocking, rate limiting, CSP nonce, i18n routing
│   └── i18n.ts · routing.ts # next-intl configuration
├── tests/e2e/               # Playwright
├── scripts/readme/          # Generates the artwork of this README
└── docs/                    # Plans, security notes, transcripts
```

</details>

## ✦ Deployment

Deployed on **Vercel** from `main` (Node 24, `pnpm build`), with the environment variables above in
*Settings → Environment Variables*. A new DEV.to article shows up within 30 minutes; to publish it
right away:

```bash
curl -X POST "https://www.juangomezb.com/api/revalidate" \
  -H "Authorization: Bearer $REVALIDATE_SECRET"
```

## ✦ Documentation

| | Document | Purpose |
|---|---|---|
| 🧭 | [SETUP.md](SETUP.md) | Step-by-step setup after cloning |
| 🧠 | [DEVELOPMENT.md](DEVELOPMENT.md) | Decisions, problems and their solutions |
| 🛠️ | [README.dev.md](README.dev.md) | Developer notes (Spanish): commands, integrations, gotchas |
| 📜 | [CHANGELOG.md](CHANGELOG.md) | Version history |
| 🤖 | [AGENTS.md](AGENTS.md) | Rules for the AI coding agents that work on this repo |
| 💬 | [CONVERSATION_HISTORY.md](CONVERSATION_HISTORY.md) · [docs/transcripts](docs/transcripts) | How it was built with AI assistance |
| 🗺️ | [docs/plans](docs/plans) | Implementation plans |

<p align="center"><img src="docs/readme/divider.svg" width="100%" alt=""></p>

<div align="center">

### Let's build something

<a href="https://www.juangomezb.com"><img src="https://img.shields.io/badge/juangomezb.com-047857?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Website"></a>
<a href="https://www.linkedin.com/in/jcgomez89/"><img src="https://img.shields.io/badge/LinkedIn-0a66c2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
<a href="https://github.com/Juxn89"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
<a href="https://dev.to/jgomezdev"><img src="https://img.shields.io/badge/DEV-0A0A0A?style=for-the-badge&logo=devdotto&logoColor=white" alt="DEV"></a>
<a href="mailto:gb.jc@outlook.com"><img src="https://img.shields.io/badge/Email-7c3aed?style=for-the-badge" alt="Email"></a>

<sub>Code under the <a href="LICENSE">MIT License</a> · Artwork generated by <a href="scripts/readme/build-assets.mjs"><code>scripts/readme/build-assets.mjs</code></a></sub>

</div>
