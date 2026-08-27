# Rediseño de "Proyectos Destacados": catálogo de proyectos + arquitectura de contenido

## Context

`ProjectsSection.tsx:11` llama a `getPinnedProjects('juxn89', locale, 4)`, que lee los 6 repos *pinned* de
GitHub vía GraphQL y muestra 4. El pipeline funciona: hoy en juangomezb.com se ven **Covid19-Cases**,
**juangomezb** (el propio portfolio), **net-core-microservice** y **food-delivery-app-react-native**.

El problema es el contenido y el mecanismo:

1. **Nivel del contenido.** Un dashboard de COVID en ASP.NET MVC, dos apps de React Native de curso, un repo
   de un curso de DevTalles y el propio portfolio listado como proyecto. Es material de aprendizaje, no
   evidencia de 15+ años de arquitectura y modernización de sistemas. `net-core-microservice` (.NET 8 +
   Ocelot) es el único con potencial senior.
2. **Autogeneración pobre.** `transformRepoToProject` (`src/lib/github/api.ts:115`) fabrica el título desde
   el nombre del repo → "Juangomezb", "Net Core Microservice"; y los `highlights` son metadatos
   (`⭐ N stars`, `🔀 N forks`, `💻 Built with X`). **Cero métricas de impacto, cero decisiones de
   arquitectura** — justo lo que se evalúa en un perfil senior.
3. **Orden inestable.** Se ordena por `stars` y corta a 4 (`api.ts:195-197`); con todos los repos a 0 stars
   el orden es arbitrario y qué proyecto sale destacado no está bajo control.
4. **Fallback muerto y engañoso.** Si GitHub falla se usan 4 proyectos **inventados** en
   `messages/{en,es}.json` (Cloud Banking Platform, E-Commerce Analytics Dashboard, Healthcare Management
   System, DevOps Automation Suite) de dominios que **no corresponden a su trayectoria** (HR-tech, seguros,
   govtech). Además tienen `demoUrl: "#"` y sin `codeUrl`, por lo que se renderizarían **sin ningún botón**
   (`ProjectCard.tsx:112` exige `codeUrl`).

**Resultado buscado:** un catálogo curado de proyectos de nivel medio-alto que demuestren seniority (decisiones
de arquitectura, métricas, trade-offs), leídos desde contenido versionado en el repo — no autogenerados — con
tarjeta enriquecida en la home y página de case study propia por proyecto. Los repos pinned dejan de decidir
qué se muestra y pasan a aportar solo señal viva (stars, último push).

### Decisiones ya tomadas (usuario)

| Decisión | Elección |
|---|---|
| Tipo de proyectos | **Híbrido**: 3 repos propios open source + 2 case studies profesionales |
| Fuente de datos | **Contenido curado como fuente de verdad** en `messages/{en,es}.json`; GitHub pasa a enriquecimiento opcional (stars / último push) por repo |
| Profundidad | **Tarjetas enriquecidas + case study por slug** (`/[locale]/projects/[slug]`) |
| Líneas técnicas | Microservicios event-driven a escala · AI/RAG aplicado a reclutamiento · Microfrontends multi-marca (+ abierto a sugerencias) |
| Demos | **Sin demo pública**: evidencia reproducible (`docker compose up`, video, benchmarks versionados, CI verde) |

### Restricciones técnicas transversales

Aplican a **todos** los repos del catálogo, no a uno en particular:

1. **Todo dockerizado.** Cada repo arranca completo con un solo `docker compose up`: servicios, base de datos,
   broker, observabilidad y seeds. Sin "instala esto antes". Imágenes multi-stage, usuario no-root,
   healthchecks, y `.env.example` versionado.
2. **Open source y sin licencias de pago.** Nada que exija licencia, trial, tarjeta ni cuota. Third-party
   gestionado **solo si es imprescindible**, y siempre detrás de una abstracción con implementación local por
   defecto.
3. **Cuidado con licencias que *parecen* open source.** Es un detalle que juega a favor en una entrevista
   senior, así que las elecciones se justifican por licencia en un ADR:

