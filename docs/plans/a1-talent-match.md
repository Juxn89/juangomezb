# A1 · Motor de matching CV ↔ vacante con RAG en .NET (`talent-match`)

> Plan de un **repositorio nuevo**, separado del portfolio. Vive aquí hasta que el repo exista; entonces se
> mueve a `docs/plans/` de ese repo. Proyecto A1 del catálogo en
> [`featured-projects-catalog.md`](./featured-projects-catalog.md). Se construye **después** de
> [A2 `talent-mcp`](./a2-talent-mcp.md), del que consume el paquete `Talent.Domain`.

## Context

A1 es el proyecto de mayor retorno del catálogo: cruza el dominio más fuerte y actual de Juan (HR-tech en
Stepstone) con el tema que ya publica en dev.to — *"Build a Local RAG in .NET"* es literalmente este
proyecto. Es también el más fácil de hacer mal: un demo de RAG que "funciona" no prueba nada, porque nadie
puede distinguir un buen retrieval de uno mediocre mirando una captura.

**Por eso el entregable central de A1 no es el motor: es la medición.** Un eval harness reproducible que
compara cinco estrategias sobre el mismo gold set y publica la tabla en el repo. Eso convierte "hice un RAG"
en "sé cuánto aporta cada pieza y puedo demostrarlo", que es la diferencia entre mid y senior.

Aplican los diez lineamientos transversales del catálogo: todo dockerizado, open source sin licencias de
pago, Clean Architecture verificada en CI, sin magic strings, E2E sin mocks, verificar antes de aplicar, y
`AGENTS.md`/`CLAUDE.md` propios del repo.

---

## Terreno verificado (25 ago 2026)

| Qué | Estado | Licencia |
|---|---|---|
| **pgvector** | v0.8.6. Familias de índice HNSW, IVFFlat y **DiskANN** (feb 2026). Vectores hasta 16.000 dims, pero **por encima de 2.000 hay que indexar con `halfvec`**, no `vector` | **PostgreSQL License** (BSD 2-cláusulas) ✅ |
| **Qwen3-Embedding-0.6B** | Nativo en Ollama, ~1,5 GB, MTEB-eng-v2 70.7 — la mejor calidad por VRAM de su rango. **Multilingüe** | **Apache-2.0** ✅ |
| **bge-reranker-v2-m3** | Cross-encoder 0.6B, **multilingüe**, con exports ONNX publicados (`onnx-community`, y variantes optimizadas O3 para CPU) | **Apache-2.0** ✅ |
| `nomic-embed-text` v1.5 | 137M params, 274 MB, el más descargado de Ollama — pero **orientado a inglés** | Apache-2.0 |

**Corrección al catálogo.** El catálogo asumía `nomic-embed-text` para embeddings. Es Apache-2.0 y ligero,
pero está orientado a inglés, y el dominio real de este proyecto es bilingüe: Stepstone opera en UK,
Alemania, Irlanda, Centroamérica y Caribe, y el propio portfolio es EN/ES. **Qwen3-Embedding-0.6B** cuesta lo
mismo en licencia (Apache-2.0), corre igual en Ollama, y es multilingüe. Combinado con `bge-reranker-v2-m3`
—también multilingüe y Apache-2.0— habilita el caso que de verdad diferencia: **matching cross-lingual**, un
CV en español contra una vacante en inglés.

`nomic-embed-text` se queda como **perfil ligero del compose**, para quien no pueda con 1,5 GB.

**Riesgo detectado en la verificación:** existe un issue abierto de latencia en ONNX Runtime con
cross-encoders BGE. El re-ranking en CPU es el riesgo técnico número uno del proyecto y se mide en la F0,
antes de construir sobre él.

---

## Decisiones cerradas (usuario)

| Decisión | Elección |
|---|---|
| Idiomas | **Bilingüe EN/ES con evaluación cross-lingual** — el gold set mide también ES→EN y EN→ES |
| Relación con A2 | **Independiente**: compose y BD propios; consume `Talent.Domain` por NuGet |
| Gold set | **Sintético generado + revisión manual de una muestra (~20%)**, con script y semilla versionados |
| Frontend | **Una sola página**, sin sistema de diseño — lo justo para grabar el flujo |

**Alcance realista: ~5-6 semanas.** El catálogo estimaba 3-4. La evaluación cross-lingual añade un eje
completo al harness, y los lineamientos de arquitectura y E2E añaden su parte. Orden de corte si hace falta:
front → explicación con LLM → eje cross-lingual. **El eval harness no se recorta**: sin él, el repo no
prueba nada.

