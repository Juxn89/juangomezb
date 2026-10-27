# Fase 0 · `dotnet-ai-template`: base compartida

> Índice: [`../README.md`](../README.md) · Duración: ~3 días hábiles · Repo: `Juxn89/dotnet-ai-template`
> (GitHub template repository, público) · Plan original del 13 oct 2026, **revisado el 27 oct 2026** (§0).

## 0. Qué cambió en la revisión (27 oct 2026)

El plan original se escribió antes de P1. El template se iba a extraer de P1 cuando estuviera estable, pero cada
proyecto terminó copiando la base del anterior. Con P1-P4 terminados, el template se extrae de **lo que los cuatro
repitieron de verdad**, no de lo que se pensó el 13 de octubre.

### Decisiones del 27 oct 2026 (aprobadas por el usuario)

| Decisión | Elección |
|---|---|
| Alcance | Lo que repitieron P1-P4. Sin Valkey, Ollama, ONNX ni script de Azure: ningún proyecto los usó (Ollama además solo se permite en contenedor) |
| Publicación | Repo **público**, marcado como *template* en GitHub, con README según el gist y entrada en el portfolio. Sin ficha de Workana |
| Presupuesto | Tope **USD 0,10** en Claude (sesión `workana-dotnet-ai-template` del ledger) para probar el slice de IA, el tope de gasto y una corrida de evals chica |

### Qué se cae y qué entra respecto al plan original

| Plan del 13 oct | Revisión |
|---|---|
| Valkey para el gasto del día | El gasto se suma desde la tabla `ai_usage` en Postgres, como hicieron P3 y P4. Una pieza menos |
| Ollama como adaptador offline | Fuera. El puerto `IChatClient` lo permite, pero el template no lo trae |
| Embeddings ONNX | Fuera: solo P1 hace RAG |
| `deploy/azure` y `compose.yaml` | Fuera: las demos son video. Queda el AppHost de Aspire |
| `M.E.AI.Evaluation` | Fuera. Entra el harness que usaron los cuatro: oráculo gratis en CI, corrida pagada con guarda del ledger y resultados versionados |
| `.claude/` (solo lo tenía P1) | Se mantiene y se completa: es lo que más se nota en un template |
| — | Entran las piezas que se repitieron y no estaban en el plan: grabador de demo (screencast de Chromium + ffmpeg en contenedor), `readme-assets.mjs`, `docs/errors.md`, `dependabot.yml` agrupado, `minimumReleaseAge` en pnpm |

## 1. Contexto

Los cuatro proyectos comparten el 60-70 % de su infraestructura: capas, AppHost, puerto de IA con medición de
costo, evals, tests, CI, la web y las reglas para agentes. Tenerlo en un template:

- Deja cada proyecto nuevo en su **dominio** desde el día 1.
- Fija el **mismo nivel de calidad**: el quinto proyecto arranca con E2E, evals y tope de gasto, no los agrega al final.
- Es una pieza de portfolio en sí: un cliente técnico ve "así trabaja este developer" en un solo repo.

No es un framework: es un **template** (botón *Use this template*). Cada proyecto lo copia y diverge; no hay
paquete compartido ni dependencias entre repos. Un script lo renombra al crear el proyecto.

## 2. Alcance del MVP

**Entra**
- Solución .NET 10 en capas (`App.Domain`, `App.Application`, `App.Infrastructure`, `App.Api`), AppHost de Aspire
  con Postgres y la web, y ServiceDefaults.
- Un **slice de ejemplo** que se borra en cada proyecto: `Notes` (CRUD mínimo) y `Summarize`, que pide a Claude un
  resumen y etiquetas con salida estructurada.
- **Puerto de IA:** `IChatClient` de Microsoft.Extensions.AI con el adaptador oficial `Anthropic`, un
  `MeteredChatClient` que registra tokens, costo y latencia en `ai_usage`, y un tope de gasto diario y por
  operación. Un cliente guionado para tests, E2E y ensayos de demo.
- **Evals:** proyecto `App.Evals` con `oracle` (gratis, en CI) y `run --allow-paid` (guarda del ledger, resultados
  en `evals/results`).
- **Tests:** dominio, aplicación, arquitectura (ArchUnitNET) e integración (Testcontainers + WebApplicationFactory).
- **Web:** Next.js 16 + Tailwind 4 con la página de notas, ES/EN, Playwright E2E con el cliente guionado y el
  grabador de demo.
- **CI:** build/format/tests/oráculo, web (lint, tipos, build) y E2E; `review.yml` con claude-pr-review-bot;
  `dependabot.yml` agrupado.
