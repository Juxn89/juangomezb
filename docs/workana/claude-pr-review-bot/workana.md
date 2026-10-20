# Ficha Workana · `claude-pr-review-bot`

> Ficha para el portafolio de Workana. Escrita el 20 oct 2026 a partir del README y el código del repo
> ([github.com/Juxn89/claude-pr-review-bot](https://github.com/Juxn89/claude-pr-review-bot), release `v1.0.0`
> del 7 sep 2026). Es un proyecto ya terminado: no tiene `plan.md` en esta carpeta.
>
> **Antes de publicar:** revisar en el formulario de Workana el límite de caracteres de cada campo y los
> nombres exactos de las habilidades. Las capturas salen de una revisión real del bot el 20 oct 2026, en
> [Juxn89/pr-review-bot-demo#1](https://github.com/Juxn89/pr-review-bot-demo/pull/1).

---

## Título

**Revisión de código con IA en cada pull request de GitHub, sin ruido y sin bloquear a tu equipo**

Versión corta, si el campo es limitado:
**Revisor de código con IA para GitHub que comenta cada pull request y nunca bloquea**

## Descripción

**El problema.** Revisar código consume horas de los desarrolladores con más experiencia. En equipos chicos
los pull requests esperan días, o se aprueban sin que nadie los mire. Y los bots de revisión genéricos
llenan el PR de comentarios inútiles: una versión temprana de este mismo bot dejó 47 comentarios en un
solo pull request, 41 de ellos sobre un archivo generado automáticamente. Un bot así el equipo lo termina
apagando.

**La solución.** Un revisor con IA (Claude, de Anthropic) que se instala en tu repositorio de GitHub en dos
pasos y comenta cada pull request como lo haría un compañero:

- **Comentarios en la línea exacta del cambio**, clasificados por gravedad: bloqueante, a considerar o
  detalle, más un resumen de la revisión.
- **Sin ruido.** Ignora archivos que nadie revisa a mano (lockfiles, código generado, migraciones),
  descarta comentarios repetidos o fuera del cambio, y tiene un tope de comentarios configurable.
- **Nunca bloquea.** Solo comenta: no aprueba, no pide cambios ni hace merge. La decisión sigue siendo de tu
  equipo, y por eso nadie tiene motivos para desactivarlo.
- **Seguro con contribuciones externas.** Nunca ejecuta el código del pull request: lo lee por la API de
  GitHub. Si alguien esconde instrucciones en el código para manipularlo, lo peor que logra es que el bot
  no comente.
- **Costo predecible.** En la demo, revisar un pull request con Claude Haiku 5.5 costó **menos de una
  décima de centavo de dólar** (USD 0,0009) y encontró los 3 problemas graves que tenía. Para pull requests
  grandes, de unas 400 líneas, el costo estimado es de **USD 0,12** con Claude Opus 5 o **USD 0,05** con
  Sonnet 5. Cada corrida registra lo que consumió.
- **Lo pruebas sin gastar.** Tiene un modo de prueba sin clave de IA que recorre todo el proceso con un
  ejemplo y muestra lo que publicaría.

**Qué incluye un proyecto así:**
- Instalación en tus repositorios y en tu flujo de GitHub Actions.
- Las convenciones de tu equipo cargadas en el revisor, para que comente sobre lo que a ustedes les importa.
- La lista de archivos que no se revisan, ajustada a tu proyecto.
- La elección del modelo según tu presupuesto, con el costo estimado por mes.
- Una ronda de prueba en modo sin publicar antes de activarlo en el equipo.

## Detalle técnico (para el cliente que lo pida)

- **Stack:** C# 14 sobre .NET 10, publicado como GitHub Action compuesta. Licencia MIT.
- **IA:** salida estructurada contra un JSON Schema. Claude devuelve todos los hallazgos en un solo
  documento, así el código puede filtrarlos antes de publicar nada, y si algo falla no queda media revisión
  publicada. Tiene una sola herramienta, `read_file`, que lee archivos por SHA desde la API cuando el diff
  no alcanza para entender el cambio.
- **Robustez:**
  - Reintentos que respetan `Retry-After` y los límites de la API de GitHub.
  - Una marca oculta que evita publicar dos veces la misma revisión.
  - El prompt de sistema va en caché, y la lista de exclusión redujo a menos de la mitad el diff promedio que
    llega al modelo.
- **Seguridad:**
  - Corre con `pull_request_target` sin hacer checkout del código del contribuidor, y valida las rutas que
    lee.
  - El cliente de GitHub solo tiene cinco métodos, y ninguno puede aprobar, pedir cambios ni hacer merge.
- **Calidad:** 91 tests que corren sin red y sin clave de IA. El modo de prueba se ejecuta en CI en cada push.
- **Documentación:** el diseño está explicado en un artículo de DEV.to, en inglés y en español.

## Habilidades sugeridas

C# · .NET · Inteligencia Artificial · GitHub · CI/CD · DevOps · Integración de APIs · Revisión de código

(Elegir de la lista de Workana las que existan con ese nombre.)

## Archivos adjuntos

Todos en `claude-pr-review-bot/docs/demo/`, en 2560×1600 (el doble de 1280×800, para que se vean nítidos).
Salen de la revisión real del bot en
[pr-review-bot-demo#1](https://github.com/Juxn89/pr-review-bot-demo/pull/1), hecha con Claude Haiku 5.5.

| Orden | Archivo | Pie de foto sugerido |
|---|---|---|
| 1 | `01-cache-no-thread-safe.png` | Comenta la línea exacta: una caché que se corrompe con varios usuarios a la vez |
| 2 | `02-timeout-no-es-rechazo.png` | Entiende las reglas de tu negocio: un error de red no es un pago rechazado |
| 3 | `03-api-key-en-consola.png` | Detecta secretos expuestos antes de que lleguen a producción |
| 4 | `04-resumen-de-la-revision.png` | Un resumen claro de la revisión, y nunca bloquea el merge |

La primera imagen es la que más se ve en el listado: por eso va un hallazgo concreto sobre el código y no
el resumen. Los comentarios del bot están en inglés, el idioma del código y de la mayoría de los equipos.
Hoy las etiquetas de gravedad y el resumen están fijos en inglés: si un cliente los quiere en español, es
una adaptación a cotizar dentro del proyecto, no una opción de configuración.

## Enlaces

- Caso de estudio: https://www.juangomezb.com/es/projects/claude-pr-review-bot
- Código: https://github.com/Juxn89/claude-pr-review-bot
- Revisión real del bot: https://github.com/Juxn89/pr-review-bot-demo/pull/1
- Artículo (ES): https://dev.to/jgomezdev/un-bot-de-revision-de-pr-con-claude-en-c-el-tool-use-que-no-necesitas-clb

## Texto base para propuestas

Para pegar y adaptar cuando un proyecto pida revisión de código, automatización en GitHub o integrar IA en
el flujo de desarrollo:

> Hola, [nombre]. Construí un revisor de código con IA para GitHub: comenta cada pull request en la línea
> exacta, clasifica lo que encuentra por gravedad, ignora archivos generados y nunca bloquea el merge, así
> que el equipo lo mantiene activo. Cuesta alrededor de USD 0,05 a 0,12 por pull request y el código es
> público: [link al caso de estudio].
>
> Para tu caso, [lo que pide el proyecto], lo adaptaría así: [2 o 3 líneas]. Antes de activarlo lo
> correríamos en modo de prueba sobre tus pull requests reales, para ajustar qué revisa y qué ignora.

---

## Cifras y de dónde salen

| Cifra | Fuente |
|---|---|
| USD 0,0009 por la revisión de la demo, 3 problemas graves encontrados | Corrida `39481860252` en pr-review-bot-demo (1.314 tokens de entrada, 1.201 de escritura en caché, 1.225 de salida, Haiku 5.5), registrada en el ledger |
| 47 comentarios, 41 sobre un archivo generado | `src/ClaudeReviewBot.Core/Diff/GeneratedFileFilter.cs` y la sección *Cost* del README |
| USD 0,12 (Opus 5) y 0,05 (Sonnet 5) por PR de 400 líneas | README, sección *Cost*: es una **estimación** de ~20.000 tokens de entrada y 900 de salida, no una medición |
| USD 10–24 al mes para 200 PR | Misma sección |
| La lista de exclusión reduce el diff promedio a menos de la mitad | Misma sección |
| 91 tests sin red ni clave | README, sección *Development* |
