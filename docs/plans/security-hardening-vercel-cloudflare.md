# Endurecimiento de seguridad: Vercel + Cloudflare

## Contexto

El portafolio (Next.js 16.2 App Router) ya tiene una base de seguridad razonable: middleware con rate limiting en memoria, next-intl para i18n, y una CSP básica. El dominio `juangomezb.com` ya está detrás de Cloudflare (DNS/proxy) delante de Vercel. El usuario pidió una revisión experta de seguridad en ambas plataformas.

La exploración del repo encontró gaps concretos:
- El middleware **excluye `/api/*`** del rate limiting y de los security headers (matcher actual: `/((?!api|_next|_vercel|.*\\..*).*)`).
- `src/app/api/revalidate/route.ts` recibe el secreto por **query string** (queda en logs de acceso) y lo compara con `!==` (no constant-time).
- Rate limiting es un `Map` en memoria — no persiste entre instancias serverless de Vercel, pero es aceptable como defensa básica (Upstash queda fuera de alcance por ahora, no se toca).
- La IP de cliente se extrae solo de `x-forwarded-for`; estando Cloudflare delante, `cf-connecting-ip` es la fuente fiable.
- CSP usa `'unsafe-inline'` y `'unsafe-eval'` en `script-src` — se puede pasar a nonce en producción sin tocar `next-intl` (se verificó en su código fuente que `NextResponse.next({request:{headers}})`/`rewrite(...)` clonan `request.headers` en el momento de la llamada, así que mutar `request.headers` antes de invocar `intlMiddleware(request)` propaga correctamente cualquier header custom — incluido el nonce — hacia los Server Components vía `headers()`).
- Falta `Strict-Transport-Security` (HSTS) en los headers.
- `X-Powered-By: Next.js` sigue expuesto (fingerprinting trivial del framework).
- No existe ningún mecanismo que impida acceder directamente a la URL `*.vercel.app` / dominio de Vercel saltándose Cloudflare (bypass del WAF/Bot Fight Mode de Cloudflare).
- No hay ninguna config de Cloudflare en el repo (es dashboard-only, correcto) — la parte de Cloudflare se entrega como **guía documentada**, sin aplicarla directamente (decisión explícita del usuario: ya usa Cloudflare como DNS/proxy, pero quiere solo documentación, no cambios vía MCP).

Objetivo: cerrar los gaps de código en el lado Next.js/Vercel, y entregar una guía paso a paso para Cloudflare + ajustes de dashboard de Vercel que el usuario aplicará manualmente.

---

## 1. `middleware.ts` — reescritura

Archivo: `C:\sources\personal\juangomezb\middleware.ts`

Cambios:
1. **Matcher**: quitar la exclusión de `api` → `matcher: ['/((?!_next|_vercel|.*\\..*).*)']`. Dentro de la función, si `pathname.startsWith('/api')`, saltar `intlMiddleware` (no debe re-enrutar por locale) pero sí aplicar rate limit + headers de seguridad.
2. **IP de cliente**: nueva función `getClientIp(request)` que prioriza `cf-connecting-ip` (Cloudflare) y cae a `x-forwarded-for` como fallback (para dev local / si algún día se quita Cloudflare).
3. **Rate limit diferenciado**: límite normal (100/15min) para páginas; límite estricto (5/15min) específicamente para `pathname === '/api/revalidate'`, usando una key de store distinta (`revalidate:${ip}`) para no compartir contador con el tráfico general de esa IP.
4. **CSP con nonce en producción**: nueva función `generateNonce()` (usa `crypto.randomUUID()` + base64, disponible en Edge runtime) y `buildCsp(nonce)`. En producción: `script-src 'self' 'nonce-<value>' https://va.vercel-scripts.com` (sin `unsafe-inline`/`unsafe-eval`). En desarrollo: mantener `'unsafe-eval' 'unsafe-inline'` (necesario para Fast Refresh). El nonce se inyecta como header `x-nonce` mutando `request.headers` **antes** de llamar a `intlMiddleware(request)` (confirmado que funciona por el código fuente de next-intl).
5. **Headers nuevos**: añadir `Strict-Transport-Security: max-age=63072000; includeSubDomains` (sin `preload` todavía — eso es una decisión manual posterior, se documenta en la guía). Eliminar el header `X-Powered-By` desde el middleware como red de seguridad adicional (el fix principal va en `next.config.ts`).
6. **Origin-shield opcional** (defensa contra bypass de Cloudflare): si existe `process.env.ORIGIN_SHIELD_SECRET`, exigir un header `x-origin-shield` que coincida (comparación constant-time manual, ver abajo) o responder 404. Si la env var no está seteada, el chequeo se omite por completo — no rompe nada si el usuario no configura el lado Cloudflare todavía.
7. Comparación constant-time manual (Edge runtime no tiene `node:crypto` garantizado):
   ```ts
   function timingSafeEqual(a: string, b: string): boolean {
     const enc = new TextEncoder();
     const aBytes = enc.encode(a);
     const bBytes = enc.encode(b);
     if (aBytes.length !== bBytes.length) return false;
     let result = 0;
     for (let i = 0; i < aBytes.length; i++) result |= aBytes[i] ^ bBytes[i];
     return result === 0;
   }
   ```

## 2. `src/app/[locale]/layout.tsx` — propagar el nonce

