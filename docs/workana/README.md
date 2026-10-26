# Workana · Proyectos de portfolio .NET + IA

> Índice de la línea Workana. Cada proyecto tiene su propio plan en `docs/workana/<proyecto>/plan.md`.
> Creado el 13 oct 2026. Las versiones citadas en los planes se verificaron ese día contra NuGet, npm y la
> documentación oficial.

## Por qué existe esta línea

En Workana el comprador es casi siempre una **PyME no técnica** que decide viendo capturas, un video corto
o una demo. Lo que busca es "esto resuelve mi problema", no "esto usa CQRS". Los proyectos tienen que
funcionar a dos niveles a la vez:

- **Arriba, el pitch de negocio:** un problema reconocible (atender clientes, procesar facturas, agendar
  citas, entender las ventas) y un resultado que se ve en 60 segundos.
- **Abajo, la evidencia senior:** arquitectura defendible, concurrencia correcta, pruebas reales,
  observabilidad y un uso de IA **medido** (evals con umbral, costo por request, guardrails, salida
  estructurada validada). La diferencia entre "llamé a ChatGPT" y "puse un LLM en producción".

El catálogo anterior (`featured-projects-catalog.md` y A1/A2/A3, en la rama `feat/projects`) apuntaba a
entrevistadores técnicos: HR-tech, sin demo y solo Ollama. **Esa línea queda en pausa.**

## Decisiones

| Decisión | Elección |
|---|---|
| Línea | Workana primero. `talent-match` y `talent-flow` pasan a backlog |
| Ya publicables | `talent-mcp` y `claude-pr-review-bot` quedan **solo en el portfolio** (decisión del 23 oct 2026): le hablan a equipos de desarrollo, no a la PyME que contrata en Workana. Tienen ficha escrita por si un proyecto técnico la pide |
| LLM | Puerto **Microsoft.Extensions.AI** (`IChatClient`). En la demo, **Claude** con el SDK oficial `Anthropic` (MIT, implementa `IChatClient`), con tope de gasto. **Ollama** como adaptador offline para `docker compose` |
| Embeddings | Claude no tiene API de embeddings, así que se usa un **modelo ONNX en proceso** (`multilingual-e5-small`, MIT) detrás de `IEmbeddingGenerator`. Costo cero, sin sidecar y bilingüe ES/EN |
| Demos | **Video + capturas** por defecto (P1 y P2 desde el 16 y el 21 oct 2026: cero hosting y cero gasto de API por terceros). Una demo pública se evalúa por proyecto |
| Alcance | 4 proyectos de ~2 semanas cada uno, más ~3 días de template compartido |
| Front | Next.js 16 + Tailwind 4 (el stack fuerte del portfolio) |

### Modelos y costo de referencia (precios por 1M tokens, verificados el 13 oct 2026)

| Uso | Modelo | Input | Output |
|---|---|---|---|
| Por defecto: chat, extracción y clasificación | `claude-haiku-5-5` | $0.10 | $0.50 |
| Razonamiento difícil: agente de reservas y SQL | `claude-sonnet-5-5` | $2.00 | $10.00 |
| Evals: juez LLM | `claude-sonnet-5-5` | $2.00 | $10.00 |

Cada plan estima su costo por operación con esta tabla. El modelo es **configuración**, nunca un literal
en el código.

## Los proyectos

| # | Carpeta = repo = slug | Pitch | Demo | Semanas |
|---|---|---|---|---|
| 0 | [`dotnet-ai-template`](./dotnet-ai-template/plan.md) | Base compartida: arquitectura, IA, tests, CI y `.claude/`. **Se extrae de P1** cuando esté estable (decisión del 13 oct 2026) | — | al cerrar P1 |
| P1 | [`docs-assistant`](./docs-assistant/plan.md) | Chatbot de soporte con RAG sobre tus documentos, embebible en cualquier web | Video + capturas (16 oct 2026) | 1-2 |
| P2 | [`invoice-extractor`](./invoice-extractor/plan.md) · [ficha](./invoice-extractor/workana.md) | Fotos o PDFs de facturas → Excel contable validado | Video + capturas (22 oct 2026) | 3-4 |
| P3 | [`booking-agent`](./booking-agent/plan.md) · [ficha](./booking-agent/workana.md) | Agenda de citas con asistente conversacional y recordatorios | Video + capturas (23 oct 2026) | 5-6 |
| P4 | [`data-chat`](./data-chat/plan.md) | "Pregúntale a tus ventas" en lenguaje natural, con gráficos | Video + capturas (plan revisado el 23 oct 2026) | 7-8 |

**Por qué este orden:** P1 es el pedido de IA más común en Workana y su demo vive en el portfolio, que de
paso gana una feature. P2 y P3 son dominios de PyME clásicos. P4 va al final por ser el de mayor riesgo
técnico: consultas sobre datos del cliente derivadas de lenguaje natural. El diseño hace que el modelo nunca escriba SQL.