- **Para agentes:** `AGENTS.md`, `CLAUDE.md` y `.claude/` (rules, skills, agents, hooks).
- **Docs:** README según el gist con su arte generado, ADRs, `docs/errors.md`, y la guía "crear un proyecto".
- `scripts/rename.mjs`: renombra `App` y el slug en carpetas, proyectos, namespaces y textos.

**No entra**
- Autenticación de usuarios, multi-tenancy, despliegue, RAG, colas. Cada proyecto decide.

## 3. Arquitectura

```
src/
  App.Domain/            entidades y reglas; solo NodaTime
  App.Application/       casos de uso por slice (Features/<Slice>/) y puertos; Result/Error
  App.Infrastructure/    EF Core + Npgsql, Ai/ (Anthropic, Metered, Scripted, Prompts/*.md), migraciones
  App.Api/               Minimal APIs por slice, ProblemDetails con código estable, rate limiting
  App.AppHost/           Aspire: Postgres 18 persistente, la API y la web; la key desde el .env git-ignored
  App.ServiceDefaults/   OTel, health checks y resiliencia
web/                     Next.js 16 + Tailwind 4: notas, ES/EN, e2e/, e2e/demo/, scripts/readme-assets.mjs
evals/
  App.Evals/             oracle | run --allow-paid; PaidRun con la guarda del ledger
  notes.json             golden set del ejemplo
  results/               corridas versionadas, también las que fallan
tests/
  App.Domain.Tests  App.Application.Tests  App.Architecture.Tests  App.Integration.Tests
scripts/rename.mjs
docs/adr/  docs/errors.md  docs/demo/  docs/readme/
```

**Vertical slices sobre capas, sin mediador:** cada caso de uso es una clase con `ExecuteAsync`, registrada en DI.

### Puerto de IA (lo que hicieron P3 y P4, unificado)

```
Application/Abstractions/Ai: IChatClient (M.E.AI), IAiUsageLog (gasto del día), AiOptions (modelo y topes)
Infrastructure/Ai:
  AnthropicChatClient   adaptador oficial `Anthropic` → IChatClient, Haiku 5.5 por defecto, effort low
  MeteredChatClient     DelegatingChatClient: tokens × precio (AiOptions.Pricing), fila en ai_usage, tope diario
                        y por operación (se rechaza antes de llamar si el día ya se gastó)
  ScriptedChatClient    respuestas desde un JSON; solo en Development/Testing (la API se niega a arrancar si no)
  Prompts/*.md          prompts como archivos, con su hash guardado en ai_usage
```

- Salida estructurada con JSON Schema generado desde los records de C#, y validación otra vez en el dominio.
- Sin key: los endpoints de IA responden 503 con `ai.not_configured`; el resto de la app funciona.
- Tope alcanzado: 503 con `ai.daily_budget` y un mensaje legible.

## 4. Modelo de datos

- `notes(id, title, body, created_at)` · `note_summaries(note_id, summary, tags, created_at)`: del ejemplo, se borran.
- `ai_usage(id, occurred_at, operation, model, input_tokens, output_tokens, cost_usd, latency_ms, prompt_hash)`: se queda.
- Migraciones con EF Core, aplicadas al arranque solo en Development.

## 5. Diseño de IA

- **Modelo:** `claude-haiku-5-5` para todo, como P1-P4; por configuración, nunca en el código.
- **Prompt del ejemplo:** "resume la nota en una frase y propone hasta 3 etiquetas de una lista"; esquema con
  `summary` y `tags` (enum de la lista), validado después en el dominio.
- **Guardrails base:** límite de tamaño de entrada, el texto del usuario va entre etiquetas como dato, timeout por llamada.
- **Evals:** 10 notas en `evals/notes.json` (6 ES, 4 EN) con las etiquetas esperadas y palabras que el resumen
  debe mencionar. Métricas: etiquetas correctas, resumen en el idioma de la nota, costo medio. Umbral en el
  propio harness: ≥ 0,9 de etiquetas correctas.
- **Costo esperado:** ~USD 0,0003 por resumen; la corrida de evals completa, unos USD 0,005.

## 6. Señales senior

| Señal | Dónde se ve |
|---|---|
| Regla de dependencias verificada | `App.Architecture.Tests` |
| Costo de IA medido y con tope | `MeteredChatClient`, tabla `ai_usage`, test de integración del tope |
| Evals con oráculo en CI y corridas versionadas | `evals/`, job del CI |
| E2E sin key ni costo | `ScriptedChatClient` + Playwright en el CI |
| Supply chain | regla de dos semanas en NuGet y pnpm, `dependabot.yml` agrupado, solo licencias OSI |
| Desarrollo asistido por IA con reglas | `AGENTS.md`, `.claude/`, el bot de review en cada PR |

