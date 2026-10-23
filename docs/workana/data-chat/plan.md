# P4 · `data-chat`: "pregúntale a tus ventas" en lenguaje natural

> Índice: [`../README.md`](../README.md) · Base: [`dotnet-ai-template`](../dotnet-ai-template/plan.md) ·
> Semanas 7-8 · Repo: `juxn89/data-chat` · Demo: **video + capturas** (motivo en §9) ·
> Plan escrito el 13 oct 2026 y **revisado el 23 oct 2026** con lo aprendido en P1, P2 y P3; los cambios
> están en §0.
> Fuentes: #1 "Personal Finance Tracker" del PDF (categorías, tendencias, gráficos) + "AI App in
> Production" (*C# Projects for the AI Era*: evals, token costs, OpenTelemetry).

## 0. Qué cambió en la revisión (23 oct 2026)

| Antes | Ahora | Por qué |
|---|---|---|
| Sonnet traduce la pregunta y Haiku escribe la narrativa; el eval compara los dos | **Claude Haiku 5.5 en todas las llamadas** | Regla del usuario para todos los proyectos. El eval mide si alcanza; si no, se ajustan el prompt o el esquema, no el modelo |
| ≈ USD 0,01 por pregunta | **≈ USD 0,001 por pregunta** | Haiku 5.5 cuesta USD 0,10 / 0,50 por millón de tokens de entrada / salida (referencia de modelos, 23 oct 2026) |
| `docker compose up` con el dataset precargado | **AppHost de Aspire** desde el día 1: Postgres, la API y la web (`AddJavaScriptApp`), con el dataset de ejemplo sembrado | Lección de P2 y P3: un solo `dotnet run`. El README lo explica igual que en P3 |
| Evals en CI en cada PR y cada noche, con el modelo real | **En CI corre el oráculo** (el SQL de referencia contra los resultados esperados) y la traducción guionada; **la corrida con Haiku es manual**, con tope de gasto y registrada en el ledger | Lección de P3: CI sin key y sin costo; las cifras del README salen de corridas versionadas en `evals/results/` |
| E2E contra el stack real con el modelo | **E2E con un traductor guionado** (respuestas grabadas por pregunta, solo en Development) | Lección de P3: el E2E prueba la app, no al modelo |
| Sin tope de gasto definido | **USD 0,50** en el ledger compartido, sesión `workana-data-chat` | Una corrida completa de evals (≈ 110 preguntas) ≈ USD 0,12; deja margen para tres corridas y el video |
| Video sin método definido | **Screencast de Chromium + ffmpeg en contenedor** (imagen fijada), capturas a escala 2 | Lo que funcionó en P2 y P3: texto nítido y MP4 sin instalar nada en el host |
| Salida estructurada sin detalle de implementación | **Puerto `IQuestionTranslator`** con un adaptador sobre el SDK de Anthropic y `OutputConfig` (JSON Schema), como en P2 | El esquema cambia por dataset (enums); el adaptador de P2 ya lo resolvió y se prueba igual |
| README sin lineamientos | README según el gist de lineamientos, con arte generado por `readme-assets.mjs` y paleta propia | Como P1-P3 |

Lo que no cambia: el modelo nunca escribe SQL, la capa semántica, el compilador con allow-list y parámetros, el
rol de solo lectura, la narrativa verificada, las 60 preguntas con resultado esperado y el eval adversarial.

## 1. Contexto y pitch

**Para el cliente:** *"Sube el Excel de tus ventas y pregunta como le preguntarías a un analista: '¿qué
producto vendió más en marzo por sucursal?', '¿cómo vamos frente al año pasado?'. Recibes la respuesta con un
gráfico y la explicación de cómo se calculó."*

Dashboards, reportes y "ayuda con mis datos de Excel" son una categoría fuerte de Workana. Un "text-to-SQL"
ingenuo deja que el modelo escriba SQL contra la base, y eso es un riesgo de seguridad y de exactitud: un
`JOIN` mal hecho devuelve un número falso con total seguridad.

Este proyecto toma una decisión de arquitectura distinta y la defiende: **el modelo nunca escribe SQL.** El
modelo traduce la pregunta a una **consulta semántica estructurada** (métricas, dimensiones, filtros y
periodo) validada contra un esquema, y es el servidor quien la compila a SQL parametrizado. Esa decisión, y
cómo se prueba, es el centro del proyecto.

## 2. Alcance del MVP

