# LinkedIn · sección Proyectos

> Fichas de los cuatro proyectos de IA para la sección Proyectos del perfil de LinkedIn, en inglés (perfil
> principal) y en español (perfil en el segundo idioma). Escritas el 16 nov 2026 para reclutadores y hiring
> managers: qué hace, decisiones técnicas, resultados medidos y stack. Las cifras salen de los README y evals de cada
> repo, igual que en los casos de estudio de juangomezb.com y en las fichas de Workana y Upwork.

## Estado (17 nov 2026)

Los cuatro están publicados en el perfil, en inglés, con 5 habilidades, el caso de estudio y el repo como
multimedia, y fechas oct 2026 – oct 2026. LinkedIn los ordena alfabéticamente cuando tienen la misma fecha.

**LinkedIn no permite traducir Proyectos al segundo idioma.** En la vista en español (`?locale=es-ES`) la página de
proyectos descarta los parámetros de idioma y sus formularios editan la versión principal (Experiencia sí se
traduce: su formulario lleva `?language=es&country=ES&locale=es-ES`). Por eso el perfil en español muestra los
proyectos en inglés; las descripciones ES de abajo quedan como referencia.

Al agregar un enlace como multimedia, la vista previa suele fallar al primer intento ("We couldn't load a preview"):
"Try again" la carga. El título que toma de GitHub pasa de 200 caracteres y hay que acortarlo.

## Cómo cargarlas

Perfil → **Añadir sección** → **Proyectos**, una por proyecto:

- **Nombre** y **Descripción** (máx. 2.000 caracteres): los de abajo. Texto plano: LinkedIn no muestra Markdown.
- **Habilidades** (hasta 5): elegir de la lista que sugiere LinkedIn el nombre más parecido.
- **Multimedia**: enlace al caso de estudio (`/en/` en el perfil en inglés, `/es/` en el de español) y al repo.
- **Fechas**: inicio y fin, octubre de 2026. **Asociado con**: vacío (proyectos propios).
- En la versión en español del perfil, el mismo proyecto con el nombre y la descripción en español.

Después, en **Destacados**, los cuatro casos de estudio como enlaces, en el mismo orden.

---

## 1. booking-agent

**Nombre EN:** booking-agent · AI booking assistant that cannot double-book
**Nombre ES:** booking-agent · Asistente de reservas con IA sin dobles reservas
**Habilidades:** .NET · C# · Large Language Models (LLM) · AI Agents · PostgreSQL
**Multimedia:** https://www.juangomezb.com/en/projects/booking-agent (ES: /es/projects/booking-agent) · https://github.com/Juxn89/booking-agent

**Descripción EN**

```text
Conversational appointment booking: customers write as they would to a receptionist, an AI assistant finds a real free slot and holds it, and the customer confirms with a button. The AI proposes; it cannot confirm or cancel anything.

• Tool calling with narrow tools over the same use cases as the web form; an architecture test keeps any tool from confirming or cancelling.
• Double booking is impossible by design: a PostgreSQL exclusion constraint on time ranges, with holds that expire. 50 simultaneous requests for one slot produce exactly one booking.
• Dates like "next Tuesday" are resolved on the server in the business's time zone, not guessed by the model.
• Reminders through a transactional outbox, sign-in with an emailed code, and a live SignalR panel showing the conversation and cost behind every AI booking.
• Evaluated like software: 28/28 scripted conversations ended as expected, 0 bookings confirmed by the AI, USD 0.0024 per conversation. 133 automated tests plus a Playwright end-to-end test on every push.

Stack: C# 14 / .NET 10, ASP.NET Core Minimal APIs, EF Core with PostgreSQL, NodaTime, SignalR, .NET Aspire, Claude Haiku through Microsoft.Extensions.AI, Next.js, Playwright.
```

**Descripción ES**

```text
Agenda de citas por chat: el cliente escribe como le hablaría a una recepcionista, un asistente con IA encuentra un horario libre real y lo aparta, y el cliente lo confirma con un botón. La IA propone; no puede confirmar ni cancelar nada.

• Tool calling con herramientas acotadas sobre los mismos casos de uso del formulario web; una prueba de arquitectura impide que alguna herramienta confirme o cancele.
• La doble reserva es imposible por diseño: una restricción de exclusión de PostgreSQL sobre rangos de tiempo, con reservas apartadas que vencen solas. 50 pedidos simultáneos por el mismo horario producen exactamente una reserva.
• Fechas como "el martes que viene" se calculan en el servidor, en la zona horaria del negocio; el modelo no las adivina.
• Recordatorios con un outbox transaccional, acceso con un código enviado por correo y un panel en vivo con SignalR que muestra la conversación y el costo detrás de cada reserva hecha por la IA.
• Evaluado como software: 28 de 28 conversaciones guionadas terminaron como se esperaba, 0 reservas confirmadas por la IA, USD 0,0024 por conversación. 133 pruebas automatizadas y una prueba de punta a punta con Playwright en cada push.

Stack: C# 14 / .NET 10, ASP.NET Core Minimal APIs, EF Core con PostgreSQL, NodaTime, SignalR, .NET Aspire, Claude Haiku con Microsoft.Extensions.AI, Next.js, Playwright.
```

