# 🛡️ Security Hardening Guide: Vercel + Cloudflare

Este documento incluye pasos de configuración manual en Vercel y Cloudflare para complementar los endurecimientos de código implementados en `middleware.ts`, API routes, y config de Next.js.

**Referencia**: Ver `docs/plans/security-hardening-vercel-cloudflare.md` para el plan técnico detallado.

---

## 📋 Vercel Dashboard Configuration

### 1. Deployment Protection

**Dashboard Path**: Settings → Deployments → Deployment Protection

- [ ] Activar **Protection for Preview Deployments**
- [ ] Elegir método: contraseña o Vercel Authentication (recomendado: Vercel Authentication si tu plan lo soporta)
- **Efecto**: Las URLs de preview `*.vercel.app` requieren autenticación; protege builds de PRs de forks.

### 2. Environment Variables

**Dashboard Path**: Settings → Environment Variables

Verificar el scoping correcto de todas las variables sensibles:

| Variable | Scope | Valor | Notas |
|---|---|---|---|
| `REVALIDATE_SECRET` | Production only | `<gen secret fuerte de 32+ chars>` | Usada en `/api/revalidate` con header Authorization Bearer. Regenerar mensualmente. |
| `GITHUB_TOKEN` | Production only | PAT (Personal Access Token) | Scope: solo lectura de repos públicos (`public_repo`). Rotar anualmente. |
| `ORIGIN_SHIELD_SECRET` | Production only | `<gen secret fuerte>` | Nuevo (Oct 2024). Usado para validar que solo Cloudflare llegue al origin. Coordinar con Cloudflare Transform Rules (ver abajo). |
| `NEXT_PUBLIC_SITE_URL` | All (pública por diseño) | `https://juangomezb.com` | Usado en sitemap, robots.txt, SEO metadata. |

**Pasos**:
1. Ir a Settings → Environment Variables
2. Por cada variable, editar y confirmar scoping
3. Si `ORIGIN_SHIELD_SECRET` no existe, crearla:
   - Generar: `node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"`
   - Añadirla con scope Production only
   - **No tocar `/api/revalidate` ni el middleware** hasta que Cloudflare Transform Rules esté activa (ver paso de Cloudflare)

### 3. Git Fork Protection

**Dashboard Path**: Settings → Git → Connected Git Provider

- [ ] Confirmar que **Enable Git Fork Protection** está activado (típicamente ON por defecto)
- **Efecto**: PRs de forks no exponen env vars de Production scope

### 4. HTTPS & TLS

**Dashboard Path**: Settings → Domains

- [ ] Confirmar que **Force HTTPS** está ON
- [ ] Confirmar TLS Version mínimo: **1.2** (o superior)
- [ ] Si el plan lo soporta: SSL Certificate → escoger **Full (Strict)** si lo usa Cloudflare también

### 5. Vercel Firewall (si el plan Pro/Enterprise lo permite)

**Dashboard Path**: Settings → Security & Compliance → Firewall Rules

Si tu plan Vercel incluye Firewall Rules:

- [ ] Crear regla: bloquear todo excepto IPs de Cloudflare
  ```
  País: Cualquiera
  IP: Allow only Cloudflare IP ranges
  Porcentaje: 100%
  ```
  - Cloudflare publishes IP ranges en https://www.cloudflare.com/ips/
  - Esto complementa `ORIGIN_SHIELD_SECRET` del middleware (defensa en profundidad)
- Si no está disponible, `ORIGIN_SHIELD_SECRET` + Transform Rule de Cloudflare es suficiente

---

## ☁️ Cloudflare Dashboard Configuration

### 1. SSL/TLS

**Dashboard Path**: SSL/TLS → Overview

- [ ] Modo: **Full (Strict)**
- [ ] "Always Use HTTPS": **ON**
- [ ] TLS Versión mínima: **1.2**
- [ ] HSTS en Edge Certificates:
  - Ir a SSL/TLS → Edge Certificates → HSTS Header → Enable HSTS
  - Max-Age: `63072000` (2 años)
  - `includeSubDomains`: ON
  - `preload`: OFF (decidir manualmente después, es una decisión de largo plazo)

### 2. Bot Fight Mode

**Dashboard Path**: Security → Bot Management

- [ ] **Bot Fight Mode**: ON (o Super Bot Fight Mode si tu plan lo incluye)
  - Managed Challenge: para bots sospechosos
  - Block: para bots conocidos maliciosos
- **Efecto**: Cloudflare detecta y desafía bots automáticamente; protege contra crawlers agresivos, scraping, ataques de fuerza bruta

### 3. WAF (Web Application Firewall)

**Dashboard Path**: Security → WAF

Activar según plan disponible:

