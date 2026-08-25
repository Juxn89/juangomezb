# A3 · Plataforma event-driven de ofertas de empleo (`talent-flow`)

> Plan de un **repositorio nuevo**, separado del portfolio. Vive aquí hasta que el repo exista; entonces se
> mueve a `docs/plans/` de ese repo. Proyecto A3 del catálogo en
> [`featured-projects-catalog.md`](./featured-projects-catalog.md). Es el tercero en orden de construcción,
> después de [A2 `talent-mcp`](./a2-talent-mcp.md) y [A1 `talent-match`](./a1-talent-match.md).

## Context

A3 es el proyecto más grande del catálogo y el que habla el vocabulario exacto que evalúan los
entrevistadores senior: consistencia eventual, outbox, saga, idempotencia, DLQ, observabilidad distribuida y
números de carga. Extiende `juxn89/net-core-microservice` (.NET 8 + Ocelot + SQL Server + MongoDB) en vez de
partir de cero — cambiando Ocelot por YARP y, sobre todo, **sacando SQL Server y MongoDB por sus licencias**.

El riesgo de un proyecto así es quedarse en el diagrama. Cualquiera dibuja una saga; lo que separa es
**demostrar que converge cuando algo falla**. Por eso el corazón de A3 son tres pruebas —el broker cae a
mitad de saga, el mismo mensaje llega dos veces, la compensación se dispara— y una tabla de k6 con el
antes/después de optimizaciones concretas.

Aplican los diez lineamientos transversales del catálogo.

---

## Terreno verificado (25 ago 2026)

**El hallazgo que cambia el plan:** la librería obvia para outbox y saga en .NET dejó de ser open source.

| Pieza | Estado | Licencia |
|---|---|---|
| **MassTransit v9** | Anunciada abr 2025, publicada **ene 2026**. Source-available, exige *license key* en runtime. Descuento del 100% bajo $1M de ingresos, pero **la key sigue siendo requisito** | ❌ Comercial |
| MassTransit v8 | Sigue publicándose y es Apache-2.0 a perpetuidad, pero el propio vendor la declara **sin soporte, sin fecha de fin** | ⚠️ Apache-2.0 sin soporte |
| **Rebus** | Maduro, mantenido, cubre saga, reintentos y outbox sobre RabbitMQ | ✅ **MIT** |
| **Wolverine** | Potente, .NET 10 y AOT-friendly, outbox transaccional sobre Postgres. Pero **open-core**: JasperFx monetiza CritterWatch y features de multi-tenancy y escala | ⚠️ MIT open-core |
| **RabbitMQ 4.2** | Broadcom. Edición community sin topes de uso ni de features en mensajería core | ✅ **MPL-2.0** |
| **YARP 2.3.0** | Soporta .NET 10 | ✅ **MIT** |

Un `license key` en runtime rompe el lineamiento 1 —clonar y correr— para cualquiera que abra el repo. Eso
descarta MassTransit v9 sin más discusión.

---

## Decisiones cerradas (usuario)

| Decisión | Elección |
|---|---|
| Outbox, idempotencia y saga | **A mano** sobre el cliente RabbitMQ, con ADR comparando las cuatro opciones |
| Servicios | **Tres**: Jobs, Applications, Notifications (+ gateway). Search se absorbe como proyección de lectura dentro de Jobs |
| Infraestructura | **Compose + manifiestos k8s probados en k3d**. Sin Terraform |

**Sobre escribirlo a mano.** No es dogma ni desconfianza en las librerías: es que `.UseMassTransit()`
esconde exactamente las piezas que se están evaluando. El ADR debe decirlo con todas las letras — **en
producción la elección sería Rebus** (MIT puro, maduro), y el hand-roll aquí es didáctico y además esquiva
toda pregunta de licencia. Un revisor que vea el ADR entiende que la decisión fue consciente; sin el ADR,
parece que reinventaste MassTransit por no conocerlo.

**Sobre Terraform.** Se cae a propósito: un módulo que nunca se aplica contra una cuenta real es código no
ejecutado, y el lineamiento 9 dice que lo no ejecutado no está verificado. Los manifiestos de k8s sí se
prueban de verdad, en k3d local.

**Alcance realista: ~7-8 semanas.** El catálogo estimaba 4-6. Escribir outbox, inbox y saga a mano, más las
pruebas de consistencia y el ciclo de k6, no cabe en menos. Orden de corte: k8s/k3d → Notifications (se
simula dentro de Applications) → la segunda optimización de k6. **Las tres pruebas de consistencia eventual
no se recortan**: son el proyecto.