## 2. docs-assistant

**Nombre EN:** docs-assistant · AI support assistant (RAG) that cites its sources
**Nombre ES:** docs-assistant · Asistente de soporte con IA (RAG) que cita sus fuentes
**Habilidades:** .NET · C# · Retrieval-Augmented Generation (RAG) · Large Language Models (LLM) · PostgreSQL
**Multimedia:** https://www.juangomezb.com/en/projects/docs-assistant (ES: /es/projects/docs-assistant) · https://github.com/Juxn89/docs-assistant

**Descripción EN**

```text
An embeddable AI support assistant that answers from a business's own documents, cites every answer and hands the conversation to a person when it doesn't know.

• Hybrid retrieval in PostgreSQL: pgvector for meaning plus full-text search for exact words and numbers, fused with Reciprocal Rank Fusion. Questions and documents can be in different languages (English and Spanish).
• Below a measured similarity floor it abstains instead of guessing, without calling the model. Passages shaped like injected instructions are quarantined before they reach it.
• Handoff to a human with lead capture and an email with the whole conversation; a 9 KB widget that installs with one line; several businesses on one deployment, each seeing only its own data.
• Measured on a 54-question bilingual eval: 98% retrieval hit@5, 0 invented answers, 12/12 prompt-injection attacks resisted, USD 0.33 per 1,000 questions.

Stack: C# / .NET 10, PostgreSQL with pgvector, .NET Aspire, Claude Haiku behind a swappable port, TypeScript, Playwright.
```

**Descripción ES**

```text
Un asistente de soporte con IA, embebible en cualquier sitio, que responde con los documentos del propio negocio, cita cada respuesta y pasa la conversación a una persona cuando no sabe.

• Búsqueda híbrida en PostgreSQL: pgvector para el significado y búsqueda de texto completo para palabras y números exactos, combinadas con Reciprocal Rank Fusion. Las preguntas y los documentos pueden estar en idiomas distintos (español e inglés).
• Por debajo de un umbral de similitud medido, se abstiene en lugar de adivinar, sin llamar al modelo. Los fragmentos con forma de instrucciones inyectadas se aíslan antes de llegar a él.
• Traspaso a una persona con captura del contacto y un correo con toda la conversación; un widget de 9 KB que se instala con una línea; varios negocios en un mismo despliegue, cada uno con acceso solo a sus datos.
• Medido con una evaluación bilingüe de 54 preguntas: 98 % de hit@5 en la recuperación, 0 respuestas inventadas, 12 de 12 ataques de prompt injection resistidos, USD 0,33 por cada 1.000 preguntas.

Stack: C# / .NET 10, PostgreSQL con pgvector, .NET Aspire, Claude Haiku detrás de un puerto intercambiable, TypeScript, Playwright.
```

## 3. invoice-extractor

**Nombre EN:** invoice-extractor · AI invoice reading with accounting checks and human review
**Nombre ES:** invoice-extractor · Lectura de facturas con IA, validación contable y revisión humana
**Habilidades:** .NET · C# · Large Language Models (LLM) · PostgreSQL · Next.js
**Multimedia:** https://www.juangomezb.com/en/projects/invoice-extractor (ES: /es/projects/invoice-extractor) · https://github.com/Juxn89/invoice-extractor

**Descripción EN**

```text
Turns photos and PDFs of invoices and receipts into rows ready for accounting. Claude reads each document, deterministic accounting rules check every number, and anything that doesn't add up goes to a person.

• Reads digital PDFs, scans, phone photos and thermal receipts, in English or Spanish.
• Rules after the model: lines add up to the subtotal, subtotal plus tax gives the total, the tax rate exists in that country and the tax ID (RUC, RFC) has the right format. Documents that pass are approved automatically.
• Work queue in PostgreSQL, a review screen with the original alongside and the failing field flagged, duplicate detection even across a PDF and a photo of the same invoice, and Excel or CSV export.
• Visible cost per document and a daily spending cap.
• Evals: 0 of 42 false auto-approvals, 7 of 7 planted errors sent to review, 100% accuracy on total, date, tax ID and invoice number with one retry, USD 0.00065 per document.

Stack: C# / .NET 10, PostgreSQL, .NET Aspire, Claude Haiku, Next.js, TypeScript, Playwright.
```

