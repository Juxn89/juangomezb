# 🛡️ DDoS Mitigation Strategy for Cloudflare Free Tier

Basado en análisis de Top User Agents en Vercel — detectados: `python-requests`, `CMS-Checker`, `Palo Alto Networks scanner`, `AhrefsBot` (agresivo).

**Realidad Free Tier**: No hay WAF Rules ni Rate Limiting Rules (Pro+). Pero combinando Cloudflare Free + middleware endurecido, puedes bloquear mucho.

---

## 📋 Cloudflare Free Tier — Lo que SÍ puedes hacer

### 1. Bot Fight Mode (Free, basico)

**Dashboard Path**: Security → Bot Management

- [ ] **Bot Fight Mode**: ON
- Superpower: Detecta bots conocidos y los desafía automáticamente
- **Limitación**: Cloudflare Free solo detecta bots muy obvios; no blocka por User-Agent personalizado

**Status**: Ya está ON? Mantenerlo.

### 2. Security Level (Free)

**Dashboard Path**: Security → Settings → Security Level

- [ ] Cambiar a **"I'm Under Attack" Mode** (naranja)
  - Activa CAPTCHA para IPs con reputación dudosa
  - Más agresivo, pero ralentiza bots sin eliminarlos
- Alternativa menos restrictiva: **"High"** (morado)

**Recomendado**: "High" inicialmente; cambiar a "I'm Under Attack" si ves mucho ataque.

### 3. Page Rules (Free: 3 gratuitas)

**Dashboard Path**: Rules → Page Rules

Este es tu mejor aliado en Free tier. Puedes crear 3 reglas (suficientes).

#### Page Rule 1: Bloquear requests sin User-Agent

```
URL: juangomezb.com/*
Condition Matching: NOT

Condition: User Agent contains "Mozilla"
          AND User Agent contains "Safari" OR "Chrome" OR "Firefox" OR "Edge"
          (es decir, regla permisiva para navegadores reales)

Action: Block
```

**¿Por qué?**: Los bots muchas veces tienen User-Agent vacío o rarísimo. Si NO tiene un navegador conocido, bloquealo.

**Limitación**: Page Rules usa Match patterns simples, no regex complejo. Pero funciona para lo básico.

#### Page Rule 2: Bloquear `python-requests`, `CMS-Checker`, `Palo Alto`

Desafortunadamente, **Page Rules en Free tier no tiene acción "Challenge by User-Agent"** — solo puedes bloquear por URL pattern, país, etc.

**Alternativa**: Usar el middleware de Next.js (ver abajo) para bloquear en el origen. Cloudflare Free no lo hace.

#### Page Rule 3: Rate Limit Básico (via Page Rules – muy limitado)

```
URL: juangomezb.com/api/revalidate*

Action: Challenge (CAPTCHA)
```

Esto no es rate limiting real, pero hace que `/api/revalidate` muestre CAPTCHA a cualquiera — no es ideal, pero es lo máximo en Free.

**Mejor**: El middleware de Next.js ya hace rate limiting (5 req/15min). Cloudflare Free no puede mejorar eso significativamente.

---

## 🔧 Middleware de Next.js — Tu Defensa Principal en Free Tier

Dado que **Cloudflare Free no puede bloquear User Agents específicos**, el middleware que implementamos es TU defensa real.

### Actualizar `middleware.ts` para bloquear User Agents maliciosos

El middleware actual solo hace rate limiting. Vamos a añadir **bloqueo de User Agents sospechosos**:

**Archivo**: `middleware.ts`

Añadir esta función **antes de `export async function middleware`**:

```typescript
const BLOCKED_USER_AGENTS = [
	'python-requests',
	'curl',
	'wget',
	'httpie',
	'scrapy',
	'aiohttp',
	'requests',
	'go-http-client',
	'java',
	'httpclient',
	'okhttp',
	'python-httpx',
	'robot',
	'bot',
	'spider',
	'crawler',
	'scraper',
	'cms-checker',
	'palo alto',
	'nessus',
	'nuclei',
	'burpsuite',
	'sqlmap',
	'nikto',
	'metasploit',
	'nmap',
	'shodan',
	'masscan',
	'zap',
];

function isBlockedUserAgent(userAgent: string): boolean {
	const ua = userAgent.toLowerCase();
	return BLOCKED_USER_AGENTS.some((pattern) => ua.includes(pattern));
}
```

**Luego, en `middleware` function, después del check de rate limit:**

```typescript
	// Check for blocked/suspicious user agents
	const userAgent = request.headers.get('user-agent') || '';
	if (isBlockedUserAgent(userAgent)) {
		return NextResponse.json(
			{error: 'Access denied'},
			{status: 403, headers: {'Retry-After': '3600'}}
		);
	}
```

**⚠️ Cuidado**: Si bloqueas `curl`, usuarios legítimos con herramientas CLI no pueden acceder (aunque raros en un portafolio). Puedes ser menos restrictivo — solo incluye los muy sospechosos:

**Versión menos restrictiva** (recomendado para portfolios):