Archivo: `C:\sources\personal\juangomezb\src\app\[locale]\layout.tsx`

- Leer el nonce con `(await headers()).get('x-nonce')` (import de `next/headers`).
- Añadir `nonce={nonce}` a los dos `<script type="application/ld+json">` existentes (líneas 77-84).

## 3. `src/app/api/revalidate/route.ts` — endurecer el endpoint

Archivo: `C:\sources\personal\juangomezb\src\app\api\revalidate\route.ts`

- Leer el secreto de `Authorization: Bearer <secret>` en vez de `?secret=` (query string queda en logs/analytics).
- Comparar con `crypto.timingSafeEqual` de `node:crypto` (Route Handlers corren en Node.js runtime por defecto, así que sí está disponible aquí, a diferencia del middleware).
- Mantener el resto de la lógica igual (`revalidateTag('devto-articles', 'default')`).

## 4. `next.config.ts` — quitar fingerprinting

Archivo: `C:\sources\personal\juangomezb\next.config.ts`

- Añadir `poweredByHeader: false` al `nextConfig`.

## 5. Actualizar documentación existente

Archivo: `C:\sources\personal\juangomezb\README.dev.md`

- Actualizar el ejemplo de `curl` (línea ~67) de `curl -X POST ".../api/revalidate?secret=TU_REVALIDATE_SECRET"` a usar `-H "Authorization: Bearer TU_REVALIDATE_SECRET"`.

## 6. Nueva guía: `docs/security-hardening.md`

Documento nuevo con dos secciones dashboard-only (no se aplica nada vía API/MCP, solo instrucciones para que el usuario las ejecute):

**Vercel Dashboard:**
- Deployment Protection: activar protección por contraseña o Vercel Authentication en preview deployments.
- Environment Variables: confirmar scoping correcto (Production vs Preview vs Development) de `REVALIDATE_SECRET`, `GITHUB_TOKEN`, y el nuevo `ORIGIN_SHIELD_SECRET`; rotar `GITHUB_TOKEN` con el mínimo scope necesario (solo lectura pública).
- Git Fork Protection: confirmar que builds de PRs de forks no exponen env vars sensibles.
- Revisar dominio: forzar HTTPS, TLS mínimo 1.2.
- Si el plan lo permite (Pro/Enterprise): Vercel Firewall — reglas de rate limiting adicionales y, opcionalmente, allowlist de los rangos de IP de Cloudflare para que solo Cloudflare pueda hablar con el origen (complementa el `ORIGIN_SHIELD_SECRET` del middleware, que funciona en cualquier plan).

**Cloudflare Dashboard:**
- SSL/TLS → modo **Full (Strict)**, "Always Use HTTPS" ON, TLS mínimo 1.2, HSTS activado en Edge Certificates (`includeSubDomains`, sin `preload` hasta confirmar que todos los subdominios soportan HTTPS).
- Security → **Bot Fight Mode** (o Super Bot Fight Mode si el plan lo incluye) ON.
- WAF → activar Managed Rules (OWASP Core Ruleset) disponibles en el plan.
- WAF → **Rate Limiting Rule** específica para `/api/revalidate` (ej. 5 req/min por IP) como defensa adicional en el edge, delante del rate limit de la app.
- Custom Rules → bloquear/challengear user agents sospechosos (`curl`, `python-requests`, `scrapy`, etc.) a nivel de edge — más eficiente que hacerlo en el origen.
- Security Level: Medium o High.
- **Transform Rule** para el origin-shield: añadir el header `x-origin-shield: <mismo valor que ORIGIN_SHIELD_SECRET en Vercel>` a todo el tráfico saliente hacia el origen. Esto, combinado con el chequeo del middleware, hace que solo las peticiones que pasan por Cloudflare lleguen a la app — bloquea el bypass directo a la URL de Vercel.
- Scrape Shield → Email Address Obfuscation ON (protege el `mailto:` del `ContactSection`).
- DNSSEC → activar si el registrador del dominio lo soporta.
- Confirmar que el registro DNS del dominio está en modo "Proxied" (naranja), no "DNS only".

---

## Verificación

1. `pnpm install` (si aplica) y `pnpm dev` — levantar el servidor local.
2. Confirmar que la home carga en `en` y `es` sin errores de consola (especial atención a violaciones de CSP por el nonce).
3. Con DevTools → Network, inspeccionar los headers de la respuesta del documento HTML: `Content-Security-Policy` (con nonce), `Strict-Transport-Security`, sin `X-Powered-By`.
4. Verificar que los dos `<script type="application/ld+json">` en el `<head>` tienen el atributo `nonce` y que Google Rich Results / structured data sigue siendo válido (no afecta, JSON-LD no depende del nonce para ser leído por crawlers).
5. Probar el endpoint de revalidación:
   - `curl -X POST "http://localhost:3000/api/revalidate" -H "Authorization: Bearer $REVALIDATE_SECRET"` → `{"revalidated": true, ...}`.
   - Sin header o con secreto incorrecto → `401`.
   - Repetir 6 veces seguidas → la 6ª debe devolver `429` (rate limit estricto de 5).
6. `pnpm run ci` (lint/type-check + tests + build) para confirmar que no se rompe nada.
7. Confirmar que `ORIGIN_SHIELD_SECRET` sin definir no rompe ninguna ruta (comportamiento por defecto, sin la env var configurada todavía en local/CI).
