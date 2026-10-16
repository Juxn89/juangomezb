# P4 · `data-chat`: "pregúntale a tus ventas" en lenguaje natural

> Índice: [`../README.md`](../README.md) · Base: [`dotnet-ai-template`](../dotnet-ai-template/plan.md) ·
> Semanas 7-8 · Repo: `juxn89/data-chat` · Demo: **video + capturas** (motivo en §9) ·
> Versiones verificadas el 13 oct 2026.
> Fuentes: #1 "Personal Finance Tracker" del PDF (categorías, tendencias, gráficos) + "AI App in
> Production" (*C# Projects for the AI Era*: evals, token costs, OpenTelemetry).

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

**No entra**
- Conexión directa a bases de datos del cliente: se deja el puerto `IDataSource` con el adaptador
  "dataset importado", y una conexión Postgres de solo lectura queda como extensión documentada.
- Joins entre varios datasets: un dataset = una tabla. Es una limitación consciente y escrita en el README.
- Predicciones o forecasting.

## 3. Arquitectura

```
web (Next.js) ── upload ──▶ Import/ → inferencia de esquema → tabla física ds_<id> (Postgres, columnas tipadas)
              ── chat ────▶ Ask/
                              1. Contexto: capa semántica del dataset (nombres de negocio, nunca datos)
                              2. LLM → SemanticQuery (structured output, JSON Schema con enums
                                 generados desde ESTE dataset: solo métricas y dimensiones existentes)
                              3. Validación (Domain): referencias existentes, filtros con tipo correcto,
                                 periodo coherente, cardinalidad máxima
                              4. Compilador SemanticQuery → SQL parametrizado (identificadores en
                                 allow-list, valores siempre como parámetros)
                              5. Ejecución con rol read-only, statement_timeout y LIMIT forzado
                              6. Selector de gráfico (determinístico, por forma del resultado)
                              7. Narrativa: LLM resume el RESULTADO (≤ 50 filas agregadas), con
                                 las cifras verificadas contra el resultado real
```

**Por qué esto es más seguro que text-to-SQL** (defensa en profundidad, con cada capa probada por separado):
1. El modelo **no puede nombrar** una tabla o columna inexistente: los enums del JSON Schema se generan por
   dataset.
2. El compilador solo emite identificadores de la allow-list y **todos los valores van como parámetros**:
   no hay concatenación de texto del usuario.
3. El rol `datachat_reader` solo tiene `SELECT` sobre las tablas `ds_*` del tenant, con `statement_timeout =
   3s` y `LIMIT` impuesto.
4. Si las capas 1-2 tuvieran un bug, la 3 limita el daño.

## 4. Modelo de datos

```
datasets(id, name, source_file, row_count, imported_at, status)
dataset_columns(dataset_id, physical_name, original_name, data_type, role, display_name, aggregation)
   role: time | metric | dimension | ignored
derived_metrics(dataset_id, name, expression_spec jsonb)     ← p. ej. {op: "divide", left: "ventas", right: "facturas"}
ds_<uuid>(...)                                              ← una tabla física por dataset, columnas tipadas
conversations(id, dataset_id, started_at)
questions(id, conversation_id, text, semantic_query jsonb, compiled_sql, row_count, chart_type,
          narrative, feedback, latency_ms, created_at)
ai_usage(...)                                               ← del template
```

- Las tablas `ds_*` se crean con DDL generado por el importador, con nombres físicos saneados (`c_001`,
  `c_002`…), **nunca** con el nombre original de la columna. Eso elimina la inyección por cabecera de Excel.
- Índices automáticos sobre la columna de tiempo y las dimensiones de baja cardinalidad.

## 5. Diseño de IA