**Fuentes de las ideas:** `ideas/Top 20 .NET Projects.pdf` (#1 Finance Tracker, #10 Invoice Maker y #13
Appointment Scheduler) y la lista "C# Projects for the AI Era" (AI Support Chatbot, Docs Q&A with RAG,
Smart Invoice Parser, AI Code Review Agent, MCP Server y AI App in Production).

## Lineamientos (obligatorios en todos los repos)

Resumen de los que venían del catálogo anterior y siguen vigentes:

1. **Arranca con un comando.** `docker compose up` (o el AppHost de Aspire) levanta todo, con seeds. Hay
   `.env.example` versionado, imágenes multi-stage, usuario no-root y healthchecks.
2. **Licencias OSI, justificadas en un ADR.** Postgres en vez de SQL Server o Mongo, y Valkey en vez de
   Redis. Nada de MassTransit (comercial desde ene 2026), MediatR ni AutoMapper (open-core). Third-party
   solo detrás de una interfaz con implementación local.
3. **Clean Architecture verificada en CI.** `Domain` ← `Application` ← `Infrastructure`/`Api`, con un test
   de ArchUnitNET que la hace cumplir. El dominio no referencia EF Core, ASP.NET ni el SDK de IA.
4. **Sin magic strings ni magic numbers.** Constantes tipadas, `IOptions<T>` validadas al arranque y
   analizadores con severidad de error en `.editorconfig`.
5. **E2E contra el stack real**, sin mocks, en CI.
6. **Verificar antes de aplicar.** Versiones y APIs comprobadas contra la fuente, con fecha. Nada está
   "terminado" sin build, tests, evals y E2E en verde.
7. **`AGENTS.md` y `CLAUDE.md` propios desde el día 1** (`CLAUDE.md` = `@AGENTS.md`). Los de este repo
   son del portfolio y no se copian.
8. **La IA siempre medida.** Cada feature con LLM tiene un eval con umbral que bloquea el merge, costo por
   operación registrado y un tope de gasto.

## Calendario

> **Cambio del 13 oct 2026:** P1 se construye primero con toda la base dentro de su repo, y `dotnet-ai-template` se extrae después a partir de código ya probado, no diseñado en abstracto.

| Semana | Trabajo | Publicación en Workana |
|---|---|---|
| 1 (día 1) | P1 arranca con la base completa dentro del repo ([juxn89/docs-assistant](https://github.com/Juxn89/docs-assistant)) | — |
| 1 | P1 (parte 1) · fichas de `talent-mcp` y `claude-pr-review-bot` (1 día) | — (solo portfolio, decisión del 23 oct 2026) |
| 2 | P1 (parte 2) · implementar `portfolio-projects-section.md` | **P1** |
| 3-4 | P2 | **P2** |
| 5-6 | P3 | **P3** |
| 7-8 | P4 | **P4** |

## Definición de "terminado" (común a todos)

1. **README** que abre con el problema de negocio y el comando para levantarlo; después la arquitectura (un
   diagrama), los ADRs y una tabla de resultados de evals y costos. Incluye la sección "Cómo se construyó"
   sobre el flujo de desarrollo asistido por IA.
2. **Video** de 60-90 s del flujo principal (sin código, con narración o subtítulos en ES) y **4-5 capturas**
   de 1280×800.
3. **`workana.md`** en la carpeta del proyecto con la ficha final: título orientado a resultado,
   problema → solución → qué demuestra, stack, enlaces y capturas.
4. **Entrada en el portfolio:** el slug en `messages/{en,es}.json` con `repoUrl`, `demoUrl` o `videoUrl`.
   Requiere [`portfolio-projects-section.md`](../plans/portfolio-projects-section.md) implementado.
5. **CI verde:** build, tests, evals por encima del umbral, E2E e imagen publicada en GHCR.
6. **GitHub:** descripción y topics tal como están en el plan, repo fijado (pinned) en el perfil.

## Hosting de demos (compartido)

Verificado el 13 oct 2026. Hay que reconfirmarlo al desplegar.

| Pieza | Servicio | Free tier |
|---|---|---|
| Front | Vercel Hobby | Suficiente para demos |
| API | **Azure Container Apps** (Consumption, scale-to-zero) | 180.000 vCPU-s, 360.000 GiB-s y 2M requests al mes **por suscripción**, compartidos entre las 3 demos |
| Base de datos | **Neon** Free (pgvector incluido) | 100 CU-h/mes y 0,5 GB **por proyecto**: un proyecto Neon por demo |
| LLM | Claude API | Límite de gasto mensual en la consola de Anthropic + tope diario en la app + rate limit por IP |

Con scale-to-zero, el primer request tras un rato inactivo tarda unos segundos (cold start). Cada demo lo
asume con un estado de "despertando…" en la UI, en vez de esconderlo.

## Relación con `feat/projects`

De esa rama solo se trajo `docs/plans/portfolio-projects-section.md`, con dos cambios: `demoUrl` vuelve
como opcional y se añade `videoUrl`. El catálogo y los planes A1/A2/A3 siguen allí, sin mergear.
