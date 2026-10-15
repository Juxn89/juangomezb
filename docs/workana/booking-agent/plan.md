# P3 · `booking-agent`: agenda de citas con asistente conversacional

> Índice: [`../README.md`](../README.md) · Base: [`dotnet-ai-template`](../dotnet-ai-template/plan.md) ·
> Semanas 5-6 · Repo: `juxn89/booking-agent` · Demo: **pública** (notificaciones en bandeja in-app) ·
> Versiones verificadas el 13 oct 2026.
> Fuentes: #13 "Appointment Scheduler" del PDF + el patrón agent loop / tool calling de "AI Code Review
> Agent" (*C# Projects for the AI Era*).

## 1. Contexto y pitch

**Para el cliente** (clínicas, consultorios, salones de belleza, talleres, academias): *"Tus clientes reservan
escribiendo como hablan, por ejemplo 'quiero cita el martes en la tarde con la Dra. López', a cualquier hora.
Les llega la confirmación y un recordatorio, y tú ves la agenda actualizada al instante."*

Sistemas de citas y reservas es de las categorías más pedidas de Workana. Lo que separa este proyecto de un
CRUD con calendario son dos cosas difíciles de fingir:
1. **Un agente de IA que actúa sobre datos reales sin poder romperlos:** solo opera mediante herramientas
   tipadas, no reserva sin confirmación explícita del usuario y sus conversaciones se evalúan
   automáticamente.
2. **Corrección bajo concurrencia:** dos personas que piden el último hueco al mismo tiempo nunca acaban con
   la misma cita. Lo garantiza la base de datos, no un `if` en el código.

## 2. Alcance del MVP

**Entra**
- **Negocio:** profesionales, servicios (duración y precio), horario semanal por profesional, bloqueos
  (vacaciones, almuerzo) y zona horaria del negocio.
- **Asistente conversacional** (widget web) con herramientas: `list_services`, `list_professionals`,
  `check_availability`, `hold_slot`, `confirm_booking`, `find_my_bookings`, `reschedule`, `cancel`.
- **Flujo de confirmación en dos fases:** `hold_slot` reserva el hueco 5 minutos y devuelve un resumen;
  `confirm_booking` solo es válido después de un "sí" del usuario. Esto lo **hace cumplir el servidor**, no
  el prompt (ver §5).
- **Reserva manual** desde un formulario clásico. El agente no es la única puerta: algunos clientes prefieren
  clic.
- **Recordatorios:** confirmación inmediata y recordatorio 24 h y 2 h antes. En la demo van a una bandeja
  in-app; con compose, a Mailpit.
- **Panel admin:** calendario semanal por profesional, con actualización en tiempo real (SignalR) cuando
  entra una reserva.
- **Identificación del cliente** por email + código de 6 dígitos (OTP) para ver, reprogramar o cancelar sus
  citas.

**No entra**
- Pagos y depósitos: queda un puerto, sin adaptador.
- Adaptador real de WhatsApp: el puerto `INotificationChannel` está listo (email, in-app) y WhatsApp se
  documenta como extensión.
- Sincronización con Google Calendar u Outlook.

## 3. Arquitectura

```
Chat widget ──SSE──▶ Api /v1/assistant ──▶ AgentRunner
                                              │  IChatClient (Claude) + FunctionInvokingChatClient
                                              │  (MaximumIterationsPerRequest, un span OTel por paso)
                                              ▼
                                 Tools (adaptadores finos) ──▶ casos de uso de Application
                                                                (los mismos que usa el formulario manual)
Form / Panel (Next.js) ──REST──▶ Api /v1/bookings, /v1/admin ──┘
                                              │
     Postgres: exclusion constraint · outbox de notificaciones · NotificationDispatcher (BackgroundService)
     SignalR hub /hubs/calendar ← eventos de dominio (BookingConfirmed, BookingCancelled…)
```

- **Las herramientas no tienen lógica:** cada tool valida su input con un JSON Schema estricto y llama al
  mismo caso de uso que el formulario. Así el agente **no puede hacer nada que la UI normal no permita**, y
  las reglas de negocio están en un solo lugar.
- **Zonas horarias con NodaTime 3.3.5:** el negocio vive en `America/Managua` y el cliente puede estar en
  otra zona. Se almacena en UTC (`timestamptz`) y se presenta en la zona del negocio. Las expresiones
  relativas ("el martes", "mañana") se resuelven en el servidor con una tool `resolve_date`, no por el
  modelo.
- **Outbox de notificaciones:** la reserva y la notificación pendiente se escriben en la misma transacción,
  y el dispatcher las envía con reintentos. Nunca hay una cita confirmada sin aviso ni un aviso de una cita
  que no existe.

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
         idempotency_key UNIQUE, created_at, updated_at)
   status: held | confirmed | cancelled | completed
   EXCLUDE USING gist (professional_id WITH =, period WITH &&)
           WHERE (status IN ('held','confirmed'))         ← cero solapamientos, garantizado por Postgres