---

## Identidad y artefactos

| | |
|---|---|
| Repo | `juxn89/talent-flow` |
| Slug / ruta en el portfolio | `talent-flow` → `/[locale]/projects/talent-flow` |
| Imágenes | `ghcr.io/juxn89/talent-flow-{gateway,jobs,applications,notifications}` |
| Prefijo de proyectos | `TalentFlow.*` |

---

## Arquitectura

```
/src
  TalentFlow.Shared.Contracts/     → eventos versionados. Lo ÚNICO que un servicio comparte con otro
  TalentFlow.Shared.Messaging/     → outbox, inbox, saga: las primitivas escritas a mano
  TalentFlow.Gateway/              → YARP 2.3.0
  TalentFlow.Jobs.{Domain,Application,Infrastructure,Api}/
  TalentFlow.Applications.{Domain,Application,Infrastructure,Api}/
  TalentFlow.Notifications.{Domain,Application,Infrastructure,Api}/
/tests
  TalentFlow.Architecture.Tests/   → límites entre servicios, no solo capas
  TalentFlow.*.Domain.Tests/       → reglas puras
  TalentFlow.Consistency.Tests/    → las tres pruebas que sostienen el proyecto
  TalentFlow.Contracts.Tests/      → compatibilidad de esquema de eventos
  TalentFlow.E2E/                  → compose real, saga completa de punta a punta
/load
  k6/                              → escenarios + resultados versionados
/deploy
  compose.yaml, k8s/, otel/, grafana/dashboards/
/docs
  adr/
```

Cada servicio tiene **su propia base de datos**. Ninguno lee las tablas de otro — esa es la línea que
convierte esto en microservicios y no en tres apps compartiendo un esquema.

**El arch test más valioso del repo** no es el de capas, es el de límites: `TalentFlow.Jobs.*` no puede
referenciar `TalentFlow.Applications.Domain` ni ningún otro servicio. Lo único compartido es
`Shared.Contracts`. Un test lo verifica en cada PR, porque este es exactamente el acoplamiento que se cuela
sin querer.

### Constantes

Nombres de exchanges, colas y routing keys; estados de saga; versiones de evento; headers de mensaje;
TTLs de las colas de reintento; límites de lote del outbox → `IOptions<T>`. En un sistema de mensajería un
routing key mal escrito no rompe el build: rompe en producción, en silencio, un martes.

---

## La saga: "candidato aplica a vacante"

```
POST /applications
  └─ Applications: guarda Application(Pending) + evento en outbox  ← MISMA transacción
      └─ OutboxPublisher → RabbitMQ
          └─ Jobs: ¿la vacante sigue abierta y con cupo?
              ├─ sí → JobSlotReserved
              │    └─ Applications: saga → Accepted
              │         └─ Notifications: avisa al candidato (idempotente)
              └─ no → JobClosed
                   └─ Applications: COMPENSA → Rejected + notifica el rechazo
```

### Las piezas escritas a mano

**Outbox.** Tabla `outbox_messages` en la BD del servicio; el evento se escribe en la **misma transacción**
que el cambio de estado, así que o pasan los dos o ninguno. Un `BackgroundService` publica los pendientes
usando `SELECT … FOR UPDATE SKIP LOCKED`, lo que permite **varias instancias del servicio publicando en
paralelo sin pisarse** — el detalle que separa un outbox de juguete de uno que aguanta escalado horizontal.

**Inbox / idempotencia.** Tabla `inbox_messages` con el `MessageId` como clave única. El consumidor intenta
insertar antes de procesar; si la inserción viola el unique, el mensaje ya se procesó y se descarta. Así
se convierte el *at-least-once* del broker en un efecto exactamente-una-vez, sin coordinación distribuida.

**Saga.** Máquina de estados persistida (`saga_instances`: `CorrelationId`, estado, versión), con
transiciones explícitas y **concurrencia optimista por versión** — dos mensajes concurrentes para la misma
saga no pueden pisarse.

**Reintentos y DLQ, sin plugins.** Colas de reintento escalonadas con TTL + dead-letter exchange
(`retry-5s` → `retry-30s` → `retry-5m` → DLQ). Se evita a propósito el plugin de mensajes retardados: menos
piezas que instalar y el mecanismo queda visible en la configuración, que es lo que se quiere mostrar.

