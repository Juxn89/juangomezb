# P3 · `booking-agent`: agenda de citas con asistente conversacional

> Índice: [`../README.md`](../README.md) · Repo: `juxn89/booking-agent` · Demo: **video + capturas** ·
> Plan escrito el 13 oct 2026 y **revisado el 22 oct 2026** con lo aprendido en P1 (`docs-assistant`) y P2
> (`invoice-extractor`); los cambios están en §0.
> Fuentes: #13 "Appointment Scheduler" del PDF + el patrón agent loop / tool calling de "AI Code Review
> Agent" (*C# Projects for the AI Era*).

## 0. Qué cambió en la revisión (22 oct 2026)

| Antes | Ahora | Por qué |
|---|---|---|
| Sonnet por defecto, comparado con Haiku | **Claude Haiku 5.5 en todas las llamadas** | Regla del usuario para todos los proyectos. El eval mide si alcanza; si no, se ajusta el prompt o las tools, no el modelo |
| La confirmación la decidía un clasificador (Haiku) sobre el "sí" del usuario | **La confirmación es un botón**: el agente no tiene ninguna tool para confirmar | Determinístico, sin una llamada extra al modelo y sin margen para que un "sí, pero…" confirme algo. El agente propone; la persona confirma con un clic que llama a la API |
| Demo pública en Azure Container Apps + Neon + Vercel | **Video + capturas**, como P1 y P2 (decisión del usuario, 22 oct 2026) | Sin cuentas de hosting ni gasto continuo. El momento clave (reservar en el chat y ver la cita en el calendario) se graba |
| La web aparte del AppHost | **Postgres, Mailpit, la API y la web en el AppHost** desde el día 1 (`Aspire.Hosting.JavaScript`, `AddJavaScriptApp`) | Lección de P2: un solo `dotnet run`. `AddNextJsApp` sigue marcado experimental |
| E2E con el modelo real | **E2E con un cliente de chat guionado** (respuestas grabadas por turno) | Lección de P2: el E2E corre en CI sin key y sin costo; el modelo se mide en los evals |
| Sin tope de gasto definido | **USD 0,50** en el ledger compartido, sesión `workana-booking-agent` (aprobado el 22 oct 2026) | Evals de 25 conversaciones ≈ USD 0,08 por corrida |
| Video con el grabador de Playwright | **Screencast de Chromium + ffmpeg en contenedor** (imagen fijada) | Lección de P2: texto nítido a 1920×1200 y MP4 sin instalar nada |

Lo que no cambia: el dominio, el exclusion constraint, los holds con TTL, el outbox, SignalR, NodaTime y los
25 escenarios de eval.

## 1. Contexto y pitch

**Para el cliente** (clínicas, consultorios, salones de belleza, talleres, academias): *"Tus clientes reservan
escribiendo como hablan, por ejemplo 'quiero cita el martes en la tarde con la Dra. López', a cualquier hora.
Les llega la confirmación y un recordatorio, y tú ves la agenda actualizada al instante."*

Sistemas de citas y reservas es de las categorías más pedidas de Workana. Lo que separa este proyecto de un
CRUD con calendario son dos cosas difíciles de fingir:
1. **Un agente de IA que actúa sobre datos reales sin poder romperlos:** solo opera mediante herramientas
   tipadas, **no puede confirmar una reserva** (lo hace la persona con un botón) y sus conversaciones se
   evalúan automáticamente.
2. **Corrección bajo concurrencia:** dos personas que piden el último hueco al mismo tiempo nunca acaban con
   la misma cita. Lo garantiza la base de datos, no un `if` en el código.

## 2. Alcance del MVP

**Entra**
- **Negocio:** profesionales, servicios (duración y precio), horario semanal por profesional, bloqueos
  (vacaciones, almuerzo) y zona horaria del negocio.
- **Asistente conversacional** (widget en la web) con herramientas de solo lectura y de propuesta:
  `list_services`, `list_professionals`, `resolve_date`, `check_availability`, `hold_slot`,
  `find_my_bookings`, `propose_reschedule`, `propose_cancel`.
