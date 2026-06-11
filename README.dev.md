# Developer Notes

Guía técnica interna para el desarrollo y mantenimiento del portfolio.

---

## Stack

- **Framework**: Next.js 16.2.6 (App Router, RSC)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4
- **i18n**: next-intl 4.12.0 (EN / ES)
- **Animations**: Framer Motion + react-type-animation
- **Package Manager**: pnpm 9+
- **Runtime**: Node.js 24.x

---

## Comandos frecuentes

```bash
pnpm dev                   # Servidor de desarrollo (puerto 3000)
pnpm dev -- -p 3001        # Puerto alternativo
pnpm build                 # Build de producción
pnpm start                 # Servidor de producción
pnpm lint                  # ESLint
```

---

## Variables de entorno

Crear `.env.local` en la raíz con:

```bash
NEXT_PUBLIC_SITE_URL=https://www.juangomezb.com
GITHUB_TOKEN=                  # Token GitHub para GraphQL API (repos pinneados)
REVALIDATE_SECRET=             # Secreto para el endpoint de revalidación manual
```

En Vercel, configurar las mismas variables en **Settings → Environment Variables**.

---

## Integraciones externas

### Dev.to API
- Endpoint: `https://dev.to/api/articles?username=jgomezdev&state=fresh`
- Implementación: `src/lib/api/devto.ts`
- Caché ISR: revalida cada **30 minutos** automáticamente

### GitHub GraphQL API
- Obtiene los repositorios pinneados del perfil
- Implementación: `src/lib/github/api.ts`
- Requiere `GITHUB_TOKEN` para evitar rate limiting

---

> [!IMPORTANT]
> ## Revalidación manual de artículos Dev.to
>
> Cuando publiques un nuevo artículo en Dev.to, el portfolio puede tardar hasta **30 minutos** en mostrarlo por el caché ISR.
>
> Para forzar la actualización **de inmediato**, ejecuta:
>
> ```bash
> curl -X POST "https://www.juangomezb.com/api/revalidate?secret=TU_REVALIDATE_SECRET"
> ```
>
> **Prerequisito**: la variable `REVALIDATE_SECRET` debe estar configurada en Vercel con el mismo valor que uses en el comando.
>
> Respuesta esperada:
> ```json
> { "revalidated": true, "timestamp": "2026-06-11T..." }
> ```
>
> Implementación: `src/app/api/revalidate/route.ts`

---

## Git remotes

```bash
git remote -v
# origin-ssh   git@github.com:juxn89/juangomezb.git
```

Usar siempre `origin-ssh` para push:

```bash
git push origin-ssh <branch>
```

---

## i18n — notas importantes

- La timezone está configurada en **dos lugares** (requerido por next-intl):
  - `src/i18n.ts`
  - `src/components/providers/Providers.tsx`
- Toda cadena de texto debe estar en `messages/en.json` y `messages/es.json`
- Verificar siempre ambos idiomas antes de hacer merge

---

## Tailwind CSS 4 — sintaxis diferente a v3

```tsx
// ❌ Tailwind 3
className="bg-gradient-to-r from-emerald-500 to-violet-500"

// ✅ Tailwind 4
className="bg-linear-to-r from-emerald-500 to-violet-500"
```

---

## Deployment

- **Plataforma**: Vercel
- **Build command**: `pnpm run build`
- **Node version**: 24.x
- **URL producción**: https://www.juangomezb.com/en