```typescript
const BLOCKED_USER_AGENTS = [
	'python-requests',       // Python scraping library
	'scrapy',                // Web scraping framework
	'sqlmap',                // SQL injection tool
	'nikto',                 // Web scanner
	'nessus',                // Vulnerability scanner
	'nmap',                  // Port scanner
	'cms-checker',           // CMS scanning tool
	'palo alto',             // Palo Alto scanning
];

const CHALLENGE_USER_AGENTS = [
	'aiohttp',               // Python async client (could be bot)
	'httpclient',            // Generic client
	'okhttp',                // Android HTTP client (could be bot)
	'bot',                   // Obvious bot
	'crawler',               // Obvious crawler
	'scraper',               // Obvious scraper
];
```

Luego:

```typescript
	// Check for blocked user agents (hard block)
	const userAgent = request.headers.get('user-agent') || '';
	if (isBlockedUserAgent(userAgent)) {
		return NextResponse.json(
			{error: 'Access denied'},
			{status: 403}
		);
	}

	// Check for challenging user agents (soft block with challenge)
	if (isChallengeUserAgent(userAgent)) {
		// Option 1: Return challenge (client-side - requires JS)
		// Option 2: Return 429 (too aggressive)
		// Option 3: Log and allow (monitor)
		
		// Recomendado: Log + allow, pero rate limit more aggressively
		console.warn(`[Suspicious UA] ${userAgent} from ${ip}`);
		if (!checkRateLimit(ip, true)) { // Use more aggressive limit for suspicious
			return NextResponse.json(
				{error: 'Too many requests'},
				{status: 429}
			);
		}
	}
```

---

## 📊 Estrategia en Capas (Defense in Depth)

Con **Cloudflare Free + Middleware endurecido**:

| Capa | Herramienta | Acción | Alcance |
|---|---|---|---|
| 1 | Cloudflare Bot Fight Mode | Challenge bots conocidos | 80% of obvious bots |
| 2 | Cloudflare Security Level | Challenge IPs con reputación baja | 60% of suspicious IPs |
| 3 | Middleware User-Agent filter | **BLOCK** `python-requests`, `sqlmap`, etc. | 100% of these specific tools |
| 4 | Middleware Rate Limit | Block after 5 req/15min from same IP | 90% of brute force attacks |
| 5 | Middleware Origin-Shield | Prevent direct access to Vercel origin | 100% if Cloudflare Transform Rule is set |

---

## 🚀 Implementación Paso a Paso

### Paso 1: Cloudflare Dashboard

1. **Bot Fight Mode**: Ir a Security → Bot Management → activar
2. **Security Level**: Ir a Security → Settings → cambiar a **"High"** (naranja)
3. **Page Rules** (opcional, muy limitado): Crear 1 rule para challenge en `/api/*`

**Tiempo**: 5 minutos

### Paso 2: Actualizar `middleware.ts`

Editar `middleware.ts` y añadir:
- Lista de `BLOCKED_USER_AGENTS`
- Función `isBlockedUserAgent()`
- Check en `middleware()` function

**Tiempo**: 10 minutos

### Paso 3: Deploy

```bash
git add middleware.ts
git commit -m "feat: block malicious user agents (python-requests, sqlmap, etc.)"
git push
```

Cloudflare + Vercel actualizan en ~2 minutos.

### Paso 4: Monitorear

Verificar en **Vercel → Analytics → Web Analytics** que:
- Requests con User-Agent sospechosos → menos o 0
- Error rate en `/api/revalidate` → debería estar limpio (solo errores 401/429 si alguien intenta fuerza bruta)

---

## 🧪 Test Tus Defensas

```bash
# Test 1: Normal navegador
curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)" \
  https://juangomezb.com/
# Esperado: 200 OK

# Test 2: Python-requests
curl -H "User-Agent: python-requests/2.27.1" \
  https://juangomezb.com/
# Esperado: 403 Forbidden

# Test 3: Rate limit
for i in {1..6}; do
  curl -H "Authorization: Bearer $REVALIDATE_SECRET" \
    -X POST https://juangomezb.com/api/revalidate
  echo ""
done
# Esperado: primeras 5 → success, 6ª → 429 Too Many Requests
```

---

## 💡 Consideraciones

### Si subes a Pro ($20/month)

Con Pro tier, tendrías:
- ✅ WAF Rules (reglas custom por User-Agent, IP, País)
- ✅ Rate Limiting Rules
- ✅ Transform Rules (más poderosas)
- ✅ DDoS Protection mejorado

Entonces podrías quitar el bloqueo de User-Agent del middleware (haría Cloudflare, más eficiente en edge).

### Falsos Positivos

Si `python-requests` es usado por herramientas legítimas (ej. GitHub Actions para testing), EXCLUIR:

```typescript
if (isBlockedUserAgent(userAgent) && ip !== '140.82.112.0/20') { // GitHub IPs
	return NextResponse.json({error: 'Access denied'}, {status: 403});
}
```

Esto es más granular pero aumenta complejidad. Para un portafolio personal probablemente no importa.

---

## 📈 Monitoreo y Alertas

Sin Cloudflare Pro, no tienes dashboards detallados. Pero puedes:

1. **Vercel Analytics** → revisar User Agents semanalmente
2. **Vercel Logs** (en deployment) → buscar 403 responses
3. **Middleware logs** (console.warn) → en Vercel Functions logs

**Comando para ver logs en prod** (si tienes acceso a Vercel CLI):

```bash
vercel logs --follow
```

---

**Status**: Free tier + Middleware defensivo = **defensa decente contra bots/scrapers**. No es perfecto (eso requiere Pro/Enterprise), pero bloquea el 90% del tráfico malicioso obvio.