| En lugar de | Usar | Motivo |
|---|---|---|
| Redis | **Valkey** (BSD-3, Linux Foundation) | Redis pasó a RSALv2/SSPL en 2024 — ya no es OSI open source |
| MongoDB | **PostgreSQL** (+ JSONB si hace falta documento) | MongoDB es SSPL |
| SQL Server | **PostgreSQL** | Developer Edition es gratis solo para desarrollo, no producción |
| Redpanda | **RabbitMQ** (MPL-2.0) o **Kafka** (Apache-2.0) | Redpanda es BSL, no open source |
| Datadog / New Relic | **OTel Collector + Jaeger + Prometheus + Grafana OSS** | self-hosted y gratis (Grafana OSS es AGPLv3) |
| API de LLM de pago | **Ollama** con modelos de pesos abiertos | ver punto 4 |
| **MassTransit v9** | **Rebus** (MIT), o escribirlo a mano | v9 es comercial desde ene 2026 y **exige license key en runtime** — rompe el "clonar y correr". La v8 es Apache-2.0 a perpetuidad pero el vendor la declara sin soporte |
| Wolverine, MediatR, AutoMapper | evaluar caso por caso | El ecosistema .NET viró a **open-core** y a comercial en cadena durante 2025-2026. Que hoy sea MIT no basta: hay que mirar qué monetiza el vendor |

   Nota: esto implica retocar el stack de su repo existente `net-core-microservice`, que hoy usa
   **SQL Server + MongoDB** — ambos con licencias problemáticas.
4. **Modelos de IA locales y con licencia permisiva.** Ollama en Docker con modelos **Apache-2.0**. Se evita
   Llama (licencia comunitaria con restricciones de uso) precisamente para que la elección de licencia sea
   defendible. Verificado el 25 ago 2026:
   - **Embeddings: `qwen3-embedding:0.6b`** (Apache-2.0, ~1,5 GB, multilingüe) — el dominio es bilingüe
     EN/ES, así que un modelo orientado a inglés deja fuera el caso interesante. `nomic-embed-text` v1.5
     (Apache-2.0, 274 MB, inglés) queda como **perfil ligero** del compose.
   - **Re-ranking: `bge-reranker-v2-m3`** (Apache-2.0, 0.6B, multilingüe), ejecutado con ONNX Runtime dentro
     de .NET para no meter un sidecar en Python.
   - **Generación: `qwen2.5` o `mistral`** (Apache-2.0).
   - **Tags fijos, nunca `latest`:** si el modelo cambia bajo los pies, los benchmarks de ayer dejan de ser
     comparables con los de hoy y toda la evidencia del repo pierde valor.

   El acceso al modelo va detrás de una interfaz, de modo que un proveedor gestionado sea *opcional* y
   nunca requisito para correr el proyecto.
5. **Infra y CI gratis.** Imágenes en **GHCR** (gratis para repos públicos), CI en **GitHub Actions**
   (gratis para repos públicos). Kubernetes, cuando aplique, sobre **k3d/kind** local — no un cluster
   gestionado. Terraform queda como módulo **opcional y desactivado por defecto**, para *mostrar* IaC sin
   que nadie incurra en costos de AWS al clonar el repo.

6. **Clean Architecture, con la regla de dependencia verificada en CI.** Las dependencias apuntan hacia
   adentro: `Domain` (entidades y reglas puras, **sin ninguna dependencia de framework**) ← `Application`
   (casos de uso y **puertos** como interfaces) ← `Infrastructure` (EF Core, Postgres, Keycloak, clientes
   HTTP: los adaptadores) y `Presentation` (host MCP, API, CLI). El dominio no referencia EF Core, ni el
   SDK de MCP, ni ASP.NET.
   No basta con documentarlo: un **test de arquitectura** lo hace cumplir en cada PR
   (`TngTech.ArchUnitNET.xUnit` — mantenido activamente y con integración xUnit; `NetArchTest.Rules` es la
   alternativa más simple pero su versión estable lleva tiempo sin moverse, al punto que existe un fork
   *eNhancedEdition*).
   En el portfolio Next.js, que no es una app por capas, la traducción es la **dirección de dependencia**:
   `src/lib/**` nunca importa de `src/components/**`, y los componentes consumen el puerto
   (`get-projects.ts`) en vez de hacer fetch por su cuenta.