---

## Identidad y artefactos

Según la [convención de nombres y tracking](./featured-projects-catalog.md#convención-de-nombres-y-tracking):

| | |
|---|---|
| Repo | `juxn89/talent-match` |
| Slug / ruta en el portfolio | `talent-match` → `/[locale]/projects/talent-match` |
| Imagen | `ghcr.io/juxn89/talent-match-api` |
| Prefijo de proyectos | `TalentMatch.*` |
| Consume de A2 | NuGet `Talent.Domain` (reglas puras, sin dependencias) |

A1 **no publica paquetes**: es una aplicación, no una librería. Su artefacto es la imagen y el repo.

---

## Arquitectura

Lineamiento 6, misma disposición que A2 para que los dos repos se lean igual:

```
/src
  TalentMatch.Domain/          → reglas puras de matching y tipos de score. CERO framework.
                                 Referencia `Talent.Domain` (A2) para taxonomía de skills y scoring baseline
  TalentMatch.Application/     → casos de uso + puertos:
                                 IEmbeddingModel, IReranker, IVectorSearch, ITextSearch,
                                 IExplanationGenerator, IPiiRedactor
  TalentMatch.Infrastructure/  → adaptadores: Ollama, ONNX Runtime, pgvector/Npgsql, EF Core
  TalentMatch.Api/             → Minimal API .NET 10 + SSE → ghcr.io/juxn89/talent-match-api
  TalentMatch.Eval/            → CLI del harness: corre los baselines y escribe /eval/results
/web/                          → front de una página (Next.js 16)
/tests
  TalentMatch.Architecture.Tests/  → regla de dependencia con ArchUnitNET
  TalentMatch.Domain.Tests/        → puro, sin Docker
  TalentMatch.Application.Tests/   → casos de uso contra adaptadores falsos
  TalentMatch.Api.Tests/           → contrato HTTP y SSE
  TalentMatch.E2E/                 → compose real: CV → top-N → explicación
/eval
  datasets/                    → gold set versionado + script generador con semilla fija
  results/                     → tablas de métricas, regenerables con un comando
/deploy
  compose.yaml (+ perfil `lite`), otel/, grafana/
/docs
  adr/
```

**Los puertos son el punto.** `IEmbeddingModel`, `IReranker` y `IExplanationGenerator` son exactamente lo que
pide el lineamiento 2: el third-party vive detrás de una abstracción con implementación local por defecto.
Cambiar Ollama por un proveedor gestionado es escribir un adaptador — nunca un requisito para correr el repo.

### Constantes

Lineamiento 7. Lo que en un proyecto de RAG se convierte en magic strings si nadie lo vigila:

| Constante | Qué encierra |
|---|---|
| `ModelTags` | `qwen3-embedding:0.6b`, `bge-reranker-v2-m3`, el modelo generador — **con tag fijo, nunca `latest`** |
| `EmbeddingSpec` | dimensión del vector, tamaño y solape de chunk, tipo de índice |
| `RetrievalOptions` | `k` de recuperación, `k` de re-ranking, constante de RRF, umbrales → `IOptions<T>` |
| `SupportedLanguages` | `en`, `es` y las configuraciones de `tsvector` de cada uno |
| `PiiCategories` | categorías redactadas: nombre, email, teléfono, dirección, fecha de nacimiento |

Fijar los tags de modelo no es cosmético: sin eso, el eval de mañana no compara contra el de hoy y toda la
tabla de resultados pierde sentido.

---

## El pipeline

1. **Ingesta.** CV o vacante → normalización → **redacción de PII antes de indexar** → chunking →
   embeddings → pgvector con índice HNSW.
   *A confirmar en F0:* la dimensión exacta de Qwen3-Embedding-0.6B. Si es ≤ 2.000, basta el tipo `vector`;
   si no, hay que pasar a `halfvec`. Es una decisión de esquema, así que se resuelve antes de la primera
   migración.
2. **Recuperación híbrida.** En paralelo:
   - full-text de Postgres (`tsvector`, con configuración `spanish` o `english` según el idioma detectado),
   - similitud vectorial (coseno, HNSW).
   Se fusionan con **Reciprocal Rank Fusion**: no tiene pesos que ajustar a ojo, que es justo la crítica
   fácil a una fusión ponderada.
3. **Re-ranking.** `bge-reranker-v2-m3` vía ONNX Runtime **dentro del propio .NET** — sin sidecar Python,
   un solo stack. Reduce el top-K a top-N.
4. **Explicación.** El LLM local redacta el porqué del match con streaming SSE — pero **no calcula nada**:
   recibe el desglose determinista de `Talent.Domain` (solape de skills, distancia de seniority, ubicación)
   ya computado y solo lo verbaliza. Es la diferencia entre una explicación fiel y una alucinación
   plausible, y hace que la explicación sea testeable.

PII redactada dos veces: antes de indexar y antes de construir el prompt. Con un test que falla si algo de
`PiiCategories` aparece en el prompt final.

---

## El eval harness — el entregable central

**Gold set.** Generado con el LLM local: CVs y vacantes construidos de modo que la relevancia se conoce por
construcción, con **distractores duros** deliberados (vacantes casi idénticas que difieren en seniority o en
una skill clave) para que el dataset no sea trivialmente fácil. Script generador y semilla versionados; se
revisa a mano ~20% de las etiquetas y se documenta el criterio. Sin PII real y sin dudas de licencia.

**Cuatro ejes:** EN→EN, ES→ES, **ES→EN y EN→ES**.

**Cinco estrategias comparadas sobre el mismo gold set** — esto es lo que da la señal:

| # | Estrategia | Qué responde |
|---|---|---|
| 1 | `score_candidate_fit` de A2 (solape determinista de skills) | El baseline **sin IA**. Si el RAG no lo supera, el RAG sobra |
| 2 | Solo full-text (BM25) | Cuánto aporta la búsqueda léxica clásica |
| 3 | Solo vectorial | Cuánto aporta la semántica sola |
| 4 | Híbrido con RRF | Cuánto aporta fusionar |
| 5 | Híbrido + reranker | Cuánto aporta el cross-encoder, y si paga su latencia |

**Métricas:** precision@k, recall@k, MRR y nDCG@10, más latencia p50/p95 **por etapa** y consumo de CPU/RAM.
No hay coste en dólares porque todo es local, pero sí coste computacional — y esa es la tabla que hace
honesta la decisión de usar o no el reranker.

Resultados versionados en `/eval/results` como archivos regenerables con un comando, no como prosa en el
README. El README enlaza la tabla; la tabla la produce el código.

---

## Fases

### F0 · Spike de riesgo y reglas del repo (2-3 días)
- **Medir la latencia del reranker ONNX en CPU** con un lote realista. Es el riesgo número uno y hay un
  issue conocido de latencia con cross-encoders BGE en ONNX Runtime. Si no cuadra: bajar `k`, probar la
  variante optimizada O3 / cuantización INT8, o `bge-reranker-base`. Si nada alcanza, el reranker pasa a
  opcional y el eval lo reporta como tal — un resultado negativo medido también es contenido publicable.
- **Confirmar la dimensión de Qwen3-Embedding-0.6B** → decide `vector` vs `halfvec` en el esquema.
- Medir la RAM real con Ollama sirviendo embeddings y generación a la vez; definir el perfil `lite`.
- `AGENTS.md` + `CLAUDE.md` propios (lineamiento 10): stack y versiones, tags de modelo fijos, la regla de
  dependencia, la política de constantes, la pirámide de tests y el gate de verificación.
- Compose arrancando con Postgres+pgvector y Ollama.

### F1 · Dominio, capas e ingesta (5-6 días)
- `TalentMatch.Domain` y los puertos de `Application`.
- **`TalentMatch.Architecture.Tests` y las constantes desde aquí**, no al final.
- Esquema, migraciones e índice HNSW; redacción de PII; chunking; pipeline de embeddings.
- Consumo de `Talent.Domain` (A2) para taxonomía y scoring baseline.

### F2 · Recuperación híbrida (5 días)
- Full-text ES/EN con detección de idioma, búsqueda vectorial, fusión RRF, adaptador del reranker.
- Minimal API .NET 10 con el endpoint de búsqueda.

### F3 · Eval harness (5-6 días) — la fase que no se recorta
- Generador de gold set con distractores duros, semilla fija y revisión manual de la muestra.
- Las cinco estrategias, las cuatro combinaciones de idioma, las métricas y la instrumentación de latencia.
- `dotnet run --project src/TalentMatch.Eval` regenera `/eval/results` completo.

### F4 · Explicación con LLM y SSE (3-4 días)
- Grounding con el desglose determinista, streaming SSE, guardrails de PII con su test.

### F5 · Front de una página (2 días)
- Subir CV → top-N → explicación en streaming. Sin sistema de diseño.

### F6 · Observabilidad, CI y documentación (3 días)
- OTel → Collector → Jaeger/Prometheus/Grafana OSS, con spans por etapa del pipeline.
- CI: build + arquitectura + unitarios + API + E2E como gate de merge; imagen a GHCR al taggear.
- README que abre con `docker compose up`, GIF del flujo, tabla de resultados y ADRs enlazados.

---

## Tests

Cinco niveles, los cinco bloquean el merge (lineamiento 8):

1. **Arquitectura** — `TalentMatch.Domain` no referencia EF Core, Npgsql, ONNX ni ASP.NET; `Application`
   solo referencia `Domain`; ningún adaptador se invoca sin pasar por su puerto.
2. **Dominio** — reglas de matching y fusión RRF como funciones puras. Sin Docker.
3. **Aplicación** — casos de uso contra adaptadores falsos: que un `IEmbeddingModel` caído degrade a
   full-text en vez de reventar; que el reranker desactivado siga devolviendo resultados ordenados.
4. **API** — contrato HTTP, forma del stream SSE, y el **test de PII**: ninguna categoría redactada aparece
   en el prompt enviado al modelo.
5. **E2E** — contra el compose real, sin mocks: subir un CV, recibir el top-N y consumir la explicación en
   streaming, en ambos idiomas y en un caso cross-lingual.

---

## Riesgos

| Riesgo | Mitigación |
|---|---|
| **Latencia del reranker ONNX en CPU** (issue conocido en onnxruntime con cross-encoders BGE) | F0 lo mide antes de construir encima; escalera de fallback: bajar `k` → variante O3/INT8 → `bge-reranker-base` → reranker opcional y reportado en el eval |
| RAM con Ollama sirviendo embeddings y generación a la vez | Perfil `lite` del compose con `nomic-embed-text`; requisitos mínimos documentados en el README |
| Gold set sintético demasiado fácil → métricas infladas | Distractores duros por construcción, y la dificultad del dataset se reporta junto a los resultados |
| El cross-lingual degrada las métricas | Es un **resultado válido**, no un fracaso: se publica el delta y se explica. Ocultarlo sí sería el error |
| Resultados no reproducibles entre corridas | Tags de modelo fijos (nunca `latest`), semilla fija, y el eval regenerable con un solo comando |
| Alcance de 5-6 semanas | Orden de corte: front → explicación → eje cross-lingual. El harness no se toca |

---

## Verificación

```bash
docker compose up -d                              # Postgres+pgvector, Ollama, API, observabilidad
docker compose --profile lite up -d               # variante ligera (nomic-embed-text)
dotnet test tests/TalentMatch.Architecture.Tests  # regla de dependencia, sin Docker
dotnet test                                       # todo, incluido E2E
dotnet run --project src/TalentMatch.Eval         # regenera /eval/results
```

Comprobaciones manuales:
1. `docker compose up` desde cero, sin A2 corriendo, y el flujo completo funciona — A1 arranca solo.
2. Subir un CV en español y recibir vacantes en inglés relevantes (cross-lingual real).
3. `/eval/results` regenerado dos veces seguidas da la misma tabla (tags y semilla fijos).
4. La tabla muestra las cinco estrategias y **el híbrido supera al baseline determinista de A2** — si no,
   ese es el hallazgo y se documenta.
5. Un trace en Jaeger con un span por etapa: embedding → full-text → vectorial → fusión → rerank →
   explicación.
6. El test de PII falla a propósito si se desactiva el redactor.

---

## Fuentes

- [pgvector](https://github.com/pgvector/pgvector) · [LICENSE](https://raw.githubusercontent.com/pgvector/pgvector/master/LICENSE)
- [pgvector, a guide for DBA — Part 2: Indexes (marzo 2026)](https://www.dbi-services.com/blog/pgvector-a-guide-for-dba-part-2-indexes-update-march-2026/)
- [Best Ollama Embedding Models 2026](https://www.morphllm.com/ollama-embedding-models)
- [The Best Open-Source Embedding Models in 2026 — BentoML](https://www.bentoml.com/blog/a-guide-to-open-source-embedding-models)
- [BAAI/bge-reranker-v2-m3](https://huggingface.co/BAAI/bge-reranker-v2-m3) · [export ONNX](https://huggingface.co/onnx-community/bge-reranker-v2-m3-ONNX)
- [onnxruntime #19494 — latencia de BGE Reranker / BERT cross-encoder](https://github.com/microsoft/onnxruntime/issues/19494)
