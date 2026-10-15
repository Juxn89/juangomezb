# Fase 0 · `dotnet-ai-template`: base compartida

> Índice: [`../README.md`](../README.md) · Duración: ~3 días hábiles · Repo: `juxn89/dotnet-ai-template`
> (GitHub template repository) · Versiones verificadas el 13 oct 2026.

## 1. Contexto

Los 4 proyectos comparten el 60-70% de su infraestructura: arquitectura, puerto de IA, medición de costos,
tests, CI, Docker y las reglas para agentes de IA. Escribirla una vez:

- Garantiza el **mismo nivel de calidad** en los 4. No vale que el cuarto sea más flojo por cansancio.
- Reduce cada proyecto a su **dominio**, que es lo que de verdad se vende.
- Es en sí misma una pieza de portfolio: un template .NET + IA que un cliente técnico puede reconocer como
  "así trabaja este developer".

No es un framework: es un **template** (botón *Use this template* de GitHub). Cada proyecto lo copia y diverge;
no hay un paquete compartido que versionar ni dependencias cruzadas entre repos.

## 2. Alcance

**Entra**
- Solución .NET 10 con la estructura de capas, un slice de ejemplo (`Health` + un CRUD trivial `Notes`) que se
  borra en cada proyecto, y el AppHost de Aspire.
- Puerto de IA con adaptadores Claude y Ollama, embeddings ONNX en proceso, y middleware de costo y tope de gasto.
- Tests de las 5 capas, configuración de evals, CI/CD y Docker.
- `.claude/` completo y `AGENTS.md`.
- Esqueleto Next.js 16 para el panel.

**No entra**
- Autenticación de usuarios finales: cada proyecto decide (P1 y P3 usan una clave de admin simple en la demo, y
  se documenta como "en producción: OIDC").
- Multi-tenancy: es específica de P1.
- Terraform o IaC: los despliegues se describen con `az containerapp` en un script documentado, sin módulos
  que nunca se aplican.

## 3. Arquitectura

```
src/
  App.Domain/            entidades, value objects, reglas. Cero dependencias de framework
  App.Application/       casos de uso por slice (Features/<Slice>/<UseCase>.cs) y puertos (interfaces)
  App.Infrastructure/    EF Core + Npgsql + pgvector, adaptadores de IA, Valkey, email
  App.Api/               Minimal APIs, ProblemDetails, rate limiting, OTel y DI
  App.AppHost/           Aspire: Postgres(pgvector), Valkey, Mailpit, Ollama (opcional) y la API
  App.ServiceDefaults/   OTel, health checks y resiliencia (estándar de Aspire)
web/                     Next.js 16 + Tailwind 4 (panel)
tests/
  App.Architecture.Tests   ArchUnitNET
  App.Domain.Tests         puros
  App.Application.Tests    con puertos falsos
  App.Integration.Tests    Testcontainers (Postgres real) + WebApplicationFactory
  App.Evals                evals de IA, ejecutable con umbral
  e2e/                     Playwright contra docker compose
deploy/
  compose.yaml             equivalente sin Aspire, para quien no tiene .NET
  azure/                   script de despliegue a Container Apps + README
```

**Vertical slices sobre Clean Architecture:** las capas se mantienen (y ArchUnitNET las vigila), pero dentro
de `Application` el código se organiza por feature y no por tipo técnico. Así un cliente que abre el repo
encuentra "Reservar cita" en una carpeta, no repartido entre `Services/`, `Dtos/` y `Validators/`.
**Sin MediatR:** cada caso de uso es una clase con un método `HandleAsync`, registrada en DI. El ADR explica
por qué no hace falta un mediador.

### Puerto de IA

```
Application/Abstractions/Ai/
  IChatClient, IEmbeddingGenerator   (de Microsoft.Extensions.AI.Abstractions: los puertos son el estándar)
  IAiUsageRecorder                   registra tokens, costo y latencia por operación
Infrastructure/Ai/
  Claude:   paquete `Anthropic` 12.55.0 (oficial, MIT), expuesto como IChatClient
  Ollama:   OllamaSharp 5.5.0 (IChatClient), perfil offline
  Embeddings: ONNX Runtime 1.31.0 + Microsoft.ML.Tokenizers 2.0.0 con `multilingual-e5-small`
  Pipeline:  ChatClientBuilder → .UseOpenTelemetry() → .Use(CostTrackingChatClient) → .Use(SpendCapChatClient)
```