7. **Sin magic strings ni magic numbers.** Todo literal que se repita o que cruce un límite del sistema vive
   en una constante tipada, un enum o configuración bindeada — nunca incrustado. En la práctica, lo que esto
   ataja en estos proyectos concretos:
   - **C#:** nombres de tools, scopes OAuth, claves `_meta` del protocolo
     (`io.modelcontextprotocol/protocolVersion`), nombres de colas y routing keys, códigos de error del
     rango reservado → `static class` de constantes o *smart enums*. TTLs, límites de página, reintentos y
     timeouts → `IOptions<T>` desde configuración, no números sueltos.
   - **TypeScript:** `as const` + union types en lugar de strings sueltas; los `slug` se derivan del
     contenido, no se repiten en el código.
   - **Enforcement:** analizadores Roslyn vía `.editorconfig` con severidad de error en C#, y la regla
     `no-magic-numbers` de ESLint (con una lista corta y justificada de excepciones) en TS.

8. **E2E obligatorio, no solo unitarios.** Cada repo lleva al menos una prueba que recorre el camino real de
   extremo a extremo **contra el stack de `docker compose`, sin mocks**, y corre en CI:
   - Portfolio → Playwright (ya existe la infraestructura).
   - A2 `talent-mcp` → un cliente MCP real contra el servidor HTTP, pasando por OAuth y llegando a Postgres.
   - A1 `talent-match` → subir un CV y obtener el top-N.
   - A3 `talent-flow` → aplicar a una vacante y ver la saga completarse hasta la notificación.

9. **Verificar antes de aplicar.** Dos niveles, y los dos son regla:
   - **Al decidir:** ninguna versión, API, id de paquete o capacidad se da por sabida — se comprueba contra
     la fuente y se anota la fecha en el plan. Esta regla ya evitó dos errores reales: la especificación de
     MCP se reescribió por completo el 2026-07-28 (sin sesiones, MRTR, deprecaciones), y los ids de NuGet
     había que confirmarlos antes de que fueran irreversibles.
   - **Al cambiar código:** ningún cambio se da por bueno sin ejecutarlo. Build + tests + E2E en verde en
     local antes del commit, y el mismo gate en CI. Nada de "debería funcionar": si no se corrió, no está
     verificado.

10. **Cada repo nuevo lleva sus propios `AGENTS.md` y `CLAUDE.md`.** Los de este repo son **exclusivos del
    portfolio** — Next.js 16, Vercel, next-intl, Tailwind, Playwright — y no se copian ni se comparten:
    no le sirven de nada a un repo .NET. Cada repo nuevo escribe los suyos.

    Ahí es donde los lineamientos 1-9 dejan de ser un documento y pasan a ser vinculantes: **un plan no
    obliga a nadie, un `AGENTS.md` sí**, porque se carga en cada sesión de agente sobre ese repo.

    Mismo patrón que aquí: `CLAUDE.md` con una única línea `@AGENTS.md`, y `AGENTS.md` con las reglas dentro
    de un bloque marcado (`<!-- BEGIN:… -->` / `<!-- END:… -->`) para poder regenerar la parte gestionada sin
    pisar lo que se añada a mano.

    Se crea en la **primera fase del repo, no al final** — un archivo de reglas que llega cuando el código ya
    está escrito no gobierna nada. Contenido mínimo: stack con versiones fijadas, la regla de dependencia de
    Clean Architecture, la política de constantes, la pirámide de tests y qué bloquea el merge, el gate de
    verificación, y las decisiones cerradas del plan de ese repo.

---

## Parte 1 — Catálogo de proyectos candidatos