## 7. ADRs

1. Licencias: solo OSI; Postgres; sin MediatR, AutoMapper ni MassTransit.
2. Vertical slices sobre capas, sin mediador.
3. Microsoft.Extensions.AI como puerto, con el adaptador oficial de Anthropic.
4. El costo se mide en cada llamada y el tope se aplica antes de llamar (por qué en Postgres y no en Valkey).
5. Evals: oráculo gratis en CI y corridas pagadas a mano con guarda del ledger.

## 8. Tests

- **Dominio y aplicación:** puros, con puertos falsos.
- **Arquitectura:** ArchUnitNET (Domain solo NodaTime; Application sin Infrastructure ni Api; EF solo en Infrastructure).
- **Integración:** Testcontainers con Postgres 18 fijado por tag + WebApplicationFactory; el tope de gasto con
  un `ai_usage` precargado.
- **Evals:** el oráculo corre el harness completo con respuestas de referencia.
- **E2E:** Playwright con el cliente guionado: crear nota, resumir, ver etiquetas y costo.

## 9. Demo

Video corto y capturas del ejemplo, grabados con el mismo grabador de P3 y P4, para el README y el portfolio.
Sin demo pública: es un template.

## 10. Plan día a día

| Día | Trabajo |
|---|---|
| 1 | Repo y regla de versiones verificada ese día; solución en capas, AppHost, ServiceDefaults; slice `Notes`; ArchUnitNET; integración con Testcontainers; `AGENTS.md`, `CLAUDE.md`; CI build/format/tests |
| 2 | Puerto de IA: adaptador Anthropic, `MeteredChatClient`, `ai_usage`, tope; `ScriptedChatClient`; slice `Summarize`; `App.Evals` con oráculo y corrida pagada; ADRs |
| 3 | Web (notas, ES/EN), E2E en el CI, grabador de demo; `.claude/` completo; `scripts/rename.mjs` probado creando un repo desde el template; README con su arte; marcar como template; portfolio |

## 11. GitHub metadata

- **Descripción:** "Production-ready .NET 10 + AI template: layered vertical slices, Microsoft.Extensions.AI with Claude, cost tracking & spend caps, evals in CI, Aspire, Testcontainers, Next.js + Playwright."
- **Topics:** `dotnet`, `csharp`, `aspnetcore`, `clean-architecture`, `vertical-slice-architecture`, `microsoft-extensions-ai`, `claude`, `anthropic`, `llm`, `evals`, `aspire`, `postgresql`, `testcontainers`, `opentelemetry`, `nextjs`, `playwright`, `template`
- **Paleta del README (propuesta):** pizarra `#334155` · lima `#84cc16` · ámbar `#f59e0b`, que no repite las de P1-P4.

Este repo **no** lleva ficha de Workana: se menciona en las de los cuatro proyectos.

### `.claude/` del template

```
AGENTS.md                         stack fijado, regla de versiones, dependencias, sin magic strings, ledger
CLAUDE.md                         @AGENTS.md
.claude/
  settings.json                   permisos (dotnet build/test/format, pnpm lint/typecheck) y el hook
  rules/      code-style.md · testing.md · api-conventions.md · ai.md
  skills/     add-endpoint/SKILL.md · add-eval-case/SKILL.md
  agents/     code-reviewer.md · security-auditor.md
  hooks/      format.sh (PostToolUse sobre *.cs → dotnet format whitespace --include <archivo>)
```

## 12. Verificación / terminado

- `dotnet build` (warnings como errores) y `dotnet test` en verde; el oráculo de evals en verde.
- El AppHost arranca y el dashboard muestra la traza de un resumen con la llamada a Claude.
- Con `DailyBudgetUsd` mínimo, la segunda llamada devuelve 503 `ai.daily_budget`; está cubierto por un test.
- La corrida pagada de evals pasa el umbral y queda en el ledger.
- Un repo creado desde el template y renombrado con `scripts/rename.mjs` pasa su CI sin tocar nada.
- Editar un `.cs` con Claude Code dispara el hook de formato, y un PR recibe la review del bot.
- README revisado en GitHub en los dos temas; entrada en el portfolio publicada; recursos Docker del template
  borrados al cerrar.

## Versiones

Se verifican el día 1 contra api.nuget.org y npm (al menos dos semanas desde su publicación, licencia OSI) y se
anotan con fecha en `Directory.Packages.props` y `web/package.json`.