- **`CostTrackingChatClient`:** un `DelegatingChatClient` que lee `ChatResponse.Usage` y multiplica por la
  tabla de precios, configurada en `AiOptions.Pricing` y nunca en el código. Emite métricas OTel
  (`ai.tokens.input`, `ai.tokens.output`, `ai.cost.usd`, etiquetadas por `operation` y `model`) y persiste una
  fila en `ai_usage` para el dashboard de costos.
- **`SpendCapChatClient`:** antes de cada llamada consulta en Valkey el gasto acumulado del día. Si supera
  `AiOptions.DailyBudgetUsd`, lanza `AiBudgetExceededException`, que la API traduce a un 429 con un
  ProblemDetails legible ("La demo alcanzó su cuota diaria, vuelve mañana"). Es la defensa contra una factura
  sorpresa.
- La selección del modelo por operación (`AiOptions.Models["chat"] = "claude-haiku-5-5"`) también es
  configuración.

## 4. Modelo de datos (base)

- `ai_usage(id, occurred_at, operation, model, input_tokens, output_tokens, cost_usd, latency_ms, correlation_id)`.
- `idempotency_keys(key, request_hash, response, created_at)` para los endpoints que escriben.
- Migraciones con EF Core 10 (`Npgsql.EntityFrameworkCore.PostgreSQL` 10.0.3, `Pgvector.EntityFrameworkCore` 0.3.0),
  aplicadas al arranque solo en Development y con un job en el despliegue.

## 5. Diseño de IA (transversal)

- **Salida estructurada:** cuando se espera JSON, `output_config.format` con JSON Schema, generado desde los
  records de C# para tener una sola fuente de verdad. Después siempre se valida otra vez en el dominio.
- **Prompts versionados** como archivos en `Infrastructure/Ai/Prompts/*.md`, con un hash del prompt en cada
  fila de `ai_usage`, para poder correlacionar un cambio de prompt con un cambio de costo o calidad.
- **Evals:** `Microsoft.Extensions.AI.Evaluation` 10.10.0 (Quality + Reporting) más evaluadores
  determinísticos propios. El ejecutable `App.Evals` lee un golden set de `tests/App.Evals/data/*.jsonl`,
  escribe `evals/results/<fecha>.json` y sale con código ≠ 0 si una métrica cae bajo su umbral
  (`evals/thresholds.json`).
- **Guardrails base:** límite de tamaño de input, redacción de PII en logs (emails, teléfonos y documentos de
  identidad por regex) y timeout por llamada.

## 6. Señales senior

| Señal | Dónde se ve |
|---|---|
| Regla de dependencia verificada | `App.Architecture.Tests` |
| Costo de IA medido y con tope | `CostTrackingChatClient`, `SpendCapChatClient`, dashboard de Aspire |
| Evals que bloquean el merge | job `evals` en CI con `thresholds.json` |
| Observabilidad de punta a punta | OTel en API, EF y LLM; trazas en el dashboard de Aspire |
| Sin dependencias comerciales | ADR-001 de licencias |
| Desarrollo asistido por IA con reglas | `.claude/`, `AGENTS.md` y el bot de review en los PRs |

## 7. ADRs

1. Licencias: Postgres, Valkey; sin MassTransit, MediatR ni AutoMapper.
2. Vertical slices sobre Clean Architecture, sin mediador.
3. Microsoft.Extensions.AI como puerto: por qué no Semantic Kernel (más superficie de la necesaria aquí).
4. Embeddings en proceso con ONNX: por qué no una API de embeddings de pago ni un sidecar.
5. Aspire para desarrollo y Docker Compose para quien no tiene .NET.

## 8. Tests

- **Arquitectura:** `TngTech.ArchUnitNET.xUnit` 0.13.4. Comprueba que Domain no depende de nada, que
  Application no depende de Infrastructure ni de Api, y que no hay referencias a `Microsoft.EntityFrameworkCore`
  fuera de Infrastructure.