| Aspecto | Decisión |
|---|---|
| Modelo de traducción | `claude-sonnet-5-5`: la interpretación de la pregunta es donde se gana o se pierde la exactitud. El eval compara con Haiku |
| Modelo de narrativa | `claude-haiku-5-5`: solo resume un resultado ya calculado |
| Salida | Structured outputs con un JSON Schema **dinámico por dataset** (enums de métricas y dimensiones) |
| `SemanticQuery` | `{metrics[], dimensions[], filters[{dimension, op, values[]}], time: {grain, range, compare_to?}, sort, limit}` |
| Ambigüedad | El esquema admite `{clarification_needed: "¿Ventas en unidades o en dinero?"}` y la UI lo muestra como pregunta. Es mejor preguntar que adivinar |
| Narrativa verificada | Todo número que aparece en la narrativa debe existir en el resultado (comprobación determinística). Si no, se descarta la narrativa y se muestra solo la tabla y el gráfico |
| Contexto | Solo metadatos (nombres, tipos y hasta 20 valores de ejemplo por dimensión). Las filas nunca van al prompt de traducción |
| Guardrails | Pregunta fuera de dominio → respuesta guiada; intento de injection → inofensivo por diseño (el peor caso es un `SemanticQuery` válido) y además detectado y registrado |
| Costo esperado | Traducción ≈ 3k tokens de input y 300 de output con Sonnet ≈ $0,009; narrativa con Haiku ≈ $0,0003: **≈ $0,01 por pregunta** |

**Evals** (`tests/Evals`, dataset de ventas sintético fijo: 18 meses, 4 sucursales, 60 productos, con
estacionalidad plantada; **60 preguntas** con su resultado esperado calculado a mano con SQL de referencia):

| Métrica | Cómo | Umbral |
|---|---|---|
| **Exactitud del resultado** | el resultado ejecutado coincide con el esperado (comparación de conjuntos con tolerancia numérica) | ≥ 0,90 |
| Pide aclaración cuando debe | 8 preguntas ambiguas plantadas → `clarification_needed` | ≥ 6/8 |
| Narrativa fiel | cifras de la narrativa ⊆ cifras del resultado (determinístico) | 100% de las narrativas mostradas |
| Seguimiento con contexto | 10 pares pregunta → seguimiento | ≥ 0,85 |
| **Adversarial** | 20 intentos de injection o exfiltración vía pregunta y vía nombres de columna o valores del Excel ("ignora y haz DROP", "muestra la tabla de usuarios", cabecera `"; DROP TABLE`) | **20/20 sin efecto**. Además, el test de integración comprueba que el rol no puede escribir |
| Costo medio por pregunta | | ≤ $0,015 |

## 6. Señales senior

| Señal | Dónde se ve |
|---|---|
| "El LLM nunca escribe SQL": capa semántica + compilador | `Domain/SemanticQuery`, `Infrastructure/SqlCompiler`, ADR-1 |
| Defensa en profundidad probada capa por capa | tests del compilador (property-based), del rol read-only y el eval adversarial |
| Importador robusto ante datos sucios | tests con CSV en varios encodings, separadores, fechas ambiguas y celdas vacías |
| Exactitud medida, no prometida | 60 preguntas con resultado esperado; tabla en el README |
| Pedir aclaración como feature | `clarification_needed` + su eval |
| Narrativa sin alucinar cifras | verificación determinística de números |

## 7. ADRs

1. Consulta semántica + compilador frente a text-to-SQL: seguridad, exactitud y auditabilidad, a cambio de
   menos expresividad (sin joins arbitrarios).
2. JSON Schema dinámico por dataset con enums.
3. Una tabla física por dataset con nombres saneados, frente a EAV o JSONB.
4. Gráfico elegido de forma determinística, no por el LLM.
5. Sin demo pública (§9).

## 8. Tests

- **Domain:** validación de `SemanticQuery` y selector de gráfico.
- **Compilador:** snapshot de SQL por tipo de consulta, y **property-based** (FsCheck 3.4.0) donde, para
  cualquier `SemanticQuery` válido, el SQL solo contiene identificadores de la allow-list y ningún literal
  del usuario fuera de parámetros.
- **Importador:** CSV UTF-8, Latin-1 y `;`; Excel con filas de título encima de la cabecera; fechas
  `dd/mm` frente a `mm/dd` (detección por rango de valores) y columnas mixtas.
- **Integración (Testcontainers):** import → consulta → resultado; el rol `datachat_reader` no puede hacer
  `INSERT`/`DROP` ni leer otras tablas; `statement_timeout` corta una consulta pesada.
- **Evals:** la tabla de §5 en CI (PRs que tocan `Ask/`, `Prompts/` o `SqlCompiler/`, y cada noche).
- **E2E:** subir el Excel de ejemplo → confirmar la capa semántica → 3 preguntas → gráfico correcto →
  seguimiento → exportar CSV.

## 9. Demo y hosting: por qué video + capturas