**Descripción ES**

```text
Convierte fotos y PDFs de facturas y recibos en filas listas para contabilidad. Claude lee cada documento, reglas contables determinísticas revisan cada número y lo que no cuadra pasa por una persona.

• Lee PDF digital, escaneos, fotos del celular y recibos térmicos, en español o en inglés.
• Reglas después del modelo: las líneas suman el subtotal, subtotal más impuesto da el total, la tasa existe en ese país y el RUC o RFC tiene el formato correcto. Lo que pasa todas las reglas se aprueba solo.
• Cola de trabajo en PostgreSQL, pantalla de revisión con el original al lado y el campo que falla marcado, detección de duplicados aunque la misma factura llegue como PDF y como foto, y exportación a Excel o CSV.
• Costo visible por documento y tope diario de gasto.
• Evaluaciones: 0 de 42 aprobaciones automáticas falsas, 7 de 7 errores sembrados enviados a revisión, 100 % de acierto en total, fecha, ID fiscal y número de factura con un reintento, USD 0,00065 por documento.

Stack: C# / .NET 10, PostgreSQL, .NET Aspire, Claude Haiku, Next.js, TypeScript, Playwright.
```

## 4. data-chat

**Nombre EN:** data-chat · Ask your sales data in plain words (safe text-to-SQL)
**Nombre ES:** data-chat · Pregúntale a tus ventas en lenguaje natural (text-to-SQL seguro)
**Habilidades:** .NET · C# · Large Language Models (LLM) · PostgreSQL · Data Analysis
**Multimedia:** https://www.juangomezb.com/en/projects/data-chat (ES: /es/projects/data-chat) · https://github.com/Juxn89/data-chat

**Descripción EN**

```text
Plain-language questions over sales spreadsheets, in English or Spanish, answered with the figure, a chart, a one-line summary and the query behind it. The AI never writes SQL.

• The model returns a semantic query (metrics and dimensions the user confirmed), validated against a schema generated per file; the server compiles it to parameterized, read-only SQL.
• It asks instead of guessing when a question can be read two ways, and every figure in the summary is checked against the result: a summary that cites a number that isn't there is not shown.
• The chart follows the shape of the answer (trend, ranking, period comparison), follow-up questions keep their context, and every question is logged with its cost under a daily cap.
• Evals: 75/75 questions answered with the right figures, 20/20 injection attempts with no effect on the data, 0 invented figures, USD 0.00058 per question.

Stack: C# / .NET 10, PostgreSQL, .NET Aspire, Claude Haiku, Next.js, TypeScript, Recharts, Playwright.
```

**Descripción ES**

```text
Preguntas en lenguaje natural sobre hojas de ventas, en español o en inglés, respondidas con la cifra, un gráfico, un resumen de una línea y la consulta que hay detrás. La IA nunca escribe SQL.

• El modelo devuelve una consulta semántica (métricas y dimensiones que la persona confirmó), validada contra un esquema generado para cada archivo; el servidor la compila a SQL parametrizado y de solo lectura.
• Pregunta en lugar de adivinar cuando una pregunta se puede entender de dos formas, y cada cifra del resumen se compara con el resultado: un resumen que cita un número que no está no se muestra.
• El gráfico sigue la forma de la respuesta (tendencia, ranking, comparación entre periodos), las preguntas de seguimiento mantienen el contexto y cada pregunta queda registrada con su costo, bajo un tope diario.
• Evaluaciones: 75 de 75 preguntas respondidas con la cifra correcta, 20 de 20 intentos de manipulación sin efecto sobre los datos, 0 cifras inventadas, USD 0,00058 por pregunta.

Stack: C# / .NET 10, PostgreSQL, .NET Aspire, Claude Haiku, Next.js, TypeScript, Recharts, Playwright.
```

## 5. talent-mcp