Criterio de selección: **coherencia con su historial real** (HR-tech, seguros, govtech, modernización de legacy),
**refuerzo de su línea editorial de dev.to** (.NET 10, C# 14, MCP, agentes, RAG, Native AOT), y **evidencia
verificable** (métricas, benchmarks, demo desplegada) en lugar de afirmaciones.

### A. Repos propios — construibles, open source, con demo

#### A1 · Motor de matching CV ↔ vacante con RAG en .NET  ✅ seleccionado
*Dominio: HR-tech · Nivel: medio-alto · Esfuerzo: ~5-6 semanas (revisado — ver [plan](./a1-talent-match.md)) · Repo: `talent-match`*

.NET 10 Minimal API + PostgreSQL/pgvector. Ingesta de CVs y vacantes, embeddings, **búsqueda híbrida**
(full-text de Postgres + vectorial) con re-ranking, y explicación del match generada por LLM con streaming SSE.
Frontend Next.js 16: subes un CV y ves el top-N de vacantes con el *por qué*.

**Stack sin costo:** todo en `docker compose` — Postgres+pgvector, **Ollama** (`qwen3-embedding:0.6b` para
embeddings, `qwen2.5` para generación), API .NET y un front mínimo. El re-ranking usa `bge-reranker-v2-m3`
ejecutado con **ONNX Runtime dentro del propio .NET**, evitando un sidecar en Python y manteniendo un solo
stack. Sin API keys: el repo corre completo offline tras el primer `ollama pull`.

**Bilingüe por diseño:** los modelos elegidos son multilingües sin costo extra de licencia, así que el motor
hace **matching cross-lingual** — CV en español contra vacante en inglés — y el eval lo mide como un eje
propio. Espeja la operación multi-país real de Stepstone.

**Señales senior:** un **eval harness reproducible** (precision@k / MRR / nDCG sobre dataset sintético
etiquetado) que demuestre el delta antes/después del re-ranking, con los resultados versionados en el repo;
latencia y coste computacional por consulta medidos; caché de embeddings con invalidación; guardrails de PII
sobre los CVs; ADRs de por qué pgvector y no un vector store dedicado, y de la elección de modelos por licencia.
**Por qué este:** cruza su dominio más fuerte y actual (Stepstone) con el tema que ya publica en dev.to
(*"Build a Local RAG in .NET"* — literalmente este proyecto). Es el de mayor retorno del catálogo.

#### A2 · MCP server en C# para el dominio de reclutamiento  ✅ seleccionado
*Dominio: AI tooling · Nivel: medio · Esfuerzo: ~4 semanas (revisado — ver [plan](./a2-talent-mcp.md)) · Repo: `talent-mcp`*

Servidor MCP en C# publicado en NuGet, con tools tipados sobre el dominio de A1 (buscar vacantes, evaluar
encaje, extraer skills), auth, rate limiting, y un cliente demo consumiéndolo.

**Stack sin costo:** imagen Docker publicada en GHCR, transporte stdio + HTTP, y publicación en NuGet
(gratis). Cero dependencias de servicios externos: apunta al Postgres de A1 vía compose.

**Señales senior:** diseño de API pensada para agentes (idempotencia, errores accionables, contratos
versionados), telemetría de uso de tools, paquete publicado con SemVer y CI.
**Por qué este:** ya escribió *"Build an MCP Server in C#"* y *"Consuming MCP Servers from .NET"*.
Prácticamente nadie tiene un MCP server en C# en su portfolio — diferenciación máxima por poco esfuerzo,
y se apoya en la infraestructura de A1.

#### A3 · Plataforma event-driven de ofertas de empleo  ✅ seleccionado
*Dominio: HR-tech / distributed systems · Nivel: alto · Esfuerzo: ~7-8 semanas (revisado — ver [plan](./a3-talent-flow.md)) · Repo: `talent-flow`*

Tres microservicios .NET (Jobs, Applications, Notifications) tras un gateway **YARP 2.3.0** (MIT),
comunicados por **RabbitMQ 4.2** (MPL-2.0), con una BD **PostgreSQL** por servicio y **Valkey** para caché.
El flujo "candidato aplica a vacante" con **outbox + saga escritos a mano**, inbox de idempotencia, DLQ con
colas de reintento escalonadas y compensación. Search se absorbe como proyección de lectura dentro de Jobs.