notifications_outbox(id, booking_id, channel, template, scheduled_for, sent_at, attempts, last_error)
agent_conversations(id, session_id, customer_id NULL, started_at)
agent_steps(id, conversation_id, ordinal, kind, tool_name, input jsonb, output jsonb, latency_ms)
ai_usage(...)     ← del template
```

- `btree_gist` hace falta para combinar `=` y `&&` en el exclusion constraint.
- **Holds que expiran:** un job barre los `held` con `hold_expires_at < now()` y los pasa a `cancelled`. El
  constraint excluye solo `held` y `confirmed`, así que el hueco se libera solo.

## 5. Diseño de IA

| Aspecto | Decisión |
|---|---|
| Modelo del agente | `claude-sonnet-5-5` por defecto. El eval compara con `claude-haiku-5-5` y, si Haiku pasa los umbrales, se cambia por configuración y se documenta el ahorro |
| Loop | `FunctionInvokingChatClient` de M.E.AI con `MaximumIterationsPerRequest = 8` y un límite de costo por conversación (`AgentOptions.MaxCostPerConversationUsd`) |
| Tools | Definiciones con `strict: true` y `additionalProperties: false`. `tool_choice` en `auto` (los modelos actuales no aceptan forzar una tool) |
| Prompt | `Prompts/booking-agent.md`: rol, datos del negocio inyectados (servicios, profesionales, zona horaria y "hoy es…"), nunca inventar disponibilidad (siempre `check_availability`) y pedir confirmación con un resumen antes de confirmar |
| **Confirmación forzada por servidor** | `hold_slot` devuelve un `confirmation_token` ligado a la conversación. `confirm_booking(token)` comprueba que **después** del hold hubo un mensaje del usuario y que un clasificador barato (Haiku, salida estructurada `{affirmative: bool}`) lo marca como afirmativo. Si no, devuelve un error accionable. El prompt pide confirmación y el servidor la garantiza |
| Errores de tool | Mensajes accionables para el modelo ("Ese horario ya no está disponible; los 3 más cercanos son…"), nunca stack traces |
| Guardrails | Fuera de alcance (no da consejo médico, por ejemplo), PII mínima en `agent_steps` (email enmascarado), límite de mensajes por sesión |
| Costo esperado | Conversación típica de 6 turnos ≈ 25k tokens de input acumulados (con caching del system prompt y las tools) y ≈ 1,5k de output. **Sonnet ≈ $0,05; Haiku ≈ $0,003 por reserva**. El eval decide |

**Evals** (`tests/Evals`, **25 escenarios multi-turno** con un "usuario simulado" scriptado y un estado
inicial de agenda fijo):

| Métrica | Cómo | Umbral |
|---|---|---|
| Tarea completada | el estado final de la DB coincide con el esperado (reserva correcta: profesional, servicio y hora) | ≥ 0,92 |
| **Cero reservas sin confirmación** | ningún `confirmed` sin un "sí" previo (determinístico, sobre `agent_steps`) | 25/25 |
| Cero disponibilidad inventada | toda hora ofrecida al usuario pasó antes por `check_availability` | 25/25 |
| Manejo de conflicto | escenario donde otro usuario toma el hueco a mitad de la conversación → el agente ofrece alternativas | ≥ 4/5 |
| Fechas relativas | "el martes que viene", "pasado mañana a las 3" → fecha correcta en la zona del negocio | ≥ 0,95 |
| Eficiencia | mediana de llamadas a tools por reserva | ≤ 5 |
| Costo medio por conversación | | ≤ $0,08 |

## 6. Señales senior

| Señal | Dónde se ve |
|---|---|
| Concurrencia resuelta en la base de datos | exclusion constraint + test de 50 reservas paralelas → 1 entra y 49 reciben un 409 legible |
| Agente con permisos acotados | las tools son adaptadores de casos de uso; `confirm_booking` exige un "sí" verificado por el servidor |
| Agente evaluado como software | 25 escenarios con estado final verificado en la DB |
| Zonas horarias correctas | NodaTime, tests con cambio de horario (DST) usando una zona que lo tenga |
| Notificaciones consistentes | outbox transaccional + dispatcher con reintentos |
| Trazabilidad del agente | `agent_steps` + un span OTel por paso; el panel admin muestra el "por qué" de cada reserva |

## 7. ADRs

1. Exclusion constraint frente a locks en la aplicación o niveles de aislamiento serializables.
2. Holds con TTL para el flujo conversacional.
3. Confirmación verificada por el servidor, no confiada al prompt.
4. Las tools como adaptadores de los mismos casos de uso que la UI.
5. Outbox transaccional para notificaciones.
6. Sonnet frente a Haiku para el agente, con la tabla del eval.

## 8. Tests

- **Domain:** cálculo de disponibilidad (horario, bloqueos, granularidad y duración del servicio), DST y
  reglas de reprogramación y cancelación (por ejemplo, no cancelar con menos de 2 h).
- **Application:** casos de uso con repositorios falsos; `confirm_booking` sin un "sí" previo → error.
- **Integración (Testcontainers):**
  - **50 tareas paralelas reservando el mismo slot → exactamente 1 `confirmed`.**
  - Hold expirado → el hueco se libera.
  - La transacción del outbox es atómica (si falla el commit, no hay notificación).
  - El evento de SignalR llega al cliente de prueba.
- **Evals:** los 25 escenarios en CI (PRs que tocan `Agent/`, `Tools/` o `Prompts/`, y cada noche).
- **E2E:** conversación completa en el widget → la cita aparece en el calendario del admin sin recargar → el
  recordatorio aparece en la bandeja → el cliente cancela con OTP → el hueco se libera.

## 9. Demo y hosting

- Azure Container Apps (con WebSockets habilitados para SignalR), Neon y Vercel.
- **Negocio demo:** "Clínica Demo" con 3 profesionales, 5 servicios y una agenda semi-ocupada generada
  cada noche, para que siempre haya conflictos interesantes.
- **Modo "ver como admin"** en otra pestaña: el visitante reserva en el chat y ve aparecer la cita en el
  calendario en tiempo real. Es el momento clave del video.
- **Límites:** 30 mensajes por sesión, 3 reservas por IP al día, `DailyBudgetUsd = 2` y el tope mensual en la
  consola. El OTP de la demo se muestra en la bandeja in-app (no se envían emails reales).

## 10. Plan día a día

| Día | Trabajo |
|---|---|
| 1 | Repo desde el template; dominio (disponibilidad, horario, bloqueos) con NodaTime y tests de DST |
| 2 | Esquema con exclusion constraint y holds; casos de uso Hold, Confirm, Reschedule y Cancel; **test de concurrencia de 50** |
| 3 | API REST + formulario manual; outbox + dispatcher; bandeja in-app y Mailpit |
| 4 | Tools con esquemas estrictos sobre los casos de uso; `resolve_date`; AgentRunner con M.E.AI, límites y trazas |
| 5 | Confirmación verificada por el servidor; errores accionables; prompt |
| 6 | Harness de evals multi-turno (usuario simulado + verificación de estado); 25 escenarios; comparación Sonnet/Haiku |
| 7 | Widget de chat (SSE); identificación por OTP; "mis citas" |
| 8 | Panel admin: calendario semanal, SignalR y vista de pasos del agente por reserva |
| 9 | Despliegue, negocio demo, regeneración nocturna y límites |
| 10 | E2E, README (diagrama, ADRs, tabla de evals), video, capturas y `workana.md` |

## 11. GitHub metadata y ficha Workana

- **Descripción:** "Conversational appointment booking in .NET 10: Claude tool-calling agent with server-enforced confirmation, zero double-booking via Postgres exclusion constraints, outbox reminders, real-time calendar, agent evals."
- **Topics:** `dotnet`, `csharp`, `ai-agent`, `tool-calling`, `appointment-scheduling`, `booking-system`, `claude`, `anthropic`, `microsoft-extensions-ai`, `postgresql`, `concurrency`, `signalr`, `nodatime`, `outbox-pattern`, `llm-evaluation`, `nextjs`

**Borrador de la ficha Workana (ES)**
- **Título:** Agenda de citas con asistente de IA: tus clientes reservan escribiendo, sin dobles reservas
- **Problema:** perder citas por no contestar a tiempo, las dobles reservas y los clientes que olvidan su
  cita.
- **Solución:** un asistente que agenda, reprograma y cancela conversando, confirma siempre antes de
  reservar, envía recordatorios y actualiza tu calendario al instante.
- **Qué demuestra:** IA con permisos acotados y probada en 25 escenarios, cero dobles reservas incluso con
  50 solicitudes simultáneas, y manejo correcto de horarios y zonas horarias. **Demo en vivo: reserva en el
  chat y mira aparecer la cita en el calendario.**
- **Stack:** .NET 10, PostgreSQL, Claude (agente con herramientas), SignalR, Next.js, Azure.

## 12. Verificación / terminado

- Tests (incluido el de concurrencia), evals por encima del umbral y E2E en CI.
- En producción: "quiero una limpieza dental el martes en la tarde" → el agente ofrece horas reales, pide
  confirmación y solo tras el "sí" la cita aparece en el panel admin vía SignalR.
- Decir "no" o cambiar de tema tras el resumen → no se confirma nada y el hold expira a los 5 min.
- Dos navegadores intentan el mismo hueco a la vez → uno confirma y el otro recibe alternativas.
- Checklist común de [`../README.md`](../README.md#definición-de-terminado-común-a-todos).