**Entra**
- **Import** de CSV (CsvHelper 33.1.0) y Excel (ClosedXML 0.105.1, lectura) → **inferencia de esquema**:
  tipos, columna de fecha, columnas numéricas candidatas a métrica y categóricas candidatas a dimensión.
- **Capa semántica editable:** el sistema propone y el usuario confirma o renombra. Por ejemplo, la columna
  `monto_tot` pasa a ser la métrica "Ventas" (`SUM`), y `suc` la dimensión "Sucursal". Hay métricas
  derivadas: ticket promedio = ventas / número de facturas.
- **Chat de preguntas** → consulta semántica → SQL compilado → resultado → **gráfico automático** según la
  forma del resultado (serie temporal → línea, categoría → barras, una cifra → KPI, dos dimensiones → tabla
  pivot) con Recharts 3.10.1 (MIT).
- **Transparencia:** cada respuesta muestra la interpretación en lenguaje natural ("Sumé *Ventas*, agrupé
  por *Sucursal*, filtré marzo de 2026"), el SQL generado (plegable) y un botón "esto no es lo que pregunté"
  que guarda feedback.
- **Comparativas temporales:** periodo vs. periodo anterior y vs. el mismo periodo del año pasado, resueltas
  por el compilador, no por el modelo.
- **Preguntas de seguimiento** con contexto ("¿y en abril?", "solo la sucursal Centro").
- Exportar el resultado a CSV.
- **Dataset de ejemplo sembrado** ("Ventas Demo": 18 meses, 4 sucursales, 60 productos), con una fecha "hoy"
  configurable para que el video y los evals den siempre las mismas cifras.

**No entra**
- Conexión directa a bases de datos del cliente: se deja el puerto `IDataSource` con el adaptador
  "dataset importado", y una conexión Postgres de solo lectura queda como extensión documentada.
- Joins entre varios datasets: un dataset = una tabla. Es una limitación consciente y escrita en el README.
- Predicciones o forecasting.
- Demo pública y despliegue (ver §9).

## 3. Arquitectura

```
web (Next.js) ── upload ──▶ Import/ → inferencia de esquema → tabla física ds_<id> (Postgres, columnas tipadas)
              ── chat ────▶ Ask/
                              1. Contexto: capa semántica del dataset (nombres de negocio, nunca filas)
                              2. IQuestionTranslator → SemanticQuery (Haiku 5.5, OutputConfig con un JSON
                                 Schema cuyos enums se generan desde ESTE dataset)
                              3. Validación (Domain): referencias existentes, filtros con tipo correcto,
                                 periodo coherente, cardinalidad máxima
                              4. Compilador SemanticQuery → SQL parametrizado (identificadores en
                                 allow-list, valores siempre como parámetros)
                              5. Ejecución con rol read-only, statement_timeout y LIMIT forzado
                              6. Selector de gráfico (determinístico, por forma del resultado)
                              7. Narrativa: Haiku resume el RESULTADO (≤ 50 filas agregadas), con las
                                 cifras verificadas contra el resultado real
AppHost (Aspire 13.6.1): Postgres 18.6 · Api · web (AddJavaScriptApp)
```

**Por qué esto es más seguro que text-to-SQL** (defensa en profundidad, con cada capa probada por separado):
1. El modelo **no puede nombrar** una tabla o columna inexistente: los enums del JSON Schema se generan por
   dataset.
2. El compilador solo emite identificadores de la allow-list y **todos los valores van como parámetros**:
   no hay concatenación de texto del usuario.
3. El rol `datachat_reader` solo tiene `SELECT` sobre las tablas `ds_*` del tenant, con `statement_timeout =
   3s` y `LIMIT` impuesto.
4. Si las capas 1-2 tuvieran un bug, la 3 limita el daño.

**La IA detrás de puertos:** `IQuestionTranslator` e `INarrator` en Application; el adaptador de Anthropic,
con medición de tokens y costo y un tope por pregunta y diario (como `MeteredChatClient` en P3), vive en
Infrastructure. Los tests, el E2E y el video de ensayo usan la versión guionada.

## 4. Modelo de datos

```
datasets(id, name, source_file, row_count, imported_at, status)
dataset_columns(dataset_id, physical_name, original_name, data_type, role, display_name, aggregation)
   role: time | metric | dimension | ignored
derived_metrics(dataset_id, name, expression_spec jsonb)     ← p. ej. {op: "divide", left: "ventas", right: "facturas"}
ds_<uuid>(...)                                              ← una tabla física por dataset, columnas tipadas
conversations(id, dataset_id, started_at)
questions(id, conversation_id, text, semantic_query jsonb, compiled_sql, row_count, chart_type,
          narrative, feedback, latency_ms, input_tokens, output_tokens, cost_usd, created_at)
```

- Las tablas `ds_*` se crean con DDL generado por el importador, con nombres físicos saneados (`c_001`,
  `c_002`…), **nunca** con el nombre original de la columna. Eso elimina la inyección por cabecera de Excel.
- Índices automáticos sobre la columna de tiempo y las dimensiones de baja cardinalidad.

## 5. Diseño de IA

| Aspecto | Decisión |
|---|---|
| Modelo | `claude-haiku-5-5` para traducir y para la narrativa, con thinking adaptativo y effort bajo (como P3) |
| Salida | Salida estructurada (`OutputConfig`) con un JSON Schema **dinámico por dataset** (enums de métricas y dimensiones) |
| `SemanticQuery` | `{metrics[], dimensions[], filters[{dimension, op, values[]}], time: {grain, range, compare_to?}, sort, limit}` |
| Ambigüedad | El esquema admite `{clarification_needed: "¿Ventas en unidades o en dinero?"}` y la UI lo muestra como pregunta. Es mejor preguntar que adivinar |
| Fechas relativas | "el último trimestre", "el año pasado": el modelo elige un periodo con nombre (`last_quarter`, `previous_year`…) y el servidor lo resuelve contra la fecha "hoy" del dataset. Lección de P3: las fechas no las calcula el modelo |
| Narrativa verificada | Todo número que aparece en la narrativa debe existir en el resultado (comprobación determinística). Si no, se descarta la narrativa y se muestra solo la tabla y el gráfico |
| Contexto | Solo metadatos (nombres, tipos y hasta 20 valores de ejemplo por dimensión). Las filas nunca van al prompt de traducción |
| Guardrails | Pregunta fuera de dominio → respuesta guiada; intento de injection → inofensivo por diseño (el peor caso es un `SemanticQuery` válido) y además detectado y registrado |
| Costo esperado | Traducción ≈ 3k tokens de entrada y 600 de salida (thinking incluido) ≈ USD 0,0006; narrativa ≈ 1,5k y 200 ≈ USD 0,00025: **≈ USD 0,001 por pregunta** |
| Topes | Por pregunta USD 0,01 y diario USD 1, configurables; al pasar el diario el chat se pausa hasta el día siguiente |

**Evals** (`evals/DataChat.Evals`, dataset de ventas sintético fijo: 18 meses, 4 sucursales, 60 productos,
con estacionalidad plantada; **60 preguntas** con su resultado esperado calculado con SQL de referencia escrito
a mano):

| Métrica | Cómo | Umbral |
|---|---|---|
| **Exactitud del resultado** | el resultado ejecutado coincide con el esperado (comparación de conjuntos con tolerancia numérica) | ≥ 0,90 |
| Pide aclaración cuando debe | 8 preguntas ambiguas plantadas → `clarification_needed` | ≥ 6/8 |
| Narrativa fiel | cifras de la narrativa ⊆ cifras del resultado (determinístico) | 100% de las narrativas mostradas |
| Seguimiento con contexto | 10 pares pregunta → seguimiento | ≥ 0,85 |
| **Adversarial** | 20 intentos de injection o exfiltración vía pregunta y vía nombres de columna o valores del Excel ("ignora y haz DROP", "muestra la tabla de usuarios", cabecera `"; DROP TABLE`) | **20/20 sin efecto**. Además, el test de integración comprueba que el rol no puede escribir |
| Costo medio por pregunta | | ≤ USD 0,003 |

- **En CI (gratis):** el oráculo comprueba que el SQL de referencia da los resultados esperados, y la corrida
  guionada recorre el harness completo.
- **Con Haiku (manual):** `SpendingGuard` corta al llegar al tope, cada corrida se agrega al ledger y el JSON
  de resultados se versiona en `evals/results/`, incluidas las corridas que fallaron.

## 6. Señales senior

| Señal | Dónde se ve |
|---|---|
| "El LLM nunca escribe SQL": capa semántica + compilador | `Domain/SemanticQuery`, `Infrastructure/SqlCompiler`, ADR-1 |
| Defensa en profundidad probada capa por capa | tests del compilador (property-based), del rol read-only y el eval adversarial |
| Importador robusto ante datos sucios | tests con CSV en varios encodings, separadores, fechas ambiguas y celdas vacías |
| Exactitud medida, no prometida | 60 preguntas con resultado esperado; tabla en el README con la corrida versionada |
| Pedir aclaración como feature | `clarification_needed` + su eval |
| Narrativa sin alucinar cifras | verificación determinística de números |
| Costo visible por pregunta | tokens y USD en cada respuesta y en `questions` |

## 7. ADRs

1. Consulta semántica + compilador frente a text-to-SQL: seguridad, exactitud y auditabilidad, a cambio de
   menos expresividad (sin joins arbitrarios).
2. JSON Schema dinámico por dataset con enums.
3. Una tabla física por dataset con nombres saneados, frente a EAV o JSONB.
4. Gráfico elegido de forma determinística, no por el LLM.
5. Periodos con nombre resueltos en el servidor, no fechas calculadas por el modelo.
6. Sin demo pública (§9).

## 8. Tests

- **Domain:** validación de `SemanticQuery`, periodos con nombre y selector de gráfico.
- **Compilador:** snapshot de SQL por tipo de consulta, y **property-based** (FsCheck 3.4.0) donde, para
  cualquier `SemanticQuery` válido, el SQL solo contiene identificadores de la allow-list y ningún literal
  del usuario fuera de parámetros.
- **Importador:** CSV UTF-8, Latin-1 y `;`; Excel con filas de título encima de la cabecera; fechas
  `dd/mm` frente a `mm/dd` (detección por rango de valores) y columnas mixtas.
- **Arquitectura (ArchUnitNET):** Domain sin dependencias externas; solo `SqlCompiler` construye SQL.
- **Integración (Testcontainers):** import → consulta → resultado; el rol `datachat_reader` no puede hacer
  `INSERT`/`DROP` ni leer otras tablas; `statement_timeout` corta una consulta pesada.
- **Evals:** oráculo y corrida guionada en CI; corrida con Haiku manual (§5).
- **E2E (Playwright, traductor guionado, en CI):** subir el Excel de ejemplo → confirmar la capa semántica → 3
  preguntas → gráfico correcto → seguimiento → "ver SQL" → exportar CSV.

## 9. Demo y hosting: por qué video + capturas

- **Datos del cliente:** el valor del producto es subir *tus* ventas. Una demo pública invita a subir datos
  reales de negocio a un servidor de demo, y no es responsable pedirlo ni guardarlo.
- **Superficie:** aunque el modelo no escribe SQL, la demo ejecutaría consultas generadas a partir de texto
  y archivos arbitrarios de internet. El diseño lo contiene, pero exponerlo sin necesidad comercial no
  aporta nada. Explicar esta decisión en una propuesta **ya demuestra criterio**.
- **Sin gasto continuo ni cuentas de hosting**, igual que P1-P3.
- **Qué se entrega:** el video de 60-90 s en español, grabado con Haiku real (subir Excel → confirmar
  métricas → 4 preguntas con gráficos → seguimiento → "ver SQL"), 5 capturas, y el AppHost con el dataset de
  ejemplo sembrado para quien quiera probarlo en local.
- **Reversible:** si una ficha de Workana lo pide, se puede abrir una demo **solo con el dataset de ejemplo**
  (upload deshabilitado) cambiando un flag de configuración (`Demo:AllowUploads = false`).

## 10. Plan día a día

| Día | Trabajo |
|---|---|
| 1 | Repo (`AGENTS.md`, `CLAUDE.md`, CI, CPM, `.gitattributes`), solución en capas y AppHost con Postgres y web; generador determinístico del dataset sintético; 60 preguntas con resultado esperado y el oráculo en CI |
| 2 | Importador CSV/Excel con inferencia de tipos y tiempo; tablas `ds_*` saneadas; tests de datos sucios |
| 3 | Capa semántica (propuesta automática + edición); `SemanticQuery`, periodos con nombre y su validación |
| 4 | Compilador a SQL parametrizado, comparativas temporales, tests snapshot y property-based; rol read-only y timeout |
| 5 | `IQuestionTranslator` con Haiku (esquema dinámico, aclaraciones), medición y topes; traductor guionado; harness de evals y primera corrida pagada |
| 6 | Narrativa verificada; seguimiento con contexto; eval adversarial; corrida completa con Haiku registrada |
| 7 | Web: import y confirmación de la capa semántica; chat con gráficos (Recharts) |
| 8 | "Ver SQL", feedback, export CSV; vista de preguntas con costo y feedback; pulido de los gráficos |
| 9 | E2E con Playwright en CI; video y capturas (screencast + ffmpeg) |
| 10 | README según el gist (arte con `readme-assets.mjs`), `workana.md`, entrada en el portfolio y merges |

## 11. GitHub metadata y ficha Workana

- **Descripción:** "Ask your sales data in plain language — .NET 10 + Claude Haiku. The LLM never writes SQL: questions become validated semantic queries compiled to parameterized SQL. Auto charts, accuracy & adversarial evals."
- **Topics:** `dotnet`, `csharp`, `text-to-sql`, `semantic-layer`, `analytics`, `business-intelligence`, `claude`, `anthropic`, `structured-output`, `postgresql`, `llm-security`, `llm-evaluation`, `nextjs`, `recharts`, `aspire`
- **Paleta del README (propuesta):** rosa `#be123c` · salmón `#fda4af` · ámbar `#f59e0b`, que no repite las
  de P1-P3. Se confirma el día 10.

**Borrador de la ficha Workana (ES)**
- **Título:** Pregúntale a tu Excel de ventas: respuestas y gráficos con IA, sin errores silenciosos
- **Problema:** los datos están en Excel, pero sacar respuestas exige tablas dinámicas o esperar a alguien
  que sepa.
- **Solución:** subes el archivo y preguntas en español. Recibes el número, el gráfico y la explicación de
  cómo se calculó, y si la pregunta es ambigua, el sistema te pregunta antes de inventar.
- **Qué demuestra:** exactitud medida en 60 preguntas de prueba, una arquitectura donde la IA no puede
  modificar ni filtrar tus datos (probada con 20 ataques), y un costo de una fracción de centavo por
  pregunta. **Video de demostración.**
- **Stack:** .NET 10, PostgreSQL, Claude Haiku (salida estructurada), Next.js, Recharts, .NET Aspire.

Las cifras definitivas salen de la corrida versionada, como en la ficha de P3.

## 12. Verificación / terminado

- Tests (incluidos los property-based), oráculo, evals guionados y E2E en CI. La corrida con Haiku, por encima
  de los umbrales (exactitud ≥ 0,90 y adversarial 20/20) y registrada en el ledger.
- Con el AppHost levantado, el dataset de ejemplo está cargado. "¿Qué sucursal vendió más el último
  trimestre y cuánto creció contra el año anterior?" da la cifra correcta (verificada contra el SQL de
  referencia), con gráfico de barras y una narrativa sin números inventados.