- [ ] **Managed Rules**: activar OWASP Core Ruleset (nivel recomendado: Medium o High sensitivity)
  - Protege contra inyección SQL, XSS, path traversal, etc.
- [ ] **Rate Limiting Rules**: crear regla específica para el endpoint de revalidación
  ```
  Field: URI Path
  Value: /api/revalidate
  Rate Limit: 5 requests per 1 minute per IP
  Action: Block
  Duration: 60 segundos
  ```
  - Esta es defensa en profundidad: complementa el rate limiting del middleware

### 4. Custom Rules (Bot User-Agent Blocking)

**Dashboard Path**: Security → WAF → Custom Rules

- [ ] Crear regla para bloquear/challenge bots sospechosos:
  ```
  Condition: User Agent contains any of: curl, wget, python-requests, scrapy, Go-http-client
  Action: Challenge
  ```
  - Menos severo que Block (permite humans que usen esos agents, solo les muestra un CAPTCHA)
  - Más eficiente que hacerlo en el origen

### 5. Security Level

**Dashboard Path**: Security → Settings → Security Level

- [ ] Establecer en: **High** (o Medium si es muy restrictivo para usuarios legítimos)
- **Efecto**: Cloudflare desafía a más IPs sospechosas (basadas en reputación)

### 6. Transform Rules (Origin Shield)

**Dashboard Path**: Rules → Transform Rules

Crear una regla para añadir header de origin-shield a todo el tráfico saliente:

- [ ] Crear nueva Transform Rule:
  ```
  Nombre: Add Origin Shield Header
  
  Condición: Default (todas las requests)
  
  Pasos:
  1. Modify Request Header
     - Operación: Set
     - Header Name: x-origin-shield
     - Header Value: <MISMO VALOR QUE ORIGIN_SHIELD_SECRET EN VERCEL>
  ```
- **Efecto**: Todas las requests que salen de Cloudflare llevan el header especial
- **Coordinar**: El header debe coincidir EXACTAMENTE con `ORIGIN_SHIELD_SECRET` en Vercel
- El middleware en `src/app/api/revalidate/route.ts` y el middleware global validan este header; requests sin él son bloqueadas (404)

**⚠️ Importante**: No aplicar esta regla hasta que:
1. `ORIGIN_SHIELD_SECRET` esté seteada en Vercel (Production scope)
2. El deployment nuevo (con el middleware endurecido) esté en producción
3. Validar en staging que los requests pasan el chequeo

### 7. Scrape Shield

**Dashboard Path**: Security → Scrape Shield

- [ ] **Email Address Obfuscation**: ON
  - Ofusca automáticamente `mailto:` links en el HTML
  - El `ContactSection` del portafolio tiene un link `mailto:` — esto lo protege

### 8. DNSSEC

**Dashboard Path**: DNS → DNSSEC

- [ ] Si el registrador del dominio soporta DNSSEC: **Enable DNSSEC**
  - Protege la zona DNS contra spoofing
  - Verifica la integridad de los records DNS

### 9. DNS Record Check

**Dashboard Path**: DNS → Records

- [ ] Confirmar que el registro de `juangomezb.com` (o tus subdomios) está en modo **Proxied** (icono naranja), no "DNS only"
  - Si está en "DNS only", Cloudflare no proxea las requests, y las defensas de WAF/Bot Fight Mode no aplican
  - El formato debe ser similar a:
    ```
    juangomezb.com    CNAME    <tu-vercel-domain>.vercel.app    Proxied
    ```

---

## 🔐 Verificación Post-Deployment

Después de aplicar cambios en Vercel y Cloudflare, verificar:

### Local / Dev

```bash
# Instalar dependencias
pnpm install

# Levantar servidor
pnpm dev

# Abrir http://localhost:3000

# Inspeccionar headers (DevTools → Network → document)
# - Content-Security-Policy: debe tener nonce (dev) o estar sin unsafe-inline (prod)
# - X-Frame-Options: DENY
# - X-Content-Type-Options: nosniff
# - Strict-Transport-Security: max-age=63072000; includeSubDomains
# - NO debe haber X-Powered-By header

# Probar endpoint de revalidación (env var local set needed)
# export REVALIDATE_SECRET="test-secret"
# curl -X POST "http://localhost:3000/api/revalidate" \
#   -H "Authorization: Bearer test-secret"
# # Esperado: {"revalidated": true, ...}
```

### Production / Cloudflare

1. **Verificar HTTPS y headers en prod**:
   ```bash
   curl -I https://juangomezb.com
   # Buscar: Strict-Transport-Security, Content-Security-Policy, X-Frame-Options
   ```