**Por qué a mano:** `.UseMassTransit()` esconde justo las piezas que se evalúan — y además **MassTransit v9
pasó a licencia comercial en enero 2026**, con license key en runtime, lo que rompe el "clonar y correr".
El ADR compara las cuatro opciones y deja dicho que en producción la elección sería Rebus (MIT).

**Stack sin costo:** un solo `docker compose up` levanta gateway, servicios, Postgres, Valkey, RabbitMQ y la
observabilidad self-hosted (**OTel Collector → Jaeger + Prometheus + Grafana OSS**) con dashboards
versionados como código, y el `traceparent` viaja por los headers del mensaje para que una sola traza cruce
el broker. Carga con **k6** en local. Manifiestos de Kubernetes probados en **k3d**. **Sin Terraform**: un
módulo que nunca se aplica contra una cuenta real es código no ejecutado, y el lineamiento 9 dice que lo no
ejecutado no está verificado.

**Señales senior:** consistencia eventual explicada y *testeada* (no solo dibujada); contract testing entre
servicios; resiliencia con Polly; y un **k6 load test cuyos p95/p99 se publican en el README** con el
antes/después de la optimización.
**Por qué este:** es el vocabulario exacto que evalúan los entrevistadores senior, y extiende su repo
existente `juxn89/net-core-microservice` (.NET 8 + Ocelot) en vez de partir de cero — cambiando Ocelot por
YARP y, sobre todo, **sacando SQL Server y MongoDB** por sus licencias.

#### A4 · Shell de microfrontends multi-marca
*Dominio: platform engineering · Nivel: medio-alto · Esfuerzo: 2-3 semanas*

Host Next.js 16 + 2-3 remotes con Module Federation, design system compartido con tokens por marca,
despliegue independiente por remote, contract tests host↔remote, degradación elegante si un remote cae,
y presupuesto de performance con Lighthouse CI por marca.

**Señales senior:** versionado de contratos entre equipos, aislamiento de fallos, y el problema difícil real
de los microfrontends (duplicación de dependencias y su coste en bundle, medido).
**Por qué este:** espeja literalmente lo que hizo para 6 marcas internacionales en Stepstone.

#### A5 · Kit de modernización legacy (strangler fig)
*Dominio: modernización · Nivel: alto · Esfuerzo: 3-4 semanas*

Monolito ASP.NET "legacy" de ejemplo migrado incrementalmente a .NET 10 modular: anti-corruption layer,
feature flags para desviar tráfico endpoint por endpoint, **characterization tests** que capturan el
comportamiento heredado antes de tocarlo, dual-write con reconciliación para los datos, y rollback probado.

**Señales senior:** es el proyecto que más difícil es fingir. Demuestra criterio, no solo stack.
**Por qué este:** es su diferenciador real de 15 años (VB6/ASP.NET → .NET Core en INIFOM) y casi nadie
lo tiene en un portfolio. *No lo eligió en las opciones, pero vale la pena considerarlo.*

#### A6 · Motor de reglas de cálculo (pólizas / tarifas)
*Dominio: insurtech · Nivel: medio · Esfuerzo: 2 semanas*

Reglas versionadas e interpretadas, aritmética `decimal` exacta, audit trail de cada cálculo,
**property-based testing** (FsCheck) para invariantes, benchmarks con BenchmarkDotNet y compilación
Native AOT.

**Por qué este:** dominio Axxis (cálculo de pólizas sobre datasets grandes) y toca dos temas que ya
publicó: Native AOT y performance en .NET 10.

### A-extra · Ideas adicionales para discutir

Tres candidatos más, en la misma intersección .NET + IA + sus dominios reales. No están seleccionados;
quedan como material de decisión.

#### A7 · Agente de screening de CVs con evals y guardrails de sesgo
*Dominio: HR-tech + AI safety · Nivel: alto · Esfuerzo: 2-3 semanas*

