# Ficha Workana · `data-chat`

> Ficha para el portafolio de Workana, escrita el 26 oct 2026 a partir del README, los ADR y los resultados de
> evaluación del repo ([github.com/Juxn89/data-chat](https://github.com/Juxn89/data-chat)). El plan del proyecto
> está en [`plan.md`](plan.md), en esta misma carpeta.
>
> **Antes de publicar:** revisar en el formulario de Workana el límite de caracteres de cada campo y los nombres
> exactos de las habilidades. El video y las capturas salen de la app real, con Claude Haiku 5.5 respondiendo, el
> 26 oct 2026.

---

## Título

**Pregúntale a tu Excel de ventas: respuestas y gráficos con IA, sin cifras inventadas**

Versión corta, si el campo es limitado:
**Pregúntale a tus ventas en español: cifra, gráfico y cómo se calculó**

## Descripción

**El problema.** Los datos de ventas están en Excel, pero sacar una respuesta ("¿qué sucursal vendió más el último
trimestre?", "¿cómo vamos frente al año pasado?") exige tablas dinámicas o esperar a alguien que sepa. Los
chatbots que "conversan con tus datos" tienen otro problema: cuando se equivocan, dan un número falso con total
seguridad.

**La solución.** Subes tu archivo y preguntas como le preguntarías a un analista. Recibes la cifra, un gráfico,
un resumen de una línea y la consulta que se usó. La diferencia está en que **la IA no toca tus datos**:

- **Entiende cómo preguntas.** En español o en inglés, con "el último trimestre", "frente al año pasado" o "solo
  en Centro". Las fechas las calcula el servidor, no las adivina la IA.
- **La IA nunca escribe SQL.** Traduce tu pregunta a métricas y dimensiones con los nombres que tú confirmaste, y
  es el servidor quien arma la consulta, con permisos de solo lectura. No puede modificar ni borrar nada, ni leer
  otras tablas.
- **Pregunta antes de inventar.** Si la pregunta se puede entender de dos formas que dan cifras distintas, te
  pregunta qué quisiste decir.
- **El resumen no inventa cifras.** Cada número del resumen se compara con el resultado. Si cita uno que no está,
  no se muestra.
- **El gráfico correcto.** Una tendencia se dibuja como línea, un ranking como barras y una comparación con el
  periodo anterior lado a lado. La tabla y la descarga a Excel (CSV) están siempre.
- **Se puede seguir la conversación.** "¿Y el trimestre anterior?", "¿y solo Snacks?": mantiene el contexto.
- **Costo visible y con tope.** Cada pregunta cuesta una fracción de centavo de dólar, queda registrada con su
  costo y hay un tope diario.

**Qué incluye un proyecto así para tu negocio:**
- La carga de tus archivos de ventas, inventario o cobranza, con las métricas que tú usas (ventas, margen, ticket
  promedio, unidades) y los nombres con que las llamas.
- Las preguntas que más te hacen, probadas antes de ponerlo en uso, con las cifras verificadas contra tus propios
  reportes.
- Una pantalla para tu equipo, o la integración con tu sistema si los datos ya viven en una base de datos.

## Detalle técnico (para el cliente que lo pida)

- **Stack:** C# 14 sobre .NET 10, ASP.NET Core Minimal APIs, PostgreSQL 18 con EF Core y Npgsql, ClosedXML y
  CsvHelper, .NET Aspire, Claude Haiku 5.5 con salida estructurada, Next.js 16, Recharts y Playwright. Licencia MIT.
- **Capa semántica en lugar de text-to-SQL:** el modelo responde contra un JSON Schema generado para cada archivo,
  cuyas opciones son solo las métricas y dimensiones confirmadas. El servidor valida la consulta y la compila a SQL
  parametrizado con nombres de una lista permitida.
- **SQL acotado:** transacción de solo lectura, un rol que solo puede hacer `SELECT`, 3 segundos de límite y
  `LIMIT` forzado. Pruebas basadas en propiedades comprueban que ningún valor llega al SQL como texto.
- **Evaluado como software:** 75 preguntas con su SQL de referencia (60 en español y 15 en inglés), 8 ambiguas, 10
  de seguimiento y 20 intentos de manipulación, algunos escondidos en los encabezados y celdas del propio Excel. Los
  resultados están versionados en el repo, junto con las corridas que fallaron.
- **Calidad:** 206 tests (dominio, propiedades, reglas de arquitectura e integración con PostgreSQL real) y un test
  de punta a punta con Playwright que sube un archivo, pregunta, sigue la conversación, abre el SQL, descarga el
  CSV y revisa el historial en cada push, sin gastar en IA.

## Habilidades sugeridas

C# · .Net Core · Inteligencia Artificial · PostgreSQL · Análisis de datos · Business Intelligence · Excel · Next.js

(Elegir de la lista de Workana las que existan con ese nombre.)

## Archivos adjuntos

En `data-chat/docs/demo/`, a 1920×1080 (capturas de la app real en español, con las respuestas de Claude Haiku
5.5):

| Orden | Archivo | Pie de foto sugerido |
|---|---|---|
| 1 | `03-ranking.png` | Preguntas en español y recibes la cifra, el gráfico y un resumen verificado |
| 2 | `04-sql.png` | La consulta la escribe el servidor, no la IA: solo lectura y con parámetros |
| 3 | `06-comparacion.png` | Compara periodos: el último trimestre frente al mismo del año pasado |
| 4 | `05-tendencia.png` | Una tendencia por mes se dibuja como línea |
| 5 | `02-capa-semantica.png` | Al subir tu Excel confirmas qué se suma y por qué se agrupa, con tus nombres |
| 6 | `07-historial.png` | Cada pregunta queda registrada con su costo, bajo un tope diario |
| Video | `demo.mp4` | 85 segundos: subir el Excel, confirmar y preguntar, con gráfico y SQL |

La primera imagen es la que más se ve en el listado: por eso va el ranking, que muestra a la vez la pregunta, el
resumen y el gráfico. `poster.jpg` es ese mismo momento, tomado del video.

## Enlaces

- Caso de estudio: https://www.juangomezb.com/es/projects/data-chat
- Código: https://github.com/Juxn89/data-chat

## Texto base para propuestas

Para pegar y adaptar cuando un proyecto pida reportes, dashboards, "un chatbot para mis datos" o automatizar
consultas sobre Excel:

> Hola, [nombre]. Construí una aplicación donde subes tu Excel de ventas y le preguntas en español: "¿qué sucursal
> vendió más el último trimestre?", "¿cómo vamos frente al año pasado?". Responde con la cifra, un gráfico y la
> consulta que usó. La IA no escribe SQL ni puede modificar tus datos: traduce la pregunta y el sistema arma la
> consulta en modo lectura. Si la pregunta es ambigua, te pregunta antes de inventar. Puedes ver el video y el
> código aquí: https://www.juangomezb.com/es/projects/data-chat
>
> Para tu caso, [lo que pide el proyecto], lo adaptaría a [tus archivos o tu base de datos] y a las métricas que
> usas. Antes de entregarlo lo probaríamos con las preguntas que más te hacen, comparando las cifras con tus
> reportes actuales.

**Cuándo no aplica:** si el cliente ya usa una herramienta de BI (Power BI, Looker Studio) y solo necesita
tableros fijos, conviene más armarle esos tableros que un chat. El chat suma cuando las preguntas cambian todos
los días.

---

## Cifras y de dónde salen

| Cifra | Fuente |
|---|---|
| 75 de 75 preguntas con la cifra correcta (60 ES, 15 EN) | `evals/results/claude-haiku-5-5.json`, `questions.accuracy` = 1 (corrida final del 26 oct 2026) |
| 8 de 8 preguntas ambiguas con pregunta de vuelta | El mismo archivo, `askBack` |
| 9 de 10 seguimientos (falló f08, documentado) | El mismo archivo, `followUps.accuracy` = 0.9; `evals/README.md` |
| 20 de 20 intentos de manipulación sin efecto (18 rechazados) | El mismo archivo, `adversarial` |
| 0 cifras inventadas mostradas; 1 de 75 resúmenes descartado por el control | El mismo archivo, `summariesDiscarded` |
| USD 0,00058 por pregunta, resumen incluido | El mismo archivo, `averageCostUsd` = 0.00058 |
| 86,7 % en la primera corrida pagada (día 5) | `evals/results/claude-haiku-5-5.first-run.json` y `evals/README.md` |
| 5 de 15 preguntas en inglés con frases en español antes del arreglo | `evals/results/claude-haiku-5-5.day-10-first.json` y `evals/README.md` |
| 206 tests | `dotnet test` en el CI, 26 oct 2026 |
| USD 0,36 el proyecto entero en llamadas al modelo | Ledger de presupuesto, sesión `workana-data-chat` |

Las preguntas de evaluación son sobre un dataset sintético ("Distribuidora Demo", generado con semilla fija), no
sobre datos de clientes reales. Lo correcto es decirlo así en la propuesta y ofrecer probar con las preguntas y los
archivos del cliente.

## Lo que todavía no incluye

Respecto al [`plan.md`](plan.md), para no prometer de más:
- No hay demo pública desplegada: se muestra con el video y el código, por la superficie de ataque (decisión del
  plan, §9).
- No hay cuentas de usuario: es una app de un solo negocio.
- Un archivo por dataset: no cruza dos archivos (por ejemplo ventas con inventario) en una misma pregunta.
- Solo lo que la capa semántica expresa: sumas, promedios, conteos y cocientes por dimensiones y periodos; no
  fórmulas arbitrarias.
- La interfaz y las evaluaciones cubren español e inglés; otros idiomas no están probados.
