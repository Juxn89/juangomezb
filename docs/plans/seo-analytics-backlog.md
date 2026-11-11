# SEO y analíticas: estado y pendientes

Notas del 28 oct 2026 para retomar más tarde. Qué está hecho en el sitio, qué falta configurar fuera del repo y
qué herramientas sirven para medir si el tráfico es orgánico.

## Estado actual (verificado en producción el 27 oct 2026)

| Pieza | Dónde | Estado |
|---|---|---|
| `<html lang>` por idioma | `src/app/[locale]/layout.tsx` | ✅ `en` / `es` |
| `canonical` propio en cada página | `generateSEOMetadata` en `src/lib/utils/seo.ts` | ✅ |
| `hreflang` `en` ↔ `es` + `x-default` → inglés | `seo.ts` y `src/app/sitemap.ts` (PR #23) | ✅ |
| `sitemap.xml` con alternativas por URL | `src/app/sitemap.ts` → https://www.juangomezb.com/sitemap.xml | ✅ 18 URLs |
| `robots.txt` que declara el sitemap | `src/app/robots.ts` | ✅ |
| JSON-LD `Person` y `WebSite` (`sameAs`: GitHub, LinkedIn, X `@jc_gomez89`) | `seo.ts` (PR #22) | ✅ |
| Redirección de `/` según `Accept-Language` | proxy + next-intl | ✅ sin cabecera → `/en`; `es` → `/es` |
| Vercel Web Analytics | `<Analytics />` en el layout; CSP permite `va.vercel-scripts.com` | ✅ instalado |
| Etiqueta de verificación de Google | `verification.google` lee `GOOGLE_SITE_VERIFICATION` | ⚠️ la variable no está en Vercel |

**Por qué en Google se ve solo la versión ES:** Google muestra la variante `hreflang` del idioma y la región de
quien busca. Desde Nicaragua, con el navegador en español, lo correcto es `/es`. Para ver la versión EN:
`https://www.google.com/search?q=juan+gomez+software+engineer&hl=en&gl=us` en incógnito, o
`site:www.juangomezb.com/en`.

## Pendiente (fuera del repo)

1. **Google Search Console**: propiedad de tipo **Dominio** `juangomezb.com`.
   - Verificar con un registro `TXT` en la raíz (`@`). El DNS está en **Cloudflare** (proxy delante de Vercel).
   - Alternativa: propiedad de **Prefijo de URL** con etiqueta HTML → poner solo el valor de `content` en la
     variable `GOOGLE_SITE_VERIFICATION` de Vercel y redesplegar; el sitio ya la inserta.
   - Enviar `sitemap.xml` en **Sitemaps**.
   - **Inspección de URLs** de `/en`, `/en/projects` y un caso de estudio: confirmar que la canonical que eligió
     Google es la misma que declaramos, y pedir indexación si no está.
   - A los días: **Rendimiento** filtrado por página `/en/` y por país; **Indexación → Páginas** para ver las
     excluidas ("Duplicada, Google eligió otra canonical" sería un problema a investigar).
2. **Bing Webmaster Tools**: se puede importar la propiedad desde Search Console; cubre también DuckDuckGo y
   Copilot.
3. **UTM en los enlaces propios**, para separar la difusión propia del tráfico orgánico:

   | Dónde | Enlace |
   |---|---|
   | README del perfil de GitHub (`Juxn89/Juxn89`, va por PR) | `https://www.juangomezb.com/?utm_source=github-profile` |
   | LinkedIn | `?utm_source=linkedin` |
   | Fichas de Workana | `?utm_source=workana` |
   | Artículos de DEV | `?utm_source=devto` |

4. **Cloudflare**: confirmar que Bot Fight Mode o las reglas WAF no bloquean a los crawlers verificados
   (Googlebot, Bingbot). En **Security → Events** se ve si hubo bloqueos.

## Cómo leer los números

| Fuente | Qué cuenta | ¿Es orgánico? |
|---|---|---|
| Cloudflare, dashboard general | Toda petición HTTP: bots, crawlers, monitores, assets | ❌ no son visitantes |
| Vercel Web Analytics | Páginas vistas de navegadores reales (script) | A medias: **Referrers** `google.com`/`bing.com` = búsqueda orgánica; `linkedin.com`, `github.com`, `workana.com`, `dev.to` = enlaces propios; Direct = URL escrita o apps que no mandan referrer. Los bloqueadores de anuncios lo subestiman |
| Google Search Console | Impresiones y clics desde Google, con las búsquedas | ✅ por definición |

## Herramientas útiles

### Gratis, sin instalar nada en el sitio

| Herramienta | Para qué |
|---|---|
| [Google Search Console](https://search.google.com/search-console) | Indexación, canonical elegida, búsquedas, clics por país y página |
| [Bing Webmaster Tools](https://www.bing.com/webmasters) | Lo mismo para Bing; importa desde Search Console |
| [Rich Results Test](https://search.google.com/test/rich-results) | Validar el JSON-LD (`Person`, `WebSite`, proyectos) |
| [Schema Markup Validator](https://validator.schema.org) | Validación de schema.org sin el filtro de Google |
| [PageSpeed Insights](https://pagespeed.web.dev) | Core Web Vitals reales (CrUX) y Lighthouse |

### Comprobar desde la terminal lo que ve Google

El proxy bloquea los user agents tipo `curl`, así que hay que mandar uno de navegador o el de Googlebot:

```bash
UA="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
# lang, canonical y hreflang de una página
curl -s -A "$UA" https://www.juangomezb.com/en | grep -oE '<html[^>]*>|<link rel="(canonical|alternate)"[^>]*>'
# redirección de la raíz según idioma
curl -s -o /dev/null -A "$UA" -H "Accept-Language: es" -w '%{http_code} -> %{redirect_url}\n' https://www.juangomezb.com/
# sitemap
curl -s -A "$UA" https://www.juangomezb.com/sitemap.xml | head -20
```

### Analíticas alternativas (si Vercel se queda corto)

Todas sin cookies, así que no hace falta un aviso de consentimiento. Cualquiera de ellas exige ampliar
`script-src` y `connect-src` de la CSP en `src/proxy.ts`. Los hosts exactos hay que confirmarlos en su
documentación al momento de instalarlas.

| Opción | Costo | Licencia | Notas |
|---|---|---|---|
| Cloudflare Web Analytics (el *beacon*, no el dashboard general) | Gratis | Servicio propietario | Ya usamos Cloudflare; script `static.cloudflareinsights.com` |
| Umami Cloud | Free tier | MIT (self-host posible) | Referrers, UTM y eventos |
| GoatCounter | Gratis para uso no comercial | EUPL-1.2 | Muy liviano |
| Plausible | Solo self-host es gratis | AGPL-3.0 | Requiere servidor propio |

**Descartado:** Google Analytics 4. Usa cookies, obliga a mostrar un aviso de consentimiento y choca con el
criterio de privacidad del sitio (`AGENTS.md`: analíticas *privacy-focused*).