- **Confirmación en dos fases:** `hold_slot` reserva el hueco 5 minutos y el widget muestra una tarjeta con el
  resumen y los botones **Confirmar** / **Cambiar**. Confirmar llama a `POST /v1/holds/{id}/confirm` con un
  token de un solo uso. Reprogramar y cancelar siguen el mismo patrón. El agente nunca escribe una reserva
  confirmada.
- **Reserva manual** desde un formulario clásico: el agente no es la única puerta.
- **Recordatorios:** confirmación inmediata y recordatorio 24 h y 2 h antes, por un outbox. En local van a
  **Mailpit** (en el AppHost) y a una bandeja in-app.
- **Panel admin:** calendario semanal por profesional, con actualización en tiempo real (SignalR) cuando entra,
  cambia o se cancela una reserva, y la vista de los pasos del agente detrás de cada una.
- **Identificación del cliente** por email + código de 6 dígitos (OTP, visible en Mailpit) para ver,
  reprogramar o cancelar sus citas.
- **Agenda demo reproducible:** "Clínica Demo" con 3 profesionales y 5 servicios, generada con semilla y una
  fecha "hoy" configurable, para que el video y los evals siempre encuentren huecos y conflictos.

**No entra**
- Pagos y depósitos: queda un puerto, sin adaptador.
- WhatsApp: el puerto `INotificationChannel` tiene email e in-app; WhatsApp queda documentado como extensión.
- Sincronización con Google Calendar u Outlook.
- Demo pública y despliegue (ver §9).

## 3. Arquitectura

```
Chat widget ──SSE──▶ Api /v1/assistant ──▶ AgentRunner
                                              │  IChatClient (Anthropic SDK) + FunctionInvokingChatClient
                                              │  (MaximumIterationsPerRequest, un span OTel por paso)
                                              ▼
                                 Tools (adaptadores finos) ──▶ casos de uso de Application
                                                                (los mismos que usa el formulario)
Tarjeta de confirmación / Form / Panel (Next.js) ──REST──▶ Api /v1/holds, /v1/bookings, /v1/admin
                                              │
     Postgres: exclusion constraint · outbox · NotificationDispatcher y HoldSweeper (BackgroundService)
     SignalR /hubs/calendar ← eventos de dominio (BookingConfirmed, BookingRescheduled, BookingCancelled)
AppHost (Aspire 13.6.1): Postgres 18.6 · Mailpit · Api · web (AddJavaScriptApp, puerto 3010)
```

- **Las herramientas no tienen lógica:** cada tool valida su input con un JSON Schema estricto y llama al mismo
  caso de uso que el formulario. El agente **no puede hacer nada que la UI no permita**, y menos: no confirma.
- **Zonas horarias con NodaTime 3.3.5** (+ `Npgsql.EntityFrameworkCore.PostgreSQL.NodaTime`): el negocio vive
  en `America/Managua` y el cliente puede estar en otra zona. Se guarda en UTC (`timestamptz`) y se presenta en
  la zona del negocio. Las fechas relativas ("el martes", "mañana") se resuelven en el servidor con
  `resolve_date`, no por el modelo. Los tests de horario de verano usan una zona que lo tiene
  (`America/Mexico_City` hasta 2022, o `Europe/Madrid`).
- **Outbox de notificaciones:** la reserva y la notificación pendiente se escriben en la misma transacción, y el
  dispatcher las envía con reintentos. Nunca hay una cita confirmada sin aviso ni un aviso de una cita que no
  existe.
- **La IA detrás de un puerto (`IChatClient`)**, como en P1: el SDK oficial de Anthropic implementa la interfaz
  y el bucle de herramientas es el de Microsoft.Extensions.AI. Los tests y el E2E usan un `IChatClient`
  guionado.

## 4. Modelo de datos