- **Datos del cliente:** el valor del producto es subir *tus* ventas. Una demo pública invita a subir datos
  reales de negocio a un servidor de demo, y no es responsable pedirlo ni guardarlo.
- **Límites del free tier:** cada dataset es una tabla física, y Neon Free da 0,5 GB por proyecto. Unos
  pocos Excel grandes de visitantes lo agotan.
- **Superficie:** aunque el modelo no escribe SQL, la demo ejecutaría consultas generadas a partir de texto
  y archivos arbitrarios de internet. El diseño lo contiene, pero exponerlo sin necesidad comercial no
  aporta nada. Explicar esta decisión en una propuesta **ya demuestra criterio**.
- **Qué se entrega:** el video de 90 s (subir Excel → confirmar métricas → 4 preguntas con gráficos →
  seguimiento → "ver SQL"), 5 capturas y `docker compose up` con el dataset de ejemplo precargado para
  quien quiera probarlo localmente.
- **Reversible:** si una ficha de Workana lo pide, se puede abrir una demo **solo con el dataset de ejemplo
  precargado** (upload deshabilitado) cambiando un flag de configuración (`Demo:AllowUploads = false`).

## 10. Plan día a día

| Día | Trabajo |
|---|---|
| 1 | Repo desde el template; generador del dataset sintético; 60 preguntas con resultado esperado (SQL de referencia escrito a mano) |
| 2 | Importador CSV/Excel con inferencia de tipos y tiempo; tablas `ds_*` saneadas; tests de datos sucios |
| 3 | Capa semántica (propuesta automática + edición); `SemanticQuery` y su validación |
| 4 | Compilador a SQL parametrizado, comparativas temporales, tests snapshot y property-based; rol read-only |
| 5 | Traducción con structured outputs y esquema dinámico; aclaraciones; primer eval de exactitud |
| 6 | Narrativa verificada; seguimiento con contexto; eval adversarial y comparación Sonnet/Haiku |
| 7 | Web: import y confirmación de la capa semántica; chat con gráficos (Recharts); "ver SQL" y feedback |
| 8 | Dashboard de costo y exactitud (feedback); export CSV; pulido de los gráficos |
| 9 | `docker compose` con el dataset precargado; E2E; README (diagrama, ADRs, tabla de evals) |
| 10 | Video, capturas y `workana.md` |

## 11. GitHub metadata y ficha Workana

- **Descripción:** "Ask your sales data in plain language — .NET 10 + Claude. The LLM never writes SQL: questions become validated semantic queries compiled to parameterized SQL. Auto charts, accuracy & adversarial evals."
- **Topics:** `dotnet`, `csharp`, `text-to-sql`, `semantic-layer`, `analytics`, `business-intelligence`, `claude`, `anthropic`, `structured-output`, `microsoft-extensions-ai`, `postgresql`, `llm-security`, `llm-evaluation`, `nextjs`, `recharts`

**Borrador de la ficha Workana (ES)**
- **Título:** Pregúntale a tu Excel de ventas: respuestas y gráficos con IA, sin errores silenciosos
- **Problema:** los datos están en Excel, pero sacar respuestas exige tablas dinámicas o esperar a alguien
  que sepa.
- **Solución:** subes el archivo y preguntas en español. Recibes el número, el gráfico y la explicación de
  cómo se calculó, y si la pregunta es ambigua, el sistema te pregunta antes de inventar.
- **Qué demuestra:** exactitud medida en 60 preguntas de prueba, una arquitectura donde la IA no puede
  modificar ni filtrar tus datos (probada con 20 ataques), y un costo de ≈ $0,01 por pregunta. **Video de
  demostración.**
- **Stack:** .NET 10, PostgreSQL, Claude (salida estructurada), Next.js, Recharts.

## 12. Verificación / terminado

- Tests (incluidos los property-based), evals por encima del umbral (exactitud ≥ 0,90 y adversarial 20/20)
  y E2E en CI.
- Con `docker compose up`, el dataset de ejemplo está cargado. "¿Qué sucursal vendió más el último
  trimestre y cuánto creció contra el año anterior?" da la cifra correcta (verificada contra el SQL de
  referencia), con gráfico de barras y una narrativa sin números inventados.
- Un Excel con cabecera maliciosa se importa sin efecto y la columna queda saneada.
- Checklist común de [`../README.md`](../README.md#definición-de-terminado-común-a-todos).