**Polly** (`Microsoft.Extensions.Http.Resilience`) para el HTTP del gateway hacia los servicios.

---

## Consistencia eventual: probada, no dibujada

`TalentFlow.Consistency.Tests` son las tres pruebas que sostienen todo el proyecto:

1. **El broker se cae a mitad de saga.** Se tumba RabbitMQ tras persistir el outbox pero antes de publicar,
   se levanta, y se verifica que la saga converge sola sin intervención ni mensajes perdidos.
2. **El mismo mensaje llega dos veces.** Entrega duplicada deliberada → un solo efecto observable, una sola
   notificación. Es la prueba de que el inbox hace su trabajo.
3. **La compensación se dispara.** La vacante se cierra entre la postulación y la reserva → la saga compensa
   y termina en `Rejected` con su notificación, sin quedarse colgada.

Se ejecutan con Testcontainers en CI. Sin estas tres pruebas, el repo solo afirma que entiende sagas.

**Contratos de evento.** `TalentFlow.Contracts.Tests` verifica compatibilidad hacia atrás: un consumidor de
`v1` debe seguir funcionando contra un productor `v2`. En un sistema event-driven eso importa más que un
contrato HTTP; Pact se evaluó y se descartó por alcance, y queda dicho en un ADR.

---

## Carga con k6: la evidencia titular

Escenario: postulaciones sostenidas contra el gateway. Se miden cuatro cosas, no una:

- **p95/p99 de la API** de postulación,
- **throughput del outbox** (mensajes publicados por segundo),
- **lag de la saga** — tiempo desde `submitted` hasta `accepted`, que es la métrica que de verdad ve el
  usuario,
- **profundidad de colas** y tasa de DLQ.

**Dos optimizaciones medidas, con antes y después publicados:**

| # | De | A | Qué se espera |
|---|---|---|---|
| 1 | Outbox con polling cada segundo, fila a fila | Lotes + `SKIP LOCKED` + `LISTEN/NOTIFY` de Postgres para despertar al publisher | Caída fuerte del lag de saga, sobre todo en p99 |
| 2 | Listado de vacantes contra la BD en cada request | Proyección de lectura + caché en **Valkey** con invalidación por evento | Caída del p95 de lectura y menos carga en Postgres |

**Advertencia que va en el README, no escondida:** k6 corriendo en la misma máquina mide *esa máquina*. Se
publica el hardware exacto y se compara **solo antes contra después en el mismo equipo**. Presentar cifras
absolutas de un portátil como si fueran de producción es precisamente el tipo de afirmación que el
lineamiento 9 existe para evitar.

---

## Observabilidad

OTel con el **trace context propagado a través del broker**: `traceparent` viaja en los headers del mensaje,
así que una sola traza cruza API → outbox → RabbitMQ → consumidor → saga → notificación. Ese árbol completo
en Jaeger es el screenshot que vende el repo, y es la respuesta a "¿cómo depurás esto en producción?".

Dashboards de Grafana versionados como código: latencia por servicio, profundidad de colas, **edad del
mensaje más viejo del outbox** (la métrica que primero avisa de que algo se atascó), sagas por estado y
tasa de DLQ.

---

## Fases

### F0 · Spike y reglas del repo (2-3 días)
- `AGENTS.md` + `CLAUDE.md` propios (lineamiento 10), fijando .NET 10, RabbitMQ 4.2, YARP 2.3.0, la decisión
  de no usar MassTransit y por qué.
- Compose con RabbitMQ, Postgres (una BD por servicio) y Valkey.
- Spike del outbox: `SKIP LOCKED` con dos instancias en paralelo, y `LISTEN/NOTIFY` funcionando.
- Decidir y probar el escalonado de colas de reintento sin plugins.

### F1 · Shared: contratos y mensajería (6-7 días)
- `Shared.Contracts` con eventos versionados; `Shared.Messaging` con outbox, inbox y saga.
- **Arch tests y constantes desde aquí**, incluido el test de límites entre servicios.

### F2 · Jobs + Applications, camino feliz (6-7 días)
- Los dos servicios con sus capas, gateway YARP, y la saga completando el flujo exitoso.

### F3 · Compensación, reintentos, DLQ y Notifications (5-6 días)
- Camino de compensación, colas escalonadas, DLQ y el tercer servicio.

### F4 · Pruebas de consistencia y contratos (4-5 días)
- Las tres pruebas clave con Testcontainers y los tests de compatibilidad de eventos.