```
businesses(id, name, time_zone, slot_granularity_min)
professionals(id, business_id, name, specialty)
services(id, business_id, name, duration_min, price numeric(10,2))
professional_services(professional_id, service_id)
working_hours(professional_id, weekday, start_local time, end_local time)
time_off(id, professional_id, period tstzrange, reason)
customers(id, business_id, name, email, phone)
bookings(id, professional_id, service_id, customer_id, period tstzrange, status, hold_expires_at,
         confirmation_token_hash, idempotency_key UNIQUE, created_at, updated_at, xmin)
   status: held | confirmed | cancelled | completed
   EXCLUDE USING gist (professional_id WITH =, period WITH &&)
           WHERE (status IN ('held','confirmed'))         ← cero solapamientos, garantizado por Postgres
notifications_outbox(id, booking_id, channel, template, scheduled_for, sent_at, attempts, last_error)
agent_conversations(id, session_id, customer_id NULL, started_at, cost_usd)
agent_steps(id, conversation_id, ordinal, kind, tool_name, input jsonb, output jsonb, latency_ms,
            input_tokens, output_tokens, cost_usd)
```

- `btree_gist` hace falta para combinar `=` y `&&` en el exclusion constraint (viene en la imagen oficial).
- **Holds que expiran:** un `HoldSweeper` pasa a `cancelled` los `held` vencidos. El constraint excluye solo
  `held` y `confirmed`, así que el hueco se libera solo.
- **El token de confirmación** se guarda como hash, vale una vez y vence con el hold.

## 5. Diseño de IA

| Aspecto | Decisión |
|---|---|
| Modelo | **`claude-haiku-5-5` en todas las llamadas** (agente y evals). Precio verificado el día 1 |
| Loop | `FunctionInvokingChatClient` con `MaximumIterationsPerRequest = 8`, tope de costo por conversación (`AgentOptions.MaxCostPerConversationUsd`) y tope diario (`DailyBudgetUsd`, como el worker de P2) |
| Tools | `strict: true` y `additionalProperties: false`; ninguna tool escribe una reserva confirmada |
| Prompt | `Prompts/booking-agent.md`: rol, datos del negocio inyectados (servicios, profesionales, zona horaria, "hoy es…"), nunca inventar disponibilidad (siempre `check_availability`), y tras `hold_slot` pedir que la persona confirme con el botón |
| **Confirmación** | La persona confirma con un botón que llama a la API con el token del hold. Si escribe "sí", el agente le recuerda el botón. El servidor rechaza cualquier confirmación sin token válido |
| Errores de tool | Mensajes accionables para el modelo ("Ese horario ya no está disponible; los 3 más cercanos son…"), nunca stack traces |
| Guardrails | Fuera de alcance (nada de consejo médico), PII mínima en `agent_steps` (email enmascarado), límite de mensajes por sesión |
| Costo esperado | Conversación típica de 6 turnos ≈ 25k tokens de input acumulados y ≈ 1,5k de output: **≈ USD 0,003 por reserva** con Haiku. Se mide en el eval y en `agent_steps` |

**Evals** (`evals/`, **25 escenarios multi-turno** con un usuario simulado guionado, una agenda inicial fija y
una fecha "hoy" fija). Como en P2: una corrida gratis en CI con un cliente guionado (prueba el harness y las
verificaciones) y la corrida con Haiku a mano, con `--allow-paid` y el guard de gasto contra el ledger.

| Métrica | Cómo | Umbral |
|---|---|---|
| Tarea llevada hasta el hold correcto | el hold creado coincide con el esperado (profesional, servicio y hora) | ≥ 0,92 |
| **Cero reservas confirmadas por el agente** | ningún `confirmed` sin la llamada del botón (determinístico, sobre la DB) | 25/25 |
| Cero disponibilidad inventada | toda hora ofrecida pasó antes por `check_availability` (sobre `agent_steps`) | 25/25 |
| Manejo de conflicto | otro usuario toma el hueco a mitad de la conversación → el agente ofrece alternativas | ≥ 4/5 |
| Fechas relativas | "el martes que viene", "pasado mañana a las 3" → fecha correcta en la zona del negocio | ≥ 0,95 |
| Eficiencia | mediana de llamadas a tools por reserva | ≤ 5 |
| Costo medio por conversación | | ≤ USD 0,01 |