Agente tool-use en C# (el patrón de su post *"Build a Claude Tool-Use Agent in C#"*) que hace triage de
candidatos: extrae skills, contrasta contra requisitos, pide aclaraciones y **escala a humano** cuando la
confianza es baja. Redacción de PII antes de enviar al modelo, y un **golden dataset con métricas de
fairness** (paridad de tasas de aprobación entre grupos) además de accuracy.
Corre sobre el mismo Ollama local de A1, así que no añade dependencias de pago.
**Señales senior:** human-in-the-loop explícito, evaluación de sesgo — no solo de precisión — y trazas
auditables de cada decisión. Es el ángulo que separa "usé un LLM" de "puse un LLM en producción en un
dominio regulado". Distinto de A1: A1 es retrieval, esto es decisión asistida.

#### A8 · Plataforma de feature flags y experimentación multi-marca
*Dominio: platform engineering · Nivel: medio-alto · Esfuerzo: 2-3 semanas*

Servicio .NET con SDK para Next.js, evaluación en el edge (sin round-trip), targeting por marca/locale/cohorte,
telemetría de exposición y lectura de resultados de experimento. Contratos vía **OpenFeature** (CNCF) para no
reinventar la interfaz — y para poder compararse con **Unleash** (open source) en un ADR.
**Por qué:** es el habilitador real de B1 (6 marcas desplegando independiente) y la herramienta que hace
posible un strangler fig. Conecta case study y repo en una misma narrativa.

#### A9 · Observabilidad OpenTelemetry para .NET legacy
*Dominio: modernización + observabilidad · Nivel: alto · Esfuerzo: 2-3 semanas*

Auto-instrumentación de apps .NET Framework antiguas **sin modificar su código** (profiler / DiagnosticSource),
exportando OTLP, con dashboard en Next.js.
**Por qué:** resuelve el primer problema real de toda modernización — no puedes migrar lo que no puedes medir —
y nace directamente de su historia en INIFOM. Prácticamente nadie tiene esto en un portfolio.

*(Descartadas por solaparse: un motor de búsqueda propio con Native AOT y benchmarks vs Elasticsearch cabe
mejor como módulo dentro de A3; un CLI de migración de datos con reconciliación cabe dentro de A5.)*

### B. Case studies profesionales — sin código público, con métricas

#### B1 · Plataforma de reclutamiento multi-marca (The Stepstone Group, 2022→hoy)  ✅ seleccionado
6 marcas en UK, Alemania, Irlanda, Centroamérica y Caribe. Microfrontends + microservicios + colas en AWS.
**Métricas:** >99.9% disponibilidad, **-25% en tiempos de despliegue**, +35% de mejora de rendimiento,
millones de usuarios y miles de empresas. Cubre la línea "microfrontends multi-marca" sin necesidad de A4.

#### B2 · Motor de cálculo de pólizas (Axxis-Systems, 2020-2021)  ✅ seleccionado
Plataformas core de seguros para clientes en LatAm y Europa. Reglas de negocio complejas sobre datasets
grandes. **Métricas:** +15% eficiencia operativa, **-20% en tiempos de carga**, reducción significativa de
procesos manuales.

#### B3 · Catastro municipal nacional (Procuraduría / INIFOM, 2014-2020)
Sistema de catastro para **los 153 municipios de Nicaragua**. Integración SISCAT ↔ SISCAF (INETER) ↔ SIAFI,
más la migración de datos de contribuyentes a escala nacional, mejorando recaudación y trazabilidad
financiera municipal.
**Por qué este:** escala nacional e impacto en política pública — es el proyecto con mayor peso narrativo
de todo el catálogo y es prácticamente único en un portfolio.

#### B4 · Modernización VB6/ASP.NET → .NET Core (INIFOM, 2017-2020)
Migración de aplicaciones legacy manteniendo continuidad de negocio, más la introducción de control de
versiones (TFS) y la administración de la infraestructura (IIS, SQL Server, Reporting Services).

### Lista cerrada (seleccionada por el usuario)

