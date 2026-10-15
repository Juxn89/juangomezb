# Workana: planes por proyecto (.NET + IA) en `docs/workana/`

> **Nota:** este es el plan aprobado (13 oct 2026). La fuente de verdad, ya refinada, son los planes por proyecto en [`docs/workana/`](../workana/README.md). Por ejemplo, P4 cambió de "el LLM genera SQL" a "consulta semántica compilada por el servidor".

## Context

Estás aplicando a **Workana**, donde el comprador es casi siempre una PyME no técnica que decide viendo
capturas, un video o una demo. Hacen falta 4 proyectos que ese cliente reconozca como "esto es lo que
necesito", y que por debajo demuestren seniority (arquitectura, concurrencia, pruebas, observabilidad) y un
uso de IA serio: salida estructurada validada, evals, guardrails y costo por request.

El catálogo anterior (`feat/projects`) apuntaba a entrevistadores técnicos: HR-tech, sin demo y Ollama
local. Esa línea queda en pausa.

**Fuentes:** `ideas/Top 20 .NET Projects.pdf` (#1, #10, #13), la lista "C# Projects for the AI Era", las
imágenes de estructura `.claude/` (rules, skills, agents, hooks) y la de "Engineering fundamentals".

### Decisiones tomadas
| Decisión | Elección |
|---|---|
| Línea | Nueva línea Workana. `talent-match`/`talent-flow` pasan a backlog. `talent-mcp` v1.1.0 y `claude-pr-review-bot` se publican en Workana como ya están |
| LLM | Puerto Microsoft.Extensions.AI. Claude (Haiku por defecto, Sonnet donde haga falta) en la demo con tope de gasto. Ollama como adaptador offline |
| Demos | Mixto según el tipo: pública en P1-P3 y video + capturas en P4 (justificado en su plan) |
| Alcance | 4 proyectos de ~2 semanas cada uno, más ~3 días de template compartido |
| Documentación | **Un plan por proyecto** en `docs/workana/<proyecto>/plan.md` |
| De `feat/projects` | Solo lo indispensable (ver Paso 1) |

---

## Paso 1 — Traer lo mínimo de `feat/projects`

`feat/projects` (3 commits sobre `develop`) **solo contiene documentación**: `featured-projects-catalog.md`,
`a1/a2/a3-*.md` y `portfolio-projects-section.md`. No hay código que traer.

- **Se trae solo** `docs/plans/portfolio-projects-section.md`
  (`git checkout feat/projects -- docs/plans/portfolio-projects-section.md`) en la rama actual
  `feat/enhance-projects`. Es el único indispensable: define el modelo `Project`, `/projects/[slug]` y cómo
  se añade un proyecto editando `messages/{en,es}.json`. Sin eso, los proyectos de Workana no tienen dónde
  aparecer en el portfolio.
- **Ajustes mínimos al traerlo** (es una edición, no una reescritura):
  1. Se restaura `demoUrl?: string` en el modelo `Project`, y la tarjeta renderiza el botón "Ver demo" solo
     si el campo existe (antes se eliminaba porque no iba a haber demos). La clave `projects.viewDemo`
     **se conserva**.
  2. Se añade `videoUrl?: string`, opcional, para P4.
  3. Una nota de contexto arriba enlaza a `docs/workana/README.md`. Los enlaces a A1/A2/A3 y al catálogo se
     marcan como "en `feat/projects`, en pausa", para no dejar links rotos.
- **No se traen** el catálogo ni los planes A1/A2/A3: siguen en `feat/projects`. Los lineamientos
  transversales que importan (licencias, Clean Architecture, sin magic strings, E2E y verificar antes de
  aplicar) se resumen en `docs/workana/README.md`, sin copiar el catálogo entero.

## Paso 2 — Crear `docs/workana/`

```
docs/workana/
  README.md                      ← índice, decisiones, lineamientos, calendario, checklist "terminado"
  dotnet-ai-template/plan.md     ← fase 0, base compartida
  docs-assistant/plan.md         ← P1
  invoice-extractor/plan.md      ← P2
  booking-agent/plan.md          ← P3
  data-chat/plan.md              ← P4
```

Regla de nombres heredada: **carpeta = repo GitHub = slug del portfolio**, en kebab-case.
Al publicar cada proyecto se añade en su carpeta un `workana.md` con la ficha final (no se crea ahora).

**Todos los `plan.md` usan la misma estructura**, para poder compararlos y ejecutarlos igual:
1. Contexto y pitch para el cliente (1 párrafo en lenguaje de negocio)
2. Alcance del MVP: entra / no entra
3. Arquitectura: proyectos de la solución, diagrama de componentes y flujo principal
4. Modelo de datos
5. Diseño de IA: prompts, esquema de salida, modelo y por qué, guardrails, evals con umbral y costo esperado
6. Señales senior (qué demuestra y dónde se ve en el repo)
7. ADRs a escribir
8. Tests: unit, arquitectura, integración (Testcontainers), evals y E2E
9. Demo y hosting, con límites de abuso
10. Plan día a día (10 días hábiles)
11. GitHub metadata (descripción y topics) y borrador de la ficha Workana en ES
12. Verificación / definición de terminado

Las versiones (Aspire, Microsoft.Extensions.AI, SDK de Anthropic para .NET, PdfPig, free tiers de hosting)
se verifican contra la fuente al escribir cada plan y se anotan con fecha (lineamiento 9).

---

## Contenido de cada plan

### `README.md` (índice)
- Contexto Workana y las decisiones de la tabla de arriba.
- Lineamientos resumidos:
  - Licencias OSI verificadas en ADR: Postgres en vez de SQL Server o Mongo, Valkey en vez de Redis, y nada de MassTransit, MediatR ni AutoMapper.
  - Clean Architecture con ArchUnitNET en CI, sin magic strings ni magic numbers.
  - E2E contra el stack real y "verificar antes de aplicar".
  - `AGENTS.md`/`CLAUDE.md` propios por repo desde el día 1.
- Calendario: sem 0 template · sem 1-2 P1 · 3-4 P2 · 5-6 P3 · 7-8 P4. En la semana 1, en paralelo, fichas
  de Workana para `talent-mcp` y `claude-pr-review-bot` (1 día).
- **Checklist de "terminado"**, común a todos:
  1. README que abre con el problema de negocio y `docker compose up`, con diagrama, ADRs y resultados de evals y costos.
  2. Video de 60-90 s y 4-5 capturas de 1280×800.
  3. `workana.md` con la ficha en ES.
  4. Entrada en `messages/{en,es}.json`.
  5. CI verde con evals por encima del umbral.
- Dependencia: implementar `portfolio-projects-section.md` antes del cierre de P1 (semana 2).

### `dotnet-ai-template/plan.md`: base compartida (~3 días)
Template repo del que nacen los 4:
- .NET 10 / C# 14 con vertical slices sobre Clean Architecture (`Domain`/`Application`/`Infrastructure`/`Api`), Minimal APIs, ProblemDetails e `IOptions<T>` validadas al arranque.
- **.NET Aspire AppHost** (Postgres+pgvector, Valkey, Mailpit, dashboard OTel), más un `docker compose` equivalente.
- **Puerto de IA:** `IChatClient`/`IEmbeddingGenerator` con adaptadores Claude y Ollama, más un middleware propio de medición de tokens y costo y de **tope de gasto diario**.
- Rate limiting nativo, headers de seguridad y CORS por tenant.
- Tests: xUnit, Testcontainers, ArchUnitNET, un proyecto `Evals` con umbral en CI y Playwright.
- GitHub Actions (build, test, evals, GHCR), Dependabot y CodeQL.
- **Desarrollo asistido por IA visible:** `AGENTS.md`, `CLAUDE.md → @AGENTS.md` y `.claude/` con `rules/` (estilo, testing, API), `skills/add-endpoint`, `agents/` (code-reviewer y security-auditor) y `hooks/` (`dotnet format` en PostToolUse). **`claude-pr-review-bot` revisa los PRs** de los 4 repos.
- Front: Next.js 16 + Tailwind 4.
- Hosting base: Vercel, un contenedor con scale-to-zero en un free tier (candidatos a verificar: Azure Container Apps o Render) y Neon/Supabase free con pgvector. Límite de gasto en la consola de Anthropic y reset nocturno de los datos de demo.

### `docs-assistant/plan.md`: P1, chatbot de soporte con RAG embebible
*Pitch: "Responde a tus clientes 24/7 con tus documentos y te pasa la conversación cuando no sabe." Demo: **pública, embebida en juangomezb.com** respondiendo sobre tu CV y tus artículos de DEV.to.*
- Admin multi-tenant: ingesta de PDF, DOCX y URLs → chunking → embeddings → búsqueda híbrida con pgvector + full-text de Postgres.
- Widget `<script>` de una línea (TS sin framework, Shadow DOM), streaming SSE y citas a la fuente.
- Handoff a humano: si la confianza baja, se captura el lead y se envía por email.
- Guardrails: prompt injection, preguntas fuera de alcance y PII redactada en logs.
- Señales senior: eval de faithfulness y relevancy sobre un golden set en CI, costo y latencia por conversación, caché semántica en Valkey, aislamiento por tenant testeado e ingesta con `Channel<T>` y reintentos.
- Integración en el portfolio: Client Component con `next/dynamic` (sin afectar LCP) y el dominio de la API en el `connect-src` de la CSP del middleware.

### `invoice-extractor/plan.md`: P2, lectura de facturas y recibos
*Pitch: "Sube fotos o PDFs de facturas y recibe un Excel listo para contabilidad." Demo: **pública** con muestras precargadas y cuota por IP.*
- PdfPig para texto, visión de Claude para imágenes y salida estructurada contra un JSON Schema.
- **Validación determinística después del LLM:** las líneas suman el subtotal, impuesto, total, RUC/NIT y fechas. Si algo falla, la factura va a una cola de revisión humana con el campo resaltado.
- Confianza por campo, deduplicación por hash (idempotencia) y export a Excel (ClosedXML) y CSV.
- Señales senior: cola en Postgres con `FOR UPDATE SKIP LOCKED`, eval de precisión por campo sobre ~30 facturas sintéticas con los resultados versionados y costo por documento visible en la UI.

### `booking-agent/plan.md`: P3, agenda de citas con asistente conversacional
*Pitch (clínicas y salones): "Tus clientes reservan escribiendo 'quiero cita el martes en la tarde con la Dra. López' y reciben recordatorios." Demo: **pública**, con notificaciones en una bandeja in-app.*
- Agente con tool calling (`check_availability`, `book`, `reschedule`, `cancel`, `list_services`) y confirmación obligatoria antes de cualquier escritura.
- **Cero doble reserva:** exclusion constraint (`tstzrange` + `btree_gist`) e idempotency keys. Un test dispara 50 reservas concurrentes al mismo slot y debe entrar 1.
- Zonas horarias, horarios por profesional, recordatorios detrás de un puerto (email por defecto, WhatsApp como adaptador opcional) y calendario admin con SignalR.
- Señales senior: evals multi-turno (sin reservas alucinadas, la confirmación siempre se pide), traza OTel por paso del agent loop y límite de iteraciones y de costo.

### `data-chat/plan.md`: P4, "pregúntale a tus ventas"
*Pitch: "Sube tu Excel de ventas y pregunta en español; la respuesta llega con gráfico." Demo: **video + capturas**.*
- Import de CSV o Excel → capa semántica (métricas y dimensiones con nombre de negocio) → el LLM genera SQL → gráfico según la forma del resultado.
- SQL seguro: rol de solo lectura, parseo con allow-list de tablas y funciones, `statement_timeout` y `LIMIT` forzado. Se muestran la consulta generada y su explicación.
- Señales senior: eval de exactitud sobre un dataset seed, pruebas adversariales de inyección vía prompt en CI y caché de consultas.
- **Por qué sin demo pública:** ejecuta SQL generado desde texto arbitrario. Exponerlo a internet es superficie de ataque sin retorno comercial, y defender esa decisión en una propuesta ya demuestra criterio.

---

## Verificación (de esta tarea de documentación)
- `git status`: solo cambian `docs/plans/portfolio-projects-section.md` (traído y ajustado) y los 6 archivos nuevos de `docs/workana/`. `feat/projects` no se mergea.
- Los enlaces relativos entre `README.md`, los `plan.md` y `portfolio-projects-section.md` resuelven.
- Cada `plan.md` tiene las 12 secciones y las versiones verificadas con fecha.
- Copia de este plan en `docs/plans/workana-projects.md`, según la convención del repo.
- Guardar en memoria que los planes de Workana van en `docs/workana/<proyecto>/plan.md`.
- No se hace commit salvo que lo pidas.