## 6. Señales senior

| Señal | Dónde se ve |
|---|---|
| Concurrencia resuelta en la base de datos | exclusion constraint + test de 50 holds paralelos → 1 entra y 49 reciben un 409 legible |
| Agente con permisos acotados | las tools son adaptadores de casos de uso; el agente no puede confirmar |
| Agente evaluado como software | 25 escenarios con estado final verificado en la DB, resultados versionados (fallos incluidos) |
| Zonas horarias correctas | NodaTime, tests con cambio de horario de verano |
| Notificaciones consistentes | outbox transaccional + dispatcher con reintentos |
| Trazabilidad y costo del agente | `agent_steps` con tokens y costo + un span OTel por paso; el panel muestra el "por qué" de cada reserva |
| CI sin key y sin costo | E2E y evals guionados en cada push; los pagados, a mano y con tope |

## 7. ADRs

1. Exclusion constraint frente a locks en la aplicación o aislamiento serializable.
2. Holds con TTL para el flujo conversacional.
3. **La confirmación es de la persona (botón + token), no del agente ni de un clasificador.**
4. Las tools como adaptadores de los mismos casos de uso que la UI.
5. Outbox transaccional para notificaciones.

## 8. Tests

- **Domain:** disponibilidad (horario, bloqueos, granularidad, duración del servicio), horario de verano y
  reglas de reprogramación y cancelación (por ejemplo, no cancelar con menos de 2 h).
- **Application:** casos de uso con repositorios falsos; confirmar sin token, con token vencido o reusado →
  error.
- **Arquitectura:** ArchUnitNET, regla de dependencias y que ninguna tool referencie el caso de uso de confirmar.
- **Integración (Testcontainers, Postgres 18.6):**
  - **50 tareas paralelas pidiendo el mismo hueco → exactamente 1 hold.**
  - Hold vencido → el hueco se libera.
  - La transacción del outbox es atómica (si falla el commit, no hay notificación).
  - El evento de SignalR llega a un cliente de prueba.
- **Evals:** los 25 escenarios, guionados en CI y con Haiku a mano.
- **E2E (Playwright, cliente de chat guionado):** conversación en el widget → tarjeta → Confirmar → la cita
  aparece en el calendario admin sin recargar → el recordatorio llega a la bandeja → el cliente cancela con
  OTP → el hueco se libera.

## 9. Demo

- **Video de 60-90 s y capturas en español** en `docs/demo/`, grabados con Haiku real sobre la agenda demo:
  el visitante reserva en el chat y, en la pestaña del admin, la cita aparece en tiempo real. Ese es el
  momento clave.
- Sin despliegue público por ahora (decisión del 22 oct 2026). Si se decide después, el plan original (Azure
  Container Apps + Neon + Vercel, límites por sesión e IP y tope diario) sigue siendo el punto de partida.

## 10. Plan día a día

| Día | Trabajo |
|---|---|
| 1 | Repo (`AGENTS.md`, `CLAUDE.md`, CI, CPM, `.gitattributes`), solución en capas y AppHost con Postgres, Mailpit y web; dominio (disponibilidad, horario, bloqueos) con NodaTime y tests de horario de verano |
| 2 | Esquema con exclusion constraint y holds; casos de uso Hold, Confirm (token), Reschedule y Cancel; **test de concurrencia de 50**; HoldSweeper |
| 3 | API REST + formulario manual; outbox + dispatcher; bandeja in-app y Mailpit |
| 4 | Tools con esquemas estrictos sobre los casos de uso; `resolve_date`; AgentRunner con M.E.AI, límites, costo y trazas; cliente guionado |
| 5 | Prompt, errores accionables y tarjeta de confirmación; guardrails |
| 6 | Harness de evals multi-turno (usuario simulado + verificación de estado); 25 escenarios; corrida guionada en CI y corrida con Haiku registrada en el ledger |
| 7 | Widget de chat (SSE) en la web; identificación por OTP; "mis citas" |
| 8 | Panel admin: calendario semanal, SignalR y vista de pasos del agente por reserva |
| 9 | E2E con Playwright; video y capturas (screencast + ffmpeg) |
| 10 | README según el gist (arte con `readme-assets.mjs`), `workana.md` y entrada en el portfolio |