| # | Proyecto | Tipo | Estado inicial | Cubre |
|---|---|---|---|---|
| 1 | **A1** Matching CV↔vacante con RAG en .NET | Repo propio | `in-progress` | AI/RAG + HR-tech |
| 2 | **A3** Plataforma event-driven de empleo | Repo propio | `in-progress` | Microservicios a escala |
| 3 | **A2** MCP server en C# (NuGet) | Repo propio | `in-progress` | Diferenciación AI tooling |
| 4 | **B1** Reclutamiento multi-marca (Stepstone) | Case study | `live` | Microfrontends + impacto real |
| 5 | **B2** Motor de cálculo de pólizas (Axxis) | Case study | `live` | Insurtech + performance |

**Reparto en el sitio.** La home muestra **4 destacados** (A1, A3, B1, B2) para no romper la retícula de 2
columnas; A2 vive en `/projects` y se promueve a destacado cuando el paquete esté publicado en NuGet.
`/projects` lista los 5 curados más el bloque secundario de repos.

**Repos pinned actuales** (Covid19-Cases, food-delivery-app-react-native, movie-app-react-native,
nextjs-devtalles) → bloque secundario compacto "más repos" en `/projects`, alimentado automáticamente desde
GitHub. `juangomezb` se excluye de ese bloque: el sitio en el que estás no es un proyecto que mostrar.

**Orden de construcción sugerido:** A2 (`talent-mcp`) primero, porque su infraestructura de dominio se
reutiliza; luego A1 (`talent-match`), luego A3 (`talent-flow`). Cada repo se publica en el portfolio con
`status: 'in-progress'` y su case study desde el día uno — el enlace al repo aparece cuando exista.

A4, A5, A6 y las ideas extra A7-A9 quedan en backlog para discutir.

### Convención de nombres y tracking

Esto no es parte de la ejecución de ningún plan: es la capa de trazabilidad que mantiene alineados el
catálogo, los repos, el contenido del portfolio y los paquetes publicados. **Aplica también a los planes que
falten por escribir** (A1 y A3).

**Regla única:** el nombre del repo, el `slug` del proyecto en `messages/{en,es}.json` y la ruta del case
study son **la misma cadena** en kebab-case. Así, dado cualquiera de los cuatro identificadores, los otros
tres se derivan sin buscar nada.

```
ID de catálogo  →  repo GitHub  →  slug del portfolio  →  ruta            →  archivo de plan
A2                 talent-mcp      talent-mcp             /projects/talent-mcp   docs/plans/a2-talent-mcp.md
```

Los ids de NuGet y las imágenes de contenedor derivan del repo: kebab-case → PascalCase con puntos para
NuGet, y `ghcr.io/juxn89/<repo>` para imágenes.

Los tres repos seleccionados comparten el prefijo `talent-` porque **son piezas de una misma plataforma
HR-tech**, no proyectos sueltos: A2 es dueño del dominio y A1 lo reutiliza. Leídos juntos en el perfil de
GitHub cuentan una historia deliberada. Los del backlog son de otros dominios y llevan nombres autónomos.

| ID | Repo | Slug / ruta | Artefactos publicados |
|---|---|---|---|
| **A1** | `talent-match` | `talent-match` | `ghcr.io/juxn89/talent-match-api` |
| **A2** | `talent-mcp` | `talent-mcp` | NuGet `Talent.Mcp.Toolkit` · dotnet tool `talent-mcp` · `ghcr.io/juxn89/talent-mcp` |
| **A3** | `talent-flow` | `talent-flow` | `ghcr.io/juxn89/talent-flow-{gateway,jobs,applications,notifications}` |
| **B1** | — (case study) | `multi-brand-recruitment` | — |
| **B2** | — (case study) | `insurance-rating-engine` | — |

Backlog, por si se activan: A4 `brand-shell` · A5 `strangler-kit` · A6 `rating-engine` ·
A7 `talent-screener` · A8 `brand-flags` · A9 `legacy-otel-bridge`.

**Verificado el 25 ago 2026:** `Talent.Mcp.*` está libre en NuGet (0 resultados, sin prefijo reservado) y
ninguno de estos nombres colisiona con los repos existentes de `juxn89`. Conviene reconfirmarlo al crear
cada repo — los ids de NuGet son lo único que no se puede cambiar después de publicar.