**Nombre EN:** talent-mcp · MCP server that gives AI agents secure recruiting tools
**Nombre ES:** talent-mcp · Servidor MCP con herramientas seguras de reclutamiento para agentes de IA
**Habilidades:** .NET · C# · Model Context Protocol (MCP) · OAuth · OpenTelemetry (o la sugerencia más cercana de LinkedIn)
**Multimedia:** https://www.juangomezb.com/en/projects/talent-mcp (ES: /es/projects/talent-mcp) · https://github.com/Juxn89/talent-mcp
**Fechas:** ago 2026 – oct 2026 (repo creado el 27 ago; v1.2.0 el 21 oct)
**Estado:** publicado el 18 nov 2026 en inglés, con las 5 habilidades (.NET, C#, Model Context Protocol (MCP), OAuth, OpenTelemetry) y los dos enlaces ("talent-mcp · Case study" y el título de GitHub acortado). No está en Destacados.

**Descripción EN**

```text
A reference MCP (Model Context Protocol) server in C# that gives AI agents typed, secured tools for recruiting, built on the session-less 2026-07-28 protocol revision.

• Six typed tools for job search, candidate-fit scoring and skill extraction, each behind its own OAuth 2.1 scope (Keycloak, PKCE): read, write and destructive actions are not interchangeable.
• No sessions: pagination state travels as a signed, time-limited handle, so any replica can serve any request. Actions that cannot be undone ask for confirmation, with the reason on record.
• No LLM inside the server: scoring and skill normalization are deterministic, cost nothing to run and double as a test oracle.
• Observable end to end: the agent's trace context follows each call through the tool down to every PostgreSQL command, with per-tool latency and error metrics (OpenTelemetry).
• Five test levels gate every merge, from architecture rules to end-to-end runs through OAuth and PostgreSQL. Cold start of the dotnet tool: 323 ms, measured in CI.
• Published on NuGet as a reusable toolkit and as the talent-mcp dotnet tool (stdio), plus a container image on GHCR (Streamable HTTP).

Stack: C# / .NET 10, ASP.NET Core, EF Core with PostgreSQL, Keycloak, OpenTelemetry, Docker, Clean Architecture.
```

**Descripción ES**

```text
Un servidor MCP (Model Context Protocol) de referencia en C# que da a los agentes de IA herramientas tipadas y seguras para reclutamiento, sobre la revisión sin sesiones del protocolo (2026-07-28).

• Seis herramientas tipadas para buscar vacantes, puntuar candidatos y extraer habilidades, cada una con su propio scope de OAuth 2.1 (Keycloak, PKCE): leer, escribir y las acciones destructivas no son intercambiables.
• Sin sesiones: el estado de la paginación viaja en un handle firmado y con vencimiento, así que cualquier réplica atiende cualquier petición. Las acciones que no se pueden deshacer piden confirmación, con el motivo registrado.
• Sin LLM dentro del servidor: la puntuación y la normalización de habilidades son deterministas, no cuestan nada y sirven como oráculo de pruebas.
• Observable de punta a punta: el contexto de traza del agente sigue cada llamada desde la herramienta hasta cada comando de PostgreSQL, con métricas de latencia y errores por herramienta (OpenTelemetry).
• Cinco niveles de pruebas bloquean cada merge, desde reglas de arquitectura hasta corridas de punta a punta con OAuth y PostgreSQL. Arranque en frío del dotnet tool: 323 ms, medido en CI.
• Publicado en NuGet como librería reutilizable y como el dotnet tool talent-mcp (stdio), más una imagen de contenedor en GHCR (Streamable HTTP).

Stack: C# / .NET 10, ASP.NET Core, EF Core con PostgreSQL, Keycloak, OpenTelemetry, Docker, Clean Architecture.
```

## Acerca de: costos por proyecto y talent-mcp (aplicado el 18 nov 2026, EN y ES)

En la lista de proyectos del Acerca de, al final de cada viñeta (EN / ES):
- booking-agent: "; USD 0.0024 per conversation." / "; USD 0,0024 por conversación."
- docs-assistant: "; USD 0.33 per 1,000 questions." / "; USD 0,33 por cada 1.000 preguntas."
- invoice-extractor: "; USD 0.00065 per document." / "; USD 0,00065 por documento."
- data-chat: "; USD 0.00058 per question." / "; USD 0,00058 por pregunta."

Viñeta nueva después de data-chat:
- EN: "• talent-mcp: MCP (Model Context Protocol) server in C# that gives AI agents 6 typed recruiting tools, each behind its own OAuth 2.1 scope; published on NuGet."
- ES: "• talent-mcp: servidor MCP en C# con 6 herramientas tipadas de reclutamiento para agentes de IA, cada una con su scope de OAuth 2.1; publicado en NuGet." (el Acerca de ES queda cerca del límite de 2.600 caracteres)
