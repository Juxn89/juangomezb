# Ficha Workana · `booking-agent`

> Ficha para el portafolio de Workana, escrita el 23 oct 2026 a partir del README, los ADR y los resultados de
> evaluación del repo ([github.com/Juxn89/booking-agent](https://github.com/Juxn89/booking-agent)). El plan del
> proyecto está en [`plan.md`](plan.md), en esta misma carpeta.
>
> **Antes de publicar:** revisar en el formulario de Workana el límite de caracteres de cada campo y los nombres
> exactos de las habilidades. El video y las capturas salen de la app real, con Claude Haiku 5.5 atendiendo la
> conversación, el 23 oct 2026.

---

## Formulario de Workana (23 oct 2026)

Lo que se pega en "Agregar / Editar proyecto". El formulario pide un título (mínimo 15 caracteres), una
descripción en texto plano (mínimo 45), hasta 5 habilidades (del catálogo de Workana), una portada y una galería en
1:1, 16:9 o 4:3 (JPG, GIF o PNG, hasta 4 MB) y la fecha de finalización. No acepta video, así que el video va
como enlace en la descripción y, donde hay video, la portada es un GIF de su momento clave.

Las imágenes están en `formulario/`, ignorado por git; se regeneran con el script de la sesión del 23 oct
2026 a partir de `docs/demo` del repo del proyecto.

| Campo | Valor |
|---|---|
| Título | Agenda de citas con asistente por chat: tus clientes reservan escribiendo y nunca hay doble reserva (99 caracteres) |
| Habilidades (5) | .Net Core · Inteligencia Artificial · Chatbot · C# · React.js |
| Fecha de finalización | 10-2026 |
| Imagen de portada | `portada.gif`: el cliente pide la cita en el chat y el horario aparece al instante en el panel (18 s) |
| Imágenes de galería, en este orden | `galeria-1.jpg`: el horario apartado como tarjeta en el chat y en el panel del negocio<br>`galeria-2.jpg`: el chat con los horarios ofrecidos y, al lado, los pasos del asistente con su costo<br>`galeria-3.jpg`: "Mis citas" del cliente y la agenda semanal del negocio |
| Archivos (PDF) | Ninguno |

**Descripción** (1151 caracteres), para pegar tal cual:

```text
Tus clientes reservan escribiendo como le hablarían a una recepcionista ("una limpieza el lunes en la mañana") y un asistente con IA encuentra el servicio, el profesional y un horario libre en tu agenda real.

La IA propone y la persona decide: el asistente aparta el horario cinco minutos y el cliente lo confirma con un botón. El asistente no puede confirmar ni cancelar nada por su cuenta.

- Nunca hay doble reserva: lo garantiza la base de datos. Con 50 pedidos simultáneos por la misma hora, solo uno la obtiene.
- "Mañana" o "el martes que viene" se calculan en el servidor, en la zona horaria de tu negocio.
- Confirmación y recordatorios automáticos por correo, un día y dos horas antes.
- El cliente cambia o cancela sus citas con un código que le llega al correo, sin contraseñas.
- Panel del negocio en vivo, con la conversación y el costo detrás de cada reserva.

Medido: 28 de 28 conversaciones de prueba resueltas como se esperaba, 0 citas confirmadas por la IA y USD 0,0024 por conversación.

Stack: C# y .NET 10, PostgreSQL, Claude Haiku, SignalR, Next.js.
Video y caso de estudio: https://www.juangomezb.com/es/projects/booking-agent
```

`.Net Core` va en todos los proyectos con ese nombre exacto, el mismo de las habilidades principales del
perfil, para que cuente en su columna "Proyectos trabajados"; lo mismo `React.js` donde hay web en React.
Si alguna otra no aparece en el catálogo, se cambia por la más cercana.

## Título

**Agenda de citas con asistente por chat: tus clientes reservan escribiendo y nunca hay doble reserva**

Versión corta, si el campo es limitado:
**Reservas por chat con IA, confirmadas por el cliente y sin dobles reservas**

## Descripción

**El problema.** Agendar citas por teléfono o WhatsApp le quita horas a cualquier clínica, salón o taller. Los
chatbots que reservan solos traen otros problemas: dos personas a la misma hora, citas que nadie pidió y
respuestas inventadas sobre horarios que no existen.

**La solución.** Tus clientes escriben como le hablarían a una recepcionista ("una limpieza el lunes en la
mañana") y un asistente con IA encuentra el servicio, el profesional y un horario libre. La diferencia está en que
**la IA propone y la persona decide**:

- **Entiende cómo habla la gente.** "Mañana", "el martes que viene", "a las 3 de la tarde": las fechas se
  calculan en el servidor, en la zona horaria de tu negocio, no las adivina la IA.
- **Solo ofrece horarios reales.** Cada hora que ofrece sale de tu agenda en ese momento. Si alguien acaba de
  tomarla, te ofrece las más cercanas.
- **Aparta, no confirma.** El asistente guarda el horario cinco minutos y le muestra al cliente una tarjeta con
  el botón Confirmar. Solo el cliente puede tocarlo: el asistente no tiene forma de confirmar ni de cancelar nada.
- **Nunca hay doble reserva.** Lo garantiza la base de datos, no una revisión en el código: aunque cincuenta
  personas pidan la misma hora a la vez, solo una la obtiene.
- **Recordatorios automáticos.** Confirmación inmediata y recordatorios un día y dos horas antes, por correo y en
  una bandeja dentro de la app. Si la cita se cancela, los recordatorios no salen.
- **El cliente gestiona sus citas.** Entra con un código que le llega al correo, sin contraseñas, y puede cambiar
  o cancelar sus citas desde la página o pidiéndoselo al asistente.
- **Tu agenda en vivo.** El panel de la clínica muestra la semana de cada profesional y se actualiza al instante.
  En cada reserva hecha por el asistente puedes ver la conversación completa y cuánto costó.
- **Costo visible y con tope.** Cada conversación cuesta una fracción de centavo de dólar, con un límite por
  conversación y otro diario.

**Qué incluye un proyecto así para tu negocio:**
- Tus servicios, profesionales, horarios, días libres y reglas (anticipación mínima, tiempo para cancelar).
- El asistente en tu sitio web, con el tono de tu negocio y lo que no debe responder (por ejemplo, consejos
  médicos).
- Los recordatorios por correo, y por WhatsApp si lo necesitas: está previsto como un canal más.
- Un panel para tu equipo, y pruebas con conversaciones reales de tu negocio antes de ponerlo en uso.

## Detalle técnico (para el cliente que lo pida)

- **Stack:** C# 14 sobre .NET 10, ASP.NET Core Minimal APIs, EF Core con PostgreSQL 18, NodaTime, SignalR, .NET
  Aspire, Claude Haiku 5.5 con Microsoft.Extensions.AI, MailKit, Next.js 16 y Playwright. Licencia MIT.
- **IA con permisos acotados:** ocho herramientas, cada una un adaptador sobre el mismo caso de uso que usa el
  formulario, con esquemas estrictos. Una prueba de arquitectura impide que alguna llegue a confirmar o a cancelar.
  El token que confirma va a la tarjeta del chat, nunca al modelo.
- **Cero dobles reservas:** restricción de exclusión de PostgreSQL sobre rangos de tiempo, con reservas que se
  apartan cinco minutos y vencen solas. Un test lanza 50 pedidos simultáneos al mismo horario: entra uno.
- **Notificaciones consistentes:** un outbox transaccional y un despachador con reintentos. Nunca hay una cita
  confirmada sin aviso ni un aviso de una cita que no se guardó.
- **Evaluado como software:** 28 conversaciones guionadas (reservas, conflictos, cambios, cancelaciones e intentos
  de manipulación), puntuadas con lo que queda en la base de datos. Los resultados están versionados en el repo,
  junto con las corridas que fallaron.
- **Calidad:** 133 tests (dominio, casos de uso, reglas de arquitectura e integración con PostgreSQL real) y un
  test de punta a punta con Playwright que recorre chat, panel en vivo, código por correo y cancelación en cada
  push, sin gastar en IA.
- **Seguridad:** sesiones en cookies HttpOnly, códigos de un solo uso con intentos limitados, límites por
  visitante en el chat y en la identificación, y el historial de la conversación guardado en el servidor.

## Habilidades sugeridas

C# · .NET · Inteligencia Artificial · Chatbots · PostgreSQL · Sistemas de reservas · Next.js · SignalR

(Elegir de la lista de Workana las que existan con ese nombre.)

## Archivos adjuntos

En `booking-agent/docs/demo/`, a 1920×2160 (capturas verticales de la app real en español, con las respuestas
que dio Claude Haiku 5.5):

| Orden | Archivo | Pie de foto sugerido |
|---|---|---|
| 1 | `02-tarjeta.png` | El asistente aparta el horario; solo el cliente lo confirma, con el botón de la tarjeta |
| 2 | `03-panel-apartada.png` | En el panel de la clínica la cita aparece al instante, todavía sin confirmar |
| 3 | `04-traza.png` | El porqué de cada reserva: la conversación y cada paso del asistente, con su costo |
| 4 | `05-mis-citas.png` | El cliente entra con un código por correo para cambiar o cancelar sus citas |
| 5 | `01-chat.png` | El cliente escribe como le habla a una recepcionista; el asistente ofrece horarios reales |
| Video | `demo.mp4` | 75 segundos: el cliente reserva en el chat y la cita aparece en vivo en el panel |

La primera imagen es la que más se ve en el listado: por eso va la tarjeta, que muestra a la vez la conversación,
la IA y a la persona que decide. Si el formulario pide imágenes horizontales, `poster.jpg` (1920×1080) junta el
chat y el panel en una sola imagen.

## Enlaces

- Caso de estudio: https://www.juangomezb.com/es/projects/booking-agent
- Código: https://github.com/Juxn89/booking-agent

## Texto base para propuestas

Para pegar y adaptar cuando un proyecto pida agendar citas, un chatbot de reservas o automatizar la atención por
WhatsApp o web:

> Hola, [nombre]. Construí un sistema de reservas por chat con IA: el cliente escribe como le hablaría a una
> recepcionista, el asistente busca un horario libre en la agenda real y se lo aparta, y el cliente lo confirma
> con un botón. El asistente no puede confirmar ni cancelar por su cuenta, y la base de datos impide que dos
> personas reserven la misma hora. Además envía recordatorios y la agenda de la clínica se actualiza en vivo.
> Puedes ver el video y el código aquí: https://www.juangomezb.com/es/projects/booking-agent
>
> Para tu caso, [lo que pide el proyecto], lo adaptaría a [tus servicios, horarios y reglas] y a [tu canal: tu
> sitio, WhatsApp]. Antes de ponerlo en uso lo probaríamos con conversaciones típicas de tus clientes, para que
> veas cómo responde con tu negocio.

**Cuándo no aplica:** si el negocio ya usa una agenda en la nube con reserva en línea (Calendly, Booksy, la de
su software de gestión), puede convenir más integrar el asistente con esa agenda que reemplazarla. Conviene
decírselo al cliente.

---

## Cifras y de dónde salen

| Cifra | Fuente |
|---|---|
| 28 de 28 conversaciones como se esperaba | `evals/results/claude-haiku-5-5.json`, campo `holdAccuracy` = 1.0 (corrida del 23 oct 2026) |
| 0 reservas confirmadas o canceladas por el asistente | El mismo archivo, `changedByAgent` |
| 0 horarios apartados sin haberlos ofrecido la agenda | El mismo archivo, `unverifiedHolds` |
| 5 de 5 conflictos resueltos | El mismo archivo, `conflictsHandled` |
| USD 0,0024 por conversación | El mismo archivo, `averageCostUsd` |
| 0,76 en la primera corrida, antes de corregir las fechas | `evals/README.md`, y el ledger de presupuesto |
| 1 de 50 pedidos simultáneos | Test de integración `Fifty_customers_asking_for_the_same_slot_at_once_get_exactly_one_booking` |
| 133 tests | `dotnet test` en el CI, 23 oct 2026 |
| USD 0,33 el proyecto entero en llamadas al modelo | Ledger de presupuesto, sesión `workana-booking-agent` |

Las conversaciones de evaluación son guionadas, sobre una clínica ficticia y una agenda fija, no sobre clientes
reales. Lo correcto es decirlo así en la propuesta y ofrecer probar con conversaciones del cliente.

## Lo que todavía no incluye

Respecto al [`plan.md`](plan.md), para no prometer de más:
- No hay demo pública desplegada: se muestra con el video y el código (decisión del 22 oct 2026).
- WhatsApp no está implementado: el canal de notificaciones está preparado para sumarlo, pero hoy son correo y
  bandeja en la app.
- El panel se abre con una clave compartida del negocio, no con cuentas por persona.
- Reprogramar a un horario que se solapa con la cita original requiere cancelar y reservar de nuevo.
- El asistente responde en español; las plantillas de los avisos también están solo en español.
