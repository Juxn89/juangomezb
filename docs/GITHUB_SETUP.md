# GitHub Projects Integration

Este proyecto utiliza la API de GitHub GraphQL para mostrar los repositorios pinned en la sección de proyectos.

## Configuración del Token de GitHub (Opcional pero Recomendado)

### ¿Por qué necesito un token?

La API de GitHub GraphQL requiere autenticación para la mayoría de las peticiones. Sin un token:
- ❌ Las peticiones fallarán con error 403
- ✅ El sitio seguirá funcionando con datos de respaldo (fallback) desde `messages/en.json` y `messages/es.json`

Con un token:
- ✅ Datos reales de tus repositorios pinned de GitHub
- ✅ Actualización automática cada hora (ISR)
- ✅ 5000 peticiones/hora (vs 60 sin token)

### Cómo crear un Personal Access Token

1. Ve a [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Click en **"Generate new token"** → **"Generate new token (classic)"**
3. Dale un nombre descriptivo: `"Portfolio API"`
4. **NO necesitas seleccionar ningún scope/permiso** (repos públicos no requieren permisos)
5. Click en **"Generate token"**
6. Copia el token generado (solo se muestra una vez)

### Configurar el token en el proyecto

1. Copia el archivo `.env.local.example` a `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edita `.env.local` y pega tu token:
   ```env
   GITHUB_TOKEN=ghp_tu_token_aqui_1234567890abcdef
   ```

3. Reinicia el servidor de desarrollo:
   ```bash
   pnpm dev
   ```

### Verificar que funciona

1. Abre la consola del navegador (F12)
2. Navega a la sección de proyectos
3. Si funciona correctamente:
   - ✅ Verás tus repositorios pinned de GitHub
   - ✅ No verás mensajes de error en la consola del servidor

4. Si aún no funciona:
   - ⚠️ Verás: `"No GitHub projects found, using fallback data"`
   - ⚠️ Se mostrarán los proyectos de respaldo desde las traducciones

## Personalizar el Usuario de GitHub

El usuario está configurado en `src/components/sections/ProjectsSection.tsx`:

```typescript
let projects = await getPinnedProjects('juxn89', locale, 4);
```

Cambia `'juxn89'` por tu username de GitHub.

## Configuración Avanzada

### Cambiar el límite de proyectos mostrados

En `ProjectsSection.tsx`, cambia el último parámetro (actualmente `4`):

```typescript
let projects = await getPinnedProjects('juxn89', locale, 6); // Mostrar 6 proyectos
```

### Cambiar el tiempo de caché (ISR)

En `src/lib/github/api.ts`, línea ~94:

```typescript
next: {revalidate: 3600}, // 3600 segundos = 1 hora
```

Cambiar a 30 minutos:
```typescript
next: {revalidate: 1800}, // 1800 segundos = 30 minutos
```

## Datos de Respaldo (Fallback)

Los proyectos de respaldo están en:
- `messages/en.json` → `projects.items`
- `messages/es.json` → `projects.items`

Estos se usan cuando:
- No hay token de GitHub configurado
- La API de GitHub falla
- El rate limit se excede
- No hay repositorios pinned

## Solución de Problemas

### Error: "403 rate limit exceeded"
- **Causa**: No hay token configurado o el token es inválido
- **Solución**: Configura `GITHUB_TOKEN` en `.env.local`

### No se muestran los proyectos reales
- Verifica que el token esté en `.env.local` (no `.env.local.example`)
- Reinicia el servidor con `pnpm dev`
- Revisa la consola del servidor para mensajes de error

### Los proyectos no se actualizan
- El caché ISR es de 1 hora por defecto
- Fuerza rebuild: detén el servidor, borra `.next/` y ejecuta `pnpm dev`
- O reduce el valor de `revalidate` en la configuración

## Seguridad

⚠️ **NUNCA** commitees `.env.local` al repositorio.

El archivo `.gitignore` ya incluye:
```
.env.local
.env*.local
```

✅ **SÍ** commitea `.env.local.example` con valores de ejemplo.