### F5 · Observabilidad (3-4 días)
- Propagación de `traceparent` por el broker y dashboards versionados.

### F6 · Carga y optimización (4-5 días)
- Baseline de k6, las dos optimizaciones, y la tabla antes/después en `/load`.

### F7 · k8s, CI y documentación (4 días)
- Manifiestos probados en k3d; CI con build + arquitectura + unitarios + consistencia + contratos + E2E como
  gate; README que abre con `docker compose up`, GIF, tabla de k6 y ADRs.

---

## Tests

Los cinco niveles del lineamiento 8, todos bloqueando el merge:

1. **Arquitectura** — capas dentro de cada servicio, y **límites entre servicios**: nadie referencia el
   dominio ajeno, solo `Shared.Contracts`.
2. **Dominio** — reglas de negocio puras por servicio, sin Docker.
3. **Mensajería** — outbox, inbox y transiciones de saga como unidades, incluida la concurrencia optimista.
4. **Consistencia y contratos** — las tres pruebas de arriba más la compatibilidad de esquemas.
5. **E2E** — contra el compose real: postular vía gateway y ver la saga terminar con su notificación.

---

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Escribir outbox y saga a mano trae bugs sutiles de concurrencia | Las tres pruebas de consistencia son el gate, y el outbox se prueba con **varias instancias en paralelo**, no una |
| Parecer que se reinventó MassTransit por desconocerlo | ADR explícito comparando las cuatro opciones y diciendo que en producción sería Rebus |
| k6 local mide el portátil, no producción | Hardware declarado y solo comparaciones antes/después en el mismo equipo. Nunca cifras absolutas |
| Propagar `traceparent` por el broker se hace a mano | Se implementa y se prueba en F5 con un test que asserta un solo `TraceId` de punta a punta |
| Alcance de 7-8 semanas | Orden de corte: k8s → Notifications → segunda optimización. Las pruebas de consistencia no se tocan |
| Wolverine/Rebus podrían cambiar de licencia más adelante | Irrelevante aquí: no se depende de ninguna. Es un efecto secundario agradable del hand-roll |

---

## Verificación

```bash
docker compose up -d                             # gateway, 3 servicios, Postgres x3, Valkey, RabbitMQ, OTel
dotnet test tests/TalentFlow.Architecture.Tests  # capas y límites entre servicios, sin Docker
dotnet test tests/TalentFlow.Consistency.Tests   # las tres pruebas clave
dotnet test                                      # todo, incluido E2E
k6 run load/k6/apply-flow.js                     # baseline / después
kubectl apply -k deploy/k8s                      # sobre k3d
```

Comprobaciones manuales:
1. Postular vía gateway y ver la saga completarse; el mismo POST repetido con la misma clave no crea dos
   postulaciones.
2. Tumbar RabbitMQ a mitad de vuelo, levantarlo, y ver la saga converger sin tocar nada.
3. Cerrar la vacante entre medias y ver la compensación terminar en `Rejected` con su notificación.
4. Una sola traza en Jaeger que va de la API a la notificación cruzando el broker.
5. El dashboard muestra la edad del outbox subir al pausar el publisher y volver a cero al reanudarlo.
6. La tabla de `/load` muestra el delta de las dos optimizaciones con el hardware declarado.

---

## Fuentes

- [MediatR and MassTransit Commercial License Changes — Milan Jovanović](https://milanjovanovic.tech/blog/mediatr-and-masstransit-going-commercial-what-this-means-for-you)
- [MassTransit — FOSSED (estado de licencia)](https://dariusz-wozniak.github.io/fossed/library/masstransit)
- [Rebus](https://github.com/rebus-org/Rebus) · [MassTransit Alternatives: Rebus y NServiceBus — Code Maze](https://code-maze.com/aspnetcore-comparison-of-rebus-nservicebus-and-masstransit/)
- [A Quick Note About JasperFx's Plans for Marten & Wolverine](https://jeremydmiller.com/2025/04/02/a-quick-note-about-jasperfxs-plans-for-marten-wolverine/) · [Critter Stack 2026](https://jeremydmiller.com/2026/04/29/critter-stack-2026/)
- [rabbitmq-server LICENSE (MPL-2.0)](https://github.com/rabbitmq/rabbitmq-server/blob/main/LICENSE)
- [dotnet/yarp](https://github.com/dotnet/yarp) · [Yarp.ReverseProxy 2.3.0](https://www.nuget.org/packages/Yarp.ReverseProxy)