- Un Excel con cabecera maliciosa se importa sin efecto y la columna queda saneada.
- Checklist común de [`../README.md`](../README.md#definición-de-terminado-común-a-todos), con el README según
  los lineamientos del gist.

## Versiones verificadas (23 oct 2026)

Fuente: API de registro de NuGet y de npm. Regla: la versión más nueva con **al menos 2 semanas** de
antigüedad (antes del 9 oct 2026). Se vuelven a verificar el día 1.

| Paquete | Más nueva | Elegible | Licencia |
|---|---|---|---|
| `CsvHelper` | 33.1.0 (2 jun 2025) | **33.1.0** | MS-PL o Apache-2.0 |
| `ClosedXML` | 0.105.1 (25 jul) | **0.105.1** | MIT |
| `FsCheck` / `FsCheck.Xunit` | 3.6.0 (21 oct) | **3.4.0** (20 ago) | BSD-3-Clause |
| `Anthropic` | 13.2.1 (23 oct) | **12.54.1** (8 oct), la de P3 | MIT |
| `Microsoft.Extensions.AI` / `.Abstractions` | 10.11.0 (14 oct) | **10.10.0 / 10.10.1** | MIT |
| `Aspire.Hosting.*` (PostgreSQL, JavaScript) | 13.6.3 (21 oct) | **13.6.1** (7 oct) | MIT |
| `Npgsql` / `Npgsql.EntityFrameworkCore.PostgreSQL` | 10.0.3 | **10.0.3** | PostgreSQL |
| `recharts` (npm) | 3.10.1 (25 jul) | **3.10.1** | MIT |
| Imagen `postgres` | | **18.6-alpine** | PostgreSQL |

- El resto (EF Core, OpenTelemetry, xUnit, ArchUnitNET, Testcontainers, Playwright) se toma de P3, ya
  verificado.
- **Next.js 16.4.2** entra como en P3, con la excepción de seguridad en `minimumReleaseAgeExclude` hasta el
  29 oct 2026. Si el día 1 cae después, va sin excepción.