- **Integración:** `Testcontainers.PostgreSql` 4.16.0 con la imagen `pgvector/pgvector`, fijada por tag y nunca
  `latest`.
- **Puerto de IA:** un `FakeChatClient` determinístico para los tests de Application. En los de integración,
  los adaptadores reales no se llaman: Claude solo corre en el job de evals, con un secret.
- **E2E:** `Microsoft.Playwright` 1.63.0 o `@playwright/test` desde `web/`.
- **Middleware de costo:** test unitario del cálculo y test de integración del tope (Valkey real con
  Testcontainers).

## 9. Hosting

Script `deploy/azure/deploy.sh`: crea el Container App con `min-replicas 0`, define los secrets
(`ANTHROPIC_API_KEY` y la connection string de Neon) y el health probe. El README de `deploy/` documenta el
free tier y el cold start. **Límite de gasto** en la consola de Anthropic, configurado a mano y anotado en el
README.

## 10. Plan día a día

| Día | Trabajo |
|---|---|
| 1 | Solución, capas, AppHost, ServiceDefaults, `compose.yaml`, slice `Notes`, ArchUnitNET, `.editorconfig` con analizadores, `AGENTS.md` y `CLAUDE.md` |
| 2 | Puerto de IA: adaptadores Claude, Ollama y ONNX; `CostTracking` y `SpendCap`; tabla `ai_usage`; proyecto `App.Evals` con un eval de ejemplo |
| 3 | CI/CD (build, test, evals, GHCR, CodeQL, Dependabot), `.claude/` completo, esqueleto `web/`, script de Azure, marcar el repo como template |

## 11. GitHub metadata

- **Descripción:** "Production-ready .NET 10 + AI template: Clean Architecture, Microsoft.Extensions.AI with Claude/Ollama, cost tracking & spend caps, evals in CI, Aspire, Testcontainers."
- **Topics:** `dotnet`, `csharp`, `aspnetcore`, `clean-architecture`, `vertical-slice-architecture`, `microsoft-extensions-ai`, `claude`, `anthropic`, `ollama`, `llm`, `evals`, `aspire`, `postgresql`, `pgvector`, `testcontainers`, `opentelemetry`, `template`

Este repo **no** lleva ficha de Workana propia: se menciona en las de los 4 proyectos.

### `.claude/` del template (lo que heredan los 4)

```
AGENTS.md                         stack fijado, regla de dependencias, constantes, pirámide de tests, gate
CLAUDE.md                         @AGENTS.md
.claude/
  settings.json                   permisos (dotnet build/test/format, docker compose) y hooks
  rules/
    code-style.md                 C# 14, tabs, nullable, sin magic strings
    testing.md                    qué test va en qué proyecto; nada se cierra sin correrlo
    api-conventions.md            Minimal APIs, ProblemDetails, idempotency keys, versionado
    ai.md                         modelos por config, prompts como archivos, todo cambio de prompt pasa por evals
  skills/
    add-endpoint/SKILL.md         /add-endpoint <Entity> <Action>: slice + validación + test de integración + build/test
    add-eval-case/SKILL.md        /add-eval-case: añade un caso al golden set y corre los evals
  agents/
    code-reviewer.md              revisa contra rules/
    security-auditor.md           OWASP API Top 10 + prompt injection
  hooks/
    format.sh                     PostToolUse Edit|Write en *.cs → dotnet format --include <archivo>
```

Además, el workflow `.github/workflows/review.yml` usa `juxn89/claude-pr-review-bot` en cada PR.

## 12. Verificación

- `dotnet build -warnaserror` y `dotnet test` en verde. El AppHost arranca y el dashboard muestra trazas de
  una llamada a `/notes`.
- `docker compose -f deploy/compose.yaml up --wait` → `curl /health` responde 200.
- Con `DailyBudgetUsd = 0.0001`, la segunda llamada de IA devuelve el 429 con ProblemDetails.
- `dotnet run --project tests/App.Evals` escribe resultados y falla si se baja el umbral a propósito.
- Crear un repo desde el template y comprobar que el CI del repo nuevo pasa sin tocar nada.
- Editar un `.cs` con Claude Code dispara el hook de formato, y un PR de prueba recibe la review del bot.