2. **Probar rate limiting**:
   ```bash
   # Ejecutar 6 veces seguidas
   for i in {1..6}; do
     curl -X POST "https://juangomezb.com/api/revalidate" \
       -H "Authorization: Bearer $REVALIDATE_SECRET"
     echo ""
   done
   # Resultado: primeras 5 → 401 (secreto inválido), 6ª → 429 (rate limited)
   ```

3. **Verificar Cloudflare protecciones**:
   - Ir a Analytics → Security
   - Buscar Firewall Rule actions y Bot Management events
   - Confirmar que WAF Managed Rules está activo (debería ver algunos eventos de log)

4. **Test de user-agent sospechoso** (via curl mismo es sospechoso):
   ```bash
   curl -A "curl/7.x.x" https://juangomezb.com
   # Esperado: Challenge (HTML de Cloudflare) o error 403/429
   ```

5. **Validar origin-shield** (requiere secreto correcto):
   ```bash
   # Sin header origin-shield
   curl -X GET "https://juangomezb.com/" -H "x-origin-shield: wrong-secret"
   # Esperado: 404 Forbidden (si ORIGIN_SHIELD_SECRET está seteada)
   ```

---

## 📝 Maintenance & Rotation Schedule

| Tarea | Frecuencia | Responsable | Notas |
|---|---|---|---|
| Rotar `REVALIDATE_SECRET` | Mensualmente | Admin | Generar nuevo valor, updatar Vercel y tomar nota |
| Rotar `GITHUB_TOKEN` | Anualmente | Admin | Generar nuevo PAT, scope mínimo |
| Revisar WAF Logs | Semanalmente | Ops | Buscar falsos positivos que bloqueen usuarios legítimos |
| Revisar Bot Fight Mode events | Semanalmente | Ops | Ajustar sensitivity si hay muchos falsos positivos |
| Actualizar CSP nonce | Automático en deploy | CI/CD | El middleware genera nuevo nonce por request (no requiere acción manual) |
| Revisar Cloudflare IP ranges | Trimestralmente | Ops | Si Vercel Firewall usa IP whitelist, actualizar ranges de Cloudflare |
| Security headers audit | Mensualmente | Security | Verificar con https://securityheaders.com |

---

## 🚨 Troubleshooting

### El sitio muestra 404 Forbidden después de habilitar origin-shield

**Causa**: `ORIGIN_SHIELD_SECRET` mismatch entre Vercel y Cloudflare Transform Rules.

**Fix**:
1. Verificar que el valor en Vercel (Settings → Environment Variables) coincide exactamente
2. Verificar que la Transform Rule en Cloudflare usa el mismo valor
3. Re-deploy la app en Vercel (fuerza reinicio)
4. Esperar 1-2 minutos a que la Transform Rule se propague en Cloudflare

### CSP violations en DevTools (nonce inválido en prod)

**Causa**: Nonce regenerado por request pero no propagado correctamente al cliente.

**Fix**:
1. Verificar que `src/app/[locale]/layout.tsx` lee `(await headers()).get('x-nonce')`
2. Verificar que `middleware.ts` mutates `request.headers` antes de llamar `intlMiddleware(request)`
3. Clearar cache de Cloudflare (Settings → Caching → Purge All) y re-deploy

### Rate limiting muy agresivo (usuarios legítimos bloqueados)

**Causa**: Límite de 5 req/15min en `/api/revalidate` es global por IP; si múltiples usuarios de la misma red corporativa lo usan, pueden compartir IP pública.

**Fix**:
1. En Cloudflare WAF → Rate Limiting Rules → ajustar de 5 a 10 req/15min
2. O añadir una regla que exclude IPs corporativas conocidas (menos recomendable)
3. En `middleware.ts` → aumentar `RATE_LIMIT_API_MAX` de 5 a 10

### No se ve WAF/Bot Fight Mode events en analytics

**Causa**: El plan Cloudflare quizás no tiene analytics detallado, o están filtrados.

**Fix**:
1. Verificar que Bot Fight Mode está efectivamente ON (Security → Bot Management)
2. Ir a Analytics → Security (no Overview)
3. Filtrar por "Bot Management" o "Firewall Events"
4. Si sigue sin aparecer, verifica que tu plan incluye WAF logging (pro plan mínimo)

---

## 📚 Additional Resources

- [Cloudflare Security Docs](https://developers.cloudflare.com/waf/)
- [Vercel Security Best Practices](https://vercel.com/docs/security)
- [OWASP Top 10 2024](https://owasp.org/Top10/)
- [Content Security Policy Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [Mozilla Observatory](https://observatory.mozilla.org/) — auditar headers de seguridad públicamente

---

**Última actualización**: Oct 2024  
**Autor**: Security Audit Agent  
**Status**: Implementado en rama `feat/enhance-security-vercel`
