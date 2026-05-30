# 🛠️ Setup Guide

Guía completa de configuración inicial del proyecto después de clonar el repositorio.

---

## 📋 Prerequisitos

### Software Requerido
- **Node.js**: 24.x o superior ([Download](https://nodejs.org/))
- **pnpm**: 9.0.0 o superior
  ```powershell
  npm install -g pnpm
  ```
- **Git**: Para control de versiones
- **VS Code**: Editor recomendado con extensiones:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

---

## 🚀 Instalación Rápida

### 1. Clonar el Repositorio
```bash
git clone git@github.com:juxn89/juangomezb.git
cd juangomezb
```

### 2. Configurar Node Version (Opcional con NVM)
```bash
nvm use
# o si no tienes NVM instalado:
# Asegúrate de tener Node.js 24.x instalado
```

### 3. Instalar Dependencias
```bash
pnpm install
```

### 4. Configurar Variables de Entorno
```bash
# Copiar el archivo de ejemplo
cp .env.local.example .env.local

# Editar .env.local y configurar:
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Ejecutar en Modo Desarrollo
```bash
pnpm run dev
```

El sitio estará disponible en `http://localhost:3000/en`

---

## ⚙️ Configuración de Git

### Importante: Remote Configuration
Este proyecto usa un remote SSH llamado `origin-ssh` en lugar del estándar `origin`.

```bash
# Verificar remotes configurados
git remote -v

# Si necesitas configurar el remote:
git remote add origin-ssh git@github.com:juxn89/juangomezb.git

# Para push:
git push origin-ssh main
git push origin-ssh feature/nombre-rama
```

### Branches Principales
- **main**: Producción (https://www.juangomezb.com)
- **feature/ai-v2**: Rama de desarrollo actual con todas las mejoras

---

## 📦 Scripts Disponibles

```bash
# Desarrollo
pnpm run dev          # Servidor de desarrollo (puerto 3000)
pnpm run dev -- -p 3001  # Servidor en puerto alternativo

# Build
pnpm run build        # Build para producción
pnpm run start        # Ejecutar build de producción

# Código
pnpm run lint         # Ejecutar ESLint
pnpm run lint:fix     # Corregir errores de linting automáticamente
pnpm run type-check   # Verificar tipos TypeScript

# Limpieza
pnpm run clean        # Limpiar .next y cache
```

---

## 🌍 Internacionalización (i18n)

### Configuración de Zona Horaria
**CRÍTICO**: Para evitar warnings de `ENVIRONMENT_FALLBACK`, la zona horaria debe estar configurada en **DOS lugares**:

1. **`i18n.ts` (línea 13)**:
   ```typescript
   timeZone: 'America/Managua'
   ```

2. **`src/app/[locale]/Providers.tsx` (líneas 15-19)**:
   ```typescript
   const messages = await getMessages();
   const timeZone = 'America/Managua';
   ```

### Agregar Nueva Traducción
1. Editar `messages/en.json`
2. Editar `messages/es.json` (misma estructura)
3. Usar en componentes:
   ```tsx
   // Server Component
   const t = await getTranslations('namespace');
   
   // Client Component
   const t = useTranslations('namespace');
   ```

---

## 🎨 Sistema de Diseño

### Paleta de Colores: Forest Code
El proyecto usa la paleta **Forest Code** con colores definidos en `src/app/globals.css`:

- **Primary**: Emerald green (#047857 light / #10B981 dark)
- **Secondary**: Violet (#7C3AED light / #A78BFA dark)
- **Tertiary**: Amber (#FBBF24 light / #FCD34D dark)

### Dark Mode
- Automático basado en preferencia del sistema
- Toggle manual disponible en el navbar
- Implementado con CSS variables + Context API

---

## 🔧 Problemas Conocidos y Soluciones

### 1. Puerto 3000 en Uso
**Síntoma**: Error `Port 3000 is already in use`

**Solución**:
```powershell
# Opción 1: Usar puerto alternativo
pnpm run dev -- -p 3001

# Opción 2: Matar proceso en el puerto
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

### 2. pnpm-workspace.yaml Error
**Síntoma**: Error sobre `packages` field

**Solución**: Ya está configurado correctamente en el repositorio:
```yaml
packages:
  - '.'
```

### 3. Tailwind CSS 4 Sintaxis
**IMPORTANTE**: Tailwind CSS 4 cambió la sintaxis de gradientes:
- ❌ Antiguo: `bg-gradient-to-r`
- ✅ Nuevo: `bg-linear-to-r`

### 4. Lucide-react Icons Faltantes
Los íconos `Github` y `Linkedin` no existen en lucide-react. El proyecto usa **componentes SVG custom** en:
- `src/components/sections/HeroSection.tsx` (líneas 61-79)

### 5. Gradient Text Clipping
Las letras con "descenders" (j, g, p, q, y) pueden cortarse. Solución aplicada:
```css
.gradient-text {
  padding-bottom: 0.25rem;
  line-height: 1.25;
}
```

---

## 📝 Dev.to Integration

### Configuración
- **Username**: `jgomezdev`
- **API Endpoint**: `https://dev.to/api/articles?username=jgomezdev`
- **Cache Strategy**: ISR con revalidación cada 3600 segundos (1 hora)

### Actualizar Username
Editar `src/app/[locale]/blog/page.tsx`:
```typescript
const response = await fetch(
  'https://dev.to/api/articles?username=TU_USERNAME',
  {next: {revalidate: 3600}}
);
```

---

## 🚀 Deployment (Vercel)

### Variables de Entorno en Producción
```bash
NEXT_PUBLIC_SITE_URL=https://www.juangomezb.com
```

### Build Settings
- **Framework Preset**: Next.js
- **Build Command**: `pnpm run build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`
- **Node Version**: 24.x

### Domains Configurados
- **Primary**: www.juangomezb.com
- **Redirect**: juangomezb.com → www.juangomezb.com

---

## 🧪 Testing

### Verificar Build Localmente
```bash
# Build
pnpm run build

# Ejecutar build
pnpm run start
```

### Verificar Lighthouse
1. Abrir DevTools
2. Tab "Lighthouse"
3. Generar reporte
4. Objetivo: 90+ en todas las métricas

---

## 📚 Recursos Adicionales

### Documentación del Proyecto
- **README.md**: Descripción general del proyecto
- **AGENTS.md**: Guías para AI agents (código)
- **CLAUDE.md**: Referencia a AGENTS.md
- **CHANGELOG.md**: Historial de cambios
- **DEVELOPMENT.md**: Contexto de desarrollo y decisiones

### Documentación Externa
- [Next.js 16 Docs](https://nextjs.org/docs)
- [React 19 Docs](https://react.dev/)
- [Tailwind CSS 4 Docs](https://tailwindcss.com/docs)
- [next-intl Docs](https://next-intl-docs.vercel.app/)
- [Framer Motion Docs](https://www.framer.com/motion/)

---

## ⚡ Quick Start Checklist

Después de formatear tu laptop, sigue esta lista:

- [ ] Instalar Node.js 24.x
- [ ] Instalar pnpm globalmente
- [ ] Clonar repositorio
- [ ] Ejecutar `pnpm install`
- [ ] Copiar `.env.local.example` a `.env.local`
- [ ] Ejecutar `pnpm run dev`
- [ ] Verificar que el sitio carga en `http://localhost:3000/en`
- [ ] Verificar que el toggle de idioma funciona (en/es)
- [ ] Verificar que el dark mode funciona
- [ ] Configurar Git remote `origin-ssh` si es necesario

---

**¡Listo para desarrollar!** 🎉

Si encuentras algún problema, revisa la sección de **Problemas Conocidos** o consulta **AGENTS.md** para guías de código específicas.