## 11. GitHub metadata y ficha Workana

- **Descripción:** "Conversational appointment booking in .NET 10: Claude Haiku tool-calling agent that can propose but never confirm, zero double-booking via Postgres exclusion constraints, outbox reminders, real-time calendar, agent evals."
- **Topics:** `dotnet`, `csharp`, `ai-agent`, `tool-calling`, `appointment-scheduling`, `booking-system`, `claude`, `anthropic`, `microsoft-extensions-ai`, `postgresql`, `concurrency`, `signalr`, `nodatime`, `outbox-pattern`, `llm-evaluation`, `nextjs`, `aspire`

**Borrador de la ficha Workana (ES)**
- **Título:** Agenda de citas con asistente de IA: tus clientes reservan escribiendo, sin dobles reservas
- **Problema:** perder citas por no contestar a tiempo, las dobles reservas y los clientes que olvidan su
  cita.
- **Solución:** un asistente que encuentra horarios, propone la cita y la deja lista para que el cliente la
  confirme con un clic; envía recordatorios y actualiza tu calendario al instante.
- **Qué demuestra:** IA con permisos acotados (propone, nunca confirma) y probada en 25 escenarios, cero
  dobles reservas incluso con 50 solicitudes simultáneas, y manejo correcto de horarios y zonas horarias.
  Video del flujo completo.
- **Stack:** .NET 10, PostgreSQL, Claude Haiku (agente con herramientas), SignalR, Next.js, .NET Aspire.

## 12. Verificación / terminado

- Tests (incluido el de concurrencia), evals guionados y E2E en CI. La corrida de evals con Haiku, por encima
  de los umbrales y registrada en el ledger.
- En local: "quiero una limpieza dental el martes en la tarde" → el agente ofrece horas reales y deja una
  tarjeta; solo tras Confirmar la cita aparece en el panel admin vía SignalR.
- Escribir "sí" sin tocar el botón, o cambiar de tema → no se confirma nada y el hold vence a los 5 min.
- Dos navegadores piden el mismo hueco a la vez → uno obtiene el hold y el otro recibe alternativas.
- Checklist común de [`../README.md`](../README.md#definición-de-terminado-común-a-todos), con el README según
  los lineamientos del gist.

## Versiones verificadas (22 oct 2026)

Fuente: API de registro de NuGet. Regla: la versión más nueva con **al menos 2 semanas** de antigüedad (antes
del 8 oct 2026). Se vuelven a verificar el día 1.

| Paquete | Más nueva | Elegible | Licencia |
|---|---|---|---|
| `NodaTime` | 3.3.5 (30 sep) | **3.3.5** | Apache-2.0 |
| `Npgsql.EntityFrameworkCore.PostgreSQL` y `.NodaTime` | 10.0.3 (10 jul) | **10.0.3** | PostgreSQL |
| `Anthropic` | 13.1.0 (21 oct) | **12.54.0** (7 oct), la de P2 | MIT |
| `Microsoft.Extensions.AI` / `.Abstractions` | 10.11.0 (14 oct) | **10.10.x** | MIT |
| `Aspire.Hosting.*` (PostgreSQL, JavaScript) | 13.6.3 (21 oct) | **13.6.1** (7 oct) | MIT |
| Imagen `postgres` | | **18.6-alpine**, con `btree_gist` | PostgreSQL |
| Imagen `axllent/mailpit` | | **v1.31.2** (la de P1) | MIT |