**Archivos de plan:** `docs/plans/<id>-<repo>.md` (`a2-talent-mcp.md`, `a1-talent-match.md`,
`a3-talent-flow.md`), más este catálogo como índice.

### Consecuencia de "sin pagos": cómo se demuestra cada proyecto

La restricción de costo choca con un punto del plan: **una demo pública permanente de un stack multi-servicio
cuesta dinero**. A1 con Ollama necesita varios GB de RAM; A3 son 4 servicios más broker, base de datos y
observabilidad. Ningún free tier serio aguanta eso de forma estable.

La sustitución honesta —y que además lee bien para un perfil senior— es **evidencia reproducible en lugar de
una URL**: `docker compose up` como único requisito, un GIF/video corto del flujo, los resultados del eval
harness (A1) y del load test de k6 (A3) versionados en el repo, y el badge de CI verde. Un revisor técnico
confía más en un benchmark reproducible que en una demo que puede estar caída.

**Decidido:** no habrá demo pública. Ningún proyecto del catálogo lleva `demoUrl`; el CTA primario de cada
tarjeta es su case study y el secundario el repo. Esto elimina la superficie de mantenimiento y el riesgo de
una demo caída en el portfolio.

Cada repo debe entonces cargar la prueba por sí solo, y esto pasa a ser criterio de "terminado":
- `docker compose up` sin pasos previos, con seeds incluidos, y un README que abre con ese comando.
- GIF o video corto del flujo principal, embebido en el README y reutilizado en el case study del portfolio.
- Resultados versionados en el repo: eval harness con precision@k/MRR (A1), p95/p99 de k6 antes y después de
  la optimización (A3). No prosa — archivos que se pueden regenerar.
- Badge de CI en verde sobre GitHub Actions.

En el modelo de datos, `demoUrl` se mantiene opcional (por si algún proyecto futuro sí la tiene), y la tarjeta
nunca renderiza un botón de demo cuando el campo está ausente.

---
## Parte 2 — Implementación en el portfolio

> **Extraída a su propio plan:** [`portfolio-projects-section.md`](./portfolio-projects-section.md).
> Ese documento está escrito contra el estado real del código (verificado el 27 ago 2026) y corrige varias
> suposiciones que este borrador arrastraba.

Resumen de lo decidido allí:

- **Se publican solo B1 (Stepstone) y B2 (Axxis) ahora.** A1, A2 y A3 son ~4 meses de trabajo; publicar tres
  tarjetas en estado "en construcción" sin enlace a código durante meses resta en vez de sumar. Cada repo
  entra cuando exista y tenga algo que enseñar, y añadirlo será **editar dos JSON**, sin tocar código.
- **Rutas nuevas `/projects` y `/projects/[slug]`**, dejando la home como one-page con anclas.
- **Docker sale del alcance** y va a un plan aparte: el lineamiento 1 se escribió para los repos nuevos,
  donde levantar Postgres, Ollama o RabbitMQ con un comando es esencial. Aquí `pnpm dev` ya funciona y Vercel
  construye desde el repo.

Hallazgos de la verificación que este borrador no contemplaba:

- **El sitio es hoy una sola página.** No existe ninguna ruta `[slug]`, ni `/blog`, ni `/projects`. Añadir
  case studies introduce navegación multi-página donde no había.
- **Los enlaces del Header quedarían muertos en las subpáginas.** Son anclas desnudas (`#about`) con
  `preventDefault()` + `getElementById()`; en `/en/projects/{slug}` esas secciones no existen. Es trabajo
  real que hay que hacer, no un detalle.
- **`ProjectCard` no tiene botón de demo en absoluto** — `demoUrl` nunca se lee. Así que `demoUrl` se
  elimina del modelo y la clave muerta `projects.viewDemo` se borra, en lugar de conectarse.
- **Dos métricas del catálogo no son trazables.** ">99.9% uptime" y "+35% rendimiento" no están en
  `experience.jobs`, y el texto del CV en PDF no se pudo extraer para comprobarlas. Quedan pendientes de
  confirmar con una fuente concreta, o no se usan.
- **`LocaleSwitcher` ya preserva la ruta** — un riesgo menos de los previstos.
